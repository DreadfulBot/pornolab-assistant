import { BasicStorage } from "./basic_storage"

export class ImgBoxStorage extends BasicStorage {
    async extractImage(url) {
        if (url.search('big') >= 0) {
            return url
        } else {
            const regex = /(?<=\<meta property="og:image" content=")\S+imgbox\.com\/\S+(?=")/gm
            const pageText = await this.loadText(url)

            const found = pageText.match(regex)
            debugger

            if (!found || found.length === 0) {
                throw new Error('unable to load big image')
            } else {
                return found[0]
            }
        }
    }
}