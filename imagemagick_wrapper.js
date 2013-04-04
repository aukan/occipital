var exec = require('child_process').exec;

var ImagemagickWrapper = {};

ImagemagickWrapper.buildCommand = function buildCommand (inputFile, outputFile, options){
    var key, option, result, i;
    var inputOptions = '', outputOptions = '';
    var i, command = '';

    command = 'convert ' + inputOptions + ' ' + inputFile + ' ';
    for (i=0; i < options.length; i+=1) {
        option = options[i];
        key = Object.keys(option)[0];

        // Construct command line options.
        command += ' -' + key + ' ' + '\'' + option[key] + '\'' ;
    }
    command += ' ' + outputFile;

    return command;
};

/*
 * Process an Image.
 *
 * Parameters:
 *   inputFile: Path of input image file.
 *   outputFile: Path of output image file.
 * }
 *
 * Options:
 *   {
 *       // Specifies all the operations that will run on the output image.
 *       // This is an Array because order does matter here.
 *       outputOptions : [
 *          { method_name : [parameters] },
 *          ...
 *       ],
 *
 *       onSuccess : function () {} // Callback if the process was correct.
 *       onError   : function () {} // Callback if the process got an error.
 *       context   : [Object] // Context on which to execute the callbacks.
 *   }
 */
ImagemagickWrapper.process = function process (inputFile, outputFile, options){
    var command = '';

    options.onError   = options.onError   || function() {};
    options.onSuccess = options.onSuccess || function() {};

    // Convert json options to command line options.
    command = ImagemagickWrapper.buildCommand(inputFile, outputFile, options.outputOptions);

    // Execute imagemagick's convert command.
    exec(command, function (error, stdout, stderr) {
        if (error !== null) {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            console.log('exec error: ' + error);

            // Execute onError callback
            options.onError.call( options.context, error, stdout, stderr );
        }

        // Execute onSuccess callback
        options.onSuccess.call( options.context, error, stdout, stderr );
    });
};

/*
 * Process an Image Synchronously.
 *
 * Parameters: Same as process.
 */
ImagemagickWrapper.processSync = function processSync (inputFile, outputFile, options){
    var key, option, result, i;
    var inputOptions = '', outputOptions = '';
    var FFI = require("node-ffi");
    var libc = new FFI.Library(null, {
          "system": ["int32", ["string"]]
    });
    var execSync = libc.system;

    // Convert json options to command line options.
    command = ImagemagickWrapper.buildCommand(inputFile, outputFile, options.outputOptions);

    // Execute imagemagick's convert command.
    return execSync(command);
};

exports.process = ImagemagickWrapper.process;
exports.processSync = ImagemagickWrapper.processSync;
