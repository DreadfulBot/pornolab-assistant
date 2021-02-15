(function () {
    hostname = 'pornolab.net';
    sel_main_spoilers = '#topic_main .clickable';
    sel_preview_link = '#topic_main .sp-body.inited .postLink'
    modal_id = 'modal-1';
    sel_modal = `#${modal_id}`;
    sel_poster = `img#poster`;
    sel_preloader = `img#preloader`;
    sel_title = `h5#title`;
    sel_info = `p#info`;

    injectModal = function () {
        var preloaderUrl = chrome.extension.getURL('images/preloader.gif');

        var markup = $(`
            <div class="modal-window" id="modal-1" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="title"></h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <img id="preloader" src="${preloaderUrl}" />
                    <img id="poster" src="" />
                    <p id="info"></p>
                </div>
                <div class="modal-footer">
                    <button type="button" id="close-button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
                </div>
            </div>
            </div>
        `);

        var el = $(markup).appendTo('body');
        $(el).find(sel_preloader).hide();
        $(el).hide();
    };

    openSpoilers = function () {
        document.querySelectorAll(sel_main_spoilers).forEach(x => x.click());
    };

    clickOnPreviews = function () {
        document.querySelectorAll(sel_preview_link).forEach(x => x.click());
    };

    addPreviewPopup = function () {
        var links = document.querySelectorAll('a[href*="' + hostname + '"], a[href^="./"], a[href^="viewtopic.php"]');
        var loadRequest = new XMLHttpRequest();
        var timer;
        links.forEach((l) => {
            l.addEventListener('mouseover', (e) => {
                bindDataToModal({ isLoading: true });
                $(sel_modal).show();
                timer = setTimeout(() => {
                    var url = e.target.href;
                    loadRequest = new XMLHttpRequest();
                    loadRequest.onload = () => {
                        bindDataToModal(extractPopupData(loadRequest));
                        $(sel_modal).show();
                    };
                    loadRequest.responseType = 'document';
                    loadRequest.open('GET', url, true);
                    loadRequest.send();
                }, 200)
            });
            l.addEventListener('mouseout', () => {
                clearTimeout(timer);
                loadRequest.abort();
                bindDataToModal(null);
                $(sel_modal).hide();
            });
        });
    };

    togglePreloader = function (isLoading) {
        if (isLoading) {
            $(sel_modal).find(sel_preloader).show();
        } else {
            $(sel_modal).find(sel_preloader).hide();
        }
    }

    bindDataToModal = function (data) {
        const { poster, title, isLoading } = data ||
            { poster: '', title: '', isLoading: false };

        togglePreloader(isLoading);

        $(sel_modal).find(sel_info).text('');
        $(sel_modal).find(sel_poster).attr('src', poster);
        $(sel_modal).find(sel_title).text(title);

        let valueExists = !!data && Object.entries(data).find(([k, v]) => !!v);

        if (!valueExists && !isLoading) {
            $(sel_modal).find(sel_info).text('Unable to load data');
        }
    };

    extractPopupData = function (response) {
        var xml = response.responseXML;
        var poster = xml ? xml.querySelector('#topic_main .postImg') : '';
        poster = poster ? poster.title : '';
        var title = xml ? xml.title : '';
        title = title !== hostname ? title : '';

        return {
            poster,
            title,
            isLoading: false
        };
    };

    init = function () {
        chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
            switch (request.type) {
                case 'openModal':
                    $(sel_modal).show();
                    break;
            }
        });

        window.addEventListener('message', function (event) {
            const { data: { type } } = event;
            switch (type) {
                case 'hideModal': {
                    $(sel_modal).hide();
                    break;
                }
            }
        });

        injectModal();
    }

    // *************** MAIN *************** 
    init();


    window.PhotoExtractor = {
        clickOnPreviews,
        openSpoilers,
        addPreviewPopup,
    };
}())