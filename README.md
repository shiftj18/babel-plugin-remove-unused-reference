# babel-plugin-remove-unused-reference

## Description

Babel plugin, remove unused reference.


#### Supports:
- when const isX = false; => remove `const x = isX ? A : B;` -> `const x = B;`
- when const isX = false; => remove `if (isX) { B } else { B }` -> `{ B}`
- when const isX = false; support `(isX && isY && ...)`, `(isA && isX)` and isA is normal data type.
- support `const x = false ? A : B` ->  `const x = B` and `if (false) A else B` -> `B`

#### Examples

Input:
```js
`
import { A, B } from 'U';

const isX = false;
const isX1 = false;

const U = isX ? { A, B } : {};

let x;
if (isX) {
  x = 1;
}

if (isX) {
  x = 11;
} else {
  x = 12;
}

if (isX && 2) {
  consloe.log('2');
}

if (isX) {
  console.log('3');
} else if (isWechat) {
  console.log('31');
} else if (isMiniApp) {
  console.log('32');
} else {
  console.log('33');
}

if (4 && isX) {
  consloe.log('4');
}

if (41 && isX && isXXX) {
  consloe.log('41');
}

if (5 && 55 && isX) {
  consloe.log('5');
}

if (getA() && isX) {
  console.log('6');
}

let b;
if (isX1) {
  b = 1;
} else {
  b = 11;
}

if (isXX) {
  console.log('4444');
}

const isX2 = true;
if (isY) {
  console.log('1');
} else {
  console.log('11');
}
function a() {
  const isX2 = false;
  if (isX2) {
    console.log('2');
  } else {
    console.log('21');
  }
  
  let isX3 = false;
  isX3 = true;
  if (isX3) {
    console.log('1');
  } else {
    console.log('11');
  }
}

`
```

Output:
```bash
import { A, B } from 'U';
const isX = false;
const isX1 = false;
const U = {};
let x;
{
  x = 12;
}
if (isWechat) {
  console.log('31');
} else if (isMiniApp) {
  console.log('32');
} else {
  console.log('33');
}
if (41 && isX && isXXX) {
  consloe.log('41');
}
if (5 && 55 && isX) {
  consloe.log('5');
}
if (getA() && isX) {
  console.log('6');
}
let b;
{
  b = 11;
}
if (isXX) {
  console.log('4444');
}
const isX2 = true;
if (isY) {
  console.log('1');
} else {
  console.log('11');
}
function a() {
  const isX2 = false;
  {
    console.log('21');
  }
  let isX3 = false;
  isX3 = true;
  if (isX3) {
    console.log('1');
  } else {
    console.log('11');
  }
}
```

## Usage
```bash
npm i babel-plugin-remove-unused-reference
// pnpm add babel-plugin-remove-unused-reference
```