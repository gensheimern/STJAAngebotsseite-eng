import Vue from 'vue'
import App from './App.vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import VueRouter from 'vue-router'

Vue.use(Vuetify)
Vue.use(VueRouter);

export default new Vuetify({  })


const router = new VueRouter({})

new Vue({
  el: '#wp-vue-app',
  router: router,
  render: h => h(App)
})
