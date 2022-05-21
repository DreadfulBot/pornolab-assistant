export class BasicStorage {
    async loadText(url) {
        const response = await new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({ contentScriptType: 'queryCors', url }, response => resolve(response))
        })

        return response;
    }
    async loadHtml(url) {
        const text = this.loadText(url);
        const parser = new DOMParser();
        const html = parser.parseFromString(text, 'text/html');
        return html;
    };

    extractImage(data) {
        throw new Error('not implemented');
    }
}