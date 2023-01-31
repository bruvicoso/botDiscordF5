import { SlashCommandBuilder } from "discord.js"
import Repository from './../database/repository.js'

// const mapsName = await Repository.getAllMaps()

const mapsName = [
  { name: 'Ancient', value: 'ancient' },
  { name: 'Anubis', value: 'anubis' },
  { name: 'Cache', value: 'cache' },
  { name: 'Cobblestone', value: 'cobble' },
  { name: 'Dust 2', value: 'dust2' },
  { name: 'Inferno', value: 'inferno' },
  { name: 'Mirage', value: 'mirage' },
  { name: 'Nuke', value: 'nuke' },
  { name: 'Overpass', value: 'overpass' },
  { name: 'Train', value: 'train' },
  { name: 'Vertigo', value: 'vertigo' }
]

const ListMaps = await new SlashCommandBuilder()
  .setName("list_maps")
  .setDescription("Send the statistics")

const MapStatus = await new SlashCommandBuilder()
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

const UpdateMap = await new SlashCommandBuilder()
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

const Resume = await new SlashCommandBuilder()
  .setName("resume")
  .setDescription("Resumo das estatisticas")

const Bind = await new SlashCommandBuilder()
  .setName("bind")
  .setDescription("Pegar uma bind random!")

const BindAdd = await new SlashCommandBuilder()
  .setName("bind_add")
  .setDescription("Adicionar uma nova Bind!")
  .addStringOption(option =>
		option.setName("message")
      .setDescription("Qual foi a pérola?")
      .setRequired(true))
  .addStringOption(option =>
		option.setName("author")
      .setDescription("Quem foi o autor?")
      .setRequired(true))

export default { MapStatus, UpdateMap, Resume, Bind, BindAdd, ListMaps }
