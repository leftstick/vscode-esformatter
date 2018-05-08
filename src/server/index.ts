import * as vscode from 'vscode';
import { IConnection, IPCMessageReader, IPCMessageWriter, createConnection, TextDocuments, Range, Position, TextEdit, NotificationType, RequestType, DocumentFormattingParams, DocumentRangeFormattingParams } from 'vscode-languageserver';
import { format, FORMAT_ERROR_MSG, SELECTED_FORMAT_ERROR_MSG } from './formatter';

// Create a connection for the server. The connection uses Node's IPC as a transport
let connection: IConnection = createConnection(new IPCMessageReader(process), new IPCMessageWriter(process));

const documents = new TextDocuments();
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

const resolveParams = (params: DocumentFormattingParams) => {
    const doc = documents.get(params.textDocument.uri);
    return {
        uri: params.textDocument.uri,
        version: doc.version,
        textDocument: doc,
        text: doc.getText()
    };
};

connection.onRequest(new RequestType('textDocument/formatting'), (params: DocumentFormattingParams) => {
    let { uri, textDocument, text } = resolveParams(params);

    let range = Range.create(textDocument.positionAt(0), textDocument.positionAt(text.length));

    try {
        connection.sendDiagnostics({
            uri: uri,
            diagnostics: []
        });
        return [TextEdit.replace(range, format(uri, text))];
    } catch (e) {
        return errorHandler(e, uri, FORMAT_ERROR_MSG);
    }
});

connection.onRequest(new RequestType('textDocument/rangeFormatting'), (params: DocumentRangeFormattingParams) => {
    let range = params.range;
    let { uri, text } = resolveParams(params);

    let textLines = text.split(settings.eol);
    let selectedText = textLines.slice(range.start.line, range.end.line + 1).join(settings.eol);

    try {
        let formatedText = format(uri, selectedText);
        let newRange = Range.create(Position.create(range.start.line, 0), Position.create(range.end.line, textLines[range.end.line].length));
        connection.sendDiagnostics({
            uri: uri,
            diagnostics: []
        });
        return [TextEdit.replace(newRange, formatedText)];
    } catch (e) {
        return errorHandler(e, uri, SELECTED_FORMAT_ERROR_MSG);
    }
});

connection.listen();

function errorHandler(e, uri, msg) {
    if (e.name === 'SyntaxError') {
        connection.sendDiagnostics({
            uri: uri,
            diagnostics: e.diagnostics || []
        });
        return [];
    }
    connection.sendNotification(new NotificationType('esformatter/formaterror'), e.message || msg);
}
