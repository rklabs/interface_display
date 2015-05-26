const St = imports.gi.St;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const GLib = imports.gi.GLib;

let button;

function _showInterfaceInformation() {

    button.menu.removeAll();

    let [_, out] = GLib.spawn_command_line_sync('ifconfig');

    out = out.toString();

    let lines = out.split('\n');

    for (i=0; i < lines.length; i++) {
        let intf_name = lines[i].split(' ')[0];
        if (intf_name.length) {
            let ipv4_addr = lines[i + 1].match(/\d+.\d+.\d+.\d+/g);
            let ipv6_addr = lines[i + 2];
            ipv6_addr = ipv6_addr.split("");

            let menu_name = intf_name + "\n\tIPv4: " + ipv4_addr[0];

            if (ipv6_addr[2] == 'inet6') {
                menu_name += "\n\tIPv6: " + ipv6_addr[3];
            }

            let item = new PopupMenu.PopupSwitchMenuItem(menu_name, true);
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
