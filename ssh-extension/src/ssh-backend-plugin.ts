/**
 * Generated using theia-plugin-generator
 */
import * as theia from '@wiptheia/plugin';
import {Command} from "@theia/core";
import {RemoteSshKeyManager, SshKeyManager} from "./node/ssh-key-manager";
import {SshKeyServiceClient, SshKeyServiceHttpClient} from "./node/ssh-key-service-client";
import {WsMasterHttpClient} from "./node/ws-master-http-client";
import {CheService} from "./browser/ssh-quick-open-service";

const disposables: theia.Disposable[] = [];

/**
 * Known Che services which can use the SSH key pairs.
 */
const services: CheService[] = [
    {name: 'vcs', displayName: 'VCS', description: 'SSH keys used by Che VCS plugins'},
    {
        name: 'machine',
        displayName: 'Workspace Containers',
        description: 'SSH keys injected into all Workspace Containers'
    }
];

export function start() {

    const wsMasterHttpClient: WsMasterHttpClient = new WsMasterHttpClient();
    const sshKeyServiceClient: SshKeyServiceClient = new SshKeyServiceHttpClient(wsMasterHttpClient);
    const sshkeyManager: SshKeyManager = new RemoteSshKeyManager(sshKeyServiceClient);
    const GENERATE: Command = {
        id: 'ssh:generate',
        label: 'SSH: generate key pair...'
    };
    // const CREATE: Command = {
    //     id: 'ssh:create',
    //     label: 'SSH: create key pair...'
    // };
    console.log(sshkeyManager);

    disposables.push(theia.commands.registerCommand(GENERATE, generateKeyPair));

}

const generateKeyPair = function (): void {
    const option: theia.QuickPickOptions = {
        machOnDescription: true,
        machOnDetail: true,
        canPickMany: false,
        placeHolder: "Select object:"
    };
    theia.window.showQuickPick<theia.QuickPickItem>(new Promise((resolve) => {
        setTimeout(() => {
            resolve(
                services.map(service => {
                    return {label: service.displayName, description: service.description, detail: service.name}
                })
            );
        }, 500);
    }), option).then(val => {
        const value: any = val;
        theia.window.showInformationMessage(value.description);
    });
}

export function stop() {
    while (disposables.length) {
        const disposable = disposables.pop();
        if (disposable) {
            disposable.dispose();
        }
    }
}


