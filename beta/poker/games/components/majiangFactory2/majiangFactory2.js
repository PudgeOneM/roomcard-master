
//两副牌
var majiangFactory2 = majiangFactory =  //direction 0down 1right 2up 3left
{   
    resp:'components/majiangFactory2/res/',


    ////////////可配置项 begin //////////
    outCardMode:1,
    isShowHeap:false,
    isPublicAnGang:true, //暗杠是否给其他人看到
    handCountOneRow:null,
    discardCountOneRow:9,
    discardCountOneLine:12,
    heapCountOneRow:24,//每行(列) 显示的牌堆数 这个数越大单个牌堆缩放比例越小,花牌缩放比例越大
    flowerCountOneRow:12,//每行(列) 显示的花牌数 这个数越大单个花牌缩放比例越小
    borderDistance_rightLeft:90,

    ////////////可配置项 end //////////
    

    cardData2ScoreMap:null,//score用于排序先后 比如财神要排在最左边 就要把财神score设置为最低(0) 通过initCardData2ScoreMap
    mjTableNode:null,//麻将容器 整个麻将的位置是按铺满这个节点适配的
    scale_upDown:null,//上下两家的麻将scale(包括手牌 丢弃牌 吃碰杠牌)
    scale_rightLeft:null,//左右两家麻将scale(包括手牌 丢弃牌 吃碰杠牌)
    scale_heap:null,//四个方向牌堆缩放比例
    scale_flower:null,//四个方向花牌缩放比例
    currentDiscardMjNode:null,//当前打出的牌
    chooseItemsNode:null,//用于操作 吃和杠会出现多种情况
    
    ////////////////////////////////////////////
    chooseItemMjScale:0.8,
    currentDiscardMjScale:1.1,
    distanceHandFromDownMin:10,

    //以下为四个方向的尺寸适配
    ////////////////// down //////////////////////
    down_handWidth:62,
    down_handHeight:93,
    down_handZiScale:0.95,
    down_handZiPosScale:{x:0.5, y:0.39},
    downMjAndNewMjInterval:30,//摸到的牌和手牌间距离
    downHandIntervalX:62,

    down_discardWidth:30,
    down_discardHeight:46,
    down_discardZiScale:0.43,
    down_discardZiPosScale:{x:0.5, y:0.65},
    downDiscardIntervalY:30,

    down_weaveWidth:49,
    down_weaveHeight:70,
    down_weaveZiScale:0.77,
    down_weaveZiPosScale:{x:0.5, y:0.6},
    downWeaveIntervalX:49,
    // downWeaveIntervalPerGroup:15,
    downWeaveGangOffset:15,

    down_heapWidth:25,
    down_heapHeight:38,
    down_heapZiScale:0.39,
    down_heapZiPosScale:{x:0.5, y:0.65},
    downHeapIntervalX:25,
    downHeapOffset:11,
    downHeapFromHandY:-5,
    downHeapFromHandX:5,

    down_flowerWidth:30,
    down_flowerHeight:46,
    down_flowerZiScale:0.43,
    down_flowerZiPosScale:{x:0.5, y:0.65},
    downFlowerIntervalY:30,
    /////////////////// up ////////////////////
    up_handWidth:30,
    up_handHeight:44,
    up_handZiScale:0.32,
    up_handZiPosScale:{x:0.5, y:0.5},
    upMjAndNewMjInterval:12,
    upHandIntervalX:30,

    up_discardWidth:30,
    up_discardHeight:46,
    up_discardZiScale:0.43,
    up_discardZiPosScale:{x:0.5, y:0.65},
    upDiscardIntervalY:30,

    up_weaveWidth:26,
    up_weaveHeight:40,
    up_weaveZiScale:0.40,
    up_weaveZiPosScale:{x:0.5, y:0.65},
    upWeaveIntervalX:26,
    // upWeaveIntervalPerGroup:10,
    upWeaveGangOffset:11.6,


    up_heapWidth:25,
    up_heapHeight:38,
    up_heapZiScale:0.39,
    up_heapZiPosScale:{x:0.5, y:0.65},
    upHeapIntervalX:25,
    upHeapOffset:11,
    upHeapFromHandY:-20,
    upHeapFromHandX:5,

    up_flowerWidth:30,
    up_flowerHeight:46,
    up_flowerZiScale:0.43,
    up_flowerZiPosScale:{x:0.5, y:0.65},
    upFlowerIntervalY:30,
    //////////////////// right ////////////////////
    right_handWidth:24,
    right_handHeight:60,
    right_handZiScale:0.7,
    right_handZiPosScale:{x:0.5, y:0.5},
    rightHandIntervalY:27,
    rightMjAndNewMjInterval:30,

    right_discardWidth:43,
    right_discardHeight:35,
    right_discardZiScale:0.41,
    right_discardZiPosScale:{x:0.5, y:0.68},
    rightDiscardIntervalY:22,

    right_weaveWidth:41,
    right_weaveHeight:33,
    right_weaveZiScale:0.38,
    right_weaveZiPosScale:{x:0.5, y:0.63},
    rightWeaveIntervalY:23,
    // rightWeaveIntervalPerGroup:15,
    rightWeaveGangOffset:5,

    right_heapWidth:35,
    right_heapHeight:28,
    right_heapZiScale:0.32,
    right_heapZiPosScale:{x:0.5, y:0.65},
    rightHeapIntervalY:20,
    rightHeapOffset:8,
    rightHeapFromHandX:5,
    rightHeapFromHandY:5,

    right_flowerWidth:43,
    right_flowerHeight:35,
    right_flowerZiScale:0.41,
    right_flowerZiPosScale:{x:0.5, y:0.68},
    rightFlowerIntervalY:22,
    //////////////////// left ////////////////////
    left_handWidth:24,
    left_handHeight:60,
    left_handZiScale:0.7,
    left_handZiPosScale:{x:0.5, y:0.5},
    leftHandIntervalY:27,
    leftMjAndNewMjInterval:30,

    left_discardWidth:43,
    left_discardHeight:35,
    left_discardZiScale:0.41,
    left_discardZiPosScale:{x:0.5, y:0.68},
    leftDiscardIntervalY:22,

    left_weaveWidth:41,
    left_weaveHeight:33,
    left_weaveZiScale:0.38,
    left_weaveZiPosScale:{x:0.5, y:0.65},
    leftWeaveIntervalY:23,
    // leftWeaveIntervalPerGroup:15,
    leftWeaveGangOffset:5,

    left_heapWidth:35,
    left_heapHeight:28,
    left_heapZiScale:0.32,
    left_heapZiPosScale:{x:0.5, y:0.65},
    leftHeapIntervalY:20,
    leftHeapOffset:8,
    leftHeapFromHandX:5,
    leftHeapFromHandY:5,

    left_flowerWidth:43,
    left_flowerHeight:35,
    left_flowerZiScale:0.41,
    left_flowerZiPosScale:{x:0.5, y:0.68},
    leftFlowerIntervalY:22,
    ////////////////////////////////////////////
    getPreLoadRes:function()
    {
        var resp = majiangFactory.resp

        return [
            resp + 'majiangFactory.plist', 
            resp + 'majiangFactory.png',
            resp + 'majiangs.plist', 
            resp + 'majiangs.png'
        ]
    },
    onPreLoadRes:function()
    {   
        var resp = majiangFactory.resp
        cc.spriteFrameCache.addSpriteFrames(resp + 'majiangFactory.plist', resp + 'majiangFactory.png')

        var resp = majiangFactory.resp
        cc.spriteFrameCache.addSpriteFrames(resp + 'majiangs.plist', resp + 'majiangs.png')
    },
    onReStart:function()
    {
        // cc.eventManager.removeCustomListeners('handMajiangTouched')
        // cc.eventManager.removeCustomListeners('handMajiangTouchEnd')
    },
    init:function(mjTableNode, decorateMjFun, handCountOneRow)
    {
        var maxHandCount = MAX_COUNT
        var maxHeapCount = typeof(HEAP_FULL_COUNT)=='undefined'?0:(HEAP_FULL_COUNT/2)

        majiangFactory.handCountOneRow = handCountOneRow || maxHandCount
        majiangFactory.mjTableNode = mjTableNode
        majiangFactory.decorateMj = decorateMjFun


        var handWidth_down = majiangFactory.handCountOneRow*majiangFactory.downHandIntervalX + majiangFactory.downMjAndNewMjInterval
        var handHeght_rightLeft = majiangFactory.handCountOneRow*majiangFactory.rightHandIntervalY + majiangFactory.rightMjAndNewMjInterval

        //var scale_upDown = (mjTableNode.width- majiangFactory.downMjAndNewMjInterval)/( majiangFactory.handCountOneRow*majiangFactory.down_handWidth) //吃碰杠会多一个
        var scale_upDown = mjTableNode.width/handWidth_down
        var heightBetweenUpDown = mjTableNode.height - scale_upDown*(majiangFactory.down_handHeight + majiangFactory.up_handHeight)
        var scaleYMin =heightBetweenUpDown/(handHeght_rightLeft + majiangFactory.distanceHandFromDownMin)
        var scale_rightLeft = Math.min(scale_upDown, scaleYMin)
        var scale_heap = heightBetweenUpDown/(majiangFactory.heapCountOneRow*majiangFactory.leftHeapIntervalY)

        majiangFactory.scale_upDown = scale_upDown
        majiangFactory.scale_rightLeft = scale_rightLeft
        majiangFactory.scale_heap = scale_heap 

        var flowerWidth_upDown = mjTableNode.width - 2*(majiangFactory.borderDistance_rightLeft
            + majiangFactory.left_handWidth*majiangFactory.scale_rightLeft 
            + majiangFactory.rightHeapFromHandX*majiangFactory.scale_upDown
            + majiangFactory.right_heapWidth*majiangFactory.scale_heap)
            - majiangFactory.down_heapWidth*majiangFactory.scale_heap*maxHeapCount
        var flowerHeight_rightLeft = heightBetweenUpDown
            - majiangFactory.downHeapFromHandY*majiangFactory.scale_rightLeft
            - (majiangFactory.down_heapHeight+majiangFactory.downHeapOffset)*majiangFactory.scale_heap
            - majiangFactory.upHeapFromHandY*majiangFactory.scale_rightLeft
            - (majiangFactory.up_heapHeight+majiangFactory.upHeapOffset)*majiangFactory.scale_heap

        var scale_flower = Math.min(flowerWidth_upDown/(majiangFactory.down_flowerWidth*majiangFactory.flowerCountOneRow), 
            flowerHeight_rightLeft/(majiangFactory.rightFlowerIntervalY*majiangFactory.flowerCountOneRow))

        majiangFactory.scale_flower = scale_flower 

        /////chooseItemsNode
        majiangFactory.chooseItemsNode = new cc.Node()
        majiangFactory.chooseItemsNode.x = majiangFactory.mjTableNode.width*0.5
        majiangFactory.chooseItemsNode.y = majiangFactory.scale_upDown*majiangFactory.down_handHeight + majiangFactory.scale_upDown*majiangFactory.chooseItemMjScale*majiangFactory.down_handHeight*0.5 + 30 

        majiangFactory.mjTableNode.addChild(majiangFactory.chooseItemsNode)

        /////currentDiscardMjNode
        var currentDiscardMjNode = new cc.Node()

        var bg = new cc.Scale9Sprite('mf_currentDiscardMjBg.png')
        bg.width = majiangFactory.scale_upDown*majiangFactory.down_handWidth*majiangFactory.currentDiscardMjScale + 10
        bg.height = majiangFactory.scale_upDown*majiangFactory.down_handHeight*majiangFactory.currentDiscardMjScale + 10 
        bg.x = 0
        bg.y = 0
        bg.anchorX = 0.5
        bg.anchorY = 0.5
        currentDiscardMjNode.addChild(bg)

        var mj = majiangFactory.getOne(1, 0, 0)
        mj.setCascadeOpacityEnabled(true)

        mj.setScale(majiangFactory.scale_upDown*majiangFactory.currentDiscardMjScale)
        currentDiscardMjNode.addChild(mj, 0, 101)

        currentDiscardMjNode.x = -1000
        currentDiscardMjNode.setVisible(false)
        majiangFactory.mjTableNode.addChild(currentDiscardMjNode)

        majiangFactory.currentDiscardMjNode = currentDiscardMjNode
    },
    ///这两个函数 下次整理代码时搬到logic里
    initCardData2ScoreMap:function( cardDatas, scores )
    {
        var map = []
        for(var i=1;i<101;i++)
        {
            map[i] = i
            if(!cardDatas)
                continue
            for(var j=0;j<cardDatas.length;j++)
            {
                if(cardDatas[j] == i)
                {
                    map[i] = scores[j]
                    cardDatas.splice(j, 1)
                    scores.splice(j, 1)
                    break
                }
            }
        }
        majiangFactory.cardData2ScoreMap = map
    },
    sortCardDatasWithScore:function(cardDatas)
    {
        cardDatas.sort(function(a,b)
        {   
            return majiangFactory.cardData2ScoreMap[a] - majiangFactory.cardData2ScoreMap[b]
        })

        return cardDatas
    },
    //根据where direction 获得麻将精灵 isIgnoreDecorate是否忽略装饰函数（例如财神图片是在这个组件外部处理的 如果不需要显示设置为忽略）
    getOne:function(cardData, where, direction, isIgnoreHandMajiangTouchEvent, isIgnoreDecorate)
    {	
        
        // var tt = 
        // [
        //     'hand',
        //     'discard',
        //     'weave',
        //     'heap',
        //     'flower'
        // ]

        // var t = 
        // [
        //     'down_',
        //     'right_',
        //     'up_',
        //     'left_'
        // ]

        // var prefix = t[direction] + tt[where]

        // var frameName = prefix + (cardData==0?0:'Bg') + '.png'
        // var spr = new cc.Sprite("#" + frameName)
        // spr.direction = direction
        // spr.where = where
        // spr.cardData = cardData
        var styleId = styleArray[0]

        var tt = ['hand','discard','weave','heap','flower','paper']
        var t = ['down_','right_','up_','left_']

        //录像用weave
        if ( isRecordScene && where == 0 )
            where = 2

        var prefix = t[direction] + tt[where]

        var frameName = 'style' + styleId + '_' + prefix + (cardData==0?0:'Bg') + '.png'
        var spr = new cc.Sprite("#" + frameName)
        spr.direction = direction
        spr.where = where
        spr.cardData = cardData
        //皮肤选择
        var l = cc.EventListener.create({
        event: cc.EventListener.CUSTOM,
        eventName: "styleChange",
        callback: function(event)
        {   
            // var styleArray = event.getUserData()//0麻将 1背景 后面有别的依次往后加
            var styleId = styleArray[0]
            
            var tt = ['hand','discard','weave','heap','flower','paper']
            var t =  ['down_','right_','up_','left_']
            var prefix = t[spr.direction] + tt[spr.where]
            var cardData = spr.cardData
            var frameName = 'style' + styleId + '_' + prefix + (cardData==0?0:'Bg') + '.png'
            spr.setSpriteFrame(frameName)

            spr.color = spr.color
        }
        })
        cc.eventManager.addListener(l, 1)   

        if(where == 3)
            var scale = majiangFactory.scale_heap
        else if(where == 4)
            var scale = majiangFactory.scale_flower
        else
            var scale = direction%2==0?majiangFactory.scale_upDown:majiangFactory.scale_rightLeft
        spr.setScale(scale)
        
        if(cardData!=0)
        {
            var scale = majiangFactory[prefix + 'ZiScale']
            var posScale = majiangFactory[prefix + 'ZiPosScale']

            var zi = new cc.Sprite("#mf_" + cardData + '.png')
            zi.x = majiangFactory[prefix + 'Width'] * posScale.x 
            zi.y = majiangFactory[prefix + 'Height'] * posScale.y
            zi.scale = scale 

            switch(direction)
            {
                case 0:
                {
                    break
                }
                case 1: 
                {
                    zi.setRotation(-90)
                    break
                }
                case 2:
                {
                    break
                }
                case 3: 
                {
                    zi.setRotation(90)
                    break
                }
            }
            spr.addChild(zi, 0, 101)
        }

        if(where!=0 && !isIgnoreHandMajiangTouchEvent )
        {
            var l = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "handMajiangTouched",
            callback: function(event)
            {   
                var cardData = event.getUserData()
                
                if(spr.cardData == cardData)
                    spr.color = cc.color(188, 255, 188)
                else
                    spr.color = cc.color(255, 255, 255)

                majiangFactory.currentDiscardMjNode.setVisible(false)
            }
            })
            cc.eventManager.addListener(l, 1)

            var l = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "handMajiangTouchEnd",
            callback: function(event)
            {   
                spr.color = cc.color(255, 255, 255)
                majiangFactory.currentDiscardMjNode.setVisible(true)
            }
            })
            cc.eventManager.addListener(l, 1)

        }

        if(!isIgnoreDecorate && majiangFactory.decorateMj)
            majiangFactory.decorateMj(spr)
        
        return spr
    },
    ///////handMajiangs start//////
    //handCardDatasArray:
    //[
    //[[1,2,3,4], 1], 
    //[[1,2,2,2,22,], 2], 
    //[[], null], 
    //[[], null]
    //]
    //cardDatas数组->spr数组
    getHandMajiangsArray:function(handCardDatasArray, isLookon)
    {
        var handMajiangs4D = []
        for(showChairid=0;showChairid<SERVER_CHAIR;showChairid++)//direction 0down 1right 2up 3left
        {
            var direction = showChairid
            var oldHandCardDatas = handCardDatasArray[direction][0]
            var oldHandMjs = []
            for(var j=0;j<oldHandCardDatas.length;j++)
            {
                var cardData = isLookon?0:oldHandCardDatas[j]
                var majiang = majiangFactory.getOne(cardData, 0, direction)
                majiang.idxInHandMajiangs = j
                var pos = majiangFactory.getHandMajiangPosAndTag(oldHandCardDatas.length, majiang.idxInHandMajiangs, direction, false)
                majiang.x = pos.x
                majiang.y = pos.y
                majiang.setLocalZOrder(pos.zOrder)
                if ( isRecordScene )
                    majiang.scale = pos.scale
        //         if(direction==1)
        // console.log(222222,pos)
                oldHandMjs[j] = majiang
            }

            var newGetMj = null
            var newGetCardData = handCardDatasArray[direction][1]
            if(typeof(newGetCardData) == 'number')          
            {
                newGetCardData = isLookon?0:newGetCardData
                newGetMj = majiangFactory.getOne(newGetCardData, 0, direction)
                var pos = majiangFactory.getHandMajiangPosAndTag(oldHandCardDatas.length, null, direction, true)
                newGetMj.x = pos.x
                newGetMj.y = pos.y
                newGetMj.setLocalZOrder(pos.zOrder)
                newGetMj.idxInHandMajiangs = null
                if ( isRecordScene )
                    newGetMj.scale = pos.scale
            }  
            handMajiangs4D[direction] = [oldHandMjs, newGetMj]
        }

        return handMajiangs4D
    },
    getHandMajiangPosAndTag:function(length, idxInCardDatas, direction, isNewGetMj)
    {
        if ( isRecordScene )
            return majiangFactory.getDisplayHandMajiangPosAndTagAndTag(length, idxInCardDatas, direction, isNewGetMj)

        var pos = {}
        switch(direction) //越大的牌靠newMj越近
        {
            case 0://down
            {   
                if(isNewGetMj)
                    pos.x = ( length+0.5 )*majiangFactory.scale_upDown*majiangFactory.downHandIntervalX + majiangFactory.downMjAndNewMjInterval*majiangFactory.scale_upDown
                else
                    pos.x = ( idxInCardDatas+0.5 )*majiangFactory.scale_upDown*majiangFactory.downHandIntervalX
                pos.y = majiangFactory.scale_upDown*majiangFactory.down_handHeight*0.5 

                pos.zOrder = 0
                break
            }
            case 1://right
            {
                pos.x = majiangFactory.scale_rightLeft*majiangFactory.right_handWidth*0.5
                if(isNewGetMj)
                {
                    pos.y = ( length+0.5 )*majiangFactory.scale_rightLeft*majiangFactory.rightHandIntervalY + majiangFactory.rightMjAndNewMjInterval*majiangFactory.scale_rightLeft
                    pos.zOrder = 0
                }
                else
                {
                    pos.y = ( idxInCardDatas+0.5 )*majiangFactory.scale_rightLeft*majiangFactory.rightHandIntervalY
                    pos.zOrder = length-idxInCardDatas
                }
                break
            }
            case 2://up
            {
                if(isNewGetMj)
                    pos.x = ( 0.5 )*majiangFactory.scale_upDown*majiangFactory.upHandIntervalX
                else
                    pos.x = ( length-1-idxInCardDatas+0.5+1 )*majiangFactory.scale_upDown*majiangFactory.upHandIntervalX + majiangFactory.upMjAndNewMjInterval*majiangFactory.scale_upDown
                pos.y = majiangFactory.scale_upDown*majiangFactory.up_handHeight*0.5
                
                pos.zOrder = 0
                break
            }
            case 3://left
            {
                pos.x = majiangFactory.scale_rightLeft*majiangFactory.left_handWidth*0.5
                if(isNewGetMj)
                {
                    pos.y = ( 0.5 )*majiangFactory.scale_rightLeft*majiangFactory.leftHandIntervalY //- majiangFactory.leftMjAndNewMjInterval*majiangFactory.scale_rightLeft
                    pos.zOrder = -1
                }
                else
                {
                    pos.y = ( length-idxInCardDatas+0.5 )*majiangFactory.scale_rightLeft*majiangFactory.leftHandIntervalY + majiangFactory.leftMjAndNewMjInterval*majiangFactory.scale_rightLeft
                    pos.zOrder = idxInCardDatas
                }
                
                break
            }
        }

        return pos
    },
    getDisplayHandMajiangPosAndTagAndTag:function(length, idxInCardDatas, direction, isNewGetMj)
    {
        var pos = {}
        switch(direction) //越大的牌靠newMj越近
        {
            case 0://down
            {   
                pos.scale = majiangFactory.scale_upDown*majiangFactory.downHandIntervalX/majiangFactory.downWeaveIntervalX

                if(isNewGetMj)
                    pos.x = ( length+0.5 )*pos.scale*majiangFactory.downWeaveIntervalX + majiangFactory.downMjAndNewMjInterval*majiangFactory.scale_upDown
                else
                    pos.x = ( idxInCardDatas+0.5 )*pos.scale*majiangFactory.downWeaveIntervalX
                pos.y = pos.scale*majiangFactory.down_weaveHeight*0.5 
                pos.zOrder = 0
                break
            }
            case 1://right
            {
                pos.scale = majiangFactory.scale_rightLeft*majiangFactory.rightHandIntervalY/majiangFactory.rightWeaveIntervalY

                pos.x = 1.2*(majiangFactory.right_weaveWidth - majiangFactory.right_handWidth)*majiangFactory.scale_rightLeft
                if(isNewGetMj)
                {
                    pos.y = ( length+0.5 )*pos.scale*majiangFactory.rightWeaveIntervalY + majiangFactory.rightMjAndNewMjInterval*majiangFactory.scale_rightLeft
                    pos.zOrder = 0
                }
                else
                {
                    pos.y = ( idxInCardDatas+0.5 )*pos.scale*majiangFactory.rightWeaveIntervalY
                    pos.zOrder = length-idxInCardDatas
                }
                break
            }
            case 2://up
            {
                pos.scale = majiangFactory.scale_upDown*majiangFactory.upHandIntervalX/majiangFactory.upWeaveIntervalX
                if(isNewGetMj)
                    pos.x = ( 0.5 )*pos.scale*majiangFactory.upWeaveIntervalX
                else
                    pos.x = ( length-1-idxInCardDatas+0.5+1 )*pos.scale*majiangFactory.upWeaveIntervalX + majiangFactory.upMjAndNewMjInterval*majiangFactory.scale_upDown
                pos.y = pos.scale*majiangFactory.up_weaveHeight*0.5
                pos.zOrder = 0
                break
            }
            case 3://left
            {
                pos.scale = majiangFactory.scale_rightLeft*majiangFactory.leftHandIntervalY/majiangFactory.leftWeaveIntervalY

                pos.x = -1.2*(majiangFactory.left_weaveWidth - majiangFactory.left_handWidth)*majiangFactory.scale_rightLeft + 0.5*pos.scale*majiangFactory.left_weaveWidth
                if(isNewGetMj)
                {
                    pos.y = ( length+0.5 )*pos.scale*majiangFactory.leftWeaveIntervalY + majiangFactory.leftMjAndNewMjInterval*majiangFactory.scale_rightLeft
                    //pos.zOrder = -1
                    pos.zOrder = 0
                }
                else
                {
                    pos.y = ( idxInCardDatas+0.5 )*pos.scale*majiangFactory.leftWeaveIntervalY
                    // pos.zOrder = idxInCardDatas
                    pos.zOrder = length-idxInCardDatas
                }
                break
            }
        }

        return pos
    },
    //游戏结束时展示手牌 
    getDisplayHandMajiangsArray:function(displayHandCardDatasArray)
    {
        var handMajiangs4D = []
        for(showChairid=0;showChairid<SERVER_CHAIR;showChairid++)//direction 0down 1right 2up 3left
        {
            var direction = showChairid
            var oldHandCardDatas = displayHandCardDatasArray[direction][0]
            var oldHandMjs = []
            for(var j=0;j<oldHandCardDatas.length;j++)
            {
                var cardData = oldHandCardDatas[j]
                var majiang = majiangFactory.getOne(cardData, 2, direction)
                majiang.idxInHandMajiangs = j
                var pos = majiangFactory.getDisplayHandMajiangPosAndTagAndTag(oldHandCardDatas.length, majiang.idxInHandMajiangs, direction, false)
                majiang.x = pos.x
                majiang.y = pos.y
                majiang.setScale(pos.scale)
                majiang.setLocalZOrder(pos.zOrder)
                oldHandMjs[j] = majiang
            }

            var newGetMj = null
            var newGetCardData = displayHandCardDatasArray[direction][1]
            if(typeof(newGetCardData) == 'number')          
            {
                newGetMj = majiangFactory.getOne(newGetCardData, 2, direction)
                var pos = majiangFactory.getDisplayHandMajiangPosAndTagAndTag(oldHandCardDatas.length, null, direction, true)
                newGetMj.x = pos.x
                newGetMj.y = pos.y
                newGetMj.setScale(pos.scale)
                majiang.setLocalZOrder(pos.zOrder)
                newGetMj.idxInHandMajiangs = null
            }  
            handMajiangs4D[direction] = [oldHandMjs, newGetMj]
        }

        return handMajiangs4D
    },
    //‘增删减查’
    deleteHandMajiangsOld:function(handMajiangs, direction, majiang)
    {
        var majiangs = handMajiangs[0]
        if(majiangs.length==0)
            return 
        var deleteIdx = majiang?majiang.idxInHandMajiangs:majiangs.length-1

        var majiang = majiangs[deleteIdx]
        var parent = majiang.getParent()

        majiang.removeFromParent()
        majiangs.splice(deleteIdx, 1)

        for(var i=0;i<majiangs.length;i++)
        {
            var mj = majiangs[i]
            mj.idxInHandMajiangs = i
            var pos = majiangFactory.getHandMajiangPosAndTag(majiangs.length, mj.idxInHandMajiangs, direction, false)
            mj.x = pos.x
            mj.y = pos.y
            if ( isRecordScene )
                mj.scale = pos.scale

            mj.setLocalZOrder(pos.zOrder)
        }

        //GroupNodeSize变化后 所有麻将位置都要变 
        var newGetMj = handMajiangs[1]
        if(newGetMj)
        {
            var pos = majiangFactory.getHandMajiangPosAndTag(majiangs.length, null, direction, true)
            newGetMj.x = pos.x
            newGetMj.y = pos.y  
            newGetMj.setLocalZOrder(pos.zOrder)
            newGetMj.idxInHandMajiangs = null
            if ( isRecordScene )
                newGetMj.scale = pos.scale
        }

        var size = majiangFactory._getHandGroupNodeSize(direction, majiangs.length)
        parent.width = size.width
        parent.height = size.height
    },
    deleteHandMajiangNew:function(handMajiangs)
    {
        var majiang = handMajiangs[1]
        majiang.removeFromParent()
        handMajiangs[1] = null
    },
    deleteHandMajiangs:function(handMajiangs, direction, cardData)
    {
        if(handMajiangs[1] && handMajiangs[1].cardData == cardData)
            majiangFactory.deleteHandMajiangNew(handMajiangs)
        else
        {
            var majiangs = handMajiangs[0]
            for(var i=0;i<majiangs.length;i++)
            {
                var majiang = majiangs[i]
                if(majiang.cardData == cardData)
                {
                    majiangFactory.deleteHandMajiangsOld(handMajiangs, direction, majiang)
                    break
                }
            }
        }
    },
    moveHandMajiangNew2Old:function(handMajiangs, direction, parent)
    {
        if(handMajiangs[1])
        {
            majiangFactory.insertHandMajiangsOld(handMajiangs, direction, handMajiangs[1].cardData, parent)
            majiangFactory.deleteHandMajiangs(handMajiangs, direction, handMajiangs[1].cardData)
        }
    },
    addHandMajiang:function(handMajiangs, direction, cardData, parent, weaveCount)
    {
        var handMajiangsLen = 0
        handMajiangsLen += handMajiangs[0].length
        handMajiangsLen += handMajiangs[1]?1:0
        if(handMajiangsLen + weaveCount*3 == MAX_COUNT-1)
            majiangFactory.addHandMajiangNew(handMajiangs, direction, cardData, parent)
        else
            majiangFactory.insertHandMajiangsOld(handMajiangs, direction, cardData, parent)
    },
    addHandMajiangNew:function(handMajiangs, direction, cardData, parent)
    {
        majiangFactory.moveHandMajiangNew2Old(handMajiangs, direction, parent)
        var oldMajiangs = handMajiangs[0]
        var majiang = majiangFactory.getOne(cardData, 0, direction)
        var pos = majiangFactory.getHandMajiangPosAndTag(oldMajiangs.length, null, direction, true)
        majiang.x = pos.x
        majiang.y = pos.y
        majiang.setLocalZOrder(pos.zOrder)
        majiang.idxInHandMajiangs = null
        parent.addChild(majiang)
        if ( isRecordScene )
            majiang.scale = pos.scale

        handMajiangs[1] = majiang
    },
    insertHandMajiangsOld:function(handMajiangs, direction, cardData, parent)
    {
        var majiangs = handMajiangs[0]
        var majiang = majiangFactory.getOne(cardData, 0, direction)
        parent.addChild(majiang)

        var insertMjIdx = majiangs.length
        for(var i=0;i<majiangs.length;i++)
        {
            var mj = majiangs[i]
            if(majiangFactory.cardData2ScoreMap[cardData]<majiangFactory.cardData2ScoreMap[mj.cardData])
            {
                insertMjIdx = i
                break
            }
        }
        var newLength = majiangs.length + 1
        for(var i=newLength-1;i>=0;i--)
        {
            var mj
            if(i>insertMjIdx)
                mj = majiangs[i-1]
            else if(i<insertMjIdx)
                mj = majiangs[i]
            else
                mj = majiang

            mj.idxInHandMajiangs = i
            var pos = majiangFactory.getHandMajiangPosAndTag(newLength, mj.idxInHandMajiangs, direction, false)
            mj.x = pos.x
            mj.y = pos.y
            mj.setLocalZOrder(pos.zOrder)
            majiangs[i] = mj
            if ( isRecordScene )
                mj.scale = pos.scale
        }

        //GroupNodeSize变化后 所有麻将位置都要变 
        var newGetMj = handMajiangs[1]
        if(newGetMj)
        {
            var pos = majiangFactory.getHandMajiangPosAndTag(majiangs.length, null, direction, true)
            newGetMj.x = pos.x
            newGetMj.y = pos.y  
            newGetMj.setLocalZOrder(pos.zOrder)
            newGetMj.idxInHandMajiangs = null
            if ( isRecordScene )
                newGetMj.scale = pos.scale
        }

        var size = majiangFactory._getHandGroupNodeSize(direction, majiangs.length)
        parent.width = size.width
        parent.height = size.height
    },  
    //手牌是要处理触摸监听的 GroupNodes是hand麻将的父节点 用于同意处理触摸
    getHandGroupNodes:function(handMajiangs4D, outCardCalls)
    {
        var handGroupNodes = []
        for(showChairid=0;showChairid<SERVER_CHAIR;showChairid++)//direction 0down 1right 2up 3left
        {
            var direction = showChairid
            var majiangs = handMajiangs4D[direction]

            //////
            var node = new cc.Node()
            node.ignoreAnchorPointForPosition(false)
            switch(direction) //越大的牌靠newMj越近
            {
                case 0://down
                {
                    node.setAnchorPoint( cc.p(1, 0.5) )
                    break
                }
                case 1://right
                {
                    node.setAnchorPoint( cc.p(0.5, 1) )
                    break
                }
                case 2://up
                {
                    node.setAnchorPoint( cc.p(0, 0.5) )
                    break
                }
                case 3://left
                {
                    node.setAnchorPoint( cc.p(0.5, 0) )
                    break
                }
            }

            var oldHandMjs = majiangs[0]
            var newGetMj = majiangs[1] 

            var size = majiangFactory._getHandGroupNodeSize(direction, oldHandMjs.length)
            node.width = size.width
            node.height = size.height

            for(var j=0;j<oldHandMjs.length;j++)
            {
                var mj = oldHandMjs[j]
                // var tag = direction==1?oldHandMjs.length-j:j
                node.addChild(mj)//, tag)
            }

            if(newGetMj)
            {
                // var tag = direction==3?100:0
                node.addChild(newGetMj)//, tag)
            }
            //////////touch
            var outCardCall = outCardCalls[direction]
            if(outCardCall) 
            {
                var listener = majiangFactory._gethandGroupNodeListener(majiangs, node, direction, outCardCall)
                cc.eventManager.addListener(listener, node)
            }

            handGroupNodes[direction] = node
        }

        return handGroupNodes
    },
    _getHandGroupNodeSize:function(direction, oldHandMjCount)
    {
        var size = {}
        switch(direction) //越大的牌靠newMj越近
        {
            case 0://down
            {
                size.width =  majiangFactory.downHandIntervalX*majiangFactory.scale_upDown*(oldHandMjCount+1) + majiangFactory.downMjAndNewMjInterval*majiangFactory.scale_upDown 
                size.height = majiangFactory.down_handHeight*majiangFactory.scale_upDown
                break
            }
            case 1://right
            {
                size.width = majiangFactory.right_handWidth*majiangFactory.scale_rightLeft
                size.height = majiangFactory.rightHandIntervalY*majiangFactory.scale_rightLeft*(oldHandMjCount+1) + majiangFactory.rightMjAndNewMjInterval*majiangFactory.scale_rightLeft
                break
            }
            case 2://up
            {
                var w = majiangFactory.upMjAndNewMjInterval*majiangFactory.scale_upDown//*majiangFactory.down_handWidth/majiangFactory.up_handWidth
                size.width = majiangFactory.upHandIntervalX*majiangFactory.scale_upDown*(oldHandMjCount+1) + w
                size.height = majiangFactory.up_handHeight*majiangFactory.scale_upDown
                break
            }
            case 3://left
            {
                size.width = majiangFactory.left_handWidth*majiangFactory.scale_rightLeft
                size.height = majiangFactory.leftHandIntervalY*majiangFactory.scale_rightLeft*(oldHandMjCount+1) + majiangFactory.leftMjAndNewMjInterval*majiangFactory.scale_rightLeft
                break
            }
        }
        return size
    },
    _gethandGroupNodeListener:function(majiangs, handGroupNode, direction, outCardCall)
    {
        if(direction!=0)//only0 123todo
            return 

        var currentMajiangTipsNode = new cc.Node()
        var bg = new cc.Sprite('#mf_currentMjBg.png')
        bg.setScale(majiangFactory.scale_upDown)
        currentMajiangTipsNode.addChild(bg)

        var mj = majiangFactory.getOne(1, 0, 0, true, true)
        mj.setScale(majiangFactory.scale_upDown * 1)
        currentMajiangTipsNode.addChild(mj)

        currentMajiangTipsNode.x = - 1000
        currentMajiangTipsNode.y = handGroupNode.height + bg.height*0.5 + 40

        handGroupNode.addChild(currentMajiangTipsNode)

        var mjWidth = majiangFactory.downHandIntervalX*majiangFactory.scale_upDown
        var mjHeight = majiangFactory.down_handHeight*majiangFactory.scale_upDown
        var touchPosX2TouchedMj = function(posX)
        {      
            if(posX>mjWidth*majiangs[0].length)
                return majiangs[1]
            else
            {
                var idx = Math.floor( posX/mjWidth )
                return majiangs[0][idx]
            }
        }

        var lastPlayTime = null
        var playSelectEffect = function()
        {
            var nowTime = new Date().getTime()

            if(!lastPlayTime || (nowTime - lastPlayTime) > 100)
            {
                lastPlayTime = nowTime
                managerAudio.playEffect(majiangFactory.resp + 'selectcard.mp3')
            }
        }

        switch(majiangFactory.outCardMode)
        {
            case 1:
            {
                var currentMajiang = null
                var touchedMjNum = 0
                var soundId = null
                var onTouch = function(locationX)
                {   
                    var touchedMj = touchPosX2TouchedMj(locationX)
                    if(!touchedMj)
                        return 
                    
                    if(currentMajiang)
                        currentMajiang.y = mjHeight*0.5
                
                    if(!currentMajiang || currentMajiang!=touchedMj) 
                    {
                        touchedMjNum++
                        if(touchedMjNum>1)
                            playSelectEffect()
                        // managerAudio.stopEffect(soundId)
                        //soundId = managerAudio.playEffect(majiangFactory.resp + 'selectcard.mp3')
                    }

                    currentMajiang = touchedMj

                    currentMajiangTipsNode.x = currentMajiang.x
                    mj.getChildByTag(101).setSpriteFrame('mf_' + currentMajiang.cardData + '.png') 

                    currentMajiang.y = mjHeight*0.5 + 10
                       
                    // majiangFactory.currentDiscardMjNode.setVisible(false)
                    var event = new cc.EventCustom("handMajiangTouched")
                    event.setUserData(currentMajiang.cardData)
                    cc.eventManager.dispatchEvent(event)            
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
                            onTouch(locationInNode.x<0?0:locationInNode.x)
                            return true
                        }
                        return false
                    },
                    onTouchMoved: function (touch, event) {
                        var target = event.getCurrentTarget()
                        var locationInNode = target.convertToNodeSpace(touch.getLocation())
                        var s = target.getContentSize();
                        var rect = cc.rect(0, 0, s.width, s.height)
                        if (cc.rectContainsPoint(rect, locationInNode)) {
                            onTouch(locationInNode.x<0?0:locationInNode.x)
                        }
                    },
                    onTouchEnded: function (touch, event) {
                        var target = event.getCurrentTarget()

                        var locationInNode = target.convertToNodeSpace(touch.getLocation())
                        var s = target.getContentSize();
                        var rect = cc.rect(0, 0, s.width, s.height)
                        if (cc.rectContainsPoint(rect, locationInNode)) {
                            if(currentMajiang && touchedMjNum == 1)
                                outCardCall?outCardCall(currentMajiang):''
                        }    

                        if(currentMajiang)
                        {
                            currentMajiang.y = mjHeight*0.5
                            currentMajiang = null
                        }
                        currentMajiangTipsNode.x = -1000

                        // majiangFactory.currentDiscardMjNode.setVisible(true)
                        var event = new cc.EventCustom("handMajiangTouchEnd")
                        cc.eventManager.dispatchEvent(event)

                        touchedMjNum = 0
                    }
                })
                break
            }
            case 2:
            {        
                var currentMajiang = null
                var currentPopMajiang = null
                var touchedMjNum = 0
                var isTouchFromPop = false
                var soundId = null
                var onTouch = function(locationX)
                {   
                    var touchedMj = touchPosX2TouchedMj(locationX)
                    if(!touchedMj)
                        return 
                    
                    if(currentMajiang)
                        currentMajiang.y = mjHeight*0.5
                
                    if(!currentMajiang || currentMajiang!=touchedMj)//刚开始触摸麻将 或者摸到新的麻将 
                    {
                        touchedMjNum++
                        if(touchedMjNum>1)
                            playSelectEffect()
                    }

                    currentMajiang = touchedMj

                    currentMajiangTipsNode.x = currentMajiang.x
                    mj.getChildByTag(101).setSpriteFrame('mf_' + currentMajiang.cardData + '.png') 

                    currentMajiang.y = mjHeight*0.5 + 20
                       
                    // majiangFactory.currentDiscardMjNode.setVisible(false)
                    var event = new cc.EventCustom("handMajiangTouched")
                    event.setUserData(currentMajiang.cardData)
                    cc.eventManager.dispatchEvent(event)            
                }

                var listener = cc.EventListener.create({
                    event: cc.EventListener.TOUCH_ONE_BY_ONE,
                    swallowTouches: true,
                    onTouchBegan: function (touch, event) {
                        var target = event.getCurrentTarget()

                        var locationInNode = target.convertToNodeSpace(touch.getLocation())
                        var locationX = locationInNode.x<0?0:locationInNode.x
          
                        if(currentPopMajiang)
                        {
                            var touchedMj = touchPosX2TouchedMj(locationX)
                            isTouchFromPop = currentPopMajiang == touchedMj
                            currentPopMajiang.y = mjHeight*0.5
                        }
                        var s = target.getContentSize();
                        var rect = cc.rect(0, 0, s.width, s.height)
                        if (cc.rectContainsPoint(rect, locationInNode)) {
                            onTouch(locationX)
                            return true
                        }
                        return false
                    },
                    onTouchMoved: function (touch, event) {
                        var target = event.getCurrentTarget()
                        var locationInNode = target.convertToNodeSpace(touch.getLocation())
                        var s = target.getContentSize();
                        var rect = cc.rect(0, 0, s.width, s.height)
                        if (cc.rectContainsPoint(rect, locationInNode)) {
                            onTouch(locationInNode.x<0?0:locationInNode.x)
                        }
                    },
                    onTouchEnded: function (touch, event) {
                        var target = event.getCurrentTarget()

                        // var locationInNode = target.convertToNodeSpace(touch.getLocation())
                        // var s = target.getContentSize();
                        // var rect = cc.rect(0, 0, s.width, s.height)
                        // if (cc.rectContainsPoint(rect, locationInNode)) {
                        //     if(currentMajiang && touchedMjNum == 1)
                        //         outCardCall?outCardCall(currentMajiang):''
                        // }

                        // if(currentMajiang)
                        // {
                            if(isTouchFromPop && touchedMjNum==1)
                            {
                                outCardCall?outCardCall(currentPopMajiang):''
                                currentPopMajiang = null
                                isTouchFromPop = false
                                currentMajiang.y = mjHeight*0.5
                            }
                            else
                                currentPopMajiang = currentMajiang
                        //}

                        // if(currentMajiang)
                        //     currentMajiang.y = mjHeight*0.5

                        // majiangFactory.currentDiscardMjNode.setVisible(true)
                        var event = new cc.EventCustom("handMajiangTouchEnd")
                        cc.eventManager.dispatchEvent(event)

                        currentMajiangTipsNode.x = -1000
                        currentMajiang = null
                        touchedMjNum = 0
                        isTouchFromPop = false
                    }
                })
                break
            }
            case 3:
            {
                var currentMajiang = null
                var currentPopMajiang = null
                var touchedMjNum = 0
                var isTouchFromPop = false
                var soundId = null
                var onTouch = function(locationX)
                {   
                    var touchedMj = touchPosX2TouchedMj(locationX)
                    if(!touchedMj)
                        return 
                    
                    if(currentMajiang)
                        currentMajiang.y = mjHeight*0.5
                
                    if(!currentMajiang || currentMajiang!=touchedMj)//刚开始触摸麻将 或者摸到新的麻将 
                    {
                        touchedMjNum++
                        if(touchedMjNum>1)
                            playSelectEffect()
                    }

                    currentMajiang = touchedMj

                    currentMajiangTipsNode.x = currentMajiang.x
                    currentMajiangTipsNode.y = handGroupNode.height + bg.height*0.5 + 40
                    mj.getChildByTag(101).setSpriteFrame('mf_' + currentMajiang.cardData + '.png') 

                    currentMajiang.y = mjHeight*0.5 + 20
                       
                    // majiangFactory.currentDiscardMjNode.setVisible(false)
                    var event = new cc.EventCustom("handMajiangTouched")
                    event.setUserData(currentMajiang.cardData)
                    cc.eventManager.dispatchEvent(event)            
                }

                var listener = cc.EventListener.create({
                    event: cc.EventListener.TOUCH_ONE_BY_ONE,
                    swallowTouches: true,
                    onTouchBegan: function (touch, event) {
                        var target = event.getCurrentTarget()

                        var locationInNode = target.convertToNodeSpace(touch.getLocation())
                        var locationX = locationInNode.x<0?0:locationInNode.x
          
                        if(currentPopMajiang)
                        {
                            var touchedMj = touchPosX2TouchedMj(locationX)
                            isTouchFromPop = currentPopMajiang == touchedMj
                            currentPopMajiang.y = mjHeight*0.5
                        }
                        var s = target.getContentSize();
                        var rect = cc.rect(0, 0, s.width, s.height)
                        if (cc.rectContainsPoint(rect, locationInNode)) {
                            onTouch(locationX)
                            return true
                        }
                        return false
                    },
                    onTouchMoved: function (touch, event) {
                        var target = event.getCurrentTarget()
                        var locationInNode = target.convertToNodeSpace(touch.getLocation())
                        if(isTouchFromPop)
                        {
                            currentMajiangTipsNode.x = locationInNode.x
                            currentMajiangTipsNode.y = locationInNode.y
                        }
                        else
                        {

                            var s = target.getContentSize();
                            var rect = cc.rect(0, 0, s.width, s.height)
                            if (cc.rectContainsPoint(rect, locationInNode)) {
                                onTouch(locationInNode.x<0?0:locationInNode.x)
                            }
                        }
                    },
                    onTouchEnded: function (touch, event) {
                        var target = event.getCurrentTarget()

                        // var locationInNode = target.convertToNodeSpace(touch.getLocation())
                        // var s = target.getContentSize();
                        // var rect = cc.rect(0, 0, s.width, s.height)
                        // if (cc.rectContainsPoint(rect, locationInNode)) {
                        //     if(currentMajiang && touchedMjNum == 1)
                        //         outCardCall?outCardCall(currentMajiang):''
                        // }

                        // if(currentMajiang)
                        // {
                            if(isTouchFromPop && touchedMjNum==1)
                            {
                                outCardCall?outCardCall(currentPopMajiang):''
                                currentPopMajiang = null
                                isTouchFromPop = false
                                currentMajiang.y = mjHeight*0.5
                            }
                            else
                                currentPopMajiang = currentMajiang
                        // }

                        // if(currentMajiang)
                        //     currentMajiang.y = mjHeight*0.5

                        // majiangFactory.currentDiscardMjNode.setVisible(true)
                        var event = new cc.EventCustom("handMajiangTouchEnd")
                        cc.eventManager.dispatchEvent(event)

                        currentMajiangTipsNode.x = -1000
                        currentMajiang = null
                        touchedMjNum = 0
                        isTouchFromPop = false
                    }
                })
                break
            }
        }

        return listener
    },
    ///////handMajiangs end//////
    
    ///////discardMajiangs start//////
    //discardCardDatasArray:
    // [
    //  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,],
    //  [],
    //  [4,5,6,7],
    //  [] 
    // ] cardDatas数组->spr数组
    getDiscardMajiangsArray:function(discardCardDatasArray)
    {
        var discardMajiangs4D = []
        for(showChairid=0;showChairid<SERVER_CHAIR;showChairid++)//direction 0down 1right 2up 3left
        {
            var direction = showChairid
            var discardCount = direction%2==0?majiangFactory.discardCountOneRow:majiangFactory.discardCountOneLine

            var cardDatas = discardCardDatasArray[direction]
            if(!cardDatas)
            {
                discardMajiangs4D[direction] = []
                continue
            }

            var majiangsOneDirection = []
            for(var j=0;j<cardDatas.length;j++)
            {
                var cardData = cardDatas[j]
                var majiang = majiangFactory.getOne(cardData, 1, direction)
                
                var row = j%discardCount
                var line = Math.floor(j/discardCount) 
                var pos = majiangFactory.getDiscardMajiangPosAndTag(row, line, direction)
                majiang.x = pos.x
                majiang.y = pos.y
                majiang.setLocalZOrder(pos.zOrder)
                majiangsOneDirection[j] = majiang
            }
            discardMajiangs4D[direction] = majiangsOneDirection
        }

        return discardMajiangs4D
    },
    getDiscardMajiangPosAndTag:function(row, line, direction)
    {
        var pos = {}
        switch(direction)
        {
            case 0://down
            {
                pos.x = row*majiangFactory.down_discardWidth*majiangFactory.scale_upDown
                pos.y = -line*majiangFactory.downDiscardIntervalY*majiangFactory.scale_upDown
                pos.zOrder = line
                break
            }
            case 1://right
            {        
                pos.x = line*majiangFactory.right_discardWidth*majiangFactory.scale_rightLeft
                pos.y = row*majiangFactory.rightDiscardIntervalY*majiangFactory.scale_rightLeft
                pos.zOrder = -row
                break
            }
            case 2://up
            {
                pos.x = -row*majiangFactory.up_discardWidth*majiangFactory.scale_upDown
                pos.y = line*majiangFactory.upDiscardIntervalY*majiangFactory.scale_upDown
                pos.zOrder = -line
               break
            }
            case 3://left
            {
                pos.x = -line*majiangFactory.left_discardWidth*majiangFactory.scale_rightLeft
                pos.y = -row*majiangFactory.leftDiscardIntervalY*majiangFactory.scale_rightLeft
                pos.zOrder = row
                break
            }
        }
        return pos
    },
    //‘增删减查’
    popDiscardMajiangs:function(discardMajiangs)
    {
        var majiangs = discardMajiangs

        var majiang = majiangs[majiangs.length-1]
        majiang.removeFromParent()
        majiangs.splice(majiangs.length-1, 1)
    },
    addDiscardMajiangs:function(discardMajiangs, direction, cardData, parent)
    {
        var majiangs = discardMajiangs
        var majiang = majiangFactory.getOne(cardData, 1, direction)
        parent.addChild(majiang)

        var discardCount = direction%2==0?majiangFactory.discardCountOneRow:majiangFactory.discardCountOneLine
        
        var row = majiangs.length%discardCount
        var line = Math.floor(majiangs.length/discardCount) 
        var pos = majiangFactory.getDiscardMajiangPosAndTag(row, line, direction)
        majiang.x = pos.x
        majiang.y = pos.y
        majiang.setLocalZOrder(pos.zOrder)

        majiangs[majiangs.length] = majiang
        
    },
    ///////discardMajiangs end//////

    ///////weaveMajiang start//////
    getWeaveMajiangPosAndTag:function(groupIdx, idxInGroup, direction)
    {
        var pos = {}
        switch(direction)
        {
            case 0://down
            {
                // var widthOneGroup = majiangFactory.scale_upDown*majiangFactory.downWeaveIntervalX*3 + majiangFactory.downWeaveIntervalPerGroup
                
                var widthOneGroup = majiangFactory.scale_upDown*majiangFactory.downHandIntervalX*3
                var y = majiangFactory.scale_upDown*(majiangFactory.down_handHeight-majiangFactory.down_weaveHeight)*0.5

                pos.x = ( (idxInGroup==3?1:idxInGroup)+0.5 )*majiangFactory.scale_upDown*majiangFactory.downWeaveIntervalX + groupIdx*widthOneGroup
                pos.y = -y + (idxInGroup==3?majiangFactory.downWeaveGangOffset:0)
                pos.zOrder = 0    
                break
            }
            case 1://right
            {
                pos.x = 0.2*(majiangFactory.right_weaveWidth - majiangFactory.right_handWidth)*majiangFactory.scale_rightLeft
                //majiangFactory.scale_rightLeft*majiangFactory.right_handWidth*0.5 + 
                //(idxInGroup==3?majiangFactory.rightWeaveGangOffset:0)

                // var widthOneGroup = majiangFactory.scale_rightLeft*majiangFactory.rightWeaveIntervalY*3 + majiangFactory.rightWeaveIntervalPerGroup
               
                var widthOneGroup = majiangFactory.scale_rightLeft*majiangFactory.leftHandIntervalY*3

                pos.y = ( (idxInGroup==3?1.45:idxInGroup)+0.5-0.32)*majiangFactory.scale_rightLeft*
                majiangFactory.rightWeaveIntervalY + groupIdx*widthOneGroup
                
                pos.zOrder = idxInGroup==3?10:(3-idxInGroup)
                break
            }
            case 2://up
            {
                //var widthOneGroup = majiangFactory.scale_upDown*majiangFactory.upWeaveIntervalX*3 + majiangFactory.upWeaveIntervalPerGroup
                
                var widthOneGroup = majiangFactory.scale_upDown*majiangFactory.upHandIntervalX*3
                var y = majiangFactory.scale_upDown*(majiangFactory.up_handHeight-majiangFactory.up_weaveHeight)*0.5

                pos.x = -( (idxInGroup==3?1:idxInGroup)+0.5 )*majiangFactory.scale_upDown*majiangFactory.upWeaveIntervalX - groupIdx*widthOneGroup
                pos.y = -y + (idxInGroup==3?majiangFactory.upWeaveGangOffset:0)

                pos.zOrder = 0 
                break
            }
            case 3://left
            {
                pos.x = -0.2*(majiangFactory.left_weaveWidth - majiangFactory.left_handWidth)*majiangFactory.scale_rightLeft
                //majiangFactory.scale_rightLeft*majiangFactory.right_handWidth*0.5 + 
                //(idxInGroup==3?majiangFactory.rightWeaveGangOffset:0)

                // var widthOneGroup = majiangFactory.scale_rightLeft*majiangFactory.leftWeaveIntervalY*3 + majiangFactory.leftWeaveIntervalPerGroup
                
                var widthOneGroup = majiangFactory.scale_rightLeft*majiangFactory.rightHandIntervalY*3
                pos.y = -( (idxInGroup==3?0.55:idxInGroup)+0.5-0.32 )*majiangFactory.scale_rightLeft*
                majiangFactory.leftWeaveIntervalY - groupIdx*widthOneGroup
                
                pos.zOrder = idxInGroup==3?10:(idxInGroup-3)
                break
            }
        }
        return pos
    },
    getWeaveDirectionSpr:function(direction)
    {
        var pos = {}
        switch(direction)
        {
            case 0://down
            {
                pos.x = majiangFactory.down_weaveWidth*0.5
                pos.y = majiangFactory.down_weaveHeight*0.2
                break
            }
            case 1://right
            {
                pos.x = majiangFactory.right_weaveWidth*0.8
                pos.y = majiangFactory.right_weaveHeight*0.5
                break
            }
            case 2://up
            {
                pos.x = majiangFactory.up_weaveWidth*0.5
                pos.y = majiangFactory.up_weaveHeight*0.2
                break
            }
            case 3://left
            {
                pos.x = majiangFactory.left_weaveWidth*0.8
                pos.y = majiangFactory.left_weaveHeight*0.5
                break
            }
        }
        return pos
    },

