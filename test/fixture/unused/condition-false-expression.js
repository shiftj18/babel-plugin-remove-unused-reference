const isX = false;
const A = isX ? { a } : {};
const A2 = isX && x && 2 && true && fn() ? { a2 } : {};
const A3 = x && isX ? { a3 } : {};
const A4 = x && 2 && true && '2' && isX ? { a4 } : {};
const A5 = x && 2 && true && '2' && isX ? { a4 } : {}, A51 = x && 2 && true && '2' && isX ? { a5 } : {};