import { BasicStorage } from "./basic_storage";

export class FastPicStorage extends BasicStorage {
    async extractImage(url) {
        if (url.search('big') >= 0) {
            return url;
        } else {
            const regex = /(?<=\<img src=")\S+fastpic\.org\/big\/\S+(?=")/gm;
            const pageText = await this.loadText(url);
            const found = pageText.match(regex);

            if (!found || found.length === 0) {
                throw new Error('unable to load big image')
            } else {
                return found[0];
            }
        }
    }
}