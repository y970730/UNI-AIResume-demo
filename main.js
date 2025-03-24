import App from './App'
// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
// 导入封装的utils
import '@/utils/utils.js'
// 引入 Pinia 工厂函数
import { createPinia } from 'pinia'
// 3.1 引入 Pinia Store 持久化第三方插件
import { createUnistorage } from '@/uni_modules/pinia-plugin-unistorage/index.js'
export function createApp() {
	const app = createSSRApp(App)
	// 实例化 pinia
	const pinia = createPinia()
	// 3.2 把持久化插件注册到 pinia 上
	pinia.use(createUnistorage())
	// 注册到 app
	app.use(pinia)
	return {
		app
	}
}
// #endif
