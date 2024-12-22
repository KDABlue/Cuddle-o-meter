// utils/scripts/coloron.js


class Game {
    constructor() {
        this.score = 0;
        this.isRunning = false;
        this.calculateScale();
        this.timeline = gsap.timeline({ paused: true });
        this.time = 1.6;
        this.colors = ["#FF4571", "#FFD145", "#8260F6"];
        this.color = this.colors[0];
        this.prevColor = null;
    }

    calculateScale() {
        this.screen = $(window).width();
        this.screenHeight = $(window).height();
        this.scale = (this.screen > this.screenHeight) ? this.screenHeight / 800 : this.screen / 1200;
        this.stickWidth = 180 * this.scale;
        this.steps = this.screen / this.stickWidth;
    }

    generateSticks() {
        let numberOfSticks = Math.ceil(this.steps);
        for (let i = 0; i <= numberOfSticks; i++)
            new Stick();
    }

    generateBall() {
        $('.scene .ball-holder').append('<div class="ball red" id="ball"></div>');
        this.bounce();
    }

    generateTweet() {
        let top = $(window).height() / 2 - 150;
        let left = $(window).width() / 2 - 300;
        window.open("https://twitter.com/intent/tweet?url=https://codepen.io/gregh/full/yVLOyO&amp;text=I scored " + this.score + " points on Coloron! Can you beat my score?&amp;via=greghvns&amp;hashtags=coloron", "TweetWindow", "width=600px,height=300px,top=" + top + ",left=" + left);
    }

    intro() {
        gsap.killTweensOf("*");
        $('.stop-game').hide();
        $('.start-game').css('display', 'flex');

        gsap.fromTo('.start-game .logo-holder', { opacity: 0 }, { opacity: 1, duration: 0.9 });
        gsap.fromTo('.start-game .logo span', { opacity: 0 }, { opacity: 1, duration: 0.5, stagger: 0.08 });
        gsap.fromTo('.start-game .bar', { y: '100%' }, { y: '0%', ease: "elastic.out(1, 0.3)", duration: 1.6, stagger: 0.08 });
        gsap.fromTo('.start-game .ball-demo', { scale: 0 }, { scale: 1, ease: "elastic.out(1, 0.3)", duration: 1, delay: 0.8 });
    }

    showResult() {
        $('.stop-game').css('display', 'flex');
        $('.stop-game .final-score').text(this.score + '!');
        $('.stop-game .result').text(this.showGrade(this.score));

        gsap.fromTo('.stop-game .score-container', { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1, ease: "elastic.out(1.25, 0.5)", duration: 0.7 });
        gsap.fromTo('.stop-game .final-score', { scale: 0.5 }, { scale: 1, ease: "elastic.out(2, 0.5)", duration: 2 });
        gsap.fromTo('.stop-game .result', { scale: 0.5 }, { scale: 1, ease: "elastic.out(1.5, 0.5)", duration: 1, delay: 0.3 });
    }

    showGrade(score) {
        if (score > 30) return "Chuck Norris?";
        else if (score > 25) return "You're da man";
        else if (score > 20) return "Awesome";
        else if (score > 15) return "Great!";
        else if (score > 13) return "Nice!";
        else if (score > 10) return "Good Job!";
        else if (score > 5) return "Really?";
        else return "Poor...";
    }

