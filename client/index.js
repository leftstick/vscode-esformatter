
const {connect} = require('./connection');
const {onSave} = require('./actions');

module.exports.activate = function(context) {

    let client = connect(context);

    onSave(context, client);

};

// this method is called when your extension is deactivated
module.exports.deactivate = function deactivate() {
    console.log('destroyed');
};
