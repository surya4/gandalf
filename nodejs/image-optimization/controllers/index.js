const Promise = require('bluebird');
const fs = require('fs');
const path = require('path');
const db = require('../models/schema');

const cpus = require('cpus');
// const rsv8profiler = require('@risingstack/v8-profiler');
// const v8profiler = require('v8-profiler');
// const v8analytics = require('v8-analytics');
// const heapprofile = require('heap-profile');
// const v8cpuanalysis = require('v8-cpu-analysis');

// image processing modules
const sharp = require('sharp');
const gm = require('gm');
const nodeimagemagick = require('node-imagemagick');
const easyimage = require('easyimage');
const jimp = require('jimp');
const pajklwip = require('pajk-lwip');
const mapnik = require('mapnik');
const imageprocessor = require('image-processor');
const images = require('images');
const imagemin =  require('imagemin');
const imageminguetzli =  require('imagemin-guetzli');
// also use lamda function
// const aws = require('aws-sdk');

const readPath = process.env.READPATH;
const writePath = process.env.WRITEPATH;

function kaboom() {
    const dimension = [
        {
            height : 1080,
            width : 1920
        },
        {
            height : 512,
            width : 1024
        },
        {
            height : 360,
            width : 720
        },
        {
            height : 161,
            width : 161
        }
];

    // format = `image1/${format || 'png'}`
   const format = 'jpg';

    fs.readdir(readPath, ( err, files ) => {
        files.forEach(el => {
            const filename =  el.split('.').slice(0, -1).join('.');
            if (filename) {
                sharpImages(el, filename, format, dimension); 
                // gmImages(el, filename, format, dimension); 
                // jimpImages(el, filename, format, dimension); 
                // nodeimagemagickImages(el, filename, format, dimension); 
                // easyimageImages(el, filename, format, dimension); 

                // pajklwipImages(el, filename, format, dimension); 
                // mapnikImages(el, filename, format, dimension); 
                // imageprocessorImages(el, filename, format, dimension);
                // imagesImages(el, filename, format, dimension); 
                // imageminImages(el, filename, format, dimension); 
                // imageminguetzliImages(el, filename, format, dimension); 
                // awsLabdaImages(el, filename, format, dimension);  
            }
        })
     })
}

function sharpImages(oldName, filename, format, dimension) {
    Promise.map(dimension, function(size) {
        // console.log(cpus().length)
        return sharp( readPath + oldName )
            .resize( size.width, size.height)
            .max()
            .toFile( writePath + filename  + '_sharp_' + size.width + '.' + format);
    })
    .then((response) => {
        console.log('sharp done', response);
    })
    .catch(err => {
        console.log('err', err);
    })
}

function gmImages(oldName, filename, format, dimension) {
    Promise.map(dimension, (size) => {
        return gm( readPath + oldName )
            .resize( size.width, size.height)
            // .max()
            .write( writePath + filename  + '_gm_' + size.width + '.' + format, (err) => {
                if (!err) console.log('gm done');
              });
    })
    .catch(err => {
        console.log('err', err);
    })
}

function jimpImages(oldName, filename, format, dimension) {
    Promise.map(dimension, (size) => {
        return jimp.read( readPath + oldName )
        .then(image => {
            console.log('jimp', image) 
            return image
            .resize( size.width, size.height)
            .write( writePath + filename  + '_jimp_' + size.width + '.' + format);    
    })
    .catch(err => {
        console.log('err', err);
    })
})
    
}


function nodeimagemagickImages(oldName, filename, format, dimension) {
    Promise.map(dimension, (size) => {
        nodeimagemagick.resize({
            srcData: fs.readFileSync(readPath + oldName, 'binary'),
            width:   size.width,
            height:  size.height,
          }, function(err, stdout, stderr){
            if (err) throw err
            fs.writeFileSync( writePath + filename  + '_nodeimagemagick_' + size.width + '.' + format, stdout, 'binary');
            console.log('nodeimagemagick done')
          });
    })
    .catch(err => {
        console.log('err', err);
    })
}

async function easyimageImages(oldName, filename, format, dimension) {
    try {
    await Promise.map(dimension, async (size) => { 
        await easyimage.resize({
            src: readPath + oldName,
            dst: writePath + filename  + '_easyimage_' + size.width + '.' + format,
            width: size.width,
            height: size.height
        });
        })
    } catch (error) {
        console.log('err', error);
    }
}

function pajklwipImages(oldName, filename, format, dimension) {
    Promise.map(dimension, (size) => {
        return gm( readPath + oldName )
            .resize( size.width, size.height)
            // .max()
            .write( writePath + filename  + '_gm_' + size.width + '.' + format, (err) => {
                if (!err) console.log('gm done');
              });
    })
    .catch(err => {
        console.log('err', err);
    })
}

// function gmImages(oldName, filename, format, dimension) {
//     Promise.map(dimension, (size) => {
//         return gm( readPath + oldName )
//             .resize( size.width, size.height)
//             // .max()
//             .write( writePath + filename  + '_gm_' + size.width + '.' + format, (err) => {
//                 if (!err) console.log('gm done');
//               });
//     })
//     .catch(err => {
//         console.log('err', err);
//     })
// }

// function gmImages(oldName, filename, format, dimension) {
//     Promise.map(dimension, (size) => {
//         return gm( readPath + oldName )
//             .resize( size.width, size.height)
//             // .max()
//             .write( writePath + filename  + '_gm_' + size.width + '.' + format, (err) => {
//                 if (!err) console.log('gm done');
//               });
//     })
//     .catch(err => {
//         console.log('err', err);
//     })
// }

// function gmImages(oldName, filename, format, dimension) {
//     Promise.map(dimension, (size) => {
//         return gm( readPath + oldName )
//             .resize( size.width, size.height)
//             // .max()
//             .write( writePath + filename  + '_gm_' + size.width + '.' + format, (err) => {
//                 if (!err) console.log('gm done');
//               });
//     })
//     .catch(err => {
//         console.log('err', err);
//     })
// }

// function gmImages(oldName, filename, format, dimension) {
//     Promise.map(dimension, (size) => {
//         return gm( readPath + oldName )
//             .resize( size.width, size.height)
//             // .max()
//             .write( writePath + filename  + '_gm_' + size.width + '.' + format, (err) => {
//                 if (!err) console.log('gm done');
//               });
//     })
//     .catch(err => {
//         console.log('err', err);
//     })
// }

exports.kaboom = kaboom;