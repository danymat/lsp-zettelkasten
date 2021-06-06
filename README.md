# lsp-zettelkasten

This repo is a basic implementation of a lsp for zettelksaten markdown files

![movie-1](https://github.com/lsp-zettelkasten/lsp-zettelkasten/blob/main/.assets/vid1.mov)


## Features

- ✔️ Support for link completion for type `[[link here]]`.
- 🚧 Clickable links inside `[[..]]`.
- ✔️ Support for file content preview in completion (with onCompletionResolve).
- 🚧 Hover option on clickable links, in order to preview the file.
- 🚧 Support tag completions with `#` character (needs a grammar).

## Installation

```bash
git clone https://github.com/lsp-zettelkasten/lsp-zettelkasten.git
cd lsp-zettelkasten/server
npm install
npm run compile
```

After compiling, the compiled javascript will be in `out` directory.

## Usage

The command to start the lsp is `node out/server.js --stdio`.

However, you'll need a working client for your text editor.

- Neovim (using [lspconfig](https://github.com/lsp-zettelkasten/lsp-zettelkasten.git))

<details><summary><tt>~/.config/nvim/init.lua</tt></summary>

```lua
local lspconfig = require'lspconfig'
local configs = require'lspconfig/configs'

if not lspconfig.zettelkastenlsp then
  configs.zettelkastenlsp = {
    default_config = {
      cmd = {'node',  'path/to/lsp-zettelkasten/out/server.js', '--stdio'};
      filetypes = {'markdown'};
      root_dir = function(fname)
        return lspconfig.util.find_git_ancestor(fname) or vim.loop.os_homedir()
      end;
      settings = {};
    };
  }
end
lspconfig.zettelkastenlsp.setup{}
```

</details>
