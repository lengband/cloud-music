const MAX_WORDS_NUM = 140 // 输入文字最大的个数
const MAX_IMG_NUM = 9 // 最大上传图片数量

const db = wx.cloud.database()
let content = '' // 当前发布的文字内容
let userInfo = {}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    wordsNum: 0,
    footerBottom: 0,
    images: [], // 已选择图片
    selectPhoto: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options, 'options');
    userInfo = options
  },

  onInput (e) {
    console.log(e, 'ee·');
    let wordsNum = e.detail.value.length
    if (wordsNum >= MAX_WORDS_NUM) {
      wordsNum = `最大字数为${MAX_WORDS_NUM}`
    }
    this.setData({
      wordsNum
    })
    content = e.detail.value
  },

  onFocus (e) {
    this.setData({
      footerBottom: e.detail.height
    })
  },
  onBlur () {
    this.setData({
      footerBottom: 0
    })
  },

  onChooseImage () {
    // 还能再选择几张
    let max = MAX_IMG_NUM - this.data.images.length
    wx.chooseImage({
      count: max,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        this.setData({
          images: this.data.images.concat(res.tempFilePaths),
        })
        max = MAX_IMG_NUM - this.data.images.length
        this.setData({
          selectPhoto: max <= 0 ? false : true
        })
      }
    })
  },
  
  onDelImage (e) {
    const { index } = e.target.dataset
    this.data.images.splice(index, 1)
    this.setData({
      images: this.data.images
    })
    if (this.data.images.length < MAX_IMG_NUM) {
      this.setData({
        selectPhoto: true
      })
    }
  },

  onPreviewImage (e) {
    wx.previewImage({
      urls: this.data.images,
      current: e.target.dataset.imgsrc
    })
  },

  send () {
    // 数据库：内容、图片、fileID、openid(用户的唯一标识)、昵称、头像、时间
    // 1、图片：云存储（会返回 fileID）
    if (content.trim() === '') {
      wx.showModal({
        title: '请输入内容',
        content: ''
      })
      return
    }
    wx.showLoading({
      title: '发布中',
      mask: true
    })
    const promiseArr = []
    let fileIds = []
    for (let i = 0; i < this.data.images.length; i++) {
      let p = new Promise((resolve, reject) => {
        const item = this.data.images[i];
        let suffix = /\.\w+$/.exec(item)[0] // 文件扩展名
        wx.cloud.uploadFile({
          cloudPath: 'blog/' + Date.now() + '-' + Math.random() * 10000000 + suffix,
          filePath: item,
          success: res  => {
            fileIds = fileIds.concat(res.fileID)
            resolve()
          },
          fail: err => {
            reject(err)
          },
        })
      })
      promiseArr.push(p)
    }
    // 2、数据 -> 云数据库
    Promise.all(promiseArr).then(res => {
      db.collection('blog').add({
        data: {
          ...userInfo,
          content,
          img: fileIds,
          createTime: db.serverDate(),
          // openid // 会默认上传字段
        }
      }).then(() => {
        this._sendCallback()
        // 返回blog页面，并刷新
        wx.navigateBack()
        const pages = getCurrentPages()
        // 取到上一个页面
        const prevPage = pages[pages.length - 2]
        prevPage.onPullDownRefresh()
      }).catch((err) => {
        this._sendCallback('发布失败')
      })
    }).catch(err => {
      this._sendCallback('发布失败')
    })
  },

  _sendCallback (title = '发布成功') {
    wx.hideLoading()
    setTimeout(() => {
      wx.showToast({
        title,
      })
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

  }
})