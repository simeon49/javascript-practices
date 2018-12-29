class TodoModel extends MVCModel {
  constructor() {
    super();
    this.todoList = [];
    this.id = 1;
  }

  /**
   * 添加todo
   * @param {*} data
   */
  addTodo(data) {
    this.todoList.unshift(Object.assign({ id: this.id }, data));
    this.id += 1;
    this.update(this.todoList);
  }

  /**
   * 标记todo为已完成
   * @param {*} id
   */
  markTodoDone(id) {
    id = parseInt(id);
    this.todoList.forEach(todo => {
      if (todo.id === id) {
        if (!todo.done) {
          todo.done = true;
          this.update(this.todoList);
        }
      }
    });
  }
}
