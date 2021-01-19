// 云函数入口文件
const cloud = require('wx-server-sdk')
const formatTime = require('./utils/formatTime')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
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
        templateId: 'NVPA42PC6d5SHGu55x3KqmZGmAa6tHlg9GyyfHIg9tU',
        miniprogramState: 'developer'
      })
    return result
  } catch (err) {
    return err
  }
}