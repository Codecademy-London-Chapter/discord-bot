import { 
  EmbedBuilder,
  CommandInteraction
} from 'discord.js';
import { DataSource, InsertResult } from 'typeorm';
import Resource from '../../../entities/Resource';
import ResourceCategory from '../../../entities/ResourceCategory';
import handleError from '../../../handlers/handleError';
import isURL from 'validator/lib/isURL';

export default async function addResource(
  interaction: CommandInteraction, 
  connection: DataSource,
  data: { [key: string]: string|null }
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
      return await handleError(interaction, 'Invalid img url');
    }
  }

  // split categories string
  const categoryList = categories
    .toLowerCase()
    .split(/\,\s|\,|\s/g)
    .filter(e => e)
    .map(e => ({ category: e }));

  // upsert resource_categories to capture any new categories
  const resourceCategoryRepository = connection.getRepository(ResourceCategory);
  const upsertResponse = await resourceCategoryRepository
    .upsert(
      [ ...categoryList ],
      {
        conflictPaths: [ "category" ],
        skipUpdateIfNoValuesChanged: true,
      },
    );

  console.log(`Added ${upsertResponse.identifiers.filter(e => e).length} new categories.`);

  const resource = { title, description, url, img: img ? img : undefined };
  
  // insert resource and return * for EmbedBuilder
  let resourceResponse: InsertResult;
  try {
    resourceResponse = await connection
      .createQueryBuilder()
      .insert()
      .into(Resource)
      .values([
        resource,
      ])
      .returning('*')
      .execute()
  } catch (e) {
    await handleError(interaction, e.message);
    return;
  }
  const insertedResource = resourceResponse.generatedMaps[0];
  if (!insertedResource) {
    await handleError(interaction, 'Invalid resource insert return value');
    return;
  }

  // get all categories and add to join table resources_resource_categories
  const resourceCategories = await resourceCategoryRepository
    .createQueryBuilder("resourceCategories")
    .where("resourceCategories.deleted_at IS NULL")
    .andWhere("resourceCategories.category IN (:...categoryList)", { 
      categoryList: categoryList.map(e => e.category)
    })
    .getMany();

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

  const fieldValue = categoryList.map(
    (e: Pick<ResourceCategory, 'category'>) => e.category
  ).join(', ');
  
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

  await interaction.followUp({ 
    content: 'Resource added.',
    embeds: [ embed ]
  });
  return;
}
