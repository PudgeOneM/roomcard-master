
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

        majiangFactory.discardCountOneLine = 12
        majiangFactory.discardCountOneRow = 12
        majiangFactory.init( playNode.mjTableNode, playNode.decorateMj )
        majiangFactory.isPublicAnGang = true

        playNode.timer = majiangTimer4D.getTimer()
        playNode.timerNode.addChild(playNode.timer)
        playNode.timerNode.setScale( majiangFactory.scale_upDown )

        tableNode.bgSpr.setScaleX(tableNode.node.width/tableNode.bgSpr.width)
        tableNode.bgSpr.setScaleY(tableNode.node.height/tableNode.bgSpr.height)

        // var frameName = 'style' + '0' + '_bg.jpg'
        // tableNode.bgSpr.setSpriteFrame(frameName)
    },
    onReStart:function()
    {
        playNode.handMajiangs4D = []
        playNode.handGroupNode4D = []
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
    setCurrentRoundNodesVisible:function(isVisible)
    {
        var users = tableData.getUsersInTable( tableData.getUserWithUserId(selfdwUserID).wTableID )
        for(var i in users)
        {
            users[i].userNodeInsetChair.currentRoundNode.setVisible(isVisible)
        }
    },
    updateCurrentRoundNode:function(currentRoundNode, userId)
    {
        var user = tableData.getUserWithUserId(userId)
        var showChairId = tableData.getShowChairIdWithServerChairId(user.wChairID)
        
        // if(showChairId==0||showChairId==3)
        //     sign = -1
        // else
        //     sign = 1

        var chairNode = tableData.getChairWithShowChairId(showChairId).node
        var chairNodeWorldPos = tableNode.uiChair.convertToWorldSpace(chairNode.getPosition())
        var chairNodePosInMjTable = playNode.mjTableNode.convertToNodeSpace(chairNodeWorldPos)
        

        var centerPosX = playNode.timerNode.x
        var centerPosY = playNode.timerNode.y
        var upHandHeight = majiangFactory.up_handHeight*majiangFactory.scale_upDown
        var downHandHeight = majiangFactory.down_handHeight*majiangFactory.scale_upDown

        var handWidth_down = (majiangFactory.handCountOneRow*majiangFactory.downHandIntervalX + majiangFactory.downMjAndNewMjInterval)*majiangFactory.scale_upDown
        var handHeght_rightLeft = (majiangFactory.handCountOneRow*majiangFactory.rightHandIntervalY + majiangFactory.rightMjAndNewMjInterval) * majiangFactory.scale_rightLeft
        var distanceHandFromDown = (majiangFactory.mjTableNode.height-upHandHeight-downHandHeight-handHeght_rightLeft)

        var direction = tableData.getShowChairIdWithServerChairId(user.wChairID)
        //设置三处四方向的麻将位置 
        if(direction==0)
        {
            currentRoundNode.scoreChange.setPosition( cc.p(100, 30) )  
            //discard
            var discardMajiangsNodeWith = (majiangFactory.discardCountOneRow-1)*majiangFactory.down_discardWidth*majiangFactory.scale_upDown
            var mjsDiscardHeight = majiangFactory.down_discardHeight*majiangFactory.scale_upDown

            //-chairNodePosInMjTable.x相当于从posx=0开始算起
            currentRoundNode.discardMajiangsNode.x = -chairNodePosInMjTable.x + 
            0.5*( majiangFactory.mjTableNode.width - discardMajiangsNodeWith)
            currentRoundNode.discardMajiangsNode.y = -chairNodePosInMjTable.y + centerPosY - mjsDiscardHeight*0.5 - 50
        
            //hand
            var mjsWidth = majiangFactory.down_handWidth*majiangFactory.scale_upDown
            currentRoundNode.handMajiangsNode.x = -chairNodePosInMjTable.x + majiangFactory.mjTableNode.width
            currentRoundNode.handMajiangsNode.y = -chairNodePosInMjTable.y + downHandHeight*0.5

            //weave
            currentRoundNode.weaveMajiangsNode.x = -chairNodePosInMjTable.x
            currentRoundNode.weaveMajiangsNode.y = currentRoundNode.handMajiangsNode.y
        }
        else if(direction==2)
        {       
            currentRoundNode.scoreChange.setPosition( cc.p(-20, -30) )  
            //discard
            var discardMajiangsNodeWith = (majiangFactory.discardCountOneRow-1)*majiangFactory.up_discardWidth*majiangFactory.scale_upDown
            var mjsDiscardHeight = majiangFactory.up_discardHeight*majiangFactory.scale_upDown

            currentRoundNode.discardMajiangsNode.x = -chairNodePosInMjTable.x + majiangFactory.mjTableNode.width - 
            0.5*( majiangFactory.mjTableNode.width - discardMajiangsNodeWith)
            currentRoundNode.discardMajiangsNode.y =  -chairNodePosInMjTable.y + centerPosY + mjsDiscardHeight*0.5 + 50

            //hand
            var mjsWidth = majiangFactory.up_handWidth*majiangFactory.scale_upDown
            var handMjsWidth = MAX_COUNT*mjsWidth + majiangFactory.upMjAndNewMjInterval
            var w = (majiangFactory.mjTableNode.width - handMjsWidth)/2
            currentRoundNode.handMajiangsNode.x = -chairNodePosInMjTable.x + w
            currentRoundNode.handMajiangsNode.y = -chairNodePosInMjTable.y + majiangFactory.mjTableNode.height - upHandHeight*0.5 - 5

            //weave
            currentRoundNode.weaveMajiangsNode.x = -chairNodePosInMjTable.x + majiangFactory.mjTableNode.width - (majiangFactory.mjTableNode.width - handMjsWidth)/2
            currentRoundNode.weaveMajiangsNode.y = currentRoundNode.handMajiangsNode.y
        } 
        else if(direction==1)
        { 
            // currentRoundNode.scoreChange.setPosition( cc.p(-100, -50) )  
            // //discard
            // var downDiscardMajiangsNodeWidth = majiangFactory.discardCountOneRow*majiangFactory.down_discardWidth*majiangFactory.scale_upDown
            // var discardMajiangsNodeHeight = (majiangFactory.discardCountOneLine-1)*majiangFactory.rightDiscardIntervalY*majiangFactory.scale_rightLeft
            // var distanceFromUpDown = 0.5*(majiangFactory.mjTableNode.height - downHandHeight - upHandHeight - discardMajiangsNodeHeight)

            // currentRoundNode.discardMajiangsNode.x = -chairNodePosInMjTable.x + majiangFactory.mjTableNode.width - 
            // 0.5*( majiangFactory.mjTableNode.width - downDiscardMajiangsNodeWidth ) + (20 + 0.5*majiangFactory.right_discardWidth*majiangFactory.scale_rightLeft)
            // currentRoundNode.discardMajiangsNode.y =  -chairNodePosInMjTable.y + downHandHeight + distanceFromUpDown

            // //hand
            // var mjsWidth = majiangFactory.right_handWidth*majiangFactory.scale_rightLeft

            // currentRoundNode.handMajiangsNode.x = -(mjsWidth + 30)
            // currentRoundNode.handMajiangsNode.y = -chairNodePosInMjTable.y + majiangFactory.mjTableNode.height - upHandHeight
            
            // //weave
            // //var handMjsWidth = MAX_COUNT*mjsWidth + majiangFactory.upMjAndNewMjInterval
            // currentRoundNode.weaveMajiangsNode.x = currentRoundNode.handMajiangsNode.x 
            // currentRoundNode.weaveMajiangsNode.y = -chairNodePosInMjTable.y + downHandHeight + distanceHandFromDown
            currentRoundNode.scoreChange.setPosition( cc.p(-20, -30) )  
            //discard
            var discardMajiangsNodeWith = (majiangFactory.discardCountOneRow-1)*majiangFactory.up_discardWidth*majiangFactory.scale_upDown
            var mjsDiscardHeight = majiangFactory.up_discardHeight*majiangFactory.scale_upDown

            currentRoundNode.discardMajiangsNode.x = -chairNodePosInMjTable.x + majiangFactory.mjTableNode.width - 
            0.5*( majiangFactory.mjTableNode.width - discardMajiangsNodeWith)
            currentRoundNode.discardMajiangsNode.y =  -chairNodePosInMjTable.y + centerPosY + mjsDiscardHeight*0.5 + 50

            //hand
            var mjsWidth = majiangFactory.up_handWidth*majiangFactory.scale_upDown
            var handMjsWidth = MAX_COUNT*mjsWidth + majiangFactory.upMjAndNewMjInterval
            var w = (majiangFactory.mjTableNode.width - handMjsWidth)/2
            currentRoundNode.handMajiangsNode.x = -chairNodePosInMjTable.x + w
            currentRoundNode.handMajiangsNode.y = -chairNodePosInMjTable.y + majiangFactory.mjTableNode.height - upHandHeight*0.5 - 5

            //weave
            currentRoundNode.weaveMajiangsNode.x = -chairNodePosInMjTable.x + majiangFactory.mjTableNode.width - (majiangFactory.mjTableNode.width - handMjsWidth)/2
            currentRoundNode.weaveMajiangsNode.y = currentRoundNode.handMajiangsNode.y
        }
        else if(direction==3)
        {   
            currentRoundNode.scoreChange.setPosition( cc.p(100, 30) )  
            //discard
            var downDiscardMajiangsNodeWidth = majiangFactory.discardCountOneRow*majiangFactory.down_discardWidth*majiangFactory.scale_upDown
            var discardMajiangsNodeHeight = (majiangFactory.discardCountOneLine-1)*majiangFactory.leftDiscardIntervalY*majiangFactory.scale_rightLeft
            var distanceFromUpDown = 0.5*(majiangFactory.mjTableNode.height - downHandHeight - upHandHeight - discardMajiangsNodeHeight)

            currentRoundNode.discardMajiangsNode.x = -chairNodePosInMjTable.x +
            0.5*( majiangFactory.mjTableNode.width - downDiscardMajiangsNodeWidth )  - (20 + 0.5*majiangFactory.left_discardWidth*majiangFactory.scale_rightLeft)
            currentRoundNode.discardMajiangsNode.y =  -chairNodePosInMjTable.y + majiangFactory.mjTableNode.height - upHandHeight - distanceFromUpDown

            //hand
            var mjsWidth = majiangFactory.left_handWidth*majiangFactory.scale_rightLeft

            currentRoundNode.handMajiangsNode.x = mjsWidth + 30
            currentRoundNode.handMajiangsNode.y = -chairNodePosInMjTable.y +  downHandHeight + distanceHandFromDown
            //weave
            //var handMjsWidth = MAX_COUNT*mjsWidth + majiangFactory.upMjAndNewMjInterval
            currentRoundNode.weaveMajiangsNode.x = currentRoundNode.handMajiangsNode.x 
            currentRoundNode.weaveMajiangsNode.y = -chairNodePosInMjTable.y + majiangFactory.mjTableNode.height - upHandHeight
        } 
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

        var direction = playNode.reGetShowChairId(direction)
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
    decorateMj:function(mj)
    {
        var idx = mj.cardData 
        if(mj.cardData == cmdBaseWorker.cbMagicCardData) //|| mj.cardData == INDEX_REPLACE_CARD_DATA)
        {
            // if(mj.cardData == cmdBaseWorker.cbMagicCardData)
            //     var s = new cc.Sprite("#caiShen.png")
            // else 
            //     var s = new cc.Sprite("#bao.png")

            var s = new cc.Sprite("#caiShen.png")
            var zi = mj.getChildByTag(101)
            if(zi)
            {
                if(mj.direction == 1)
                {
                    var mjWPosX = mj.convertToWorldSpace(cc.p(mj.width,0)).x
                    var ziWPosX = zi.convertToWorldSpace(cc.p(0,0)).x


                    var ziCenterWPos = zi.convertToWorldSpace(cc.p(0.5*zi.width,0.5*zi.height))
                    var caiShenPosInZi = zi.convertToNodeSpace(cc.p(ziCenterWPos.x+(mjWPosX-ziWPosX), ziCenterWPos.y))

                    s.x = caiShenPosInZi.x - 5
                    s.y = caiShenPosInZi.y + 5
                }
                else if(mj.direction == 3)
                {
                    var mjWPosX = mj.convertToWorldSpace(cc.p(0,0)).x
                    var ziWPosX = zi.convertToWorldSpace(cc.p(0,0)).x

                    var ziCenterWPos = zi.convertToWorldSpace(cc.p(0.5*zi.width,0.5*zi.height))
                    var caiShenPosInZi = zi.convertToNodeSpace(cc.p(ziCenterWPos.x-(ziWPosX-mjWPosX), ziCenterWPos.y))

                    s.x = caiShenPosInZi.x - 5
                    s.y = caiShenPosInZi.y + 5
                }
                else
                {
                    s.x = 0.5*zi.width - 5
                    s.y = 0.5*zi.height + 5
                }
                zi.addChild(s)
            }
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
            playNode.gameTypeTTF.setString("一吊铳")
        else if (cmdBaseWorker.cbGameType == 2)
            playNode.gameTypeTTF.setString("硬自摸")

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

        playNode.showLaizi(cmdBaseWorker.cbMagicCardData)
        majiangFactory.initCardData2ScoreMap( [cmdBaseWorker.cbMagicCardData, INDEX_REPLACE_CARD_DATA], [0, cmdBaseWorker.cbMagicCardData] )

        tableNode.setBankerIcon(cmdBaseWorker.wBankerUser, true)
        playNode.timer.initFenwei( playNode.reGetShowChairId(tableData.getShowChairIdWithServerChairId(cmdBaseWorker.cbEastUser)) )
        playNode.timer.switchTimer(cmdBaseWorker.wCurrentUser==INVALID_WORD?[]:[playNode.reGetShowChairId(tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wCurrentUser))])
        playNode.timerNode.setVisible(true)

        if(cmdBaseWorker.wOutCardUser!=INVALID_WORD)
        {
            var d = tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wOutCardUser)
            playNode.setCurrentDiscardMj(cmdBaseWorker.cbOutCardData, playNode.reGetShowChairId(d))
        }

        if (cmdBaseWorker.cbGameType == 0)
            playNode.gameTypeTTF.setString("一吊铳")
        else if (cmdBaseWorker.cbGameType == 2)
            playNode.gameTypeTTF.setString("硬自摸")

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
            direction = playNode.reGetShowChairId( direction )
            var weaveItems = cmdBaseWorker.WeaveItemArray[i]
            //组合牌
            for(var j=0;j<MAX_WEAVE;j++)
            {
                var t = weaveItems[j].cbCardData
                weaveItems[j].cbCardData = playNode.sortWeaveIdxs(weaveItems[j].cbWeaveKind, t)

                weaveItems[j].provideDirection = playNode.reGetShowChairId(tableData.getShowChairIdWithServerChairId(weaveItems[j].wProvideUser))
            }
            weaveItemArray[direction] = weaveItems

            var idxs = []
            for(var j=0;j<MAX_COUNT;j++)
            {
                idxs[j] = 0
            }
            var cbHandCardData= direction==0?cmdBaseWorker.cbHandCardData:idxs
            var handIdxs = cbHandCardData.slice(0, cmdBaseWorker.cbHandCardCount[i])
            if(cmdBaseWorker.wCurrentUser==i)
            {
                handIdxsArray[direction][0] = handIdxs.slice(0, handIdxs.length-1)
                handIdxsArray[direction][1] = handIdxs[handIdxs.length-1]
            }
            else
                handIdxsArray[direction][0] = handIdxs

            discardIdxsArray[direction] = cmdBaseWorker.cbDiscardCard[i].slice(0, cmdBaseWorker.cbDiscardCount[i])
        }
    
        playNode.sortHandIdxs(handIdxsArray[0][0]) 
        playNode.sendCardsAction(handIdxsArray, discardIdxsArray, weaveItemArray) 
    },
    reGetShowChairId:function( curId )
    {
        return curId == 0 ? curId:2
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
        for(var i=0;i<GAME_PLAYER;i++)
        {
            var direction = i
            var serverChairid = tableData.getServerChairIdWithShowChairId(direction)
            direction = playNode.reGetShowChairId( direction )

            var idxs = []
            for(var ii=0;ii<MAX_COUNT;ii++)
            {
                idxs[ii] = 0
            }
            if(serverChairid==self.wChairID)
                idxs = cmdBaseWorker.cbHandCardData.slice(0, MAX_COUNT)

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
        playNode.sendCardsAction(handIdxsArray, [[],[],[],[]], [[],[],[],[]]) 

        /////摸到麻将时有可能出现杠听胡
        var sortedActions = majiangLogic.getSortedActionsWithMask(cmdBaseWorker.cbActionMask)
        if(sortedActions.length>0)
            playNode.showActionBtns(null, sortedActions)  //自摸杠 idx不确定 需要searchGangIdxs
           
        playNode.actionBtns.setVisible(false)
        playNode.setCurrentRoundNodesVisible(false)
        managerTouch.closeTouch() 
        //提前保存可能被破坏的数据  掷骰子是庄家出牌破坏数据 因为可能庄家筛子先出完
        var cbLeftCardCount = cmdBaseWorker.cbLeftCardCount
        var cbMagicCardData = cmdBaseWorker.cbMagicCardData
        var wCurrentUser = cmdBaseWorker.wCurrentUser

        var bankerShowChairid = tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wBankerUser)
        function gameStart()
        {
            playNode.scoreTTF.setString(cbLeftCardCount)
            playNode.showLaizi(cbMagicCardData)

            var EastShowChairid = tableData.getShowChairIdWithServerChairId(cmdBaseWorker.cbEastUser)
            playNode.timer.initFenwei( playNode.reGetShowChairId(EastShowChairid) )
            playNode.timer.switchTimer([playNode.reGetShowChairId(tableData.getShowChairIdWithServerChairId(wCurrentUser))])
            playNode.timerNode.setVisible(true)

            playNode.actionBtns.setVisible(true)
            playNode.setCurrentRoundNodesVisible(true)
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
        var outUser = tableData.getUserWithChairId(cmdBaseWorker.wOutCardUser)
        var outDir = tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wOutCardUser)  
        outDir = playNode.reGetShowChairId( outDir )
        var outIdx = cmdBaseWorker.cbOutCardData

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
                majiangFactory.insertHandMajiangsOld(majiangs, outDir, newMj.cardData, playNode.handGroupNode4D[outDir])
                majiangFactory.deleteHandMajiangNew(majiangs)
            }
        }
        else
            majiangFactory.deleteHandMajiangs(majiangs, outDir, 0)

        majiangFactory.addDiscardMajiangs(playNode.discardMajiangs4D[outDir], outDir,
            outIdx, outUser.userNodeInsetChair.currentRoundNode.discardMajiangsNode)

        playNode.setCurrentDiscardMj(outIdx, outDir)
    },
    onCMD_SendCard:function() 
    {
        playNode.scoreTTF.setString(cmdBaseWorker.cbLeftCardCount)
        managerAudio.playEffect('gameRes/sound/sendcard.mp3')

        var dir =  playNode.reGetShowChairId(tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wCurrentUser))   
        playNode.timer.switchTimer([dir])

        var currentUser = tableData.getUserWithChairId(cmdBaseWorker.wCurrentUser)
        var newMjIdx = currentUser.dwUserID==selfdwUserID?cmdBaseWorker.cbSendCardData:0

        majiangFactory.addHandMajiangNew(playNode.handMajiangs4D[dir], dir, newMjIdx, playNode.handGroupNode4D[dir])

        /////摸到麻将时有可能出现杠听胡
        var sortedActions = majiangLogic.getSortedActionsWithMask(cmdBaseWorker.cbActionMask)
        if(sortedActions.length>0 && currentUser.dwUserID == selfdwUserID)
            playNode.showActionBtns(null, sortedActions)  //自摸杠 idx不确定 需要searchGangIdxs
    },
    onCMD_OperateNotify:function() 
    {
        var sortedActions = majiangLogic.getSortedActionsWithMask(cmdBaseWorker.cbActionMask)
        var idx = cmdBaseWorker.cbProvideCard
        playNode.showActionBtns(idx, sortedActions)
    },
    //处理吃碰杠 主要会调用到手牌堆、丢弃牌堆、吃碰杠牌堆的‘增删减查’
    onActionResult:function(action, cardDatas, operateUser, provideUser, majiangs4W4D, handGroupNode4D)
    {
        if(action==WIK_REPLACE)
            majiangFactory.onActionReplace(cardDatas, operateUser, provideUser, majiangs4W4D, handGroupNode4D)
        if(action==WIK_GANG)
            playNode.onActionGang(cardDatas, operateUser, provideUser, majiangs4W4D, handGroupNode4D)
        else if(action == WIK_PENG)
            playNode.onActionPeng(cardDatas, operateUser, provideUser, majiangs4W4D, handGroupNode4D)
        else if(action == WIK_LEFT)
            playNode.onActionChi(action, cardDatas, operateUser, provideUser, majiangs4W4D, handGroupNode4D)
        else if(action == WIK_CENTER)
            playNode.onActionChi(action, cardDatas, operateUser, provideUser, majiangs4W4D, handGroupNode4D)
        else if(action == WIK_RIGHT)
            playNode.onActionChi(action, cardDatas, operateUser, provideUser, majiangs4W4D, handGroupNode4D)
    },
    onActionGang:function(cardDatas, operateUser, provideUser, majiangs4W4D, handGroupNode4D)
    {
        var cardData = cardDatas[0]
        var gangType //0暗杠 1明杠 2增杠
        var operateUserDir = tableData.getShowChairIdWithServerChairId(operateUser.wChairID)
        var provideUserDir = tableData.getShowChairIdWithServerChairId(provideUser.wChairID)
        operateUserDir = playNode.reGetShowChairId(operateUserDir)
        provideUserDir = playNode.reGetShowChairId(provideUserDir)

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
        operateUserDir = playNode.reGetShowChairId(operateUserDir)
        provideUserDir = playNode.reGetShowChairId(provideUserDir)

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
        operateUserDir = playNode.reGetShowChairId(operateUserDir)
        provideUserDir = playNode.reGetShowChairId(provideUserDir)

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
        playNode.onActionResult(cmdBaseWorker.cbOperateCode, idxs, operateUser, provideUser,
            majiangs3W4D, playNode.handGroupNode4D)

        playNode.playAction(cmdBaseWorker.cbOperateCode, operateUser)

        playNode.timer.switchTimer(cmdBaseWorker.wCurrentUser==INVALID_WORD?[]:[playNode.reGetShowChairId(tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wCurrentUser))])

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
                    if (i != 0 && i != 1)
                        continue
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
            playNode.gameTypeTTF.setString("一吊铳")
        else if (cmdBaseWorker.cbGameType == 2)
            playNode.gameTypeTTF.setString("硬自摸")

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
            if (i != 0 && i != 1)
                continue
            var user = tableData.getUserWithChairId(i)
            if(user)
                szNickName_gameEnd[i] = user.szNickName
        }

        if(cmdBaseWorker.endType == 3)
        {
            var provideDiscardMajiangs = playNode.discardMajiangs4D[playNode.reGetShowChairId(tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wProvideUser))]
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
                        if (i != 0 && i != 1)
                            continue
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

        playNode.handGroupNode4D = playNode.getHandGroupNodes(handMajiangs, touchEndCalls)
    },
    //手牌是要处理触摸监听的 GroupNodes是hand麻将的父节点 用于同意处理触摸
    getHandGroupNodes:function(handMajiangs4D, outCardCalls)
    {
        var handGroupNodes = []
        for(showChairid=0;showChairid<GAME_PLAYER;showChairid++)//direction 0down 1right 2up 3left
        {
            var direction = showChairid
            direction = playNode.reGetShowChairId(direction)
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
    getHandMajiangsArray:function(handCardDatasArray, isLookon)
    {
        var handMajiangs4D = []
        for(showChairid=0;showChairid<GAME_PLAYER;showChairid++)//direction 0down 1right 2up 3left
        {
            var direction = showChairid
            direction = playNode.reGetShowChairId(direction)
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
    sendCardsAction:function(handIdxsArray, discardIdxsArray, weaveItemArray)
    {   
        // discardIdxsArray = [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,],[],[4,5,6,7],[]]
        // weaveIdxsArray = [[[1,2,3,4],[2,3,4],[4,5,6],[7,8,1]],[],[[1,2,3],[2,3,4,5],[4,5,6],[7,8,1]],[]]
        var self = tableData.getUserWithUserId(selfdwUserID)
        var selfDir = tableData.getShowChairIdWithServerChairId(self.wChairID)

        GAME_PLAYER = 3
        playNode.handMajiangs4D = playNode.getHandMajiangsArray(handIdxsArray, tableData.getUserWithUserId(selfdwUserID).wChairID == INVALID_WORD)
        playNode.discardMajiangs4D = majiangFactory.getDiscardMajiangsArray(discardIdxsArray)
        GAME_PLAYER = 2

        for(var i=0;i<GAME_PLAYER;i++)
        {
            var direction = i
            direction = playNode.reGetShowChairId( direction )
            var weaveItems = weaveItemArray[direction]
            for(var groupIdx=0;groupIdx<weaveItems.length;groupIdx++)
            {
                var weaveItem = weaveItems[groupIdx]
                if(weaveItem.cbWeaveKind == WIK_NULL)
                    continue
                weaveItem.cbCardDatas = weaveItem.cbCardData
                weaveItem.cbCenterCardData = weaveItem.cbCenterCard
            }
        }

        GAME_PLAYER = 3
        playNode.weaveMajiangs4D = majiangFactory.getWeaveMajiangsArray(weaveItemArray, selfDir, true)
        GAME_PLAYER = 2

        playNode._getHandMajiangsGroupNode()

        var self = tableData.getUserWithUserId(selfdwUserID)
        for(var i=0;i<GAME_PLAYER;i++)
        {
            var direction = i
            var chairid = tableData.getServerChairIdWithShowChairId(direction)
            var user = tableData.getUserWithTableIdAndChairId(self.wTableID, chairid)
            if (!user)
                continue

            direction = playNode.reGetShowChairId(direction)
            var handMajiangsNode = user.userNodeInsetChair.currentRoundNode.handMajiangsNode
            var discardMajiangsNode = user.userNodeInsetChair.currentRoundNode.discardMajiangsNode
            var weaveMajiangsNode = user.userNodeInsetChair.currentRoundNode.weaveMajiangsNode

            var discardMajiangs = playNode.discardMajiangs4D[direction]
            for(var j=0;j<discardMajiangs.length;j++)
            {
                var mj = discardMajiangs[j]
                discardMajiangsNode.addChild(mj)
            }

            var weaveMajiangs = playNode.weaveMajiangs4D[direction]
            for(var groupIdx=0;groupIdx<weaveMajiangs.length;groupIdx++)
            {
                var group = weaveMajiangs[groupIdx]
                for(var idxInGroup=0;idxInGroup<group.length;idxInGroup++)
                {
                    var mj = group[idxInGroup]
                    weaveMajiangsNode.addChild(mj)
                }
            }

            handMajiangsNode.addChild(playNode.handGroupNode4D[direction])
        }

    },
    ////////////sendCardsAction end//////////


    ////////////gameend start//////////
    _showScore:function(bEnd)
    {
        //score
        for(var i=0;i<GAME_PLAYER;i++)
        {
            if (i != 0 && i != 1)
                continue
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
    //游戏结束时展示手牌 
    getDisplayHandMajiangsArray:function(displayHandCardDatasArray)
    {
        var handMajiangs4D = []
        for(showChairid=0;showChairid<GAME_PLAYER;showChairid++)//direction 0down 1right 2up 3left
        {
            var direction = showChairid
            direction = playNode.reGetShowChairId(direction)
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
    _showSprsOnGameEnd:function()
    {
        playNode._showScore(true)

        if(cmdBaseWorker.endType == 1 || cmdBaseWorker.endType == 0)
            return 

        //删除打出去的牌
        for(var i=0;i<GAME_PLAYER;i++)
        {
            if (i != 0 && i != 1)
                continue
            var user = tableData.getUserWithChairId(i)
                if(!user) continue

            user.userNodeInsetChair.currentRoundNode.discardMajiangsNode.removeAllChildren()
        }

        playNode.timerNode.setVisible(false)

        //摊牌
        var displayHandIdxsArray = []
        var cbProvideCard = cmdBaseWorker.cbProvideCard
        for(var i=0;i<GAME_PLAYER;i++)
        {
            var direction = i
            var chairid = tableData.getServerChairIdWithShowChairId(direction)
            direction = playNode.reGetShowChairId(direction)
            displayHandIdxsArray[direction] = [cmdBaseWorker.cbHandCardData[chairid].slice(0, cmdBaseWorker.cbHandCardCount[chairid]), null]

            if(cmdBaseWorker.wWinner == chairid)
            {   
                var displayHandIdxs = displayHandIdxsArray[direction]
                for(var j=0;j<displayHandIdxs[0].length;j++)
                {
                    if(displayHandIdxs[0][j] == cbProvideCard)
                    {
                       displayHandIdxs[1] = displayHandIdxs[0].splice(j, 1)[0]
                       break
                    }
                }
            }
        }

        playNode.handMajiangs4D = playNode.getDisplayHandMajiangsArray(displayHandIdxsArray)
        GAME_PLAYER = 2
        for(var i=0;i<GAME_PLAYER;i++)
        {
            if (i != 0 && i != 1)
                continue
            var direction = i

            var showChairid = direction//==0?0:1
            var chairid = tableData.getServerChairIdWithShowChairId(showChairid)

            var user = tableData.getUserWithTableIdAndChairId(self.wTableID, chairid)
            var handGroupNode = playNode.handGroupNode4D[playNode.reGetShowChairId(direction)]
            handGroupNode.removeAllChildren()

            var handMajiangs = playNode.handMajiangs4D[playNode.reGetShowChairId(direction)]
            var oldMjs = handMajiangs[0]

            for(var j=0;j<oldMjs.length;j++)
            {
                handGroupNode.addChild(oldMjs[j])
            }
            if(handMajiangs[1])
                handGroupNode.addChild(handMajiangs[1])
        }

        // playNode.playAction('hu', tableData.getUserWithChairId(args.winner))
    },
    _removeSprsOnGameEnd:function()
    {
        for(var chairId=0;chairId<GAME_PLAYER;chairId++)
        {   
            if (chairId != 0 && chairId != 1)
                continue
            var user = tableData.getUserWithTableIdAndChairId(null, chairId)
            if(user)
                playNode.clearCurrentRoundNode(user.userNodeInsetChair.currentRoundNode)
        }
    },
    popGameEnd:function(continueCall, szNickName_gameEnd)
    {
        var cbWinFlag = []
        for(var i=0;i<GAME_PLAYER;i++)
        {
            if(cmdBaseWorker.endType==0 && i==cmdBaseWorker.wExitUser)
                cbWinFlag[i] = 6
            else 

            if((cmdBaseWorker.endType==2||cmdBaseWorker.endType==3||cmdBaseWorker.endType==4) && cmdBaseWorker.wWinner == i)
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
            if (i != 0 && i != 1)
                continue
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
            
            var score = cmdBaseWorker.lGameScore[chairid]
            control['name'+i].setString(szNickName_gameEnd[chairid])
            control['banker'+i].setVisible(cmdBaseWorker.wBankerUser == chairid)
            if(score>0)
            {
                control['scoreTTF'+i].setString('+' + score)
                control['scoreTTF'+i].color = cc.color(255, 0, 0)
              //  control['scoreTTF'+i].setFontFillColor( cc.color(255, 0, 0, 255) )
                var newFrame = 'gend5.png'
                if(cc.isString(newFrame))
                {
                    newFrame = cc.spriteFrameCache.getSpriteFrame(newFrame);
                    cc.assert(newFrame, cc._LogInfos.Sprite_setSpriteFrame)
                }
                control['frame'+i].setSpriteFrame(newFrame)
                control['frame'+i].width = 530
            }
            else
            {
                control['scoreTTF'+i].setString(score==0?'-'+score:score)
                control['scoreTTF'+i].color = cc.color(0, 255, 0)
                //control['scoreTTF'+i].setFontFillColor( cc.color(0, 255, 0, 255) )
                var newFrame = 'gend6.png'
                if(cc.isString(newFrame))
                {
                    newFrame = cc.spriteFrameCache.getSpriteFrame(newFrame);
                    cc.assert(newFrame, cc._LogInfos.Sprite_setSpriteFrame)
                }
                control['frame'+i].setSpriteFrame(newFrame)
                control['frame'+i].width = 530
            }
        }

        node.setPosition( cc.p( mainScene.uiTop.getContentSize().width * 0.5, mainScene.uiTop.getContentSize().height * 0.5) )
        mainScene.top.addChild(node) 
    },
    ///gameend end////


    /////other ui start////////
    setCurrentDiscardMj:function(idx, direction)
    {
        var self = tableData.getUserWithUserId(selfdwUserID)
        var d = self.wChairID
        if (self.cbUserStatus != US_LOOKON)
            d = playNode.reGetShowChairId(tableData.getShowChairIdWithServerChairId(self.wChairID))
        
        if(d == direction)
            majiangFactory.hideCurrentDiscardMj()
        else
           majiangFactory.setCurrentDiscardMj(idx, direction)
    },
    showLaizi:function(idx)
    {
        var mj = majiangFactory.getOne(idx, 1, 0, true)
        var w = playNode.laiziMjNode.width
        var h = playNode.laiziMjNode.height

        mj.setScaleX(w/mj.width)
        mj.setScaleY(h/mj.height)
        mj.x = w/2
        mj.y = h/2

        playNode.laiziMjNode.addChild(mj)

        playNode.laiziNode.setVisible(true)
    },
    hideLaizi:function()
    {
        playNode.laiziMjNode.removeAllChildren()
        playNode.laiziNode.setVisible(false)
    },
    playAction:function(WIK, user)
    {
        playNode.playActionEffect(WIK, user.cbGender)
        managerAudio.playEffect('gameRes/sound/weave.mp3')

        var name = typeof(WIK)=='number'?majiangLogic.wik2Name(WIK):WIK

        playNode.playAnimationWithDirection(name, playNode.reGetShowChairId(tableData.getShowChairIdWithServerChairId(user.wChairID)))
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
            btn.setPositionX(-180 * (sortedActions.length-1-i +1))
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
            majiangFactory.mjTableNode.addChild(spr)
            spr.x = majiangFactory.mjTableNode.width*0.5
            spr.y = majiangFactory.mjTableNode.height*0.5
        }
        else if(cmdBaseWorker.endType == 2)
        {
            playNode.playAnimationWithDirection('zim', playNode.reGetShowChairId(tableData.getShowChairIdWithServerChairId(winner)), call)

            var playSound = playNode.getSoundEffect()
            if (playSound == '')
                playSound = 'zimo'
            playSound += '0'
            playNode.playGenderEffect(playSound, tableData.getUserWithChairId(winner).cbGender)
        }
        else if(cmdBaseWorker.endType == 3 || cmdBaseWorker.endType == 4)
        {
            playNode.playAnimationWithDirection('hu', playNode.reGetShowChairId(tableData.getShowChairIdWithServerChairId(winner)), call)
            playNode.playAnimationWithDirection('dp', playNode.reGetShowChairId(tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wProvideUser)))

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
    playAnimationWithDirection:function(name, direction, call)
    {
        if(!isOpenEffect)
        {
            call?call():''
            return; 
        }

        var spr = actionFactory.getSprWithAnimate(name + '_', true, 0.15, call)
        majiangFactory.mjTableNode.addChild(spr)

        var pos = majiangFactory.getActionPlayNodePos(direction)
        spr.x = pos.x
        spr.y = pos.y
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
            if(direction == 1)
                playNode.playDiceOneDirection(call, nums[0], nums[1], direction)
            else
                playNode.playDiceOneDirection(function()
                    {
                        if (direction == 0)
                            playDice(1)
                        else
                            playDice(0)
                    }, nums[0], nums[1], direction)
        }

        playDice(0)
    },
    playDiceOneDirection:function(call, endNum1, endNum2, direction)
    {
        var w = playNode.mjTableNode.width
        var h = playNode.mjTableNode.height

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

        playNode.mjTableNode.addChild(diceSpr1)
        playNode.mjTableNode.addChild(diceSpr2)

        managerAudio.playEffect('gameRes/sound/dice.mp3') 
    },
    resetPlayNode:function()
    {
        playNode._removeSprsOnGameEnd()
        playNode.timerNode.setVisible(false)
        playNode.hideLaizi()
    }
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

