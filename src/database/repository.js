import schema from './../database/schema.js'

async function getRandom() {
    const count = await schema.Bind
        .count()
        .exec()

    const random = Math.floor(Math.random() * count)

    return await schema.Bind
        .findOne()
        .skip(random)
        .exec()
}

async function listYear(year = '2023') {
    return await schema.Match
    .aggregate(
    [
      {
        $group: { 
            _id: null,
            totalWin: {$sum: "$win"},
            totalLose: {$sum: "$lose"},
            totalMatch: {$sum: {$sum: ["$win", "$lose"]}}
        }
      }
    ])
}

async function getMatchs() {
    return await schema.Match
        .find()
        .sort({winrate: -1})
        .limit(7)
        .exec()
}

async function saveBind(params) {
    return await (new schema.Bind({
        author: params.author,
        bind: params.bind,
        year: new Date().getFullYear()
    })).save()
}

async function updateOneMatch(params) {
    const match = (await schema.Match
        .findOne({
            mapId: params.mapId,
            createdAt: {
                $gte: new Date(new Date().getFullYear(), 0, 1)
            }
        })
        .exec()) || {win: 0, lose: 0}

    params.status == 'vitoria' ? match.win += 1 : match.lose += 1
    const total = match.win + match.lose
    const winrate = match.win / total * 100 

    if (match.mapName === undefined) {
        const map = await findMapById(params.mapId)
        
        return await (new schema.Match({
            mapId:   map.value,
            mapName: map.name,
            win:     parseInt(match.win),
            lose:    parseInt(match.lose),
            winrate: winrate.toFixed(2),
            timestamps: true
        })).save()
    }

    return await schema.Match.findByIdAndUpdate(match._id, 
    {
        win:     parseInt(match.win),
        lose:    parseInt(match.lose),
        winrate: winrate.toFixed(2)
    });
}

async function saveMatchTemp(params) {
    const match = await (new schema.MatchsApprove({
        mapId: params.mapId.split('_')[1],
        win: params.win,
        steamId: params.steamId
    })).save()
    
    return match._id.toString()
}

async function getMatchTemp(id) {
    return await schema.MatchsApprove.findById(id).exec()
}

async function deleteMatchTemp(id) {
    return await schema.MatchsApprove.deleteOne({_id: id})
}

async function saveStatsPlayer(params) {
    const player = (await schema.PlayerStats
        .findOne({
            steamId: params.steamId
        })
        .exec())

    if (player) {
        console.log("Finded player")

        let stats = params.stats
        if (player.statsMap[params.map]) {
            stats = {}
            Object.keys(params.stats).forEach(key => {
                if (player.statsMap[params.map].hasOwnProperty(key)) {
                    stats[key] = params.stats[key] + player.statsMap[params.map][key]
                }
            })
        }

        stats.kd = calcKD(stats)
        stats.kda = calcKDA(stats)

        player.statsMap[params.map] = stats
        return await schema.PlayerStats.findByIdAndUpdate(player._id, player);
    }

    console.log("Creating a new player stats...")
    params.stats.kd = calcKD(params.stats)
    params.stats.kda = calcKDA(params.stats)

    let payload = JSON.parse(`{
        "steamId": "${params.steamId}",
        "nick":    "${params.name}",
        "statsMap": {
            "${params.map}": ${JSON.stringify(params.stats)}
        }
    }`)

    return await (new schema.PlayerStats(payload)).save()
}

function calcKD(stats) {
    return stats.kills / stats.deaths
}

function calcKDA(stats) {
    return (stats.kills + stats.assists) / stats.deaths
}

async function findMapById(mapId) {
    return await schema.Maps.findOne({value: mapId}).exec()
}

async function statsPlayerDiscordId(discordId) {
    return await schema.PlayerStats.findOne({ discordId }).exec()
}

async function updateStatusMatch(params) {
    const match = (await schema.Match
        .findOne({
            mapId: params.mapId,
            createdAt: {
                $gte: new Date(new Date().getFullYear(), 0, 1)
            }
        })
        .exec()) || {win: params.win, lose: params.lose}

    const total = match.win + match.lose
    const winrate = match.win / total * 100 

    if (match.mapName === undefined) {
        const map = await findMapById(params.mapId)
        
        return await (new schema.Match({
            mapId:   map.value,
            mapName: map.name,
            win:     parseInt(params.win),
            lose:    parseInt(params.lose),
            winrate: winrate.toFixed(2)
        })).save()
    }

    return await schema.Match.findByIdAndUpdate(match._id, 
    {
        win:     parseInt(params.win),
        lose:    parseInt(params.lose),
        winrate: winrate.toFixed(2)
    });
}

async function resumeByYear() {
    const mapsStatus = (await schema.Match
        .aggregate([{
            $facet: {
                worseMap: [{ $sort: { winrate:  1 } }, { $limit: 1 }],
                bestMap: [{ $sort: { winrate: -1 } }, { $limit: 1 }] 
            }
        }])
        .exec())

    const winRate = (await schema.Match
        .aggregate([{
            $group: {
                _id: null,
                totalWin: { $sum: { $sum: "$win" } },
                totalLose: { $sum: { $sum: "$lose" } },
            }
        }])
        .exec())

    const win = winRate[0]?.totalWin || 0
    const lose = winRate[0]?.totalLose || 0
    const total = win + lose
    const winrate = (win / total * 100).toFixed(2)
    
    return {
        bestMap: mapsStatus[0]?.bestMap[0]?.mapName || {},
        worseMap: mapsStatus[0]?.worseMap[0]?.mapName || {},
        totalWin: winRate[0]?.totalWin || {},
        totalLose: winRate[0]?.totalLose || {},
        winrate
    }
}

async function listExecByMap(mapId) {
    let execs = await schema.Exec
    .find({mapId}, '-_id')
    .sort({value: 1})
    .exec()

    if (execs.length === 0) {
        throw new Error('Não foi encontrado registro nesse mapa!')
    }

    return execs
}

async function saveExecListByMap(params) {
    return await (new schema.Exec({
        mapId:       params.mapId,
        playlist:    params.playlist,
        description: params.description,
        timestamps:  true
    })).save()
}

async function getAllMaps() {
    return await schema.Maps
        .find({}, '-_id')
        .sort({value: 1})
        .exec()
}

export default { 
    getRandom,
    listYear,
    getMatchs,
    saveBind,
    updateOneMatch,
    saveMatchTemp,
    getMatchTemp,
    deleteMatchTemp,
    saveStatsPlayer,
    updateStatusMatch,
    statsPlayerDiscordId,
    listExecByMap,
    saveExecListByMap,
    findMapById,
    getAllMaps,
    resumeByYear
}
