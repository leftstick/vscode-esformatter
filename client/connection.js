const path = require('path');
const {LanguageClient, CloseAction, TransportKind} = require('vscode-languageclient');
const {window, workspace} = require('vscode');

const {langs} = require('./supportLanguages');

module.exports.connect = (context) => {

    let client;

    const serverModule = context.asAbsolutePath(path.join('server', 'index.js'));
    const debugOptions = {execArgv: ['--nolazy', '--debug=6004']};

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

    const clientOptions = {
        documentSelector: langs,
        initializationOptions: function() {
            let configuration = workspace.getConfiguration('files');
            return {eol: configuration.get('eol', '\n')};
        },
        synchronize: {
            configurationSection: ['files', 'esformatter']
        },
        initializationFailedHandler: function(error) {
            client.error('Format code failed.', error);
            client.outputChannel.show();
        },
        errorHandler: {
            error: function(error, message, count) {
                return console.error(error, message, count);
            },
            closed: function() {
                return CloseAction.DoNotRestart;
            }
        }
    };

    client = new LanguageClient('esformatter', serverOptions, clientOptions);

    client.onNotification({method: 'esformatter/formaterror'}, function(message) {
        window.showErrorMessage(message);
    });

    context.subscriptions.push(client.start());

    return client;
};
