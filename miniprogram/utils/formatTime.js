const formatTime = (date) => {
  let fmt = 'yyyy-MM-dd hh:mm:ss'
  const o = {
    'y+': date.getFullYear(),
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
  }
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      fmt = fmt.replace(RegExp.$1, o[k].toString().length === 1 ? `0${o[k]}` : o[k])
    }
  }
  return fmt
}

export default formatTime
