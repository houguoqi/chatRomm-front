import Vue from "vue";
import App from "./App.vue";
import Element from "element-ui";
import router from "./router/index";
Vue.use(Element);
Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
  router,
}).$mount("#app");
