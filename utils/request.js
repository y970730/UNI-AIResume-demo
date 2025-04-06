import ajax from '@/uni_modules/u-ajax/'
import { useUserInformation } from '../stores/user'
/**
 * 使用方法：
 * 1. 本文件为request基本封装，供再封装为 api.js 而非直接请求使用
 * 2. 使用时将本文件全量引入： import request from
 * 3. 使用方式为：request.post/get('基地址后面的部分',data),
 * 会返回服务端的数据，可以 const 一个变量接收 或 return。
 */
const instance = ajax.create({
	// 改成项目地址
	// baseURL: 'https://slwl-api.itheima.net'
	// baseURL: 'http://www.smart-ai.asia/'
	baseURL: 'http://123.57.62.72/'
})

// 1. 请求拦截器
instance.interceptors.request.use(
	(config) => {
		// 1. 发送请求遮罩页面(排除消息发送的请求)
		if (config.url !== '/internal/ai-chat/send/message') {
			uni.showLoading({
				title: 'Loading...',
				mask: true // 请求遮罩
			})
		}
		// 2. 统一添加token（登录功能实现后添加）
		const storeToken = useUserInformation().getToken()
		// console.log('request的config', config.url)
		// console.log(storeToken)
		if (storeToken) {
			config.header.token = storeToken
		}
		// 请求发出前处理些什么
		return config
	},
	(error) => {
		return Promise.reject(error)
	}
)
// 2. 响应拦截器
instance.interceptors.response.use(
	(response) => {
		uni.hideLoading()
		// 1. 处理返回数据剥离出data
		if (response.data.code !== 200) {
			// 请求成功但是服务端报错
			uni.utils.toast(response.data.msg)
		}
		return response.data
	},
	(error) => {
		uni.hideLoading()
		// 1. 处理token失效401
		uni.utils.toast('服务请求错误')
		console.log('响应拦截器发现出错啦！', error)
		return Promise.reject(error)
	}
)
export default instance
