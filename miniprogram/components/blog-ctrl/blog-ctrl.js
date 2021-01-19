let userInfo = {}
const db = wx.cloud.database()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blogId: String,
    blog: Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    loginShow: false, // 认证信息弹出层
    modalShow: false, // 底部弹出层是否显示
    content: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onComment () {
      // 判断是否授权
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: (r) => {
                userInfo = r.userInfo
                // 显示评论的弹出层
                this.setData({
                  modalShow: true
                })
              }
            })
          } else {
            this.setData({
              loginShow: true
            })
          }
        }
      })
    },
    onLoginsuccess (e) {
      userInfo = e.detail
      this.setData({
        loginShow: false
      }, () => {
        this.setData({
          modalShow: true
        })
      })
    },
    onLoginFail () {
      wx.showModal({
        title: '授权用户才能进行评价',
        content: ''
      })
    },
    onInput (e) {
      this.setData({
        content: e.detail.value
      })
    },
    onSend () {
      // 插入数据库
      let content = this.data.content
      if (!content.trim()) {
        wx.showToast({
          title: '评论的内容不能为空',
        })
        return
      }
      wx.showLoading({
        title: '评论中',
        mask: true
      })
      wx.cloud.callFunction({
        name: 'blog',
        data: {
          $url: 'addBlogComment',
          content,
          blogId: this.properties.blogId,
          nickName: userInfo.nickName,
          avatarUrl: userInfo.avatarUrl
        }
      })
      .then((r) => {
        wx.hideLoading()
        this.setData({
          modalShow: false,
          content: ''
        })
        this.triggerEvent('refreshCommentList')
        // requestSubscribeMessage 需在bindtap里面执行，且不能再异步之后，所以需放在 showModal 里面
        wx.showModal({
          title: '评论成功! \n（如希望在微信服务通知里面显示评论结果，请点击确定）',
          success: result => {
            if (result.cancel) return
            // 推送模板消息，tmplIds 是由云函数返回的
            wx.requestSubscribeMessage({
              tmplIds: [r.result.templateId],
              success: res => {
                if (res[r.result.templateId] === 'reject') return
                wx.cloud.callFunction({
                  name: 'sendMessage',
                  data: {
                    content,
                    $url: 'subscribeMessage',
                    blogId: this.properties.blogId
                  }
                })
              },
              fail: err => {
                wx.showToast({
                  title: `订阅消息失败，${err}`,
                })
              }
            })
          }
        })
      }).catch(err => {
        wx.hideLoading()
        wx.showToast({
          title: '评论失败，请重试',
          content: err.toString()
        })
      })
    },
  }
})
