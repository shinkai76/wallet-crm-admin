/* eslint-disable camelcase */
import { get, post } from '@/utils/request'
const baseUrl = 'nuvateq/mgt/v1'

export const getOverviewAssets = (params = {}) => {
  return get(baseUrl + '/overview/assets', params)
}

export const getOverviewRegistrants = (params = {}) => {
  return get(baseUrl + '/overview/registrants', params)
}
interface IData1 {
  coin_name: string
}
export const getCoinStatistics = (params:IData1) => {
  return post(baseUrl + '/overview/assets/statistics', params)
}
