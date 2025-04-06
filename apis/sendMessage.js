import request from '@/utils/request.js'
/**
 * @param {Object} data - 用户发送的信息
 */
export const sendMessageApi = (data) => {
	return request.post('/internal/ai-chat/send/message', data)
}
