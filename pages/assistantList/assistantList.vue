<script setup>
	import { onLoad, onShow } from '@dcloudio/uni-app'
	import { ref, nextTick, onMounted } from 'vue'
	import { getAssistantListApi } from '@/apis/getAssList.js'
	const assList = ref([])
	/**
	 * 函数区
	 */

	async function goTalk(item) {
		// const data = { conversationId: item.id, page: 0, size: 10, desc: true }
		// const res = await getConversationContentApi(data)
		// console.log(item, res, data)
		// 跳转过去
		// console.log(item)
		uni.navigateTo({
			// url: `/subpkg/talk/talk?agentId=${item.id}&aiIcon=${item.icon}`,
			url: `/subpkg/talk/talk?agentId=${item.id}&aiIcon=${encodeURIComponent(
				item.icon
			)}`,
			success: (res) => {
				console.log('跳转成功')
			},
			fail: (err) => {
				console.log('跳转失败')
			}
		})
	}

	/**
	 * 生命周期区域
	 */
	onMounted(async () => {
		const res = await getAssistantListApi()
		assList.value = res.data.data
		console.log('agent列表', res)
	})
	// onShow(async () => {
	// 	const res = await getAssistantListApi()
	// 	assList.value = res.data.data
	// 	console.log('agent列表', res)
	// })
</script>
<template>
	<view class="content">
		<view class="ass-list">
			<uni-list>
				<!-- :border="true" -->

				<uni-list-chat
					class="listItem"
					v-for="item in assList"
					:key="item.assistantId"
					:avatar-circle="true"
					:title="item.name"
					:avatar="item.icon"
					:note="item.description"
					note-style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"
					:clickable="true"
					@click="goTalk(item)"
				></uni-list-chat>
			</uni-list>
		</view>
	</view>
</template>
<style lang="scss">
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		// 1.list 样式
		.listItem {
			width: 80vw;
			border-radius: 50%;
			margin-top: 18rpx;
			// note部分样式
			.uni-list-chat__content-note {
				display: block;
				text-overflow: ellipsis;
				max-width: 100%;
			}
		}
	}
</style>
