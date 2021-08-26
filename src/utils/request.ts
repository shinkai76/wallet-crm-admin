import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import { UserModule } from '@/store/modules/user'
import router from '@/router/index'
const service = axios.create({
  baseURL: '',
  timeout: 5000
})

// Request interceptors
axios.interceptors.request.use(
  (config) => {
    // Add X-Access-Token header to every request, you can add other custom headers here
    if (localStorage.getItem('token')) {
      config.headers.token = localStorage.getItem('token')
    }
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

// Response interceptors
axios.interceptors.response.use(
  (response) => {
    const res = response.data
    if (res.code !== 0) {
      Message({
        message: res.msg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      if (res.code === 401) {
        MessageBox.confirm(
          'You have been logged out, try to login again.',
          'Log out',
          {
            confirmButtonText: 'Relogin',
            cancelButtonText: 'Cancel',
            type: 'warning'
          }
        ).then(() => {
          UserModule.ResetToken()
          location.reload() // To prevent bugs from vue-router
        })
      }
      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      return response.data
    }
  },
  (error) => {
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)


/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url:string, params:any) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: params
    }).then(res => {
      console.log(res)
      // @ts-ignore
      if (res.code === 0) {
        resolve(res.data)
      } else {
        Message({
          // @ts-ignore
          message: res.msg || 'Error',
          type: 'error',
          duration: 5 * 1000
        })
      }
    }).catch(err => {
      throw err
    })
  })
}

/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function post(url:string, params:any) {
  return new Promise((resolve, reject) => {
    axios.post(url, params)
      .then(res => {
        // @ts-ignore
        if (res.code === 401) { // token 失效
          router.push({ path: '/login' })
          return
        }
        // @ts-ignore
        if (res.code !== 0) {
          Message({
            // @ts-ignore
            message: res.msg || 'Error',
            type: 'error',
            duration: 5 * 1000
          })
          return
        }
        resolve(res.data)
      })
      .catch(err => {
        console.log(err)
        reject(err.data)
      })
  })
}
