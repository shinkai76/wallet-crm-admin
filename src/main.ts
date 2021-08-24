import Vue from 'vue'

import 'normalize.css'
import ElementUI from 'element-ui'
// import locale from 'element-ui/lib/locale/lang/en'
import SvgIcon from 'vue-svgicon'

import '@/styles/element-variables.scss'
import '@/styles/index.scss'

import App from '@/App.vue'
import store from '@/store'
import router from '@/router'
import '@/icons/components'
import '@/permission'
import * as filters from '@/filters'
import VueClipboard from 'vue-clipboard2'

Vue.use(VueClipboard)
Object.keys(filters).forEach(key => {
  Vue.filter(key, (filters as { [key: string ]: Function })[key])
})

Vue.use(ElementUI)
Vue.use(SvgIcon, {
  tagName: 'svg-icon',
  defaultWidth: '1em',
  defaultHeight: '1em'
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
