/* eslint-disable camelcase */
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

interface data4 {
  token_id: string
  type: string
  withdraw_fee:string
  internal_withdraw_fee: string
}
export const setToken = (data:data4) =>
  request({
    url: '/token/set',
    method: 'post',
    data
  })

interface data5 {
  token: string
  level:string
  quantity: string
}
export const createAirdrop = (data:data5) =>
  request({
    url: '/create_airdrop',
    method: 'post',
    data
  })

interface data6 {
  page_no: Number
  page_size: Number
}
export const airdropList = (data:data6) =>
  request({
    url: '/airdrop/list',
    method: 'post',
    data
  })
