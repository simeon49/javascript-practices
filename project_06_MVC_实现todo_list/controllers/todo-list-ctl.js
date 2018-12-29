class TodoListCtl extends MVCControl {
  constructor(model) {
    super(model);
  }

  markTodoDone(id) {
    this.model.markTodoDone(id);
  }
}
