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
            { name: `_${mapCs.mapDescription}_`, value: ' ', inline: true },
            { name: ' ', value: `*${mapCs.win}*`, inline: true },
            { name: ' ', value: `*${mapCs.lose}*`, inline: true },
        ]
    })

    return new EmbedBuilder()
    .setTitle("Partidas")
    .setDescription('Status das partidas em 2023')
    .setColor(alertColor)
    .setFields(
        { name: ' ', value: ' ', inline: true },
        { name: '🟢', value: ' ', inline: true },
        { name: '🔻', value: ' ', inline: true },
        ...objMaps
    )
    .setFooter(
        { text: 'Ultimos 7 mapas jogados!'}
    )
}

function EmbedTotalByYear(params) {
    const winRate = params.totalWin / params.totalMatch * 100
    return new EmbedBuilder()
    .setTitle('Resumo de 2023')
    .setDescription(`Winrate: ${winRate}`)
    .setColor(winRate >= 50 ? positiveColor : negativeColor)
    .setFields(
        { name: 'Vitórias 🟢', value: params.totalWin, inline: true },
        { name: ' ', value: ' ', inline: true },
        { name: 'Derrotas 🔻', value: params.totalLose, inline: true },
        { name: 'Melhor Mapa ❤️', value: params.bestMap, inline: true },
        { name: ' ', value: ' ', inline: true },
        { name: 'Pior Mapa 👌', value: params.worseMap, inline: true }
    )
    .setThumbnail(thumbNegative)
}

function BindRandom(params) {
    return new EmbedBuilder()
        .setColor(alertColor)
        .setFields(
            { name: params.bind, value: params.author }
        )
        .setFooter(
            { text:params.year}
        )
}

// const BindRandom = new EmbedBuilder()
//     .setColor(alertColor)
//     .setFields(
//         { name: '(_Contexto: Perdendo de 13x0, o time em silencio a um tempo pic velório_)\nVocês viram o aquário que quebrou em Berlin ?', value: 'ego, Dhi' }
//     )
//     .setFooter(
//         { text: '2022'}
//     )

export default { EmbedMatch, EmbedTotalByYear, BindRandom }
