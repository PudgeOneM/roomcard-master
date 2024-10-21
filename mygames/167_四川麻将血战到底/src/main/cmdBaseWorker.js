
var cmdBaseWorker = 
{   
    lCellScore:null,
    stWinType:null,
    bHaveSetType:false,
    //user变量
    wBankerUser:INVALID_WORD,
    wCurrentUser:INVALID_WORD,//当前需要出牌的玩家 m_wCurrentUser =INVALID_CHAIR时表示没人能出牌 在吃碰杠状态
    wResumeUser:INVALID_WORD, //用于如果所有人都‘过’时发牌
    wOutCardUser:INVALID_WORD,
    wProvideUser:INVALID_WORD,
    wTakeCardUser:INVALID_WORD,
    wOperateUser:INVALID_WORD,
    wVideoUser:INVALID_WORD,

    //cardData变量
    cbOutCardData:null,
    cbProvideCardData:null,
    cbMagicCardData:[],
    cbOutCardCount:0,

    //手牌 丢弃牌 动作牌 花牌
    cbHandCardCount:null,
    cbHandCardData:null,
    cbDiscardCount:null,
    cbDiscardCardData:null,
    cbWeaveCount:null,
    WeaveItemArray:null,

    cbOperatePlayerHandCardCount:null,
    //库存相关
    cbLeftCardCount:null,

    //牌堆相关
    wHeapHead:null,
    wHeapTail:null,
    cbHeapCardInfo:null,

    //发牌
    cbSendCardCount:null,
    sendCardArray:null,

    //用于处理用户动作 服务器会把所有玩家选择的动作记录下来 然后把成功执行的动作返回 
    cbActionMask:null,
    cbOperateCode:null,
    cbOperateCardCount:0,
    cbOperateCardData:null,

    //用于客户端显示的辅助数据
    bIsRandBanker:null,
    dwChiHuKind:null,
    dwChiHuRight:null,
    lGameScore:null,
    lPigScore:null,
    lChaJiao:null, 
    lBuChaJia:null,
    lTuiShui:null, 
    wWinner:null,
    isEndGame:null,
    wFan:null,
    endType:null,
    cbGameHuType:[],
    cbWinCardData:[],
    cbWinnerOrder:[],
    lGangScore:[],
    wExitUser:INVALID_WORD,
    cbChangeCard:null,
    isinitChangeCards:false,
    cbChangeCardSel:[],
    cbOperateChangeSelUser:INVALID_CHAIR,

    //其他
    cbCallRecord:[],
    isUserSelChange:[],
    cbHaveWinUser:null,
    cbHaveWinCard:null,
    cbSiceCount:null,
    TurnoverCard:null,
    cbChengBaoUser:null,
    isHaveShowSelCard:false,
    bFinishChangeCards:true,
    isSelChange:false,
    init:function()
    {   
        for(var i=0;i<GAME_PLAYER;i++)
        {
            cmdBaseWorker.isUserSelChange[i] = 0
            cmdBaseWorker.cbCallRecord[i]  = INVALID_BYTE
            if (cmdBaseWorker.cbHaveWinUser != null)
                cmdBaseWorker.cbHaveWinUser[i] = 0
            if (cmdBaseWorker.cbHaveWinCard != null)
                cmdBaseWorker.cbHaveWinCard[i] = 0
        }
    },
    onReStart:function()
    {
        cmdBaseWorker.wBankerUser       = INVALID_WORD
        cmdBaseWorker.wTakeCardUser     = INVALID_WORD
        cmdBaseWorker.wCurrentUser      = INVALID_WORD//当前需要出牌的玩家 m_wCurrentUser=INVALID_CHAIR时表示没人能出牌 在吃碰杠状态
        cmdBaseWorker.wOutCardUser      = INVALID_WORD
        cmdBaseWorker.cbMagicCardData   = []
        cmdBaseWorker.wResumeUser       = INVALID_WORD //用于如果所有人都‘过’时发牌
        cmdBaseWorker.wOperateUser      = INVALID_WORD
        cmdBaseWorker.wProvideUser      = INVALID_WORD
        cmdBaseWorker.wExitUser         = INVALID_WORD
        cmdBaseWorker.wVideoUser        = INVALID_WORD
        cmdBaseWorker.isEndGame         = 0
        cmdBaseWorker.wFan              = 0
        cmdBaseWorker.cbOutCardCount    = 0 
        cmdBaseWorker.cbOperatePlayerHandCardCount  = 0
        cmdBaseWorker.cbChengBaoUser    = null
        cmdBaseWorker.isHaveShowSelCard = false
        cmdBaseWorker.lGameScore        = []
        cmdBaseWorker.lGangScore        = []
        cmdBaseWorker.cbGameHuType      = []
        cmdBaseWorker.cbWinCardData     = []
        cmdBaseWorker.cbWinnerOrder     = []
        cmdBaseWorker.lPigScore         = []
        cmdBaseWorker.lChaJiao          = []
        cmdBaseWorker.lBuChaJia         = []
        cmdBaseWorker.lTuiShui          = []
        cmdBaseWorker.cbChangeCard      = null
        cmdBaseWorker.cbChangeCardSel   = []
        cmdBaseWorker.cbOperateChangeSelUser = INVALID_CHAIR
        cmdBaseWorker.isinitChangeCards = false
        cmdBaseWorker.bFinishChangeCards= true
        cmdBaseWorker.isSelChange       = false
        for(var i=0;i<GAME_PLAYER;i++)
        {
            cmdBaseWorker.isUserSelChange[i] = 0
            cmdBaseWorker.cbCallRecord[i]  = INVALID_BYTE
            if (cmdBaseWorker.cbHaveWinUser != null)
                cmdBaseWorker.cbHaveWinUser[i] = 0
            if (cmdBaseWorker.cbHaveWinCard != null)
                cmdBaseWorker.cbHaveWinCard[i] = 0
        }
    },
    onCMD_StatusFree:function(body) 
    {
        typeSelNode.haveSetGameType = false
        cmdBaseWorker.lCellScore = body.lCellScore
        if (isEnterFromLogin != true)
            cmdBaseWorker.onListerMenuShare()
        cmdBaseWorker.stWinType   = body.stWinType
        cmdBaseWorker.bHaveSetType = body.bHaveSetType
    },
    onCMD_StatusCall:function(body) 
    {
        // cmdBaseWorker.lCellScore = body.lCellScore
        // cmdBaseWorker.wBankerUser     = tableData.getUserWithUserId(body.dwBankerUserId).wChairID   
        // cmdBaseWorker.cbCallRecord = body.cbCallRecord
    },
    onCMD_StatusPlay:function(body) 
    {	
        cmdBaseWorker.cbActionMask    = body.cbActionMask   
        cmdBaseWorker.wProvideUser    = body.wProvideUser   
        cmdBaseWorker.cbProvideCardData = body.cbProvideCardData   
        cmdBaseWorker.wBankerUser     = tableData.getUserWithUserId(body.dwBankerUserId).wChairID   
        cmdBaseWorker.lCellScore      = body.lCellScore      
        cmdBaseWorker.wCurrentUser    = body.wCurrentUser    
        cmdBaseWorker.cbLeftCardCount = body.cbLeftCardCount 
        cmdBaseWorker.wOutCardUser    = body.wOutCardUser    
        cmdBaseWorker.cbOutCardData   = body.cbOutCardData   
        cmdBaseWorker.cbDiscardCount  = body.cbDiscardCount  
        cmdBaseWorker.cbDiscardCardData = body.cbDiscardCardData   
        cmdBaseWorker.cbHandCardCount = body.cbHandCardCount     
        cmdBaseWorker.cbHandCardData = [[],[],[],[]]
        for(var i=0;i<GAME_PLAYER;i++)
        {
            var isSelf = tableData.getUserWithUserId(selfdwUserID).wChairID == i

            for(var j=0;j<cmdBaseWorker.cbHandCardCount[i];j++)
            {
                cmdBaseWorker.cbHandCardData[i][j] = isSelf?body.cbHandCardData[j]:0
            }
        }

        cmdBaseWorker.stWinType   = body.stWinType
        cmdBaseWorker.bHaveSetType = body.bHaveSetType
        cmdBaseWorker.cbWeaveCount  = body.cbWeaveCount    
        cmdBaseWorker.WeaveItemArray= body.WeaveItemArray  
        cmdBaseWorker.cbMagicCardData  = body.cbMagicCardData  
        cmdBaseWorker.wHeapHead     = body.wHeapHead   
        cmdBaseWorker.wHeapTail     = body.wHeapTail   
        cmdBaseWorker.cbHeapCardInfo= body.cbHeapCardInfo   
        cmdBaseWorker.TurnoverCard  = body.TurnoverCard   
        cmdBaseWorker.cbCallRecord  = body.cbCallRecord  
        cmdBaseWorker.cbHaveWinUser = body.cbHaveWinUser
        cmdBaseWorker.cbHaveWinCard = body.cbHaveWinCard

        cmdBaseWorker.bFinishChangeCards= body.bFinishChangeCards
        cmdBaseWorker.isSelChange       = body.isSelChange
        cmdBaseWorker.isUserSelChange   = body.isUserSelChange
        cmdBaseWorker.cbChangeCard      = body.stChangeCard

        cmdBaseWorker.cbWinnerOrder   = body.cbWinnerOrder  

        //格式化数据 把0过滤掉
        for(var i=0;i<GAME_PLAYER;i++)
        {
            var weaveItems = cmdBaseWorker.WeaveItemArray[i]
            //组合牌
            for(var j=0;j<MAX_WEAVE;j++)
            {
                var t = weaveItems[j].cbCardData
                for(var jj=0;jj<t.length;jj++)
                {
                    if(t[jj]==0)
                        t.splice(jj, 1)
                }
            }
        }
    },
    onCMD_Call:function(body) 
    {
        cmdBaseWorker.cbCallRecord      = body.cbCallRecord  
    },
    onCMD_OpeningMask:function(body)
    {
        cmdBaseWorker.wVideoUser        = body.wRevInfoUser
        if (isRecordScene && cmdBaseWorker.wVideoUser != INVALID_WORD)
        {
            var operateUserId = tableData.getUserWithChairId(cmdBaseWorker.wVideoUser)
            if (operateUserId.dwUserID != selfdwUserID)
                return
        }
        cmdBaseWorker.wCurrentUser      = body.wCurrentUser
        cmdBaseWorker.cbProvideCardData = body.cbProvideCardData   
        cmdBaseWorker.wProvideUser      = body.wTakeCardUser  
        cmdBaseWorker.cbActionMask      = body.cbActionMask
    },
    onCMD_GameStart:function(body) 
    {
        cmdBaseWorker.cbLeftCardCount   =  body.cbLeftCardCount
		cmdBaseWorker.wBankerUser       = tableData.getUserWithUserId(body.dwBankerUserId).wChairID
        cmdBaseWorker.cbHandCardCount   = [0, 0, 0, 0]    
        cmdBaseWorker.cbHandCardData    = [[],[],[],[]]
        for(var wChairID=0;wChairID<GAME_PLAYER;wChairID++)
        {
            cmdBaseWorker.cbHandCardData[wChairID] = body.cbHandCardData[wChairID].slice(0, MAX_COUNT-1)
            cmdBaseWorker.cbHandCardCount[wChairID] = MAX_COUNT-1
        }
		cmdBaseWorker.cbMagicCardData   = body.cbMagicCardData     
        cmdBaseWorker.bIsRandBanker     = body.bIsRandBanker   

        cmdBaseWorker.cbSiceCount       = body.cbSiceCount   
        cmdBaseWorker.wHeapHead         = body.wHeapHead   
        cmdBaseWorker.wHeapTail         = body.wHeapTail   
        cmdBaseWorker.cbHeapCardInfo    = body.cbHeapCardInfo   
        cmdBaseWorker.TurnoverCard      = body.TurnoverCard   
        cmdBaseWorker.cbCallRecord      = body.cbCallRecord
        cmdBaseWorker.cbOutCardCount    = 0  

    },
    onCMD_OutCard:function(body)
    {
        cmdBaseWorker.wVideoUser = body.wRevInfoUser
        if (isRecordScene && cmdBaseWorker.wVideoUser != INVALID_WORD)
        {
            var operateUserId = tableData.getUserWithChairId(cmdBaseWorker.wVideoUser)
            if (operateUserId.dwUserID != selfdwUserID)
                return
        }
        cmdBaseWorker.cbActionMask    = body.cbActionMask   
        cmdBaseWorker.wProvideUser    = body.wOutCardUser 
        cmdBaseWorker.cbProvideCardData    = body.cbOutCardData    
        cmdBaseWorker.wOutCardUser = body.wOutCardUser
        cmdBaseWorker.cbOutCardData = body.cbOutCardData
        cmdBaseWorker.wCurrentUser = INVALID_WORD
 
        cmdBaseWorker.cbOutCardCount += 1
    },
    onCMD_SendCard:function(body) 
    {
        cmdBaseWorker.wVideoUser = body.wRevInfoUser  
        if (isRecordScene && cmdBaseWorker.wVideoUser != INVALID_WORD)
        {
            var operateUserId = tableData.getUserWithChairId(cmdBaseWorker.wVideoUser)
            if (operateUserId.dwUserID != selfdwUserID)
                return
        }
        cmdBaseWorker.cbActionMask    = body.cbActionMask   
        // cmdBaseWorker.wProvideUser    = body.wTakeCardUser 
        cmdBaseWorker.wProvideUser    = body.wProvideUser
        cmdBaseWorker.cbProvideCardData    = body.cbProvideCardData    

        cmdBaseWorker.wCurrentUser = body.wCurrentUser
        cmdBaseWorker.wTakeCardUser = body.wTakeCardUser
        cmdBaseWorker.cbSendCardCount = body.cbSendCardCount
        cmdBaseWorker.cbLeftCardCount = body.cbLastCardCount
        cmdBaseWorker.sendCardArray = body.sendCardArray
    },
    onCMD_OperateResult:function(body) 
    {
        cmdBaseWorker.wVideoUser      = body.wRevInfoUser
        if (isRecordScene && cmdBaseWorker.wVideoUser != INVALID_WORD)
        {
            var operateUserId = tableData.getUserWithChairId(cmdBaseWorker.wVideoUser)
            if (operateUserId.dwUserID != selfdwUserID)
                return
        }
        cmdBaseWorker.cbActionMask    = body.cbActionMask   
        cmdBaseWorker.wProvideUser    = body.wProvideUser   
        cmdBaseWorker.cbProvideCardData    = body.cbProvideCardData    
        cmdBaseWorker.cbOperatePlayerHandCardCount = body.cbHandCardCount
        cmdBaseWorker.wCurrentUser = body.wCurrentUser
        cmdBaseWorker.cbOperateCode = body.cbOperateCode
        cmdBaseWorker.wOperateUser = body.wOperateUser
        cmdBaseWorker.cbOperateCardCount = body.cbOperateCardCount
        cmdBaseWorker.cbOperateCardData = body.cbOperateCardData.slice(0, body.cbOperateCardCount)
    },
    onSMD_GameType:function(body)
    {
        cmdBaseWorker.stWinType       =  body
        cmdBaseWorker.bHaveSetType    =  true
    },
    onSMD_ChangeCard:function(body)
    {
        cmdBaseWorker.cbChangeCard = body.stChangeCard
        cmdBaseWorker.isinitChangeCards = body.isInit
    },
    onSMD_Recommend:function(body)
    {
        cmdBaseWorker.wVideoUser  = body.wRevInfoUser
        if (isRecordScene && cmdBaseWorker.wVideoUser != INVALID_WORD)
        {
            var operateUserId = tableData.getUserWithChairId(cmdBaseWorker.wVideoUser)
            if (operateUserId.dwUserID != selfdwUserID)
                return
        }
        cmdBaseWorker.cbRecommand = body.cbRecommend
    },
    onSMD_ChangeCardSel:function(body)
    {
        cmdBaseWorker.cbChangeCardSel = body.cbDeleteCards
        cmdBaseWorker.isUserSelChange   = body.isUserSelChange
        cmdBaseWorker.cbOperateChangeSelUser = body.wOperateUser
    },
    onCMD_GangScore:function(body) 
    {
        cmdBaseWorker.lGangScore      = body.lGangScore
    },
    onCMD_GameEnd:function(body) 
    {
        cmdBaseWorker.wExitUser       = body.wExitUser
        cmdBaseWorker.wProvideUser    = body.wProvideUser
        cmdBaseWorker.cbProvideCardData   = body.cbProvideCardData
        cmdBaseWorker.dwChiHuKind     = body.dwChiHuKind
        cmdBaseWorker.dwChiHuRight    = body.dwChiHuRight
        cmdBaseWorker.lGameScore      = body.lGameScore
        cmdBaseWorker.lPigScore       = body.lPigScore
        cmdBaseWorker.lChaJiao        = body.lChaJiao
        cmdBaseWorker.lBuChaJia       = body.lBuChaJia
        cmdBaseWorker.lTuiShui        = body.lTuiShui
        cmdBaseWorker.cbHandCardCount = body.cbHandCardCount
        cmdBaseWorker.cbHandCardData  = body.cbHandCardData
        cmdBaseWorker.cbChengBaoUser  = body.cbChengBaoUser
        cmdBaseWorker.wWinner         = body.wWinner
        cmdBaseWorker.endType         = body.endType
        cmdBaseWorker.isEndGame       = body.isEndGame
        cmdBaseWorker.wFan            = body.wFan
        cmdBaseWorker.cbGameHuType    = body.cbGameHuType
        cmdBaseWorker.cbWinCardData   = body.cbWinCardData
        cmdBaseWorker.cbWinnerOrder   = body.cbWinnerOrder  
        cmdBaseWorker.cbWeaveCount    = body.cbWeaveCount    
        cmdBaseWorker.WeaveItemArray  = body.WeaveItemArray  
    },
    getSortedActionsWithMask:function(acitonMask)
    {
        var actions = []

        if((acitonMask&WIK_RIGHT)!=0)
            actions[actions.length] = WIK_RIGHT

        if((acitonMask&WIK_CENTER)!=0)
            actions[actions.length] = WIK_CENTER

        if((acitonMask&WIK_LEFT)!=0)
            actions[actions.length] = WIK_LEFT

        //////
        if((acitonMask&WIK_PENG)!=0)
            actions[actions.length] = WIK_PENG

        if((acitonMask&WIK_GANG)!=0)
            actions[actions.length] = WIK_GANG

        if((acitonMask&WIK_LISTEN)!=0)
            actions[actions.length] = WIK_LISTEN

        if((acitonMask&WIK_CHI_HU)!=0)
            actions[actions.length] = WIK_CHI_HU

        return actions
    },
    wik2Name:function(WIK)
    {
        switch(WIK)
        {
            case WIK_LEFT:
                return 'chi'
            case WIK_CENTER:
                return 'chi'
            case WIK_RIGHT:
                return 'chi'
            case WIK_PENG:
                return 'peng'
            case WIK_GANG:
                return 'gang'
            case WIK_LISTEN:
                return 'ting'
            case WIK_CHI_HU:
                return 'hu'
        }
    },
    isMagicCard:function(idx, cbMagicCardData) 
    {
        for(var i=0;i<cbMagicCardData.length;i++)
        {
            if(idx==cbMagicCardData[i])
                return true
        }

        return false
    },
    sendMessage_chi:function(operateCards, action)
    {
        CMD_C_OperateCard[2][2] = operateCards.length
        var OperateCard = getObjWithStructName('CMD_C_OperateCard')
        OperateCard.cbOperateCode = action
        OperateCard.cbOperateCardCount = operateCards.length
        OperateCard.cbOperateCardData = operateCards
        socket.sendMessage(MDM_GF_GAME,SUB_C_OPERATE_CARD,OperateCard)
    },
    sendMessage_peng:function(operateCards)
    {
        CMD_C_OperateCard[2][2] = operateCards.length
        var OperateCard = getObjWithStructName('CMD_C_OperateCard')
        OperateCard.cbOperateCode = WIK_PENG
        OperateCard.cbOperateCardCount = operateCards.length
        OperateCard.cbOperateCardData = operateCards
        socket.sendMessage(MDM_GF_GAME,SUB_C_OPERATE_CARD,OperateCard)
    },
    sendMessage_gang:function(operateCards)
    {
        CMD_C_OperateCard[2][2] = operateCards.length
        var OperateCard = getObjWithStructName('CMD_C_OperateCard')
        OperateCard.cbOperateCode = WIK_GANG
        OperateCard.cbOperateCardCount = operateCards.length
        OperateCard.cbOperateCardData = operateCards
        socket.sendMessage(MDM_GF_GAME,SUB_C_OPERATE_CARD,OperateCard)
    },
    sendMessage_hu:function(operateCards)
    {
        CMD_C_OperateCard[2][2] = operateCards.length
        var OperateCard = getObjWithStructName('CMD_C_OperateCard')
        OperateCard.cbOperateCode = WIK_CHI_HU
        OperateCard.cbOperateCardCount = operateCards.length
        OperateCard.cbOperateCardData = operateCards
        socket.sendMessage(MDM_GF_GAME,SUB_C_OPERATE_CARD,OperateCard)
    },
    sendMessage_guo:function()
    {
        CMD_C_OperateCard[2][2] = 0
        var OperateCard = getObjWithStructName('CMD_C_OperateCard')
        OperateCard.cbOperateCode = WIK_NULL
        OperateCard.cbOperateCardCount = 0
        socket.sendMessage(MDM_GF_GAME,SUB_C_OPERATE_CARD,OperateCard)
    },
    sendMessage_replace:function(operateCards)
    {
        CMD_C_OperateCard[2][2] = operateCards.length
        var OperateCard = getObjWithStructName('CMD_C_OperateCard')
        OperateCard.cbOperateCode = WIK_REPLACE
        OperateCard.cbOperateCardCount = operateCards.length
        OperateCard.cbOperateCardData = operateCards
        socket.sendMessage(MDM_GF_GAME,SUB_C_OPERATE_CARD,OperateCard)
    },
    searchGangIdxs:function(handMajiangs, weaveMajiangs) //自摸杠时找到杠哪个 服务器传? TODO
    {
        //暗杠
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

        /////////增杠
        var weavePengIdxs = []
        for(var i=0;i<weaveMajiangs.length;i++)
        {
            var majiangsOneGroup = weaveMajiangs[i]
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

    bao2Cai:function(idx)
    {
        if(REPLACE_CARD_DATA != INVALID_CARD_DATA && idx == REPLACE_CARD_DATA)
            idx = cmdBaseWorker.cbMagicCardData[0]
        return idx
    }, 
    cai2Bao:function(idx)
    {
        if(REPLACE_CARD_DATA != INVALID_CARD_DATA && idx == cmdBaseWorker.cbMagicCardData[0])
            idx = REPLACE_CARD_DATA
        return idx
    },
    getSortedOperateIdxs:function(provideIdx, action)
    {
        switch(action)
        {
            case WIK_LEFT:
                return [provideIdx, cmdBaseWorker.cai2Bao(cmdBaseWorker.bao2Cai(provideIdx)+1), cmdBaseWorker.cai2Bao(cmdBaseWorker.bao2Cai(provideIdx)+2)]
            case WIK_CENTER:
                return [ cmdBaseWorker.cai2Bao(cmdBaseWorker.bao2Cai(provideIdx)-1), provideIdx, cmdBaseWorker.cai2Bao(cmdBaseWorker.bao2Cai(provideIdx)+1)]
            case WIK_RIGHT:
                return [cmdBaseWorker.cai2Bao(cmdBaseWorker.bao2Cai(provideIdx)-2), cmdBaseWorker.cai2Bao(cmdBaseWorker.bao2Cai(provideIdx)-1), provideIdx]
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
    sortHandIdxs:function(idxs)//使用前 先将idx=0过滤掉
    {
        return majiangFactory.sortCardDatasWithScore(idxs)
    },
    sortWeaveIdxs:function(kind, idxs)
    {
        if(kind == WIK_RIGHT || kind==WIK_CENTER || kind==WIK_LEFT)
        {
            idxs.sort(function(a,b)
            {   
                return cmdBaseWorker.bao2Cai(a) - cmdBaseWorker.bao2Cai(b)
            })
        }

        return idxs
    },
    isAllCall:function()
    {
        for (var i=0; i<GAME_PLAYER; i++)
        {
            if (cmdBaseWorker.cbCallRecord[i] == INVALID_BYTE)
                return false
        }
        return true
    },
    setSelMajiangColor:function(majiang, id)
    {
        var CardData = majiang.cardData
        if ((CardData&MASK_COLOR)>>4 == cmdBaseWorker.cbCallRecord[id])
        {
            majiang.color = cc.color(180,180,180)
            var zi = majiang.getChildByTag(101)
            if (zi)
                zi.color = cc.color(180,180,180)
        }
    },
    reSortScore:function(selfChairId)
    {
        var idxs = []
        var scores = []
        var selCardData = []
        var sel = 1
        if (cmdBaseWorker.cbCallRecord[selfChairId] == 2)
            return
        else if (cmdBaseWorker.cbCallRecord[selfChairId] == 1)
            sel = 17
        else if (cmdBaseWorker.cbCallRecord[selfChairId] == 0)
            sel = 1
        else
        {
            gameLog.log("1!!!@XXXXXXXX")
            return
        }

        for (var j = sel ; j <= sel+8; j++)
            selCardData[selCardData.length] = j

        selCardData[selCardData.length] = INVALID_CARD_DATA

        for(var i=0;i<selCardData.length;i++)
        {
            if(selCardData[i] == INVALID_CARD_DATA)
                break
            idxs[idxs.length] = selCardData[i]
            scores[scores.length] = 42+selCardData[i]
        }
        majiangFactory.initCardData2ScoreMap( idxs, scores )
    },
    reSortHandMjs:function(selfChairId)
    {
        var selStart = 1
        var selEnd   = 0

        if (cmdBaseWorker.cbCallRecord[selfChairId] == 2)
            return
        else if (cmdBaseWorker.cbCallRecord[selfChairId] == 1)
        {
            selStart = 17
            selEnd  = selStart + 8
        }
        else if (cmdBaseWorker.cbCallRecord[selfChairId] == 0)
        {
            selStart = 1
            selEnd  = selStart + 8
        }
        else
            return

        var direction = tableData.getShowChairIdWithServerChairId(selfChairId)  
        var majiangs = playNode.handMajiangs4D[direction]
        var mjLength = majiangs[0].length
        for(var j=mjLength-1; j>=0; j--)
        {
            var majiang = majiangs[0][j]
            if (majiang && majiang.cardData >= selStart && majiang.cardData <= selEnd)
            {
                majiangFactory.deleteHandMajiangsOld(majiangs, direction, majiang)
                //majiangFactory.deleteHandMajiangs(majiangs, direction, majiang.cardData)
                majiangFactory.insertHandMajiangsOld(majiangs, direction, majiang.cardData, playNode.handGroupNode4D[direction])
            }
        }
    },
    addDiscardMajiangs:function(discardMajiangs, direction, cardData, parent)
    {
        var majiangs = discardMajiangs
        var majiang = majiangFactory.getOne(cardData, 1, direction)
        parent.addChild(majiang)

        var discardCount = direction%2==0?majiangFactory.discardCountOneRow:majiangFactory.discardCountOneLine
        
        var row = majiangs.length%discardCount
        var line = Math.floor(majiangs.length/discardCount) 
        var pos = cmdBaseWorker.getDiscardMajiangPosAndTag(row, line, direction)
        majiang.x = pos.x
        majiang.y = pos.y
        majiang.setLocalZOrder(pos.zOrder)

        majiangs[majiangs.length] = majiang
        
    },
    getDiscardMajiangPosAndTag:function(row, line, direction)
    {
        var pos = {}
        switch(direction)
        {
            case 0://down
            {
                pos.x = row*majiangFactory.down_discardWidth*majiangFactory.scale_upDown
                pos.y = -line*majiangFactory.downDiscardIntervalY*majiangFactory.scale_upDown - line*10
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
                pos.y = line*majiangFactory.upDiscardIntervalY*majiangFactory.scale_upDown + line*10
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
    changeCardDelete:function(cbChangeCardSel)
    {
        function onDeleteCard(cbUser, outIdx)
        {
            var outDir = tableData.getShowChairIdWithServerChairId(cbUser)  
            var majiangs = playNode.handMajiangs4D[outDir]
            majiangFactory.deleteHandMajiangs(majiangs, outDir, outIdx)
            managerAudio.playEffect('gameRes/sound/sendcard.mp3')
        }

        function onOperateChangeCards(cbUser)
        {
            playNode.node.runAction(cc.sequence(
                    cc.delayTime(0.3), 
                    cc.callFunc(function(){ 
                        onDeleteCard(cbUser, cbChangeCardSel[0])
                    }), 
                    cc.delayTime(0.3), 
                    cc.callFunc(function(){ 
                        onDeleteCard(cbUser, cbChangeCardSel[1]) 
                    }), 
                    cc.delayTime(0.3), 
                    cc.callFunc(function(){ 
                        onDeleteCard(cbUser, cbChangeCardSel[2]) 
                    })
                ))
        }  

        onOperateChangeCards(cmdBaseWorker.cbOperateChangeSelUser)
    },
    changeCard:function()
    {
        playNode.isChanging = false
        playNode.isChangeCard = false
        playNode.isStartGame  = false
        if (cmdBaseWorker.cbChangeCard != null && cmdBaseWorker.stWinType.cbChangeCard == 1)
        {
            function onDeleteCard(cbUser, outIdx)
            {
                var outDir = tableData.getShowChairIdWithServerChairId(cbUser)  
                var majiangs = playNode.handMajiangs4D[outDir]
                majiangFactory.deleteHandMajiangs(majiangs, outDir, outIdx)
                managerAudio.playEffect('gameRes/sound/sendcard.mp3')
            }

            function onAddCard(cbUser, outIdx)
            {
                var outDir = tableData.getShowChairIdWithServerChairId(cbUser)   
                var majiangs = playNode.handMajiangs4D[outDir]
                majiangFactory.addHandMajiang(majiangs, outDir, outIdx, playNode.handGroupNode4D[outDir], playNode.weaveMajiangs4D[outDir].length)
                managerAudio.playEffect('gameRes/sound/sendcard.mp3')
            }

            function onOperateChangeCards(cbUser)
            {
                playNode.node.runAction(cc.sequence(
                    cc.delayTime(1.5),
                    cc.callFunc(function(){ 
                        onAddCard(cbUser, cmdBaseWorker.cbChangeCard[cbUser].cbAddCards[0]) 
                    }),
                    cc.delayTime(0.4),
                    cc.callFunc(function(){ 
                        onAddCard(cbUser, cmdBaseWorker.cbChangeCard[cbUser].cbAddCards[1]) 
                    }),
                    cc.delayTime(0.4),
                    cc.callFunc(function(){ 
                        onAddCard(cbUser, cmdBaseWorker.cbChangeCard[cbUser].cbAddCards[2]) 
                    }),
                    cc.delayTime(0.4),
                    cc.callFunc(function(){ 
                            topUINode.node_warn1.setVisible(false)
                            var operatorUser = tableData.getUserWithChairId(cbUser)
                            if(operatorUser.dwUserID==selfdwUserID)
                            {
                                playNode.showGameset()
                                playNode.haveAllSel = false
                            }
                        })  
                    ))
            }  
            gameLog.log("XXXXXX::::", cmdBaseWorker.cbChangeCard)
            for (var i = 0; i < GAME_PLAYER; i++)
                onOperateChangeCards(i)

            playNode.node.runAction(cc.sequence(
                    cc.delayTime(2.7),
                    cc.callFunc(function(){ 
                        for (var i = 0; i < GAME_PLAYER; i++)
                            playNode.setDingQueVisible(i, cmdBaseWorker.cbCallRecord[i] == INVALID_BYTE)
                    })
                ))
        }
        else
        {
            for (var i = 0; i < GAME_PLAYER; i++)
                playNode.setDingQueVisible(i, cmdBaseWorker.cbCallRecord[i] == INVALID_BYTE)
            playNode.showGameset()
            playNode.haveAllSel = false
        }
    },
    resetWinnerOrder:function()
    {
        cmdBaseWorker.cbWinnerOrder = [0,0,0,0]
        cmdBaseWorker.setWinnerOrder()
    },
    setWinnerOrder:function()
    {
        for (var serverChairId = 0; serverChairId < GAME_PLAYER; serverChairId++)
        {
            var direction = tableData.getShowChairIdWithServerChairId(serverChairId)
            if (cmdBaseWorker.cbWinnerOrder[serverChairId] > 0)
            {
                tableNode['userHu_' + direction].setVisible(true)
                tableNode['userHu_' + direction].setString(cmdBaseWorker.cbWinnerOrder[serverChairId]+'胡')
            }
            else
            {
                tableNode['userHu_' + direction].setVisible(false)
                tableNode['userHu_' + direction].setString('')
            }
        }
    },
    onListerMenuShare:function()
    {
        var roundtime = tableData.wRoundTime/60
        var desc1 = roundtime+'分钟局'+':'
        if (cmdBaseWorker.bHaveSetType == false)
            desc1 = '封顶 (3番)、自摸 (加底)、点杠花 (自摸)、'
        else
        {
            if (cmdBaseWorker.stWinType.cbFengDingType == 0)
                desc1 += '封顶 (2番)、'
            else if (cmdBaseWorker.stWinType.cbFengDingType == 1)
                desc1 += '封顶 (3番)、'
            else if (cmdBaseWorker.stWinType.cbFengDingType == 2)
                desc1 += '封顶 (4番)、'
            else if (cmdBaseWorker.stWinType.cbFengDingType == 3)
                desc1 += '封顶 (不封顶)、'
            else if (cmdBaseWorker.stWinType.cbFengDingType == 4)
                desc1 += '封顶 (5番)、'

            if (cmdBaseWorker.stWinType.cbZiMoType == 0)
                desc1 += '自摸 (加底)、'
            else if (cmdBaseWorker.stWinType.cbZiMoType == 1)
                desc1 += '自摸 (加番)、'
            
            if (cmdBaseWorker.stWinType.cbGFlowerType == 0)
                desc1 += '点杠花 (点炮)、'
            else if (cmdBaseWorker.stWinType.cbGFlowerType == 1)
                desc1 += '点杠花 (自摸)、'

            if (cmdBaseWorker.stWinType.cbChangeCard == 1)
                desc1 += '换三张、'
            if (cmdBaseWorker.stWinType.YaoJiuJiangDui == 1)
                desc1 += '幺九 x8、清幺九 x16、将对 x8、'
            if (cmdBaseWorker.stWinType.cbTianDiHu == 1)
                desc1 += '天胡 x8、地胡 x4、'
            if (cmdBaseWorker.stWinType.cbMenQingZhongZhang == 1)
                desc1 += '门清 x2、中张 x2、'
        }
        //desc1 += "对对胡 x2、七对 x4、清一色 x4、清对 x8、龙七对 x8、清七对 x16、清龙七对 x16、带根加倍、刮风加倍、下雨加4倍、杠上花加4倍、抢杠加倍、自摸加倍、海底捞加倍"
        
      wx.onMenuShareAppMessage({
        title: wxData.data.share.title.replace("口令", "房号"),
        desc: desc1,
        link: wxData.data.share.link,
        imgUrl: wxData.data.share.imgurl.replace(/\/0/, '/64'),
        trigger: function (res) {
          // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
          // alert('用户点击发送给朋友');
        },
        success: function (res) {
        },
        cancel: function (res) {
        },
        fail: function (res) {
        }
      });

      wx.onMenuShareTimeline({
        title: wxData.data.share.title,
        desc: desc1,
        link: wxData.data.share.link,
        imgUrl: wxData.data.share.imgurl.replace(/\/0/, '/64'),
        trigger: function (res) {
          // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
          // alert('用户点击发送给朋友');
        },
        success: function (res) {
        },
        cancel: function (res) {
        },
        fail: function (res) {
        }
      });
    },
}

recordNode.getPlayInterval=function(subId)
{
    switch(subId)
    {
        case SUB_S_GAME_START: 
        {
            if (cmdBaseWorker.bIsRandBanker)
                return 12800
            else
                return 3000
        }
        case SUB_S_OPERATE_RESULT: return 300
        case SUB_S_SEND_CARD: return 200
        case SUB_S_OUT_CARD: return 200
        case SUB_S_OPENINGOPERATE: return 200
        case SUB_S_GAME_END:
        {
            return 2600
        }
        case SUB_S_GAME_RECOMMEND: return 200
        case SUB_S_CALL: return 500
        case SUB_S_GAME_CHANGE: return 1 
        case SUB_S_GAME_CHANGESEL: return 500
    }
    //这个是默认时间
    return 1000;
}






























