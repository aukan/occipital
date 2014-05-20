var occ = require('../occipital.js');
var lobe = new occ.Lobe({'utilityWrapper':'imagemagick'});

lobe.processSync('./input.png', './output.png',
    {
        outputOptions : [
            { fill     : '"#00fdff"' },
            { colorize : '50%' }
        ]
    }
);

lobe.getImageInfo('./input.png', {
    onSuccess : function (info) {
        console.log(info);
    }
});
