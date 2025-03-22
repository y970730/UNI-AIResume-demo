import { defineStore } from 'pinia'
import { ref } from 'vue'
// 第一个参数必须全局唯一，是store的命名
export const useUserInformation = defineStore(
	'userInfo',
	() => {
		// 1. 状态数据（vuex State）
		const count = ref(1)
		// 2.  定义方法（vuex Function）
		function increment() {
			count.value++
		}
		function decrement() {
			count.value--
		}
		// 3. 定义异步方法（vuex action)
		const asyncIncrement = () => {
			setTimeout(() => {
				count.value = 0
			}, 200)
		}
		// 4. 一定要return
		return { count, increment, decrement, asyncIncrement }
	},
	// 第三个参数配置决定持久化
	// { unistorage: true }
	{
		unistorage: {
			// 自定义存储
			key: 'userTTT',
			paths: ['count']
		}
	}
)
