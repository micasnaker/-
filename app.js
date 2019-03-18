//app.js
App({
  onLaunch: function () {
    let that = this;
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // console.log(res);
        var code = res.code
        wx.request({
          url: this.globalData.requestUrl+'users/code2seesion',
          method: "post",
          data: {
            code
          },
          success: function (res) {
            // console.log(res.data.openid+"app");
            that.globalData.sessionKey = res.data.session_key;
            that.globalData.openid = res.data.openid;
            // console.log(that.globalData.openid+"app")

          }
        })
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    }),
      wx.showShareMenu({
        withShareTicket: true,
        success:function(e){
          console.log(e)
        },fail:function(e){
          console.log(e)
        }
      })
  },
  globalData: {
    userInfo: null,
    defen:'5',
    phone:'',
    openid:'',
    sessionKey:'test',
    nickName:'',
    requestUrl:'http://localhost/index/'
  }
})