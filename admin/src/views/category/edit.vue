<template>
  <a-modal :title="tmpItem._id ? '编辑分类' : '新增分类'"
           :visible="modalVisible"
           :confirm-loading="modalLoading"
           :afterClose="handleClose"
           ok-text="确认"
           cancel-text="取消"
           class="badmin-modal"
           @ok="handleOk"
           @cancel="handleCancel">
    <a-form-model ref="modalForm"
                  :model="tmpItem"
                  :rules="modalFormRules">
      <a-form-model-item label="名称"
                         prop="name">
        <a-input v-model="tmpItem.name"
                 placeholder="请输入名称" />
      </a-form-model-item>
      <a-form-model-item label="样式"
                         prop="color">
        <badmin-color-picker v-model="tmpItem.color"></badmin-color-picker>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import BadminColorPicker from '@/components/colorPicker'

export default {
  name: 'BadminCategoryEdit',
  components: {
    BadminColorPicker
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
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
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
      const catID = 'cat' + Number(new Date()).toString(36)
      this.$set(this.tmpItem, 'catID', catID)
      const res = await this.$http.post('rest/categories', this.tmpItem)
      this.modalLoading = false
      if (res && res.data) {
        this.$message.success('新增成功！')
        this.fetchData()
        this.modalVisible = false
      }
    },
    async onEdit (id) {
      const res = await this.$http.put(`rest/categories/${id}`, this.tmpItem)
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
