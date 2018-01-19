const fs = require('fs')
const showdown = require('showdown')
const {basedir} = require('xdg')
const {ipcRenderer} = require('electron')
const path = require('path')

const [config_err, config] = ipcRenderer.sendSync("get-config")


const getConverter = (function(config) {
    const converter = new showdown.Converter(config)
    return markdown => converter.makeHtml(markdown)
})

document.addEventListener("DOMContentLoaded", () => {
    const stylesheet = document.querySelector("#styles")
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
        html = `<div class='gedda-error'><p>Couldn't load user config, using default one</p><pre>${config_err}</pre></div>${html}`
    }
    stylesheet.href = basedir.configPath(`Gedda/${config.stylesheet || "_default.css"}`)

    document.body.innerHTML = html
    document.title = `Gedda - ${filename}`
})
