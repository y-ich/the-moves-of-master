/* Copyright 2018 ICHIKAWA, Yuji */

window.lang = {
    BLACK_TO_PLAY: 'Black to play',
    WHITE_TO_PLAY: 'White to play',
    message: function(winrate) {
        return "Master thinks that Black's winrate is " + Math.round(winrate) + "% by next own move.\n";
    }
}
