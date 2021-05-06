"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_1 = require("vscode-languageserver/node");
var vscode_languageserver_textdocument_1 = require("vscode-languageserver-textdocument");
var documents = new node_1.TextDocuments(vscode_languageserver_textdocument_1.TextDocument);
var connection = node_1.createConnection(node_1.ProposedFeatures.all);
connection.onInitialize(function () {
    var result = {
        capabilities: {
            textDocumentSync: node_1.TextDocumentSyncKind.Incremental,
            completionProvider: {
                resolveProvider: true,
                triggerCharacters: ["#"]
            }
            //hoverProvider: true
        }
    };
    return result;
});
connection.onInitialized(function () {
    connection.console.log("Initialized");
});
connection.onCompletion(function (params) {
    var _a;
    var test = (_a = params.partialResultToken) === null || _a === void 0 ? void 0 : _a.toString();
    var messages = [];
    var item = { label: "#foo" };
    messages.push(item);
    item = { label: "#bar" + test };
    messages.push(item);
    return messages;
});
connection.onCompletionResolve(function (item) {
    item.detail = 'This is a special hello world function';
    item.documentation = {
        kind: node_1.MarkupKind.Markdown,
        value: [
            '# Heading',
            '```typescript',
            'console.log("Hello World");',
            '```'
        ].join('\n')
    };
    return item;
});
documents.onWillSave(function (event) {
    connection.console.log('On Will save received');
});
documents.listen(connection);
connection.listen();
