import EpisodeInfo from "../EpisodeInfo/episodeInfo.js";
import _cliProgress from "cli-progress";
import ZippyshareDownloader from "../ZippyshareDownloader/zippyshareDownloader.js";
import TorrentDownloader from "../TorrentDownloader/torrentDownloader.js";

class EpisodeDownloadManager {
    constructor() {
        this.multibar = new _cliProgress.MultiBar({
            clearOnComplete: false,
            hideCursor: true,
            format: '{fileName} [{bar}] {percentage}% | ETA: {eta}s',
            barCompleteChar: '\u2588',
            barIncompleteChar: '\u2591',
            stopOnComplete: true
        }, _cliProgress.Presets.shades_classic);

        this.episodesToDownload = [];

        this.zippyshareDownloader = new ZippyshareDownloader(this.multibar);
        this.torrentDownloader = new TorrentDownloader(this.multibar);
    }

    addEpisode(episode) {
        this.episodesToDownload.push(episode);
    }

    async start() {
        this.episodesToDownload.forEach(episode => {
            switch (episode.server) {
                case "Zippyshare":
                    this.zippyshareDownloader.download(episode.link, episode.path);
                    break;
                case "Torrent":
                    this.torrentDownloader.download(episode.link, episode.path);
                    break;
                default:
                    break;
            }
        });
    }
}

export default EpisodeDownloadManager;