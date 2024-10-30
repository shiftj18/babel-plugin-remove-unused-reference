const { test } = require('./core');

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
