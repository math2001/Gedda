const fs = require('fs')
const showdown = require('showdown')
const {ipcRenderer} = require('electron')

const [config_err, config] = ipcRenderer.sendSync("get-config")

const getConverter = (function(config) {
    const converter = new showdown.Converter(config)
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
    if (config && config.showdownOptions) {
        convert = getConverter(config.showdownOptions)
    } else {
        convert = getConverter({})
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
