// pages/gifresult/gifresult.js
var downUrl;
var titlename;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModalStatus:true,
    gifurl:'../images/gif_def.gif'
  },

  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log("button share--->")
    }
    return {
      title: '快来在线制作你的' + titlename+'gif表情包吧！',
      path: '/pages/gifresult/gifresult?gifpath=' + downUrl + "&name=" + titlename,
      imageUrl: downUrl,
      success: function (res) {
        // 转发成功
        console.log('转发成功')
      },
      fail: function (res) {
        // 转发失败
        console.log('转发失败')
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    downUrl = options.gifpath;
    titlename = options.name;

    if (downUrl.indexOf('https') == -1) {
      downUrl = downUrl.replace('http', 'https');
    }

    wx.setNavigationBarTitle({
      title: titlename,
    })

    var Page$this = this;

    // this.setData({
    //   gifurl: downUrl
    // })

    wx.getImageInfo({
      src: downUrl,
      success:function(res){
        Page$this.setData({
          gifurl: res.path
        })
      }
    })
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

  showImg:function(){
    if (downUrl) {
      wx.previewImage({
        current: downUrl, // 当前显示图片的http链接
        urls: [downUrl] // 需要预览的图片http链接列表
      })
    }
  },
  
  downimage: function (e) {

    console.log("down img https--->" + downUrl);

    var show_tip;
    wx.getStorage({
      key: 'show_tip',
      success: function (res) {
        show_tip = res.data;
        console.log(show_tip);
        //到提示用户保存页面
        if(show_tip){
          wx.navigateTo({
            url: '../gifshow/gifshow?gifpath=' + downUrl,
          })
        }else{
          wx.previewImage({
            urls: [downUrl],
            current: downUrl
          })
        }
      },
      fail:function(){
        wx.navigateTo({
          url: '../gifshow/gifshow?gifpath=' + downUrl,
        })
      }
    })

    // var Page$this = this;

    // //获取相册授权
    // wx.getSetting({
    //   success(res) {
    //     if (!res.authSetting['scope.writePhotosAlbum']) {
    //       wx.authorize({
    //         scope:
    //         'scope.writePhotosAlbum',
    //         success() {
    //           console.log('授权成功')
    //           Page$this.downFile();
    //         }
    //       })
    //     }else{
    //       console.log("已经有授权，直接下载");
    //       Page$this.downFile();
    //     }
    //   }
    // })

  },

  downFile:function(){
    //文件下载
    wx.downloadFile({
      url: downUrl,
      success:
      function (res) {
        console.log(res);
        //图片保存到本地
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success:
          function (data) {
            console.log("save success--->" + data);
            wx.showToast({
              title: '图片已保存',
            })
          },
          fail:
          function (err) {
            console.log(err);
            if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
              console.log("用户一开始拒绝了，我们想再次发起授权")
              console.log('打开设置窗口')
              wx.openSetting({
                success(settingdata) {
                  console.log(settingdata)
                  if (settingdata.authSetting['scope.writePhotosAlbum']) {
                    console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
                  }
                  else {
                    console.log('获取权限失败，给出不给权限就无法正常使用的提示')
                  }
                }
              })
            }
          }
        })
      }
    })
  },
  tohome:function(){
    wx.navigateTo({
      url: '/pages/home/home',
    })
  }
})