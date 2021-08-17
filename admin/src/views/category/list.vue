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
    <a-modal :title="tmpItem.name ? '编辑分类' : '新增分类'"
             :visible="visible"
             :confirm-loading="confirmLoading"
             ok-text="确认"
             cancel-text="取消"
             @ok="handleOk"
             @cancel="handleCancel">
      <a-form-model ref="innerForm"
                    :model="tmpItem"
                    :rules="innerFormRules">
        <a-form-model-item label="名称"
                           prop="name">
          <a-input v-model="tmpItem.name" />
        </a-form-model-item>
      </a-form-model>
      <p> </p>
    </a-modal>
  </div>
</template>

<script>
const tableColumns = [
  {
    title: '分类名称',
    dataIndex: 'name',
    key: 'name',
    width: 200
  },
  {
    title: '分类ID',
    dataIndex: '_id',
    key: '_id'
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
    _id: 32
  }
]

export default {
  name: 'BadminCategoryList',
  components: {
  },
  data () {
    return {
      tableData,
      tableColumns,
      tmpItem: {},
      visible: false,
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
      if (item) {
        this.tmpItem = JSON.parse(JSON.stringify(item))
      }
      this.visible = true
    },
    handleOk () {
      this.confirmLoading = true
      this.$refs.innerForm.validate(valid => {
        if (valid) {
          if (this.tmpItem._id) {
            this.onEdit(this.tmpItem._id)
          } else {
            this.onSave()
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
      this.visible = false
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
