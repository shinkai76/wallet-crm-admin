<template>
  <div class="page-container">
    <div class="btns-wrap">
      <el-button-group>
        <el-button :type="current === item? 'primary' : 'default'"
                   v-for="item in btns"
                   @click="refresh(item)"
        >{{ item }}</el-button>
      </el-button-group>
      <el-button type="primary" circle icon="el-icon-plus" @click="openAddDialog"></el-button>
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
          label="TokenID">
        </el-table-column>
        <el-table-column
          prop="name"
          label="Name">
        </el-table-column>
        <el-table-column
          prop="withdrawal_fee"
          :label="current +' Withdrawal Fee'"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.withdrawal_fee || 0 }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="internal_fee"
          label="Internal  Withdrawal  Fee"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.internal_fee || 0 }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="contract_address"
          label="Contract address"
        >
        </el-table-column>
        <el-table-column
          prop=""
          label="Set"
          width="120">
          <template slot-scope="scope">
            <i class="el-icon-s-tools" @click="editRow(scope.$index, scope.row)"></i>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog :title="settingDialogTitle" :visible.sync="showSettingDialog" center width="430px">
        <el-form ref="settingForm"
                  label-position='top'
                  :model="settingForm"
                  label-width="80px"
                  :rules="rules"
        >
          <el-form-item :label="current + ' Withdraw Fee'" prop="withdrawal_fee">
            <el-input class="input-width" v-model.trim="settingForm.withdrawal_fee"></el-input>
          </el-form-item>
          <el-form-item label="Internal Withdraw Fee" prop="internal_fee">
            <el-radio-group v-model="isNeedPay">
              <el-radio label="0">Free</el-radio>
              <el-radio label="1">Need pay</el-radio>
            </el-radio-group>
            <el-input class="input-width" v-show="isNeedPay === '1'" v-model.trim="settingForm.internal_fee"
            ></el-input>
          </el-form-item>
        </el-form>
         <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="onModifySet">OK</el-button>
        </span>
      </el-dialog>

      <el-dialog title="ADD" :visible.sync="showAddDialog">
        <el-form ref="settingForm"
                  label-position='top'
                  :model="addForm"
                  label-width="80px"
                  :rules="rules"
        >
          <el-form-item label="">
           <!-- TODO  -->
          </el-form-item>
        </el-form>
         <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="onAdd">OK</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { ITokenListData } from '@/api/types'
import { setToken, tokenList } from '@/api/users'
import { validateFee } from '@/utils/validate'

@Component({
  name: 'tokenList'
})
export default class extends Vue {
  private loading = false
  private btns:string[] = ['OMNI', 'ERC20', 'TRC20', 'BSC', 'HECO', 'OKT']
  private current = 'OMNI'
  private tableData = []
  private currentTokenInfo!:ITokenListData
  private showSettingDialog = false
  private showAddDialog = false
  private isNeedPay:string = '0'
  private settingDialogTitle:string = ''
  private addForm = {

  }

  private rules = {
    fee: [
      { required: true, message: 'required', trigger: 'blur' },
      { validator: validateFee, trigger: 'blur' }
    ]
  }

  private settingForm:{ [key:string] : string}= {
    withdrawal_fee: '',
    internal_fee: ''
  }
  mounted() {
    this.init()
  }

  private init() {
    this.getData()
  }

  private getData() {
    this.loading = true
    const params = {
      proto: this.current
    }
    tokenList(params).then(res => {
      if (res.code == 0) {
        let { tokens } = res.data
        this.tableData = tokens
      }
    }).finally(() => {
      this.loading = false
    })
  }
  private editRow(index, row:ITokenListData):void {
    this.currentTokenInfo = row
    this.settingDialogTitle = this.currentTokenInfo?.name + `(${this.current}) SET`
    this.showSettingDialog = true
    this.isNeedPay = this.currentTokenInfo.internal_fee != null? '1' : '0'
    this.settingForm.withdrawal_fee = this.currentTokenInfo.withdrawal_fee
    this.settingForm.internal_fee = this.currentTokenInfo.internal_fee
  }

  private refresh(tab) {
    this.current = tab
    this.getData()
  }

  private onModifySet() {
    let params = {
      id: this.currentTokenInfo?.id,
      proto: this.current,
      ...this.settingForm
    }
    this.$refs.settingForm.validate((valid:boolean) => {
      if (!valid) return
      setToken(params).then(res => {
        this.$message.success('Set successfully!')
        this.getData()
      }).finally(() => {
        this.showSettingDialog = false
      })
    })
  }

  private onAdd() {
    this.showAddDialog = false
  }

  private openAddDialog() {
    this.showAddDialog = true
  }
}
</script>

<style scoped lang="scss">
.btns-wrap {
  display: flex;
  justify-content: space-between;
}
</style>
