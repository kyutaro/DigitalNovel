//BGMを再生するかどうかを判別するためのフラグ
var soundFlg = true;
var audioNum = 0;

var novel = {
    /**
     * 次のページに行く時のBGM処理
     */
    changeSound: function () {
        if (!soundFlg) {
            return false;
        }
        var linkPage = $('#next-page').attr('href');
        this.effectProcess(linkPage);
        this.soundProcess(linkPage);

    },
    /**
     * 前のページに戻る時のBGM処理
     */
    prevSound: function () {
        if (!soundFlg) {
            return false;
        }
        var linkPage = $('#prev-page').attr('href');
        this.effectProcess(linkPage);
        this.soundProcess(linkPage);
    },
    /**
     * ページ遷移時に、効果音があれば再生する
     * @param string linkPage
     */
    effectProcess: function (linkPage) {
        linkPage = linkPage.slice(2, 5);
        var effectId = 'novel-effect-' + linkPage + '-audio';
        if (document.getElementById(effectId)) {
            document.getElementById(effectId).play();
        }
    },
    /**
     * ページ遷移時の詳細なBGM処理
     * @param string linkPage
     */
    soundProcess: function (linkPage) {
        linkPage = linkPage.slice(2, 5);

        var isSameSound = this.isSameSound(linkPage);
        if (isSameSound) {
            //同じ音楽ならBGMを変更しない
            return false;
        }

        // 現在再生中のBGMがあった場合、停止する
        this.checkOnPlay();
        var linkAudio = 'audio-' + linkPage;
        document.getElementById(linkAudio).play();
    },
    /**
     * 遷移元の音楽と遷移先の音楽が同じものかどうかを判断する
     * @param string linkPage
     * @return bool
     */
    isSameSound: function (linkPage) {
        var linkSourceId = '#source-' + linkPage;
        var linkSource = $(linkSourceId).attr('src');

        var currentSourceId = this.currentSourceId();
        var currentSource = $(currentSourceId).attr('src');

        if (linkSource !== currentSource) {
            return false;
        }
        return true;
    },
    /**
     * 現在ページのsourceタグのid情報を取得(BGM処理に必要)
     * @param string currentSourceId
     */
    currentSourceId: function () {
        var page = $('#novel-page').text();
        var currentSourceId = '#source-' + page;

        return currentSourceId;
    },
    /**
     * 現在再生中のBGMがあった場合、停止する
     */
    checkOnPlay: function () {
        for (var i = 1; i <= audioNum; i++) {
            if(i < 10) {
                var currentAudio = 'audio-' + 'p0' + i;
            } else {
                var currentAudio = 'audio-' + 'p' + i;
            }
            console.log(currentAudio);
            if (!document.getElementById(currentAudio).paused) {
                document.getElementById(currentAudio).pause();
                currentAudio.currentTime = 0;
            }
        }
    },
    /**
     * 次の章へ
     */
    nextChap: function () {
        var chap = document.getElementById("next-chapter");
        window.location.href = '../' + chap.dataset.nextChapter + '/p01.php';
    }
};

//初期画面読み込み時の処理
$(document).ready(function () {
    //背景画像処理
    var changeImage = $('.novel-image').text();
    $('.main-content').css('background-image', changeImage);

    //ページTOPに行かないことへの対処
    $('html,body').animate({scrollTop: 0}, '1');

    //audioタグの数を取得(BGM処理に必要)
    audioNum =  $('#bgm-block').children('audio').length;

    //ダイアログで音楽処理(スマホ対策でダイアログを出すことで音楽再生を実現)
    $("#play-dialog").dialog({
        autoOpen: true,
        title: '音楽の再生',
        closeOnEscape: false,
        modal: true,
        buttons: [
            {
                text: 'いいえ',
                style: 'margin-right: 110px;',
                click: function () {
                    soundFlg = false;
                    $(this).dialog('close');
                }
            },
            {
                text: 'はい',
                click: function () {
                    var page = $('#novel-page').text();
                    var audio = 'audio-' + page;
                    document.getElementById(audio).play();
                    $(this).dialog('close');
                }
            }
        ]
    });
});