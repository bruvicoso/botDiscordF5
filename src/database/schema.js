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

const MatchsApproveSchema = new Schema({
    mapId:     {type: String, require: true},
    win:       {type: Boolean, require: true},
    steamId:   {type: String, require: false},
    discordId: {type: String, require: false}
}, { timestamp: true })

const PlayerStatsSchema = new Schema({
    steamId:   {type: String, require: true},
    nick:      {type: String, require: true},
    statsMaps: {
        map: {
            kills:   {type: Number, require: true},
            deaths:  {type: Number, require: true},
            assists: {type: Number, require: true},
            mvps:    {type: Number, require: true},
            score:   {type: String, require: false},
        }
    }
}, { timestamp: true })

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
const MatchsApprove = model('matchs_approve', MatchsApproveSchema)
const PlayerStats = model('player_stats', PlayerStatsSchema)

export default { 
    Bind,
    bindSchema,
    Match,
    matchSchema,
    Maps,
    mapSchema,
    Exec,
    execSchema,
    MatchsApprove,
    MatchsApproveSchema,
    PlayerStats,
    PlayerStatsSchema
}
