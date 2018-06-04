// pages/gifshow/gifshow.js
var spath
Page({

  /**
   * 页面的初始数据
   */

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: 'gif图制作完成页',
    })
    console.log('show path --->' + options.gifpath)
    spath = options.gifpath;
    this.setData({
      gifurl:spath
    })
    // wx.getImageInfo({
    //   src: spath,
    //   success: function (res) {
    //     Page$this.setData({
    //       gifurl: res.path
    //     })
    //   }
    // })
  },
  showconfig: function (e) {
    var currentStatu = e.currentTarget.dataset.statu;

    //显示
    if (currentStatu == "close") {
      wx.setStorage({
        key: "show_tip",
        data: false
      })
    }

    wx.previewImage({
      urls: [spath],
      current: spath,
      success:function(e){
        console.log('show success')
        wx.navigateBack();
      },
      fail:function(e){
        wx.navigateBack();
        console.log('show err')
      }
    })
    
  }
})