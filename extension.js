import St from 'gi://St'
import Gio from "gi://Gio"

import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js'
import * as Main from 'resource:///org/gnome/shell/ui/main.js'
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js'

const decoder = new TextDecoder()
const file = Gio.File.new_for_uri("file:///sys/class/thermal/thermal_zone0/temp")

let contents, timer

function getTemperature() {
    // 获取温度，返回值类似60°C
    contents = file.load_contents(null)[1]
    return decoder.decode(contents) / 1000 + "°C"
}


export default class ExampleExtension extends Extension {
    enable() {
        // 创建面板按钮
        this._indicator = new PanelMenu.Button(0.0, this.metadata.name, false)

        let icon = new St.Label()
        // 将指示器添加到面板
        Main.panel.addToStatusArea(this.uuid, this._indicator)
        timer = setInterval(() => {
            // 每5秒更新一次指示器
            icon.set_text(getTemperature())
            this._indicator.add_child(icon)
        }, 5000)
    }

    disable() {
        clearInterval(timer)
        this._indicator?.destroy()
        this._indicator = null
    }
}
