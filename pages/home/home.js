// pages/home/home.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  // 分享转发
  onShareAppMessage: function (ops){
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
  }
  return {
    title:'剪影竞猜小程序',
    path:'pages/home/home',
    success:function(res){
      // 转发成功
      console.log("转发成功:" + JSON.stringify(res));
    },
    fail:function(res){
      // 转发失败
      console.log("转发失败:" + JSON.stringify(res));
    }
  }
  },

// 进入游戏
  gameStart:function(){
    // wx.navigateTo({
    //   url: '../problems/problems'
    // })
    wx.showToast({
      title: '请选择开始游戏',
      icon: 'loading',
      duration: 2000,
      mask: true
    })
  },

// 进入抽奖
  handleClick:function(){
    wx.navigateTo({
      url: '../game/game',
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
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
      success(res) {
        // console.log(res);
        var code = res.code
        wx.request({
          url: app.globalData.requestUrl +'users/code2seesion',
          method: "post",
          data: {
            code
          },
          success: function (res) {
            // console.log(res.data.openid);
            that.setData(res.data);
          }
        })
      }
    })
  },

  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  getPhoneNumber: function (e) {
    var that = this;
    console.log(e.detail.errMsg == "getPhoneNumber:ok");
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      wx.request({
        url: app.globalData.requestUrl +'users/decodePhone',
        data: {
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv,
          sessionKey: that.data.session_key,
          uid: "",
        },
        method: "post",
        success: function (res) {
          console.log(res);
          wx.navigateTo({  // 如果成功就跳转到答题页面
            url: '../problems/problems',
          })
          that.setData({
            phone: res.data.phoneNumber
          })
          // wx.getUserInfo({
          //   success(userInfo) {
          //     app.globalData.userInfo = JSON.parse(userInfo.rawData);
          //     wx.request({
          //       url: 'http://localhost/index/users/add',
          //       method: "post",
          //       data: {
          //         openid: app.globalData.openid,
          //         phone: that.data.phone,
          //         name: app.globalData.userInfo.nickName,
          //       },
          //       success: function (data) {
          //         app.globalData.userLocalInfo = data.data;
          //         console.log(data)
          //         if (data.code === 0) {  // 如果用户数据提交成功，就可以开始倒计时答题
          //           that.countDown();
          //         }
          //       }
          //     })
          //   }
          // })
        }
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '请选择授权后开始答题',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else {
            console.log('用户点击取消')
          }
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})