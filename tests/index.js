import { Nyaa } from './sources/nyaa.js';
import { AnimeFLV } from './sources/animeflv.js';
import ZippyshareDownloader from './core/ZippyshareDownloader/index.js';
import TorrentDownloader from './core/TorrentDownloader/index.js';
import { Serie } from './model/entitys.js';

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

function testZippshareDownload() {
    const zippyshareDownloader = new ZippyshareDownloader();
    zippyshareDownloader.download("https://www97.zippyshare.com/v/mdEfUzJM/file.html", "H:/");
    zippyshareDownloader.download("https://www55.zippyshare.com/v/QoFwzyUF/file.html", "H:/");
}

function testTorrentDownload() {
    const torrentDownloader = new TorrentDownloader();
    const magnet = "magnet:?xt=urn:btih:1f3849bf601e8ed9f3be6efd8f4645b9909b4fcf&dn=%5BErai-raws%5D%20Eiyuu%20Ou%2C%20Bu%20o%20Kiwameru%20Tame%20Tenseisu%20-%20Soshite%2C%20Sekai%20Saikyou%20no%20Minarai%20Kishi%20-%2007%20%5B480p%5D%5BMultiple%20Subtitle%5D%20%5BENG%5D%5BPOR-BR%5D%5BSPA-LA%5D%5BSPA%5D%5BARA%5D%5BFRE%5D%5BGER%5D%5BITA%5D%5BRUS%5D&tr=http%3A%2F%2Fnyaa.tracker.wf%3A7777%2Fannounce&tr=udp%3A%2F%2Fopen.stealth.si%3A80%2Fannounce&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce&tr=udp%3A%2F%2Fexodus.desync.com%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.torrent.eu.org%3A451%2Fannounce";
    torrentDownloader.download(magnet, "H:/a/");
}

function testEntitys(){
    Serie.findAll({
        attributes: ['name', 'internalName', 'fansub', 'day', 'leng', 'quality', 'source'],
      }).then((series) => {
        series.forEach(serie => {
            console.log(serie.name);
        });
    });
}