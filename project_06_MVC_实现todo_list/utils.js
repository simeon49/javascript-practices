
/**
 * 获取对象Dom
 */
function getContainer(t) {
  if (t instanceof Element) {
    return t;
  } else if (typeof t === 'string') {
    return document.getElementById(t);
  }
  return null;
}

/**
 * 解析html -> dom
 * @param {*} htmlStr
 */
function parseHtmlToDom(htmlStr) {
  const ctDom = document.createElement('div')
    , doms = [];

  ctDom.innerHTML = htmlStr;
  ctDom.childNodes.forEach(node => {
    if (node.nodeType === document.ELEMENT_NODE) {
      doms.push(node);
    }
  });
  if (doms.length === 0) {
    throw new Error('html解析错误: 模板中不包含任何 ELEMTE_NODE 元素');
  } else if (doms.length > 1) {
    throw new Error('html解析错误: 模板包含多个 ELEMTE_NODE 元素, 只能有一个');
  }
  return doms[0];
}
