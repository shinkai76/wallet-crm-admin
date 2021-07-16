<template>
  <div class="page-container">
    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      highlight-current-row>
      <el-table-column
        fixed
        prop="order"
        label="Order">
      </el-table-column>
      <el-table-column
        prop="account"
        label="Account">
      </el-table-column>
      <el-table-column
        prop="application_time"
        label="Application time"
      >
      <template slot-scope="scope">
        <span>{{ scope.row.application_time | formatTime }}</span>
      </template>
      </el-table-column>
      <el-table-column
        prop="token"
        label="Token"
      >
      </el-table-column>
      <el-table-column
        prop="type"
        label="Withdrawal Type"
      >
      </el-table-column>
      <el-table-column
        prop="fee"
        label="Fee"
      >
      </el-table-column>
      <el-table-column
        prop="address"
        label="Withdrawal address"
      >
      </el-table-column>
      <el-table-column
        prop=""
        label="Set"
        width="120">
        <template slot-scope="scope">
          <i class="el-icon-s-tools" @click="onSet(scope.$index, scope.row)"></i>
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
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { IPendingListData } from '@/api/types'
import { approve, getPendingList } from '@/api/users'
@Component({
  name: 'pendingReview'
})
export default class extends Vue {
  private loading = false
  private total = 0
  private tableData:IPendingListData[] = []

  private query = {
    page_no: 1,
    page_size: 50
  }

  created() {
    this.getData()
  }

  private getData():void {
    this.loading = true
    const params = this.query
    getPendingList(params).then(res => {
      this.tableData = res.data
    }).finally(() => {
      this.loading = false
    })
  }

  private secondConfirm(order:string) {
    this.$confirm('Are you sure about this operation', '', {
      confirmButtonText: 'Sure',
      cancelButtonText: 'No'
    }).then(() => {
      this.onApprove(order)
    })
  }

  private handleCurrentChange():void {
    this.getData()
  }

  private onApprove(order:string) {
    const params = { order }
    this.loading = true
    approve(params).then(res => {
      this.query.page_no = 1
      this.getData()
    }).finally(() => {
      this.loading = false
    })
  }

  private onSet(index:any, row:IPendingListData):void {
    this.secondConfirm(row.order)
  }
}
</script>

<style scoped>

</style>
