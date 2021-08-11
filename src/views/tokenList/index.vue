<template>
  <div class="page-container">
    <div class="btns-wrap">
      <el-button-group>
        <el-button :type="current === item? 'primary' : 'default'"
                   v-for="item in btns"
                   @click="refresh(item)"
        >{{ item }}
        </el-button>
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

    <el-dialog :title="settingDialogTitle"
               :visible.sync="showSettingDialog"
               center
               width="430px"
               @before-close="closeDialog('settingForm')"
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
        <el-form-item label="Internal Withdraw Fee" prop="internal_fee">
          <el-radio-group v-model="isNeedPay">
            <el-radio label="0">Free</el-radio>
            <el-radio label="1">Need pay</el-radio>
          </el-radio-group>
          <el-form-item prop="internal_fee" v-show="isNeedPay === '1'">
            <el-input class="input-width"
                      v-model.trim="settingForm.internal_fee"
            ></el-input>
          </el-form-item>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="onModifySet">OK</el-button>
        </span>
    </el-dialog>

    <el-dialog title="ADD"
               :visible.sync="showAddDialog"
               center
               width="460px"
               @before-close="closeDialog('addForm')"
    >
      <el-form ref="addForm"
               label-position='top'
               :model="addForm"
               :rules="rules"
      >
        <el-form-item label="Contract address" prop="contract_address">
          <el-select v-model="addForm.contract_address"
                     filterable
                     placeholder="Search"
                     style="width: 100%"
          >
            <el-option
              v-for="item in addressList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
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
            <el-button type="primary" @click="onAdd">OK</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { ITokenListData } from '@/api/types'
import { addToken, setToken, tokenList } from '@/api/users'
import { validateFee } from '@/utils/validate'

@Component({
  name: 'tokenList'
})
export default class extends Vue {
  private loading = false
  private btns: string[] = ['OMNI', 'ERC20', 'TRC20', 'BSC', 'HECO', 'OKT']
  private current = 'OMNI'
  private tableData = []
  private addressList = []
  private currentTokenInfo!: ITokenListData
  private showSettingDialog = false
  private showAddDialog = false
  private isNeedPay: string = '0'
  private settingDialogTitle: string = ''
  private addForm = {
    'token_name': '',
    'withdrawal_fee': '',
    'internal_fee': '',
    'contract_address': '',
    'collect_limit': '',
    'proto': '' // 就是tab的名字
  }

  private rules = {
    withdrawal_fee: [
      {
        required: true,
        message: 'required',
        trigger: 'blur'
      },
      {
        validator: validateFee,
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
        validator: validateFee,
        trigger: 'blur'
      }
    ],
    collect_limit: [
      {
        required: true,
        message: 'required',
        trigger: 'blur'
      },
    ],
    contract_address: [
      {
        required: true,
        message: 'required',
        trigger: 'blur'
      },
    ]
  }

  private settingForm: { [key: string]: string } = {
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

  private editRow(index, row: ITokenListData): void {
    this.currentTokenInfo = row
    this.settingDialogTitle = this.currentTokenInfo?.name + `(${this.current}) SET`
    this.showSettingDialog = true
    this.isNeedPay = this.currentTokenInfo.internal_fee != '0' ? '1' : '0'
    this.settingForm.withdrawal_fee = this.currentTokenInfo.withdrawal_fee
    this.settingForm.internal_fee = this.currentTokenInfo.internal_fee
  }

  private refresh(tab) {
    this.current = tab
    this.getData()
  }

  private onModifySet() {
    this.$refs.settingForm.validate((valid: boolean) => {
      if (!valid) return
      let params = {
        id: this.currentTokenInfo?.id,
        proto: this.current,
        ...this.settingForm
      }
      if (this.isNeedPay === '0') params.internal_fee = '0'
      setToken(params).then(res => {
        this.$message.success('Set successfully!')
        this.getData()
      }).finally(() => {
        this.showSettingDialog = false
      })
    })
  }

  private onAdd() {
    this.$refs.addForm.validate((valid) => {
      if (!valid) return
      let params = this.addForm
      params.proto = this.current
      addToken(params).then(res => {
        this.$message.success('Added successfully!')
        this.getData()
      })
      this.showAddDialog = false
    })
  }

  private closeDialog(formName) {
    this.resetForm(formName)
  }

  private resetForm(formName) {
    this.$refs[formName].resetFields()
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
