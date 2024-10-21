
//两副牌
var majiangFactory =  //direction 0down 1right 2up 3left
{   
    resp:'components/majiangFactory/res/',

    ////////////可配置项 begin //////////
    isShowHeap:false,
    isPublicAnGang:true, //暗杠是否给其他人看到

    ////////////可配置项 end //////////
    
    cardData2ScoreMap:null,//score用于排序先后 比如财神要排在最左边 就要把财神score设置为最低(0) 通过initCardData2ScoreMap
    showChairId2DirMap:[0, 1, 2, 3],
    directionOfEast:0,
    ////////////////////////////////////////////
    getPreLoadRes:function()
    {
        var resp = majiangFactory.resp

        return [
            resp + 'majiangFactory.plist', 
            resp + 'majiangFactory.png',
            resp + gameKind + 'Majiangs' + '.plist', 
            resp + gameKind + 'Majiangs' + '.png', 
            resp + gameKind + 'MajiangPos' + '.txt', 
        ]
    },
    onPreLoadRes:function()
    {  
        var resp = majiangFactory.resp
        eval(cc.loader.cache[resp + gameKind + 'MajiangPos' + '.txt'])
        cc.spriteFrameCache.addSpriteFrames(resp + 'majiangFactory.plist', resp + 'majiangFactory.png')
        cc.spriteFrameCache.addSpriteFrames(resp + gameKind + 'Majiangs' + '.plist', resp + gameKind + 'Majiangs' + '.png')
    },
    onReStart:function()
    {
        // cc.eventManager.removeCustomListeners('handMajiangTouched')
        // cc.eventManager.removeCustomListeners('handMajiangTouchEnd')
    },
    init:function(decorateMjFun)
    {
        majiangFactory.decorateMj = decorateMjFun
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
    getOne:function(cardData, direction, where)
    {	
        var mj = new cc.Sprite(resp_p.empty)
        mj.direction = direction
        mj.where = where
        mj.cardData = cardData
        var pos = majiangFactory.getMajiangPos(direction, where)
        var styleId = styleArray[0]
        var t = ['d_','r_','u_','l_']
        var frameName = 's' + styleId + '_' + t[mj.direction] + mj.where.name + (mj.cardData==0?'0':'Bg') + pos.frame + '.png'  
        majiangFactory.updateMajiang(mj, frameName, pos)

        //皮肤选择
        var l = cc.EventListener.create({
        event: cc.EventListener.CUSTOM,
        eventName: "styleChange",
        callback: function(event)
        {   
            var styleId = styleArray[0]
            var pos = majiangFactory.getMajiangPos(mj.direction, mj.where)

            var t = ['d_','r_','u_','l_']
            var frameName = 's' + styleId + '_' + t[mj.direction] + mj.where.name + (mj.cardData==0?'0':'Bg') + pos.frame + '.png'       
            mj.setSpriteFrame(frameName)
            mj.color = mj.color
        }
        })
        cc.eventManager.addListener(l, 1)   

        majiangFactory.decorateMj(mj)
        
        return mj
    },
    //无方向属性的麻将 caishen/paper
    getSpecialOne:function(cardData, where)
    {   
        var mj = new cc.Sprite(resp_p.empty)
        mj.direction = null
        mj.where = where
        mj.cardData = cardData
        var pos = majiangFactory.getMajiangPos(null, where)

        var styleId = styleArray[0]
        var frameName = 's' + styleId + '_special_' + mj.where.name + (mj.cardData==0?'0':'Bg') + pos.frame + '.png'       
        majiangFactory.updateMajiang(mj, frameName, pos)

        //皮肤选择
        var l = cc.EventListener.create({
        event: cc.EventListener.CUSTOM,
        eventName: "styleChange",
        callback: function(event)
        {   
            var pos = majiangFactory.getMajiangPos(mj.direction, mj.where)

            var styleId = styleArray[0]
            var frameName = 's' + styleId + '_special_' + mj.where.name + (mj.cardData==0?'0':'Bg') + pos.frame + '.png'     
            mj.setSpriteFrame(frameName)
            mj.color = mj.color
        }
        })
        cc.eventManager.addListener(l, 1)   

        majiangFactory.decorateMj(mj)
        
        return mj
    },    
    updateMajiang:function(mj, frameName, pos)
    {
        mj.setSpriteFrame(frameName)

        mj.x = pos.x
        mj.y = pos.y
        mj.scaleX = pos.sX
        mj.scaleY = pos.sY
        mj.zIndex = pos.zIndex
        mj.setFlippedX(pos.flipX)   
        
        mj.color = mj.color

        var ziPos = pos.zi
        if(mj.cardData!=0)
        {
            if(mj.getChildByTag(101))
                var zi = mj.getChildByTag(101)
            else
            {
                var f = '#' + ziPos.frame + "mf_" + mj.cardData + '.png'
                var zi = new cc.Sprite('#' + ziPos.frame + "mf_" + mj.cardData + '.png')
                mj.addChild(zi, 0, 101)
            }

            // var ziWorldPoint = {x:ziPos.x, y:ziPos.y}
            // var ziPosInMj = mj.convertToNodeSpace(ziWorldPoint)
            zi.x = ziPos.x
            zi.y = ziPos.y
            zi.scaleX = ziPos.sX
            zi.scaleY = ziPos.sY
            zi.rotation = ziPos.rotation
            zi.skewX = ziPos.skewX
            zi.skewY = ziPos.skewY
            // zi.setFlippedX(pos.flipX)   
        }
    },
    getTimerPos:function()
    {
        var pos = majiangFactory['majiangPos'+gameKind][0].timer
        return pos
    },
    getMajiangPos:function(direction, where)
    {   
        var data = where.data
        // if(typeof(data) == 'undefined')
        //     return;
        var pos = majiangFactory['getMajiangPos_' + where.name](direction, data)
        return pos
    },
    getMajiangPos_paper:function(direction, data)
    {
        var pos = majiangFactory['majiangPos'+gameKind][0].paper
        return pos
    },
    getMajiangPos_caishen:function(direction, data)
    {
        var pos = majiangFactory['majiangPos'+gameKind][0].caishen
        return pos
    },
    ///////handMajiangs start//////
    getMajiangPos_hand:function(direction, data)
    {
        var posTable = majiangFactory['majiangPos'+gameKind][direction].hand
        if(data.isNewGetMj)
            var pos = posTable[1]
        else
            var pos = posTable[0][data.idx]

        return pos
    },
    getMajiangPos_handshow:function(direction, data)
    {
        var posTable = majiangFactory['majiangPos'+gameKind][direction].handshow
        if(data.isNewGetMj)
            var pos = posTable[1]
        else
            var pos = posTable[0][data.idx]

        return pos
    },
    //handCardDatasArray:
    //[
    //[[1,2,3,4], 1], 
    //[[1,2,2,2,22,], 2], 
    //[[], null], 
    //[[], null]
    //]
    //cardDatas数组->spr数组
    getHandMajiangsArray:function(handCardDatasArray, isLookon, isHandshow)
    {
        var handMajiangs4D = []
        for(direction=0;direction<4;direction++)//direction 0down 1right 2up 3left
        {
            if(!handCardDatasArray[direction])
            {
                handMajiangs4D[direction] = [[], null]
                continue
            }

            var newGetMj = null
            var newGetCardData = handCardDatasArray[direction][1]
            if(typeof(newGetCardData) == 'number')          
            {
                newGetCardData = isLookon?0:newGetCardData
                var where = {}
                where.name = isHandshow?'handshow':'hand'
                where.data = {isNewGetMj:true}
                var newGetMj = majiangFactory.getOne(newGetCardData, direction, where)
            }  

            var oldHandCardDatas = handCardDatasArray[direction][0]
            var oldHandMjs = []

            for(var j=0;j<oldHandCardDatas.length;j++)
            {
                var cardData = isLookon?0:oldHandCardDatas[j]
                var posIdx = (MAX_COUNT-1) - oldHandCardDatas.length + j

                var where = {}
                where.name = isHandshow?'handshow':'hand'
                where.data = {idx:posIdx}
                var majiang = majiangFactory.getOne(cardData, direction, where)
                
                oldHandMjs[j] = majiang
            }

            handMajiangs4D[direction] = [oldHandMjs, newGetMj]
        }

        return handMajiangs4D
    },
    //‘增删减查’
    deleteHandMajiangsOld:function(handMajiangs, direction, majiang, isHandshow)
    {
        if(typeof(isHandshow) == 'undefined')
            isHandshow = majiang.where.name == 'handshow'

        var majiangs = handMajiangs[0]

        for(var i=0;i<majiangs.length;i++)
        {
            if(majiangs[i] == majiang)
            {
                majiang.removeFromParent()
                majiangs.splice(i, 1)
                break
            }
        }

        var styleId = styleArray[0]
        var t = ['d_','r_','u_','l_']
        for(var i=0;i<majiangs.length;i++)
        {
            var mj = majiangs[i]

            var posIdx = (MAX_COUNT-1) - majiangs.length + i
            var pos = majiangFactory['getMajiangPos_'+(isHandshow?'handshow':'hand')](direction, {idx:posIdx})
            mj.where.data.idx = posIdx

            var frameName = 's' + styleId + '_' + t[mj.direction] + mj.where.name + (mj.cardData==0?'0':'Bg') + pos.frame + '.png'   
            majiangFactory.updateMajiang(mj, frameName, pos)
        }
    },
    deleteHandMajiangNew:function(handMajiangs, isHandshow)
    {
        var majiang = handMajiangs[1]
        if(typeof(isHandshow) == 'undefined')
            isHandshow = majiang.where.name == 'handshow'

        majiang.removeFromParent()
        handMajiangs[1] = null
    },
    deleteHandMajiangs:function(handMajiangs, direction, cardData, isHandshow)
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
    addHandMajiangsOld:function(handMajiangs, direction, cardData, parent, isHandshow)
    {
        var majiangs = handMajiangs[0]

        if(typeof(isHandshow) == 'undefined')
            isHandshow = majiangs[0] && majiangs[0].where.name == 'handshow'

        var where = {}
        where.name = isHandshow?'handshow':'hand'
        where.data = {idx:0}
        var majiang = majiangFactory.getOne(cardData, direction, where)
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
        var styleId = styleArray[0]
        var t = ['d_','r_','u_','l_']
        for(var i=newLength-1;i>=0;i--)
        {
            var mj
            if(i>insertMjIdx)
                mj = majiangs[i-1]
            else if(i<insertMjIdx)
                mj = majiangs[i]
            else
                mj = majiang

            var posIdx = (MAX_COUNT-1) - newLength + i
            var pos = majiangFactory['getMajiangPos_'+(isHandshow?'handshow':'hand')](direction, {idx:posIdx})
            mj.where.data.idx = posIdx
            var frameName = 's' + styleId + '_' + t[mj.direction] + mj.where.name + (mj.cardData==0?'0':'Bg') + pos.frame + '.png' 
            majiangFactory.updateMajiang(mj, frameName, pos)

            
            majiangs[i] = mj
        }
    },  
    addHandMajiangNew:function(handMajiangs, direction, cardData, parent, isHandshow)
    {
        if(typeof(isHandshow) == 'undefined')
            isHandshow = handMajiangs[0][0] && handMajiangs[0][0].where.name == 'handshow'

        if(handMajiangs[1])
        {
            majiangFactory.addHandMajiangsOld(handMajiangs, direction, handMajiangs[1].cardData, parent)
            majiangFactory.deleteHandMajiangs(handMajiangs, direction, handMajiangs[1].cardData)
        }
        var where = {}
        where.name = isHandshow?'handshow':'hand'
        where.data = {isNewGetMj:true}
        var mj = majiangFactory.getOne(cardData, direction, where)

        parent.addChild(mj)

        handMajiangs[1] = mj
    },
    addHandMajiang:function(handMajiangs, direction, cardData, parent, weaveCount, isHandshow)
    {
        var handMajiangsLen = 0
        handMajiangsLen += handMajiangs[0].length
        handMajiangsLen += handMajiangs[1]?1:0
        if(handMajiangsLen + weaveCount*3 == MAX_COUNT-1)
            majiangFactory.addHandMajiangNew(handMajiangs, direction, cardData, parent)
        else
            majiangFactory.addHandMajiangsOld(handMajiangs, direction, cardData, parent)
    },
    ///////handMajiangs end//////
    
    ///////discardMajiangs start//////
    getMajiangPos_discard:function(direction, data)
    {
        var posTable = majiangFactory['majiangPos'+gameKind][direction].discard
        var pos = posTable[data.idx%posTable.length]
        return pos
    },
    getDiscardMajiangsArray:function(discardCardDatasArray)
    {
        var discardMajiangs4D = []
        for(direction=0;direction<4;direction++)//direction 0down 1right 2up 3left
        {
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
                var where = {}
                where.name = 'discard'
                where.data = {idx:j}

                var mj = majiangFactory.getOne(cardData, direction, where)


                majiangsOneDirection[j] = mj
            }
            discardMajiangs4D[direction] = majiangsOneDirection
        }

        return discardMajiangs4D
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
        var where = {}
        where.name = 'discard'
        where.data = {idx:majiangs.length}
        var mj = majiangFactory.getOne(cardData, direction, where)

        parent.addChild(mj)
        majiangs[majiangs.length] = mj  
    },

    // getDiscardMajiangs:function(direction, idx, cardData)
    // {
    //     var where = {name:'discard', data:{idx:idx}}

    //     var mj = majiangFactory.getOne(cardData, direction, where)

    //     return  mj      
    // },
    ///////discardMajiangs end//////

    ///////weaveMajiang start//////
    getMajiangPos_weave:function(direction, data)
    {
        var posTable = majiangFactory['majiangPos'+gameKind][direction].weave
        var pos = posTable[data.weaveIdx][data.idxInWeave]
        return pos
    },
    weaveItem2Majiangs:function(operateDirection, weaveIdx, weaveItem, isPublicAnGang)
    {
        var cbValidCardDatas = weaveItem.cbValidCardDatas
        var wProvideUser = weaveItem.cbWeaveKind == WIK_PENGGANG?weaveItem.wProvideUserOld:weaveItem.wProvideUser
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
            else if(weaveItem.cbWeaveKind&(WIK_MINGANG|WIK_ANGANG|WIK_PENGGANG))
                arrowIdx = 3   
        }
 
        var majiangs = []
        for(var i=0;i<cbValidCardDatas.length;i++)
        {
            var cardData = cbValidCardDatas[i]
            if(weaveItem.cbWeaveKind==WIK_ANGANG)
            {
                if(i<3)
                    cardData = 0
                else if( tableData.getUserWithUserId(selfdwUserID).wChairID!=operateUser && !isPublicAnGang)
                    cardData = 0
            }
            var where = {}
            where.name = 'weave'
            where.data = {weaveIdx:weaveIdx, idxInWeave:i}

            var mj = majiangFactory.getOne(cardData, operateDirection, where)

            if(i == arrowIdx)
            {
                var zi = mj.getChildByTag(101)
                var directionSpr = new cc.Sprite('#mf_weaveDirection.png')
                directionSpr.setRotation(180-provideDirection*90 - zi.getRotation())

                directionSpr.x = zi.width*0.5
                directionSpr.y = 10
                directionSpr.scale = operateDirection==0?1:1.4
                zi.addChild(directionSpr, 0, 101)
            }

            majiangs[majiangs.length] = mj
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
        for(direction=0;direction<4;direction++)
        {
            var weaveItems = weaveItemArray[direction]

            var isSelf = selfDirection == direction
            var majiangsOneDirection = []
            for(var weaveIdx=0;weaveIdx<weaveItems.length;weaveIdx++)
            {
                var weaveItem = weaveItems[weaveIdx]
                if(weaveItem.cbWeaveKind == WIK_NULL)
                    continue

                var majiangsOneWeave = majiangFactory.weaveItem2Majiangs(direction, weaveIdx, weaveItem, isPublicAnGang)
                majiangsOneDirection[weaveIdx] = majiangsOneWeave
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
    getMajiangPos_heap:function(direction, data)
    {
        var posTable = majiangFactory['majiangPos'+gameKind][direction].heap
        var pos = posTable[data.idx]
        return pos
    },
    getHeapCardDatasArray:function(cbHeapCardInfo, TurnoverCard)
    {
        var heapCardDatasArray = []//这个数组以头部方向为准 
        if(!majiangFactory.isShowHeap)
        {
            for(i=0;i<4;i++)
            {
                heapCardDatasArray[i] = []
            }
            return heapCardDatasArray;
        }

        var heapCardDatasArray = []
        for(var direction=0;direction<4;direction++)
        {
            var fenwei = majiangFactory.direction2Fenwei(direction)
            heapCardDatasArray[direction] = []
            var wMinusHeadCount = cbHeapCardInfo[fenwei][0]//从头部方向摸走的麻将数
            var wMinusLastCount = cbHeapCardInfo[fenwei][1]//从尾部方向摸走的麻将数
                
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
                    heapCardDatasArray[direction][j] = HAS_DISPATCH_CARD_DATA
                else
                    heapCardDatasArray[direction][j] = 0
            }
        }
        for(var i=0;i<TURNOVER_COUNT_MAGIC;i++ )
        {
            var wTurnoverCardHeapFenwei = TurnoverCard[i].heapIdx.wHeapFenwei
            var wTurnoverCardHeapPos = TurnoverCard[i].heapIdx.wHeapPos
            var cbTurnoverCardData = TurnoverCard[i].cbCardData
            
            var wTurnoverCardHeapDir = majiangFactory.direction2Fenwei(wTurnoverCardHeapFenwei)
            if(heapCardDatasArray[wTurnoverCardHeapDir][wTurnoverCardHeapPos] == 0)//可能翻得牌没摸走的话 就翻开显示
                heapCardDatasArray[wTurnoverCardHeapDir][wTurnoverCardHeapPos] = cbTurnoverCardData
        }

        return heapCardDatasArray
    },
    //heapCardDatasArray:
    // [0x11,0,0,0,0,0,0,HAS_DISPATCH_CARD_DATA,HAS_DISPATCH_CARD_DATA,HAS_DISPATCH_CARD_DATA] 
    // cardDatas数组->spr数组 HAS_DISPATCH_CARD_DATA 表示被取走 0是显示牌背 
    getHeapMajiangsArray:function(heapCardDatasArray)
    {
        var heapMajiangs4D = []
        if(!majiangFactory.isShowHeap)
        {
            for(i=0;i<4;i++)
            {
                heapMajiangs4D[i] = []
            }
            return heapMajiangs4D;
        }

        for(direction=0;direction<4;direction++)//direction 0down 1right 2up 3left
        {
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

                if(cardData==HAS_DISPATCH_CARD_DATA)
                    continue

                var where = {}
                where.name = 'heap'
                where.data = {idx:j}
                var mj = majiangFactory.getOne(cardData, direction, where)
                // var pos = majiangFactory.getHeapMajiangPosAndTag(j, direction)
                // majiang.x = pos.x
                // majiang.y = pos.y
                // majiang.setLocalZOrder(pos.zOrder)
                majiangsOneDirection[j] = mj
            }
            heapMajiangs4D[direction] = majiangsOneDirection
        }

        return heapMajiangs4D
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
    getMajiangPos_flower:function(direction, data)
    {
        var posTable = majiangFactory['majiangPos'+gameKind][direction].flower
        var pos = posTable[data.idx%posTable.length]
        return pos
    },
    //flowerCardDatasArray:
    // [0x41,0x41,0x41,0x41,0x41,0x41,0x41] cardDatas数组->spr数组
    getFlowerMajiangsArray:function(flowerCardDatasArray)
    {
        var flowerMajiangs4D = []
        for(direction=0;direction<4;direction++)//direction 0down 1right 2up 3left
        {
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

                var where = {}
                where.name = 'flower'
                where.data = {idx:j}
                var mj = majiangFactory.getOne(cardData, direction, where)
                // var pos = majiangFactory.getFlowerMajiangPosAndTag(j, direction)
                // majiang.x = pos.x
                // majiang.y = pos.y
                // majiang.setLocalZOrder(pos.zOrder)
                majiangsOneDirection[j] = mj
            }
            flowerMajiangs4D[direction] = majiangsOneDirection
        }

        return flowerMajiangs4D
    },
    addFlowerMajiangs:function(flowerMajiangs, direction, cardData, parent)
    {
        var majiangs = flowerMajiangs
        var where = {}
        where.name = 'flower'
        where.data = {idx:majiangs.length}
        var mj = majiangFactory.getOne(cardData, direction, where)
        // var i = majiangs.length
        // var pos = majiangFactory.getFlowerMajiangPosAndTag(i, direction)
        // majiang.x = pos.x
        // majiang.y = pos.y
        // majiang.setLocalZOrder(pos.zOrder)

        majiangs[majiangs.length] = mj
        parent.addChild(mj)
    },  
    ///////flowerMajiangs end//////
    initFenwei:function(directionOfEast)
    {
        majiangFactory.directionOfEast = directionOfEast
    },
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////

    showChairId2Direction:function(showChairId)
    {
        return majiangFactory.showChairId2DirMap[showChairId]
    },
    serverChairId2Direction:function(serverChairId)
    {
        return majiangFactory.showChairId2DirMap[ tableData.getShowChairIdWithServerChairId(serverChairId) ]
    },
    direction2ShowChairId:function(direction)
    {
        for(var showChairId=0;showChairId<majiangFactory.showChairId2DirMap.length;showChairId++)
        {
            if(majiangFactory.showChairId2DirMap[showChairId] == direction)
                return showChairId
        }

        return null
    },
    direction2ServerChairId:function(direction)
    {
        var showChairId = majiangFactory.direction2ShowChairId(direction)
        if(typeof(showChairId) == 'number')
            return tableData.getServerChairIdWithShowChairId(showChairId) 
        return null
    },
    fenwei2Direction:function(fenwei)
    {
        return (majiangFactory.directionOfEast + fenwei)%4
    },
    direction2Fenwei:function(direction)
    {
        return (direction - majiangFactory.directionOfEast + 4)%4
    }
}
