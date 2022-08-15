import { 
  CommandInteraction
} from 'discord.js';

export default async function handleError(
  interaction: CommandInteraction,
  msg: string
): Promise<void> {
  await interaction.followUp({
    content: 'Error: ' + msg,
    ephemeral: true
  });
}
