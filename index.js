module.exports = function ({ types: t }) {

  function removeIfStatement (path) {
    // 如果是 if 语句，且有 else、else-if，则仅去除 if 条件分支，保留 else、else-if 条件分支
    // 如果没有 else，则移除整个 if
    if (path.node.alternate) {
      path.replaceWith(path.node.alternate);
    } else {
      path.remove();
    }
  }

  function removeElseStatement (path) {
    // 如果 if 条件是 true，保留 if 语句，移除 else 语句
    if (path.node.alternate) {
      path.replaceWith(path.node.consequent);
    }
  }

  // 移除 isX 所在的 `if (isX) {}`、`isX ? A : B` 等父节点
  function remove(path) {
    if (t.isConditionalExpression(path)) {
      path.replaceWith(path.node.alternate);
    } else if (t.isIfStatement(path)) {
      removeIfStatement(path);
    }
  }

  function removeElse(path) {
    if (t.isConditionalExpression(path)) {
      path.replaceWith(path.node.consequent);
    } else if (t.isIfStatement(path)) {
      removeElseStatement(path);
    }
  }

  // 判断无副作用的变量（非函数调用、逻辑表达式等）
  function isPureNode (node, options = {}) {
    const { recursive = false, operator = '&&' } = options;
    return t.isLiteral(node)
      || t.isIdentifier(node)
      || t.isArrayExpression(node)
      || t.isObjectExpression(node)
      || (
        recursive && 
        (t.isLogicalExpression(node) && node.operator === operator && isPureNode(node.left, options) && isPureNode(node.right, options))
      )
  }

  function isBooleanIdentifier(node, name) {
    return t.isIdentifier(node) && node.name === name;
  }

  function isFalseLogicExpression(node, tester) {
    return (
      t.isLogicalExpression(node) && node.operator === '&&' &&
      (
        (tester(node.left)) ||
        isFalseLogicExpression(node.left, tester) ||
        (tester(node.right) && isPureNode(node.left, { recursive: true, operator: '&&' }))
      )
    );
  }

  function isConstFalseLogicExpression(node, name) {
    return isFalseLogicExpression(node, (test) => isBooleanIdentifier(test, name));
  }

  function isFalseBooleanLiteral(node) {
    return t.isBooleanLiteral(node) && node.value === false;
  }

  // 判断 `false && ...` and `x && false && ...`其中 x 是无副作用的（基本类型）
  function isFalseLiteralLogicExpression (node) {
    return isFalseLogicExpression(node, isFalseBooleanLiteral);
  }

  function isTrueLogicExpression(node, tester) {
    return (
      t.isLogicalExpression(node) && node.operator === '||' &&
      (
        (tester(node.left)) ||
        isTrueLogicExpression(node.left, tester) ||
        (tester(node.right) && isPureNode(node.left, { recursive: true, operator: '||' }))
      )
    );
  }

  function isConstTrueLogicExpression(node, name) {
    return isTrueLogicExpression(node, (test) => isBooleanIdentifier(test, name));
  }

  function isTrueBooleanLiteral(node) {
    return t.isBooleanLiteral(node) && node.value === true;
  }

  // 判断 `... || true || ...`，左侧不能包含副作用的
  function isTrueLiteralLogicExpression (node) {
    return isTrueLogicExpression(node, isTrueBooleanLiteral);
  }

  return {
    visitor: {
      VariableDeclarator(path) {
        if (
          t.isBooleanLiteral(path.node.init) &&
          t.isIdentifier(path.node.id)
        ) {
          // 找到 `const isX = false` 这种恒为 false 的变量 isX，剔除 isX 相关的死逻辑
          // 找到 `const isX = true` 这种恒为 true 的变量 isX，剔除 isX 相反的死逻辑
          // 主要是：条件表达式、和 if-else 语句
          if (
            t.isVariableDeclaration(path.parent) &&
            path.parent.kind === "const" &&
            (
              path.node.init.value === false ||
              path.node.init.value === true
            )
          ) {
            const name = path.node.id.name;
            const value = path.node.init.value;
            const bindings = path.scope.bindings[name];
            if (bindings.referenced && bindings.referencePaths.length) {
              bindings.referencePaths.forEach((refPath) => {
                // 向上找到第一个相关父节点
                // 条件表达式 `const y = isX ? A : B`
                // 或 条件语句 `if (isX) {} else {}`
                const rootPath = refPath.findParent(path => t.isConditionalExpression(path) || t.isIfStatement(path));
                if (rootPath) {
                  if (
                    value === false &&
                    (
                      // `isX ? A : B` -> `B`
                      isBooleanIdentifier(rootPath.node.test, name) ||
                      // `... && isX && ... ? A : B` -> `B` 这种
                      // 左侧只支持无副作用的，目前有副作用的不动，比如函数
                      isConstFalseLogicExpression(rootPath.node.test, name)
                    )
                  ) {
                    remove(rootPath);
                  } else if (
                    value === true &&
                    (
                      isBooleanIdentifier(rootPath.node.test, name) ||
                      isConstTrueLogicExpression(rootPath.node.test, name)
                    )
                  ) {
                    removeElse(rootPath);
                  }
                }
              });
            }
          }
        }

        // false 字面量处理，条件表达式 `const x = false ? A : B` => `const x = B`
        if (t.isConditionalExpression(path.node.init)) {
          const condition = path.node.init.test;
          const alternate = path.node.init.alternate;
          const consequent = path.node.init.consequent;
          if (isFalseBooleanLiteral(condition) || isFalseLiteralLogicExpression(condition)) {
            path.replaceWith(t.variableDeclarator(path.node.id, alternate));
          } else if (isTrueBooleanLiteral(condition) || isTrueLiteralLogicExpression(condition)) {
            path.replaceWith(t.variableDeclarator(path.node.id, consequent));
          }
        }
      },

      IfStatement(path) {
        // 处理 if 语句
        // `if (false) A else B` -> `B`
        // `if (true) A else B` -> `A`
        const test = path.node.test;
        if (isFalseBooleanLiteral(test) || isFalseLiteralLogicExpression(test)) {
          removeIfStatement(path);
        } else if (isTrueBooleanLiteral(test) || isTrueLiteralLogicExpression(test)) {
          if (path.node.alternate) {
            path.replaceWith(path.node.consequent);
          }
        }
      },
    },
  };
};
