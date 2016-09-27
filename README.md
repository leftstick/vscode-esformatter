# vscode-esformatter

[![vscode version][vs-image]][vs-url]
![][install-url]
![][rate-url]
![][license-url]

> Format JavaScript using [esformatter](https://github.com/millermedeiros/esformatter)

![](https://raw.githubusercontent.com/leftstick/vscode-esformatter/master/docs/img/format.gif)


VS Code has built-in formatter, but it may lack of the customizability which required by your team urgently. This extension brings [esformatter](https://github.com/millermedeiros/esformatter), and have it as the default formatting tools.


## Install

Launch VS Code Quick Open (`cmd`/`ctrl` + `p`), paste the following command, and press enter.

```
ext install esformatter
```

## Usage

I assume you are familiar with the [configuration](https://github.com/millermedeiros/esformatter/blob/master/doc/config.md) for `esformatter`.

`vscode-esformatter` will read configurations from following places in order:

1. `${workspaceRoot}/.esformatter`(strongly recommended)
2. configurations directly set in `package.json`
3. `~/.esformatter`
4. `/.esformatter`

Once you save updates to a `JavaScript` file, `vscode-esformatter` tries format code automatically for you.

### Settings

```javascript
{
    "esformatter.formatOnSave": false //whether to format code on save
}
```

### Keybindings

The default format command `shift+alt+f` is overrided, so when you go with `Format Code` approach, `vscode-esformatter` take the job from built-in formatter.


## Limitation

Currently, it's a very draft version, format for selection is not supported. And potential exception may found while using `vscode-esformatter`, feel free open an [issue](https://github.com/leftstick/vscode-esformatter/issues)


## LICENSE ##

[MIT License](https://raw.githubusercontent.com/leftstick/vscode-esformatter/master/LICENSE)


[vs-url]: https://marketplace.visualstudio.com/items?itemName=howardzuo.vscode-esformatter
[vs-image]: http://vsmarketplacebadge.apphb.com/version/howardzuo.vscode-esformatter.svg
[install-url]: http://vsmarketplacebadge.apphb.com/installs/howardzuo.vscode-esformatter.svg
[rate-url]: http://vsmarketplacebadge.apphb.com/rating/howardzuo.vscode-esformatter.svg
[license-url]: https://img.shields.io/github/license/leftstick/vscode-esformatter.svg