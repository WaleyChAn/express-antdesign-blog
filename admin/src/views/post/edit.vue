<template>
  <div class="badmin-box cover scroll-y">
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
                    单击或拖动文件到此区域进行上次
                  </p>
                  <p class="ant-upload-hint">
                    建议上传尺寸比例为 2:1 或者 16:9 的图片<br />大小不能超过5M
                  </p>
                </div>
              </a-upload-dragger>
            </a-col>
          </a-row>
        </a-form-model-item>
        <!-- cover -->
        <a-form-model-item label="私密性">
          <a-radio-group v-model="tmpItem.state"
                         :default-value="0"
                         button-style="solid">
            <a-radio-button :value="0">
              <a-icon type="unlock" />
              公开
            </a-radio-button>
            <a-radio-button :value="1">
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
                  size="large">发布帖子</a-button>
        <a-button type="primary"
                  shape="round"
                  size="large"
                  ghost>保存草稿</a-button>
        <a-button type="primary"
                  shape="round"
                  size="large"
                  ghost>预览帖子</a-button>
      </div>

    </div>
  </div>
</template>

<script>
import TinymceEditor from '@/components/tinymceEditor.vue'
import CategoryPicker from '@/components/categoryPicker.vue'

export default {
  name: 'BadminPostEdit',
  components: {
    TinymceEditor,
    CategoryPicker
  },
  data () {
    return {
      tmpItem: {},
      uploadLoading: false
    }
  },
  computed: {
    postID () {
      return this.$route.query.id || ''
    }
  },
  methods: {
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
    }
  }
}
</script>
