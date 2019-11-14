var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var db = require('../config/db');
var url = require('url');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Rest Node' });
});

router.post('/team/players/newPlayer',function (req,res,next) {
  try {
    console.log(req.body);
    db.getConnection(function (err,conn) {
      if (!err) {
        var qu = "INSERT INTO players SET ?";
        var inserval = {
			"player_name" : req.body.player_name,
			"position" : req.body.position,
			"team_id" : req.body.team_id
			};
      var query = conn.query(qu, inserval, function (err,result) {
        if (!err) {
          var player_id = result.insertId;
				  res.json({"player_id":player_id});
        } else {
          console.log("SQL error while performing insertion: ",err);
          console.log(err);
          return next(err);
        }
      })
      } else {
      console.log('Error while performing Query.');
      console.log(err);
      return next(err);
      }
    })
  } catch (e) {
    console.log("Error : "+e);
    return next(e);
  }
});

router.get('/teams/playersList', function (req,res,next) {
  try {
    console.log(req.body);
    db.getConnection(function (err,conn) {
      if (!err) {
        var q2 = "SELECT * FROM players where team_id='1'";
        conn.query(q2,function (err,result) {
          if (!err) {
            res.json(result);
          } else {
            console.log("SQL error while performing search: ",err);
            console.log(err);
            return next(err);
          }
        })
      } else {
      console.log('Error while performing Query.');
      console.log(err);
      return next(err);
    }
    })
  } catch (e) {
    console.log("Error : "+e);
    return next(e);
  }
})

module.exports = router;
