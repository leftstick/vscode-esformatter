const esformatter = require('esformatter');

const PLUGIN_UNSUPPORT_MSG = 'Cannot find plugin';

const SYNTAX_ERROR_REGEX = /(.*) \((\d+:\d+)\)/;

const resolveError = function(error) {
    let errorMsg = error.message;
    if (errorMsg.indexOf(PLUGIN_UNSUPPORT_MSG) > -1) {
        let index = errorMsg.indexOf(PLUGIN_UNSUPPORT_MSG) + 19;
        let pluginName = errorMsg.substring(index, errorMsg.indexOf('.', index));
        throw new Error(`Plugin ${pluginName} is not supported. Please consider opening an issue for supporting`);
    }
    if (error.name === 'SyntaxError') {
        const [, message, position] = error.message.match(SYNTAX_ERROR_REGEX);
        const [line, col] = position.split(':').map(v => parseInt(v));
        const diagnostics = [{
            severity: 1, //DiagnosticSeverity.Error
            range: {
                start: {
                    line: line - 1,
                    character: col
                },
                end: {
                    line: line - 1,
                    character: col + 1
                }
            },
            message: message,
            source: error.name
        }];
        error.diagnostics = diagnostics;
        throw error;
    }
    throw error;
};

module.exports.format = function(configPath, content) {

    try {
        return esformatter.format(content, esformatter.rc(configPath));
    } catch (e) {
        resolveError(e);
    }

    return content;
};

module.exports.SELECTED_FORMAT_ERROR_MSG = 'Formating failed, selected code may invalid JavaScript';

module.exports.FORMAT_ERROR_MSG = 'Formating failed, your code is invalid JavaScript';
