'use client'

import Link from 'next/link'
import {
  ArrowUpRight,
  Cpu,
  Code2,
  QrCode,
  Terminal,
  Bug,
} from 'lucide-react'

// OneKey Logo SVG Component
const OneKeyLogo = () => (
  <svg width="180" height="44" viewBox="0 0 233 57" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_footer)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M27.2938 56.0387C46.1362 56.0387 54.5875 47.5873 54.5875 28.7449C54.5875 9.90254 46.1362 1.45117 27.2938 1.45117C8.45136 1.45117 0 9.90254 0 28.7449C0 47.5873 8.45136 56.0387 27.2938 56.0387ZM22.1694 13.0242H29.7624V25.5366H25.0547V17.0521H20.8373L22.1694 13.0242ZM27.2962 44.4646C32.0787 44.4646 35.9556 40.5876 35.9556 35.8052C35.9556 31.0227 32.0787 27.1458 27.2962 27.1458C22.5137 27.1458 18.6367 31.0227 18.6367 35.8052C18.6367 40.5876 22.5137 44.4646 27.2962 44.4646ZM27.2961 40.5334C29.9075 40.5334 32.0243 38.4165 32.0243 35.8052C32.0243 33.1939 29.9075 31.077 27.2961 31.077C24.6849 31.077 22.568 33.1939 22.568 35.8052C22.568 38.4165 24.6849 40.5334 27.2961 40.5334Z"
        fill="white"
      />
    </g>
    <path
      d="M76.1511 41.4545C82.8071 41.4545 87.7031 36.4625 87.7031 29.6145C87.7031 22.7665 82.8071 17.7745 76.1511 17.7745C69.4951 17.7745 64.5991 22.7665 64.5991 29.6145C64.5991 36.4625 69.4951 41.4545 76.1511 41.4545ZM68.8231 29.6145C68.8231 24.8785 71.9271 21.4545 76.1511 21.4545C80.4071 21.4545 83.4791 24.8785 83.4791 29.6145C83.4791 34.2865 80.4071 37.7425 76.1511 37.7425C71.9271 37.7425 68.8231 34.2865 68.8231 29.6145ZM90.8216 40.8145H94.7896V32.2065C94.7896 29.2305 96.0696 27.5345 98.3416 27.5345C100.454 27.5345 101.638 29.0065 101.638 31.5025V40.8145H105.606V30.8945C105.606 26.9265 103.27 24.3345 99.7816 24.3345C97.1896 24.3345 95.3976 25.7745 94.6936 28.1425L94.7896 24.7185H90.8216V40.8145ZM116.534 41.3905C120.438 41.3905 123.382 39.0545 124.022 36.0785L120.63 35.5665C120.086 37.1985 118.486 38.2865 116.566 38.2865C114.134 38.2865 112.374 36.4625 112.246 33.9665H124.31C125.014 28.9425 122.038 24.1425 116.47 24.1425C111.702 24.1425 108.246 27.7585 108.246 32.7505C108.246 37.7745 111.702 41.3905 116.534 41.3905ZM112.278 30.9905C112.566 28.6865 114.262 27.1185 116.47 27.1185C118.838 27.1185 120.47 28.8465 120.47 30.9905H112.278ZM127.358 40.8145H131.422V34.0945L134.974 30.2865L141.95 40.8145H146.686L137.63 27.4705L146.046 18.4145H140.958L131.422 28.8465V18.4145H127.358V40.8145ZM155.503 41.3905C159.407 41.3905 162.351 39.0545 162.991 36.0785L159.599 35.5665C159.055 37.1985 157.455 38.2865 155.535 38.2865C153.103 38.2865 151.343 36.4625 151.215 33.9665H163.279C163.983 28.9425 161.007 24.1425 155.439 24.1425C150.671 24.1425 147.215 27.7585 147.215 32.7505C147.215 37.7745 150.671 41.3905 155.503 41.3905ZM151.247 30.9905C151.535 28.6865 153.231 27.1185 155.439 27.1185C157.807 27.1185 159.439 28.8465 159.439 30.9905H151.247ZM167.792 46.8945H171.888L181.392 24.7185H177.296L172.72 35.8225L168.144 24.7185H163.952L170.64 40.3665L167.792 46.8945Z"
      fill="white"
    />
    <defs>
      <clipPath id="clip0_footer">
        <rect width="54.5875" height="54.5875" fill="white" transform="translate(0 1.45117)" />
      </clipPath>
    </defs>
  </svg>
)

