import request from '@/utils/request.js'
/**
 * @param {Object} data - 登录表单校验成功后返回的登录数据
 */
export const loginApi = (data) => {
	return request.post('/driver/login/account', data)
}
