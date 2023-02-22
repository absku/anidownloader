import { Nyaa } from './sources/nyaa.js';
import { AnimeFLV } from './sources/animeflv.js';
import ZippyshareDownloader from './core/ZippyshareDownloader/index.js';
import TorrentDownloader from './core/TorrentDownloader/index.js';
import { Serie, Episode } from './model/entitys.js';

function testNyaa() {
    const query = "[CameEsp] Kage no Jitsuryokusha ni Naritakute";
    const nyaa = new Nyaa();
    const nyaaSearch = nyaa.search(query);
    nyaaSearch.then((torrents) => {
        console.log(torrents.length);
        const torrentsFiltered = nyaa.filterTorrents(torrents, { leng: "ESP", quality: "1080p" });
        console.log(torrentsFiltered.length);
    });
}

function testAnimeflv() {
    const query = "kage-no-jitsuryokusha-ni-naritakute";
    const animeflv = new AnimeFLV();
    const animeflvSearch = animeflv.search(query);
    animeflvSearch.then((torrents) => {
        console.log(torrents);
    });
    const animeflvInfo = animeflv.getAnimeInfo(query);
    animeflvInfo.then((info) => {
        console.log(info);
    });
    const animeflvEpisodeLinks = animeflv.getEpisode('kage-no-jitsuryokusha-ni-naritakute', 20);
    animeflvEpisodeLinks.then((links) => {
        console.log(links);
    });
}

function testEntitys() {
    Serie.findAll({
        attributes: ['name', 'internalName', 'fansub', 'day', 'leng', 'quality', 'source'],
    }).then((series) => {
        series.forEach(serie => {
            console.log(serie.name);
        });
    });
}

async function get_series_by_sources(sources) {
    const series = await Serie.findAll({ where: { source: sources } });
    return series;
}

async function get_series() {
    return await Serie.findAll();
}

async function is_chapter_downloaded(title) {
    const episode = await Episode.findOne({ where: { title: title } });
    return episode != null;
}

async function get_pending_episodes_animeflv(serie) {
    const animeflv = new AnimeFLV();
    const animeflvInfo = await animeflv.getAnimeInfo(serie.internalName);
    return new Promise((resolve, reject) => {
        const episodes = [];
        animeflvInfo.episodes.forEach(episode => {
            is_chapter_downloaded(episode.name).then((isDownloaded) => {
                if (!isDownloaded) {
                    animeflv.getEpisode(episode.anime, episode.id).then((animeflvEpisode) => {
                        episodes.push(animeflvEpisode.formatToEpisodeInfo());
                        if (episodes.length == animeflvInfo.episodes.length) {
                            resolve(episodes);
                        }
                    })
                }
            });
        });
    });
}

async function get_pending_episodes_nyaa(serie) {
    const nyaa = new Nyaa();
    const nyaaSearch = await nyaa.search(serie.internalName);
    const nyaaEpisodes = nyaa.filterTorrents(nyaaSearch, { leng: serie.leng, quality: serie.quality });
    /* const episodes = [];
    nyaaEpisodes.forEach(episode => {
        is_chapter_downloaded(episode.name).then((isDownloaded) => {
            console.log(`${episode.name} - ${isDownloaded}`);
            if (!isDownloaded) {
                episodes.push(episode);
            }
        });
    });
    return episodes; */
    return new Promise((resolve, reject) => {
        const episodes = [];
        nyaaEpisodes.forEach(episode => {
            is_chapter_downloaded(episode.name).then((isDownloaded) => {
                if (!isDownloaded) {
                    episodes.push(episode);
                }
                if (episodes.length == nyaaEpisodes.length) {
                    resolve(episodes);
                }
            });
        });
    });
}

function get_pending_episodes(serie) {
    switch (serie.source) {
        case "nyaa":
            return get_pending_episodes_nyaa(serie);
        case "animeflv":
            return get_pending_episodes_animeflv(serie);
        default:
            break;
    }
}

async function process_series(series) {
    let series_to_process = [...series];
    const process_serie = async () => {
        if (series_to_process.length > 0) {
            const serie = series_to_process.pop();
            console.log(`Processing serie: ${serie.name}`);
            get_pending_episodes(serie).then((episodes) => {
                console.log(`${serie.name} - Episodes to download: ${episodes.length}`);
                episodes.forEach(episode => {
                    console.log(episode.title);
                });
            });
            await process_serie();
        }
    }
    await process_serie();
}

async function main() {
    const series = await get_series_by_sources(['nyaa']);
    // const series = await get_series_by_sources(['animeflv']);
    process_series(series);
}

main();