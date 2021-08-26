<template>
  <div class="page-container">
    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      highlight-current-row>
      <el-table-column
        fixed
        prop="id"
        width="120"
        label="Order">
      </el-table-column>
      <el-table-column
        prop="account"
        width="180"
        label="Account">
      </el-table-column>
      <el-table-column
        prop="deposit_time"
        label="Deposit time"
        width="170"
      >
      <template slot-scope="scope">
        <span>{{ scope.row.deposit_time | formatTime }}</span>
      </template>
      </el-table-column>
      <el-table-column
        prop="token"
        label="Token"
        width="120"
      >
      </el-table-column>
      <el-table-column
        prop="deposit_type"
        label="Deposit Type"
        width="120"
      >
      </el-table-column>
      <el-table-column
        prop="deposit_quantity"
        label="Deposit quantity"
      >
      </el-table-column>
      <el-table-column
        prop="from"
        label="From">
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
import { IDepositPendingListData } from '@/api/types'
import { depositApprove, getDepositList } from '@/api/users'
@Component({
  name: 'pendingReview'
})
export default class extends Vue {
  private loading = false
  private total = 0
  private tableData = []

  private query = {
    page_no: 1,
    page_size: 50,
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
    getDepositList(params).then((res:any) => {
      this.total = res.total
      this.tableData = res.records
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
    depositApprove(params).then((() => {
      this.$message.success('Execute successfully')
      this.query.page_no = 1
      this.getData()
    }).catch((err:any) => {
      this.resultDialogVisible = true
      if (err.code === '100600') {
        this.result = 'withdrawal account balance is not enough'
      }
    }).finally(() => {
      this.loading = false
    })
  }

  private onSet(index:any, row:IDepositPendingListData):void {
    this.secondConfirm(row.code)
  }
}
</script>

<style scoped>

</style>
