window.onload = function () {

    console.log('fired');
    if (typeof webkitSpeechRecognition !== 'function') {
        alert('크롬에서만 동작 합니다.');
        return false;
    }
    const recognition = new window.webkitSpeechRecognition();

    recognition.maxAlternatives = 10000;
    recognition.lang = "ko";

    let ignoreEndProcess = false;
    let finalTranscript = '';

    recognition.continuous = true;
    recognition.interimResults = true;


    let number = 0;

    recognition.start();

    recognition.onstart = function () {
        console.log('인식 시작');
    }

    recognition.onend = function () {
        console.log('인식 종료');
        recognition.start();
    }

    let textgroup = [];
    let texts;
    let wordEgroup = [];

    recognition.onresult = function (e) {

        let finalTranscript = '';
        let interimTranscript = '';
        if (typeof e.results === 'undefined') {
            recognition.onend = null;
            recognition.stop();
            return;
        }

        for (let i = e.resultIndex; i < e.results.length; ++i) {
            const transcript = e.results[i][0].transcript;
            if (e.results[i].isFinal) {
                finalTranscript += transcript;
            } else {
                interimTranscript += transcript;
            }
        }

        console.log('finalTranscript', finalTranscript);
        console.log('interimTranscript', interimTranscript);

        //----------
        textarray = Array.from(e.results)
            .map(results => results[0].transcript).join("");
        console.log('textarray', textarray);

        texts = interimTranscript.trim().split(' ');
        for (let i = 0; i < texts.length; i++) {
            textgroup = texts[i];
            console.log('textgroup', textgroup);
        }


        let emotions = [];

        async function analyzeEmotions() {
            // 단어별 감정 분석
            const response = await fetch('/sentiment-analysis', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: textgroup }),
            });

            const data = await response.json();

            if (response.ok) {
                const wordsEmotion = {
                    text: textgroup,
                    positive: data.document.confidence.positive,
                    negative: data.document.confidence.negative,
                    neutral: data.document.confidence.neutral,
                };
                wordEgroup.push(wordsEmotion);
            } else {
                console.error(`Error: ${data.error}`);
            }

            //renderEmotions(emotions, wordEgroup);
            renderEmotions(wordEgroup);
        }


        analyzeEmotions();
    }




    let plus = 0;
    let selectedbtn;

    $('button').click(function () {
        selectedbtn = $(this).index();
        console.log(selectedbtn);
        if (selectedbtn < 25) {
            document.querySelector('.score1').innerHTML = "";
            document.querySelector('.score2').innerHTML = "";
            document.querySelector('.score3').innerHTML = "";
            number = 0;
        }
    })

    //function renderEmotions(emotions, wordEgroup) {
    function renderEmotions(wordEgroup) {

        //let emotion = emotions[0];
        let wordE1;
        let wordE2;
        let wordE3;

        for (let i = 0; i < wordEgroup.length; i++) {
            wordE1 = wordEgroup[i];
            wordE2 = wordEgroup[i - 1];
            wordE3 = wordEgroup[i - 2];
        }

        //let _positive = (emotion.positive + wordE.positive) / 2 + plus;
        //let _negative = (emotion.negative + wordE.negative) / 2 + plus;
        //let _neutral = (emotion.neutral + wordE.neutral) / 2;
        let _positive = (wordE1.positive + wordE2.positive + wordE3.positive) / 3;
        let _negative = (wordE1.negative + wordE2.negative + wordE3.negative) / 3;
        let _neutral = (wordE1.neutral + wordE2.neutral + wordE3.neutral) / 3;

        console.log('wordEgroup', wordEgroup);
        console.log(_positive, _negative, _neutral);



        let makescore = function () {

            //변수 선언
            let div = document.createElement('div');
            let score1 = document.querySelector('.score1');

            //버튼이 1번인지 2번인지에 따라 svg 달라지게
            let imgarray = ['resource/svg1.svg', 'resource/svg2.svg'];


            //음계(mp3파일) 달라지도록
            let soundarray = ['do', 're', 'mi', 'fa', 'sol', 'la', 'si', 'do2'];
            let scalearray = [
                //Cmajor
                ['piano/c.mp3', 'piano/d.mp3', 'piano/e.mp3', 'piano/f.mp3', 'piano/g.mp3', 'piano/a.mp3', 'piano/b.mp3', 'piano/2c.mp3'],
                //Dmajor
                ['piano/d.mp3', 'piano/e.mp3', 'piano/f-.mp3', 'piano/g.mp3', 'piano/a.mp3', 'piano/b.mp3', 'piano/2c-.mp3', 'piano/2d.mp3'],
                //Emajor
                ['piano/e.mp3', 'piano/f-.mp3', 'piano/g-.mp3', 'piano/a.mp3', 'piano/b.mp3', 'piano/2c-.mp3', 'piano/2d-.mp3', 'piano/2e.mp3'],
                //Fmajor
                ['piano/f.mp3', 'piano/g.mp3', 'piano/a.mp3', 'piano/a-.mp3', 'piano/2c.mp3', 'piano/2d.mp3', 'piano/2e.mp3', 'piano/2f.mp3',],
                //Gmajor
                ['piano/g.mp3', 'piano/a.mp3', 'piano/b.mp3', 'piano/2c.mp3', 'piano/2d.mp3', 'piano/2e.mp3', 'piano/2f-.mp3', 'piano/2g.mp3'],
                //Amajor
                ['piano/1a.mp3', 'piano/1b.mp3', 'piano/c-.mp3', 'piano/d.mp3', 'piano/e.mp3', 'piano/f-.mp3', 'piano/g-.mp3', 'piano/a.mp3'],
                //Bmajor
                ['piano/1b.mp3', 'piano/c-.mp3', 'piano/d-.mp3', 'piano/e.mp3', 'piano/f-.mp3', 'piano/g-.mp3', 'piano/a-.mp3', 'piano/b.mp3'],
                //D2major
                ['piano/c-.mp3', 'piano/d-.mp3', 'piano/f.mp3', 'piano/f-.mp3', 'piano/g-.mp3', 'piano/a-.mp3', 'piano/2c.mp3', 'piano/2c-.mp3'],
                //E2major
                ['piano/d-.mp3', 'piano/f.mp3', 'piano/g.mp3', 'piano/g-.mp3', 'piano/a-.mp3', 'piano/2c.mp3', 'piano/2d.mp3', 'piano/2d-.mp3'],
                //G2major
                ['piano/f-.mp3', 'piano/g-.mp3', 'piano/a-.mp3', 'piano/b-.mp3', 'piano/2c-.mp3', 'piano/2d-.mp3', 'piano/2f.mp3', 'piano/2f-.mp3'],
                //A2major
                ['piano/g-.mp3', 'piano/a-.mp3', 'piano/2c.mp3', 'piano/2c-.mp3', 'piano/2d-.mp3', 'piano/2f.mp3', 'piano/2g.mp3', 'piano/2g-.mp3'],
                //B2major
                ['piano/1a-.mp3', 'piano/c.mp3', 'piano/d.mp3', 'piano/d-.mp3', 'piano/f.mp3', 'piano/g.mp3', 'piano/a.mp3', 'piano/a-.mp3'],

                //Aminor
                ['piano/1a.mp3', 'piano/1b.mp3', 'piano/c.mp3', 'piano/d.mp3', 'piano/e.mp3', 'piano/f.mp3', 'piano/g.mp3', 'piano/a.mp3'],
                //Bminor
                ['piano/1a.mp3', 'piano/c-.mp3', 'piano/d.mp3', 'piano/e.mp3', 'piano/f-.mp3', 'piano/g.mp3', 'piano/a.mp3', 'piano/b.mp3'],
                //C2minor
                ['piano/c-.mp3', 'piano/d-.mp3', 'piano/e.mp3', 'piano/f-.mp3', 'piano/g-.mp3', 'piano/a.mp3', 'piano/b.mp3', 'piano/2c-.mp3'],
                //Dminor
                ['piano/d.mp3', 'piano/e.mp3', 'piano/f.mp3', 'piano/g.mp3', 'piano/a.mp3', 'piano/a-.mp3', 'piano/2c.mp3', 'piano/2d.mp3'],
                //Eminor
                ['piano/e.mp3', 'piano/f-.mp3', 'piano/g.mp3', 'piano/a.mp3', 'piano/b.mp3', 'piano/2c.mp3', 'piano/2d.mp3', 'piano/2e.mp3'],
                //F2minor
                ['piano/f-.mp3', 'piano/g-.mp3', 'piano/a.mp3', 'piano/b.mp3', 'piano/2c-.mp3', 'piano/2d.mp3', 'piano/2e.mp3', 'piano/2f-.mp3'],
                //G2minor
                ['piano/g-.mp3', 'piano/a-.mp3', 'piano/b.mp3', 'piano/2c-.mp3', 'piano/2d-.mp3', 'piano/2e.mp3', 'piano/2f-.mp3', 'piano/2g-.mp3'],
                //B2minor
                ['piano/1b-.mp3', 'piano/c.mp3', 'piano/c-.mp3', 'piano/d-.mp3', 'piano/f.mp3', 'piano/f-.mp3', 'piano/g-.mp3', 'piano/a-.mp3'],
                //Cminor
                ['piano/c.mp3', 'piano/d.mp3', 'piano/d-.mp3', 'piano/f.mp3', 'piano/g.mp3', 'piano/g-.mp3', 'piano/a-.mp3', 'piano/2c.mp3'],
                //E2minor
                ['piano/d-.mp3', 'piano/f.mp3', 'piano/f-.mp3', 'piano/g-.mp3', 'piano/a-.mp3', 'piano/b-.mp3', 'piano/2c-.mp3', 'piano/2d-.mp3'],
                //F2minor
                ['piano/f.mp3', 'piano/g.mp3', 'piano/g-.mp3', 'piano/a-.mp3', 'piano/2c.mp3', 'piano/2c-.mp3', 'piano/2d-.mp3', 'piano/2f.mp3'],
                //Gminor 
                ['piano/g.mp3', 'piano/a.mp3', 'piano/a-.mp3', 'piano/2c.mp3', 'piano/2d.mp3', 'piano/2d-.mp3', 'piano/2f.mp3', 'piano/2g.mp3']
            ]
            let scale = scalearray[selectedbtn];


            let sound;
            let soundIndex;
            let _img;

            function neutral1() {
                let lengarr = ['1', '2', '3', '4', '5'];
                let randomIndex = Math.floor(Math.random() * 6);
                let length = lengarr[randomIndex]

                let beats = [];
                let beatCount = 0;

                if (length == 1) {
                    beats = ['beat1'];
                    beatCount = 1;
                } else if (length == 2) {
                    beats = ['beat2', 'beat3', 'beat3'];
                    beatCount = 3;
                } else if (length == 3) {
                    beats = ['beat4', 'beat3'];
                    beatCount = 2;
                } else if (length == 4) {
                    beats = ['beat3', 'beat4'];
                    beatCount = 2;
                } else if (length == 5) {
                    beats = ['beat2', 'beat2'];
                    beatCount = 2;
                } else {
                    beats = ['beat5', 'beat5', 'beat5'];
                    beatCount = 3;
                }

                for (let i = 0; i < beatCount; i++) {
                    let _random1 = Math.floor(Math.random() * 2) - 1;
                    let _soundIndex = soundIndex + i + _random1;
                    if (_soundIndex >= scale.length) {
                        _soundIndex = scale.length - 1;
                    } else if (_soundIndex <= 0) {
                        _soundIndex = 0;
                    }
                    let _random2 = Math.floor(Math.random() * 4);
                    let volume_arr = ['0.2', '0.3', '0.4', '0.5'];
                    let _volume = volume_arr[_random2];
                    makePianoElement(beats[i], _soundIndex, _volume);
                }
            }

            function makePianoElement(beat, soundIndex, _volume) {
                let _random3 = Math.floor(Math.random() * 3);
                let borderarr = ['0', '20', '40'];
                let _border = borderarr[_random3];

                let piano = document.createElement('audio');
                let img = document.createElement('span');
                let line = document.createElement('hr');
                //let _r = parseInt(emotion.positive + wordE.positive);
                //let _g = parseInt(emotion.neutral + wordE.neutral);
                //let _b = parseInt(emotion.negative + wordE.negative);
                let _r = parseInt((wordE1.positive + wordE2.positive + wordE3.positive) / 3);
                let _g = parseInt((wordE1.neutral + wordE2.neutral + wordE3.neutral) / 3);
                let _b = parseInt((wordE1.negative + wordE2.negative + wordE3.negative) / 3);
                piano.src = scale[soundIndex];
                piano.volume = _volume;
                if (_volume == '0.2') {
                    img.style.height = '30px';
                    img.style.width = '30px';
                } else if (_volume == '0.3') {
                    img.style.height = '70px';
                    img.style.width = '70px';
                } else if (_volume == '0.4') {
                    img.style.height = '100px';
                    img.style.width = '100px';
                } else {
                    img.style.height = '150px';
                    img.style.width = '150px';
                }
                div.append(img, piano, line);
                div.classList.add('scorediv');
                score1.appendChild(div);
                piano.classList.add('piano');
                piano.classList.add(beat);
                img.classList.add('scoresvg');
                line.classList.add('line1');
                if (beat == 'beat1') {
                    number = number + 60;
                } else if (beat == 'beat4') {
                    number = number + 50;
                } else if (beat == 'beat2') {
                    number = number + 40;
                } else if (beat == 'beat3') {
                    number = number + 30;
                } else if (beat == 'beat5') {
                    number = number + 20;
                }
                img.style.left = number + 'px';
                img.style.borderRadius = _border;
                img.style.background = 'rgba(' + _r + ',' + _g + ',' + _b + ',1)';
                //img.style.boxShadow = '0px 0px 20px rgb(' + _g + ',' + _b + ',' + _r + ')';
                img.style.transform = 'rotate:(' + _border + 'deg)';
                line.style.left = number + 'px';
                sound = soundarray[soundIndex];
                img.classList.add(sound);
                line.classList.add(sound + 'hr');

                if ($('.score').innerHTML == "") {
                    number = 0;
                }
                if (number >= 4000) {
                    number = 0;
                }

                setTimeout(function () {
                    img.style.opacity = '0';
                    line.style.opacity = '0';
                    setTimeout(function () {
                        if (img.style.opacity == '0') {
                            img.remove();
                            line.remove();
                            piano.remove();
                        }
                        if (div.innerHTML == "") {
                            div.remove();
                        }
                    }, 10000)
                }, 20000);
            }


            if (selectedbtn <= 11) {
                if (_positive < 12) {
                    soundIndex = 0;
                    neutral1();
                } else if (_positive > 12 && _positive < 25) {
                    soundIndex = 1;
                    neutral1();
                } else if (_positive > 25 && _positive < 37) {
                    soundIndex = 2;
                    neutral1();
                } else if (_positive > 37 && _positive < 44) {
                    soundIndex = 3;
                    neutral1();
                } else if (_positive > 44 && _positive < 50) {
                    soundIndex = 4;
                    neutral1();
                } else if (_positive > 50 && _positive < 62) {
                    soundIndex = 5;
                    neutral1();
                } else if (_positive > 62 && _positive < 75) {
                    soundIndex = 6;
                    neutral1();
                } else {
                    soundIndex = 7;
                    neutral1();
                }


            } else if (selectedbtn > 11) {
                if (_negative < 12) {
                    soundIndex = 7;
                    neutral1();
                } else if (_negative > 12 && _negative < 25) {
                    soundIndex = 6;
                    neutral1();
                } else if (_negative > 25 && _negative < 37) {
                    soundIndex = 5;
                    neutral1();
                } else if (_negative > 37 && _negative < 44) {
                    soundIndex = 4;
                    neutral1();
                } else if (_negative > 44 && _negative < 50) {
                    soundIndex = 3;
                    neutral1();
                } else if (_negative > 50 && _negative < 62) {
                    soundIndex = 2;
                    neutral1();
                } else if (_negative > 62 && _negative < 75) {
                    soundIndex = 1;
                    neutral1();
                } else {
                    soundIndex = 0;
                    neutral1();
                }
            }

        }

        makescore();

    }
}



