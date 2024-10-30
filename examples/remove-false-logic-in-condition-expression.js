const { test } = require('./core');

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
