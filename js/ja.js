/* Copyright 2018 ICHIKAWA, Yuji */

window.lang = {
    BLACK_TO_PLAY: '黒番',
    WHITE_TO_PLAY: '白番',
    message: function(winrate) {
        return 'Masterは次の一手で黒の勝率' + Math.round(winrate) + '%と見ています。\n';
    }
}
