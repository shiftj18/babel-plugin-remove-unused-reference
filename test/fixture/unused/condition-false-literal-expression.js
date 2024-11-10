const A = false ? { a } : {};
const A2 = false && x && 2 && '2' && fn() ? { a2 } : {};
const A3 = x && 2 && true && false ? { a3 } : {};
const A4 = x && 2 && true && '2' && false ? { a4 } : {}, A41 = x && 2 && true && '2' && false ? { a4 } : {};