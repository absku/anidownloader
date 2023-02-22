import { Nyaa } from './sources/nyaa.js';
import { AnimeFLV } from './sources/animeflv.js';
import { Serie, Episode } from './model/entitys.js';
import EpisodeDownloadManager from './core/EpisodeDownloadManager/episodeDownloadManager.js';

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

async function get_episodes_animeflv(serie) {
    const animeflv = new AnimeFLV();
    const animeflvInfo = await animeflv.getAnimeInfo(serie.internalName);
    return animeflvInfo.episodes;
}

async function get_episodes_nyaa(serie) {
    const nyaa = new Nyaa();
    const nyaaSearch = await nyaa.search(serie.internalName);
    const nyaaEpisodes = nyaa.filterTorrents(nyaaSearch, { leng: serie.leng, quality: serie.quality });
    return nyaaEpisodes;
}

function get_episodes(serie) {
    switch (serie.source) {
        case "nyaa":
            return get_episodes_nyaa(serie);
        case "animeflv":
            return get_episodes_animeflv(serie);
        default:
            break;
    }
}

async function process_series(series) {
    let series_to_process = [...series];
    let episodesForDownload = [];

    const process_serie = async () => {
        if (series_to_process.length > 0) {
            const serie = series_to_process.pop();
            const epFound = await get_episodes(serie);
            while (epFound.length > 0) {
                const episode = epFound.pop();
                const is_downloaded = await is_chapter_downloaded(episode.name);
                if (!is_downloaded) {
                    let ep;
                    if (serie.source == "animeflv") {
                        const animeflv = new AnimeFLV();
                        ep = (await animeflv.getEpisode(episode.anime, episode.id)).formatToEpisodeInfo(serie);
                    } else {
                        ep = episode.formatToEpisodeInfo(serie);
                    }
                    ep.createPath('H:/Anime/');
                    episodesForDownload.push(ep);
                }
            }
        }
    }
    while (series_to_process.length > 0) {
        await process_serie();
    }

    return episodesForDownload;
}

async function saveEpisodesDownloaded(episodes) {
    for (let i = 0; i < episodes.length; i++) {
        const episode = episodes[i];
        const episodeEntity = await Episode.create({
            title: episode.name
        })
        await episodeEntity.setSerie(episode.serie);
    }
}

async function main() {
    const series = await get_series_by_sources(['nyaa', 'animeflv']);
    const episodes = await process_series(series);
    const episodeDownloadManager = new EpisodeDownloadManager();
    episodes.forEach(episode => {
        episodeDownloadManager.addEpisode(episode);
    });
    await episodeDownloadManager.start();
    await saveEpisodesDownloaded(episodes);
    console.log("Done");
}

main();