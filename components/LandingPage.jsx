'use client'

import Link from 'next/link'
import {
  ArrowRight,
  Usb,
  QrCode,
  Bluetooth,
  Globe,
  Puzzle,
  BookOpen,
  Terminal,
  ExternalLink,
  ChevronRight,
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

const DiscordIcon = ({ className }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
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

// Section Header Component with optional action button
const SectionHeader = ({ title, subtitle, actionLabel, actionHref, actionExternal }) => (
  <div className="mb-10">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
      <h2 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-3">
        <div className="w-1 h-6 bg-[#00B812] rounded-full"></div>
        {title}
      </h2>
      {actionLabel && actionHref && (
        <a
          href={actionHref}
          target={actionExternal ? '_blank' : undefined}
          rel={actionExternal ? 'noopener noreferrer' : undefined}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#00B812] bg-[#00B812]/10 hover:bg-[#00B812]/20 rounded-lg transition-colors no-underline"
        >
          <Terminal className="w-4 h-4" />
          {actionLabel}
          {actionExternal && <ExternalLink className="w-3 h-3" />}
        </a>
      )}
    </div>
    {subtitle && (
      <p className="text-zinc-500 dark:text-zinc-400 mt-2 ml-4 max-w-2xl">
        {subtitle}
      </p>
    )}
  </div>
)

// Feature Card Component
const FeatureCard = ({ icon: Icon, title, description, href, tags = [], linkText = 'View Docs' }) => (
  <Link
    href={href}
    className="group flex flex-col p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:border-[#00B812]/50 dark:hover:border-[#00B812]/50 hover:shadow-lg hover:shadow-[#00B812]/5 transition-all duration-300 h-full relative overflow-hidden no-underline"
  >
    {/* Background decoration */}
    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-zinc-50 dark:from-zinc-800 to-transparent rounded-bl-3xl opacity-50 group-hover:from-[#00B812]/5 dark:group-hover:from-[#00B812]/10 transition-colors"></div>

    <div className="mb-4 inline-flex p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-zinc-600 dark:text-zinc-400 group-hover:bg-[#00B812] group-hover:text-white transition-colors duration-300 w-fit">
      <Icon className="w-6 h-6" strokeWidth={1.5} />
    </div>

    <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2 group-hover:text-[#00B812] dark:group-hover:text-[#00B812] transition-colors">
      {title}
    </h3>
    <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6 flex-grow">
      {description}
    </p>

    {/* Tags */}
    {tags.length > 0 && (
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag, idx) => (
          <span
            key={idx}
            className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-[10px] uppercase font-bold rounded"
          >
            {tag}
          </span>
        ))}
      </div>
    )}

    <div className="flex items-center text-sm font-semibold text-[#00B812]">
      {linkText}
      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
    </div>
  </Link>
)

export function LandingPage({ locale = 'en' }) {
  const isZh = locale === 'zh'

  const content = {
    en: {
      hero: {
        badge: 'Developer Portal',
        titleLine1: 'OneKey',
        titleLine2: 'Developer Portal',
        subtitle: 'Build secure, transparent Web3 experiences with OneKey hardware wallets. Full-stack open-source hardware and software integration solutions for developers.',
        primaryCta: 'Start Building',
        secondaryCta: 'Changelog',
      },
      codeSnippet: {
        filename: 'connect-device.ts',
        comment: '// Connect to OneKey hardware wallet',
      },
      hardwareSection: {
        title: 'Hardware Integration',
        subtitle: 'Connect to OneKey hardware devices through multiple protocols for ultimate security.',
        playgroundLabel: 'Playground',
        items: [
          {
            icon: Usb,
            title: 'Hardware SDK',
            desc: 'Access OneKey devices via USB bridge or direct connection. Supports account retrieval, transaction signing, and core key management.',
            href: `/${locale}/hardware-sdk/getting-started`,
            tags: ['TypeScript', 'Core'],
            linkText: 'View SDK Docs',
          },
          {
            icon: QrCode,
            title: 'Air-Gap (QR Code)',
            desc: 'QR code-based data transfer protocol for cold wallet environments. Provides completely air-gapped signing for maximum security.',
            href: `/${locale}/air-gap`,
            tags: ['UR Protocol', 'Offline'],
            linkText: 'View Protocol Spec',
          },
          {
            icon: Bluetooth,
            title: 'Native BLE',
            desc: 'Bluetooth Low Energy communication support for iOS, Android, and Flutter applications to connect with OneKey hardware devices.',
            href: `/${locale}/hardware-sdk/transport/native-ble`,
            tags: ['Mobile', 'Flutter', 'React Native'],
            linkText: 'View BLE Guide',
          },
        ],
      },
      softwareSection: {
        title: 'DApp Integration',
        subtitle: 'Seamlessly integrate OneKey ecosystem into your decentralized applications.',
        items: [
          {
            icon: Globe,
            title: 'Provider APIs',
            desc: 'EIP-1193 compliant Provider. Inject OneKey into browser environments just like MetaMask.',
            href: `/${locale}/connect-to-software/provider`,
            tags: ['EIP-1193', 'Web3'],
            linkText: 'View Provider Docs',
          },
          {
            icon: Puzzle,
            title: 'Wallet Kits',
            desc: 'Quick integration plugins for RainbowKit, Web3Modal, Web3-Onboard, and other popular wallet connection libraries.',
            href: `/${locale}/connect-to-software/wallet-kits`,
            tags: ['UI Kits', 'React'],
            linkText: 'View Integrations',
          },
          {
            icon: BookOpen,
            title: 'Developer Guides',
            desc: 'Best practices from authentication to transaction signing to production deployment. Complete debugging flow and error handling.',
            href: `/${locale}/connect-to-software/guides/developer-guide`,
            tags: ['Tutorials', 'Best Practices'],
            linkText: 'Read Guides',
          },
        ],
      },
    },
    zh: {
      hero: {
        badge: '开发者门户',
        titleLine1: 'OneKey',
        titleLine2: '开发者门户',
        subtitle: '使用 OneKey 硬件钱包构建安全、透明的 Web3 体验。为开发者提供全栈式的开源硬件与软件集成方案。',
        primaryCta: '开始构建',
        secondaryCta: '更新日志',
      },
      codeSnippet: {
        filename: 'connect-device.ts',
        comment: '// 连接 OneKey 硬件钱包',
      },
      hardwareSection: {
        title: '硬件集成 (Hardware Integration)',
        subtitle: '通过多种协议连接 OneKey 硬件设备，为用户提供极致安全保障。',
        playgroundLabel: '在线体验',
        items: [
          {
            icon: Usb,
            title: 'Hardware SDK',
            desc: '通过 USB 桥接或直连访问 OneKey 设备。支持获取账户、签名交易及核心密钥管理功能。',
            href: `/${locale}/hardware-sdk/quick-start`,
            tags: ['TypeScript', 'Core'],
            linkText: '查看 SDK 文档',
          },
          {
            icon: QrCode,
            title: 'Air-Gap (二维码)',
            desc: '基于二维码的数据传输协议，为冷钱包环境提供完全物理隔离的签名方案，极致安全。',
            href: `/${locale}/air-gap`,
            tags: ['UR Protocol', 'Offline'],
            linkText: '查看协议规范',
          },
          {
            icon: Bluetooth,
            title: '原生 BLE',
            desc: '为 iOS、Android 和 Flutter 应用提供低功耗蓝牙通信支持，连接 OneKey 硬件设备。',
            href: `/${locale}/hardware-sdk/transport/native-ble`,
            tags: ['Mobile', 'Flutter', 'React Native'],
            linkText: '查看蓝牙指南',
          },
        ],
      },
      softwareSection: {
        title: 'DApp 方案 (Software & DApp)',
        subtitle: '将 OneKey 生态无缝集成到您的去中心化应用中。',
        items: [
          {
            icon: Globe,
            title: 'Provider API',
            desc: '符合 EIP-1193 标准的 Provider。像 MetaMask 一样，将 OneKey 注入到浏览器环境中。',
            href: `/${locale}/connect-to-software/provider`,
            tags: ['EIP-1193', 'Web3'],
            linkText: '查看 Provider 文档',
          },
          {
            icon: Puzzle,
            title: 'Wallet Kits',
            desc: '支持 RainbowKit, Web3Modal, Web3-Onboard 等主流钱包连接库的快速集成插件。',
            href: `/${locale}/connect-to-software/wallet-kits`,
            tags: ['UI Kits', 'React'],
            linkText: '查看集成方案',
          },
          {
            icon: BookOpen,
            title: '开发指南',
            desc: '从认证、交易签名到生产环境的最佳实践。包含完整的调试流程与错误处理机制。',
            href: `/${locale}/connect-to-software/guides/developer-guide`,
            tags: ['Tutorials', 'Best Practices'],
            linkText: '阅读指南',
          },
        ],
      },
    },
  }

  const t = content[isZh ? 'zh' : 'en']

  // Scroll to hardware section
  const scrollToContent = () => {
    const element = document.getElementById('hardware-section')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="landing-page flex-1 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white dark:bg-zinc-900">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Dot pattern - Light mode */}
          <div
            className="absolute inset-0 dark:hidden"
            style={{
              backgroundImage: `radial-gradient(circle, rgba(0, 184, 18, 0.45) 1.2px, transparent 1.2px)`,
              backgroundSize: '22px 22px',
              maskImage: 'linear-gradient(to right, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.18) 50%, transparent 80%)',
              WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.18) 50%, transparent 80%)',
            }}
          />

          {/* Dot pattern - Dark mode */}
          <div
            className="absolute inset-0 hidden dark:block"
            style={{
              backgroundImage: `radial-gradient(circle, rgba(34, 197, 94, 0.55) 1.2px, transparent 1.2px)`,
              backgroundSize: '22px 22px',
              maskImage: 'linear-gradient(to right, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.22) 55%, transparent 80%)',
              WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.22) 55%, transparent 80%)',
            }}
          />

          {/* Subtle glow behind content */}
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-r from-[#00B812]/7 dark:from-[#00B812]/10 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto py-16 md:py-24 px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00B812]/10 text-[#00B812] text-xs font-bold uppercase tracking-wide">
                <span className="w-2 h-2 rounded-full bg-[#00B812] animate-pulse"></span>
                {t.hero.badge}
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-zinc-900 dark:text-white tracking-tight leading-[1.1]">
                {t.hero.titleLine1}
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00B812] to-emerald-500">
                  {t.hero.titleLine2}
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-xl leading-relaxed">
                {t.hero.subtitle}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <button
                  onClick={scrollToContent}
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#00B812] hover:bg-[#00a010] font-bold rounded-lg shadow-lg shadow-[#00B812]/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer border-none"
                  style={{ color: 'white' }}
                >
                  {t.hero.primaryCta}
                  <ChevronRight className="w-4 h-4" />
                </button>
                <Link
                  href="https://github.com/OneKeyHQ/hardware-js-sdk/releases"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-8 py-3.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold rounded-lg transition-all active:scale-[0.98] no-underline flex items-center justify-center"
                  style={{ textDecoration: 'none' }}
                >
                  {t.hero.secondaryCta}
                </Link>
              </div>
            </div>

            {/* Right Content - Code Snippet */}
            <div className="flex-1 w-full max-w-lg hidden lg:block">
              <div className="relative rounded-2xl bg-[#0F172A] dark:bg-zinc-950 p-4 shadow-2xl border border-zinc-800">
                {/* Terminal Header */}
                <div className="flex items-center gap-2 mb-4 border-b border-zinc-700 pb-4">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                  </div>
                  <div className="text-xs text-zinc-400 font-mono ml-4">
                    {t.codeSnippet.filename}
                  </div>
                </div>

                {/* Code Content */}
                <div className="font-mono text-sm leading-relaxed text-zinc-300 overflow-x-auto">
                  <div>
                    <span className="text-purple-400">import</span>{' '}
                    <span className="text-zinc-300">{'{'}</span>{' '}
                    <span className="text-yellow-300">HardwareSDK</span>{' '}
                    <span className="text-zinc-300">{'}'}</span>{' '}
                    <span className="text-purple-400">from</span>{' '}
                    <span className="text-green-400">'@onekeyfe/hd-core'</span>
                  </div>
                  <br />
                  <div className="text-zinc-500">{t.codeSnippet.comment}</div>
                  <div>
                    <span className="text-blue-400">const</span>{' '}
                    <span className="text-yellow-300">sdk</span>{' '}
                    <span className="text-zinc-300">=</span>{' '}
                    <span className="text-purple-400">await</span>{' '}
                    <span className="text-zinc-300">HardwareSDK.</span>
                    <span className="text-blue-400">init</span>
                    <span className="text-zinc-300">()</span>
                  </div>
                  <br />
                  <div>
                    <span className="text-blue-400">const</span>{' '}
                    <span className="text-yellow-300">result</span>{' '}
                    <span className="text-zinc-300">=</span>{' '}
                    <span className="text-purple-400">await</span>{' '}
                    <span className="text-zinc-300">sdk.</span>
                    <span className="text-blue-400">evmGetAddress</span>
                    <span className="text-zinc-300">(</span>
                    <span className="text-yellow-300">connectId</span>
                    <span className="text-zinc-300">,</span>{' '}
                    <span className="text-yellow-300">deviceId</span>
                    <span className="text-zinc-300">,</span>{' '}
                    <span className="text-zinc-300">{'{'}</span>
                  </div>
                  <div className="pl-4">
                    <span className="text-sky-300">path</span>
                    <span className="text-zinc-300">:</span>{' '}
                    <span className="text-green-400">"m/44'/60'/0'/0/0"</span>
                    <span className="text-zinc-300">,</span>
                  </div>
                  <div className="pl-4">
                    <span className="text-sky-300">showOnOneKey</span>
                    <span className="text-zinc-300">:</span>{' '}
                    <span className="text-orange-400">true</span>
                  </div>
                  <div>
                    <span className="text-zinc-300">{'}'})</span>
                  </div>
                  <br />
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">{'>'}</span>
                    <span className="animate-pulse">_</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hardware Integration Section */}
      <section id="hardware-section" className="bg-white dark:bg-zinc-900 pt-16 pb-8">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader
            title={t.hardwareSection.title}
            subtitle={t.hardwareSection.subtitle}
            actionLabel={t.hardwareSection.playgroundLabel}
            actionHref="https://hardware-example.onekey.so/"
            actionExternal={true}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {t.hardwareSection.items.map((item, i) => (
              <FeatureCard
                key={i}
                icon={item.icon}
                title={item.title}
                description={item.desc}
                href={item.href}
                tags={item.tags}
                linkText={item.linkText}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Software Integration Section */}
      <section className="flex-1 bg-white dark:bg-zinc-900 pt-8 pb-24">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader
            title={t.softwareSection.title}
            subtitle={t.softwareSection.subtitle}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {t.softwareSection.items.map((item, i) => (
              <FeatureCard
                key={i}
                icon={item.icon}
                title={item.title}
                description={item.desc}
                href={item.href}
                tags={item.tags}
                linkText={item.linkText}
              />
            ))}
          </div>
        </div>
      </section>

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
                    href="https://discord.gg/onekey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-400 hover:text-white transition-colors"
                  >
                    <DiscordIcon className="w-6 h-6" />
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
                    <a href="https://discord.gg/onekey" target="_blank" rel="noopener noreferrer" className="text-zinc-300 hover:text-white text-sm transition-colors">
                      Discord
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
                    href="https://discord.gg/onekey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-400 hover:text-white transition-colors"
                  >
                    <DiscordIcon className="w-5 h-5" />
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
