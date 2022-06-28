import { 
  Client, 
  BaseCommandInteraction
} from "discord.js";
import type { SlashCommand } from '../../types';

export const ping: SlashCommand = {
  name: "ping",
  description: "Replies with Pong!",
  type: 1,
  execute: async (
    client: Client,
    interaction: BaseCommandInteraction
  ) => {
    await interaction.followUp({
      ephemeral: true,
      content: 'Pong!'
    });
  }
}; 
