<script setup>
	import { ref } from 'vue'

	const username = ref('小程序用户')
	const email = ref('user@example.com')
	const phone = ref('13800000000')
	const avatarUrl = ref(
		'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
	)

	// 左滑选项配置
	const options = ref([
		{
			text: '删除',
			style: {
				backgroundColor: '#ff3b30'
			}
		}
	])

	// 文件列表数据
	const fileList = ref([
		{
			fileId: '！@#adqkmiawhe',
			name: '个人简历.pdf',
			size: '2.5MB',
			url: 'https://www.example.com/my-resume.pdf'
		},
		{
			fileId: '！@#adqwqeqwe',
			name: '作品集.zip',
			size: '15.8MB',
			url: 'https://www.example.com/portfolio.zip'
		},
		{
			fileId: '！@#adiwanafwbwhe',
			name: '项目文档.docx',
			size: '1.2MB',
			url: 'https://www.example.com/project.docx'
		}
	])

	// 处理左滑点击事件
	const handleSwipeClick = (e, file, index) => {
		if (e.content.text === '删除') {
			uni.showModal({
				title: '提示',
				content: '确定要删除该文件吗？',
				success: (res) => {
					if (res.confirm) {
						fileList.value.splice(index, 1)
						uni.showToast({
							title: '删除成功',
							icon: 'success'
						})
					}
				}
			})
		}
	}

	const downloadFile = (file) => {
		uni.downloadFile({
			url: file.url,
			success: (res) => {
				if (res.statusCode === 200) {
					uni.saveFile({
						tempFilePath: res.tempFilePath,
						success: function (res2) {
							uni.showToast({
								title: '下载成功',
								icon: 'success'
							})
						}
					})
				}
			},
			fail: () => {
				uni.showToast({
					title: '下载失败',
					icon: 'error'
				})
			}
		})
	}
</script>
<template>
	<view class="user-info-page">
		<view class="header">
			<image
				class="avatar"
				:src="avatarUrl"
				mode="aspectFill"
			/>
			<view class="username">{{ username }}</view>
		</view>

		<view class="info-list">
			<view class="info-item">
				<text class="label">邮箱</text>
				<text class="value">{{ email }}</text>
			</view>
			<view class="info-item">
				<text class="label">手机号</text>
				<text class="value">{{ phone }}</text>
			</view>
		</view>

		<view class="file-list">
			<uni-swipe-action>
				<uni-swipe-action-item
					v-for="file in fileList"
					:key="file.fileId"
					:right-options="options"
					@click="handleSwipeClick($event, file, index)"
				>
					<view class="file-item">
						<view class="file-info">
							<text class="file-name">{{ file.name }}</text>
							<text class="file-size">{{ file.size }}</text>
						</view>
						<button
							class="download-btn"
							@click="downloadFile(file)"
						>
							下载
						</button>
					</view>
				</uni-swipe-action-item>
			</uni-swipe-action>
		</view>
	</view>
</template>

<style lang="scss" scoped>
	.user-info-page {
		padding: 40rpx;
		background-color: #f7f8fa;
		min-height: 100vh;

		.header {
			display: flex;
			align-items: center;
			flex-direction: column;
			margin-bottom: 60rpx;

			.avatar {
				width: 160rpx;
				height: 160rpx;
				border-radius: 50%;
				margin-bottom: 20rpx;
			}

			.username {
				font-size: 36rpx;
				font-weight: bold;
				color: #333;
			}
		}

		.info-list {
			background: #fff;
			border-radius: 20rpx;
			padding: 30rpx;
			margin-bottom: 40rpx;
			box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.05);

			.info-item {
				display: flex;
				justify-content: space-between;
				padding: 20rpx 20rpx;
				border-bottom: 1rpx solid #f0f0f0;

				&:last-child {
					border-bottom: none;
				}

				.label {
					color: #999;
					font-size: 28rpx;
				}

				.value {
					color: #333;
					font-size: 30rpx;
				}
			}
		}

		.file-list {
			background: #fff;
			border-radius: 20rpx;
			padding: 30rpx;
			box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.05);

			.file-item {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 20rpx;
				border-bottom: 1rpx solid #f0f0f0;
				background-color: #fff;

				&:last-child {
					border-bottom: none;
				}

				.file-info {
					flex: 1;
					margin-right: 20rpx;

					.file-name {
						display: block;
						color: #333;
						font-size: 30rpx;
						margin-bottom: 8rpx;
					}

					.file-size {
						color: #999;
						font-size: 24rpx;
					}
				}
				.download-btn {
					background-color: #78c5c0;
					color: #fff;
					font-size: 28rpx;
					padding: 10rpx 30rpx;
					border-radius: 8rpx;
					margin: 0;
				}
			}
		}
	}
</style>
