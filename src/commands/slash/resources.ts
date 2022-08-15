import { 
  Client,
  CommandInteraction,
  CommandInteractionOptionResolver
} from 'discord.js';
import { DataSource } from 'typeorm';
import listResources from './resources/listResources';
import searchResources from './resources/searchResources';
import addResource from './resources/addResource';
import addCategory from './resources/addCategory';
import listCategories from './resources/listCategories';
import handleError from '../../handlers/handleError';
import type { SlashCommand } from '../../types';

async function execute(
  client: Client, 
  interaction: CommandInteraction,
  connection: DataSource,
  options?: Partial<CommandInteractionOptionResolver>
): Promise<void> {
  try {

    let subcommand: string = '';
    if (options && options.getSubcommand) {
      subcommand = options.getSubcommand();
    } else {
      await handleError(interaction, 'Invalid or missing subcommand');
      return;
    }

    switch (subcommand) {

      case 'list_resources': {
        await listResources(interaction, connection);
        break;
      }

      case 'list_categories': {
        await listCategories(interaction, connection);
        break;
      }

      case 'search_resources': {
        if (options.getString) {
          const option = options.getString('category_list');
          await searchResources(interaction, connection, option);
        } 
        break;
      }

      case 'add_categories': {
        if (options.getString) {
          const option = options.getString('categories');
          await addCategory(interaction, connection, option);
        }
        break;
      }

      case 'add_resource': {
        if (options.getString) {
          const option = {
            title: options.getString('title'),
            description: options.getString('description'),
            url: options.getString('url'),
            img: options.getString('img'),
            categories: options.getString('categories')
          }
          await addResource(interaction, connection, option);
        }
        break;
      }

      default: {
        throw new Error('Invalid subcommand.');
      }
      
    }
  } catch (e) {
    await handleError(interaction, e.message);
    return;
  }
}

export const resources: SlashCommand = 
  {
    name: 'resources',
    description: 'Resource commands.',
    options: [
      {
        type: 1,
        name: 'list_resources',
        description: 'List resources.'
      },
      {
        type: 1,
        name: 'search_resources',
        description: 'Search resources by category.',
        options: [
          {
            type: 3,
            name: 'category_list',
            description: "Case insensitive comma or space separated list, e.g. 'JavaScript, module async,webhook'",
            required: true,
            choices: undefined
          }
        ]
      },
      {
        type: 1,
        name: 'list_categories',
        description: 'List resource categories.',
        options: []
      },
      {
        type: 1,
        name: 'add_resource',
        description: 'Add new resource',
        options: [
          {
            type: 3,
            name: 'title',
            description: 'Resource title',
            required: true,
            choices: undefined
          },
          {
            type: 3,
            name: 'description',
            description: 'Resource description',
            required: true,
            choices: undefined
          },
          {
            type: 3,
            name: 'url',
            description: 'Resource URL',
            required: true,
            choices: undefined
          },
          {
            type: 3,
            name: 'categories',
            description: "Case insensitive comma or space separated list, e.g. 'JavaScript, module async,webhook'",
            required: true,
            choices: undefined
          },
          {
            type: 3,
            name: 'img',
            description: 'Image URL.',
            required: false,
            choices: undefined
          },
        ]
      },
      {
        type: 1,
        name: 'remove_resource',
        description: 'Remove a resource (Requires admin privilege).',
        options: []
      },
      {
        type: 1,
        name: 'add_categories',
        description: 'Add new resource categories.',
        options: [
          {
            type: 3,
            name: 'categories',
            description: "Case insensitive comma or space separated list, e.g. 'JavaScript, module async,webhook'",
            required: true,
            choices: undefined
          }
        ]
      }
    ],
    execute
  }
