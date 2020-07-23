import Vue from "vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import App from "./App.vue";
import formatNumber from "@/utils/directives/formatNumber";

Vue.config.productionTip = false;
Vue.use(formatNumber);
Vue.use(ElementUI);

new Vue({
  render: (h) => h(App),
}).$mount("#app");
