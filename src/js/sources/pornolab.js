import { getStorageFactory } from "./screenshot_storages/screenshot_storage_factory"

(function () {
    const hostname = 'pornolab.net'
    const sel_main_spoilers = '#topic_main .clickable'
    const sel_preview_link = '#topic_main .sp-body.inited .postLink'
    const modal_id = 'modal-1'
    const sel_modal = `#${modal_id}`
    const sel_poster = `img#poster`
    const sel_preloader = `img#preloader`
    const sel_title = `h5#title`
    const sel_info = `p#info`

    const injectModal = function () {
        var preloaderUrl = chrome.extension.getURL('images/preloader.gif')

        var markup = $(`
            <div class="modal-window" id="modal-1" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="title"></h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times</span>
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
        `)

        var el = $(markup).appendTo('body')
        $(el).find(sel_preloader).hide()
        $(el).hide()
    }

    const openSpoilers = function () {
        document.querySelectorAll(sel_main_spoilers).forEach(x => x.click())
    }

    const clickOnPreviews = function () {
        document.querySelectorAll(sel_preview_link).forEach(x => x.click())
    }

    const findPostLinks = function () {
        return document.querySelectorAll('a[href*="' + hostname + '"], a[href^="./"], a[href^="viewtopic.php"]')
    }

    const loadXmlRequest = function (url, onLoad, onError, method = 'GET', responseType = 'document') {
        let loadRequest = new XMLHttpRequest()
        loadRequest.onload = onLoad
        loadRequest.onerror = onError
        loadRequest.responseType = responseType
        loadRequest.open(method, url, true)
        loadRequest.send()
        return loadRequest
    }

    const injectPreviewsColumn = function () {
        const rows = document.querySelectorAll('table.forumline tbody tr')
        rows.forEach(x => {
            const tds = x.querySelectorAll('td')

            const isTrackerSearch = tds.length === 11
            const isForumSearch = tds.length === 6

            if (!isTrackerSearch && !isForumSearch) {
                return
            } else {
                const tdToWork = isTrackerSearch ? 3 : 2

                const link = tds[tdToWork].querySelector('a')

                const loadRequest = loadXmlRequest(link, function () {
                    const extractedData = extractPopupData(loadRequest)
                    const injectImagesLink = link + '&injectImages=true'
                    const newTd = document.createElement('td')

                    const posterWrapper = document.createElement('a')
                    posterWrapper.target = '_blank'
                    posterWrapper.href = injectImagesLink
                    newTd.appendChild(posterWrapper)

                    const poster = document.createElement('img')
                    poster.src = extractedData.poster
                    // poster.style.width = '200px'
                    posterWrapper.appendChild(poster)

                    newTd.appendChild(document.createElement('br'))

                    const openInjectedButton = document.createElement('a')
                    openInjectedButton.target = '_blank'
                    openInjectedButton.innerText = 'Open with images injected'
                    openInjectedButton.classList.add('btn')
                    openInjectedButton.classList.add('btn-info')
                    openInjectedButton.href = link + '&injectImages=true'

                    newTd.appendChild(openInjectedButton)

                    tds[tdToWork].prepend(newTd)
                })
            }
        })
    }


    const addPreviewPopup = function () {
        const links = findPostLinks()
        let loadRequest = new XMLHttpRequest()
        let timer
        links.forEach((l) => {
            l.addEventListener('mouseover', (e) => {
                bindDataToModal({ isLoading: true })
                $(sel_modal).show()
                timer = setTimeout(() => {
                    var url = e.target.href
                    loadRequest = loadXmlRequest(url, function () {
                        bindDataToModal(extractPopupData(loadRequest))
                        $(sel_modal).show()
                    })
                }, 200)
            })
            l.addEventListener('mouseout', () => {
                clearTimeout(timer)
                loadRequest.abort()
                bindDataToModal(null)
                $(sel_modal).hide()
            })
        })
    }

    const togglePreloader = function (isLoading) {
        if (isLoading) {
            $(sel_modal).find(sel_preloader).show()
        } else {
            $(sel_modal).find(sel_preloader).hide()
        }
    }

    const bindDataToModal = function (data) {
        const { poster, title, isLoading } = data ||
            { poster: '', title: '', isLoading: false }

        togglePreloader(isLoading)

        $(sel_modal).find(sel_info).text('')
        $(sel_modal).find(sel_poster).attr('src', poster)
        $(sel_modal).find(sel_title).text(title)

        let valueExists = !!data && Object.entries(data).find(([k, v]) => !!v)

        if (!valueExists && !isLoading) {
            $(sel_modal).find(sel_info).text('Unable to load data')
        }
    }

    const extractPopupData = function (response) {
        var xml = response.responseXML
        var poster = xml ? xml.querySelector('#topic_main .postImg') : ''
        poster = poster ? poster.title : ''
        var title = xml ? xml.title : ''
        title = title !== hostname ? title : ''

        return {
            poster,
            title,
            isLoading: false
        }
    }

    const injectImages = function () {
        openSpoilers()
        const foundImages = document.querySelectorAll('.sp-wrap .postLink')

        if (foundImages && foundImages.length > 0) {
            foundImages[0].scrollIntoView()
        }

        foundImages.forEach(async (image) => {
            var url = image.href
            const fullImageUrl = await getStorageFactory(url).extractImage(url)

            const img = document.createElement('img')
            img.src = fullImageUrl
            img.style.maxWidth = '100%'
            image.replaceWith(img)
        })

    }

    const init = function () {
        const searchParams = new URLSearchParams(window.location.search)
        const toInjectImages = searchParams.get('injectImages')

        if (toInjectImages) {
            injectImages()
        }

        chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
            switch (request.type) {
                case 'openModal':
                    $(sel_modal).show()
                    break
            }
        })

        window.addEventListener('message', function (event) {
            const { data: { type } } = event
            switch (type) {
                case 'hideModal': {
                    $(sel_modal).hide()
                    break
                }
            }
        })

        injectModal()
    }

    // *************** MAIN *************** 
    init()


    window.PhotoExtractor = {
        clickOnPreviews,
        openSpoilers,
        addPreviewPopup,
        injectImages,
        injectPreviewsColumn
    }
}())