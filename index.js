const {app, BrowserWindow, ipcMain, dialog} = require("electron")
const {basedir} = require("xdg")
const {readFileSync, writeFileSync} = require("fs")

let mainWindow = null;

const getFilename = argv => argv[1] === '.' ? argv[2] : argv[1]

function getConfig() {
    return JSON.parse(readFileSync(basedir.configPath("Gedda/conf.json"), 'utf-8'))
}

function createWindow(width, height, filename) {
    mainWindow = new BrowserWindow({width, height})
    mainWindow.loadURL(`file:///${__dirname}/app/index.html?filename=${filename}`) // TODO: handle non-existing arguments
    mainWindow.on("close", () => {
        mainWindow = null
    })
}

const isOtherProcess = app.makeSingleInstance((argv, wd) => { 
    createWindow(null, null, getFilename(argv))
})

if (isOtherProcess) {
    app.quit()
}

// app.on("window-all-closed", () => {
//     app.quit()
// })

app.on("ready", () => {
    createWindow(null, null, getFilename(process.argv))
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
