const prefix = process.env.VUE_APP_NAME

const storage = {
  /**
   * 获取一个值
   * @param key
   * @return {*}
   */
  get (key) {
    key = `${prefix}-${key}`
    let value = localStorage.getItem(key)

    if (!value) {
      return null
    }

    return JSON.parse(value)
  },
  /**
   * 存储一个值
   * @param key
   * @param value
   */
  set (key, value) {
    key = `${prefix}-${key}`
    localStorage.setItem(key, JSON.stringify(value))
  },
  /**
   * 删除一个值
   * @param key
   */
  remove (key) {
    key = `${prefix}-${key}`
    localStorage.removeItem(key)
  },
  /**
   * 清空所有值（当前项目命名空间下的key值）
   */
  clear () {
    let len = localStorage.length
    let keys = []

    for (let i = 0; i < len; i++) {
      let key = localStorage.key(i)
      if (key && key.startsWith(prefix)) {
        keys.push(key)
      }
    }

    keys.map(key => localStorage.removeItem(key))
  }
}

export default storage
