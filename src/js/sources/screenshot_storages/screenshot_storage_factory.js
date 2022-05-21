import { FastPicStorage } from "./fastpic";

export function getStorageFactory(url) {
    if (url.search('fastpic')) {
        return new FastPicStorage(url);
    } else {
        throw new Error(`Unknown url storage ${url}`);
    }
}
