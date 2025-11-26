import nextra from 'nextra'

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
  }
})
