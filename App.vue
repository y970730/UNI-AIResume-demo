<script>
	export default {
		// 相当于小程序app.js
		// 这里负责监听整个程序的全局生命周期
		onLaunch: function () {
			console.log('App Launch, 全局App加载周期')
		},
		onShow: function () {
			console.log('App Show, 全局App显示周期')
		},
		onHide: function () {
			console.log('App Hide, 全局App隐藏周期')
		}
	}
</script>
<!-- app.vue中不能写template！！只能有script 和 style！！ -->
<style lang="scss">
	/*每个页面公共css，即全局css全部写在这里 */
	@import './fonts.scss';

	/* 暂时不知道什么作用 */
	button::after {
		display: none;
	}

	cover-view {
		/* #ifndef APP-PLUS*/
		overflow: visible;
		/* #endif */
	}

	/* 等待适配 */
	/*每个页面公共css */
	.page-container {
		height: 100vh;
		/* #ifdef H5 */
		height: calc(100vh - 44px);
		/* #endif  */
		overflow-y: auto;
		box-sizing: border-box;
		background-color: $uni-bg-color;
	}

	.error {
		color: $uni-primary !important;
	}

	.uni-textarea-placeholder {
		font-size: $uni-font-size-base;
	}

	.uni-scroll-view-content {
		height: auto !important;
	}

	.uni-scroll-view-refresher {
		margin-top: 15rpx;
		transform: scale(0.9);
		background-color: transparent !important;
	}

	.scroll-view-wrapper {
		overflow: hidden;
	}

	.uni-nav-bar-text {
		/* #ifndef APP-PLUS */
		font-size: 16px !important;
		font-weight: 700;
		/* #endif */
	}

	.uni-list-item__container {
		padding-top: 32rpx !important;
		padding-bottom: 32rpx !important;
	}

	.uni-list--border::after {
		left: 30rpx !important;
		right: 30rpx !important;
		background-color: $uni-border-1 !important;
	}

	.uni-list-item__content-title {
		font-size: $uni-font-size-base !important;
		color: $uni-main-color !important;
	}

	.uni-list-item__extra-text {
		max-width: 360rpx;
		text-overflow: ellipsis;
		overflow: hidden;
		text-align: right;
		overflow: hidden;
		white-space: nowrap;
		font-size: $uni-font-size-base !important;
		color: $uni-secondary-color !important;
	}

	.uni-checkbox-input:hover {
		border-color: #d1d1d1 !important;
	}

	.uni-card {
		margin-top: 0 !important;
	}
</style>
