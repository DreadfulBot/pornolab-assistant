var buttons = document.querySelectorAll('button')
let bgk = chrome.extension.getBackgroundPage()

const clickHandler = (element) => {
    var command = element.target.getAttribute('data-command')
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        let currentTab = tabs[0]

        chrome.tabs.executeScript(
            currentTab.id,
            { code: `window.PhotoExtractor.${command}()` },
        )
    })
}

buttons.forEach((b) => {
    b.onclick = clickHandler
})