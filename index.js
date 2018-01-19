const {app, BrowserWindow, ipcMain} = require("electron")
const {basedir} = require("xdg")
const {readFileSync} = require("fs")

let mainWindow = null;

function getFilename() {
    if (process.argv[1] === '.') return `${__dirname}/README.md` // for debugging purpose
    return process.argv[1]
}

function getConfig() {
    return JSON.parse(readFileSync(basedir.configPath("Gedda/conf.json"), 'utf-8'))
}

function createWindow(width, height) {
    mainWindow = new BrowserWindow({width, height})
    mainWindow.loadURL(`file:///${__dirname}/app/index.html?filename=${getFilename()}`) // TODO: handle non-existing arguments
    mainWindow.on("close", () => {
        mainWindow = null
    })
}

app.on("window-all-closed", () => {
    app.quit()
})

app.on("ready", createWindow)

ipcMain.on("get-config", (event, arg) => {
    try {
        event.returnValue = [null, getConfig()]
    } catch (e) {
        if (e.message !== undefined) e = e.message
        event.returnValue = [e, null]
    }
})
