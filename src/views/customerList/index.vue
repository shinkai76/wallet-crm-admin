<template>
  <div class="page-container">
    <div class="actions-wrap">
      <el-input v-model.trim="searchQuery.email" class="input mr-2"
        placeholder="Email address"
      ></el-input>
      <el-select v-model="searchQuery.level" placeholder="Level" class="mr-2">
        <el-option :value="item.value"
                   v-for="item in levels"
                   :key="item.value"
                   :label="item.text"
        ></el-option>
      </el-select>
      <el-button type="primary" @click="getData">Search</el-button>
    </div>
    <div class="table-wrap">
      <el-table
        v-loading="loading"
        :data="tableData"
        highlight-current-row>
        <el-table-column
          fixed
          width="120"
          prop="user_id"
          label="UserIO">
        </el-table-column>
        <el-table-column
          prop="email"
          label="Email">
        </el-table-column>
        <el-table-column
          prop="registration_time"
          label="Registration time">
          <template slot-scope="scope">
            <span>{{ scope.row.registration_time | formatTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="Existing Assets">
          <template slot-scope="scope">
            <span @click="openDialog(scope.row, 'ea')">View</span>
          </template>
        </el-table-column>
        <el-table-column
          label="Deposit records">
          <template slot-scope="scope">
           <span @click="openDialog(scope.row, 'dr')">View</span>
          </template>
        </el-table-column>
        <el-table-column
          label="Withdrawal records">
          <template slot-scope="scope">
           <span @click="openDialog(scope.row, 'wr')">View</span>
          </template>
        </el-table-column>
        <el-table-column
          label="Airdrop records">
          <template slot-scope="scope">
           <span @click="openDialog(scope.row, 'ar')">View</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="level"
          label="Level"
          width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.level">Lv {{ scope.row.level }}
              <i class="el-icon-s-tools pointer" @click="editRow(scope.$index, scope.row)"></i>
            </span>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        class="pagination-container"
        @current-change="handleCurrentChange"
        :current-page.sync="searchQuery.page_no"
        :page-size="searchQuery.page_size"
        layout="prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>

      <el-dialog title="Existing  Assets" :visible.sync="dialogVisible.ea">
        <el-table :data="existingAssetsData">
          <el-table-column property="name" label="Token"></el-table-column>
          <el-table-column property="num" label="Quantity"></el-table-column>
        </el-table>
      </el-dialog>
      <el-dialog title="Deposit records" :visible.sync="dialogVisible.dr">
        <el-table :data="depositData">
          <el-table-column property="deposit_time" label="Time">
            <template slot-scope="scope">
              <span>{{ scope.row.deposit_time | formatTime }}</span>
            </template>
          </el-table-column>
          <el-table-column property="coin" label="Token"></el-table-column>
          <el-table-column property="amount" label="Quantity"></el-table-column>
          <el-table-column property="from" label="From address"></el-table-column>
        </el-table>
        <el-pagination
          class="pagination-container"
          @current-change="handleDialogCurrentChange"
          :current-page.sync="dialogSearchQuery.page_no"
          :page-size="dialogSearchQuery.page_size"
          layout="prev, pager, next, jumper"
          :total="dialogTotal">
        </el-pagination>
      </el-dialog>
      <el-dialog title="Withdrawal records" :visible.sync="dialogVisible.wr">
        <el-table :data="withdrawData">
          <el-table-column property="time" label="Time">
            <template slot-scope="scope">
              <span>{{ scope.row.withdrawal_time | formatTime }}</span>
            </template>
          </el-table-column>
          <el-table-column property="token" label="Token"></el-table-column>
          <el-table-column property="amount" label="Quantity"></el-table-column>
          <el-table-column property="fee" label="Fee"></el-table-column>
          <el-table-column property="to" label="To address"></el-table-column>
        </el-table>
        <el-pagination
          class="pagination-container"
          @current-change="handleDialogCurrentChange"
          :current-page.sync="dialogSearchQuery.page_no"
          :page-size="dialogSearchQuery.page_size"
          layout="prev, pager, next, jumper"
          :total="dialogTotal">
        </el-pagination>
      </el-dialog>
      <el-dialog title="Airdrop records" :visible.sync="dialogVisible.ar">
        <el-table :data="airdropData">
          <el-table-column property="time" label="Time">
            <template slot-scope="scope">
              <span>{{ scope.row.airdrop_time | formatTime }}</span>
            </template>
          </el-table-column>
          <el-table-column property="token" label="Token"></el-table-column>
          <el-table-column property="amount" label="Quantity"></el-table-column>
        </el-table>
        <el-pagination
          class="pagination-container"
          @current-change="handleDialogCurrentChange"
          :current-page.sync="dialogSearchQuery.page_no"
          :page-size="dialogSearchQuery.page_size"
          layout="prev, pager, next, jumper"
          :total="dialogTotal">
        </el-pagination>
      </el-dialog>
      <el-dialog title="Level" :visible.sync="dialogVisible.level" width="330px">
        <el-select v-model="userLevel" placeholder="Level" clearable style="width: 100%">
          <el-option
            :value="item.value"
            v-for="item in levels.slice(1)"
            :key="item.value"
            :label="item.text"
          ></el-option>
        </el-select>
         <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="onModifyLevel">OK</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { ICustomerData } from '@/api/types'
import { modifyLevel, getEAData, getDRData, getWRData, getARData, userList } from '@/api/users'

@Component({
  name: 'customerList'
})
export default class extends Vue {
  private loading = false
  private total = 0
  private tableData = []
  private withdrawData = []
  private airdropData = []
  private existingAssetsData = []
  private depositData = []
  private currentUserInfo!:ICustomerData
  private userLevel = 0
  /**
   * @缩略
   * ea: Existing  Assets
   * dr: Deposit records
   * wr: Withdrawal records
   * ar: Airdrop records
   *
   */
  private dialogVisible: { [key: string]: boolean } = {
    ea: false,
    dr: false,
    wr: false,
    ar: false,
    level: false
  }

  private levels = [{
    value: -1,
    text: 'All levels'
  }, {
    value: 0,
    text: 'Level 0'
  }, {
    value: 1,
    text: 'Level 1'
  }, {
    value: 2,
    text: 'Level 2'
  }, {
    value: 3,
    text: 'Level 3'
  }, {
    value: 4,
    text: 'Level 4'
  }, {
    value: 5,
    text: 'Level 5'
  }, {
    value: 6,
    text: 'Level 6'
  }, {
    value: 7,
    text: 'Level 7'
  }, {
    value: 8,
    text: 'Level 8'
  }, {
    value: 9,
    text: 'Level 9'
  }, {
    value: 10,
    text: 'Level 10'
  }]

  private searchQuery = {
    email: '',
    level: -1,
    page_no: 1,
    page_size: 50
  }

  private dialogSearchQuery = {
    user_code: '',
    page_no: 1,
    page_size: 15
  }

  private dialogType = ''
  private dialogTotal = 110

  mounted() {
    this.init()
  }

  private init() {
    this.getData()
  }

  private getData() {
    this.loading = true
    const params = this.searchQuery
    userList(params).then((res:any) => {
      if (res.code === 0) {
        const { total, users } = res.data
        this.total = total
        this.tableData = users
      }
    }).finally(() => {
      this.loading = false
    })
  }

  private getDialogData() {
    const map = new Map([
      ['ea', '_getEAData'],
      ['dr', '_getDRData'],
      ['wr', '_getWRData'],
      ['ar', '_getARData']
    ])
    const params = this.dialogSearchQuery
    params.user_code = this.currentUserInfo.email
    if (!map.has(this.dialogType)) return
    const fn = map.get(this.dialogType)
    if (!fn) return
    this[fn]()
  }

  private _getEAData() {
    getEAData({ user_code: this.currentUserInfo.email }).then((res:any) => {
      this.existingAssetsData = res.data.assets
    })
  }

  private _getDRData() {
    const params = this.dialogSearchQuery
    params.user_code = this.currentUserInfo.email
    getDRData(params).then((res:any) => {
      this.depositData = res.data.records
      this.dialogTotal = res.data.total
    })
  }

  private _getWRData() {
    const params = this.dialogSearchQuery
    params.user_code = this.currentUserInfo.email
    getWRData(params).then((res:any) => {
      this.withdrawData = res.data.records
      this.dialogTotal = res.data.total
    })
  }

  private _getARData() {
    const params = this.dialogSearchQuery
    params.user_code = this.currentUserInfo.email
    getARData(params).then((res:any) => {
      this.airdropData = res.data.records
      this.dialogTotal = res.data.total
    })
  }

  private openDialog(row:ICustomerData, type:string):void {
    this.currentUserInfo = row
    this.dialogType = type
    this.dialogVisible[type] = true
    this.getDialogData()
  }

  private onModifyLevel():void {
    const params = {
      level: this.userLevel,
      user_code: this.currentUserInfo.user_code
    }
    modifyLevel(params).then((res:any) => {
      if (res.code === 0) {
        this.$message({
          message: 'Set successfully',
          type: 'success'
        })
        this.dialogVisible.level = false
      }
    })
  }

  private editRow(index:any, row:ICustomerData):void {
    this.currentUserInfo = row
    this.dialogSearchQuery.user_code = row.user_code
    this.dialogSearchQuery.page_no = 1
    this.dialogVisible.level = true
  }

  private handleCurrentChange():void {
    this.getData()
  }

  private handleDialogCurrentChange():void {
    this.getDialogData()
  }
}

</script>

<style scoped lang="scss">
.actions-wrap {

}

.table-wrap {

}
</style>
