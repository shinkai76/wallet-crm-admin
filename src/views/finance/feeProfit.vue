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
          prop="balance"
          label="Balance">
          <template slot-scope="scope">
            <span>{{ scope.row.balance || 0 }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="Withdraw"
        >
          <template slot-scope="scope">
            <span class="blue--text" @click="openDialog(scope.row)">Withdraw</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="currentToken + ' Withdraw'"
               :visible.sync="showDialog"
               center
               width="460px"
               :before-close="closeWithdrawDialog"
    >
      <el-form :model="withdrawForm" :rules="rules" ref="withdrawForm" class="demo-ruleForm">
        <el-form-item label="" prop="address">
          <el-input v-model="withdrawForm.address" placeholder="address"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 100%" @click="submitForm('withdrawForm')">Withdraw</el-button>
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
import { JSEncrypt } from 'jsencrypt'
import { Component, Vue } from 'vue-property-decorator'
import { IFeeProfitListData } from '@/api/types'
import { authPwdVerify, feeProfit, profitWithdrawal, pubKey } from '@/api/users'
import { ElForm } from 'element-ui/types/form'
const sha256 = require('js-sha256').sha256

@Component({
  name: 'feeProfit'
})
export default class extends Vue {
  private loading = false
  private tableData = []
  private showDialog = false
  private showInnerDialog = false
  private currentToken = ''
  private currentId = 0
  private pk = ''

  private withdrawForm = {
    address: ''
  }

  private confirmForm = {
    password: ''
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
    feeProfit().then((res:any) => {
      this.tableData = res.data.fee_profits
    }).finally(() => {
      this.loading = false
    })
  }

  private openDialog(row: IFeeProfitListData): void {
    this.showDialog = true
    this.currentToken = row.token
    this.currentId = row.id
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
        this.onWithdrawal()
        this.showInnerDialog = false
      })
    })
  }

  private rsaData(data: string): string|boolean {
    const PUBLIC_KEY = this.pk
    const jsencrypt = new JSEncrypt()
    jsencrypt.setPublicKey(PUBLIC_KEY)
    const result = jsencrypt.encrypt(data)
    return result
  }

  private onWithdrawal() {
    const params = {
      to_address: this.withdrawForm.address,
      id: this.currentId,
      user_code: localStorage.getItem('code') || ''
    }
    profitWithdrawal(params).then(() => {
      this.$message.success('Withdraw successfully')
    })
  }

  private closeWithdrawDialog() {
    this.showDialog = false
    const form = (this.$refs.withdrawForm as ElForm)
    form.resetFields()
  }
}
</script>

<style scoped lang="scss">
</style>
