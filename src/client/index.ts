import * as vscode from 'vscode';

import { connect } from './connection';

export function activate(context: vscode.ExtensionContext) {

    connect(context);

};

// this method is called when your extension is deactivated
export function deactivate() {
    console.log('destroyed');
};
