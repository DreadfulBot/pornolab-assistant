import { FastPicStorage } from "./fastpic";
import { ImageVenueStorage } from "./imagevenue";

export function getStorageFactory(url) {
    if (url.search('fastpic') !== -1) {
        return new FastPicStorage(url);
    }
    else if (url.search('imagevenue') !== -1) {
        return new ImageVenueStorage(url)
    }
    else {
        throw new Error(`Unknown url storage ${url}`);
    }
}
