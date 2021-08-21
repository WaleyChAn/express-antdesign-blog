<template>
  <div class="layout-flex align-center justify-center">
    <a-result status="403"
              title="403"
              sub-title="抱歉，您无权访问此页面。">
      <template #extra>
        <a-button type="primary"
                  @click="backToHome">回到首页</a-button>
      </template>
    </a-result>
  </div>
</template>

<script>

export default {
  name: 'Badmin403',
  components: {

  },
  methods: {
    backToHome () {
      this.$router.push({
        path: '/'
      })
    }
  }
}
</script>
