<template>
  <div class="badmin-filter mb-xs clearfix">
    <!-- left -->
    <div class="filter-item left mb-xs">
      <a-button type="primary"
                icon="plus"
                @click="onCreate()">新增帖子</a-button>
    </div>
    <!-- right -->
    <div class="filter-item right mb-xs ml-sm">
      <a-input-search v-model="searchVal.keyword"
                      allow-clear
                      placeholder="请输入标题搜索帖子"
                      @search="onSearch" />
    </div>
    <div class="filter-item right mb-xs">
      <div class="filter-btn"
           @click="onShow">
        <a-icon type="filter"
                theme="filled" />
        <span>高级筛选</span>
      </div>
    </div>
    <a-drawer placement="top"
              :closable="false"
              :mask="false"
              :visible="drawerVisible"
              :height="drawerHeight"
              class="badmin-drawer-filter"
              @close="onClose">
      <div class="badmin-form layout-flex column">
        <div class="layout-flex-l">
          <a-form-model ref="drawerForm"
                        :model="searchVal">
            <a-row :gutter="20">
              <a-col :span="6">
                <a-form-model-item label="名称">
                  <a-input v-model="searchVal.keyword"
                           placeholder="请输入标题" />
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <a-form-model-item label="作者">
                  <a-select v-model="searchVal.author"
                            placeholder="请选择作者"
                            @dropdownVisibleChange="fetchSearcOption('admin_users')">
                    <a-spin v-if="searchLoading.admin_users"
                            slot="notFoundContent"
                            size="small" />
                    <template v-if="selectOption.admin_users">
                      <a-select-option value="">全部</a-select-option>
                      <a-select-option v-for="(item, index) in selectOption.admin_users"
                                       :key="index"
                                       :value="item._id">
                        <span>{{ item.nickname || item.username }} </span>
                        <span style="opacity: .5">({{ item.username }})</span>
                      </a-select-option>
                    </template>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <a-form-model-item label="状态">
                  <a-select v-model="searchVal.state">
                    <a-select-option :value="0">全部</a-select-option>
                    <a-select-option :value="1">正常</a-select-option>
                    <a-select-option :value="2">草稿</a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <a-form-model-item label="分类">
                  <a-select v-model="searchVal.categories"
                            show-arrow
                            placeholder="请选择分类"
                            mode="multiple"
                            @dropdownVisibleChange="fetchSearcOption('categories')">
                    <a-spin v-if="searchLoading.categories"
                            slot="notFoundContent"
                            size="small" />
                    <template v-if="selectOption.categories">
                      <a-select-option v-for="(item, index) in selectOption.categories"
                                       :key="index"
                                       :value="item._id">
                        {{ item.name }}
                      </a-select-option>
                    </template>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <a-form-model-item label="创建日期">
                  <a-range-picker v-model="searchVal.createdRange" />
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <a-form-model-item label="更新日期">
                  <a-range-picker v-model="searchVal.updatedRange" />
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-form-model>
        </div>
        <div class="layout-flex-s">
          <div class="drawer-footer text-right">
            <a-button @click="onClose">
              取消
            </a-button>
            <a-button type="primary"
                      class="ml-xs"
                      ghost
                      @click="onReset">
              重置
            </a-button>
            <a-button type="primary"
                      class="ml-xs"
                      :loading="drawerLoading"
                      @click="onSearch">
              确认
            </a-button>
          </div>
        </div>
      </div>
    </a-drawer>
  </div>
</template>

<script>
export default {
  name: 'BadminPostFilter',
  components: {
  },
  data () {
    return {
      searchVal: {
        keyword: '',
        author: '',
        state: 0,
        categories: [],
        createdRange: [],
        updatedRange: []
      },
      searchLast: [],
      searchDefault: [],
      searchLoading: {},
      selectOption: {},
      listAuthor: [],
      listCat: [],
      drawerHeight: 234,
      drawerVisible: false,
      drawerLoading: false
    }
  },
  created () {
    this.setDefault()
  },
  methods: {
    async fetchSearcOption (type) {
      if (!this.selectOption[type] || this.selectOption[type] === 0) {
        this.$set(this.searchLoading, type, true)
        const res = await this.$http.get(`rest/${type}`)
        this.searchLoading[type] = false
        if (res && res.data) {
          this.$set(this.selectOption, type, res.data.result)
        }
      }
    },
    onCreate () {
      this.$emit('create')
    },
    onSearch () {
      this.$emit('search')
      this.drawerVisible = false
    },
    onShow () {
      Object.assign(this.searchLast, this.searchVal)
      this.drawerVisible = true
    },
    onClose () {
      Object.assign(this.searchVal, this.searchLast)
      this.drawerVisible = false
    },
    onReset () {
      Object.assign(this.searchVal, this.searchDefault)
    },
    setDefault () {
      Object.assign(this.searchDefault, this.searchVal)
    },
    setFilters (opt = [], arr = []) {
      opt.map(({ valid, filter }) => {
        if (valid) arr.push(filter)
      })
      return arr
    },
    getFilters () {
      const {
        keyword = '',
        author = '',
        state = 0,
        categories = [],
        createdRange = [],
        updatedRange = []
      } = this.searchVal

      // find
      const option = [
        {
          valid: keyword.length > 0,
          filter: { title: { $regex: keyword, $options: 'i' } }
        },
        {
          valid: author.length > 0,
          filter: { author: { $eq: author } }
        },
        {
          valid: state !== 0,
          filter: { state: { $eq: state } }
        },
        {
          valid: categories.length > 0,
          filter: { categories: { $all: categories } }
        },
        {
          valid: createdRange.length > 0,
          filter: {
            createdAt: {
              $gte: createdRange[0],
              $lte: createdRange[1]
            }
          }
        },
        {
          valid: updatedRange.length > 0,
          filter: {
            updatedAt: {
              $gte: updatedRange[0],
              $lte: updatedRange[1]
            }
          }
        }
      ]
      const filters = this.setFilters(option)

      // init
      let where = {}
      if (filters.length > 0) {
        where = {
          $and: filters
        }
      }
      return where
    }
  }
}
</script>
