<template>
  <div class="page-container">
    <div class="actions-wrap">
      <el-input v-model.trim="address" class="input mr-2"
        placeholder="Email address"
      ></el-input>
      <el-select v-model="level" placeholder="Level" clearable class="mr-2">
        <el-option value=""></el-option>
        <el-option :value="item" v-for="item in 10" :key=item></el-option>
      </el-select>
      <el-button type="primary" @click="getData">Search</el-button>
    </div>
    <div class="table-wrap">
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        highlight-current-row>
        <el-table-column
          fixed
          prop="user_id"
          label="UserIO">
        </el-table-column>
        <el-table-column
          prop="email"
          label="Email"
          width="120">
        </el-table-column>
        <el-table-column
          prop="registration_time"
          label="Registration time"
          width="120">
        </el-table-column>
        <el-table-column
          label="Existing Assets"
          width="120">
          <template slot-scope="scope">
            <a href="" @click="openDialog(scope.row, 'ea')">View</a>
          </template>
        </el-table-column>
        <el-table-column
          label="Deposit records"
          width="120">
          <template slot-scope="scope">
           <a href="" @click="openDialog(scope.row, 'dr')">View</a>
          </template>
        </el-table-column>
        <el-table-column
          label="Withdrawal records"
          width="120">
          <template slot-scope="scope">
           <a href="" @click="openDialog(scope.row, 'wr')">View</a>
          </template>
        </el-table-column>
        <el-table-column
          label="Airdrop records"
          width="120">
          <template slot-scope="scope">
           <a href="" @click="openDialog(scope.row, 'ar')">View</a>
          </template>
        </el-table-column>
        <el-table-column
          prop="level"
          label="Level"
          width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.level">{{ scope.row.level }}
              <i class="el-icon-s-tools" @click="editRow(scope.$index, scope.row)"></i>
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

      <el-dialog title="Existing  Assets" :visible.sync="dialogVisiable.ea">
        <el-table :data="existingAssetsData">
          <el-table-column property="token" label="Token"></el-table-column>
          <el-table-column property="quantity" label="Quantity"></el-table-column>
        </el-table>
      </el-dialog>
      <el-dialog title="Deposit records" :visible.sync="dialogVisiable.dr">
        <el-table :data="depositData">
          <el-table-column property="token" label="Token"></el-table-column>
          <el-table-column property="quantity" label="Quantity"></el-table-column>
        </el-table>
        <el-pagination
          class="pagination-container"
          @current-change="handleDialogoCurrentChange"
          :current-page.sync="dialogSearchQuery.page_no"
          :page-size="dialogSearchQuery.page_size"
          layout="prev, pager, next, jumper"
          :total="dialogTotal">
        </el-pagination>
      </el-dialog>
      <el-dialog title="Withdrawal records" :visible.sync="dialogVisiable.wr">
        <el-table :data="withdrawData">
          <el-table-column property="time" label="Time"></el-table-column>
          <el-table-column property="token" label="Token"></el-table-column>
          <el-table-column property="quantity" label="Quantity"></el-table-column>
          <el-table-column property="fee" label="Fee"></el-table-column>
          <el-table-column property="to_address" label="To address"></el-table-column>
        </el-table>
      </el-dialog>
      <el-dialog title="Airdrop records" :visible.sync="dialogVisiable.ar">
        <el-table :data="airdropData">
          <el-table-column property="time" label="Time"></el-table-column>
          <el-table-column property="token" label="Token"></el-table-column>
          <el-table-column property="quantity" label="Quantity"></el-table-column>
          <el-table-column property="fee" label="Fee"></el-table-column>
          <el-table-column property="to_address" label="To address"></el-table-column>
        </el-table>
      </el-dialog>
      <el-dialog title="Level" :visible.sync="dialogVisiable.level">
        <el-select v-model="userLevel" placeholder="Level" clearable>
          <el-option value="0" label="no level"></el-option>
          <el-option :value="item" v-for="item in 10" :key=item></el-option>
        </el-select>
         <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="onModifyLevel">OK</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { ICustomerData, IWithdrawData, IAirdropData, IExistingAssetsData, IDepositData } from '@/api/types'
import { customerList, modifyLevel, getDRData, getWRData, getARData } from '@/api/users'

@Component({
  name: 'customerList'
})
export default class extends Vue {
  private loading = false
  private total = 0
  private level:number | string = ''
  private address = ''
  private tableData:ICustomerData[] = []
  private withdrawData:IWithdrawData[] = []
  private airdropData:IAirdropData[] = []
  private existingAssetsData:IExistingAssetsData[] = []
  private depositData:IDepositData[] = []
  private currentUserInfo!:ICustomerData
  private userLevel = ''
  private dialogVisiable: { [key: string]: boolean } = {
    ea: false,
    dr: false,
    wr: false,
    ar: false,
    level: false
  }

  private searchQuery = {
    address: '',
    level: '',
    page_no: 1,
    page_size: 15
  }

  private dialogSearchQuery = {
    user_id: '',
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
    customerList(params).then(res => {
      console.log(res)
    }).finally(() => {
      this.loading = false
    })
  }

  private getDialogData() {
    const map = new Map([
      ['dr', getDRData],
      ['wr', getWRData],
      ['ar', getARData]
    ])
    const params = this.dialogSearchQuery
    if (!map.has(this.dialogType)) return
    map.get(this.dialogType)(params).then(res => {
      console.log(res)
    })
  }

  private openDialog(row:ICustomerData, type:string):void {
    this.currentUserInfo = row
    this.dialogType = type
    this.dialogVisiable[type] = true
    this.getDialogData()
  }

  private onModifyLevel():void {
    const params = {
      level: this.userLevel,
      user_id: this.currentUserInfo.user_id
    }
    modifyLevel(params).then(res => {
      console.log(res)
      this.dialogVisiable.level = false
    })
  }

  private editRow(index, row:ICustomerData):void {
    this.currentUserInfo = row
    this.dialogSearchQuery.user_id = row.user_id
    this.dialogSearchQuery.page_no = 1
  }

  private handleCurrentChange():void {
    this.getData()
  }

  private handleDialogoCurrentChange():void {
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
