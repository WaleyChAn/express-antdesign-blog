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
    }
  }
}
