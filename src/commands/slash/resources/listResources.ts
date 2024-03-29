import {
  CommandInteraction,
  EmbedBuilder
} from 'discord.js';
import { DataSource } from 'typeorm';
import Resource from '../../../entities/Resource';
import handleError from '../../../handlers/handleError';

export default async function listResources(
  interaction: CommandInteraction,
  connection: DataSource
): Promise<void> {

  let resources: Resource[];
  try {
    const resourceRepository = connection.getRepository(Resource);
    resources = await resourceRepository
      .createQueryBuilder("resources")
      .leftJoinAndSelect("resources.resourceCategories", "resourceCategories")
      .getMany();

    if (!resources || !resources.length) {
      throw new Error("No resources found.");
    }
  } catch (e) {
    await handleError(interaction, e.message);
    return;
  }

  // EmbedBuilder is limited to 10 per message 
  const embed: EmbedBuilder[] = [];
  for (let i = 0; i < resources.length && i < 10; i++) {
    const tmp = new EmbedBuilder()
      .setColor('#0099ff')
      .setURL(resources[i].url)
      .setTitle(resources[i].title)
      .setDescription(resources[i].description)
      .setThumbnail(resources[i].img)
      .setTimestamp(resources[i].created_at);

    // EmbedBuilder field values must be non empty string
    if (resources[i].resourceCategories.length) {
      const categories = resources[i].resourceCategories
        .map(e => e.category)
        .join(', ');
      tmp.addFields({
        name: 'Categories',
        value: categories
      });
    }
    embed.push(tmp);
  }

  try {
    await interaction.followUp({
      content: 'Available resources',
      embeds: embed
    })
    return;
  } catch (e) {
    await handleError(interaction, e.message);
    return;
  }
}

