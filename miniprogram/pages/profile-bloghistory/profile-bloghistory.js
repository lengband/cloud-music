const MAX_LIMIT = 10

Page({

  /**
   * 页面的初始数据
   */
  data: {
    blogList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getBlogList()
  },

  _getBlogList () {
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: 'blog',
      data: {
        $url: 'getListByOpenid',
        start: this.data.blogList.length,
        count: MAX_LIMIT
      }
    }).then(res => {
      wx.hideLoading()
      this.setData({
        blogList: this.data.blogList.concat(res.result)
      })
    })
  },

  goComment (e) {
    const { blogid } = e.target.dataset
    wx.navigateTo({
      url: `../blog-comment/blog-comment?blogId=${blogid}`,
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
    this._getBlogList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    let blogObj = e.target.dataset.blog
    return {
      title: blogObj.content,
      path: `/pages/blog-comment/blog-comment?blogId=${blogObj._id}`,
      // imageUrl: 'cloud://test-lkp8f.7465-test-lkp8f-1257920176/blog/1610956952879-8278339.201870963.jpg'
    }
  }
})