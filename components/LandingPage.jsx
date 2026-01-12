'use client'

import Link from 'next/link'
import {
  Usb,
  Bluetooth,
  Smartphone,
  QrCode,
  ArrowUpRight,
  Twitter,
  Github,
  Bug,
} from 'lucide-react'

const heroSecurity05 = '/landing-page/security-05.svg'
const heroSecurity04 = '/landing-page/security-04.svg'
const heroSecurity03 = '/landing-page/security-03.svg'
const heroSecurity02 = '/landing-page/security-02.svg'
const heroSecurity01 = '/landing-page/security-01.svg'

const getFooterColumns = (isZh, locale) => {
  if (isZh) {
    return [
      {
        title: '资源',
        items: [
          { label: 'Playground', href: 'https://hardware-example.onekey.so/' },
          { label: 'hardware-js-sdk', href: 'https://github.com/OneKeyHQ/hardware-js-sdk/' },
          { label: 'cross-inpage-provider', href: 'https://github.com/OneKeyHQ/cross-inpage-provider' },
          { label: 'app-monorepo', href: 'https://github.com/OneKeyHQ/app-monorepo' },
        ],
      },
      {
        title: '社区',
        items: [
          { label: 'GitHub', href: 'https://github.com/OneKeyHQ' },
          { label: 'Twitter', href: 'https://twitter.com/onekeyHQ' },
          { label: 'Blog', href: 'https://onekey.so/blog' },
        ],
      },
      {
        title: '法律',
        items: [
          { label: '用户协议', href: 'https://help.onekey.so/zh-CN/articles/11461297-%E6%9C%8D%E5%8A%A1%E5%8D%8F%E8%AE%AE?url_locale=zh-CN' },
          { label: '隐私政策', href: 'https://help.onekey.so/zh-CN/articles/11461298-privacy-policy?url_locale=zh-CN' },
          { label: '官方成员验证', href: 'https://onekey.so/zh_CN/team-verification/' },
        ],
      },
    ]
  }

  return [
      {
        title: 'Resources',
        items: [
          { label: 'Playground', href: 'https://hardware-example.onekey.so/' },
          { label: 'hardware-js-sdk', href: 'https://github.com/OneKeyHQ/hardware-js-sdk/' },
          { label: 'cross-inpage-provider', href: 'https://github.com/OneKeyHQ/cross-inpage-provider' },
          { label: 'app-monorepo', href: 'https://github.com/OneKeyHQ/app-monorepo' },
        ],
      },
    {
      title: 'Community',
      items: [
        { label: 'GitHub', href: 'https://github.com/OneKeyHQ' },
        { label: 'Twitter', href: 'https://twitter.com/onekeyHQ' },
        { label: 'Blog', href: 'https://onekey.so/blog' },
      ],
    },
      {
        title: 'Legal',
        items: [
          { label: 'User Agreement', href: 'https://help.onekey.so/zh-CN/articles/11461297-%E6%9C%8D%E5%8A%A1%E5%8D%8F%E8%AE%AE?url_locale=zh-CN' },
          { label: 'Privacy Policy', href: 'https://help.onekey.so/zh-CN/articles/11461298-privacy-policy?url_locale=zh-CN' },
          { label: 'Team Verification', href: 'https://onekey.so/zh_CN/team-verification/' },
        ],
      },
    ]
}

const IntegrationCard = ({ title, description, icon: Icon, iconSrc, href, cta, className = '' }) => (
  <Link
    href={href}
    className={`flex h-[234px] w-full flex-col justify-between rounded-[16px] border border-white/10 bg-[#222] p-[32px] no-underline ${className}`}
  >
    <div className="flex flex-col gap-[24px]">
      <div className="flex items-center gap-[12px]">
        <div className="flex size-[38px] items-center justify-center rounded-full bg-[#191919]">
          {iconSrc ? (
            <img src={iconSrc} alt="" className="size-[20px]" />
          ) : (
            <Icon className="size-[20px] text-white" />
          )}
        </div>
        <p className="text-[24px] font-semibold leading-[30px] text-white">
          {title}
        </p>
      </div>
      <p className="text-[16px] leading-[20px] text-white/70">
        {description}
      </p>
    </div>
    <div className="flex items-center gap-[4px] text-[#16d629]">
      <span className="text-[18px] leading-[20px]">{cta}</span>
      <ArrowUpRight className="size-[16px]" />
    </div>
  </Link>
)

