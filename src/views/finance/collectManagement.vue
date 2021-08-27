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
          label="Type">
        </el-table-column>
        <el-table-column
          prop="collect_quantity"
          label="Collect quantity">
        </el-table-column>
        <el-table-column
          prop="chain_cost"
          label="Chain cost">
        </el-table-column>
        <el-table-column
          prop="status"
          label="States">
          <template slot-scope="scope">
            <span :class="'status-' + scope.row.status">{{STATE[scope.row.status]}}

            <el-tooltip v-show="Number(scope.row.status) === 3" class="item" effect="dark" :content="scope.row.remark" placement="top-start">
              <i class="el-icon-warning"></i>
        </el-tooltip>
            </span>
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
    <el-dialog title="Collect" :visible.sync="showCollect" width="400px">
      <el-select v-model="token" placeholder="Token" style="width: 100%">
        <el-option
          v-for="item in tokens"
          :key="item.id"
          :label="item.name + ' ' + item.proto"
          :value="item.id">
        </el-option>
      </el-select>
        <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onCollect">Collect</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { ICollectListData, ITokenQuery } from '@/api/types'
import { collectList, collect, tokenList } from '@/api/users'

@Component({
  name: 'collectManagement'
})
export default class extends Vue {
  private showCollect = false
  private token = ''
  private tableData:ICollectListData[] = []
  private loading = false
  private total = 0
  private tokens:ITokenQuery[] = []

  private STATE = {
    0: 'waiting',
    1: 'successful',
    2: 'ongoing',
    3: 'failed'
  }

  created() {
    this.init()
  }

  private init() {
    this.getData()
    this.getTokens()
  }

  private query = {
    page_no: 1,
    page_size: 10
  }

  private getData() {
    this.loading = true
    const params = this.query
    collectList(params).then((res:any) => {
      this.tableData = res.list
    }).finally(() => {
      this.loading = false
    })
  }

  private openCollect() {
    this.showCollect = true
  }

  private getTokens(): void {
    const params = {
      proto: ''
    }
    tokenList(params).then((res:any) => {
      this.tokens = res.tokens
    })
  }

  private onCollect() {
    if (this.token == null || this.token == '') return
    this.secondConfirm()
  }

  private secondConfirm() {
    this.$confirm('Are you sure about this operation', '', {
      confirmButtonText: 'Sure',
      cancelButtonText: 'No'
    }).then(() => {
      this.onConfirmCollect()
    })
  }

  private onConfirmCollect() {
    const params = {
      token_id: this.token
    }
    collect(params).then(() => {
      this.$message.success('Collection successfully')
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

<style>
.status-0 {
  color: orange;
}
.status-1 {
  color: forestgreen;
}
.status-2 {
  color: orange;
}
.status-3 {
  color: orangered;
}
</style>
