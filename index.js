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
import Repository from './src/database/repository.js'

const { BOT_TOKEN, CLIENT_ID } = process.env
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
     try {
      let params = {
        mapId: interaction.options.getString('map_name'),
        status: interaction.options.getString('status')
      }
      await Repository.saveMatch(params)

      // if (maps) {
      //   await interaction.reply({
      //     content: `${status.toUpperCase()} no mapa ${mapName} atualizado!`,
      //     embeds: [embedCustom.EmbedMatch(
      //       await Repository.getMatchs()
      //     )] 
      //   });
      // } else {
        await interaction.reply({content: `Ocorreu um erro ao salvar`});
      // }
    } catch (error) {
      await interaction.reply({
        content: `Erro ao salvar! - ${error}`
      });
    }
  }

  if (interaction.commandName === 'resume') {
    await interaction.reply({ embeds: [embedCustom.EmbedTotalByYear] });
  }

  if (interaction.commandName === 'bind') {
    let randomBind = await Repository.getRandom()

    if (randomBind) {
      await interaction.reply({ 
        embeds: [
          embedCustom.ShowBind(randomBind)
        ] 
      });
    } else {
      await interaction.reply({content: `Ocorreu um erro`});
    }
  }

  if (interaction.commandName === 'bind_add') {
    try {
      const params = {
        bind: interaction.options.getString('message'),
        author: interaction.options.getString('author')
      }

      let newBind = await Repository.saveBind(params)
      await interaction.reply({
        content: `Salvo com sucesso!`,
        embeds: [
          embedCustom.ShowBind(newBind)
        ] 
      });  
    } catch (error) {
      await interaction.reply({
        content: `Erro ao salvar! - ${error}`
      });
    }
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
