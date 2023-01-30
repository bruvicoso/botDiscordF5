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

async function getMaps() {
    return await schema.Match
        .find()
        .sort({updatedAt: -1})
        .limit(7)
        .exec()
}

export default { getRandom, listYear, getMaps }
