/* eslint-disable camelcase */
<template>
  <div class="page-container">
    <div class="btns-wrap">
      <el-button type="primary" @click="openCreateDialog">Create</el-button>
    </div>
    <div class="table-wrap">
      <el-table
        height="720px"
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        highlight-current-row>
         <el-table-column
           prop="num"
           label="Num">
        </el-table-column>
        <el-table-column
          prop="time"
          label="Time">
          <template slot-scope="scope">
            <span>{{ scope.row.time | formatTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="token"
          label="Token">
        </el-table-column>
        <el-table-column
          prop="quantity"
          label="Quantity">
        </el-table-column>
        <el-table-column
          prop="customer_level"
          label="Customer Level">
          <template slot-scope="scope">
            <span>
              Lv {{ scope.row.customer_level }}
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
    <el-dialog title="ADD"
               :visible.sync="showCreateDialog"
               :before-close="closeDialog"
               center
    >
        <el-form ref="form"
                  label-position='top'
                  :model="form"
                  label-width="80px"
                  :rules="rules"
        >
          <el-form-item label="Token" prop="token">
            <el-select v-model="tokenQuery"
                       filterable
                       remote
                       :remote-method="selectFilter"
                       placeholder="Search"
                       style="width: 100%"
                       @change="selectChanged"
            >
              <el-option
                v-for="item in tokens"
                :key="item.id"
                :label="tokenNameInADDForm(item.proto, item.name)"
                :value="item.id">
                <div style="float: left">{{ item.proto }}</div> &nbsp;&nbsp;
                <div style="float: right">{{ item.name }}</div>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Customer Level" prop="user_level">
            <el-select v-model="form.user_level" placeholder="Level" style="width: 100%">
              <el-option
                :value="item.value"
                v-for="item in levels.slice(1)"
                :key="item.value"
                :label="item.text"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Quantity" prop="amount">
           <el-input v-model.trim="form.amount"></el-input>
          </el-form-item>
        </el-form>
         <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="onSubmit" class="full-btn">Submit</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { validateFee } from '@/utils/validate'
import { createAirdrop, airdropList, tokenQuery } from '@/api/users'
import { IAirdropListData, ITokenQuery } from '@/api/types'
import { ElForm } from 'element-ui/types/form'
@Component({
  name: 'airdrop'
})
export default class extends Vue {
  private showCreateDialog = false
  private loading = false
  private total = 0
  private tokens:ITokenQuery[] = []
  private form = {
    token: '',
    proto: '',
    user_level: 0,
    amount: '',
    contract_address: ''
  }

  private tokenQuery = ''

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

  private query = {
    page_no: 1,
    page_size: 10
  }

  private tableData:IAirdropListData[] = []

  private rules = {
    amount: [
      { required: true, message: 'required', trigger: 'blur' },
      { validator: validateFee, trigger: 'blur' }
    ],
    token: [
      { required: true, message: 'required', trigger: 'blur' }
    ],
    user_level: [
      { required: true, message: 'required', trigger: 'blur' }
    ]
  }

  mounted() {
    this.init()
  }

  private init() {
    this.getData()
  }

  private getData() {
    this.loading = true
    const params = this.query
    airdropList(params).then((res:any) => {
      this.tableData = res.records
      this.total = res.total
    }).finally(() => {
      this.loading = false
    })
  }

  private closeDialog() {
    this.tokenQuery = ''
    const form = this.$refs.form as ElForm
    form.resetFields()
    this.showCreateDialog = false
  }

  private selectChanged(id:number) {
    const selectedItem:ITokenQuery | undefined = this.tokens.find(el => {
      return el.id === id
    })
    if (!selectedItem) return
    const { name, proto, contract_address } = selectedItem
    this.form.token = name
    this.form.proto = proto
    this.form.contract_address = contract_address
  }

  private tokenNameInADDForm(p:string, n:string) {
    return p + n
  }

  private selectFilter(val:string) {
    this.tokens = []
    const params = {
      proto: val
    }
    tokenQuery(params).then((res:any) => {
      this.tokens = res.tokens
    })
  }

  private handleCurrentChange():void {
    this.getData()
  }

  private openCreateDialog() {
    this.tokenQuery = ''
    this.tokens = []
    const params = {
      proto: ''
    }
    tokenQuery(params).then((res:any) => {
      this.tokens = res.tokens
      this.showCreateDialog = true
      this.$nextTick(() => {
        (this.$refs.form as ElForm).resetFields()
      })
    })
  }

  private secondConfirm() {
    this.$confirm('Are you sure about this operation', '', {
      confirmButtonText: 'Sure',
      cancelButtonText: 'No'
    }).then(() => {
      this.onCreate()
    })
  }

  private onCreate() {
    const params = this.form
    createAirdrop(params).then(res => {
      console.log(res)
      this.$message({
        type: 'success',
        message: 'Created successfully!'
      })
      this.query.page_no = 1
      this.getData()
    }).finally(() => {
      this.showCreateDialog = false
    })
  }

  private onSubmit() {
    (this.$refs.form as ElForm).validate((valid:boolean) => {
      if (!valid) return
      this.secondConfirm()
    })
  }
}
</script>

<style scoped>

</style>
