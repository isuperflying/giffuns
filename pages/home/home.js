// pages/home/home.js
//获取应用实例
const app = getApp()
var list = null
var page
var pSize = 50
var end = false
var nodata = false
var base_url = "http://192.168.80.97:8888/"
Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentData: 0,
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    is_load_more: false,
    is_end: end,
    is_nodata: nodata,
    banner: [{
      'img_url': 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1528112929640&di=2c51b59426deb97ef01cf01f25f8ba35&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F01b28659c4d630a801218e18fe43ae.jpg%402o.jpg'
    }, {
      'img_url': 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1528112929640&di=2c51b59426deb97ef01cf01f25f8ba35&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F01b28659c4d630a801218e18fe43ae.jpg%402o.jpg'
      }, {
        'img_url': 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1528112929640&di=2c51b59426deb97ef01cf01f25f8ba35&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F01b28659c4d630a801218e18fe43ae.jpg%402o.jpg'
      }],
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
      title: 'GIF在线制作',
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
      method: 'POST',
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
    if (!end) {
      page++;
      var Page$this = this;
      this.getData(Page$this);
    }
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
    var text = 'GIF在线制作提醒您：GIF在线制作所有内容都由网友自行发布提供,GIF' +
      '在线制作仅为网友提供信息的交流平台。根据用户的信息发布指令' +
      'F在线制作系统会以非人工方式自动生成GIF。GIF在线制作自身不控' +
      '制、编辑或修改任何网页的信息。GIF在线制作重视知识产权保护' +
      '并制定了旨在保护权利人的合法权益的措施和步骤, 当权利人发现' +
      '在GIF在线制作的内容侵犯其著作权时, 请权利人向GIF在线制作发出书' +
      '面“权利通知”,GIF在线制作将依法采取措施移除相关内容或断开相关' +
      '链接。GlF在线制作高度重视知识产权保护并遵守各项知识产权法律' +
      '法规和具有约束力的规范性文件。根据法律、法规和规范性文件要' +
      '求, GIF在线制作制定了旨在保护知识产权权利人合法权益的措施和' +
      '步骤, 当著作权人或依法可以行使著作权的权利人(以下简称“权利' +
      '人)发现在GIF在线制作网页的内容侵犯其著作权时, 权利人应事先' +
      '向GIF在线制作发出书面的“权利通知”, GIF在线制作将根据法律法规和' +
      '政府规范性文件采取措施移除相关内容或断开相关链接。具体措施' +
      '和步骤如下:权利通知任何个人或单位如果同时符合以下两个条' +
      '件:1、是某一作品的著作权人或依法可以行使著作权的权利人' +
      '2、通过用户上传信息指令以非人工方式自动生成的GIF侵犯了上述' +
      '作品的著作权。请上述个人或单位务必以书面的通讯方式向GIF字' +
      '幕菌提交权利通知。为有效处理上述个人或单位的权利通知, 通知' +
      '书应当包含下列内容:1、权利人的姓名(名称) 、联系方式和地址' +
      '2、要求删除或者断开链接的侵权作品、表演、录像制品的名称和网' +
      '络地址;3、构成侵权的初步证明材料(包括且不限于权利人对涉嫌' +
      '侵权内容拥有著作权或依法可以行使著作权的权属证明) 。4、权利' +
      '人对通知书的真实性声明。5、请您签署该文件, 如果您是依法成立' +
      '的机构或组织, 请您加盖公章。请您把以上资料和联络方式书面发' +
      '往以下地址: gifmake2018_online@163.com'
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