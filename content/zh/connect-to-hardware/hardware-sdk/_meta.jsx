import { ChainMethodsSidebar } from '../../../../components/ChainMethodsSidebar'

export default {
  'getting-started': '快速开始',
  transport: '传输层',
  'api-reference': 'API 参考',
  'basic-api': '基础 API',
  'device-api': '设备 API',
  // Chain Methods - custom sidebar selector
  '---chain': {
    type: 'separator',
    title: <ChainMethodsSidebar lang="zh" />
  },
  chains: { display: 'hidden' },
  'legacy-guides': '迁移指南',
  // Hidden folders
  concepts: { display: 'hidden' }
}
