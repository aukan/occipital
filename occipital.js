var Occipital = {};

/*
 * utilityWrapper.
 *
 * Configures Occipital to use a different utilityWrapper.
 * By default it uses 'imagemagick'
 */
Occipital.utilityWrapper = 'imagemagick';

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
Occipital.process = function (inputFile, outputFile, options){
    var utilityWrapper;

    options.onError   = options.onError   || function() {};
    options.onSuccess = options.onSuccess || function() {};

    utilityWrapper = require('./' + exports.utilityWrapper + '_wrapper.js');

    utilityWrapper.process(inputFile, outputFile, options);
}

exports.process = Occipital.process;
exports.utilityWrapper = Occipital.utilityWrapper;
