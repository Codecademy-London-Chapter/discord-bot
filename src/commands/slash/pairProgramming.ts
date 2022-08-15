import { 
  Client,
  ModalBuilder,
  TextInputStyle,
  TextInputBuilder,
  ActionRowBuilder,
  CommandInteraction,
  ApplicationCommandType,
  ModalActionRowComponentBuilder,
  CommandInteractionOptionResolver
} from 'discord.js';
import { DataSource } from 'typeorm';

import type { SlashCommand } from '../../types';

async function execute(
  client: Client, 
  interaction: CommandInteraction,
  connection: DataSource,
  options?: Partial<CommandInteractionOptionResolver>
): Promise<void> {

  const preferredLanguageInput = new TextInputBuilder()
    .setCustomId('preferredLanguage')
    .setLabel("Preferred language")
    .setStyle(TextInputStyle.Short);

  const preferredLanguageInputRow = new ActionRowBuilder<ModalActionRowComponentBuilder>()
    .addComponents(preferredLanguageInput);

  const languageSkillsInput = new TextInputBuilder()
    .setCustomId('languageSkills')
    .setLabel("Language skills")
    .setStyle(TextInputStyle.Short);

  const languageSkillsInputRow = new ActionRowBuilder<ModalActionRowComponentBuilder>()
    .addComponents(languageSkillsInput);

  const modal = new ModalBuilder()
    .setCustomId('pair_programming_application_modal')
    .setTitle('Pair programming');

  modal.addComponents(
    preferredLanguageInputRow,
    languageSkillsInputRow
  );
  await interaction.showModal(modal);
}

export const pairProgramming: SlashCommand = {
  name: "pairs",
  description: "Sign up for pair programming",
  type: ApplicationCommandType.ChatInput,
  execute
}; 