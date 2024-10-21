
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
                s.x = 0.5*zi.width + 5
                s.y = 0.5*zi.height - 10
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
       // mj.isIgnoreDecorate = true
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
        playNode.weaveMajiangs4D = majiangFactory.getWeaveMajiangsArray(weaveItemArray, selfDir)

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
            continueCall()
            node.removeFromParent()
        }
        var node  = managerRes.loadCCB(resp.gameEndPopCCB, control)

        playNode.gameEndControl = control

       

        control.gendTitle.setSpriteFrame('gendTitle'+cmdBaseWorker.endType + '.png')

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


            //胡型
            var chrStr = ''
            for (var i = 0; i < map_mask2Name.length; i++) 
            {
                var chr_type = window[ map_mask2Name[i][0] ] 
                if (cmdBaseWorker.dwChiHuRight[wChairID] & chr_type)
                {
                     if(chrStr == '')
                        chrStr += '胡型：'
                    chrStr += map_mask2Name[i][1] + ' ';
                }
            }
            resultTTF.setString(chrStr)

       
            //显示麻将
            
            //吃碰杠 牌
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
                var majiangsOneWeave = majiangFactory.weaveItem2Majiangs(0, weaveIdx, weaveItem, true)

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

                 if ( cmdBaseWorker.wEndCardType == 1 ) //添加生张标志 
                    {
                        var sz = new cc.Sprite('#shengzhang.png')
                        handMajiangs[1].addChild(sz)
                        sz.setScale( handMajiangs[1].getScale())

                        sz.setAnchorPoint(1,0)
                        sz.x = handMajiangs[1].width*0.95;// (aCard.width - sz.width)*aCard.getScale();
                        sz.y = handMajiangs[1].height * 0.15 * handMajiangs[1].getScale();
                    };

            }
 
            cardNode.scaleX = handCardNode.width/cardNode.width
            cardNode.scaleY = handCardNode.height/cardNode.height
            cardNode.x = -4
            cardNode.y = 0
            handCardNode.addChild(cardNode)


            /*
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
            */

            /////////
            if(wChairID==cmdBaseWorker.wExitUser)
                control['winflag'+wChairID].setSpriteFrame('gendFlag0.png') 
            else if(cmdBaseWorker.dwChiHuKind[wChairID] == WIK_CHI_HU)
                control['winflag'+wChairID].setSpriteFrame('gendFlag1.png') 
            else if(wChairID==cmdBaseWorker.wProvideUser)
                control['winflag'+wChairID].setSpriteFrame('gendFlag2.png') 
            else
                control['winflag'+wChairID].setSpriteFrame('empty.png') 
  

            control['taiTTF'+wChairID].setString((cmdBaseWorker.cbIGameFan[wChairID]>0?'':'') + cmdBaseWorker.cbIGameFan[wChairID]) 
            control['fenTTF'+wChairID].setString((cmdBaseWorker.lGameScore[wChairID]>0?'+':'') + cmdBaseWorker.lGameScore[wChairID]) 

        }
       
        mainScene.top.addChild(node) 
    },
    showLaizi:function(cIdx)
    {/*
       var mj = new cc.Sprite(resp_p.empty)
       var styleId = styleArray[0]
       var frameName = 's' + styleId + '_d_handshowBg' + '.png'
       mj.setSpriteFrame(frameName)

       var zi = new cc.Sprite('#'  + "mf_" + cIdx + '.png')
       zi.x = mj.width/2
       zi.y = mj.height/2 + mj.height/12
       mj.addChild(zi, 0, 101)

       var cai = new cc.Sprite('#caiShen.png')
       cai.setAnchorPoint(1,0)
       cai.x = mj.width
       cai.y = mj.height/6
       mj.addChild(cai, 1, 102)

       playNode.laiziMjNode.addChild(mj)
*/
       playNode.laiziNode.setVisible(true)
       ///////////////////////////
         //for(var i=0;i<MAX_MAGIC_COUNT;i++)
       // {
            var cardData = cIdx//cmdBaseWorker.cbMagicCardData[i]
            

            var where = {}
            where.name = 'caishen'
            where.data = {}
            var mj = majiangFactory.getSpecialOne(cardData, where)
            mj.x = 50//50 + i*85
            mj.y = -50//660
            mj.isIgnoreDecorate = true
            playNode.laiziNode.addChild(mj)
      //  }



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

        cocos.clearInterval(playNode.updateOnFree, playNode.node)
    },
    initCurrentRoundNode:function(currentRoundNode)
    {
        //currentRoundNode是绑定在chair上的一个节点 用于存放当前轮用到的节点
        
        
        currentRoundNode.flowerMajiangsNode = new cc.Node()
        currentRoundNode.addChild( currentRoundNode.flowerMajiangsNode )

        currentRoundNode.heapMajiangsNode = new cc.Node()
        currentRoundNode.addChild( currentRoundNode.heapMajiangsNode )
        currentRoundNode.heapMajiangsNode.setVisible(false)

        //单个方向的丢弃麻将精灵父节点
        currentRoundNode.discardMajiangsNode = new cc.Node()
        currentRoundNode.addChild( currentRoundNode.discardMajiangsNode)

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

        var l = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "recordPlayStart",
            callback: function(event)
            {   
                majiangFactory.isShowHeap = false
                tableNode.waitStartTTF.setVisible(false)
            }
        })
        cc.eventManager.addListener(l, 1)
    },
    sendMessage_chi:function(operateCards, action)
    {
        var OperateCard = getObjWithStructName('CMD_C_OperateCard')
        OperateCard.cbOperateCode = action
        OperateCard.cbOperateCardData = operateCards
        socket.sendMessage(MDM_GF_GAME,SUB_C_OPERATE_CARD,OperateCard)
    },
    sendMessage_peng:function(operateCards)
    {
        var OperateCard = getObjWithStructName('CMD_C_OperateCard')
        OperateCard.cbOperateCode = WIK_PENG
        OperateCard.cbOperateCardData = operateCards
        socket.sendMessage(MDM_GF_GAME,SUB_C_OPERATE_CARD,OperateCard)
    },
    sendMessage_gang:function(operateCards)
    {
        var OperateCard = getObjWithStructName('CMD_C_OperateCard')
        OperateCard.cbOperateCode = WIK_GANG
        OperateCard.cbOperateCardData = operateCards
        socket.sendMessage(MDM_GF_GAME,SUB_C_OPERATE_CARD,OperateCard)
    },
    sendMessage_hu:function()
    {
        var OperateCard = getObjWithStructName('CMD_C_OperateCard')
        OperateCard.cbOperateCode = WIK_CHI_HU
        socket.sendMessage(MDM_GF_GAME,SUB_C_OPERATE_CARD,OperateCard)
    },
    sendMessage_guo:function()
    {
        var OperateCard = getObjWithStructName('CMD_C_OperateCard')
        OperateCard.cbOperateCode = WIK_NULL
        socket.sendMessage(MDM_GF_GAME,SUB_C_OPERATE_CARD,OperateCard)
    },
    searchGangIdxs:function() //自摸杠时找到杠哪个 服务器传 TODO
    {
        var selfChairId = tableData.getUserWithUserId(selfdwUserID).wChairID
        var direction = tableData.getShowChairIdWithServerChairId(selfChairId)

        var handMajiangs = playNode.handMajiangs4D[direction]
        var handIdxs = handMajiangs[1]?[handMajiangs[1].cardData]:[]
        for(var i=0;i<handMajiangs[0].length;i++)
        {
            handIdxs[handIdxs.length] = handMajiangs[0][i].cardData
        }
        majiangLogic.sortWithCardData(handIdxs)

        var anGangIdxs = []
        for(var i=0;i<handIdxs.length;i++)
        {
            var idx = handIdxs[i]
            if(i>0 && idx == handIdxs[i-1])
                continue

            var isHas = majiangLogic.isHas(handIdxs, [], [idx, idx, idx, idx])
            if(isHas[0])
                anGangIdxs[anGangIdxs.length] = idx
        }

        /////////
        var majiangsOneDirection = playNode.weaveMajiangs4D[direction]
        var weavePengIdxs = []
        for(var i=0;i<majiangsOneDirection.length;i++)
        {
            var majiangsOneGroup = majiangsOneDirection[i]
            if(majiangsOneGroup.cbWeaveKind == WIK_PENG)
                weavePengIdxs[weavePengIdxs.length] = majiangsOneGroup[0].cardData   
        }

        var zengGangIdxs = []
        for(var i=0;i<handIdxs.length;i++)
        {
            var idx = handIdxs[i]
            if(i>0 && idx == handIdxs[i-1])
                continue
            var isHas = false
            for(var j=0;j<weavePengIdxs.length;j++)
            {
                if(idx==weavePengIdxs[j])
                    isHas = true
            }
            if(isHas)
                zengGangIdxs[zengGangIdxs.length] = idx
        }    

        var gangIdxs = anGangIdxs.concat(zengGangIdxs)
        return gangIdxs
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
            call.xiapao = playNode.gamesetTTF1.getString()
            call.jiading = playNode.gamesetTTF2.getString()
            socket.sendMessage(MDM_GF_GAME,SUB_C_CALL,call)

            playNode.gamesetNode.setVisible(false)
        }

        playNode.actionCall_chi = function()
        {
            var btn = playNode.btn_chi
            var actions = btn.actions
            var provideIdx = btn.cardData

            var sendChi = function(sortedOperateIdxs, action)
            {
                var operateIdxs = playNode.sortedOperateIdxs2OperateIdxs(provideIdx, sortedOperateIdxs)
                playNode.sendMessage_chi(operateIdxs, action)
                playNode.hideActionBtns()
            }

            if(actions.length>1)
            {
                playNode.btn_chi.setVisible(false)
                playNode.btn_peng.setVisible(false)
                playNode.btn_gang.setVisible(false)
                playNode.btn_ting.setVisible(false)
                playNode.btn_hu.setVisible(false)

                var idxsArray = []
                for(var i=0;i<actions.length;i++)
                {
                    idxsArray[i] = playNode.getSortedOperateIdxs(provideIdx, actions[i])
                }

                majiangFactory.showChoosePopOfAction(idxsArray, actions, sendChi)
            }
            else
            {
                var sortedOperateIdxs = playNode.getSortedOperateIdxs(provideIdx, actions[0])
                sendChi(sortedOperateIdxs, actions[0])
            }
        }

        playNode.actionCall_peng = function()
        {
            var btn = playNode.btn_peng
            playNode.sendMessage_peng([btn.cardData, btn.cardData, btn.cardData] )
            playNode.hideActionBtns()
        }

        playNode.actionCall_gang = function()
        {
            var btn = playNode.btn_gang

            var sendGang = function(sortedOperateIdxs)
            {
                playNode.sendMessage_gang(sortedOperateIdxs)
                playNode.hideActionBtns()
            }

            if(cmdBaseWorker.wCurrentUser != INVALID_WORD) //自摸杠
            {
                var idxs = playNode.searchGangIdxs()
                if(idxs.length>1)
                {
                    playNode.btn_chi.setVisible(false)
                    playNode.btn_peng.setVisible(false)
                    playNode.btn_gang.setVisible(false)
                    playNode.btn_ting.setVisible(false)
                    playNode.btn_hu.setVisible(false)

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
                sendGang([btn.cardData, btn.cardData, btn.cardData, btn.cardData])
            }
        }

        playNode.actionCall_ting = function()
        {
            alert('actionCall_ting')
        }

        playNode.actionCall_hu = function()
        {
            var btn = playNode.btn_hu
            playNode.sendMessage_hu()
            playNode.hideActionBtns()
        }

        playNode.actionCall_guo = function()
        {
            var btn = playNode.btn_guo

            //if(cmdBaseWorker.wCurrentUser == INVALID_WORD) //摸牌前的吃碰杠 过得话才会发SUB_C_OPERATE_CARD
            //{
                playNode.sendMessage_guo()
            //}
            playNode.hideActionBtns()  
            majiangFactory.chooseItemsNode.removeAllChildren() 
        }
    },
    ///////////////////////init end///////////////////////

    ///////////////cmdEvent start//////////
    updateOnFree:function()
    {
        var users = tableData.getUsersInTable(tableData.getUserWithUserId(selfdwUserID).wTableID)
       
        if(users.length>=GAME_PLAYER)
        {   
            if(tableData.managerUserID == selfdwUserID)
            {
                tableNode.shareButton.setVisible(false);
            }
        } 
        else 
            tableNode.shareButton.setVisible(true);

        if(!playNode.isLookingResult)
        {
            if(tableData.getUserWithUserId(selfdwUserID).cbUserStatus == US_SIT)
                socket.sendMessage(MDM_GF_FRAME, SUB_GF_USER_READY)
        }
    },
    onCMD_StatusFree:function() 
    {
        playNode.isPlaying = false

        cocos.setInterval(playNode.updateOnFree, 1000, playNode.node)
    },
    onCMD_StatusCall:function()
    {
        playNode.isPlaying = true

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
        //林州规则：
        tableNode.setBankerIcon(cmdBaseWorker.wBankerUser, true)

        playNode.isPlaying = true
        playNode.scoreTTF.setString(cmdBaseWorker.cbLeftCardCount)

        playNode.showLaizi(cmdBaseWorker.cbMagicCardData)
        majiangFactory.initCardData2ScoreMap( [cmdBaseWorker.cbMagicCardData, REPLACE_CARD_DATA], [0, cmdBaseWorker.cbMagicCardData] )

        playNode.timer.initFenwei( tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wBankerUser) )
        playNode.timer.switchTimer(cmdBaseWorker.wCurrentUser==INVALID_WORD?[]:[tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wCurrentUser)])
        playNode.timerNode.setVisible(true)


        var self = tableData.getUserWithUserId(selfdwUserID)
        for(var i=0;i<GAME_PLAYER;i++)
        {
            var user = tableData.getUserWithTableIdAndChairId(self.wTableID, i)
            playNode.setSeatFeng(i)
            //user.userNodeInsetChair.currentRoundNode.upTTF.setString( '下跑:'+cmdBaseWorker.cbCallRecord[i][0]+' 加顶:' + cmdBaseWorker.cbCallRecord[i][1] )
        }

        /////吃碰杠胡
        var sortedActions = majiangLogic.getSortedActionsWithMask(cmdBaseWorker.cbActionMask)
        var isActioning = sortedActions.length>0
        if(isActioning && tableData.getUserWithUserId(selfdwUserID).wChairID != INVALID_WORD)
            playNode.showActionBtns(cmdBaseWorker.cbProvideCardData, sortedActions)

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
                var t = weaveItems[j].cbCardData
                weaveItems[j].cbCardData = playNode.sortWeaveIdxs(weaveItems[j].cbWeaveKind, t)

                weaveItems[j].provideDirection = tableData.getShowChairIdWithServerChairId(weaveItems[j].wProvideUser)
            }
            weaveItemArray[direction] = weaveItems

            var idxs = []
            for(var j=0;j<MAX_COUNT;j++)
            {
                idxs[j] = 0
            }
            
            var cbHandCardData= ( direction == 0 || isRecordScene ) ?cmdBaseWorker.cbHandCardData[i]:idxs
            if (cbHandCardData.length == 0) 
            {
                cbHandCardData = idxs
            };
            var handIdxs = cbHandCardData.slice(0, cmdBaseWorker.cbHandCardCount[i])
            if(cmdBaseWorker.wCurrentUser==i)
            {
                handIdxsArray[direction][0] = handIdxs.slice(0, handIdxs.length-1)
                handIdxsArray[direction][1] = handIdxs[handIdxs.length-1]
            }
            else
                handIdxsArray[direction][0] = handIdxs

            discardIdxsArray[direction] = cmdBaseWorker.cbDiscardCardData[i].slice(0, cmdBaseWorker.cbDiscardCount[i])
        }
    
        // console.log(6666, handIdxsArray, discardIdxsArray, weaveItemArray)
        playNode.sortHandIdxs(handIdxsArray[0][0]) 

        /// get heapIdxsArray
        var heapIdxsArray = []
        for(var i=0;i<GAME_PLAYER;i++)
        {
            var direction = i
            var serverChairid = tableData.getServerChairIdWithShowChairId(direction)

            heapIdxsArray[direction] = []
            var wMinusHeadCount = cmdBaseWorker.cbHeapCardInfo[serverChairid][0]
            var wMinusLastCount = cmdBaseWorker.cbHeapCardInfo[serverChairid][1]
            for(var j=0;j<HEAP_FULL_COUNT;j++)
            {
                if(j>=wMinusHeadCount && j<HEAP_FULL_COUNT-wMinusLastCount)
                    heapIdxsArray[direction][j] = 0
                else
                    heapIdxsArray[direction][j] = INVALID_BYTE
            }
        }
        var wTurnoverCardHeapDir = tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wTurnoverCardHeapDir)
        var wTurnoverCardHeapPos = cmdBaseWorker.wTurnoverCardHeapPos
        if(heapIdxsArray[wTurnoverCardHeapDir][wTurnoverCardHeapPos] == 0)
            heapIdxsArray[wTurnoverCardHeapDir][wTurnoverCardHeapPos] = cmdBaseWorker.cbTurnoverCardData

        playNode.sendCardsAction(handIdxsArray, discardIdxsArray, weaveItemArray, heapIdxsArray, [[],[],[],[]]) 

        if(cmdBaseWorker.wOutCardUser!=INVALID_WORD)
        {
            var d = tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wOutCardUser)
            majiangFactory.setCurrentDiscardMj(playNode.discardMajiangs4D, d) 
        }
    },
    onCMD_Call:function()
    {
        cocos.clearInterval(playNode.updateOnFree, playNode.node)
        playNode.isPlaying = true

        if(playNode.isLookingResult)
        {
            playNode.resetPlayNode()
        } 

        /////
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
    onCMD_GameStart:function() 
    {
        playNode.scoreTTF.setString(cmdBaseWorker.cbLeftCardCount)
       // playNode.isPlaying=true;
        if(!playNode.isPlaying)//有的游戏有call状态
        {
            cocos.clearInterval(playNode.updateOnFree, playNode.node)
            playNode.isPlaying = true

            if(playNode.isLookingResult)
            {
                playNode.resetPlayNode()
            } 
        }

        majiangFactory.initCardData2ScoreMap( [cmdBaseWorker.cbMagicCardData, REPLACE_CARD_DATA], [0, cmdBaseWorker.cbMagicCardData] )
        var self = tableData.getUserWithUserId(selfdwUserID)
        for(var i=0;i<GAME_PLAYER;i++)
        {
            var user = tableData.getUserWithTableIdAndChairId(self.wTableID, i)
           // user.userNodeInsetChair.currentRoundNode.upTTF.setString( '下跑:'+cmdBaseWorker.cbCallRecord[i][0]+' 加顶:' + cmdBaseWorker.cbCallRecord[i][1] )
        }

        //get handIdxsArray
        var handIdxsArray = []
        for(var i=0;i<GAME_PLAYER;i++)
        {
            var direction = i
            var serverChairid = tableData.getServerChairIdWithShowChairId(direction)
            playNode.setSeatFeng(i)
            var idxs = []
            for(var ii=0;ii<MAX_COUNT;ii++)
            {
                idxs[ii] = 0
            }
            if(serverChairid==self.wChairID || isRecordScene )
                idxs = cmdBaseWorker.cbHandCardData[serverChairid].slice(0, MAX_COUNT)

            if(cmdBaseWorker.wCurrentUser == serverChairid)
            {   
                var oldIdxs = idxs.slice(0, MAX_COUNT-1)
                var newGetIdx = idxs.slice(MAX_COUNT-1, MAX_COUNT)[0]
                handIdxsArray[direction] = [oldIdxs, newGetIdx]
            }
            else
            {
                var oldIdxs = idxs.slice(0, MAX_COUNT-1)
                handIdxsArray[direction] = [oldIdxs, null]
            }
        }
        playNode.sortHandIdxs(handIdxsArray[0][0]) 

        //get heapIdxsArray 实现好后整理代码
        var heapIdxsArray = []
        for(var i=0;i<GAME_PLAYER;i++)
        {
            var direction = i
            var serverChairid = tableData.getServerChairIdWithShowChairId(direction)

            heapIdxsArray[direction] = []
            var wMinusHeadCount = cmdBaseWorker.cbHeapCardInfo[serverChairid][0]
            var wMinusLastCount = cmdBaseWorker.cbHeapCardInfo[serverChairid][1]
            for(var j=0;j<HEAP_FULL_COUNT;j++)
            {
                if(j>=wMinusHeadCount && j<HEAP_FULL_COUNT-wMinusLastCount)
                    heapIdxsArray[direction][j] = 0
                else
                    heapIdxsArray[direction][j] = INVALID_BYTE
            }
        }
        var wTurnoverCardHeapDir = tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wTurnoverCardHeapDir)
        var wTurnoverCardHeapPos = cmdBaseWorker.wTurnoverCardHeapPos
        if(heapIdxsArray[wTurnoverCardHeapDir][wTurnoverCardHeapPos] == 0)
            heapIdxsArray[wTurnoverCardHeapDir][wTurnoverCardHeapPos] = cmdBaseWorker.cbTurnoverCardData
                   
        playNode.sendCardsAction(handIdxsArray, [[],[],[],[]], [[],[],[],[]], heapIdxsArray, [[],[],[],[]]) 


        /////摸到麻将时有可能出现杠听胡
        var sortedActions = majiangLogic.getSortedActionsWithMask(cmdBaseWorker.cbActionMask)
        if(sortedActions.length>0)
            playNode.showActionBtns(null, sortedActions)  //自摸杠 idx不确定 需要searchGangIdxs
           
        //playNode.actionBtns.setVisible(false)
        playNode.setCurrentRoundNodesVisible(false)

        if ( !isRecordScene )
           managerTouch.closeTouch() //避免在不知道牌的情况下 把牌打出去
        var bankerShowChairid = tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wBankerUser)
        playNode.setCurrentRoundNodesVisible(false)
        playNode.actionNode.setVisible(false)
        playNode.mjsNode.setVisible(false)

        //提前保存可能被破坏的数据  掷骰子是庄家出牌破坏数据 因为可能庄家筛子先出完
        function gameStart()
        {
            playNode.showLaizi(cmdBaseWorker.cbMagicCardData)
            playNode.timer.initFenwei( bankerShowChairid )
            playNode.timerNode.setVisible(true)
            playNode.setCurrentRoundNodesVisible(true)
            playNode.actionNode.setVisible(true)
            playNode.mjsNode.setVisible(true)            
            managerTouch.openTouch()
        }

        function bankerPlayDice()
        {
            tableNode.setBankerIcon(cmdBaseWorker.wBankerUser, true)
            var siceNum1 = cmdBaseWorker.cbSiceCount1   //getRandNum(Math.max(cmdBaseWorker.cbSiceCount-6, 1), Math.min(cmdBaseWorker.cbSiceCount-1, 6))
            var siceNum2 = cmdBaseWorker.cbSiceCount2   //cmdBaseWorker.cbSiceCount - siceNum1
            playNode.playDiceOneDirection(gameStart, siceNum1, siceNum2, bankerShowChairid)
        }
        
        cmdBaseWorker.bIsRandBanker = !(cmdBaseWorker.cbSBankCount1 == 0);
        if(cmdBaseWorker.bIsRandBanker)
            playNode.playDiceForRandBanker(bankerPlayDice, bankerShowChairid)
        else
            bankerPlayDice()
        
          

    },
    onCMD_OutCard:function() 
    {
        cmdBaseWorker.wCurrentUser = INVALID_WORD
        playNode.hideActionBtns()

        var outUser = tableData.getUserWithChairId(cmdBaseWorker.wOutCardUser)
        var outDir = tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wOutCardUser)  
        var outIdx = cmdBaseWorker.cbOutCardData

        playNode.timer.switchTimer([])
        playNode.playMajiangEffect(outIdx, outUser.cbGender)
        managerAudio.playEffect('gameRes/sound/discard.mp3')

        var majiangs = playNode.handMajiangs4D[outDir]
        if(outUser.dwUserID==selfdwUserID || isRecordScene)
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
    },
    onCMD_SendCard:function() 
    {
        playNode.scoreTTF.setString(cmdBaseWorker.cbLeftCardCount)
        managerAudio.playEffect('gameRes/sound/sendcard.mp3')

        var dir =  tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wCurrentUser)   
        playNode.timer.switchTimer([dir])

        var currentUser = tableData.getUserWithChairId(cmdBaseWorker.wCurrentUser)
        var newMjIdx = ( currentUser.dwUserID==selfdwUserID || isRecordScene ) ?cmdBaseWorker.cbSendCardData:0

        majiangFactory.addHandMajiangNew(playNode.handMajiangs4D[dir], dir, newMjIdx, playNode.mjsNode)

        /////摸到麻将时有可能出现杠听胡
        var sortedActions = majiangLogic.getSortedActionsWithMask(cmdBaseWorker.cbActionMask)
        if(sortedActions.length>0 && currentUser.dwUserID == selfdwUserID)
            playNode.showActionBtns(null, sortedActions)  //自摸杠 idx不确定 需要searchGangIdxs
    

       // var heapMajiangsDir = tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wSendHeapDir)  
      //  majiangFactory.deleteHeapMajiangs(playNode.heapMajiangs4D[heapMajiangsDir], cmdBaseWorker.wSendHeapPosArray)
    },
    onCMD_OperateNotify:function() 
    {
        var sortedActions = majiangLogic.getSortedActionsWithMask(cmdBaseWorker.cbActionMask)
        var idx = cmdBaseWorker.cbProvideCardData
        playNode.showActionBtns(idx, sortedActions)
    },
    onCMD_OperateResult:function() 
    {
        
        playNode.scoreTTF.setString(cmdBaseWorker.cbLeftCardCount)

        playNode.hideActionBtns()
        majiangFactory.hideCurrentDiscardMj()

        var operateUser = tableData.getUserWithChairId(cmdBaseWorker.wOperateUser)
        var provideUser = tableData.getUserWithChairId(cmdBaseWorker.wProvideUser)
        var majiangs3W4D = {
            handMajiangs4D:playNode.handMajiangs4D,
            discardMajiangs4D:playNode.discardMajiangs4D,
            weaveMajiangs4D:playNode.weaveMajiangs4D,
        }

        var idxs = playNode.sortWeaveIdxs(cmdBaseWorker.cbOperateCode, cmdBaseWorker.cbOperateCardData)
        majiangFactory.onActionResult(cmdBaseWorker.cbOperateCode, idxs, operateUser, provideUser,
            majiangs3W4D, playNode.mjsNode)

        playNode.playAction(cmdBaseWorker.cbOperateCode, operateUser)

        playNode.timer.switchTimer(cmdBaseWorker.wCurrentUser==INVALID_WORD?[]:[tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wCurrentUser)])

        //var currentUser = tableData.getUserWithChairId(cmdBaseWorker.wCurrentUser)
        /////吃碰杠后可以继续杠 必须在摸牌后才能杠
        //var sortedActions = majiangLogic.getSortedActionsWithMask(cmdBaseWorker.cbActionMask)
        //if(sortedActions.length>0 && currentUser.dwUserID == selfdwUserID)
        //    playNode.showActionBtns(null, sortedActions)  //自摸杠 idx不确定 需要searchGangIdxs
    },
    onCMD_GameEnd:function() 
    {

        //console.log('-------onCMD_GameEnd-----------')
        playNode.gamesetNode.setVisible(false)
        playNode.isPlaying = false

        //
         setTimeout(function()
         {
             var record = getObjWithStructName('CMD_GR_C_TableHistoryRecordReq') 
             record.szTableKey = tableKey
             socket.sendMessage(MDM_GR_USER, SUB_GR_USER_TABLE_HISTORY_RECORD_REQ, record)
         },2000)
        //
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
                    majiangFactory.hideCurrentDiscardMj()
                    playNode._showSprsOnGameEnd()
                }), 
              //  cc.delayTime(1), //看牌5秒
                cc.callFunc(function()
                {   
                    headIconPop.kickUserOnGameEnd()
                    for(var i=0;i<GAME_PLAYER;i++)
                    {
                        tableNode.setBankerIcon(i, false)
                    }

                    var continueCall = function()
                    {
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
            //var isAllowOut = majiang.cardData != cmdBaseWorker.cbMagicCardData && cmdBaseWorker.wCurrentUser == tableData.getUserWithUserId(selfdwUserID).wChairID
            //var isAllowOut = !(!MAGIC_CARD_ALLOWOUT && majiang.cardData == cmdBaseWorker.cbMagicCardData) && cmdBaseWorker.wCurrentUser == tableData.getUserWithUserId(selfdwUserID).wChairID
            //var isAllowOut = cmdBaseWorker.wCurrentUser == tableData.getUserWithUserId(selfdwUserID).wChairID
            //if(isAllowOut)
            //{
                //cmdBaseWorker.wCurrentUser = INVALID_WORD

                var OutCard = getObjWithStructName('CMD_C_OutCard')
                OutCard.cbOutCardData = majiang.cardData
                socket.sendMessage(MDM_GF_GAME,SUB_C_OUT_CARD,OutCard)
                //playNode.hideActionBtns()
            //}
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
    ////////////sendCardsAction end//////////


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
    getUserFeng:function(wChairID)
    {
        var changeChair = wChairID - cmdBaseWorker.wBankerUser 
        if (changeChair>=0)
            return 27 + changeChair;
        else
            return 27 + (4 + changeChair);
    },
    ///gameend end////


    /////other ui start////////
    addAPlayerCard:function(index,cParent)
    {
        var direction = index
        var chairid = tableData.getServerChairIdWithShowChairId(direction)
        var user = tableData.getUserWithTableIdAndChairId(self.wTableID, chairid)
        var weaveItems = cmdBaseWorker.WeaveItemArray[chairid]
        var cardIndex = -1
        var sPosX = 160-150 + 5
        var oPosY = 20

        var fanText = cc.LabelTTF.create('', "Helvetica", 24)
        fanText.setFontFillColor( cc.color(255, 255, 255, 255) )
        fanText.setString(cmdBaseWorker.cbIGameFan[chairid] + "台")
        fanText.x = 0*40 +160+5;
        fanText.y = 85
        cParent.addChild(fanText)

        
        //////
        if (cmdBaseWorker.cbProvideCardData != 0) cmdBaseWorker.cbEndCard = cmdBaseWorker.cbProvideCardData;
        for(var i = 0;i<MAX_WEAVE;i++)
        {
            var midPos = 0;
            for(var j = 0;j<4;j++){
            if (j == 0 ) cardIndex+=0.3
           
            var cardIdx = weaveItems[i].cbCardData[j]
            if(j<3&&cardIdx==0)
            {
                cardIdx = weaveItems[i].cbCenterCardData
            }
            if (cardIdx>0) {
                var aCard
                if (weaveItems[i].cbPublicCard == false && j < 3){
                    aCard = new cc.Sprite('#style0_down_discard0.png')
                    aCard.setScale(0.96+0.2)
                }
                else{
                    aCard = majiangFactory.getOne(cardIdx, 1, 0, true)
                    aCard.setScale(1+0.2)
                }
                aCard.setLocalZOrder(-1)
                if (weaveItems[i].cbWeaveKind == WIK_GANG && j == 3 ) 
                {
                    cardIndex -=2;
                    aCard.x = midPos;//sPosX+( cardIndex+1 )*(aCard.getContentSize().width*aCard.getScale() - 2), aCard.getContentSize().height /2 *aCard.getScale()  
                    aCard.y = oPosY +10
                    cardIndex++
                }else{
                    aCard.x = sPosX+( cardIndex+1 )*(aCard.getContentSize().width*aCard.getScale() - 2), aCard.getContentSize().height /2 *aCard.getScale()  
                    aCard.y = oPosY
                    if (j == 1) 
                    {
                        midPos = aCard.x
                    };
                }
                
              //  if (!(isQiang && cardIdx == cmdBaseWorker.cbProvideCard)) 
                    cParent.addChild(aCard)
                cardIndex++;
            };
        }
        }
        if (cardIndex<1) {cardIndex-=1};
        cardIndex += 0.2;
        for(var i = 0;i<MAX_COUNT;i++)
        {
            var cardIdx = cmdBaseWorker.cbHandCardData[chairid][i]
            if (cardIdx>0 ) 
            {

                var aCard = majiangFactory.getOne(cardIdx, 1, 0, true)
                aCard.setScale(1+0.2)
                aCard.setLocalZOrder(-1)
                aCard.x = sPosX+( cardIndex+1 )*(aCard.getContentSize().width*aCard.getScale() - 2), aCard.getContentSize().height /2 *aCard.getScale()  
                aCard.y = oPosY
                if (cardIdx == cmdBaseWorker.cbEndCard && cmdBaseWorker.cbHandCardCount[chairid] + cmdBaseWorker.cbWeaveCount[chairid]*3 == MAX_COUNT) 
                {
                    cardIndex--
                    cmdBaseWorker.cbHandCardCount[chairid]--;
                    aCard.x = sPosX+( MAX_COUNT+1.5)*(aCard.getContentSize().width*aCard.getScale() - 2), aCard.getContentSize().height /2 *aCard.getScale()  
                    if ( cmdBaseWorker.wEndCardType == 1 ) //添加生张标志 
                    {
                        var sz = new cc.Sprite('#shengzhang.png')
                        aCard.addChild(sz)
                        sz.setScale( aCard.getScale()*0.6)

                        sz.setAnchorPoint(1,0)
                        sz.x = aCard.width*0.95;// (aCard.width - sz.width)*aCard.getScale();
                        sz.y = aCard.height * 0.15 * aCard.getScale();
                    };
                }
                cParent.addChild(aCard)
                cardIndex++;
            };
        }
        
            
        
    },
    showGameset:function()
    {
        var isBanker = tableData.getUserWithUserId(selfdwUserID).wChairID == cmdBaseWorker.wBankerUser
        playNode.jiadingBtn1.setEnabled(!isBanker)
        playNode.jiadingBtn2.setEnabled(!isBanker)

        playNode.gamesetTTF1.setString('0')
        playNode.gamesetTTF2.setString('0')

        playNode.gamesetNode.setVisible(false)//true)
    },
    setSeatFeng:function(wChairID)
    {
        var tabelId = tableData.getUserWithUserId(selfdwUserID).wTableID
        var user = tableData.getUserWithTableIdAndChairId(tabelId, wChairID)
        
        if (! user) return;
        if (! user.userNodeInsetChair)return;
        if (! user.userNodeInsetChair.dingNode) 
        {
            user.userNodeInsetChair.dingNode = new cc.Node();
            user.userNodeInsetChair.addChild(user.userNodeInsetChair.dingNode);
        };

        var fNames = []
        fNames[0] = "#bankerIcon.png"
        fNames[1] = "#img_nan.png"
        fNames[2] = "#img_xi.png"
        fNames[3] = "#img_bei.png"


        var fIcon = new cc.Sprite(fNames[playNode.getUserFeng(wChairID)-27])
        //fIcon.x = 25;
        //fIcon.y = 25
        user.userNodeInsetChair.bankerNode.addChild(fIcon);
    },
    setCurrentDiscardMj:function(idx, direction)
    {
        var self = tableData.getUserWithUserId(selfdwUserID)
        var d = tableData.getShowChairIdWithServerChairId(self.wChairID)
        if(d == direction)
            majiangFactory.hideCurrentDiscardMj()
        else
           majiangFactory.setCurrentDiscardMj(idx, direction)
    },
    hideLaizi:function()
    {
        playNode.laiziNode.removeAllChildren()
        // playNode.laiziMjNode.removeAllChildren()
        // playNode.laiziNode.setVisible(false)
    },
    playAction:function(WIK, user)
    {
        playNode.playActionEffect(WIK, user.cbGender)
        managerAudio.playEffect('gameRes/sound/weave.mp3')

        var name = typeof(WIK)=='number'?majiangLogic.wik2Name(WIK):WIK

        playNode.playAnimationWithDirection(name, tableData.getShowChairIdWithServerChairId(user.wChairID))
    },
    hideActionBtns:function()
    {
        majiangFactory.chooseItemsNode.removeAllChildren()
        playNode.btn_guo.setVisible(false)
        playNode.btn_chi.setVisible(false)
        playNode.btn_peng.setVisible(false)
        playNode.btn_gang.setVisible(false)
        playNode.btn_ting.setVisible(false)
        playNode.btn_hu.setVisible(false)
    },
    showActionBtns:function(idx, sortedActions)
    {
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
            else if(action == WIK_LEFT || action == WIK_CENTER || action == WIK_RIGHT)
            {
                btn = playNode.btn_chi
                btn.actions = sortedActions.slice(0, i+1)
            }

            btn.setVisible(true)
            btn.setPositionX(-110 * (sortedActions.length-1-i +1))
            btn.cardData = idx
            if(btn==playNode.btn_chi)
                break
        }
    },
    playAnimationOfGameEnd:function(call)
    {

       // console.log( '=====playAnimationOfGame========' )
        var winner = cmdBaseWorker.wWinner
        if(cmdBaseWorker.endType == 0)
            call()
        else if(cmdBaseWorker.endType == 1)
        {
            var spr = actionFactory.getSprWithAnimate('lj', true, 0.15, call)
            playNode.mjsNode.addChild(spr)
            spr.x = playNode.mjsNode.width*0.5
            spr.y = playNode.mjsNode.height*0.5
        }
        else if(cmdBaseWorker.endType == 2)
        {
            playNode.playAnimationWithDirection('zim', tableData.getShowChairIdWithServerChairId(winner), call)
            playNode.playGenderEffect('zimo0', tableData.getUserWithChairId(winner).cbGender)
        }
        else if(cmdBaseWorker.endType == 3)
        {
            playNode.playAnimationWithDirection('hu', tableData.getShowChairIdWithServerChairId(winner), call)
            playNode.playAnimationWithDirection('dp', tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wProvideUser))
            playNode.playActionEffect('hu', tableData.getUserWithChairId(winner).cbGender)
        }
        var selfChairId = tableData.getUserWithUserId(selfdwUserID).wChairID

        if (cmdBaseWorker.wWinner == selfChairId) 
        {
            managerAudio.playEffect('gameRes/sound/win.mp3')
        }else{
            managerAudio.playEffect('gameRes/sound/loss.mp3')
        }
           

    },
    /////other ui end////////
    
    getSoundName:function(idx) 
    {
        return idx
    },
    getActionSoundName:function(WIK, num) 
    { 
        num = num || 1
        var name = typeof(WIK)=='number'?majiangLogic.wik2Name(WIK):WIK
        return name + (Math.ceil(Math.random()*10))%num        
    },
    playMajiangEffect:function(idx, isMan)
    {
        var name = playNode.getSoundName(idx)
        playNode.playGenderEffect(name, isMan)
    },
    playActionEffect:function(WIK, isMan)
    {
        var name = playNode.getActionSoundName(WIK)
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
    bao2Cai:function(idx)
    {
        if(idx == REPLACE_CARD_DATA)
            idx = cmdBaseWorker.cbMagicCardData
        return idx
    }, 
    cai2Bao:function(idx)
    {
        if(idx == cmdBaseWorker.cbMagicCardData)
            idx = REPLACE_CARD_DATA
        return idx
    },
    getSortedOperateIdxs:function(provideIdx, action)
    {
        switch(action)
        {
            case WIK_LEFT:
                return [provideIdx, playNode.cai2Bao(playNode.bao2Cai(provideIdx)+1), playNode.cai2Bao(playNode.bao2Cai(provideIdx)+2)]
            case WIK_CENTER:
                return [ playNode.cai2Bao(playNode.bao2Cai(provideIdx)-1), provideIdx, playNode.cai2Bao(playNode.bao2Cai(provideIdx)+1)]
            case WIK_RIGHT:
                return [playNode.cai2Bao(playNode.bao2Cai(provideIdx)-2), playNode.cai2Bao(playNode.bao2Cai(provideIdx)-1), provideIdx]
            case WIK_PENG:
                return [provideIdx, provideIdx, provideIdx]
            case WIK_GANG:
                return [provideIdx, provideIdx, provideIdx, provideIdx]
        }
    },
    //给服务器的OperateIdxs 要求provideIdx排在最前面
    sortedOperateIdxs2OperateIdxs:function(provideIdx, sortedOperateIdxs)
    {
        var operateIdxs = clone(sortedOperateIdxs)
        for(var i = 0;i<operateIdxs.length;i++)
        {
            if(operateIdxs[i] == provideIdx)
            {
                return operateIdxs.splice(i, 1).concat(operateIdxs)
            }
        }
    }, 
    sortHandIdxs:function(idxs)
    {
        majiangFactory.sortCardDatasWithScore(idxs, cmdBaseWorker.cbMagicCardData)
    },
    sortWeaveIdxs:function(kind, idxs)
    {
        var weaveIdxs = clone(idxs)
        if(kind == WIK_RIGHT || kind==WIK_CENTER || kind==WIK_LEFT)
        {
            weaveIdxs.sort(function(a,b)
            {   
                return playNode.bao2Cai(a) - playNode.bao2Cai(b)
            })
        }

        return weaveIdxs
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
           // if(direction == 3)
                playNode.playDiceOneDirection(call, nums[0], nums[1], direction)
         //    else
         //       playNode.playDiceOneDirection(function()
         //           {
         //               playDice(direction+1)
         //           }, nums[0], nums[1], direction)
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
            call?call():''
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
        playNode._removeSprsOnGameEnd()
        playNode.timerNode.setVisible(false)
        playNode.hideLaizi()
    }
}

