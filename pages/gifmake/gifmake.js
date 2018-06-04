// pages/gifmake/gifmake.js
//获取应用实例
const app = getApp()
var gifinfo;
var talklist;
var oldList;
var id;
var code;
var encryptedData;
var iv;
var ids;
var is_share = false;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal: false,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    is_share = false;
    id = options.id;
    console.log('gifmake id --->' + options.id)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        code = res.code
      }
    })

    wx.showLoading({
      title: '加载中',
    })

    var Page$this = this;
    wx.request({
      url: 'https://nz.qqtn.com/zbsq/index.php?m=api&c=make_gif&a=zimu',
      method: 'GET',
      data: {
        'id': id
      },
      success: function (res) {
        wx.hideLoading()
        gifinfo = res.data.data;
        console.log(gifinfo)
        wx.setNavigationBarTitle({
          title: gifinfo.name,
        })
        talklist = gifinfo.input_placeholder;
        
        oldList = [].concat(talklist);
        Page$this.setData({
          gifImgUrl: gifinfo.preview_image,
          senslist: talklist,
          maxlength: gifinfo.zimu_num,
          nickname:decodeURI(gifinfo.nickname)
        })
      },
      fail: function (res) {
        wx.hideLoading()
        console.log('fail--->')
      }
    })
  },

  onShow: function () {
    wx.getStorage({
      key: 'gif_ids',
      success: function (res) {

        ids = res.data;
        var idsArray = ids.split(',');
        console.log(idsArray);
        for (let i = 0; i < idsArray.length; i++) {
          if (id && id == parseInt(idsArray[i])) {
            is_share = true;
          }
        }
      }
    })
  },

  // loadUserInfo: function (e) {
  //   var Page$this = this;

  //   if (isShare) {
  //     this.create(false);
  //   }else{
  //     wx.getUserInfo({
  //       success: function (res) {
  //         Page$this.data.userinfo = res.userInfo
  //         console.log(res.userInfo)
  //         encryptedData = res.encryptedData;
  //         iv = res.iv;

  //         Page$this.setData({
  //           showModal: true
  //         });

  //       }
  //     })
  //   }
  // },

  inputChange:function(e){
    let i = e.currentTarget.dataset.i
    let oldinput = oldList[i];
    //console.log(oldinput)
    if(e.detail.value){
      talklist[i] = e.detail.value;
    }else{
      talklist[i] = oldinput;
    }
  },
  //一键生成(默认带水印)
  watermark:function(){
    this.create(true);
  },
  
   //去水印生成
  nowater:function(){
    if (is_share){
      wx.showLoading({
        title: '生成中',
      })
      this.create(false);
    }else{
      this.setData({
        showModal: true
      });
    }
  },
  //制作
  create:function(iswater){
    var params = talklist.toString();
    params = params.replace(/,/g,'%#');

    console.log(params)
    if(iswater){
      wx.showLoading({
        title: '生成中',
      })
    }
    
    wx.request({
      url: 'https://nz.qqtn.com/zbsq/index.php?m=api&c=make_gif&a=create',
      method: 'GET',
      data: {
        'id': id,
        'inputs': params,
        'is_water': iswater ? 1 : 0
      },
      success: function (res) {
        wx.hideLoading()
        if (res.data.code == 1){
          var gifpath = res.data.data.path;
          console.log('生成的gif路径--->'+gifpath);
          wx.navigateTo({
            url: '/pages/gifresult/gifresult?gifpath=' + gifpath + "&name=" + gifinfo.name
          })
        }else{
          wx.showToast({
            icon:'none',
            title: res.data.msg,
          })
          return;
        }
      },
      fail: function (res) {
        wx.hideLoading()
        console.log("fail--->" + JSON.stringify(res));
      }
    })
  },

  /**
     * 弹出框蒙层截断touchmove事件
     */
  preventTouchMove: function () {
  },
  /**
   * 隐藏模态对话框
   */
  hideModal: function () {
    this.setData({
      showModal: false
    });

    wx.setStorage({
      key: "is_share",
      data: false
    })
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function () {
    this.hideModal();
  },

 /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var Page$this = this;

    if(ids){
      wx.setStorage({
        key: 'gif_ids',
        data: ids + "," + id
      })
    }else{
      wx.setStorage({
        key: 'gif_ids',
        data: id,
      })
    }

    wx.getStorage({
      key: 'gif_ids',
      success: function(res) {
        console.log('share ids --->' + res.data)
      },
    })

    setTimeout(function () {
        Page$this.create(false)
    }, 2000);
    
    wx.showLoading({
      title: '生成中',
    })

    this.setData({
      showModal: false
    });
    return {
      title: 'gif在线制作',
      path: '/pages/home/home',
      imageUrl: gifinfo.preview_image
    }

  },

  // userLogin:function(that){
  //   console.log(code + '---' + encryptedData + '---' + iv)
  //   wx.request({
  //     url: 'https://nz.qqtn.com/zbsq/index.php?m=api&c=make_gif&a=init',
  //     //注册
  //     data: {
  //       'code': code,
  //       'encryptedData': encryptedData,
  //       'iv': iv,
  //     },
  //     method: 'GET',
  //     success: function (result) {
  //       console.log(result.data)
  //       that.setData({
  //         showModal: false
  //       });
  //       if(result && result.data){
  //         if(result.data.code == 1){
  //           console.log("登录成功")

  //           wx.setStorage({
  //             key: "is_share",
  //             data: true
  //           })
  //           that.create(false);

  //         }else{
  //           console.log("登录失败")
  //         }
  //       }else{
  //         console.log("登录失败")
  //       }
  //     },
  //     fail: function (res) {
  //       that.setData({
  //         showModal: false
  //       });
  //       console.log("登录失败")
  //     },
  //   })
  // }

})