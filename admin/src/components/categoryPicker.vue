<template>
  <div class="badmin-categorypicker">
    <div class="badmin-tags size-m">
      <div class="tags-group">
        <div v-for="(item, index) in list"
             :key="index"
             :class="{'active': tmpValue.indexOf(item._id) !== -1}"
             class="tags-item"
             @click="itemClick(item._id)">{{ item.name }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BadminCategoryPicker',
  components: {
  },
  props: {
    value: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      tmpValue: [],
      list: [],
      loading: false
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
  created () {
    this.tmpValue = this.value
    this.fetchData()
  },
  methods: {
    async fetchData () {
      this.loading = true
      const res = await this.$http.get('rest/categories')
      this.loading = false
      if (res && res.data) {
        this.list = res.data
      }
    },
    itemClick (id) {
      const index = this.tmpValue.indexOf(id)
      if (index === -1) {
        this.tmpValue.push(id)
      } else {
        this.tmpValue.splice(index, 1)
      }
    }
  }
}
</script>

<style scoped lang="less">
</style>
