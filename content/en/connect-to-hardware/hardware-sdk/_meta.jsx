import { ChainMethodsSidebar } from '../../../../components/ChainMethodsSidebar'

export default {
  'getting-started': 'Getting Started',
  transport: 'Transport',
  'api-reference': 'API Reference',
  'basic-api': 'Basic API',
  'device-api': 'Device API',
  // Chain Methods - custom sidebar selector
  '---chain': {
    type: 'separator',
    title: <ChainMethodsSidebar lang="en" />
  },
  chains: { display: 'hidden' },
  'legacy-guides': 'Migration',
  // Hidden folders
  concepts: { display: 'hidden' }
}
