import './statics/styles/style.css'
import '@we-mobius/mobius-ui/src/static.js'

import { initMobiusCSS, run, inDOM } from 'MobiusUI'
import {
  whenContentLoaded,
  initMobiusJS, wxweb, initMpAPI,
  initRouter, initLoaderService
} from 'MobiusJS'
import { app } from './app.js'

whenContentLoaded(async () => {
  window.onerror = (e) => {
    console.warn(e)
    return true
  }
  // turn CSS Houdini enhancements on
  initMobiusCSS()
  // init Mobius JS one-click start preset business
  initLoaderService()
  await initMobiusJS({
    getAPITicketUrl: 'https://api.thoughtsdaily.cn/mp_api/',
    mpLoginUrl: 'https://api.thoughtsdaily.cn/mp_auth/',
    mpGetUserInfoUrl: 'https://api.thoughtsdaily.cn/mp_auth/'
  })
  // init WeChat Media Platform API Ticket
  initMpAPI({ appId: 'wx407c0931f62387fd' }).then(() => {
    wxweb.updateAppMessageShareData({
      title: '🔮 Thoughts Bookmarklet', // 分享标题
      desc: '', // 分享描述
      link: 'http://app.thoughtsdaily.cn/bookmarklet', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: 'http://app.thoughtsdaily.cn/bookmarklet/statics/favicons/thoughts-daily.icon.png', // 分享图标
      success: function () {
        // 设置成功
      }
    })
    wxweb.updateTimelineShareData({
      title: '🔮 Thoughts Bookmarklet', // 分享标题
      link: 'http://app.thoughtsdaily.cn/bookmarklet', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: 'http://app.thoughtsdaily.cn/bookmarklet/statics/favicons/thoughts-daily.icon.png', // 分享图标
      success: function () {
        // 设置成功
      }
    })
  })

  initRouter()

  // initMpAuth({
  //   appId: 'wx407c0931f62387fd',
  //   preLogin: false,
  //   preGetUserInfo: false,
  //   scope: 'snsapi_userinfo'
  // })

  run(app, inDOM('#mobius-app'))
})
