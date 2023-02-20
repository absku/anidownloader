import Scraper from "../core/scraper/index.js";
import jsdom from "jsdom";

class AnimeFLV {
    constructor() {
        this.url = "https://animeflv.net";
    }

    async search(query) {
        const scraper = new Scraper(`${this.url}/browse?q=${query}`);
        const html = (await scraper.get_page()).html;
        const dom = new jsdom.JSDOM(html);
        const rows = dom.window.document.querySelectorAll("ul.ListAnimes li");
        const torrents = [];
        rows.forEach(row => {
            const torrent = {};
            torrent.url = row.querySelector("a").href;
            torrent.name = row.querySelector("a h3").innerHTML;
            torrents.push(torrent);
        });
        return torrents;
    }

    async getAnimeInfo(animeId) {
        const scraper = new Scraper(`${this.url}/anime/${animeId}`);
        const html = (await scraper.get_page()).html;
        const dom = new jsdom.JSDOM(html);
        const animeInfo = {};
        animeInfo.name = dom.window.document.querySelector("h1.Title").innerHTML;
        animeInfo.synopsis = dom.window.document.querySelector("div.Description p").innerHTML;
        animeInfo.image = this.url + dom.window.document.querySelector("div.Image img").src;
        animeInfo.genres = [];
        const genres = dom.window.document.querySelectorAll("nav.Nvgnrs a");
        genres.forEach(genre => {
            animeInfo.genres.push(genre.innerHTML);
        });
        animeInfo.episodes = [];
        dom.window.document.querySelectorAll("script").forEach(script => {
            if (script.innerHTML.includes("var episodes = [")) {
                const episodesRAW = script.innerHTML.split("var episodes =")[1].split(";")[0];
                JSON.parse(episodesRAW).forEach(episode => {
                    animeInfo.episodes.push({
                        id: episode[0],
                        anime: animeId
                    });
                });
            }
        });
        return animeInfo;
    }

    async getLinks(animeId, episodeId) {
        const scraper = new Scraper(`${this.url}/ver/${animeId}-${episodeId}`);
        const html = (await scraper.get_page()).html;
        const dom = new jsdom.JSDOM(html);
        const links = [];
        const rows = dom.window.document.querySelectorAll("table.RTbl tbody tr")
        rows.forEach(row => {
            const link = {};
            link.server = row.querySelector("td:nth-child(1)").innerHTML;
            link.format = row.querySelector("td:nth-child(3)").innerHTML;
            link.url = row.querySelector("td:nth-child(4) a").href;
            links.push(link);
        });
        return links;
    }
}

export default AnimeFLV;