'use strict';
var mongoose = require('mongoose');
var TeamInfo = mongoose.model('TeamInfo');
var GameSchedule = mongoose.model('GameSchedule');

exports.processRequest = function(req, res) {
  if (req.body.queryResult.intent.displayName == "schedule") {
    getTeamSchedule(req,res);
  }
  else if (req.body.queryResult.intent.displayName == "tell.about")
  {
    getTeamInfo(req,res);
  }
};

function getTeamInfo(req,res)
{
  let teamToSearch = req.body.queryResult && req.body.queryResult.parameters && req.body.queryResult.parameters.team ? req.body.queryResult.parameters.team : 'Unknown';
  TeamInfo.findOne({name:teamToSearch},function(err,teamExists)
  {
    if (err)
    {
      return res.json({
        fulfillmentText: 'Something went wrong!',
        fulfillmentMessages: [{
          text: [
            'Something went wrong!'
          ]
        }],
        source: 'team info'
      });
    }
    if (teamExists)
    {
      return res.json({
        fulfillmentText: teamExists.description,
        fulfillmentMessages: [{
          text: [
            teamExists.description
          ]
        }],
        source: 'team info'
      });
    }
    else {
      return res.json({
        fulfillmentText: 'Currently I am not having information about this team',
        fulfillmentMessages: [{
          text: [
            'Currently I am not having information about this team'
          ]
        }],
        source: 'team info'
      });
    }
  });
}

function getTeamSchedule(req,res)
{
  let parameters = req.body.queryResult.parameters;
  
  if (parameters.team1 == "")
  {
    let game_occurence = parameters.game_occurence;
    let team = parameters.team;
    
    if (game_occurence == "previous")
    {
      //previous game
      GameSchedule.find({opponent:team},function(err,games)
      {
        if (err)
        {
          return res.json({
            fulfillmentText: 'Something went wrong!',
            fulfillmentMessages: [{
              text: [
                'Something went wrong!'
              ]
            }],
            source: 'game schedule'
          });
        }

        if (games)
        {
          var requiredGame;

          for (var i = 0; i < games.length; i++)
          {
            var game = games[i];
            var convertedCurrentDate = new Date();
            var convertedGameDate = new Date(game.date);

            if (convertedGameDate > convertedCurrentDate)
            {
              if(games.length > 1)
              {
                requiredGame = games[i-1];

                var winningStatement = "";

                if (requiredGame.isWinner)
                {
                  winningStatement = "Kings won this match by " + requiredGame.score;
                }
                else {
                  winningStatement = "Kings lost this match by " + requiredGame.score;
                }
                return res.json({
                  fulfillmentText: 'Last game between Kings and ' + parameters.team + ' was played on ' + requiredGame.date + ' .' + winningStatement,
                  fulfillmentMessages: [{
                    text: [
                      'Last game between Kings and ' + parameters.team + ' was played on ' + requiredGame.date + ' .' + winningStatement
                    ]
                  }],
                  source: 'game schedule'
                });

                break;
              }
              else {
                return res.json({
                  fulfillmentText: 'Cant find any previous game played between Kings and ' + parameters.team,
                  fulfillmentMessages: [{
                    text: [
                      'Cant find any previous game played between Kings and ' + parameters.team
                    ]
                  }],
                  source: 'game schedule'
                });
              }
            }
          }
        }
      });
    }
    else 
    {
      return res.json({
        fulfillmentText: 'Next game schedules will be available soon',
        fulfillmentMessages: [{
          text: [
            'Next game schedules will be available soon'
          ]
        }],
        source: 'game schedule'
      });
    }
  }
  else {
    return res.json({
      fulfillmentText: 'Cant handle the queries with two teams now. I will update myself',
      fulfillmentMessages: [{
          text: [
            'Cant handle the queries with two teams now. I will update myself'
          ]
        }],
      source: 'game schedule'
    });
  }
}