export function LandingPage({ locale = 'en' }) {
  const isZh = locale === 'zh'
  const copy = isZh
    ? {
        heroTitle: 'OneKey 开发者门户',
        heroSubtitle: '用 OneKey 硬件构建安全的 Web3 体验。',
        ctaPrimary: '开始构建',
        ctaSecondary: '更新日志',
        viewDocs: '查看文档',
        hardwareTitle: '硬件接入',
        hardwareSubtitle: '通过 USB 或 BLE 连接 OneKey 设备。',
        dappTitle: 'dApp 接入',
        dappSubtitle: 'SDK 与 API 用于钱包连接与签名。',
        offlineTitle: '离线签名',
        offlineSubtitle: '使用二维码进行离线签名。',
        supportTitle: '需要集成支持？',
        supportSubtitle: '获取架构评审、传输方案选择与生产环境落地支持。',
        supportPrimary: '提交需求',
      }
    : {
        heroTitle: 'OneKey Developer Portal',
        heroSubtitle: 'Integrate secure, hardware-backed signing into your dApp, wallet, or blockchain stack.',
        ctaPrimary: 'Get Started',
        ctaSecondary: 'View Changelog',
        viewDocs: 'View docs',
        hardwareTitle: 'Hardware Integration',
        hardwareSubtitle: 'Connect to OneKey devices over USB or BLE transports.',
        dappTitle: 'dApp Integration',
        dappSubtitle: 'SDKs and APIs for wallet connectivity and signing.',
        offlineTitle: 'Offline Signing',
        offlineSubtitle: 'Air-gapped signing flows using QR codes.',
        supportTitle: 'Need integration support?',
        supportSubtitle: 'Get help with architecture reviews, transport selection, and production rollout.',
        supportPrimary: 'Submit a Request',
      }
  const integrationCards = [
    {
      title: isZh ? 'WebUSB 连接' : 'WebUSB Connection',
      description: isZh ? '适用于网页与桌面浏览器的 USB 传输。' : 'USB transport for web apps and desktop browsers.',
      icon: Usb,
      href: `/${locale}/hardware-sdk/transport/web-usb`,
      cta: copy.viewDocs,
    },
    {
      title: isZh ? 'React Native BLE' : 'React Native BLE',
      description: isZh ? '适用于 React Native 的 BLE 传输。' : 'BLE transport for React Native apps.',
      icon: Bluetooth,
      href: `/${locale}/hardware-sdk/transport/react-native-ble`,
      cta: copy.viewDocs,
    },
    {
      title: isZh ? '原生移动端 BLE' : 'Native Mobile BLE',
      description: isZh ? '适用于原生移动端的 BLE 传输。' : 'BLE transport for native mobile apps.',
      icon: Smartphone,
      href: `/${locale}/hardware-sdk/transport/native-ble`,
      cta: copy.viewDocs,
    },
  ]

  const dappCards = [
    {
      title: isZh ? 'Provider API' : 'Provider API',
      description: isZh ? 'Provider 接入规范、支持链与签名能力说明。' : 'Provider integration specs, supported chains, and signing capabilities.',
      icon: Usb,
      href: `/${locale}/connect-to-software/provider`,
      cta: copy.viewDocs,
      iconSrc: '/landing-page/icon-provider.svg',
    },
    {
      title: isZh ? 'Web3Modal UI 组件' : 'Web3Modal UI Kit',
      description: isZh ? '可直接集成的钱包连接 UI，支持移动端。' : 'Drop-in wallet connection UI with mobile support.',
      icon: Bluetooth,
      href: `/${locale}/connect-to-software/wallet-ui/web3modal`,
      cta: copy.viewDocs,
      iconSrc: '/landing-page/icon-web3Modal.svg',
    },
  ]

  const offlineCards = [
    {
      title: isZh ? 'Air-Gapped QR 流程' : 'Air-Gapped QR Flow',
      description: isZh ? '通过二维码离线签名与数据交换。' : 'Sign transactions offline with QR-based data exchange.',
      icon: QrCode,
      href: `/${locale}/air-gap`,
      cta: copy.viewDocs,
    },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-[#101111] font-sans text-white">
      <main className="flex flex-col gap-[40px]">
        <section
          className="relative w-full overflow-hidden pt-[8px]"
          style={{
            backgroundImage:
              'radial-gradient(44.43% 1236.5% at 50% 100%, #3d3d3d 0%, #272727 50%, #1b1c1c 75%, #101111 100%)',
          }}
        >
          <div className="relative mx-auto h-[500px] w-full max-w-[1440px]">
            <div
              className="pointer-events-none absolute bottom-0 left-0 h-[20%] w-full"
              style={{
                background:
                  'linear-gradient(0deg, rgba(16,17,17,0.95) 0%, rgba(16,17,17,0) 100%)',
              }}
            />
            <div className="absolute left-[64px] top-[96px] z-10 flex w-[711px] flex-col gap-[16px]">
              <h1 className="text-[52px] font-semibold leading-[56px]">
                <span className="bg-gradient-to-r from-white to-[#16d629] bg-clip-text text-transparent">
                  {copy.heroTitle}
                </span>
              </h1>
              <p className="text-[16px] leading-[20px] text-white/60">
                {copy.heroSubtitle}
              </p>
            </div>
            <div className="absolute left-[64px] top-[236px] z-10 flex items-center gap-[8px]">
              <button
                type="button"
                onClick={() => {
                  const section = document.getElementById('hardware-integration')
                  if (section) {
                    section.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
                className="flex w-[170px] items-center justify-center gap-[8px] rounded-[50px] px-[16px] py-[18px] text-[16px] font-medium text-[#101111]"
                style={{
                  backgroundImage:
                    'linear-gradient(90deg, rgb(79, 245, 95) 0%, rgb(33, 233, 53) 100%)',
                  color: '#101111',
                }}
              >
                {copy.ctaPrimary}
                <img
                  src="/Button/Icon/logo.svg"
                  alt=""
                  className="size-[24px]"
                />
              </button>
              <Link
                href={`/${locale}/changelog`}
                className="flex w-[170px] items-center justify-center rounded-[50px] bg-white px-[18px] py-[18px] text-[16px] font-medium text-[#101111] no-underline"
                style={{ color: '#101111' }}
              >
                {copy.ctaSecondary}
              </Link>
            </div>
              <img
                src={heroSecurity05}
                alt=""
                className="pointer-events-none absolute left-[calc(50%+309px)] top-[-140px] h-[720px] w-[740px] -translate-x-1/2 object-cover opacity-70"
              />
              <img
                src={heroSecurity04}
                alt=""
                className="pointer-events-none absolute left-[calc(50%+285.5px)] top-[-80px] h-[680px] w-[675px] -translate-x-1/2 object-cover"
              />
              <img
                src={heroSecurity03}
                alt=""
                className="pointer-events-none absolute left-[calc(50%+285.5px)] top-[-80px] h-[680px] w-[675px] -translate-x-1/2 object-cover opacity-20"
              />
              <img
                src={heroSecurity02}
                alt=""
                className="pointer-events-none absolute left-[calc(50%+285.5px)] top-[-80px] h-[680px] w-[675px] -translate-x-1/2 object-cover"
              />
              <img
                src={heroSecurity01}
                alt=""
                className="pointer-events-none absolute left-[calc(50%+285.5px)] top-[-80px] h-[680px] w-[675px] -translate-x-1/2 object-cover opacity-50"
              />
          </div>
        </section>

        <section
          id="hardware-integration"
          className="mx-auto flex w-full max-w-[1440px] flex-col items-start gap-[24px] px-[64px]"
        >
          <div className="flex flex-col items-start gap-[8px] text-left">
            <p className="text-[40px] font-medium leading-[46px]">{copy.hardwareTitle}</p>
            <p className="text-[16px] text-white/70">
              {copy.hardwareSubtitle}
            </p>
          </div>
          <div className="grid w-full grid-cols-1 gap-[32px] lg:grid-cols-3">
            {integrationCards.map((card) => (
              <IntegrationCard key={card.title} {...card} />
            ))}
          </div>
        </section>

        <section className="mx-auto flex w-full max-w-[1440px] flex-col items-start gap-[24px] px-[64px]">
          <div className="flex flex-col items-start gap-[8px] text-left">
            <p className="text-[40px] font-medium leading-[46px]">{copy.dappTitle}</p>
            <p className="text-[16px] text-white/70">
              {copy.dappSubtitle}
            </p>
          </div>
          <div className="grid w-full grid-cols-1 gap-[32px] lg:grid-cols-2">
            {dappCards.map((card) => (
              <IntegrationCard key={card.title} {...card} />
            ))}
          </div>
        </section>

        <section className="mx-auto flex w-full max-w-[1440px] flex-col items-start gap-[24px] px-[64px]">
          <div className="flex flex-col items-start gap-[8px] text-left">
            <p className="text-[40px] font-medium leading-[46px]">{copy.offlineTitle}</p>
            <p className="text-[16px] text-white/70">
              {copy.offlineSubtitle}
            </p>
          </div>
          <div className="grid w-full grid-cols-1 gap-[32px] lg:grid-cols-2">
            {offlineCards.map((card) => (
              <IntegrationCard key={card.title} className="lg:col-span-1" {...card} />
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-[1440px] px-[64px] pb-[40px]">
          <div
            className="relative flex flex-col items-start gap-[31px] rounded-[24px] p-[40px] text-[#101111] lg:flex-row lg:items-center"
            style={{
              backgroundImage: 'linear-gradient(90deg, #c3c3c3 0%, #eeeeee 100%)',
            }}
          >
            <div className="flex w-full max-w-[591px] flex-col gap-[30px]">
              <div className="flex flex-col gap-[8px] text-[#101111]">
                <div className="text-[30px] font-semibold leading-[36px]">
                  {copy.supportTitle}
                </div>
                <div className="text-[16px] leading-[20px] text-[#2d3133]">
                  {copy.supportSubtitle}
                </div>
              </div>
              <div className="flex flex-wrap gap-[16px]">
                <a
                  href="https://help.onekey.so/hc/requests/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-[8px] rounded-[50px] px-[20px] py-[10px] text-[16px] font-medium text-[#101111] no-underline"
                  style={{
                    backgroundImage:
                      'linear-gradient(90deg, rgb(79, 245, 95) 0%, rgb(33, 233, 53) 100%)',
                    color: '#101111',
                  }}
                >
                  {copy.supportPrimary}
                </a>
                <a
                  href="https://github.com/OneKeyHQ/hardware-js-sdk/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-[8px] rounded-[50px] border border-[#101111] px-[20px] py-[10px] text-[16px] font-medium text-[#101111] no-underline"
                >
                  GitHub Issues
                </a>
              </div>
            </div>
            <img
              src="/landing-page/device.png"
              alt="OneKey device"
              className="pointer-events-none hidden size-[400px] object-contain lg:absolute lg:right-[40px] lg:top-[-80px] lg:block"
            />
          </div>
        </section>
      </main>

      <footer className="mt-[40px] w-full border-t border-white/10 bg-[#0b0b0b]">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-[40px] px-[64px] pb-[48px] pt-[56px]">
          <div className="grid grid-cols-1 gap-[24px] md:grid-cols-2 lg:grid-cols-4">
            {getFooterColumns(isZh, locale).map((column) => (
              <div key={column.title} className="flex flex-col gap-[16px]">
                <p className="text-[14px] font-medium text-white/60">{column.title}</p>
                <div className="flex flex-col gap-[12px] text-[16px] text-white">
                  {column.items.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      className="text-white/80 hover:text-white"
                      target={item.href.startsWith('http') ? '_blank' : undefined}
                      rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </footer>
    </div>
  )
}
