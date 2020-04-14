(function() {

    const hangman = (() => {
        const _finish = () => {
            $("#armL").velocity({ y2: "+=35px", x2: "+=5px" }, 500);
            $("#armR").velocity({ y2: "+=35px", x2: "-=5px" }, 500);
        }

        const _fall = () => {
            const dur = 500;
            const del = 1000;
            $("#body").velocity({ translateY: "100px" }, { duration: dur, delay: del });
            $("#rope").velocity({ y2: "+=100px" }, { duration: dur, delay: del });
            $("#armL").velocity({ y2: "-=30px" }, { duration: dur, delay: del });
            $("#armR").velocity({ y2: "-=30px" }, { duration: dur, delay: del });
            _finish();
        }

        const dropBody = () => {
            $("#rEyes").addClass("hide");
            $("#xEyes").removeClass("hide");
            $("#door1").velocity({ rotateZ: 90 }, 1000);
            $("#door2").velocity({ rotateZ: -90 }, 1000);
            _fall();
        }

        const reset = () => {
            const dur = 100;
            $("#xEyes").addClass("hide");
            $("#rEyes").removeClass("hide");
            $("#armL").velocity({ y2: "-=5px", x2: "-=5px" }, dur);
            $("#armR").velocity({ y2: "-=5px", x2: "+=5px" }, dur);
            $("#body").velocity({ translateY: "0px" }, dur);
            $("#rope").velocity({ y2: "-=100px" }, dur);
            $("#door1").velocity({ rotateZ: 0 }, { duration: dur, delay: dur });
            $("#door2").velocity({ rotateZ: 0 }, { duration: dur, delay: dur });
        }

        const _bodyParts = ["legR", "legL", "armL", "armR", "torso", "head"];

        const hideAllParts = () => _bodyParts.forEach(e => $("#" + e).addClass("hide"));

        const hideNextPart = chances => $("#" + _bodyParts[chances - 2]).removeClass("hide");

        return {
            dropBody,
            reset,
            hideAllParts,
            hideNextPart
        }
    })()

    const gameObj = {
        //three alphabet arrays in order to make the qwerty layout
        alphabet1: ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
        alphabet2: ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
        alphabet3: ["z", "x", "c", "v", "b", "n", "m"],
        words: ["awkward", "bagpipes", "react", "angular", "node", "ajax",
            "javascript", "firebase", "heroku", "github", "gitlab", "mysql", "mongodb",
            "express", "mongoose", "sequelize", "handlebars", "materialize", "redux", "mysql"
        ],
        startChances: 7,
        curChances: 0,
        curWord: "",            //word to be guessed
        reqLet: [],             //storage for unique letters of our word to guess
        guessLet: "",           //storage for letters guessed this game
        wins: 0,
        losses: 0,
        gameState: 1,           //use to turn on or off clicks, conditional for animation reset
        init() {
            $("#replay").addClass("hide");
            $("#undef").removeClass("hide");
            //set chances and status
            $("#info").html("playing");
            this.curChances = this.startChances;
            $("#chances").html(this.curChances);
            hangman.hideAllParts();
            if (this.gameState === 0) {
                hangman.reset();
            }
            this.gameState = 1;
            this.reqLet = [];
            this.guessLet = "";
            this.getNewWord();
            this.setReqLet();
            this.emptyGuessListDom();
            this.createUnderScores();
            this.resetButtons();
        },
        getNewWord() {
            ///splice curWord with random index from words list (splice so as to remove item from list so no repeats)
            const rand = Math.floor(Math.random() * this.words.length);
            this.curWord = this.words.splice(rand, 1)[0];
        },
        setReqLet() {
            this.reqLet = [...new Set(this.curWord.split(''))];
        },
        checkReqLet(letter) {
            return this.reqLet.includes(letter)
        },
        emptyGuessListDom() {
            $("#guesses").empty();
        },
        createUnderScores() {
            Array(this.curWord.length).fill('_').forEach((elem) => {
                item = $("<li>").addClass("guessLetter").html("_");
                $("#guesses").append(item);
            })
        },
        resetButtons() {
            $(".used").each(function(i, obj) {
                $(this).removeClass("used");
            });
        },
        roundLost() {
            if (this.curChances > 1) {
                hangman.hideNextPart(this.curChances);
            }
            this.curChances -= 1;
            $("#chances").html(this.curChances);
        },
        checkLose() {
            return this.curChances < 1;
        },
        gameLost() {
            this.gameState = 0;
            this.losses += 1;
            $("#losses").html(this.losses);
            $("#info").html("loser");
            $("#undef").addClass("hide");
            $("#replay").removeClass("hide");
            hangman.dropBody();
        },
        checkWin() {
            for (let letter of this.reqLet) {
                if (!this.guessLet.includes(letter)) {
                    return false;
                }
            }
            return true;
        },
        gameWon() {
            this.gameState = 2;
            this.wins += 1;
            $("#wins").html(this.wins);
            $("#info").html("winner");
            $("#undef").addClass("hide");
            $("#replay").removeClass("hide");
        },
        updateCorrectGuess(word, letter) {
            word.split('').forEach((e, i) => {
                if (e === letter) $(".guessLetter")[i].innerHTML = letter
            });
        },
        makeGuess(letter) {
            //on btn click check if btn is usable, then if letter is correct
            const btn = $("#" + letter);
            if (this.gameState === 1 && !btn.hasClass("used") ) {
                btn.addClass("used");                              
                if (this.curWord.includes(letter)) {
                    this.guessLet += letter;
                    this.updateCorrectGuess(this.curWord, letter)
                    if (this.checkWin()) this.gameWon()
                } else {
                    this.roundLost();
                    if (this.checkLose()) this.gameLost()
                }
            }
        }
    }

    const makeButtons = alpha => gameObj[alpha].forEach(e => {
        $("#" + alpha).append(
            $("<li>").addClass("letter shadow")
            .attr("id", e)
            .html(e)
        )
    });

    //init
    $("#replay").click(() => gameObj.init());
    $("body").on('click', '.letter', function() {
        gameObj.makeGuess(this.innerHTML);
    })
    makeButtons("alphabet1");
    makeButtons("alphabet2");
    makeButtons("alphabet3");
    gameObj.init();
})()