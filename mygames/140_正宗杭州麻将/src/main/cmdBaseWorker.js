
var cmdBaseWorker = 
{   
    lCellScore:null,
    //user变量
    wBankerUser:INVALID_WORD,
    wCurrentUser:INVALID_WORD,//当前需要出牌的玩家 m_wCurrentUser =INVALID_CHAIR时表示没人能出牌 在吃碰杠状态
    wResumeUser:INVALID_WORD, //用于如果所有人都‘过’时发牌
    wOutCardUser:INVALID_WORD,
    wProvideUser:INVALID_WORD,
    wTakeCardUser:INVALID_WORD,
    wOperateUser:INVALID_WORD,

    //cardData变量
    cbOutCardData:null,
    cbProvideCardData:null,
    cbMagicCardData:[],
    cbFlowerCardData:[],
    cbOutCardCount:0,

    //手牌 丢弃牌 动作牌 花牌
    cbHandCardCount:null,
    cbHandCardData:null,
    cbDiscardCount:null,
    cbDiscardCardData:null,
    cbWeaveCount:null,
    WeaveItemArray:null,
    cbPlayerFlowerCount:null,
    cbPlayerFlowerCardData:[],
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
    wWinner:null,
    endType:null,
    wExitUser:INVALID_WORD,

    //其他
    cbCallRecord:null,
    TurnoverCard:null,

    MagicAction:[],
    Randomnum:[],
    ForbidUserAction:[],
    ForbidGangAction:null,
    ActionChiCardDate:null,
    IsFeng:null,
    type_hu:null,
    GangNum:null,
    LianZhuang:null,

    init:function()
    {   
    },
    onReStart:function()
    {
        cmdBaseWorker.wBankerUser       = INVALID_WORD
        cmdBaseWorker.wTakeCardUser       = INVALID_WORD
        cmdBaseWorker.wCurrentUser      = INVALID_WORD//当前需要出牌的玩家 m_wCurrentUser=INVALID_CHAIR时表示没人能出牌 在吃碰杠状态
        cmdBaseWorker.wOutCardUser      = INVALID_WORD
        cmdBaseWorker.cbMagicCardData    = []
        cmdBaseWorker.cbFlowerCardData    = []
        cmdBaseWorker.cbPlayerFlowerCardData    = []
        cmdBaseWorker.wResumeUser       = INVALID_WORD //用于如果所有人都‘过’时发牌
        cmdBaseWorker.wOperateUser      = INVALID_WORD
        cmdBaseWorker.wProvideUser      = INVALID_WORD
        cmdBaseWorker.wExitUser         = INVALID_WORD
        cmdBaseWorker.cbOutCardCount  = 0 

    },
    onCMD_StatusFree:function(body) 
    {
        cmdBaseWorker.lCellScore = body.lCellScore
    },
    onCMD_StatusCall:function(body) 
    {
        cmdBaseWorker.lCellScore = body.lCellScore
        cmdBaseWorker.wBankerUser     = tableData.getUserWithUserId(body.dwBankerUserId).wChairID   
        cmdBaseWorker.cbCallRecord = body.cbCallRecord
    },
    onCMD_StatusPlay:function(body) 
    {	
        cmdBaseWorker.Randomnum     = body.RandomNum
        cmdBaseWorker.MagicAction = body.HZ_MagicActionMask
        cmdBaseWorker.ForbidGangAction = body.HZ_ForbidGangAction
        cmdBaseWorker.ActionChiCardDate = body.HZ_ActionChiCardDate

        cmdBaseWorker.cbActionMask    = body.cbActionMask   
        cmdBaseWorker.wProvideUser    = body.wProvideUser   
        cmdBaseWorker.cbProvideCardData    = body.cbProvideCardData   

        cmdBaseWorker.wBankerUser     = tableData.getUserWithUserId(body.dwBankerUserId).wChairID   
        cmdBaseWorker.lCellScore      = body.lCellScore      
        cmdBaseWorker.wCurrentUser    = body.wCurrentUser    
 
        cmdBaseWorker.cbLeftCardCount = body.cbLeftCardCount 
        cmdBaseWorker.wOutCardUser    = body.wOutCardUser    
        cmdBaseWorker.cbOutCardData   = body.cbOutCardData   
        cmdBaseWorker.cbDiscardCount  = body.cbDiscardCount  
        cmdBaseWorker.cbDiscardCardData   = body.cbDiscardCardData   
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

        cmdBaseWorker.cbWeaveCount    = body.cbWeaveCount    
        cmdBaseWorker.WeaveItemArray  = body.WeaveItemArray  

        cmdBaseWorker.cbPlayerFlowerCount    = body.cbPlayerFlowerCount   
        for(var i=0;i<GAME_PLAYER;i++)
        {   
            cmdBaseWorker.cbPlayerFlowerCardData[i]  = body.cbPlayerFlowerCardData[i].slice(0, body.cbPlayerFlowerCount[i])  
        }

        cmdBaseWorker.cbMagicCardData  = body.cbMagicCardData  
        cmdBaseWorker.cbFlowerCardData    = body.cbFlowerCardData  

        cmdBaseWorker.wHeapHead     = body.wHeapHead   
        cmdBaseWorker.wHeapTail     = body.wHeapTail   
        cmdBaseWorker.cbHeapCardInfo     = body.cbHeapCardInfo   
        cmdBaseWorker.TurnoverCard     = body.TurnoverCard   

        cmdBaseWorker.cbCallRecord = body.cbCallRecord  

        //格式化数据 把0过滤掉
        for(var i=0;i<GAME_PLAYER;i++)
        {
            var weaveItems = cmdBaseWorker.WeaveItemArray[i]
            //组合牌
            for(var j=0;j<MAX_WEAVE;j++)
            {
                var t = weaveItems[j].cbCardDatas
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
        cmdBaseWorker.wBankerUser       = tableData.getUserWithUserId(body.dwBankerUserId).wChairID   
        cmdBaseWorker.cbCallRecord = body.cbCallRecord  
    },
    onCMD_GameStart:function(body) 
    {
        cmdBaseWorker.cbLeftCardCount =  body.cbLeftCardCount

		cmdBaseWorker.wBankerUser       = tableData.getUserWithUserId(body.dwBankerUserId).wChairID    
        cmdBaseWorker.cbHandCardData = [[],[],[],[]]
        for(var i=0;i<GAME_PLAYER;i++)
        {
            var isSelf = tableData.getUserWithUserId(selfdwUserID).wChairID == i
            for(var j=0;j<MAX_COUNT-1;j++)
            {
                cmdBaseWorker.cbHandCardData[i][j] = isSelf?body.cbHandCardData[j]:0
            }
        }
		cmdBaseWorker.cbMagicCardData    = body.cbMagicCardData     
        cmdBaseWorker.cbFlowerCardData    = body.cbFlowerCardData  
        cmdBaseWorker.bIsRandBanker     = body.bIsRandBanker   

        cmdBaseWorker.Randomnum     = body.RandomNum
        cmdBaseWorker.wHeapHead     = body.wHeapHead   
        cmdBaseWorker.wHeapTail     = body.wHeapTail   
        cmdBaseWorker.cbHeapCardInfo     = body.cbHeapCardInfo   
        cmdBaseWorker.TurnoverCard     = body.TurnoverCard   

        cmdBaseWorker.cbCallRecord = body.cbCallRecord

        cmdBaseWorker.cbOutCardCount = 0  
        cmdBaseWorker.cbPlayerFlowerCount = [0, 0, 0, 0]
        cmdBaseWorker.cbPlayerFlowerCardData    = [[], [], [], []]

    },
    onCMD_OutCard:function(body)
    {
        cmdBaseWorker.cbActionMask    = body.cbActionMask   
        cmdBaseWorker.wProvideUser    = body.wOutCardUser 
        cmdBaseWorker.cbProvideCardData    = body.cbOutCardData    


        cmdBaseWorker.wOutCardUser = body.wOutCardUser
        cmdBaseWorker.cbOutCardData = body.cbOutCardData
        cmdBaseWorker.wCurrentUser = INVALID_WORD

        cmdBaseWorker.MagicAction = body.HZ_MagicActionMask
        cmdBaseWorker.ForbidGangAction = body.HZ_ForbidGangAction
 
        cmdBaseWorker.cbOutCardCount += 1
    },
    onCMD_SendCard:function(body) 
    {
        cmdBaseWorker.cbActionMask    = body.cbActionMask   
        cmdBaseWorker.wProvideUser    = body.wTakeCardUser 
        cmdBaseWorker.cbProvideCardData    = body.cbProvideCardData    

        cmdBaseWorker.wCurrentUser = body.wCurrentUser
        cmdBaseWorker.wTakeCardUser = body.wTakeCardUser
        cmdBaseWorker.cbSendCardCount = body.cbSendCardCount
        cmdBaseWorker.sendCardArray = body.sendCardArray

        cmdBaseWorker.MagicAction = body.HZ_MagicActionMask
        cmdBaseWorker.ForbidGangAction = body.HZ_ForbidGangAction
        cmdBaseWorker.ActionChiCardDate = body.HZ_ActionChiCardDate
        cmdBaseWorker.ForbidUserAction = body.HZ_ForbidUserAction

        cmdBaseWorker.cbLeftCardCount = cmdBaseWorker.cbLeftCardCount - cmdBaseWorker.cbSendCardCount
        
    },
    onCMD_OperateResult:function(body) 
    {
        cmdBaseWorker.MagicAction = body.HZ_MagicActionMask
        cmdBaseWorker.ActionChiCardDate = body.HZ_ActionChiCardDate
        cmdBaseWorker.ForbidUserAction = body.HZ_ForbidUserAction
        cmdBaseWorker.cbActionMask    = body.cbActionMask   
        cmdBaseWorker.wProvideUser    = body.wProvideUser   
        cmdBaseWorker.cbProvideCardData    = body.cbProvideCardData    

        cmdBaseWorker.wCurrentUser = body.wCurrentUser
        cmdBaseWorker.cbOperateCode = body.cbOperateCode
        cmdBaseWorker.wOperateUser = body.wOperateUser
        cmdBaseWorker.cbOperateCardCount = body.cbOperateCardCount
        cmdBaseWorker.cbOperateCardData = body.cbOperateCardData.slice(0, body.cbOperateCardCount)
    },
    onCMD_GameEnd:function(body) 
    {
        cmdBaseWorker.IsFeng            = body.HZ_IsFeng
        cmdBaseWorker.type_hu           = body.HZ_type_hu
        cmdBaseWorker.GangNum           = body.HZ_GangNum
        cmdBaseWorker.LianZhuang        = body.HZ_LianZhuang
        cmdBaseWorker.wExitUser       = body.wExitUser
        cmdBaseWorker.wProvideUser    = body.wProvideUser
        cmdBaseWorker.cbProvideCardData   = body.cbProvideCardData
        cmdBaseWorker.dwChiHuKind     = body.dwChiHuKind
        cmdBaseWorker.dwChiHuRight    = body.dwChiHuRight
        cmdBaseWorker.lGameScore      = body.lGameScore

        cmdBaseWorker.cbHandCardCount = body.cbHandCardCount
        for(var i=0;i<GAME_PLAYER;i++)
        {
            cmdBaseWorker.cbHandCardData[i] = body.cbHandCardData[i].slice(0, cmdBaseWorker.cbHandCardCount[i])
        }

        cmdBaseWorker.wWinner  = body.wWinner
        cmdBaseWorker.endType  = body.endType

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
    isFlowerCard:function(idx, cbFlowerCardData) 
    {
        for(var i=0;i<cbFlowerCardData.length;i++)
        {
            if(idx==cbFlowerCardData[i])
                return true
        }

        return false
    },
    sendMessage_chi:function(operateCards, action)
    {
        CMD_C_OperateCard[2][2] = operateCards.length
        var OperateCard = getObjWithStructName('CMD_C_OperateCard')

        //playNode.Set_ForbidCard(action, operateCards[0])
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
    sendMessage_guo:function(operateCards)
    {
        CMD_C_OperateCard[2][2] = operateCards.length
        var OperateCard = getObjWithStructName('CMD_C_OperateCard')
        OperateCard.cbOperateCode = WIK_NULL
        OperateCard.cbOperateCardCount = operateCards.length
        OperateCard.cbOperateCardData = operateCards
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
            if (idx == cmdBaseWorker.cbMagicCardData[0])
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
            if(majiangsOneGroup.cbWeaveKind == WIK_PENG && cmdBaseWorker.ForbidGangAction)
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


}



