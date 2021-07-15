<template>
  <div class="page-container">
    <div class="btns-wrap">
      <el-button-group>
        <el-button :type="current === item? 'primary' : 'defalut'"
                   v-for="item in btns" 
                   @click="current = item"
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
          prop="token_id"
          label="TokenID">
        </el-table-column>
        <el-table-column
          prop="name"
          label="Name">
        </el-table-column>
        <el-table-column
          prop=""
          :label="current +' Withdrawal Fee'"
        >
        </el-table-column>
        <el-table-column
          prop="internal_withdraw_fee"
          label="Internal  Withdrawal  Fee"
        >
        </el-table-column>
        <el-table-column
          prop="internal_withdraw_fee"
          label="Internal  Withdrawal  Fee"
        >
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

    <el-dialog :title="dialogTitle" :visible.sync="showSettingDialog">
        <el-form ref="settingForm"
                  label-position='top'
                  :model="settingForm"
                  label-width="80px"
                  :rules="rules"
        >
          <el-form-item :label="current + 'Withdraw Fee'" prop="fee">
            <el-input class="input-width" v-model.trim="settingForm.withdraw_fee"></el-input>
          </el-form-item>
          <el-form-item label="Internal Withdraw Fee" prop="fee">
            <el-radio-group v-model="isNeedPay">
              <el-radio label="0">Free</el-radio>
              <el-radio label="1">Need pay</el-radio>
            </el-radio-group>
            <el-input class="input-width" v-show="isNeedPay === '1'" v-model="settingForm.internal_withdraw_fee"
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
import { TokenListData } from '@/api/types'
import { setToken } from '@/api/users'


const validateFee = (rule, value, callback) => {
  if (Number(value) <= 0) {
    callback(new Error('Must be greater than 0'))
  } else {
    callback();
  }
}
@Component({
  name: 'tokenList'
})
export default class extends Vue {
  private loading = false
  private total = 0
  private btns:string[] = ['OMNI', 'ERC20', 'TRC20', 'BSC', 'HECO', 'OKT']
  private current = 'OMNI'
  private tableData:TokenListData[] = []
  private currentTokenInfo!:TokenListData
  private showSettingDialog = false
  private showAddDialog = true
  private isNeedPay:string = '0'
  private addForm = {
    
  }

  private rules = {
    fee: [
      { required: true, message: 'required', trigger: 'blur' },
      { validator: validateFee, trigger: 'blur' }
    ]
  }

  private settingForm:{ [key:string] : string}= {
    Withdraw_fee: '',
    internal_withdraw_fee: ''
  }

  private editRow(index, row:TokenListData):void {
    this.currentTokenInfo = row
    this.showSettingDialog = true
  }

  private onModifySet() {
    let params = {
      token_id: this.currentTokenInfo?.token_id,
      type: this.current,
      ...this.settingForm
    }
    this.$refs.settingForm.validate((valid:boolean) => {
      if (!valid) return
      setToken(params).then(res => {
        console.log(res)
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

  get dialogTitle():string {
    return this.currentTokenInfo?.name + `(${this.current})`
  }
}
</script>

<style scoped lang="scss">
.btns-wrap {
  display: flex;
  justify-content: space-between;
}
</style>
