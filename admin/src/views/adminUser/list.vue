<template>
  <div class="badmin-box cover">
    <div class="layout-flex column">
      <div class="layout-flex-s">
        <div class="badmin-filter margin-bottom clearfix">
          <div class="filter-item left">
            <a-button type="primary"
                      icon="plus"
                      @click="showModal()">新增管理员</a-button>
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
            <template slot="avatar"
                      slot-scope="text, record">
              <a-avatar :src="record.avatar"
                        icon="user"
                        alt="avatar" />
            </template>
            <template slot="operation"
                      slot-scope="text, record">
              <span class="table-btn text-primary"
                    @click="showModal(record)">
                <a-icon type="edit" />
                编辑
              </span>
              <a-popconfirm v-if="tableData.length"
                            :title="`确定删除 “${record.username}” 吗？`"
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
    dataIndex: '_id',
    key: '_id'
  },
  {
    title: '头像',
    dataIndex: 'avatar',
    key: 'avatar',
    scopedSlots: { customRender: 'avatar' }
  },
  {
    title: '名称',
    dataIndex: 'username',
    key: 'username'
  },
  {
    title: '昵称',
    dataIndex: 'nickname',
    key: 'nickname'
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
  name: 'BadminAdminUserList',
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
        { 'scoll-x': this.tableScrollX },
        { 'scoll-y': this.tableScrollY }
      ]
    },
    showModal (item) {
      if (item) {
        this.tmpItem = JSON.parse(JSON.stringify(item))
      }
      this.$refs.editForm.modalVisible = true
    },
    async onDelete (item) {
      const id = item._id
      const username = item.username
      if (username === 'admin') {
        this.$message.warn('请不要删除管理员账号')
      } else {
        const res = await this.$http.delete(`rest/admin_users/${id}`)
        if (res && res.data) {
          this.$message.success('删除成功！')
          this.fetchData()
        }
      }
    },
    async fetchData () {
      this.tableLoading = true
      const res = await this.$http.get('rest/admin_users')
      this.tableLoading = false
      if (res && res.data) {
        this.tableData = res.data
      }
    }
  }
}
</script>
