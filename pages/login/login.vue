<script setup>
	import {
		onLoad
	} from '@dcloudio/uni-app'
	import {
		ref,
		reactive,
		computed
	} from 'vue'
	import arAccount from './components/account.vue'
	import arMobile from './components/mobile.vue'
	// 登录类型索引值
	const tabIndex = ref(0)
	// 表单相关数据
	const tabMetas = reactive([{
			title: '账号登录',
			subTitle: '手机号登录'
		},
		{
			title: '手机号登录',
			subTitle: '账号登录'
		}
	])

	// 当前登录信息
	const tabMeta = computed(() => {
		return tabMetas[tabIndex.value]
	})
	console.log(tabIndex.value, tabMeta)
	// 切换登录类型
	function changeLoginType() {
		tabIndex.value = Math.abs(tabIndex.value - 1)
	}
</script>

<template>
	<view class="user-login">
		<view class="login-type">
			<view class="title">{{ tabMeta.title }}</view>
			<view class="type" @click="changeLoginType">
				<text>{{tabMeta.subTitle}}</text>
				<text class="iconfont icon-icon-line-right"></text>
			</view>
		</view>
		<arAccount v-if="tabIndex === 0"></arAccount>
		<arMobile v-else></arMobile>
	</view>
</template>


<style lang='scss' scoped>
	@import './login.scss';
</style>