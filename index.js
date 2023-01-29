import 'dotenv/config';
import { 
  Client,
  GatewayIntentBits,
  REST,
  Routes,
} from "discord.js";

import commandsCustom from './src/commands/slashCommands.js';
import embedCustom from './src/commands/embedMatch.js';
import connectDB from './src/database/mongo.js';
import BindService from './src/services/bind.js'

const { BOT_TOKEN, CLIENT_ID, DATABASE_URL } = process.env
const commands = [
  commandsCustom.MapStatus,
  commandsCustom.UpdateMap,
  commandsCustom.Resume,
  commandsCustom.Bind,
  commandsCustom.BindAdd
];
const rest = new REST({ version: '10' }).setToken(BOT_TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
    console.log('Successfully reloaded application (/) commands.');

    client.login(BOT_TOKEN);
  } catch (error) {
    console.error(error);
  }
})();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

connectDB

client.on('ready', () => {
  console.log("Bot online 🚀")
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'map') {
    const mapName = interaction.options.getString('map_name')
    const status = interaction.options.getString('status')
    
    await interaction.reply({
      content: `${status.toUpperCase()} no mapa ${mapName} atualizado!`,
      embeds: [embedCustom.EmbedMatch] 
    });
    // await interaction.followUp({ embeds: [EmbedTotalByYear] });
  }

  if (interaction.commandName === 'resume') {
    await interaction.reply({ embeds: [embedCustom.EmbedTotalByYear] });
  }

  if (interaction.commandName === 'bind') {
    let newBind = await BindService.getRandom()

    if (newBind) {
      await interaction.reply({ 
        embeds: [
          embedCustom.BindRandom(newBind)
        ] 
      });
    } else {
      console.error('newBindNotFound', newBind)
    }
  }

  if (interaction.commandName === 'bind_add') {
    await interaction.reply({ embeds: [embedCustom.BindRandom] });
  }

  if (interaction.commandName === 'update_map') {
    const data = interaction.options.get('update_map')
    
		await interaction.reply({ content: 'Update Realizado!', embeds: [embedCustom.EmbedMatch] });
  }
});

client.on('messageCreate', (message) => {
  return
  if (message.author.bot) return;

  console.log(message.content)

  message.channel.send('Hello')
});
