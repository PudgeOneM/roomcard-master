
//两副牌
var majiangFactory3 = majiangFactory =  //direction 0down 1right 2up 3left
{   
    resp:'components/majiangFactory3/res/',


    ////////////可配置项 begin //////////
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
    scale_paper:1,
    ////////////////////////////////////////////

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

    down_paperWidth:40,
    down_paperHeight:50,
    down_paperZiScale:0.5,
    down_paperZiPosScale:{x:0.5, y:0.5},
    downPaperIntervalX:40,
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

    up_paperWidth:40,
    up_paperHeight:50,
    up_paperZiScale:0.5,
    up_paperZiPosScale:{x:0.5, y:0.5},
    upPaperIntervalX:40,
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

    right_paperWidth:40,
    right_paperHeight:50,
    right_paperZiScale:0.5,
    right_paperZiPosScale:{x:0.5, y:0.5},
    rightPaperIntervalX:40,
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

    left_paperWidth:40,
    left_paperHeight:50,
    left_paperZiScale:0.5,
    left_paperZiPosScale:{x:0.5, y:0.5},
    leftPaperIntervalX:40,
    ////////////////////////////////////////////
    preLoadRes:
    [
    'components/majiangFactory3/res/majiangFactory.plist', 
    'components/majiangFactory3/res/majiangFactory.png',
    'components/majiangFactory3/res/majiangs.plist', 
    'components/majiangFactory3/res/majiangs.png'
    ],
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
    getOne:function(cardData, where, direction, isIgnoreDecorate, id)
    {	
        var tt = 
        [
            'hand',
            'discard',
            'weave',
            'heap',
            'flower',
            'paper'
        ]

        var t = 
        [
            'down_',
            'right_',
            'up_',
            'left_'
        ]

        var prefix = t[direction] + tt[where]

        var frameName = prefix + (cardData==0?0:'Bg') + '.png'
        var spr = new cc.Sprite("#" + frameName)
        spr.direction = direction
        spr.where = where
        spr.cardData = cardData
        spr.id = id

        if(where == 3)
            var scale = majiangFactory.scale_heap
        else if(where == 4)
            var scale = majiangFactory.scale_flower
        else if(where == 5)
            var scale = majiangFactory.scale_paper
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
        for(showChairid=0;showChairid<GAME_PLAYER;showChairid++)//direction 0down 1right 2up 3left
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
            }  
            handMajiangs4D[direction] = [oldHandMjs, newGetMj]
        }

        return handMajiangs4D
    },
    getHandMajiangPosAndTag:function(length, idxInCardDatas, direction, isNewGetMj)
    {
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
    addHandMajiang:function(handMajiangs, direction, cardData, parent, weaveCount)
    {
        var handMajiangsLen = 0
        handMajiangsLen += handMajiangs[0].length
        handMajiangsLen += handMajiangs[1]?1:0
        if(handMajiangsLen + weaveCount*3 == MAX_COUNT-1)
            majiangFactory.addHandMajiangNew(handMajiangs, direction, cardData, parent)
        else
            majiangFactory.addHandMajiangsOld(handMajiangs, direction, cardData, parent)
    },
    addHandMajiangNew:function(handMajiangs, direction, cardData, parent)
    {
        if(handMajiangs[1])
        {
            majiangFactory.addHandMajiangsOld(handMajiangs, direction, handMajiangs[1].cardData, parent)
            majiangFactory.deleteHandMajiangs(handMajiangs, direction, handMajiangs[1].cardData)
        }

        var oldMajiangs = handMajiangs[0]
        var majiang = majiangFactory.getOne(cardData, 0, direction)
        var pos = majiangFactory.getHandMajiangPosAndTag(oldMajiangs.length, null, direction, true)
        majiang.x = pos.x
        majiang.y = pos.y
        majiang.setLocalZOrder(pos.zOrder)
        majiang.idxInHandMajiangs = null
        parent.addChild(majiang)

        handMajiangs[1] = majiang
    },
    addHandMajiangsOld:function(handMajiangs, direction, cardData, parent)
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
        }

        var size = majiangFactory._getHandGroupNodeSize(direction, majiangs.length)
        parent.width = size.width
        parent.height = size.height
    },  
    //手牌是要处理触摸监听的 GroupNodes是hand麻将的父节点 用于同意处理触摸
    getHandGroupNodes:function(handMajiangs4D)
    {
        var handGroupNodes = []
        for(showChairid=0;showChairid<GAME_PLAYER;showChairid++)//direction 0down 1right 2up 3left
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
            // var outCardCall = outCardCalls[direction]
            // if(outCardCall) 
            // {
            //     var listener = majiangFactory._gethandGroupNodeListener(majiangs, node, direction, outCardCall)
            //     cc.eventManager.addListener(listener, node)
            // }

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
        for(showChairid=0;showChairid<GAME_PLAYER;showChairid++)//direction 0down 1right 2up 3left
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

    weaveItem2Majiangs:function(operateDirection, weaveIdx, weaveItem, isPublicAnGang)
    {
        var cbValidCardDatas = weaveItem.cbValidCardDatas
        var wProvideUser = weaveItem.wProvideUser
        var provideShowChairId = tableData.getShowChairIdWithServerChairId(wProvideUser)
        var provideDirection = majiangFactory.showChairId2Direction(provideShowChairId)

        var operateUser = tableData.getServerChairIdWithShowChairId(operateDirection)

        var arrowIdx = -1
        if(provideDirection!=operateDirection)
        {
            if(weaveItem.cbWeaveKind == WIK_LEFT)
                arrowIdx = 0
            else if(weaveItem.cbWeaveKind == WIK_CENTER)
                arrowIdx = 1
            else if(weaveItem.cbWeaveKind == WIK_RIGHT)
                arrowIdx = 2      
            else if(weaveItem.cbWeaveKind == WIK_PENG)
                arrowIdx = 1    
            else if(weaveItem.cbWeaveKind == WIK_GANG)
                arrowIdx = 3   
        }
 
        var majiangs = []
        for(var i=0;i<cbValidCardDatas.length;i++)
        {
            var cardData = cbValidCardDatas[i]
            if(weaveItem.cbWeaveKind==WIK_GANG && weaveItem.cbWeaveKindType == 2)
            {
                if(i<3)
                    cardData = 0
                else if( tableData.getUserWithUserId(selfdwUserID).wChairID!=operateUser && !isPublicAnGang)
                    cardData = 0
            }

            var majiang = majiangFactory.getOne(cardData, 2, operateDirection)

            var pos = majiangFactory.getWeaveMajiangPosAndTag(weaveIdx, i, operateDirection)
            majiang.x = pos.x
            majiang.y = pos.y
            majiang.setLocalZOrder(pos.zOrder)

            if(i == arrowIdx)
            {
                var zi = majiang.getChildByTag(101)
                var directionSpr = new cc.Sprite('#mf_weaveDirection.png')
                directionSpr.setRotation(180-provideDirection*90 - zi.getRotation())

                directionSpr.x = zi.width*0.5
                directionSpr.y = zi.height*0.5
                zi.addChild(directionSpr, 0, 101)
            }

            majiangs[majiangs.length] = majiang
        }  
        majiangs.weaveItem = weaveItem

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
        for(showChairid=0;showChairid<GAME_PLAYER;showChairid++)
        {
            var direction = showChairid
            var weaveItems = weaveItemArray[direction]

            var isSelf = selfDirection == direction
            var majiangsOneDirection = []
            for(var weaveIdx=0;weaveIdx<weaveItems.length;weaveIdx++)
            {
                var weaveItem = weaveItems[weaveIdx]
                if(weaveItem.cbWeaveKind == WIK_NULL)
                    continue

                var majiangsOneGroup = majiangFactory.weaveItem2Majiangs(direction, weaveIdx, weaveItem, isPublicAnGang)
                majiangsOneDirection[weaveIdx] = majiangsOneGroup
            }
            weaveMajiangs4D[direction] = majiangsOneDirection
        }

        return weaveMajiangs4D
    },
    //‘增删减查’
    updateWeaveMajiangs:function(majiangsOneDirection, direction, weaveIdx, weaveItem, parent)
    {
        var oldMajiangs = majiangsOneDirection[weaveIdx] || []
        for(var i=0; i<oldMajiangs.length; i++)
        {
            oldMajiangs[i].removeFromParent()
        }

        var newMajiangs = majiangFactory.weaveItem2Majiangs(direction, weaveIdx, 
            weaveItem, majiangFactory.isPublicAnGang)
        for(var i=0;i<newMajiangs.length;i++)
        {
            parent.addChild(newMajiangs[i])
        }
        majiangsOneDirection[weaveIdx] = newMajiangs
    },
    ///////weaveMajiang end//////
    
    ///////heapMajiangs start//////
    getHeapCardDatasArray:function(cbHeapCardInfo, TurnoverCard)
    {
        var heapCardDatasArray = []//这个数组以头部方向为准 
        if(!majiangFactory.isShowHeap)
        {
            for(i=0;i<GAME_PLAYER;i++)
            {
                heapCardDatasArray[i] = []
            }
            return heapCardDatasArray;
        }

        var heapCardDatasArray = []
        for(var showChairid=0;showChairid<GAME_PLAYER;showChairid++)
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
            for(i=0;i<GAME_PLAYER;i++)
            {
                heapMajiangs4D[i] = []
            }
            return heapMajiangs4D;
        }

        for(showChairid=0;showChairid<GAME_PLAYER;showChairid++)//direction 0down 1right 2up 3left
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
        for(showChairid=0;showChairid<GAME_PLAYER;showChairid++)//direction 0down 1right 2up 3left
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

}