//     //组合子项
// var CMD_WeaveItem = 
// [
//     ['BYTE', 'cbWeaveKind'],                        //组合类型
//     ['BYTE', 'cbCenterCardData'],                       //中心扑克
//     ['BYTE', 'cbPublicCard'],                       //公开标志
//     ['WORD', 'wProvideUser'],                       //供应用户
//     ['BYTE', 'cbCardDatas', 4],                      //组合数据
// ]
// provideDirection
// cbCardDatas
// cbCenterCardData
// cbWeaveKind //吃碰杠 
// cbPublicCard //1明杠 0 暗杠
    
    weaveItem2Majiangs:function(groupIdx, direction, weaveItem, isSelf, isPublicAnGang)
    {
        var cardDatas = weaveItem.cbCardDatas
        var majiangs = []
        var hasAddDirectionSpr = false
        for(var idxInGroup=0;idxInGroup<cardDatas.length;idxInGroup++)
        {
            var cardData = cardDatas[idxInGroup]
            if(weaveItem.cbWeaveKind==WIK_GANG && !weaveItem.cbPublicCard && !isRecordScene)
            {
                if(idxInGroup<3)
                    cardData = 0
                else if(!isSelf && !isPublicAnGang)
                    cardData = 0
            }

            var majiang = majiangFactory.getOne(cardData, 2, direction)

            var pos = majiangFactory.getWeaveMajiangPosAndTag(groupIdx, idxInGroup, direction)
            majiang.x = pos.x
            majiang.y = pos.y
            majiang.setLocalZOrder(pos.zOrder)
            if(weaveItem.provideDirection!=direction && !hasAddDirectionSpr && cardData == weaveItem.cbCenterCardData)
            {
                var zi = majiang.getChildByTag(101)
                var directionSpr = new cc.Sprite('#mf_weaveDirection.png')
                directionSpr.setRotation(180-weaveItem.provideDirection*90 - zi.getRotation())

                directionSpr.x = zi.width*0.5
                directionSpr.y = zi.height*0.5
                zi.addChild(directionSpr, 0, 101)
                hasAddDirectionSpr = true
            }
            majiangs[majiangs.length] = majiang
        }  
        majiangs.cbWeaveKind = weaveItem.cbWeaveKind

        return majiangs
    },
    //weaveItemArray:
    //[
    //[[1,2,3,4], [2,3,4], [4,5,6], [7,8,1]],
    //[],
    //[[1,2,3],[2,3,4,5],[4,5,6],[7,8,1]],
    //[]
    //]
    // cardDatas数组->spr数组
    getWeaveMajiangsArray:function(weaveItemArray, selfDirection)
    {
        var isPublicAnGang = majiangFactory.isPublicAnGang
        var weaveMajiangs4D = []
        for(showChairid=0;showChairid<SERVER_CHAIR;showChairid++)
        {
            var direction = showChairid
            var weaveItems = weaveItemArray[direction]

            var isSelf = selfDirection == direction
            var majiangsOneDirection = []
            for(var groupIdx=0;groupIdx<weaveItems.length;groupIdx++)
            {
                var weaveItem = weaveItems[groupIdx]
                if(weaveItem.cbWeaveKind == WIK_NULL)
                    continue

                if(weaveItem.cbWeaveKind!=WIK_GANG)
                    weaveItem.cbCardDatas = weaveItem.cbCardDatas.slice(0, 3)

                var majiangsOneGroup = majiangFactory.weaveItem2Majiangs(groupIdx, direction, weaveItem, isSelf, isPublicAnGang)
                majiangsOneDirection[groupIdx] = majiangsOneGroup
            }
            weaveMajiangs4D[direction] = majiangsOneDirection
        }

        return weaveMajiangs4D
    },
    //‘增删减查’
    addWeaveMajiangs:function(majiangsOneDirection, direction, weaveItem, parent, selfDirection)
    {
        var isPublicAnGang = majiangFactory.isPublicAnGang
        var groupIdx = majiangsOneDirection.length
        var isSelf = selfDirection == direction
        var majiangsOneGroup = majiangFactory.weaveItem2Majiangs(groupIdx, direction, weaveItem, isSelf, isPublicAnGang)
        for(var i=0;i<majiangsOneGroup.length;i++)
        {
            parent.addChild(majiangsOneGroup[i])
        }
        majiangsOneDirection[groupIdx] = majiangsOneGroup
    },
    peng2Gang:function(cardData ,majiangsOneDirection, direction)
    {
        for(var i=0;i<majiangsOneDirection.length;i++)
        {
            var majiangsOneGroup = majiangsOneDirection[i]
            if(majiangsOneGroup.cbWeaveKind == WIK_PENG && majiangsOneGroup[0].cardData == cardData)
            {
                var majiang = majiangFactory.getOne(cardData, 2, direction)
                var pos = majiangFactory.getWeaveMajiangPosAndTag(i, 3, direction)
                majiang.x = pos.x
                majiang.y = pos.y
                majiang.setLocalZOrder(pos.zOrder)
                var parent = majiangsOneGroup[0].getParent()
                parent.addChild(majiang)

                majiangsOneGroup[3] = majiang
                majiangsOneGroup.cbWeaveKind = WIK_GANG
                break
            }
        }
    },
    gang2Peng:function(cardData, majiangsOneDirection)
    {
        for(var i=0;i<majiangsOneDirection.length;i++)
        {
            var majiangsOneGroup = majiangsOneDirection[i]
            if(majiangsOneGroup.cbWeaveKind == WIK_GANG && majiangsOneGroup[0].cardData == cardData)
            {
                majiangsOneGroup[3].removeFromParent()
                majiangsOneGroup.splice(3,1)
                majiangsOneGroup.cbWeaveKind = WIK_PENG
                break
            }
        }
    },
    showWeaveMajiangs:function()
    {
    },
    ///////weaveMajiang end//////
    
    ///////heapMajiangs start//////
    getHeapCardDatasArray:function(cbHeapCardInfo, TurnoverCard)
    {
        var heapCardDatasArray = []//这个数组以头部方向为准 
        if(!majiangFactory.isShowHeap)
        {
            for(i=0;i<SERVER_CHAIR;i++)
            {
                heapCardDatasArray[i] = []
            }
            return heapCardDatasArray;
        }

        var heapCardDatasArray = []
        for(var showChairid=0;showChairid<SERVER_CHAIR;showChairid++)
        {
            var direction = showChairid
            var serverChairid = tableData.getServerChairIdWithShowChairId(showChairid)

            heapCardDatasArray[direction] = []
            var wMinusHeadCount = cbHeapCardInfo[serverChairid][0]//从头部方向摸走的麻将数
            var wMinusLastCount = cbHeapCardInfo[serverChairid][1]//从尾部方向摸走的麻将数
                
            for(var j=0;j<HEAP_FULL_COUNT;j++)
            {
                //是否已经从头部方向摸走这张
                var hasSendFromHead = j<wMinusHeadCount
                //是否已经从尾部部方向摸走这张
                var hasSendFromTail = false
                if(!hasSendFromHead)
                {
                    var isUpMj = j%2==0
                    var isExist 
                    if(isUpMj)
                        isExist = (j+1)+1+wMinusLastCount<=HEAP_FULL_COUNT
                    else
                        isExist = j+wMinusLastCount<=HEAP_FULL_COUNT
                    hasSendFromTail = !isExist
                }
                if(hasSendFromHead||hasSendFromTail)
                    heapCardDatasArray[direction][j] = INVALID_BYTE
                else
                    heapCardDatasArray[direction][j] = 0
            }
        }

        for(var i=0;i<TURNOVER_COUNT_MAGIC;i++ )
        {
            var wTurnoverCardHeapDir = tableData.getShowChairIdWithServerChairId(TurnoverCard[i].wHeapDir)
            var wTurnoverCardHeapPos = TurnoverCard[i].wHeapPos
            var cbTurnoverCardData = TurnoverCard[i].cbCardData

            if(heapCardDatasArray[wTurnoverCardHeapDir][wTurnoverCardHeapPos] == 0)
                heapCardDatasArray[wTurnoverCardHeapDir][wTurnoverCardHeapPos] = cbTurnoverCardData
        }

        return heapCardDatasArray
    },
    //heapCardDatasArray:
    // [0x11,0,0,0,0,0,0,INVALID_BYTE,INVALID_BYTE,INVALID_BYTE] cardDatas数组->spr数组 INVALID_BYTE占位用表示被取走
    getHeapMajiangsArray:function(heapCardDatasArray)
    {
        var heapMajiangs4D = []
        if(!majiangFactory.isShowHeap)
        {
            for(i=0;i<SERVER_CHAIR;i++)
            {
                heapMajiangs4D[i] = []
            }
            return heapMajiangs4D;
        }

        for(showChairid=0;showChairid<SERVER_CHAIR;showChairid++)//direction 0down 1right 2up 3left
        {
            var direction = showChairid

            var cardDatas = heapCardDatasArray[direction]
            if(!cardDatas)
            {
                heapMajiangs4D[direction] = []
                continue
            }

            var majiangsOneDirection = []

            for(var j=0;j<cardDatas.length;j++)
            {
                var cardData = cardDatas[j]

                if(cardData==INVALID_BYTE)
                    continue
                var majiang = majiangFactory.getOne(cardData, 3, direction)
                var pos = majiangFactory.getHeapMajiangPosAndTag(j, direction)
                majiang.x = pos.x
                majiang.y = pos.y
                majiang.setLocalZOrder(pos.zOrder)
                majiangsOneDirection[j] = majiang
            }
            heapMajiangs4D[direction] = majiangsOneDirection
        }



        return heapMajiangs4D
    },
    getHeapMajiangPosAndTag:function(idxInCardDatas, direction)
    {
        var pos = {}
        switch(direction)
        { 
            case 0://down
            {
                pos.x = -(Math.floor(idxInCardDatas/2) + 0.5)*majiangFactory.downHeapIntervalX*majiangFactory.scale_heap
                pos.y = 0.5*majiangFactory.down_heapHeight*majiangFactory.scale_heap + (idxInCardDatas%2==0?majiangFactory.downHeapOffset:0)*majiangFactory.scale_heap 
                pos.zOrder = -idxInCardDatas
                break
            }
            case 1://right
            {        
                pos.x = - 0.5*majiangFactory.right_heapWidth*majiangFactory.scale_heap //- (idxInCardDatas%2==0?2:0)*majiangFactory.scale_heap
                pos.y = - (Math.floor(idxInCardDatas/2) + 0.5)*majiangFactory.rightHeapIntervalY*majiangFactory.scale_heap - (idxInCardDatas%2==0?0:majiangFactory.rightHeapOffset)*majiangFactory.scale_heap 
                pos.zOrder = Math.floor(idxInCardDatas/2)*100 - idxInCardDatas%2
                break
            }
            case 2://up
            {
                pos.x = (Math.floor(idxInCardDatas/2) + 0.5)*majiangFactory.upHeapIntervalX*majiangFactory.scale_heap
                pos.y = -0.5*majiangFactory.up_heapHeight*majiangFactory.scale_heap - (idxInCardDatas%2==0?0:majiangFactory.upHeapOffset)*majiangFactory.scale_heap 
                pos.zOrder = -idxInCardDatas
               break
            }
            case 3://left
            {
                pos.x = 0.5*majiangFactory.left_heapWidth*majiangFactory.scale_heap //+ (idxInCardDatas%2==0?2:0)*majiangFactory.scale_heap
                pos.y = (Math.floor(idxInCardDatas/2) + 0.5)*majiangFactory.rightHeapIntervalY*majiangFactory.scale_heap + (idxInCardDatas%2==0?majiangFactory.rightHeapOffset:0)*majiangFactory.scale_heap 
                pos.zOrder = -Math.floor(idxInCardDatas/2)- (idxInCardDatas%2)*100
                break
            }
        }
        return pos
    }, 
    deleteHeapMajiangs:function(heapMajiangs, wSendHeapPosArray)
    {
        if(!majiangFactory.isShowHeap)
            return;
        for(var i=0;i<wSendHeapPosArray.length;i++)
        {
            heapMajiangs[wSendHeapPosArray[i]].removeFromParent()

        }
    },      
    ///////heapMajiangs end//////


    ///////flowerMajiangs start//////
    //flowerCardDatasArray:
    // [0x41,0x41,0x41,0x41,0x41,0x41,0x41] cardDatas数组->spr数组
    getFlowerMajiangsArray:function(flowerCardDatasArray)
    {
        var flowerMajiangs4D = []
        for(showChairid=0;showChairid<SERVER_CHAIR;showChairid++)//direction 0down 1right 2up 3left
        {
            var direction = showChairid

            var cardDatas = flowerCardDatasArray[direction]
            if(!cardDatas)
            {
                flowerMajiangs4D[direction] = []
                continue
            }

            var majiangsOneDirection = []
            for(var j=0;j<cardDatas.length;j++)
            {
                var cardData = cardDatas[j]

                var majiang = majiangFactory.getOne(cardData, 4, direction)
                var pos = majiangFactory.getFlowerMajiangPosAndTag(j, direction)
                majiang.x = pos.x
                majiang.y = pos.y
                majiang.setLocalZOrder(pos.zOrder)
                majiangsOneDirection[j] = majiang
            }
            flowerMajiangs4D[direction] = majiangsOneDirection
        }

        return flowerMajiangs4D
    },
    getFlowerMajiangPosAndTag:function(idxInCardDatas, direction)
    {
        var pos = {}
        switch(direction)
        { 
            case 0://down
            {
                pos.x = (idxInCardDatas + 0.5)*majiangFactory.down_flowerWidth*majiangFactory.scale_flower
                pos.y = 0.5*majiangFactory.down_flowerHeight*majiangFactory.scale_flower
                pos.zOrder = -idxInCardDatas
                break
            }
            case 1://right
            {        
                pos.x = -0.5*majiangFactory.right_flowerWidth*majiangFactory.scale_flower 
                pos.y = (idxInCardDatas + 0.5)*majiangFactory.rightFlowerIntervalY*majiangFactory.scale_flower
                pos.zOrder = -idxInCardDatas
                break
            }
            case 2://up
            {
                pos.x = -(idxInCardDatas + 0.5)*majiangFactory.up_flowerWidth*majiangFactory.scale_flower
                pos.y = 0.5*majiangFactory.up_flowerHeight*majiangFactory.scale_flower
                pos.zOrder = -idxInCardDatas
               break
            }
            case 3://left
            {
                pos.x = 0.5*majiangFactory.right_flowerWidth*majiangFactory.scale_flower 
                pos.y = -(idxInCardDatas + 0.5)*majiangFactory.rightFlowerIntervalY*majiangFactory.scale_flower
                pos.zOrder = idxInCardDatas
                break
            }
        }
        return pos
    }, 
    addFlowerMajiangs:function(flowerMajiangs, direction, cardData, parent)
    {
        var majiangs = flowerMajiangs
        var majiang = majiangFactory.getOne(cardData, 4, direction)
        var i = majiangs.length
        var pos = majiangFactory.getFlowerMajiangPosAndTag(i, direction)
        majiang.x = pos.x
        majiang.y = pos.y
        majiang.setLocalZOrder(pos.zOrder)

        majiangs[i] = majiang
        parent.addChild(majiang)
    },  
    ///////flowerMajiangs end//////

