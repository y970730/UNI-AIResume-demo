<script>
	export default {
		// 相当于小程序app.js
		// 这里负责监听整个程序的全局生命周期
		onLaunch: function() {
			console.log('App Launch, 全局App加载周期')
		},
		onShow: function() {
			console.log('App Show, 全局App显示周期')
		},
		onHide: function() {
			console.log('App Hide, 全局App隐藏周期')
		}
	}
</script>
<!-- app.vue中不能写template！！只能有script 和 style！！ -->
<style>
	/*每个页面公共css，即全局css全部写在这里 */
</style>