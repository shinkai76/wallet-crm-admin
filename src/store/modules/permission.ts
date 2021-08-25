import { VuexModule, Module, Action, getModule, Mutation } from 'vuex-module-decorators'
import { RouteConfig } from 'vue-router'
import { asyncRoutes, constantRoutes } from '@/router'
import store from '@/store'

const hasPermission = (meunsId:number[], route:RouteConfig) => {
  if (route.meta && route.meta.permissionId) {
    return meunsId.includes(Number(route.meta.permissionId))
  } else {
    return true
  }
}

export const filterAsyncRoutes = (routes: RouteConfig[], meunsId:number[]) => {
  const res: RouteConfig[] = []
  routes.forEach(route => {
    const r = { ...route }
    if (hasPermission(meunsId, r)) {
      if (r.children) {
        r.children = filterAsyncRoutes(r.children, meunsId)
      }
      res.push(r)
    }
  })
  return res
}

export interface IPermissionState {
    routes: RouteConfig[]
    dynamicRoutes: RouteConfig[]
}

@Module({ dynamic: true, store, name: 'permission' })
class Permission extends VuexModule implements IPermissionState {
    public routes: RouteConfig[] = []
    public dynamicRoutes: RouteConfig[] = []

    @Mutation
    private SET_ROUTES(routes: RouteConfig[]) {
      this.routes = constantRoutes.concat(routes)
      this.dynamicRoutes = this.routes
      console.log(PermissionModule.routes)
    }

    @Action({ rawError: true })
    public GenerateRoutes(menusId: number[]) {
      const accessedRoutes = filterAsyncRoutes(asyncRoutes, menusId)
      this.SET_ROUTES(accessedRoutes)
    }
}

export const PermissionModule = getModule(Permission)
