<template>
  <div class="badmin-header">
    <div class="badmin-box clearfix">
      <div v-if="currentCrumbs"
           class="badmin-crumbs left">
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
      <div v-if="currentUser"
           class="header-user right ml-sm">
        <a-dropdown placement="bottomCenter">
          <div class="user-info">
            <a-avatar :src="currentUser.avatar"
                      icon="user"
                      alt="avatar" />
            <span>{{ currentUser.nickname || currentUser.username }}</span>
            <a-icon type="down" />
          </div>
          <a-menu slot="overlay">
            <a-menu-item @click="showModal(currentUser)">
              <a-icon type="edit" />
              <span>修改信息</span>
            </a-menu-item>
            <a-menu-item v-if="currentUser.nickname === 'admin'"
                         @click="goto('/sites')">
              <a-icon type="setting" />
              <span>博客设置</span>
            </a-menu-item>
            <a-menu-divider />
            <a-menu-item @click="logout">
              <a-icon type="logout" />
              <span>退出登录</span>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
      <div class="right ml-sm">
        <a-button type="primary"
                  shape="round"
                  icon="form"
                  @click="createPost">
          新增帖子
        </a-button>
      </div>
      <div class="right">
        <a-button type="primary"
                  ghost
                  shape="round"
                  icon="home"
                  @click="goout('https://waleychan.com/#/')">
          访问博客
        </a-button>
      </div>
    </div>
    <edit-form ref="editForm"
               v-model="tmpItem"></edit-form>
  </div>
</template>

<script>
import SubMenu from '@/shared/menu/sub.vue'
import EditForm from '@/views/adminUser/edit.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'BadminHeader',
  components: {
    SubMenu,
    EditForm
  },
  data () {
    return {
      tmpItem: {}
    }
  },
  computed: {
    ...mapGetters({
      currentCrumbs: 'getCurrentCrumbs',
      currentUser: 'getCurrentUser'
    })
  },
  methods: {
    showModal (item) {
      if (item) {
        this.tmpItem = JSON.parse(JSON.stringify(item))
      }
      this.$refs.editForm.modalVisible = true
    },
    backward () {
      this.$router.back()
    },
    createPost () {
      this.$router.push('/posts/edit')
    },
    logout () {
      let _this = this
      _this.$confirm({
        title: '确定退出登录吗?',
        onOk () {
          _this.$storage.remove('token')
          _this.$router.go(0)
        },
        class: 'badmin-modal'
      })
    },
    goto (path) {
      this.$router.push(path)
    },
    goout (path) {
      window.open(path)
    }
  }
}
</script>
