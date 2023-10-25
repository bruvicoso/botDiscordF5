import http from "http";
import 'dotenv/config';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import Repository from "../../database/repository.js";
import NodeCache from "node-cache"

const { WS_HOST, WS_PORT } = process.env
const cache = new NodeCache({ stdTTL: 3600});

async function wsGame(client = false) {
    console.log("Initializing HTTP Server");

    const server = await http.createServer( function(req, res) {
        if (req.method == 'POST') {
            res.writeHead(200, {'Content-Type': 'text/html'});

            var body = '';
            req.on('data', function (data) {
                body += data;
            });

            req.on('end', async function () {
                body = JSON.parse(body)

                if (body.provider.steamid == body.player.steamid) {
                    cache.set(body.provider.steamid, body.player.match_stats, 3600); 
                }

                const scoreCT = body.map?.team_ct?.score;
                const scoreTR = body.map?.team_t?.score;

                if (body.map?.round) {
                    console.log(`Round ${body.map?.round}: CT ${scoreCT} - TR ${scoreTR}`);

                    if (client) {
                        client.user.setActivity({
                            name: `Round ${body.map?.round}: CT ${scoreCT} - TR ${scoreTR}`
                        })
                    }
                }

                if (body.map?.phase == "warmup") {
                    cache.flushAll();
                }

                if (body.map?.phase == "gameover") {
                    let winner = "T";
                    if (scoreCT > scoreTR) {
                        winner = "CT";
                    }
                    const playerWin = body.player.team == winner ? "Vitória" : "Derrota";

                    if (client) {
                        client.user.setActivity({
                            name: `${playerWin} - ${body.map.name}!`
                        })

                        const params = {
                            mapId: body.map.name,
                            win: body.player.team == winner,
                            steamId: body.provider.steamid
                        }

                        const matchId = await Repository.saveMatchTemp(params)
                        const confirm = new ButtonBuilder()
                            .setCustomId(`confirm-${matchId}`)
                            .setLabel('Sim')
                            .setStyle(ButtonStyle.Success);

                        const cancel = new ButtonBuilder()
                            .setCustomId(`cancel-${matchId}`)
                            .setLabel('Não')
                            .setStyle(ButtonStyle.Secondary);

                        const row = new ActionRowBuilder()
                            .addComponents(confirm, cancel);
                        
                        client.channels.cache.get(`342158944409747457`).send({ 
                            content: `Confirmar jogo?\nMap: ${body.map.name}\n${playerWin}`,
                            components: [row] 
                        }).then((message) => {
                            setTimeout(() => {
                                message.delete()
                                Repository.deleteMatchTemp(matchId)
                            }, 120000)
                        })
                    }

                    if (cache.has(body.provider.steamid)) {
                        const stats = cache.get(body.provider.steamid)
                        cache.del(body.provider.steamid)

                        let cachePayload = {
                            steamId: body.provider.steamid,
                            nick: body.player.name,
                            map: body.map.name,
                            stats: {
                                kills: stats.kills,
                                deaths: stats.deaths,
                                assists: stats.assists,
                                mvps: stats.mvps,
                                score: stats.score
                            }
                        }
                        Repository.saveStatsPlayer(cachePayload)
                    }
                }
                res.end('');
            });
        }
        else
        {
            console.log("Not expecting other request types...");
            res.writeHead(200, {'Content-Type': 'text/html'});
            var html = '<html><body>HTTP Server at http://' + WS_HOST + ':' + WS_PORT + '</body></html>';
            res.end(html);
        }

    });

    await server.listen(WS_PORT, WS_HOST);
    console.log('Listening at http://' + WS_HOST + ':' + WS_PORT);
};

export default { 
    wsGame
}
