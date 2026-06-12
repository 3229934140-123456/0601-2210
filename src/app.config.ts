export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/guide/index',
    'pages/interact/index',
    'pages/activity/index',
    'pages/mine/index',
    'pages/exhibit-detail/index',
    'pages/route-detail/index',
    'pages/badge-wall/index',
    'pages/quiz/index',
    'pages/guide-booking/index',
    'pages/feedback/index',
    'pages/share-card/index',
    'pages/settings/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#8B4513',
    navigationBarTitleText: '数字文化馆',
    navigationBarTextStyle: 'white',
    backgroundColor: '#F7F3EC'
  },
  tabBar: {
    color: '#8C8C8C',
    selectedColor: '#8B4513',
    backgroundColor: '#FFFFFF',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页'
      },
      {
        pagePath: 'pages/guide/index',
        text: '导览'
      },
      {
        pagePath: 'pages/interact/index',
        text: '互动'
      },
      {
        pagePath: 'pages/activity/index',
        text: '活动'
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的'
      }
    ]
  }
})
