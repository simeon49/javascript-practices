class TodoListView extends MVCView {
  constructor(anchor, ctl, model) {
    super(anchor, ctl, model);

    this.model.subscibe(this);
  }

  template() {
    const tpl = `
      <div class="todo-list">
        <p>列表:</p>
        <ul>
        {% for item in items %}
          {% if item.done %}
            <li class="todo done" data-id="{{ item.id }}">{{ item.context }}</li>
          {% else %}
            <li class="todo" data-id="{{ item.id }}">{{ item.context }}</li>
          {% endif %}
        {% endfor %}
        </ul>
      </div>
    `;
    return tpl;
  }

  render() {
    const viewHtml = nunjucks.renderString(this.template(), {
        items: this.model.todoList
      })
      , viewDom = parseHtmlToDom(viewHtml);

    viewDom.addEventListener('click', e => {
      const todoDom = e.target;
      if (todoDom.className.toLowerCase() === 'todo') {
        this.ctl.markTodoDone(todoDom.dataset.id)
      }
    });
    this.renderView(viewDom);
  }

  onUpdate() {
    this.render();
  }
}
