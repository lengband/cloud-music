// 云函数入口文件
const cloud = require('wx-server-sdk')
const rp = require('request-promise')

cloud.init({
  env: 'test-lkp8f',
  traceUser: true, // wp:访问过小程序的用户被云开发控制台记住
})

const URL = 'http://39.100.192.160:3000/personalized'
// const URL = 'http://music.lengband.wang/api/personalized'

const db = cloud.database()

const playlistCollection = db.collection('playlist')
// const MAX_LIMIT = 100

// 云函数入口函数
exports.main = async (event, context) => {
  const list = await playlistCollection.get()
  // const countResult = await playlistCollection.count()
  // const total = countResult.total
  // const batchTimes = Math.ceil(total / MAX_LIMIT)
  // const tasks = []
  // for (let i = 0; i < batchTimes.length; i++) {
  //   const promise = playlistCollection.skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
  //   tasks.push(promise)
  // }
  // let list = {
  //   data: []
  // }
  // if (tasks.length > 0) {
  //   await (await Promise.all(tasks)).reduce((acc, cur) => {
  //     return {
  //       data: acc.data.concat(cur.data)
  //     }
  //   })
  // }
  const playlist = await rp(URL).then(res => {
    return JSON.parse(res).result
  }).catch(err => {
    console.log(`拉取数据错误：${err}`);
  })
  // 数据去重
  const newData = []
  for (let i = 0; i < playlist.length; i++) {
    let flag = true
    for (let j = 0; j < list.length; j++) {
      if (playlist[i].id === list[j].id) {
        flag = false
        break
      }
    }
    if (flag) newData.push(playlist[i])
  }
  for (let i = 0; i < newData.length; i++) {
    await playlistCollection.add({
      data: {
        ...newData[i],
        createTime: db.serverDate(),
      }
    }).then(res => {
      console.log('插入成功');
    }).catch(err => {
      console.error('插入失败')
    })
  }
  return newData.length
}