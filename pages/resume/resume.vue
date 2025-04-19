<script setup>
	// 当前没有 JS 逻辑，如需动态传参可加 props 等
	import { ref, onMounted } from 'vue'
	import { useResumeData } from '@/stores/resumeData.js'
	let resumeData = ref({})
	onMounted(() => {
		const userStore = useResumeData()
		const holeData = userStore.getData()
		resumeData.value = JSON.parse(holeData[0].functionArgument)
		console.log('看看取回的数据', userStore.getData())
		console.log(resumeData.value.education[0])
	})
</script>

<template>
	<view class="resume">
		<view class="header">
			<text class="name">{{ resumeData.recipient_name }}</text>
			<text class="contact">
				邮箱：{{ resumeData.email }} | 毕业于：{{
					resumeData.education?.[0]?.year || '暂未渲染'
				}}
			</text>
		</view>

		<view class="section">
			<text class="section-title">求职意向</text>
			<text class="section-content">{{ resumeData.job_position }}</text>
		</view>

		<view class="section">
			<text class="section-title">教育背景</text>
			<text
				class="section-content"
				v-for="item in resumeData.education"
				:key="item"
			>
				{{ item.degree }} ｜ {{ item.institution }} ｜ {{ item.year }}
			</text>
		</view>

		<view class="section">
			<text class="section-title">平均成绩</text>
			<text class="section-content">85</text>
		</view>

		<view class="section">
			<text class="section-title">实习经历</text>
			<text
				class="section-content"
				v-for="item in resumeData.experience"
				:key="item"
			>
				{{ item.company }} | {{ item.job_title }} | {{ item.years }}
			</text>
		</view>

		<view class="section">
			<text class="section-title">技能</text>
			<text
				class="section-content"
				v-for="item in resumeData.skills"
				:key="item"
			>
				{{ item }}
			</text>
		</view>
	</view>
</template>

<style lang="scss" scoped>
	$resume-color: #333;
	$primary-color: #845ec2;
	$bg-color: #f9f9fb;

	.resume {
		padding: 30rpx;
		background: $bg-color;
		color: $resume-color;

		.header {
			text-align: center;
			margin-bottom: 40rpx;

			.name {
				font-size: 48rpx;
				color: $primary-color;
				font-weight: bold;
				display: block;
			}

			.contact {
				font-size: 26rpx;
				color: #666;
				margin-top: 10rpx;
				display: block;
			}
		}

		.section {
			margin-bottom: 30rpx;

			.section-title {
				font-size: 30rpx;
				font-weight: 600;
				color: $primary-color;
				border-left: 8rpx solid $primary-color;
				padding-left: 16rpx;
				margin-bottom: 8rpx;
				display: block;
			}

			.section-content {
				font-size: 28rpx;
				line-height: 1.6;
				color: $resume-color;
				display: block;
				padding-left: 16rpx;
			}
		}
	}
</style>
