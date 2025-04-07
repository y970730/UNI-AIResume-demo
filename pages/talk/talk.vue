<script setup>
	import { ref, nextTick, onMounted, onBeforeUnmount } from 'vue'
	import { sendMessageApi } from '@/apis/sendMessage.js'
	import { throttle } from '@/utils/throttleDebounce.js'
	const input = ref('')
	// const messages = ref([
	// 	{ role: 'user', content: '你好AI' },
	// 	{ role: 'assistant', content: '你好白痴' },
	// 	{ role: 'user', content: '你好AI' },
	// 	{ role: 'assistant', content: '你好白痴' },
	// 	{ role: 'user', content: '你好AI' },
	// 	{ role: 'assistant', content: '你好白痴' },
	// 	{ role: 'user', content: '你好AI' },
	// 	{ role: 'assistant', content: '你好白痴' }
	// ])
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
		// await nextTick()
		// scrollToBottom()
		// await nextTick()
		// scrollIntoView.value = `msg-${messages.value.length - 1}`
		isAvailable.value = false

		// 添加AI消息占位符
		const aiMsg = {
			role: 'assistant',
			content: ''
		}

		// 发送请求
		messages.value.push(aiMsg)
		await nextTick()
		scrollToBottom()
		try {
			const res = await sendMessageApi(JSON.stringify({ content: trimmed }))
			isAvailable.value = true
			// 流式输出
			const fakeStreamText = res.data.completeContent
			let scrollFlag = ref(0)
			for (const char of fakeStreamText) {
				await new Promise((resolve) => setTimeout(resolve, 30))
				aiMsg.content += char
				messages.value = [...messages.value]
				if (scrollFlag.value % 1 == 0) {
					console.log('进入if', scrollFlag.value)
					await nextTick()
					scrollToBottom()
				}
			}
		} catch (err) {
			isAvailable.value = true
			aiMsg.content = '请求出错'
			await nextTick()
			scrollToBottom()
		}
	}
	onMounted(async () => {
		// await nextTick()
		// scrollToBottom()
		isAvailable.value = false
		// 让视窗稍微滚动一下，以获取滚动区域大小
		scrollTop.value += 0.00000000001
		// 获取窗口大小（注意排除了输入框)
		uni
			.createSelectorQuery()
			.select('.chat-messages')
			.boundingClientRect((data) => {
				windowHeight.value = data.height
			})
			.exec()
		try {
			const res = await sendMessageApi(
				JSON.stringify({
					content: 'awefhajfhakwjhfjkwahfjkaewjkfhjk'
				})
			)
			isAvailable.value = true

			const aiMsg = {
				role: 'assistant',
				content: ''
			}
			messages.value.push(aiMsg)
			const fakeStreamText = res.data.completeContent
			for (const char of fakeStreamText) {
				await new Promise((resolve) => setTimeout(resolve, 30))
				aiMsg.content += char
				await nextTick()
				scrollToBottom()
				messages.value = [...messages.value]
			}
		} catch (err) {
			isAvailable.value = true
			const aiMsg = {
				role: 'assistant',
				content: ''
			}
			messages.value.push(aiMsg)
			await nextTick()
			scrollToBottom()
			let scrollFlag = ref(0)
			const fakeStreamText =
				'服务有点问题，建议压力后端。但你仍然可以尝试询问我哦'
			for (const char of fakeStreamText) {
				await new Promise((resolve) => setTimeout(resolve, 30))
				aiMsg.content += char
				if (scrollFlag.value % 5 == 0) {
					await nextTick()
					scrollToBottom()
				}

				messages.value = [...messages.value]
			}
		}
	})
	const handleSendWithThrottle = throttle(handleSend)

	// 滚动控制
	let scrollHeight = ref(0)
	let scrollTop = ref(0)
	let old2 = ref({
		scrollTop: 0
	})
	let windowHeight = ref(0)
	// 滚动事件防抖
	// const scroll = throttle(scrollWithoutThrottle)
	function scroll(e) {
		console.log('先滚动事件被触发，获取滚动窗大小：', e.detail.scrollHeight)
		console.log(e)
		/**
		 * 维护一对滑动参数
		 * 1。 old2内部的 scrollTop 是当前整个message页面 滑入 顶部后不可见部分的长度
		 * 2。 scrollTop 是触发 “滑到底部” 这一需求时，页面需要向上滚动的距离。
		 * 计算说明：
		 * 	1. 本滑动事件被 scrollToBottom 函数通过 scrollTop += 0.001 触发
		 *  2. 本函数时分为两种情况时候会执行：
		 *
		 * 		2.1 当**手动滑动页面**时候，scrollTop = scrollHeight.value - windowHeight
		 * 				并不会变化，因为滑动页面 并不改变 后面两个数值。但此时上一条
		 * 				old2.value.scrollTop = e.detail.scrollTop 却将手动滑上去多少页面记录在了
		 * 				old2 这个对象里面，并且每次触发事件都会更新（后续做节流吧，不然还是有问题)。
		 *
		 * 		2.2 点击或触发 scrollToBottom 函数时候，如果此时在页面底部且，scrollToBottom 函数中
		 * 				的 old2 中的值并没有变化，因此每次执行 scrollToBottom 都会把原始滚动值重新 + 1赋
		 * 				值给scrollTop，每次的值都是 当前页面上部 滚入值 + 1 即不变，因此不会触发滚动视图的滚动，事件也因此不会触发。
		 *
		 * 				但是当手动滚动过，old2 中的值变化，此时 old2 + 1 不会再等于之前的 scrollTop 值，也因此会触发事件，且此时事件
		 * 				中的 old2.value.scrollTop = e.detail.scrollTop 会把当前页面高度重新赋值给 old。比如当页面回到了顶部，
		 * 				滑动过程中触发滑动事件 old 被 e.detail.scrollTop 赋值为 0。当需要触发返回底部（比如来了新消息）时候，scrollToBottom 会
		 * 				把 old 赋值给 scrollTop。此时 old 和 scrollTop 都为 0 ，然后通过 + 1触发事件，
		 * 				事件中重新通过		scrollTop.value = scrollHeight.value - windowHeight.value 计算得到需要滚动的数字
		 * 				scrollTop.value 的值从 0 变成 0+1 再变成算好数字，页面实际上会变动两次。
		 *  总结：
		 * 			1. 滑动会正常触发事件，但是 scrollTop 的值算来算去并没变化，因此不会触发滑动。
		 * 			2. 页面在底部触发  scrollToBottom 函数不会触发事件，因为 old2 没变化 且 scrollTop 上次已经被算过了
		 * 			3. 页面滑动过就会 触发滑动事件并 改变 old ，但不会改变 scrollTop 所以滑动并不会触发 到底动作
		 * 			4. 因为页面滑动改变了 old ， 因此 触发 scrollToBottom 会改变 scrollTop 并触发一次滑动（滚动位置和当前相同），但后续 + 1
		 * 				 也会 触发一次事件，两个事件一起生效（后期做了节流就好了）就会重新计算卷入值，于是实现 归底。
		 */
		scrollHeight.value = e.detail.scrollHeight
		old2.value.scrollTop = e.detail.scrollTop
		scrollTop.value = scrollHeight.value - windowHeight.value
		console.log('滑动事件', scrollTop.value, old2.value.scrollTop)
	}
	function scrollToBottom() {
		console.log('scrollToBottom函数', scrollTop.value, old2.value.scrollTop)
		// scrollTop.value = old2.value.scrollTop
		// 让视窗稍微滚动一下，以获取滚动区域大小
		scrollTop.value += 4
		console.log(
			'scrollToBottom函数尝试触发事件',
			scrollTop.value,
			old2.value.scrollTop
		)
	}
</script>
<template>
	<view class="chat-container">
		<scroll-view
			class="chat-messages"
			scroll-y
			:scroll-top="scrollTop"
			:scroll-with-animation="true"
			@scroll="scroll"
		>
			<!-- :scroll-into-view="scrollIntoView" -->
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
				<!-- confirm-type="send"
			 -->
				<button
					class="send-button"
					@click="handleSendWithThrottle"
				>
					发送
				</button>
				<!-- <button @click="scrollToBottom">测试</button> -->
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
		background-color: #f5f7f6;
		.chat-messages {
			// height: 200rpx;
			flex: 1;
			overflow-y: auto;
			box-sizing: border-box;
			.message {
				margin-top: 24rpx;
				display: flex;
				flex-direction: column;
				.bubble {
					margin: 36rpx;
					padding: 18rpx;
					// background-color: $uni-primary;
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
					background-color: #dcebe9;
				}
			}
		}
		.input-owner {
			.input-area {
				display: flex;
				align-self: center;
				width: 100%;
				background-color: $uni-primary;
				// border: 2rpx solid #ccc;
				border-bottom: none;
				border-radius: 16rpx 16rpx 0 0;
				box-sizing: border-box;
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
