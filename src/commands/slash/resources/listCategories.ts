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
  try {
    const resourceCategoryRepository = connection.getRepository(ResourceCategory);
    const resourceCategories = await resourceCategoryRepository
      .createQueryBuilder("resourceCategories")
      .where("resourceCategories.deleted_at IS NULL")
      .getMany();

    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('Available resource categories')
      .setTimestamp();

    const fields = resourceCategories.map(e => e.category).join(', ');
    embed.addFields({ name: 'Categories', value: fields });

    await interaction.followUp({ 
      content: 'Available resources',
      embeds: [ embed ]
    })
  } catch (e) {
    await handleError(interaction, e.message);
    return;
  }
}

