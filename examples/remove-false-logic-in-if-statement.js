const { test } = require('./core');

test(`
  // 测试变量 const isX = false 时，if 语句中 isX 相应逻辑的剔除
  const isX = false;

  if (isX) { a } else {}
  if (isX && x && 2 && true && fn()) { a2 } else {}
  if (x && 2 && true && '2' && isX) { a3 } else {}
  if (x && 2 && true) { } else if ('2' && isX) {} else { }

  if (fn() && isX) { a0 } else {}
`);

test(`
  // 测试条件表达式中含有 false 字面量时，if 语句中相应逻辑的剔除

  if (false) { a } else {}
  if (false && x && 2 && true && fn()) { a2 } else {}
  if (x && 2 && true && '2' && false) { a3 } else {}
  if (x && 2 && true) {} else if ('2' && false) { a3 } else {}

  if (fn() && false) { a0 } else {}
`);
