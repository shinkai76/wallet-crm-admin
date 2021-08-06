/* eslint-disable camelcase */
import { get, post } from '@/utils/request'
const baseUrl = 'nuvateq/mgt/v1'


export const getOverviewAssets = (params:any = {}):any =>{
  return get(baseUrl + '/overview/assets', params)
}

export const getOverviewRegistrants = (params:any = {}):any =>{
  return get(baseUrl + '/overview/registrants', params)
}
