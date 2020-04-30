import Vue from 'vue'
import App from './App.vue'
import pay from 'pay'

Vue.config.productionTip = false
Vue.use(pay)

new Vue({
  render: h => h(App)
}).$mount('#app')
