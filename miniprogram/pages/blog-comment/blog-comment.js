import formatTime from '../../utils/formatTime'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    blog: {},
    commentList: [],
    blogId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      blogId: options.blogId
    })
    this._getBlogDetail()
  },

  _getBlogDetail () {
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    wx.cloud.callFunction({
      name: 'blog',
      data: {
        blogId: this.data.blogId,
        $url: 'detail',
      }
    }).then(({ result }) => {
      this.setData({
        blog: result.detail[0],
        commentList: result.commentList.data.map(item => ({ ...item, createTime: formatTime(new Date(item.createTime)) }))
      })
      wx.hideLoading()
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    const blogObj = this.data.blog
    return {
      title: blogObj.content,
      path: `/pages/blog-comment/blog-comment?blogId=${blogObj._id}`,
      // imageUrl: 'cloud://test-lkp8f.7465-test-lkp8f-1257920176/blog/1610956952879-8278339.201870963.jpg'
    }
  }
})