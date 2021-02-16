const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'img')   
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        callback(null, Date.now() + name );
    }
});

const fileFilter = function (req, file, callback){
    const ext = path.extname(file.originalname);
    if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
        return callback(new Error('Only images are allowed'))
    }
    callback(null, true)
}

module.exports = multer({ storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: fileFilter
}).single('image');