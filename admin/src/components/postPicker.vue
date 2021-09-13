<template>
  <div class="badmin-postpicker">
    <a-input v-model="tmpValue"
             ref="postpickerInput"
             @click="onShow"
             placeholder="请选择帖子">
      <a-icon type="search"
              slot="suffix" />
    </a-input>
    <div class="badmin-list border"
         v-if="tmpPost">
      <div class="list-item">
        <div class="close-btn"
             @click="handlerClear">
          <a-icon type="close" />
        </div>
        <div class="title"> {{ tmpPost.title }}</div>
        <div class="info clearfix">
          <div class="info-item">
            <a-icon type="user" />
            <span>
              {{ tmpPost.author.nickname || tmpPost.author.username }}
            </span>
          </div>
          <div class="info-item">
            <a-icon type="clock-circle" />
            <span>
              {{ tmpPost.createdAt | date }}
            </span>
          </div>
          <div class="info-item"
               v-if="tmpPost.categories.length > 0">
            <a-icon type="tags" />
            <span v-for="(citem, cindex) in tmpPost.categories"
                  :key="cindex">
              {{ citem.name }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <a-modal :visible="modalVisible"
             :confirm-loading="modalLoading"
             :afterClose="handleClose"
             :closable="false"
             ok-text="确认"
             cancel-text="取消"
             class="badmin-modal list-wrapper"
             @ok="handleOk"
             @cancel="handleCancel">
      <div class="layout-flex column pa-sm">
        <div class="layout-flex-s">
          <div class="badmin-filter mb-sm clearfix">
            <div class="filter-item"
                 style="width: 100%;">
              <a-input-search v-model="tableSearch.keyword"
                              allow-clear
                              placeholder="请输入标题搜索帖子"
                              @search="fetchData" />
            </div>
          </div>
        </div>
        <div class="layout-flex-l scroll-y"
             ref="tableWrapper">
          <div class="badmin-list selectable">
            <div v-for="(item, index) in tableData"
                 :key="index"
                 class="list-item"
                 :class="{'active': pickerVal._id ? item._id === pickerVal._id : item._id === tmpValue }"
                 @click="pickerVal = item">
              <div class="title">{{ item.title }}</div>
              <div class="info clearfix">
                <div class="info-item">
                  <a-icon type="user" />
                  <span>
                    {{ item.author.nickname || item.author.username }}
                  </span>
                </div>
                <div class="info-item">
                  <a-icon type="clock-circle" />
                  <span>
                    {{ item.createdAt | date }}
                  </span>
                </div>
                <div class="info-item"
                     v-if="item.categories.length > 0">
                  <a-icon type="tags" />
                  <span v-for="(citem, cindex) in item.categories"
                        :key="cindex">
                    {{ citem.name }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <template slot="footer">
        <div style="float:left; padding: 4px 0;">
          <a-pagination v-model="tablePagination.current"
                        simple
                        show-size-changer
                        :page-size-options="tablePagination.options"
                        :page-size.sync="tablePagination.size"
                        :total="tablePagination.total"
                        @showSizeChange="fetchData()"
                        @change="fetchData()" />
        </div>
        <a-button @click="handleCancel">
          取消
        </a-button>
        <a-button type="primary"
                  :loading="modalLoading"
                  @click="handleOk">
          确认
        </a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import dayjs from 'dayjs'

export default {
  name: 'BadminPostPicker',
  components: {
  },
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  filters: {
    date (val) {
      return dayjs(val).format('YYYY-MM-DD')
    }
  },
  data () {
    return {
      tmpValue: '',
      tmpPost: null,
      modalVisible: false,
      modalLoading: false,
      modalTimer: null,
      tableData: [],
      tableFetch: {
        populate: ['author', 'categories'],
        select: '-body -isPublic -state',
        sort: {
          createdAt: -1
        }
      },
      tablePagination: {
        options: ['15', '30', '50'],
        current: 1,
        size: 15,
        total: 300
      },
      tableSearch: {
        keyword: '',
        state: 1,
        isPublic: true
      },
      pickerVal: {
        value: '',
        post: {}
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
  mounted () {
    this.tmpValue = this.value
    if (this.tmpValue.length > 0 && !this.tmpPost) {
      this.fetchItem(this.tmpValue)
    }
  },
  methods: {
    onShow () {
      this.modalVisible = true
      if (this.tableData.length === 0) {
        this.fetchData()
      }
    },
    handleClose () {
      this.$refs.postpickerInput.blur()
      this.pickerVal = {}
    },
    handleOk () {
      this.tmpValue = this.pickerVal._id
      this.tmpPost = this.pickerVal
      this.pickerVal = {}
      this.modalVisible = false
    },
    handleCancel () {
      this.modalVisible = false
    },
    handlerClear () {
      this.tmpValue = ''
      this.tmpPost = null
      this.pickerVal = {}
    },
    async fetchItem (id) {
      const { populate, select } = this.tableFetch
      const query = { populate, select }
      const res = await this.$http.get(`rest/posts/${id}`, { params: query })
      if (res && res.data) {
        this.tmpPost = res.data
      }
    },
    async fetchData () {
      const { current: page, size: limit } = this.tablePagination
      const { populate, select, sort } = this.tableFetch
      const where = {
        $and: [
          { title: { $regex: this.tableSearch.keyword, $options: 'i' } },
          { isPublic: { $eq: this.tableSearch.isPublic } },
          { state: { $eq: this.tableSearch.state } }
        ]
      }
      const query = { where, populate, select, sort, page, limit }
      const res = await this.$http.get('rest/posts', { params: query })
      if (res && res.data) {
        this.tableData = res.data.result
        this.tablePagination.total = res.data.total
      }
    }
  }
}
</script>

<style scoped lang="less">
</style>
