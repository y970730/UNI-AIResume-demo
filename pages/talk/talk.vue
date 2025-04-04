<!-- <template>
	<view class="content">
		<image
			class="logo"
			src="/static/logo.png"
		></image>
		<view class="text-area">
			<text class="title">{{ test }}</text>
		</view>
		<button
			type="default"
			@click="goLogin"
		>
			去登录
		</button>
		<button
			type="default"
			@click="tryApiFun"
		>
			try api
		</button>
	</view>
</template> -->
<script setup>
	import { ref, nextTick } from 'vue'

	const input = ref(
		'啊违法而无法无法威风啊万丰奥威发我发我发我发我啊违法而无法无法maxlength威风啊万丰奥威发我发我发我发我啊违法而无法无法威风啊万丰奥威发我发我发我发我啊违法而无法无法maxlength威风啊万丰奥威发我发我发我发我'
	)
	const messages = ref([
		{ role: 'user', content: '你好AI' },
		{ role: 'assistant', content: '你好愚蠢的人类' },
		{
			role: 'user',
			content: '你好AI你好AI你好AI你好AI你好AI你好AI你好AI你好AI你好AI'
		},
		{ role: 'assistant', content: '你好愚蠢的人类' }
	])
	// const messages = ref([])
	const scrollIntoView = ref('')

	const handleSend = async () => {
		const trimmed = input.value.trim()
		if (!trimmed) return

		// 添加用户消息
		messages.value.push({ role: 'user', content: trimmed })
		// input.value = ''
		await nextTick()
		scrollIntoView.value = `msg-${messages.value.length - 1}`
		// 添加AI消息占位符
		const aiMsg = {
			role: 'assistant',
			content: '这是服务器返回的完整消息内容。'
		}
		messages.value.push(aiMsg)
		await nextTick()
		scrollIntoView.value = `msg-${messages.value.length - 1}`

		// 模拟流式响应，替换为你实际的流式请求逻辑
		// const fakeStreamText = '这是来自服务器的流式响应内容。'
		// for (const char of fakeStreamText) {
		// 	await new Promise((resolve) => setTimeout(resolve, 80))
		// 	aiMsg.content += char
		// 	await nextTick()
		// 	scrollIntoView.value = `msg-${messages.value.length - 1}`
		// }
	}
</script>
<template>
	<view class="chat-container">
		<scroll-view
			class="chat-messages"
			scroll-y
			:scroll-into-view="scrollIntoView"
			:scroll-with-animation="true"
		>
			<view
				v-for="(msg, index) in messages"
				:key="index"
				:id="'msg-' + index"
				class="message"
			>
				<view :class="['bubble', msg.role]">
					{{ msg.content }}
				</view>
			</view>
		</scroll-view>

		<view class="input-area">
			<textarea
				v-model="input"
				cursor-spacing="16px"
				auto-height
				confirm-type="send"
				maxlength="-1"
				class="chat-input"
				placeholder="输入你的问题..."
				@confirm="handleSend"
			/>
			<button
				class="send-button"
				@click="handleSend"
			>
				发送
			</button>
		</view>
		<view class="notice">
			<text>对话由AI提供，请理性使用</text>
		</view>
	</view>
</template>
<style lang="scss">
	.chat-container {
		display: flex;
		flex-direction: column;
		height: 100%;
		/* #ifdef MP-WEIXIN */
		height: 100vh;
		/* #endif */
		background-color: #d7d7d7;
		.chat-messages {
			flex: 1;
			overflow-y: auto;
			padding: 16rpx;
			box-sizing: border-box;
			.message {
				margin-top: 24rpx;
				display: flex;
				flex-direction: column;
				.bubble {
					padding: 16rpx;
					background-color: $uni-primary;
					border-radius: 16rpx;
					max-width: 80%;
					line-height: 1.75;
					word-break: break-word;
				}
				.user {
					align-self: flex-end;
					background-color: $uni-primary;
				}
				.assistant {
					align-self: flex-start;
					background-color: #f4a261;
				}
			}
		}

		.input-area {
			display: flex;
			background-color: $uni-primary;
			border: 2rpx solid #ccc;
			border-bottom: none;
			border-radius: 16rpx 16rpx 0 0;
			min-height: 80rpx;
			// padding: 0 24rpx;
			.chat-input {
				flex: 1;
				background-color: #f9f9f9;
				font-size: 28rpx;
				color: #333;
				border-radius: 16rpx;
				padding: 6rpx;
				margin: 16rpx;
				margin-bottom: 0rpx;
				border: 2rpx solid #ccc;
			}
			.send-button {
				align-self: center;
				background-color: $uni-primary;
				color: #fff;
				padding: 0 24rpx;
				border-radius: 8rpx;
			}
		}
		.notice {
			width: 100%;
			color: #736f5d;
			text-align: center;
			padding: 8rpx;
			font-size: 18rpx;
			background-color: $uni-primary;
			align-self: center;
		}
	}
</style>
