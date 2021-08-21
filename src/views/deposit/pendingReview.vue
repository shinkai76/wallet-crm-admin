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
        label="Order">
      </el-table-column>
      <el-table-column
        prop="account"
        label="Account">
      </el-table-column>
      <el-table-column
        prop="deposit_time"
        label="Deposit time"
      >
      <template slot-scope="scope">
        <span>{{ scope.row.deposit_time | formatTime }}</span>
      </template>
      </el-table-column>
      <el-table-column
        prop="token"
        label="Token"
      >
      </el-table-column>
      <el-table-column
        prop="deposit_type"
        label="Deposit Type"
      >
      </el-table-column>
      <el-table-column
        prop="deposit_quantity"
        label="Deposit quantity"
      >
      </el-table-column>
      <el-table-column
        prop="from"
        label="From"
        width="120">
      </el-table-column>
      <el-table-column
        prop=""
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
import { IPendingListData } from '@/api/types'
import { approve, depositApprove, getDepositList } from '@/api/users'
@Component({
  name: 'pendingReview'
})
export default class extends Vue {
  private loading = false
  private total = 0
  private tableData:IPendingListData[] = []

  private query = {
    page_no: 1,
    page_size: 50,
    status: 0
  }

  private resultDialogVisible:boolean = false
  private result:string = ''

  created() {
    this.getData()
  }

  private getData():void {
    this.loading = true
    const params = this.query
    getDepositList(params).then(res => {
      console.log(res)
      this.total = res.data.total
      this.tableData = res.data.records
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
    depositApprove(params).then(res => {
      if (res.code == 0) {
        this.$message.success('Execute successfully')
        this.query.page_no = 1
        this.getData()
        return
      }
      this.resultDialogVisible = true
      if (res.code === '100600') {
        this.result = 'withdrawal account balance is not enough'
      }
    }).finally(() => {
      this.loading = false
    })
  }

  private onSet(index:any, row:IPendingListData):void {
    this.secondConfirm(row.code)
  }
}
</script>

<style scoped>

</style>
