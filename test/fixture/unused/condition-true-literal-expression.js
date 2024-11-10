const A = true ? { } : { a };
const A2 = true || x || 2 || '2' || fn() ? { } : { a2 };
const A3 = x || 2 || false || true || '2' || fn() ? { } : { a3 };
const A4 = x || 2 || false || true || '2' || fn() ? { } : { a3 }, A41 = {};