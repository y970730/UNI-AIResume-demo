<script setup>
	import { onLoad } from '@dcloudio/uni-app'
	import { ref, reactive, computed } from 'vue'

	const phoneNumber = ref('') // 存储解密后的手机号
	// 处理微信手机号授权
	async function handleGetPhoneNumber(e) {
		if (e.detail.errMsg === 'getPhoneNumber:ok') {
			console.log('用户同意授权')
			console.log('加密的手机号数据:', e.detail.encryptedData)
			console.log('iv:', e.detail.iv)

			// 发送到后端进行解密
			await sendPhoneDataToBackend(e.detail.encryptedData, e.detail.iv)
		} else {
			console.log('用户拒绝授权')
			uni.utils.toast('授权失败')
		}
	}
	// 发送加密数据到后端解密
	async function sendPhoneDataToBackend(encryptedData, iv) {
		try {
			const res = await uni.request({
				url: 'https://your-backend.com/api/wechat/decrypt-phone',
				method: 'POST',
				data: { encryptedData, iv, token: uni.getStorageSync('token') }
			})
			if (res.data.success) {
				phoneNumber.value = res.data.phoneNumber
				console.log('解密后的手机号:', phoneNumber.value)
				uni.showToast({ title: '登录成功', icon: 'success' })
			} else {
				uni.utils.toast('解密失败')
			}
		} catch (error) {
			console.error('网络错误:', error)
			uni.utils.toast('网络错误')
		}
	}
	// 以下废弃方案
	// import arAccount from './components/account.vue'
	// import arMobile from './components/mobile.vue'
	// 登录类型索引值
	// const tabIndex = ref(0)
	// 表单相关数据
	// const tabMetas = reactive([
	// 	{
	// 		title: '账号登录',
	// 		subTitle: '手机号登录'
	// 	},
	// 	{
	// 		title: '手机号登录',
	// 		subTitle: '账号登录'
	// 	}
	// ])

	// 当前登录信息
	// const tabMeta = computed(() => {
	// 	return tabMetas[tabIndex.value]
	// })
	// console.log(tabIndex.value, tabMeta)
	// 切换登录类型
	// function changeLoginType() {
	// 	tabIndex.value = Math.abs(tabIndex.value - 1)
	// }
</script>

<template>
	<view class="page-container">
		<!-- <view class="user-login">
			<view class="login-type">
				<view class="title">{{ tabMeta.title }}</view>
				<view
					class="type"
					@click="changeLoginType"
				>
					<text>{{ tabMeta.subTitle }}</text>
					<text class="iconfont icon-icon-line-right"></text>
				</view>
			</view>
			<arAccount v-if="tabIndex === 0"></arAccount>
			<arMobile v-else></arMobile>
		</view> -->
		<view class="wxlogin">
			<button
				open-type="getPhoneNumber"
				@getphonenumber="handleGetPhoneNumber"
			>
				一键获取手机号
			</button>
		</view>
	</view>
</template>

<style lang="scss" scoped>
	@import './login.scss';
</style>
