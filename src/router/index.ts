import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

/* Layout */
import Layout from '@/layout/index.vue'

/* Router modules */
// import componentsRouter from './modules/components'
// import chartsRouter from './modules/charts'
// import tableRouter from './modules/table'
// import nestedRouter from './modules/nested'
const originalPush = VueRouter.prototype.push
// @ts-ignore
VueRouter.prototype.push = function push(location) {
  // @ts-ignore
  return originalPush.call(this, location).catch((err: any) => err)
}
Vue.use(VueRouter)

/*
  Note: sub-menu only appear when children.length>=1
  Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
*/

/*
  name:'router-name'             the name field is required when using <keep-alive>, it should also match its component's name property
                                 detail see : https://vuejs.org/v2/guide/components-dynamic-async.html#keep-alive-with-Dynamic-Components
  redirect:                      if set to 'noredirect', no redirect action will be trigger when clicking the breadcrumb
  meta: {
    roles: ['admin', 'editor']   will control the page roles (allow setting multiple roles)
    title: 'title'               the name showed in subMenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon showed in the sidebar
    hidden: true                 if true, this route will not show in the sidebar (default is false)
    alwaysShow: true             if true, will always show the root menu (default is false)
                                 if false, hide the root menu when has less or equal than one children route
    breadcrumb: false            if false, the item will be hidden in breadcrumb (default is true)
    noCache: true                if true, the page will not be cached (default is false)
    affix: true                  if true, the tag will affix in the tags-view
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
*/

/**
  ConstantRoutes
  a base page that does not have permission requirements
  all roles can be accessed
*/
export const constantRoutes: RouteConfig[] = [
  {
    path: '/login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/login/index.vue'),
    meta: { hidden: true }
  }
]
/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
*/

export const asyncRoutes: RouteConfig[] = [

  {
    path: '/',
    component: Layout,
    redirect: '/overview',
    meta: {
      permissionId: '1'
    },
    children: [
      {
        path: '/overview',
        name: 'overview',
        component: () => import(/* webpackChunkName: "overview" */ '@/views/overview/index.vue'),
        meta: {
          icon: 'dashboard',
          title: 'Overview'
        }
      }
    ]
  },

  {
    path: '/customerList',
    redirect: '/customerList/index',
    component: Layout,
    meta: {
      permissionId: '2'
    },
    children: [
      {
        path: 'index',
        component: () => import(/* webpackChunkName: "customerList" */ '@/views/customerList/index.vue'),
        meta: {
          permissionId: '2',
          icon: 'user',
          title: 'Customer list'
        }
      }
    ]
  },
  {
    path: '/tokenList',
    redirect: '/tokenList/index',
    component: Layout,
    meta: {
      permissionId: '3'
    },
    children: [
      {
        path: 'index',
        component: () => import(/* webpackChunkName: "tokenList" */ '@/views/tokenList/index.vue'),
        meta: {
          permissionId: '3',
          icon: 'table',
          title: 'Token list'
        }
      }
    ]
  },
  {
    path: '/airdrop',
    redirect: '/airdrop/index',
    component: Layout,
    meta: {
      permissionId: '4'
    },
    children: [
      {
        path: 'index',
        component: () => import(/* webpackChunkName: "airdrop" */ '@/views/airdrop/index.vue'),
        meta: {
          permissionId: '4',
          icon: 'example',
          title: 'Airdrop'
        }
      }
    ]
  },
  {
    path: '/deposit',
    redirect: '/deposit/pendingReview',
    component: Layout,
    meta: {
      permissionId: '18',
      icon: 'tree',
      title: 'Deposit'
    },
    children: [
      {
        path: 'pendingReview',
        component: () => import(/* webpackChunkName: "withdraw" */ '@/views/deposit/pendingReview.vue'),
        meta: {
          permissionId: '19',
          title: 'Pending review'
        }
      },
      {
        path: 'history',
        component: () => import(/* webpackChunkName: "withdraw" */ '@/views/deposit/history.vue'),
        meta: {
          permissionId: '20',
          title: 'History'
        }
      }
    ]
  },
  {
    path: '/withdrawal',
    component: Layout,
    redirect: '/withdrawal/pendingReview',
    meta: {
      permissionId: '5',
      icon: 'withdraw',
      title: 'Withdrawal'
    },
    children: [
      {
        path: 'pendingReview',
        component: () => import(/* webpackChunkName: "withdraw" */ '@/views/withdrawal/pendingReview.vue'),
        meta: {
          permissionId: '6',
          title: 'Pending review'
        }
      },
      {
        path: 'history',
        component: () => import(/* webpackChunkName: "withdraw" */ '@/views/withdrawal/history.vue'),
        meta: {
          permissionId: '7',
          title: 'History'
        }
      }
    ]
  },
  {
    path: '/finance',
    component: Layout,
    redirect: '/finance/collectManagement',
    meta: {
      permissionId: '8',
      icon: 'tree',
      title: 'Finance'
    },
    children: [
      {
        path: 'collectManagement',
        component: () => import(/* webpackChunkName: "collectManagement" */ '@/views/finance/collectManagement.vue'),
        meta: {
          permissionId: '9',
          title: 'Collect Management'
        }
      },
      {
        path: 'collectAccountBalance',
        component: () => import(/* webpackChunkName: "collectAccountBalance" */ '@/views/finance/collectAccountBalance.vue'),
        meta: {
          permissionId: '10',
          title: 'Collect account balance'
        }
      },
      {
        path: 'withdrawAccountBalance',
        component: () => import(/* webpackChunkName: "withdrawAccountBalance" */ '@/views/finance/withdrawAccountBalance.vue'),
        meta: {
          permissionId: '11',
          title: 'Withdrawal account balance'
        }
      },
      {
        path: 'feeProfit',
        component: () => import(/* webpackChunkName: "feeProfit" */ '@/views/finance/feeProfit.vue'),
        meta: {
          permissionId: '12',
          title: 'Fee profit'
        }
      }
    ]
  },
  {
    path: '/set',
    component: Layout,
    redirect: '/set/collectManagement',
    meta: {
      permissionId: '13',
      icon: 'setting',
      title: 'Set'
    },
    children: [
      {
        path: 'collectAddressSet',
        component: () => import(/* webpackChunkName: "collectAddressSet" */ '@/views/set/collectAddressSet.vue'),
        meta: {
          permissionId: '14',
          title: 'Collect Address Set'
        }
      },
      {
        path: 'verifyPasswordSet',
        component: () => import(/* webpackChunkName: "verifyPasswordSet" */ '@/views/set/verifyPasswordSet.vue'),
        meta: {
          permissionId: '15',
          title: 'Verify Password Set'
        }
      },
      {
        path: 'accountSet',
        component: () => import(/* webpackChunkName: "accountSet" */ '@/views/set/accountSet.vue'),
        meta: {
          permissionId: '16',
          title: 'Account Set'
        }
      },
      {
        path: 'loginPassword',
        component: () => import(/* webpackChunkName: "accountSet" */ '@/views/set/loginPassword.vue'),
        meta: {
          permissionId: '17',
          title: 'Login Password'
        }
      }
    ]
  },
  {
    path: '*',
    redirect: '/404',
    meta: { hidden: true }
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "404" */ '@/views/404.vue'),
    meta: { hidden: true }
  }
]

const createRouter = () => new VueRouter({
  // mode: 'history',  // Disabled due to Github Pages doesn't support this, enable this if you need.
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  mode: 'hash',
  base: '',
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  (router as any).matcher = (newRouter as any).matcher // reset router
}

export default router
