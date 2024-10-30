const { test } = require('./core');

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
