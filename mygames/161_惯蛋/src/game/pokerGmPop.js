
var CMD_C_Gm = 
[
    ['BYTE', 'cbHandCardData', GAME_PLAYER, MAX_COUNT],                     //扑克列表
]

var pokerGmPop = 
{   
    playnodes:[],
    currentIdx:0x01,
    //一整副牌
    pokermodel:[0x01,0x11,0x21,0x31,0x02,0x12,0x22,0x32,0x03,0x13,0x23,0x33,
                0x04,0x14,0x24,0x34,0x05,0x15,0x25,0x35,0x06,0x16,0x26,0x36,
                0x07,0x17,0x27,0x37,0x08,0x18,0x28,0x38,0x09,0x19,0x29,0x39,
                0x0A,0x1A,0x2A,0x3A, //方块 A - K
                0x0B,0x1B,0x2B,0x3B, //梅花 A - K
                0x0C,0x1C,0x2C,0x3C, //红桃 A - K
                0x0D,0x1D,0x2D,0x3D, //黑桃 A - K
                0x4E,0x4F,0
                ],
    poker:[
        0x01,0x02,0x03,0x04,0x05,0x06,0x07,0x08,0x09,0x0A,0x0B,0x0C,0x0D,   //方块 A - K
        0x11,0x12,0x13,0x14,0x15,0x16,0x17,0x18,0x19,0x1A,0x1B,0x1C,0x1D,   //梅花 A - K
        0x21,0x22,0x23,0x24,0x25,0x26,0x27,0x28,0x29,0x2A,0x2B,0x2C,0x2D,   //红桃 A - K
        0x31,0x32,0x33,0x34,0x35,0x36,0x37,0x38,0x39,0x3A,0x3B,0x3C,0x3D,   //黑桃 A - K
        0x4E,0x4F,
        0x01,0x02,0x03,0x04,0x05,0x06,0x07,0x08,0x09,0x0A,0x0B,0x0C,0x0D,   //方块 A - K
        0x11,0x12,0x13,0x14,0x15,0x16,0x17,0x18,0x19,0x1A,0x1B,0x1C,0x1D,   //梅花 A - K
        0x21,0x22,0x23,0x24,0x25,0x26,0x27,0x28,0x29,0x2A,0x2B,0x2C,0x2D,   //红桃 A - K
        0x31,0x32,0x33,0x34,0x35,0x36,0x37,0x38,0x39,0x3A,0x3B,0x3C,0x3D,   //黑桃 A - K
        0x4E,0x4F,
        ],
    getPop:function()
    {       
        var control = {}

        control.submitChangeCall = function()
        {
            var cardsData = []
            
            for( var i = 0;i<GAME_PLAYER;i++ )
            {
                cardsData[i] = []
                var cards = pokerGmPop.playnodes[i].getChildren();
                for( var j = 0;j< cards.length;j++)
                {
                    if( cards[j].cardData )
                    {
                        cardsData[i][cardsData[i].length] = cards[j].cardData
                    }
                }
            }
            
           
            var gm = getObjWithStructName('CMD_C_Gm')
            gm.cbHandCardData = cardsData
            socket.sendMessage(MDM_GF_GAME,666,gm)
            node.removeFromParent()
        }

        control.gameEndCall = function()
        {
            socket.sendMessage(MDM_GF_GAME,777)
            node.removeFromParent()
        }

        var node  = managerRes.loadCCB('gameRes/ccb/pokerGmPop.ccbi', control)
        pokerGmPop.refreshUserIdx(control)

        return node
    },
    getSprite:function(cardData)
    {
        return gameLogic.getCardColor(cardData) + "_" + cardLogic.getNum(cardData) + ".png"
    },
    //生成精灵
     getSpr:function(i,j,dis,count,hcount,poker)
    {
        var cardData = poker[ i]
        var spr = cardFactory.getOne(cardData, 0, 0)
           
        spr.setScale(count>hcount?0.3:0.6)
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


        function getListener2(i, j)
        {
            var listener = cc.EventListener.create({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: true,
                onTouchBegan: function (touch, event) {
                    var target = event.getCurrentTarget()
                    var locationInNode = target.convertToNodeSpace(touch.getLocation())
                    var s = target.getContentSize();
                    var rect = cc.rect(0, 0, s.width, s.height)
                    if (cc.rectContainsPoint(rect, locationInNode)) {
                        return true
                    }
                    return false
                },
                onTouchEnded: function (touch, event) {

                    var target = event.getCurrentTarget()
                    var aCard = cardFactory.getOne(pokerGmPop.currentIdx, 0, 0)
                    aCard.x = target.x
                    aCard.y = target.y
                    aCard.anchorX = target.anchorX
                    aCard.anchorY = target.anchorY
                    aCard.idx = target.idx
                    aCard.setScale(target.getScale())
                    target.getParent().addChild(aCard)
                    target.removeFromParent()
                    
                    var l = getListener2(aCard.idx)
                    cc.eventManager.addListener(l, aCard)
                }
            })
            return listener
        }
        
        var l = getListener2(i)
        cc.eventManager.addListener(l, spr)
        
        return spr
    },

    //生成手牌和底牌
    refreshUserIdx:function(control)
    {
        var width =control['gmNode'].getContentSize().width
        var height = control['gmNode'].getContentSize().height

        //手牌数   
        var Count = MAX_COUNT;
        var hcount =16

       
        //每个玩家的手牌
        var x= GAME_PLAYER
        for(var i=0;i<x;i++)
        {         
            var node = new cc.Node()
            node.attr({
                x:40,
                y:height-130-(height-140)/x*i,
            })
            if(i<GAME_PLAYER)
                var laxt =new cc.LabelTTF("玩家"+i+":","Helvetica",24)
            else
                var laxt = new cc.LabelTTF("底牌:","Helvetica",24)
            node.addChild(laxt)
            for (var j = 0; j <  Count; j++) 
            {
                var spr = pokerGmPop.getSpr(Count*i+j,j,width/(Count<=hcount?Count:hcount),Count,hcount,pokerGmPop.poker)                
                node.addChild(spr,1,pokerGmPop.poker[Count*i+j])
            }
            this.playnodes[i]=node
            control['gmNode'].addChild(node,1,i)
        }

        //字典
        var rowNum = 27
        var node = new cc.Node()
            node.attr({
                x:40,
                y:height-20,
                anchorY:0,
                anchorX:0,
            })
            var text = new cc.LabelTTF("字典牌:","Helvetica",24)
            node.addChild(text)
        for(var i=0;i<pokerGmPop.pokermodel.length;i++)
        {
            var cardData = pokerGmPop.pokermodel[ i]
            var spr = cardFactory.getOne(cardData, 0, 0)        
            spr.setScale(0.3)
            if(i<54)
            {
                spr.attr({
                x:spr.width*spr.getScale()*0.6*(i%rowNum)+75,
                y:-20-spr.height*spr.getScale()*Math.floor(i/rowNum) ,            
                });
            }
            else
            {
                spr.attr({
                x:spr.width*spr.getScale()*0.6*(i-54)+0,
                y:-45 ,
            
                });
            }
            spr.cardData = cardData
            spr.idx =  i

            function getListener1(idx)
            {
                var listener = cc.EventListener.create({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: true,
                onTouchBegan: function (touch, event) {
                    var target = event.getCurrentTarget()
                    var locationInNode = target.convertToNodeSpace(touch.getLocation())
                    var s = target.getContentSize();
                    var rect = cc.rect(0, 0, s.width, s.height)
                    if (cc.rectContainsPoint(rect, locationInNode)) {
                        return true
                    }
                    return false
                },
                onTouchEnded: function (touch, event) {
                    var target = event.getCurrentTarget()
                    pokerGmPop.currentIdx = target.cardData
            }
            })

            return listener
            }
        

            var l = getListener1(i)
            cc.eventManager.addListener(l, spr)
       
            node.addChild(spr,1,pokerGmPop.pokermodel[cardData])
            
         
        }
 
            control['gmNode'].addChild(node,1,1000)
       
    }

}