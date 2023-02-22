class EpisodeInfo {
    constructor() {
        this.link = "";
        this.server = "";
        this.path = "";
        this.name = "";
        this.serie = null;
    }

    createPath(basePath) {
        this.path = basePath + this.serie.name.replace(/[^A-Za-z0-9 ]+/g, '') + "/";
    }
}

export default EpisodeInfo;