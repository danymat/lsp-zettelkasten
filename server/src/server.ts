import { TextDocuments, createConnection, InitializeResult, ProposedFeatures, 
TextDocumentSyncKind, Hover, CompletionList, CompletionParams, CompletionItem, 
MarkupKind } from "vscode-languageserver/node";

import { TextDocument } from "vscode-languageserver-textdocument";

const documents = new TextDocuments(TextDocument);

let connection = createConnection(ProposedFeatures.all);

connection.onInitialize(() => {
    const result: InitializeResult = {
        capabilities: {
            textDocumentSync : TextDocumentSyncKind.Incremental,
            completionProvider: {
                resolveProvider: true,
                triggerCharacters: ["#"]
            }
            //hoverProvider: true
        }
    }
    return result;
})

connection.onInitialized(() => {
    connection.console.log("Initialized");
})

connection.onCompletion((params: CompletionParams) => {
    let test = params.partialResultToken?.toString()
    let messages: CompletionItem[] = []
    let item: CompletionItem = { label: "#foo" }
    messages.push(item)
    item = { label: "#bar"+ test}
    messages.push(item)
    return messages
})

connection.onCompletionResolve((item): CompletionItem => {
	item.detail = 'This is a special hello world function';
	item.documentation =  {
		kind: MarkupKind.Markdown,
		value: [
			'# Heading',
			'```typescript',
			'console.log("Hello World");',
			'```'
		].join('\n')};
	return item;
});


documents.onWillSave((event) => {
	connection.console.log('On Will save received');
});

documents.listen(connection);
connection.listen();
