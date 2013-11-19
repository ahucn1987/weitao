
KISSY.add(function(S,Event,Node,Ajax){

    var $ = Node.all,
        Gesture = Event.Gesture;

    /**
     * 刮刮乐
     * @constructor
     */
    function GGL(config){
        var self = this;
        var panel = $(config.panel);
        var canvas = panel.one("canvas");

        var overlay = new Overlay({
            target: panel
        });

        var field = {
            url:        config.url,
            panel:      panel,
            canvas:     canvas,
            ctx:        canvas.getDOMNode().getContext('2d'),
            color:      {r:204,g:204,b:204,a:255},
            colorHex:   "#cccccc",
            size:       30,
            overlay:    overlay
        };

        //没有merge方法
        for(var k in field){
            self[k]=field[k];
        }

        overlay.el.delegate(Gesture.tap,".J_Start",function(){
            overlay.hide();
            self.start();
        });

        overlay.el.delegate(Gesture.tap,".J_Cancel",function(){
            overlay.hide();
        });

        self.bindEvt();
        self.welcome();
    }

    GGL.prototype = {
        bindEvt: function(){
            var self = this,
                panel = self.panel,
                canvas = self.canvas,
                ctx = self.ctx,
                color = self.color,

                w = panel.width(),
                h = panel.height(),

                clientOffset = canvas.offset(),
                clientOffsetX = clientOffset.left,
                clientOffsetY = clientOffset.top,

                oldX,oldY,curX,curY,

                //刮开的像素是否达到指定比例
                isOver = function() {
                    var data = ctx.getImageData(0, 0, w, h).data;

                    //剩余像素（未被刮开）点数。#CCC ,255
                    for (var i = 0, j = 0, k = 0; i < data.length; i += 4,k++) {
                        if ((data[i] == color.r) && (data[i + 1] == color.g) && (data[i + 2] == color.b) && (data[i + 3] == color.a)) {
                            j++;
                        }
                    }

                    if ((j / (w * h)) < 0.5) {
                        self.getPuzzle();
                    }
                },

                touchMove = function (ev){
                    ev.preventDefault();

                    var pageX = ev.changedTouches ? ev.changedTouches[0].pageX : ev.pageX,
                        pageY = ev.changedTouches ? ev.changedTouches[0].pageY : ev.pageY,
                        tg = canvas.getDOMNode();


                    curX = pageX - clientOffsetX;
                    curY = pageY - clientOffsetY;

                    ctx.lineTo(curX, curY);
                    ctx.stroke();

                    oldX = curX;
                    oldY = curY;

                    // force update for some android browsers
                    tg.style.paddingRight = (tg.style.paddingRight =="0px"?"1px":"0px")

                },

                touchEnd = function(ev){
                    ev.preventDefault();

                    panel.detach(Gesture.move, touchMove);
                    panel.detach(Gesture.end, touchEnd);

                    ctx.closePath();

                    isOver();
                };


            panel.on(Gesture.start,function(ev){
                ev.preventDefault();

                var pageX = ev.changedTouches ? ev.changedTouches[0].pageX : ev.pageX,
                    pageY = ev.changedTouches ? ev.changedTouches[0].pageY : ev.pageY;

                //设置笔触.
                ctx.globalAlpha = 1;
                ctx.globalCompositeOperation = 'destination-out';
                ctx.lineJoin = "round";
                ctx.lineCap = "round";
                //ctx.fillStyle = '';    //红米手机无法刷出来的原因之一,必须置空.
                ctx.strokeStyle="#ccccff";
                ctx.lineWidth = 30;

                oldX =  pageX - clientOffsetX;
                oldY =  pageY - clientOffsetY;

                ctx.beginPath();
                ctx.moveTo(oldX,oldY);


                panel.on(Gesture.move, touchMove);
                panel.on(Gesture.end, touchEnd);
            })


        },
        reset: function(){
            var self = this,
                panel = self.panel,
                canvas = self.canvas,
                ctx = self.ctx,
                w = panel.width(), h = panel.height(),
                colorHex =  self.colorHex;

            //初始化的操作
            canvas.getDOMNode().width = w; //强刷.
            canvas.getDOMNode().height = h; //强刷.
            ctx.globalCompositeOperation = "source-over"; //解决部分手机白屏.
            ctx.fillStyle = colorHex;
            ctx.fillRect(0, 0, w, h);
        },
        start: function(){
            var self = this,
                canvas = self.canvas,
                overlay = self.overlay,
                el = overlay.el;

            var errmsg = function(){
                el.getDOMNode().innerHTML =  '<div class="bd">刮刮卡还没有准备好</div><div class="ft"><button class="ok J_Start">请重试</button></div>';
                overlay.show();
            };

            el.getDOMNode().innerHTML = '<div class="bd"><p>刮刮卡准备中..<p></div>';
            overlay.show();


            Ajax({
                type: "get",
                url: self.url,
                data: {},
                dataType:"json",
                success: function(response){
                    overlay.hide();
                    self.reset();

                    var result = "";

                    //中奖
                    if(response.status && response.data && response.data.level>0){
                        self.win = true;
                        canvas.removeClass("fail").addClass("win");
                        result = '<div class="bd"><p>恭喜你，中奖啦！ </p><p>'+response.data.message+'</p><p class="win"></p></div><div class="ft"><button class="cancel J_Cancel">不玩了</button><button class="ok J_Start">刮下一张</button></div>';
                    }

                    //没中奖
                    else{
                        self.win = false;
                        canvas.removeClass("win").addClass("fail");
                        result = '<div class="bd"><p>很遗憾，没有刮到红包 :(</p><p>'+self.failTxt()+'</p><p class="fail"></p></div><div class="ft"><button class="cancel J_Cancel">不玩了</button><button class="ok J_Start">刮下一张</button></div>';
                    }

                    el.getDOMNode().innerHTML = result;

                },
                error: function(){
                    errmsg();
                }
            });

        },
        welcome: function(){
            var self = this,
                overlay = self.overlay,
                el = overlay.el;

            el.getDOMNode().innerHTML =  '<div class="bd">刮一刮图层，可以刮出红包</div><div class="ft"><button class="ok J_Start">开始刮奖</button></div>';
            overlay.show();

        },
        getPuzzle:function(){
            var self = this,
                overlay = self.overlay;
            overlay.show();
        },
        failTxt:function(){
            var txt = [
                [
                    '面朝大海，春暖花开！',
                    '面朝厕所，刮奖必中！'
                ],
                [
                    '没中奖，',
                    '换个手指刮刮看！'
                ],
                [
                    'OMG没中奖，换个表情',
                    '试试，跟我念“茄子”！'
                ],
                [
                    '做人呢，最重要的就是',
                    '开心，不如再刮一次吧！'
                ],
                [
                    '什么，没中奖？',
                    '你一定是处女座的吧！'
                ],
                [
                    '据扯，用脚趾刮，',
                    '中奖的概率高于手指！试试？'
                ],
                [
                    '据扯，用舌头刮，',
                    '中奖的概率高于手指！试试？'
                ],
                [
                    '据扯，坐在马桶上，',
                    '会提高中奖概率！试试？'
                ],
                [
                    '据扯，用鼻子刮，',
                    '中奖的概率高于手指！试试？'
                ],
                [
                    '据扯，中午12点，',
                    '中奖概率最高！试试？'
                ],
                [
                    '据扯，用屁股刮，',
                    '中奖的概率高于手指！试试？'
                ],
                [
                    '据扯，用膝盖刮，',
                    '中奖的概率高于手指！试试？'
                ],
                [
                    '抱歉您没中奖，',
                    '要不换你外婆试试？'
                ],
                [
                    '抱歉您没中奖，',
                    '是你家猫刮得吧？'
                ],
                [
                    '刮奖之前，',
                    '请烧三柱高香！'
                ],
                [
                    '诶呀，没中奖，',
                    '你好久没扶老奶奶过马路了吧！'
                ],
                [
                    '据扯，刮奖时穿红衣服，',
                    '中奖率最高！试试？'
                ],
                [
                    '刮奖前，',
                    '不如先翻翻黄历？'
                ],
                [
                    '据扯，原地转3圈，',
                    '会提升中奖概率！试试？'
                ],
                [
                    '一定是你',
                    '刮的节奏不对！'
                ],
                [
                    '据扯，躺平后再刮奖，',
                    '中奖概率翻倍！试试？'
                ],
                [
                    '一定是你刮奖的姿势不对，',
                    '倒立试试？'
                ],
                [
                    '没中奖？',
                    '赶快吃个苹果提高中奖概率吧！'
                ],
                [
                    '一定是你刮奖的心态不够虔诚！'
                ],
                [
                    '下次刮奖前，请先念咒语！'
                ],
                [
                    '做人呢最重要的就是开心，',
                    '不如我下面给你吃。'
                ],
                [
                    '据有关部门统计，',
                    '单膝下跪可提高中奖率！试试？'
                ],
                [
                    '最新科学研究，用香肠，',
                    '也能刮奖，不信你试试！'
                ],
                [
                    '恨爹不成刚，怨爸不双江，',
                    '一天刮到晚，必成高富帅！'
                ],
                [
                    '人生不如意，',
                    '十有八九是因为没！中！奖！'
                ]
            ];
            var getRandom = function(m,n){
                return Math.ceil(Math.random()*(n-m)+m);
            }
            return txt[getRandom(0,txt.length-1)].join("");
        }
    }



    function Overlay(config){
        var self = this,
            body = document.body;

        var el = document.createElement("div"),
            mask = document.createElement("div");

        el.className = "gg-dialog";
        mask.className = "gg-dialog-mask";

        body.appendChild(mask);
        body.appendChild(el);

        self.el = $(el);
        self.mask = $(mask);
        self.target = $(config.target);
    }

    Overlay.prototype = {
        show: function(){
            var self = this;
            self.mask.show();
            self.el.show();
            self.align()
        },
        hide: function(){
            var self = this;
            self.mask.hide();
            self.el.hide();
        },
        align: function(){
            var self = this,
                el = self.el,
                target = self.target,
                offset = target.offset();

            //相对居中
            el.getDOMNode().style.top =  (offset.top + (target.height()-el.height())/2)+"px" ;
            el.getDOMNode().style.left =  (offset.left + (target.width()-el.width())/2)+"px";
        }
    }



    return GGL;



},{
    requires:["event","node","io","./ggl.css"]
})