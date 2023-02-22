import Scraper from "../core/scraper/index.js";
import jsdom from "jsdom";
import EpisodeInfo from "../core/EpisodeInfo/episodeInfo.js";

class Nyaa {
    constructor() {
        this.url = "https://nyaa.si";
    }

    async search(query) {
        const scraper = new Scraper(`${this.url}/?f=0&c=0_0&q=${query}`);
        const html = (await scraper.get_page()).html;
        const dom = new jsdom.JSDOM(html);
        const rows = dom.window.document.querySelectorAll("table.table.table-bordered.table-hover tbody tr");
        return new Promise((resolve, reject) => {
            const episodes = [];
            rows.forEach(row => {
                const episode = new NyaaEpisode();
                episode.url = row.querySelector("td:nth-child(2) a:not(.comments)").href;
                episode.name = row.querySelector("td:nth-child(2) a:not(.comments)").innerHTML;
                episode.magnet = row.querySelectorAll("td:nth-child(3) a")[1].href;
                episode.size = row.querySelector("td:nth-child(4)").innerHTML;
                episode.date = row.querySelector("td:nth-child(5)").innerHTML;
                episode.seeds = row.querySelector("td:nth-child(6)").innerHTML;
                episode.leeches = row.querySelector("td:nth-child(7)").innerHTML;
                episodes.push(episode);
            });
            resolve(episodes);
        });
    }

    filterTorrents(torrents, filters) {
        const filteredTorrents = torrents.filter(torrent => {
            if (filters.leng) {
                if (!torrent.name.includes(filters.leng)) {
                    return false;
                }
            }
            if (filters.quality) {
                if (!torrent.name.includes(filters.quality)) {
                    return false;
                }
            }
            return true;
        });
        return filteredTorrents;
    }
}

class NyaaEpisode {
    constructor() {
        this.url = "";
        this.name = "";
        this.magnet = "";
        this.size = "";
        this.date = "";
        this.seeds = "";
        this.leeches = "";
        this.server = "Torrent";
    }

    formatToEpisodeInfo(serie, server = "Torrent") {
        const episode = new EpisodeInfo();
        episode.link = this.magnet;
        episode.server = this.server;
        episode.serie = serie;
        episode.name = this.name;
        return episode;
    }
}

export { Nyaa, NyaaEpisode }