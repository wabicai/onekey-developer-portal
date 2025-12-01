'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { ChainIcon } from './ChainIcons'

// Module-level variable to persist chain selection across remounts (no localStorage flash)
let lastSelectedChainId = 'ethereum-and-evm'

// Chain data with methods
const CHAINS = [
  {
    id: 'ethereum-and-evm',
    name: 'Ethereum & EVM',
    icon: 'ethereum',
    methods: [
      { id: 'evmgetaddress', name: 'evmGetAddress' },
      { id: 'evmgetpublickey', name: 'evmGetPublicKey' },
      { id: 'evmsignmessage', name: 'evmSignMessage' },
      { id: 'evmsigntransaction', name: 'evmSignTransaction' },
      { id: 'evmsigntypeddata', name: 'evmSignTypedData' },
      { id: 'evmverifymessage', name: 'evmVerifyMessage' },
    ]
  },
  {
    id: 'bitcoin-and-bitcoin-forks',
    name: 'Bitcoin & Forks',
    icon: 'bitcoin',
    methods: [
      { id: 'btcgetaddress', name: 'btcGetAddress' },
      { id: 'btcgetpublickey', name: 'btcGetPublicKey' },
      { id: 'btcsignmessage', name: 'btcSignMessage' },
      { id: 'btcsigntransaction', name: 'btcSignTransaction' },
      { id: 'btcverifymessage', name: 'btcVerifyMessage' },
    ]
  },
  {
    id: 'solana',
    name: 'Solana',
    icon: 'solana',
    methods: [
      { id: 'solgetaddress', name: 'solGetAddress' },
      { id: 'solsigntransaction', name: 'solSignTransaction' },
    ]
  },
  {
    id: 'aptos',
    name: 'Aptos',
    icon: 'aptos',
    methods: [
      { id: 'aptosgetaddress', name: 'aptosGetAddress' },
      { id: 'aptosgetpublickey', name: 'aptosGetPublicKey' },
      { id: 'aptossignmessage', name: 'aptosSignMessage' },
      { id: 'aptossigntransaction', name: 'aptosSignTransaction' },
    ]
  },
  {
    id: 'sui',
    name: 'Sui',
    icon: 'sui',
    methods: [
      { id: 'suigetaddress', name: 'suiGetAddress' },
      { id: 'suigetpublickey', name: 'suiGetPublicKey' },
      { id: 'suisignmessage', name: 'suiSignMessage' },
      { id: 'suisigntransaction', name: 'suiSignTransaction' },
    ]
  },
  {
    id: 'cosmos',
    name: 'Cosmos',
    icon: 'cosmos',
    methods: [
      { id: 'cosmosgetaddress', name: 'cosmosGetAddress' },
      { id: 'cosmosgetpublickey', name: 'cosmosGetPublicKey' },
      { id: 'cosmossigntransaction', name: 'cosmosSignTransaction' },
    ]
  },
  {
    id: 'near',
    name: 'NEAR',
    icon: 'near',
    methods: [
      { id: 'neargetaddress', name: 'nearGetAddress' },
      { id: 'nearsigntransaction', name: 'nearSignTransaction' },
    ]
  },
  {
    id: 'ton',
    name: 'TON',
    icon: 'ton',
    methods: [
      { id: 'tongetaddress', name: 'tonGetAddress' },
      { id: 'tonsignmessage', name: 'tonSignMessage' },
      { id: 'tonsignproof', name: 'tonSignProof' },
    ]
  },
  {
    id: 'tron',
    name: 'TRON',
    icon: 'tron',
    methods: [
      { id: 'trongetaddress', name: 'tronGetAddress' },
      { id: 'tronsignmessage', name: 'tronSignMessage' },
      { id: 'tronsigntransaction', name: 'tronSignTransaction' },
    ]
  },
  {
    id: 'cardano',
    name: 'Cardano',
    icon: 'cardano',
    methods: [
      { id: 'cardanogetaddress', name: 'cardanoGetAddress' },
      { id: 'cardanogetpublickey', name: 'cardanoGetPublicKey' },
      { id: 'cardanosignmessage', name: 'cardanoSignMessage' },
      { id: 'cardanosigntransaction', name: 'cardanoSignTransaction' },
    ]
  },
  {
    id: 'polkadot',
    name: 'Polkadot',
    icon: 'polkadot',
    methods: [
      { id: 'polkadotgetaddress', name: 'polkadotGetAddress' },
      { id: 'polkadotsigntransaction', name: 'polkadotSignTransaction' },
    ]
  },
  {
    id: 'ripple',
    name: 'Ripple (XRP)',
    icon: 'xrp',
    methods: [
      { id: 'xrpgetaddress', name: 'xrpGetAddress' },
      { id: 'xrpsigntransaction', name: 'xrpSignTransaction' },
    ]
  },
  {
    id: 'stellar',
    name: 'Stellar',
    icon: 'stellar',
    methods: [
      { id: 'stellargetaddress', name: 'stellarGetAddress' },
      { id: 'stellarsigntransaction', name: 'stellarSignTransaction' },
    ]
  },
  {
    id: 'filecoin',
    name: 'Filecoin',
    icon: 'filecoin',
    methods: [
      { id: 'filecoingetaddress', name: 'filecoinGetAddress' },
      { id: 'filecoinsigntransaction', name: 'filecoinSignTransaction' },
    ]
  },
  {
    id: 'conflux',
    name: 'Conflux',
    icon: 'conflux',
    methods: [
      { id: 'confluxgetaddress', name: 'confluxGetAddress' },
      { id: 'confluxsignmessage', name: 'confluxSignMessage' },
      { id: 'confluxsignmessagecip23', name: 'confluxSignMessageCIP23' },
      { id: 'confluxsigntransaction', name: 'confluxSignTransaction' },
    ]
  },
  {
    id: 'nervos',
    name: 'Nervos',
    icon: 'nervos',
    methods: [
      { id: 'nervosgetaddress', name: 'nervosGetAddress' },
      { id: 'nervossigntransaction', name: 'nervosSignTransaction' },
    ]
  },
  {
    id: 'starcoin',
    name: 'Starcoin',
    icon: 'starcoin',
    methods: [
      { id: 'startcoingetaddress', name: 'starcoinGetAddress' },
      { id: 'starcoingetpublickey', name: 'starcoinGetPublicKey' },
      { id: 'starcoinsignmessage', name: 'starcoinSignMessage' },
      { id: 'starcoinsigntransaction', name: 'starcoinSignTransaction' },
      { id: 'starcoinverifymessage', name: 'starcoinVerifyMessage' },
    ]
  },
  {
    id: 'kaspa',
    name: 'Kaspa',
    icon: 'kaspa',
    methods: [
      { id: 'kaspagetaddress', name: 'kaspaGetAddress' },
      { id: 'kaspasigntransaction', name: 'kaspaSignTransaction' },
    ]
  },
  {
    id: 'nexa',
    name: 'Nexa',
    icon: 'nexa',
    methods: [
      { id: 'nexagetaddress', name: 'nexaGetAddress' },
      { id: 'nexasigntransaction', name: 'nexaSignTransaction' },
    ]
  },
  {
    id: 'nem',
    name: 'NEM',
    icon: 'nem',
    methods: [
      { id: 'nemgetaddress', name: 'nemGetAddress' },
      { id: 'nemsigntransaction', name: 'nemSignTransaction' },
    ]
  },
  {
    id: 'algorand',
    name: 'Algorand',
    icon: 'algorand',
    methods: [
      { id: 'algogetaddress', name: 'algoGetAddress' },
      { id: 'algosigntransaction', name: 'algoSignTransaction' },
    ]
  },
  {
    id: 'dynex',
    name: 'Dynex',
    icon: 'dynex',
    methods: [
      { id: 'dnxgetaddress', name: 'dnxGetAddress' },
      { id: 'dnxsigntransaction', name: 'dnxSignTransaction' },
    ]
  },
  {
    id: 'alephium',
    name: 'Alephium',
    icon: 'alephium',
    methods: [
      { id: 'alephiumgetaddress', name: 'alephiumGetAddress' },
      { id: 'alephiumsignmessage', name: 'alephiumSignMessage' },
      { id: 'alephiumsigntransaction', name: 'alephiumSignTransaction' },
    ]
  },
  {
    id: 'benfen',
    name: 'Benfen',
    icon: 'benfen',
    methods: [
      { id: 'benfengetaddress', name: 'benfenGetAddress' },
      { id: 'benfengetpublickey', name: 'benfenGetPublicKey' },
      { id: 'benfensignmessage', name: 'benfenSignMessage' },
      { id: 'benfensigntransaction', name: 'benfenSignTransaction' },
    ]
  },
  {
    id: 'nostr',
    name: 'Nostr',
    icon: 'nostr',
    methods: [
      { id: 'nostrgetpublickey', name: 'nostrGetPublicKey' },
      { id: 'nostrsignevent', name: 'nostrSignEvent' },
      { id: 'nostrsignschnorr', name: 'nostrSignSchnorr' },
      { id: 'nostrencryptmessage', name: 'nostrEncryptMessage' },
      { id: 'nostrdecryptmessage', name: 'nostrDecryptMessage' },
    ]
  },
  {
    id: 'scdo',
    name: 'SCDO',
    icon: 'scdo',
    methods: [
      { id: 'scdogetaddress', name: 'scdoGetAddress' },
      { id: 'scdosignmessage', name: 'scdoSignMessage' },
      { id: 'scdosigntransaction', name: 'scdoSignTransaction' },
    ]
  },
]

