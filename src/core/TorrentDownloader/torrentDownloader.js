import WebTorrent from 'webtorrent'
import _cliProgress from "cli-progress"

function msToHMS(ms) {
    let seconds = ms / 1000;
    const hours = parseInt(seconds / 3600);
    seconds = seconds % 3600;
    const minutes = parseInt(seconds / 60);
    seconds = Math.round(seconds % 60);
    return hours + "h" + minutes + "m" + seconds + "s";
}

class TorrentDownloader {
    constructor(multibar) {
        this.multibar = multibar;
    }

    async download(magnetURI, path) {
        let progressBar;
        const client = new WebTorrent()
        const torrent = client.add(magnetURI, { path: path })
        const createProgressBar = (torrent) => {
            return this.multibar.create(100, 0, { fileName: torrent.name });
        }
        const checkClient = () => {
            if (client.torrents.length === 0) {
                client.destroy();
            }
        }
        torrent.on('download', function (bytes) {
            if (!progressBar) {
                progressBar = createProgressBar(torrent);
            }
            progressBar.update(torrent.progress * 100);
        });
        torrent.on('done', function () {
            progressBar.update(torrent.progress * 100);
            progressBar.stop();
            torrent.destroy();
            checkClient();
        });
    }
}

export default TorrentDownloader