import assert from 'assert'
import { ChannelType, Client, Collection, GatewayIntentBits, GuildMember } from 'discord.js'

export interface DiscordControllerProps {
  token: string
  serverName: string
  channelName: string
  username: string
}

export class DiscordController {
  client: Client
  member: GuildMember | undefined
  token: string

  constructor(props: DiscordControllerProps) {
    this.token = props.token
    this.client = new Client({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
    })

    this.client.on('ready', async () => {
      console.log(`Logged in as ${this.client.user?.tag}`)

      const guild = this.client.guilds.cache.find((_) => _.name === props.serverName)
      assert.ok(guild, `Unable to find a server called "${props.serverName}"`)

      const channel = guild.channels.cache.find(
        (_) => _.name === props.channelName && _.type === ChannelType.GuildVoice
      )
      assert.ok(channel, `Unable to find a voice channel called "${props.channelName}"`)

      this.member = (channel.members as Collection<string, GuildMember>).find(
        (_) => _.user.username === props.username
      )
      assert.ok(this.member, `Unable to find a user called "${props.username}"`)
    })
  }

  async login() {
    return this.client.login(this.token)
  }

  isMuted() {
    if (!this.member) {
      throw Error('Client not ready')
    }
    return this.member.voice.mute
  }

  async mute() {
    if (!this.member) {
      throw Error('Client not ready')
    }
    console.log('Muting')
    await this.member.voice.setMute(true)
  }

  async unMute() {
    if (!this.member) {
      throw Error('Client not ready')
    }
    console.log('Unmuting')
    await this.member.voice.setMute(false)
  }
}
