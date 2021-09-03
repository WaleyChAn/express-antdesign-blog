<template>
  <div class="badmin-uploader-image">
    <a-upload name="file"
              list-type="picture-card"
              :show-upload-list="false"
              :action="mixinUploadUrl()"
              :headers="mixinAuthHeaders()"
              :before-upload="beforeUpload"
              @change="handleChange">
      <img v-if="tmpValue"
           :src="tmpValue"
           alt="avatar" />
      <div v-else>
        <a-icon :type="uploadLoading ? 'loading' : 'plus'" />
      </div>
    </a-upload>
  </div>
</template>

<script>
export default {
  name: 'BadminUploaderImage',
  components: {
  },
  props: {
    value: {
      type: [String, Object],
      default: ''
    },
    formats: {
      type: Array,
      default () {
        return []
      }
    },
    limit: {
      type: Number,
      default: 2
    }
  },
  data () {
    return {
      tmpValue: '',
      uploadLoading: false
    }
  },
  watch: {
    value: {
      handler (n) {
        this.tmpValue = n
      },
      deep: true
    },
    tmpValue: {
      handler (n) {
        this.$emit('input', n)
      },
      deep: true
    }
  },
  created () {
    this.tmpValue = this.value
  },
  methods: {
    handleChange (info) {
      if (info.file.status === 'uploading') {
        this.tmpValue = ''
        this.uploadLoading = true
        return
      }
      if (info.file.status === 'done' && info.file.response) {
        this.tmpValue = info.file.response.url
        this.uploadLoading = false
      }
      if (info.file.status === 'error') {
        this.$message.error('图片上传失败')
        this.uploadLoading = false
      }
    },
    beforeUpload (file) {
      console.log(file.type, file.size)
      let isFormatValid = true
      if (this.formats.length > 0) {
        isFormatValid = this.formats.includes(file.type)
      }
      if (!isFormatValid) {
        this.$message.error('请上传正确格式的图片')
      }

      let isLimit = true
      if (this.limit > 0) {
        isLimit = file.size / 1024 / 1024 < this.limit
      }
      if (!isLimit) {
        this.$message.error(`图片大小请不要超过${this.limit}MB`)
      }
      return isFormatValid && isLimit
    }
  }
}
</script>

<style scoped lang="less">
</style>
