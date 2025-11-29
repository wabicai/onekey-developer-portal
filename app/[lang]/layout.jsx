import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { getPageMap } from 'nextra/page-map'
import { OneKeyWordmark } from '../../components/OneKeyLogo'

// Static params for i18n routing (Next.js App Router pattern)
// See: https://nextjs.org/docs/app/guides/internationalization#static-rendering
export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'zh' }]
}

export default async function LocaleLayout({ children, params }) {
  const { lang } = await params
  const pageMap = await getPageMap(`/${lang}`)

  const navbar = (
    <Navbar
      logo={<OneKeyWordmark />}
      projectLink="https://github.com/OneKeyHQ/hardware-js-sdk"
    />
  )

  const footer = (
    <Footer>
      <div className="text-center text-sm text-zinc-500">
        MIT 2025 © <a href="https://onekey.so" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-900 dark:hover:text-white transition-colors">OneKey</a>
      </div>
    </Footer>
  )

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.lang="${lang}";`
        }}
      />
      <Layout
        navbar={navbar}
        pageMap={pageMap}
        docsRepositoryBase="https://github.com/OneKeyHQ/developer-docs/tree/main"
        footer={footer}
        i18n={[
          { locale: 'en', name: 'English' },
          { locale: 'zh', name: '简体中文' }
        ]}
        sidebar={{
          defaultMenuCollapseLevel: 1,
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
    </>
  )
}
