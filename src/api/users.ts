/* eslint-disable camelcase */
import { get, post } from '@/utils/request'
const baseUrl = 'nuvateq/mgt/v1'

export const getMenus = (params={}):any=> {
  return get(baseUrl + '/sys/menus', params)
}
export const getUserMenus = (params={}):any => {
  return post(baseUrl + '/user/menus/get', params)
}

// 获取公钥
export const pubKey = (params:any = {}):any => {
  return post(baseUrl + '/user/pk', params)
}

export const login = (params: any):any => {
  return post(baseUrl + '/user/login', params)
}
//
interface IData1 {
  user_code: string
}
interface IData2 {
  level: number
  user_code: string
}
export const modifyLevel = (params: IData2) => {
  return post(baseUrl + '/customer/set-level', params)
}


interface IData3 {
  user_code: string
  page_no: number
  page_size: number
}
export const getEAData = (params: IData1) => {
  return post(baseUrl + '/customer/assets', params)
}
export const getDRData = (params: IData3) => {
  return post(baseUrl + '/customer/deposit/records', params)
}
export const getWRData = (params: IData3) => {
  return post(baseUrl + '/customer/withdrawal/records', params)
}
export const getARData = (params: IData3) => {
  return post(baseUrl + '/customer/airdrop/records', params)
}


interface IData4 {
  token_id: string
  type: string
  withdraw_fee:string
  internal_withdraw_fee: string
}
export const setToken = (params: IData4) => {
  return post(baseUrl + '/token/set', params)
}

interface IData4_1 {
  proto: string
}
export const tokenList = (params: IData4_1) => {
  return post(baseUrl + '/token/query', params)
}

interface IData4_2 {
  token_name: string
  withdrawal_fee: string
  internal_fee: string
  contract_address: string
  collect_limit: string
  proto: string
}
export const addToken = (params: IData4_2) => {
  return post(baseUrl + '/token/add', params)
}

interface IData4_3 {
  name:string
}
export const tokenAddress =(params:IData4_3) => {
  return post(baseUrl + '/token/all', params)
}

interface IData4_4 {
  proto:string
}
export const tokenQuery =(params:IData4_4) => {
  return post(baseUrl + '/token/query', params)
}

interface IData5 {
  token: string
  proto: string
  user_level: number
  amount: string
}
export const createAirdrop = (params: IData5) => {
  return post(baseUrl + '/air-drop/add', params)
}

interface IData6 {
  page_no: number
  page_size: number
}
export const airdropList = (params: IData6) => {
  return post(baseUrl + '/air-drop/records', params)
}

interface IData7 {
  code: string
}
export const approve = (params: IData7) => {
  return post(baseUrl + '/withdrawal/pass', params)
}

export const depositApprove = (params: IData7) => {
  return post(baseUrl + '/deposit/pass', params)
}

interface IData8 {
  page_no: number
  page_size: number
  status: number
  token?: string
}
export const getWithdrawList = (params: IData8) => {
  return post(baseUrl + '/withdrawal/records', params)
}
export const getDepositList = (params: IData8) => {
  return post(baseUrl + '/deposit/records', params)
}

interface IData10 {
  page_no: number
  page_size: number
}
export const collectList = (params: IData10) => {
  return post(baseUrl + '/collection/list', params)
}

interface IData11 {
  token_id: number
}
export const collect = (params: IData11) => {
  return post(baseUrl + '/collection/send', params)
}

interface IData12 {
  page_no: number
  page_size: number
  email?: string
  level: number // -1是查全部
}
export const userList = (params: IData12) => {
  return post(baseUrl + '/customer/list', params)
}

export const collectAccount = (params={})=> {
  return get(baseUrl + '/finance/collect/hot-account', params)
}

export const withdrawalAccount = (params={})=> {
  return get(baseUrl + '/finance/withdrawal-account', params)
}

export const feeProfit = (params={})=> {
  return get(baseUrl + '/finance/fee-profit', params)
}

interface IData13 {
  old_pwd: string
  new_pwd: string
}
export const setVerifyPwd = (params:IData13)=> {
  return post(baseUrl + '/set/verify-password', params)
}

interface IData14 {
  old_pwd: string
  new_pwd: string
  user_code: string
}
export const setAccountPwd = (params:IData14)=> {
  return post(baseUrl + '/user/password/reset', params)
}

interface IData15 {
  user_code: string
  to_address: string
  id: number
}
export const profitWithdrawal = (params:IData15) => {
  return post(baseUrl + '/finance/profit-withdrawal', params)
}

interface IData16 {
  password: string
}
export const authPwdVerify = (params:IData16)=> {
  return post(baseUrl + '/auth/verify-password', params)
}


export const getRoles = (params:IData10)=> {
  return post(baseUrl + '/set/permissions/list', params)
}

interface IData17 {
  name: string
}
export const deleteRoles = (params:IData17)=> {
  return post(baseUrl + '/set/permissions/delete', params)
}

interface IData18 {
  name: string
  menus: []
}
export const setRoles = (params:IData18)=> {
  return post(baseUrl + '/set/permissions/set', params)
}

export const collectAddressList = (params:IData10)=> {
  return post(baseUrl + '/cold-address/list', params)
}
interface IData20 {
  token: string
  address: string
}
export const collectAddressSet = (params:IData20)=> {
  return post(baseUrl + '/set/collect-address', params)
}
