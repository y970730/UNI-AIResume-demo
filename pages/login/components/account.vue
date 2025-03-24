<script setup>
	import { ref } from 'vue'
	// 1. set form data
	const loginFormData = ref({
		account: '',
		password: ''
	})
	// 2. account rules
	const loginFormRules = ref({
		account: {
			rules: [
				{ required: true, errorMessage: '账号不能为空' },
				{ pattern: '^[a-zA-Z0-9]{6,8}', errorMessage: '账号必须为6-8位数字字母组合' }
			]
		},
		password: {
			rules: [
				{ required: true, errorMessage: '密码不能为空' },
				{ pattern: '^\\d{6}$', errorMessage: '密码不能少于6位' }
			]
		}
	})
	// 3. form validation
	const loginForm = ref()
	const onFormSubmit = async () => {
		try {
			const formDataToApi = await loginForm.value.validate()
			console.log(formDataToApi)
		} catch (err) {
			console.log('校验失败', err)
		}
	}
	console.log(loginFormData)
</script>
<template>
	<uni-forms class="login-form" ref="loginForm" :model="loginFormData" :rules="loginFormRules">
		<uni-forms-item name="account" class="uni-forms-item">
			<input type="text" v-model="loginFormData.account" placeholder="请输入账号" class="uni-input-input" placeholder-style="color: #818181" />
		</uni-forms-item>
		<uni-forms-item name="password">
			<input type="text" v-model="loginFormData.password" placeholder="请输入密码" class="uni-input-input" placeholder-style="color: #818181" />
		</uni-forms-item>
		<button class="submit-button" @click="onFormSubmit">登录</button>
	</uni-forms>
</template>

<style lang="scss" scoped>
	@import './styles.scss';
</style>