// Social Icons
const TwitterIcon = ({ className }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

const GitHubIcon = ({ className }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
)

// Open Source Badge Icon
const OpenSourceIcon = () => (
  <a href="https://github.com/OneKeyHQ" target="_blank" rel="noopener noreferrer" className="opacity-50 hover:opacity-80 transition-opacity">
    <svg width="96" height="33" viewBox="0 0 96 33" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M44.6893 15.124C47.5783 15.124 49.678 12.9572 49.678 10.312V10.2854C49.678 7.64014 47.605 5.5 44.7161 5.5C41.8272 5.5 39.7274 7.6667 39.7274 10.312V10.3386C39.7274 12.9839 41.8004 15.124 44.6893 15.124ZM44.7161 13.2364C43.0576 13.2364 41.8807 11.9072 41.8807 10.312V10.2854C41.8807 8.6903 43.0309 7.38761 44.6893 7.38761C46.3478 7.38761 47.5247 8.71685 47.5247 10.312V10.3386C47.5247 11.9337 46.3745 13.2364 44.7161 13.2364ZM51.2376 14.9645H53.2973V12.173H54.8621C56.962 12.173 58.6471 11.0564 58.6471 8.903V8.87636C58.6471 6.97547 57.2963 5.65951 55.0627 5.65951H51.2376V14.9645ZM53.2973 10.3518V7.50719H54.8889C55.9187 7.50719 56.5607 7.99908 56.5607 8.91628V8.94283C56.5607 9.74036 55.9589 10.3518 54.929 10.3518H53.2973ZM59.9039 14.9645H67.0325V13.1434H61.9501V11.1893H66.3638V9.36824H61.9501V7.48064H66.9656V5.65951H59.9039V14.9645ZM68.5962 14.9645H70.6293V9.04914L75.1633 14.9645H76.9154V5.65951H74.8824V11.3887L70.4954 5.65951H68.5962V14.9645ZM43.4722 27.4734C45.4918 27.4734 46.9095 26.4366 46.9095 24.5889V24.5623C46.9095 22.9405 45.8395 22.2627 43.9404 21.7708C42.3221 21.3588 41.9208 21.1593 41.9208 20.5479V20.5213C41.9208 20.0693 42.3354 19.7104 43.1245 19.7104C43.9136 19.7104 44.7295 20.0561 45.5586 20.6276L46.6286 19.0857C45.679 18.328 44.5155 17.9026 43.1512 17.9026C41.2386 17.9026 39.8745 19.0192 39.8745 20.7074V20.734C39.8745 22.5817 41.0916 23.1001 42.9774 23.5786C44.5422 23.9774 44.8631 24.2432 44.8631 24.7617V24.7883C44.8631 25.3333 44.355 25.6656 43.5124 25.6656C42.4424 25.6656 41.5597 25.2269 40.7171 24.5357L39.5 25.9846C40.6235 26.9816 42.0545 27.4734 43.4722 27.4734ZM52.9768 27.5C55.8657 27.5 57.9654 25.3333 57.9654 22.688V22.6614C57.9654 20.0161 55.8925 17.876 53.0035 17.876C50.1146 17.876 48.0148 20.0428 48.0148 22.688V22.7146C48.0148 25.3599 50.0878 27.5 52.9768 27.5ZM53.0035 25.6124C51.3451 25.6124 50.1681 24.2831 50.1681 22.688V22.6614C50.1681 21.0663 51.3183 19.7636 52.9768 19.7636C54.6352 19.7636 55.8122 21.0928 55.8122 22.688V22.7146C55.8122 24.3097 54.662 25.6124 53.0035 25.6124ZM63.4305 27.4867C65.9448 27.4867 67.5364 26.1043 67.5364 23.2862V18.0356H65.4767V23.3659C65.4767 24.8414 64.7144 25.5991 63.4572 25.5991C62.2 25.5991 61.4377 24.8149 61.4377 23.2995V18.0356H59.378V23.3527C59.378 26.091 60.916 27.4867 63.4305 27.4867ZM69.3669 27.3405H71.4266V24.3629H73.0449L75.0511 27.3405H77.4585L75.1714 24.0173C76.3618 23.5786 77.1776 22.6348 77.1776 21.1328V21.1062C77.1776 20.2288 76.8968 19.4978 76.3752 18.9794C75.7599 18.3679 74.8371 18.0356 73.6468 18.0356H69.3669V27.3405ZM71.4266 22.555V19.8833H73.4728C74.4759 19.8833 75.0912 20.3351 75.0912 21.2125V21.2391C75.0912 22.0234 74.5161 22.555 73.513 22.555H71.4266ZM83.1515 27.5C84.957 27.5 86.0273 26.862 86.99 25.8384L85.6792 24.5224C84.9436 25.1871 84.2882 25.6124 83.2184 25.6124C81.6134 25.6124 80.5033 24.2831 80.5033 22.688V22.6614C80.5033 21.0663 81.6401 19.7636 83.2184 19.7636C84.1546 19.7636 84.8901 20.1624 85.6124 20.8138L86.9232 19.3116C86.054 18.4609 84.9972 17.876 83.2317 17.876C80.3561 17.876 78.3499 20.0428 78.3499 22.688V22.7146C78.3499 25.3864 80.3963 27.5 83.1515 27.5ZM88.3716 27.3405H95.5V25.5194H90.4173V23.5654H94.8312V21.7442H90.4173V19.8566H95.4332V18.0356H88.3716V27.3405Z"
        fill="white"
        fillOpacity="0.48"
      />
      <path
        d="M19.1321 22.6003C21.5127 21.7161 22.7555 20.0133 22.7555 17.0827C22.7555 14.1521 20.2859 11.5697 17.2002 11.5646C13.944 11.5593 11.4877 14.1413 11.5269 17.0827C11.5662 20.0239 12.9688 21.9807 15.214 22.6883L11.2369 32.4726C5.91385 31.0945 0.5 24.8149 0.5 17.0827C0.5 7.92432 7.85885 0.5 17.0822 0.5C26.3055 0.5 33.7825 7.92432 33.7825 17.0827C33.7825 24.9352 28.4199 31.1273 22.9833 32.5L19.1321 22.6003Z"
        stroke="white"
        strokeOpacity="0.48"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </a>
)

const IntegrationCard = ({ title, description, href }) => (
  <Link
    href={href}
    className="group flex flex-col gap-2 rounded-2xl border border-zinc-200/80 bg-zinc-50/70 p-4 md:p-5 min-h-[128px] no-underline transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_32px_-24px_rgba(15,23,42,0.25)] hover:border-zinc-300 dark:border-zinc-800/80 dark:bg-[#0B0B0B]/70 dark:hover:border-zinc-700"
  >
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
          {title}
        </p>
        {description ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
            {description}
          </p>
        ) : null}
      </div>
      <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors mt-1" />
    </div>
  </Link>
)

