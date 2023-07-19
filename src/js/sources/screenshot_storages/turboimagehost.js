
import { BasicStorage } from "./basic_storage"

export class TurboImageHostStorage extends BasicStorage {
    async extractImage(url) {
        const pageHtml = await this.loadHtml(url)
        const fullImageUrl = pageHtml.querySelector('img#imageid')

        if (!fullImageUrl) {
            throw new Error('unable to load big image')
        } else {
            return fullImageUrl.getAttribute('src')
        }
    }
}