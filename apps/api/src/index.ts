import { buildServer } from './server'
;(async () => {
  const app = await buildServer()
  app.listen({ port: 3000, host: '0.0.0.0' }, (err) => {
    if (err) {
      app.log.error(err)
      process.exit(1)
    }
  })
})()
