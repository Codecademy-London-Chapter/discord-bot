import { 
  Client,
  CacheType,
  ModalBuilder,
  TextInputStyle,
  TextInputBuilder,
  ActionRowBuilder,
  CommandInteraction,
  CommandInteractionOptionResolver,
  ModalActionRowComponentBuilder,
} from 'discord.js';
import { DataSource } from 'typeorm';

import type { SlashCommand } from '../../types';

export default async function pairProgramming(
  client: Client, 
  interaction: CommandInteraction,
  connection: DataSource,
  options?: Omit<CommandInteractionOptionResolver<CacheType>, "getMessage" | "getFocused">
): Promise<void> {

  const usernameInput = new TextInputBuilder()
    .setCustomId('username')
    .setLabel("Username")
    .setStyle(TextInputStyle.Short);

  const languageSkillsInput = new TextInputBuilder()
    .setCustomId('languageSkills')
    .setLabel("Language skills")
    .setStyle(TextInputStyle.Short);

  const preferredLanguageInput = new TextInputBuilder()
    .setCustomId('preferredLanguage')
    .setLabel("Preferred language")
    .setStyle(TextInputStyle.Short);

  const usernameInputRow = new ActionRowBuilder<ModalActionRowComponentBuilder>()
    .addComponents(usernameInput);
  const preferredLanguageInputRow = new ActionRowBuilder<ModalActionRowComponentBuilder>()
    .addComponents(preferredLanguageInput);
  const languageSkillsInputRow = new ActionRowBuilder<ModalActionRowComponentBuilder>()
    .addComponents(languageSkillsInput);

  const modal = new ModalBuilder()
    .setCustomId('pair_programming_application_modal')
    .setTitle('Pair programming');
    
  modal.addComponents(
    usernameInputRow, 
    preferredLanguageInputRow, 
    languageSkillsInputRow
  );
  await interaction.showModal(modal);
}
