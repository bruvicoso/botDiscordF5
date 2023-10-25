import 'dotenv/config';
import { 
  Client,
  GatewayIntentBits,
  REST,
  Routes,
} from "discord.js";

import connectDB from './src/database/mongo.js';
import Repository from './src/database/repository.js'
import embedCustom from './src/commands/embedMatch.js';
import commandsCustom from './src/commands/slashCommands.js';
import GSI from './src/service/gsi/index.js'

const { BOT_TOKEN, CLIENT_ID } = process.env

const rest = new REST({ version: '10' }).setToken(BOT_TOKEN);

(async () => {
  try {
    const commands = await commandsCustom
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
    client.login(BOT_TOKEN);
  } catch (error) {
    console.error(error);
  }
})();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions
  ]
});

client.on('ready', () => {
  console.log("Bot online 🚀")
  GSI.wsGame(client)
});

client.on('interactionCreate', async interaction => {
  if (interaction.isButton()) {

    if (interaction.message) {
      await interaction.message.delete();
    }
    const buttonId = interaction.customId.split('-')[0]
    const matchId = interaction.customId.split('-')[1]

    if (buttonId === 'confirm') {
      try {
        const match = await Repository.getMatchTemp(matchId)
        if (!match) {
          return await interaction.reply({
            content: `Partida temporaria não encontrada!`
          });
        }

        const params = {
          mapId: match.mapId,
          status: match.win ? 'vitoria' : 'derrota'
        }

        await Repository.updateOneMatch(params)
        await interaction.reply({
          content: `${params.status.toUpperCase()} no mapa ${params.mapId} atualizado!`,
          embeds: [embedCustom.EmbedMatch(
            await Repository.getMatchs()
          )] 
        })
        .catch(collected => {
          return interaction.reply({
            content: `Erro ao salvar! - ${collected}`
          });
        });
      } catch (error) {
        return await interaction.reply({
          content: `Erro ao salvar! - ${error}`
        });
      }
    }

    Repository.deleteMatchTemp(matchId)
    return;
  }
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'list_maps') {
    try {
      await interaction.reply({
            embeds: [embedCustom.EmbedMatch(
              await Repository.getMatchs()
            )] 
          });
    } catch (error) {
      await interaction.reply({
        content: `Erro ao salvar! - ${error}`
      });
    }
  }

  if (interaction.commandName === 'map') {
     try {
      const params = {
        mapId: interaction.options.getString('map_name'),
        status: interaction.options.getString('status')
      }

      await Repository.updateOneMatch(params)
      await interaction.reply({
        content: `${params.status.toUpperCase()} no mapa ${params.mapId} atualizado!`,
        embeds: [embedCustom.EmbedMatch(
          await Repository.getMatchs()
        )] 
      })
      .catch(collected => {
        console.log(`Ocorreu um erro: ${collected}`);
      });
    } catch (error) {
      await interaction.reply({
        content: `Erro ao salvar! - ${error}`
      });
    }
  }

  if (interaction.commandName === 'update_map') {
    try {
      const params = {
        mapId: interaction.options.getString('map_name'),
        win: interaction.options.getInteger('win'),
        lose: interaction.options.getInteger('lose')
      }

      await Repository.updateStatusMatch(params)
      await interaction.reply({
        content: `Update Realizado!`,
        embeds: [embedCustom.EmbedMatch(
            await Repository.getMatchs()
          )]
      });

    } catch (error) {
      await interaction.reply({
        content: `Erro ao salvar! - ${error}`
      });
    }
  }

  if (interaction.commandName === 'resume') {
    const resume = await Repository.resumeByYear()
    await interaction.reply({
        content: `Autodestruição em 30s`,
        embeds: [embedCustom.EmbedTotalByYear(resume)]
      })
      .then(() => {
        setTimeout(() => interaction.deleteReply(), 30000)
      })
      .catch(collected => {
        console.log(collected);
      });
  }

  if (interaction.commandName === 'bind') {
    let randomBind = await Repository.getRandom()

    if (randomBind) {
      await interaction.reply({
        content: `Autodestruição em 30s`,
        embeds: [
          embedCustom.ShowBind(randomBind)
        ]
      }).then(() => {
        setTimeout(() => interaction.deleteReply(), 30000)
      })
      .catch(collected => {
        message.reply('Ocorreu um erro');
      });
    } else {
      await interaction.reply({content: `Ocorreu um erro`});
    }
  }

  if (interaction.commandName === 'add_bind') {
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

  if (interaction.commandName === 'exec') {
     try {
      const mapId = interaction.options.getString('map_playlist')

      const map = await Repository.findMapById(mapId)
      await interaction.reply({
        embeds: [embedCustom.EmbedExec(
          map.name,
          await Repository.listExecByMap(mapId)
        )] 
      })
    } catch (error) {
      await interaction.reply({
        content: `${error}`
      });
    }
  }

  if (interaction.commandName === 'add_exec') {
    try {
      const params = {
        mapId:    interaction.options.getString('map_exec'),
        playlist: interaction.options.getString('playlist'),
        description: interaction.options.getString('description'),
      }

      await Repository.saveExecListByMap(params)
      await interaction.reply({
        content: `Salvo com sucesso!\nExecute o comando /exec para listar as execuções salvas.`,
      });  
    } catch (error) {
      await interaction.reply({
        content: `Erro ao salvar! - ${error}`
      });
    }
  }
});

client.on('messageReactionAdd', (reaction, user) => {
  // if (reaction.message.content == '<@&913202088647999538>') {}
  console.log('Count: ', reaction.count)
  console.log(reaction)

  let countReactions = 0

  reaction.message.awaitReactions({ max: 2, time: 60000, errors: ['time'] })
	.then(collected => {
		// const reaction = collected.first();
    console.log('collected', collected)
		countReactions++
    console.log(countReactions)
	})
	.catch(collected => {
		message.reply('you reacted with neither a thumbs up, nor a thumbs down.');
	});


  // let count = 1
  // console.log(reaction.message.reactions.map(react => {
  //   console.log(`Mensagem numero: ${count++}`)
  //   console.log(react.message.content)
  // }))
  // console.log(`O usuário com o ID ${user.id} reagiu à mensagem com a reação: ${reaction.emoji.name}`);
});

// client.on('messageReactionRemove', (reaction, user) => {
//   console.log(reaction.message.content == '@cs')
//   console.log(`O usuário com o ID ${user.id} reagiu à mensagem com a reação: ${reaction.emoji.name}`);
//   reaction.message.channel.send(`iiiii ala, Desistiu?! <@${user.id}>`)
// });
