const fs = require('fs')
const showdown = require('showdown')

const _convert = (function() {
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
})()

document.addEventListener("DOMContentLoaded", () => {
    const filename = new URL(document.location).searchParams.get('filename')

    let markdown

    try {
        markdown = fs.readFileSync(filename, 'utf-8')
    } catch (err) {
        throw err // TODO: log and display warning instead
    }

    document.body.innerHTML = _convert(markdown)
    document.title = `Markdown Viewer - ${filename}`
})
