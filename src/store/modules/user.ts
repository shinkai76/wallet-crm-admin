/* eslint-disable camelcase */
import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import { getUserMenus, login } from '@/api/users'
import { getToken, setToken, removeToken } from '@/utils/cookies'
import store from '@/store'
import { isEmail } from '@/utils/validate'

export interface IUserState {
  token: string
  name: string
  avatar: string
  introduction: string
  roles: string[]
  routes: any[] | null
}

@Module({ dynamic: true, store, name: 'user' })
class User extends VuexModule implements IUserState {
  public token = getToken() || ''
  public name = ''
  public avatar = ''
  public introduction = ''
  public roles: string[] = []
  public routes = null

  @Mutation
  private SET_TOKEN(token: string) {
    this.token = token
  }

  @Mutation
  private SET_NAME(name: string) {
    this.name = name
  }

  @Mutation
  private SET_AVATAR(avatar: string) {
    this.avatar = avatar
  }

  @Mutation
  private SET_INTRODUCTION(introduction: string) {
    this.introduction = introduction
  }

  @Mutation
  private SET_ROLES(roles: string[]) {
    this.roles = roles
  }

  @Mutation
  private SET_ROUTES(routes:any) {
    this.routes = routes
  }

  @Action({ rawError: true })
  public async Login(userInfo: { user_code: string, password: string, verify_code:string }) {
    let { user_code, password, verify_code } = userInfo
    user_code = user_code.trim()
    let params = {}
    if (isEmail(user_code)) {
      params = { user_code, password, verify_code }
    } else {
      params = { user_code, password }
    }
    const data = await login(params)

    // console.log(router)
    const menuData = await getUserMenus({ user_code })
    localStorage.setItem('code', user_code)
    localStorage.setItem('token', data.token)
    localStorage.setItem('menus_id', JSON.stringify(menuData.menus))
    setToken(data.token)
    this.SET_TOKEN(data.token)
  }

  @Action
  public ResetToken() {
    removeToken()
    this.SET_TOKEN('')
    this.SET_ROLES([])
  }

  // @Action
  // public async GetUserInfo() {
  //   if (this.token === '') {
  //     throw Error('GetUserInfo: token is undefined!')
  //   }
  //   const { data } = await getUserInfo({ /* Your params here */ })
  //   if (!data) {
  //     throw Error('Verification failed, please Login again.')
  //   }
  //   const { roles, name, avatar, introduction } = data.user
  //   // roles must be a non-empty array
  //   if (!roles || roles.length <= 0) {
  //     throw Error('GetUserInfo: roles must be a non-null array!')
  //   }
  //   this.SET_ROLES(roles)
  //   this.SET_NAME(name)
  //   this.SET_AVATAR(avatar)
  //   this.SET_INTRODUCTION(introduction)
  // }

  @Action({ rawError: true })
  public async LogOut() {
    // if (this.token === '') {
    //   throw Error('LogOut: token is undefined!')
    // }
    localStorage.removeItem('token')
    removeToken()
    this.SET_ROUTES(null)
    this.SET_TOKEN('')
    this.SET_ROLES([])
  }
}

export const UserModule = getModule(User)
