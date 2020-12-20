import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import helpers from "./assets/helpers"; // Use global helper functions
import "./static/vuetify-additions.css";

const jsHelpers = {
  install() {
    Vue.helpers = helpers;
    Vue.prototype.$helpers = helpers;
  },
};
Vue.use(jsHelpers);

Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
