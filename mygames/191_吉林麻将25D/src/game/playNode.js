
////先理解majiangFactory(components/majiangFactory/majiangFactory)
var playNode = 
{   
    handMajiangs4D:[],//手牌麻将精灵数组 4个方向的
    handGroupNode4D:[],//手牌麻将精灵父节点 4个方向的
    discardMajiangs4D:[],//丢弃麻将精灵数组 4个方向的
    weaveMajiangs4D:[],//吃碰杠麻将精灵数组 4个方向的
    heapMajiangs4D:[],
    flowerMajiangs4D:[],
    isLookingResult:false,
    isPlaying:false,
    isRevSence:false,
    mjTurnOver:null,
    ///////////////////////init start///////////////////////
    init:function()
    {
        playNode._registEvent()
        playNode._initCallBack()
        var node = managerRes.loadCCB(resp.playCCB, this)
        playNode.animationManager = node.animationManager
        playNode.node  = node

        playNode.scoreTTF = tableNode.scoreTTF
        playNode.laiziNode = tableNode.laiziNode
        playNode.mjsNode = tableNode.mjsNode

        majiangFactory.isShowHeap = false
        majiangFactory.isPublicAnGang = true
        majiangFactory.heapCountOneRow = 26
        majiangFactory.init(playNode.decorateMj)

        majiangFactory.isShowHeap = false

        /////currentDiscardMjNode
        var currentDiscardMjNode = new cc.Node()
        var bg = new cc.Sprite('#mf_currentDiscardMjBg.png')
        currentDiscardMjNode.addChild(bg)

        var where = {}
        where.name = 'hand'
        where.data = {idx:0}
        var mj = majiangFactory.getOne(1, 0, where)
        mj.x = 0
        mj.y = 0
        mj.isIgnoreDecorate = true
        currentDiscardMjNode.addChild(mj, 0, 101)

        currentDiscardMjNode.x = -1000
        currentDiscardMjNode.setVisible(false)
        playNode.actionNode.addChild(currentDiscardMjNode)
        
        majiangFactory.currentDiscardMjNode = currentDiscardMjNode

        /////chooseItemsNode
        majiangFactory.chooseItemsNode = new cc.Node()
        majiangFactory.chooseItemsNode.x = 600
        majiangFactory.chooseItemsNode.y = 200

        playNode.actionNode.addChild(majiangFactory.chooseItemsNode)
        playNode.timer = majiangTimer4D.getTimer()
        playNode.timerNode.addChild(playNode.timer)
        playNode.timerNode.setScale( 1 )
    },
    decorateMj:function(mj)
    {
        if(mj.isIgnoreDecorate)
            return;

        var cardData = mj.cardData 
        if( gameLogic.isMagicCard(mj.cardData, cmdBaseWorker.cbMagicCardData) ) 
        {
            var s = new cc.Sprite("#caiShen.png")
            var zi = mj.getChildByTag(101)
            if(zi)
            {
                s.x = 0.5*zi.width - 5
                s.y = 0.5*zi.height + 5
                zi.addChild(s)
            }
        }

        //设置麻将触摸
        if(mj.direction==0 && mj.where.name == 'hand')
        {
            var self = tableData.getUserWithUserId(selfdwUserID)
            var isSelfDown = self.wChairID != INVALID_WORD && tableData.getShowChairIdWithServerChairId(self.wChairID)==0
            if(isSelfDown)
            {
                if(!MAGIC_CARD_ALLOWOUT && gameLogic.isMagicCard(mj.cardData, cmdBaseWorker.cbMagicCardData))
                {
                    mj.touchEnable = false
                    mj.color = cc.color(155, 155, 155)
                }
                else
                {
                    mj.touchEnable = true
                    mj.color = cc.color(255, 255, 255)                     
                }
            }
            else
            {
                mj.touchEnable = false
                mj.color = cc.color(255, 255, 255)
            }

            var l = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "confirmTing",
            callback: function(event)
            {   
                mj.touchEnable = gameLogic.isTingCard(mj.cardData, cmdBaseWorker.tingData) 
                mj.color = mj.touchEnable?cc.color(255, 255, 255):cc.color(155, 155, 155)   
            }
            })
            cc.eventManager.addListener(l, 1)

            var l = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "cancleTing",
            callback: function(event)
            {   
                if(!MAGIC_CARD_ALLOWOUT && gameLogic.isMagicCard(mj.cardData, cmdBaseWorker.cbMagicCardData))
                {
                    mj.touchEnable = false
                    mj.color = cc.color(155, 155, 155)
                }
                else
                {
                    mj.touchEnable = true
                    mj.color = cc.color(255, 255, 255)                     
                }
            }
            })
            cc.eventManager.addListener(l, 1)
        }

        if(mj.where.name!='hand')
        {
            //麻将弹起时高亮，麻将弹下是恢复
            var l = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "handMajiangUp",
            callback: function(event)
            {   
                var cardData = event.getUserData()
                
                if(mj.cardData == cardData)
                    mj.color = cc.color(150, 150, 220)
                else
                    mj.color = cc.color(255, 255, 255)
            }
            })
            cc.eventManager.addListener(l, 1)

            var l = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "handMajiangDown",
            callback: function(event)
            {   
                var cardData = event.getUserData()
                if(mj.cardData == cardData)
                    mj.color = cc.color(255, 255, 255)
            }
            })
            cc.eventManager.addListener(l, 1)   
        }
    },
    updateCurrentRoundNode:function(currentRoundNode, userId)
    {
        var user = tableData.getUserWithUserId(userId)
        var showChairId = tableData.getShowChairIdWithServerChairId(user.wChairID)

        currentRoundNode.upTTF.setPositionY(65)

        var direction = showChairid = tableData.getShowChairIdWithServerChairId(user.wChairID)
        //设置三处四方向的麻将位置 
        if(direction==0)
        {
            currentRoundNode.scoreChange.setPosition( cc.p(100, 30) )  
        }
        else if(direction==2)
        {       
            currentRoundNode.scoreChange.setPosition( cc.p(-70, -30) )  
        } 
        else if(direction==1)
        { 
            currentRoundNode.scoreChange.setPosition( cc.p(-150, -50) )  
        }
        else if(direction==3)
        {   
            currentRoundNode.scoreChange.setPosition( cc.p(100, 30) )  
        }  
    },

    _gethandMajiangsListener:function(majiangs, parent, touchEndCall)
    {
        var currentMajiangTipsNode = new cc.Node()
        var bg = new cc.Sprite('#mf_currentMjBg.png')
        currentMajiangTipsNode.addChild(bg)

        var where = {}
        where.name = 'hand'
        where.data = {idx:0}
        var mj = majiangFactory.getOne(1, 0, where)
        mj.x = 0
        mj.y = 0
        mj.isIgnoreDecorate = true
        currentMajiangTipsNode.addChild(mj)

        currentMajiangTipsNode.x = - 1000
        currentMajiangTipsNode.y = 100 + bg.height*0.5 + 80

        parent.addChild(currentMajiangTipsNode, 1000)

        var mjOriginY = majiangs[0][0].y
        var touchPosX2TouchedMj = function(locationInNode)
        {      
            for(var i=0;i<majiangs[0].length;i++)
            {
                var mj = majiangs[0][i]
                if(locationInNode.x>mj.x-mj.width*0.5 && locationInNode.x<mj.x+mj.width*0.5 
                    && locationInNode.y>mj.y-mj.height*0.5 && locationInNode.y<mj.y+mj.height*0.5 )
                    return mj
            }

            var mj = majiangs[1]
            if(mj && locationInNode.x>mj.x-mj.width*0.5 && locationInNode.x<mj.x+mj.width*0.5
                && locationInNode.y>mj.y-mj.height*0.5 && locationInNode.y<mj.y+mj.height*0.5 )
                return mj

            return null
        }

        var lastPlayTime = null
        var playSelectEffect = function()
        {
            var nowTime = new Date().getTime()

            if(!lastPlayTime || (nowTime - lastPlayTime) > 100)
            {
                lastPlayTime = nowTime
                managerAudio.playEffect('gameRes/sound/selectcard.mp3')
            }
        }

        var currentMajiang = null
        var currentPopMajiang = null
        var touchedMjNum = 0
        var isTouchFromPop = false
        var soundId = null
        var onTouch = function(touchedMj)
        {   
            if(!currentMajiang)//刚开始触摸麻将
            {
                touchedMjNum = 1

                currentMajiang = touchedMj
                if(currentPopMajiang)
                {
                    isTouchFromPop = currentPopMajiang == currentMajiang

                    currentPopMajiang.y = mjOriginY
                    var event = new cc.EventCustom("handMajiangDown")
                    event.setUserData(currentPopMajiang.cardData)
                    cc.eventManager.dispatchEvent(event) 
                }

                currentMajiang.y = mjOriginY + 20
                var event = new cc.EventCustom("handMajiangUp")
                event.setUserData(currentMajiang.cardData)
                cc.eventManager.dispatchEvent(event) 

                //////
                currentMajiangTipsNode.x = currentMajiang.x
                currentMajiangTipsNode.y = 100 + bg.height*0.5 + 80
                mj.getChildByTag(101).setSpriteFrame('mf_' + currentMajiang.cardData + '.png') 
            }
            else if(currentMajiang && currentMajiang!=touchedMj)//摸到新的麻将 
            {
                touchedMjNum++
                playSelectEffect()

                currentMajiang.y = mjOriginY
                var event = new cc.EventCustom("handMajiangDown")
                event.setUserData(currentMajiang.cardData)
                cc.eventManager.dispatchEvent(event) 


                currentMajiang = touchedMj
                currentMajiang.y = mjOriginY + 20
                var event = new cc.EventCustom("handMajiangUp")
                event.setUserData(currentMajiang.cardData)
                cc.eventManager.dispatchEvent(event) 

                //////
                currentMajiangTipsNode.x = currentMajiang.x
                currentMajiangTipsNode.y = 100 + bg.height*0.5 + 80
                mj.getChildByTag(101).setSpriteFrame('mf_' + currentMajiang.cardData + '.png') 
            }
               
            majiangFactory.currentDiscardMjNode.setVisible(false)
            return true
        }

        var listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget()

                var locationInNode = target.convertToNodeSpace(touch.getLocation())

                var touchedMj = touchPosX2TouchedMj(locationInNode)
                if(touchedMj && touchedMj.touchEnable)
                {
                    return onTouch(touchedMj)
                }
                else
                {
                    if(currentPopMajiang)
                    {         
                        currentPopMajiang.y = mjOriginY
                        var event = new cc.EventCustom("handMajiangDown")
                        event.setUserData(currentPopMajiang.cardData)
                        cc.eventManager.dispatchEvent(event) 
                        currentPopMajiang = null
                    }

                    return false 
                }
            },
            onTouchMoved: function (touch, event) {
                var target = event.getCurrentTarget()
                var locationInNode = target.convertToNodeSpace(touch.getLocation())

                var touchedMj = touchPosX2TouchedMj(locationInNode)
                if(touchedMj && touchedMj.touchEnable)
                {
                    onTouch(touchedMj)
                }
            },
            onTouchEnded: function (touch, event) 
            {
                var target = event.getCurrentTarget()

                var locationInNode = target.convertToNodeSpace(touch.getLocation())
                
                if(isTouchFromPop && currentPopMajiang == touchPosX2TouchedMj(locationInNode) 
                && touchedMjNum==1) //单击弹出的那张麻将
                {
                    touchEndCall?touchEndCall(currentPopMajiang):''
                    currentPopMajiang = null
                    isTouchFromPop = false

                    currentMajiang.y = mjOriginY
                    var event = new cc.EventCustom("handMajiangDown")
                    event.setUserData(currentMajiang.cardData)
                    cc.eventManager.dispatchEvent(event)  
                }
                else
                {
                    currentPopMajiang = currentMajiang
                }

                currentMajiangTipsNode.x = -1000
                currentMajiang = null
                touchedMjNum = 0
                isTouchFromPop = false

                var event = new cc.EventCustom("handMajiangTouchEnd")
                cc.eventManager.dispatchEvent(event)

                majiangFactory.currentDiscardMjNode.setVisible(true)
            }
        })
            

        return listener
    },
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
                
                if (weaveItem.cbWeaveKind!=WIK_SHOWEGG)
                {
                    var majiangsOneWeave = majiangFactory.weaveItem2Majiangs(direction, weaveIdx, weaveItem, isPublicAnGang)
                    majiangsOneDirection[weaveIdx] = majiangsOneWeave
                }
                else
                {
                    var majiangsOneGroup = cmdBaseWorker.weaveItem2MajiangsEgg(majiangsOneDirection, weaveIdx, direction, weaveItem, false)
                    majiangsOneDirection[weaveIdx] = majiangsOneGroup
                }
            }
            weaveMajiangs4D[direction] = majiangsOneDirection
        }

        return weaveMajiangs4D
    },
    sendCardsAction:function(handCardDatasArray, discardCardDatasArray, weaveItemArray, heapCardDatasArray, flowerCardDatasArray)
    {   
        // flowerCardDatasArray = [ [0x41,0x42,0x43,0x44,0x45,0x46,0x47,0x48],[0x41,0x42,0x43,0x44,0x45,0x46,0x47,0x48],[0x41,0x42,0x43,0x44,0x45,0x46,0x47,0x48],[0x41,0x42,0x43,0x44,0x45,0x46,0x47,0x48] ]
        // heapCardDatasArray = [ [1,0,0,0,0,0,0,0,0,0,0,0,0,0],[],[],[] ]
        // discardCardDatasArray = [[55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,4,4,55],[55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,4,4,55],[4,4,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55],[55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55]]
        // weaveCardDatasArray = [[[1,2,3,4],[2,3,4],[4,5,6],[7,8,1]],[],[[1,2,3],[2,3,4,5],[4,5,6],[7,8,1]],[]]
        var self = tableData.getUserWithUserId(selfdwUserID)
        var selfDir = tableData.getShowChairIdWithServerChairId(self.wChairID)

        playNode.flowerMajiangs4D = majiangFactory.getFlowerMajiangsArray(flowerCardDatasArray)
        playNode.heapMajiangs4D = majiangFactory.getHeapMajiangsArray(heapCardDatasArray)
        playNode.handMajiangs4D = majiangFactory.getHandMajiangsArray(handCardDatasArray, tableData.getUserWithUserId(selfdwUserID).wChairID == INVALID_WORD)
        playNode.discardMajiangs4D = majiangFactory.getDiscardMajiangsArray(discardCardDatasArray)
        playNode.weaveMajiangs4D = playNode.getWeaveMajiangsArray(weaveItemArray, selfDir)

        playNode._getHandMajiangsGroupNode()

        var self = tableData.getUserWithUserId(selfdwUserID)
        for(var showChairid=0;showChairid<4;showChairid++)
        {
            var direction = showChairid
            var chairid = tableData.getServerChairIdWithShowChairId(direction)

            var user = tableData.getUserWithTableIdAndChairId(self.wTableID, chairid)

            var flowerMajiangs = playNode.flowerMajiangs4D[direction]
            for(var j=0;j<flowerMajiangs.length;j++)
            {
                var mj = flowerMajiangs[j]
                playNode.mjsNode.addChild(mj)
            }

            var heapMajiangs = playNode.heapMajiangs4D[direction]
            for(var j=0;j<heapMajiangs.length;j++)
            {
                var mj = heapMajiangs[j]
                if(mj)
                    playNode.mjsNode.addChild(mj)
            }

            var discardMajiangs = playNode.discardMajiangs4D[direction]
            for(var j=0;j<discardMajiangs.length;j++)
            {
                var mj = discardMajiangs[j]
                playNode.mjsNode.addChild(mj)
            }

            var handMajiangs = playNode.handMajiangs4D[direction]
            var oldMajiangs = handMajiangs[0]
            for(var j=0;j<oldMajiangs.length;j++)
            {
                var mj = oldMajiangs[j]
                playNode.mjsNode.addChild(mj)
            }
            var newMajiangs = handMajiangs[1]
            if(newMajiangs)
                playNode.mjsNode.addChild(newMajiangs)

            var weaveMajiangs = playNode.weaveMajiangs4D[direction]
            for(var weaveIdx=0;weaveIdx<weaveMajiangs.length;weaveIdx++)
            {
                var weave = weaveMajiangs[weaveIdx]
                for(var idxInWeave=0;idxInWeave<weave.length;idxInWeave++)
                {
                    var mj = weave[idxInWeave]
                    playNode.mjsNode.addChild(mj)
                }
            }

            // handMajiangsNode.addChild(playNode.handWeaveNode4D[direction])
        }

    },
    _showSprsOnGameEnd:function()
    {

        for(var showChairid=0;showChairid<4;showChairid++)
        {
            var direction = showChairid
            var wChairID = tableData.getServerChairIdWithShowChairId(showChairid)
           
            var cardDatas = clone(cmdBaseWorker.cbHandCardData[wChairID])
            if( cmdBaseWorker.dwChiHuKind[wChairID] == WIK_CHI_HU
                && cmdBaseWorker.cbProvideCardData != INVALID_CARD_DATA )
                cardDatas[cardDatas.length] = cmdBaseWorker.cbProvideCardData 

            var handMajiangs = playNode.handMajiangs4D[direction]
            var majiangs = handMajiangs[0]
            if(handMajiangs[1])
                majiangs[majiangs.length] = handMajiangs[1]

            for(var j=0;j<majiangs.length;j++)
            {
                var mj = majiangs[j]
                var where = {}
                where.name = 'handshow'
                where.data = mj.where.data
                mj.where = where
                mj.cardData = cardDatas[j]
                var pos = majiangFactory.getMajiangPos(mj.direction, mj.where)
                // majiangFactory.updateMajiang(mj, pos)
                var styleId = styleArray[0]
                var t = ['d_','r_','u_','l_']
                var frameName = 's' + styleId + '_' + t[mj.direction] + mj.where.name + (mj.cardData==0?'0':'Bg') + pos.frame + '.png'  
                majiangFactory.updateMajiang(mj, frameName, pos)
            }
        }
    },
    popGameEnd:function(continueCall, userData_gameEnd)
    {
        var control = {}
        control.continueCall = function()
        {
            majiangFactory.hideCurrentDiscardMj()
            continueCall()
            node.removeFromParent()
        }
        var node  = managerRes.loadCCB(resp.gameEndPopCCB, control)
        playNode.gameEndControl = control
        control.gendTitle.setSpriteFrame('gendTitle'+cmdBaseWorker.endType + '.png')

        for (var i = 0; i < GAME_PLAYER; i++)
            control['baozhuangLabel'+i].setVisible(false)

        var isTianDiHu = false
        if ((cmdBaseWorker.dwChiHuRight[cmdBaseWorker.wWinner] & CHR_TianHu) || (cmdBaseWorker.dwChiHuRight[cmdBaseWorker.wWinner] & CHR_DiHu))
            isTianDiHu = true

        for(var showChairid=0;showChairid<4;showChairid++)
        {
            var direction = showChairid
            var wChairID = tableData.getServerChairIdWithShowChairId(showChairid)

            var gendBar = control['gendBar'+wChairID]
            var headNode = control['headNode'+wChairID]
            var handCardNode = control['handCardNode'+wChairID]
            var flowerCardNode = control['flowerCardNode'+wChairID]
            var resultTTF = control['resultTTF'+wChairID]
            //头像
            var headIcon = new cc.Sprite('#headIcon.png')
            var hnode = getRectNodeWithSpr(headIcon)
            // hnode.x = 70
            // hnode.y = 60
            var url = userData_gameEnd[wChairID].szHeadImageUrlPath
            if(url)
            { 
                (function(headIcon, url)
                {
                    cc.loader.loadImg(url, {isCrossOrigin : false}, function(err,img){
                            var texture2d = new cc.Texture2D()
                            texture2d.initWithElement(img)
                            texture2d.handleLoadedTexture()

                            var frame = new cc.SpriteFrame(texture2d, cc.rect(0, 0, texture2d.getContentSize().width, texture2d.getContentSize().height))
                            headIcon.setSpriteFrame(frame)
                    })
                }(headIcon, url))
            }

            var userName = getLabel(14, 90, 2)
            userName.setFontFillColor( cc.color(255, 255, 255, 255) )
            userName.x = 0
            userName.y = 52
            userName.setStringNew(userData_gameEnd[wChairID].szNickName)
            hnode.addChild(userName)   

            headNode.addChild(hnode)

            var dir = (wChairID-cmdBaseWorker.wBankerUser+GAME_PLAYER)%4
            var dirSpr = new cc.Sprite('#gendDir' + dir + '.png')
            dirSpr.x = 32-13
            dirSpr.y = 32-13
            hnode.addChild(dirSpr)   

            if(wChairID == cmdBaseWorker.wBankerUser)
            {
                var bankerSpr = new cc.Sprite('#gendIcon_banker.png')
                bankerSpr.x = -32
                bankerSpr.y = 32
                hnode.addChild(bankerSpr)   
            }

            var isZiMo = cmdBaseWorker.wProvideUser == cmdBaseWorker.wWinner 

            //胡型
            var chrStr = ''
            chrStr += ' 杠分 ('+cmdBaseWorker.lGangScore[wChairID]+'分)'
            chrStr += ' '
            if(cmdBaseWorker.dwChiHuKind[wChairID] == WIK_CHI_HU && isTianDiHu==false)
            {
                if (cmdBaseWorker.cbWinType == 1)
                {
                    chrStr += ' 自摸'+' (1番)'
                    chrStr += ' '
                }
                else if (cmdBaseWorker.cbWinType == 2)
                {
                    chrStr += ' 自摸'+' (1番)'
                    chrStr += ' '
                    chrStr += ' 摸宝'+' (1番)'
                    chrStr += ' '
                }
                else if (cmdBaseWorker.cbWinType == 3)
                {
                    chrStr += ' 自摸'+' (1番)'
                    chrStr += ' '
                    chrStr += ' 对宝'+' (2番)'
                    chrStr += ' '
                }

                if (wChairID == cmdBaseWorker.wBankerUser)
                {
                    chrStr += ' 坐庄胡'+' (1番)'
                    chrStr += ' '
                }
            }

            if(isZiMo == false && wChairID==cmdBaseWorker.wProvideUser)
            {
                chrStr += ' 点炮'+' (1番)'
                chrStr += ' '
            }

            for (var i = 0; i < map_mask2Name.length; i++) 
            {
                var chr_type = window[ map_mask2Name[i][0] ] 
                if (cmdBaseWorker.dwChiHuRight[wChairID] & chr_type)
                {
                    chrStr += map_mask2Name[i][1];
                    chrStr += ' '
                }
            }

            resultTTF.setString(chrStr)
            //显示麻将
            var cardNode = new cc.Node()
            cardNode.width = 1200
            cardNode.height = 120

            var weaveItems = cmdBaseWorker.WeaveItemArray[wChairID]
            var weaveLen = 0
            for(var weaveIdx=0;weaveIdx<weaveItems.length;weaveIdx++)
            {
                var weaveItem = weaveItems[weaveIdx]
                if(weaveItem.cbWeaveKind == WIK_NULL)
                    continue
                weaveLen++
                weaveItem.wProvideUser = tableData.getServerChairIdWithShowChairId(0)//这样就不显示箭头了
                //var majiangsOneWeave = cmdBaseWorker.weaveItem2Majiangs(0, weaveIdx, weaveItem, true)
                if (weaveItem.cbWeaveKind!=WIK_SHOWEGG)
                {
                    var majiangsOneWeave = majiangFactory.weaveItem2Majiangs(0, weaveIdx, weaveItem, true)
                    //majiangsOneDirection[weaveIdx] = majiangsOneWeave
                }
                else
                {
                    var majiangsOneWeave = cmdBaseWorker.weaveItem2MajiangsEgg(null, weaveIdx, 0, weaveItem, true)
                    //majiangsOneDirection[weaveIdx] = majiangsOneWeave
                }

                for(var idxInWeave=0;idxInWeave<majiangsOneWeave.length;idxInWeave++)
                {
                    var mj = majiangsOneWeave[idxInWeave]
                    cardNode.addChild(mj)
                }
            }

            //手牌            
            var oldHandCardDatas = clone(cmdBaseWorker.cbHandCardData[wChairID])
            var newGetCardData = null
            if(oldHandCardDatas.length + weaveLen*3 == MAX_COUNT)
            {
                if( cmdBaseWorker.dwChiHuKind[wChairID] == WIK_CHI_HU
                && cmdBaseWorker.cbProvideCardData != INVALID_CARD_DATA )
                {
                    for(var j=0;j<oldHandCardDatas.length;j++)
                    {
                        if(oldHandCardDatas[j] == cmdBaseWorker.cbProvideCardData)
                        {
                            newGetCardData = oldHandCardDatas.splice(j, 1)[0]
                            break
                        }
                    }
                }
                else
                    newGetCardData = oldHandCardDatas.splice(oldHandCardDatas.length-1, 1)[0]
            }
            else if( cmdBaseWorker.dwChiHuKind[wChairID] == WIK_CHI_HU
                && cmdBaseWorker.cbProvideCardData != INVALID_CARD_DATA )
                newGetCardData = cmdBaseWorker.cbProvideCardData 

            var handCardDatasArray = [ [oldHandCardDatas, newGetCardData] ]
            var handMajiangs= majiangFactory.getHandMajiangsArray(handCardDatasArray, false, true)[0]
            for(var i=0;i<handMajiangs[0].length;i++)
            {
                cardNode.addChild(handMajiangs[0][i])
            }
            if(handMajiangs[1])
            {
                cardNode.addChild(handMajiangs[1])
                handMajiangs[1].color = cc.color(188, 255, 188)
            }
 
            cardNode.scaleX = handCardNode.width/cardNode.width
            cardNode.scaleY = handCardNode.height/cardNode.height
            cardNode.x = -4
            cardNode.y = 0
            handCardNode.addChild(cardNode)
            // //花牌
            var cardNode = new cc.Node()
            cardNode.width = 1200
            cardNode.height = 46

            var flowerCardDatas = cmdBaseWorker.cbPlayerFlowerCardData[wChairID]

            var flowerCardDatasArray = [ flowerCardDatas ]
            var flowerMajiangs= majiangFactory.getFlowerMajiangsArray(flowerCardDatasArray)[0]
            for(var i=0;i<flowerMajiangs.length;i++)
            {
                cardNode.addChild(flowerMajiangs[i])
            }
            cardNode.scaleX = flowerCardNode.width/cardNode.width
            cardNode.scaleY = flowerCardNode.height/cardNode.height
            cardNode.x = -68
            cardNode.y = -85
            flowerCardNode.addChild(cardNode)
            /////////
            if(wChairID==cmdBaseWorker.wExitUser)
                control['winflag'+wChairID].setSpriteFrame('gendFlag0.png') 
            else if(cmdBaseWorker.dwChiHuKind[wChairID] == WIK_CHI_HU)
                control['winflag'+wChairID].setSpriteFrame('gendFlag1.png') 
            else if(wChairID==cmdBaseWorker.wProvideUser)
            {
                if (cmdBaseWorker.isBaoZhuang == true)
                    control['baozhuangLabel'+wChairID].setVisible(true)
                control['winflag'+wChairID].setSpriteFrame('gendFlag2.png') 
            }
            else
                control['winflag'+wChairID].setSpriteFrame('empty.png') 
  

            control['fenTTF'+wChairID].setString((cmdBaseWorker.lGameScore[wChairID]>0?'+':'') + cmdBaseWorker.lGameScore[wChairID]) 
        }
       
        mainScene.top.addChild(node) 
    },
    showLaizi:function()
    {

    },
    playAnimationWithDirection:function(name, direction, call)
    {
        if(!isOpenEffect)
        {
            call?call():''
            return; 
        }

        var spr = actionFactory.getSprWithAnimate(name + '_', true, 0.15, call)
        playNode.actionNode.addChild(spr)

        var pos = majiangFactory.getActionPlayNodePos(direction)
        spr.x = pos.x
        spr.y = pos.y
    },
    setCurrentRoundNodesVisible:function(isVisible)
    {
        var users = tableData.getUsersInTable( tableData.getUserWithUserId(selfdwUserID).wTableID )
        for(var i in users)
        {
            users[i].userNodeInsetChair.currentRoundNode.setVisible(isVisible)
        }
    },
    onReStart:function()
    {
        playNode.handMajiangs4D = []
        playNode.mjsNode = []
        playNode.discardMajiangs4D = []
        playNode.weaveMajiangs4D = []
        playNode.isLookingResult = false
        playNode.isPlaying = false
        majiangFactory.isPublicAnGang = false

        cocos.clearInterval(playNode.updateOnFree, playNode.node)
    },
    initCurrentRoundNode:function(currentRoundNode)
    {
        //currentRoundNode是绑定在chair上的一个节点 用于存放当前轮用到的节点
        
        currentRoundNode.flowerMajiangsNode = new cc.Node()
        currentRoundNode.addChild( currentRoundNode.flowerMajiangsNode )

        currentRoundNode.heapMajiangsNode = new cc.Node()
        currentRoundNode.addChild( currentRoundNode.heapMajiangsNode )

        //单个方向的丢弃麻将精灵父节点
        currentRoundNode.discardMajiangsNode = new cc.Node()
        currentRoundNode.addChild( currentRoundNode.discardMajiangsNode)

        //单个方向的听牌父节点
        currentRoundNode.tingNode = new cc.Node()
        currentRoundNode.addChild( currentRoundNode.tingNode)

        //单个方向的吃碰杠麻将精灵父节点
        currentRoundNode.weaveMajiangsNode = new cc.Node()
        currentRoundNode.addChild( currentRoundNode.weaveMajiangsNode )

        //单个方向的手牌麻将精灵父节点 的 父节点
        currentRoundNode.handMajiangsNode = new cc.Node()
        currentRoundNode.addChild( currentRoundNode.handMajiangsNode )

        currentRoundNode.scoreChange = new cc.Node()
        currentRoundNode.addChild( currentRoundNode.scoreChange, 10)   

        currentRoundNode.upTTF = cc.LabelTTF.create('', "Helvetica", 16)
        currentRoundNode.upTTF.setFontFillColor( cc.color(242, 226, 142, 255) )
        currentRoundNode.upTTF.enableStroke(cc.color(0, 0, 0, 255), 2)
        currentRoundNode.upTTF.anchorY = 0
        currentRoundNode.addChild( currentRoundNode.upTTF )   
    },
    clearCurrentRoundNode:function(currentRoundNode)
    {           
        //一轮结束 clearCurrentRoundNode
        currentRoundNode.tingNode.removeAllChildren()
        currentRoundNode.handMajiangsNode.removeAllChildren()
        currentRoundNode.discardMajiangsNode.removeAllChildren()
        currentRoundNode.weaveMajiangsNode.removeAllChildren()
        currentRoundNode.heapMajiangsNode.removeAllChildren()
        currentRoundNode.flowerMajiangsNode.removeAllChildren()
        currentRoundNode.scoreChange.removeAllChildren()
        currentRoundNode.upTTF.setString('')
    },
    _registEvent:function() 
    {
        var l = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "userNodeInsetChairInit",
            callback: function(event)
            {   
                var currentRoundNode = new cc.Node()
                playNode.initCurrentRoundNode(currentRoundNode)
                //////
                var userNodeInsetChair = event.getUserData()
                userNodeInsetChair.addChild(currentRoundNode)
                userNodeInsetChair.currentRoundNode = currentRoundNode  
            }
        })
        cc.eventManager.addListener(l, 1)

        var l = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "userNodeInsetChairUpdate",
            callback: function(event)
            {   
                var data = event.getUserData()
                var currentRoundNode = data[0].currentRoundNode
                var userId = data[1]
                playNode.updateCurrentRoundNode(currentRoundNode, userId)   
            }
        })
        cc.eventManager.addListener(l, 1)

        var l = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "cmdEvent",
            callback: function(event)
            {   
                var data = event.getUserData()
                var callFunName = data[0]
                playNode[callFunName]()
            }
        })
        cc.eventManager.addListener(l, 1)
    },
    getAfterChiForbidCard:function(provideIdx, action)
    {
    },
    _initCallBack:function()
    {   
        //林州规则：
        playNode.minusCall1 = function()
        {
            var s = playNode.gamesetTTF1.getString()
            s = parseInt(s)
            playNode.gamesetTTF1.setString( s==0?0:(s-1) )
        }

        playNode.plusCall1 = function()
        {
            var s = playNode.gamesetTTF1.getString()
            s = parseInt(s)
            playNode.gamesetTTF1.setString( s==2?2:(s+1) )
        }

        playNode.minusCall2 = function()
        {
            var s = playNode.gamesetTTF2.getString()
            s = parseInt(s)
            playNode.gamesetTTF2.setString( s==0?0:(s-1) )
        }

        playNode.plusCall2 = function()
        {
            var s = playNode.gamesetTTF2.getString()
            s = parseInt(s)
            playNode.gamesetTTF2.setString( s==2?2:(s+1) )
        }

        playNode.gamesetSureCall = function()
        {
            var call = getObjWithStructName('CMD_C_Call')
            call.cbMoPao = 1
            socket.sendMessage(MDM_GF_GAME,SUB_C_CALL,call)

            playNode.gamesetNode.setVisible(false)
        }

        playNode.gamesetSureCancel = function()
        {
            var call = getObjWithStructName('CMD_C_Call')
            call.cbMoPao = 0
            socket.sendMessage(MDM_GF_GAME,SUB_C_CALL,call)

            playNode.gamesetNode.setVisible(false)
        }

        playNode.actionCall_chi = function()
        {
            var btn = playNode.btn_chi
            var actions = btn.actions
            var provideIdx = cmdBaseWorker.cbProvideCardData

            var sendChi = function(sortedOperateIdxs, action)
            {
                var operateIdxs = cmdBaseWorker.sortedOperateIdxs2OperateIdxs(provideIdx, sortedOperateIdxs)
                cmdBaseWorker.sendMessage_chi(operateIdxs, action)
                playNode.hideActionBtns()

                playNode.getAfterChiForbidCard(provideIdx, action)
            }

            if(actions.length>1)
            {
                playNode.btn_chi.setVisible(false)
                playNode.btn_peng.setVisible(false)
                playNode.btn_gang.setVisible(false)
                playNode.btn_ting.setVisible(false)
                playNode.btn_hu.setVisible(false)
                playNode.btn_egg.setVisible(false)

                var idxsArray = []
                for(var i=0;i<actions.length;i++)
                {
                    idxsArray[i] = cmdBaseWorker.getSortedOperateIdxs(provideIdx, actions[i])
                }

                majiangFactory.showChoosePopOfAction(idxsArray, actions, sendChi)
            }
            else
            {
                var sortedOperateIdxs = cmdBaseWorker.getSortedOperateIdxs(provideIdx, actions[0])
                sendChi(sortedOperateIdxs, actions[0])
            }
        }
        playNode.actionCall_egg = function()
        {
            var sendShowEgg = function(sortedOperateIdxs)
            {
                cmdBaseWorker.sendMessage_ShowEgg(sortedOperateIdxs)
                playNode.hideActionBtns()
            }

            //判断egg选项个数
            var selfChairId = tableData.getUserWithUserId(selfdwUserID).wChairID
            var direction = tableData.getShowChairIdWithServerChairId(selfChairId)
            var idxs = cmdBaseWorker.searchEggIdxs(playNode.handMajiangs4D[direction], playNode.weaveMajiangs4D[direction])
           
            gameLog.log("actionCall_egg结果:::", idxs)
            if(idxs.length>1)
            {
                playNode.btn_chi.setVisible(false)
                playNode.btn_peng.setVisible(false)
                playNode.btn_gang.setVisible(false)
                playNode.btn_ting.setVisible(false)
                playNode.btn_egg.setVisible(false)
                playNode.btn_hu.setVisible(false)

                var idxsArray = []
                var actions = []
                for(var i=0;i<idxs.length;i++)
                {
                    idxsArray[i] = idxs[i]
                    actions[i] = WIK_SHOWEGG
                }
                cmdBaseWorker.showChoosePopOfAction(idxsArray, actions, sendShowEgg)
            }
            else
            {
                sendShowEgg(idxs[0])
            }
        }
        playNode.actionCall_peng = function()
        {
            var btn = playNode.btn_peng
            cmdBaseWorker.sendMessage_peng([cmdBaseWorker.cbProvideCardData, cmdBaseWorker.cbProvideCardData, cmdBaseWorker.cbProvideCardData] )
            playNode.hideActionBtns()
        }

        playNode.actionCall_gang = function()
        {
            var btn = playNode.btn_gang

            var sendGang = function(sortedOperateIdxs)
            {
                cmdBaseWorker.sendMessage_gang(sortedOperateIdxs)
                playNode.hideActionBtns()
            }

            //吃碰后cmdBaseWorker.wProvideUser == INVALID_CHAIR 或自摸 都要searchGangIdxs
            if(cmdBaseWorker.wProvideUser == INVALID_CHAIR || cmdBaseWorker.wProvideUser == tableData.getUserWithUserId(selfdwUserID).wChairID) 
            {
                var selfChairId = tableData.getUserWithUserId(selfdwUserID).wChairID
                var direction = tableData.getShowChairIdWithServerChairId(selfChairId)
                var idxs = cmdBaseWorker.searchGangIdxs(playNode.handMajiangs4D[direction], playNode.weaveMajiangs4D[direction])
                if(idxs.length>1)
                {
                    playNode.btn_chi.setVisible(false)
                    playNode.btn_peng.setVisible(false)
                    playNode.btn_gang.setVisible(false)
                    playNode.btn_ting.setVisible(false)
                    playNode.btn_hu.setVisible(false)
                    playNode.btn_egg.setVisible(false)

                    var idxsArray = []
                    var actions = []
                    for(var i=0;i<idxs.length;i++)
                    {
                        idxsArray[i] = [idxs[i], idxs[i], idxs[i], idxs[i]]
                        actions[i] = WIK_GANG
                    }
                    majiangFactory.showChoosePopOfAction(idxsArray, actions, sendGang)
                }
                else
                {
                    sendGang([idxs[0], idxs[0], idxs[0], idxs[0]])
                }
            }
            else
            {   
                sendGang([cmdBaseWorker.cbProvideCardData, cmdBaseWorker.cbProvideCardData, cmdBaseWorker.cbProvideCardData, cmdBaseWorker.cbProvideCardData])
            }
        }

        playNode.actionCall_ting = function()
        {
            //alert('actionCall_ting')
            var btn = playNode.btn_ting
            cmdBaseWorker.sendMessage_Ting([cmdBaseWorker.cbProvideCardData])
            playNode.hideActionBtns()
        }

        playNode.actionCall_hu = function()
        {
            var btn = playNode.btn_hu
            cmdBaseWorker.sendMessage_hu([cmdBaseWorker.cbProvideCardData])
            playNode.hideActionBtns()
        }

        playNode.actionCall_guo = function()
        {
            var btn = playNode.btn_guo
            cmdBaseWorker.sendMessage_guo()
            playNode.hideActionBtns()  
            majiangFactory.chooseItemsNode.removeAllChildren() 
        }

        playNode.actionCall_replace = function()//不需要玩家手动触发 只要收到这个动作 自动执行
        {
            alert('actionCall_replace')  
        }
    },
    ///////////////////////init end///////////////////////

    ///////////////cmdEvent start//////////
    updateOnFree:function()
    {
        var users = tableData.getUsersInTable(tableData.getUserWithUserId(selfdwUserID).wTableID)
        if(!playNode.isLookingResult)
        {
            if(tableData.getUserWithUserId(selfdwUserID).cbUserStatus == US_SIT)
                socket.sendMessage(MDM_GF_FRAME, SUB_GF_USER_READY)
        }
    },
    onCMD_StatusFree:function() 
    {
        playNode.isPlaying = false
        playNode.isRevSence = true

        cocos.setInterval(playNode.updateOnFree, 1000, playNode.node)

        if (typeSelNode.haveSetGameType == false)
            typeSelNode.userUpdate()

        if (cmdBaseWorker.cbGameType == 0)
            tableNode.gameTypeTTF.setString("16 番")
        else if (cmdBaseWorker.cbGameType == 1)
            tableNode.gameTypeTTF.setString("32 番")

        typeSelNode.startBtnEnabled()
    },
    onCMD_StatusCall:function()
    {
        playNode.isPlaying = true
        playNode.isRevSence = true

        tableNode.setBankerIcon(cmdBaseWorker.wBankerUser, true)
        var selfChairId = tableData.getUserWithUserId(selfdwUserID).wChairID
        for (var i=0;i<GAME_PLAYER;i++)
        {
            if(cmdBaseWorker.cbCallRecord[i][0] == INVALID_BYTE)
            {
                if(selfChairId == i)
                    playNode.showGameset()
            }
        }
    },
    onCMD_StatusPlay:function() 
    {
        playNode.isPlaying = true

        tableNode.setBankerIcon(cmdBaseWorker.wBankerUser, true)
        playNode.scoreTTF.setString(cmdBaseWorker.cbLeftCardCount)

        typeSelNode.startBtnEnabled()

        if (typeSelNode.haveSetGameType == false)
            typeSelNode.userUpdate()

        //初始化Idx2ScoreMap
        var idxs = []
        var scores = []
        var magicCardData = cmdBaseWorker.cbMagicCardData 
        for(var i=0;i<magicCardData.length;i++)
        {
            if(magicCardData[i] == INVALID_CARD_DATA)
                break
            idxs[idxs.length] = magicCardData[i]
            scores[scores.length] = -1000+magicCardData[i]
        }
        idxs[idxs.length] = REPLACE_CARD_DATA
        scores[scores.length] = magicCardData[0]
        majiangFactory.initCardData2ScoreMap( idxs, scores )

        playNode.timer.initFenwei( tableData.getShowChairIdWithServerChairId(cmdBaseWorker.cbEastUser) )
        // playNode.timer.initFenwei( tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wBankerUser) )
        playNode.timer.switchTimer(cmdBaseWorker.wCurrentUser==INVALID_WORD?[]:[tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wCurrentUser)])
        playNode.timerNode.setVisible(true)

        var self = tableData.getUserWithUserId(selfdwUserID)

        /////吃碰杠胡
        var sortedActions = cmdBaseWorker.getSortedActionsWithMask(cmdBaseWorker.cbActionMask)
        var isActioning = sortedActions.length>0
        if(isActioning && self.cbUserStatus == US_PLAYING)
            playNode.showActionBtns(sortedActions)

        if (cmdBaseWorker.cbGameType == 0)
            tableNode.gameTypeTTF.setString("16 番")
        else if (cmdBaseWorker.cbGameType == 1)
            tableNode.gameTypeTTF.setString("32 番")

        var handIdxsArray = [[[], null], [[], null], [[], null], [[], null]]
        var discardIdxsArray = [[],[],[],[]]
        var weaveItemArray = [[],[],[],[]]

        for(var i=0;i<GAME_PLAYER;i++)
        {
            var direction = tableData.getShowChairIdWithServerChairId(i)
            var weaveItems = cmdBaseWorker.WeaveItemArray[i]
            //组合牌
            for(var j=0;j<MAX_WEAVE;j++)
            {
                var t = weaveItems[j].cbCardDatas
                weaveItems[j].cbCardDatas = cmdBaseWorker.sortWeaveIdxs(weaveItems[j].cbWeaveKind, t)

                weaveItems[j].provideDirection = tableData.getShowChairIdWithServerChairId(weaveItems[j].wProvideUser)
            }
            weaveItemArray[direction] = weaveItems

            var idxs = []
            for(var j=0;j<MAX_COUNT;j++)
            {
                idxs[j] = 0
            }
            var handIdxs = cmdBaseWorker.cbHandCardData[i]
            if(cmdBaseWorker.cbHandCardCount[i] + cmdBaseWorker.cbWeaveCount[i]*3 == MAX_COUNT)
            {
                handIdxsArray[direction][0] = handIdxs.slice(0, handIdxs.length-1)
                handIdxsArray[direction][1] = handIdxs[handIdxs.length-1]
            }
            else
                handIdxsArray[direction][0] = handIdxs

            discardIdxsArray[direction] = cmdBaseWorker.cbDiscardCardData[i].slice(0, cmdBaseWorker.cbDiscardCount[i])
        }
        // console.log(6666, handIdxsArray, discardIdxsArray, weaveItemArray)
        cmdBaseWorker.sortHandIdxs(handIdxsArray[0][0]) 

        // get heapIdxsArray
        var heapIdxsArray = majiangFactory.getHeapCardDatasArray(cmdBaseWorker.cbHeapCardInfo, cmdBaseWorker.TurnoverCard)
        heapIdxsArray[tableData.getShowChairIdWithServerChairId(cmdBaseWorker.TurnoverCard[0].wHeapDir)][cmdBaseWorker.TurnoverCard[0].wHeapPos] = 0      
        playNode.sendCardsAction(handIdxsArray, discardIdxsArray, weaveItemArray, heapIdxsArray, cmdBaseWorker.cbPlayerFlowerCardData) 

        var isHaveTing = false
        for (var k = 0; k < GAME_PLAYER; k++)
        {
            if (cmdBaseWorker.cbTingUser[k] != 0)
            {
                isHaveTing = true
                break
            }
        }

        if (cmdBaseWorker.cbTingUser[self.wChairID] != 0 && cmdBaseWorker.bLookedBao[self.wChairID] == true)
        {
            playNode.setBaoHeap(0)
            playNode.setBaoHeap(cmdBaseWorker.TurnoverCard[0].cbCardData)
        }
        else if (isHaveTing)
            playNode.setBaoHeap(0)

        for (var i = 0; i < GAME_PLAYER; i++)
        {
            if (cmdBaseWorker.cbTingUser[i] != 0)
                cmdBaseWorker.userTing(i)
        }
        
        if(isActioning == false && cmdBaseWorker.isAutoDisCard == true && cmdBaseWorker.cbTingUser[self.wChairID] != 0)
            cmdBaseWorker.autoDisCard(cmdBaseWorker.cbTingUserRev[self.wChairID])
        else if (cmdBaseWorker.isAutoDisCard2 == true && isActioning == false)
            cmdBaseWorker.autoDisCard(0x12)

        if(cmdBaseWorker.wOutCardUser!=INVALID_WORD)
        {
            var d = tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wOutCardUser)
            majiangFactory.setCurrentDiscardMj(playNode.discardMajiangs4D, d) 
        }
    },
    onCMD_Call:function()
    {
    },
    onCMD_GameStart:function() 
    {
        if(!playNode.isPlaying)//有的游戏有call状态
        {
            cocos.clearInterval(playNode.updateOnFree, playNode.node)
            playNode.isPlaying = true

            if(playNode.isLookingResult)
            {
                playNode.resetPlayNode()
            } 
        }

        cmdBaseWorker.isShowEggTime = false
        cmdBaseWorker.isLastFourCard = false
        cmdBaseWorker.cbUserTingMode = 1
        //初始化Idx2ScoreMap
        var idxs = []
        var scores = []
        var magicCardData = cmdBaseWorker.cbMagicCardData 
        for(var i=0;i<magicCardData.length;i++)
        {
            if(magicCardData[i] == INVALID_CARD_DATA)
                break
            idxs[idxs.length] = magicCardData[i]
            scores[scores.length] = -1000+magicCardData[i]
        }
        idxs[idxs.length] = REPLACE_CARD_DATA
        scores[scores.length] = magicCardData[0]
        majiangFactory.initCardData2ScoreMap( idxs, scores )

        var self = tableData.getUserWithUserId(selfdwUserID)

        tableNode.setBankerIcon(cmdBaseWorker.wBankerUser, true)

        //get handIdxsArray
        var handIdxsArray = []
        for(var i=0;i<GAME_PLAYER;i++)
        {
            var direction = i
            var serverChairid = tableData.getServerChairIdWithShowChairId(direction)

            var idxs = []
            for(var ii=0;ii<MAX_COUNT;ii++)
            {
                idxs[ii] = 0
            }
            if(serverChairid==self.wChairID)
                idxs = cmdBaseWorker.cbHandCardData[serverChairid]

            var oldIdxs = idxs.slice(0, MAX_COUNT-1)
            handIdxsArray[direction] = [oldIdxs, null]
        }
        cmdBaseWorker.sortHandIdxs(handIdxsArray[0][0]) 

        //get heapIdxsArray 
        var heapIdxsArray = majiangFactory.getHeapCardDatasArray(cmdBaseWorker.cbHeapCardInfo, cmdBaseWorker.TurnoverCard) 
        playNode.sendCardsAction(handIdxsArray, [[],[],[],[]], [[],[],[],[]], heapIdxsArray, []) 

        playNode.setCurrentRoundNodesVisible(false)
        playNode.actionBtns.setVisible(false)
        managerTouch.closeTouch() //避免在不知道牌的情况下 把牌打出去
        var bankerShowChairid = tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wBankerUser)
        playNode.setCurrentRoundNodesVisible(false)
        playNode.actionNode.setVisible(false)
        playNode.mjsNode.setVisible(false)

        //提前保存可能被破坏的数据  掷骰子是庄家出牌破坏数据 因为可能庄家筛子先出完
        function gameStart()
        {
            playNode.showLaizi()
            playNode.timer.initFenwei( bankerShowChairid )
            playNode.timerNode.setVisible(true)
            playNode.setCurrentRoundNodesVisible(true)
            playNode.actionNode.setVisible(true)
            playNode.actionBtns.setVisible(true)
            playNode.mjsNode.setVisible(true)            
            managerTouch.openTouch()
        }

        function bankerPlayDice(cbSlice, call)
        { //抓牌方位
            var siceNum1 = getRandNum(Math.max(cbSlice-6, 1), Math.min(cbSlice-1, 6))
            var siceNum2 = cbSlice - siceNum1
            playNode.playDiceOneDirection(call, siceNum1, siceNum2, bankerShowChairid)
        }

        var a = cc.sequence( 
            cc.callFunc(function()
            {   
                bankerPlayDice(cmdBaseWorker.cbSiceCount, '')
            }),
            cc.delayTime(2.1),
            cc.callFunc(function()
            {   
                bankerPlayDice(cmdBaseWorker.cbCaiShenPos, gameStart)
            }) 
        )           
        playNode.node.runAction(a)
    },
    onCMD_OutCard:function() 
    {
        var outUser = tableData.getUserWithChairId(cmdBaseWorker.wOutCardUser)
        var outDir = tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wOutCardUser)  
        var outIdx = cmdBaseWorker.cbOutCardData

        if (cmdBaseWorker.isShowEggTime == true)
        {
            playNode.hideActionBtns()
            cmdBaseWorker.cbFiveSTime = true
        }

        playNode.timer.switchTimer([])
        playNode.playMajiangEffect(outIdx, outUser.cbGender)
        managerAudio.playEffect('gameRes/sound/discard.mp3')

        var majiangs = playNode.handMajiangs4D[outDir]
        if(outUser.dwUserID==selfdwUserID)
        {
            majiangFactory.deleteHandMajiangs(majiangs, outDir, outIdx)
            var newMj = majiangs[1]
            if(newMj)
            {
                majiangFactory.insertHandMajiangsOld(majiangs, outDir, newMj.cardData, playNode.mjsNode)
                majiangFactory.deleteHandMajiangNew(majiangs)
            }
        }
        else
            majiangFactory.deleteHandMajiangs(majiangs, outDir, 0)

        majiangFactory.addDiscardMajiangs(playNode.discardMajiangs4D[outDir], outDir,
        outIdx, playNode.mjsNode)

        majiangFactory.setCurrentDiscardMj(playNode.discardMajiangs4D, outDir)
        //majiangFactory.setCurrentDiscardMj(outIdx, outDir)

        var self = tableData.getUserWithUserId(selfdwUserID)
        var sortedActions = cmdBaseWorker.getSortedActionsWithMask(cmdBaseWorker.cbActionMask)
        if(sortedActions.length>0 && self.cbUserStatus == US_PLAYING)
            playNode.showActionBtns(sortedActions)

        cmdBaseWorker.cbTingUserRev[cmdBaseWorker.wOutCardUser] = INVALID_BYTE

        if (cmdBaseWorker.cbTingUser[cmdBaseWorker.wOutCardUser] != 0 && cmdBaseWorker.cbUserTingMode != 0)
        { //&& self.wChairID == cmdBaseWorker.wOutCardUser
            cmdBaseWorker.cbTingUser[cmdBaseWorker.wOutCardUser] = cmdBaseWorker.cbUserTingMode
            cmdBaseWorker.setTingLogo(cmdBaseWorker.wOutCardUser)
        }
    },
    onActionReplace:function(cardData, operateUser, flowerMajiangs4D)
    {
        var operateUserDir = tableData.getShowChairIdWithServerChairId(operateUser.wChairID)
        var operateFlowerMajiangs = flowerMajiangs4D[operateUserDir]
        var operateFlowerMajiangsNode = operateUser.userNodeInsetChair.currentRoundNode.flowerMajiangsNode

        majiangFactory.addFlowerMajiangs(operateFlowerMajiangs, operateUserDir, cardData, operateFlowerMajiangsNode)
    },
    onCMD_SendCard:function() 
    {
        if(cmdBaseWorker.cbOutCardCount != 0)
            managerAudio.playEffect('gameRes/sound/sendcard.mp3')

        var isSelf = tableData.getUserWithChairId(cmdBaseWorker.wTakeCardUser).dwUserID == selfdwUserID

        playNode.scoreTTF.setString(cmdBaseWorker.cbLeftCardCount)
        playNode.timer.switchTimer(cmdBaseWorker.wCurrentUser==INVALID_WORD?[]:[tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wCurrentUser)])

        var takeDir =  tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wTakeCardUser)   
        ///////
        for(var i=0;i<cmdBaseWorker.cbSendCardCount;i++)
        {
            var item = cmdBaseWorker.sendCardArray[i]
            //牌堆
            var heapMajiangsDir = tableData.getShowChairIdWithServerChairId(item.wHeapDir)  
            majiangFactory.deleteHeapMajiangs(playNode.heapMajiangs4D[heapMajiangsDir], [item.wHeapPos])

            var idx = isSelf?item.cbCardData:0
            majiangFactory.addHandMajiang(playNode.handMajiangs4D[takeDir], takeDir, idx, playNode.mjsNode, playNode.weaveMajiangs4D[takeDir].length)
        }
        /////摸到麻将时有可能出现杠听胡补花
        var sortedActions = cmdBaseWorker.getSortedActionsWithMask(cmdBaseWorker.cbActionMask)
        if(sortedActions.length>0 && isSelf)
            playNode.showActionBtns(sortedActions)  //自摸杠 idx不确定 需要searchGangIdxs
        else if (isSelf)
        {
            if (cmdBaseWorker.isAutoDisCard == true || cmdBaseWorker.isLastFourCard == true)
            { // 如果听牌自动出牌
                var a = cc.sequence( 
                    cc.delayTime(0.8),
                    cc.callFunc(function()
                    {   
                        var item = cmdBaseWorker.sendCardArray[0]
                        var OutCard = getObjWithStructName('CMD_C_OutCard')
                        OutCard.cbOutCardData = item.cbCardData
                        socket.sendMessage(MDM_GF_GAME,SUB_C_OUT_CARD,OutCard)
                        playNode.hideActionBtns()
                    }) 
                )           
                playNode.node.runAction(a)
            }
        }
    },
    CMD_S_LookBao:function()
    {
        if (cmdBaseWorker.wLookBaoUser == INVALID_WORD)
            return

        var isSelf = tableData.getUserWithChairId(cmdBaseWorker.wLookBaoUser).dwUserID == selfdwUserID
        var sortedActions = cmdBaseWorker.getSortedActionsWithMask(cmdBaseWorker.cbActionMask)
        if(sortedActions.length>0 && isSelf)
            playNode.showActionBtns(sortedActions)  
        if (isSelf && cmdBaseWorker.cbTingUser[cmdBaseWorker.wLookBaoUser] != 0)
            playNode.setBaoHeap(cmdBaseWorker.TurnoverCard[0].cbCardData)
    },
    CMD_S_ChangeBao:function()
    {
        if (cmdBaseWorker.bExistBao)
        {
            if (cmdBaseWorker.bLookedBao == true)
                playNode.setBaoHeap(cmdBaseWorker.TurnoverCard[0].cbCardData)
            else
                playNode.setBaoHeap(0)
        }
        
        topUINode.warnNode.setVisible(true)
        if (cmdBaseWorker.bExistBao == false)
        {
            topUINode.warn_label.setString('宝牌已取消')
            playNode.clearBaoNode()
            if (majiangFactory.isShowHeap == true)
            {
                if (playNode.mjTurnOver && playNode.mjTurnOver.cardData != null)
                        playNode.mjTurnOver.setVisible(true)
            }
        }
        else
            topUINode.warn_label.setString('宝牌已更换')
        var a = cc.sequence( 
            cc.delayTime(3.5),
            cc.callFunc(function()
            {   
                topUINode.warnNode.setVisible(false)
            }) 
        )           
        playNode.node.runAction(a)
    },
    showBao:function(idx)
    {
        if(idx == INVALID_CARD_DATA)
            return

        if (idx != 0)
        {
            var majiang = tableNode.baoNode.getChildByTag(4410)
            if (majiang)
            {
                if (majiang.cardData == idx)
                    return
            }
        }

        tableNode.baoNode.removeAllChildren()
        var where = {}
        where.name = 'weave'
        where.data = {weaveIdx:2, idxInWeave:3}
        var mj = majiangFactory.getOne(idx, 2, where)
        mj.x = 25
        mj.y = 0
        mj.setTag(4410)
        tableNode.baoNode.addChild(mj)
        mj.setScale(1.4)

        if (idx == 0)
        {
            var bg = new cc.Sprite('#baoPic.png')
            bg.setScaleX(mj.height*0.6/bg.height)
            bg.setScaleY(mj.height*0.6/bg.height)
            bg.y = mj.height/2 + 9
            bg.setAnchorPoint(0.5,0.5)
            bg.x = mj.width/2
            
            mj.addChild(bg)
        }
    },
    clearBaoNode:function()
    {
        tableNode.baoNode.removeAllChildren()
    },
    setBaoHeap:function(cardData)
    {
        if (majiangFactory.isShowHeap == true)
        {
            var self = tableData.getUserWithUserId(selfdwUserID)                        
            var mjPos = cmdBaseWorker.TurnoverCard[0].wHeapPos
            var dir = tableData.getShowChairIdWithServerChairId(cmdBaseWorker.TurnoverCard[0].wHeapDir)
            var heapMajiangs = playNode.heapMajiangs4D[dir]
            var mj = heapMajiangs[mjPos]
            if (mj && mj.parent != null)
            {
                if (cardData == 0)
                {
                    if (playNode.mjTurnOver && playNode.mjTurnOver.cardData != null)
                        playNode.mjTurnOver.setVisible(true)
                    mj.setVisible(false)
                    playNode.mjTurnOver = mj
                }
                else if (playNode.mjTurnOver && playNode.mjTurnOver.cardData != cardData)
                {
                    playNode.mjTurnOver.setVisible(true)
                    playNode.mjTurnOver = mj
                    mj.setVisible(false)
                }
            }
        }
        
        playNode.showBao(cardData)
    },
    onCMD_S_OperateEggRes:function()
    {
        var selfUser = tableData.getUserWithUserId(selfdwUserID)
        var isSelf = selfUser.wChairID == cmdBaseWorker.wOperateUser
        if (isSelf)
        {
            playNode.hideActionBtns()
        }

        if(cmdBaseWorker.cbOperateCode != WIK_NULL)
        {
            //动作效果
            var operateUser = tableData.getUserWithChairId(cmdBaseWorker.wOperateUser)
            var provideUser = tableData.getUserWithChairId(cmdBaseWorker.wOperateUser)
            var majiangs4W4D = {
                handMajiangs4D:playNode.handMajiangs4D,
                discardMajiangs4D:playNode.discardMajiangs4D,
                weaveMajiangs4D:playNode.weaveMajiangs4D,
                flowerMajiangs4D:playNode.flowerMajiangs4D,
            }

            var idxs = cmdBaseWorker.sortWeaveIdxs(cmdBaseWorker.cbOperateCode, cmdBaseWorker.cbOperateCardData)
            cmdBaseWorker.onActionResult(cmdBaseWorker.cbOperateCode, idxs, operateUser, provideUser,
                majiangs4W4D, playNode.mjsNode)     

            playNode.playAction(cmdBaseWorker.cbOperateCode, operateUser) //音效动画
        }
        if (isSelf)
        {
            var sortedActions = cmdBaseWorker.getSortedActionsWithMask(cmdBaseWorker.cbActionMask)
            if(sortedActions.length>0 && selfUser.cbUserStatus == US_PLAYING)
            {
                if((cmdBaseWorker.cbActionMask&WIK_GANG)!=0)
                {
                    cmdBaseWorker.wProvideUser    = INVALID_CHAIR
                    if (cmdBaseWorker.cbOperateCode == WIK_SHOWEGG && cmdBaseWorker.cbTingUser[selfUser.wChairID] != 0)
                    {
                        //
                    }
                    else
                        cmdBaseWorker.cbProvideCardData  = INVALID_CARD_DATA    
                }
                
                playNode.showActionBtns(sortedActions)  //吃碰后杠 idx不确定 需要searchGangIdxs
            }
        }
    },
    onCMD_S_OperateEggEnd:function()
    {
        if (cmdBaseWorker.cbFiveSTime == false)
            playNode.hideActionBtns()
        topUINode.showEggTime.setVisible(false)
        cmdBaseWorker.isShowEggTime = false
        playNode.timer.switchTimer(cmdBaseWorker.wCurrentUser==INVALID_WORD?[]:[tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wCurrentUser)])
        cmdBaseWorker.cbFiveSTime = false
    },
    setTimeFiveS:function()
    {
        if (cmdBaseWorker.isShowEggTime==true)
            topUINode.showEggTime.setVisible(true)
        var time = 3
        topUINode.label_Time.setString('3')
        function recordTime()
        {
            var a = cc.sequence( 
                cc.delayTime(1),
                cc.callFunc(function()
                {   
                    if (time > 0)
                    {
                        time -= 1
                        topUINode.label_Time.setString(time)
                        recordTime()
                    }
                    else
                        topUINode.showEggTime.setVisible(false)
                }) 
            )           
            playNode.node.runAction(a)
        }
        if (cmdBaseWorker.isShowEggTime==true)
        {
            cmdBaseWorker.cbFiveSTime = false
            recordTime()
        }
    },
    onCMD_OperateResult:function() 
    {
        playNode.hideActionBtns()
        majiangFactory.hideCurrentDiscardMj()
        playNode.timer.switchTimer(cmdBaseWorker.wCurrentUser==INVALID_WORD?[]:[tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wCurrentUser)])
        var self = tableData.getUserWithUserId(selfdwUserID)

        if(cmdBaseWorker.cbOperateCode != WIK_NULL)
        {
            //动作效果
            var operateUser = tableData.getUserWithChairId(cmdBaseWorker.wOperateUser)
            var provideUser = tableData.getUserWithChairId(cmdBaseWorker.wProvideUser)
            var majiangs4W4D = {
                handMajiangs4D:playNode.handMajiangs4D,
                discardMajiangs4D:playNode.discardMajiangs4D,
                weaveMajiangs4D:playNode.weaveMajiangs4D,
                flowerMajiangs4D:playNode.flowerMajiangs4D,
            }

            var idxs = cmdBaseWorker.sortWeaveIdxs(cmdBaseWorker.cbOperateCode, cmdBaseWorker.cbOperateCardData)
            cmdBaseWorker.onActionResult(cmdBaseWorker.cbOperateCode, idxs, operateUser, provideUser,
                majiangs4W4D, playNode.mjsNode)     

            playNode.playAction(cmdBaseWorker.cbOperateCode, operateUser) //音效动画

            if (cmdBaseWorker.cbOperateCode == WIK_LISTEN)
            { // 听牌
                playNode.playGenderEffect('ting0', tableData.getUserWithChairId(cmdBaseWorker.wOperateUser).cbGender)
                cmdBaseWorker.cbTingUser[cmdBaseWorker.wOperateUser] = cmdBaseWorker.cbUserTingMode
                cmdBaseWorker.userTing(cmdBaseWorker.wOperateUser)
                //playNode.showAnGangCards()
                var tingCount = 0
                for (var i = 0; i < GAME_PLAYER; i++)
                {
                    if (cmdBaseWorker.cbTingUser[i] != 0)
                        tingCount++
                }
                if (tingCount == 1)
                {
                    playNode.setBaoHeap(0)
                    topUINode.warnNode.setVisible(true)
                    topUINode.warn_label.setString('宝牌已选取')
                    var a = cc.sequence( 
                        cc.delayTime(3.5),
                        cc.callFunc(function()
                        {   
                            topUINode.warnNode.setVisible(false)
                        }) 
                    )           
                    playNode.node.runAction(a)
                }
            }
        }

        var sortedActions = cmdBaseWorker.getSortedActionsWithMask(cmdBaseWorker.cbActionMask)
        if(cmdBaseWorker.cbOperateCode == WIK_NULL || cmdBaseWorker.cbOperateCode == WIK_LISTEN || (cmdBaseWorker.cbOperateCode == WIK_SHOWEGG && sortedActions.length<=0 && cmdBaseWorker.cbEggStatus==1))
        {
            if (cmdBaseWorker.isLastFourCard == true && cmdBaseWorker.wOperateUser == tableData.getUserWithUserId(selfdwUserID).wChairID)
            { // 最后四张牌 要随便出张牌
                var a = cc.sequence( 
                    cc.delayTime(0.8),
                    cc.callFunc(function()
                    {   
                        var item = cmdBaseWorker.sendCardArray[0]
                        var OutCard = getObjWithStructName('CMD_C_OutCard')
                        OutCard.cbOutCardData = 0x12
                        socket.sendMessage(MDM_GF_GAME,SUB_C_OUT_CARD,OutCard)
                        playNode.hideActionBtns()
                    }) 
                )           
                playNode.node.runAction(a)
            }
            else
            {
                if (cmdBaseWorker.wOperateUser == tableData.getUserWithUserId(selfdwUserID).wChairID && cmdBaseWorker.cbTingUser[cmdBaseWorker.wOperateUser] != 0)
                {//本人是听牌玩家 自动出牌
                    if (cmdBaseWorker.cbTingUserRev[cmdBaseWorker.wOperateUser] != INVALID_BYTE && cmdBaseWorker.isAutoDisCard)
                    {
                        var a = cc.sequence( 
                            cc.delayTime(0.8),
                            cc.callFunc(function()
                            {   
                                var item = cmdBaseWorker.sendCardArray[0]
                                var OutCard = getObjWithStructName('CMD_C_OutCard')
                                OutCard.cbOutCardData = cmdBaseWorker.cbTingUserRev[cmdBaseWorker.wOperateUser]
                                socket.sendMessage(MDM_GF_GAME,SUB_C_OUT_CARD,OutCard)
                                playNode.hideActionBtns()
                            }) 
                        )           
                        playNode.node.runAction(a)
                    }
                }
            }
        }
        
        if(sortedActions.length>0 && self.cbUserStatus == US_PLAYING)
        {
            if((cmdBaseWorker.cbActionMask&WIK_GANG)!=0)
            {
                cmdBaseWorker.wProvideUser    = INVALID_CHAIR
                if (cmdBaseWorker.cbOperateCode == WIK_SHOWEGG && cmdBaseWorker.cbTingUser[self.wChairID] != 0)
                {
                    //
                }
                else
                    cmdBaseWorker.cbProvideCardData  = INVALID_CARD_DATA    
            }
            
            playNode.showActionBtns(sortedActions)  //吃碰后杠 idx不确定 需要searchGangIdxs
        }

        playNode.setTimeFiveS()
    },
    onSMD_GameType:function()
    {
        if (cmdBaseWorker.cbGameType == 0)
            tableNode.gameTypeTTF.setString("16 番")
        else if (cmdBaseWorker.cbGameType == 1)
            tableNode.gameTypeTTF.setString("32 番")

        typeSelNode.startBtnEnabled()
        //cmdBaseWorker.onListerMenuShare()
    },
    onCMD_GameEnd:function() 
    {
        playNode.gamesetNode.setVisible(false)

        playNode.isPlaying = false

        setTimeout(function()
        {
            var record = getObjWithStructName('CMD_GR_C_TableHistoryRecordReq') 
            record.szTableKey = tableKey
            socket.sendMessage(MDM_GR_USER, SUB_GR_USER_TABLE_HISTORY_RECORD_REQ, record)
        },2000)

        playNode.isLookingResult = true   
        playNode.hideActionBtns()

        cocos.setInterval(playNode.updateOnFree, 1000, playNode.node)

        var userData_gameEnd = []
        for(var i=0;i<GAME_PLAYER;i++)
        {
            var user = tableData.getUserWithChairId(i)
            userData_gameEnd[i] = {}

            if(user)
            {
                userData_gameEnd[i].szNickName = user.szNickName
                userData_gameEnd[i].szHeadImageUrlPath = user.szHeadImageUrlPath
            }
        }

        if (cmdBaseWorker.stAddEggInfo.bIsQEgg == true)
            cmdBaseWorker.toDealQEgg(cmdBaseWorker.stAddEggInfo)

        if(cmdBaseWorker.endType == 3)
        {
            var provideDiscardMajiangs = playNode.discardMajiangs4D[tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wProvideUser)]
            //抢杠情况不会到丢弃区
            if(provideDiscardMajiangs.length>0 && provideDiscardMajiangs[provideDiscardMajiangs.length-1].cardData == cmdBaseWorker.cbProvideCardData)
                majiangFactory.popDiscardMajiangs(provideDiscardMajiangs)
        }

        playNode.playAnimationOfGameEnd(onPlayAnimationOfGameEnd)
        function onPlayAnimationOfGameEnd()
        {
            var a = cc.sequence( 
                cc.callFunc(function()
                {     
                    playNode.timer.resetTimer()
                    // majiangFactory.hideCurrentDiscardMj()
                    playNode._showSprsOnGameEnd()
                }), 
                cc.delayTime(2),
                cc.callFunc(function()
                {   
                    var continueCall = function()
                    {
                        headIconPop.kickUserOnGameEnd()
                        for(var i=0;i<GAME_PLAYER;i++)
                        {
                            tableNode.setBankerIcon(i, false)
                        }

                        playNode.isLookingResult = false   
                        if(!playNode.isPlaying)   
                        {
                            playNode.resetPlayNode()
                        }
                    }
                    playNode.popGameEnd(continueCall, userData_gameEnd) 
                }) 
            )           
            playNode.node.runAction(a)
        }        
    },
    ///////////////cmdEvent end//////////

    ////////////sendCardsAction start//////////
    _getHandMajiangsGroupNode:function()
    {
        var handMajiangs = playNode.handMajiangs4D

        var touchEndCall = function(direction, majiang)
        {      
            var isForbid = false
            var isTing   = false
            if (cmdBaseWorker.cbAllowTingCount != 0) // 判断听牌后禁出牌型
            {
                if (cmdBaseWorker.isForbidMajiang(majiang, cmdBaseWorker.wCurrentUser) == true)
                    isForbid = true
                isTing = true
            }

            if (cmdBaseWorker.cbListening[tableData.getUserWithUserId(selfdwUserID).wChairID] && cmdBaseWorker.cbTingUser[tableData.getUserWithUserId(selfdwUserID).wChairID] != 0)
                isForbid = true

            var isAllowOut = cmdBaseWorker.wCurrentUser == tableData.getUserWithUserId(selfdwUserID).wChairID && !isForbid && !cmdBaseWorker.isAutoDisCard && cmdBaseWorker.isLastFourCard==false && cmdBaseWorker.isShowEggTime==false
            if(isAllowOut)
            {
                cmdBaseWorker.cbAllowTingCount = 0
                cmdBaseWorker.cbAllowTing      = []
                cmdBaseWorker.wCurrentUser = INVALID_WORD

                var OutCard = getObjWithStructName('CMD_C_OutCard')
                OutCard.cbOutCardData = majiang.cardData
                socket.sendMessage(MDM_GF_GAME,SUB_C_OUT_CARD,OutCard)
                playNode.hideActionBtns()
                if (isTing == true)
                    cmdBaseWorker.setMajiangColorNor()
            }
        }

        var touchEndCalls = []
        if(tableData.getUserWithUserId(selfdwUserID).wChairID == tableData.getServerChairIdWithShowChairId(0))
        {
            touchEndCalls[0] = function(majiang)
            {
                touchEndCall(0, majiang)
            }
        }

        var listener = majiangFactory._gethandMajiangsListener(playNode.handMajiangs4D[0], playNode.mjsNode, touchEndCalls[0])
        var mjsListenerNode = new cc.Node
        mjsListenerNode.width = playNode.mjsNode.width
        mjsListenerNode.height = playNode.mjsNode.height
        playNode.mjsNode.addChild(mjsListenerNode)
        cc.eventManager.addListener(listener, mjsListenerNode)
    },
    ////////////gameend start//////////
    _removeSprsOnGameEnd:function()
    {
        for(var chairId=0;chairId<GAME_PLAYER;chairId++)
        {   
            var user = tableData.getUserWithTableIdAndChairId(null, chairId)
            if(user)
                playNode.clearCurrentRoundNode(user.userNodeInsetChair.currentRoundNode)
        }
    },
    ///gameend end////

    /////other ui start////////
    showGameset:function()
    {
        var isBanker = tableData.getUserWithUserId(selfdwUserID).wChairID == cmdBaseWorker.wBankerUser
        playNode.jiadingBtn1.setEnabled(!isBanker)
        playNode.jiadingBtn2.setEnabled(!isBanker)

        playNode.gamesetTTF1.setString('0')
        playNode.gamesetTTF2.setString('0')

        playNode.gamesetNode.setVisible(true)
    },
    hideLaizi:function()
    {
        playNode.laiziNode.removeAllChildren()
    },
    playAction:function(WIK, user)
    {
        if(cmdBaseWorker.cbOutCardCount == 0 && WIK == WIK_REPLACE)
            return;

        var name = typeof(WIK)=='number'?cmdBaseWorker.wik2Name(WIK):WIK
        playNode.playActionEffect(name, user.cbGender)

        if(name!='replace')
        {
            managerAudio.playEffect('gameRes/sound/weave.mp3')
            playNode.playAnimationWithDirection(name, tableData.getShowChairIdWithServerChairId(user.wChairID))
        }
    },
    hideActionBtns:function()
    {
        majiangFactory.chooseItemsNode.removeAllChildren()
        playNode.btn_guo.setVisible(false)
        playNode.btn_egg.setVisible(false)
        playNode.btn_chi.setVisible(false)
        playNode.btn_peng.setVisible(false)
        playNode.btn_gang.setVisible(false)
        playNode.btn_ting.setVisible(false)
        playNode.btn_hu.setVisible(false)
    },
    showActionBtns:function(sortedActions)
    {
        for(var i=sortedActions.length-1;i>=0;i--)
        {
            if(sortedActions[i] == WIK_REPLACE)
            {
                var self = tableData.getUserWithUserId(selfdwUserID)
                var selfDir = tableData.getShowChairIdWithServerChairId(self.wChairID)
                var handMajiangs = playNode.handMajiangs4D[selfDir]

                var handIdxs = handMajiangs[1]?[handMajiangs[1].cardData]:[]
                for(var j=0;j<handMajiangs[0].length;j++)
                {
                    handIdxs[handIdxs.length] = handMajiangs[0][j].cardData
                }
                majiangLogic.sortWithCardData(handIdxs)

                var operateCards = []
                for(var j=0;j<handIdxs.length;j++)
                {
                    var isHuaMagic = cmdBaseWorker.isCaiHua(handIdxs[j])
                    var isMagic = cmdBaseWorker.isMagicCard(handIdxs[j], cmdBaseWorker.cbMagicCardData)

                    if(cmdBaseWorker.isFlowerCard(handIdxs[j], cmdBaseWorker.cbFlowerCardData) && isHuaMagic==false && isMagic==false)
                        operateCards[operateCards.length] = handIdxs[j]

                } 

                if(cmdBaseWorker.cbOutCardCount == 0)
                {
                    cmdBaseWorker.sendMessage_replace(operateCards)
                }
                else
                {
                    var a = cc.sequence( 
                        cc.delayTime(0.8),
                        cc.callFunc(function()
                        {   
                            cmdBaseWorker.sendMessage_replace(operateCards)
                        }) 
                    )           
                    playNode.node.runAction(a)
                }

                return;
            }
        }

        playNode.btn_guo.setVisible(true)
        for(var i=sortedActions.length-1;i>=0;i--)
        {   
            var btn = null
            var action = sortedActions[i]
            if(action == WIK_CHI_HU)
                btn = playNode.btn_hu
            else if(action == WIK_LISTEN)
                btn = playNode.btn_ting
            else if(action == WIK_GANG)
                btn = playNode.btn_gang
            else if(action == WIK_PENG)
                btn = playNode.btn_peng
            else if (action == WIK_SHOWEGG)
                btn = playNode.btn_egg
            else if(action == WIK_LEFT || action == WIK_CENTER || action == WIK_RIGHT)
            {
                btn = playNode.btn_chi
                btn.actions = sortedActions.slice(0, i+1)
            }

            btn.setVisible(true)
            btn.setPositionX(-150 * (sortedActions.length-1-i +1))
            if(btn==playNode.btn_chi)
                break
        }
    },
    playAnimationOfGameEnd:function(call)
    {
        var winner = cmdBaseWorker.wWinner
        var cbChiHuRight=cmdBaseWorker.dwChiHuRight[cmdBaseWorker.wWinner]
        if(cmdBaseWorker.endType == 0)
            call()
        else if(cmdBaseWorker.endType == 1)
        {
            var spr = actionFactory.getSprWithAnimate('lj', true, 0.15, call)
            playNode.mjsNode.addChild(spr)
            spr.x = playNode.mjsNode.width*0.5
            spr.y = playNode.mjsNode.height*0.5
            if (isOpenPTH == false)
                playNode.playGenderEffect('lj0', tableData.getUserWithChairId(0).cbGender)
        }
        else if(cmdBaseWorker.endType == 2)
        {
            playNode.playAnimationWithDirection('zim', tableData.getShowChairIdWithServerChairId(winner), call)
            //playNode.playGenderEffect('zimo0', tableData.getUserWithChairId(winner).cbGender)
            if (cbChiHuRight&CHR_GangKai && isOpenPTH == false) //杠开
                playNode.playGenderEffect('gk0', tableData.getUserWithChairId(winner).cbGender)
            else
                playNode.playActionEffect('zimo', tableData.getUserWithChairId(winner).cbGender)
        }
        else if(cmdBaseWorker.endType == 3)
        {
            playNode.playAnimationWithDirection('hu', tableData.getShowChairIdWithServerChairId(winner), call)
            playNode.playAnimationWithDirection('dp', tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wProvideUser))
            if (cbChiHuRight&CHR_QiangGang && isOpenPTH == false) //抢杠
                playNode.playGenderEffect('qg0', tableData.getUserWithChairId(winner).cbGender)
            else
                playNode.playActionEffect('hu', tableData.getUserWithChairId(winner).cbGender)
        }
    },
    /////other ui end////////
    
    getSoundName:function(idx) 
    {
        return idx
    },
    getActionSoundName:function(name, num) 
    { 
        num = num || 1
        return name + (Math.ceil(Math.random()*10))%num        
    },
    playMajiangEffect:function(idx, isMan)
    {
        var name = playNode.getSoundName(idx)
        playNode.playGenderEffect(name, isMan)
    },
    playActionEffect:function(name, isMan)
    {
        var name = playNode.getActionSoundName(name)
        playNode.playGenderEffect(name, isMan)
    },
    playGenderEffect:function(name, isMan)
    {
        var resPrefix = 'gameRes/sound/' + (isOpenPTH?'pth':'fy')
        
        if(isMan)
            managerAudio.playEffect(resPrefix + '/man/' + name + '.mp3')
        else
            managerAudio.playEffect(resPrefix + '/woman/' + name + '.mp3') 
    },
    playDiceForRandBanker:function(call, bankerDirection)
    {   
        var numBigger =  getRandNum(6, 12) 
        var numSmaller = getRandNum(5, numBigger-1) 
        var endNum1_banker =  getRandNum(Math.max(1, numBigger-6) , Math.min(6, numBigger-1))
        var endNum2_banker = numBigger - endNum1_banker

        function getEndNums(direction)
        {
            if(direction == bankerDirection)
                return [endNum1_banker, endNum2_banker]
            else
            {
                var endNum1_ubanker = getRandNum(Math.max(1, numSmaller-6), Math.min(6, numSmaller-1))
                var endNum2_ubanker = numSmaller - endNum1_ubanker  
                return [endNum1_ubanker, endNum2_ubanker]
            }
        }

        function playDice(direction)
        {
            var nums = getEndNums(direction)
            if(direction == 3)
                playNode.playDiceOneDirection(call, nums[0], nums[1], direction)
            else
                playNode.playDiceOneDirection(function()
                    {
                        playDice(direction+1)
                    }, nums[0], nums[1], direction)
        }

        playDice(0)
    },
    playDiceOneDirection:function(call, endNum1, endNum2, direction)
    {
        var w = playNode.diceNode.width
        var h = playNode.diceNode.height

        var sign = direction%2==0?1:-1

        var beginHOffset = 120*sign
        var sprPosY = direction%2==0?0+beginHOffset:h+beginHOffset

        var controlPoints1 = [
        cc.p(0.1*w, sprPosY+0.1*h*sign),
        cc.p(0.9*w, sprPosY+0.3*h*sign),
        cc.p(0.55*w, sprPosY+0.45*h*sign),
        ]
        var controlPoints2 = [
        cc.p(0.9*w, sprPosY+0.15*h*sign),
        cc.p(0.1*w, sprPosY+0.3*h*sign),
        cc.p(0.45*w, sprPosY+0.4*h*sign),
        ]

        var chairNode = tableNode['chairNode'+direction] 

        var diceSpr1 = dice.getThrowedDiceSpr(controlPoints1, endNum1, 1.2, function()
        {
            // call?call():''
            if (call)
            {
                playNode.node.runAction(cc.sequence(cc.delayTime(0.5), cc.callFunc(function(){
                            call?call():''
                        }
                        )
                    )
                )
            }
        }) 

        diceSpr1.x = chairNode.x
        diceSpr1.y = chairNode.y
        var diceSpr2 = dice.getThrowedDiceSpr(controlPoints2, endNum2, 1.2) 
        diceSpr2.x = chairNode.x
        diceSpr2.y = chairNode.y
        playNode.diceNode.addChild(diceSpr1)
        playNode.diceNode.addChild(diceSpr2)
        managerAudio.playEffect('gameRes/sound/dice.mp3') 
    },
    resetPlayNode:function()
    {
        playNode.mjsNode.removeAllChildren()
        majiangFactory.isPublicAnGang = false
        playNode.scoreTTF.setString('0')
        playNode._removeSprsOnGameEnd()
        playNode.timerNode.setVisible(false)
        playNode.hideLaizi()
        playNode.clearBaoNode()
        playNode.mjTurnOver = null

        cmdBaseWorker.cbAllowTingCount  = 0
        cmdBaseWorker.isAutoDisCard     = false
        for (var i = 0; i < GAME_PLAYER; i++)
        {
            cmdBaseWorker.cbTingUserRev[i] = INVALID_BYTE
            cmdBaseWorker.cbListening[i]   = false
            cmdBaseWorker.cbTingUser[i]    = 0
        }
        
        cmdBaseWorker.cbAllowTing       = []
        cmdBaseWorker.cbCurFeng         = INVALID_BYTE
    },
    isCaiVisible:function(visible)
    {
        var self = tableData.getUserWithUserId(selfdwUserID)
        var curDir = tableData.getShowChairIdWithServerChairId(self.wChairID)  
        var majiangs = playNode.handMajiangs4D[curDir]
        gameLog.log(majiangs)
        for(var i=0;i<majiangs[0].length;i++)
        {
            var majiang = majiangs[0][i]
            var zi = majiang.getChildByTag(101)
            if (zi)
            {
                var caiShen = zi.getChildByTag(139)
                if (caiShen)
                {
                    caiShen.setVisible(visible)
                }
            }
        }
    },
    showAnGangCards:function()
    { 
        // for(var k=0; k<4; k++)
        // {
        //     var user = tableData.getUserWithChairId(k)
        //     var direction = tableData.getShowChairIdWithServerChairId(user.wChairID)
        //     var operateWeaveMajiangs = playNode.weaveMajiangs4D[direction]  

        //     var cbGangCount = 0
        //     var cbCardDatas = cmdBaseWorker.cbAnGangCards[user.wChairID]
        //     for(var i = 0;i<operateWeaveMajiangs.length;i++)
        //     {
        //         var group = operateWeaveMajiangs[i]
        //         if(group.length == 4&&group[0].cardData==0 && cbGangCount <= 4)
        //         {
        //            var waveMajiangsNode = user.userNodeInsetChair.currentRoundNode.weaveMajiangsNode
        //            var majiang = majiangFactory.getOne(cbCardDatas[cbGangCount], 2, direction)
        //            majiang.x = group[3].x
        //            majiang.y = group[3].y
        //            majiang.setLocalZOrder(group[3].zOrder)
        //            waveMajiangsNode.removeChild(group[3])
        //            group[3] = majiang
        //            waveMajiangsNode.addChild(majiang)
        //            cbGangCount++
        //         }
        //     }
        // }
    },
}






















