/**
 * Generated using theia-plugin-generator
 */
import * as theia from '@theia/plugin';
import { Command } from "@theia/core";
import { RemoteSshKeyManager, SshKeyManager } from "./node/ssh-key-manager";
import { SshKeyServiceClient, SshKeyServiceHttpClient } from "./node/ssh-key-service-client";
import { WsMasterHttpClient } from "./node/ws-master-http-client";
import { CheService } from "./browser/ssh-quick-open-service";

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

    disposables.push(theia.commands.registerCommand(GENERATE, () => {
        generateKeyPair(sshkeyManager);
    }));

}

const generateKeyPair = async function (sshkeyManager: SshKeyManager): Promise<void> {
    const option: theia.QuickPickOptions = {
        machOnDescription: true,
        machOnDetail: true,
        canPickMany: false,
        placeHolder: "Select object:"
    };
    const sshServiceValue: any = await theia.window.showQuickPick<theia.QuickPickItem>(new Promise((resolve) => {
        resolve(
            services.map(service => {
                return {label: service.displayName, description: service.description, detail: service.name, name: service.name}
            })
        );
    }), option);

    const keyName = await theia.window.showInputBox({placeHolder: 'Please provide a key pair name'});
    const key = await sshkeyManager.generate(sshServiceValue.name, keyName ? keyName : '');
    const downloadAction = 'Download';
    const action = await theia.window.showInformationMessage('Do you want to download generated private key?', downloadAction)
    if (action == downloadAction) {
        //Todo open download window with private key;
        console.log(key);
    }
};

export function stop() {
    while (disposables.length) {
        const disposable = disposables.pop();
        if (disposable) {
            disposable.dispose();
        }
    }
}
