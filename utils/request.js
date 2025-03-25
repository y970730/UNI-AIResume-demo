import ajax from '@/uni_modules/u-ajax/'
import { useUserInformation } from '../stores/user'
const instance = ajax.create({
	// 改成项目地址
	baseURL: 'https://slwl-api.itheima.net'
	// baseURL: 'http://192.168.28.49:8099/'
})

// 1. 请求拦截器
instance.interceptors.request.use(
	(config) => {
		// 1. 发送请求遮罩页面
		uni.showLoading({
			title: 'Loading...',
			mask: true // 请求遮罩
		})
		// 2. 统一添加token（登录功能实现后添加）
		const storeToken = useUserInformation().getToken()
		console.log(storeToken)
		if (storeToken) {
			config.header.Authorization = storeToken
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
		return response.data
	},
	(error) => {
		uni.hideLoading()
		// 1. 处理token失效401

		return Promise.reject(error)
	}
)
export default instance
