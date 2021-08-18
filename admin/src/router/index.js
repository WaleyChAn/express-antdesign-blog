import Vue from 'vue'
import Router from 'vue-router'
import layout from '@/shared/layout.vue'
import posts from '@/views/post/index.vue'
import postsEdit from '@/views/post/edit.vue'
import categories from '@/views/category/list.vue'
import categoriesEdit from '@/views/category/edit.vue'
import ads from '@/views/ad/list.vue'
import adsEdit from '@/views/ad/edit.vue'
import adminUsers from '@/views/adminUser/list.vue'
import adminUsersEdit from '@/views/adminUser/edit.vue'
import sites from '@/views/site/index.vue'

Vue.use(Router)
const VueRouterPush = Router.prototype.push
Router.prototype.push = function push (to) {
  return VueRouterPush.call(this, to).catch(err => err)
}

export default new Router({
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
          path: '/posts/edit/:id',
          name: 'postsEdit',
          props: true,
          component: postsEdit
        },
        {
          path: '/categories',
          name: 'categories',
          component: categories
        },
        {
          path: '/categories/edit/:id',
          name: 'categoriesEdit',
          props: true,
          component: categoriesEdit
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
          path: '/admin_users/edit/:id',
          name: 'adminUsersEdit',
          props: true,
          component: adminUsersEdit
        },
        {
          path: '/sites',
          name: 'sites',
          component: sites
        }
      ]
    },
    {
      path: '/403',
      component: () => import('@/shared/403')
    },
    {
      path: '/404',
      component: () => import('@/shared/404')
    },
    {
      path: '*',
      name: 'any',
      redirect: '/404'
    }
  ]
})