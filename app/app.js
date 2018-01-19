const fs = require('fs')
const showdown = require('showdown')
const {ipcRenderer} = require('electron')

const [config_err, config] = ipcRenderer.sendSync("get-config")

const getConverter = (function(config) {
    const converter = new showdown.Converter({
        omitExtraWLInCodeBlocks: true,
        ghCompatibleHeaderId: true,
        simplifiedAutoLink: true,
        excludeTrailingPunctuationFromURLs: true,
        literalMidWordUnderscores: true,
        strikethrough: true,
        tables: true,
        tasklists: true,
    })
    return markdown => converter.makeHtml(markdown)
})

document.addEventListener("DOMContentLoaded", () => {
    const filename = new URL(document.location).searchParams.get('filename')

    let markdown
    try {
        markdown = fs.readFileSync(filename, 'utf-8')
    } catch (err) {
        throw err // TODO: log and display warning instead
    }

    let convert
    if (config_err !== null) {
        convert = getConverter({})
    } else {
        convert = getConverter(config)
    }

    let html = convert(markdown)
    if (config === null) {
        html = `<div class='mdv-error'><p>Couldn't load user config, using default one</p><pre>${config_err}</pre></div>${html}`
    } else {
        stylesheet.href = config.stylesheet
    }

    document.body.innerHTML = html
    document.title = `Markdown Viewer - ${filename}`
})
