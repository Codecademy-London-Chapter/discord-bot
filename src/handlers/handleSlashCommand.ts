import { 
  Client,
  CommandInteraction
} from 'discord.js';
import { DataSource } from 'typeorm';
import handleError from './handleError';
import type { SlashCommand } from '../types';

export default async function handleSlashCommand(
  client: Client,
  interaction: CommandInteraction,
  connection: DataSource,
  commands: SlashCommand[]
): Promise<void> {

  await interaction.deferReply();

  const { commandName, options } = interaction;
  const slashCommand = commands.find((c) => {
    return c.name === commandName;
  });

  if (!slashCommand) {
    await handleError(interaction, 'Invalid command');
    return;
  }

  try {
    if (!slashCommand.execute) {
      throw new Error('Invalid execute function')
    }
    await slashCommand.execute(client, interaction, connection, options);
  } catch (e) {
    console.error(e);
    await handleError(interaction, e.message);
    return;
  }
}
