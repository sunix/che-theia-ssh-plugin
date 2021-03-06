/*
 * Copyright (c) 2018 Red Hat, Inc.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *   Red Hat, Inc. - initial API and implementation
 */

import { SshKeyPair, SshKeyServer } from '../../common/ssh-protocol';
import { injectable } from 'inversify';

@injectable()
export class FakeSshKeyServer implements SshKeyServer {

    generate(service: string, name: string): Promise<SshKeyPair> {
        return Promise.reject('');
    }

    create(sshKeyPair: SshKeyPair): Promise<void> {
        return Promise.reject('');
    }

    get(service: string, name: string): Promise<SshKeyPair> {
        return Promise.reject('');
    }

    getAll(service: string): Promise<SshKeyPair[]> {
        return Promise.resolve([]);
    }

    delete(service: string, name: string): Promise<void> {
        return Promise.resolve();
    }
}
