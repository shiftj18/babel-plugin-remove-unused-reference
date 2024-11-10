const { test } = require('./core');

test(`
// 测试条件表达式中含有 const isX = true 时，if 语句中 isX 相应逻辑的剔除
const isWeb = false;
const isMiniApp = true;

// 专门for降级场景
if (isTaobao && isUniApp && isShowUniAppTab && isdowngrade) {
  type = 'tab';
} else if (isTaobao && isUniApp && isShowUniAppTab) {
  // 在手淘uniapp 且 是tab页
  type = 'holder';
} else if (isTaobao && isWeb && !(isMiniApp || isUniApp || isTaobaoLiteApp) && isShowUniAppTab) {
  // 在手淘内 且纯H5环境 且 不在小程序和uniapp环境下 且 不在pha环境下 且 是tab页
  type = 'tab';
}
`);

