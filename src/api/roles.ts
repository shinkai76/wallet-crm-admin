/* eslint-disable camelcase */
import { get, post } from '@/utils/request'
const baseUrl = 'nuvateq/mgt/v1'

interface IData10 {
  page_no: number
  page_size: number
}
export const getRoles = (params:IData10)=> {
  return post(baseUrl + '/set/permissions/list', params)
}

export const getAdmins = (params:IData10)=> {
  return post(baseUrl + '/user/list', params)
}

interface IData17 {
  name: string
}
export const deleteRoles = (params:IData17)=> {
  return post(baseUrl + '/set/permissions/delete', params)
}

export const deleteAdmin = (params:IData17)=> {
  return post(baseUrl + '/user/delete', params)
}

interface IData18 {
  name: string
  menus: []
}
export const setRoles = (params:IData18)=> {
  return post(baseUrl + '/set/permissions/set', params)
}

export const createRoles = (params:IData18)=> {
  return post(baseUrl + '/set/permissions/add', params)
}

export const getRoutes = (params: any) => {
  return get(baseUrl + '/sys/menus', params)
}
interface IData19 {
  user_code: string
  permissions: string
  password: string
}
export const createAdmin = (params:IData19)=> {
  return post(baseUrl + '/user/add', params)
}
