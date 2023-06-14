import assert from 'assert'
import {
  ChannelType,
  Client,
  Collection,
  GatewayIntentBits,
  GuildBasedChannel,
  GuildMember,
} from 'discord.js'

export interface DiscordControllerProps {
  token: string
  serverName: string
  channelName: string
  username: string
}

export class DiscordController {
  client: Client
  channel: GuildBasedChannel | undefined
  member: GuildMember | undefined
  memberUsername: string
  token: string

  constructor(props: DiscordControllerProps) {
    this.memberUsername = props.username
    this.token = props.token
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMembers,
      ],
    })

    this.client.on('ready', async () => {
      console.log(`Logged in as ${this.client.user?.tag}`)

      const guild = this.client.guilds.cache.find((_) => _.name === props.serverName)
      assert.ok(guild, `Unable to find a server called "${props.serverName}"`)

      this.channel = guild.channels.cache.find(
        (_) => _.name === props.channelName && _.type === ChannelType.GuildVoice
      )!
      assert.ok(this.channel, `Unable to find a voice channel called "${props.channelName}"`)

      this.getMember()
    })
  }

  getMember(): GuildMember | undefined {
    this.member = (this.channel!.members as Collection<string, GuildMember>).find(
        (_) => _.user.username === this.memberUsername
      )
    return this.member
  }

  async login() {
    return this.client.login(this.token)
  }

  isMuted() {
    const member = this.getMember()
    if (!member) {
      return true
    }
    return member.voice.mute
  }

  async mute() {
    const member = this.getMember()
    if (!member) {
      throw Error('Client not ready')
    }
    await member.voice.setMute(true)
  }

  async unMute() {
    const member = this.getMember()
    if (!member) {
      throw Error('Client not ready')
    }
    await member.voice.setMute(false)
  }

  getCurrentMembers() {
    return (this.channel!.members as Collection<string, GuildMember>).map((_) => _.user.username)
  }

  async disconnect() {
    const member = this.getMember()
    if (!member) {
      throw Error('Client not ready')
    }
    await member.voice.disconnect()
  }
}
