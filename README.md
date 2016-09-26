# vscode-esformatter

[![vscode version][vs-image]][vs-url]
![][install-url]
![][rate-url]
![][license-url]

> Format JavaScript using [esformatter](https://github.com/millermedeiros/esformatter)

![](https://raw.githubusercontent.com/leftstick/vscode-esformatter/master/docs/img/format.gif)


## Install

Launch VS Code Quick Open (`cmd`/`ctrl` + `p`), paste the following command, and press enter.

```
ext install esformatter
```


## Usage

Once you save updates to a `JavaScript` file, `vscode-esformatter` tries format code for you.

And `vscode-esformatter` use [esformatter.rc](https://github.com/millermedeiros/esformatter/blob/master/doc/api.md#esformatterrcfilepath-customoptionsobject) for the formatting rules.

> You can disable the format feature by setting `esformatter.formatOnSave: false` in your `settings.json`.


## Limitation

Currently, it's a very draft version, format for selection is not supported. And potential exception may found while using `vscode-esformatter`, feel free open an [issue](https://github.com/leftstick/vscode-esformatter/issues)


## LICENSE ##

[MIT License](https://raw.githubusercontent.com/leftstick/vscode-esformatter/master/LICENSE)


[vs-url]: https://marketplace.visualstudio.com/items?itemName=howardzuo.vscode-esformatter
[vs-image]: http://vsmarketplacebadge.apphb.com/version/howardzuo.vscode-esformatter.svg
[install-url]: http://vsmarketplacebadge.apphb.com/installs/howardzuo.vscode-esformatter.svg
[rate-url]: http://vsmarketplacebadge.apphb.com/rating/howardzuo.vscode-esformatter.svg
[license-url]: https://img.shields.io/github/license/leftstick/vscode-esformatter.svg