<template>
  <div class="page-container">
    <div class="actions-wrap">
      <el-select v-model="query.token" placeholder="" class="mr-2">
        <el-option value="" label="ALL">ALL</el-option>
        <el-option
          v-for="item in tokens"
          :key="item.id"
          :label="item.name"
          :value="item.name">
        </el-option>
      </el-select>
      <el-button type="primary" @click="onSearch">Search</el-button>
    </div>

    <div class="table-wrap">
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
          prop="user_code"
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
          prop="processing_time"
          label="Processing time"
        >
        <template slot-scope="scope">
          <span>{{ scope.row.processing_time | formatTime }}</span>
        </template>
        </el-table-column>
        <el-table-column
          prop="token"
          label="Token"
        >
        </el-table-column>
        <el-table-column
          prop="withdrawal_type"
          label="Withdrawal Type"
        >
        </el-table-column>
        <el-table-column
          prop="fee"
          label="Fee"
        >
        </el-table-column>
        <el-table-column
          prop="to"
          label="Withdrawal address"
        >
        </el-table-column>
        <el-table-column
          prop="chain_fee"
          label="Chain Fee"
          width="120">
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
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { IHistoryListData } from '@/api/types'
import { getWithdrawList, tokenList } from '@/api/users'
@Component({
  name: 'history'
})
export default class extends Vue {
  private loading = false
  private total = 0
  private tableData:IHistoryListData[] = []
  private tokens = []

  private query = {
    page_no: 1,
    page_size: 50,
    status: 1,
    token: ''
  }

  created() {
    this.getData()
    this.getTokens()
  }

  @Watch('query.token')
  private resetQuery() {
    this.query.page_no = 1
  }

  private getData():void {
    this.loading = true
    const params = this.query
    getWithdrawList(params).then((res:any) => {
      this.tableData = res.records
    }).finally(() => {
      this.loading = false
    })
  }

  private getTokens():void {
    const params = {
      proto: ''
    }
    tokenList(params).then((res:any) => {
      this.tokens = res.tokens
    })
  }

  private onSearch():void {
    this.getData()
  }

  private handleCurrentChange():void {
    this.getData()
  }
}
</script>

<style scoped>

</style>
