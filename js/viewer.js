/* global $ WGo jssgf lang */
/* Copyright 2018 ICHIKAWA, Yuji */

function getAndDrawSgf(number) {
    $.get(`sgf/${number}.sgf`, function(sgf) {
        history.replaceState(null, null, `${location.pathname}?position=${number}`);
        const [root] = jssgf.parse(sgf);
        const game = positionInfos[number - 1];
        const isBlackTurn = game.moveNumber % 2 === 0;
        const turn = isBlackTurn ? lang.BLACK_TO_PLAY : lang.WHITE_TO_PLAY;
        $('#turn').text(turn);
        root.C = turn + '\n';
        root.C += lang.message(game.winrateOfNext);
        root.C += game.games.map(e => {
            if (isBlackTurn) {
                return `${e.date} (${e.label})${e.black || '?'}-${e.white || '?'}`;
            } else {
                return `${e.date} ${e.black || '?'}-${e.white || '?'}(${e.label})`;
            }
        }).join('\n');
        player.loadSgf(jssgf.stringify([root]));
    });
}

WGo.BasicPlayer.layouts.right_bottom = {
    bottom: ["Control"],
    right: ["InfoBox", "CommentBox"]
};
WGo.BasicPlayer.layouts.one_column_bottom = {
    top: ["CommentBox"],
    bottom: ["Control"]
};

let selected; // 棋士名で絞ったときの局面情報
let selectNumber; // 棋士名で絞ったときのselected内での局面番号(0オリジン)
let positionInfos; // 全局面情報

const player = new WGo.BasicPlayer(document.getElementById('container'), {
    enableWheel: false,
    layout: [{
        conditions: { minWidth: 650 },
        layout: WGo.BasicPlayer.layouts["right_bottom"],
        className: "wgo-twocols wgo-large",
    }, {
        layout: WGo.BasicPlayer.layouts["one_column_bottom"],
        className: "wgo-xsmall"
    }]
});


$.get('sgf/games.json', function(data) {
    positionInfos = data;
    const match = location.search.match(/position=([0-9]+)/);
    const number = match ? parseInt(match[1]) : 1;
    $('#position').val(number);
    getAndDrawSgf(number);
    if (innerWidth < 650) {
        setTimeout(function() {
            // モバイルのレイアウトでCommmentsの文字がはみ出るので消している。
            // TODO 全角スペースでCommentsを穴埋めしているのでまともな方法に直す。
            $('.wgo-commentbox .wgo-box-title').text('　　　　　　');
        }, 0);
    }
});

$('#position').keyup(function(event) {
    if (event.keyCode === 13) {
        getAndDrawSgf(event.currentTarget.value);
    }
});

$('#next').on('click', function(event) {
    let number = parseInt($('#position').val()); // numberは1オリジンということに注意
    if (selected) {
        if (selectNumber < selected.length - 1) {
            selectNumber += 1;
        } else {
            selectNumber = 0;
        }
        number = selected[selectNumber].file.replace('.sgf', '');
    } else {
        if (number < positionInfos.length - 1) {
            number += 1;
        } else {
            number = 0;
        }
    }
    $('#position').val(number);
    getAndDrawSgf(number);
});

$('#back').on('click', function(event) {
    let number = parseInt($('#position').val());
    if (selected) {
        if (selectNumber > 0) {
            selectNumber -= 1;
        } else {
            selectNumber = selected.length - 1;
        }
        number = selected[selectNumber].file.replace('.sgf', '');
    } else {
        if (number > 1) {
            number -= 1;
        } else {
            number = positionInfos.length;
        }
    }
    $('#position').val(number);
    getAndDrawSgf(number);
});

$('#player').on('change', function(event) {
    const name = $(event.currentTarget).val();
    if (name) {
        selected = positionInfos.filter(e => {
            const color = e.moveNumber % 2 === 0 ? 'black' : 'white';
            return e.games.some(e => e[color] === name);
        });
        selected.sort((a, b) => b.moveNumber - a.moveNumber);
        if (selected.length === 0) {
            alert('no record');
            selected = null;
        } else {
            selectNumber = 0;
            $('#position').val(selected[selectNumber].file.replace('.sgf', ''));
            $('#next').trigger('click');
        }
    } else {
        selected = null;
    }
});
