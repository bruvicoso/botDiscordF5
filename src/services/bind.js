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
    return await schema.Bind
        .find({ year })
        .exec()
}

export default { getRandom, listYear }
