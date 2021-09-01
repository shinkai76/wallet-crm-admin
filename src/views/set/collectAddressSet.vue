<template>
  <div class="page-container">
    <div class="table-wrap">
      <el-table
        v-loading="loading"
        :data="tableData"
        highlight-current-row>
        <el-table-column
          fixed
          prop="token"
          label="Token">
        </el-table-column>
        <el-table-column
          prop="address"
          label="Cold Wallet address">
        </el-table-column>
        <el-table-column
          label="Set"
        >
          <template slot-scope="scope">
            <span class="blue--text" @click="openDialog(scope.row)">Set</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="currentToken + ' Set'"
               :visible.sync="showDialog"
               center
               width="460px"
               :before-close="closeSetDialog"
    >
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="" prop="address">
          <el-input v-model="form.address" placeholder="Cold Wallet address"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 100%" @click="submitForm('form')">Set</el-button>
        </el-form-item>
      </el-form>

      <el-dialog
        width="460px"
        title="Confirm"
        :visible.sync="showInnerDialog"
        append-to-body>
        <el-form :model="confirmForm" :rules="rules" ref="confirmForm">
          <el-form-item label="" prop="password">
            <el-input v-model="confirmForm.password"
                      type="password"
                      placeholder="Verify Password"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"
                       style="width: 100%"
                       @click="onConfirm('confirmForm')"
            >Submit</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { JSEncrypt } from 'jsencrypt'
import { Component, Vue } from 'vue-property-decorator'
import { IFeeProfitListData } from '@/api/types'
import { collectAddressSet, collectAddressList, pubKey, authPwdVerify } from '@/api/users'
import { ElForm } from 'element-ui/types/form'
const sha256 = require('js-sha256').sha256

@Component({
  name: 'collectAddressSet'
})
export default class extends Vue {
  private loading = false
  private tableData = []
  private showDialog = false
  private showInnerDialog = false
  private currentToken = ''
  private pk = ''

  private form = {
    address: ''
  }

  private confirmForm = {
    password: ''
  }

  private query = {
    page_no: 1,
    page_size: 10
  }

  private rules = {
    address: [
      { required: true, message: 'required', trigger: 'blur' }
    ],
    password: [
      { required: true, message: 'required', trigger: 'blur' }
    ]
  }

  created() {
    this.init()
  }

  private init() {
    this.getData()
  }

  private getData() {
    this.loading = true
    collectAddressList(this.query).then((res:any) => {
      this.tableData = res.Address
    }).finally(() => {
      this.loading = false
    })
  }

  private openDialog(row: IFeeProfitListData): void {
    this.showDialog = true
    this.currentToken = row.token
  }

  private submitForm(name:string) {
    (this.$refs[name] as ElForm).validate((valid:boolean) => {
      if (valid) {
        this.confirmForm.password = ''
        this.$confirm('Are you sure about this operation', '', {
          confirmButtonText: 'Sure',
          cancelButtonText: 'No'
        }).then(() => {
          this.showInnerDialog = true
        }).catch(() => {
          this.showDialog = false
          this.form.address = ''
        })
      }
    })
  }

  private onConfirm(name:string) {
    (this.$refs[name] as ElForm).validate(async(valid:boolean) => {
      if (!valid) return
      const resData = await pubKey()
      if (resData && resData.pk) {
        this.pk = resData.pk
      }
      const params = JSON.parse(JSON.stringify(this.confirmForm))
      params.password = this.rsaData(sha256(this.confirmForm.password))

      authPwdVerify(params).then(() => {
        this.onSet()
        this.showInnerDialog = false
      })
    })
  }

  private onSet() {
    const params = {
      address: this.form.address,
      token: this.currentToken
    }
    collectAddressSet(params).then(() => {
      this.$message.success('Set successfully')
      this.getData()
      this.showDialog = false
      this.showInnerDialog = false
    })
  }

  private closeSetDialog() {
    this.showDialog = false
    const form = (this.$refs.form as ElForm)
    form.resetFields()
  }

  private rsaData(data: string): string|boolean {
    const PUBLIC_KEY = this.pk
    const jsencrypt = new JSEncrypt()
    jsencrypt.setPublicKey(PUBLIC_KEY)
    const result = jsencrypt.encrypt(data)
    return result
  }
}
</script>

<style scoped lang="scss">
</style>
