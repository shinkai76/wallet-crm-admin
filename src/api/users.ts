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

interface IData1 {
  address: string
  level: string
  page_no: number
  page_size: number
}

export const customerList = (data:IData1) =>
  request({
    url: '/customer/list',
    method: 'post',
    data
  })

interface IData2 {
  level:string
  user_id: string
}
export const modifyLevel = (data:IData2) =>
  request({
    url: '/customer/level',
    method: 'post',
    data
  })

interface IData3 {
  user_id: string
  page_no: number
  page_size: number
}
export const getDRData = (data:IData3) =>
  request({
    url: '/customer/deposit_records',
    method: 'post',
    data
  })

export const getWRData = (data:IData3) =>
  request({
    url: '/customer/withdraw_records',
    method: 'post',
    data
  })

export const getARData = (data:IData3) =>
  request({
    url: '/customer/airdrop_records',
    method: 'post',
    data
  })

interface IData4 {
  token_id: string
  type: string
  withdraw_fee:string
  internal_withdraw_fee: string
}
export const setToken = (data:IData4) =>
  request({
    url: '/token/set',
    method: 'post',
    data
  })

interface IData5 {
  token: string
  level:string
  quantity: string
}
export const createAirdrop = (data:IData5) =>
  request({
    url: '/create_airdrop',
    method: 'post',
    data
  })

interface IData6 {
  page_no: number
  page_size: number
}
export const airdropList = (data:IData6) =>
  request({
    url: '/airdrop/list',
    method: 'post',
    data
  })

interface IData7 {
  order: string
}
export const approve = (data:IData7) =>
  request({
    url: '/withdraw/approve',
    method: 'post',
    data
  })

interface IData8 {
  page_no: number
  page_size: number
}
export const getPendingList = (data:IData8) =>
  request({
    url: '/withdraw/pending_list',
    method: 'post',
    data
  })

interface IData9 {
  page_no: number
  page_size: number
  filter?: string
}
export const getHistoryList = (data:IData9) =>
  request({
    url: '/withdraw/history_list',
    method: 'post',
    data
  })

interface IData10 {
  page_no: number
  page_size: number
}
export const collectList = (data:IData10) =>
  request({
    url: '/collect/list',
    method: 'post',
    data
  })

interface IData11 {
  token: string
}
export const collect = (data:IData11) =>
  request({
    url: '/collect/token',
    method: 'post',
    data
  })
