import http from "http";
import 'dotenv/config';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import Repository from "../../database/repository.js";
import NodeCache from "node-cache"

const { WS_HOST, WS_PORT, CHANNEL_ALERT_ID } = process.env
const cache = new NodeCache({ stdTTL: 3600});

async function wsGame(client = false) {
    console.log("Initializing HTTP Server");

    const server = await http.createServer( function(req, res) {
        if (req.method == 'POST') { 
            let body = {};
            req.on('data', function (data) {
                body = JSON.parse(data);
            });

            req.on('end', async function () {
                try {
                    //Phase - WARMUP
                    if (body.map?.phase == "warmup") {
                        res.end('')
                        return;
                    }

                    //Phase - LIVE
                    if (body.map?.phase == "live") {
                    // set cache stats player
                        if (body.provider?.steamid == body.player?.steamid) {
                            cache.set(body.provider.steamid, {name: body.player.name, stats: body.player.match_stats}, 3600); 
                        }
                    }

                    //check round activity
                    const scoreCT = body.map?.team_ct?.score;
                    const scoreTR = body.map?.team_t?.score;
                    if (body.map?.round) {
                        console.log(`Round ${body.map?.round}: CT ${scoreCT} - TR ${scoreTR}`);

                        if (client) {
                            client.user.setActivity({
                                name: ` - ${body.map?.name} | Round ${body.map?.round}: CT ${scoreCT} - TR ${scoreTR}`
                            })
                        }
                    }

                    //Phase - GAME OVER
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
                            
                            client.channels.cache.get(CHANNEL_ALERT_ID).send({ 
                                content: `Confirmar jogo?\nMap: ${body.map.name}\n${playerWin}`,
                                components: [row] 
                            }).then((message) => {
                                setTimeout(() => {
                                    client.user.setPresence({ activity: null })
                                    message.delete().catch(() => console.log('[WARNING] Message not exists'));
                                    Repository.deleteMatchTemp(matchId)
                                }, 120000)
                            })
                        }

                        if (cache.has(body.provider.steamid)) {
                            const session = cache.get(body.provider.steamid)
                            cache.del(body.provider.steamid)
                            if (session.stats) {
                                let cachePayload = {
                                    steamId: body.provider.steamid,
                                    name: session.name,
                                    map: body.map.name,
                                    stats: session.stats
                                }

                                // await Repository.updateOneMatch(params)
                                Repository.saveStatsPlayer(cachePayload)
                            }
                        }

                        setTimeout(() => {
                            res.writeHead(200, { 'Content-Type': 'text/plain' });
                            console.log('Game Over!')
                            cache.flushAll();
                            res.end('')
                        } , 30000);
                    } else {
                        res.writeHead(200, { 'Content-Type': 'text/plain' });
                        res.end('')
                    }
                } catch (error) {
                    console.log('Error HTTP: ', error)
                }
            });
        }
        else
        {
            console.log("Not expecting other request types...");
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end('')
        }
    });

    await server.listen(WS_PORT, WS_HOST);
    console.log('Listening at http://' + WS_HOST + ':' + WS_PORT);
};

export default { 
    wsGame
}
