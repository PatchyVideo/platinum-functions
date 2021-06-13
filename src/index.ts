import fastify from 'fastify'

const app = fastify({
  logger: true,
})

import fastifyCompress from 'fastify-compress'
app.register(fastifyCompress)

import servicePolyfill from './services/polyfill'
servicePolyfill(app)

const start = async () => {
  try {
    await app.listen(3000, '0.0.0.0')
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}
start()
