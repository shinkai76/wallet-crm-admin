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
import { Component, Vue } from 'vue-property-decorator'
import { IFeeProfitListData } from '@/api/types'
import { collectAddressSet, collectAddressList, pubKey, authPwdVerify } from '@/api/users'
const sha256 = require('js-sha256').sha256
import { JSEncrypt } from 'jsencrypt'

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

  private rules = {
    address: [
      {required: true, message: 'required', trigger: 'blur'}
    ],
    password: [
      {required: true, message: 'required', trigger: 'blur'}
    ],
  }

  created() {
    this.init()
  }

  private init() {
    this.getData()
  }

  private getData() {
    this.loading = true
    collectAddressList().then(res => {
      this.tableData = res.data.Address
    }).finally(()=> {
      this.loading = false
    })
  }

  private openDialog(row: IFeeProfitListData): void {
    this.showDialog = true
    this.currentToken = row.token
  }

  private submitForm(name) {
    this.$refs[name].validate((valid) => {
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
        });
      }
    })
  }

  private onConfirm(name) {
    this.$refs[name].validate(async (valid) => {
      if (!valid) return
      const resData = await pubKey()
      if (resData && resData.code === 0) {
        this.pk = resData.data.pk
      }
      const params = JSON.parse(JSON.stringify(this.confirmForm))
      params.password = this.rsaData(sha256(this.confirmForm.password))

      authPwdVerify(params).then(res=> {
        this.onSet()
        this.showInnerDialog = false
      })
    })
  }

  private onSet() {
    let params = {
      address: this.form.address,
      token: this.currentToken
    }
    collectAddressSet(params).then(res=> {
      this.$message.success('Set successfully')
      this.showDialog = false
      this.showInnerDialog = false
    })
  }

  private closeSetDialog() {
    this.showDialog = false
    this.$refs.form.resetFields()
  }

  private rsaData(data: string): string|boolean {
    const PUBLIC_KEY = this.pk
    let jsencrypt = new JSEncrypt()
    jsencrypt.setPublicKey(PUBLIC_KEY)
    let result = jsencrypt.encrypt(data)
    return result
  }

}
</script>

<style scoped lang="scss">
</style>
