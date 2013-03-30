var Ne = require('neon');

var Occipital = {};

Ne.Class(Occipital, 'Lobe')({

    prototype : {
        /*
         * utilityWrapper.
         *
         * Configures Occipital to use a different utilityWrapper.
         * By default it uses 'imagemagick'
         */
        utilityWrapper : 'imagemagick',

        init : function init (config) {
            Object.keys(config).forEach(function (property) {
                this[property] = config[property];
            }, this);
        },

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
        process : function (inputFile, outputFile, options){
            var utilityWrapper;

            options.onError   = options.onError   || function() {};
            options.onSuccess = options.onSuccess || function() {};

            utilityWrapper = require('./' + this.utilityWrapper + '_wrapper.js');

            utilityWrapper.process(inputFile, outputFile, options);
        }
    }
});

exports.Lobe = Occipital.Lobe;
