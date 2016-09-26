
const {IPCMessageReader, IPCMessageWriter, createConnection, TextDocuments} = require('vscode-languageserver');
const {format} = require('./formatter');

// Create a connection for the server. The connection uses Node's IPC as a transport
let connection = createConnection(new IPCMessageReader(process), new IPCMessageWriter(process));

let documents = new TextDocuments();
documents.listen(connection);

let workspaceRoot;

connection.onInitialize((params) => {
    workspaceRoot = params.rootPath;
    return {capabilities: {textDocumentSync: documents.syncKind}}
});

connection.onRequest({method: 'esformatter/format'}, (params) => {
    let uri = params.textDocument.uri;
    let textDocument = documents.get(uri);
    let text = textDocument.getText();
    return {
        documentVersion: textDocument.version,
        content: format(workspaceRoot, text),
        range: {
            start: textDocument.positionAt(0),
            end: textDocument.positionAt(text.length)
        }
    };
});

connection.listen();