
const {connect} = require('./connection');

module.exports.activate = function(context) {

    connect(context);

};

// this method is called when your extension is deactivated
module.exports.deactivate = function deactivate() {
    console.log('destroyed');
};
