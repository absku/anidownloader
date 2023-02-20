import Nyaa from './sources/nyaa.js';
import AnimeFLV from './sources/animeflv.js';
import ZippyshareDownloader from './core/ZippyshareDownloader/index.js';

function testNyaa(){
    const query = "[CameEsp] Kage no Jitsuryokusha ni Naritakute";
    const nyaa = new Nyaa();
    const nyaaSearch = nyaa.search(query);
    nyaaSearch.then((torrents) => {
        console.log(torrents.length);
        const torrentsFiltered = nyaa.filterTorrents(torrents, {leng: "ESP", quality: "1080p"});
        console.log(torrentsFiltered.length);
    });
}

function testAnimeflv(){
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
    const animeflvEpisodeLinks = animeflv.getLinks('kage-no-jitsuryokusha-ni-naritakute', 20);
    animeflvEpisodeLinks.then((links) => {
        console.log(links);
    });
}

function testZippshareDownload(){
    const zippyshareDownloader = new ZippyshareDownloader();
    zippyshareDownloader.download("https://www97.zippyshare.com/v/mdEfUzJM/file.html", "H:/");
    zippyshareDownloader.download("https://www55.zippyshare.com/v/QoFwzyUF/file.html", "H:/");
}

function main(){
}

main();