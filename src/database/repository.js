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
        .sort({updatedAt: -1})
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

async function saveMatch(params) {
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
        const map = await schema.Maps
            .findOne({
                value: params.mapId
            })
            .exec()
        
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
    saveMatch,
    getAllMaps
}
