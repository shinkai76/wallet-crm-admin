<template>
  <div class="page-container">
    <div class="btns-wrap">
      <el-button type="primary" @click="openCreateDialog">Create</el-button>
    </div>
    <div class="table-wrap">
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        highlight-current-row>
         <el-table-column
          type="Num"
          width="50">
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
          label="Quantity"
          width="120">
        </el-table-column>
        <el-table-column
          prop="level"
          label="Customer Level"
          width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.level">
              Lv {{ scope.row.level }}
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
    <el-dialog title="ADD" :visible.sync="showCreateialog">
        <el-form ref="form"
                  label-position='top'
                  :model="form"
                  label-width="80px"
                  :rules="rules"
        >
          <el-form-item label="Token" prop="token">
           <!-- TODO  -->
          </el-form-item>
          <el-form-item label="Customer Level" prop="level">
           <!-- TODO  -->
          </el-form-item>
          <el-form-item label="Quantity" prop="quantity">
           <el-input v-model.trim="form.quantity"></el-input>
          </el-form-item>
        </el-form>
         <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="onSubmit">Submit</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { validateFee } from '@/utils/validate'
import { createAirdrop, airdropList } from '@/api/users'
import { AirdropListData } from '@/api/types'
@Component({
  name: 'airdrop'
})
export default class extends Vue {
  private showCreateialog = true
  private loading = false
  private total:number = 0

  private form:{ [key:string]:string } = {
    token: '',
    level: '',
    quantify: ''
  }

  private query = {
    page_no: 1,
    page_size: 50
  }

  private tableData:AirdropListData[] = []

  private rules = {
    quantity: [
      { required: true, message: 'required', trigger: 'blur' },
      { validator: validateFee, trigger: 'blur' }
    ],
    token: [
      { required: true, message: 'required', trigger: 'blur' }
    ],
    level: [
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
    airdropList(params).then(res => {
      console.log(res)
    }).finally(() => {
      this.loading = false
    })
  }

  private handleCurrentChange():void {
    this.getData()
  }

  private openCreateDialog() {
    this.showCreateialog = true
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
      this.showCreateialog = false
    })
  }

  private onSubmit() {
    this.$refs.form.validate((valid)=> {
      if (!valid) return
      this.secondConfirm()
    })
  }
}
</script>

<style scoped>

</style>
