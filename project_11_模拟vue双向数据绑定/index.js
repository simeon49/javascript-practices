new SelfVue({
  el: '#app',
  data: {
    title: '模拟vue 双向绑定',
    name: 'Yey!!!',
  },
  methods: {
    changeTitle: function () {
      this.title = '新标题';
    }
  },
  mounted: function () {
    console.log('已加载完成!');
  }
});
