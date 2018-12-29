class TodoItemView extends MVCView {
  constructor(anchor, ctl, model) {
    super(anchor, ctl, model);
  }

  template() {
    const tpl = `
      <div class="todo-item">
        <input class="content-input" type="text" placeholder="请输入内容">
        <button class="commit-btn">添加</button>
      </div>
    `;
    return tpl;
  }

  render() {
    const viewHtml = nunjucks.renderString(this.template(), {})
      , viewDom = parseHtmlToDom(viewHtml)
      , inputDom = viewDom.getElementsByClassName('content-input')[0]
      , btnDom = viewDom.getElementsByClassName('commit-btn')[0];

    btnDom.onclick = () => {
      const context = inputDom.value.trim();
      if (!context) {
        alert('内容不能为空');
        return;
      }
      this.ctl.addTodo({
        context: context,
        done: false,
      });
    }
    this.renderView(viewDom);
  }
}
