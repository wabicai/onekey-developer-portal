import { ChainMethodsSidebar } from '../../../../components/ChainMethodsSidebar'

export default {
  'getting-started': 'Getting Started',
  transport: 'Transport',
  // Chain Methods - custom sidebar selector
  '---chain': {
    type: 'separator',
    title: <ChainMethodsSidebar lang="en" />
  },
  'api-reference': 'API Reference',
  chains: { display: 'hidden' },
  'legacy-guides': 'Migration',
  // Hidden folders
  'quick-start': { display: 'hidden' },
  concepts: { display: 'hidden' }
}