/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
    
    showChoosePopOfAction:function(cardDatasArray, actionArray, actionCall)
    {
        var len = actionArray.length
        for(var i=0;i<len;i++)
        {
            var cardDatas = cardDatasArray[i]
            var chooseItem = majiangFactory._getChooseItemOfAction(cardDatas, actionArray[i], actionCall)

            chooseItem.x = ( i - (len-1)/2 ) * (majiangFactory.scale_upDown*majiangFactory.chooseItemMjScale*majiangFactory.downHandIntervalX*3 + 30)
            chooseItem.y = 0
            majiangFactory.chooseItemsNode.addChild(chooseItem)
        }
    },
    _getChooseItemOfAction:function(sortedOperateCardDatas, action, actionCall)
    {        
        var chooseItem = new cc.Node()
        // var provideCardData = cardDatas[0]
        ////////////////////////////
        var showLen = sortedOperateCardDatas.length
        if(action == WIK_GANG)
            showLen = 1
        for(var i=0;i<showLen;i++)
        {
            var mj = majiangFactory.getOne(sortedOperateCardDatas[i], 0, 0)
            mj.setScale(majiangFactory.scale_upDown*majiangFactory.chooseItemMjScale)
            mj.x = ( i - (showLen-1)/2 )*majiangFactory.scale_upDown*majiangFactory.chooseItemMjScale*majiangFactory.downHandIntervalX
            
            if( (action == WIK_LEFT && i==0) || (action == WIK_CENTER && i==1) || (action == WIK_RIGHT && i==2) )
            {
                // provideCardData = i
                mj.color = cc.color(122, 122, 122)
            }

            chooseItem.addChild(mj)
        }

        ////////////////////////////
        var bg = new cc.Scale9Sprite('mf_chooseItemBg.png')
        bg.width = majiangFactory.scale_upDown*majiangFactory.chooseItemMjScale*majiangFactory.downHandIntervalX*showLen + 10
        bg.height = majiangFactory.scale_upDown*majiangFactory.chooseItemMjScale*majiangFactory.down_handHeight + 10 
        bg.x = 0//bg.width/2
        bg.y = 0//bg.height/2
        bg.anchorX = 0.5
        bg.anchorY = 0.5
        chooseItem.addChild(bg, -1)

        var listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget()
                var locationInNode = target.convertToNodeSpace(touch.getLocation())
                var rect = cc.rect(0, 0, target.getContentSize().width, target.getContentSize().height)
                var isTouchInNode = cc.rectContainsPoint(rect, locationInNode)
                if (isTouchInNode) {
                    return true
                }
                return false
            },
            onTouchEnded: function (touch, event) {
                var target = event.getCurrentTarget()
                var locationInNode = target.convertToNodeSpace(touch.getLocation())
                var rect = cc.rect(0, 0, target.getContentSize().width, target.getContentSize().height)
                var isTouchInNode = cc.rectContainsPoint(rect, locationInNode)
                if (isTouchInNode) {
                    majiangFactory.chooseItemsNode.removeAllChildren()
                    actionCall?actionCall(sortedOperateCardDatas, action):''
                }
            }
        })
        cc.eventManager.addListener(listener, bg)

        return chooseItem
    },
    setCurrentDiscardMj:function(cardData, direction)
    {   
        majiangFactory.currentDiscardMjNode.setVisible(true)
        var mj = majiangFactory.currentDiscardMjNode.getChildByTag(101)
        mj.getChildByTag(101).setSpriteFrame('mf_' + cardData + '.png') 

        var up_handHeight = majiangFactory.up_handHeight*majiangFactory.scale_upDown
        var down_handHeight = majiangFactory.down_handHeight*majiangFactory.scale_upDown

        switch(direction)
        {
            case 0://down
            {
                majiangFactory.currentDiscardMjNode.x = majiangFactory.mjTableNode.width*0.5
                // majiangFactory.currentDiscardMjNode.y = down_handHeight + 10*majiangFactory.scale_rightLeft   
                majiangFactory.currentDiscardMjNode.y = 0.5*down_handHeight*majiangFactory.currentDiscardMjScale + 10*majiangFactory.scale_rightLeft    
                break
            }
            case 1://right
            {
                majiangFactory.currentDiscardMjNode.x = majiangFactory.mjTableNode.width - majiangFactory.right_handWidth*majiangFactory.scale_rightLeft - 
                0.5*majiangFactory.down_handWidth*majiangFactory.currentDiscardMjScale*majiangFactory.scale_upDown - 60*majiangFactory.scale_upDown
                
                majiangFactory.currentDiscardMjNode.y = down_handHeight + 0.5*(majiangFactory.mjTableNode.height-up_handHeight-down_handHeight)
                break
            }
            case 2://up
            {
                majiangFactory.currentDiscardMjNode.x = majiangFactory.mjTableNode.width*0.5
                //majiangFactory.currentDiscardMjNode.y = majiangFactory.mjTableNode.height - 0.5*up_handHeight - 10*majiangFactory.scale_rightLeft    
                majiangFactory.currentDiscardMjNode.y = majiangFactory.mjTableNode.height - 0.5*down_handHeight*majiangFactory.currentDiscardMjScale - 10*majiangFactory.scale_rightLeft    
                break
            }
            case 3://left
            {
                majiangFactory.currentDiscardMjNode.x = majiangFactory.left_handWidth*majiangFactory.scale_rightLeft + 
                0.5*majiangFactory.down_handWidth*majiangFactory.currentDiscardMjScale*majiangFactory.scale_upDown + 60*majiangFactory.scale_upDown
                majiangFactory.currentDiscardMjNode.y = down_handHeight + 0.5*(majiangFactory.mjTableNode.height-up_handHeight-down_handHeight)
                break
            }
        }
    },
    hideCurrentDiscardMj:function()
    {
        majiangFactory.currentDiscardMjNode.x = -1000
    },
    getActionPlayNodePos:function(direction)
    {
        var pos = {}
        var up_handHeight = majiangFactory.up_handHeight*majiangFactory.scale_upDown
        var down_handHeight = majiangFactory.down_handHeight*majiangFactory.scale_upDown
        switch(direction)
        {
            case 0://down
            {
                pos.x = majiangFactory.mjTableNode.width*0.5
                pos.y = down_handHeight + 60
                break
            }
            case 1://right
            {
                pos.x = majiangFactory.mjTableNode.width - majiangFactory.right_handWidth*majiangFactory.scale_rightLeft
                - 150*majiangFactory.scale_upDown
                pos.y = down_handHeight + 0.5*(majiangFactory.mjTableNode.height-up_handHeight-down_handHeight)
                break
            }
            case 2://up
            {
                pos.x = majiangFactory.mjTableNode.width*0.5
                pos.y = majiangFactory.mjTableNode.height - majiangFactory.up_handHeight*majiangFactory.scale_upDown
                 - 60
                break
            }
            case 3://left
            {
                pos.x = majiangFactory.left_handWidth*majiangFactory.scale_rightLeft 
                + 150*majiangFactory.scale_upDown
                pos.y = down_handHeight + 0.5*(majiangFactory.mjTableNode.height-up_handHeight-down_handHeight)
                break
            }
        }
        return pos
    },
    //处理吃碰杠 主要会调用到手牌堆、丢弃牌堆、吃碰杠牌堆的‘增删减查’
    onActionResult:function(action, cardDatas, operateUser, provideUser, majiangs4W4D, handGroupNode4D)
    {
        if(action==WIK_REPLACE)
            majiangFactory.onActionReplace(cardDatas, operateUser, provideUser, majiangs4W4D, handGroupNode4D)
        if(action==WIK_GANG)
            majiangFactory.onActionGang(cardDatas, operateUser, provideUser, majiangs4W4D, handGroupNode4D)
        else if(action == WIK_PENG)
            majiangFactory.onActionPeng(cardDatas, operateUser, provideUser, majiangs4W4D, handGroupNode4D)
        else if(action == WIK_LEFT)
            majiangFactory.onActionChi(action, cardDatas, operateUser, provideUser, majiangs4W4D, handGroupNode4D)
        else if(action == WIK_CENTER)
            majiangFactory.onActionChi(action, cardDatas, operateUser, provideUser, majiangs4W4D, handGroupNode4D)
        else if(action == WIK_RIGHT)
            majiangFactory.onActionChi(action, cardDatas, operateUser, provideUser, majiangs4W4D, handGroupNode4D)
    },
    onActionReplace:function(cardDatas, operateUser, provideUser, majiangs4W4D, handGroupNode4D)
    {
        var operateUserDir = tableData.getShowChairIdWithServerChairId(operateUser.wChairID)
        var operateHandMajiangs = majiangs4W4D.handMajiangs4D[operateUserDir]
        var operateFlowerMajiangs = majiangs4W4D.flowerMajiangs4D[operateUserDir]
        var operateFlowerMajiangsNode = operateUser.userNodeInsetChair.currentRoundNode.flowerMajiangsNode

        for(var i=0;i<cardDatas.length;i++)
        {
            var deleteCardData = (operateUser.dwUserID == selfdwUserID || isRecordScene)?cardDatas[i]:0
            var flowerCardData = cardDatas[i]
            majiangFactory.deleteHandMajiangs(operateHandMajiangs, operateUserDir, deleteCardData)

            majiangFactory.addFlowerMajiangs(operateFlowerMajiangs, operateUserDir, flowerCardData, operateFlowerMajiangsNode)
        }
    },
    onActionGang:function(cardDatas, operateUser, provideUser, majiangs4W4D, handGroupNode4D)
    {
        var cardData = cardDatas[0]
        var gangType //0暗杠 1明杠 2增杠
        var operateUserDir = tableData.getShowChairIdWithServerChairId(operateUser.wChairID)
        var provideUserDir = tableData.getShowChairIdWithServerChairId(provideUser.wChairID)
        var operateWeaveMajiangs = majiangs4W4D.weaveMajiangs4D[operateUserDir]
        var operateHandMajiangs = majiangs4W4D.handMajiangs4D[operateUserDir]
        var provideDiscardMajiangs = majiangs4W4D.discardMajiangs4D[provideUserDir]

        var isHasInWeave = false
        for(var i=0;i<operateWeaveMajiangs.length;i++)
        {
            var majiangsOneGroup = operateWeaveMajiangs[i]
            if(majiangsOneGroup.cbWeaveKind == WIK_PENG && majiangsOneGroup[0].cardData == cardData)
            {
                isHasInWeave = true
                break
            }
        }

        if(isHasInWeave)
            gangType = 2
        else if(operateUser==provideUser)
            gangType = 0
        else
            gangType = 1

        var deleteCardData = (operateUser.dwUserID == selfdwUserID || isRecordScene)?cardData:0
        if(gangType==2)
        {
            majiangFactory.deleteHandMajiangs(operateHandMajiangs, operateUserDir, deleteCardData)
            majiangFactory.moveHandMajiangNew2Old(operateHandMajiangs, operateUserDir, handGroupNode4D[operateUserDir])
            majiangFactory.peng2Gang(cardData, operateWeaveMajiangs, operateUserDir)
        }
        else
        {
            var deleteLen = 4
            if(gangType==1)
            {
                majiangFactory.popDiscardMajiangs(provideDiscardMajiangs)
                deleteLen = deleteLen - 1
            }
            for(var i=0;i<deleteLen;i++)
            {
                majiangFactory.deleteHandMajiangs(operateHandMajiangs, operateUserDir, deleteCardData)
            }

            var self = tableData.getUserWithUserId(selfdwUserID)
            var selfDir = tableData.getShowChairIdWithServerChairId(self.wChairID)
            majiangFactory.addWeaveMajiangs(operateWeaveMajiangs, operateUserDir, 
                {
                    'cbCardDatas':[cardData, cardData, cardData, cardData],
                    'provideDirection':provideUserDir,
                    'cbCenterCardData':cardData,
                    'cbWeaveKind':WIK_GANG,
                    'cbPublicCard':gangType,
                }, 
                operateUser.userNodeInsetChair.currentRoundNode.weaveMajiangsNode,
                selfDir,
                majiangFactory.isPublicAnGang
                )
        }
    },
    onActionChi:function(action, cardDatas, operateUser, provideUser, majiangs4W4D, handGroupNode4D)
    {
        var operateUserDir = tableData.getShowChairIdWithServerChairId(operateUser.wChairID)
        var provideUserDir = tableData.getShowChairIdWithServerChairId(provideUser.wChairID)
        var operateWeaveMajiangs = majiangs4W4D.weaveMajiangs4D[operateUserDir]
        var operateHandMajiangs = majiangs4W4D.handMajiangs4D[operateUserDir]
        var provideDiscardMajiangs = majiangs4W4D.discardMajiangs4D[provideUserDir]

        var weaveCardDatas = cardDatas
        // if(action == WIK_LEFT)
        //     weaveCardDatas = [cardData, cardData+1, cardData+2]
        // else if(action == WIK_CENTER)
        //     weaveCardDatas = [cardData-1, cardData, cardData+1]
        // else if(action == WIK_RIGHT)
        //     weaveCardDatas = [cardData-2, cardData-1, cardData]

        var provideCardData = provideDiscardMajiangs[provideDiscardMajiangs.length-1].cardData
        if(operateUser.dwUserID == selfdwUserID || isRecordScene)
        {
            var deleteCardDatas = clone(weaveCardDatas)
            for(var i=0;i<deleteCardDatas.length;i++)
            {
                if(deleteCardDatas[i] == provideCardData)
                {
                    deleteCardDatas.splice(i, 1)
                    break
                }
            }
        }
        else
            var deleteCardDatas = [0, 0]
        //////
        majiangFactory.popDiscardMajiangs(provideDiscardMajiangs)
        for(var i=0;i<deleteCardDatas.length;i++)
        {
            majiangFactory.deleteHandMajiangs(operateHandMajiangs, operateUserDir, deleteCardDatas[i])
        }
        var self = tableData.getUserWithUserId(selfdwUserID)
        var selfDir = tableData.getShowChairIdWithServerChairId(self.wChairID)
        majiangFactory.addWeaveMajiangs(operateWeaveMajiangs, operateUserDir, 
        {
            'cbCardDatas':weaveCardDatas,
            'provideDirection':provideUserDir,
            'cbCenterCardData':provideCardData,
            'cbWeaveKind':action,
            'cbPublicCard':1,
        }, 
        operateUser.userNodeInsetChair.currentRoundNode.weaveMajiangsNode,
        selfDir,
        majiangFactory.isPublicAnGang
        )

        var maxCardData = operateHandMajiangs[0][operateHandMajiangs[0].length-1].cardData
        majiangFactory.deleteHandMajiangs(operateHandMajiangs, operateUserDir, maxCardData)
        majiangFactory.addHandMajiangNew(operateHandMajiangs, operateUserDir, maxCardData, 
                handGroupNode4D[operateUserDir])

    },
    onActionPeng:function(cardDatas, operateUser, provideUser, majiangs4W4D, handGroupNode4D)
    {
        var cardData = cardDatas[0]
        var operateUserDir = tableData.getShowChairIdWithServerChairId(operateUser.wChairID)
        var provideUserDir = tableData.getShowChairIdWithServerChairId(provideUser.wChairID)
        var operateWeaveMajiangs = majiangs4W4D.weaveMajiangs4D[operateUserDir]
        var operateHandMajiangs = majiangs4W4D.handMajiangs4D[operateUserDir]
        var provideDiscardMajiangs = majiangs4W4D.discardMajiangs4D[provideUserDir]

        var weaveCardDatas = [cardData, cardData, cardData]

        if(operateUser.dwUserID == selfdwUserID || isRecordScene)
        {
            var deleteCardDatas = [cardData, cardData]
        }
        else
            var deleteCardDatas = [0, 0]

        //////
        majiangFactory.popDiscardMajiangs(provideDiscardMajiangs)
        for(var i=0;i<deleteCardDatas.length;i++)
        {
            majiangFactory.deleteHandMajiangs(operateHandMajiangs, operateUserDir, deleteCardDatas[i])
        }

        var self = tableData.getUserWithUserId(selfdwUserID)
        var selfDir = tableData.getShowChairIdWithServerChairId(self.wChairID)
        majiangFactory.addWeaveMajiangs(operateWeaveMajiangs, operateUserDir, 
        {
            'cbCardDatas':weaveCardDatas,
            'provideDirection':provideUserDir,
            'cbCenterCardData':cardData,
            'cbWeaveKind':WIK_PENG,
            'cbPublicCard':1,
        }, 
        operateUser.userNodeInsetChair.currentRoundNode.weaveMajiangsNode,
        selfDir,
        majiangFactory.isPublicAnGang
        )
       
        var maxCardData = operateHandMajiangs[0][operateHandMajiangs[0].length-1].cardData
        majiangFactory.deleteHandMajiangs(operateHandMajiangs, operateUserDir, maxCardData)
        majiangFactory.addHandMajiangNew(operateHandMajiangs, operateUserDir, maxCardData, 
                handGroupNode4D[operateUserDir])
    },

}
