<template>
  <div class="page-container">
    <el-form ref="form" :model="form" :rules="rules" class="form">
      <el-form-item label="Current password" prop="old_pwd">
        <el-input type="password" v-model="form.old_pwd" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="New password" prop="new_pwd">
        <el-input type="password"  v-model="form.new_pwd" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="Confirm Password" prop="repeat_pwd">
        <el-input type="password"  v-model="form.repeat_pwd"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button style="width: 100%" type="primary" @click="submitForm('form')">Submit</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { pubKey, setAccountPwd } from '@/api/users'
const sha256 = require('js-sha256').sha256
import { JSEncrypt } from 'jsencrypt'

@Component({
  name: 'loginPassword'
})
export default class extends Vue {
  private form = {
    old_pwd: '',
    new_pwd: '',
    repeat_pwd: ''
  }

  private validatePass = (rule, value, callback) => {
    if (value === '') {
      callback(new Error('required'));
    } else if (value !== this.form.new_pwd) {
      callback(new Error('The two passwords are inconsistent!'));
    } else if (value == this.form.old_pwd) {
      callback(new Error('Cannot be the same as the old password!'));
    }
    else {
      callback();
    }
  };
  private rules = {
    old_pwd: [
      {required: true, message: 'required', trigger: 'blur'}
    ],
    new_pwd: [
      {required: true, message: 'required', trigger: 'blur'}
    ],
    repeat_pwd: [
      {required: true, message: 'required', trigger: 'blur'},
      { validator: this.validatePass, trigger: 'blur' }
    ]
  }

  created() {
    this.init()
  }

  private init() {
    this.getData()
  }

  private getData() {

  }

  private submitForm(name) {
    this.$refs[name].validate((valid) => {
      if (valid) {
        this.onReset()
      }
    })
  }

  private async onReset() {
    const params = JSON.parse(JSON.stringify(this.form))
    delete params.repeat_pwd
    params.user_code = localStorage.getItem('code')
    const resData = await pubKey()
    if (resData && resData.code === 0) {
      this.pk = resData.data.pk
    }
    params.new_pwd = this.rsaData(sha256(this.form.new_pwd))
    params.old_pwd = this.rsaData(sha256(this.form.old_pwd))

    setAccountPwd(params).then(res=> {
      if (res.code == 0) {
        this.$message.success('Modified successfully')
      }
    }).finally(() => {
      this.resetForm('form')
    })
  }

  private rsaData(data: string): string|boolean {
    const PUBLIC_KEY = this.pk
    let jsencrypt = new JSEncrypt()
    jsencrypt.setPublicKey(PUBLIC_KEY)
    console.log(PUBLIC_KEY)
    let result = jsencrypt.encrypt(data)
    return result
  }

  private resetForm(formName:string) {
    this.$refs[formName].resetFields();
  }
}
</script>

<style scoped lang="scss">
.form {
  margin-left: 50px;
  width: 500px;
}
</style>
