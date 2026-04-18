/** 格式化金额**/
export function parseMoney(e: any) {
  let flag = false
  if (e < 0) {
    flag = true
    e = -e
  }
  e = (e < 10 ? '0' + e : e) || 0
  const arr = String(e).split('').reverse()
  let tmp = [] as any
  arr.forEach((item, index, arr) => {
    tmp.push(item)
    if (index === 1) {
      tmp.push('.')
      if (index === arr.length - 1) {
        tmp.push('0')
      }
    } else if (
      (index - 1) % 3 === 0 &&
      index !== arr.length - 1 &&
      arr[index + 1] !== '-'
    ) {
      tmp.push(',')
    }
  })
  if (Number(tmp[0]) === 0 && Number(tmp[1]) === 0) {
    tmp = tmp.slice(3)
  } else if (Number(tmp[0]) === 0 && tmp[2] === '.') {
    tmp = tmp.slice(1)
  }
  let data = tmp.reverse().join('')
  if (flag) {
    data = '-' + data
  }
  return data
}

/** 格式化销量**/
export function formatVolume(num: number) {
  return num >= 1e4 ? (num / 1e4).toFixed(1) + '万' : num
}

/** 格式化订单状态**/
export function formatOrderStatus(status: number) {
  let statusName = ''
  switch (status) {
    case 10:
			statusName = '待付款'
			break
		case 11:
			statusName = '待接单'
			break
    case 13:
      statusName = '待结算'
      break
		case 20:
			statusName = '待发货'
			break
		case 21:
			statusName = '部分发货'
			break
		case 23:
			statusName = '已接单'
			break
		case 25:
			statusName = '待制作'
			break
		case 27:
			statusName = '可取餐'
			break
		case 30:
			statusName = '待收货'
			break
		case 40:
			statusName = '已签收'
			break
		case 50:
			statusName = '已评价'
			break
		case -10:
			statusName = '交易取消'
			break
		case -20:
			statusName = '支付超时关闭'
			break
		case -30:
			statusName = '系统强制取消'
			break
		case -50:
			statusName = '售后完成'
			break
		case -51:
			statusName = '完成退款'
			break
		case -52:
			statusName = '完成换货'
			break
		case -53:
			statusName = '完成退货'
			break
		default:
			statusName = '未知'
	}
  return statusName
}


/** 格式化提现状态订**/
export function formatWithdrawStatus(status: number) {
  let statusName = ''
  switch (status) {
    case 0:
      statusName = '申请中'
      break
    case 1:
      statusName = '已同意'
      break
    case 2:
      statusName = '已转帐'
      break
    case 3:
      statusName = '审核不通过'
      break
    case -1:
      statusName = '拒绝'
      break
    default:
      statusName = '未知'
  }
  return statusName
}

/** 格式化售后订单状态**/
export function formatAfterSalesStatus(status: number) {
  let statusName = ''
  switch (status) {
    case 0:
      statusName = '暂无'
      break
    case 10:
      statusName = '申请中'
      break
    case 20:
      statusName = '等待回寄'
      break
    case 30:
      statusName = '待退款'
      break
    case 40:
      statusName = '等待系统退款'
      break
    case 50:
      statusName = '已退款'
      break
    case -10:
      statusName = '已取消'
      break
    case -20:
      statusName = '已拒绝申请'
      break
    case -30:
      statusName = '已拒绝退款'
      break
    case -51:
      statusName = '完成退款'
      break
    case -11:
      statusName = '超时退货取消'
      break
    default:
      statusName = '未知'
  }
  return statusName
}
