const {Protocol2Code} = require('vscode-languageclient');

const {window, workspace} = require('vscode');

const {langs} = require('./supportLanguages');

const applyTextEdits = function(uri, {documentVersion, range, content}) {
    let textEditor = window.activeTextEditor;
    if (!textEditor || textEditor.document.uri.toString() !== uri) {
        return Promise.resolve(false);
    }

    if (textEditor.document.version !== documentVersion) {
        window.showInformationMessage(`esformatter result are outdated and can't be applied to the document.`);
        return Promise.resolve(false);
    }

    return textEditor
        .edit(mutator => {
            mutator.replace(Protocol2Code.asRange(range), content);
        })
        .then(success => {
            if (!success) {
                window.showErrorMessage('Failed to apply esformatter result to the document. Please consider opening an issue with steps to reproduce.');
            }
            return true;
        });
};

module.exports.onSave = (context, client) => {
    let ignoreNextSave = new WeakSet();

    workspace.onDidSaveTextDocument(document => {
        if (langs.indexOf(document.languageId) < 0 || ignoreNextSave.has(document)) {
            return;
        }
        let textEditor = window.activeTextEditor;
        if (!textEditor) {
            return;
        }

        if (!workspace.getConfiguration('esformatter').get('formatOnSave', true)) {
            return;
        }

        let uri = document.uri.toString();

        client.sendRequest({method: 'esformatter/format'}, {
            textDocument: {
                uri
            }
        })
            .then(result => {
                return applyTextEdits(uri, result);
            })
            .then(contentChanged => {
                if (contentChanged) {
                    ignoreNextSave.add(document);
                    return document.save().then(() => {
                        ignoreNextSave.delete(document);
                    });
                }
            })
            .catch(e => {
                window.showErrorMessage(e.message);
            });

    }, null, context.subscriptions);
};
