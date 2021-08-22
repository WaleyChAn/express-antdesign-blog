<template>
  <div class="badmin-login">
    <div class="login-content">
      <div class="login-title">
        <dl>
          <dt>普普通通登录页</dt>
          <dd>(≧∀≦)ゞ请努力想想你的账号密码</dd>
        </dl>
      </div>
      <div class="login-form">
        <a-form-model ref="loginForm"
                      :model="form"
                      :rules="rules">
          <a-form-model-item prop="username">
            <a-input v-model="form.username"
                     placeholder="用户名"
                     size="large">
              <a-icon slot="prefix"
                      type="user" />
            </a-input>
          </a-form-model-item>
          <a-form-model-item prop="password">
            <a-input-password v-model="form.password"
                              placeholder="密码"
                              size="large"
                              autocomplete="new-password">
              <a-icon slot="prefix"
                      type="lock" />
            </a-input-password>
          </a-form-model-item>
          <a-form-model-item>
            <a-button type="primary"
                      @click="onSubmit"
                      :loading="loading"
                      size="large">登 录</a-button>
          </a-form-model-item>
        </a-form-model>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BadminLogin',
  components: {

  },
  data () {
    let checkNonSpecial = (rule, value, callback) => {
      let reg = /^[0-9A-Za-z]*$/
      if (reg.test(value)) {
        callback()
      } else {
        callback(new Error('请输入英文、数字或者英文数字组合'))
      }
    }
    return {
      loginParams: this.$route.query,
      loading: false,
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { max: 20, message: '不能超出20个字符！', trigger: 'blur' },
          { validator: checkNonSpecial, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '密码长度应在6-20个字符之间', trigger: 'blur' },
          { validator: checkNonSpecial, trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
  },
  methods: {
    onSubmit () {
      let _this = this
      _this.$refs.loginForm.validate(valid => {
        if (valid) {
          _this.loading = true
          _this.login()
        } else {
          _this.$message.error('账号密码再想想？')
          return false
        }
      })
    },
    async login () {
      const res = await this.$http.post('login', this.form)
      this.loading = false
      if (res && res.data) {
        this.$storage.set('token', res.data)
        this.$message.success('登录成功！')
        this.goNext()
      }
    },
    goNext () {
      const nextPath = this.loginParams.redirect || '/'
      this.$router.push(nextPath)
      this.loading = false
    }
  }
}
</script>
