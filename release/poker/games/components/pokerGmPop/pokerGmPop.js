﻿
var CMD_C_Gm = 
[
    ['BYTE', 'cbGmCardDatas', 208],
]

var pokerGmPop = 
{   

    //如果牌库不一致需要在topui中自己定义pokerGmPop.poker 如果底牌不一致也要自己改

    //扑克的麻将缩放倍数 一行时两行时的 情况改
    scaleOne:0.6,
    scaleTwo:0.4,
    //设置每行的麻将数
    count:18,
    //  牌库  底牌数    
    resp:'components/pokerGmPop/res/',
    //自定义牌库
    pokerself:[],
    //牌库
    poker:[
        0x03,0x04,0x05,0x06,0x07,0x08,0x09,0x0A,0x0B,0x0C,0x0D, //方块 A - K
        0x11,   0x13,0x14,0x15,0x16,0x17,0x18,0x19,0x1A,0x1B,0x1C,0x1D, //梅花 A - K
        0x21,   0x23,0x24,0x25,0x26,0x27,0x28,0x29,0x2A,0x2B,0x2C,0x2D, //红桃 A - K
        0x31,0x32,0x33,0x34,0x35,0x36,0x37,0x38,0x39,0x3A,0x3B,0x3C,0x3D, //黑桃 A - K
    ],
    //一整副牌
    pokermodel:[0x01,0x11,0x21,0x31,0x02,0x12,0x22,0x32,0x03,0x13,0x23,0x33,
                0x04,0x14,0x24,0x34,0x05,0x15,0x25,0x35,0x06,0x16,0x26,0x36,
                0x07,0x17,0x27,0x37,0x08,0x18,0x28,0x38,0x09,0x19,0x29,0x39,
                0x0A,0x1A,0x2A,0x3A, //方块 A - K
                0x0B,0x1B,0x2B,0x3B, //梅花 A - K
                0x0C,0x1C,0x2C,0x3C, //红桃 A - K
                0x0D,0x1D,0x2D,0x3D, //黑桃 A - K
                0x4E,0x4F
                ],
    //底牌
    Dipai:0,
    currentIdx:null,
    playnodes:[],
    getPreLoadRes:function()
    {
        var resp = pokerGmPop.resp

        return [
            resp + 'cardGmPop.plist', 
            resp + 'cardGmPop.png'
        ]
    },
    onPreLoadRes:function()
    {
        var resp = pokerGmPop.resp
        cc.spriteFrameCache.addSpriteFrames(resp + 'cardGmPop.plist', resp + 'cardGmPop.png')
    },
    getColor:function(cardData) 
    {
        return Math.floor(cardData/16) 
    },
    getNum:function(cardData) 
    {
        return cardData%16
    },
    getSprite:function(cardData)
    {
        return pokerGmPop.getColor(cardData) + "_" + pokerGmPop.getNum(cardData) + ".png"
    },
    contanis:function(arr,data)
    {
        for(var i=0;i<arr.length;i++)
        {
            if (arr[i]==data) 
                return true           
        }
        return false
    },
    getPop:function()
    {       
        var control = {}
        control.submitChangeCall = function()
        {
            var idxs = []
            for(var i =0;i<pokerGmPop.pokerself.length;i++)
            {

                idxs[idxs.length] = pokerGmPop.pokerself[i]
            }
            var gm = getObjWithStructName('CMD_C_Gm')
            gm.cbGmCardDatas = idxs
            socket.sendMessage(MDM_GF_GAME,666,gm)
            node.removeFromParent()
        }

        control.gameEndCall = function()
        {
            socket.sendMessage(MDM_GF_GAME,777)
            node.removeFromParent()
        }

        var node  = managerRes.loadCCB('components/pokerGmPop/res/pokerGmPop.ccbi', control)
        pokerGmPop.refreshUserIdx(control)

        return node
    },
    //生成精灵
     getSpr:function(i,j,dis,count,hcount,poker)
    {
        var cardData = poker[ i]
        var spr = new cc.Sprite("#" + pokerGmPop.getSprite(cardData))
           
        spr.setScale(count>hcount?pokerGmPop.scaleTwo:pokerGmPop.scaleOne)
        var width = spr.width*spr.getScale()
        var height = spr.height*spr.getScale()

        spr.attr({
            x:dis*0.8*(j%hcount),
            y:j>=hcount?(-10-height):-10,
            anchorX:0,
            anchorY:1,
        });
        spr.cardData = cardData
        spr.idx =  i

        var l = pokerGmPop.getListener1()
        cc.eventManager.addListener(l, spr)

        return spr
    },
    //添加监听
    getListener1:function()
    {
        var listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) 
            {

                var target = event.getCurrentTarget()
                var locationInNode = target.convertToNodeSpace(touch.getLocation())
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height)
                if(pokerGmPop.currentIdx==null||(pokerGmPop.currentIdx!=null&&target.getParent().tag!=1000)||target.getParent().tag==1000)
                {
                    if (cc.rectContainsPoint(rect, locationInNode)) {
                       
                      
                         if(target.getParent().tag==1000)
                                {
                                    if(pokerGmPop.currentIdx!=null)
                                        pokerGmPop.currentIdx.color = cc.color(255,255,255)
                                    pokerGmPop.currentIdx = target
                                }
                                target.color =  cc.color(100,100,100) 
                        return true
                    }
                }
                return false

            },
            onTouchEnded: function (touch, event)
            {

                var target = event.getCurrentTarget()
                if(!pokerGmPop.currentIdx)
                {
                    pokerGmPop.currentIdx = target
                }
                else if(target.getParent().tag!=1000)
                {
                    var Count = pokerGmPop.Dipai==0?MAX_COUNT:((pokerGmPop.pokerself.length-pokerGmPop.Dipai)/SERVER_CHAIR);
                   
                            var exchange = pokerGmPop.currentIdx
                           
                                target.setSpriteFrame(pokerGmPop.getSprite(exchange.cardData))
                                //数组中位置交换
                                var temp = target.cardData
                                pokerGmPop.pokerself[target.idx] = exchange.cardData
                             

                                target.cardData = exchange.cardData
                                target.setTag(exchange.cardData)

                               
                                pokerGmPop.currentIdx.setTag(temp)
                                chooseone =false
                                                 

                            target.color =  cc.color(255,255,255) 
                            exchange.color = cc.color(255,255,255)                     
                    

                  

                }
            }
        })

        return listener
    },
    //生成手牌和底牌
    refreshUserIdx:function(control)
    {


        if(pokerGmPop.pokerself.length == 0)
        {
            pokerGmPop.pokerself=clone(pokerGmPop.poker)      
        } 
        var width =control['gmNode'].getContentSize().width
        var height = control['gmNode'].getContentSize().height

        //手牌数   
        var Count = pokerGmPop.Dipai==0?MAX_COUNT:((pokerGmPop.pokerself.length-pokerGmPop.Dipai)/SERVER_CHAIR);
        // var Count = 16
        var hcount =pokerGmPop.count

        // for(i=0;i<pokerGmPop.poker.length;i++)
        // {
        //     var cardData = pokerGmPop.poker[i]
        //     pokerGmPop.getNum(cardData)
        //     var poker=cardFactory.sortCardDatasWithScore(pokerGmPop.poker)
        // }
        //每个玩家的手牌
        var x= pokerGmPop.Dipai==0?SERVER_CHAIR:(SERVER_CHAIR+1)
        for(var i=0;i<x;i++)
        {         
            var node = new cc.Node()
            node.attr({
                x:40,
                y:height-140-(height-140)/x*i,
            })
            if(i<SERVER_CHAIR)
                var laxt =new cc.LabelTTF("玩家"+i+":","Helvetica",24)
            else
                var laxt = new cc.LabelTTF("底牌:","Helvetica",24)
            node.addChild(laxt)
            for (var j = 0; j <  Count; j++) 
            {
                var spr = pokerGmPop.getSpr(Count*i+j,j,width/(Count<=hcount?Count:hcount),Count,hcount,pokerGmPop.pokerself)                
                node.addChild(spr,1,pokerGmPop.pokerself[Count*i+j])
            }
            this.playnodes[i]=node
            control['gmNode'].addChild(node,1,i)
        }

        //字典
        var node = new cc.Node()
            node.attr({
                x:40,
                y:height-20,
                anchorY:0,
                anchorX:0,
                // -(height/(SERVER_CHAIR+1)),
            })
            var text = new cc.LabelTTF("字典牌:","Helvetica",24)
            node.addChild(text)
        for(var i=0;i<pokerGmPop.pokermodel.length;i++)
        {
            var cardData = pokerGmPop.pokermodel[ i]
            var spr = new cc.Sprite("#" + pokerGmPop.getSprite(cardData))         
            spr.setScale(0.4)
            if(i<52)
            {
                spr.attr({
                x:spr.width*spr.getScale()*0.6*(i%26)+75,
                y:-20-spr.height*spr.getScale()*Math.floor(i/26) ,            
                });
            }
            else
            {
                spr.attr({
                x:spr.width*spr.getScale()*0.6*(i-52)+0,
                y:-45 ,
            
                });
            }
            spr.cardData = cardData
            spr.idx =  i

            var l = pokerGmPop.getListener1()
            cc.eventManager.addListener(l, spr)

            if(pokerGmPop.contanis(pokerGmPop.poker,cardData)&&pokerGmPop.pokerself.length==48)
            {
                node.addChild(spr,1,pokerGmPop.pokermodel[cardData])
            }
            else
            {
                node.addChild(spr,1,pokerGmPop.pokermodel[cardData])
            }

         
        }
 
            control['gmNode'].addChild(node,1,1000)
        
        var listView = new ccui.ListView()
        listView.setDirection(ccui.ScrollView.DIR_VERTICAL)
        listView.setTouchEnabled(true)
        listView.setBounceEnabled(true)
        // listView.setScrollBarEnabled(false)
        listView.setBackGroundImage(resp_p.empty)
        listView.setBackGroundImageScale9Enabled(true)
        listView.setContentSize(width/2, height/2)
        listView.x = 0
        listView.y = 0       
        control['gmNode'].addChild(listView)

        //todo
        for( var i = 0; i < 5; i++ )
        {
            // var btn = new ccui.Button(this.resp + 'btn3.png')
            // btn.setScale9Enabled(true)
            // btn.setTitleFontSize(24)
            // btn.width = 20
            // btn.height = 40
            // btn.setTitleText("玩家"+i+":")
            // btn.index = i

            // listView.pushBackCustomItem(this.playnodes[i])

            // btn.addClickEventListener(function(btn) {
            //     self._sendExpression(btn.index + 1 + 1000)
            // }.bind(this))
        }
    }

}