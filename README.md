# babel-plugin-remove-unused-reference

## Description

Babel plugin, remove unused reference.


#### Supports:

- when `const isX = false;`, change `const x = isX ? A : B;` -> `const x = B;`
- when `const isX = false;`, change `if (isX) { A } else { B }` -> `{ B }`
- when `false`, support `(isX && ...)`, `(... && isX)` (left ...  is normal data type without slide effetcs)
- support `const x = false ? A : B` ->  `const x = B` and `if (false) A else B` -> `B`


- when `const isX = true;`, change `const x = isX ? A : B;` -> `const x = A;`
- when `const isX = true;`, change `if (isX) { A } else { B }` -> `{ A }`
- when `true`, support `(isX || ...)`, `(... || isX)` (left ...  is normal data type without slide effetcs)
- support `const x = true ? A : B` ->  `const x = A` and `if (true) A else B` -> `A`

#### Examples

Input:
```js
test(`
  // 测试变量 const isX = false 时，条件表达式中 isX 相应逻辑的剔除
  const isX = false;

  const A = isX ? { a } : {};
  const A2 = isX && x && 2 && true && fn() ? { a2 } : {};
  const A3 = x && isX ? { a3 } : {};
  const A4 = x && 2 && true && '2' && isX ? { a4 } : {};

  const A0 = fn() && isX ? {} : { a0 };
`);


test(`
  // 测试条件表达式中含有 false 字面量时，条件表达式中相应逻辑的剔除
  const A = false ? { a } : {};
  const A2 = false && x && 2 && '2' && fn() ? { a2 } : {};
  const A3 = x && 2 && true && false ? { a3 } : {};

  const A0 = fn() && false ? { a0 } : {};
`);


test(`
  // 测试变量 const isX = false 时，if 语句中 isX 相应逻辑的剔除
  const isX = false;

  if (isX) { a } else {}
  if (isX && x && 2 && true && fn()) { a2 } else {}
  if (x && 2 && true && '2' && isX) { a3 } else {}

  if (fn() && isX) { a0 } else {}
`);


test(`
  // 测试条件表达式中含有 false 字面量时，if 语句中相应逻辑的剔除

  if (false) { a } else {}
  if (false && x && 2 && true && fn()) { a2 } else {}
  if (x && 2 && true && '2' && false) { a3 } else {}

  if (fn() && false) { a0 } else {}
`);


test(`
  // 测试条件表达式中含有 const isX = true 时，条件表达式中 isX 相应逻辑的剔除
  const isX = true;

  const A = isX ? { } : { a };
  const A2 = isX || x || 2 || false || fn() ? { } : { a2 };
  const A3 = x || isX ? { } : { a3 };
  const A4 = x || 2 || isX || false || '2' ? { } : { a4 };

  const A0 = fn() || isX ? { } : { a0 };
`);


test(`
  // 测试条件表达式中含有 true 字面量时，条件表达式中相应逻辑的剔除
  
  const A = true ? { } : { a };
  const A2 = true || x || 2 || '2' || fn() ? { } : { a2 };
  const A3 = x || 2 || false || true || '2' || fn() ? { } : { a3 };

  const A0 = fn() || true ? { } : { a0 };
`);


test(`
  // 测试条件表达式中含有 const isX = true 时，if 语句中 isX 相应逻辑的剔除
  const isX = true;

  if (isX) { } else { a }
  if (isX || x || 2 || false || fn()) { } else { a2 }
  if (x || 2 || false || '2' || isX) { } else { a3 }
  if (false) { a4 } else if (true) { } else if (isWeb) { a41 } else { a42 }

  if (fn() || isX) { } else { a0 }
`);


test(`
  // 测试条件表达式中含有 true 字面量时，if 语句中相应逻辑的剔除
  
  if (true) { } else { a }
  if (true || x || 2 || false || fn()) { } else { a2 }
  if (x || 2 || false || '2' || true) { } else { a3 }
  if (false) { a4 } else if (true) { } else { a41 }
  if (false) { a5 } else if (x || 2 || true || false || '2') { } else { a51 }

  if (fn() || true) { } else { a0 }
`);
```

output:
```bash
> npm run example
> node ./examples/index.js

// 测试变量 const isX = false 时，条件表达式中 isX 相应逻辑的剔除
const isX = false;
const A = {};
const A2 = {};
const A3 = {};
const A4 = {};
const A0 = fn() && isX ? {} : {
  a0
};
---------------------------------------

// 测试条件表达式中含有 false 字面量时，条件表达式中相应逻辑的剔除
const A = {};
const A2 = {};
const A3 = {};
const A0 = fn() && false ? {
  a0
} : {};
---------------------------------------

// 测试变量 const isX = false 时，if 语句中 isX 相应逻辑的剔除
const isX = false;
{}
{}
{}
if (fn() && isX) {
  a0;
} else {}
---------------------------------------

// 测试条件表达式中含有 false 字面量时，if 语句中相应逻辑的剔除

{}
{}
{}
if (fn() && false) {
  a0;
} else {}
---------------------------------------

// 测试条件表达式中含有 const isX = true 时，if 语句中 isX 相应逻辑的剔除
const isX = true;
{}
{}
{}
{}
if (fn() || isX) {} else {
  a0;
}
---------------------------------------

// 测试条件表达式中含有 true 字面量时，if 语句中相应逻辑的剔除

{}
{}
{}
{}
{}
if (fn() || true) {} else {
  a0;
}
---------------------------------------

// 测试条件表达式中含有 const isX = true 时，条件表达式中 isX 相应逻辑的剔除
const isX = true;
const A = {};
const A2 = {};
const A3 = {};
const A4 = {};
const A0 = fn() || isX ? {} : {
  a0
};
---------------------------------------

// 测试条件表达式中含有 true 字面量时，条件表达式中相应逻辑的剔除

const A = {};
const A2 = {};
const A3 = {};
const A0 = fn() || true ? {} : {
  a0
};
---------------------------------------
```

## Usage
```bash
npm i babel-plugin-remove-unused-reference
// pnpm add babel-plugin-remove-unused-reference
```