$(document).ready(function () {

    $('.play').click(function () {
        let i = 0;

        let _play = function () {
            //.piano의 클래스를 가진 i번째 오디오를 play
            $('.piano').eq(i).get(0).play();

            //let _top = $('.scoresvg').eq(i).css("top");
            $('.scoresvg').eq(i).css("transform", "translateY(-7vh)");
            $('.scoresvg').eq(i - 1).css("transform", "translateY(0vh)");


            //i+1해서 다음 음계로 넘어가게
            i = i + 1;

            //long 클래스를 갖고 있으면 0.3초 뒤에 다음 음 재생
            if ($('.piano').eq(i).hasClass('beat1')) {
                setTimeout(function () {
                    _play();
                }, 600)
            } else if ($('.piano').eq(i).hasClass('beat2')) {
                setTimeout(function () {
                    _play();
                }, 350)
            } else if ($('.piano').eq(i).hasClass('beat3')) {
                setTimeout(function () {
                    _play();
                }, 225)
            } else if ($('.piano').eq(i).hasClass('beat4')) {
                setTimeout(function () {
                    _play();
                }, 425)
            } else if ($('.piano').eq(i).hasClass('beat5')) {
                setTimeout(function () {
                    _play();
                }, 200)
            }
        }

        _play();
    })
})