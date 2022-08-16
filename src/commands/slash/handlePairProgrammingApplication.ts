import {
  EmbedBuilder,
  ModalSubmitInteraction
} from 'discord.js';
import { DataSource } from 'typeorm';
import PairProgrammingApplication from '../../entities/PairProgrammingApplication';
import handleError from '../../handlers/handleError';

export default async function handlePairProgrammingApplication(
  interaction: ModalSubmitInteraction, 
  connection: DataSource
): Promise<void> {

  await interaction.deferReply();

  const {
    username,
    id: userID,
  } = interaction.user;

  const preferredLanguage = interaction.fields.getTextInputValue('preferredLanguage');
  const proficiency = interaction.fields.getTextInputValue('preferredLanguageProficiency');
  const languageSkills = interaction.fields.getTextInputValue('languageSkills');

  const preferredLanguageProficiency = Number(proficiency);
  if (Number.isNaN(preferredLanguageProficiency)) {
    return await handleError(interaction, 'Proficiency must be a number. Please resubmit.');
  }

  console.log(typeof preferredLanguageProficiency, preferredLanguageProficiency);

  const pairProgrammingRepository = connection.getRepository(PairProgrammingApplication);
  const application = pairProgrammingRepository.create({
    username,
    userID,
    preferredLanguage,
    preferredLanguageProficiency,
    languageSkills
  });

  await pairProgrammingRepository.save(application);

  const embed = new EmbedBuilder()
    .setColor('#0099ff')
    .setTitle('Pair programming application received')
    .setTimestamp()
    .addFields({ 
      name: 'Preferred language', 
      value: preferredLanguage
    }, {
      name: 'Alternate languages', 
      value: languageSkills
    });

  try {
    await interaction.followUp({ 
      content: 'Application received',
      embeds: [ embed ],
      ephemeral: true
    });
  } catch (e) {
    return await handleError(interaction, e.message);
  }
}
