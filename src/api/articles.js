import request from '@/utils/request';
export const getArticles = (params) => request({
    url: '/articles',
    method: 'get',
    params
});
//# sourceMappingURL=articles.js.map