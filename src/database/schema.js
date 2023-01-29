import { Schema, model } from "mongoose";

const bindSchema = new Schema({
    _id:    {type: String, require: true},
    author: {type: String, require: true},
    bind:   {type: String, require: true},
    year:   {type: String, require: true}
}, { timestamp: true })

const matchSchema = new Schema({
    _id:            {type: String, require: true},
    mapId:          {type: String, require: true},
    mapDescription: {type: String, require: true},
    win:            {type: String, require: true},
    lose:           {type: String, require: true},
    team:           {type: String, require: false},
    author:         {type: String, require: false},
    createdAt:      {type: String, require: true}
}, { timestamp: true })

const Bind = model('binds', bindSchema)
const Match = model('matchs', matchSchema)

export default { 
    Bind,
    bindSchema,
    Match,
    matchSchema
}
