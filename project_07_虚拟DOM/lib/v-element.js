/**
 * Virtual Elemnet
 */
class VElement {
  constructor(tagName, props, children) {
    this.tagName = tagName;
    if (props instanceof Array) {
      children = props;
      props = {};
    }
    this.props = props || {};
    this.children = children || [];
    this.key = this.props.key;

    let count = 0;
    this.children.forEach(child => {
      if (child instanceof VElement) {
        count += child.childrenCount;
      } else {
        child = '' + child;
      }
      count ++;
    });
    this.childrenCount = count;
    this.dom = null
  }

  render() {
    const dom = document.createElement(this.tagName);
    for (const k in this.props) {
      dom.setAttribute(k, this.props[k]);
    }

    this.children.forEach(child => {
      const node = child instanceof VElement ? child.render() : document.createTextNode(child);
      dom.appendChild(node);
    });
    this.dom = dom;
    return this.dom;
  }
}
