
import { BasicStorage } from "./basic_storage";

export class ImageVenueStorage extends BasicStorage {
    async extractImage(url) {
        const pageHtml = await this.loadHtml(url);
        const fullImageUrl = pageHtml.querySelector('a[data-toggle="full"] img')

        if (!fullImageUrl) {
            throw new Error('unable to load big image')
        } else {
            return fullImageUrl.getAttribute('src');
        }
    }
}