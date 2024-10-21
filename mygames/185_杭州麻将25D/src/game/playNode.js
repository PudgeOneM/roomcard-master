
////先理解majiangFactory(components/majiangFactory/majiangFactory)
var playNode = 
{   
    handMajiangs4D:[],//手牌麻将精灵数组 4个方向的
    discardMajiangs4D:[],//丢弃麻将精灵数组 4个方向的
    weaveMajiangs4D:[],//吃碰杠麻将精灵数组 4个方向的
    heapMajiangs4D:[],
    flowerMajiangs4D:[],
    isLookingResult:false,
    isPlaying:false,
    ZhuDongAction:null,
    DELAYTIME:null,

    ///////////////////////init start///////////////////////
    init:function()
    {   
        // userSettingPop.itemShowState[2] = false//[true,true,false]//表示玩家设置中的第三个选择功能无效化
        // isOpenPTH = 1               //强制性修改普通话开关，前提是开关无效
        
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
    onReStart:function()
    {
        playNode.handMajiangs4D = []
        playNode.discardMajiangs4D = []
        playNode.weaveMajiangs4D = []
        playNode.isLookingResult = false
        playNode.isPlaying = false

        cocos.clearInterval(playNode.updateOnFree, playNode.node)
    },
    initCurrentRoundNode:function(currentRoundNode)
    {
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
        currentRoundNode.scoreChange.removeAllChildren()
        currentRoundNode.upTTF.setString('')
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

                //playNode.checkTableCards(callFunName)
            }
        })
        cc.eventManager.addListener(l, 1)
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
            var provideIdx = cmdBaseWorker.cbProvideCardData

            var sendChi = function(sortedOperateIdxs, action)
            {
                var operateIdxs = cmdBaseWorker.sortedOperateIdxs2OperateIdxs(provideIdx, sortedOperateIdxs)
                cmdBaseWorker.sendMessage_chi(operateIdxs, action)
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

        playNode.actionCall_peng = function()
        {
            var btn = playNode.btn_peng
            cmdBaseWorker.sendMessage_peng([cmdBaseWorker.cbProvideCardData, cmdBaseWorker.cbProvideCardData, cmdBaseWorker.cbProvideCardData] )
            playNode.hideActionBtns()
        }

        playNode.actionCall_gang = function()
        {
            playNode.ZhuDongAction = true
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
            alert('actionCall_ting')
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
            cmdBaseWorker.sendMessage_guo([cmdBaseWorker.cbProvideCardData])
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
        playNode.resetPlayNode()

        playNode.isPlaying = true

        tableNode.setBankerIcon(cmdBaseWorker.wBankerUser, true)
        playNode.scoreTTF.setString(cmdBaseWorker.cbLeftCardCount)
        playNode.showLaizi()
        
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


        playNode.timer = majiangTimer4D.getTimer()
        playNode.timer.x = 600
        playNode.timer.y = 434
        playNode.mjsNode.addChild(playNode.timer)

        playNode.timer.initFenwei( tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wBankerUser) )
        playNode.timer.switchTimer(cmdBaseWorker.wCurrentUser==INVALID_WORD?[]:[tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wCurrentUser)])

        var self = tableData.getUserWithUserId(selfdwUserID)
        for(var i=0;i<GAME_PLAYER;i++)
        {
            var user = tableData.getUserWithTableIdAndChairId(self.wTableID, i)
            //user.userNodeInsetChair.currentRoundNode.upTTF.setString( '下跑:'+cmdBaseWorker.cbCallRecord[i][0]+' 加顶:' + cmdBaseWorker.cbCallRecord[i][1] )
        }


        /////吃碰杠胡
        var sortedActions = majiangLogic.getSortedActionsWithMask(cmdBaseWorker.cbActionMask)
        var isActioning = sortedActions.length>0
        if(isActioning)
            playNode.showActionBtns(sortedActions)

        var handIdxsArray = [[[], null], [[], null], [[], null], [[], null]]
        var discardIdxsArray = [[],[],[],[]]
        var weaveItemArray = [[],[],[],[]]

        for(var i=0;i<GAME_PLAYER;i++)
        {
            var isSelf = tableData.getUserWithChairId(i).dwUserID == selfdwUserID
            var direction = tableData.getShowChairIdWithServerChairId(i)
            var weaveItems = cmdBaseWorker.WeaveItemArray[i]
            //组合牌
            for(var j=0;j<MAX_WEAVE;j++)
            {
                var t = weaveItems[j].cbCardData
                weaveItems[j].cbCardData = cmdBaseWorker.sortWeaveIdxs(weaveItems[j].cbWeaveKind, t)

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
                if (isSelf)
                {
                    if (cmdBaseWorker.cbSendCardData == INVALID_CARD_DATA)
                        var newMJ = handIdxs[handIdxs.length-1]
                    else
                        var newMJ = cmdBaseWorker.cbSendCardData
                }
                else
                    var newMJ = 0
                for (var j=0;j<handIdxs.length;j++)
                {
                    if (handIdxs[j] == newMJ)
                    {
                        handIdxs.splice(j,1)
                        handIdxsArray[direction][0] = handIdxs
                        break
                    }
                }
                //handIdxsArray[direction][0] = handIdxs.slice(0, handIdxs.length-1)
                handIdxsArray[direction][1] = newMJ//handIdxs[handIdxs.length-1]
            }
            else
                handIdxsArray[direction][0] = handIdxs

            discardIdxsArray[direction] = cmdBaseWorker.cbDiscardCardData[i].slice(0, cmdBaseWorker.cbDiscardCount[i])
        }
        // console.log(6666, handIdxsArray, discardIdxsArray, weaveItemArray)
        cmdBaseWorker.sortHandIdxs(handIdxsArray[0][0]) 
        // get heapIdxsArray
        //var heapIdxsArray = majiangFactory.getHeapCardDatasArray(cmdBaseWorker.cbHeapCardInfo, cmdBaseWorker.TurnoverCard)
        playNode.sendCardsAction(handIdxsArray, discardIdxsArray, weaveItemArray, [], cmdBaseWorker.cbPlayerFlowerCardData) 

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
        if(!playNode.isPlaying)//有的游戏有call状态
        {
            cocos.clearInterval(playNode.updateOnFree, playNode.node)
            playNode.isPlaying = true

            if(playNode.isLookingResult)
            {
                playNode.resetPlayNode()
            } 
        }

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
        for(var i=0;i<GAME_PLAYER;i++)
        {
            var user = tableData.getUserWithTableIdAndChairId(self.wTableID, i)
            //user.userNodeInsetChair.currentRoundNode.upTTF.setString( '下跑:'+cmdBaseWorker.cbCallRecord[i][0]+' 加顶:' + cmdBaseWorker.cbCallRecord[i][1] )
        }

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
        //var heapIdxsArray = majiangFactory.getHeapCardDatasArray(cmdBaseWorker.cbHeapCardInfo, cmdBaseWorker.TurnoverCard)       
       


        managerTouch.closeTouch() //避免在不知道牌的情况下 把牌打出去

        var bankerShowChairid = tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wBankerUser)
        playNode.timer = majiangTimer4D.getTimer()
        playNode.timer.x = 600
        playNode.timer.y = 434
        playNode.mjsNode.addChild(playNode.timer)
        playNode.timer.initFenwei( bankerShowChairid )

        playNode.sendCardsAction(handIdxsArray, [[],[],[],[]], [[],[],[],[]], [], []) 
        playNode.setCurrentRoundNodesVisible(false)
        playNode.actionNode.setVisible(false)
        playNode.mjsNode.setVisible(false)

        //提前保存可能被破坏的数据  掷骰子是庄家出牌破坏数据 因为可能庄家筛子先出完
        function gameStart()
        {
            playNode.showLaizi()
            playNode.setCurrentRoundNodesVisible(true)
            playNode.actionNode.setVisible(true)
            playNode.mjsNode.setVisible(true)            
            managerTouch.openTouch()
        }

        function bankerPlayDice()
        {
            tableNode.setBankerIcon(cmdBaseWorker.wBankerUser, true)
            var siceNum1 = cmdBaseWorker.Randomnum[0]//getRandNum(Math.max(cmdBaseWorker.cbSiceCount-6, 1), Math.min(cmdBaseWorker.cbSiceCount-1, 6))
            var siceNum2 = cmdBaseWorker.Randomnum[1]//cmdBaseWorker.cbSiceCount - siceNum1
            playNode.playDiceOneDirection(gameStart, siceNum1, siceNum2, bankerShowChairid)
        }

        // if(cmdBaseWorker.bIsRandBanker)
        //     playNode.playDiceForRandBanker(bankerPlayDice, bankerShowChairid)
        // else
            bankerPlayDice()

    },
    onCMD_OutCard:function() 
    {
        //playNode.ZhuDongAction = false
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
                majiangFactory.addHandMajiangsOld(majiangs, outDir, newMj.cardData, playNode.mjsNode)
                majiangFactory.deleteHandMajiangNew(majiangs)
            }
        }
        else
            majiangFactory.deleteHandMajiangs(majiangs, outDir, 0)

        majiangFactory.addDiscardMajiangs(playNode.discardMajiangs4D[outDir], outDir,
            outIdx, playNode.mjsNode)

        //杭州麻将  当出完牌后变为本来的颜色
        // var isSelf = tableData.getUserWithChairId(cmdBaseWorker.wTakeCardUser).dwUserID == selfdwUserID
        var isSelf = cmdBaseWorker.wCurrentUser == tableData.getUserWithUserId(selfdwUserID).wChairID
        var majiang = playNode.handMajiangs4D[outDir]
        //console.log(2323232323,majiangs[0].length)
        for(var id = 0; id<majiang[0].length;id++)
        {
            majiang[0][id].color = cc.color(255,255,255)
        }
        
    
        majiangFactory.setCurrentDiscardMj(playNode.discardMajiangs4D, outDir)

        var sortedActions = majiangLogic.getSortedActionsWithMask(cmdBaseWorker.cbActionMask)
        if(sortedActions.length>0)
            playNode.showActionBtns(sortedActions)
    },
    onCMD_SendCard:function() 
    {
        playNode.ZhuDongAction = false
        if(cmdBaseWorker.cbOutCardCount != 0)
            managerAudio.playEffect('gameRes/sound/sendcard.mp3')

        var isSelf = tableData.getUserWithChairId(cmdBaseWorker.wTakeCardUser).dwUserID == selfdwUserID

        playNode.scoreTTF.setString(cmdBaseWorker.cbLeftCardCount)
        playNode.timer.switchTimer(cmdBaseWorker.wCurrentUser==INVALID_WORD?[]:[tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wCurrentUser)])

        var takeDir =  tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wTakeCardUser)   
        ///////
        
        //杭州麻将  当别人打财神的时候除了摸来的牌，其他牌都变色
        var self = tableData.getUserWithUserId(selfdwUserID).wChairID
        var outDir = tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wProvideUser)
        if ((cmdBaseWorker.MagicAction[cmdBaseWorker.ForbidUserAction[0]] || cmdBaseWorker.MagicAction[cmdBaseWorker.ForbidUserAction[1]]) 
            && (!(cmdBaseWorker.ForbidUserAction[0] == self) || !(cmdBaseWorker.ForbidUserAction[1] == self))
            && (cmdBaseWorker.ForbidUserAction[0] != self || cmdBaseWorker.ForbidUserAction[1] != self)&&isSelf)
        {
            var majiang = playNode.handMajiangs4D[outDir]
            for(var id = 0; id<majiang[0].length;id++)
            {
                majiang[0][id].color = cc.color(180,180,180)
            }
        }
        else if(isSelf)
        {
            var majiang = playNode.handMajiangs4D[outDir]
            for(var id = 0; id<majiang[0].length;id++)
            {
                majiang[0][id].color = cc.color(255,255,255)
            }
        }

        for(var i=0;i<cmdBaseWorker.cbSendCardCount;i++)
        {
            var item = cmdBaseWorker.sendCardArray[i]
            //牌Ï
            var heapMajiangsDir = tableData.getShowChairIdWithServerChairId(item.wHeapDir)  
            //majiangFactory.deleteHeapMajiangs(playNode.heapMajiangs4D[heapMajiangsDir], [item.wHeapPos])
            //手牌
            if(item.cbCardData == SEND_DISCARD_CARD_DATA)//丢弃牌
                continue
            var idx = isSelf?item.cbCardData:0
            majiangFactory.addHandMajiang(playNode.handMajiangs4D[takeDir], takeDir, idx, playNode.mjsNode, playNode.weaveMajiangs4D[takeDir].length)
        }

        /////摸到麻将时有可能出现杠听胡补花
        var sortedActions = majiangLogic.getSortedActionsWithMask(cmdBaseWorker.cbActionMask)
        if(sortedActions.length>0)
        {
            playNode.ZhuDongAction = true
            playNode.showActionBtns(sortedActions)  //自摸杠 idx不确定 需要searchGangIdxs
        }
        // else if (isSelf && sortedActions.length == 0)
        // {
        //     var a = cc.sequence(cc.delayTime(playNode.DELAYTIME), cc.callFunc(function(){
        //         //playNode.Auto_Card(cmdBaseWorker.wProvideUser)
        //         }
        //     ))
        //     playNode.node.runAction(a)
        //     playNode.ZhuDongAction = false
        // }

    },
    onCMD_OperateResult:function() 
    {
        playNode.hideActionBtns()
        majiangFactory.hideCurrentDiscardMj()
        playNode.timer.switchTimer(cmdBaseWorker.wCurrentUser==INVALID_WORD?[]:[tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wCurrentUser)])

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
            majiangFactory.onActionResult(cmdBaseWorker.cbOperateCode, idxs, operateUser, provideUser,
                majiangs4W4D, playNode.mjsNode)

            playNode.playAction(cmdBaseWorker.cbOperateCode, operateUser)
        }

        ///动作后动作 要把wProvideUser cbProvideCardData 归零
        var sortedActions = majiangLogic.getSortedActionsWithMask(cmdBaseWorker.cbActionMask)
        if(sortedActions.length>0)
        {
            cmdBaseWorker.wProvideUser    = cmdBaseWorker.wOperateUser
            //cmdBaseWorker.cbProvideCardData  = INVALID_CARD_DATA
            playNode.showActionBtns(sortedActions)  //吃碰后杠 idx不确定 需要searchGangIdxs
        }
        // else if (sortedActions.length==0)
        // {
        //     var isSelf = tableData.getUserWithChairId(cmdBaseWorker.wTakeCardUser).dwUserID == selfdwUserID
        //     if (!playNode.ZhuDongAction && isSelf)
        //     {
        //         var a = cc.sequence(cc.delayTime(playNode.DELAYTIME), cc.callFunc(function()
        //         {
        //             //playNode.Auto_Card(cmdBaseWorker.wOperateUser)
        //         }
        //         ))
        //         playNode.node.runAction(a)
        //         //playNode.ZhuDongAction = false
        //     }
        // }
        // else
        // {}
    },

    // Auto_Card:function(User)
    // {
    //     var isSelf = cmdBaseWorker.wCurrentUser == tableData.getUserWithUserId(selfdwUserID).wChairID
    //     if (isSelf && (cmdBaseWorker.MagicAction[cmdBaseWorker.ForbidUserAction[0]] || cmdBaseWorker.MagicAction[cmdBaseWorker.ForbidUserAction[1]]) && (!(cmdBaseWorker.ForbidUserAction[0] == User) || !(cmdBaseWorker.ForbidUserAction[1] == User)))
    //     {
    //         // var OutCard = getObjWithStructName('CMD_C_AutoOutCard')
    //         // OutCard.cbOutCardData = cmdBaseWorker.PreviousCard
    //         // OutCard.AUTO_OUT_CARD_USER = cmdBaseWorker.wCurrentUser
    //         // cmdBaseWorker.wCurrentUser = INVALID_WORD
    //         // socket.sendMessage(MDM_GF_GAME,SUB_C_AUTO_OUT_CARD,OutCard)
    //         cmdBaseWorker.wCurrentUser = INVALID_WORD
    //         var OutCard = getObjWithStructName('CMD_C_OutCard')
    //         OutCard.cbOutCardData = cmdBaseWorker.cbProvideCardData
    //         //OutCard.AUTO_OUT_CARD_USER = cmdBaseWorker.wCurrentUser
    //         socket.sendMessage(MDM_GF_GAME,SUB_C_OUT_CARD,OutCard)
    //     }
    // },

    onCMD_GameEnd:function() 
    {
        playNode.gamesetNode.setVisible(false)

        playNode.isPlaying = false

        

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
                userData_gameEnd[i].lScoreInGame = user.lScoreInGame
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
                cc.delayTime(4), //看牌5秒
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
            var record = getObjWithStructName('CMD_GR_C_TableHistoryRecordReq') 
            record.szTableKey = tableKey
            socket.sendMessage(MDM_GR_USER, SUB_GR_USER_TABLE_HISTORY_RECORD_REQ, record)
        }        
    },
    ///////////////cmdEvent end//////////

    ////////////sendCardsAction start//////////
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
    _bindHandMajiangsListener:function()
    {
        var handMajiangs = playNode.handMajiangs4D

        var touchEndCall = function(majiang)
        {
            var direction = 0
            //var isAllowOut = majiang.cardData != cmdBaseWorker.cbMagicCardData && cmdBaseWorker.wCurrentUser == tableData.getUserWithUserId(selfdwUserID).wChairID
            var isAllowOut = !(!MAGIC_CARD_ALLOWOUT && !cmdBaseWorker.isMagicCard(majiang.cardData, cmdBaseWorker.cbMagicCardData) ) && cmdBaseWorker.wCurrentUser == tableData.getUserWithUserId(selfdwUserID).wChairID
            for (var i = 0; i < cmdBaseWorker.ActionChiCardDate.length; i++)
            {
                if (cmdBaseWorker.ActionChiCardDate[i] != INVALID_CARD_DATA && cmdBaseWorker.ActionChiCardDate[i] == majiang.cardData)
                {
                    isAllowOut = false
                    break
                }
            }

            if(isAllowOut)
            {
                cmdBaseWorker.wCurrentUser = INVALID_WORD

                var OutCard = getObjWithStructName('CMD_C_OutCard')
                OutCard.cbOutCardData = majiang.cardData

                socket.sendMessage(MDM_GF_GAME,SUB_C_OUT_CARD,OutCard)
                playNode.hideActionBtns()
            }
        }

        var listener = majiangFactory._gethandMajiangsListener(playNode.handMajiangs4D[0], playNode.mjsNode, touchEndCall)
        var mjsListenerNode = new cc.Node
        mjsListenerNode.width = playNode.mjsNode.width
        mjsListenerNode.height = playNode.mjsNode.height
        playNode.mjsNode.addChild(mjsListenerNode)
        cc.eventManager.addListener(listener, mjsListenerNode)
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

        playNode._bindHandMajiangsListener()

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
    ////////////sendCardsAction end//////////


    ////////////gameend start//////////
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
                majiangFactory.updateMajiang(mj, pos)
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
                    // if(chrStr == '')
                    //     chrStr += '胡型：'
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

            if( cmdBaseWorker.dwChiHuKind[wChairID] == WIK_CHI_HU
                && cmdBaseWorker.cbProvideCardData != INVALID_CARD_DATA )
                newGetCardData = cmdBaseWorker.cbProvideCardData 
            else if(oldHandCardDatas.length + weaveLen*3 == MAX_COUNT)//流局 强退
            {
               newGetCardData = oldHandCardDatas.splice(oldHandCardDatas.length-1, 1)[0]
            }

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
                control['winflag'+wChairID].setSpriteFrame('gendFlag2.png') 
            else
                control['winflag'+wChairID].setSpriteFrame('empty.png') 
  

            control['taiTTF'+wChairID].setString(userData_gameEnd[wChairID].lScoreInGame) 
            control['fenTTF'+wChairID].setString((cmdBaseWorker.lGameScore[wChairID]>0?'+':'') + cmdBaseWorker.lGameScore[wChairID]) 

        }
       
        mainScene.top.addChild(node) 
    },


    // popGameEnd:function(continueCall, szNickName_gameEnd)
    // {
    //     var cbWinFlag = []
    //     for(var i=0;i<GAME_PLAYER;i++)
    //     {
    //         if(cmdBaseWorker.endType==0 && i==cmdBaseWorker.wExitUser)
    //             cbWinFlag[i] = 6
    //         else 

    //         if((cmdBaseWorker.endType==2||cmdBaseWorker.endType==3) && cmdBaseWorker.wWinner == i)
    //             cbWinFlag[i] = 7

    //         if(cmdBaseWorker.endType==3 && cmdBaseWorker.wProvideUser==i)
    //             cbWinFlag[i] = 8
    //     }

    //     var control = {}
    //     control.continueCall = function()
    //     {
    //         continueCall()
    //         node.removeFromParent()
    //     }
    //     var node  = cc.BuilderReader.load(resp.gameEndPopCCB, control)

    //     playNode.gameEndControl = control

    //     // control.resultTTF.setString( args.msg )
    //     if(cmdBaseWorker.endType == 1 || cmdBaseWorker.endType == 0)
    //     {
    //         if(cmdBaseWorker.endType == 1)
    //             control.endType.setSpriteFrame('gendType'+cmdBaseWorker.endType + '.png')
    //         else
    //             control.endType.setVisible(false)

    //         control.resultTTF.setVisible(false)
    //     }
    //     else
    //     {
    //         control.resultTTF.setVisible(true)
    //         var chrStr = "胡型："
    //         for (var i = 0; i < map_mask2Name.length; i++) 
    //         {
    //             var chr_type = window[ map_mask2Name[i][0] ] 
    //             if (cmdBaseWorker.dwChiHuRight[cmdBaseWorker.wWinner] & chr_type)
    //             {
    //                 chrStr += map_mask2Name[i][1] + ' ';
    //             }
    //         }
    //         if (cmdBaseWorker.IsFeng != INVALID_CARD_DATA)
    //             chrStr += "风牌*️" + cmdBaseWorker.IsFeng + ' '
    //         if (cmdBaseWorker.GangNum != 0)
    //             chrStr += "杠*" + cmdBaseWorker.GangNum + ' '
    //         control.resultTTF.setString(chrStr)
    //         control.endType.setVisible(false)
    //     }

    //     for(var i=0;i<GAME_PLAYER;i++)
    //     {
    //         var chairid = i
    //         if(typeof(cbWinFlag[i])!='undefined')
    //         {
    //             control['winflag'+i].setVisible(true)
    //             control['winflag'+i].setSpriteFrame('winFlag_' + cbWinFlag[i] + '.png') 
    //         }
    //         else
    //             control['winflag'+i].setVisible(false)
            
    //         var score = cmdBaseWorker.lGameScore[chairid]
    //         control['name'+i].setString(szNickName_gameEnd[chairid].szNickName)
    //         control['banker'+i].setVisible(cmdBaseWorker.wBankerUser == chairid)
    //         if(score>0)
    //         {
    //             control['scoreTTF'+i].setString('+' + score)
    //             control['scoreTTF'+i].color = cc.color(255, 0, 0)
    //           //  control['scoreTTF'+i].setFontFillColor( cc.color(255, 0, 0, 255) )
    //             control['frame'+i].setSpriteFrame('gend5.png')
    //         }
    //         else
    //         {
    //             control['scoreTTF'+i].setString(score==0?'-'+score:score)
    //             control['scoreTTF'+i].color = cc.color(0, 255, 0)
    //             //control['scoreTTF'+i].setFontFillColor( cc.color(0, 255, 0, 255) )
    //             control['frame'+i].setSpriteFrame('gend6.png')

    //         }
    //     }

    //     node.setPosition( cc.p( mainScene.uiTop.getContentSize().width * 0.5, mainScene.uiTop.getContentSize().height * 0.5) )
    //     mainScene.top.addChild(node) 
    // },
    // popGameEnd2:function(continueCall, szNickName_gameEnd)
    // {
    //     var cbWinFlag = []
    //     for(var i=0;i<GAME_PLAYER;i++)
    //     {
    //         if(cmdBaseWorker.endType==0 && i==cmdBaseWorker.wExitUser)
    //             cbWinFlag[i] = 6
    //         else 

    //         if((cmdBaseWorker.endType==2||cmdBaseWorker.endType==3) && cmdBaseWorker.wWinner == i)
    //             cbWinFlag[i] = 7

    //         if(cmdBaseWorker.endType==3 && cmdBaseWorker.wProvideUser==i)
    //             cbWinFlag[i] = 8
    //     }

    //     var control = {}
    //     control.continueCall = function()
    //     {
    //         continueCall()
    //         node.removeFromParent()
    //     }
    //     var node  = cc.BuilderReader.load(resp.gameEndPopCCB, control)

    //     playNode.gameEndControl = control

    //     // control.resultTTF.setString( args.msg )
    //     if(cmdBaseWorker.endType == 1 || cmdBaseWorker.endType == 0)
    //     {
    //         if(cmdBaseWorker.endType == 1)
    //             control.endType.setSpriteFrame('gendType'+cmdBaseWorker.endType + '.png')
    //         else
    //             control.endType.setVisible(false)

    //         control.resultTTF.setVisible(false)
    //     }
    //     else
    //     {
    //         control.resultTTF.setVisible(true)
    //         var chrStr = "胡型："
    //         for (var i = 0; i < map_mask2Name.length; i++) 
    //         {
    //             var chr_type = window[ map_mask2Name[i][0] ] 
    //             if (cmdBaseWorker.dwChiHuRight[cmdBaseWorker.wWinner] & chr_type)
    //             {
    //                 chrStr += map_mask2Name[i][1] + ' ';
    //             }
    //         }
    //         control.resultTTF.setString(chrStr)
    //         control.endType.setVisible(false)
    //     }

    //     for(var i=0;i<GAME_PLAYER;i++)
    //     {

    //         var chairid = i
    //         if(typeof(cbWinFlag[chairid])!='undefined')
    //         {
    //             control['winflag'+chairid].setVisible(true)
    //             control['winflag'+chairid].setSpriteFrame('winFlag_' + cbWinFlag[chairid] + '.png') 
    //         }
    //         else
    //             control['winflag'+chairid].setVisible(false)
            
    //         var score = cmdBaseWorker.lGameScore[chairid]
    //         control['name'+chairid].setString(szNickName_gameEnd[chairid])
    //         control['banker'+chairid].setVisible(cmdBaseWorker.wBankerUser == chairid)
    //         if(score>0)
    //         {
    //             control['scoreTTF'+chairid].setString('+' + score)
    //             control['scoreTTF'+chairid].color = cc.color(255, 0, 0)
    //           //  control['scoreTTF'+chairid].setFontFillColor( cc.color(255, 0, 0, 255) )
    //             control['frame'+chairid].setSpriteFrame('gend5.png')
    //         }
    //         else
    //         {
    //             control['scoreTTF'+chairid].setString(score==0?'-'+score:score)
    //             control['scoreTTF'+chairid].color = cc.color(0, 255, 0)
    //             //control['scoreTTF'+chairid].setFontFillColor( cc.color(0, 255, 0, 255) )
    //             control['frame'+chairid].setSpriteFrame('gend6.png')

    //         }
    //     }

    //     //显示手牌
    //     // bool isQiangGang = cmdBaseWorker.dwChiHuRight[cmdBaseWorker.wWinner] & CHR_QiangGang
    //     for(var chairid=0;chairid<GAME_PLAYER;chairid++)
    //     {
    //         var cParent = control['resultNode'+chairid]
    //         var weaveItems = cmdBaseWorker.WeaveItemArray[chairid]

    //         var cardIndex = -1
    //         for(var i = 0;i<MAX_WEAVE;i++)
    //         {
    //             for(var j = 0;j<4;j++)
    //             {
    //                 if(weaveItems.length == 0)
    //                     continue

    //                 if (j == 0 ) cardIndex+=0.3
    //                 var cardIdx = weaveItems[i].cbCardData[j]
    //                 if (cardIdx>0) 
    //                 {
    //                     var aCard
    //                     if (weaveItems[i].cbPublicCard == false && j < 3)
    //                     {
    //                         aCard = new cc.Sprite('#down_discard0.png')
    //                         aCard.setScale(0.96)
    //                     }
    //                     else
    //                     {
    //                         aCard = majiangFactory.getOne(cardIdx, 1, 0, true)
    //                         aCard.setScale(1)
    //                     }
    //                     aCard.setLocalZOrder(-1)
    //                     if (weaveItems[i].cbWeaveKind == WIK_GANG && j == 3 ) 
    //                     {
    //                         cardIndex -=2;
    //                         aCard.x = 150+( cardIndex+1 )*(aCard.getContentSize().width*aCard.getScale() - 2), aCard.getContentSize().height /2 *aCard.getScale()  
    //                         aCard.y = 45 +10
    //                         cardIndex++
    //                     }
    //                     else
    //                     {
    //                         aCard.x = 150+( cardIndex+1 )*(aCard.getContentSize().width*aCard.getScale() - 2), aCard.getContentSize().height /2 *aCard.getScale()  
    //                         aCard.y = 45
    //                     }
                        
    //                     cParent.addChild(aCard)
    //                     cardIndex++;
    //                 }
    //             }
    //         }
    //         cardIndex += 0.2
    //         for(var i = 0;i<MAX_COUNT;i++)
    //         {
    //             var cardIdx = cmdBaseWorker.cbHandCardData[chairid][i]
    //             if (cardIdx>0 ) 
    //             {
    //                 var aCard = majiangFactory.getOne(cardIdx, 1, 0, true)
    //                 aCard.setScale(1)
    //                 aCard.setLocalZOrder(-1)
    //                 aCard.x = 150+( cardIndex+1 )*(aCard.getContentSize().width*aCard.getScale() - 2), aCard.getContentSize().height /2 *aCard.getScale()  
    //                 aCard.y = 45
    //                 if (cardIdx == cmdBaseWorker.cbProvideCard && cmdBaseWorker.cbHandCardCount[chairid] + cmdBaseWorker.cbWeaveCount[chairid]*3 == MAX_COUNT) 
    //                 {
    //                     cardIndex--
    //                     cmdBaseWorker.cbHandCardCount[chairid]--;
    //                     aCard.x = 150+( MAX_COUNT+1.5)*(aCard.getContentSize().width*aCard.getScale() - 2), aCard.getContentSize().height /2 *aCard.getScale()  
    //                 }
    //                 cParent.addChild(aCard)
    //                 cardIndex++
    //             }
    //         }
    //     }

    //     node.setPosition( cc.p( mainScene.uiTop.getContentSize().width * 0.5, mainScene.uiTop.getContentSize().height * 0.5) )
    //     mainScene.top.addChild(node) 
    // },
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
    showLaizi:function()
    {
        playNode.laiziNode.setScale(0.5)


        // for(var i=0;i<TURNOVER_COUNT_MAGIC;i++)
        // {
        //     var cardData = cmdBaseWorker.cbMagicCardData[0]//cmdBaseWorker.TurnoverCard[i].cbCardData
        //     if(cardData == 0)
        //         continue
        //     // var bg = new cc.Sprite('#bg_top.png')
        //     // bg.x = 50*i + 25
        //     // bg.y = - 30

        //     var where = {}
        //     where.name = 'weave'
        //     where.data = {weaveIdx:1, idxInWeave:2}
        //     var mj = majiangFactory.getOne(cardData, 2, where)
        //     mj.isIgnoreDecorate = true
        //     playNode.laiziNode.addChild(mj)
        // }




        // for(var i=0;i<TURNOVER_COUNT_MAGIC;i++)
        // {
        //     var idx = cmdBaseWorker.cbMagicCardData[0]//cmdBaseWorker.TurnoverCard[i].cbCardData
        //     if(idx == INVALID_CARD_DATA)
        //         continue
        //     var bg = new cc.Sprite('#bg_top.png')
        //     bg.x = 50*i + 25
        //     bg.y = - 30
        //     var mj = majiangFactory.getOne(idx, 1, 0, true)
        //     mj.x = 50*i + 25
        //     mj.y = - 30
        //     mj.setScaleX(bg.width/mj.width*0.8)
        //     mj.setScaleY(bg.height/mj.height*0.8)

        //     playNode.laiziNode.addChild(bg)
        //     playNode.laiziNode.addChild(mj)
        // }
    },
    hideLaizi:function()
    {
        playNode.laiziNode.removeAllChildren()
    },
    playAction:function(WIK, user)
    {
        if(cmdBaseWorker.cbOutCardCount == 0 && WIK == WIK_REPLACE)
            return;

        var name = typeof(WIK)=='number'?majiangLogic.wik2Name(WIK):WIK
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
                    if(cmdBaseWorker.isFlowerCard(handIdxs[j], cmdBaseWorker.cbFlowerCardData))
                        operateCards[operateCards.length] = handIdxs[j]

                } 
                cmdBaseWorker.sendMessage_replace(operateCards)
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
            else if(action == WIK_LEFT || action == WIK_CENTER || action == WIK_RIGHT)
            {
                btn = playNode.btn_chi
                btn.actions = sortedActions.slice(0, i+1)
            }

            btn.setVisible(true)
            btn.setPositionX(-130 * (sortedActions.length-1-i +1))
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
            if (cmdBaseWorker.type_hu != 0)
            {
                var type = 'hu' + cmdBaseWorker.type_hu
                playNode.playAnimationWithDirection('zim', tableData.getShowChairIdWithServerChairId(winner), call)
                playNode.playGenderEffect(type, tableData.getUserWithChairId(winner).cbGender)
            }
            else
            {
                playNode.playAnimationWithDirection('zim', tableData.getShowChairIdWithServerChairId(winner), call)
                playNode.playGenderEffect('zimo0', tableData.getUserWithChairId(winner).cbGender)
            }
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
        playNode.hideLaizi()
    },
    checkTableCards:function(des)
    {   
        //---------------------
        //注意：要换行的用逗号
        //---------------------
        
        var self = this

        var selfUser = tableData.getUserWithUserId(selfdwUserID)
        if( selfUser.cbUserStatus != US_PLAYING )
            return

        var bReset = des == 'onCMD_StatusPlay'
        var bStart = des == 'onCMD_GameStart'

        //上个记录
        if ( !this.tableCardInfo || bStart )
            this.tableCardInfo = {cardInfo:[], des:'', totalCount:0, leftCount:0, bServerError:false}
        
        var errorStr = '牌桌数据出错：tableId=' + tableData.tableID + ';selfdwUserID=' + selfdwUserID + '; selfChairId=' + selfUser.wChairID + ','
        if ( this.tableCardInfo.bServerError )
        {
            errorStr += '服务器数据异常, 不再处理'
            gameLog.log(errorStr)
            return
        }

        var cardInfo = []
        var pushCard = function(wChairID, cardData, src, groupIndex, index)
        {
            if ( cardData <= 0 )
                return

            var srcStr = src + '_' + wChairID + '_' + groupIndex
            if ( index )
                srcStr += '_' + index

            if ( cardInfo[cardData] )
            {
                cardInfo[cardData].count++
                cardInfo[cardData].src += ';' + srcStr
            }
            else
            {
                cardInfo[cardData] = { count:1, src:srcStr }
            }
        }

        var pushGroup = function(wChairID, group, src)
        {
            if ( !group )
                return

            for( var j = 0; j < group.length; j++ )
            {
                if ( !group[j] )
                    continue 

                if ( cc.isArray(group[j]) )
                {
                    for ( var n = 0; n < group[j].length; n++ )
                    {
                        pushCard(wChairID, group[j][n].cardData, src, j, n)
                        totalCount++
                    }

                    //杠牌多丢一张
                    if (group[j].cbWeaveKind && group[j].cbWeaveKind == WIK_GANG)
                        totalCount++
                }
                else
                {
                    pushCard(wChairID, group[j].cardData, src, j)
                    totalCount++
                }
            }
        }

        var totalCount = 0
        for ( var i = 0; i < GAME_PLAYER; i++ )
        {
            pushGroup(i, this.flowerMajiangs4D[i],  'flower')
            pushGroup(i, this.heapMajiangs4D[i],    'heap')
            pushGroup(i, this.discardMajiangs4D[i], 'discard')
            pushGroup(i, this.weaveMajiangs4D[i],   'weave')

            if ( this.handMajiangs4D[i] )
            {
                pushGroup(i, this.handMajiangs4D[i][0],     'hand[0]')
                pushGroup(i, [this.handMajiangs4D[i][1]],   'hand[1]')
            }
        }

        var bError = false
        errorStr += 'des=' + des + ';'

        for ( var i = 0; i < cardInfo.length; i++ )
        {
            if ( !cardInfo[i] )
                continue

            if ( cardInfo[i].count > 4 )
            {
                errorStr += '本次记录:cardData=' + i + '; count=' + cardInfo[i].count + '; src=' + cardInfo[i].src + ','
                if ( this.tableCardInfo.cardInfo[i] )
                    errorStr += '上次记录：des=' + this.tableCardInfo.des + '; count=' + this.tableCardInfo.cardInfo[i].count + '; src=' + this.tableCardInfo.cardInfo[i].src + ','

                bError = true
            }
        }

        //当前的杠不加，丢牌是发牌时候丢的
        if ( des == 'onCMD_OperateResult' && cmdBaseWorker.cbOperateCode == WIK_GANG )
            totalCount--

        if ( totalCount + cmdBaseWorker.cbLeftCardCount != MAX_REPERTORY )
        {
            errorStr += '牌数不对：totalCount=' + totalCount + ',leftCount=' + cmdBaseWorker.cbLeftCardCount + ',MAX_REPERTORY=' + MAX_REPERTORY + ','
            errorStr += '上次记录：totalCount=' + this.tableCardInfo.totalCount + ',leftCount=' + this.tableCardInfo.leftCount + ','

            bError = true
        }

        var sendLog = function(msg)
        {
            var writeCards = function(wChairID, group, groupName)
            {
                if ( !group )
                    return

                msg += groupName + '_' + wChairID + ':'
                for( var j = 0; j < group.length; j++ )
                {
                    if ( !group[j] )
                        continue 

                    if ( cc.isArray(group[j]) )
                    {
                        for ( var n = 0; n < group[j].length; n++ )
                        {
                            msg += group[j][n].cardData + ';'
                        }

                        msg += '  '
                    }
                    else
                    {
                        msg += group[j].cardData + ';'
                    }
                }

                msg += ','
            }

            for ( var i = 0; i < GAME_PLAYER; i++ )
            {
                writeCards(i, self.flowerMajiangs4D[i],  'flower')
                writeCards(i, self.heapMajiangs4D[i],    'heap')
                writeCards(i, self.discardMajiangs4D[i], 'discard')
                writeCards(i, self.weaveMajiangs4D[i],   'weave')

                if ( self.handMajiangs4D[i] )
                {
                    writeCards(i, self.handMajiangs4D[i][0],     'hand[0]')
                    writeCards(i, [self.handMajiangs4D[i][1]],   'hand[1]')
                }
            }

            msg += "本次记录的所有牌:," 
            for ( var i = 0; i < cardInfo.length; i++ )
            {
                if ( !cardInfo[i] )
                    continue

                msg += 'cardData=' + i + '; count=' + cardInfo[i].count + '; src=' + cardInfo[i].src + ','
            }

            msg += ",上次记录的所有牌:," 
            for ( var i = 0; i < self.tableCardInfo.cardInfo.length; i++ )
            {
                if ( !self.tableCardInfo.cardInfo[i] )
                    continue

                msg += 'cardData=' + i + '; count=' + self.tableCardInfo.cardInfo[i].count + '; src=' + self.tableCardInfo.cardInfo[i].src + ','
            }

            msg += "cmdBaseWorker = " 
            a = clone(cmdBaseWorker)
            for(var ii in a)
            {   
                if(typeof(a[ii]) == 'object')
                    a[ii] = xToString(a[ii], 300)
            }

            msg += xToString(a, null,['"\\\\u0000","\\\\u0000"', '\\\\u0000','null,null,'])

            gameLog.log(msg)

            playNode.checkTableIndex = playNode.checkTableIndex || 0
            sendLogToServer(msg + ',wtms' + KIND_ID + ' v2 ' + selfdwUserID + ' ' + playNode.checkTableIndex + ' wtms')
            playNode.checkTableIndex++
        }

        //数据出错，重置牌桌
        if ( bError )
        {
            if ( bReset )
            {
                errorStr += '服务器数据异常,'
                if ( !this.tableCardInfo.bServerError )
                    sendLog(errorStr)

                this.tableCardInfo.bServerError = true
            }
            
            //重置牌桌(服务器出错不再处理)
            if ( !this.tableCardInfo.bServerError )
            {
                sendLog(errorStr)

                socket.sendMessage(MDM_GF_GAME,888)
            }
        }

        this.tableCardInfo.cardInfo = cardInfo
        this.tableCardInfo.des = des
        this.tableCardInfo.totalCount = totalCount
        this.tableCardInfo.leftCount = cmdBaseWorker.cbLeftCardCount
    },

}

