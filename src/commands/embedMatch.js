import { EmbedBuilder } from "discord.js";

const alertColor = '#ff9768'
const negativeColor = '#ae1717'
const positiveColor = '#1b7e48'

const thumbPositive = 'https://media.tenor.com/QK0jqC7t2FQAAAAj/poggers-pog.gif'
const thumbNegative = 'https://media.tenor.com/gWs0s8QlsUgAAAAC/pepe-peppo.gif'

function EmbedMatch(maps) {
    let objMaps = []
    maps.forEach(mapCs => {
        objMaps = [...objMaps,
            { name: `_${mapCs.mapName}_`, value: `_Win Rate: ${mapCs.winrate}%_`, inline: true },
            { name: ' ', value: `*${mapCs.win}*`, inline: true },
            { name: ' ', value: `*${mapCs.lose}*`, inline: true },
        ]
    })

    return new EmbedBuilder()
    .setTitle("Partidas de 2023")
    .setDescription('As partidas estão ordenadas pelo Win Rate')
    .setColor(alertColor)
    .setFields(
        { name: ' ', value: ' ', inline: true },
        { name: '🟢', value: ' ', inline: true },
        { name: '🔻', value: ' ', inline: true },
        ...objMaps
    )
    .setFooter(
        { text: 'Limite de 7 mapas!'}
    )
}

function EmbedTotalByYear(params) {
    return new EmbedBuilder()
    .setTitle(`Resumo de 2023`)
    .setDescription(`Win Rate: ${params.winrate}%`)
    .setColor(params.winrate >= 50 ? positiveColor : negativeColor)
    .setFields(
        { name: 'Vitórias 🟢', value: `${params.totalWin}`, inline: true },
        { name: ' ', value: ' ', inline: true },
        { name: 'Derrotas 🔻', value: `${params.totalLose}`, inline: true },
        { name: 'Melhor Mapa ❤️', value: `${params.bestMap}`, inline: true },
        { name: ' ', value: ' ', inline: true },
        { name: 'Pior Mapa 👌', value: `${params.worseMap}`, inline: true }
    )
    .setThumbnail(params.winrate >= 50 ? thumbPositive : thumbNegative)
}

function EmbedPlayer(player, tagDiscord) {
    let objMaps = []
    Object.entries(player.statsMap).forEach(([map, stats]) => {  
        objMaps = [...objMaps,
            { name: `*${map}*`, value: ` `, inline: true },
            { name: ' ', value: `*${stats.kills} / ${stats.assists} / ${stats.deaths}*`, inline: true },
            { name: ' ', value: `*${stats.kd} / ${stats.kda}*`, inline: true },
        ]
    })

    return new EmbedBuilder()
        .setTitle(`${tagDiscord} - Estatística 2023`)
        .setDescription('As estatísticas estão ordenadas por KDA')
        .setColor(alertColor)
        .setFields(
            { name: 'Map', value: ' ', inline: true },
            { name: 'K / A / D', value: ' ', inline: true },
            { name: 'KD / KDA', value: ' ', inline: true },
            ...objMaps
        )
        .setFooter(
            { text: 'Limite de 7 linhas!'}
        )
}

function ShowBind(params) {
    return new EmbedBuilder()
        .setColor(alertColor)
        .setFields(
            { name: params.bind, value: params.author }
        )
        .setFooter(
            { text:params.year }
        )
}

function EmbedExec(mapName, execs) {
    let objExecs = []
    execs.forEach(exec => {
        objExecs = [...objExecs,
            { name: ' ', value: `${exec.description}`, inline: true },
            { name: ' ', value: `${exec.playlist}`, inline: true },
            { name: ' ', value: ' ', inline: true },
        ]
    })

    return new EmbedBuilder()
    .setTitle(`_${mapName}_ \n*Playlist no mapa*`)
    .setDescription('\0')
    .setColor('#FFC0CB')
    .setFields(
        { name: 'Descrição', value: ' ', inline: true },
        { name: 'Link', value: ' ', inline: true },
        { name: ' ', value: ' ', inline: true },
        ...objExecs
    )
    .setFooter(
        { text: '*Mostra apenas 7 execs por mapa!'}
    )
}

export default { EmbedMatch, EmbedTotalByYear, EmbedPlayer, EmbedExec, ShowBind }
