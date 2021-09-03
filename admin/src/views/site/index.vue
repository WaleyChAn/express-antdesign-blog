<template>
  <div class="badmin-box cover hidden">
    <div class="box-scroll-wrapper scroll-y">
      <div class="badmin-form badmin-form-post">
        <a-form-model ref="siteForm"
                      :label-col="{ span: 3 }"
                      :wrapper-col="{ span: 19 }"
                      :model="siteForm">
          <a-form-model-item label="网站标题">
            <a-input v-model="siteForm.title"
                     placeholder="请输入网页的标题" />
          </a-form-model-item>
          <!-- title -->
          <a-form-model-item label="标签页小图标">
            <uploader-image v-model="siteForm.ico"
                            :formats="['image/x-icon']"></uploader-image>
            <div class="form-tips mt-incell">
              <a-icon class="mr-xs"
                      type="info-circle" />建议上传尺寸为 <span class="text-primary">16 × 16 (1:1)格式为 ico</span> 的图片
            </div>
          </a-form-model-item>
          <!-- ico -->
          <a-form-model-item label="LOGO">
            <uploader-image v-model="siteForm.logo"
                            :formats="['image/jpeg', 'image/png']"></uploader-image>
            <div class="form-tips mt-incell">
              <a-icon class="mr-xs"
                      type="info-circle" />建议上传尺寸为 <span class="text-primary">50 × 50 (1:1)格式为 jpg 或者 png</span> 的图片
            </div>
          </a-form-model-item>
          <!-- ico -->
          <a-form-model-item label="主题色">
            <color-picker v-model="siteForm.color"
                          :presets="colorPickerPresets"></color-picker>
          </a-form-model-item>
          <!-- ico -->
        </a-form-model>
        <div class="post-footer">
          <a-button type="primary"
                    shape="round"
                    size="large"
                    :loading="confirmLoading"
                    @click="handleSubmit">保存修改</a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UploaderImage from '@/components/uploaderImage.vue'
import ColorPicker from '@/components/colorPicker.vue'
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'BadminSite',
  components: {
    UploaderImage,
    ColorPicker
  },
  data () {
    return {
      siteForm: {},
      colorPickerPresets: [
        '#f8b62b',
        '#409eff',
        '#67c23a'
      ],
      confirmLoading: false
    }
  },
  computed: {
    ...mapGetters({
      currentUser: 'getCurrentUser'
    })
  },
  created () {
    this.setDefault()
  },
  methods: {
    ...mapMutations({
      updateCurrentUser: 'UPDATE_CURRENT_USER'
    }),
    setDefault () {
      const { site = {} } = this.currentUser
      this.siteForm = { ...site }
    },
    handleSubmit () {
      this.confirmLoading = true
      const tmpUser = {
        ...this.currentUser
      }
      if (!tmpUser.site) this.$set(tmpUser, 'site', {})
      tmpUser.site = { ...this.siteForm }
      this.updateCurrentUser(tmpUser)
      this.$nextTick(() => {
        this.onSave(this.currentUser._id)
      })
    },
    async onSave (id) {
      const res = await this.$http.put(`rest/admin_users/${id}`, this.currentUser)
      this.confirmLoading = false
      if (res && res.data) {
        this.$message.success('修改成功！')
        this.confirmLoading = false
      }
    }
  }
}
</script>
