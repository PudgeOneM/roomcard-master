
////先理解majiangFactory(components/majiangFactory/majiangFactory)
var playNode = 
{   
    handMajiangs4D:[],//手牌麻将精灵数组 4个方向的
    handGroupNode4D:[],//手牌麻将精灵父节点 4个方向的
    huaMaJiang4D:[],    //补花麻将 4个方向的
    discardMajiangs4D:[],//丢弃麻将精灵数组 4个方向的
    weaveMajiangs4D:[],//吃碰杠麻将精灵数组 4个方向的
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

        majiangFactory.init( playNode.mjTableNode, playNode.decorateMj )
        majiangFactory.isPublicAnGang = false

        playNode.timer = majiangTimer4D.getTimer()
        playNode.timerNode.addChild(playNode.timer)
        playNode.timerNode.setScale( majiangFactory.scale_upDown )
    },
    onReStart:function()
    {
        playNode.handMajiangs4D = []
        playNode.handGroupNode4D = []
        playNode.huaMaJiang4D = []
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

        currentRoundNode.huaMaJiangNode = new cc.Node()
        currentRoundNode.addChild( currentRoundNode.huaMaJiangNode )
    },
    clearCurrentRoundNode:function(currentRoundNode)
    {           
        //一轮结束 clearCurrentRoundNode
        currentRoundNode.handMajiangsNode.removeAllChildren()
        currentRoundNode.discardMajiangsNode.removeAllChildren()
        currentRoundNode.weaveMajiangsNode.removeAllChildren()
        currentRoundNode.scoreChange.removeAllChildren()
        currentRoundNode.huaMaJiangNode.removeAllChildren()
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

             //hua
            currentRoundNode.huaMaJiangNode.x = chairNodePosInMjTable.x + downHandHeight//+ majiangFactory.mjTableNode.width
            currentRoundNode.huaMaJiangNode.y = -chairNodePosInMjTable.y + downHandHeight*1
        }
        else if(direction==2)//shang
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

             //hua
            currentRoundNode.huaMaJiangNode.x = -chairNodePosInMjTable.x + w
            currentRoundNode.huaMaJiangNode.y = -chairNodePosInMjTable.y + majiangFactory.mjTableNode.height - upHandHeight*2.1

        } 
        else if(direction==1)//you
        { 
            currentRoundNode.scoreChange.setPosition( cc.p(-100, -50) )  
            //discard
            var downDiscardMajiangsNodeWidth = majiangFactory.discardCountOneRow*majiangFactory.down_discardWidth*majiangFactory.scale_upDown
            var discardMajiangsNodeHeight = (majiangFactory.discardCountOneLine-1)*majiangFactory.rightDiscardIntervalY*majiangFactory.scale_rightLeft
            var distanceFromUpDown = 0.5*(majiangFactory.mjTableNode.height - downHandHeight - upHandHeight - discardMajiangsNodeHeight)

            currentRoundNode.discardMajiangsNode.x = -chairNodePosInMjTable.x + majiangFactory.mjTableNode.width - 
            0.5*( majiangFactory.mjTableNode.width - downDiscardMajiangsNodeWidth ) + (20 + 0.5*majiangFactory.right_discardWidth*majiangFactory.scale_rightLeft)
            currentRoundNode.discardMajiangsNode.y =  -chairNodePosInMjTable.y + downHandHeight + distanceFromUpDown

            //hand
            var mjsWidth = majiangFactory.right_handWidth*majiangFactory.scale_rightLeft

            currentRoundNode.handMajiangsNode.x = -(mjsWidth + 30)
            currentRoundNode.handMajiangsNode.y = -chairNodePosInMjTable.y + majiangFactory.mjTableNode.height - upHandHeight
            
            //weave
            //var handMjsWidth = MAX_COUNT*mjsWidth + majiangFactory.upMjAndNewMjInterval
            currentRoundNode.weaveMajiangsNode.x = currentRoundNode.handMajiangsNode.x 
            currentRoundNode.weaveMajiangsNode.y = -chairNodePosInMjTable.y + downHandHeight + distanceHandFromDown

            //hua
            currentRoundNode.huaMaJiangNode.x = currentRoundNode.handMajiangsNode.x -(mjsWidth  * 5 + 10)
            currentRoundNode.huaMaJiangNode.y =  -chairNodePosInMjTable.y + downHandHeight*2 + distanceHandFromDown
            
        }
        else if(direction==3)//zuo
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
            //hua
            currentRoundNode.huaMaJiangNode.x = mjsWidth + 30
            currentRoundNode.huaMaJiangNode.y = -chairNodePosInMjTable.y + downHandHeight + distanceHandFromDown
        
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
            var GameSet = getObjWithStructName('CMD_C_GameSet')
            GameSet.xiapao = playNode.gamesetTTF1.getString()
            GameSet.jiading = playNode.gamesetTTF2.getString()
            socket.sendMessage(MDM_GF_GAME,SUB_C_GAME_SET,GameSet)

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
           // }
            playNode.hideActionBtns()  
            majiangFactory.chooseItemsNode.removeAllChildren() 
        }
    },
    decorateMj:function(mj)
    {
        var idx = mj.cardData 
        if(mj.cardData == cmdBaseWorker.cbMagicCardData) //|| mj.cardData == REPLACE_CARD_DATA)
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
    ///////////////assist function start//////////
    //补花检测
    checkBuHua:function()
    {

        var selfChairId = tableData.getUserWithUserId(selfdwUserID).wChairID
        if(selfChairId == INVALID_CHAIR) return false;
        for (var i = 0; i < MAX_COUNT; i++)  
        {  
            var  isHua = playNode.isHuaCard(cmdBaseWorker.cbHandCardData[i])
            if (isHua == true) return true;
        }
      return false;
    },
    //是否花牌 
    isHuaCard:function( cardData  )
    {
        return false;
        var cbHuaCard = 55;
        if( cmdBaseWorker.cbMagicCardData == cbHuaCard )
            cbHuaCard = 53;
        return cardData == cbHuaCard?true:false;
        
    },
    //////////////////assist function start//////////
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

        cocos.setInterval(playNode.updateOnFree, 1000, playNode.node)
    },
    onCMD_StatusPlay:function() 
    {
        //林州规则：
        tableNode.setBankerIcon(cmdBaseWorker.wBankerUser, true)

        playNode.isPlaying = true
        playNode.scoreTTF.setString(cmdBaseWorker.cbLeftCardCount)

        playNode.showLaizi(cmdBaseWorker.cbRmCardData)
        majiangFactory.initCardData2ScoreMap( [cmdBaseWorker.cbMagicCardData, REPLACE_CARD_DATA], [0, cmdBaseWorker.cbMagicCardData] )

        tableNode.setBankerIcon(cmdBaseWorker.wBankerUser, true)
        playNode.timer.initFenwei( tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wBankerUser) )
        playNode.timer.switchTimer(cmdBaseWorker.wCurrentUser==INVALID_WORD?[]:[tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wCurrentUser)])
        playNode.timerNode.setVisible(true)

        if(cmdBaseWorker.wOutCardUser!=INVALID_WORD)
        {
            var d = tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wOutCardUser)
            playNode.setCurrentDiscardMj(cmdBaseWorker.cbOutCardData, d)
        }

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
    
        // console.log(6666, handIdxsArray, discardIdxsArray, weaveItemArray)
        playNode.sortHandIdxs(handIdxsArray[0][0]) 
        playNode.sendCardsAction(handIdxsArray, discardIdxsArray, weaveItemArray) 
        //添加花
        for ( var i = 0 ; i < 4;i ++)
        {
            var serverChairid = tableData.getServerChairIdWithShowChairId(i)
            var buhuaUser = tableData.getUserWithChairId(serverChairid)
            buhuaUser.userNodeInsetChair.currentRoundNode.huaMaJiangNode.removeAllChildren()
            var huaMajiangsNode = buhuaUser.userNodeInsetChair.currentRoundNode.huaMaJiangNode
            var direction = i
            var serverChairid = tableData.getServerChairIdWithShowChairId(i)
        
            for ( var j = 0 ; j < 4;j++ )
            {
                if ( cmdBaseWorker.cbHuaCardData[serverChairid][j] > 0 )
                {
                    playNode.addAHuaCard(direction,huaMajiangsNode,cmdBaseWorker.cbHuaCardData[serverChairid][j],j)
                };
            };
        }
         //补花检测
        if (playNode.checkBuHua( )) 
        {
            cmdBaseWorker.cbCanSendCard = 1
            mainScene.scene.scheduleOnce(playNode.onUserBuHua, 0.5);
        }
    },
    //发送补花
    onUserBuHua:function()
  {
      gameLog.log('发送补花:')
      socket.sendMessage(MDM_GF_GAME, SUB_C_REPLACE_CARD);
  },
    //补花返回
    onCMD_ReplaceCard:function(body)
    {
        //播放补花音效
        //managerAudio.playEffect('gameRes/sound/action_buflower.wav');
        var buhuaUser = tableData.getUserWithChairId(body.wReplaceUser)
        var huaMajiangsNode = buhuaUser.userNodeInsetChair.currentRoundNode.huaMaJiangNode
        var direction = 0
        buhuaUser.userNodeInsetChair.currentRoundNode.huaMaJiangNode.removeAllChildren()
        for(var i=0;i<4;i++)
        {
            var serverChairid = tableData.getServerChairIdWithShowChairId(i)
            if (serverChairid == body.wReplaceUser ) 
            { 
                direction = i;
            };
        }
        

        for ( var i = 0 ; i < 4;i++ )
        {
            if ( body.cbHuaCard[i] > 0 )
            {
                if ( body.wReplaceUser == tableData.getUserWithUserId(selfdwUserID).wChairID ) 
                {gameLog.log('补花:' +  body.cbHuaCard[i] )} //提交前删除临时输出
                for( var k = 0;k<4;k++)
                {
                    if (cmdBaseWorker.cbHuaCardData[body.wReplaceUser][k] == 0) 
                    {
                        cmdBaseWorker.cbHuaCardData[body.wReplaceUser][k] = body.cbHuaCard[i]
                        break;
                    };
                }
                var test = tableData.getUserWithUserId(selfdwUserID).wChairID
                if ( body.wReplaceUser == tableData.getUserWithUserId(selfdwUserID).wChairID ) 
                    {
                        var outDir = tableData.getShowChairIdWithServerChairId( body.wReplaceUser )
                        var majiangs = playNode.handMajiangs4D[outDir]
                        
                        majiangFactory.deleteHandMajiangs(majiangs, outDir, body.cbHuaCard[i])
                        if ( body.wReplaceUser == cmdBaseWorker.wCurrentUser ) 
                        {
                            
                            majiangFactory.addHandMajiangNew(majiangs, outDir, body.cbReplaceCard[i], playNode.handGroupNode4D[outDir])
                        }
                        else
                        {
                            majiangFactory.insertHandMajiangsOld(majiangs, outDir, body.cbReplaceCard[i], playNode.handGroupNode4D[outDir])
                        }
                        
                    };
            };
            if ( cmdBaseWorker.cbHuaCardData[body.wReplaceUser][i] > 0 )
            {
                playNode.addAHuaCard(direction,huaMajiangsNode,cmdBaseWorker.cbHuaCardData[body.wReplaceUser][i],i)
            };
        };


        //补花检测
        if ( body.wReplaceUser == tableData.getUserWithUserId(selfdwUserID).wChairID ) 
        { 
          gameLog.log('二次检测：')
          cmdBaseWorker.cbCanSendCard = 0
          for (var i = 0; i < 4; i++)  
            {  
                if ( playNode.isHuaCard(body.cbReplaceCard[i]) == true)
                {
                    cmdBaseWorker.cbCanSendCard = 1
                    mainScene.scene.scheduleOnce(playNode.onUserBuHua, 0.2);
                    gameLog.log('二次补花：')
                }
            }
        };
        
    },
    addAHuaCard:function(direction,huaMajiangsNode,cardData,i)
    {

        cmdBaseWorker.cbHuaCount = cmdBaseWorker.cbHuaCount + 1;
        var mj = majiangFactory.getOne( cardData, 1, direction, true)
        var scale = direction%2==0?majiangFactory.scale_upDown:majiangFactory.scale_rightLeft
        if (direction == 0) 
        {
            mj.x = mj.getContentSize().width * scale * i
            mj.y = mj.getContentSize().height/2
        }
        else if (direction == 1) 
        {
            mj.x = mj.getContentSize().width 
            mj.y = mj.getContentSize().height * scale * 0.74 * (i)  - mj.getContentSize().height
            mj.setLocalZOrder( 4 + 1 - i )
        }
        else if (direction == 2)
        {
            mj.x = mj.getContentSize().width * scale * (i)
            mj.y = mj.getContentSize().height/2
        }
        else if (direction == 3) 
        {
            mj.x = mj.getContentSize().width 
            mj.y = mj.getContentSize().height * scale * 0.74 * (i) + mj.getContentSize().height
            mj.setLocalZOrder( 4 + 1 - i )
        }
        huaMajiangsNode.addChild(mj)
    },
    onCMD_GameSet:function()
    {
        //林州规则：
        //tableNode.setBankerIcon(cmdBaseWorker.wBankerUser, true)
        //playNode.showGameset()
    },
    onCMD_GameStart:function() 
    {
        cocos.clearInterval(playNode.updateOnFree, playNode.node)
        playNode.isPlaying = true

        if(playNode.isLookingResult)
        {
            playNode.resetPlayNode()
        }

        majiangFactory.initCardData2ScoreMap( [cmdBaseWorker.cbMagicCardData, REPLACE_CARD_DATA], [0, cmdBaseWorker.cbMagicCardData] )

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
            playNode.showLaizi(cmdBaseWorker.cbRmCardData)

            playNode.timer.initFenwei( bankerShowChairid )
            playNode.timer.switchTimer([tableData.getShowChairIdWithServerChairId(wCurrentUser)])
            playNode.timerNode.setVisible(true)

            playNode.actionBtns.setVisible(true)
            playNode.setCurrentRoundNodesVisible(true)
            managerTouch.openTouch()
        }

        //function bankerPlayDice()
      //  {
            tableNode.setBankerIcon(cmdBaseWorker.wBankerUser, true)
            playNode.playDiceOneDirection(gameStart, getRandNum(1, 6), getRandNum(1, 6), bankerShowChairid)
      //  }

      //  if(cmdBaseWorker.bIsRandBanker)
            //playNode.playDiceForRandBanker(bankerPlayDice, bankerShowChairid)
      //  else
       //     bankerPlayDice()

       //补花检测
        if (playNode.checkBuHua()) 
        {
            cmdBaseWorker.cbCanSendCard = 1
            mainScene.scene.scheduleOnce(playNode.onUserBuHua, 0.1);
        }
    },
    onCMD_OutCard:function() 
    {
        var outUser = tableData.getUserWithChairId(cmdBaseWorker.wOutCardUser)
        var outDir = tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wOutCardUser)  
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

        var dir =  tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wCurrentUser)   
        playNode.timer.switchTimer([dir])

        var currentUser = tableData.getUserWithChairId(cmdBaseWorker.wCurrentUser)
        var newMjIdx = currentUser.dwUserID==selfdwUserID?cmdBaseWorker.cbSendCardData:0

        majiangFactory.addHandMajiangNew(playNode.handMajiangs4D[dir], dir, newMjIdx, playNode.handGroupNode4D[dir])

        //补花检测 
        var selfChairId = tableData.getUserWithUserId(selfdwUserID).wChairID
        if (playNode.isHuaCard(cmdBaseWorker.cbSendCardData) == true && cmdBaseWorker.wCurrentUser == selfChairId ) 
        {
            cmdBaseWorker.cbCanSendCard = 1
            mainScene.scene.scheduleOnce(playNode.onUserBuHua, 0.2);
        }
        else if(cmdBaseWorker.wCurrentUser == selfChairId)
        {
            /////
            //var sortedActions = majiangLogic.getSortedActionsWithMask(cmdBaseWorker.cbActionMask)
           // if(sortedActions.length>0 && currentUser.dwUserID == selfdwUserID)
            //    playNode.showActionBtns(null, sortedActions)  
        }
    },
    onCMD_OperateNotify:function() 
    {
        gameLog.log('+++++++++++++')
        var sortedActions = majiangLogic.getSortedActionsWithMask(cmdBaseWorker.cbActionMask)
        var idx = cmdBaseWorker.cbProvideCard
        playNode.showActionBtns(idx, sortedActions)
    },
    onCMD_OperateResult:function() 
    {
        playNode.scoreTTF.setString(cmdBaseWorker.cbLeftCardCount)
        majiangFactory.chooseItemsNode.removeAllChildren()
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
            majiangs3W4D, playNode.handGroupNode4D)

        playNode.playAction(cmdBaseWorker.cbOperateCode, operateUser)

        playNode.timer.switchTimer(cmdBaseWorker.wCurrentUser==INVALID_WORD?[]:[tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wCurrentUser)])

        var currentUser = tableData.getUserWithChairId(cmdBaseWorker.wCurrentUser)
        /////吃碰杠后可以继续杠
        var sortedActions = majiangLogic.getSortedActionsWithMask(cmdBaseWorker.cbActionMask)
        if(sortedActions.length>0 && currentUser.dwUserID == selfdwUserID)
            playNode.showActionBtns(null, sortedActions)  //自摸杠 idx不确定 需要searchGangIdxs
    },
    onCMD_GameEnd:function() 
    {
        playNode.isPlaying = false

        /*var record = getObjWithStructName('CMD_GR_C_TableHistoryRecordReq') 
        record.szTableKey = tableKey
        socket.sendMessage(MDM_GR_USER, SUB_GR_USER_TABLE_HISTORY_RECORD_REQ, record)
        */
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
            //抢杠情况不会到丢弃区
            if(provideDiscardMajiangs.length>0 && provideDiscardMajiangs[provideDiscardMajiangs.length-1].cardData == cmdBaseWorker.cbProvideCard)
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
            //var isAllowOut = majiang.cardData != cmdBaseWorker.cbMagicCardData && cmdBaseWorker.wCurrentUser == tableData.getUserWithUserId(selfdwUserID).wChairID
            var isAllowOut = !(!MAGIC_CARD_ALLOWOUT && majiang.cardData == cmdBaseWorker.cbMagicCardData) && cmdBaseWorker.wCurrentUser == tableData.getUserWithUserId(selfdwUserID).wChairID
            
            if(isAllowOut && cmdBaseWorker.cbCanSendCard == 0 && majiang.cardData != cmdBaseWorker.cbMagicCardData )
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

        playNode.handGroupNode4D = majiangFactory.getHandGroupNodes(handMajiangs, touchEndCalls)
    },
    sendCardsAction:function(handIdxsArray, discardIdxsArray, weaveItemArray)
    {   
        // discardIdxsArray = [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,],[],[4,5,6,7],[]]
        // weaveIdxsArray = [[[1,2,3,4],[2,3,4],[4,5,6],[7,8,1]],[],[[1,2,3],[2,3,4,5],[4,5,6],[7,8,1]],[]]
        var self = tableData.getUserWithUserId(selfdwUserID)
        var selfDir = tableData.getShowChairIdWithServerChairId(self.wChairID)

        playNode.handMajiangs4D = majiangFactory.getHandMajiangsArray(handIdxsArray, tableData.getUserWithUserId(selfdwUserID).wChairID == INVALID_WORD)
        playNode.discardMajiangs4D = majiangFactory.getDiscardMajiangsArray(discardIdxsArray)
      

        for(direction=0;direction<GAME_PLAYER;direction++)
        {
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
        playNode.weaveMajiangs4D = majiangFactory.getWeaveMajiangsArray(weaveItemArray, selfDir, true)

        playNode._getHandMajiangsGroupNode()

        var self = tableData.getUserWithUserId(selfdwUserID)
        for(var i=0;i<4;i++)
        {
            var direction = i
            var chairid = tableData.getServerChairIdWithShowChairId(direction)

            var user = tableData.getUserWithTableIdAndChairId(self.wTableID, chairid)
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
    _showSprsOnGameEnd:function()
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
                var score = cmdBaseWorker.lGameScore[i]
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

        if(cmdBaseWorker.endType == 1 || cmdBaseWorker.endType == 0)
            return 


        //删除打出去的牌
        for(var i=0;i<GAME_PLAYER;i++)
        {
            var user = tableData.getUserWithChairId(i)
                if(!user) continue

            user.userNodeInsetChair.currentRoundNode.discardMajiangsNode.removeAllChildren()
        }

        playNode.timerNode.setVisible(false)


        //摊牌
        var displayHandIdxsArray = []
        var cbProvideCard = cmdBaseWorker.cbProvideCard

        for(var i=0;i<4;i++)
        {
            var direction = i
            var chairid = tableData.getServerChairIdWithShowChairId(direction)

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

        playNode.handMajiangs4D = majiangFactory.getDisplayHandMajiangsArray(displayHandIdxsArray)
  
        for(var i=0;i<4;i++)
        {
            var direction = i

            var showChairid = direction//==0?0:1
            var chairid = tableData.getServerChairIdWithShowChairId(showChairid)

            var user = tableData.getUserWithTableIdAndChairId(self.wTableID, chairid)
            var handGroupNode = playNode.handGroupNode4D[direction]
            handGroupNode.removeAllChildren()

            var handMajiangs = playNode.handMajiangs4D[direction]
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

            if((cmdBaseWorker.endType==2||cmdBaseWorker.endType==3) && cmdBaseWorker.wWinner == i)
                cbWinFlag[i] = 7

            if(cmdBaseWorker.endType==3 && cmdBaseWorker.wProvideUser==i)
                cbWinFlag[i] = 8
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
            var chrStr = "胡型："
            for (var i = 0; i < map_mask2Name.length; i++) 
            {
                var chr_type = window[ map_mask2Name[i][0] ] 
                if (cmdBaseWorker.dwChiHuRight[cmdBaseWorker.wWinner] & chr_type)
                {
                    chrStr += map_mask2Name[i][1] + ' ';
                }
            }
            gameLog.log(chrStr);
            if ( chrStr == "胡型：")
                chrStr = "胡型：推到胡";
            
            if(cmdBaseWorker.cbSTNum>0)
                chrStr+="上膛"+cmdBaseWorker.cbSTNum;
            control.resultTTF.setString(chrStr)
            
            control.endType.setVisible(false)
        }
        var  tempTest=[
            "a",
            "b" ,
            "c",
            "d",
            "e",
            "f" ,  
            "g",
            "h",
            "i",
            "j",
            "k",
            "L",
        ];
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
            
            var score = cmdBaseWorker.lGameScore[chairid]

            //start
             var scoreStr = ""
            for (var j = 0; j < 12; j++) 
            {
                if (!tempTest||!cmdBaseWorker.cbTempTest || !cmdBaseWorker.cbTempTest[i]) {break;};
                if(cmdBaseWorker.cbTempTest[i][j]>0)
                {
                    scoreStr += tempTest[j] ;//+ "X" + cmdBaseWorker.cbTempTest[i][j];
                }
            }
            //end
            //control['name'+i].setString(scoreStr)
            control['name'+i].setString(szNickName_gameEnd[chairid])
            
            //control['banker'+i].setVisible(cmdBaseWorker.wBankerUser == chairid)
            var fNames = []
            fNames[0] = "bankerIcon.png"
            fNames[1] = "img_nan.png"
            fNames[2] = "img_xi.png"
            fNames[3] = "img_bei.png"
            control['banker'+i].setSpriteFrame(fNames[playNode.getUserFeng(chairid)-27])
            control['banker'+i].setVisible(true)

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
         //显示手牌
         mIndex = 0;
         for(var i=0;i<GAME_PLAYER;i++)
        {
            var chairid = tableData.getServerChairIdWithShowChairId(i)
            playNode.addAPlayerCard(i,control['resultNode'+chairid])
        }
        //手牌显示完毕
        node.setPosition( cc.p( mainScene.uiTop.getContentSize().width * 0.5, mainScene.uiTop.getContentSize().height * 0.5) )
        mainScene.top.addChild(node) 
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
        var sPosX = 160

        var fanText = cc.LabelTTF.create('', "Helvetica", 24)
        fanText.setFontFillColor( cc.color(255, 0, 36, 255) )
        fanText.setString(cmdBaseWorker.cbIGameFan[chairid] + "台")
        fanText.x = 0*40 +160;
        fanText.y = 90
        cParent.addChild(fanText)

        
        for(var i = 0;i<4;i++)
        {
            if(cmdBaseWorker.cbHuaCardData[chairid][i]>0)
            {
                var huaCards = "白"
                var huaText = cc.LabelTTF.create('', "Helvetica", 24)
                //if (playNode.isMenFeng(playNode.getUserFeng(chairid),cmdBaseWorker.cbHuaCardData[chairid][i]))
                    huaText.setFontFillColor( cc.color(255, 0, 36, 255) )
                //else
                //    huaText.setFontFillColor( cc.color(255, 127, 36, 255) )
                huaText.setString(huaCards);
                huaText.x = (i+1) * 40 +160
                huaText.y = 90
                cParent.addChild(huaText)
            }
        }
        //////
        if (cmdBaseWorker.cbProvideCard != 0) cmdBaseWorker.cbEndCard = cmdBaseWorker.cbProvideCard;
        for(var i = 0;i<MAX_WEAVE;i++)
        {
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
                    aCard = new cc.Sprite('#down_discard0.png')
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
                    aCard.x = sPosX+( cardIndex+1 )*(aCard.getContentSize().width*aCard.getScale() - 2), aCard.getContentSize().height /2 *aCard.getScale()  
                    aCard.y = 45 +10
                    cardIndex++
                }else{
                    aCard.x = sPosX+( cardIndex+1 )*(aCard.getContentSize().width*aCard.getScale() - 2), aCard.getContentSize().height /2 *aCard.getScale()  
                    aCard.y = 45
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
                aCard.y = 45
                if (cardIdx == cmdBaseWorker.cbEndCard && cmdBaseWorker.cbHandCardCount[chairid] + cmdBaseWorker.cbWeaveCount[chairid]*3 == MAX_COUNT) 
                {
                    cardIndex--
                    cmdBaseWorker.cbHandCardCount[chairid]--;
                    aCard.x = sPosX+( MAX_COUNT+1.5)*(aCard.getContentSize().width*aCard.getScale() - 2), aCard.getContentSize().height /2 *aCard.getScale()  
                };
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

        playNode.gamesetNode.setVisible(true)
    },
    setCurrentDiscardMj:function(idx, direction)
    {
        if (idx <=0) 
            return;
        var self = tableData.getUserWithUserId(selfdwUserID)
        var d = tableData.getShowChairIdWithServerChairId(self.wChairID)
        if(d == direction)
            majiangFactory.hideCurrentDiscardMj()
        else
           majiangFactory.setCurrentDiscardMj(idx, direction)
    },
    showLaizi:function(idx)
    {
        var mj = majiangFactory.getOne(idx, 1, 0, false)
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

        playNode.playAnimationWithDirection(name, tableData.getShowChairIdWithServerChairId(user.wChairID))
    },
    hideActionBtns:function()
    {
        playNode.btn_guo.setVisible(false)
        playNode.btn_chi.setVisible(false)
        playNode.btn_peng.setVisible(false)
        playNode.btn_gang.setVisible(false)
        playNode.btn_ting.setVisible(false)
        playNode.btn_hu.setVisible(false)
    },
    showActionBtns:function(idx, sortedActions)
    {
        gameLog.log('==========')
        // playNode.btn_chi.setVisible(false)
        // playNode.btn_peng.setVisible(false)
        // playNode.btn_gang.setVisible(false)
        // playNode.btn_ting.setVisible(false)
        // playNode.btn_hu.setVisible(false)
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
            playNode.playAnimationWithDirection('zim', tableData.getShowChairIdWithServerChairId(winner), call)
            playNode.playGenderEffect('zimo0', tableData.getUserWithChairId(winner).cbGender)
        }
        else if(cmdBaseWorker.endType == 3)
        {
            playNode.playAnimationWithDirection('hu', tableData.getShowChairIdWithServerChairId(winner), call)
            playNode.playAnimationWithDirection('dp', tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wProvideUser))
            playNode.playActionEffect('hu', tableData.getUserWithChairId(winner).cbGender)
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

