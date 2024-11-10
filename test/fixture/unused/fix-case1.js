const isWeb = false;
const isMiniApp = true;
if (isTaobao && isUniApp && isShowUniAppTab && isdowngrade) {
  type = 'tab';
} else if (isTaobao && isUniApp && isShowUniAppTab) {
  type = 'holder';
} else if (isTaobao && isWeb && !(isMiniApp || isUniApp || isTaobaoLiteApp) && isShowUniAppTab) {
  type = 'tab';
}