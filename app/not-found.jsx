const basePath = process.env.NEXT_PUBLIC_BASE_PATH
  ? process.env.NEXT_PUBLIC_BASE_PATH.replace(/\/$/, '')
  : ''
const supportedLocales = ['en', 'zh']
const defaultLocale = 'en'

const redirectScript = `
(function() {
  try {
    var basePath = '${basePath}'
    var supported = ${JSON.stringify(supportedLocales)}
    var defaultLocale = '${defaultLocale}'
    var path = window.location.pathname || '/'

    if (basePath && path.startsWith(basePath)) {
      path = path.slice(basePath.length) || '/'
    }

    if (!path.startsWith('/')) {
      path = '/' + path
    }

    var segments = path.split('/').filter(Boolean)
    var locale = segments[0]

    if (!locale || supported.indexOf(locale) === -1) {
      var targetPath = (basePath ? basePath : '') + '/' + defaultLocale + path
      targetPath = targetPath.replace(/\\/\\/+/g, '/')
      window.location.replace(targetPath)
    }
  } catch (error) {
    console.error('Redirect on 404 failed', error)
  }
})();
`

export default function NotFound() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <title>Page not found | OneKey Developers</title>
        <script
          dangerouslySetInnerHTML={{ __html: redirectScript }}
        />
        <style>{`
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            margin: 0;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f8fafc;
            color: #0f172a;
          }
          main {
            text-align: center;
            padding: 2rem;
            max-width: 520px;
          }
          a {
            color: #2563eb;
          }
        `}</style>
      </head>
      <body>
        <main>
          <h1>Page not found</h1>
          <p>
            If you are not redirected automatically, please go to{' '}
            <a href={`${basePath}/en/`}>the English documentation</a>.
          </p>
        </main>
      </body>
    </html>
  )
}

