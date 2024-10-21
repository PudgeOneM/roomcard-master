

gameStart.start = function()
{   
    gameStart.registUiController(mainScene)

    var callback = function()
    {
        playData.reset()
        playNode.reset()
        mainScene.reset()
        gameStart.connectServer()  
    }
    gameStart.registReStartEvent(callback)

    gameStart._loadRes(function()
    {            
        gameStart.connectServer()
    })
}

gameStart.enterMainScene = function()
{   
    mainScene.runThisScene()
    hasEnterMainScene = true

    managerAudio.setEffectsVolume(0.5)
}

gameStart.connectServer = function()
{   
    var ip = llb_room.server
    gameLog.log(ip)
    socket.connect('ws://' + ip, gameStart._onConnect)
}


//////////////内部函数////////////////////
gameStart._onConnect = function()
{   
    var l = function(msg)
    {   
        tableData.enterListener(msg)
    }
    socket.registSocketListener(l)

    tableData.onEnterScene = function()
    {
        var l = function(msg)
        {   
            playData.enterListener(msg)
            tableData.gameListener(msg)
        }
        socket.registSocketListener(l)
        if(tableData.isCreateTable)
            socket.sendMessage(MDM_GF_GAME, 333)
    }

    var cookieConfirm = getObjWithStructName( 'CMD_GR_CookieConfirm' )
    cookieConfirm.szCookie = llb_utoken
    socket.sendMessage( MDM_GR_LOGON, SUB_GR_COOKIE_CONFIRM, cookieConfirm )
}

gameStart._loadRes = function(onLoad)
{   
    managerRes.startPreloadScene(g_resources, function () {

        cc.spriteFrameCache.addSpriteFrames(resp.baseResPlist, resp.baseRes)
        cc.spriteFrameCache.addSpriteFrames(resp.playResPlist, resp.playRes)
        
        cc.spriteFrameCache.addSpriteFrames(resp.animationStartPlist, resp.animationStart)
        cc.spriteFrameCache.addSpriteFrames(resp.animationBombPlist, resp.animationBomb)

        var t = new cc.SpriteFrame(resp_p.empty, cc.rect(0, 0, 2, 2))
        cc.spriteFrameCache.addSpriteFrame(t, "empty.png")

        t = new cc.SpriteFrame(resp.gameEndWin, cc.rect(0, 0, 236, 162))
        cc.spriteFrameCache.addSpriteFrame(t, "gameEndWin.png")
        t = new cc.SpriteFrame(resp.gameEndLose, cc.rect(0, 0, 236, 162))
        cc.spriteFrameCache.addSpriteFrame(t, "gameEndLose.png")
        
        t = new cc.SpriteFrame(resp.bg_g, cc.rect(0, 0, 960, 640))
        cc.spriteFrameCache.addSpriteFrame(t, "bg_g.jpg")

        t = new cc.SpriteFrame(resp.bg_logo, cc.rect(0, 0, 139, 176))
        cc.spriteFrameCache.addSpriteFrame(t, "bg_logo.jpg")

        cardFactory.init(resp.card_100)
        onLoad?onLoad():''
    })

}













