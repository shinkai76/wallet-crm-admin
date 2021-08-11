/* eslint-disable camelcase */
import { get, post } from '@/utils/request'
const baseUrl = 'nuvateq/mgt/v1'

// 获取公钥
export const pubKey = (params:any):any =>{
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
  page_no: number
  page_size: number
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

interface IData5 {
  token: string
  level:string
  quantity: string
}
export const createAirdrop = (params: IData5) => {
  return post(baseUrl + '/create_airdrop', params)
}
interface IData6 {
  page_no: number
  page_size: number
}
export const airdropList = (params: IData6) => {
  return post(baseUrl + '/airdrop/list', params)
}

interface IData7 {
  code: string
}
export const approve = (params: IData7) => {
  return post(baseUrl + '/withdrawal/pass', params)
}

interface IData8 {
  page_no: number
  page_size: number
  status: string
}
export const getWithdrawList = (params: IData8) => {
  return post(baseUrl + '/withdrawal/records', params)
}


interface IData10 {
  page_no: number
  page_size: number
}
export const collectList = (params: IData10) => {
  return post(baseUrl + '/collect/list', params)
}

interface IData11 {
  token: string
}
export const collect = (params: IData11) => {
  return post(baseUrl + '/collect/token', params)
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
