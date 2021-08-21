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
        Administrator
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import path from 'path'
import { Component, Vue } from 'vue-property-decorator'
import { cloneDeep } from 'lodash'
import { Tree } from 'element-ui'
import { deleteRoles, setRoles, getRoutes, getRoles, createRoles } from '@/api/roles'
const defaultRole = {
  name: '',
  menus_id: []
}

@Component({
  name: 'accountSet'
})
export default class extends Vue{
  private role = Object.assign({}, defaultRole)
  private activeName = 'Permissions'
  private total:number = 0
  private routesTreeData = [] // 树
  private rolesList = []
  private dialogVisible = false
  private checkStrictly = false
  private dialogType = 'new'
  private defaultProps = {
    children: 'children',
    label: 'title'
  }

  private query = {
    page_no: 1,
    page_size: 50
  }

  created() {
    this.getRoutes()
    this.getRoles()

  }

  private async getRoutes() {
    const { data } = await getRoutes({ /* Your params here */ })
    this.routesTreeData = data.menus
  }

  private confirmRole() {
    const isEdit = this.dialogType === 'edit'
    let checkedKeys = (this.$refs.tree as Tree).getCheckedKeys()
    console.log(checkedKeys)
    this.role.menus_id = checkedKeys
    if (isEdit)
      setRoles( this.role ).then(res=> {
        this.$message.success('Set successfully')
        this.dialogVisible = false
        this.getRoles()
      })
    else
      createRoles( this.role ).then(res=> {
        this.$message.success('Created successfully')
        this.dialogVisible = false
        this.getRoles()
      })
  }









  private async getRoles() {
    const params = this.query
    const { data } = await getRoles(params)
    this.rolesList = data.roles
  }

  private handleClick(tab, event) {
    if (this.activeName === 'Permissions') {
      this.getRoles()
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

  private handleEditRole(row) {
    this.dialogType = 'edit'
    this.dialogVisible = true
    this.checkStrictly = true
    this.role = cloneDeep(row)
    this.$nextTick(() => {
      (this.$refs.tree as Tree).setCheckedKeys(row.menus_id)
      this.checkStrictly = false
    })
  }

  private handleDeleteRole(row) {
    this.$confirm('Are you sure to delete ' +row.name, '', {
      confirmButtonText: 'confirm',
      cancelButtonText: 'cancel',
      type: 'warning'
    }).then(() => {
      let params = {
        name:row.name
      }
      deleteRoles(params).then(res=> {
        if (res.code == 0) {
          this.$message.success('delete successfully')
          this.getRoles()
        }
      })
    }).catch(() => {

    });
  }
}
</script>

<style scoped lang="scss">
</style>