var cardFactory = 
{   
    //cardIdx candNum cardColor
    width:135,
    height:180,
    originColor:cc.color(255, 255, 255),
    init:function(cardBackResp, width, height)
    {
        width = width || cardFactory.width 
        height = height || cardFactory.height 
        var t = new cc.SpriteFrame(cardBackResp, cc.rect(0, 0, width, height))
        cc.spriteFrameCache.addSpriteFrame(t, "card_100.png")
    },
    getOne:function(cardIdx, isBack, isNeedFrame)
    {   
        var idx = isBack?100:cardIdx
        var spr = new cc.Sprite("#" + 'card_' + idx + '.png')
        spr.cardIdx = cardIdx
        spr.isselected = false 
        if(isNeedFrame)
        {
            var sprFrame = new cc.Sprite("#card_101.png")
            sprFrame.setPosition(cc.p(spr.getContentSize().width*0.5,  spr.getContentSize().height*0.5))
            sprFrame.setVisible(false)
            spr.addChild(sprFrame, 1, 101)
        }
        spr.color = cardFactory.originColor
        return spr
    },
    getNumAndColorByCardIdx:function(cardIdx)
    {
        var color = Math.floor(cardIdx/16)  // 0 1 2 3对应方块 梅花 红桃 黑桃
        var num =  cardIdx - color*16 //11 12  13 对应j q k
        return [num,color]
    },
    getCardIdxByColorAndNum:function(num, color)
    {
        return color * 16 + num
    },
    getSendAction:function(target, endPos, endScale, endCardIdx, afterMoveAction, afterTurnOverAction)
    {   
        endScale = endScale || target.getScale()

        var a1 = cc.moveTo(0.5, endPos)
        var a2 = cc.scaleTo(0.5, endScale)
        var a3 = cc.spawn(a1, a2)
     
        if(!endCardIdx)
            return afterTurnOverAction?cc.sequence(a3, afterTurnOverAction):a3

        var a4 = this.getTurnOverAction(target, endCardIdx, null, endScale)

        var a5 = afterMoveAction?cc.sequence(a3, afterMoveAction, a4):cc.sequence(a3, a4)

        return afterTurnOverAction?cc.sequence(a5, afterTurnOverAction):a5
    },
    getTurnOverAction:function(target, endCardIdx, endAction, scale)
    {
        scale = scale || target.getScale()
        //var a1 = cc.orbitCamera(0.2, 1, 0, 0, 90, 0, 0) 安卓不支持
        var a1 = cc.scaleTo(0.2, 0, 1*scale)
        var a2 = cc.callFunc(
                    function()
                    {   
                        target.setSpriteFrame('card_' + endCardIdx + '.png') 
                        target.setFlippedX(true) 
                    })
        //var a3 = cc.orbitCamera(0.2, 1, 0, 90, 90, 0, 0)
        var a3 = cc.scaleTo(0.2, -1*scale, 1*scale)
        var a4 = cc.sequence(a1, a2, a3)

        return endAction?cc.sequence(a4, endAction):a4
    },
    onTouchBegan:function()
    {
        var card = this
        if(card.cardIdx && card.cardIdx!=100)
            card.color = cc.color(144, 144, 144)
    },
    onTouchCancle:function()
    {
        var card = this
        card.color = cardFactory.originColor
    },
    onTouchEnd:function()
    {
        var card = this
        card.color = cardFactory.originColor

        card.isselected = !card.isselected
        if(card.getChildByTag(101))
        {
            if(card.isselected)
                card.getChildByTag(101).setVisible(true)
            else
                card.getChildByTag(101).setVisible(false)
        }

        card.isselected?card.selectedCall(card):card.unSelectedCall(card)
    },
    initSelectedCall:function(target, selectedCall, unSelectedCall, isEnableFun)
    {
        target.selectedCall = selectedCall
        target.unSelectedCall = unSelectedCall
        target.isEnableFun = isEnableFun
    },
    bindListener:function(target, selectedCall, unSelectedCall, isEnableFun)
    {   
        cardFactory.initSelectedCall(target, selectedCall, unSelectedCall, isEnableFun)

        var listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget()
                if(target.isEnableFun&&!target.isEnableFun(target.isselected))
                    return false
                
                var locationInNode = target.convertToNodeSpace(touch.getLocation())
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height)
                if (cc.rectContainsPoint(rect, locationInNode)) {
                    cardFactory.onTouchBegan.call(target)
                    return true
                }
                return false
            },
            onTouchEnded: function (touch, event) {
                var target = event.getCurrentTarget()
                cardFactory.onTouchEnd.call(target)
            }
        })

        cc.eventManager.addListener(listener, target)
    },
    reset:function(originPosY)
    {
        var card = this
        if(card.getChildByTag(101))
        {
            card.getChildByTag(101).setVisible(false)
            card.isselected = false 
            originPosY?card.setPositionY(originPosY):''
        }
    },
    /////////
    getCardsGroupNode:function(cards, cardInterval, touchEndCall)
    {
        var node = new cc.Node()
        node.ignoreAnchorPointForPosition(false)
        node.setAnchorPoint( cc.p(0.5, 0.5) )

        var cardWith = cardFactory.width * cards[0].getScaleX()
        var cardHeight = cardFactory.height * cards[0].getScaleY()

        var nodeWidth = (cards.length-1)*cardInterval + cardWith
        var nodeHeight = cardHeight
        node.setContentSize(nodeWidth, nodeHeight)


        node.cardIdx2Tag = []
        for(var i=0;i<cards.length;i++)
        {
            var tag = i
            var posX = cardWith*0.5 + (cards.length - tag -1)*cardInterval
            var posY = nodeHeight*0.5
            var c = cards[i]
            c.setPosition( cc.p(posX, posY) ) 
            node.addChild(c, 100-tag, tag)

            node.cardIdx2Tag[c.cardIdx] = tag
        }

        var touchPosX2Tag = function(posX)
        {   
            var tag = (cards.length-1) - Math.floor(posX/cardInterval)
            tag = Math.max(tag, 0)
            return tag
        }

        var popHighLightedCardTags = function()
        {
            var tag = (node.highLightedCardTags.splice(-1,1))[0]
            cardFactory.onTouchCancle.call(node.getChildByTag(tag))
        }

        var insertHighLightedCardTags = function(tag)
        {
            node.highLightedCardTags[node.highLightedCardTags.length] = tag
            cardFactory.onTouchBegan.call(node.getChildByTag(tag))
        }

        node.highLightedCardTags = []

        var updateHighLightedCards = function(locationX)
        {   
            var currentTouchTag = touchPosX2Tag(locationX)

            if(node.highLightedCardTags.length==0)
            {
                insertHighLightedCardTags(currentTouchTag)
                return 
            }
            var lastTouchTag = node.highLightedCardTags[node.highLightedCardTags.length-1]

            if(currentTouchTag != lastTouchTag)
            {
                var isExist = false
                for(var i in node.highLightedCardTags)
                {
                    if(currentTouchTag == node.highLightedCardTags[i])
                    {
                        isExist = true
                        break
                    }   
                }
                
                if(lastTouchTag>currentTouchTag)
                    for(var i=lastTouchTag-1;i>=currentTouchTag;i--)
                        isExist?popHighLightedCardTags():insertHighLightedCardTags(i)
                else
                    for(var i=lastTouchTag+1;i<=currentTouchTag;i++)
                        isExist?popHighLightedCardTags():insertHighLightedCardTags(i)
            }
        }

        var listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget()

                var locationInNode = target.convertToNodeSpace(touch.getLocation())
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height)
                if (cc.rectContainsPoint(rect, locationInNode)) {
                    updateHighLightedCards(locationInNode.x<0?0:locationInNode.x)
                    return true
                }
                return false
            },
            onTouchMoved: function (touch, event) {
                var target = event.getCurrentTarget()
                var locationInNode = target.convertToNodeSpace(touch.getLocation())
                updateHighLightedCards(locationInNode.x<0?0:locationInNode.x)
            },
            onTouchEnded: function (touch, event) {
                
                var isDownCard = true
                for(var i in node.highLightedCardTags)
                {
                    var tag = node.highLightedCardTags[i]
                    isDownCard = node.getChildByTag(tag).isselected
                    cardFactory.onTouchEnd.call(node.getChildByTag(tag))
                }

                node.highLightedCardTags.length==1 && !node.getChildByTag(tag).isselected
                node.highLightedCardTags = []
                touchEndCall?touchEndCall(isDownCard):''
            }
        })
        cc.eventManager.addListener(listener, node)
        return node
    },
    getCardsPosArray:function(cardSize, cardsLen, maxLenOneRow) 
    {
        var spaceX = cardSize.width/3
        var spaceY= cardSize.height/2
        var cardsPos = []
        for(var i=0;i<cardsLen;i++)
        {   
            var pos = []
            pos[0] = i%maxLenOneRow*spaceX
            pos[1] = -spaceY * Math.floor(i/maxLenOneRow)
            cardsPos[cardsPos.length] = pos
        }
        return cardsPos
    },
    refreshOutCards:function(user, outCards, maxLenOneRow, isMiddle)
    {
        var outCardsNode = user.userNodeInsetChair.currentRoundNode.outCards
        outCardsNode.removeAllChildren()   
        var cardScale = 0.5
        var cardsLen = outCards.length
        var cardsPos = cardFactory.getCardsPosArray( {width:cardFactory.width*cardScale, 
            height:cardFactory.height*cardScale}, cardsLen, maxLenOneRow) 

        var lenOneRow = Math.min(cardsLen, maxLenOneRow)

        var offset = {x:0, y:0}
        if(isMiddle)
        {
            offset.x = (cardsPos[0][0] - cardsPos[lenOneRow-1][0])/2
        }
        else
        {
            var chair = tableData.getChairWithServerChairId(user.wChairID)
            if(chairFactory.isRight(chair.node))
            {
                offset.x = cardsPos[0][0] - cardsPos[lenOneRow-1][0]
                offset.x = offset.x - cardFactory.width*cardScale*0.5
            }
            else
                 offset.x = offset.x + cardFactory.width*cardScale*0.5

            offset.y = offset.y + 10
        }

        for(var i in outCards)
        {
            var cardidx = outCards[i]>=80?cardLogic.getIdx54OfLaiziWithColorAndIdx_laizi(outCards[i], 0):outCards[i] 
            var card = cardFactory.getOne(cardidx)
            card.setScale(cardScale)
            card.setPosition(cc.p(cardsPos[i][0]+offset.x, cardsPos[i][1]+offset.y))
            outCardsNode.addChild(card)
        }
    },
 
}

