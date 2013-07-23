var exec = require('child_process').exec;

var ImagemagickWrapper = {};

ImagemagickWrapper.buildCommandOptions = function buildCommandOptions (options){
    var key, option;
    var i, commandOptions = '';

    for (i=0; i < options.length; i+=1) {
        option = options[i];
        key = Object.keys(option)[0];

        // Construct command options.
        commandOptions += ' -' + key + ' ' + option[key];
    }

    return commandOptions;
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

    options.inputOptions    = options.inputOptions || [];
    options.outputOptions   = options.outputOptions || [];
    options.onError         = options.onError       || function() {};
    options.onSuccess       = options.onSuccess     || function() {};

    // Convert json options to command line options.
    command = 'convert ' + ImagemagickWrapper.buildCommandOptions(options.inputOptions) + ' ' + inputFile + ' ' + ImagemagickWrapper.buildCommandOptions(options.outputOptions) + ' ' + outputFile;

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
    var command = '';
    var FFI = require("node-ffi");
    var libc = new FFI.Library(null, {
          "system": ["int32", ["string"]]
    });
    var execSync = libc.system;

    options.inputOptions    = options.inputOptions || [];
    options.outputOptions   = options.outputOptions || [];

    // Convert json options to command line options.
    command = 'convert ' + ImagemagickWrapper.buildCommandOptions(options.inputOptions) + ' ' + inputFile + ' ' + ImagemagickWrapper.buildCommandOptions(options.outputOptions) + ' ' + outputFile;

    // Execute imagemagick's convert command.
    statusCode = execSync(command);

    if (statusCode != 0) {
        console.log('There was an error while trying to run the following command on ImageMagick:');
    }

    if (options.debug === true || statusCode != 0) {
        console.log(command);
    }

    return statusCode;
};

/*
 * Get information about an image.
 *
 * Parameters: Path to the image and extra options if you need them.
 */
ImagemagickWrapper.getImageInfo = function getImageInfo (imagePath, options) {
    var command = '';
    var info = [];
    var result = {};

    // Set default values.
    options           = options || {};
    options.options   = options.options || [];
    options.onError   = options.onError   || function() {};
    options.onSuccess = options.onSuccess || function() {};

    // Convert json options to command line options.
    command = 'identify -format "%f %b %[width] %[height]"' + ImagemagickWrapper.buildCommandOptions(options.options) + ' ' + imagePath;

    // Execute imagemagick's convert command.
    exec(command, function (error, stdout, stderr) {
        if (error !== null) {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            console.log('exec error: ' + error);

            result.stdout = stdout;
            result.stderr = stderr;
            result.errors = [error];

            // Execute onError callback
            options.onError.call( options.context, result );
        } else {
            // Extract options from stdout.
            info = stdout.toString().replace('\n','').split(' ');

            result = {
                contentType : 'image/' + info[0].toLowerCase(),
                extension   : info[0].match(/\.\w+$/)[0],
                name        : info[0],
                size        : parseInt(info[1].replace(/B/, ''), 10),
                width       : parseInt(info[2], 10),
                height      : parseInt(info[3], 10)
            };

            // Execute onSuccess callback
            options.onSuccess.call( options.context, result );
        }
    });
};

// ImagemagickWrapper.getImageInfoSync = function getImageInfo (imagePath, options) {
//     var command = '';
//     var info = [];
//     var result = {};
//     var FFI = require("node-ffi");
//     var libc = new FFI.Library(null, {
//           "system": ["int32", ["string"]]
//     });
//     var execSync = libc.system;
// 
//     // Set default values.
//     options           = options || {};
//     options.options   = options.options || '';
//     options.onError   = options.onError   || function() {};
//     options.onSuccess = options.onSuccess || function() {};
// 
//     // Convert json options to command line options.
//     command = 'identify -format "%m %f %b %[width] %[height]"' + ImagemagickWrapper.buildCommandOptions(options.options) + ' ' + imagePath;
// 
//     // Execute imagemagick's convert command.
//     statusCode = execSync(command);
//     console.log(statusCode);
// 
//     if (statusCode != 0) {
//         console.log('There was an error while trying to run the following command on ImageMagick:');
//     }
// 
//     if (options.debug === true || statusCode != 0) {
//         console.log(command);
//     }
// };

exports.process = ImagemagickWrapper.process;
exports.processSync = ImagemagickWrapper.processSync;
exports.getImageInfo = ImagemagickWrapper.getImageInfo;
// exports.getImageInfoSync = ImagemagickWrapper.getImageInfo;
