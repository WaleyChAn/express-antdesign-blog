<template>
  <div class="badmin-layout">
    <div class="layout-flex column">
      <div class="layout-flex-s">
        <badmin-header></badmin-header>
      </div>
      <div class="layout-flex-l">
        <div class="layout-flex row">
          <div class="layout-flex-s">
            <badmin-menu></badmin-menu>
          </div>
          <div class="layout-flex-l">
            <div class="badmin-body">
              <router-view></router-view>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BadminHeader from './header'
import BadminMenu from './menu/index'

export default {
  name: 'BadminLayout',
  components: {
    BadminHeader,
    BadminMenu
  },
  methods: {

  }
}
</script>
