const express = require('express');
const routes = express.Router();
const games = require('../game');

routes.get("/", (req, res, next) => {
    res.status(200).json({
        code: 200,
        message: "Alternate Ingredients Backend connected successfully!",
    });
});

routes.get("/select_top_by_playtime", (req, res, next) => {

    let select_top_by_playtime = filters(req);

    // Filter games array in decending order according to game playtime.
    select_top_by_playtime = select_top_by_playtime.sort(function (a, b) {
        return b.totalPlayTime - a.totalPlayTime;
    });

    // send res back to client
    res.status(200).json({
        message: 'Games fetched successfully!',
        data: select_top_by_playtime,
        code: 200
    });
})

routes.get("/select_top_by_players", (req, res, next) => {

    let select_top_by_player = filters(req);
    
    // Filter games array in decending order according to game players.
    select_top_by_player = select_top_by_player.sort(function (a, b) {
        return b.totalPlayers - a.totalPlayers;
    });

    // send res back to client
    res.status(200).json({
        message: 'Games fetched successfully!',
        data: select_top_by_player,
        code: 200
    });
})

function filters(req) {

    let gamesArray = [];
    let uniqueGames = new Set();

    games.data.forEach( (game) => {
        if(gamesArray.length !== 0) {
            console.log('not empty')
            console.log('Check existing game', game.game, !uniqueGames.has(game.game));
            if(!uniqueGames.has(game.game)) {
                uniqueGames.add(game.game);
                gamesArray.push({
                    game: game.game,
                    genre: game.genre,
                    platforms: game.platforms,
                    totalPlayTime: totalPlayTime(game.game),
                    totalPlayers: totalPlayerNumbers(game.game)
                })
            }
        } else {
            console.log('empty', game.game)
            uniqueGames.add(game.game);
            gamesArray.push({
                game: game.game,
                genre: game.genre,
                platforms: game.platforms,
                totalPlayTime: totalPlayTime(game.game),
                totalPlayers: totalPlayerNumbers(game.game)
            })
        }
    })

    console.log(gamesArray);
 
    // Filter games array with the selected genre type.
    if(req.query.genre && req.query.genre !== '') {
        gamesArray = gamesArray.filter( (game) => {
            return game.genre.toLowerCase() == req.query.genre.toLowerCase();
        })
    }
    
    // Filter games array with the selected platform type.
    if(req.query.platform && req.query.platform !== '') {
        gamesArray = gamesArray.filter( (game) => {
            return game.platforms.includes(req.query.platform.split('%20').join(' '));
        })
    }

    return gamesArray;
}

function totalPlayerNumbers(gameName) {
    let playerCount = 0;
    games.data.forEach( (game) => {
        if(game.game === gameName) {
            playerCount++;
        }
    })
    return playerCount;
}

function totalPlayTime(gameName) {
    let totalGamePlayTime = 0;
    games.data.forEach( (game) => {
        if(game.game === gameName) {
            totalGamePlayTime += game.playTime;
        }
    })
    return totalGamePlayTime;
}

routes.get("/platforms", (req, res, next) => {

    let platforms = new Set();

    for(i = 0; i < games.data.length; i++) {
        const game = games.data[i];
        for(j = 0; j < game.platforms.length; j++) {
            platforms.add(game.platforms[j])
        }
    }

    // send res back to client
    res.status(200).json({
        message: 'Platforms fetched successfully!',
        data: [...platforms],
        code: 200
    });
})

routes.get("/genres", (req, res, next) => {

    let genres = new Set();

    for(i = 0; i < games.data.length; i++) {
        genres.add(games.data[i].genre);
    }

    // send res back to client
    res.status(200).json({
        message: 'Genres fetched successfully!',
        data: [...genres],
        code: 200
    });
})

module.exports = routes;