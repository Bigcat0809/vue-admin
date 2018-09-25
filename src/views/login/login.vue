<template>
  <div class="dzh-login">
    <el-form ref="loginForm" class="dzh-login_form" :model="loginForm" :rules="loginRules"  autoComplete="on" label-position="left">
      <el-form-item prop="username">
        <el-input name="username" type="text" v-model="loginForm.username" :placeholder="login.username"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { validateAccount } from '@/utils/validate'
export default {
  name: 'login',
  components: {},
  data () {
    const validateUsername = (rule, value, callback) => {
      if (!validateAccount(value)) {
        callback(new Error('Please enter the correct user name'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '903701',
        password: 'admin'
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      isSee: false,
      loading: false,
      thirdLogin: false
    }
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
  .login{
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url('https://cn.bing.com/az/hprichbg/rb/SWFC_ZH-CN9558503653_1920x1080.jpg');
    background-color: #2d3a4b;
    background-size: cover;
    background-position: center;
  }
</style>
