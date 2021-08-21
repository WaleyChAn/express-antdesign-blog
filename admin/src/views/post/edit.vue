<template>
  <div class="">
    {{ postID }}
  </div>
</template>

<script>
export default {
  name: 'BadminPostEdit',
  components: {
  },
  data () {
    return {
    }
  },
  computed: {
    postID () {
      return this.$route.query.id || ''
    }
  }
}
</script>
