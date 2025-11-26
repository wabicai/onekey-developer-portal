import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import { OneKeyWordmark } from '../../components/OneKeyLogo'
import { NavbarExtras } from '../../components/NavbarExtras'
import 'nextra-theme-docs/style.css'
import '../../styles/globals.css'

export const metadata = {
  title: {
    default: 'OneKey Developers',
    template: '%s - OneKey Developers'
  },
  description: 'Official developer documentation for OneKey hardware and software integration.',
  // favicon auto-detected from app/icon.png
}

export default async function RootLayout({ children, params }) {
  const { lang } = await params
  const pageMap = await getPageMap(`/${lang}`)

  const navbar = (
    <Navbar
      logo={<OneKeyWordmark />}
      projectLink="https://github.com/OneKeyHQ/hardware-js-sdk"
    >
      <NavbarExtras locale={lang} />
    </Navbar>
  )

  const footer = (
    <Footer>
      <div className="text-center text-sm text-zinc-500">
        MIT {new Date().getFullYear()} © <a href="https://onekey.so" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-900 dark:hover:text-white transition-colors">OneKey</a>
      </div>
    </Footer>
  )

  return (
    <html lang={lang} dir="ltr" suppressHydrationWarning>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Fira+Code:wght@400;500&display=swap" rel="stylesheet" />
      </Head>
      <body>
        <Layout
          navbar={navbar}
          pageMap={pageMap}
          docsRepositoryBase="https://github.com/OneKeyHQ/developer-docs/tree/main"
          footer={footer}
          sidebar={{
            defaultMenuCollapseLevel: 2,
            toggleButton: true
          }}
          editLink={lang === 'zh' ? '编辑此页面' : 'Edit this page'}
          feedback={{ content: null }}
          toc={{
            title: lang === 'zh' ? '本页内容' : 'On This Page',
            backToTop: lang === 'zh' ? '返回顶部' : 'Back to top'
          }}
          navigation
          darkMode={true}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
