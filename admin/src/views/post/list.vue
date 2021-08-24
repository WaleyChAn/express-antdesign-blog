<template>
  <div class="badmin-box cover">
    <div class="layout-flex column">
      <div class="layout-flex-s">
        <div class="badmin-filter margin-bottom clearfix">
          <div class="filter-item left">
            <a-button type="primary"
                      icon="plus"
                      @click="onEdit()">新增帖子</a-button>
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
            <template slot="categories"
                      slot-scope="text, record">
              <div class="badmin-tags">
                <div v-for="(item, index) in record.categories"
                     :key="index"
                     class="tags-item"
                     :style="{backgroundColor: item.color}">
                  {{ item.name }}
                </div>
              </div>
            </template>
            <template slot="operation"
                      slot-scope="text, record">
              <span class="table-btn text-primary"
                    @click="onEdit(record._id)">
                <a-icon type="edit" />
                编辑
              </span>
              <a-popconfirm v-if="tableData.length"
                            :title="`确定删除 “${record.title}” 吗？`"
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
  </div>
</template>

<script>
const tableColumns = [
  {
    title: 'ID',
    dataIndex: '_id',
    key: '_id'
  },
  {
    title: '帖子标题',
    dataIndex: 'title',
    key: 'title'
  },
  {
    title: '帖子分类',
    dataIndex: 'categories',
    key: 'categories',
    scopedSlots: { customRender: 'categories' }
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
  name: 'BadminPostList',
  components: {

  },
  data () {
    return {
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
        { 'scoll-x': this.tableScrollX },
        { 'scoll-y': this.tableScrollY }
      ]
    },
    onEdit (id) {
      this.$router.push({
        path: '/posts/edit',
        query: {
          id: id
        }
      })
    },
    async onDelete (id) {
      const res = await this.$http.delete(`rest/posts/${id}`)
      if (res && res.data) {
        this.$message.success('删除成功！')
        this.fetchData()
      }
    },
    async fetchData () {
      this.tableLoading = true
      const res = await this.$http.get('rest/posts')
      if (res && res.data) {
        this.tableData = res.data
      }
      this.tableLoading = false
    }
  }
}
</script>
