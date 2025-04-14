import request from '@/utils/request.js'
/**
 * @param {Object} 无参数 - 携带token由请求拦截器自动执行了
 */
export const getAssistantListApi = () => {
	return request.get('internal/ai-chat/get/agent/list')
}
