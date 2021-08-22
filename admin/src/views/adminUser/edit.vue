<template>
  <a-modal :title="tmpItem._id ? '编辑管理员' : '新增管理员'"
           :visible="modalVisible"
           :afterClose="handleClose"
           class="badmin-modal"
           @cancel="handleCancel">
    <a-form-model ref="modalForm"
                  :model="tmpItem"
                  :rules="modalFormRules">

      <a-row :gutter="20">
        <a-col :span="8">
          <a-form-model-item label="头像"
                             prop="avatar">
            <a-upload name="file"
                      list-type="picture-card"
                      class="badmin-uploader-avatar"
                      :show-upload-list="false"
                      :action="mixinUploadUrl()"
                      :headers="mixinAuthHeaders()"
                      :before-upload="beforeUpload"
                      @change="handleChange">
              <img v-if="tmpItem.avatar"
                   :src="tmpItem.avatar"
                   alt="avatar" />
              <div v-else>
                <a-icon :type="uploadLoading ? 'loading' : 'plus'" />
              </div>
            </a-upload>
          </a-form-model-item>
        </a-col>
        <a-col :span="16">
          <a-form-model-item label="名称"
                             prop="username">
            <a-input v-model="tmpItem.username"
                     placeholder="请输入名称"
                     :disabled="tmpItem._id ? true : false" />
          </a-form-model-item>
          <a-form-model-item label="昵称"
                             prop="nickname">
            <a-input v-model="tmpItem.nickname"
                     placeholder="请输入昵称" />
          </a-form-model-item>
        </a-col>

      </a-row>

      <a-form-model-item v-if="tmpItem._id ? passwordShow : true"
                         label="密码"
                         prop="password">
        <a-input-password v-model="tmpItem.password"
                          placeholder="请输入密码" />
      </a-form-model-item>
      <a-form-model-item v-if="passwordShow"
                         label="确认密码"
                         prop="confirm">
        <a-input-password v-model="passwordConfirm"
                          placeholder="请确认密码" />
      </a-form-model-item>
    </a-form-model>
    <template slot="footer">
      <a-button v-if="tmpItem._id"
                style="float: left"
                @click="passwordShow = true">
        <a-icon type="edit" />
        修改密码
      </a-button>
      <a-button @click="handleCancel">
        取消
      </a-button>
      <a-button type="primary"
                :loading="modalLoading"
                @click="handleOk">
        确认
      </a-button>
    </template>
  </a-modal>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'BadminAdminUserEdit',
  components: {
  },
  props: {
    value: {
      type: Object,
      default () {
        return {}
      }
    }
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
    let checkConfirm = (rule, value, callback) => {
      if (this.passwordConfirm === '') {
        callback(new Error('请重新输入新的密码'))
      } else if (this.passwordConfirm !== this.tmpItem.password) {
        callback(new Error('两次输入结果不一致'))
      } else {
        callback()
      }
    }
    return {
      tmpItem: {},
      passwordShow: false,
      passwordConfirm: '',
      uploadLoading: false,
      modalVisible: false,
      modalLoading: false,
      modalFormRules: {
        username: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { max: 20, message: '不能超出20个字符！', trigger: 'blur' },
          { validator: checkNonSpecial, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '密码长度应在6-20个字符之间', trigger: 'blur' },
          { validator: checkNonSpecial, trigger: 'blur' }
        ],
        confirm: [
          { validator: checkConfirm, trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    value: {
      handler (n) {
        this.tmpItem = n
      },
      deep: true
    },
    tmpItem: {
      handler (n) {
        this.$emit('input', n)
      },
      deep: true
    }
  },
  created () {
    this.tmpItem = this.value
  },
  computed: {
    ...mapGetters({
      currentUser: 'getCurrentUser'
    })
  },
  methods: {
    handleOk () {
      let _this = this
      _this.$refs.modalForm.validate(valid => {
        if (valid) {
          _this.modalLoading = true
          if (_this.tmpItem._id) {
            _this.onEdit(_this.tmpItem._id)
          } else {
            _this.onSave()
          }
        } else {
          return false
        }
      })
    },
    handleCancel () {
      this.modalVisible = false
    },
    handleClose () {
      this.tmpItem = {}
      this.modalLoading = false
      this.passwordShow = false
      this.$refs.modalForm.clearValidate()
    },
    async onSave () {
      const res = await this.$http.post('rest/admin_users', this.tmpItem)
      this.modalLoading = false
      if (res && res.data) {
        this.$message.success('新增成功！')
        this.fetchData()
        this.modalVisible = false
      }
    },
    async onEdit (id) {
      const res = await this.$http.put(`rest/admin_users/${id}`, this.tmpItem)
      this.modalLoading = false
      if (res && res.data) {
        this.$message.success('修改成功！')
        if (this.currentUser._id === id) {
          this.$router.go(0)
        } else {
          this.fetchData()
        }
        this.modalVisible = false
      }
    },
    fetchData () {
      this.$emit('fetchData')
    },
    handleChange (info) {
      if (info.file.status === 'uploading') {
        this.tmpItem.avatar = ''
        this.uploadLoading = true
        return
      }
      if (info.file.status === 'done' && info.file.response) {
        this.tmpItem.avatar = info.file.response.url
        this.uploadLoading = false
      }
      if (info.file.status === 'error') {
        this.$message.error('图片上传失败')
        this.uploadLoading = false
      }
    },
    beforeUpload (file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isJpgOrPng) {
        this.$message.error('请上传jpg或者png格式的头像')
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('图片大小请不要超过2MB')
      }
      return isJpgOrPng && isLt2M
    }
  }
}
</script>
