import { ChainMethodsSidebar } from '../../../components/ChainMethodsSidebar'

export default {
  index: '概览',
  'getting-started': '快速开始',
  transport: '传输层',
  '---api': { type: 'separator', title: 'API' },
  'api-reference': '核心接口速查',
  'basic-api': '基础 API',
  'device-api': '设备 API',
  signers: '交易签名向导',
  // Chain Methods - custom sidebar selector
  '---chain': {
    type: 'separator',
    title: <ChainMethodsSidebar lang="zh" />
  },
  chains: { display: 'hidden' },
  '---faq': { type: 'separator', title: '参考' },
  reference: { title: '参考', display: 'children' },
  // Hidden folders
}
