const {app, BrowserWindow, ipcMain} = require("electron")
const {basedir} = require("xdg")
const {readFile} = require("fs")

let mainWindow = null;

// don't really know how the filename is going to come in
// but for now, we'll just set it like this

function getFilename() {
    return `${__dirname}/README.md`
}

function getConfig() {
    const filename = basedir.configPath("markdownviewer.json")
    return readFile(filename, 'utf-8').then(content => {
        let config = {}
        try {
            config = JSON.parse(content)
        } catch (e) {
            // TODO: log
            // TODO: display warning
        }
        return config
    })
}

function createWindow(width, height) {
    mainWindow = new BrowserWindow({width, height})
    mainWindow.loadURL(`file:///${__dirname}/app/index.html?filename=${getFilename()}`)
    mainWindow.on("close", () => {
        mainWindow = null
    })
}

app.on("window-all-closed", () => {
    app.quit()
})

app.on("ready", createWindow)
