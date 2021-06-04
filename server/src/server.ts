import { TextDocuments, createConnection, InitializeResult, ProposedFeatures, 
    TextDocumentSyncKind, Hover, CompletionList, CompletionParams, CompletionItem, 
    MarkupKind, 
    WorkspaceFolder} from "vscode-languageserver/node";

    import { TextDocument } from "vscode-languageserver-textdocument";
    import { readdirSync, readFileSync } from "fs"

    const documents = new TextDocuments(TextDocument);
    let connection = createConnection(ProposedFeatures.all);
    let workspaceFolders: WorkspaceFolder[] = []

    connection.onInitialize((params) => {
        params.workspaceFolders
        workspaceFolders = params.workspaceFolders!
        const result: InitializeResult = {
            capabilities: {
                textDocumentSync : TextDocumentSyncKind.Incremental,
                completionProvider: {
                    resolveProvider: true,
                    triggerCharacters: ["#", "["]
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
        let line = params.position.line
        let char = params.position.character
        let messages: CompletionList = { isIncomplete: false, items : [] }

        let document = documents.get(params.textDocument.uri)
        if (params.context?.triggerCharacter == "#") {

            // Creating messages
            // // TODO
            let item: CompletionItem = { label: "#foo" }
            messages.items.push(item)

            // Resets if the user press space button
            if ( document ) {
                let text = document.getText({
                    start: {line: line , character: char - 1},
                    end: {line: line, character: char},
                })
                if (text == " ") { return null }
        }
    }
    else {
        if (document) {
            let text = document.getText({ 
                start: {line: line, character: char - 2 },
                end: {line: line, character: char}
            })
            let beforeText = document.getText({
                start: { line: line, character: char - 3 },
                end: { line: line, character: char - 2 }
            })
            if ( beforeText == '[' ) { return null }
            else if ( text == '[[' ) {
                let item: CompletionItem = { label: "" }
                getFileNames().forEach((file) => { 
                    item = {label: file } 
                    messages.items.push(item)
                })
            }
            else return null
    }
    }
    return messages
})

function getFileNames() {
    let uri = workspaceFolders.map((ws) => ws.name)
    let files: string[] = []
    uri.forEach(u => {
        readdirSync(u).forEach(file => { 
            if ( !file.startsWith('.') )
                files.push(file.slice(0, -3)) 
        })
    })
    return files
}

    connection.onCompletionResolve((item): CompletionItem => {
        let file = readFileSync(`${item.label}.md`)
        item.detail = item.label
        item.documentation =  {
            kind: MarkupKind.Markdown,
            value: file.toString()
        }
            return item;
    });

    documents.onWillSave((event) => {
        connection.console.log('On Will save received');
    });

    documents.listen(connection);
    connection.listen();
