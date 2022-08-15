require('dotenv').config();
import { 
  Client,
  Interaction,
  Message,
  GuildMember,
  GatewayIntentBits
 } from 'discord.js';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { commands } from './commands/slash';
import { DataSource } from 'typeorm';
import { dataSource } from './dataSource';
import handleSlashCommand from './handlers/handleSlashCommand';
import handleMessageCreate from './handlers/handleMessageCreate';
import type { SlashCommand } from './types';

const { TOKEN, GUILD_ID, CLIENT_ID } = process.env;
if (!TOKEN || !GUILD_ID || !CLIENT_ID) {
  throw new Error('Invalid or missing environment variable');
}

// Create a client instance and set permissions. Do not edit permissions without approval.
const client = new Client({ 
  intents: [ 
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages
  ]
});

dataSource.initialize()
  .then(async (connection) => {
    console.log("Data Source initialized")

    // setup listeners
    interactionCreate(client, connection, commands);
    messageCreate(client);
    guildMemberAdd(client);
    ready(client);

    // register commands and authenticate client
    registerCommands(commands, CLIENT_ID, GUILD_ID, TOKEN);
    client.login(TOKEN);
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err)
  })

function ready(client: Client): void {
  client.on("ready", async () => {
    if (!client || !client.user) {
      return;
    }
    console.log(`${client.user.tag} is online`);
  });
}

function interactionCreate(
  client: Client,
  connection: DataSource,
  commands: SlashCommand[]
): void {
  client.on("interactionCreate", async (interaction: Interaction) => {
    if (interaction.isCommand()) {
      await handleSlashCommand(client, interaction, connection, commands);
    }
  });
}

function messageCreate(client: Client): void {
  client.on('messageCreate', async (message: Message) => {
    await handleMessageCreate(message, client);
  });
}

function guildMemberAdd(client: Client): void {
  client.on('guildMemberAdd', async (member: GuildMember) => {
    // send message to the user who joined. 
    member.send(`Welcome to the Codecademy London Chapter!`);
    console.log("Someone has joined the guild");
  });
}

// Register slash commands and print a list of available guild commands
async function registerCommands(
  commands: SlashCommand[],
  clientID: string,
  guildID: string,
  token: string
): Promise<void> {

  const rest = new REST({ version: '10' }).setToken(token);

  // push new commands
  try {
    await rest.put(
      Routes.applicationGuildCommands(clientID, guildID),
      { body: commands }
    );
  } catch (e) {
    console.error(e);
  }

  // log guild command list
  try {
    const guildCommands = await rest.get(
      Routes.applicationGuildCommands(clientID, guildID)
    );
    if (Array.isArray(guildCommands)) {
      console.log('Available guild commands: ');
      for (const command of guildCommands) {
        console.log(` - ${command.name}`);
      }
    }
  } catch (e) {
    console.error(e);
  }
}

