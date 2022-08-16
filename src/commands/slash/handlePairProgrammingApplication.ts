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
  const languageSkills = interaction.fields.getTextInputValue('languageSkills');

  const pairProgrammingRepository = connection.getRepository(PairProgrammingApplication);
  const application = pairProgrammingRepository.create({
    username,
    userID,
    preferredLanguage,
    languageSkills
  });

  const returnedApplication = await pairProgrammingRepository.save(application);
  console.log(returnedApplication);

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
    await handleError(interaction, e.message);
    return;
  }
}
