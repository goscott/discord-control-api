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

  app.get('/members', async (_, response) => {
    try {
      response.json({ members: controller.getCurrentMembers() })
    } catch {
      response.sendStatus(500)
    }
  })

  app.get('/mute', async (_, response) => {
    try {
      response.json({ muted: controller.isMuted() })
    } catch {
      response.sendStatus(500)
    }
  })

  app.post('/mute', async (_, response) => {
    try {
      await controller.mute()
      response.json({ muted: controller.isMuted() })
    } catch {
      response.sendStatus(500)
    }
  })

  app.delete('/mute', async (_, response) => {
    try {
      await controller.unMute()
      response.json({ muted: controller.isMuted() })
    } catch {
      response.sendStatus(500)
    }
  })

  const ipAddress = ip.address()

  app.listen(config.port, ipAddress, () => {
    console.log(`Discord API started: http://${ipAddress}:${config.port}`)
  })
}
