// pages/home/home.js
//获取应用实例
const app = getApp()
var list = null
var page
var pSize = 50
var end = false
var nodata = false
var base_url = "https://www.antleague.com/"
Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentData: 0,
    indicatorDots: false,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    is_load_more: false,
    is_end: end,
    is_nodata: nodata,
    banner: [{ 'img_url': '../images/banner.png'}],
    types:[
      {'id':1, 'typename':'全部'},
      { 'id': 1, 'typename': '热门' },
      { 'id': 1, 'typename': '影视' },
      { 'id': 1, 'typename': '吐槽' },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: 'GIF制作大师',
    })
    wx.showLoading({
        title: '正在加载...',
        mask: true
    })
    this.onrefresh();
  },

  //点击切换，滑块index赋值
  checkCurrent: function (e) {
    const that = this;
    console.log(e.target.dataset.current)
    if (that.data.currentData === e.target.dataset.current) {
      return false;
    } else {

      that.setData({
        currentData: e.target.dataset.current
      })
    }
  },

  getData: function () {
    var that = this;
    wx.request({
      url: base_url + 'giflist',
      method: 'GET',
      data: {
        'page': page,
        'page_size': pSize
      },
      success: function (res) {
        
        wx.hideLoading();
        if(page == 1){
          list = res.data.data;
        }else{
          if(list != null){
            list = list.concat(res.data.data);
          }
        }

        if (res.data.data != null && res.data.data.length < pSize){
          end = true;
        }
        
        if(list == null || list.length == 0){
          nodata = true;
        }else{
          list = JSON.parse(list);

          list.forEach(obj => {
            obj['template_img_url'] = base_url + obj['template_name'] + "/example.png"
          })
        }

        that.setData({
          giflist: list,
          is_end : end,
          is_nodata : nodata,
          is_version_show:true
        });
        wx.stopPullDownRefresh();
      },
      fail: function (res) {
        wx.hideLoading();
        wx.stopPullDownRefresh()
      }
    })
  },
  banner:function(){
    let index = 1;
    if(list){
      let tname = list[index]["template_name"]
      let title = list[index]["template_title"]
      let tcontent = list[index]["template_content"]
      let maxinput = list[index]["maxlength"]
      wx.navigateTo({
        url: '/pages/gifmake/gifmake?tname=' + tname + "&title=" + title + "&tcontent=" + tcontent + "&maxinput=" + maxinput
      })
    }else{
      wx.showToast({
        title: '暂无数据',
      })
    }
  },
  onrefresh:function(){
    page = 1;
    list = null;
    this.getData();
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    page = 1;
    list = null;
    this.getData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // if (!end) {
    //   page++;
    //   var Page$this = this;
    //   this.getData();
    // }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: 'gif在线制作',
      path: '/pages/home/home',
      imageUrl: '',
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
  createDetail:function(e){
    let index = e.currentTarget.dataset.index;
    
    let tname = list[index]["template_name"]
    let title = list[index]["template_title"]
    let tcontent = list[index]["template_content"]
    let maxinput = list[index]["maxlength"]
    wx.navigateTo({
      url: '/pages/gifmake/gifmake?tname=' + tname + "&title=" + title + "&tcontent=" + tcontent + "&maxinput=" + maxinput
    })
  },
  
  version: function () {
    var text = 'GIF制作大师所有内容都由网友自行发布提供,GIF' +
      '制作大师仅为网友提供信息的交流平台。GIF制作大师自身不控' +
      '制、编辑或修改任何网页的信息。通过用户上传信息指令以非人工方式自动生成的GIF侵犯了上述' +
      '作品的著作权。请上述个人或单位务必以书面的通讯方式向作者' +
      '提交权利通知。'
    wx.showModal({
      title: '免责申明',
      content: text,
      showCancel: false,
      success: function (res) {
        if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})