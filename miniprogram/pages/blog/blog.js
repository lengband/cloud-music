let keyword = '' // 搜索关键字

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 控制底部弹窗
    modalShow: false,
    blogList: []
  },

  // 发布
  onPublish () {
    // 判断用户是否授权
    wx.getSetting({
      success: (res) => { // 返回授权信息
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: r => {
              this.onLoginsuccess({
                detail: r.userInfo
              })
            }
          })
        } else {
          this.setData({
            modalShow: true
          })
        }
      }
    })
  },

  onLoginsuccess (userInfo) {
    const { detail } = userInfo
    wx.navigateTo({
      url: `../blog-edit/blog-edit?nickName=${detail.nickName}&avatarUrl=${detail.avatarUrl}`,
    })
  },

  onLoginfail () {
    wx.showModal({
      title: '授权用户才能发布',
      content: ''
    })
  },

  _loadBlogList (start = 0) {
    wx.showLoading({
      title: '拼命加载中',
    })
    wx.cloud.callFunction({
      name: 'blog',
      data: {
        start,
        keyword,
        $url: 'list',
        count: 10,
      }
    }).then(({ result }) => {
      this.setData({
        blogList: this.data.blogList.concat(result)
      })
      wx.hideLoading()
      wx.stopPullDownRefresh()
    }).catch(() => {
      wx.hideLoading()
    })
  },

  goComment (e) {
    const { blogid } = e.target.dataset
    wx.navigateTo({
      url: `../blog-comment/blog-comment?blogId=${blogid}`,
    })
  },

  onSearch (e) {
    this.setData({
      blogList: []
    })
    keyword = e.detail.keyword
    this._loadBlogList(0)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._loadBlogList(0)
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
    this.setData({
      blogList: []
    })
    this._loadBlogList(0)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this._loadBlogList(this.data.blogList.length)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})