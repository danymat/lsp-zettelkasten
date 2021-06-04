"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_1 = require("vscode-languageserver/node");
var vscode_languageserver_textdocument_1 = require("vscode-languageserver-textdocument");
var fs_1 = require("fs");
var documents = new node_1.TextDocuments(vscode_languageserver_textdocument_1.TextDocument);
var connection = node_1.createConnection(node_1.ProposedFeatures.all);
var workspaceFolders = [];
connection.onInitialize(function (params) {
    params.workspaceFolders;
    workspaceFolders = params.workspaceFolders;
    var result = {
        capabilities: {
            textDocumentSync: node_1.TextDocumentSyncKind.Incremental,
            completionProvider: {
                resolveProvider: true,
                triggerCharacters: ["#", "["]
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
    var line = params.position.line;
    var char = params.position.character;
    var messages = { isIncomplete: false, items: [] };
    var document = documents.get(params.textDocument.uri);
    if (((_a = params.context) === null || _a === void 0 ? void 0 : _a.triggerCharacter) == "#") {
        // Creating messages
        // // TODO
        var item = { label: "#foo" };
        messages.items.push(item);
        // Resets if the user press space button
        if (document) {
            var text = document.getText({
                start: { line: line, character: char - 1 },
                end: { line: line, character: char },
            });
            if (text == " ") {
                return null;
            }
            if (text == "s") {
                item = { label: "#salut" };
                messages.items.push(item);
            }
        }
    }
    else {
        if (document) {
            var text = document.getText({
                start: { line: line, character: char - 2 },
                end: { line: line, character: char }
            });
            var beforeText = document.getText({
                start: { line: line, character: char - 3 },
                end: { line: line, character: char - 2 }
            });
            if (beforeText == '[') {
                return null;
            }
            else if (text == '[[') {
                var item_1 = { label: "" };
                getFileNames().forEach(function (file) {
                    item_1 = { label: file };
                    messages.items.push(item_1);
                });
            }
            else
                return null;
        }
    }
    return messages;
});
function getFileNames() {
    var uri = workspaceFolders.map(function (ws) { return ws.name; });
    var files = [];
    uri.forEach(function (u) {
        fs_1.readdirSync(u).forEach(function (file) {
            if (!file.startsWith('.'))
                files.push(file.slice(0, -3));
        });
    });
    return files;
}
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
