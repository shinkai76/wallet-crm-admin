<template>
  <div class="page-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="Role Permissions" name="Permissions">
        <el-button
          type="primary"
          @click="handleCreateRole"
        >
          ADD Permissions
        </el-button>
        <el-table
          :data="rolesList"
          style="width: 100%;margin-top:30px;"
          border
        >
          <el-table-column
            align="center"
            label="Role Name"
            width="320"
          >
            <template slot-scope="{row}">
              {{ row.name }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="Operations"
          >
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="small"
                @click="handleEditRole(scope.row)"
              >
                EDIT
              </el-button>
              <el-button
                type="danger"
                size="small"
                @click="handleDeleteRole(scope.row)"
              >
                DELETE
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="pagination-container"
          @current-change="handleCurrentChange"
          :current-page.sync="query.page_no"
          :page-size="query.page_size"
          layout="prev, pager, next, jumper"
          :total="total">
        </el-pagination>
        <!--        新建编辑弹窗-->
        <el-dialog
          :visible.sync="dialogVisible"
          :title="dialogType==='edit'?'Edit Role':'New Role'"
        >
          <el-form
            :model="role"
            label-width="80px"
            label-position="left"
          >
            <el-form-item label="Name">
              <el-input
                v-model="role.name"
                placeholder="Role Name"
              />
            </el-form-item>
            <el-form-item label="Menus">
              <el-tree
                ref="tree"
                :check-strictly="checkStrictly"
                :data="routesTreeData"
                :props="defaultProps"
                default-expand-all
                show-checkbox
                node-key="menu_id"
                class="permission-tree"
              />
            </el-form-item>
          </el-form>
          <div style="text-align:right;">
            <el-button
              type="danger"
              @click="dialogVisible=false"
            >
              cancel
            </el-button>
            <el-button
              type="primary"
              @click="confirmRole"
            >
              confirm
            </el-button>
          </div>
        </el-dialog>
      </el-tab-pane>
      <el-tab-pane label="Administrator" name="Administrator">
        <el-button
          type="primary"
          @click="handleCreateAdmin"
        >
          ADD Administrator
        </el-button>
        <el-table
          :data="adminList"
          style="width: 100%;margin-top:30px;"
          border
        >
          <el-table-column
            align="center"
            label="UserName"
            width="320"
          >
            <template slot-scope="{row}">
              {{ row.name }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="Password"
            width="320"
          >
            <template slot-scope="{row}">
              ******
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="Permissions"
            width="320"
          >
            <template slot-scope="{row}">
              {{ row.permissions }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="Set"
          >
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="small"
                @click="handleEditAdmin(scope.row)"
              >
                EDIT
              </el-button>
              <el-button
                type="danger"
                size="small"
                @click="handleDeleteAdmin(scope.row)"
              >
                DELETE
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="pagination-container"
          @current-change="handleCurrentChangeAdmin"
          :current-page.sync="queryAdmin.page_no"
          :page-size="queryAdmin.page_size"
          layout="prev, pager, next, jumper"
          :total="adminTotal">
        </el-pagination>
        <!--        新建admin弹窗-->
        <el-dialog
          center
          :visible.sync="dialogVisibleAdmin"
          :title="dialogType==='edit'?'Edit Administrator':'New Administrator'"
          width="520px"
        >
          <el-form
            :model="admin"
            label-width="120px"
            label-position="left"
            ref="admin"
            :rules="rules"
          >
            <el-form-item label="Name" prop="name">
              <el-input
                v-model="admin.name"
                :readonly="dialogType==='edit'"
                placeholder="User Name"
              />
            </el-form-item>
            <el-form-item label="Password" prop="password" v-if="dialogType == 'new'">
              <el-input
                v-model="admin.password"
                type="password"
                placeholder="password"
              />
            </el-form-item>
            <el-form-item label="Permission" prop="permission">
              <el-select v-model="admin.permissions" style="width: 100%" >
                <el-option
                  v-for="item in rolesList"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div style="text-align:right;">
            <el-button
              type="primary"
              size="small"
              @click="createAdmin"
            >
              Confirm
            </el-button>
          </div>
        </el-dialog>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { JSEncrypt } from 'jsencrypt'
import { pubKey } from '@/api/users'
import { Component, Vue } from 'vue-property-decorator'
import { cloneDeep } from 'lodash'
import { Tree } from 'element-ui'
import { deleteRoles, setRoles, getRoutes, getRoles, createRoles, getAdmins, deleteAdmin, createAdmin, editAdmin } from '@/api/roles'
import { ElForm } from 'element-ui/types/form'
import { IAdminList, IRolesList } from '@/api/types'
const sha256 = require('js-sha256').sha256

const defaultRole = {
  name: '',
  menus_id: [] as any[]
}
const defaultAdmin = {
  name: '',
  permissions: '',
  password: ''
}

@Component({
  name: 'accountSet'
})
export default class extends Vue {
  private role = Object.assign({}, defaultRole)
  private admin = Object.assign({}, defaultAdmin)
  private activeName = 'Permissions'
  private total = 0
  private adminTotal = 0
  private routesTreeData = [] // 树
  private rolesList:IRolesList[] = []
  private adminList = []
  private dialogVisible = false
  private dialogVisibleAdmin = false
  private checkStrictly = false
  private dialogType = 'new'
  private pk = ''

  private defaultProps = {
    children: 'children',
    label: 'title'
  }

  private rules = {
    name: [{
      required: true,
      trigger: 'blur'
    }],
    password: [{
      required: true,
      trigger: 'blur'
    }],
    permissions: [{
      required: true,
      trigger: 'blur'
    }]
  }

  private query = {
    page_no: 1,
    page_size: 50
  }

  private queryAdmin = {
    page_no: 1,
    page_size: 50
  }

  created() {
    this.getRoutes()
    this.getRoles()
  }

  private rsaData(data: string): string|boolean {
    const PUBLIC_KEY = this.pk
    const jsencrypt = new JSEncrypt()
    jsencrypt.setPublicKey(PUBLIC_KEY)
    const result = jsencrypt.encrypt(data)
    return result
  }

  private async getRoutes() {
    const data = await getRoutes({ /* Your params here */ })
    this.routesTreeData = data.menus
  }

  private confirmRole() {
    const isEdit = this.dialogType === 'edit'
    const checkedKeys = (this.$refs.tree as Tree).getCheckedKeys()
    this.role.menus_id = checkedKeys
    if (isEdit) {
      setRoles(this.role).then(() => {
        this.$message.success('Set successfully')
        this.dialogVisible = false
        this.getRoles()
      })
    } else {
      createRoles(this.role).then(() => {
        this.$message.success('Created successfully')
        this.dialogVisible = false
        this.getRoles()
      })
    }
  }
// ====  admin/user  ====

  private async getAdmins() {
    const params = this.queryAdmin
    const data = await getAdmins(params)
    this.adminList = data.users
    this.adminTotal = data.total
  }

  private createAdmin() {
    (this.$refs.admin as ElForm).validate((valid:boolean) => {
      if (valid) {
        this.$confirm('Are you sure about this operation', '', {
          confirmButtonText: 'Sure',
          cancelButtonText: 'No'
        }).then(async() => {
          this.dialogVisibleAdmin = false
          if (this.dialogType === 'edit') {
            const params = {
              user_code: this.admin.name,
              permissions: this.admin.permissions
            }
            editAdmin(params).then((res:any) => {
              this.$message.success('Changed successfully')
              this.getAdmins()
            })
          }
          if (this.dialogType === 'new') {
            const resData = await pubKey()
            if (resData && resData.pk) {
              this.pk = resData.pk
            }
            const params = JSON.parse(JSON.stringify(this.admin))
            params.password = this.rsaData(sha256(this.admin.password))
            createAdmin(params).then(() => {
              this.$message.success('created successfully')
              this.getAdmins()
            })
          }
        })
      }
    })
  }

  private handleCurrentChangeAdmin():void {
    this.getAdmins()
  }

  private handleEditAdmin(row:IAdminList) {
    this.dialogType = 'edit'
    this.checkStrictly = true
    this.dialogVisibleAdmin = true
    this.admin = cloneDeep(row)
  }

  private handleDeleteAdmin(row:IAdminList) {
    this.$confirm('Are you sure to delete ' + row.name, '', {
      confirmButtonText: 'confirm',
      cancelButtonText: 'cancel',
      type: 'warning'
    }).then(() => {
      const params = {
        name: row.name
      }
      deleteAdmin(params).then((res:any) => {
        if (res.code === 0) {
          this.$message.success('delete successfully')
          this.getAdmins()
        }
      })
    }).catch(() => {})
  }

  private handleCreateAdmin() {
    this.admin = Object.assign({}, defaultAdmin)
    this.dialogType = 'new'
    this.dialogVisibleAdmin = true
  }

// ====  role  ====







  private async getRoles() {
    const params = this.query
    const data = await getRoles(params)
    this.rolesList = data.roles
    this.total = data.total
  }

  private handleClick() {
    if (this.activeName === 'Permissions') {
      this.getRoles()
    }
    if (this.activeName === 'Administrator') {
      this.getAdmins()
    }
  }

  private handleCurrentChange():void {
    this.getRoles()
  }

  private handleCreateRole() {
    this.role = Object.assign({}, defaultRole)
    if (this.$refs.tree) {
      (this.$refs.tree as Tree).setCheckedKeys([])
    }
    this.dialogType = 'new'
    this.dialogVisible = true
  }

  private handleEditRole(row:IRolesList) {
    this.dialogType = 'edit'
    this.dialogVisible = true
    this.checkStrictly = true
    this.role = cloneDeep(row)
    this.$nextTick(() => {
      (this.$refs.tree as Tree).setCheckedKeys(row.menus_id)
      this.checkStrictly = false
    })
  }

  private handleDeleteRole(row:IRolesList) {
    this.$confirm('Are you sure to delete ' + row.name, '', {
      confirmButtonText: 'confirm',
      cancelButtonText: 'cancel',
      type: 'warning'
    }).then(() => {
      const params = {
        name: row.name
      }
      deleteRoles(params).then((res:any) => {
        if (res.code === 0) {
          this.$message.success('delete successfully')
          this.getRoles()
        }
      })
    }).catch(() => {})
  }
}
</script>

<style scoped lang="scss">
</style>
