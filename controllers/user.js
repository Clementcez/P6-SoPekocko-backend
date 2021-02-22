const User = require('../models/user');
const bcrypt = require('bcrypt');
const webToken = require('jsonwebtoken');
const validator = require('validator');
const CryptoJS = require("crypto-js");

exports.signUp = (req, res, next) => {
    if( validator.isEmail (req.body.email) !== true ){
        throw 'Email non valable !';
    }
    else if( validator.isStrongPassword (req.body.password) !== true ){
        throw 'Mot de pass non valable !';
    }
    else{
        User.find()
        .then(users => {
            if(users.length === 0){
                bcrypt.hash(req.body.password, 10)
                .then(hash => {
                    const emailCrypt = CryptoJS.AES.encrypt( req.body.email, 'secret key 123').toString();
                    const user = new User ({
                        email : emailCrypt,
                        password: hash
                    })
                    user.save()
                    .then(() => res.status(201).json({ message: 'Utilisateur créé!'}))
                    .catch(error => res.status(500).json({ error }))
                })
                .catch(error => res.status(500).json({ error }))
            }
            else{
                for (let user of users){
                    let emailDecrypt = CryptoJS.AES.decrypt(user.email, 'secret key 123').toString(CryptoJS.enc.Utf8);
                    if(emailDecrypt === req.body.email){
                        throw 'Email déja utilisé !';
                    }
                }
                bcrypt.hash(req.body.password, 10)
                .then(hash => {
                    const emailCrypt = CryptoJS.AES.encrypt( req.body.email, 'secret key 123').toString();
                    const user = new User ({
                        email : emailCrypt,
                        password: hash
                    })
                    user.save()
                    .then(() => res.status(201).json({ message: 'Utilisateur créé!'}))
                    .catch(error => res.status(500).json({ error }))
                })
                .catch(error => res.status(500).json({ error }))
            }
        })
        .catch(error => res.status(401).json({ error }))
    }  
};

exports.logIn = (req, res, next) => {
    if( validator.isEmail (req.body.email) !== true ){
        throw 'Email non valable !';
    }
    else{
        User.find()
        .then(users => {
            for (let user of users){
                let emailDecrypt = CryptoJS.AES.decrypt(user.email, 'secret key 123').toString(CryptoJS.enc.Utf8);
                if(emailDecrypt === req.body.email){
                    bcrypt.compare(req.body.password, user.password)
                    .then(valid => {
                        if(!valid) {
                            return res.status(401).json({error: 'Mauvais mot de passe !'})
                        }
                        res.status(200).json({
                            userId: user._id,
                            token: webToken.sign(
                                { userId: user._id },
                                'TOKEN_SECRET',
                                { expiresIn: '24h' }
                            )
                        });
                    })
                    .catch(error => res.status(500).json({ error }))               
                }
            }
        })
        .catch(error => res.status(500).json({ error }));
    }
};