    start() {
        this.stop();

        $('.start-game, .stop-game').hide();
        this.score = 0;
        this.isRunning = true;

        $('#sticks, .scene .ball-holder').empty();
        $('#score').text(this.score);
        this.generateSticks();
        this.generateBall();

        if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent)) {
            AnimationHandler.sceneAnimation();
        }
        this.moveToStart();
        this.moveScene();

        this.timeline.timeScale(1);
    }

    stop() {
        this.isRunning = false;
        $('.start-game, .stop-game').hide();
        $('#sticks, .scene .ball-holder, #score').empty();
        gsap.killTweensOf("*");
        this.showResult();
    }

    scaleScreen() {
        gsap.killTweensOf("*");

        let height = $(window).height();
        let width = $(window).width();

        this.calculateScale();

        $('.container')
            .css({
                transform: `scale(${this.scale})`,
                height: `${height / this.scale}px`,
                width: `${width / this.scale}px`,
                transformOrigin: 'left top'
            });

        $('#sticks').width(this.screen / this.scale + 3 * this.stickWidth / this.scale);
    }

    scaleScreenAndRun() {
        this.scaleScreen();

        if (this.isRunning) {
            this.stop();
        } else {
            this.intro();
        }
    }

    moveToStart() {
        gsap.timeline({ delay: 2 })
            .fromTo('.learn-to-play', { scale: 0 }, { scale: 1, opacity: 1, ease: "elastic.out(1.25, 0.5)", duration: 1 })
            .to('.learn-to-play', { scale: 0, opacity: 0, ease: "elastic.out(1.25, 0.5)", duration: 1 }, 3);

        gsap.fromTo('#ball', { scale: 0 }, { scale: 1, delay: this.time * ((this.steps - 3) - 1.5), duration: this.time, onComplete: () => {
            this.bounce();
        } });
    }

    moveScene() {
        this.timeline.to('#sticks', { x: '-=180px', ease: "none", repeat: -1, duration: this.time, onRepeat: () => { this.rearrange() } });
        this.timeline.play();
    }

    rearrange() {
        let scale = this.speedUp();
        this.timeline.timeScale(scale);
    }

    speedUp() {
        if (this.score > 30) {
            return 1.8;
        }
        if (this.score > 20) {
            return 1.7;
        }
        if (this.score > 15) {
            return 1.5;
        }
        else if (this.score > 12) {
            return 1.4;
        }
        else if (this.score > 10) {
            return 1.3;
        }
        else if (this.score > 8) {
            return 1.2;
        }
        else if (this.score > 5) {
            return 1.1;
        }
        return 1;
    }

    bounce() {
        gsap.to('#ball', { y: '+=250px', scaleY: 0.7, transformOrigin: "bottom", ease: "power2.in", duration: this.time / 2, onComplete: () => {
            this.checkColor();
        } });
        gsap.to('#ball', { y: '-=250px', scaleY: 1.1, transformOrigin: "bottom", ease: "power2.out", duration: this.time / 2, onStart: () => {
            while (this.prevColor == this.color) {
                this.color = (new ColorHandler()).getRandomColor();
            }
            this.prevColor = this.color;
            gsap.to('#ball', { backgroundColor: this.color, duration: 0.5 });
            $('#ball').removeClass('red yellow purple').addClass((new ColorHandler()).colorcodeToName(this.color));
        } });
    }

    checkColor() {
        let ballPos = $('#ball').offset().left + $('#ball').width() / 2;
        let stickWidth = $('.stick').width();
        let score = this.score;

        $('#sticks .stick').each(function () {
            if ($(this).offset().left < ballPos && $(this).offset().left > (ballPos - stickWidth)) {
                if (ColorHandler.getColorFromClass($(this)) === ColorHandler.getColorFromClass('#ball')) {
                    score++;
                    $('#score').text(score);
                    gsap.fromTo('#score', { scale: 1.5 }, { scale: 1, ease: "elastic.out(1.5, 0.5)", duration: 0.5 });
                } else {
                    game.stop();
                }
            }
        });

        this.score = score;
    }
}

class Stick {
    constructor() {
        this.stick = this.addStick();
    }

    addStick() {
        this.stick = $('#coloron .sticks').append('<div class="stick inactive"></div>');
        return this.stick;
    }
}

class ColorHandler {
    constructor() {
        this.colors = ["#FF4571", "#FFD145", "#8260F6"];
        this.effects = ["bubble", "triangle", "block"];
        this.prevEffect = null;
    }

    getRandomColor() {
        let colorIndex = Math.floor(Math.random() * 3);
        let color = this.colors[colorIndex];
        return color;
    }

    colorcodeToName(color) {
        let colors = ["#FF4571", "#FFD145", "#8260F6"];
        let names = ["red", "yellow", "purple"];
        let index = colors.indexOf(color);
        if(index == -1) return false;
        return names[index];
    }      

    changeColor(el) {
        let index = el.data("index");
        if(index === undefined) { index = 0; }
        else { index += 1; }
        if(index == 3) index = 0;
        el
            .css('background-color', this.colors[index])
            .data('index', index);

        el.removeClass('red yellow purple').addClass(this.colorcodeToName(this.colors[index]));

        if(el.hasClass('inactive')) {
            this.setEffect(el);
            el.addClass('no-effect');
        }
        
        el.removeClass('inactive');
    }

    getRandomEffect() {
        let effectIndex = Math.floor(Math.random() * 3);
        while(effectIndex == this.prevEffect) {
            effectIndex = Math.floor(Math.random() * 3);
        }

        this.prevEffect = effectIndex;
        return this.effects[effectIndex];
    }   

    setEffect(el) {
        let effect = this.getRandomEffect();
        el.addClass(effect + '-stick');
        for(let i = 1; i <= 14; i++) {
            if(effect == 'block') {
                el.append(`<div class="${effect} ${effect}-${i}"><div class="inner"></div><div class="inner inner-2"></div></div>`);
            } else {
                el.append(`<div class="${effect} ${effect}-${i}"></div>`);
            }
        }
    }

    static getColorFromClass(el) {
        let classes = $(el).attr('class').split(/\s+/);
        for (let i = 0; i < classes.length; i++) {          
            if(classes[i] == 'red' || classes[i] == 'yellow' || classes[i] == 'purple') {
                return classes[i];
            }
        }
    }
}

