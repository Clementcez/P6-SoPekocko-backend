const Sauce = require('../models/model');
const fs = require('fs');
const { error } = require('console');

exports.createModel = (req, res, next) =>{
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const newSauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/img/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
    });
    newSauce.save()
    .then(() => res.status(201).json({ message: 'Objet enregister' }))
    .catch(error => res.status(400).json({ error }));
};

exports.likeSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
    .then(sauce =>{
        if(req.body.like == 1){
            const arrayLiked = sauce.usersLiked;
            const userLiked = req.body.userId;
            let like = arrayLiked.push( userLiked );
            Sauce.updateOne({ _id: req.params.id }, { likes: like , usersLiked: arrayLiked })
            .then(() => res.status(200).json({ message: 'like ajouté !'}))
            .catch( error => res.status(400).json({ error }));
        }
        else if(req.body.like == 0){

        }
        else if(req.body.like == -1){
            const arrayDisliked = sauce.usersDisliked;
            const userDisliked = req.body.userId;
            let dislike = arrayDisliked.push( userDisliked );
            Sauce.updateOne({ _id: req.params.id }, { dislikes: dislike , usersDisliked: arrayDisliked })
            .then(() => res.status(200).json({ message: 'Dislike ajouté !'}))
            .catch( error => res.status(400).json({ error }));
        }
    })
    .catch( error => res.status(500).json({ error }));
};

exports.modifModel = (req, res , next) =>{
    const sauceObject = req.file ?
    { 
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/img/${req.file.filename}`
    } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'objet modifié !'}))
    .catch( error => res.status(400).json({ error }));
};

exports.deleteModel = (req, res, next) =>{
    Sauce.findOne({ _id: req.params.id})
        .then(model => {
            const filename = model.imageUrl.split('/img/')[1];
            fs.unlink(`img/${filename}`, () =>{
                Sauce.deleteOne({ _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
                .catch( error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({error}))
};

exports.readModel = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(models => res.status(200).json(models))
    .catch(error => res.status(400).json({ error }));
};

exports.readAllModels = (req, res, next) => {
    Sauce.find()
    .then(models => res.status(200).json(models))
    .catch(error => res.status(400).json({ error }));
};