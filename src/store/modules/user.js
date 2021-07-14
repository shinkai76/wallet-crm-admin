import { __decorate } from "tslib";
import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators';
import { login, logout, getUserInfo } from '@/api/users';
import { getToken, setToken, removeToken } from '@/utils/cookies';
import store from '@/store';
let User = class User extends VuexModule {
    constructor() {
        super(...arguments);
        this.token = getToken() || '';
        this.name = '';
        this.avatar = '';
        this.introduction = '';
        this.roles = [];
    }
    SET_TOKEN(token) {
        this.token = token;
    }
    SET_NAME(name) {
        this.name = name;
    }
    SET_AVATAR(avatar) {
        this.avatar = avatar;
    }
    SET_INTRODUCTION(introduction) {
        this.introduction = introduction;
    }
    SET_ROLES(roles) {
        this.roles = roles;
    }
    async Login(userInfo) {
        let { username, password } = userInfo;
        username = username.trim();
        const { data } = await login({ username, password });
        setToken(data.accessToken);
        this.SET_TOKEN(data.accessToken);
    }
    ResetToken() {
        removeToken();
        this.SET_TOKEN('');
        this.SET_ROLES([]);
    }
    async GetUserInfo() {
        if (this.token === '') {
            throw Error('GetUserInfo: token is undefined!');
        }
        const { data } = await getUserInfo({ /* Your params here */});
        if (!data) {
            throw Error('Verification failed, please Login again.');
        }
        const { roles, name, avatar, introduction } = data.user;
        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
            throw Error('GetUserInfo: roles must be a non-null array!');
        }
        this.SET_ROLES(roles);
        this.SET_NAME(name);
        this.SET_AVATAR(avatar);
        this.SET_INTRODUCTION(introduction);
    }
    async LogOut() {
        if (this.token === '') {
            throw Error('LogOut: token is undefined!');
        }
        await logout();
        removeToken();
        this.SET_TOKEN('');
        this.SET_ROLES([]);
    }
};
__decorate([
    Mutation
], User.prototype, "SET_TOKEN", null);
__decorate([
    Mutation
], User.prototype, "SET_NAME", null);
__decorate([
    Mutation
], User.prototype, "SET_AVATAR", null);
__decorate([
    Mutation
], User.prototype, "SET_INTRODUCTION", null);
__decorate([
    Mutation
], User.prototype, "SET_ROLES", null);
__decorate([
    Action
], User.prototype, "Login", null);
__decorate([
    Action
], User.prototype, "ResetToken", null);
__decorate([
    Action
], User.prototype, "GetUserInfo", null);
__decorate([
    Action
], User.prototype, "LogOut", null);
User = __decorate([
    Module({ dynamic: true, store, name: 'user' })
], User);
export const UserModule = getModule(User);
//# sourceMappingURL=user.js.map