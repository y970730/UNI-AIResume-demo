<script setup>
	import {
		onLoad,
		onShow
	} from '@dcloudio/uni-app'
	import {
		ref
	} from 'vue'
	const test = ref('ref测试信息')
	onShow(() => {
		uni.showToast({
			title: 'Talk页面'
		})
	})
</script>
<template>
	<view class="content">
		<image class="logo" src="/static/logo.png"></image>
		<view class="text-area">
			<text class="title">{{test}}</text>
		</view>
	</view>
</template>

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