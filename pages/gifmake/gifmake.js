// pages/gifmake/gifmake.js
//获取应用实例
const app = getApp()
var gifinfo;
var talklist;
var oldList;
var ctitle
var tname
var tcontent
var maxinput
var base_url = "http://127.0.0.1:8888/"

Page({
  /**
   * 页面的初始数据
   */
  data: {
    showModal: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    ctitle = options.title;
    tname = options.tname;
    tcontent = options.tcontent;
    maxinput = options.maxinput;

    console.log('gifmake tcontent --->' + options.tcontent)

    wx.setNavigationBarTitle({
      title: ctitle,
    })

    talklist = tcontent.split("%#");
    console.log(talklist)

    oldList = [].concat(talklist);
    this.setData({
      gifImgUrl: base_url + tname + "/example.png",
      senslist: talklist,
      maxlength: maxinput
    })

  },

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
    this.create();
  },
  
  //制作
  create: function () {
    //var params = JSON.stringify(talklist);
    //console.log('cccc--->'+params)

    wx.showLoading({
      title: '生成中',
    })
    
    wx.request({
      url: base_url + 'creategif',
      method: 'POST',
      data: {
        'type': tname,
        'data': talklist
      },
      success: function (res) {
        wx.hideLoading()
        console.log(res)
        if (res.data.code == 0){
          var gifpath = res.data.data;
          console.log('生成的gif路径--->'+gifpath);
          wx.navigateTo({
            url: '/pages/gifresult/gifresult?gifpath=' + gifpath + "&name=" + ctitle
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
    return {
      title: 'gif在线制作',
      path: '/pages/home/home'
    }
  }

})