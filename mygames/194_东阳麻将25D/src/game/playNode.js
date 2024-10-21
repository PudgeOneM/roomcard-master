
////先理解majiangFactory(components/majiangFactory/majiangFactory)
var playNode = 
{   
    handMajiangs4D:[],//手牌麻将精灵数组 4个方向的
    handGroupNode4D:[],//手牌麻将精灵父节点 4个方向的
    discardMajiangs4D:[],//丢弃麻将精灵数组 4个方向的
    weaveMajiangs4D:[],//吃碰杠麻将精灵数组 4个方向的
    isLookingResult:false,
    isPlaying:false,
    isRevSence:false,
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

        var bindListener = function(callFunc, node)
        {
            var listener = cc.EventListener.create
            ({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: false,
                onTouchBegan: function (touch, event) 
                {
                    var target = event.getCurrentTarget()
                    if(!target.isVisible()) return false
                    var locationInNode = target.convertToNodeSpace(touch.getLocation())
                    var rect = cc.rect(0, 0, target.getContentSize().width, target.getContentSize().height)
                    var isTouchInNode = cc.rectContainsPoint(rect, locationInNode)
                    
                    if(isTouchInNode) {
                        return true
                    }
                    return false
                },
                onTouchEnded: function (touch, event) 
                {
                    var target = event.getCurrentTarget()
                    var locationInNode = target.convertToNodeSpace(touch.getLocation())
                    var rect = cc.rect(0, 0, target.getContentSize().width, target.getContentSize().height)
                    var isTouchInNode = cc.rectContainsPoint(rect, locationInNode)
                    
                    if(isTouchInNode) 
                        callFunc()
                }
            })
            cc.eventManager.addListener(listener, node)
        }

        ////////////////////////吃////////////////////////
        var actionCall_chi = function()
        {
            playNode.actionCall_chi()
        }
        bindListener(actionCall_chi, playNode.btn_chi)

        ////////////////////////碰////////////////////////
        var actionCall_peng = function()
        {
            playNode.actionCall_peng()
        }
        bindListener(actionCall_peng, playNode.btn_peng)

        // ////////////////////////杠////////////////////////
        var actionCall_gang = function()
        {
            playNode.actionCall_gang()
        }
        bindListener(actionCall_gang, playNode.btn_gang)


        ////////////////////////胡////////////////////////
        var actionCall_hu = function()
        {
            playNode.actionCall_hu()
        }
        bindListener(actionCall_hu, playNode.btn_hu)


        ////////////////////////过////////////////////////
        var actionCall_guo = function()
        {
            playNode.actionCall_guo()
        }
        bindListener(actionCall_guo, playNode.btn_guo)

        ////////////////////////补花////////////////////////
        var actionCall_replace = function()//不需要玩家手动触发 只要收到这个动作 自动执行
        {
            alert('actionCall_replace')  
        }

        ////////////////////////听////////////////////////
        var actionCall_ting = function()
        {
            playNode.actionCall_ting()
        }
        bindListener(actionCall_ting, playNode.btn_ting)
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

        //currentRoundNode.upTTF.setPositionY(65)

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
        // var control = {}
        // control.continueCall = function()
        // {
        //     continueCall()
        //     node.removeFromParent()
        // }
        // var node  = managerRes.loadCCB(resp.gameEndPopCCB, control)

        // playNode.gameEndControl = control

        // control.gendTitle.setSpriteFrame('gendTitle'+cmdBaseWorker.endType + '.png')

        // for(var showChairid=0;showChairid<4;showChairid++)
        // {
        //     var direction = showChairid
        //     var wChairID = tableData.getServerChairIdWithShowChairId(showChairid)

        //     var gendBar = control['gendBar'+wChairID]
        //     var headNode = control['headNode'+wChairID]
        //     var handCardNode = control['handCardNode'+wChairID]
        //     var flowerCardNode = control['flowerCardNode'+wChairID]
        //     var resultTTF = control['resultTTF'+wChairID]
        //     //头像
        //     var headIcon = new cc.Sprite('#headIcon.png')
        //     var hnode = getRectNodeWithSpr(headIcon)
        //     // hnode.x = 70
        //     // hnode.y = 60
        //     var url = userData_gameEnd[wChairID].szHeadImageUrlPath
        //     if(url)
        //     { 
        //         (function(headIcon, url)
        //         {
        //             cc.loader.loadImg(url, {isCrossOrigin : false}, function(err,img){
        //                     var texture2d = new cc.Texture2D()
        //                     texture2d.initWithElement(img)
        //                     texture2d.handleLoadedTexture()

        //                     var frame = new cc.SpriteFrame(texture2d, cc.rect(0, 0, texture2d.getContentSize().width, texture2d.getContentSize().height))
        //                     headIcon.setSpriteFrame(frame)
        //             })
        //         }(headIcon, url))
        //     }

        //     var userName = getLabel(14, 90, 2)
        //     userName.setFontFillColor( cc.color(255, 255, 255, 255) )
        //     userName.x = 0
        //     userName.y = 52
        //     userName.setStringNew(userData_gameEnd[wChairID].szNickName)
        //     hnode.addChild(userName)   

        //     headNode.addChild(hnode)

        //     var dir = (wChairID-cmdBaseWorker.wBankerUser+GAME_PLAYER)%4
        //     var dirSpr = new cc.Sprite('#gendDir' + dir + '.png')
        //     dirSpr.x = 32-13
        //     dirSpr.y = 32-13
        //     hnode.addChild(dirSpr)   

        //     if(wChairID == cmdBaseWorker.wBankerUser)
        //     {
        //         var bankerSpr = new cc.Sprite('#gendIcon_banker.png')
        //         bankerSpr.x = -32
        //         bankerSpr.y = 32
        //         hnode.addChild(bankerSpr)   
        //     }


        //     //胡型
        //     var chrStr = ''
        //     for (var i = 0; i < map_mask2Name.length; i++) 
        //     {
        //         var chr_type = window[ map_mask2Name[i][0] ] 
        //         if (cmdBaseWorker.dwChiHuRight[wChairID] & chr_type)
        //         {
        //             // if(chrStr == '')
        //             //     chrStr += '胡型：'
        //             chrStr += map_mask2Name[i][1] + ' ';
        //         }
        //     }
        //     resultTTF.setString(chrStr)

       
        //     //显示麻将
            
        //     //吃碰杠 牌
        //     var cardNode = new cc.Node()
        //     cardNode.width = 1200
        //     cardNode.height = 120

        //     var weaveItems = cmdBaseWorker.WeaveItemArray[wChairID]
        //     var weaveLen = 0
        //     for(var weaveIdx=0;weaveIdx<weaveItems.length;weaveIdx++)
        //     {
        //         var weaveItem = weaveItems[weaveIdx]
        //         if(weaveItem.cbWeaveKind == WIK_NULL)
        //             continue
        //         weaveLen++
        //         weaveItem.wProvideUser = tableData.getServerChairIdWithShowChairId(0)//这样就不显示箭头了
        //         var majiangsOneWeave = majiangFactory.weaveItem2Majiangs(0, weaveIdx, weaveItem, true)

        //         for(var idxInWeave=0;idxInWeave<majiangsOneWeave.length;idxInWeave++)
        //         {
        //             var mj = majiangsOneWeave[idxInWeave]
        //             cardNode.addChild(mj)
        //         }
        //     }

        //     //手牌            
        //     var oldHandCardDatas = clone(cmdBaseWorker.cbHandCardData[wChairID])
        //     var newGetCardData = null

        //     if(oldHandCardDatas.length + weaveLen*3 == MAX_COUNT)
        //     {
        //         if( cmdBaseWorker.dwChiHuKind[wChairID] == WIK_CHI_HU
        //         && cmdBaseWorker.cbProvideCardData != INVALID_CARD_DATA )
        //         {
        //             for(var j=0;j<oldHandCardDatas.length;j++)
        //             {
        //                 if(oldHandCardDatas[j] == cmdBaseWorker.cbProvideCardData)
        //                 {
        //                     newGetCardData = oldHandCardDatas.splice(j, 1)[0]
        //                     break
        //                 }
        //             }
        //         }
        //         else
        //             newGetCardData = oldHandCardDatas.splice(oldHandCardDatas.length-1, 1)[0]
        //     }
        //     else if( cmdBaseWorker.dwChiHuKind[wChairID] == WIK_CHI_HU
        //         && cmdBaseWorker.cbProvideCardData != INVALID_CARD_DATA )
        //         newGetCardData = cmdBaseWorker.cbProvideCardData 


        //     var handCardDatasArray = [ [oldHandCardDatas, newGetCardData] ]
        //     var handMajiangs= majiangFactory.getHandMajiangsArray(handCardDatasArray, false, true)[0]
        //     for(var i=0;i<handMajiangs[0].length;i++)
        //     {
        //         cardNode.addChild(handMajiangs[0][i])
        //     }
        //     if(handMajiangs[1])
        //     {
        //         cardNode.addChild(handMajiangs[1])
        //         handMajiangs[1].color = cc.color(188, 255, 188)
        //     }
 
        //     cardNode.scaleX = handCardNode.width/cardNode.width
        //     cardNode.scaleY = handCardNode.height/cardNode.height
        //     cardNode.x = -4
        //     cardNode.y = 0
        //     handCardNode.addChild(cardNode)


        //     // //花牌
        //     var cardNode = new cc.Node()
        //     cardNode.width = 1200
        //     cardNode.height = 46

        //     var flowerCardDatas = cmdBaseWorker.cbPlayerFlowerCardData[wChairID]

        //     var flowerCardDatasArray = [ flowerCardDatas ]
        //     var flowerMajiangs= majiangFactory.getFlowerMajiangsArray(flowerCardDatasArray)[0]
        //     for(var i=0;i<flowerMajiangs.length;i++)
        //     {
        //         cardNode.addChild(flowerMajiangs[i])
        //     }
        //     cardNode.scaleX = flowerCardNode.width/cardNode.width
        //     cardNode.scaleY = flowerCardNode.height/cardNode.height
        //     cardNode.x = -68
        //     cardNode.y = -85
        //     flowerCardNode.addChild(cardNode)


        //     /////////
        //     if(wChairID==cmdBaseWorker.wExitUser)
        //         control['winflag'+wChairID].setSpriteFrame('gendFlag0.png') 
        //     else if(cmdBaseWorker.dwChiHuKind[wChairID] == WIK_CHI_HU)
        //         control['winflag'+wChairID].setSpriteFrame('gendFlag1.png') 
        //     else if(wChairID==cmdBaseWorker.wProvideUser)
        //         control['winflag'+wChairID].setSpriteFrame('gendFlag2.png') 
        //     else
        //         control['winflag'+wChairID].setSpriteFrame('empty.png') 
  

        //     control['taiTTF'+wChairID].setString((cmdBaseWorker.lGameScore[wChairID]>0?'+':'') + cmdBaseWorker.lGameScore[wChairID]) 
        //     control['fenTTF'+wChairID].setString((cmdBaseWorker.lGameScore[wChairID]>0?'+':'') + cmdBaseWorker.lGameScore[wChairID]) 

        // }
       
        // mainScene.top.addChild(node) 
        var cbWinFlag = []
        for(var i=0;i<GAME_PLAYER;i++)
        {
            if(cmdBaseWorker.endType==0 && i==cmdBaseWorker.wExitUser)
                cbWinFlag[i] = 6
            else if((cmdBaseWorker.endType==2||cmdBaseWorker.endType==3||cmdBaseWorker.endType==4) && cmdBaseWorker.wWinner == i)
                cbWinFlag[i] = 7

            if(cmdBaseWorker.endType==3 && cmdBaseWorker.wProvideUser==i)
                cbWinFlag[i] = 8
            if(cmdBaseWorker.endType==4 && cmdBaseWorker.wProvideUser==i)
                cbWinFlag[i] = 9
        }

        var control = {}
        control.continueCall = function()
        {
            continueCall()
            node.removeFromParent()
        }
        var node  = cc.BuilderReader.load(resp.gameEndPopCCB, control)

        playNode.gameEndControl = control

        // control.resultTTF.setString( args.msg )
        if(cmdBaseWorker.endType == 1 || cmdBaseWorker.endType == 0)
        {
            if(cmdBaseWorker.endType == 1)
                control.endType.setSpriteFrame('gendType'+cmdBaseWorker.endType + '.png')
            else
                control.endType.setVisible(false)

            control.resultTTF.setVisible(false)
        }
        else
        {
            control.resultTTF.setVisible(true)
            var chr_type = 
            [
                CHR_PingHu,                      
                CHR_QingYiSe,          
                CHR_PengPengHu,       
                CHR_CaiPiao,           
                CHR_CaiPiao2,
                CHR_CaiPiao3,
                CHR_GangPiao,          
                CHR_QiXiaoDui,                         
                CHR_QuanFengZi,        
                CHR_QuanFengZiDaPengHu,
                CHR_SanCaiDao,   
                CHR_SiCaiDao,      
                CHR_GangKai,           
                CHR_QiangGang,        
                CHR_TianHu,            
                CHR_DiHu,              
                CHR_GangBao,           
                CHR_HaiDiLaoYue,                  
                CHR_ShiSanBaiDa,       
                CHR_ZhengBaiDa,        
                CHR_LanBaiDa,          
                CHR_QiFengLanBaiDa,
                CHR_BaoTou,
                CHR_QuanFengQiDui,
                CHR_Gang,
                CHR_ZhengLanBaiDa,
            ];
            var chr_str = 
            [   
                "平胡 ",
                "清一色 ",
                "碰碰胡 ",
                "财飘*1 ",
                "财飘*2 ",
                "财飘*3 ",
                "杠飘 ",
                "七小对 ",
                "乱风 ",
                "清风 ",
                "三财 ",
                "四财 ",
                "杠开 ",
                "抢杠 ",
                "天胡 ",
                "地胡 ",
                "杠暴 ",
                "海底捞月 ",
                "十三幺正规 ",
                "十三幺七字牌正规 ",
                "十三幺不正规 ",
                "七风烂百搭 ",
                "爆头 ",
                "清风 ",
                "杠",
                "十三幺七字不正规",
            ];
            var chrStr = "胡型："
            for (var i = 0; i < chr_type.length; i++) 
            {
                if (cmdBaseWorker.dwChiHuRight[cmdBaseWorker.wWinner] & chr_type[i])
                {
                    chrStr += chr_str[i];
                    if (i == 24)
                    {
                        if (cmdBaseWorker.cbGangKaiTimes > 0)
                        {
                            chrStr += "*"
                            chrStr += cmdBaseWorker.cbGangKaiTimes
                            chrStr += " "
                        }
                        chrStr += " "
                    }
                }
            }

            control.resultTTF.setString(chrStr)
            control.endType.setVisible(false)
        }

        for(var i=0;i<GAME_PLAYER;i++)
        {
            var chairid = i
            if(typeof(cbWinFlag[i])!='undefined')
            {
                control['winflag'+i].setVisible(true)
                control['winflag'+i].setSpriteFrame('winFlag_' + cbWinFlag[i] + '.png') 
            }
            else
                control['winflag'+i].setVisible(false)

            if(cmdBaseWorker.cbChengBaoUser[i]==1)
            {
                control['chengbaoflag'+i].setVisible(true)
                if(control['winflag'+i].isVisible()==false)
                    control['chengbaoflag'+i].setPosition(cc.p(168,  42))
                else
                    control['chengbaoflag'+i].setPosition(cc.p(99,  42))
            }
            else
            {
                control['chengbaoflag'+i].setVisible(false)
            }
            
            //var wChairID = tableData.getServerChairIdWithShowChairId(chairid)
            var score = cmdBaseWorker.lGameScore[chairid]
            control['name'+i].setString(userData_gameEnd[chairid])
            control['banker'+i].setVisible(cmdBaseWorker.wBankerUser == chairid)
            if(score>0)
            {
                control['scoreTTF'+i].setString('+' + score)
                control['scoreTTF'+i].color = cc.color(255, 0, 0)
              //  control['scoreTTF'+i].setFontFillColor( cc.color(255, 0, 0, 255) )
                control['frame'+i].setSpriteFrame('gend5.png')
            }
            else
            {
                control['scoreTTF'+i].setString(score==0?'-'+score:score)
                control['scoreTTF'+i].color = cc.color(0, 255, 0)
                //control['scoreTTF'+i].setFontFillColor( cc.color(0, 255, 0, 255) )
                control['frame'+i].setSpriteFrame('gend6.png')

            }
        }

        node.setPosition( cc.p( mainScene.uiTop.getContentSize().width * 0.5, mainScene.uiTop.getContentSize().height * 0.5) )
        mainScene.top.addChild(node) 
    },
    showLaizi:function()
    {
        for(var i=0;i<1;i++)
        {
            var cardData = cmdBaseWorker.cbMagicCardData
            if(cardData == INVALID_CARD_DATA)
                continue

            var where = {}
            where.name = 'caishen'
            where.data = {}
            var mj = majiangFactory.getSpecialOne(cardData, where)
            mj.x = 50 + i*85
            mj.y = 660
            mj.isIgnoreDecorate = true
            playNode.mjsNode.addChild(mj)
        }

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
        //单个方向的丢弃麻将精灵父节点
        currentRoundNode.discardMajiangsNode = new cc.Node()
        currentRoundNode.addChild( currentRoundNode.discardMajiangsNode )

        //单个方向的吃碰杠麻将精灵父节点
        currentRoundNode.weaveMajiangsNode = new cc.Node()
        currentRoundNode.addChild( currentRoundNode.weaveMajiangsNode )

        //单个方向的手牌麻将精灵父节点 的 父节点
        currentRoundNode.handMajiangsNode = new cc.Node()
        currentRoundNode.addChild( currentRoundNode.handMajiangsNode )

        currentRoundNode.scoreChange = new cc.Node()
        currentRoundNode.addChild( currentRoundNode.scoreChange, 1)   
    },
    clearCurrentRoundNode:function(currentRoundNode)
    {           
        //一轮结束 clearCurrentRoundNode
        currentRoundNode.handMajiangsNode.removeAllChildren()
        currentRoundNode.discardMajiangsNode.removeAllChildren()
        currentRoundNode.weaveMajiangsNode.removeAllChildren()
        currentRoundNode.scoreChange.removeAllChildren()
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

        //皮肤选择
        // var l = cc.EventListener.create({
        // event: cc.EventListener.CUSTOM,
        // eventName: "styleChange",
        // callback: function(event)
        // {   
        //     var frameName = 'style' + '0' + '_bg.jpg'
        //     tableNode.bgSpr.setSpriteFrame(frameName)
        // }
        // })
        // cc.eventManager.addListener(l, 1)   
    },
    sendMessage_chi:function(operateCards, action)
    {
        var OperateCard = getObjWithStructName('CMD_C_OperateCard')
        OperateCard.cbOperateCode = action
        OperateCard.cbOperateCard = operateCards
        socket.sendMessage(MDM_GF_GAME,SUB_C_OPERATE_CARD,OperateCard)
    },
    sendMessage_peng:function(operateCards)
    {
        var OperateCard = getObjWithStructName('CMD_C_OperateCard')
        OperateCard.cbOperateCode = WIK_PENG
        OperateCard.cbOperateCard = operateCards
        socket.sendMessage(MDM_GF_GAME,SUB_C_OPERATE_CARD,OperateCard)
    },
    sendMessage_gang:function(operateCards)
    {
        var OperateCard = getObjWithStructName('CMD_C_OperateCard')
        OperateCard.cbOperateCode = WIK_GANG
        OperateCard.cbOperateCard = operateCards
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
            if(i>0 && idx == handIdxs[i-1] || idx == 0x37)
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
                    cmdBaseWorker.showChoosePopOfAction(idxsArray, actions, sendGang)
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

            if(cmdBaseWorker.wCurrentUser == INVALID_WORD) //摸牌前的吃碰杠 过得话才会发SUB_C_OPERATE_CARD
            {
                playNode.sendMessage_guo()
            }
            playNode.hideActionBtns()  
            majiangFactory.chooseItemsNode.removeAllChildren() 
        }
    },
    ///////////////////////init end///////////////////////

    ///////////////cmdEvent start//////////
    updateOnFree:function()
    {
        var users = tableData.getUsersInTable(tableData.getUserWithUserId(selfdwUserID).wTableID)
        // if(users.length>=GAME_PLAYER)
        // {   
        //     if(tableData.managerUserID == selfdwUserID)
        //     {
        //         tableNode.shareButton.setVisible(false)
        //     }
        // }  

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
            tableNode.gameTypeTTF.setString("一吊铳")
        else if (cmdBaseWorker.cbGameType == 2)
            tableNode.gameTypeTTF.setString("硬自摸")

        typeSelNode.startBtnEnabled()
    },
    onCMD_StatusPlay:function() 
    {
        playNode.isPlaying = true
        playNode.isRevSence = true
        playNode.scoreTTF.setString(cmdBaseWorker.cbLeftCardCount)

        typeSelNode.startBtnEnabled()

        if (typeSelNode.haveSetGameType == false)
            typeSelNode.userUpdate()

        playNode.showLaizi()
        majiangFactory.initCardData2ScoreMap( [cmdBaseWorker.cbMagicCardData, INDEX_REPLACE_CARD_DATA], [0, cmdBaseWorker.cbMagicCardData] )

        tableNode.setBankerIcon(cmdBaseWorker.wBankerUser, true)
        playNode.timer.initFenwei( tableData.getShowChairIdWithServerChairId(cmdBaseWorker.cbEastUser) )
        playNode.timer.switchTimer(cmdBaseWorker.wCurrentUser==INVALID_WORD?[]:[tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wCurrentUser)])
        playNode.timerNode.setVisible(true)

        if (cmdBaseWorker.cbGameType == 0)
            tableNode.gameTypeTTF.setString("一吊铳")
        else if (cmdBaseWorker.cbGameType == 2)
            tableNode.gameTypeTTF.setString("硬自摸")

        /////吃碰杠胡
        var sortedActions = majiangLogic.getSortedActionsWithMask(cmdBaseWorker.cbActionMask)
        var isActioning = sortedActions.length>0
        if(isActioning && tableData.getUserWithUserId(selfdwUserID).wChairID != INVALID_WORD)
            playNode.showActionBtns(cmdBaseWorker.cbProvideCard, sortedActions)

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

            //- - - - - - - - - - - - - - - - - - - - - - - -
            // var idxs = []
            // for(var j=0;j<MAX_COUNT;j++)
            // {
            //     idxs[j] = 0
            // }
            // var cbHandCardData= direction==0?cmdBaseWorker.cbHandCardData:idxs
            // var handIdxs = cbHandCardData.slice(0, cmdBaseWorker.cbHandCardCount[i])
            // if(cmdBaseWorker.wCurrentUser==i)
            // {
            //     handIdxsArray[direction][0] = handIdxs.slice(0, handIdxs.length-1)
            //     handIdxsArray[direction][1] = handIdxs[handIdxs.length-1]
            // }
            // else
            //     handIdxsArray[direction][0] = handIdxs
            var handIdxs = cmdBaseWorker.cbHandCardData[i]
            if(cmdBaseWorker.cbHandCardCount[i] + cmdBaseWorker.cbWeaveCount[i]*3 == MAX_COUNT)
            {
                handIdxsArray[direction][0] = handIdxs.slice(0, handIdxs.length-1)
                handIdxsArray[direction][1] = handIdxs[handIdxs.length-1]
            }
            else
                handIdxsArray[direction][0] = handIdxs

            //- - - - - - - - - - - - - - - - - - - - - - - -

            discardIdxsArray[direction] = cmdBaseWorker.cbDiscardCard[i].slice(0, cmdBaseWorker.cbDiscardCount[i])
        }
    
        // console.log(6666, handIdxsArray, discardIdxsArray, weaveItemArray)
        playNode.sortHandIdxs(handIdxsArray[0][0]) 

        var heapCardDatasArray = majiangFactory.getHeapCardDatasArray(cmdBaseWorker.cbHeapCardInfo, cmdBaseWorker.TurnoverCard)
        playNode.sendCardsAction(handIdxsArray, discardIdxsArray, weaveItemArray, heapCardDatasArray, [[],[],[],[]]) 

        if(cmdBaseWorker.wOutCardUser!=INVALID_WORD)
        {
            var d = tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wOutCardUser)
            majiangFactory.setCurrentDiscardMj(playNode.discardMajiangs4D, d)
            //playNode.setCurrentDiscardMj2(cmdBaseWorker.cbOutCardData, d)
        }
    },
    onCMD_GameStart:function() 
    {
        cocos.clearInterval(playNode.updateOnFree, playNode.node)
        playNode.isPlaying = true

        if(playNode.isLookingResult)
        {
            playNode.resetPlayNode()
        }

        majiangFactory.initCardData2ScoreMap( [cmdBaseWorker.cbMagicCardData, INDEX_REPLACE_CARD_DATA], [0, cmdBaseWorker.cbMagicCardData] )

        var self = tableData.getUserWithUserId(selfdwUserID)
        var handIdxsArray = []
        for(var i=0;i<4;i++)
        {
            var direction = i
            var serverChairid = tableData.getServerChairIdWithShowChairId(direction)

            var idxs = []
            for(var ii=0;ii<MAX_COUNT;ii++)
            {
                idxs[ii] = 0
            }
            if(serverChairid==self.wChairID || isRecordScene)
                idxs = cmdBaseWorker.cbHandCardData[serverChairid]

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
            majiangFactory.sortCardDatasWithScore(handIdxsArray[direction][0])
        }

        playNode.sortHandIdxs(handIdxsArray[0][0]) 
        var heapCardDatasArray = majiangFactory.getHeapCardDatasArray(cmdBaseWorker.cbHeapCardInfo, cmdBaseWorker.TurnoverCard)
        playNode.sendCardsAction(handIdxsArray, [[],[],[],[]], [[],[],[],[]],heapCardDatasArray,[[],[],[],[]]) 

        /////摸到麻将时有可能出现杠听胡
        var sortedActions = majiangLogic.getSortedActionsWithMask(cmdBaseWorker.cbActionMask)
        if(sortedActions.length>0)
            playNode.showActionBtns(null, sortedActions)  //自摸杠 idx不确定 需要searchGangIdxs
           
        playNode.actionBtns.setVisible(false)
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
            playNode.showLaizi()
            playNode.timer.initFenwei( bankerShowChairid )
            playNode.timerNode.setVisible(true)
            playNode.setCurrentRoundNodesVisible(true)

            var EastShowChairid = tableData.getShowChairIdWithServerChairId(cmdBaseWorker.cbEastUser)
            playNode.timer.initFenwei( EastShowChairid )
            playNode.timer.switchTimer([tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wCurrentUser)])

            playNode.actionNode.setVisible(true)
            playNode.actionBtns.setVisible(true)
            playNode.mjsNode.setVisible(true)            
            managerTouch.openTouch()
        }

        function bankerPlayDice()
        {
            tableNode.setBankerIcon(cmdBaseWorker.wBankerUser, true)
            playNode.playDiceOneDirection(gameStart, getRandNum(1, 6), getRandNum(1, 6), bankerShowChairid)
        }

        if(cmdBaseWorker.bIsRandBanker)
            playNode.playDiceForRandBanker(bankerPlayDice, bankerShowChairid)
        else
            bankerPlayDice()


    },
    onCMD_OutCard:function() 
    {
        if (isRecordScene)
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
        //playNode.setCurrentDiscardMj2(outIdx, outDir)
    },
    onCMD_SendCard:function() 
    {
        if (isRecordScene)
            playNode.hideActionBtns()

        playNode.scoreTTF.setString(cmdBaseWorker.cbLeftCardCount)
        managerAudio.playEffect('gameRes/sound/sendcard.mp3')

        var dir =  tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wCurrentUser)   
        playNode.timer.switchTimer([dir])

        var currentUser = tableData.getUserWithChairId(cmdBaseWorker.wCurrentUser)
        var newMjIdx = (currentUser.dwUserID==selfdwUserID || isRecordScene)?cmdBaseWorker.cbSendCardData:0

        majiangFactory.addHandMajiangNew(playNode.handMajiangs4D[dir], dir, newMjIdx, playNode.mjsNode)

        /////摸到麻将时有可能出现杠听胡
        var sortedActions = majiangLogic.getSortedActionsWithMask(cmdBaseWorker.cbActionMask)
        if(sortedActions.length>0 && currentUser.dwUserID == selfdwUserID)
            playNode.showActionBtns(null, sortedActions)  //自摸杠 idx不确定 需要searchGangIdxs
    },
    onCMD_OperateNotify:function() 
    {
        if (cmdBaseWorker.wNotifyOperateUser != INVALID_WORD)
        {
            var operateUserId = tableData.getUserWithChairId(cmdBaseWorker.wNotifyOperateUser)
            if (isRecordScene && operateUserId.dwUserID != selfdwUserID)
                return
        }
        
        var sortedActions = majiangLogic.getSortedActionsWithMask(cmdBaseWorker.cbActionMask)
        var idx = cmdBaseWorker.cbProvideCard
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

        var idxs = playNode.sortWeaveIdxs(cmdBaseWorker.cbOperateCode, cmdBaseWorker.cbOperateCard)
        majiangFactory.onActionResult(cmdBaseWorker.cbOperateCode, idxs, operateUser, provideUser,
            majiangs3W4D, playNode.mjsNode)

        playNode.playAction(cmdBaseWorker.cbOperateCode, operateUser)

        playNode.timer.switchTimer(cmdBaseWorker.wCurrentUser==INVALID_WORD?[]:[tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wCurrentUser)])

        var currentUser = tableData.getUserWithChairId(cmdBaseWorker.wCurrentUser)
        /////吃碰杠后可以继续杠
        var sortedActions = majiangLogic.getSortedActionsWithMask(cmdBaseWorker.cbActionMask)
        if(sortedActions.length>0 && currentUser.dwUserID == selfdwUserID)
            playNode.showActionBtns(null, sortedActions)  //自摸杠 idx不确定 需要searchGangIdxs

        if (cmdBaseWorker.cbWarnTimes == 2 || cmdBaseWorker.cbWarnTimes == 3)
        {   
            topUINode.node_warn.unschedule(playNode.hideWarnNode)
            topUINode.node_warn.setVisible(false)

            var operateUser = tableData.getUserWithChairId(cmdBaseWorker.wOperateUser)
            var privideUser = tableData.getUserWithChairId(cmdBaseWorker.wProvideUser)
            if(operateUser && privideUser)
            {
                topUINode.node_warn.setVisible(true)
                var operateTimes = cmdBaseWorker.cbWarnTimes == 2?'两':'三'
                var strWarn = privideUser.szNickName + '请注意:您已被' + operateUser.szNickName + '吃碰' + operateTimes + '趟了哦'
                topUINode.label_warn.setString(strWarn)
                topUINode.node_warn.schedule(playNode.hideWarnNode, 6)
            }
        }
    },
    hideWarnNode:function()
    {
       topUINode.node_warn.setVisible(false)
       topUINode.node_warn.unschedule(playNode.hideWarnNode)
    },
    onCMD_GangScore:function() 
    {
        var a = cc.sequence( 
            cc.callFunc(function()
            {     
                playNode._showScore(false)
            }), 
            cc.delayTime(2), //看牌5秒
            cc.callFunc(function()
            {
                 for(var i=0;i<GAME_PLAYER;i++)
                {
                    var user = tableData.getUserWithChairId(i)
                    if(!user) continue

                    if(tableData.isInTable(user.cbUserStatus))
                    {   
                        var scoreNode = user.userNodeInsetChair.currentRoundNode.scoreChange
                        scoreNode.removeAllChildren()
                    }
                }
            }
            )
        )           
        playNode.node.runAction(a)
    },
    onSMD_GameType:function()
    {
        if (cmdBaseWorker.cbGameType == 0)
            tableNode.gameTypeTTF.setString("一吊铳")
        else if (cmdBaseWorker.cbGameType == 2)
            tableNode.gameTypeTTF.setString("硬自摸")

        typeSelNode.startBtnEnabled()
    },
    onCMD_GameEnd:function() 
    {
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

        var szNickName_gameEnd = []
        for(var i=0;i<GAME_PLAYER;i++)
        {
            var user = tableData.getUserWithChairId(i)
            if(user)
                szNickName_gameEnd[i] = user.szNickName
        }

        if(cmdBaseWorker.endType == 3)
        {
            var provideDiscardMajiangs = playNode.discardMajiangs4D[tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wProvideUser)]
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
                cc.delayTime(1), //看牌5秒
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
                    playNode.popGameEnd(continueCall, szNickName_gameEnd) 
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
            // var isAllowOut = majiang.cardData != cmdBaseWorker.cbMagicCardData && cmdBaseWorker.wCurrentUser == tableData.getUserWithUserId(selfdwUserID).wChairID
            var isAllowOut = cmdBaseWorker.wCurrentUser == tableData.getUserWithUserId(selfdwUserID).wChairID

            if(isAllowOut)
            {
                cmdBaseWorker.wCurrentUser = INVALID_WORD

                var OutCard = getObjWithStructName('CMD_C_OutCard')
                OutCard.cbOutCardData = majiang.cardData
                socket.sendMessage(MDM_GF_GAME,SUB_C_OUT_CARD,OutCard)
                playNode.hideActionBtns()
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
    ////////////sendCardsAction end//////////


    ////////////gameend start//////////
    _showScore:function(bEnd)
    {
        //score
        for(var i=0;i<GAME_PLAYER;i++)
        {
            var user = tableData.getUserWithChairId(i)
            if(!user) continue

            var chair = tableData.getChairWithServerChairId(i)
            if(tableData.isInTable(user.cbUserStatus))
            {   
                //score
                var score;
                if(bEnd)
                   score = cmdBaseWorker.lGameScore[i]
                else
                   score = cmdBaseWorker.lGangScore[i]

                var scoreNode = user.userNodeInsetChair.currentRoundNode.scoreChange

                var scoreLabel = new ccui.TextAtlas()
                scoreLabel.setProperty(Math.abs(score), score>0?resp.nums2:resp.nums3, 22, 33, "0")
                scoreNode.addChild(scoreLabel)
                
                var sign = score>0?new cc.Sprite('#plus.png'):new cc.Sprite('#minus.png')
                sign.setAnchorPoint(cc.p(0,0.5))
                scoreNode.addChild(sign)

                var signPosx
                var swidth = scoreLabel.getContentSize().width + sign.getContentSize().width
                if( chairFactory.isRight(chair.node) )
                {
                    signPosx = - swidth
                }
                else
                {   
                    signPosx = 0 
                }
                sign.setPositionX(signPosx) 
                scoreLabel.setPositionX(signPosx + scoreLabel.getContentSize().width * 0.5 + sign.getContentSize().width)    
            }
        }
    },
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
    setCurrentDiscardMj2:function(idx, direction)
    {
        var self = tableData.getUserWithUserId(selfdwUserID)
        var d = tableData.getShowChairIdWithServerChairId(self.wChairID)
        if(d == direction)
            majiangFactory.hideCurrentDiscardMj()
        else
           majiangFactory.setCurrentDiscardMj(idx, direction)
    },

    setCurrentDiscardMj:function(discardMajiangs4D, direction)
    {
        var discardMajiangs = discardMajiangs4D[direction]
        var discardMajiang = discardMajiangs[discardMajiangs.length-1]
        var discardMajiangWorldPos = discardMajiang.getParent().convertToWorldSpace(discardMajiang.getPosition())
        var parent = playNode.currentMjPoint.getParent()
        var discardMajiangPosInParent = parent.convertToNodeSpace(discardMajiangWorldPos)

        playNode.currentMjPoint.x = discardMajiangPosInParent.x
        playNode.currentMjPoint.y = discardMajiangPosInParent.y+18 + (direction==0||direction==2?13:3)
    },
    hideCurrentDiscardMj:function()
    {
        playNode.currentMjPoint.x = -1000
    },
    hideLaizi:function()
    {
        playNode.laiziNode.removeAllChildren()
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
        majiangFactory.chooseItemsNode.removeAllChildren() // 每次清空一下按钮状态
        playNode.btn_chi.setVisible(false)
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
            btn.setPositionX(-150 * (sortedActions.length-1-i +1))
            btn.cardData = idx
            if(btn==playNode.btn_chi)
                break
        }
    },
    playAnimationOfGameEnd:function(call)
    {
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

            var playSound = playNode.getSoundEffect()
            if (playSound == '')
                playSound = 'zimo'
            playSound += '0'
            playNode.playGenderEffect(playSound, tableData.getUserWithChairId(winner).cbGender)
        }
        else if(cmdBaseWorker.endType == 3 || cmdBaseWorker.endType == 4)
        {
            playNode.playAnimationWithDirection('hu', tableData.getShowChairIdWithServerChairId(winner), call)
            playNode.playAnimationWithDirection('dp', tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wProvideUser))

            var playSound=playNode.getSoundEffect()
           
            if (playSound=='')
                playSound='hu'
            playNode.playActionEffect(playSound, tableData.getUserWithChairId(winner).cbGender)
        }
    },
    getSoundEffect:function()
    {   
        var cbChiHuRight=cmdBaseWorker.dwChiHuRight[cmdBaseWorker.wWinner]
        if (cbChiHuRight&CHR_TianHu)
            return 'tianhu'
        else if (cbChiHuRight&CHR_DiHu)
            return 'dihu'
        else if (cbChiHuRight&CHR_HaiDiLaoYue)
            return 'haidilaoyue'
        else if (cbChiHuRight&CHR_QuanFengZiDaPengHu || cbChiHuRight & CHR_QuanFengQiDui) //清风
            return 'ziyise'
        else if(cbChiHuRight&CHR_QuanFengZi) // 乱风
            return 'luanfeng'
        else if (cbChiHuRight&CHR_QingYiSe) // 清一色
            return 'qingyise'
        else if (cbChiHuRight&CHR_LanBaiDa) //十三幺不正规
            return 'shisanyao'
        else if (cbChiHuRight&CHR_ZhengBaiDa) //十三幺七字牌正规
            return 'shisanyao'
        else if (cbChiHuRight&CHR_ShiSanBaiDa) //十三幺正规
            return 'shisanyao'
        else if (cbChiHuRight&CHR_ZhengLanBaiDa) //十三幺七字不正规
            return 'shisanyao'
        else if (cbChiHuRight&CHR_QiXiaoDui) //七小对
            return 'qixiaodui'
        else if (cbChiHuRight&CHR_PengPengHu) //碰碰胡
            return 'pphu'
        else if (cbChiHuRight&CHR_GangKai) //杠开
            return 'gangkai'
        else if (cbChiHuRight&CHR_GangPiao) //杠飘
            return 'gangpiao'
        else if (cbChiHuRight&CHR_QiangGang) //抢杠
            return 'qianggang'
        else if (cbChiHuRight&CHR_GangBao) //杠暴
            return 'gangbao'
        else if (cbChiHuRight&CHR_CaiPiao || cbChiHuRight & CHR_CaiPiao2 || cbChiHuRight & CHR_CaiPiao3) //財飘
            return 'caipiao'
        else if (cbChiHuRight&CHR_BaoTou) //爆头
            return 'baotou'
        else 
           return ''
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

        if (name == 'chi')
            num = 2
        else if (name == 'peng')
            num = 4

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
        if(idx == INDEX_REPLACE_CARD_DATA)
            idx = cmdBaseWorker.cbMagicCardData
        return idx
    }, 
    cai2Bao:function(idx)
    {
        if(idx == cmdBaseWorker.cbMagicCardData)
            idx = INDEX_REPLACE_CARD_DATA
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
                var endNum2_ubanker = getRandNum(1, numSmaller - endNum1_ubanker)  
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

recordNode.getPlayInterval=function(subId)
{
    switch(subId)
    {
        case SUB_S_GAME_START: 
        {
            if (cmdBaseWorker.bIsRandBanker)
                return 11000
            else
                return 3000
        }
        case SUB_S_OPERATE_RESULT: return 2000
    }
    //这个是默认时间
    return 1000;
}

majiangTimer4D.getTimer=function( directionOfEast, tickTime)
{
    var resp = majiangTimer4D.resp
    var control = {}
    var node  = cc.BuilderReader.load('components/majiangTimer4D/res/majiangTimer4D.ccbi', control)
   // node.setContentSize(control.bgSpr.width, control.bgSpr.height)

    var tickTime = tickTime || 10

    var tickText = new ccui.TextAtlas()
    tickText.setAnchorPoint(cc.p(0.5, 0.5))
    tickText.setProperty("10", resp + 'num.png', 17.5, 22, "0")
    control.tickNode.addChild(tickText)

    function getStrFun(str)
    {   
        if(str == 0)
            return tickTime
        else
            return str-1
    }

    function perSecondcallBack()
    {   
        var s = tickText.getString()
        if(s<=4)
        {
            control.warm.setVisible(true)
            control.warm.scheduleOnce(
                function()
                {
                    control.warm.setVisible(false)
                }, 
                0.5)
            // managerAudio.playEffect(resp + 'tick.mp3')
        }  
    }
    clock.tickLabel(tickText, tickTime, -1, getStrFun, null, perSecondcallBack)

    node.initFenwei = function(directionOfEast)
    {
        for(var i=0;i<4;i++)
        {
            control['normalFenwei'+i].setSpriteFrame( 'mt4_normal_' + (4+directionOfEast-i)%4 + '.png' )  
            control['lightFenwei'+i].setSpriteFrame( 'mt4_light_' + (4+directionOfEast-i)%4 + '.png' )  
        }
    }

    node.resetTimer = function()
    {
        control.lightNode_0.setVisible(false)
        control.lightNode_1.setVisible(false)
        control.lightNode_2.setVisible(false)
        control.lightNode_3.setVisible(false)
    }

    node.switchTimer = function(directions)
    {
        node.resetTimer()
        tickText.setString(tickTime)

        for(var i=0;i<directions.length;i++)
        {   
            var d = directions[i]
            control['lightNode_'+d].setVisible(true)
        }
    }

    return node
}

