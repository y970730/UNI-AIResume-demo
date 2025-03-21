/**
 * utils Fun
 */
import dayjs from 'dayjs'
export const utils = {
	/**
	 * toast
	 * @param {string} title 提示文字内容
	 * @param {string} icon 提示图标类型
	 */
	toast(title = '数据加载失败', icon = 'none') {
		uni.showToast({
			title,
			icon,
			mask: true
		})
	},
	/**
	 * 封装dayJS格式化日期参数
	 * @param {string} 日期字符串
	 * @param {string} 日期格式，见dayjs文档
	 * 支持 YYYY年-MM月-DD日
	 * 支持 YYYY年-MM月
	 */
	formatTime(date, type = 'YYYY-MM-DD') {
		return dayjs(date).format(type)
	}
}
/**
 * 方便全局引用，挂载到 uni 全局
 * 只需要在main.js执行式全局导入后
 * 不用import utils.js 也uni.调用
 */
uni.utils = utils
