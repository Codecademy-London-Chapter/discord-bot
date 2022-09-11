// add this in all slash command files to use to build the slash command
const { SlashCommandBuilder } = require('@discordjs/builders');

// feature to allow someone to type /breakreminder <time period> and the bot will message them with an @user to remind them to take a break after the time period. Feel free to change the .setName, and copy and paste from optionscheck.js as a start on taking inputs. 

//exporting the slash command object it is set to equal
const breakReminder = new SlashCommandBuilder()
	.setName('breakreminder') //setting name of slash command
	.setDescription('Sets an interval to remind you to take a break!'); //setting description of slash command, will come up when used on discord
	// .addStringOption(option => option.setName('choice1') 

//async function, this is where your code for the functionality of the feature will go.
const execute = async (client, interaction) => {
	await interaction.followUp({
		ephemeral: true,
		content: 'TODO'
	});
};

breakReminder.execute = execute;

module.exports = breakReminder;
 