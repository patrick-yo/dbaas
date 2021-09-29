import Vue from "vue";
import './plugins/axios';
import axios from "axios";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
// import 'element-ui/lib/theme-chalk/index.css';
import "../plugins/theme/index.css";
// import ECharts from "vue-echarts";
// import { use } from "echarts/core"

// 手动引入ECharts各模块来减小打包体积

// import {
//   CanvasRenderer
// } from 'echarts/renderers'
// import {
//   BarChart
// } from 'echarts/charts'
// import {
//   GridComponent,
//   TooltipComponent
// } from 'echarts/components'

// use([
//   CanvasRenderer,
//   BarChart,
//   GridComponent,
//   TooltipComponent
// ]);

// // 全局注册组件（也可以使用局部注册）
// Vue.component('v-chart', ECharts)

// 整个引入
import "echarts";

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.prototype.$http = axios;
axios.defaults.withCredentials = true
axios.defaults.baseURL = '/api'  // axios默认请求设置，配置跨域
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");

