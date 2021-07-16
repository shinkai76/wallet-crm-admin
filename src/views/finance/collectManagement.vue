<template>
  <div class="page-container">
    <div class="actions-wrap">
      <el-button type="primary" @click="openCollect">Collect</el-button>
    </div>
    <div class=table-wrap>
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        highlight-current-row>
        <el-table-column
          prop="application_time"
          label="Application time">
          <template slot-scope="scope">
            <span>{{ scope.row.application_time | formatTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="token"
          label="Token">
        </el-table-column>
        <el-table-column
          prop="type"
          label="Type"
          width="120">
        </el-table-column>
        <el-table-column
          prop="quantity"
          label="Collect quantity"
          width="120">
        </el-table-column>
        <el-table-column
          prop="cost"
          label="Chain cost"
          width="120">
        </el-table-column>
        <el-table-column
          prop="states"
          label="States"
          width="120">
          <template slot-scope="scope">
            <span></span>
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
    <el-dialog title="Collect" :visible.sync="showCollect">
      <el-select v-model="token" placeholder="Token" clearable>
        <el-option :value="item" v-for="item in 10" :key=item></el-option>
      </el-select>
        <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onCollect">Collect</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { ICollectListData } from '@/api/types'
import { collectList, collect } from '@/api/users'

enum STATE {
  watting = 1,
  successful = 2,
  failed = 3
}

@Component({
  name: 'collectManagement'
})
export default class extends Vue {
  private showCollect = false
  private token:string = ''
  private tableData:ICollectListData[] = []
  private loading = false
  private total = 0

  private init() {
    this.getData()
  }

  private query = {
    page_no: 1,
    page_size: 50
  }

  private getData() {
    this.loading = true
    const params = this.query
    collectList(params).then(res => {
      console.log(res)
      this.tableData = res.data
    }).finally(() => {
      this.loading = false
    })
  }

  private openCollect() {
    this.showCollect = true
  }

  private onCollect() {
    const params = {
      token: this.token
    }
    collect(params).then(res => {
      this.showCollect = false
      this.query.page_no = 1
      this.getData()
    })
  }

  private handleCurrentChange():void {
    this.getData()
  }
}
</script>
