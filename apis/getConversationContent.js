import request from '@/utils/request.js'
/**
 * @param {Object} 无参数 - {"conversationId": 4, "page":0, "size":10, "desc": true}
 */
export const getConversationContentApi = (data) => {
	return request.post('/internal/ai-chat/get/history/message', data)
}
