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
import { feeProfit } from '@/api/users'

@Component({
  name: 'collectAddressSet'
})
export default class extends Vue {
  private loading = false
  private tableData = []
  private showDialog = false
  private showInnerDialog = false
  private currentToken = ''

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
    // TODO 差接口
    // feeProfit().then(res => {
    //   this.tableData = res.data.fee_profits
    // }).finally(()=> {
    //   this.loading = false
    // })
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
        })
      }
    })
  }

  private onConfirm(name) {
    this.$refs[name].validate((valid) => {
      if (valid) {
        // TODO 差接口
        this.showInnerDialog = false
      }
    })
  }

  private closeSetDialog() {
    this.showDialog = false
    this.$refs.form.resetFields()
  }
}
</script>

<style scoped lang="scss">
</style>
