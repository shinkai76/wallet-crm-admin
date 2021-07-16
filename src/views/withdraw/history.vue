<template>
  <div class="page-container">
    <div class="actions-wrap">
      <el-select v-model="query.filter" placeholder="" class="mr-2">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
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
import { Component, Vue, Watch} from 'vue-property-decorator'
import { IHistoryListData } from '@/api/types'
import { getHistoryList } from '@/api/users'
@Component({
  name: 'history'
})
export default class extends Vue {
  private loading = false
  private total = 0
  private tableData:IHistoryListData[] = []
  private options:[] = []

  private query = {
    page_no: 1,
    page_size: 50,
    filter: ''
  }

  created() {
    this.getData()
  }

  @Watch('query.filter')
  private resetQuery() {
    this.query.page_no = 1
  }

  private getData():void {
    this.loading = true
    const params = this.query
    getHistoryList(params).then(res => {
      this.tableData = res.data
    }).finally(() => {
      this.loading = false
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
