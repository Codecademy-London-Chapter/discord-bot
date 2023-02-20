import {
  EmbedBuilder,
  CommandInteraction
} from 'discord.js';
import { DataSource } from 'typeorm';
import ResourceCategory from '../../../entities/ResourceCategory';
import handleError from '../../../handlers/handleError';

export default async function listCategories(
  interaction: CommandInteraction,
  connection: DataSource
): Promise<void> {

  let resourceCategories: ResourceCategory[];
  try {
    const resourceCategoryRepository = connection.getRepository(ResourceCategory);
    resourceCategories = await resourceCategoryRepository
      .createQueryBuilder("resourceCategories")
      .where("resourceCategories.deleted_at IS NULL")
      .getMany();

    if (!resourceCategories) {
      throw new Error("No resource categories found.");
    }
  } catch (e) {
    await handleError(interaction, e.message);
    return;
  }

  const embed = new EmbedBuilder()
    .setColor('#0099ff')
    .setTitle('Available resource categories')
    .setTimestamp();

  const fields = resourceCategories.map(e => e.category).join(', ');
  embed.addFields({ name: 'Categories', value: fields });

  try {
    await interaction.followUp({
      content: 'Available resources',
      embeds: [embed]
    });
    return;
  } catch (e) {
    await handleError(interaction, e.message);
    return;
  }
}

