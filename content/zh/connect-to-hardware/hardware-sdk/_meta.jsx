import { ChainMethodsSidebar } from '../../../../components/ChainMethodsSidebar'

export default {
  'getting-started': '快速开始',
  transport: '传输协议',
  // Chain Methods - custom sidebar selector
  '---chain': {
    type: 'separator',
    title: <ChainMethodsSidebar lang="zh" />
  },
  'api-reference': '参考文档',
  'legacy-guides': '迁移指南',
  // Hidden folders
  'quick-start': { display: 'hidden' },
  concepts: { display: 'hidden' }
}
