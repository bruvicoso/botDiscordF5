import { EmbedBuilder } from "discord.js";

const alertColor = '#ff9768'
const negativeColor = '#ae1717'
const positiveColor = '#1b7e48'

const thumbPositive = 'https://media.tenor.com/QK0jqC7t2FQAAAAj/poggers-pog.gif' // Win
const thumbNegative = 'https://media.tenor.com/gWs0s8QlsUgAAAAC/pepe-peppo.gif' // Lose

const mapsCS = [
    {
        "mapDescription": "Cache",
        "win":2,
        "lose":4
    },
    {
        "mapDescription": "Dust 2",
        "win":8,
        "lose":10
    },
    {
        "mapDescription": "Cache",
        "win":2,
        "lose":4
    },
    {
        "mapDescription": "Dust 2",
        "win":8,
        "lose":10
    },
    {
        "mapDescription": "Cache",
        "win":2,
        "lose":4
    },
    {
        "mapDescription": "Dust 2",
        "win":8,
        "lose":10
    },
    {
        "mapDescription": "Dust 2",
        "win":8,
        "lose":10
    }
]

let objMaps = []
mapsCS.forEach(mapCs => {
    objMaps = [...objMaps,
        { name: `_${mapCs.mapDescription}_`, value: ' ', inline: true },
        { name: ' ', value: `*${mapCs.win}*`, inline: true },
        { name: ' ', value: `*${mapCs.lose}*`, inline: true },
    ]
})

const EmbedMatch = new EmbedBuilder()
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

const EmbedTotalByYear = new EmbedBuilder()
    .setTitle('Resumo de 2023')
    .setColor(negativeColor)
    .setFields(
        { name: 'WIN 🟢', value: '57', inline: true },
        { name: ' ', value: ' ', inline: true },
        { name: 'LOSE 🔻', value: '30', inline: true },
        { name: 'Melhor Mapa ❤️', value: 'Nuke', inline: true },
        { name: ' ', value: ' ', inline: true },
        { name: 'Pior Mapa 👌', value: 'Dust 2', inline: true }
    )
    .setThumbnail(thumbNegative)

function BindRandom(params) {
    console.log('Params', params)
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
