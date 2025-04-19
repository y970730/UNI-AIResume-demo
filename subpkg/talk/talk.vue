<script setup>
	import { onLoad } from '@dcloudio/uni-app'
	import { ref, nextTick, onMounted } from 'vue'
	import { sendMessageApi } from '@/apis/sendMessage.js'
	import { throttle } from '@/subpkg/utils/throttleDebounce.js'
	import { getConversationContentApi } from '@/apis/getConversationContent.js'
	import { useResumeData } from '@/stores/resumeData.js'

	const input = ref('')
	const messages = ref([])
	// 输入框是否可用
	let isAvailable = ref(true)
	// 会话ID用来请求聊天记录内容
	let conversationId = 0
	// agentId，用来点击agent新建对应的聊天
	let agentId = 0
	// AI头像
	let aiIcon = '/static/default-ai-avatar.jpg'
	// const userStore = useResumeData()
	// const tokenStore = useUserInformation()
	// 如果从历史消息列表跳转则保存conversationId到这里
	// let getCovData = ref({ conversationId:0,page: 0, size: 10, desc: true })
	const handleSend = async () => {
		const trimmed = input.value.trim()
		if (!trimmed) {
			uni.utils.toast('不可以发送空值哦')
			return
		}
		// 处理用户信息发送
		// 添加用户消息
		messages.value.push({
			senderRole: 'user',
			content: trimmed,
			...(conversationId !== 0 && { conversationId }),
			...(agentId !== 0 && { agentId })
		})
		input.value = ''
		isAvailable.value = false
		// 添加AI消息占位符
		const aiMsg = {
			senderRole: 'ai',
			content: '',
			senderIcon: aiIcon
		}
		// 发送请求
		messages.value.push(aiMsg)
		toTop()
		const res = await sendMessageApi(
			JSON.stringify({
				content: trimmed,
				...(conversationId !== 0 && { conversationId }),
				...(agentId !== 0 && { agentId })
			})
		)
		console.log('头像出问题了', res)
		isAvailable.value = true
		if (res.data.eventVo.length !== 0) {
			// uni.$emit('passEventVo', res.data.eventVo)
			console.log(res.data.eventVo)
			useResumeData().setData(res.data.eventVo)
			console.log('看看eventVo', res)
			console.log('测试', useResumeData().getData())
			uni.navigateTo({
				url: `/pages/resume/resume`,
				success: (res) => {
					console.log('跳转成功')
				},
				fail: (err) => {
					console.log('跳转失败')
				}
			})
		}
		// 流式输出
		const fakeStreamText = res.data.completeContent
		// console.log('发送消息部分返回的信息', res.data)
		let scrollFlag = ref(0)
		for (const char of fakeStreamText) {
			await new Promise((resolve) => setTimeout(resolve, 50))
			aiMsg.content += char
			scrollFlag.value++
			if (scrollFlag.value % 5 == 0 || scrollFlag.value == 1) {
				// console.log("进入if", scrollFlag.value);
				toTop()
			}
			messages.value = [...messages.value]
		}
	}
	/**
	 * 生命周期区域
	 */
	onLoad(async (opt) => {
		// console.log('看看resumeData', useResumeData)
		// console.log('onload触发', 'opt为', opt)
		conversationId = opt?.conversationId ? +opt.conversationId : 0
		agentId = opt?.agentId ? +opt.agentId : 0
		aiIcon = opt?.aiIcon ? opt.aiIcon : '/static/default-ai-avatar.jpg'
		// console.log(
		// 	'onload触发',
		// 	'conversationId为',
		// 	conversationId,
		// 	'agentId为:',
		// 	agentId
		// )
	})
	onMounted(async () => {
		isAvailable.value = false
		toTop()

		// try {
		// 先判断是否为回显情况，如果是就先渲染列表
		if (conversationId) {
			// console.log('要显示历史消息')
			const _data = {
				conversationId,
				page: 0,
				size: 10,
				desc: true,
				current: false
			}
			const res = await getConversationContentApi(JSON.stringify(_data))
			// console.log('聊天消息', res.data.data)
			let oldMessages = res.data.data
			// console.log('oldMessages', oldMessages)
			oldMessages = oldMessages.filter((msg) => {
				// console.log(msg)
				return (
					msg.content !== 'msgFirst' && msg.content !== 'msgBackFromHistory'
				)
			})
			messages.value = oldMessages
			console.log('messages.value', messages.value)
		}
		isAvailable.value = true
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
			:scroll-y="true"
			:scroll-with-animation="true"
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
					<view :class="['test', msg.senderRole]">
						<image
							class="assistantPic"
							v-if="msg.senderRole == 'ai'"
							:src="msg.senderIcon || '/static/default-ai-avatar.jpg'"
						/>
						<view :class="['bubble', msg.senderRole]">
							{{ msg.content }}
						</view>
						<image
							class="assistantPic"
							v-if="msg.senderRole == 'user'"
							:src="msg.senderIcon || '/static/default-user-avatar.jpg'"
						/>
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
			// 隐藏滚动条
			/* 隐藏滚动条（兼容微信小程序） */
			::-webkit-scrollbar {
				width: 0;
				height: 0;
				display: none;
			}
			/* 防止 iOS 出现滚动条 */
			-ms-overflow-style: none; /* IE 10+ */
			scrollbar-width: none; /* Firefox */
			.message-wrapper {
				width: 100vw;
				transform: rotate(-180deg);
				.message {
					display: flex;
					padding: 0 20rpx;
					flex-direction: column;
					.test {
						display: flex;
						.assistantPic {
							width: 80rpx;
							height: 80rpx;
							margin-bottom: 18rpx;
							border-radius: 50%;
							// background-color: red;
							display: flex;
							align-items: center;
							justify-content: center;
							font-size: 40rpx;
							color: white;
							flex-shrink: 0;
						}
						.bubble {
							margin: 18rpx;
							padding: 18rpx;
							border-radius: 16rpx;
							max-width: 80vw;
							line-height: 1.75;
							word-break: break-word;
						}
						.user {
							// margin-right: 24rpx;
							align-self: flex-end;
							color: #333333;
							background-color: $uni-primary;
						}
						.ai {
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
				padding-bottom: 32rpx;
				font-size: 18rpx;
				background-color: $uni-primary;
				align-self: center;
				text-shadow: 3rpx 3rpx 5rpx rgba(0, 0, 0, 0.1);
			}
		}
	}
</style>
