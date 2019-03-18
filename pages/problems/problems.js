var postData = require("../../data/post-data.js");
//获取应用实例
const app = getApp()
Page({
  data: {
    timer: '',//定时器名字
    countDownNum: '240',//倒计时初始值
    // postList: '',
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

    postList: postData.postList,
    index: 0,
    current: 1,
    bcA: '',
    bcB: '',
    bcC: '',
    defen:0,
    bc_default: '#FBFBFB',
    bc_right: '#98FB98',
    bc_wrong: '#FF99B4',
    ny: 'true',
    fruit: [{
      id: 1,
      name: '周杰伦',
    }, {
      id: 2,
      name: '蔡依林'
    }, {
      id: 3,
      name: '罗志祥'
    }],
  },

    onShow:function(){
      // 什么时候触发倒计时，就在什么地方调用这个函数
      this.countDown();
    },

  countDown:function(){
    let that = this;
    let countDownNum = that.data.countDownNum;//获取倒计时初始值
    //如果将定时器设置在外面，那么用户就看不到countDownNum的数值动态变化，所以要把定时器存进data里面
    that.setData({
      timer: setInterval(function () {//这里把setInterval赋值给变量名为timer的变量
        //每隔一秒countDownNum就减一，实现同步
        countDownNum--;
        //然后把countDownNum存进data，好让用户知道时间在倒计着
        that.setData({
          countDownNum: countDownNum
        })
        //在倒计时还未到0时，这中间可以做其他的事情，按项目需求来
        if (countDownNum == 0) {
          //这里特别要注意，计时器是始终一直在走的，如果你的时间为0，那么就要关掉定时器！不然相当耗性能
          //因为timer是存在data里面的，所以在关掉时，也要在data里取出后再关闭
          clearInterval(that.data.timer);
          //关闭定时器之后，可作其他处理codes go here
        }
      }, 1000)
    })
  },

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

  getUserInfo: function (e) { // 获取用户头像等
    // console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  // getPhoneNumber: function (e) {
  //   var that = this;
  //   console.log(e.detail.errMsg == "getPhoneNumber:ok");
  //   if (e.detail.errMsg == "getPhoneNumber:ok") {
  //     wx.request({
  //       url: 'http://localhost/index/users/decodePhone',
  //       data: {
  //         encryptedData: e.detail.encryptedData,
  //         iv: e.detail.iv,
  //         sessionKey: that.data.session_key,
  //         uid: "",
  //       },
  //       method: "post",
  //       success: function (res) {
  //         console.log(res);
          
  //         that.setData({
  //           phone: res.data.phoneNumber
  //         })
  //         wx.getUserInfo({
  //           success(userInfo){
  //             app.globalData.userInfo = JSON.parse(userInfo.rawData);
  //             wx.request({
  //               url: 'http://localhost/index/users/add',
  //               method:"post",
  //               data:{
  //                 openid: app.globalData.openid,
  //                 phone: that.data.phone,
  //                 name: app.globalData.userInfo.nickName,
  //               },
  //               success:function(data){
  //                 app.globalData.userLocalInfo = data.data;
  //                 console.log(data)
  //                 if (data.code===0){  // 如果用户数据提交成功，就可以开始倒计时答题
  //                   that.countDown();
  //                 }
  //               }
  //             })
  //           }
  //         })
  //       }
  //     })
  //   }
  // },


  // 下一题
  nextQuestion: function () {
    var that = this;
    // var postList = that.data.postList;
    if (that.data.index < postData.postList.length - 1) {
      this.setData({
        index: that.data.index + 1,
        bcA: that.data.bc_default,
        bcB: that.data.bc_default,
        bcC: that.data.bc_default,
        ny: 'true'
      });
    }
  },

  lastQuestion: function () {
    var that = this;
    if (that.data.index > 0) {
      this.setData({
        index: that.data.index - 1
      });
    }
  },
  btnOpClick: function (e) {
    var that = this;
    var select = e.currentTarget.id;
    var jieg = postData.postList[that.data.index].daan;
    if (select == jieg) {
      if (that.data.index < postData.postList.length - 1) {
        if (select == 'A') {
          this.setData({ bcA: that.data.bc_right });
        }
        else if (select == 'B') {
          this.setData({ bcB: that.data.bc_right });
        }
        else if (select == 'C') {
          this.setData({ bcC: that.data.bc_right });
        }
        setTimeout(function(){
          that.nextQuestion();
        },1500)
        
        this.setData({
          defen: that.data.index+1
        })
      }   
      else {
        if (select == 'A') {
          this.setData({ bcA: that.data.bc_right });
        }
        else if (select == 'B') {
          this.setData({ bcB: that.data.bc_right });
        }
        else if (select == 'C') {
          this.setData({ bcC: that.data.bc_right });
        }
        // 这里处理一个bug 由于点击最后一题正确但是直接到了查看结果页面，最后一题分数并未加上
        // 但是依然不好用 暂时关闭打完自动跳转到查看结果页面
        // this.setData({
        //   defen: that.data.index + 1
        // })
        // that.handleClick();
        
      }
    }
    else {
      if (select == 'A') {
        this.setData({ bcA: that.data.bc_wrong });
      }
      else if (select == 'B') {
        this.setData({ bcB: that.data.bc_wrong });
      }
      else if (select == 'C') {
        this.setData({ bcC: that.data.bc_wrong });
      }
      setTimeout(function () {
        that.nextQuestion();
      }, 1500)
    }
  },

  // 跳转并保存答题信息
  handleClick:function(){
    var Defen = this.data.defen;
    var that = this;
    wx.navigateTo({
      url: './../result/result?Defen=' + Defen
    })

     // 保存用户信息
    // wx.request({
    //   url: '',
    //   method:"post",
    //   data:{
    //     grade: that.Defen
    //   },
    //   success:function(e){
    //     console.log(e)
    //   }
    // })
  },
  xianshi: function () {
    this.setData({
      ny: ''
    })
  },

  handleChange({ detail }) {
    const type = detail.type;
    var that = this;
    if (type === 'next') {
      this.setData({
        current: this.data.current + 1,
      });
    } else if (type === 'prev') {
      this.setData({
        current: this.data.current - 1
      });
    }
  },
  handleFruitChange({ detail = {} }) {
    console.log("选择："+detail.value)
    this.setData({
      current: detail.value
    });
  },


  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

});
