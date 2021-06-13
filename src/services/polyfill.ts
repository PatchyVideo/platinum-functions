import type { FastifyInstance } from 'fastify'
import polyfillLibrary from 'polyfill-library'
import mergeStream from 'merge2'

const lastModified = new Date().toUTCString()

export default function (app: FastifyInstance): void {
  app.get('/polyfill.js', async (req, res) => {
    const stream = mergeStream(
      polyfillLibrary.getPolyfillString({
        uaString: req.headers['user-agent'] || '',
        minify: true,
        rum: false,
        stream: true,
        features: Object.fromEntries(
          [
            'default',
            'es2018',
            'es2019',
            'es2020',
            'es2021',
            'Intl.Locale',
            'Intl.getCanonicalLocales',
            'Intl.DateTimeFormat',
            'Intl.NumberFormat',
          ].map((v) => [v, { flags: new Set() }])
        ),
      })
    )
    res.status(200)
    res.type('text/javascript; charset=utf-8')
    res.headers({
      'Cache-Control':
        'public, s-maxage=31536000, max-age=604800, stale-while-revalidate=604800, stale-if-error=604800',
      'Last-Modified': lastModified,
    })
    res.send(stream)
  })
}
