import { 
  CommandInteraction
} from 'discord.js';
import { DataSource } from 'typeorm';
import handleError from '../../handlers/handleError';

export default async function handlePairProgrammingApplication(
  interaction: CommandInteraction, 
  connection: DataSource
): Promise<void> {
  try {
    await interaction.followUp({ 
      content: 'Pair programming'
    })
  } catch (e) {
    await handleError(interaction, e.message);
    return;
  }
}

