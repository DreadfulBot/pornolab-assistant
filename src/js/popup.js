var buttons = document.querySelectorAll('button');
let bgk = chrome.extension.getBackgroundPage();
const { showModal, hideModal } = bgk;

const clickHandler = (element) => {
    var command = element.target.getAttribute('data-command');
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        let currentTab = tabs[0];

        let code = `window.PhotoExtractor.${command}();`;

        chrome.tabs.executeScript(
            currentTab.id,
            { code },
        );
    });
}

buttons.forEach((b) => {
    b.onclick = clickHandler;
})