module.exports = function ({ types: t }) {
  return {
    visitor: {
      VariableDeclarator(path) {
        if (
          t.isBooleanLiteral(path.node.init) &&
          t.isIdentifier(path.node.id)
        ) {
          // 找到 `const isX = false` 这种恒为 false 的变量 isX
          if (
            !path.node.init.value &&
            t.isVariableDeclaration(path.parent) &&
            path.parent.kind === "const"
          ) {
            const name = path.node.id.name;
            // 通过 scope 实现，bindinds 记录了所有 isX 的引用
            const bindings = path.scope.bindings[name];
            if (bindings.referenced && bindings.referencePaths.length) {
              bindings.referencePaths.forEach((refPath) => {
                remove(refPath);

                // 级联判断的逻辑表达式支持，如 isX 恒为 fasle 时的 `isX && isY && isZ ? A : B` 语句
                const parentPath = refPath.parentPath;
                const parentNode = refPath.parent;
                if (
                  t.isLogicalExpression(parentNode) &&
                  parentNode.operator === "&&"
                ) {
                  if (
                    // isX 是第一个时，无论后面还级联了多少个判断条件，整条逻辑表达式都可以删除，无风险
                    (t.isIdentifier(parentNode.left) && parentNode.left.name === name) ||
                    // isX 不在第一个时，前面的判断条件可能是有副作用的（比如函数调用内有副作用，比如也是逻辑表达式），一般不能移除
                    // 这里稍做优化，对 `(isA && isX)` 这种 isX 前面仅存在一个判断条件且其是普通数据类型时，认为是无副作用的，删之
                    (t.isIdentifier(parentNode.right) && parentNode.right.name === name && isNonSlideEffectLogicExpression(parentNode.left))
                  ) {
                    remove(parentPath);
                  }
                }
              });
            }
          }
        }

        // 处理三元表达式  `const x = false ? A : B` => `const x = B`
        if (t.isConditionalExpression(path.node.init)) {
          const condition = path.node.init.test;
          const alternate = path.node.init.alternate;
          // 如果条件是 false
          if (isFalseBooleanLiteral(condition) || isFalseLogicExpression(condition)) {
            path.replaceWith(
              t.variableDeclarator(path.node.id, alternate)
            );
          }
        }
      },
      IfStatement(path) {
        // 处理 if 语句  `if (false) A else B` -> `B`
        const test = path.node.test;
        if (isFalseBooleanLiteral(test) || isFalseLogicExpression(test)) {
          removeIfStatement(path);
        }
      },
    },
  };

  // 移除 isX 所在的 `if (isX) {}`、`isX ? A : B` 等父节点
  function remove(innerPath) {
    const parentPath = innerPath.parentPath;
    const parentNode = innerPath.parent;

    if (t.isConditionalExpression(parentNode)) {
      parentPath.replaceWith(parentNode.alternate);
    }

    if (t.isIfStatement(parentNode)) {
      // 如果是 if 语句，且有 else、else-if，则仅去除 if 条件分支，保留 else、else-if 条件分支
      // 如果没有 else，则移除整个 if
      if (parentNode.alternate) {
        parentPath.replaceWith(parentNode.alternate);
      } else {
        parentPath.remove();
      }
    }
  }

  function removeIfStatement (path) {
    // 如果 if 条件是 false，直接移除整个 if 语句保留 else 语句
    if (path.alternate) {
      path.replaceWith(path.alternate);
    } else {
      path.remove();
    }
  }

  function isFalseBooleanLiteral(test) {
    return t.isBooleanLiteral(test) && !test.value;
  }

  function isNonSlideEffectLogicExpression (test) {
    return t.isIdentifier(test) || t.isBooleanLiteral(test) || t.isStringLiteral(test) || t.isNumericLiteral(test);
  }

  // 判断 `false && ...` and `x && false`
  function isFalseLogicExpression (test) {
    return t.isLogicalExpression(test) && test.operator === "&&" &&
      (
        (t.isBooleanLiteral(test.left) && !test.left.value) || 
        (t.isBooleanLiteral(test.right) && !test.right.value && isNonSlideEffectLogicExpression(test.left))
      );
  }
};
