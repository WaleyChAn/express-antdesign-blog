<template>
  <div class="badmin-header">
    <div class="badmin-box clearfix">
      <div class="badmin-crumbs left">
        <div class="crumbs-back"
             @click="backward">
          <a-icon type="arrow-left" />
          <span>后退</span>
        </div>
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
      <div class="header-user right">
        <a-dropdown placement="bottomCenter">
          <div class="user-info">
            <a-avatar :src="currentUser.avatar"
                      icon="user"
                      alt="avatar" />
            <span>{{ currentUser.nickname || currentUser.username }}</span>
            <a-icon type="down" />
          </div>
          <a-menu slot="overlay">
            <a-menu-item>
              <a-icon type="edit" />
              <span>修改信息</span>
            </a-menu-item>
            <a-menu-item>
              <a-icon type="setting" />
              <span>博客设置</span>
            </a-menu-item>
            <a-menu-divider />
            <a-menu-item>
              <a-icon type="logout" />
              <span>退出登录</span>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
      <div class="right mr-sm">
        <a-button type="primary"
                  shape="round"
                  icon="form">
          新增帖子
        </a-button>
      </div>
      <div class="right mr-sm">
        <a-button type="primary"
                  ghost
                  shape="round"
                  icon="home">
          访问博客
        </a-button>
      </div>
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
      currentUser: {
        _id: 'test1test1',
        username: 'admin',
        nickname: 'admin',
        password: '123456',
        avatar: ''
      }
    }
  },
  computed: {
    ...mapGetters({
      currentCrumbs: 'getCurrentCrumbs'
    })
  },
  methods: {
    backward () {
      this.$router.back()
    }
  }
}
</script>
