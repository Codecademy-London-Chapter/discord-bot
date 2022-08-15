import { 
  EmbedBuilder,
  CommandInteraction,
} from 'discord.js';
import { DataSource } from 'typeorm';
import ResourceCategory from '../../../entities/ResourceCategory';
import handleError from '../../../handlers/handleError';

export default async function addCategory(
  interaction: CommandInteraction, 
  connection: DataSource,
  data: string|null
): Promise<void> {

  if (!data) {
    await handleError(interaction, 'Invalid category list');
    return;
  }

  // split categories string
  const categoryList = data
    .toLowerCase()
    .split(/\,\s|\,|\s/g)
    .filter(e => e)
    .map(e => ({ category: e }));

  // insert categories
  try {
    for (const category of categoryList) {
      await connection
        .createQueryBuilder()
        .insert()
        .into(ResourceCategory)
        .values([ category ])
        .execute()
    }
  } catch (e) {
    await handleError(interaction, e.message);
    return;
  }

  const fieldValue = categoryList.map(
    (e: Pick<ResourceCategory, 'category'>) => e.category
  ).join(', ');

  const embed = new EmbedBuilder()
    .setColor('#0099ff')
    .setTitle('Added new categories')
    .setTimestamp()
    .addFields({ 
      name: 'Categories', 
      value: fieldValue
    });

  await interaction.followUp({ 
    content: 'Resource added.',
    embeds: [ embed ]
  });
  return;
}
