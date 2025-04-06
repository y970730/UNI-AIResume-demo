<script setup>
	import { ref, nextTick, onMounted, onBeforeUnmount } from 'vue'
	import { sendMessageApi } from '@/apis/sendMessage.js'
	import { throttle } from '@/utils/throttleDebounce.js'
	const input = ref('')
	const messages = ref([])
	const scrollIntoView = ref('')
	// 输入框是否可用
	let isAvailable = ref(true)

	const handleSend = async () => {
		const trimmed = input.value.trim()
		if (!trimmed) {
			uni.utils.toast('不可以发送空值哦')
			return
		}
		// 处理用户信息发送
		// 添加用户消息
		messages.value.push({ role: 'user', content: trimmed })
		input.value = ''
		await nextTick()
		scrollIntoView.value = `msg-${messages.value.length - 1}`
		isAvailable.value = false

		// 添加AI消息占位符
		const aiMsg = {
			role: 'assistant',
			content: ''
		}

		// 发送请求
		messages.value.push(aiMsg)
		try {
			const res = await sendMessageApi(JSON.stringify({ content: trimmed }))
			isAvailable.value = true
			// 流式输出
			const fakeStreamText = res.data.completeContent
			for (const char of fakeStreamText) {
				await new Promise((resolve) => setTimeout(resolve, 30))
				aiMsg.content += char
				messages.value = [...messages.value]
			}
			await nextTick()
			scrollIntoView.value = `msg-${messages.value.length - 1}`
			// console.log('看看队列最后一个元素ID', scrollIntoView.value)
		} catch (err) {
			isAvailable.value = true
			// console.log('进入catch', err)
			aiMsg.content = '请求出错'
			await nextTick()
			scrollIntoView.value = `msg-${messages.value.length - 1}`
		}
	}
	onMounted(async () => {
		isAvailable.value = false
		try {
			const res = await sendMessageApi(
				JSON.stringify({
					content: 'awefhajfhakwjhfjkwahfjkaewjkfhjk'
				})
			)
			isAvailable.value = true
			await nextTick()
			scrollIntoView.value = `msg-${messages.value.length - 1}`
			const aiMsg = {
				role: 'assistant',
				content: ''
			}
			messages.value.push(aiMsg)

			const fakeStreamText = res.data.completeContent
			for (const char of fakeStreamText) {
				await new Promise((resolve) => setTimeout(resolve, 30))
				aiMsg.content += char
				messages.value = [...messages.value]
			}
			await nextTick()
			scrollIntoView.value = `msg-${messages.value.length - 1}`
		} catch (err) {
			isAvailable.value = true
			const aiMsg = {
				role: 'assistant',
				content: ''
			}
			messages.value.push(aiMsg)
			const fakeStreamText =
				'服务有点问题，建议压力后端。但你仍然可以尝试询问我哦'
			for (const char of fakeStreamText) {
				await new Promise((resolve) => setTimeout(resolve, 30))
				aiMsg.content += char
				messages.value = [...messages.value]
			}
			await nextTick()
			scrollIntoView.value = `msg-${messages.value.length - 1}`
		}
	})
	const handleSendWithThrottle = throttle(handleSend)

	// 向上滚动距离
	// let screenTopValue = ref(0)
	// 滚动控制
	let screenTopValue = ref(0)
	let old = ref({
		screenTopValue: 0
	})
	// 滚动函数，参数为滚动距离
	function scrollTest(e) {
		// 解决view层不同步的问题
		// console.log('入参', e)
		screenTopValue.value = old.value.screenTopValue
		nextTick(() => {
			screenTopValue.value = e
			console.log(
				'滚动函数',
				'老数据' + old.value.screenTopValue,
				'新数据' + screenTopValue.value
			)
			if (screenTopValue.value >= old.value.screenTopValue) {
				old.value.screenTopValue = screenTopValue.value
			}
		})
	}
	function hadScroll(e) {
		// 滚动事件，可以做点操作
		// console.log(e)
		old.value.screenTopValue = e.detail.scrollTop
		// 尝试计算应该卷上去的值
		const windowHeight = uni.getSystemInfoSync().windowHeight
		const shouldScroll = e.detail.scrollHeight - windowHeight
		console.log(shouldScroll)
		// console.log(
		// 	'滚动了',
		// 	'滚动高度' + e.detail.scrollTop,
		// 	'滚动掩盖区域' + e.detail.scrollHeight
		// )
	}
	const hadScrollWithThrottle = throttle(hadScroll, 1000)
</script>
<template>
	<view class="chat-container">
		<scroll-view
			class="chat-messages"
			scroll-y
			:scroll-into-view="scrollIntoView"
			:scroll-with-animation="true"
			@scroll="hadScrollWithThrottle"
		>
			<!-- :scroll-top="screenTopValue" -->
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
			<input
				v-model="input"
				cursor-spacing="28px"
				auto-height
				:disabled="!isAvailable"
				maxlength="-1"
				class="chat-input"
				:placeholder="isAvailable ? '输入你的问题...' : 'AI 正在思考..'"
				:style="
					isAvailable
						? 'background-color: #f9f9f9;'
						: 'background-color: #dcdcdc'
				"
				@confirm="handleSendWithThrottle"
				confirm-type="send"
			/>
			<!-- confirm-type="send"
			 -->
			<button
				class="send-button"
				@click="handleSendWithThrottle"
			>
				发送
			</button>
		</view>
		<view class="notice">
			<text>对话由AI提供，请理性使用嗷</text>
		</view>
	</view>
</template>
<style lang="scss">
	.chat-container {
		display: flex;
		flex-direction: column;
		// height: 100%;
		/* #ifdef MP-WEIXIN */
		height: 100vh;
		/* #endif */
		background-color: #f5f7f6;
		.chat-messages {
			// height: 100%;
			flex: 1;
			overflow-y: auto;
			box-sizing: border-box;
			.message {
				margin-top: 24rpx;
				display: flex;
				flex-direction: column;
				.bubble {
					margin: 16rpx;
					padding: 16rpx;
					// background-color: $uni-primary;
					border-radius: 16rpx;
					max-width: 80%;
					line-height: 1.75;
					word-break: break-word;
				}
				.user {
					margin-right: 24rpx;
					align-self: flex-end;
					color: #333333;
					background-color: $uni-primary;
				}
				.assistant {
					margin-left: 24rpx;
					align-self: flex-start;
					color: #555;
					background-color: #dcebe9;
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
				font-size: 30rpx;
				color: #333333;
				border-radius: 16rpx;
				padding: 6rpx;
				margin: 16rpx;
				margin-bottom: 0rpx;
				border: 2rpx solid #ccc;
			}
			.send-button {
				align-self: center;
				background-color: $uni-primary;
				color: #f9f9f9;
				text-shadow: 3rpx 3rpx 5rpx rgba(0, 0, 0, 0.3);
				padding: 0 24rpx;
				border-radius: 8rpx;
			}
		}
		.notice {
			width: 100%;
			color: #5f8f8c;
			text-align: center;
			box-sizing: border-box;
			padding: 8rpx;
			font-size: 18rpx;
			background-color: $uni-primary;
			align-self: center;
			text-shadow: 3rpx 3rpx 5rpx rgba(0, 0, 0, 0.1);
		}
	}
</style>
