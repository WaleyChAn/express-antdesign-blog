<template>
  <div class="badmin-menu">
    <div class="menu-wrapper">
      <div class="layout-flex column">
        <div class="layout-flex-l scroll-y">
          <a-menu :default-selected-keys="menuSelected"
                  :default-open-keys="defaultOpen"
                  mode="inline"
                  :inline-collapsed="collapsed">
            <template v-for="item in menuList">
              <template v-if="hasPermission(item)">
                <a-menu-item v-if="!item.children"
                             :key="item.key">
                  <router-link :to="{ path: item.url }">
                    <a-icon v-if="item.icon"
                            :type="item.icon" />
                    <span>{{ item.title }}</span>
                  </router-link>
                </a-menu-item>
                <sub-menu v-else
                          :key="item.key"
                          :menu-info="item" />

              </template>
            </template>
          </a-menu>
        </div>
        <div class="layout-flex-s">
          <div class="menu-collapsed"
               @click="toggleCollapsed">
            <a-icon :type="collapsed ? 'menu-unfold' : 'menu-fold'" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SubMenu from './sub.vue'
import menuList from './config'
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'BadminMenu',
  components: {
    SubMenu
  },
  data () {
    return {
      collapsed: false,
      defaultOpen: ['1', '2', '3'],
      menuList: menuList
    }
  },
  computed: {
    ...mapGetters({
      currentUser: 'getCurrentUser',
      currentCrumbs: 'getCurrentCrumbs'
    }),
    menuSelected () {
      let tmpCrumbs = [...this.currentCrumbs]
      const activeMenu = tmpCrumbs.pop()
      const activeKey = activeMenu ? activeMenu.key : ''
      return [activeKey]
    }
  },
  watch: {
    $route () {
      this.setCurrentCrumbs()
    }
  },
  created () {
    this.setCurrentCrumbs()
  },
  methods: {
    ...mapMutations({
      updateCurrentCrumbs: 'UPDATE_CURRENT_CRUMBS'
    }),
    setCurrentCrumbs () {
      const menus = this.menuList
      const path = this.$route.path
      const newCrumbs = this.findPathByLeafUrl(path, menus)
      newCrumbs.map(item => {
        if (!this.hasPermission(item)) {
          this.$router.push('/403')
        }
      })
      this.updateCurrentCrumbs(newCrumbs)
    },
    findPathByLeafUrl (leafUrl, nodes, path) {
      if (path === undefined) {
        path = []
      }
      for (var i = 0; i < nodes.length; i++) {
        let tmpPath = path.concat()
        tmpPath.push(nodes[i])

        if (leafUrl.indexOf(nodes[i].url) !== -1) {
          return tmpPath
        }
        if (nodes[i].children) {
          const findResult = this.findPathByLeafUrl(leafUrl, nodes[i].children, tmpPath)
          if (findResult) {
            return findResult
          }
        }
      }
    },
    toggleCollapsed () {
      this.collapsed = !this.collapsed
    },
    hasPermission (item) {
      let permission = true
      const currentRoles = this.currentUser.username
      if (item.roles && !item.roles.includes(currentRoles)) {
        permission = false
      }
      return permission
    }
  }
}
</script>
