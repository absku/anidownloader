import Scraper from "../core/scraper/index.js";
import jsdom from "jsdom";
import EpisodeInfo from "../core/EpisodeInfo/episodeInfo.js";

class AnimeFLVSerie {
    constructor() {
        this.name = "";
        this.synopsis = "";
        this.image = "";
        this.genres = [];
        this.episodes = [];
    }
}

class AnimeFLVEpisode {
    constructor() {
        this.links = [];
        this.name = "";
    }

    formatToEpisodeInfo(serie, server = "Zippyshare") {
        const episodeInfo = new EpisodeInfo();
        episodeInfo.link = this.links.find(link => link.server === server).url;
        episodeInfo.server = server;
        episodeInfo.serie = serie;
        episodeInfo.name = this.name;
        return episodeInfo;
    }
}

class AnimeFLVLink {
    constructor() {
        this.server = "";
        this.format = "";
        this.url = "";
    }
}

class AnimeFLV {
    constructor() {
        this.url = "https://animeflv.net";
    }

    async search(query) {
        const scraper = new Scraper(`${this.url}/browse?q=${query}`);
        const html = (await scraper.get_page()).html;
        const dom = new jsdom.JSDOM(html);
        const rows = dom.window.document.querySelectorAll("ul.ListAnimes li");
        const series = [];
        rows.forEach(row => {
            const serie = {};
            serie.url = row.querySelector("a").href;
            serie.name = row.querySelector("a h3").innerHTML;
            series.push(serie);
        });
        return series;
    }

    async getAnimeInfo(animeId) {
        const scraper = new Scraper(`${this.url}/anime/${animeId}`);
        const html = (await scraper.get_page()).html;
        const dom = new jsdom.JSDOM(html);
        const animeInfo = new AnimeFLVSerie();
        animeInfo.name = dom.window.document.querySelector("h1.Title").innerHTML;
        animeInfo.synopsis = dom.window.document.querySelector("div.Description p").innerHTML;
        animeInfo.image = this.url + dom.window.document.querySelector("div.Image img").src;
        const genres = dom.window.document.querySelectorAll("nav.Nvgnrs a");
        genres.forEach(genre => {
            animeInfo.genres.push(genre.innerHTML);
        });
        dom.window.document.querySelectorAll("script").forEach(script => {
            if (script.innerHTML.includes("var episodes = [")) {
                const episodesRAW = script.innerHTML.split("var episodes =")[1].split(";")[0];
                JSON.parse(episodesRAW).forEach(episode => {
                    animeInfo.episodes.push({
                        id: episode[0],
                        anime: animeId,
                        name: `${animeId}-${episode[0]}`
                    });
                });
            }
        });
        return animeInfo;
    }

    async getEpisode(animeId, episodeId) {
        const scraper = new Scraper(`${this.url}/ver/${animeId}-${episodeId}`);
        const html = (await scraper.get_page()).html;
        const dom = new jsdom.JSDOM(html);
        const episode = new AnimeFLVEpisode();
        episode.name = `${animeId}-${episodeId}`;
        const rows = dom.window.document.querySelectorAll("table.RTbl tbody tr")
        rows.forEach(row => {
            const link = new AnimeFLVLink();
            link.server = row.querySelector("td:nth-child(1)").innerHTML;
            link.format = row.querySelector("td:nth-child(3)").innerHTML;
            link.url = row.querySelector("td:nth-child(4) a").href;
            episode.links.push(link);
        });
        return episode;
    }
}

export { AnimeFLV, AnimeFLVSerie, AnimeFLVLink }