import nextra from 'nextra'

const normalizeBasePath = (value) => value.replace(/^\/|\/$/g, '')

const rawBasePath = process.env.NEXT_PUBLIC_BASE_PATH?.trim()
const normalizedBasePath = rawBasePath
  ? `/${normalizeBasePath(rawBasePath)}`
  : ''

const rawAssetPrefix = process.env.NEXT_PUBLIC_ASSET_PREFIX?.trim()
const normalizedAssetPrefix =
  rawAssetPrefix ??
  (normalizedBasePath ? normalizedBasePath : '')

const withNextra = nextra({
  contentDirBasePath: '/',
  // Syntax highlighting configuration
  mdxOptions: {
    rehypePrettyCodeOptions: {
      theme: {
        dark: 'github-dark',
        light: 'github-light'
      }
    }
  }
})

export default withNextra({
  i18n: {
    locales: ['en', 'zh'],
    defaultLocale: 'en'
  },
  basePath: normalizedBasePath || undefined,
  assetPrefix: normalizedAssetPrefix || undefined,
  trailingSlash: true,
  output: 'export',
  images: {
    unoptimized: true
  }
})
