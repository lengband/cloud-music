// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')

cloud.init()

const db = cloud.database()
const blogCollection = db.collection('blog')


// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({
    event
  })

  app.router('list', async (ctx, next) => {
    const keyword = event.keyword.trim()
    let w = {}
    if (keyword !== '') {
      w = {
        content: db.RegExp({
          regexp: keyword,
          options: 'i'
        }),
      }
    }
    const blogList = await blogCollection
      .where(w)
      .skip(event.start)
      .limit(event.count)
      .orderBy('createTime', 'desc')
      .get()
      .then(res => res.data)
    ctx.body = blogList
  })
  
  return app.serve()
}