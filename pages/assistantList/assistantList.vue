<script setup>
	import { onLoad, onShow } from '@dcloudio/uni-app'
	import { ref, nextTick, onMounted } from 'vue'
	import { getAssistantListApi } from '@/apis/getAssList.js'
	const assList = ref([])
	// 函数区
	function goTalk(event) {
		console.log('点击', event)
	}

	onMounted(async () => {
		const res = await getAssistantListApi()
		assList.value = res.data.data
	})
	// onShow(() => {
	// 	uni.showToast({
	// 		title: 'Ass-List页面'
	// 	})
	// })
</script>
<template>
	<view class="content">
		<view class="ass-list">
			<uni-list>
				<!-- :border="true" -->

				<uni-list-chat
					class="listItem"
					v-for="(item, index) in assList"
					:key="item.assistantId"
					:avatar-circle="true"
					:title="item.name"
					:avatar="item.icon"
					:note="item.description"
					note-style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"
					:clickable="true"
					link="navigateTo: "
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