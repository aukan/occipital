var occ = require('../occipital.js');
// occ.utilityWrapper = 'vips';

occ.process('./input.png', './output.png',
    {
        outputOptions : [
            { fill     : '"#00fdff"' },
            { colorize : '50%' }
        ]
    }
);
