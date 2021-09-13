export default {
  data () {
    return {
    }
  },
  computed: {

  },
  methods: {
    mixinUploadUrl () {
      return `${this.$http.defaults.baseURL}/upload`
    },
    mixinAuthHeaders () {
      return {
        Authorization: `Bearer ${this.$storage.get('token')}`
      }
    },
    mixinTableHeight () {
      setTimeout(() => {
        this.setTableHeight()
        window.addEventListener('resize', () => {
          this.setTableHeight()
        })
      }, 50)
    },
    setTableHeight () {
      if (this.$refs.tableWrapper) {
        const wrapperHeader = 54
        const wrapperHeight = this.$refs.tableWrapper.clientHeight
        this.tableScrollY = wrapperHeight - wrapperHeader
        this.$forceUpdate()
      }
    }
  }
}
