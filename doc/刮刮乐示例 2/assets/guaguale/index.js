
KISSY.add(function(S,Event,Node,Ajax){

    var $ = Node.all,
        Gesture = Event.Gesture;

    /**
     * �ι���
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

        //û��merge����
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

                //�ο��������Ƿ�ﵽָ������
                isOver = function() {
                    var data = ctx.getImageData(0, 0, w, h).data;

                    //ʣ�����أ�δ���ο���������#CCC ,255
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

                //���ñʴ�.
                ctx.globalAlpha = 1;
                ctx.globalCompositeOperation = 'destination-out';
                ctx.lineJoin = "round";
                ctx.lineCap = "round";
                //ctx.fillStyle = '';    //�����ֻ��޷�ˢ������ԭ��֮һ,�����ÿ�.
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

            //��ʼ���Ĳ���
            canvas.getDOMNode().width = w; //ǿˢ.
            canvas.getDOMNode().height = h; //ǿˢ.
            ctx.globalCompositeOperation = "source-over"; //��������ֻ�����.
            ctx.fillStyle = colorHex;
            ctx.fillRect(0, 0, w, h);
        },
        start: function(){
            var self = this,
                canvas = self.canvas,
                overlay = self.overlay,
                el = overlay.el;

            var errmsg = function(){
                el.getDOMNode().innerHTML =  '<div class="bd">�ιο���û��׼����</div><div class="ft"><button class="ok J_Start">������</button></div>';
                overlay.show();
            };

            el.getDOMNode().innerHTML = '<div class="bd"><p>�ιο�׼����..<p></div>';
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

                    //�н�
                    if(response.status && response.data && response.data.level>0){
                        self.win = true;
                        canvas.removeClass("fail").addClass("win");
                        result = '<div class="bd"><p>��ϲ�㣬�н����� </p><p>'+response.data.message+'</p><p class="win"></p></div><div class="ft"><button class="cancel J_Cancel">������</button><button class="ok J_Start">����һ��</button></div>';
                    }

                    //û�н�
                    else{
                        self.win = false;
                        canvas.removeClass("win").addClass("fail");
                        result = '<div class="bd"><p>���ź���û�йε���� :(</p><p>'+self.failTxt()+'</p><p class="fail"></p></div><div class="ft"><button class="cancel J_Cancel">������</button><button class="ok J_Start">����һ��</button></div>';
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

            el.getDOMNode().innerHTML =  '<div class="bd">��һ��ͼ�㣬���Թγ����</div><div class="ft"><button class="ok J_Start">��ʼ�ν�</button></div>';
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
                    '�泯�󺣣���ů������',
                    '�泯�������ν����У�'
                ],
                [
                    'û�н���',
                    '������ָ�ιο���'
                ],
                [
                    'OMGû�н�����������',
                    '���ԣ���������ӡ���'
                ],
                [
                    '�����أ�����Ҫ�ľ���',
                    '���ģ������ٹ�һ�ΰɣ�'
                ],
                [
                    'ʲô��û�н���',
                    '��һ���Ǵ�Ů���İɣ�'
                ],
                [
                    '�ݳ����ý�ֺ�Σ�',
                    '�н��ĸ��ʸ�����ָ�����ԣ�'
                ],
                [
                    '�ݳ�������ͷ�Σ�',
                    '�н��ĸ��ʸ�����ָ�����ԣ�'
                ],
                [
                    '�ݳ���������Ͱ�ϣ�',
                    '������н����ʣ����ԣ�'
                ],
                [
                    '�ݳ����ñ��ӹΣ�',
                    '�н��ĸ��ʸ�����ָ�����ԣ�'
                ],
                [
                    '�ݳ�������12�㣬',
                    '�н�������ߣ����ԣ�'
                ],
                [
                    '�ݳ�����ƨ�ɹΣ�',
                    '�н��ĸ��ʸ�����ָ�����ԣ�'
                ],
                [
                    '�ݳ�����ϥ�ǹΣ�',
                    '�н��ĸ��ʸ�����ָ�����ԣ�'
                ],
                [
                    '��Ǹ��û�н���',
                    'Ҫ�������������ԣ�'
                ],
                [
                    '��Ǹ��û�н���',
                    '�����è�εðɣ�'
                ],
                [
                    '�ν�֮ǰ��',
                    '�����������㣡'
                ],
                [
                    '��ѽ��û�н���',
                    '��þ�û�������̹���·�˰ɣ�'
                ],
                [
                    '�ݳ����ν�ʱ�����·���',
                    '�н�����ߣ����ԣ�'
                ],
                [
                    '�ν�ǰ��',
                    '�����ȷ���������'
                ],
                [
                    '�ݳ���ԭ��ת3Ȧ��',
                    '�������н����ʣ����ԣ�'
                ],
                [
                    'һ������',
                    '�εĽ��಻�ԣ�'
                ],
                [
                    '�ݳ�����ƽ���ٹν���',
                    '�н����ʷ��������ԣ�'
                ],
                [
                    'һ������ν������Ʋ��ԣ�',
                    '�������ԣ�'
                ],
                [
                    'û�н���',
                    '�Ͽ�Ը�ƻ������н����ʰɣ�'
                ],
                [
                    'һ������ν�����̬�����ϣ�'
                ],
                [
                    '�´ιν�ǰ�����������'
                ],
                [
                    '����������Ҫ�ľ��ǿ��ģ�',
                    '�������������ԡ�'
                ],
                [
                    '���йز���ͳ�ƣ�',
                    '��ϥ�¹������н��ʣ����ԣ�'
                ],
                [
                    '���¿�ѧ�о������㳦��',
                    'Ҳ�ܹν������������ԣ�'
                ],
                [
                    '�޵����ɸգ�Թ�ֲ�˫����',
                    'һ��ε����سɸ߸�˧��'
                ],
                [
                    '���������⣬',
                    'ʮ�а˾�����Ϊû���У�����'
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

            //��Ծ���
            el.getDOMNode().style.top =  (offset.top + (target.height()-el.height())/2)+"px" ;
            el.getDOMNode().style.left =  (offset.left + (target.width()-el.width())/2)+"px";
        }
    }



    return GGL;



},{
    requires:["event","node","io","./ggl.css"]
})