const St = imports.gi.St;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const GLib = imports.gi.GLib;

let button;

function _showInterfaceInformation() {

    button.menu.removeAll();

    let cmd = 'ifconfig';
    let [_, out] = GLib.spawn_command_line_sync(cmd);

    out = out.toString();

    let lines = out.split('\n');

    for (i=0; i < lines.length; i++) {
        let intfname = lines[i].split(' ')[0];
        if (intfname.length) {
            let ipaddr = lines[i+1].match(/\d+.\d+.\d+.\d+/g);

            let menuname = intfname + " : " + ipaddr;

            let item = new PopupMenu.PopupSwitchMenuItem(menuname, true);
            button.menu.addMenuItem(item);
        }
    }
}

function init() {

}

function enable() {
    button = new PanelMenu.Button(0.0);

    let icon = new St.Icon({ icon_name: 'system-run-symbolic',
                             style_class: 'system-status-icon' });
    button.actor.add_actor(icon);
	button.actor.add_style_class_name('panel-status-button');

	button.actor.connect('button-press-event', _showInterfaceInformation);

    Main.panel.addToStatusArea('services', button);
}

function disable() {
    button.destroy();
}
