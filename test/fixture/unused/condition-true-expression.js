const isX = true;
const A = isX ? { } : { a };
const A2 = isX || x || 2 || false || fn() ? { } : { a2 };
const A3 = x || isX ? { } : { a3 };
const A4 = x || 2 || isX || false || '2' ? { } : { a4 };
const A5 = x || 2 || isX || false || '2' ? { } : { a4 }, A51 = {};