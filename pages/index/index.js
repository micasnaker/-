//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  // 参与活动 
  handleClick:function(){
    wx.navigateTo({
      url: '../home/home',
    })
  },

  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    var that = this;
    wx.login({
      success(res){
        console.log(res);
        var code = res.code
        wx.request({
          url: app.globalData.requestUrl +'users/code2seesion',
          method:"post",
          data:{
            code
          },
          success:function(res){
            console.log(res.data.openid);
            that.setData(res.data);
          }
        })
      }
    })
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  getPhoneNumber:function(e){
    var that = this;
    console.log(e.detail.errMsg == "getPhoneNumber:ok" );
    if (e.detail.errMsg == "getPhoneNumber:ok"){
      wx.request({
        url: app.globalData.requestUrl +'users/decodePhone',
        data:{
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv,
          sessionKey: that.data.session_key,
          uid: "",
        },
        method:"post",
        success:function(res){
          console.log(res);
        }
      })
    }
  }
  
})
