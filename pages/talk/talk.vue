<script setup>
	import { ref, nextTick, onMounted, onBeforeUnmount } from 'vue'
	import { sendMessageApi } from '@/apis/sendMessage.js'
	import { throttle } from '@/utils/throttleDebounce.js'
	const input = ref('')
	const messages = ref([])
	// 输入框是否可用
	let isAvailable = ref(true)
	let conversationId = ref(0)
	const handleSend = async () => {
		const trimmed = input.value.trim()
		if (!trimmed) {
			uni.utils.toast('不可以发送空值哦')
			return
		}
		// 处理用户信息发送
		// 添加用户消息
		messages.value.push({
			role: 'user',
			content: trimmed,
			conversationId: 2597,
			agentId: 1
		})
		input.value = ''
		isAvailable.value = false
		// 添加AI消息占位符
		const aiMsg = {
			role: 'assistant',
			content: ''
		}
		// 发送请求
		messages.value.push(aiMsg)
		toTop()
		// try {
		const res = await sendMessageApi(
			JSON.stringify({
				content: trimmed,
				conversationId: conversationId.value
			})
		)
		isAvailable.value = true
		// 流式输出
		const fakeStreamText = res.data.completeContent
		let scrollFlag = ref(0)
		for (const char of fakeStreamText) {
			await new Promise((resolve) => setTimeout(resolve, 50))
			aiMsg.content += char
			scrollFlag.value++
			if (scrollFlag.value % 5 == 0 || scrollFlag.value == 1) {
				console.log('进入if', scrollFlag.value)
				toTop()
			}
			messages.value = [...messages.value]
		}
		// } catch (err) {
		// 	isAvailable.value = true
		// 	aiMsg.content = '请求出错'
		// 	toTop()
		// }
	}
	onMounted(async () => {
		isAvailable.value = false
		toTop()
		try {
			const res = await sendMessageApi(
				JSON.stringify({
					content: '这是前端初始请求，只需要当做看不见返回一个打招呼',
					conversationId: 2597,
					agentId: 1
				})
			)
			conversationId.value = res.data.conversationId
			isAvailable.value = true
			const aiMsg = {
				role: 'assistant',
				content: ''
			}
			messages.value.push(aiMsg)
			const fakeStreamText = res.data.completeContent
			let scrollFlag = ref(0)
			for (const char of fakeStreamText) {
				await new Promise((resolve) => setTimeout(resolve, 30))
				scrollFlag.value++
				aiMsg.content += char
				if (scrollFlag.value % 5 == 0) {
					await nextTick()
					toTop()
				}

				messages.value = [...messages.value]
			}
		} catch (err) {
			console.log('进入了mount的catch', err)
			isAvailable.value = true
			const aiMsg = {
				role: 'assistant',
				content: ''
			}
			messages.value.push(aiMsg)
			let scrollFlag = ref(0)
			const fakeStreamText =
				'服务有点问题，建议压力后端。但你仍然可以尝试询问我哦'
			for (const char of fakeStreamText) {
				await new Promise((resolve) => setTimeout(resolve, 30))
				aiMsg.content += char
				scrollFlag.value++
				if (scrollFlag.value % 5 == 0) {
					await nextTick()
					toTop()
				}

				messages.value = [...messages.value]
			}
		}
	})
	const handleSendWithThrottle = throttle(handleSend)
	let scrollTop = ref(0)
	let old = ref({
		scrollTop: 0
	})
	function scroll(e) {
		console.log(e)
		old.value.scrollTop = e.detail.scrollTop
		console.log('old.value.scrollTop', old.value.scrollTop)
	}
	function toTop() {
		// scrollTop.value = old.value.scrollTop
		scrollTop.value = old.value.scrollTop
		console.log(scrollTop.value)
		nextTick(function () {
			scrollTop.value = 0
		})
	}
</script>
<template>
	<view class="chat-container">
		<scroll-view
			class="chat-messages"
			scroll-y="true"
			scroll-with-animation="true"
			:scroll-top="scrollTop"
			@scroll="scroll"
		>
			<view class="message-wrapper">
				<view
					v-for="(msg, index) in messages"
					:key="index"
					:id="'msg-' + index"
					class="message"
				>
					<view :class="['test', msg.role]">
						<view
							class="assistantPic"
							v-if="msg.role == 'assistant'"
						>
							人机
						</view>
						<view :class="['bubble', msg.role]">
							{{ msg.content }}
						</view>
						<view
							class="assistantPic"
							v-if="msg.role == 'user'"
						>
							用户
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<view class="input-owner">
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
	</view>
</template>
<style lang="scss">
	.chat-container {
		display: flex;
		flex-direction: column;
		position: fixed;
		// height: calc(100vh - 100rpx);
		/* #ifdef MP-WEIXIN */
		width: 100vw;
		height: 100vh;
		/* #endif */
		background-color: #dcebe9;
		.chat-messages {
			flex: 1;
			overflow-y: auto;
			box-sizing: border-box;
			transform: rotate(180deg);
			.message-wrapper {
				width: 100vw;
				transform: rotate(-180deg);
				.message {
					display: flex;
					flex-direction: column;
					.test {
						display: flex;
						.bubble {
							margin: 18rpx;
							padding: 18rpx;
							border-radius: 16rpx;
							max-width: 80%;
							line-height: 1.75;
							word-break: break-word;
						}
						.user {
							// margin-right: 24rpx;
							align-self: flex-end;
							color: #333333;
							background-color: $uni-primary;
						}
						.assistant {
							// margin-left: 24rpx;
							align-self: flex-start;
							color: #555;
							background-color: #cce7e2;
						}
					}
					.user {
						justify-content: flex-end;
					}
				}
			}
		}
		.input-owner {
			.input-area {
				display: flex;
				align-self: center;
				width: 100%;
				background-color: $uni-primary;
				border-bottom: none;
				border-radius: 16rpx 16rpx 0 0;
				box-sizing: border-box;
				// margin-top: 18rpx;
				min-height: 80rpx;
				// padding: 0 24rpx;
				.chat-input {
					flex: 1;
					font-size: 30rpx;
					color: #333333;
					border-radius: 16rpx;
					padding: 12rpx;
					margin: 16rpx;
					margin-bottom: 0rpx;
					// border: 2rpx solid #ccc;
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
	}
</style>
