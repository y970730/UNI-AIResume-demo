<template>
	<view class="content">
		<image class="logo" src="/static/logo.png"></image>
		<view class="text-area">
			<text class="title">{{ test }}</text>
		</view>
	</view>
</template>

<script setup>
	import { onLoad, onShow } from '@dcloudio/uni-app'
	import { ref } from 'vue'
	// 导入 request 模块
	import request from '@/utils/request.js'
	const test = ref('ref测试信息')
	onLoad(() => {
		// then为utils.js封装测试，包含dayjs、toast封装
		console.log(uni.utils.formatTime(new Date()))
		request.get('/api/province').then((res) => {
			uni.utils.toast()
		})
	})
	onShow(() => {
		// 弹窗
		uni.showToast({
			title: 'Person页面'
		})
		// 存储
		uni.setStorageSync('storageTest', {
			a: 1
		})
	})
</script>

<style lang="scss">
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>