export function ChainMethodsSidebar({ lang = 'en' }) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [mounted, setMounted] = useState(false)
  const dropdownRef = useRef(null)
  const pathname = usePathname()
  const router = useRouter()

  // Get chain from URL
  const pathParts = pathname?.split('/') || []
  const apiRefIndex = pathParts.findIndex(p => p === 'chains')
  const urlChainId = apiRefIndex >= 0 && CHAINS.some(c => c.id === pathParts[apiRefIndex + 1])
    ? pathParts[apiRefIndex + 1]
    : null
  const currentMethod = pathParts[apiRefIndex + 2] || null

  // Use URL chain if available, otherwise use last selected (persists across remounts)
  const displayedChainId = urlChainId || lastSelectedChainId
  const selectedChain = CHAINS.find(c => c.id === displayedChainId) || CHAINS[0]
  const basePath = `/${lang}/connect-to-hardware/hardware-sdk/chains`

  // Update last selected when URL chain changes
  useEffect(() => {
    if (urlChainId) {
      lastSelectedChainId = urlChainId
    }
  }, [urlChainId])

  const filteredChains = CHAINS.filter(chain =>
    chain.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
        setSearchQuery('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Navigate to the chain's first method when selecting from dropdown
  const handleSelect = (chain) => {
    setIsOpen(false)
    setSearchQuery('')
    lastSelectedChainId = chain.id  // Update module-level variable
    const firstMethod = chain.methods[0]
    router.push(`${basePath}/${chain.id}/${firstMethod.id}`)
  }

  const sectionLabel = lang === 'zh' ? 'Chain Methods' : 'Chain Methods'
  const searchPlaceholder = lang === 'zh' ? '搜索链...' : 'Search chains...'
  const noResults = lang === 'zh' ? '未找到链' : 'No chains found'

  // Always render structure to prevent layout shift
  return (
    <div className="hardware-product-sidebar">
      {/* Section Label */}
      <div className="mb-1">
        <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500">
          {sectionLabel}
        </span>
      </div>

      {/* Chain Dropdown - always render button structure */}
      <div ref={dropdownRef} className="relative mb-1">
        <button
          onClick={() => mounted && setIsOpen(!isOpen)}
          className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm transition-colors
            text-zinc-700 dark:text-zinc-300
            hover:bg-zinc-100 dark:hover:bg-neutral-800
            hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          <ChainIcon chain={selectedChain.icon} size={18} />
          <span className="flex-1 text-left truncate font-medium">
            {selectedChain.name}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-zinc-400 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Dropdown Menu - only when mounted and open */}
        {mounted && isOpen && (
          <div className="absolute z-[9999] top-full left-0 right-0 mt-1 rounded-md shadow-lg overflow-hidden
            border border-zinc-200 dark:border-neutral-700
            bg-white dark:bg-neutral-900">
            {/* Search - no icon */}
            <div className="p-2 border-b border-zinc-100 dark:border-neutral-800">
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-1.5 text-sm rounded-md
                  bg-zinc-50 dark:bg-neutral-800
                  text-zinc-900 dark:text-zinc-100
                  placeholder:text-zinc-400 dark:placeholder:text-zinc-500
                  border border-zinc-200 dark:border-neutral-700
                  focus:outline-none focus:ring-0 focus:border-zinc-400 dark:focus:border-neutral-500"
                autoFocus
              />
            </div>

            {/* Chain List */}
            <div className="max-h-64 overflow-y-auto p-1">
              {filteredChains.map((chain) => (
                <button
                  key={chain.id}
                  onClick={() => handleSelect(chain)}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-sm transition-colors text-left
                    ${chain.id === displayedChainId
                      ? 'product-selected'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-neutral-800 hover:text-zinc-900 dark:hover:text-zinc-100'
                    }`}
                >
                  <ChainIcon chain={chain.icon} size={16} />
                  <span className="truncate">{chain.name}</span>
                </button>
              ))}
              {filteredChains.length === 0 && (
                <div className="px-2.5 py-3 text-center text-sm text-zinc-400">
                  {noResults}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Methods List - always render structure */}
      <ul className="flex flex-col gap-0.5 border-l border-zinc-200 dark:border-neutral-800 ml-[11px]">
        {selectedChain.methods.map((method) => {
          const methodPath = `${basePath}/${displayedChainId}/${method.id}`
          const isActive = pathname === methodPath ||
            (urlChainId === displayedChainId && currentMethod === method.id)

          return (
            <li key={method.id}>
              <Link
                href={methodPath}
                className={`flex rounded px-2 py-1.5 text-sm transition-colors
                  ${isActive ? 'sidebar-link-active' : 'sidebar-link'}`}
              >
                {method.name}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export { CHAINS }
