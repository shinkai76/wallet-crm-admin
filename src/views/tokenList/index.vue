<template>
  <div class="page-container">
    <div class="btns-wrap">
      <el-button-group>
        <el-button :type="current === item? 'primary' : 'default'"
                   v-for="(item, index) in btns"
                   :key="index"
                   @click="refresh(item)"
        >{{ item }}
        </el-button>
      </el-button-group>
      <el-button type="primary" v-show="current !== 'OMNI'" circle icon="el-icon-plus" @click="openAddDialog"></el-button>
    </div>
    <div class="table-wrap">
      <el-table
        height="720px"
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
          prop="collect_limit"
          label="Collect limit"
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

    <el-dialog :title="settingDialogTitle"
               :visible.sync="showSettingDialog"
               center
               width="450px"
               :before-close="closeSettingDialog"
    >
      <el-form ref="settingForm"
               label-position='top'
               :model="settingForm"
               label-width="80px"
               :rules="rules"
      >
        <el-form-item :label="current + ' Withdraw Fee'" prop="withdrawal_fee">
          <el-input class="input-width" v-model.trim="settingForm.withdrawal_fee"></el-input>
        </el-form-item>
        <el-form-item label="Collect limit" prop="collect_limit">
          <el-input v-model.trim="settingForm.collect_limit"></el-input>
        </el-form-item>
        <el-form-item label="Internal Withdraw Fee" prop="internal_fee">
          <el-radio-group v-model="isNeedPay">
            <el-radio label="0">Free</el-radio>
            <el-radio label="1">Need pay</el-radio>
          </el-radio-group>
          <el-form-item v-show="isNeedPay === '1'">
            <el-input class="input-width"
                      v-model.trim="settingForm.internal_fee"
            ></el-input>
          </el-form-item>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="onModifySet" class="full-btn">OK</el-button>
        </span>
    </el-dialog>

    <el-dialog :title="'ADD - ' + current"
               :visible.sync="showAddDialog"
               center
               width="460px"
               :before-close="closeAddDialog"
    >
      <el-form ref="addForm"
               label-position='top'
               :model="addForm"
               :rules="rules"
      >
        <el-form-item label="Contract address" prop="contract_address">
          <el-select v-model="addForm.contract_address"
                     filterable
                     remote
                     :remote-method="selectFilter"
                     placeholder="Search"
                     style="width: 100%"
                     @change="selectChanged"
          >
            <el-option
              v-for="item in addressList"
              :key="item.id"
              :label="item.address"
              :value="item.address"
            >
              <div style="float: left">{{ item.name }}</div> &nbsp;&nbsp;
              <div style="float: right">{{ item.address }}</div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="current + ' Withdrawal Fee'" prop="withdrawal_fee">
          <el-input v-model.trim="addForm.withdrawal_fee"></el-input>
        </el-form-item>
        <el-form-item label="Collect limit" prop="collect_limit">
          <el-input v-model.trim="addForm.collect_limit"></el-input>
        </el-form-item>
        <el-form-item label="Internal Withdrawal Fee" prop="internal_fee">
          <el-radio-group v-model="isNeedPay">
            <el-radio label="0">Free</el-radio>
            <el-radio label="1">Need pay</el-radio>
          </el-radio-group>
          <el-form-item v-show="isNeedPay === '1'">
            <el-input class="input-width"
                      v-model.trim="addForm.internal_fee"
            ></el-input>
          </el-form-item>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="onAdd" class="full-btn">OK</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { ITokenListData, ITokenAddress } from '@/api/types'
import { addToken, setToken, tokenAddress, tokenList } from '@/api/users'
import { ElForm } from 'element-ui/types/form'

@Component({
  name: 'tokenList'
})
export default class extends Vue {
  private loading = false
  private btns: string[] = ['OMNI', 'ERC20', 'TRC20', 'BEP20', 'HRC20', 'OIP20']
  private current = 'OMNI'
  private tableData = []
  private addressList:ITokenAddress[] = []
  private currentTokenInfo!: ITokenListData
  private showSettingDialog = false
  private showAddDialog = false
  private isNeedPay = '0'
  private settingDialogTitle = ''
  private addForm = {
    token_name: '',
    token_symbol: '',
    withdrawal_fee: '',
    internal_fee: '0',
    contract_address: '',
    collect_limit: '',
    decimals: 0,
    proto: '' // 就是tab的名字
  }

