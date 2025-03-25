<script setup>
	import { ref } from 'vue'
	// import { onLoad, onShow, onReady } from '@dcloudio/uni-app'
	// 1. set form data
	const loginFormPhoneData = ref({
		phoneNum: '',
		code: ''
	})
	// 2. phone rules
	const loginFormPhoneRules = ref({
		phoneNum: {
			rules: [
				{
					required: true,
					errorMessage: '手机号不能为空'
				},
				{
					pattern: '^[a-zA-Z0-9]{6,8}',
					errorMessage: '账号必须为6-8位数字字母组合'
				}
			]
		},
		code: {
			rules: [
				{
					required: true,
					errorMessage: '请填写验证码'
				},
				{
					pattern: '^[0-9]{6}$',
					errorMessage: '验证码格式不正确'
				}
			]
		}
	})
	// 3. form validation
	const loginForm = ref()
	const onPhoneFormSubmit = async () => {
		try {
			const formDataToApi = await loginForm.value.validate()
			console.log(formDataToApi)
		} catch (err) {
			console.log(err)
		}
	}
	// const onPhoneFormSubmit = () => {
	// 	console.log('点击')
	// }
</script>
<template>
	<view class="page-loginMobile">
		<uni-forms
			class="login-form"
			ref="loginForm"
			:model="loginFormPhoneData"
			:rules="loginFormPhoneRules"
		>
			<uni-forms-item
				name="phoneNum"
				class="uni-forms-item"
			>
				<input
					type="text"
					v-model="loginFormPhoneData.phoneNum"
					placeholder="请输入手机号"
					class="uni-input-input"
					placeholder-style="color: #818181"
				/>
			</uni-forms-item>
			<uni-forms-item name="code">
				<input
					type="text"
					v-model="loginFormPhoneData.code"
					placeholder="请输入验证码"
					class="uni-input-input"
					placeholder-style="color: #818181"
				/>
				<text class="text-button">获取验证码</text>
			</uni-forms-item>
			<button
				class="submit-button"
				@click="onPhoneFormSubmit"
			>
				登录
			</button>
		</uni-forms>
	</view>
</template>

<style lang="scss" scoped>
	// 引用废弃，在小程序端无法穿透样式
	// @import './style.scss';
</style>
