import Scraper from "../core/scraper/index.js";
import jsdom from "jsdom";

class Nyaa {
    constructor() {
        this.url = "https://nyaa.si";
    }

    async search(query) {
        const scraper = new Scraper(`${this.url}/?f=0&c=0_0&q=${query}`);
        const html = (await scraper.get_page()).html;
        const dom = new jsdom.JSDOM(html);
        const rows = dom.window.document.querySelectorAll("table.table.table-bordered.table-hover tbody tr");
        const torrents = [];
        rows.forEach(row => {
            const torrent = new NyaaTorrent();
            torrent.url = row.querySelector("td:nth-child(2) a:not(.comments)").href;
            torrent.name = row.querySelector("td:nth-child(2) a:not(.comments)").innerHTML;
            torrent.magnet = row.querySelectorAll("td:nth-child(3) a")[1].href;
            torrent.size = row.querySelector("td:nth-child(4)").innerHTML;
            torrent.date = row.querySelector("td:nth-child(5)").innerHTML;
            torrent.seeds = row.querySelector("td:nth-child(6)").innerHTML;
            torrent.leeches = row.querySelector("td:nth-child(7)").innerHTML;
            torrents.push(torrent);
        });
        return torrents;
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

class NyaaTorrent {
    constructor() {
        this.url = "";
        this.name = "";
        this.magnet = "";
        this.size = "";
        this.date = "";
        this.seeds = "";
        this.leeches = "";
    }
}

export default Nyaa;