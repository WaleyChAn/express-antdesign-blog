<template>
  <div class="layout-flex align-center justify-center">
    <a-result status="404"
              title="404"
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
  name: 'Badmin404',
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
