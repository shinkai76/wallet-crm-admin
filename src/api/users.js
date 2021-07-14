import request from '@/utils/request';
export const getUserInfo = (data) => request({
    url: '/users/info',
    method: 'post',
    data
});
export const login = (data) => request({
    url: '/users/login',
    method: 'post',
    data
});
export const logout = () => request({
    url: '/users/logout',
    method: 'post'
});
//# sourceMappingURL=users.js.map