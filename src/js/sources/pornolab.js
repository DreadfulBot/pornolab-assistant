(function () {
    hostname = 'pornolab.net';
    sel_main_spoilers = '#topic_main .clickable';
    sel_preview_link = '#topic_main .sp-body.inited .postLink'
    modal_id = 'modal-1';
    frame_id = 'frame-1';
    sel_frame = `#${frame_id}`;
    sel_modal = `#${modal_id}`;
    sel_poster = `img#poster`;
    sel_title = `h5#title`;
    sel_info = `p#info`;

    injectModal = function () {

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
                    <img id="poster" src="" />
                    <p id="info"></p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
                </div>
            </div>
            </div>
        `);

        var el = $(markup).appendTo('body')
        $(el).hide();
    };

    openSpoilers = function () {
        document.querySelectorAll(sel_main_spoilers).forEach(x => x.click());
    };

    clickOnPreviews = function () {
        document.querySelectorAll(sel_preview_link).forEach(x => x.click());
    };

    addPreviewPopup = function () {
        var links = document.querySelectorAll('a[href*="' + hostname + '"]');
        var req = new XMLHttpRequest();
        links.forEach((l) => {
            l.addEventListener("mouseover", (e) => {
                var url = e.target.href;
                req = new XMLHttpRequest();
                req.onload = () => {
                    bindDataToModal(extractPopupData(req));
                    $(sel_modal).show();
                };
                req.responseType = 'document';
                req.open('GET', url, true);
                req.send();
            });
            l.addEventListener("mouseout", () => {
                req.abort();
                bindDataToModal(null);
                $(sel_modal).hide();
            });
        });
    };

    bindDataToModal = function (data) {
        const { poster, title } = data || { poster: '', title: '' };

        $(sel_modal).find(sel_info).text('');
        $(sel_modal).find(sel_poster).attr('src', poster);
        $(sel_modal).find(sel_title).text(title);

        let valueExists = !!data && Object.entries(data).find(([k, v]) => !!v);

        if (!valueExists) {
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
            title
        };
    };

    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        switch (request.type) {
            case "openModal":
                $(sel_modal).modal({
                    backdrop: 'static',
                    keyboard: false
                });
                break;
        }
    });

    window.addEventListener('message', function (event) {
        if (event.date.type === 'hideFrame') {
            $(sel_modal).hide();
        }
    });

    injectModal();

    window.PhotoExtractor = {
        clickOnPreviews,
        openSpoilers,
        addPreviewPopup,
    };
}())