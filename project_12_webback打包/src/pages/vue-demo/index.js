import '../../style.scss';

Vue.component("todo-item", {
  inheritAttrs: false,
  data: function () {
    return {
      checked: false,
    };
  },
  methods: {
    closeTodo: function () {
      this.$emit("close-todo");
    },
  },
  props: ["todo"],
  template: '\
    <li styel.color="red">\
      <input type="checkbox" v-model="checked" v-bind:id="todo.id" v-bind="$attrs">\
      <label v-bind:for="todo.id">{{todo.text}}</label>\
      <button v-on:click="closeTodo">关闭</button>\
    </li>',
});

Vue.component("submit-button", {
  inheritAttrs: false,
  data: function () {
    return {
      tip: '????'
    }
  },
  computed: {
    buttonListeners: function () {
      var vm = this;
      return Object.assign({}, this.$listeners, {
        // 其它事件
      });
    },
  },
  template:
    '\
    <div>\
      <button type="submit" v-on="buttonListeners">\
        <slot v-bind:tip="tip"></slot>\
      </button>\
    </div>\
  ',
});

var obj = {
  loginType: "username",
  firstName: "Qi",
  lastName: "Simeon",
  message: "Hello ",
  todos: [
    { id: 1, text: "Study hard." },
    { id: 2, text: "Get a new Job." },
  ],
  question: "",
  answer: "I cannot give you an answer until you ask a question!",
};

var myApp = new Vue({
  el: "#app",
  data: obj,
  created: function () {
    console.log("===== Created =====");
    this.debouncedGetAnswer = _.debounce(this.getAnswer, 500);
  },
  methods: {
    getAnswer: function () {
      if (this.question.indexOf("?") === -1) {
        this.answer = 'Questions usually contain a question mark. "?"';
        return;
      }
      this.answer = "Thinking....";
      const vm = this;
      fetch("https://yesno.wtf/api")
        .then(function (response) {
          console.log(response);
          response.json().then((data) => {
            console.log(data);
            vm.answer = data.answer;
          });
        })
        .catch(function (error) {
          console.error(error);
        });
    },
    toggleLoginType: function () {
      console.log("toggle");
      this.loginType = this.loginType === "username" ? "email" : "username";
    },
    closeTodo: function(targetTodo) {
      let index = 0
      for (let todo of this.todos) {
        if (todo.id === targetTodo.id) {
          this.todos.splice(index, 1);
          break;
        }
        index ++;
      }
    }
  },
  watch: {
    question: function (oldValue, newValue) {
      this.answer = "Waiting for you to stop typing...";
      this.debouncedGetAnswer();
    },
  },
  computed: {
    fullName: function () {
      return this.firstName + " " + this.lastName;
    },
  },
});


myApp.$watch('message', (newValue, oldValue) => {
  console.log(`message: ${newValue} -> ${oldValue}`);
});


window.obj = obj;
window.myApp = myApp;
