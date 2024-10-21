
//两副牌
var cardFactory =  //direction 0down 1right 2up 3left
{   
    resp:'components/cardFactory/res/',
    defaultCardColor:cc.color(255, 255, 255),
    ////////////可配置项 begin /////////
    handCountOneRowMax:27,
    handCountOneRowMin:null,

    handGroupNodeHeight:200,//150一行手牌多 180一行手牌少 200两行
    handGroupNodeWidth:null,
    outCountOneRow_upDown:27,
    outCountOneRow_rightLeft:9,

    intervalXRightAndDownOut:20,//这个尺寸受scale_out影响
    intervalXChairAndRightOut_const:40,//这个是固定尺寸 不会受scale_out影响
    selectCardOffsetY:10,

    handIntervalYScale:0.45,
    outIntervalXScale:0.36,
    outIntervalYScale:0.45,
    ////////////可配置项 end //////////
    
    handGroupNode:null,
    maxHandCount:null,

    cardData2ScoreMap:[],//score用于排序先后 比如财神要排在最左边 就要把财神score设置为最低(0) 通过initCardData2ScoreMap
    scale_hand:null,//按手牌占满handGroupNode计算得出
    scale_out:null,//按出牌容器内 出的牌不出现重叠计算得出

    //以下为四个方向的尺寸适配
    ////////////////// down //////////////////////
    down_handWidth:142,
    down_handHeight:202,
    down_handIdxScale:1,
    // downHandIntervalX:null,//根据占满handGroupNode 计算得出downHandIntervalX

    down_outWidth:70,
    down_outHeight:100,
    down_outIdxScale:0.5,
    /////////////////// up ////////////////////
    // up_handWidth:30,
    // up_handHeight:44,

    up_outWidth:70,
    up_outHeight:100,
    up_outIdxScale:0.5,

    //////////////////// right ////////////////////
    // right_handWidth:24,
    // right_handHeight:60,

    right_outWidth:70,
    right_outHeight:100,
    right_outIdxScale:0.5,

    //////////////////// left ////////////////////
    // left_handWidth:24,
    // left_handHeight:60,

    left_outWidth:70,
    left_outHeight:100,
    left_outIdxScale:0.5,
    ////////////////////////////////////////////
    preLoadRes:
    [
    'components/cardFactory/res/cards.plist', 
    'components/cardFactory/res/cards.png'
    ],
    onPreLoadRes:function()
    {   
        var resp = cardFactory.resp
        cc.spriteFrameCache.addSpriteFrames(resp + 'cards.plist', resp + 'cards.png')
    },
    onReStart:function()
    {
    },
    init:function(decorateCard, maxHandCount)
    {
        if(cardFactory.handCountOneRowMin == null)
            cardFactory.handCountOneRowMin = Math.ceil(cardFactory.handCountOneRowMax*0.7) 

        cardFactory.decorateCard = decorateCard || function(){}
        cardFactory.maxHandCount = maxHandCount || MAX_COUNT

        var handRowNum = Math.ceil(cardFactory.maxHandCount/cardFactory.handCountOneRowMax) 
        cardFactory.scale_hand = cardFactory.handGroupNodeHeight/( cardFactory.down_handHeight+(handRowNum-1)*cardFactory.down_handHeight*cardFactory.handIntervalYScale )

        // cardFactory.downHandIntervalX = (cardFactory.handGroupNodeWidth - cardFactory.down_handWidth*cardFactory.scale_hand)/(cardFactory.handCountOneRowMax-1)/cardFactory.scale_hand
        
        //计算scale_out
        var outMaxWidth = cardFactory.down_outWidth+(cardFactory.outCountOneRow_upDown-1)*cardFactory.down_outWidth*cardFactory.outIntervalXScale
        +cardFactory.right_outWidth+(cardFactory.outCountOneRow_rightLeft-1)*cardFactory.right_outWidth*cardFactory.outIntervalXScale
        +cardFactory.left_outWidth+(cardFactory.outCountOneRow_rightLeft-1)*cardFactory.left_outWidth*cardFactory.outIntervalXScale
        +cardFactory.intervalXRightAndDownOut*2
        
        var outContainerWidth = tableNode.chairNode1.x - tableNode.chairNode3.x - cardFactory.intervalXChairAndRightOut_const*2
        cardFactory.scale_out = outContainerWidth/outMaxWidth
    },
    initCardData2ScoreMap:function( cardDatas, scores )
    {
        var map = []
        for(var i=0;i<cardDatas.length;i++)
        {
            map[cardDatas[i]] = scores[i]
        }
        
        cardFactory.cardData2ScoreMap = map
    },
    sortCardDatasWithScore:function(cardDatas)
    {
        cardDatas.sort(function(a,b)
        {   
            return cardFactory.cardData2ScoreMap[a] - cardFactory.cardData2ScoreMap[b]
        })
        return cardDatas
    },
    //根据where direction 获得麻将精灵 isIgnoreDecorate是否忽略装饰函数（例如财神图片是在这个组件外部处理的 如果不需要显示设置为忽略）
    getOne:function(cardData, where, direction, isIgnoreDecorate)
    {   
        var cardSpr = new cc.Sprite(resp_p.empty)
        cardSpr.color = cardFactory.defaultCardColor
        cardSpr.originColor = cardFactory.defaultCardColor
        cardSpr.chooseColor = cc.color(144, 144, 144)
        cardSpr.where = where
        cardSpr.direction = direction

        var scale = where==0?cardFactory.scale_hand:cardFactory.scale_out   
        cardSpr.setScale(scale)

        var color_cSpr = new cc.Sprite(resp_p.empty)
        var numSpr = new cc.Sprite(resp_p.empty)
        var color_tSpr = new cc.Sprite(resp_p.empty)

        cardSpr.addChild(color_cSpr, 0, 101)
        cardSpr.addChild(numSpr, 0, 102)
        cardSpr.addChild(color_tSpr, 0, 103)

        cardFactory.updateIdxOfCardSpr(cardSpr, cardData)

        if(!isIgnoreDecorate && cardFactory.decorateCard)
            cardFactory.decorateCard(cardSpr)
        
        return cardSpr
    },
    updateIdxOfCardSpr:function(cardSpr, cardData)
    {
        var whereMap = 
        [
            'hand',
            'out',
        ]

        var dirMap = 
        [
            'down_',
            'right_',
            'up_',
            'left_'
        ]

        var prefix = dirMap[cardSpr.direction] + whereMap[cardSpr.where]
        var frameName = 'cf_' + prefix + (cardData==0?'Back':'Bg') + '.png'
        cardSpr.setSpriteFrame(frameName)
        cardSpr.cardData = cardData
        
        ///////
        var color_cSpr = cardSpr.getChildByTag(101)
        var numSpr = cardSpr.getChildByTag(102)
        var color_tSpr = cardSpr.getChildByTag(103)

        if(cardData == 0)
        {
            color_cSpr.setVisible(false)
            numSpr.setVisible(false)
            color_tSpr.setVisible(false)
            return
        }

        /////////////
        color_cSpr.setVisible(true)
        numSpr.setVisible(true)
        color_tSpr.setVisible(true)

        var idxScale = cardFactory[prefix + 'IdxScale']
        color_cSpr.scale = idxScale
        numSpr.scale = idxScale
        color_tSpr.scale = idxScale

        var num = cardLogic.getNum(cardData)
        var color = cardLogic.getColor(cardData)
        if(num<=13)
        {
            color_cSpr.setSpriteFrame("cf_color_c" + color + '.png')
            color_cSpr.x = cardSpr.width *0.6
            color_cSpr.y = cardSpr.height*0.35

            numSpr.setSpriteFrame("cf_num_" + (color%2==0?'r':'b') + num + '.png')
            numSpr.x = cardSpr.width *0.17
            numSpr.y = cardSpr.height*0.8

            color_tSpr.setSpriteFrame("cf_color_t" + color + '.png')
            color_tSpr.x = cardSpr.width *0.17
            color_tSpr.y = cardSpr.height*0.55
        }
        else
        {
            color_cSpr.setSpriteFrame("cf_color_c" + (num==14?4:5)  + '.png')
            color_cSpr.x = cardSpr.width *0.6
            color_cSpr.y = cardSpr.height*0.42

            numSpr.setSpriteFrame("cf_num_" + (num==15?'r':'b') + num + '.png')
            numSpr.x = cardSpr.width *0.13
            numSpr.y = cardSpr.height*0.63

            color_tSpr.setSpriteFrame('empty.png')
        }
    },
    ///////handCards start//////
    //handCardDatasArray:
    //[
    //[1,2,3,4], 
    //[], 
    //[], 
    //[]
    //]
    //cardDatas数组->spr数组
    getHandCardsArray:function(handCardDatasArray)
    {
        var handCards4D = []
        for(showChairId=0;showChairId<GAME_PLAYER;showChairId++)//direction 0down 1right 2up 3left
        {
            var direction = cardFactory.showChairId2Direction(showChairId)
            var handCardDatas = handCardDatasArray[direction]
            var handCards = []
            for(var j=0;j<handCardDatas.length;j++)
            {
                //大的牌在左上角  handCardDatas是按小到大排列的(outCardDatas是按牌型排列) 
                var cardData = handCardDatas[j]                
                var card = cardFactory.getOne(cardData, 0, direction)
                card.idxInHandCards = j
                var pos = cardFactory.getHandCardPosAndTag(handCardDatas.length, card.idxInHandCards, direction)
                card.x = pos.x
                card.y = pos.y
                card.setLocalZOrder(pos.zOrder)
                card.originY = pos.y
                handCards[j] = card
            }

            handCards4D[direction] = handCards
        }

        return handCards4D
    },
    //自右往左row递增 自下往上line递增
    getHandCardPosAndTag:function(length, idxInCardDatas, direction)
    {        
        var maxLine = Math.floor((cardFactory.maxHandCount-1)/cardFactory.handCountOneRowMax) 
        var handCountOneRow = 0
        if(length>(maxLine+1)*cardFactory.handCountOneRowMin)
            handCountOneRow = Math.ceil(length/(maxLine+1))
        else
            handCountOneRow = cardFactory.handCountOneRowMin

        var downHandIntervalX = (cardFactory.handGroupNodeWidth - cardFactory.down_handWidth*cardFactory.scale_hand)/(handCountOneRow-1)/cardFactory.scale_hand

        var row = idxInCardDatas%handCountOneRow
        var line = Math.floor(idxInCardDatas/handCountOneRow) 

        var pos = {}
        switch(direction)
        {
            case 0://down 
            {
                //如果只有一行则居中 
                if(length<=handCountOneRow)
                {
                    pos.x = (length -1 - row)*downHandIntervalX*cardFactory.scale_hand
                        + 0.5*cardFactory.down_handWidth*cardFactory.scale_hand 
                }
                else
                    pos.x = (handCountOneRow -1 - row)*downHandIntervalX*cardFactory.scale_hand
                        + 0.5*cardFactory.down_handWidth*cardFactory.scale_hand 
                pos.y = 0.5*cardFactory.down_handHeight*cardFactory.scale_hand 
                    + line*cardFactory.down_handHeight*cardFactory.handIntervalYScale*cardFactory.scale_hand
                pos.zOrder = -line*100 - row
                break
            }
            case 1://right
            {        
                break
            }
            case 2://up
            {
               break
            }
            case 3://left
            {
                break
            }
        }
        return pos
    },
    //手牌是要处理触摸监听的 GroupNodes是hand麻将的父节点 用于同意处理触摸
    getHandGroupNodes:function(handCards4D, touchEndCalls)
    {
        var handGroupNodes = []
        for(showChairId=0;showChairId<GAME_PLAYER;showChairId++)//direction 0down 1right 2up 3left
        {
            var direction = cardFactory.showChairId2Direction(showChairId)
            var cards = handCards4D[direction]

            //////
            var node = new cc.Node()
            node.ignoreAnchorPointForPosition(false)
            switch(direction) 
            {
                case 0://down
                {
                    node.setAnchorPoint( cc.p(0.5, 0) )
                    break
                }
                case 1://right
                {
                    break
                }
                case 2://up
                {
                    break
                }
                case 3://left
                {
                    break
                }
            }

            var size = cardFactory._getHandGroupNodeSize(cards.length, direction)
            node.width = size.width
            node.height = size.height
            for(var j=0;j<cards.length;j++)
            {
                var card = cards[j]
                node.addChild(card)
            }

            var length = cards.length
            var maxLine = Math.floor((cardFactory.maxHandCount-1)/cardFactory.handCountOneRowMax) 
            var handCountOneRow = 0
            if(length>(maxLine+1)*cardFactory.handCountOneRowMin)
                handCountOneRow = Math.ceil(length/(maxLine+1))
            else
                handCountOneRow = cardFactory.handCountOneRowMin
            var downHandIntervalX = (cardFactory.handGroupNodeWidth - cardFactory.down_handWidth*cardFactory.scale_hand)/(handCountOneRow-1)/cardFactory.scale_hand
            node.handCountOneRow = handCountOneRow
            node.downHandIntervalX = downHandIntervalX

            //////////touch
            var touchEndCall = touchEndCalls[direction]
            if(touchEndCall) 
            {
                var listener = cardFactory._gethandGroupNodeListener(cards, direction, touchEndCall)
                cc.eventManager.addListener(listener, node)
            }

            handGroupNodes[direction] = node
        }

        return handGroupNodes
    },
    _getHandGroupNodeSize:function(length, direction)
    {
        var maxLine = Math.floor((cardFactory.maxHandCount-1)/cardFactory.handCountOneRowMax) 
        var handCountOneRow = 0
        if(length>(maxLine+1)*cardFactory.handCountOneRowMin)
            handCountOneRow = Math.ceil(length/(maxLine+1))
        else
            handCountOneRow = cardFactory.handCountOneRowMin

        var downHandIntervalX = (cardFactory.handGroupNodeWidth - cardFactory.down_handWidth*cardFactory.scale_hand)/(handCountOneRow-1)/cardFactory.scale_hand

        var size = {}
        switch(direction) 
        {
            case 0://down
            {
                //如果只有一行
                if(length<=handCountOneRow)
                {
                    size.width = cardFactory.down_handWidth*cardFactory.scale_hand + (length-1)*downHandIntervalX*cardFactory.scale_hand
                    size.height = cardFactory.down_handHeight*cardFactory.scale_hand
                }
                else
                {
                    size.width = cardFactory.down_handWidth*cardFactory.scale_hand + (handCountOneRow-1)*downHandIntervalX*cardFactory.scale_hand
                    size.height = cardFactory.down_handHeight*cardFactory.scale_hand
                    +(Math.ceil(cardFactory.maxHandCount/handCountOneRow)-1)*cardFactory.down_handHeight*cardFactory.handIntervalYScale*cardFactory.scale_hand
                }
                break
            }
            case 1://right
            {
                break
            }
            case 2://up
            {
                break
            }
            case 3://left
            {
                break
            }
        }


        return size
    },
    _gethandGroupNodeListener:function(cards, direction, touchEndCall)
    {
        if(direction!=0)//only0 123todo
            return 

        var pos2Idx = function(handGroupNode, posInHandGroupNode)//assert pos不会超出HandGroupNode
        {     
            //自右往左row递增 自下往上line递增
            var row = Math.ceil( (handGroupNode.width-posInHandGroupNode.x-cardFactory.down_handWidth*cardFactory.scale_hand)/
                (handGroupNode.downHandIntervalX*cardFactory.scale_hand) )
            row = row<0?0:row

            var line = ( (posInHandGroupNode.y - cardFactory.down_handHeight*cardFactory.scale_hand)/   
            (cardFactory.down_handHeight*cardFactory.handIntervalYScale*cardFactory.scale_hand) ) 
            line = line<=0?0:Math.ceil(line)

            var idx = line*handGroupNode.handCountOneRow + row
            return idx
        }

        //手指移动时 手指按下和手指当前的位置间的扑克牌全都高亮
        var updateCardsOnMove = function(startIdx, endIdx)
        {
            for(var i=0;i<cards.length;i++)
            {
                if( (i>=startIdx && i<=endIdx) || (i<=startIdx && i>=endIdx) )
                    cards[i].color = cc.color(144, 144, 144)
                else
                    cards[i].color = cards[i].originColor
            }
        }

        //在手指弹起时    手指按下和弹起的位置 这之间的扑克牌全都弹高
        var updateCardsOnEnd = function(startIdx, endIdx)
        {
            for(var i=0;i<cards.length;i++)
            {
                if( (i>=startIdx && i<=endIdx) || (i<=startIdx && i>=endIdx) )
                {
                    cards[i].color = cards[i].originColor
                    cards[i].y = cards[i].y==cards[i].originY?cards[i].originY + cardFactory.selectCardOffsetY:cards[i].originY
                }
            }
        }

        var updateCardsOnCancel = function()
        {
            for(var i=0;i<cards.length;i++)
            {
                cards[i].y = cards[i].originY
                cards[i].color = cards[i].originColor
            }
        }

        var startIdx;
        var currentIdx;
        var listener = cc.EventListener.create
        ({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) 
            {
                var target = event.getCurrentTarget()

                var locationInNode = target.convertToNodeSpace(touch.getLocation())
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height)
                if (cc.rectContainsPoint(rect, locationInNode)) 
                {
                    var idx = pos2Idx(target, locationInNode)
                    if(cards[idx]) 
                    {
                        startIdx = idx
                        return true
                    }
                }

                updateCardsOnCancel()
                return false
            },
            onTouchMoved: function (touch, event) 
            {
                var target = event.getCurrentTarget()
                var locationInNode = target.convertToNodeSpace(touch.getLocation())
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height)
                if (cc.rectContainsPoint(rect, locationInNode)) 
                {
                    var idx = pos2Idx(target, locationInNode)
                    if(cards[idx])
                    {
                        if(currentIdx!=idx)
                        {
                            currentIdx = idx
                            updateCardsOnMove(startIdx, currentIdx)
                        }
                    }
                }
            },
            onTouchEnded: function (touch, event) 
            {
                var target = event.getCurrentTarget()
                var locationInNode = target.convertToNodeSpace(touch.getLocation())
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height)
                if (cc.rectContainsPoint(rect, locationInNode)) 
                {
                    var endIdx = pos2Idx(target, locationInNode)
                    if(cards[endIdx])
                    {
                        updateCardsOnEnd(startIdx, endIdx)
                        
                        // //只要不是取消选中startIdx和endIdx之间的所有牌 就会执行touchEndCall
                        // var upAnyCard = false 
                        // var idx = startIdx
                        // while(true)
                        // {
                        //     if(cards[idx].y != cards[idx].originY)
                        //     {
                        //         upAnyCard = true
                        //         break
                        //     }
                        //     idx = startIdx<endIdx?idx+1:idx-1   

                        //     if( (idx>startIdx && idx>endIdx) || (idx<startIdx && idx<endIdx) )
                        //         break
                        // }
             
                        touchEndCall?touchEndCall(cards[endIdx]):''  

                        startIdx = null
                        currentIdx = null
                        return; 
                    }
                }

                updateCardsOnCancel()
                startIdx = null
                currentIdx = null
            }
        })

        return listener
    },
    deleteHandCards:function(handCards, direction, cardDatas)
    {
        var cards = handCards
        // if(cards.length==0)
        //     return 
        var handGroupNode = cards[0].getParent()
        for(var i=0;i<cardDatas.length;i++)
        {
            var deleteIdx = null
            for(var ii=0;ii<cards.length;ii++)
            {
                if(cards[ii].cardData == cardDatas[i])  
                {
                    deleteIdx = ii
                    break
                }
            }
            if(deleteIdx == null)
                return
            cards[deleteIdx].removeFromParent()
            cards.splice(deleteIdx, 1)
        }

        for(var i=0;i<cards.length;i++)
        {
            var card = cards[i]
            card.idxInHandCards = i
            var pos = cardFactory.getHandCardPosAndTag(cards.length, card.idxInHandCards, direction)
            card.x = pos.x
            card.y = pos.y
            card.setLocalZOrder(pos.zOrder)
            card.originY = pos.y
        }

        //////
        var size = cardFactory._getHandGroupNodeSize(cards.length, direction)
        handGroupNode.width = size.width
        handGroupNode.height = size.height

        ///////
        var length = cards.length
        var maxLine = Math.floor((cardFactory.maxHandCount-1)/cardFactory.handCountOneRowMax) 
        var handCountOneRow = 0
        if(length>(maxLine+1)*cardFactory.handCountOneRowMin)
            handCountOneRow = Math.ceil(length/(maxLine+1))
        else
            handCountOneRow = cardFactory.handCountOneRowMin

        var downHandIntervalX = (cardFactory.handGroupNodeWidth - cardFactory.down_handWidth*cardFactory.scale_hand)/(handCountOneRow-1)/cardFactory.scale_hand

        handGroupNode.handCountOneRow = handCountOneRow
        handGroupNode.downHandIntervalX = downHandIntervalX
    },
    //handCards end//////
    
    ///////outCards start//////
    //outCardDatasArray:
    // [
    //  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,],
    //  [],
    //  [4,5,6,7],
    //  [] 
    // ] cardDatas数组->spr数组
    getOutCardsArray:function(outCardDatasArray)
    {
        var outCards4D = []
        for(showChairId=0;showChairId<GAME_PLAYER;showChairId++)//direction 0down 1right 2up 3left
        {
            var direction = cardFactory.showChairId2Direction(showChairId)
            var cardDatas = outCardDatasArray[direction]
            // var cardSprsOneDirection = []
            // for(var j=0;j<cardDatas.length;j++)
            // {
            //     var cardData = cardDatas[j]
            //     var card = cardFactory.getOne(cardData, 1, direction)
            //     var pos = cardFactory.getOutCardPosAndTag(cardDatas.length, j, direction)
            //     card.x = pos.x
            //     card.y = pos.y
            //     card.setLocalZOrder(pos.zOrder)
            //     cardSprsOneDirection[j] = card
            // }
            outCards4D[direction] = cardFactory.getOutCardSprsOneDirection(cardDatas, direction)
        }

        return outCards4D
    },
    getOutCardSprsOneDirection:function(cardDatas, direction)
    {
        var cardSprsOneDirection = []
        for(var j=0;j<cardDatas.length;j++)
        {
            var cardData = cardDatas[j]
            var card = cardFactory.getOne(cardData, 1, direction)
            var pos = cardFactory.getOutCardPosAndTag(cardDatas.length, j, direction)
            card.x = pos.x
            card.y = pos.y
            card.setLocalZOrder(pos.zOrder)
            cardSprsOneDirection[j] = card
        }
        
        return cardSprsOneDirection
    },
    getOutCardPosAndTag:function(length, idxInCardDatas, direction)
    {
        var outCountOneRow = direction%2==0?cardFactory.outCountOneRow_upDown:cardFactory.outCountOneRow_rightLeft
        
        var row = idxInCardDatas%outCountOneRow
        var line = Math.floor(idxInCardDatas/outCountOneRow) 

        var pos = {}
        //4个方向都遵循 按自上往下自左往右得方向(手牌是自下往上自左往右) outCardDatas数组头摆到数组尾(outCardDatas是按牌型排列)
        switch(direction)
        {
            case 0://down
            {   
                var downOutIntervalX = cardFactory.down_outWidth*cardFactory.outIntervalXScale
                var downOutIntervalY = cardFactory.down_outHeight*cardFactory.outIntervalYScale

                //如果只有一行则居中 
                if(length<=outCountOneRow)
                {
                    var centerX = 0.5*(cardFactory.down_outWidth*cardFactory.scale_out + (outCountOneRow-1)*downOutIntervalX*cardFactory.scale_out)
                    pos.x = (row+0.5-length/2)*downOutIntervalX*cardFactory.scale_out + centerX
                }
                else
                    pos.x = 0.5*cardFactory.down_outWidth*cardFactory.scale_out + row*downOutIntervalX*cardFactory.scale_out
                pos.y = line*downOutIntervalY*cardFactory.scale_out
                pos.zOrder = -line*100 + row
                break
            }
            case 1://right
            {       
                var rightOutIntervalX = cardFactory.right_outWidth*cardFactory.outIntervalXScale
                var rightOutIntervalY = cardFactory.right_outHeight*cardFactory.outIntervalYScale

                //如果只有一行则靠右 
                if(length<=outCountOneRow)
                    pos.x = 0.5*cardFactory.right_outWidth*cardFactory.scale_out + (outCountOneRow-length+row)*rightOutIntervalX*cardFactory.scale_out
                else
                    pos.x = 0.5*cardFactory.right_outWidth*cardFactory.scale_out + row*rightOutIntervalX*cardFactory.scale_out
                pos.y =  - line*rightOutIntervalY*cardFactory.scale_out
                pos.zOrder = line*100 + row
                break
            }
            case 2://up
            {
                var upOutIntervalX = cardFactory.up_outWidth*cardFactory.outIntervalXScale
                var upOutIntervalY = cardFactory.up_outHeight*cardFactory.outIntervalYScale

                //如果只有一行则靠右  
                if(length<=outCountOneRow)
                    pos.x = 0.5*cardFactory.up_outWidth*cardFactory.scale_out + (outCountOneRow-length+row)*upOutIntervalX*cardFactory.scale_out
                else
                    pos.x = 0.5*cardFactory.up_outWidth*cardFactory.scale_out + row*upOutIntervalX*cardFactory.scale_out
                pos.y = - line*upOutIntervalY*cardFactory.scale_out
                
                pos.zOrder = line*100 + row
               break
            }
            case 3://left
            {
                var leftOutIntervalX = cardFactory.left_outWidth*cardFactory.outIntervalXScale
                var leftOutIntervalY = cardFactory.left_outHeight*cardFactory.outIntervalYScale

                pos.x = 0.5*cardFactory.left_outWidth*cardFactory.scale_out + row*leftOutIntervalX*cardFactory.scale_out
                pos.y = - line*leftOutIntervalY*cardFactory.scale_out
                pos.zOrder = line*100 + row
                break
            }
        }
        return pos
    },
    updateOutCards:function(outCards, parent)
    {
        parent.removeAllChildren()
        for(var i=0;i<outCards.length;i++)
        {
            parent.addChild(outCards[i])
        }
    },
    ///////outCards end//////
    
    //处理出牌等动作 的‘增删减查’
    onActionResult:function(action, cardDatas, operateUser, cards2W4D, handGroupNode4D)
    {
        if(action==0)
            cardFactory.onActionOutCard(cardDatas, operateUser, cards2W4D, handGroupNode4D)

    },
    onActionOutCard:function(cardDatas, operateUser, cards2W4D, handGroupNode4D)
    {
        var operateShowChairId = tableData.getShowChairIdWithServerChairId(operateUser.wChairID)
        var operateUserDir = cardFactory.showChairId2Direction(operateShowChairId)
        var handCards = cards2W4D.handCards4D[operateUserDir]
       
        var outCards = cardFactory.getOutCardSprsOneDirection(cardDatas, operateUserDir)
        cards2W4D.outCards4D[operateUserDir] = outCards
        var operateOutCardsNode = operateUser.userNodeInsetChair.currentRoundNode.outCardsNode

        if(handCards.length>0)//扑克牌只会delete 自己的手牌
            cardFactory.deleteHandCards(handCards, operateUserDir, cardDatas)
        cardFactory.updateOutCards(outCards, operateOutCardsNode)
    },

    showChairId2Direction:function(showChairId)
    {
        if(GAME_PLAYER == 4)
            var map = [0, 1, 2, 3]
        else if(GAME_PLAYER == 3)
            var map = [0, 1, 3]

        return map[showChairId]
    },
    direction2ShowChairIdn:function(direction)
    {
        if(GAME_PLAYER == 4)
            var map = [0, 1, 2, 3]
        else if(GAME_PLAYER == 3)
            var map = [0, 1, null, 2]

        return map[direction]
    },

    //只有当选择的牌能找到唯一父集时才会autoFill
    ///[1], [[1,2,3],[1,2,3,4]] ->undefined
    ///[1], [[2,3],[2,3,4]]  ->undefined
    ///[1], [[1,2,3],[2,3,4]] ->0
    ///[1,2], [[1,2,3],[1,2,3,4]] ->undefined
    ///[1,2], [[1,3],[2,3,4]]  ->undefined
    ///[1,2], [[2,3],[1,2,3,4]] ->1
    getNeedSelectedCardDatas_autoFill:function(sortedTipsArray, sortedSubCardDatas)
    {
        if(sortedTipsArray.length == 0)
            return [];

        var _isSubCardData = function(sortedSubCardDatas, sortedCardDatas)
        {
            sortedCardDatas = clone(sortedCardDatas)
            var isSub = true //sortedSubCardDatas中所有元素在CardDatas中都有
            for(var i in sortedSubCardDatas)
            {   
                var CardData = sortedSubCardDatas[i]
                var hasInCardDatas = false 
                for(var ii in sortedCardDatas)
                {
                    if( cardLogic.getNum(sortedCardDatas[ii]) == cardLogic.getNum(CardData) )
                    {
                        hasInCardDatas = true
                        sortedCardDatas.splice(ii, 1)
                        break
                    }     
                }

                if(!hasInCardDatas)
                    isSub = false
            }

            return isSub
        }

        var idxOfTips = null
        for(var i=0;i<sortedTipsArray.length;i++)
        {
            var cardDatas = sortedTipsArray[i]
            var isSubCardData = _isSubCardData(sortedSubCardDatas, cardDatas)
            if(isSubCardData)
            {
                if(idxOfTips==null) 
                {
                    idxOfTips = i
                }
                else
                {
                    idxOfTips = null
                    break 
                }                
            }
        }

        if(idxOfTips!=null)
        {
            var tipsIdxs = sortedTipsArray[idxOfTips]
            var selectedIdxs = clone(sortedSubCardDatas)
            var needSelectedCardDatas = clone(tipsIdxs)

            //检索tipsIdxs 如果检索到selectedIdxs中同时存在 则从两个数组同时remove 并继续
            for(var i=needSelectedCardDatas.length-1;i>=0;i--)
            {
                for(var j in selectedIdxs)
                {
                    if( selectedIdxs[j] == needSelectedCardDatas[i]) 
                    {
                        needSelectedCardDatas.splice(i, 1)
                        selectedIdxs.splice(j, 1)
                        break 
                    }
                }
            }

            for(var i=needSelectedCardDatas.length-1;i>=0;i--)
            {
                for(var j in selectedIdxs)
                {
                    if( cardLogic.getNum(selectedIdxs[j]) == cardLogic.getNum(needSelectedCardDatas[i]) )
                    {
                        needSelectedCardDatas.splice(i, 1)
                        selectedIdxs.splice(j, 1)
                        break 
                    }
                }
            }

            return needSelectedCardDatas
        }
        return []
    }

}


