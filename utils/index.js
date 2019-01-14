/**
 * 判断 dic 是否为空
 * @param {*} obj
 */
function isEmpty(obj) {
  for (let k in obj) {
    if (obj.hasOwnProperty(k)) {
      return false;
    }
  }
  return true;
}
