import { 
  ModalSubmitInteraction
} from 'discord.js';
import { DataSource } from 'typeorm';
import handleError from '../../handlers/handleError';

export default async function handlePairProgrammingApplication(
  interaction: ModalSubmitInteraction, 
  connection: DataSource
): Promise<void> {
  try {
    await interaction.reply({ 
      content: 'Pair programming'
    })
  } catch (e) {
    await handleError(interaction, e.message);
    return;
  }
}

