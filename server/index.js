
const {IPCMessageReader, IPCMessageWriter, createConnection, TextDocuments, Range, Position, TextEdit} = require('vscode-languageserver');
const {format, FORMAT_ERROR_MSG, SELECTED_FORMAT_ERROR_MSG} = require('./formatter');

// Create a connection for the server. The connection uses Node's IPC as a transport
let connection = createConnection(new IPCMessageReader(process), new IPCMessageWriter(process));

let documents = new TextDocuments();
documents.listen(connection);

let settings;

connection.onInitialize(params => {
    settings = params.initializationOptions;
    return {
        capabilities: {
            textDocumentSync: documents.syncKind,
            documentFormattingProvider: true,
            documentRangeFormattingProvider: true
        }
    };
});

connection.onDidChangeConfiguration(change => {
    settings.eol = change.settings.files.eol;
});

const resolveParams = params => {
    let doc = documents.get(params.textDocument.uri);
    return {
        uri: params.textDocument.uri,
        version: doc.version,
        textDocument: doc,
        text: doc.getText()
    };
};

connection.onRequest({method: 'textDocument/formatting'}, (params) => {
    let {uri, textDocument, text} = resolveParams(params);

    let range = Range.create(textDocument.positionAt(0), textDocument.positionAt(text.length));

    try {
        return [TextEdit.replace(range, format(uri, text))];
    } catch (e) {
        connection.sendNotification({
            method: 'esformatter/formaterror'
        }, FORMAT_ERROR_MSG);
        return [];
    }
});

connection.onRequest({method: 'textDocument/rangeFormatting'}, (params) => {
    let range = params.range;
    let {uri, text} = resolveParams(params);

    let textLines = text.split(settings.eol);
    let selectedText = textLines.slice(range.start.line, range.end.line + 1).join(settings.eol);

    try {
        let formatedText = format(uri, selectedText);
        let newRange = Range.create(Position.create(range.start.line, 0), Position.create(range.end.line, textLines[range.end.line].length));

        return [TextEdit.replace(newRange, formatedText)];
    } catch (e) {
        connection.sendNotification({
            method: 'esformatter/formaterror'
        }, SELECTED_FORMAT_ERROR_MSG);
        return [];
    }
});

connection.listen();
