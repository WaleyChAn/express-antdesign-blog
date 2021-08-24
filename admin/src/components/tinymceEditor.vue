<template>
  <div class="badmin-editor"
       :class="setClass()">
    <a-spin :spinning="loading">
      <editor v-model="tmpValue"
              :init="init"
              :disabled="disabled"
              :placeholder="placeholder">
      </editor>
    </a-spin>
  </div>
</template>

<script>
import tinymce from 'tinymce/tinymce'
import Editor from '@tinymce/tinymce-vue'
import 'tinymce/themes/silver'
import 'tinymce/icons/default/icons'
// plugins
import 'tinymce/plugins/code'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/wordcount'
// plugins custom
import '/public/tinymce/plugins/image'
import '/public/tinymce/plugins/indent2em'

export default {
  name: 'BadminTinymceEditor',
  components: {
    Editor
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    plugins: {
      type: [String, Array],
      default: 'code lists image wordcount indent2em'
    },
    toolbar: {
      type: [String, Array],
      default: 'code | formatselect | bold italic forecolor backcolor | indent2em | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | lists image | removeformat'
    }
  },
  data () {
    return {
      tmpValue: '',
      loading: true,
      isFocus: false,
      init: {
        language_url: '/tinymce/langs/zh_CN.js',
        language: 'zh_CN',
        // http://skin.tiny.cloud
        skin_url: '/tinymce/skins/ui/custom',
        height: 400,
        plugins: this.plugins,
        toolbar: this.toolbar,
        branding: false,
        menubar: false,
        resize: false,
        init_instance_callback: editor => {
          this.loading = false
        },
        images_upload_handler: (blobInfo, success, failure) => this.uploadImg(blobInfo, success, failure),
        setup: editor => {
          editor.on('focus blur', e => {
            this.handlerFocus(e)
          })
        }
      }
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
  mounted () {
    tinymce.init({})
  },
  methods: {
    async uploadImg (blobInfo, success, failure) {
      const formData = new FormData()
      formData.append('file', blobInfo.blob(), blobInfo.filename())
      const res = await this.$http.post('upload', formData)
      if (res && res.data) {
        success(res.data.url)
      }
    },
    setClass () {
      return [
        { 'focus': this.isFocus }
      ]
    },
    clear () {
      this.tmpValue = ''
    },
    handlerFocus (e) {
      switch (e.type) {
        case 'focus':
          this.isFocus = true
          break
        case 'blur':
          this.isFocus = false
          break
      }
    }
  }
}

</script>
