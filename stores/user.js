import { defineStore } from 'pinia'
import { ref } from 'vue'
// 第一个参数必须全局唯一，是store的命名
export const useUserInformation = defineStore(
	'userInfo',
	() => {
		// 1. 状态数据（vuex State）
		// 1.1 用户token
		const userLoginToken = ref('f6aeaec8-1383-4fca-98b8-d189a62bab4a')
		// 2.  定义方法（vuex Function）
		// function increment() {
		// 	count.value++
		// }
		function setToken(_token) {
			userLoginToken.value = _token
		}
		// 可能用到的getToken限制
		function getToken() {
			return userLoginToken.value
		}

		// 3. 定义异步方法（vuex action)
		// const asyncIncrement = () => {
		// 	setTimeout(() => {
		// 		count.value = 0
		// 	}, 200)
		// }
		// 4. 一定要return ？？别把token直接丢出去
		return { setToken, getToken }
	},
	// 第三个参数配置决定持久化
	// { unistorage: true }
	{
		// unistorage: {
		// 	// 自定义存储
		// 	key: 'userTTT',
		// 	paths: ['count']
		// }
		unistorage: true // 持久化
	}
)
