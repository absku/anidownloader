import Scraper from "../scraper/index.js";
import jsdom from "jsdom";
import fs from "fs";
import request from "request";
import _cliProgress from "cli-progress";
import parse from "url";

class ZippyshareDownloader {
    constructor(multibar) {
        this.url = "https://www.zippyshare.com";
        this.multibar = multibar;
    }

    async getLink(url) {
        const scraper = new Scraper(url);
        const page = await scraper.get_page();
        const dom = new jsdom.JSDOM(page.html);
        const link = dom.window.document.querySelector("#dlbutton").href;
        const parsed = parse.parse(page.url);
        const downloadLink = `${parsed.protocol}//${parsed.hostname}${link}`;
        return downloadLink;
    }

    async download(url, path) {
        const downloadLink = await this.getLink(url);
        const fileName = downloadLink.split("/").pop();
        const filePath = path + fileName;
        
        const file = fs.createWriteStream(filePath);
        let receivedBytes = 0;
        let progressBar;
        request.get(downloadLink)
            .on('response', (response) => {
                if (response.statusCode !== 200) {
                    console.log(`Error: ${response.statusCode}`);
                    return;
                }
                const totalBytes = response.headers['content-length'];
                progressBar = this.multibar.create(totalBytes, 0, { fileName: fileName.padEnd(20, ' ') });
            })
            .on('data', (chunk) => {
                receivedBytes += chunk.length;
                progressBar.update(receivedBytes);
            })
            .pipe(file)
            .on('error', (err) => {
                fs.unlink(filePath);
                progressBar.stop();
                console.log(`Error: ${err}`);
                return;
            });

        file.on('finish', () => {
            progressBar.stop();
            file.close();
        });
        file.on('error', (err) => {
            fs.unlink(filePath);
            progressBar.stop();
            console.log(`Error: ${err}`);
            return;
        });
    }
}

export default ZippyshareDownloader;