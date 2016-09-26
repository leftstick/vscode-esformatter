
const esformatter = require('esformatter');

const PLUGIN_UNSUPPORT_MSG = 'Cannot find plugin';

const resolveError = function(error) {
    let errorMsg = error.message;
    if(errorMsg.indexOf(PLUGIN_UNSUPPORT_MSG) > -1) {
        let index = errorMsg.indexOf(PLUGIN_UNSUPPORT_MSG) + 19;
        let pluginName = errorMsg.substring(index, errorMsg.indexOf('.', index));
        throw new Error(`Plugin ${pluginName} is not supported. Please consider opening an issue for supporting`);
    }
    throw error;
};

module.exports.format = function(configPath, content) {

    try{
	    return esformatter.format(content, esformatter.rc(configPath));
    }catch(e) {
        resolveError(e);
    }

	return content;
};