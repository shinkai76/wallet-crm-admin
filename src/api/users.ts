import request from '@/utils/request'

export const getUserInfo = (data: any) =>
  request({
    url: '/users/info',
    method: 'post',
    data
  })

export const login = (data: any) =>
  request({
    url: '/users/login',
    method: 'post',
    data
  })

export const logout = () =>
  request({
    url: '/users/logout',
    method: 'post'
  })

interface data1 {
  address: string
  level: string
  page_no: Number
  page_size: Number
}

export const customerList = (data:data1) =>
  request({
    url: '/customer/list',
    method: 'post',
    data
  })

interface data2 {
  level:string
  user_id: string
}
export const modifyLevel = (data:data2) =>
  request({
    url: '/customer/level',
    method: 'post',
    data
  })

interface data3 {
  user_id: string
  page_no: Number
  page_size: Number
}
export const getDRData = (data:data3) =>
  request({
    url: '/customer/deposit_records',
    method: 'post',
    data
})

export const getWRData = (data:data3) =>
  request({
    url: '/customer/withdraw_records',
    method: 'post',
    data
})

export const getARData = (data:data3) =>
  request({
    url: '/customer/airdrop_records',
    method: 'post',
    data
})
