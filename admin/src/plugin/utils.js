export default {
  mixinTableHeight (el) {
    setTimeout(() => {
      this.setTableHeight(el)
      window.addEventListener('resize', () => {
        this.setTableHeight(el)
      })
    }, 50)
  },
  setTableHeight (el) {
    const _this = el
    if (_this.$refs.tableWrapper) {
      const wrapperHeader = 54
      const wrapperHeight = _this.$refs.tableWrapper.clientHeight
      _this.tableScrollY = wrapperHeight - wrapperHeader
      _this.$forceUpdate()
    }
  }
}
