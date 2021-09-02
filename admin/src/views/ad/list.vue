<template>
  <div class="badmin-box cover">
    <div class="layout-flex column">
      <div class="layout-flex-s">
        <div class="badmin-filter margin-bottom clearfix">
          <div class="filter-item left">
            <a-button type="primary"
                      :icon="isLimit? 'exclamation-circle' : 'plus'"
                      :disabled="isLimit"
                      @click="showModal()">{{ isLimit? '达到广告最大数' : '新增广告' }}</a-button>
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
            <template slot="type"
                      slot-scope="text, record">
              <a-tag :color="record.type === 1 ? 'blue' : 'green'"
                     class="ma-no">{{ record.type === 1 ? '内部链接' : '外部链接' }}</a-tag>
            </template>
            <template slot="content"
                      slot-scope="text, record">
              <span v-if="record.type === 1 && record.post">
                {{ record.post.title }}
              </span>
              <span v-else-if="record.type === 2 && record.site">
                {{ record.site.title }}
              </span>
              <span v-else
                    class="opacity-6">内容未显示</span>
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
    <edit-form ref="editForm"
               v-model="tmpItem"
               @fetchData="fetchData"></edit-form>
  </div>

</template>

<script>
import EditForm from './edit.vue'

const tableColumns = [
  {
    title: '广告ID',
    dataIndex: 'adID',
    key: 'adID'
  },
  {
    title: '内容',
    dataIndex: 'content',
    key: 'content',
    scopedSlots: { customRender: 'content' }
  },
  {
    title: '类型',
    dataIndex: 'type',
    key: 'type',
    align: 'center',
    scopedSlots: { customRender: 'type' }
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
  name: 'BadminAdList',
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
      tableLoading: false,
      tableFetch: {
        populate: [{
          path: 'post',
          select: 'title'
        }]
      }
    }
  },
  created () {
    this.fetchData()
  },
  computed: {
    isLimit () {
      return this.tableData.length === 5
    }
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
        if (this.tmpItem.post && this.tmpItem.post._id) {
          this.tmpItem.post = this.tmpItem.post._id
        }
      }
      const requireParams = {
        site: {}
      }
      this.tmpItem = Object.assign(requireParams, this.tmpItem)
      this.$refs.editForm.modalVisible = true
    },
    resetModal () {
      this.modalLoading = false
      this.modalVisible = false
      this.$refs.modalForm.clearValidate()
    },
    async onDelete (id) {
      const res = await this.$http.delete(`rest/ads/${id}`)
      if (res && res.data) {
        this.$message.success('删除成功！')
        this.fetchData()
      }
    },
    async fetchData () {
      const { populate } = this.tableFetch
      const query = { populate }
      this.tableLoading = true
      const res = await this.$http.get('rest/ads', { params: query })
      this.tableLoading = false
      if (res && res.data) {
        this.tableData = res.data.result
      }
    }
  }
}
</script>
