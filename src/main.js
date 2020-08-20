import Vue from "vue";
import VueRouter from "vue-router";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import App from "./App.vue";
import formatNumber from "@/utils/directives/formatNumber";
// import "@/utils/plugin/JsBarcode.all.js"

Vue.config.productionTip = false;
Vue.use(formatNumber);
Vue.use(ElementUI);
Vue.use(VueRouter);

new Vue({
    render: (h) => h(App),
}).$mount("#app");
