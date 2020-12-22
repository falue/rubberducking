import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  }
]

const router = new VueRouter({
  mode: 'hash',  // history for clean url but hard refresh equals to 404; hash adds a # in the url
  base: process.env.BASE_URL,
  routes
})

export default router
