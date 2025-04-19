/**
 * 节流函数：在 delay 时间内最多只执行一次
 * @param {Function} fn 要执行的函数
 * @param {Number} delay 节流时间
 * @returns {Function}
 */
export function throttle(fn, delay = 300) {
	let lastTime = 0
	return function (...args) {
		const now = Date.now()
		if (now - lastTime > delay) {
			console.log('节流函数触发', lastTime, now, now - lastTime)
			lastTime = now
			fn(...args)
		}
	}
}
/**
 * 防抖函数：延迟 delay 时间执行，如果期间再次触发，则重新计时
 * @param {Function} fn 要执行的函数
 * @param {Number} delay 防抖时间
 * @returns {Function}
 */
export function debounce(fn, delay = 300) {
	let timer = null
	return function (...args) {
		clearTimeout(timer)
		timer = setTimeout(() => {
			fn(...args)
		}, delay)
	}
}
