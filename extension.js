let path = require('path');
let {window, workspace} = require('vscode');
let {LanguageClient, CloseAction, TransportKind, SettingMonitor} = require('vscode-languageclient');

const exitCalled = {method: 'esformatter/exitCalled'};

module.exports.activate = function(context) {

    let client, serverCalledProcessExit = false, defaultErrorHandler;

    console.log('Congratulations, your extension "vscode-esformatter" is now active!');

    let onSave = workspace.onDidSaveTextDocument((e) => {

        let textEditor = window.activeTextEditor;
        if (!textEditor) {
            return;
        }
        if (textEditor.document.languageId !== 'javascript') {
            return;
        }
            
        let uri = textEditor.document.uri.toString();
        client.sendRequest('esformatter/format', {textDocument: {uri}})
            .then((result) => {
                if (result) {
		            applyTextEdits(uri, result.documentVersion, result.edits);
                }
            }, (error) => {
                window.showErrorMessage('Failed to apply ESLint fixes to the document. Please consider opening an issue with steps to reproduce.');
            });
            
    });
    context.subscriptions.push(onSave);

    let serverModule = context.asAbsolutePath(path.join('..', 'server', 'server.js'));

    // If the extension is launched in debug mode then the debug server options are used
    // Otherwise the run options are used
    let serverOptions = {
        run: {module: serverModule, transport: TransportKind.ipc}
    };

    let clientOptions = {
        documentSelector: ['javascript'],
        synchronize: {
            configurationSection: 'esformatter',
            fileEvents: workspace.createFileSystemWatcher('**/.esformatter')
        },
        initializationOptions: function() {
            let configuration = workspace.getConfiguration('esformatter');
            return {
                formatOnSave: configuration ? configuration.get('formatOnSave', true) : true
            };
        },
        initializationFailedHandler: function(error) {
            client.error('Format code failed.', error);
            client.outputChannel.show();
        },
        errorHandler: {
            error: function(error, message, count) {
                return defaultErrorHandler.error(error, message, count);
            },
            closed: function() {
                if (serverCalledProcessExit) {
                    return CloseAction.DoNotRestart;
                }
                return defaultErrorHandler.closed();
            }
        }
    };

    client = new LanguageClient('esformatter', serverOptions, clientOptions);
    defaultErrorHandler = client.createDefaultErrorHandler();
    client.onNotification(exitCalled, function(params) {
        serverCalledProcessExit = true;
        client.error(`Server process exited with code ${params[0]}. This usually indicates a misconfigured esformatter setup.`, params[1]);
        window.showErrorMessage(`esformatter server shut down itself. See 'esformatter' output channel for details.`);
    });
    context.subscriptions.push(new SettingMonitor(client, 'esformatter.formatOnSave').start());
};

// this method is called when your extension is deactivated
module.exports.deactivate = function deactivate() {

};
