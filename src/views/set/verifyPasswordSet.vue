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
import { JSEncrypt } from 'jsencrypt'
import { Component, Vue } from 'vue-property-decorator'
import { pubKey, setVerifyPwd } from '@/api/users'
import { ElForm } from 'element-ui/types/form'
const sha256 = require('js-sha256').sha256

@Component({
  name: 'verifyPasswordSet'
})
export default class extends Vue {
  private form = {
    old_pwd: '',
    new_pwd: '',
    repeat_pwd: ''
  }

  private pk = ''

  private validatePass = (rule:any, value:any, callback:any) => {
    if (value === '') {
      callback(new Error('required'))
    } else if (value !== this.form.new_pwd) {
      callback(new Error('The two passwords are inconsistent!'))
    } else if (value === this.form.old_pwd) {
      callback(new Error('Cannot be the same as the old password!'))
    } else {
      callback()
    }
  }

  private rules = {
    old_pwd: [
      { required: true, message: 'required', trigger: 'blur' }
    ],
    new_pwd: [
      { required: true, message: 'required', trigger: 'blur' }
    ],
    repeat_pwd: [
      { required: true, message: 'required', trigger: 'blur' },
      { validator: this.validatePass, trigger: 'blur' }
    ]
  }

  private submitForm(name:string) {
    (this.$refs[name] as ElForm).validate((valid:boolean) => {
      if (valid) {
        this.onReset()
      }
    })
  }

  private async onReset() {
    const params = JSON.parse(JSON.stringify(this.form))
    delete params.repeat_pwd
    // params.user_code = localStorage.getItem('code')
    const resData = await pubKey()
    if (resData && resData.pk) {
      this.pk = resData.pk
    }
    params.new_pwd = this.rsaData(sha256(this.form.new_pwd))
    params.old_pwd = this.rsaData(sha256(this.form.old_pwd))
    setVerifyPwd(params).then((res:any) => {
      this.$message.success('Modified successfully')
    }).finally(() => {
      this.resetForm('form')
    })
  }

  private rsaData(data: string): string|boolean {
    const PUBLIC_KEY = this.pk
    const jsencrypt = new JSEncrypt()
    jsencrypt.setPublicKey(PUBLIC_KEY)
    const result = jsencrypt.encrypt(data)
    return result
  }

  private resetForm(formName:string) {
    (this.$refs[formName] as ElForm).resetFields()
  }
}
</script>

<style scoped lang="scss">
.form {
  margin-left: 50px;
  width: 500px;
}
</style>
