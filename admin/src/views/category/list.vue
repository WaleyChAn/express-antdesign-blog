<template>
  <div class="badmin-box cover">
    <div class="layout-flex column">
      <div class="layout-flex-s">
        <div class="badmin-filter margin-bottom clearfix">
          <div class="filter-item left">
            <a-button type="primary"
                      icon="plus"
                      @click="showModal()">新增分类</a-button>
          </div>
        </div>
      </div>
      <div class="layout-flex-l">
        <div class="badmin-table">
          <a-table :columns="tableColumns"
                   :data-source="tableData">
            <template slot="color"
                      slot-scope="text, record">
              <div class="badmin-tags ">
                <div class="tags-item"
                     :style="{backgroundColor: record.color}">
                  {{ record.name }}
                </div>
              </div>
            </template>
            <template slot="operation"
                      slot-scope="text, record">
              <span class="table-btn text-primary"
                    @click="showModal(record)">
                <a-icon type="edit" />
                编辑
              </span>
              <a-popconfirm v-if="tableData.length"
                            :title="'确定删除分类 “'+ record.name + '” 吗？'"
                            ok-text="确定"
                            cancel-text="取消"
                            @confirm="() => onDelete(record._id)">
                <span class="table-btn text-error">
                  <a-icon type="delete" />
                  删除
                </span>
              </a-popconfirm>
            </template>
          </a-table>
        </div>
      </div>
    </div>
    <a-modal :title="modalTitle"
             :visible="modalVisible"
             :confirm-loading="confirmLoading"
             ok-text="确认"
             cancel-text="取消"
             @ok="handleOk"
             @cancel="handleCancel">
      <a-form-model ref="innerForm"
                    :model="tmpItem"
                    :rules="innerFormRules">
        <a-form-model-item label="分类名称"
                           prop="name">
          <a-input v-model="tmpItem.name" />
        </a-form-model-item>
        <a-form-model-item label="分类样式"
                           prop="color">
          <badmin-color-picker v-model="tmpItem.color"></badmin-color-picker>
        </a-form-model-item>
      </a-form-model>
      <p> </p>
    </a-modal>
  </div>
</template>

<script>
import BadminColorPicker from '@/components/colorPicker'

const tableColumns = [
  {
    title: '分类名称',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '分类ID',
    dataIndex: '_id',
    key: '_id'
  },
  {
    title: '分类样式',
    dataIndex: 'color',
    key: 'color',
    scopedSlots: { customRender: 'color' }
  },
  {
    title: '操作',
    key: 'operation',
    width: 200,
    align: 'center',
    scopedSlots: { customRender: 'operation' }
  }
]

const tableData = [
  {
    key: '1',
    name: 'John Brown',
    _id: 32,
    color: '#87d068'
  },
  {
    key: '2',
    name: 'John Brown',
    _id: 32,
    color: '#409eff'
  }
]

export default {
  name: 'BadminCategoryList',
  components: {
    BadminColorPicker
  },
  data () {
    return {
      tableData,
      tableColumns,
      tmpItem: {},
      modalVisible: false,
      modalTitle: '',
      confirmLoading: false,
      innerFormRules: {
        name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    showModal (item) {
      this.modalTitle = '新增分类'
      if (item) {
        this.modalTitle = '编辑分类'
        this.tmpItem = JSON.parse(JSON.stringify(item))
      }
      this.modalVisible = true
    },
    handleOk () {
      let _this = this
      _this.$refs.innerForm.validate(valid => {
        if (valid) {
          _this.confirmLoading = true
          if (_this.tmpItem._id) {
            _this.onEdit(this.tmpItem._id)
          } else {
            _this.onSave()
          }
        } else {
          return false
        }
      })
    },
    handleCancel () {
      this.resetModal()
    },
    resetModal () {
      this.tmpItem = {}
      this.confirmLoading = false
      this.modalVisible = false
      this.$refs.innerForm.resetFields()
    },
    onSave () {
      this.resetModal()
    },
    onEdit (id) {
      this.resetModal()
    },
    onDelete (id) {
      console.log(id)
    }
  }
}
</script>
