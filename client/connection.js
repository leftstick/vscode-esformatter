const path = require('path');
const {LanguageClient, CloseAction, TransportKind} = require('vscode-languageclient');

const exitCalled = {method: 'esformatter/exitCalled'};

const {langs} = require('./supportLanguages');

module.exports.connect = (context) => {

    let client,
        serverCalledProcessExit = false;

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
        initializationFailedHandler: function(error) {
            client.error('Format code failed.', error);
            client.outputChannel.show();
        },
        errorHandler: {
            error: function(error, message, count) {
                return console.error(error, message, count);
            },
            closed: function() {
                if (serverCalledProcessExit) {
                    return CloseAction.DoNotRestart;
                }
            }
        }
    };

    client = new LanguageClient('esformatter', serverOptions, clientOptions);

    client.onNotification(exitCalled, function(params) {
        serverCalledProcessExit = true;
        client.error(`Server process exited with code ${params[0]}. This usually indicates a misconfigured esformatter setup.`, params[1]);
        window.showErrorMessage(`esformatter server shut down itself. See 'esformatter' output channel for details.`);
    });

    context.subscriptions.push(client.start());

    return client;
};