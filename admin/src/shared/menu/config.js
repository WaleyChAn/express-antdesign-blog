export default [
  // {
  //   key: '1',
  //   title: '博客概况',
  //   icon: 'pie-chart',
  //   url: '/posts'
  // },
  {
    key: '2',
    title: '博客管理',
    icon: 'control',
    children: [
      {
        key: '2-1',
        title: '帖子管理',
        url: '/posts'
      },
      {
        key: '2-2',
        title: '分类管理',
        url: '/categories'
      },
      {
        key: '2-3',
        title: '广告管理',
        url: '/ads'
      }
    ]
  },
  {
    key: '3',
    title: '系统设置',
    icon: 'setting',
    roles: ['admin'],
    children: [
      {
        key: '3-1',
        title: '管理员设置',
        url: '/admin_users'
      },
      {
        key: '3-2',
        title: '博客设置',
        url: '/sites'
      }
    ]
  }
]
