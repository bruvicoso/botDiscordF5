import { Schema, model } from "mongoose";

const bindSchema = new Schema({
    author: {type: String, require: true},
    bind:   {type: String, require: true},
    year:   {type: String, require: true}
}, { timestamps: { 
        createdAt: 'createdAt',
        updatedAt: 'updatedAt' 
    }
})

const matchSchema = new Schema({
    mapId:   {type: String, require: true},
    mapName: {type: String, require: true},
    win:     {type: Number, require: true},
    lose:    {type: Number, require: true},
    team:    {type: Array, require: false},
    winrate: {type: Number, require: true}
}, { timestamps: { 
        createdAt: 'createdAt',
        updatedAt: 'updatedAt' 
    }
})

const mapSchema = new Schema({
    name:  {type: String, require: true},
    value: {type: String, require: true},
}, { timestamp: true })

const execSchema = new Schema({
    mapId:  {type: String, require: true},
    playlist: {type: String, require: true},
    description: {type: String, require: true},
}, { timestamp: true })

const Bind = model('binds', bindSchema)
const Match = model('matchs', matchSchema)
const Maps = model('maps', mapSchema)
const Exec = model('exec', execSchema)

export default { 
    Bind,
    bindSchema,
    Match,
    matchSchema,
    Maps,
    mapSchema,
    Exec,
    execSchema
}
