import express from 'express'
import cors from 'cors'
import { DiscordController } from './discord'

const ip = require('ip')

export const start = async (config: {
  port: number
  discordToken: string
  serverName: string
  channelName: string
  username: string
}) => {
  const controller = new DiscordController({
    token: config.discordToken,
    serverName: config.serverName,
    channelName: config.channelName,
    username: config.username,
  })

  await controller.login()

  const app = express()

  app.disable('etag')
  app.use(
    cors({
      origin: '*',
      credentials: true,
    })
  )
  app.use(express.json())

  app.get('/', (_, response) => {
    response.sendStatus(200)
  })

  app.get('/mute', async (_, response) => {
    response.json({ muted: controller.isMuted() })
  })

  app.post('/mute', async (_, response) => {
    await controller.mute()
    response.json({ muted: controller.isMuted() })
  })

  app.delete('/mute', async (_, response) => {
    await controller.unMute()
    response.json({ muted: controller.isMuted() })
  })

  const ipAddress = ip.address()

  app.listen(config.port, ipAddress, () => {
    console.log(`Discord API started: http://${ipAddress}:${config.port}`)
  })
}
