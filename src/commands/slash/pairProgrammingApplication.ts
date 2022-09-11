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

  const preferredLanguageProficiencyInput = new TextInputBuilder()
    .setCustomId('preferredLanguageProficiency')
    .setLabel("Preferred language proficiency. Number 1 - 10")
    .setStyle(TextInputStyle.Short);

  const languageSkillsInput = new TextInputBuilder()
    .setCustomId('languageSkills')
    .setLabel("Language skills")
    .setStyle(TextInputStyle.Short);

  const preferredLanguageInputRow = new ActionRowBuilder<ModalActionRowComponentBuilder>()
    .addComponents(preferredLanguageInput);

  const preferredLanguageProficiencyInputRow = new ActionRowBuilder<ModalActionRowComponentBuilder>()
    .addComponents(preferredLanguageProficiencyInput);

  const languageSkillsInputRow = new ActionRowBuilder<ModalActionRowComponentBuilder>()
    .addComponents(languageSkillsInput);

  const modal = new ModalBuilder()
    .setCustomId('pair_programming_application_modal')
    .setTitle('Pair programming');

  modal.addComponents(
    preferredLanguageInputRow,
    preferredLanguageProficiencyInputRow,
    languageSkillsInputRow
  );
  await interaction.showModal(modal);
}

export const pairProgrammingApplication: SlashCommand = {
  name: "pair_programming_application",
  description: "Sign up for pair programming",
  type: ApplicationCommandType.ChatInput,
  execute
}; 
