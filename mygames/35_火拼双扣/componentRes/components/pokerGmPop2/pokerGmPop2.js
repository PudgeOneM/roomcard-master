
var CMD_C_Gm = 
[
    ['BYTE', 'cbGmCardDatas', 108],
]

var pokerGmPop = 
{   
    //需要改  牌库  底牌数    
    resp:'components/pokerGmPop2/res/',
    //牌库
    poker:[  
           0x01,0x02,0x03,0x04,0x05,0x06,0x07,0x08,0x09,0x0A,0x0B,0x0C,0x0D,    //方块 A - K
        0x11,0x12,0x13,0x14,0x15,0x16,0x17,0x18,0x19,0x1A,0x1B,0x1C,0x1D,   //梅花 A - K
        0x21,0x22,0x23,0x24,0x25,0x26,0x27,0x28,0x29,0x2A,0x2B,0x2C,0x2D,   //红桃 A - K
        0x31,0x32,0x33,0x34,0x35,0x36,0x37,0x38,0x39,0x3A,0x3B,0x3C,0x3D,   //黑桃 A - K
        0x4E,0x4F,
     0x01,0x02,0x03,0x04,0x05,0x06,0x07,0x08,0x09,0x0A,0x0B,0x0C,0x0D,  //方块 A - K
        0x11,0x12,0x13,0x14,0x15,0x16,0x17,0x18,0x19,0x1A,0x1B,0x1C,0x1D,   //梅花 A - K
        0x21,0x22,0x23,0x24,0x25,0x26,0x27,0x28,0x29,0x2A,0x2B,0x2C,0x2D,   //红桃 A - K
        0x31,0x32,0x33,0x34,0x35,0x36,0x37,0x38,0x39,0x3A,0x3B,0x3C,0x3D,   //黑桃 A - K
        0x4E,0x4F,
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
    preLoadRes:
    [
    'components/pokerGmPop2/res/cardGm.plist', 
    'components/pokerGmPop2/res/cardGm.png'
    ],
    onPreLoadRes:function()
    {
        var resp = pokerGmPop.resp
        cc.spriteFrameCache.addSpriteFrames(resp + 'cardGm.plist', resp + 'cardGm.png')
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
            for(var i =0;i<pokerGmPop.poker.length;i++)
            {

                idxs[idxs.length] = pokerGmPop.poker[i]
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

        var node  = managerRes.loadCCB('components/pokerGmPop/res/pokerGmPop2.ccbi', control)
        pokerGmPop.refreshUserIdx(control)

        return node
    },
    //生成精灵
     getSpr:function(i,j,dis,count,hcount,poker)
    {
        var cardData = poker[ i]
        var spr = new cc.Sprite("#" + pokerGmPop.getSprite(cardData))
           
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
                if(pokerGmPop.currentIdx==null||(pokerGmPop.currentIdx!=null&&target.getParent().tag!=1000))
                {
                    if (cc.rectContainsPoint(rect, locationInNode)) {
                       
                        for(var i=0;i<GAME_PLAYER+1;i++)
                        {
                            var parent = pokerGmPop.playnodes[i]
                            if(parent.getChildByTag(target.cardData)!=null)
                            {
                                target.color =  cc.color(100,100,100) 
                                parent.getChildByTag(target.cardData).color = cc.color(100,100,100)
                                break;
                            }
       
                        }                   
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
                    var Count = pokerGmPop.Dipai==0?MAX_COUNT:((pokerGmPop.poker.length-pokerGmPop.Dipai)/GAME_PLAYER);
                    // Count =16
                    
                    for(var i=0;i<GAME_PLAYER;i++)
                    {
                        // var chooseone = true
                        var parent = pokerGmPop.playnodes[i]
                        if(parent.getChildByTag(pokerGmPop.currentIdx.cardData)!=null)
                        {
                            var exchange = parent.getChildByTag(pokerGmPop.currentIdx.cardData)

                            // if(chooseone)
                            // {
                            // exchange.setSpriteFrame(pokerGmPop.getSprite(target.cardData))
                            target.setSpriteFrame(pokerGmPop.getSprite(exchange.cardData))
                            //数组中位置交换
                            var temp = target.cardData
                            pokerGmPop.poker[target.idx] = exchange.cardData
                            pokerGmPop.poker[exchange.idx] = target.cardData

                            target.cardData = exchange.cardData
                            target.setTag(exchange.cardData)

                            // exchange.cardData =temp
                            // exchange.setTag(temp)

                            pokerGmPop.currentIdx.setTag(temp)
                            chooseone =false
                            // }                         

                            target.color =  cc.color(255,255,255) 
                            exchange.color = cc.color(255,255,255)                     
                        }
                        
                    }   

                    pokerGmPop.currentIdx.color = cc.color(255,255,255)               

                    pokerGmPop.currentIdx = null

                }
            }
        })

        return listener
    },
    //生成手牌和底牌
    refreshUserIdx:function(control)
    {
        var width =control['gmNode'].getContentSize().width
        var height = control['gmNode'].getContentSize().height

        //手牌数   
        var Count = pokerGmPop.Dipai==0?MAX_COUNT:((pokerGmPop.poker.length-pokerGmPop.Dipai)/GAME_PLAYER);
        // var Count = 16
        var hcount =16
        //每个玩家的手牌
        var x= pokerGmPop.Dipai==0?GAME_PLAYER:(GAME_PLAYER+1)
        for(var i=0;i<x;i++)
        {         
            var node = new cc.Node()
            node.attr({
                x:40,
                y:height-140-(height-140)/x*i,
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
        var node = new cc.Node()
            node.attr({
                x:40,
                y:height-20,
                anchorY:0,
                anchorX:0,
                // -(height/(GAME_PLAYER+1)),
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

            if(pokerGmPop.contanis(pokerGmPop.poker,cardData))
            {
                node.addChild(spr,1,pokerGmPop.pokermodel[cardData])
            }
         
        }
 
            control['gmNode'].addChild(node,1,1000)
        
        // var listView = new ccui.ListView()
        // listView.setDirection(ccui.ScrollView.DIR_VERTICAL)
        // listView.setTouchEnabled(true)
        // listView.setBounceEnabled(true)
        // // listView.setScrollBarEnabled(false)
        // listView.setBackGroundImage(resp_p.empty)
        // listView.setBackGroundImageScale9Enabled(true)
        // listView.setContentSize(width/2, height/2)
        // listView.x = 0
        // listView.y = 0       
        // control['gmNode'].addChild(listView)

        //todo
        var listView_Poker = new ccui.ListView()
        listView_Poker.setDirection(ccui.ScrollView.DIR_HORIZONTAL)
        listView_Poker.setTouchEnabled(true)
        listView_Poker.setBounceEnabled(true)
        listView_Poker.setBackGroundImage(resp_p.empty)
        listView_Poker.setBackGroundImageScale9Enabled(true)
        // listView_Poker.setGravity(ccui.ListView.GRAVITY_CENTER_HORIZONTAL)
        listView_Poker.setContentSize(width, height-140)
        listView_Poker.x = 0
        listView_Poker.y = 0
        listView_Poker.setItemsMargin(3)
        // control['gmNode'].addChild(listView_Poker)

        var voiceArray=[1,2,3,4,5,6,7,8]
        for( var i = 0; i < voiceArray.length; i++ )
        {
            var btn = new ccui.Button(resp_p.empty)
            btn.setScale9Enabled(true)
            btn.setTitleFontSize(20)
            btn.width =  60
            btn.height = 40
            btn.setTitleText(voiceArray[i])
            btn.index = i

            listView_Poker.pushBackCustomItem(btn)

            btn.addClickEventListener(function(btn) {
                self._sendExpression(btn.index + 1 + 1000)
            }.bind(this))
        }
        
    }

}