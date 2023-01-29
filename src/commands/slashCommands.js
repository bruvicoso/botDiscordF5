import { SlashCommandBuilder } from "discord.js"
import MapsName from "./mapName.js";

const MapStatus = await new SlashCommandBuilder()
  .setName("map")
  .setDescription("Send the statistics")
  .addStringOption(option =>
    option.setName("map_name")
      .setDescription("Qual é o mapa?")
      .setRequired(true)
      .setChoices(...MapsName))
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
      .setChoices(...MapsName))
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

export default { MapStatus, UpdateMap, Resume, Bind, BindAdd }
