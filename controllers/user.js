const User = require('../models/user');
const bcrypt = require('bcrypt');
const webToken = require('jsonwebtoken');
const validator = require('validator');

exports.signUp = (req, res, next) => {
    if( validator.isEmail (req.body.email) !== true ){
        throw 'Email non valable !';
    }
    else if( validator.isStrongPassword (req.body.password) !== true ){
        throw 'Mot de pass non valable !';
    }
    else{
        bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User ({
                email : req.body.email,
                password: hash
            });
            user.save()
            .then(() => res.status(201).json({ message: 'Utilisateur créé!'}))
            .catch( error => res.status(400).json({ error, message: 'email existant' }))
        })
        .catch(error => res.status(500).json({ error }))
    }
};

exports.logIn = (req, res, next) => {
    if( validator.isEmail (req.body.email) !== true ){
        throw 'Email non valable !';
    }
    else{
        User.findOne({ email: req.body.email })
        .then(user => {
            if(!user){
                return res.status(401).json({error: 'Utilisateur non trouvé !'})
            }
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
            .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
    }
};