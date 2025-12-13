import { ChainMethodsSidebar } from '../../../components/ChainMethodsSidebar'

export default {
  index: 'Overview',
  'getting-started': 'Getting Started',
  signers: 'Signer Guides',
  transport: 'Transport',
  '---api': { type: 'separator', title: 'APIs' },
  'core-api-guide': 'Core API Guide',
  'basic-api': 'Basic API',
  'device-api': 'Device API',
  // Chain Methods - custom sidebar selector
  '---chain': {
    type: 'separator',
    title: <ChainMethodsSidebar lang="en" />
  },
  chains: { display: 'hidden' },
  '---Reference': { type: 'separator', title: 'Reference' },
  reference: { title: 'Reference', display: 'children' },
}
