const fs = require('fs')
const showdown = require('showdown')
const {basedir} = require('xdg')
const {ipcRenderer} = require('electron')
const path = require('path')

const config = ipcRenderer.sendSync("get-config")


const getConverter = (function(options) {
    const converter = new showdown.Converter(options)
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
    if (config.showdownOptions) {
        convert = getConverter(config.showdownOptions)
    } else {
        convert = getConverter({})
    }

    let html = convert(markdown)
    stylesheet.href = basedir.configPath(`Gedda/${config.stylesheet || "_default.css"}`)

    document.body.innerHTML = html
    document.title = `Gedda - ${filename}`
})
