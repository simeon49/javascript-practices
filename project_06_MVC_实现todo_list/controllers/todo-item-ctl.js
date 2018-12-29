class TodoItemCtl extends MVCControl {
  constructor(model) {
    super(model);
  }

  addTodo(data) {
    this.model.addTodo(data);
  }
}
