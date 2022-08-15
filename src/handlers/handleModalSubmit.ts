
import handlePairProgrammingApplication from '../commands/slash/handlePairProgrammingApplication';
import {
  Client,
  ModalSubmitInteraction
} from 'discord.js';
import { DataSource } from 'typeorm';

export default async function handleModalSubmit(
  client: Client,
  interaction: ModalSubmitInteraction,
  connection: DataSource
): Promise<void> {
  if (interaction.customId === 'pair_programming_application_modal') {
    handlePairProgrammingApplication(interaction, connection);
  }
}