class AnimationHandler {
    static generateSmallGlows(number) {
        let h = $(window).height();
        let w = $(window).width();
        let scale = (w > h) ? h / 800 : w / 1200;

        h = h / scale;
        w = w / scale;

        for(let i = 0; i < number; i++) {
            let left = Math.floor(Math.random()*w);
            let top = Math.floor(Math.random()*(h/2));
            let size = Math.floor(Math.random()*8) + 4;
            $('#coloron .small-glows').prepend('<div class="small-glow"></div>');
            let noise = $('#coloron .small-glows .small-glow').first();
            noise.css({left: left, top: top, height: size, width: size});
        }
    }

    playBubble(el) {
        let bubble = gsap.timeline();
        bubble.fromTo(el.find('.bubble'), {scale: 0.1}, {scale: 1, stagger: 0.03, duration: 0.3})
              .to(el.find('.bubble'), {y: '-=60px', yoyo: true, repeat: -1, stagger: 0.03, duration: 0.5});
    }

    playTriangle(el) {
        let triangle = gsap.timeline();
        triangle.fromTo(el.find('.triangle'), {scale: 0.1}, {scale: 1, stagger: 0.03, duration: 0.3})
                .to(el.find('.triangle'), {
                    rotationY: '+=360',
                    rotationX: '-=360',
                    repeat: -1,
                    stagger: 0.1,
                    duration: 1.5,
                    ease: "none"
                });
    }

    playBlock(el) {
        let block = gsap.timeline();
        let block2 = gsap.timeline({delay: 0.69});

        block.fromTo(el.find('.block'), {scale: 0.1}, {scale: 1, stagger: 0.03, duration: 0.3})
             .to(el.find('.block .inner:not(.inner-2)'), {
                x: '+=200%',
                repeat: -1,
                stagger: 0.1,
                duration: 1,
                ease: "none",
                repeatDelay: 0.6
             });

        block2.to(el.find('.block .inner-2'), {
                x: '+=200%',
                repeat: -1,
                stagger: 0.1,
                duration: 1,
                ease: "none",
                repeatDelay: 0.6
             });
    }

    static sceneAnimation() {
        const speed = 15;

        $('#coloron .small-glow').each(function(){
            let speedDelta = Math.floor(Math.random()*8);
            let radius = Math.floor(Math.random()*20)+20;
            gsap.to($(this), {rotation: 360, transformOrigin: `-${radius}px -${radius}px`, repeat: -1, ease: "none", duration: speed + speedDelta});
        });

        gsap.to('#coloron .waves .top_wave', {backgroundPositionX: '-=54px', repeat: -1, ease: "none", duration: speed*1.7/42});
        gsap.to('#coloron .waves .wave1', {backgroundPositionX: '-=54px', repeat: -1, ease: "none", duration: speed*1.9/42});
        gsap.to('#coloron .waves .wave2', {backgroundPositionX: '-=54px', repeat: -1, ease: "none", duration: speed*2/42});
        gsap.to('#coloron .waves .wave3', {backgroundPositionX: '-=54px', repeat: -1, ease: "none", duration: speed*2.2/42});
        gsap.to('#coloron .waves .wave4', {backgroundPositionX: '-=54px', repeat: -1, ease: "none", duration: speed*2.4/42});

        gsap.to('#coloron .mounts .mount1', {backgroundPositionX: '-=1760px', repeat: -1, ease: "none", duration: speed*8});
        gsap.to('#coloron .mounts .mount2', {backgroundPositionX: '-=1782px', repeat: -1, ease: "none", duration: speed*10});

        gsap.to('#coloron .clouds', {backgroundPositionX: '-=1001px', repeat: -1, ease: "none", duration: speed*3});
    }
}

class Coloron {
    constructor() {
        this.game = new Game();
        this.animation = new AnimationHandler();
        this.color = new ColorHandler();
        this.userAgent = window.navigator.userAgent;
    }

    init() {
        AnimationHandler.generateSmallGlows(20);

        $(document).ready(() => {
            this.game.scaleScreen();
            this.game.intro();

            if ($(window).height() < 480) {
                $('.play-full-page').css('display', 'block');
            }
        });

        $(document).on('click', '#coloron .stick', (e) => {
            this.color.changeColor($(e.currentTarget));
            if($(e.currentTarget).hasClass('no-effect')) {
                if($(e.currentTarget).hasClass('bubble-stick')) {
                    this.animation.playBubble($(e.currentTarget));
                } else if($(e.currentTarget).hasClass('triangle-stick')) {
                    this.animation.playTriangle($(e.currentTarget));
                } else if($(e.currentTarget).hasClass('block-stick')) {
                    this.animation.playBlock($(e.currentTarget));
                }
                $(e.currentTarget).removeClass('no-effect');
            }
        });

        $(document).on('click', '#coloron .section-2 .bar', (e) => {
            this.color.changeColor($(e.currentTarget));
        });

        $(window).resize(() => {
            if (!this.userAgent.match(/iPad|iPhone/i)) {
                this.game.scaleScreenAndRun();
            }
        });

        $(window).on("orientationchange", () => {
            this.game.scaleScreenAndRun();
        });
    }
}

export { Coloron };
