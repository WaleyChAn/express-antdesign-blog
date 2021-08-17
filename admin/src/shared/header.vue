<template>
  <div class="badmin-header clearfix">
    <div class="header-user right">开发中</div>
    <div class="badmin-crumbs right"
         v-if="false">
      <a-breadcrumb>
        <a-breadcrumb-item v-for="(item, index) in currentCrumbs"
                           :key="index">

          <router-link :to="{ path: item.url }">
            <a-icon v-if="item.icon"
                    :type="item.icon" />
            <span>{{ item.title }}</span>
          </router-link>
          <a-menu v-if="item.children"
                  slot="overlay"
                  class="badmin-crumbs-menu">
            <template v-for="citem in item.children">
              <a-menu-item v-if="!citem.children"
                           :key="citem.url">
                <router-link :to="{ path: citem.url }">
                  <a-icon v-if="citem.icon"
                          :type="citem.icon" />
                  <span>{{ citem.title }}</span>
                </router-link>
              </a-menu-item>
              <sub-menu v-else
                        :key="citem.key"
                        :menu-info="citem" />
            </template>
          </a-menu>
        </a-breadcrumb-item>
      </a-breadcrumb>
    </div>
  </div>
</template>

<script>
import SubMenu from './menu/sub.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'BadminHeader',
  components: {
    SubMenu
  },
  data () {
    return {

    }
  },
  computed: {
    ...mapGetters({
      currentCrumbs: 'getCurrentCrumbs'
    })
  },
  methods: {

  }
}
</script>
