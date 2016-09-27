
const {connect} = require('./connection');
const {onSave} = require('./actions');

module.exports.activate = function(context) {

    console.log('Congratulations, your extension "vscode-esformatter" is now active!');

    let client = connect(context);

    onSave(context, client);

};

// this method is called when your extension is deactivated
module.exports.deactivate = function deactivate() {
    console.log('destroyed');
};