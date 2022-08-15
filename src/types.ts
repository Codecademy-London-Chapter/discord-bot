import { 
  Client,
  CommandInteraction,
  ChatInputApplicationCommandData,
  CommandInteractionOptionResolver,
} from 'discord.js';
import { DataSource } from 'typeorm';

// SlashCommand execute function signature
interface SlashCommandExecutable {
  (
    client: Client, 
    interaction: CommandInteraction,
    connection: DataSource,
    options?: Partial<CommandInteractionOptionResolver>,
  ): Promise<void>;
}

export interface SlashCommand extends ChatInputApplicationCommandData {
  execute: SlashCommandExecutable;
} 
