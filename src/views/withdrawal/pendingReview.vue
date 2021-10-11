<template>
  <div class="page-container">
    <div class="btns-wrap">
      <el-button type="primary" @click="onMultiAction">Approve</el-button>
    </div>
    <div class="table-wrap">
      <el-table
        height="720px"
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        highlight-current-row
      >
      <el-table-column
          fixed
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          fixed
          prop="id"
          width="100"
          label="Order">
        </el-table-column>
        <el-table-column
          prop="user_code"
          label="Account">
        </el-table-column>
        <el-table-column
          prop="application_time"
          label="Application time"
          width="170"
        >
        <template slot-scope="scope">
          <span>{{ scope.row.application_time | formatTime }}</span>
        </template>
        </el-table-column>
        <el-table-column
          prop="token"
          label="Token"
          width="150"
        >
        </el-table-column>
        <el-table-column
          prop="withdrawal_type"
          label="Withdrawal Type"
          width="150"
        >
        </el-table-column>
        <el-table-column
          prop="amount"
          label="Withdrawal quantity"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.amount }} {{ scope.row.token }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="fee"
          label="Fee"
        >
        </el-table-column>
        <el-table-column
          prop="to"
          label="Withdrawal address"
          width="400"
        >
        </el-table-column>
        <el-table-column
          prop=""
          fixed="right"
          label="Set"
          width="120">
          <template slot-scope="scope">
            <span class="blue--text" @click="onSet(scope.$index, scope.row)">Approve</span>
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
    </div>
    <el-dialog
      :visible.sync="resultDialogVisible"
      width="400px"
      center>
      <span>{{ result }}</span>
      <div v-if="failedResults.length" class="failedResults">
        <div v-for="item in failedResults" :key="item.id">
          <div>{{ item.id }}</div>
          <div>{{ item.err_msg }}</div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="resultDialogVisible = false">OK</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { IWithdrawPendingListData } from '@/api/types'
import { approve, getWithdrawList, approveMulti } from '@/api/users'
@Component({
  name: 'pendingReview'
})
export default class extends Vue {
  private loading = false
  private total = 0
  private tableData = []
  private multipleSelection: IWithdrawPendingListData[] | [] = []
  private failedResults = []

  private query = {
    page_no: 1,
    page_size: 10,
    status: 0
  }

  private resultDialogVisible = false
  private result = ''

  created() {
    this.getData()
  }

  private getData():void {
    this.loading = true
    const params = this.query
    getWithdrawList(params).then((res:any) => {
      this.tableData = res.records
      this.total = res.total
    }).finally(() => {
      this.loading = false
    })
  }

  private handleSelectionChange(val:IWithdrawPendingListData[] | []) {
    this.multipleSelection = val
  }

  private secondConfirm(code?:string) {
    this.$confirm('Are you sure about this operation', '', {
      confirmButtonText: 'Sure',
      cancelButtonText: 'No'
    }).then(() => {
      if (typeof code === 'string') {
        this.onApprove(code)
      } else {
        this.onApproveMulti()
      }
    })
  }

  private handleCurrentChange():void {
    this.getData()
  }

  private onApprove(code:string) {
    const params = { code }
    this.loading = true
    approve(params).then(() => {
      this.$message.success('Execute successfully')
      this.query.page_no = 1
      this.getData()
    }).catch((res) => {
      console.log('catch', res)
      if (res && res.code === '100600') {
        this.resultDialogVisible = true
        this.result = 'withdrawal account balance is not enough'
      } else {
        this.result = 'failed'
      }
    }).finally(() => {
      this.loading = false
    })
  }

  private onApproveMulti() {
    const codes:string[] = []
    const ids:number[] = []
    this.multipleSelection.forEach((el:IWithdrawPendingListData) => {
      codes.push(el.code)
      ids.push(el.id)
    })

    const params = {
      codes,
      ids,
      user_code: localStorage.getItem('code') || ''
    }
    this.loading = true
    approveMulti(params).then((res:any) => {
      // 处理成功和失败
      if (res.failed_count === 0) {
        this.$message.success('Execute successfully')
      } else {
        this.resultDialogVisible = true
        this.result = `${res.total - res.failed_count} were executed successfully, and ${res.failed_count} failed.`
        this.failedResults = res.fail_result
      }
      this.query.page_no = 1
      this.getData()
    }).finally(() => {
      this.loading = false
    })
  }

  private onSet(index:any, row:IWithdrawPendingListData):void {
    this.secondConfirm(row.code)
  }

  private onMultiAction():void {
    this.multipleSelection.length && this.secondConfirm()
  }
}
</script>

<style scoped>

</style>
