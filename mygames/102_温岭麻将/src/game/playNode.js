
var playNode = 
{   
    handMajiangs4D:[],
    handGroupNode4D:[],
    huaMaJiang4D:[],
    discardMajiangs4D:[],
    weaveMajiangs4D:[],
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
        majiangFactory.isPubglicAnGang = false

        playNode.timer = majiangTimer4D.getTimer()
        playNode.timerNode.addChild(playNode.timer)
        playNode.timerNode.setScale( majiangFactory.scale_upDown )

    },
    initCurrentRoundNode:function(currentRoundNode)
    {
        currentRoundNode.discardMajiangsNode = new cc.Node()
        currentRoundNode.addChild( currentRoundNode.discardMajiangsNode )

        currentRoundNode.weaveMajiangsNode = new cc.Node()
        currentRoundNode.addChild( currentRoundNode.weaveMajiangsNode )

        currentRoundNode.handMajiangsNode = new cc.Node()
        currentRoundNode.addChild( currentRoundNode.handMajiangsNode )

        currentRoundNode.scoreChange = new cc.Node()
        currentRoundNode.addChild( currentRoundNode.scoreChange, 1) 

        currentRoundNode.huaMaJiangNode = new cc.Node()
        currentRoundNode.addChild( currentRoundNode.huaMaJiangNode )
    },
    clearCurrentRoundNode:function(currentRoundNode)
    {
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
        
        if(showChairId==0||showChairId==3)
            sign = -1
        else
            sign = 1

        currentRoundNode.scoreChange.setPosition( cc.p(-50 * sign, 30) )  

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
        if(direction==0)
        {
            //discard
            var discardMajiangsNodeWith = (majiangFactory.discardCountOneRow-1)*majiangFactory.down_discardWidth*majiangFactory.scale_upDown
            var mjsDiscardHeight = majiangFactory.down_discardHeight*majiangFactory.scale_upDown

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
            currentRoundNode.weaveMajiangsNode.x = currentRoundNode.handMajiangsNode.x 
            currentRoundNode.weaveMajiangsNode.y = -chairNodePosInMjTable.y + downHandHeight + distanceHandFromDown

            //hua
            currentRoundNode.huaMaJiangNode.x = currentRoundNode.handMajiangsNode.x -(mjsWidth  * 5 + 10)
            currentRoundNode.huaMaJiangNode.y =  -chairNodePosInMjTable.y + downHandHeight*2 + distanceHandFromDown
            //-chairNodePosInMjTable.y + majiangFactory.mjTableNode.height -upHandHeight*4

        }
        else if(direction==3)//zuo
        {
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
            eventName: "resetGameData",
            callback: function(event)
            {   
                playNode.handMajiangs4D = []
                playNode.handGroupNode4D = []
                playNode.huaMaJiang4D = []
                playNode.discardMajiangs4D = []
                playNode.weaveMajiangs4D = []
                playNode.isLookingResult = false

                cocos.clearInterval(playNode.updateOnFree, playNode.node)
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
    searchGangIdxs:function() 
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

            if(cmdBaseWorker.wCurrentUser != INVALID_WORD) //×ÔÃþ¸Ü
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

           // if(cmdBaseWorker.wCurrentUser == INVALID_WORD) //ÃþÅÆÇ°µÄ³ÔÅö¸Ü ¹ýµÃ»°²Å»á·¢SUB_C_OPERATE_CARD
           // {
                playNode.sendMessage_guo()
           // }
            playNode.hideActionBtns()  
            majiangFactory.chooseItemsNode.removeAllChildren() 
        }


    },
    decorateMj:function(mj)
    {
        var idx = mj.cardData 
         
        var isHuaMagic = false
        if ((cmdBaseWorker.bMagicCardData > 55 && cmdBaseWorker.bMagicCardData < 69 &&  mj.cardData >55 && mj.cardData <69 )||  ( cmdBaseWorker.bMagicCardData > 68 && mj.cardData > 68)) 
        {
            isHuaMagic = true;
        };

        if(mj.cardData == cmdBaseWorker.bMagicCardData || isHuaMagic) //|| mj.cardData == INDEX_REPLACE_CARD)
        {
            // if(mj.cardData == cmdBaseWorker.bMagicCardData)
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
    //设置花牌
    setHuaCard:function()
    {

    },
    //是否花牌 
    isHuaCard:function( cardData  )
    {
        for( var i = 0 ; i < cmdBaseWorker.cbHuaCards.length;i++)
        {
            if (cmdBaseWorker.cbHuaCards[i] == cardData) {
                return true
            };
        }
        return false;
    },
    //////////////////assist function start//////////
    ///////////////cmdEvent start//////////
    updateOnFree:function()
    {
        var users = tableData.getUsersInTable(tableData.getUserWithUserId(selfdwUserID).wTableID)
        if(users.length>=GAME_PLAYER)
        {   
            if(tableData.managerUserID == selfdwUserID)
            {
                tableNode.shareButton.setVisible(false)
            }
        }  

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

        var self = tableData.getUserWithUserId(selfdwUserID)

        if (cmdBaseWorker.cbPlayType == 0  && tableData.createrUserID == selfdwUserID) 
        {
            topUINode.pingCuoSet.setVisible(true)
        }else
            topUINode.pingCuoSet.setVisible(false)


        playNode.onCMD_Ping_Result();
    },
    onCMD_StatusPlay:function() 
    {
        tableNode.setBankerIcon(cmdBaseWorker.wBankerUser, true)
        playNode.isPlaying = true
        if (cmdBaseWorker.cbIsPreStartEnd != 2 && cmdBaseWorker.cbPlayType == 2) { 
            if (cmdBaseWorker.cbDingPengData[tableData.getUserWithUserId(selfdwUserID).wChairID] == 0 ) 
            {topUINode.setNode.setVisible(true)}
            else
            topUINode.setNode.setVisible(false)
            return;
        };
        
        playNode.scoreTTF.setString(cmdBaseWorker.cbLeftCardCount)

        playNode.showLaizi(cmdBaseWorker.bMagicCardData)
        var magicArray = [cmdBaseWorker.bMagicCardData, INDEX_REPLACE_CARD];
        var magicIndex = [0, cmdBaseWorker.bMagicCardData]
        if ((cmdBaseWorker.bMagicCardData > 55 && cmdBaseWorker.bMagicCardData < 69 )) 
        {
            magicArray =[65,66,67,68,INDEX_REPLACE_CARD];
            magicIndex = [0,0,0,0,cmdBaseWorker.bMagicCardData];
        }else if(cmdBaseWorker.bMagicCardData > 68)
        {
            magicArray =[69,70,71,72,INDEX_REPLACE_CARD];
            magicIndex = [0,0,0,0,cmdBaseWorker.bMagicCardData];
        }
 

        majiangFactory.initCardData2ScoreMap(magicArray, magicIndex )

        
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
            playNode.setDingPIcon(i,cmdBaseWorker.cbDingPengData[i] == 2)
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
    
        console.log(6666, handIdxsArray, discardIdxsArray, weaveItemArray)
        playNode.sortHandIdxs(handIdxsArray[0][0]) 
        playNode.sendCardsAction(handIdxsArray, discardIdxsArray, weaveItemArray) 
        playNode.onCMD_Ping_Result();
        //添加花
        for ( var i = 0 ; i < 4;i ++)
        {
            var serverChairid = tableData.getServerChairIdWithShowChairId(i)
            var buhuaUser = tableData.getUserWithChairId(serverChairid)
            buhuaUser.userNodeInsetChair.currentRoundNode.huaMaJiangNode.removeAllChildren()
            var huaMajiangsNode = buhuaUser.userNodeInsetChair.currentRoundNode.huaMaJiangNode
            var direction = i
            var serverChairid = tableData.getServerChairIdWithShowChairId(i)
        
            for ( var j = 0 ; j < MAX_HUA_CARD;j++ )
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
        

        for ( var i = 0 ; i < MAX_HUA_CARD;i++ )
        {
            if ( body.cbHuaCard[i] > 0 )
            {
                if ( body.wReplaceUser == tableData.getUserWithUserId(selfdwUserID).wChairID ) 
                {gameLog.log('补花:' +  body.cbHuaCard[i] )} //提交前删除临时输出
                for( var k = 0;k<MAX_HUA_CARD;k++)
                {
                    if (cmdBaseWorker.cbHuaCardData[body.wReplaceUser][k] == 0) 
                    {
                        cmdBaseWorker.cbHuaCardData[body.wReplaceUser][k] = body.cbHuaCard[i]
                        break;
                    };
                }

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
          for (var i = 0; i < MAX_HUA_CARD; i++)  
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
         //加数字
        var huaNames = []
        huaNames[53] =  ""
        huaNames[54] =  ""
        huaNames[55] =  ""
        huaNames[65] =  "1"
        huaNames[66] =  "2"
        huaNames[67] =  "3"
        huaNames[68] =  "4"
        huaNames[69] =  "1"
        huaNames[70] =  "2"
        huaNames[71] =  "3"
        huaNames[72] =  "4" 
        var text = cc.LabelTTF.create('', "Helvetica", 20)
        if (cardData<=68) {
            text.setFontFillColor( cc.color(0, 0, 0, 255) )
         }else{
            text.setFontFillColor( cc.color(255, 0, 0, 255) )}
       
        text.setString(huaNames[cardData])

        cmdBaseWorker.cbHuaCount = cmdBaseWorker.cbHuaCount + 1;
        var mj = majiangFactory.getOne( cardData, 1, direction, true)
        var rotation = 0;
        var posX = text.width/2;
        var posY = text.height/2
        var scale = direction%2==0?majiangFactory.scale_upDown:majiangFactory.scale_rightLeft
        if (direction == 0) //
        {
            mj.x = mj.getContentSize().width * scale * i
            mj.y = mj.getContentSize().height/2
            rotation = 0
        }
        else if (direction == 1) //
        {
            rotation = -90
            mj.x = mj.getContentSize().width 
            mj.y = mj.getContentSize().height * scale * 0.74 * (i)  - mj.getContentSize().height
            mj.setLocalZOrder( MAX_HUA_CARD + 1 - i )
            posX = mj.width - text.width/2;
            posY = mj.height-text.height/2-4
        }
        else if (direction == 2)//
        {
            rotation = 0;
            mj.x = mj.getContentSize().width * scale * (i)
            mj.y = mj.getContentSize().height/2
        }
        else if (direction == 3) //
        {
            mj.x = mj.getContentSize().width 
            mj.y = mj.getContentSize().height * scale * 0.74 * (i) + mj.getContentSize().height
            mj.setLocalZOrder( MAX_HUA_CARD + 1 - i )
            rotation = 90
            posX = 6;
            posY = mj.height-text.height/2+4
        }

        text.x = posX;
        text.y = posY
        text.setRotation(rotation)
        mj.addChild(text)

        huaMajiangsNode.addChild(mj)
    },
    onCMD_GamePreStart:function()
    {
        topUINode.pingCuoSet.setVisible(false)
        if (cmdBaseWorker.cbPlayType == 0) 
            cmdBaseWorker.cbPlayType = 1;
        if (cmdBaseWorker.cbPlayType == 2) 
            topUINode.setNode.setVisible(cmdBaseWorker.cbDingPengData[tableData.getUserWithUserId(selfdwUserID).wChairID] < 2 )
        tableNode.setBankerIcon(cmdBaseWorker.wBankerUser, true)

        for(var i = 0;i<4;i++)
        {
            playNode.setDingPIcon(i,cmdBaseWorker.cbDingPengData[i] == 2)
        }
        cmdBaseWorker.cbIsPreStartEnd = 2
        for (var i = 0 ;i < 4;i++)
        {
            if (cmdBaseWorker.cbDingPengData[i] < 2 ) 
            {
                cmdBaseWorker.cbIsPreStartEnd = 1 ;
                break;
            };
        }
        if (cmdBaseWorker.cbIsPreStartEnd ==  2 || cmdBaseWorker.cbPlayType == 1 )  playNode.onCMD_GameStart()
        

    },
    onCMD_GameStart:function() 
    {
        
        cocos.clearInterval(playNode.updateOnFree, playNode.node)
        playNode.isPlaying = true

        if(playNode.isLookingResult)
        {
            playNode.resetPlayNode()
        }

        var magicArray = [cmdBaseWorker.bMagicCardData, INDEX_REPLACE_CARD];
        var magicIndex = [0, cmdBaseWorker.bMagicCardData]
        if ((cmdBaseWorker.bMagicCardData > 55 && cmdBaseWorker.bMagicCardData < 69 )) 
        {
            magicArray =[65,66,67,68,INDEX_REPLACE_CARD];
            magicIndex = [0,0,0,0,cmdBaseWorker.bMagicCardData];
        }else if(cmdBaseWorker.bMagicCardData > 68)
        {
            magicArray =[69,70,71,72,INDEX_REPLACE_CARD];
            magicIndex = [0,0,0,0,cmdBaseWorker.bMagicCardData];
        }
 

        majiangFactory.initCardData2ScoreMap(magicArray, magicIndex )

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

        /////
        var sortedActions = majiangLogic.getSortedActionsWithMask(cmdBaseWorker.cbActionMask)
        if(sortedActions.length>0)
            playNode.showActionBtns(null, sortedActions)  //
           
        playNode.actionBtns.setVisible(false)
        playNode.setCurrentRoundNodesVisible(false)
        managerTouch.closeTouch()

        var bankerShowChairid = tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wBankerUser)
        function gameStart()
        {
            playNode.scoreTTF.setString(cmdBaseWorker.cbLeftCardCount)
            playNode.showLaizi(cmdBaseWorker.bMagicCardData)

            playNode.timer.initFenwei( bankerShowChairid )
            playNode.timer.switchTimer([tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wCurrentUser)])
            playNode.timerNode.setVisible(true)

            playNode.actionBtns.setVisible(true)
            playNode.setCurrentRoundNodesVisible(true)
            managerTouch.openTouch()
        }

        function bankerPlayDice()
        {
            
            playNode.playDiceOneDirection(gameStart, getRandNum(1, 6), getRandNum(1, 6), bankerShowChairid)
        }

     
        bankerPlayDice()

        //补花检测
        if (playNode.checkBuHua()) 
        {
            cmdBaseWorker.cbCanSendCard = 1
            mainScene.scene.scheduleOnce(playNode.onUserBuHua, 2.5);
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
        else
        {
            /////
            var sortedActions = majiangLogic.getSortedActionsWithMask(cmdBaseWorker.cbActionMask)
            if(sortedActions.length>0 && currentUser.dwUserID == selfdwUserID)
                playNode.showActionBtns(null, sortedActions)  
        }
        
    },
    onCMD_OperateNotify:function() 
    {
        var sortedActions = majiangLogic.getSortedActionsWithMask(cmdBaseWorker.cbActionMask)
        var idx = cmdBaseWorker.cbProvideCard
        playNode.showActionBtns(idx, sortedActions)
    },
    onCMD_Ping_Result:function()
    {
        if (cmdBaseWorker.cbPlayType == 2) 
            tableNode.pengSetTTF.setString('顶碰')
        else
            tableNode.pengSetTTF.setString('平挫搓')  
    },
    onCMD_OperateResult:function() 
    {
        gameLog.log('操作返回:')
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
        //start
        var direction = tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wOperateUser) 
        var weaveMajiangs = playNode.weaveMajiangs4D[direction]
        
        for(var groupIdx=0;groupIdx<weaveMajiangs.length;groupIdx++)
        {
            
            var group = weaveMajiangs[groupIdx]
            for(var idxInGroup=0;idxInGroup<group.length;idxInGroup++)
            {
                var mj = group[idxInGroup]
                var zi = mj.getChildByTag(101)
                if (zi){
                    for(var k = 0 ;k < zi.getChildren().length;k++)
                    { 
                        var item = zi.getChildren()[k];
                        item.x = zi.width - item.width*0.5
                        item.y = item.height*0.5
                    }
                } 
                  
            }
        }
        //end
        playNode.timer.switchTimer( [tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wCurrentUser)] )
    },
    onCMD_GameEnd:function() 
    {
        playNode.isPlaying = false

        var record = getObjWithStructName('CMD_GR_C_TableHistoryRecordReq') 
        record.szTableKey = tableKey
        socket.sendMessage(MDM_GR_USER, SUB_GR_USER_TABLE_HISTORY_RECORD_REQ, record)

        playNode.isLookingResult = true   
        playNode.hideActionBtns()

        cocos.setInterval(playNode.updateOnFree, 1000, playNode.node)

        var szNickName_gameEnd = []
        var weaveItemArray = [[],[],[],[]]
        var self = tableData.getUserWithUserId(selfdwUserID)
        var selfDir = tableData.getShowChairIdWithServerChairId(self.wChairID)
        if(cmdBaseWorker.endType == 3)
        {
           // var provideDiscardMajiangs = playNode.discardMajiangs4D[tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wProvideUser)]
           // majiangFactory.popDiscardMajiangs(provideDiscardMajiangs)
        }

        for(var i=0;i<GAME_PLAYER;i++)
        {
            var user = tableData.getUserWithChairId(i)
            if(user)
                szNickName_gameEnd[i] = user.szNickName


            //组合牌 
            var direction = tableData.getShowChairIdWithServerChairId(i)
            var weaveItems = cmdBaseWorker.WeaveItemArray[i]

            for(var j=0;j<MAX_WEAVE;j++)
            {
                var t = weaveItems[j].cbCardData
                weaveItems[j].cbCardData = playNode.sortWeaveIdxs(weaveItems[j].cbWeaveKind, t)
                if (weaveItems[j].cbCardData[0] == 0) {weaveItems[j].cbCardData[0] = weaveItems[j].cbCardData[3]};
                weaveItems[j].provideDirection = tableData.getShowChairIdWithServerChairId(weaveItems[j].wProvideUser)
            }
            weaveItemArray[direction] = weaveItems
        }
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
        //
        playNode.weaveMajiangs4D = majiangFactory.getWeaveMajiangsArray(weaveItemArray, selfDir, true)

        for(var i=0;i<4;i++)
        {
            var direction = i
            var chairid = tableData.getServerChairIdWithShowChairId(direction)

            var user = tableData.getUserWithTableIdAndChairId(self.wTableID, chairid)
            var weaveMajiangsNode = user.userNodeInsetChair.currentRoundNode.weaveMajiangsNode
            weaveMajiangsNode.removeAllChildren();
            var weaveMajiangs = playNode.weaveMajiangs4D[direction]
            for(var groupIdx=0;groupIdx<weaveMajiangs.length;groupIdx++)
            {
                var group = weaveMajiangs[groupIdx]
                for(var idxInGroup=0;idxInGroup<group.length;idxInGroup++)
                {
                    var mj = group[idxInGroup]
                    var zi = mj.getChildByTag(101)
                    if (zi){
                        for(var k = 0 ;k < zi.getChildren().length;k++)
                        { 
                            var item = zi.getChildren()[k];
                            item.x = zi.width - item.width*0.5
                            item.y = item.height*0.5
                        }
                    }
                    weaveMajiangsNode.addChild(mj)
                }
            }
        }
        //
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
                // cc.delayTime(5), //¿´ÅÆ5Ãë
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

            var isAllowOut = cmdBaseWorker.wCurrentUser == tableData.getUserWithUserId(selfdwUserID).wChairID

            var mjHeight = majiangFactory.down_handHeight*majiangFactory.scale_upDown
            if(isAllowOut && cmdBaseWorker.cbCanSendCard == 0 )
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

    getHandGroupNodes:function(handMajiangs4D, outCardCalls)
    {
        var handGroupNodes = []
        for(i=0;i<4;i++)//direction 0down 1right 2up 3left
        {
            var direction = i
            var majiangs = handMajiangs4D[i]

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
                var listener = playNode._gethandGroupNodeListener(majiangs, node, direction, outCardCall)
                cc.eventManager.addListener(listener, node)
            }

            handGroupNodes[direction] = node
        }

        return handGroupNodes
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


       if(majiangFactory.outCardMode == 1)
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
            
                if(!currentMajiang || currentMajiang!=touchedMj) 
                {
                    touchedMjNum++
                    if(touchedMjNum>1)
                        playSelectEffect()
                }

                currentMajiang = touchedMj
                currentMajiangTipsNode.x = currentMajiang.x
                mj.getChildByTag(101).setSpriteFrame('mf_' + currentMajiang.cardData + '.png') 
                currentMajiang.y = mjHeight*0.5 + 20
                   
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

                    if(currentMajiang)
                    {
                        if(isTouchFromPop && touchedMjNum==1)
                        {
                            outCardCall?outCardCall(currentPopMajiang):''
                            currentPopMajiang = null
                            isTouchFromPop = false
                            currentMajiang.y = mjHeight*0.5
                        }
                        else
                            currentPopMajiang = currentMajiang
                    }
                    var event = new cc.EventCustom("handMajiangTouchEnd")
                    cc.eventManager.dispatchEvent(event)

                    currentMajiangTipsNode.x = -1000
                    currentMajiang = null
                    touchedMjNum = 0
                }
            })
        }

        return listener
    },
    sendCardsAction:function(handIdxsArray, discardIdxsArray, weaveItemArray)
    {   
        //handIdxsArray = [[[1,2,3,4,5], 1], [[], null], [[], null], [[], null]]  ->[[[1,2,3,4,5], 1], [[], null], [[], null], [[], null]]
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
                    var zi = mj.getChildByTag(101)
                    if(zi){
                        for(var k = 0 ;k < zi.getChildren().length;k++)
                        { 
                            var item = zi.getChildren()[k];
                            item.x = zi.width - item.width*0.5
                            item.y = item.height*0.5
                        }
                    }
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
       /* for(var i=0;i<GAME_PLAYER;i++)
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
*/
        if(cmdBaseWorker.endType == 1 || cmdBaseWorker.endType == 0)
            return 

        //摊牌
        var displayHandIdxsArray = []
        var cbProvideCard = cmdBaseWorker.cbProvideCard

        for(var i=0;i<4;i++)
        {
            var direction = i
            var chairid = tableData.getServerChairIdWithShowChairId(direction)

            displayHandIdxsArray[direction] = [cmdBaseWorker.cbHandCardData[chairid].slice(0, cmdBaseWorker.cbHandCardCount[chairid]), null]

            if(cmdBaseWorker.wWinner[chairid] != WIK_NULL)
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

            playNode.setDingPIcon(i,false)

            if(cmdBaseWorker.endType==0 && i==cmdBaseWorker.wExitUser)
                cbWinFlag[i] = 6
            else 

            if((cmdBaseWorker.endType==2||cmdBaseWorker.endType==3) && cmdBaseWorker.wWinner[i] != WIK_NULL)
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
            var chr_type = 
            [
                CHR_SiFengQuanQi,
                CHR_HunYiSe,
                CHR_QingYiSe,
                CHR_PengPengHu,
                CHR_ZhuoGui,
                CHR_KaoBing,
                CHR_ZI_MO,
                CHR_QianDang,
                CHR_H_D_L_Y,
                CHR_PangHu,
                CHR_WuCaiShen,
                CHR_LiangCaiShen,
                CHR_ZiMoCaiSehn,
                CHR_CSHuanYuan,
                CHR_CSDoubleBack,
                CHR_CaiShenFoot,
                CHR_GangKai,
                CHR_QiangGang,
                CHR_TianHu,
                CHR_DiHu
            ];
            var chr_str = 
            [
                "四风齐全 ",
                "混一色 ",
                "清一色 ",
                "碰碰胡 ",
                "捉鬼 ",
                "靠柄 ",
                "自摸 ",
                "嵌档 ",
                "海底捞月 ",
                "旁胡 ",
                "无财神 ",
                "二财神 ",
                "自摸财神 ",
                "财神归位 ",
                "财神双归位 ",
                "财神脚骨 ",
                "杠开 ",
                "抢杠 ",
                "天胡 ",
                "地胡 "
            ];
           
            var chrStr = "胡型 "
            var isQiang = false;
            var winnerN = 0;
            for(var i = 0;i<GAME_PLAYER;i++)
            {
                if (cmdBaseWorker.dwChiHuKind[i]!=WIK_NULL) 
                {
                    winnerN = i;
                    break;
                };
            }
            gameLog.log('=========胜利玩家' + winnerN)
            for (var i = 0; i < chr_type.length; i++) 
            {
                if (cmdBaseWorker.dwChiHuRight[winnerN] & chr_type[i])
                {
                    chrStr += chr_str[i];
                    if (i ==17 )isQiang = true
                }
            }

            if(chrStr == "胡型 ")
                chrStr = "胡"

            if ( cmdBaseWorker.wLaZi > 0 ) 
                {chrStr = "辣子"};
            
            gameLog.log('*********' + chrStr)
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
            
            if (cmdBaseWorker.cbDingPengData[i]==2) 
                control['ding'+i].setVisible(true)
            else
                control['ding'+i].setVisible(false)


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
            //control['name'+i].setString(scoreStr)
            gameLog.log('*********' + scoreStr)
               //end
            control['name'+i].setString(szNickName_gameEnd[chairid])


             var fNames = []
            fNames[0] = "bankerIcon.png"
            fNames[1] = "img_nan.png"
            fNames[2] = "img_xi.png"
            fNames[3] = "img_bei.png"
            control['banker'+i].setSpriteFrame(fNames[playNode.getUserFeng(chairid)-27])
            control['banker'+i].setVisible(true)
           // control['banker'+i].setVisible(cmdBaseWorker.wBankerUser == chairid)
            if(score>0)
            {
                control['scoreTTF'+i].setString('+' + score)
                control['scoreTTF'+i].color = cc.color(255, 0, 0)
                control['frame'+i].setSpriteFrame('gend5.png')
            }
            else
            {
                control['scoreTTF'+i].setString(score==0?'-'+score:score)
                control['scoreTTF'+i].color = cc.color(0, 255, 0)
                control['frame'+i].setSpriteFrame('gend6.png')

            }
        }

         //显示手牌
         mIndex = 0;
         for(var i=0;i<GAME_PLAYER;i++)
        {
            var chairid = tableData.getServerChairIdWithShowChairId(i)
            playNode.addAPlayerCard(i,control['resultNode'+chairid],isQiang)
        }
        //手牌显示完毕
        node.setPosition( cc.p( mainScene.uiTop.getContentSize().width * 0.5, mainScene.uiTop.getContentSize().height * 0.5) )
        mainScene.top.addChild(node) 
    },
    addAPlayerCard:function(index,cParent,isQiang)
    {
        var direction = index
        var chairid = tableData.getServerChairIdWithShowChairId(direction)
        var user = tableData.getUserWithTableIdAndChairId(self.wTableID, chairid)
        var weaveItems = cmdBaseWorker.WeaveItemArray[chairid]
        
        var cardIndex = -1
        var huaNames = []
        huaNames[53] =  "中"
        huaNames[54] =  "发"
        huaNames[55] =  "白"
        huaNames[65] =  "春"
        huaNames[66] =  "夏"
        huaNames[67] =  "秋"
        huaNames[68] =  "冬"
        huaNames[69] =  "梅"
        huaNames[70] =  "兰"
        huaNames[71] =  "菊"
        huaNames[72] =  "竹"
        
       


       // var fIcon = new cc.Sprite(fNames[playNode.getUserFeng(chairid)-27])
       // fIcon.x = 0*40 +160;
       // fIcon.y = 90*0.5
       // cParent.addChild(fIcon);

        var fanText = cc.LabelTTF.create('', "Helvetica", 24)
        fanText.setFontFillColor( cc.color(255, 0, 36, 255) )
        fanText.setString(cmdBaseWorker.cbIGameFan[chairid] + "番")
        fanText.x = 0*40 +160;
        fanText.y = 90
        cParent.addChild(fanText)

        var huText = cc.LabelTTF.create('', "Helvetica", 24)
        huText.setFontFillColor( cc.color(255, 0, 36, 255) )
        huText.setString(cmdBaseWorker.cbIGameHu[chairid] + "胡")
        huText.x = 1.6*40 +160;
        huText.y = 90
        cParent.addChild(huText)

        for(var i = 0;i<MAX_HUA_CARD;i++)
        {
            if(cmdBaseWorker.cbHuaCardData[chairid][i]>0)
            {
                var huaCards = huaNames[cmdBaseWorker.cbHuaCardData[chairid][i] ]
                var huaText = cc.LabelTTF.create('', "Helvetica", 24)
                if (playNode.isMenFeng(playNode.getUserFeng(chairid),cmdBaseWorker.cbHuaCardData[chairid][i]))
                    huaText.setFontFillColor( cc.color(255, 0, 36, 255) )
                else
                    huaText.setFontFillColor( cc.color(255, 127, 36, 255) )
                huaText.setString(huaCards);
                huaText.x = (i+1+2) * 40 +160
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
            if (cardIdx>0) {
                var aCard
                if (weaveItems[i].cbPublicCard == false && j < 3){
                    aCard = new cc.Sprite('#down_discard0.png')
                    aCard.setScale(0.96)
                }
                else{
                    aCard = majiangFactory.getOne(cardIdx, 1, 0, true)
                    aCard.setScale(1)
                }
                aCard.setLocalZOrder(-1)
                if (weaveItems[i].cbWeaveKind == WIK_GANG && j == 3 ) 
                {
                    cardIndex -=2;
                    aCard.x = 150+( cardIndex+1 )*(aCard.getContentSize().width*aCard.getScale() - 2), aCard.getContentSize().height /2 *aCard.getScale()  
                    aCard.y = 45 +10
                    cardIndex++
                }else{
                    aCard.x = 150+( cardIndex+1 )*(aCard.getContentSize().width*aCard.getScale() - 2), aCard.getContentSize().height /2 *aCard.getScale()  
                    aCard.y = 45
                }
                
              //  if (!(isQiang && cardIdx == cmdBaseWorker.cbProvideCard)) 
                    cParent.addChild(aCard)
                cardIndex++;
            };
        }
        }
        cardIndex += 0.2;
        for(var i = 0;i<MAX_COUNT;i++)
        {
            var cardIdx = cmdBaseWorker.cbHandCardData[chairid][i]
            if (cardIdx>0 ) 
            {

                var aCard = majiangFactory.getOne(cardIdx, 1, 0, true)
                aCard.setScale(1)
                aCard.setLocalZOrder(-1)
                aCard.x = 150+( cardIndex+1 )*(aCard.getContentSize().width*aCard.getScale() - 2), aCard.getContentSize().height /2 *aCard.getScale()  
                aCard.y = 45
                if (cardIdx == cmdBaseWorker.cbEndCard && cmdBaseWorker.cbHandCardCount[chairid] + cmdBaseWorker.cbWeaveCount[chairid]*3 == MAX_COUNT) 
                {
                    cardIndex--
                    cmdBaseWorker.cbHandCardCount[chairid]--;
                    aCard.x = 150+( MAX_COUNT+1.5)*(aCard.getContentSize().width*aCard.getScale() - 2), aCard.getContentSize().height /2 *aCard.getScale()  
                };
                cParent.addChild(aCard)
                cardIndex++;
            };
        }
        
            
        
    },
    isMenFeng:function(cbCardData,cbCurCard)
    {
        var fengWei = cbCardData-27;
        var direction = []
        direction[0] = []
        direction[1] = []
        direction[2] = []
        direction[3] = []
        direction[0][0] =65;
        direction[0][1] =69;
        direction[0][2] =49;

        direction[1][0] =66;
        direction[1][1] =70;
        direction[1][2] =50;

        direction[2][0] =67;
        direction[2][1] =71;
        direction[2][2] =51;

        direction[3][0] =68;
        direction[3][1] =72;
        direction[3][2] =52;

        for (var j = 0;j<3;j++)
        {
            if (direction[fengWei][j] == (cbCurCard) )
            {
                return true;
            }
        }
        return false;
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
    setCurrentDiscardMj:function(idx, direction)
    {
        var self = tableData.getUserWithUserId(selfdwUserID)
        var d = tableData.getShowChairIdWithServerChairId(self.wChairID)
        if(d == direction)
            majiangFactory.hideCurrentDiscardMj()
        else
           majiangFactory.setCurrentDiscardMj(idx, direction)
    },
    showLaizi:function(idx)
    {   
        //
       /* for(var i = 0;i<4;i++)
        {
            var mj = majiangFactory.getOne(0, 1, 0, true)
            var w = playNode.laiziMjNode.width
            var h = playNode.laiziMjNode.height

            //mj.setScaleX(w/mj.width)
           // mj.setScaleY(h/mj.height)
            mj.x = w/2 - (i)*w
            mj.y = h/2
            if (i ==3) 
            {
                mj.x = w/2 - (2)*w
                mj.y = h/2 + 10
            };
            playNode.laiziMjNode.addChild(mj)
        }*/
        //
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
    setDingPIcon:function(wChairID, isShow)
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

        if(user && user.userNodeInsetChair && tableData.isInTable(user.cbUserStatus))
        {
            if(!isShow)
                user.userNodeInsetChair.dingNode.removeAllChildren()
            else
            {
                iconName = '#img_ding_mark.png'
                var bankerIcon = new cc.Sprite( iconName )
                bankerIcon.setAnchorPoint(cc.p(0,1))
                user.userNodeInsetChair.dingNode.addChild(bankerIcon) 
            }
        }


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
        console.log('3333showActionBtns', idx, sortedActions)
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
        var winner =  0;
        for(var i = 0;i<GAME_PLAYER;i++)
        {
            if (cmdBaseWorker.wWinner[i]!=WIK_NULL) 
            {
                winner = i;
                break;
            };
        }

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
        if(isMan)
            managerAudio.playEffect('gameRes/sound/man/' + name + '.mp3')
        else
            managerAudio.playEffect('gameRes/sound/woman/' + name + '.mp3') 
    },
    playAnimationWithDirection:function(name, direction, call)
    {
        if(isOpenEffect!='open')
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
        if(idx == INDEX_REPLACE_CARD)
            idx = cmdBaseWorker.bMagicCardData
        return idx
    }, 
    cai2Bao:function(idx)
    {
        if(idx == cmdBaseWorker.bMagicCardData)
            idx = INDEX_REPLACE_CARD
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
        majiangFactory.sortCardDatasWithScore(idxs, cmdBaseWorker.bMagicCardData)
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

        playDice(3)
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

