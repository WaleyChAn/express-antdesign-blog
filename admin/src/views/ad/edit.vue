<template>
  <a-drawer :title="tmpItem._id ? '编辑广告' : '新增广告'"
            class="badmin-drawer"
            placement="right"
            :width="400"
            :closable="false"
            :visible="modalVisible"
            :after-visible-change="handleVisibleChange"
            @close="handleCancel">
    <div class="layout-flex column">
      <div class="layout-flex-l scroll-y px-sm pt-sm">
        <a-form-model ref="modalForm"
                      :model="tmpItem"
                      :rules="modalFormRules">
          <a-form-model-item label="类型"
                             prop="type">
            <a-select v-model="tmpItem.type">
              <a-select-option :value="1">
                内部链接
              </a-select-option>
              <a-select-option :value="2">
                外部链接
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <template v-if="tmpItem.type === 1">
            <a-form-model-item label="关联帖子"
                               prop="post">
              <post-picker v-model="tmpItem.post"></post-picker>
            </a-form-model-item>
          </template>
          <template v-else-if="tmpItem.type === 2">
            <a-form-model-item label="标题">
              <a-input v-model="tmpItem.site.title"
                       placeholder="请输入标题" />
            </a-form-model-item>
            <a-form-model-item label="链接地址">
              <a-input v-model="tmpItem.site.url"
                       placeholder="请输入链接地址" />
            </a-form-model-item>
            <a-form-model-item label="封面">
              <a-upload-dragger name="file"
                                class="badmin-uploader-cover"
                                :show-upload-list="false"
                                :action="mixinUploadUrl()"
                                :headers="mixinAuthHeaders()"
                                :before-upload="beforeUpload"
                                @change="handleChange">
                <img v-if="tmpItem.site.cover"
                     :src="tmpItem.site.cover"
                     alt="cover" />
                <div v-else-if="uploadLoading">
                  <a-icon type="loading" />
                </div>
                <div v-else>
                  <p class="ant-upload-drag-icon">
                    <a-icon type="picture" />
                  </p>
                  <p class="ant-upload-text">
                    上传封面
                  </p>
                  <p class="ant-upload-hint">
                    可拖动图片到此区域进行上传
                  </p>
                </div>
              </a-upload-dragger>
            </a-form-model-item>
          </template>
          <a-empty v-else
                   description="请选择类型" />
        </a-form-model>
      </div>
      <div class="layout-flex-s text-right pa-sm">
        <a-button @click="handleCancel">
          取消
        </a-button>
        <a-button type="primary"
                  class="ml-xs"
                  :loading="modalLoading"
                  @click="handleOk">
          确认
        </a-button>
      </div>
    </div>

  </a-drawer>
</template>

<script>
import PostPicker from '@/components/postPicker.vue'

export default {
  name: 'BadminAdEdit',
  components: {
    PostPicker
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
    return {
      tmpItem: {},
      modalVisible: false,
      modalLoading: false,
      modalFormRules: {
        type: [{ required: true, message: '请选择类型', trigger: 'change' }]
      },
      uploadLoading: false
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
  methods: {
    handleOk () {
      let _this = this
      _this.$refs.modalForm.validate(valid => {
        if (_this.tmpItem.type === 1 && !_this.tmpItem.post) {
          _this.$message.error('请选择帖子')
        } else if (_this.tmpItem.type === 2 && !_this.tmpItem.site.title) {
          _this.$message.error('请输入标题')
        } else if (valid) {
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
    handleVisibleChange () {
      if (!this.modalVisible) {
        this.tmpItem = {}
        this.modalLoading = false
        this.passwordShow = false
        this.$refs.modalForm.clearValidate()
      }
    },
    handleChange (info) {
      if (info.file.status === 'uploading') {
        this.tmpItem.avatar = ''
        this.uploadLoading = true
        return
      }
      if (info.file.status === 'done' && info.file.response) {
        this.tmpItem.site.cover = info.file.response.url
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
      const isLt5M = file.size / 1024 / 1024 < 5
      if (!isLt5M) {
        this.$message.error('图片大小请不要超过2MB')
      }
      return isJpgOrPng && isLt5M
    },
    async onSave () {
      const adID = this.tmpItem.type + Number(new Date()).toString(36).toLocaleUpperCase()
      this.$set(this.tmpItem, 'adID', adID)
      const res = await this.$http.post('rest/ads', this.tmpItem)
      this.modalLoading = false
      if (res && res.data) {
        this.$message.success('新增成功！')
        this.fetchData()
        this.modalVisible = false
      }
    },
    async onEdit (id) {
      const res = await this.$http.put(`rest/ads/${id}`, this.tmpItem)
      this.modalLoading = false
      if (res && res.data) {
        this.$message.success('修改成功！')
        this.fetchData()
        this.modalVisible = false
      }
    },
    fetchData () {
      this.$emit('fetchData')
    }
  }
}
</script>
