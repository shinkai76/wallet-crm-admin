<template>
  <div class="page-container">
    <div class="table-wrap">
      <el-table
        height="720px"
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        highlight-current-row>
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
      <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="resultDialogVisible = false">OK</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { IWithdrawPendingListData } from '@/api/types'
import { approve, getWithdrawList } from '@/api/users'
@Component({
  name: 'pendingReview'
})
export default class extends Vue {
  private loading = false
  private total = 0
  private tableData = []

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

  private secondConfirm(code:string) {
    this.$confirm('Are you sure about this operation', '', {
      confirmButtonText: 'Sure',
      cancelButtonText: 'No'
    }).then(() => {
      this.onApprove(code)
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
      }
    }).finally(() => {
      this.loading = false
    })
  }

  private onSet(index:any, row:IWithdrawPendingListData):void {
    this.secondConfirm(row.code)
  }
}
</script>

<style scoped>

</style>
