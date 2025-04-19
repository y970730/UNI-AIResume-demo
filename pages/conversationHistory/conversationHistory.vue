<script setup>
	import { onShow } from '@dcloudio/uni-app'
	import { ref, nextTick, onMounted } from 'vue'
	// 导入 request 模块
	import { getConversationListApi } from '@/apis/getConversationList.js'
	import dayjs from 'dayjs'
	// 模拟聊天列表数据
	const chatList = ref([])
	// onLoad(() => {
	// then为utils.js封装测试，包含dayjs、toast封装
	// console.log(uni.utils.formatTime(new Date()))
	// const config = {
	// 	Content-Type:
	// }
	// let userData = JSON.stringify({
	// 	username: 'Mrwhite',
	// 	password: '123123'
	// })
	// request
	// 	.post('https://hmajax.itheima.net/api/register', userData)
	// 	.then((res) => {
	// 		uni.utils.toast()
	// 	})
	// OpenAi Assistant message reque sts test
	// })
	// 2.2 获取 store
	// onShow(() => {
	// 	// 弹窗
	// 	uni.showToast({
	// 		title: 'conversationHistory页面'
	// 	})
	// 	// 存储
	// 	// uni.setStorageSync('storageTest', {
	// 	// 	a: 1
	// 	// })
	// })
	// 对话点击跳转聊天
	async function handleChatClick(item) {
		// const data = { conversationId: item.id, page: 0, size: 10, desc: true }
		// const res = await getConversationContentApi(data)
		console.log('看看item：', item)
		// 跳转过去
		uni.navigateTo({
			url: `/subpkg/talk/talk?conversationId=${item.id}`,
			success: (res) => {
				console.log('跳转成功')
			},
			fail: (err) => {
				console.log('跳转失败')
			}
		})
	}
	// 请求对话历史函数，包含日期格式化逻辑
	async function getConversationListANDformateDate() {
		const res = await getConversationListApi()
		chatList.value = res.data.data
		console.log('聊天历史列表', res.data.data)
		// ↓↓↓日期计算函数模块↓↓↓ 格式化日期标签,计算相隔几天，超过前天显示日期
		const getRelativeDayLabel = (relDay) => {
			const _today = dayjs().startOf('day')
			const _target = dayjs(relDay).startOf('day')
			const _dayDiff = _today.diff(_target, 'day')
			// console.log(dayDiff)
			const _showCurrentDate = (format) => {
				return dayjs(relDay).format(format)
			}
			const _dayLabel = {
				0: _showCurrentDate('HH:ss'),
				1: '昨天' + '\u00A0' + _showCurrentDate('HH:ss'),
				2: '前天'
			}
			if (_dayDiff > 2) {
				return dayjs(relDay).format('MM-DD')
			}
			return _dayLabel[_dayDiff]
		}
		// ↑↑↑日期计算函数模块️↑↑↑
		// ↓↓↓遍历修改格式化时间↓↓↓
		chatList.value = res.data.data.map((item) => ({
			// 最近消息的 yyyymmdd 数字格式
			...item,
			formattedTime: getRelativeDayLabel(item.lastMessageTime)
		}))
		// ↑↑↑遍历修改格式化时间️↑↑↑
	}
	onShow(() => {
		getConversationListANDformateDate()
	})
	onMounted(() => {
		getConversationListANDformateDate()
	})
</script>
<template>
	<view class="chat-container">
		<view class="ass-list">
			<uni-list>
				<uni-list-chat
					class="listItem"
					v-for="item in chatList"
					:key="item.createdAt"
					:title="item.aiInfo.name"
					:avatar="item.aiInfo.icon"
					:note="item.lastMessage"
					:clickable="true"
					@click="handleChatClick(item)"
					:time="item.formattedTime"
				/>
				<!-- 				:badge-text="item.badge"
				:badge-type="item.badge > 0 ? 'error' : 'default'" -->
			</uni-list>
		</view>
	</view>
</template>
<style lang="scss">
	.chat-container {
		width: 100%;
		height: 100vh;
		background-color: #f5f5f5;
	}
	// 自定义样式可以根据需要添加
	.listItem {
		padding: 0rpx 20rpx;
	}
</style>
