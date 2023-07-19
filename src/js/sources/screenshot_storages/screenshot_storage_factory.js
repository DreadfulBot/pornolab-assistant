import { FastPicStorage } from "./fastpic"
import { ImageVenueStorage } from "./imagevenue"
import { ImgBoxStorage } from './imgbox'
import { TurboImageHostStorage } from "./turboimagehost"

export function getStorageFactory(url) {
    if (url.search('fastpic') !== -1) {
        return new FastPicStorage(url)
    }
    else if (url.search('imagevenue') !== -1) {
        return new ImageVenueStorage(url)
    }
    else if (url.search('imgbox') !== -1) {
        return new ImgBoxStorage(url)
    }
    else if (url.search('turboimagehost') !== -1) {
        return new TurboImageHostStorage(url)

    }
    else {
        throw new Error(`Unknown url storage ${url}`)
    }
}
