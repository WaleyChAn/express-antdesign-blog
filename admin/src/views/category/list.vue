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
        <div class="badmin-table"
             :class="setTableClass()">
          <a-table :columns="tableColumns"
                   :data-source="tableData"
                   :scroll="{ x:tableScrollX, y: tableScrollY }"
                   :pagination="false"
                   :loading="tableLoading"
                   row-key="_id">
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
                            :title="`确定删除 “${record.name}” 吗？`"
                            ok-text="确定"
                            cancel-text="取消"
                            @confirm="() => onDelete(record)">
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
    <edit-form ref="editForm"
               v-model="tmpItem"
               @fetchData="fetchData"></edit-form>
  </div>
</template>

<script>
import EditForm from './edit.vue'

const tableColumns = [
  {
    title: 'ID',
    dataIndex: 'catID',
    key: 'catID'
  },
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '样式',
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

export default {
  name: 'BadminCategoryList',
  components: {
    EditForm
  },
  data () {
    return {
      tmpItem: {},
      tableData: [],
      tableColumns,
      tableScrollX: false,
      tableScrollY: true,
      tableLoading: false
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    setTableClass () {
      return [
        { 'scroll-x': this.tableScrollX },
        { 'scroll-y': this.tableScrollY }
      ]
    },
    showModal (item) {
      if (item) {
        this.tmpItem = JSON.parse(JSON.stringify(item))
      }
      this.$refs.editForm.modalVisible = true
    },
    resetModal () {
      this.modalLoading = false
      this.modalVisible = false
      this.$refs.modalForm.clearValidate()
    },
    async onDelete (item) {
      const id = item._id
      const catID = item.catID
      if (catID === this.$config.defaultCategory) {
        this.$message.warn('请不要删除默认分类')
      } else {
        const res = await this.$http.delete(`rest/categories/${id}`)
        if (res && res.data) {
          this.$message.success('删除成功！')
          this.fetchData()
        }
      }
    },
    async fetchData () {
      this.tableLoading = true
      const res = await this.$http.get('rest/categories')
      this.tableLoading = false
      if (res && res.data) {
        this.tableData = res.data.result
      }
    }
  }
}
</script>
