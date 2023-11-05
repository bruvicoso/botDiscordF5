import { SlashCommandBuilder } from "discord.js"
import Repository from './../database/repository.js'

export default (async () => {
  return await Repository.getAllMaps()
  .then(mapsName => {
    mapsName = JSON.parse(JSON.stringify(mapsName))

    const ListMaps = new SlashCommandBuilder()
    .setName("list_maps")
    .setDescription("Send the maps statistics")

    const StatsPlayer = new SlashCommandBuilder()
    .setName("stats")
    .setDescription("Send the player statistics")

    const MapStatus = new SlashCommandBuilder()
      .setName("map")
      .setDescription("Enviar as estatísticas das partidas!")
      .addStringOption(option =>
        option.setName("map_name")
          .setDescription("Qual é o mapa?")
          .setRequired(true)
          .setChoices(...mapsName))
      .addStringOption(option =>
        option.setName("status")
          .setDescription("Qual é o status?")
          .setRequired(true)
          .setChoices(
            {
              "name": "Vitória",
              "value": "vitoria"
            },
            {
              "name": "Derrota",
              "value": "derrota"
            }
          ))

    const UpdateMap = new SlashCommandBuilder()
      .setName("update_map")
      .setDescription("Atualizar as estatisticas do mapa!")
      .addStringOption(option =>
        option.setName("map_name")
          .setDescription("Qual é o mapa?")
          .setRequired(true)
          .setChoices(...mapsName))
      .addIntegerOption(option =>
        option.setName("win")
          .setDescription("Quantas vitórias?")
          .setRequired(true))
      .addIntegerOption(option =>
        option.setName("lose")
          .setDescription("Quantas derrotas?")
          .setRequired(true))

    const Resume = new SlashCommandBuilder()
      .setName("resume")
      .setDescription("Resumo das estatisticas")

    const Bind = new SlashCommandBuilder()
      .setName("bind")
      .setDescription("Pegar uma bind random!")

    const BindAdd = new SlashCommandBuilder()
      .setName("add_bind")
      .setDescription("Adicionar uma nova Bind!")
      .addStringOption(option =>
        option.setName("message")
          .setDescription("Qual foi a pérola?")
          .setRequired(true))
      .addStringOption(option =>
        option.setName("author")
          .setDescription("Quem foi o autor?")
          .setRequired(true))

    const Exec = new SlashCommandBuilder()
      .setName("exec")
      .setDescription("Mostrar execução em um mapa especifico!")
      .addStringOption(option =>
        option.setName("map_playlist")
          .setDescription("Qual mapa?")
          .setRequired(true)
          .setChoices(...mapsName))

    const ExecList = new SlashCommandBuilder()
      .setName("add_exec")
      .setDescription("Adicionar um link de execução!")
      .addStringOption(option =>
        option.setName("map_exec")
          .setDescription("Qual é o mapa?")
          .setRequired(true)
          .setChoices(...mapsName))
      .addStringOption(option =>
        option.setName("description")
          .setDescription("Uma breve descrição da execução.")
          .setRequired(true))
      .addStringOption(option =>
        option.setName("playlist")
          .setDescription("Link da playlist.")
          .setRequired(true))
    
    return [
      MapStatus,
      UpdateMap,
      Resume,
      Bind,
      BindAdd,
      Exec,
      ExecList,
      ListMaps,
      StatsPlayer
    ]
  })
})()
