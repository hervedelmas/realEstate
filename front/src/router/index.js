import Vue from 'vue'
import Router from 'vue-router'
import realestate from '../views/realestate.vue'

Vue.use(Router)

export default new Router({
  base: process.env.BASE_URL,
  routes: [{
      path: '/',
      name: 'realestate',
      component: realestate
    }
  ]
})