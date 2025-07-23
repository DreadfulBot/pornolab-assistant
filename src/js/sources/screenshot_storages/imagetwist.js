
import { BasicStorage } from "./basic_storage"

// https://pornolab.net/forum/viewtopic.php?t=2820239
export class ImageTwist extends BasicStorage {
    async extractImage(url) {
        const pageHtml = await this.loadHtml(url)

        const fullImageUrl = pageHtml.querySelector('img.pic')

        if (!fullImageUrl) {
            throw new Error('unable to load big image')
        } else {
            return fullImageUrl.getAttribute('src')
        }
    }
}