import * as path from 'path';
import { LanguageClient, LanguageClientOptions, CloseAction, ErrorAction, TransportKind, NotificationType } from 'vscode-languageclient';
import * as vscode from 'vscode';

import { langs } from './supportLanguages';

export function connect(context: vscode.ExtensionContext): LanguageClient {

    let client: LanguageClient;

    const serverModule = context.asAbsolutePath(path.join('out', 'src', 'server', 'index.js'));
    const debugOptions = { execArgv: ['--nolazy', '--debug=6004'] };

    const serverOptions = {
        run: {
            module: serverModule,
            transport: TransportKind.ipc
        },
        debug: {
            module: serverModule,
            transport: TransportKind.ipc,
            options: debugOptions
        }
    };

    const clientOptions: LanguageClientOptions = {
        documentSelector: langs,
        initializationOptions: function () {
            const configuration = vscode.workspace.getConfiguration('files');
            return { eol: configuration.get('eol', '\n') };
        },
        synchronize: {
            configurationSection: ['files', 'esformatter']
        },
        initializationFailedHandler(error) {
            client.error('Format code failed.', error);
            client.outputChannel.show();
            return false;
        },
        errorHandler: {
            error(error, message, count) {
                client.error('Format code failed.', message);
                client.outputChannel.show();
                return ErrorAction.Continue;
            },
            closed() {
                return CloseAction.DoNotRestart;
            }
        }
    };

    client = new LanguageClient('esformatter', serverOptions, clientOptions);

    client
        .onReady()
        .then(() => {
            client.onNotification
            client.onNotification(new NotificationType('esformatter/formaterror'), function (message: string) {
                vscode.window.showErrorMessage(message);
            });
        });

    context.subscriptions.push(client.start());

    return client;
};
