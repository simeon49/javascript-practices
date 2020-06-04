
class Dep {
  constructor() {
    this.subs = [];
  }

  static setTarget(target) {
    Dep._target = target;
  }

  static getTarget() {
    return Dep._target;
  }

  addSub(sub) {
    this.subs.push(sub);
  }

  notify() {
    this.subs.forEach(sub => {
      sub.update();
    })
  }
}
Dep._target = null;

class Observer {
  constructor(data) {
    this.data = data;
    this.walk(this.data);
  }

  walk(data) {
    Object.keys(data).forEach(key => {
      this.defineReactive(data, key, data[key]);
    });
  }

  defineReactive(data, key, val) {
    const dep = new Dep();
    const childObj = observe(val);
    Object.defineProperty(data, key, {
      enumerable: true,
      configurable: true,
      get: () => {
        const target = Dep.getTarget();
        if (target) {
          dep.addSub(target);
        }
        return val;
      },
      set: newVal => {
        if (newVal === val) {
          return;
        }
        console.log(`==> ${val.toString()}`);
        val = newVal;
        dep.notify();
      }
    });
  }

}

function observe(data) {
  if (!data || typeof data !== 'object') {
    return;
  }
  return new Observer(data);
}

class Watcher {
  /**
   *
   * @param {*} vm thisVue 实例
   * @param {*} exp 表达式
   * @param {*} cb 回调
   */
  constructor(vm, exp, cb) {
    this.vm = vm;
    this.exp = exp;
    this.cb = cb;
    this.value = this.get(); // 将自己添加到订阅器的操作
  }

  run() {
    const val = this.vm.data[this.exp];
    const oldVal = this.val;
    if (val !== oldVal) {
      this.value = val;
      this.cb.call(this.vm, val, oldVal);
    }
  }

  update() {
    this.run();
  }

  get() {
    Dep.setTarget(this);
    const val = this.vm.data[this.exp];
    Dep.setTarget(null);
    return val;
  }
}


/**
 * 编译器
 */
class Compiler {
  constructor(el, vm) {
    this.el = document.querySelector(el);
    this.vm = vm;

    if (!this.el) {
      console.error('Dom 元素不存在');
      return;
    }
    this.fragment = this.nodeToFragment(this.el);
    this.compileElement(this.fragment);
    this.el.appendChild(this.fragment);
  }

  nodeToFragment(el) {
    const fragment = document.createDocumentFragment();
    let child = el.firstChild;
    while (child) {
      console.log('append child')
      fragment.append(child);
      child = el.firstChild;
    }
    return fragment;
  }

  compileElement(el) {
    const childNodes = el.childNodes;
    [].slice.call(childNodes).forEach((node) => {
      const reg = /\{\{(.*)\}\}/;

      if (this.isElementNode(node)) {
        this.compile(node);
      } else if (this.isTextNode(node) && reg.test(node.textContent)) {
        this.compileText(node, reg.exec(node.textContent)[1]);
      }

      // 遍历子节点
      if (node.childNodes && node.childNodes.length) {
        this.compileElement(node);
      }
    });
  }

  /**
   * 编译节点
   * @param {*} node
   */
  compile(node) {
    const nodeAttrs = node.attributes;
    Array.prototype.forEach.call(nodeAttrs, (attr) => {
      const attrName = attr.name;
      if (this.isDirective(attrName)) {
        const exp = attr.value;
        const dir = attrName.substring(2);
        if (this.isEventDirective(dir)) { // v-on ... 事件指令
          this.compileEvent(node, exp, dir);
        } else {  // v-model 指令
          this.compileModel(node, exp,dir);
        }
        node.removeAttribute(attrName);
      }
    });
  }

  /**
   * 编译文本节点
   * @param {*} node
   * @param {*} exp 表达式
   */
  compileText(node, exp) {
    const initText = this.vm[exp];
    this.updateText(node, initText);
    new Watcher(this.vm, exp, val => {
      this.updateText(node, val);
    });
  }

  /**
   * 事件指令: v-on:click="changeTitle"
   * @param {*} node 节点
   * @param {*} exp 表达式 changeTitle
   * @param {*} dir 指令  "on:click"
   */
  compileEvent(node, exp, dir) {
    const eventType = dir.split(':')[1];
    const cb = this.vm.methods[exp];
    if (eventType && cb) {
      node.addEventListener(eventType, cb.bind(this.vm), false);
    }
  }

  /**
   * model 指令:  v-model="name"
   * @param {*} node
   * @param {*} exp name
   * @param {*} dir model
   */
  compileModel(node, exp, dir) {
    var val = this.vm[exp];
    this.modelUpdater(node, val);
    new Watcher(this.vm, exp, val => {
      this.modelUpdater(node, val);
    })

    node.addEventListener('input', e => {
      const newVal = e.target.value;
      if (newVal === val) {
        return;
      }
      this.vm[exp] = newVal;
      val = newVal;
    });
  }

  updateText(node, value) {
    node.textContent = value;
  }

  modelUpdater(node, value) {
    node.value = value;
  }

  isDirective(attr) {
    return attr.indexOf('v-') == 0;
  }

  isEventDirective(dir) {
    return dir.indexOf('on:') === 0;
  }

  isElementNode(node) {
    return node.nodeType == 1;
  }

  isTextNode(node) {
    return node.nodeType == 3;
  }
}


export class SelfVue {
  constructor(options) {
    this.el = options.el;
    this.data = options.data ? options.data : {};
    this.methods = options.methods ? options.methods : {};
    this.mounted = options.mounted;

    Object.keys(this.data).forEach(key => {
      this.proxyKey(key);
    });

    observe(this.data);
    this.compile = new Compiler(this.el, this);
    if (this.mounted instanceof Function) {
      this.mounted();
    }
  }

  proxyKey(key) {
    Object.defineProperty(this, key, {
      enumerable: false,
      configurable: true,
      get: () => {
        // console.log(`proxy: ${key}`)
        return this.data[key];
      },
      set: (newVal) => {
        this.data[key] = newVal;
      }
    })
  }
}
