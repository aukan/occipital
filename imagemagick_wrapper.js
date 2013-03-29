var exec = require('child_process').exec;

var ImagemagickWrapper = {};

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
ImagemagickWrapper.process = function (inputFile, outputFile, options){
    var key, option, result, i;
    var inputOptions = '', outputOptions = '';

    options.onError   = options.onError   || function() {};
    options.onSuccess = options.onSuccess || function() {};

    // Convert json options to command line options.
    for (i=0; i < options.outputOptions.length; i+=1) {
        option = options.outputOptions[i];
        key = Object.keys(option)[0];

        // Construct command line options.
        outputOptions += ' -' + key + ' ' + option[key];
    }

    // Execute imagemagick's convert command.
    console.time('process');
    exec('convert ' + inputOptions + ' ' + inputFile + ' ' + outputOptions + ' ' + outputFile, function (error, stdout, stderr) {
        if (error !== null) {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            console.log('exec error: ' + error);

            // Execute onError callback
            options.onError.call( options.context, error, stdout, stderr );
        }

        // Execute onSuccess callback
        options.onSuccess.call( options.context, error, stdout, stderr );
        console.timeEnd('process');
    });
}

exports.process = ImagemagickWrapper.process;
