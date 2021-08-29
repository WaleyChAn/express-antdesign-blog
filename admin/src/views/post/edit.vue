<template>
  <a-spin :spinning="pageLoading"
          size="large"
          class="badmin-loading-page">
    <div class="badmin-box cover hidden">
      <div v-if="tmpItem.state === 2"
           class="box-superscript">草 稿</div>
      <div class="box-scroll-wrapper scroll-y">
        <div class="badmin-form badmin-form-post">
          <div class="post-title">
            <a-textarea v-model="tmpItem.title"
                        placeholder="请输入标题（建议40字以内）"
                        :max-length="40"
                        suffix="RMB"
                        auto-size />
            <div class="post-title-limit">{{ tmpItem.title ? (tmpItem.title.length || 0) : 0 }} / 40</div>
          </div>
          <!-- title -->
          <div class="post-body">
            <tinymce-editor v-model="tmpItem.body"></tinymce-editor>
          </div>
          <!-- body -->
          <a-form-model ref="editForm"
                        :model="tmpItem">
            <a-form-model-item label="请选择帖子分类">
              <category-picker v-model="tmpItem.categories"></category-picker>
              <div class="form-tips">
                <a-icon class="mr-xs"
                        type="info-circle" />非必选，若不选择分类，则默认为其他分类
              </div>
            </a-form-model-item>
            <!-- categories -->
            <a-form-model-item label="封面">
              <a-row>
                <a-col :span="12">
                  <a-upload-dragger name="file"
                                    class="badmin-uploader-cover"
                                    :show-upload-list="false"
                                    :action="mixinUploadUrl()"
                                    :headers="mixinAuthHeaders()"
                                    :before-upload="beforeUpload"
                                    @change="handleChange">
                    <img v-if="tmpItem.cover"
                         :src="tmpItem.cover"
                         alt="color" />
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
                </a-col>
              </a-row>
            </a-form-model-item>
            <!-- cover -->
            <a-form-model-item label="私密性">
              <a-radio-group v-model="tmpItem.isPublic"
                             :default-value="true"
                             button-style="solid">
                <a-radio-button :value="true">
                  <a-icon type="unlock" />
                  公开
                </a-radio-button>
                <a-radio-button :value="false">
                  <a-icon type="lock" />
                  私密
                </a-radio-button>
              </a-radio-group>
              <div class="form-tips">
                <a-icon class="mr-xs"
                        type="info-circle" />选择私密后，在博客内将不会展示，在后台依旧可以查看并管理
              </div>
            </a-form-model-item>
            <!-- state -->
          </a-form-model>
          <div class="post-footer">
            <a-button type="primary"
                      shape="round"
                      size="large"
                      :disabled="submitLoading !== null"
                      :loading="submitLoading === 1"
                      @click="handleSubmit(1)">{{ tmpItem.state === 1 && tmpItem._id ? '保存修改': '发布帖子' }}</a-button>
            <a-button v-if="!tmpItem._id || tmpItem.state === 2"
                      type="primary"
                      shape="round"
                      size="large"
                      ghost
                      :disabled="submitLoading !== null"
                      :loading="submitLoading === 2"
                      @click="handleSubmit(2)">保存草稿</a-button>
            <a-button type="primary"
                      shape="round"
                      size="large"
                      ghost
                      :disabled="submitLoading !== null"
                      @click="handlePreview">预览帖子</a-button>
            <a-button v-if="tmpItem._id"
                      type="danger"
                      shape="round"
                      size="large"
                      ghost
                      :loading="submitLoading === 0"
                      @click="handleDelete">删除帖子</a-button>
          </div>
        </div>
      </div>
    </div>
  </a-spin>
</template>

<script>
import TinymceEditor from '@/components/tinymceEditor.vue'
import CategoryPicker from '@/components/categoryPicker.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'BadminPostEdit',
  components: {
    TinymceEditor,
    CategoryPicker
  },
  data () {
    return {
      tmpItem: {},
      submitLoading: null,
      uploadLoading: false,
      pageLoading: false
    }
  },
  computed: {
    postID () {
      return this.$route.query.id || ''
    },
    ...mapGetters({
      currentUser: 'getCurrentUser'
    })
  },
  created () {
    this.fetchItem()
  },
  methods: {
    async handleSubmit (state) {
      const requireParams = {
        author: this.currentUser,
        isPublic: true,
        state: 1
      }
      this.tmpItem = Object.assign(requireParams, this.tmpItem)
      this.tmpItem.state = state
      await this.handleValidate()
      this.submitLoading = state
      if (this.tmpItem._id) {
        this.onEdit(this.tmpItem._id)
      } else {
        this.onSave()
      }
    },
    handlePreview () {

    },
    handleDelete () {
      let _this = this
      _this.$confirm({
        title: '确定删除帖子吗?',
        onOk () {
          _this.submitLoading = 0
          _this.onDelete(_this.tmpItem._id)
        },
        class: 'badmin-modal'
      })
    },
    handleValidate () {
      const newValidate = new Promise((resolve, reject) => {
        if (!this.tmpItem.title) {
          this.$message.warn('请输入标题')
          reject(new Error('title'))
        } else if (!this.tmpItem.body) {
          this.$message.warn('请编写正文内容')
          reject(new Error('body'))
        } else {
          resolve()
        }
      })
      return newValidate
    },
    async onSave () {
      const res = await this.$http.post('rest/post', this.tmpItem)
      this.submitLoading = null
      if (res && res.data) {
        this.$message.success('新增成功！')
        this.goto('/posts')
      }
    },
    async onEdit (id) {
      const res = await this.$http.put(`rest/post/${id}`, this.tmpItem)
      this.submitLoading = null
      if (res && res.data) {
        this.$message.success('修改成功！')
        this.goto('/posts')
      }
    },
    async onDelete (id) {
      const res = await this.$http.delete(`rest/posts/${id}`)
      if (res && res.data) {
        this.$message.success('删除成功！')
        this.goto('/posts')
      }
    },
    handleChange (info) {
      if (info.file.status === 'uploading') {
        this.tmpItem.avatar = ''
        this.uploadLoading = true
        return
      }
      if (info.file.status === 'done' && info.file.response) {
        this.tmpItem.cover = info.file.response.url
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
    async fetchItem () {
      if (this.postID) {
        this.pageLoading = true
        const res = await this.$http.get(`rest/posts/${this.postID}`)
        if (res && res.data) {
          this.tmpItem = res.data
        }
        this.pageLoading = false
      }
    },
    goto (path) {
      this.$router.push(path)
    }
  }
}
</script>
