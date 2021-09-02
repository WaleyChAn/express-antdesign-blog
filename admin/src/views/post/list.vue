<template>
  <div class="badmin-box cover">
    <div class="layout-flex column">
      <div class="layout-flex-s">
        <table-filter ref="tableFilter"
                      @create="onEdit"
                      @search="fetchData"></table-filter>
      </div>
      <div class="layout-flex-l"
           ref="tableWrapper">
        <div class="badmin-table"
             :class="setTableClass()">
          <a-table :columns="tableColumns"
                   :data-source="tableData"
                   :scroll="{ x:tableScrollX, y: tableScrollY }"
                   :pagination="false"
                   :loading="tableLoading"
                   @change="onTableChange"
                   row-key="_id">
            <template slot="author"
                      slot-scope="text, record">
              <div class="badmin-avatar">
                <a-avatar :src="record.author.avatar"
                          icon="user"
                          alt="avatar"
                          size="small" />
                <span class="name">{{ record.author.nickname || record.author.username }}</span>
              </div>
            </template>
            <template slot="createdAt"
                      slot-scope="text, record">
              <span>{{ record.createdAt | date }}</span>
            </template>
            <template slot="updatedAt"
                      slot-scope="text, record">
              <span>{{ record.updatedAt | date }}</span>
            </template>
            <template slot="categories"
                      slot-scope="text, record">
              <div class="badmin-tags">
                <template v-if="record.categories.length > 0">
                  <div v-for="(item, index) in record.categories"
                       :key="index"
                       class="tags-item"
                       :style="{backgroundColor: item.color}">
                    {{ item.name }}
                  </div>
                </template>
                <div v-else
                     class="tags-item">其他</div>
              </div>
            </template>
            <template slot="isPublic"
                      slot-scope="text, record">
              <div :class="[{'text-primary': record.isPublic}, {'opacity-5': !record.isPublic}]">
                <a-icon :type="record.isPublic ? 'unlock' : 'lock'" />
                {{ record.isPublic ? '公开' : '私密' }}
              </div>
            </template>
            <template slot="state"
                      slot-scope="text, record">
              <a-tag :color="record.state === 1 ? 'blue' : 'green'"
                     class="ma-no">{{ record.state === 1 ? '正常' : '草稿' }}</a-tag>
            </template>
            <template slot="operation"
                      slot-scope="text, record">
              <span class="table-btn text-primary"
                    @click="onEdit(record._id)">
                <a-icon type="edit" />
                编辑
              </span>
              <a-popconfirm v-if="tableData.length"
                            :title="`确定删除帖子吗？`"
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
      <div class="layout-flex-s">
        <div class="badmin-filter mt-sm">
          <div class="filter-item right">
            <a-pagination v-model="tablePagination.current"
                          show-size-changer
                          :page-size-options="tablePagination.options"
                          :page-size.sync="tablePagination.size"
                          :total="tablePagination.total"
                          @showSizeChange="fetchData()"
                          @change="fetchData()" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TableFilter from './filter.vue'
import dayjs from 'dayjs'

const tableColumns = [
  {
    title: '标题',
    dataIndex: 'title',
    key: 'title',
    width: 400
  },
  {
    title: '作者',
    dataIndex: 'author',
    key: 'author',
    scopedSlots: { customRender: 'author' }
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    key: 'createdAt',
    sorter: true,
    scopedSlots: { customRender: 'createdAt' }
  },
  {
    title: '更新时间',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
    sorter: true,
    scopedSlots: { customRender: 'updatedAt' }
  },
  {
    title: '分类',
    dataIndex: 'categories',
    key: 'categories',
    width: 300,
    scopedSlots: { customRender: 'categories' }
  },
  {
    title: '私密',
    dataIndex: 'isPublic',
    align: 'center',
    key: 'isPublic',
    scopedSlots: { customRender: 'isPublic' }
  },
  {
    title: '状态',
    dataIndex: 'state',
    align: 'center',
    key: 'state',
    scopedSlots: { customRender: 'state' }
  },
  {
    title: '操作',
    key: 'operation',
    width: 150,
    align: 'center',
    fixed: 'right',
    scopedSlots: { customRender: 'operation' }
  }
]

export default {
  name: 'BadminPostList',
  components: {
    TableFilter
  },
  filters: {
    date (val) {
      return dayjs(val).format('YYYY-MM-DD')
    }
  },
  data () {
    return {
      tableData: [],
      tableColumns,
      tableScrollX: 1500,
      tableScrollY: true,
      tableScrollInner: true,
      tableLoading: false,
      tableFetch: {
        populate: ['author', 'categories'],
        select: '-body',
        sort: {
          createdAt: -1
        }
      },
      tablePagination: {
        options: ['15', '30', '50'],
        current: 1,
        size: 15,
        total: 300
      }
    }
  },
  mounted () {
    if (this.tableScrollInner) {
      this.$utils.mixinTableHeight(this)
    }
    this.fetchData()
  },
  methods: {
    setTableClass () {
      return [
        { 'scroll-inner': this.tableScrollInner },
        { 'scroll-x': this.tableScrollX },
        { 'scroll-y': this.tableScrollY }
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
    onTableChange (pagination, filters, sorter, { currentDataSource }) {
      const { field, order } = sorter
      const newSorter = {
        [field]: order === 'ascend' ? 1 : -1
      }
      this.tableFetch.sort = newSorter
      this.fetchData()
    },
    async onDelete (id) {
      const res = await this.$http.delete(`rest/posts/${id}`)
      if (res && res.data) {
        this.$message.success('删除成功！')
        this.fetchData()
      }
    },
    async fetchData () {
      const { current: page, size: limit } = this.tablePagination
      const { populate, select, sort } = this.tableFetch
      const where = this.$refs.tableFilter.getFilters()
      const query = { where, populate, select, sort, page, limit }
      this.tableLoading = true
      const res = await this.$http.get('rest/posts', { params: query })
      if (res && res.data) {
        this.tableData = res.data.result
        this.tablePagination.total = res.data.total
      }
      this.tableLoading = false
    }
  }
}
</script>
