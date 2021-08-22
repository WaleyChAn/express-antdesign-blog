import router from '../router'
import store from '../store'
import storage from './storage'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login', '/403', '/404']

router.beforeEach(async (to, from, next) => {
  NProgress.start()

  const hasToken = storage.get('token')
  const loginPath = '/login'
  const loginRedirect = `/login?redirect=${to.path}`

  if (hasToken) {
    if (to.path === loginPath) {
      next('/')
    } else {
      const hasCurrentUser = store.getters.getCurrentUser
      if (hasCurrentUser) {
        next()
      } else {
        const currentUser = await store.dispatch('fetchCurrentUser')
        if (!currentUser) {
          next(loginRedirect)
        } else {
          next()
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(loginRedirect)
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
