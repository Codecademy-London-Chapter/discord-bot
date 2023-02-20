import {
  EmbedBuilder,
  CommandInteraction,
} from 'discord.js';
import { DataSource, InsertResult } from 'typeorm';
import ResourceCategory from '../../../entities/ResourceCategory';
import handleError from '../../../handlers/handleError';
import getCategoriesFromString from './utils/getCategoriesFromString';

export default async function addCategory(
  interaction: CommandInteraction,
  connection: DataSource,
  categoriesString: string | null
): Promise<void> {

  if (!categoriesString) {
    await handleError(interaction, 'Invalid category list');
    return;
  }

  // split categories string
  const categoryList = getCategoriesFromString(categoriesString);

  // insert categories, skipping any that already exist
  let insertResponse: InsertResult;
  try {
    insertResponse = await connection
      .createQueryBuilder()
      .insert()
      .into(ResourceCategory)
      .values(categoryList.map((category) => ({ category })))
      .orUpdate(
        ["category"],
        ["category"], {
        skipUpdateIfNoValuesChanged: true,
      })
      .returning("*")
      .execute();
  } catch (e) {
    await handleError(interaction, e.message);
    return;
  }

  // concatenate newly added categories
  const fieldValue = insertResponse.raw
    .map(({ category }: { category: string }) => category)
    .join(', ');

  const newCategoriesCount = insertResponse.raw.length;
  const skippedCategoriesCount = categoryList.length - newCategoriesCount;

  const embed = new EmbedBuilder()
    .setColor('#0099ff')
    .setTitle(`Added ${newCategoriesCount} categories and skipped ${skippedCategoriesCount} existing`)
    .setTimestamp()
    .addFields({
      name: 'New categories',
      value: fieldValue
    });

  await interaction.followUp({
    content: 'Resource added.',
    embeds: [embed]
  });
  return;
}
