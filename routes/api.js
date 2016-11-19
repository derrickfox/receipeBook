var express = require('express');
var router = express.Router();
var mongoose = require( 'mongoose' );
var Receipe = mongoose.model('Receipe');

//router.use('/receipes');

router.route('/ingredients/:ingredients')
    //gets receipes with ingredients that appear in the array
    .get(function(req, res){
        console.log('Getting ingredients...');
        //Receipe.find(function(err, receipes){
        //    console.log('debug2');
        //    if(err){
        //        return res.send(500, err);
        //    }
        //    return res.send(200,receipes);
        //});

        Receipe.find( {
            receipeIngredients: { $all: ["Apple", "Grapes"] }
        }, function(err, list){
                if(err){
                    return res.send(500, err);
                }
            return res.send(200, list);
        });
    });

router.route('/receipes')
    //creates a new receipe
    .post(function(req, res){

        var receipe = new Receipe();
        receipe.receipeName = req.body.receipeName;
        receipe.receipeDescription = req.body.receipeDescription;
        receipe.receipePicture = req.body.receipePicture;
        receipe.receipeIngredients = req.body.receipeIngredients;
        receipe.save(function(err, receipe) {
            if (err){
                return res.send(500, err);
            }
            return res.json(receipe);
        });
    })
    //gets all receipes
    .get(function(req, res){
        Receipe.find(function(err, receipes){
            if(err){
                return res.send(500, err);
            }
            return res.send(200,receipes);
        });
    });

//receipe-specific commands. likely won't be used
router.route('/receipes/:id')
    //gets specified receipe
    .get(function(req, res){
        Receipe.findById(req.params.id, function(err, receipe){
            if(err)
                res.send(err);
            res.json(receipe);
        });
    })
    //updates specified receipe
    .put(function(req, res){
        Receipe.findById(req.params.id, function(err, receipe){
            if(err)
                res.send(err);

            receipe.receipeName = req.body.receipeName;
            receipe.receipeDescription = req.body.receipeDescription;
            receipe.receipePicture = req.body.receipePicture;
            receipe.receipeIngredients = req.body.receipeIngredients;

            receipe.save(function(err, receipe){
                if(err)
                    res.send(err);

                res.json(receipe);
            });
        });
    })
    //deletes the receipe
    .delete(function(req, res) {
        Receipe.remove({
            _id: req.params.id
        }, function(err) {
            if (err)
                res.send(err);
            res.json("deleted :(");
        });
    });

module.exports = router;
