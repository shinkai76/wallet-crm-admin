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
      redirect: '/overview',
      children: [
        {
          path: 'overview',
          name: 'overview',
          component: () => import(/* webpackChunkName: "overview" */ '@/views/overview/index.vue'),
          meta: {
            title: 'Overview',
            icon: 'dashboard'
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
            title: 'Customer list',
            icon: 'user'
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
            title: 'Token list',
            icon: 'user'
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
            title: 'Airdrop',
            icon: 'user'
          }
        }
      ]
    },
    {
      path: '/deposit',
      component: Layout,
      meta: {
        title: 'Deposit',
        icon: 'example'
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
      path: '/withdraw',
      component: Layout,
      meta: {
        title: 'Withdraw',
        icon: 'example'
      },
      children: [
        {
          path: 'pendingReview',
          component: () => import(/* webpackChunkName: "withdraw" */ '@/views/withdraw/pendingReview.vue'),
          meta: {
            title: 'Pending review'
          }
        },
        {
          path: 'history',
          component: () => import(/* webpackChunkName: "withdraw" */ '@/views/withdraw/history.vue'),
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
        title: 'Finance',
        icon: 'example'
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
            title: 'Withdraw account balance'
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
        title: 'Collect Address Set',
        icon: 'example'
      },
      children: [
        {
          path: 'collectAddressSet',
          component: () => import(/* webpackChunkName: "collectAddressSet" */ '@/views/set/collectAddressSet.vue'),
          meta: {
            title: 'Collect Address Set',
            icon: 'tree'
          }
        },
        {
          path: 'verifyPasswordSet',
          component: () => import(/* webpackChunkName: "verifyPasswordSet" */ '@/views/set/verifyPasswordSet.vue'),
          meta: {
            title: 'Verify Password Set',
            icon: 'table'
          }
        },
        {
          path: 'accountSet',
          component: () => import(/* webpackChunkName: "accountSet" */ '@/views/set/accountSet.vue'),
          meta: {
            title: 'Account Set',
            icon: 'table'
          }
        }
      ]
    },
    {
      path: '/form',
      component: Layout,
      children: [
        {
          path: 'index',
          component: () => import(/* webpackChunkName: "form" */ '@/views/form/index.vue'),
          meta: {
            title: 'Form',
            icon: 'form'
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