export function LandingPage({ locale = 'en' }) {
  const isZh = locale === 'zh'
  const content = {
    en: {
      hero: {
        titleLine1: 'OneKey',
        titleLine2: 'Developer Portal',
        subtitle: 'Build secure Web3 experiences with OneKey hardware.',
        primaryCta: 'Start Building',
        secondaryCta: 'Contact Us',
      },
      codeSnippet: {
        filename: 'init-sdk.ts',
        comment: '// Initialize OneKey Hardware SDK',
      },
      sdkSection: {
        title: 'Choose your integration path',
        subtitle: '',
        hardware: {
          title: 'Hardware Integration',
          desc: 'Direct USB & BLE connections',
          items: [
            {
              title: 'WebUSB Connection',
              description: 'Browser USB transport for desktop dApps.',
              href: `/${locale}/hardware-sdk/transport/web-usb`,
            },
            {
              title: 'React Native BLE',
              description: 'BLE transport for React Native.',
              href: `/${locale}/hardware-sdk/transport/react-native-ble`,
            },
            {
              title: 'Native Mobile BLE',
              description: 'BLE transport for native apps.',
              href: `/${locale}/hardware-sdk/transport/native-ble`,
            },
          ],
        },
        dapp: {
          title: 'DAPP Development',
          desc: 'Providers & UI kits for wallet connectivity',
          providersLabel: 'Providers',
          providers: [
            {
              title: 'Provider API (EIP-1193)',
              description: 'Standardized provider interface for dApps.',
              href: `/${locale}/connect-to-software/provider`,
            },
          ],
          uiLabel: 'UI Kits',
          uiKits: [
            {
              title: 'Web3Modal',
              description: 'Drop-in wallet UI with mobile support.',
              href: `/${locale}/connect-to-software/wallet-ui/web3modal`,
            },
          ],
        },
        airgap: {
          title: 'Air-Gap Solutions',
          desc: 'QR-based offline signing',
          summary: 'Use QR codes to sign transactions offline with OneKey hardware.',
          ctaLabel: 'Explore Air-Gap Flow',
          ctaHref: `/${locale}/air-gap`,
        },
      },
      supportSection: {
        title: 'Need integration support?',
        subtitle: 'Get help with architecture reviews, transport selection, and production rollouts.',
        primaryCta: 'Submit a Request',
        primaryHref: 'https://help.onekey.so/hc/requests/new',
        secondaryCta: 'GitHub Issues',
        secondaryHref: 'https://github.com/OneKeyHQ/hardware-js-sdk/issues',
      },
    },
    zh: {
      hero: {
        titleLine1: 'OneKey',
        titleLine2: '开发者门户',
        subtitle: '用 OneKey 硬件构建安全的 Web3 体验。',
        primaryCta: '开始构建',
        secondaryCta: '联系我们',
      },
      codeSnippet: {
        filename: 'init-sdk.ts',
        comment: '// 初始化 OneKey 硬件 SDK',
      },
      sdkSection: {
        title: '选择你的集成路径',
        subtitle: '',
        hardware: {
          title: '硬件集成',
          desc: '直连 USB 与 BLE 传输',
          items: [
            {
              title: 'WebUSB 连接',
              description: '桌面浏览器 USB 传输。',
              href: `/${locale}/hardware-sdk/transport/web-usb`,
            },
            {
              title: 'React Native BLE',
              description: 'React Native 的 BLE 传输。',
              href: `/${locale}/hardware-sdk/transport/react-native-ble`,
            },
            {
              title: '原生移动端 BLE',
              description: '原生应用的 BLE 传输。',
              href: `/${locale}/hardware-sdk/transport/native-ble`,
            },
          ],
        },
        dapp: {
          title: 'DAPP 开发',
          desc: 'Provider 接入与 UI 组件库',
          providersLabel: 'Providers',
          providers: [
            {
              title: 'Provider API（EIP-1193）',
              description: '标准化的 dApp Provider 接口。',
              href: `/${locale}/connect-to-software/provider`,
            },
          ],
          uiLabel: 'UI Kits',
          uiKits: [
            {
              title: 'Web3Modal',
              description: '内置移动端支持的快速接入组件。',
              href: `/${locale}/connect-to-software/wallet-ui/web3modal`,
            },
          ],
        },
        airgap: {
          title: 'Air-Gap 方案',
          desc: '二维码离线签名',
          summary: '通过二维码完成离线签名与传输，提升安全性。',
          ctaLabel: '了解 Air-Gap 流程',
          ctaHref: `/${locale}/air-gap`,
        },
      },
      supportSection: {
        title: '需要集成支持？',
        subtitle: '我们可协助评估架构、选择传输方案并完成生产环境落地。',
        primaryCta: '提交工单',
        primaryHref: 'https://help.onekey.so/hc/requests/new',
        secondaryCta: '提交 Issue',
        secondaryHref: 'https://github.com/OneKeyHQ/hardware-js-sdk/issues',
      },
    },
  }

  const t = content[isZh ? 'zh' : 'en']

  // Scroll to SDK section
  const scrollToContent = () => {
    const element = document.getElementById('sdk-section')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="landing-page flex-1 flex flex-col bg-transparent text-zinc-900 dark:text-white">
      <div className="relative">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-transparent">

          <div className="relative z-10 max-w-6xl mx-auto py-16 md:py-24 px-6">
            <div className="flex flex-col items-center">
              {/* Centered Content */}
              <div className="w-full max-w-3xl text-center space-y-6">
                {/* Title */}
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-zinc-900 dark:text-white tracking-tight leading-[1.05]">
                  <span className="text-zinc-900 dark:text-slate-100">
                    {t.hero.titleLine1}
                  </span>{' '}
                  <span className="landing-title-dynamic text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-blue-700 to-blue-500 dark:from-blue-300 dark:via-indigo-200 dark:to-slate-100">
                    {t.hero.titleLine2}
                  </span>
                </h1>

                {/* Subtitle */}
                <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed">
                  {t.hero.subtitle}
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    onClick={scrollToContent}
                    className="w-full sm:w-auto px-10 py-3.5 font-semibold rounded-full transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer border border-zinc-900/10 bg-[linear-gradient(140deg,#0f172a,#111827)] text-white shadow-[0_20px_50px_-34px_rgba(15,23,42,0.25)] hover:-translate-y-0.5 hover:shadow-[0_26px_60px_-32px_rgba(15,23,42,0.35)] hover:bg-[linear-gradient(140deg,#111827,#1f2937)] dark:border-white/10 dark:shadow-[0_20px_50px_-30px_rgba(15,23,42,0.75)]"
                  >
                    {t.hero.primaryCta}
                  </button>
                  <Link
                    href="https://help.onekey.so/en/articles/11536900-contact-us"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-10 py-3.5 border border-zinc-300 bg-white text-zinc-700 font-semibold rounded-full transition-all duration-300 active:scale-[0.98] no-underline flex items-center justify-center hover:border-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 hover:-translate-y-0.5 dark:border-white/25 dark:bg-white/6 dark:text-white/70 dark:hover:bg-white/12"
                    style={{ textDecoration: 'none' }}
                  >
                    {t.hero.secondaryCta}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SDK Selection Section */}
        <section id="sdk-section" className="relative bg-transparent pt-12 pb-14">
          <div className="max-w-6xl mx-auto px-6">
            <div className="max-w-3xl text-left mb-4 md:mb-5 relative z-10">
              <h2 className="text-2xl md:text-3xl font-semibold text-zinc-900 dark:text-white">
                {t.sdkSection.title}
              </h2>
              {t.sdkSection.subtitle ? (
                <p className="text-zinc-600 dark:text-zinc-400 mt-3 text-base md:text-lg leading-relaxed">
                  {t.sdkSection.subtitle}
                </p>
              ) : null}
            </div>
            <div className="relative z-10 divide-y divide-zinc-200/80 dark:divide-zinc-800/80">
              <div className="py-2.5 md:py-3">
                <div className="flex items-center gap-4">
                  <div className="h-11 w-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm">
                    <Cpu className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white">
                      {t.sdkSection.hardware.title}
                    </h3>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-1">
                      {t.sdkSection.hardware.desc}
                    </p>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                  {t.sdkSection.hardware.items.map((item) => (
                    <IntegrationCard
                      key={item.title}
                      title={item.title}
                      description={item.description}
                      href={item.href}
                    />
                  ))}
                </div>
              </div>

              <div className="py-2.5 md:py-3">
                <div className="flex items-center gap-4">
                  <div className="h-11 w-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm">
                    <Code2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white">
                      {t.sdkSection.dapp.title}
                    </h3>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-1">
                      {t.sdkSection.dapp.desc}
                    </p>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                  {t.sdkSection.dapp.providers.map((item) => (
                    <IntegrationCard
                      key={item.title}
                      title={item.title}
                      description={item.description}
                      href={item.href}
                    />
                  ))}
                  {t.sdkSection.dapp.uiKits.map((item) => (
                    <IntegrationCard
                      key={item.title}
                      title={item.title}
                      description={item.description}
                      href={item.href}
                    />
                  ))}
                </div>
              </div>

              <div className="py-2.5 md:py-3">
                <div className="flex items-center gap-4">
                  <div className="h-11 w-11 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center shadow-sm">
                    <QrCode className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white">
                      {t.sdkSection.airgap.title}
                    </h3>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-1">
                      {t.sdkSection.airgap.desc}
                    </p>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="md:col-span-2">
                    <IntegrationCard
                      title={t.sdkSection.airgap.ctaLabel}
                      description={t.sdkSection.airgap.summary}
                      href={t.sdkSection.airgap.ctaHref}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Support Section */}
        <section className="bg-transparent pb-24">
          <div className="max-w-6xl mx-auto px-6">
            <div className="rounded-3xl border border-zinc-200/80 bg-white p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 backdrop-blur-md dark:border-zinc-800/80 dark:bg-[#0F0F0F]/85">
              <div className="flex items-start gap-4">
                <div className="hidden md:flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10 text-blue-500 shrink-0">
                  <Terminal className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                    {t.supportSection.title}
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400 max-w-md">
                    {t.supportSection.subtitle}
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <a
                  href={t.supportSection.primaryHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 md:flex-none px-6 py-3 rounded-full border border-transparent bg-zinc-900 text-white font-semibold shadow-[0_16px_40px_-28px_rgba(15,23,42,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_22px_50px_-30px_rgba(15,23,42,0.45)] hover:bg-zinc-800 whitespace-nowrap text-center dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                  style={{ color: '#ffffff' }}
                >
                  {t.supportSection.primaryCta}
                </a>
                <a
                  href={t.supportSection.secondaryHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 md:flex-none px-6 py-3 rounded-full border border-zinc-300 text-zinc-700 hover:bg-zinc-100 transition-colors whitespace-nowrap text-center dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
                >
                  {t.supportSection.secondaryCta}
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer - Portal Style */}
      <footer className="bg-zinc-900 rounded-t-[32px] md:rounded-t-[64px] pt-10 md:pt-20 pb-16 md:pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-12 md:gap-8">
            {/* Left Column - Logo & Social */}
            <div className="flex flex-col gap-6 md:w-[280px] shrink-0">
              {/* Logo */}
              <div className="py-2">
                <OneKeyLogo />
                <p className="text-xs text-zinc-500 mt-3">
                  {isZh ? '隶属于 ' : 'A member of '}
                  <span className="text-zinc-300">SatoKey Group</span>
                </p>
              </div>

              {/* Social Links - Desktop */}
              <div className="hidden md:flex flex-col gap-6">
                <div className="flex items-center gap-6">
                  <a
                    href="https://twitter.com/onekeyHQ"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-400 hover:text-white transition-colors"
                  >
                    <TwitterIcon className="w-6 h-6" />
                  </a>
                  <a
                    href="https://github.com/OneKeyHQ"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-400 hover:text-white transition-colors"
                  >
                    <GitHubIcon className="w-6 h-6" />
                  </a>
                  <a
                    href="https://github.com/OneKeyHQ/hardware-js-sdk/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-400 hover:text-white transition-colors"
                  >
                    <Bug className="w-6 h-6" />
                  </a>
                </div>

                {/* Open Source Badge */}
                <OpenSourceIcon />

                {/* Copyright */}
                <p className="text-sm text-zinc-500">
                  {isZh
                    ? `Since 2019 to Now ｜ OneKey Limited 保留所有权利`
                    : `Since 2019 to Now ｜ OneKey Limited All Rights Reserved`}
                </p>
              </div>
            </div>

            {/* Right Column - Menu Links */}
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-6">
              {/* Products */}
              <div className="flex flex-col gap-4 md:gap-6">
                <h3 className="text-sm font-semibold text-zinc-400 opacity-60">
                  {isZh ? '产品' : 'Products'}
                </h3>
                <ul className="flex flex-col gap-3 md:gap-4">
                  <li>
                    <a href="https://onekey.so/products/onekey-pro" target="_blank" rel="noopener noreferrer" className="text-zinc-300 hover:text-white text-sm transition-colors">
                      OneKey Pro
                    </a>
                  </li>
                  <li>
                    <a href="https://onekey.so/products/onekey-classic-1s" target="_blank" rel="noopener noreferrer" className="text-zinc-300 hover:text-white text-sm transition-colors">
                      OneKey Classic 1S
                    </a>
                  </li>
                  <li>
                    <a href="https://onekey.so/download" target="_blank" rel="noopener noreferrer" className="text-zinc-300 hover:text-white text-sm transition-colors">
                      {isZh ? '下载 App' : 'Download App'}
                    </a>
                  </li>
                  <li>
                    <a href="https://onekey.so/products" target="_blank" rel="noopener noreferrer" className="text-zinc-300 hover:text-white text-sm transition-colors">
                      {isZh ? '对比所有型号' : 'Compare All Models'}
                    </a>
                  </li>
                </ul>
              </div>

              {/* Developer */}
              <div className="flex flex-col gap-4 md:gap-6">
                <h3 className="text-sm font-semibold text-zinc-400 opacity-60">
                  {isZh ? '开发者' : 'Developer'}
                </h3>
                <ul className="flex flex-col gap-3 md:gap-4">
                  <li>
                    <Link href={`/${locale}/hardware-sdk/getting-started`} className="text-zinc-300 hover:text-white text-sm transition-colors">
                      {isZh ? '快速开始' : 'Getting Started'}
                    </Link>
                  </li>
                  <li>
                    <Link href={`/${locale}/hardware-sdk/api-reference`} className="text-zinc-300 hover:text-white text-sm transition-colors">
                      API Reference
                    </Link>
                  </li>
                  <li>
                    <a href="https://hardware-example.onekey.so/" target="_blank" rel="noopener noreferrer" className="text-zinc-300 hover:text-white text-sm transition-colors">
                      Playground
                    </a>
                  </li>
                  <li>
                    <a href="https://github.com/OneKeyHQ" target="_blank" rel="noopener noreferrer" className="text-zinc-300 hover:text-white text-sm transition-colors">
                      {isZh ? '开源社区' : 'Open Source'}
                    </a>
                  </li>
                </ul>
              </div>

              {/* Support */}
              <div className="flex flex-col gap-4 md:gap-6">
                <h3 className="text-sm font-semibold text-zinc-400 opacity-60">
                  {isZh ? '支持' : 'Support'}
                </h3>
                <ul className="flex flex-col gap-3 md:gap-4">
                  <li>
                    <a href="https://help.onekey.so" target="_blank" rel="noopener noreferrer" className="text-zinc-300 hover:text-white text-sm transition-colors">
                      {isZh ? '帮助中心' : 'Help Center'}
                    </a>
                  </li>
                  <li>
                    <a href="https://help.onekey.so/hc/requests/new" target="_blank" rel="noopener noreferrer" className="text-zinc-300 hover:text-white text-sm transition-colors">
                      {isZh ? '提交工单' : 'Submit a Request'}
                    </a>
                  </li>
                  <li>
                    <a href="https://github.com/OneKeyHQ/hardware-js-sdk/issues" target="_blank" rel="noopener noreferrer" className="text-zinc-300 hover:text-white text-sm transition-colors">
                      {isZh ? 'Issue 列表' : 'GitHub Issues'}
                    </a>
                  </li>
                  <li>
                    <a href="https://status.onekey.so" target="_blank" rel="noopener noreferrer" className="text-zinc-300 hover:text-white text-sm transition-colors">
                      {isZh ? '系统状态' : 'System Status'}
                    </a>
                  </li>
                </ul>
              </div>

              {/* Company */}
              <div className="flex flex-col gap-4 md:gap-6">
                <h3 className="text-sm font-semibold text-zinc-400 opacity-60">
                  {isZh ? '公司' : 'Company'}
                </h3>
                <ul className="flex flex-col gap-3 md:gap-4">
                  <li>
                    <a href="https://onekey.so/about" target="_blank" rel="noopener noreferrer" className="text-zinc-300 hover:text-white text-sm transition-colors">
                      {isZh ? '关于我们' : 'About'}
                    </a>
                  </li>
                  <li>
                    <a href="https://onekey.so/blog" target="_blank" rel="noopener noreferrer" className="text-zinc-300 hover:text-white text-sm transition-colors">
                      {isZh ? '博客' : 'Blog'}
                    </a>
                  </li>
                  <li>
                    <a href="https://onekey.so/careers" target="_blank" rel="noopener noreferrer" className="text-zinc-300 hover:text-white text-sm transition-colors">
                      {isZh ? '加入我们' : 'Careers'}
                    </a>
                  </li>
                  <li>
                    <a href="https://onekey.so/media-kit" target="_blank" rel="noopener noreferrer" className="text-zinc-300 hover:text-white text-sm transition-colors">
                      {isZh ? '媒体资源' : 'Media Kits'}
                    </a>
                  </li>
                </ul>
              </div>

              {/* Legal */}
              <div className="flex flex-col gap-4 md:gap-6">
                <h3 className="text-sm font-semibold text-zinc-400 opacity-60">
                  {isZh ? '法律' : 'Legal'}
                </h3>
                <ul className="flex flex-col gap-3 md:gap-4">
                  <li>
                    <a href="https://onekey.so/privacy" target="_blank" rel="noopener noreferrer" className="text-zinc-300 hover:text-white text-sm transition-colors">
                      {isZh ? '隐私政策' : 'Privacy Policy'}
                    </a>
                  </li>
                  <li>
                    <a href="https://onekey.so/terms" target="_blank" rel="noopener noreferrer" className="text-zinc-300 hover:text-white text-sm transition-colors">
                      {isZh ? '用户协议' : 'User Agreement'}
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Social Links & Copyright - Mobile */}
            <div className="flex md:hidden flex-col gap-4 pt-4 border-t border-zinc-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <a
                    href="https://twitter.com/onekeyHQ"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-400 hover:text-white transition-colors"
                  >
                    <TwitterIcon className="w-5 h-5" />
                  </a>
                  <a
                    href="https://github.com/OneKeyHQ"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-400 hover:text-white transition-colors"
                  >
                    <GitHubIcon className="w-5 h-5" />
                  </a>
                  <a
                    href="https://github.com/OneKeyHQ/hardware-js-sdk/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-400 hover:text-white transition-colors"
                  >
                    <Bug className="w-5 h-5" />
                  </a>
                </div>
                <OpenSourceIcon />
              </div>
              <p className="text-xs text-zinc-500">
                {isZh
                  ? `Since 2019 to Now ｜ OneKey Limited 保留所有权利`
                  : `Since 2019 to Now ｜ OneKey Limited All Rights Reserved`}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
