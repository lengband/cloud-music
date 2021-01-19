// 云函数入口文件
const cloud = require('wx-server-sdk')
const formatTime = require('./utils/formatTime')
const TcbRouter = require('tcb-router')

// 消息订阅 - 评论模板ID，统一放在这里
const templateId = 'NVPA42PC6d5SHGu55x3KqmZGmAa6tHlg9GyyfHIg9tU'

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {

  const app = new TcbRouter({
    event
  })

  app.router('getBlogCommentTmpid', async (ctx, next) => {
    ctx.body = { templateId }
  })

  app.router('subscribeMessage', async (ctx, next) => {
    try {
      const { OPENID } = cloud.getWXContext()
      const result = await cloud.openapi.subscribeMessage.send({
          touser: OPENID,
          page: `/pages/blog-comment/blog-comment?blogId=${event.blogId}`,
          lang: 'zh_CN',
          data: {
            phrase1: {
              value: event.content
            },
            date3: {
              value: formatTime(),
            },
          },
          templateId,
          miniprogramState: 'developer'
        })
      return result
    } catch (err) {
      return err
    }
  })

  return app.serve()
}