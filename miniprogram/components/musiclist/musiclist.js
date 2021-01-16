const app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    musiclist: Array
  },

  /**
   * 组件的初始数据
   */
  data: {
    playingId: -1
  },

  pageLifetimes: {
    show () {
      this.setData({
        playingId: +app.getPlayMusicId()
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onSelect (e) {
      const { musicid, index } = e.currentTarget.dataset
      this.setData({
        playingId: musicid
      })
      wx.navigateTo({
        url: `../../pages/player/player?musicid=${musicid}&index=${index}`,
      })
    }
  }
})
