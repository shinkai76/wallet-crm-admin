import router from '@/router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { Route } from 'vue-router'
import { PermissionModule } from '@/store/modules/permission'
import store from './store'
NProgress.configure({ showSpinner: false })

const whiteList = ['/login']

router.beforeEach(async(to: Route, form: Route, next: any) => {
  // Start progress bar

  NProgress.start()
  const token = localStorage.getItem('token')
  // Determine whether the user has logged in

  if (token) {
    if (to.path === '/login') {
      // If is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    }
    console.log(store.state.user.routes)
    if (!store.state.user.routes) {
      const menusId = JSON.parse(localStorage.getItem('menus_id') || '')
      PermissionModule.GenerateRoutes(menusId)
      PermissionModule.dynamicRoutes.forEach((route) => {
        router.addRoute(route)
      })
      next({ ...to, replace: true })
    } else {
      next()
    }
  }
  else {
    // Has no token
    if (whiteList.indexOf(to.path) !== -1) {
      // In the free login whitelist, go directly
      next()
    } else {
      // Other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach((to: Route) => {
  // Finish progress bar
  NProgress.done()

  // set page title
  document.title = 'CRM SYSTEM'
})
