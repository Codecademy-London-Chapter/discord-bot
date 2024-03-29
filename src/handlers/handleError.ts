import {
  CommandInteraction,
  ModalSubmitInteraction
} from 'discord.js';

export default async function handleError(
  interaction: CommandInteraction | ModalSubmitInteraction,
  msg: string
): Promise<void> {
  try {
    await interaction.followUp({
      content: 'Error: ' + msg,
      ephemeral: true
    });
  } catch (e) {
    console.error(e);
  }
}
