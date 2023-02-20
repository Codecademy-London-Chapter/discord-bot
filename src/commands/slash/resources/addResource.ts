import {
  EmbedBuilder,
  CommandInteraction
} from 'discord.js';
import { DataSource } from 'typeorm';
import Resource from '../../../entities/Resource';
import ResourceCategory from '../../../entities/ResourceCategory';
import handleError from '../../../handlers/handleError';
import isURL from 'validator/lib/isURL';
import getCategoriesFromString from './utils/getCategoriesFromString';

export default async function addResource(
  interaction: CommandInteraction,
  connection: DataSource,
  data: { [key: string]: string | null }
): Promise<void> {

  let { title, description, url, img, categories } = data;
  if (!title || !description || !url || !categories) {
    await handleError(interaction, 'Invalid required fields');
    return;
  }

  // add protocol if missing and validate urls (protocol is required by EmbedBuilder)
  if (!url.toLowerCase().match(/^http/)) {
    url = 'https://' + url;
  }
  if (!isURL(url)) {
    await handleError(interaction, 'Invalid url');
    return;
  }

  // img is optional
  if (img) {
    if (!img.toLowerCase().match(/^http/)) {
      img = 'https://' + img;
    }
    if (!isURL(img)) {
      await handleError(interaction, 'Invalid img url');
      return;
    }
  }

  // split categories string
  const categoryList = getCategoriesFromString(categories);

  // categories are required for new resources
  if (!categoryList || !categoryList.length) {
    await handleError(interaction, 'Invalid categories');
    return;
  }

  // upsert resource_categories to capture any new categories
  const resourceCategoryRepository = connection.getRepository(ResourceCategory);
  try {
    // we only need to check if there was an error here, not whether we created
    // any categories, as it's possible all supplied categories already exist
    await resourceCategoryRepository
      .upsert(
        categoryList.map((category) => ({ category })),
        {
          conflictPaths: ["category"],
          skipUpdateIfNoValuesChanged: true,
        },
      );
  } catch (e) {
    await handleError(interaction, 'Error adding categories');
    return;
  }

  const resource = { title, description, url, img: img ? img : undefined };

  // insert resource and return * for EmbedBuilder
  let insertedResource: Resource;
  try {
    let inserted = await connection
      .createQueryBuilder()
      .insert()
      .into(Resource)
      .values([
        resource,
      ])
      .returning('*')
      .execute()
    if (!inserted || !inserted.raw.length) {
      throw new Error("Invalid resource insert response");
    }
    insertedResource = inserted.raw[0];
  } catch (e) {
    await handleError(interaction, e.message);
    return;
  }

  // get all categories associated with this resource
  let resourceCategories: ResourceCategory[];
  try {
    resourceCategories = await resourceCategoryRepository
      .createQueryBuilder("resourceCategories")
      .where("resourceCategories.deleted_at IS NULL")
      .andWhere("resourceCategories.category IN (:...categoryList)", {
        categoryList
      })
      .getMany();
  } catch (e) {
    await handleError(interaction, e.message);
    return;
  }

  // add categories to the resources_resource_categories join table
  try {
    for (const category of resourceCategories) {
      await connection
        .createQueryBuilder()
        .relation(Resource, 'resourceCategories')
        .of(insertedResource)
        .add(category);
    }
  } catch (e) {
    await handleError(interaction, e.message);
    return;
  }

  const fieldValue = categoryList.join(', ');

  const embed = new EmbedBuilder()
    .setColor('#0099ff')
    .setURL(insertedResource.url)
    .setTitle(insertedResource.title)
    .setDescription(insertedResource.description)
    .setThumbnail(insertedResource.img)
    .setTimestamp(insertedResource.created_at)
    .addFields({
      name: 'Categories',
      value: fieldValue
    });

  try {
    await interaction.followUp({
      content: 'Resource added.',
      embeds: [embed]
    });
    return;
  } catch (e) {
    await handleError(interaction, e.message);
    return;
  }
}
