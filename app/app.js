const config = require("electron").ipcRenderer.sendSync("get-config")

const getConverter = (function(options) {
    const converter = new (require('showdown').Converter)(options)
    return markdown => converter.makeHtml(markdown)
})

document.addEventListener("DOMContentLoaded", () => {
    const stylesheet = document.querySelector("#styles")
    const filename = new URL(document.location).searchParams.get('filename')

    let markdown
    try {
        markdown = require('fs').readFileSync(filename, 'utf-8')
    } catch (err) {
        throw err // TODO: log and display warning instead
    }

    let convert
    if (config.showdownOptions) {
        convert = getConverter(config.showdownOptions)
    } else {
        convert = getConverter({})
    }

    let html = convert(markdown)
    stylesheet.href = require('xdg').basedir.configPath(`Gedda/${config.stylesheet || "_default.css"}`)

    document.body.innerHTML = html
    document.title = `Gedda - ${filename}`
})
