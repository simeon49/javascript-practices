/**
 * Model 层
 */
class MVCModel extends EventEmitter {
  constructor() {
    super();
  }

  /**
   * 更新数据
   * @param {*} data
   */
  update(data) {
    this.emit('update', data);
  }

  /**
   * 订阅
   * @param {*} view
   */
  subscibe(view) {
    this.on('update', view.onUpdate.bind(view));
  }

  /**
   * 取消订阅
   * @param {*} view
   */
  unsubscibe(view) {
    this.removeListener('update', view.onUpdate.bind(view));
  }
}


/**
 * View层
 */
class MVCView {
  constructor(anchor, ctl, model) {
    this.anchorDom = getContainer(anchor);
    this.ctl = ctl;
    this.model = model;

    // 获取视图锚点
    if (!this.anchorDom) {
      throw new Error(`错误的视图锚点 "${anchor}"!`);
    }

    // 初始化模板引擎
    nunjucks.configure({
      autoescape: true
    });
  }

  /**
   * 模板
   */
  template() {
    throw new Error('请实现view的template方法!');
  }

  /**
   * 渲染视图
   */
  render() {
    throw new Error('请实现view的render方法!');
  }

  /**
   * 当模型(model)发送改变时,该方法将被调用
   */
  onUpdate() {
    throw new Error('请实现view的onUpdate方法!');
  }

  /**
   * 在锚点上渲染视图对象(dom/html)
   * @param {*} v
   */
  renderView(v) {
    this.anchorDom.innerHTML = null;
    if (v instanceof Element) {
      this.anchorDom.appendChild(v);
    } else if (typeof t === 'string') {
      this.anchorDom.appendChild(parseHtmlToDom(v));
    }
  }
}

/**
 * Control层
 */
class MVCControl {
  constructor(model) {
    this.model = model;
  }
}
