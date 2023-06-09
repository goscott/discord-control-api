import assert from 'assert'
import { start } from './server'

assert.ok(process.env.DISCORD_TOKEN, `process.env.DISCORD_TOKEN not set`)
assert.ok(process.env.SERVER_NAME, `process.env.SERVER_NAME not set`)
assert.ok(process.env.CHANNEL_NAME, `process.env.CHANNEL_NAME not set`)
assert.ok(process.env.USER_NAME, `process.env.USER_NAME not set`)

start({
  port: 5004,
  channelName: process.env.CHANNEL_NAME,
  discordToken: process.env.DISCORD_TOKEN,
  serverName: process.env.SERVER_NAME,
  username: process.env.USER_NAME,
}).catch(console.log)
