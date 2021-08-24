import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/layout/index.vue'
const originalPush = Router.prototype.push
Router.prototype.push = function push(location:any) {
  // @ts-ignore
  return originalPush.call(this, location).catch((err:any) => err)
}
Vue.use(Router)

/*
  redirect:                      if set to 'noredirect', no redirect action will be trigger when clicking the breadcrumb
  meta: {
    title: 'title'               the name showed in subMenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon showed in the sidebar
    breadcrumb: false            if false, the item will be hidden in breadcrumb (default is true)
    hidden: true                 if true, this route will not show in the sidebar (default is false)
  }
*/

export default new Router({
  // mode: 'history',  // Enable this if you need.
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/login',
      component: () => import(/* webpackChunkName: "login" */ '@/views/login/index.vue'),
      meta: { hidden: true }
    },
    {
      path: '/404',
      component: () => import(/* webpackChunkName: "404" */ '@/views/404.vue'),
      meta: { hidden: true }
    },
    {
      path: '/',
      component: Layout,
      redirect: '/overview'
    },
    {
      path: '/overview',
      component: Layout,
      children: [
        {
          path: '',
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
      component: Layout,
      children: [
        {
          path: 'index',
          component: () => import(/* webpackChunkName: "customerList" */ '@/views/customerList/index.vue'),
          meta: {
            icon: 'user',
            title: 'Customer list'
          }
        }
      ]
    },
    {
      path: '/tokenList',
      component: Layout,
      children: [
        {
          path: 'index',
          component: () => import(/* webpackChunkName: "tokenList" */ '@/views/tokenList/index.vue'),
          meta: {
            icon: 'table',
            title: 'Token list'
          }
        }
      ]
    },
    {
      path: '/airdrop',
      component: Layout,
      children: [
        {
          path: 'index',
          component: () => import(/* webpackChunkName: "airdrop" */ '@/views/airdrop/index.vue'),
          meta: {
            icon: 'example',
            title: 'Airdrop'
          }
        }
      ]
    },
    {
      path: '/deposit',
      component: Layout,
      meta: {
        icon: 'tree',
        title: 'Deposit'
      },
      children: [
        {
          path: 'pendingReview',
          component: () => import(/* webpackChunkName: "withdraw" */ '@/views/deposit/pendingReview.vue'),
          meta: {
            title: 'Pending review'
          }
        },
        {
          path: 'history',
          component: () => import(/* webpackChunkName: "withdraw" */ '@/views/deposit/history.vue'),
          meta: {
            title: 'History'
          }
        }
      ]
    },
    {
      path: '/withdrawal',
      component: Layout,
      meta: {
        icon: 'withdraw',
        title: 'Withdrawal'
      },
      children: [
        {
          path: 'pendingReview',
          component: () => import(/* webpackChunkName: "withdraw" */ '@/views/withdrawal/pendingReview.vue'),
          meta: {
            title: 'Pending review'
          }
        },
        {
          path: 'history',
          component: () => import(/* webpackChunkName: "withdraw" */ '@/views/withdrawal/history.vue'),
          meta: {
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
        icon: 'tree',
        title: 'Finance'
      },
      children: [
        {
          path: 'collectManagement',
          component: () => import(/* webpackChunkName: "collectManagement" */ '@/views/finance/collectManagement.vue'),
          meta: {
            title: 'Collect Management'
          }
        },
        {
          path: 'collectAccountBalance',
          component: () => import(/* webpackChunkName: "collectAccountBalance" */ '@/views/finance/collectAccountBalance.vue'),
          meta: {
            title: 'Collect account balance'
          }
        },
        {
          path: 'withdrawAccountBalance',
          component: () => import(/* webpackChunkName: "withdrawAccountBalance" */ '@/views/finance/withdrawAccountBalance.vue'),
          meta: {
            title: 'Withdrawal account balance'
          }
        },
        {
          path: 'feeProfit',
          component: () => import(/* webpackChunkName: "feeProfit" */ '@/views/finance/feeProfit.vue'),
          meta: {
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
        icon: 'setting',
        title: 'Set'
      },
      children: [
        {
          path: 'collectAddressSet',
          component: () => import(/* webpackChunkName: "collectAddressSet" */ '@/views/set/collectAddressSet.vue'),
          meta: {
            title: 'Collect Address Set'
          }
        },
        {
          path: 'verifyPasswordSet',
          component: () => import(/* webpackChunkName: "verifyPasswordSet" */ '@/views/set/verifyPasswordSet.vue'),
          meta: {
            title: 'Verify Password Set'
          }
        },
        {
          path: 'accountSet',
          component: () => import(/* webpackChunkName: "accountSet" */ '@/views/set/accountSet.vue'),
          meta: {
            title: 'Account Set'
          }
        },
        {
          path: 'loginPassword',
          component: () => import(/* webpackChunkName: "accountSet" */ '@/views/set/loginPassword.vue'),
          meta: {
            title: 'Login Password'
          }
        }
      ]
    },
    {
      path: '*',
      redirect: '/404',
      meta: { hidden: true }
    }
  ]
})