  private rules = {
    withdrawal_fee: [
      {
        required: true,
        message: 'required',
        trigger: 'blur'
      },
      {
        validator: this.validateFee,
        trigger: 'blur'
      }
    ],
    internal_fee: [
      {
        required: true,
        message: 'required',
        trigger: 'blur'
      },
      {
        validator: this.validateFee,
        trigger: 'blur'
      }
    ],
    collect_limit: [
      {
        required: true,
        message: 'required',
        trigger: 'blur'
      }
    ],
    contract_address: [
      {
        required: true,
        message: 'required',
        trigger: 'blur'
      }
    ]
  }

  private settingForm = {
    withdrawal_fee: '',
    internal_fee: '',
    collect_limit: ''
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
    tokenList(params).then((res:any) => {
      const { tokens } = res
      this.tableData = tokens
    }).finally(() => {
      this.loading = false
    })
  }

  private validateFee(rule:any, value:any, callback:any) {
    if (this.isNeedPay === '0') {
      callback()
      return
    }
    if (Number(value) <= 0 || isNaN(Number(value))) {
      callback(new Error('Must be greater than 0'))
    } else {
      callback()
    }
  }

  private selectChanged(address:string) {
    const selectedItem = this.addressList.find(el => {
      return el.address === address
    })
    if (!selectedItem) return
    this.addForm.contract_address = selectedItem.address || ''
    this.addForm.token_name = selectedItem.name || ''
    this.addForm.decimals = selectedItem.decimals || 0
    this.addForm.token_symbol = selectedItem.symbol || ''
  }

  private editRow(index:any, row: ITokenListData): void {
    this.currentTokenInfo = row
    this.settingDialogTitle = this.currentTokenInfo.name + `(${this.current}) SET`
    this.showSettingDialog = true
    this.isNeedPay = this.currentTokenInfo.internal_fee !== '0' ? '1' : '0'
    this.settingForm.withdrawal_fee = this.currentTokenInfo.withdrawal_fee
    this.settingForm.internal_fee = this.currentTokenInfo.internal_fee
    this.settingForm.collect_limit = this.currentTokenInfo.collect_limit
  }

  private refresh(tab:string) {
    this.current = tab
    this.getData()
  }

  private onModifySet() {
    (this.$refs.settingForm as ElForm).validate((valid: boolean) => {
      if (!valid) return
      const params = {
        id: this.currentTokenInfo.id,
        proto: this.current,
        ...this.settingForm
      }
      if (this.isNeedPay === '0') params.internal_fee = '0'
      setToken(params).then(() => {
        this.$message.success('Set successfully!')
        this.getData()
      }).finally(() => {
        this.closeSettingDialog()
      })
    })
  }

  private onAdd() {
    (this.$refs.addForm as ElForm).validate((valid:boolean) => {
      if (!valid) return
      const params = this.addForm
      params.proto = this.current
      if (this.isNeedPay === '0') params.internal_fee = '0'
      addToken(params).then(() => {
        this.$message.success('Added successfully!')
        this.getData()
      }).finally(() => {
        this.closeAddDialog()
      })
    })
  }

  private closeAddDialog() {
    this.resetForm('addForm')
    this.showAddDialog = false
  }

  private closeSettingDialog() {
    this.resetForm('settingForm')
    this.showSettingDialog = false
  }

  private resetForm(formName:string) {
    const form = (this.$refs[formName] as ElForm)
    form && form.resetFields()
  }

  private selectFilter(val:string) {
    this.addressList = []
    const params = {
      name: val,
      proto: this.current
    }
    tokenAddress(params).then((res:any) => {
      this.addressList = res.sys_tokens
    })
  }

  private openAddDialog() {
    this.showAddDialog = true
    this.isNeedPay = '0'
    this.addForm.internal_fee = '0'
  }
}
</script>

<style scoped lang="scss">
.btns-wrap {
  display: flex;
  justify-content: space-between;
}
</style>
