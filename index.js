const {app, BrowserWindow, ipcMain, dialog} = require("electron")
const {basedir} = require("xdg")
const {readFileSync, writeFileSync} = require("fs")
const path = require('path')

const getFilename = (argv, wd) => path.resolve(wd, argv[1] === '.' ? argv[2] : argv[1])

let windows = {}

function getConfig() {
    return JSON.parse(readFileSync(basedir.configPath("Gedda/conf.json"), 'utf-8'))
}

function createWindow(width, height, filename) {
    const win = new BrowserWindow({width, height})
    win.loadURL(`file:///${__dirname}/app/index.html?filename=${filename}`) // TODO: handle non-existing arguments
    win.on("close", () => {
        delete windows[filename]
    })
    windows[filename] = win
}

const isOtherProcess = app.makeSingleInstance((argv, wd) => { 
    const filename = getFilename(argv, wd)
    if (windows[filename]) {
        windows[filename].show()
    } else {
        createWindow(null, null, filename)
    }
})

if (isOtherProcess) {
    app.exit()
}

app.on("ready", () => {
    createWindow(null, null, getFilename(process.argv, process.cwd()))
})

ipcMain.on("get-config", (event, arg) => {
    try {
        event.returnValue = getConfig()
    } catch (e) {
        dialog.showMessageBox({
            type: "error",
            buttons: ["Create", "OK"],
            defaultId: 0,
            title: "Couldn't load configuration",
            message: `Couldn't load configuration file.\n\n${e}\n\nSelect "Create" to create an empty configuration file (default content will be "{}")`,
            details: e.toString()
        }, index => {
            if (index === 0) {
                try {
                    writeFileSync(basedir.configPath('Gedda/conf.json'), '{}\n', 'utf-8')
                } catch (e) {
                    dialog.showErrorBox("Couldn't write configuration file",
                    `Couldn't write configuration file:\n\n ${e.toString()}\n\nYou should create it yourself.`)
                }
            }
        })
        event.returnValue = {}
    }
})
