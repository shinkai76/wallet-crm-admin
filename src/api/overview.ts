import request from '@/utils/request'

export const getOverviewData = (data: object) =>
  request({
    url: '/',
    method: 'post',
    data
  })
