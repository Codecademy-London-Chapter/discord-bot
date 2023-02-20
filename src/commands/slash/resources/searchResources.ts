import {
  EmbedBuilder,
  CommandInteraction,
} from 'discord.js';
import { DataSource } from 'typeorm';
import Resource from '../../../entities/Resource';
import handleError from '../../../handlers/handleError';
import getCategoriesFromString from './utils/getCategoriesFromString';

export default async function searchResources(
  interaction: CommandInteraction,
  connection: DataSource,
  categories: string | null
): Promise<void> {

  if (!categories || !categories.length) {
    await interaction.followUp({
      content: 'Invalid categories'
    });
    return;
  }

  // split categories string
  const categoryList = getCategoriesFromString(categories);

  if (!categoryList || !categoryList.length) {
    await interaction.followUp({
      content: 'Invalid categories'
    });
    return;
  }

  const resourceRepository = connection.getRepository(Resource);
  let resources: Resource[] = [];
  try {

    const promises = categoryList.map((category) => {
      return resourceRepository
        .createQueryBuilder("resources")
        .innerJoinAndSelect("resources.resourceCategories", "resourceCategories")
        .where("lower(resourceCategories.category) LIKE '%' || :category || '%'", {
          category
        })
        .getMany();
    })

    // remove any duplicate resources due to category overlap
    await Promise.all(promises)
      .then((data) => {
        resources = data
          .flat()
          .reduce((resources: Resource[], resource: Resource) => {
            if (resources.findIndex((e) => e.id === resource.id) < 0) {
              resources.push(resource);
            }
            return resources;
          }, []);
      })
      .catch((e) => {
        throw e;
      })

  } catch (e) {
    await handleError(interaction, e.message);
    return;
  }

  const embed: EmbedBuilder[] = [];
  try {
    for (const row of resources) {
      const tmp = new EmbedBuilder()
        .setColor('#0099ff')
        .setURL(row.url)
        .setTitle(row.title)
        .setDescription(row.description)
        .setThumbnail(row.img)
        .setTimestamp(row.created_at);

      // EmbedBuilder field values must be non empty string
      if (row.resourceCategories.length) {
        const categories = row.resourceCategories.map(e => e.category).join(', ');
        tmp.addFields({
          name: 'Matched categories',
          value: categories
        });
      }
      embed.push(tmp);
    }
  } catch (e) {
    await handleError(interaction, e.message);
    return;
  }

  await interaction.followUp({
    content: embed.length ? 'Resources:' : 'No resources found',
    embeds: embed
  });
  return;
}
