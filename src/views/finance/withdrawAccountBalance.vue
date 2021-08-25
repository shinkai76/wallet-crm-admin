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
          prop="balance"
          label="Balance">
          <template slot-scope="scope">
            <span>{{ scope.row.balance || 0 }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="Deposit"
        >
          <template slot-scope="scope">
            <span class="blue--text" @click="openDialog(scope.row)">Deposit</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="currentToken + ' Deposit'"
               :visible.sync="showDialog"
               center
               width="640px"
    >
      <div class="dialog-content">
        <div>address</div>
        <div>{{ address }}</div>
        <div class="blue--text"
             @click="showCopyText = true"
             @mouseleave="showCopyText = false"
             v-clipboard:copy="address"
        >
          <el-tooltip :content="showCopyText?'Copied': 'Click copy'"
                      placement="bottom">
            <el-button size="small" type="primary">Copy</el-button>
          </el-tooltip>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { ICollectAccountListData } from '@/api/types'
import { withdrawalAccount } from '@/api/users'

@Component({
  name: 'withdrawAccountBalance'
})
export default class extends Vue {
  private loading = false
  private tableData = []
  private address = ''
  private showDialog = false
  private showCopyText = false
  private currentToken = ''

  created() {
    this.init()
  }

  private init() {
    this.getData()
  }

  private getData() {
    this.loading = true
    withdrawalAccount().then((res:any) => {
      this.tableData = res.accounts
    }).finally(() => {
      this.loading = false
    })
  }

  private openDialog(row: ICollectAccountListData): void {
    this.showDialog = true
    this.currentToken = row.token
    this.address = row.address
  }
}
</script>

<style scoped lang="scss">
.dialog-content {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding-bottom: 20px;
}
</style>
