import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import layout from '@/shared/layout.vue'
import login from '@/shared/login.vue'
import posts from '@/views/post/list.vue'
import postsEdit from '@/views/post/edit.vue'
import categories from '@/views/category/list.vue'
import ads from '@/views/ad/list.vue'
import adsEdit from '@/views/ad/edit.vue'
import adminUsers from '@/views/adminUser/list.vue'
import sites from '@/views/site/index.vue'

Vue.use(Router)
const VueRouterPush = Router.prototype.push
Router.prototype.push = function push (to) {
  return VueRouterPush.call(this, to).catch(err => err)
}

const router = new Router({
  routes: [
    {
      path: '/',
      component: layout,
      redirect: '/posts',
      children: [
        {
          path: '/posts',
          name: 'posts',
          component: posts
        },
        {
          path: '/posts/edit',
          name: 'postsEdit',
          component: postsEdit
        },
        {
          path: '/categories',
          name: 'categories',
          component: categories
        },
        {
          path: '/ads',
          name: 'ads',
          component: ads
        },
        {
          path: '/ads/edit/:id',
          name: 'adsEdit',
          props: true,
          component: adsEdit
        },
        {
          path: '/admin_users',
          name: 'adminUsers',
          component: adminUsers
        },
        {
          path: '/sites',
          name: 'sites',
          component: sites
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: login,
      meta: {
        isPublic: true
      }
    },
    {
      path: '/403',
      component: () => import('@/shared/403'),
      meta: {
        isPublic: true
      }
    },
    {
      path: '/404',
      component: () => import('@/shared/404'),
      meta: {
        isPublic: true
      }
    },
    {
      path: '*',
      name: 'any',
      redirect: '/404'
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const token = Vue.prototype.$storage.get('token')
  let currentUser = store.state.currentUser
  if (!currentUser && token) {
    currentUser = await store.dispatch('fetchCurrentUser')
  }

  if (!currentUser && !to.meta.isPublic) {
    router.push({
      name: 'login',
      params: { to: to }
    })
  } else if (currentUser && to.path === '/login') {
    next('/')
  } else {
    next()
  }
})

export default router
