import Cookies from 'js-cookie'

/**
 * @description: 数值单位
 * @param {number} num 数据
 * @param {*} decimal 小数位，默认 2
 * @param {*} separation 单位是否分开，默认 false
 * @return {*}
 */
export const convertNum = (num: number, decimal = 2, separation = false) => {
  // 小数点位数
  const ws = Math.pow(10, decimal)
  // 基础单位值
  const base = 1e4
  // 最终输出值
  let value = 0
  // 单位
  const unitList = ['', '万', '亿', '万亿']
  // 单位下标
  let unitIndex = 0
  // 小于最低值
  if (num < base) {
    value = num
  } else {
    unitIndex = Math.floor(Math.log(num) / Math.log(base)) || 0
    if (unitIndex > 3) {
      unitIndex = 3
    }
    value = Math.floor((num / Math.pow(base, unitIndex)) * ws) / ws || 0
  }

  return separation
    ? { value, unit: unitList[unitIndex] }
    : value + unitList[unitIndex]
}

export function slideToogle(dom: any, duration = 1000) {
  if (dom && !dom.tagTimer) {
    dom.status = dom.status || dom.style.display
    const flag = dom.status !== 'none' // 保存当前的显示状态，方便进行判断
    dom.status = flag ? 'none' : 'block' // 更改dom上的显示属性
    dom.style.transition = 'height ' + duration / 1000 + 's' // 设置动画时间
    dom.style.overflow = 'hidden' // 保证子元素不外溢
    animateDom(flag, dom, duration) // 操作dom的height属性
  }
}

function animateDom(flag: any, dom: any, duration: any) {
  setData(dom)
  dom.style.height = flag ? dom.tagHeight : '0px'
  setTimeout(() => {
    dom.style.height = flag ? '0px' : dom.tagHeight
  }, 0)
  dom.tagTimer = setTimeout(() => {
    dom.style.display = flag ? 'none' : 'block'
    dom.style.transition = ''
    dom.style.overflow = ''
    dom.style.height = ''
    dom.tagTimer = null
  }, duration)
}

function setData(dom: any) {
  dom.tagTimer = dom.tagTimer || null
  dom.style.display = 'block'
  dom.tagHeight = dom.clientHeight + 'px'
  dom.style.display = ''
}

export const getRequiredCookies = () => ({
  Authorization: 'Bearer ' + Cookies.get('token'),
  'x-csrf-token': Cookies.get('csrfToken')
})

export const baseURL = import.meta.env.PROD ? '' : '/krryblog'
