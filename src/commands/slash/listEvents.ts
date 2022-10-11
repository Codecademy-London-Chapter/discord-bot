import {
  Client,
  EmbedBuilder,
  CommandInteraction,
  ApplicationCommandType,
  CommandInteractionOptionResolver
} from 'discord.js';
import { DataSource } from 'typeorm';
import { format } from 'date-fns';
import Event from '../../entities/Event';
import handleError from '../../handlers/handleError';

import type { SlashCommand } from '../../types';

export default async function execute(
  client: Client,
  interaction: CommandInteraction,
  connection: DataSource,
  options?: Partial<CommandInteractionOptionResolver>
): Promise<void> {

  await interaction.deferReply({
    ephemeral: true
  });

  // get events >= now
  const eventRepository = connection.getRepository(Event);
  let events = null;
  try {
    events = await eventRepository
      .createQueryBuilder("events")
      .where("DATE(events.scheduled_at) >= CURRENT_DATE")
      .andWhere("events.deleted_at IS NULL")
      .orderBy("events.scheduled_at")
      .getMany();

    if (!events) {
      throw new Error('Error getting events')
    }
  } catch (e) {
    return await handleError(interaction, e.message);
  }

  // create list of events - EmbedBuilder is limited to 10 per message 
  const embed: EmbedBuilder[] = [];
  for (let i = 0; i < events.length && i < 10; i++) {
    const tmp = new EmbedBuilder()
      .setColor('#0099ff')
      .setURL(events[i].url)
      .setTitle(events[i].title)
      .setDescription(events[i].description)
      .addFields({
        name: `Scheduled`,
        value: format(events[i].scheduled_at, "dd-MM-yyyy"),
      })
      .setFooter({ text: 'Click the event title to register', iconURL: 'https://i.imgur.com/AfFp7pu.png' })
      .setTimestamp();
    embed.push(tmp);
  }

  try {
    await interaction.followUp({
      content: 'Scheduled events',
      embeds: embed
    })
  } catch (e) {
    return await handleError(interaction, e.message);
  }
}

export const listEvents: SlashCommand = {
  name: "list_events",
  description: "List scheduled events",
  type: ApplicationCommandType.ChatInput,
  execute
};
