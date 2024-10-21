
var cmdBaseWorker = 
{   
    lCellScore:null,
    //user变量
    wBankerUser:INVALID_WORD,
    wCurrentUserCall:INVALID_WORD,
    wCallUser:INVALID_WORD,
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
    cbPlayerFlowerCardData:[[], [], [], []],
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
    lGameTaiCount:null,
    lGameScore:null,
    endType:0,
    wExitUser:INVALID_WORD,

    //其他
    cbCallRecord:null,
    cbSiceCount:null,
    TurnoverCard:null,
    dwLastWinner:[],

   cbGangScorecard:null,
   cbScoreData:[[],[],[],[]],
   wFristWinner:null,
   whukind:null,
   cbReActionMask:null,
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
        cmdBaseWorker.cbPlayerFlowerCardData    = [[], [], [], []]
        cmdBaseWorker.wResumeUser       = INVALID_WORD //用于如果所有人都‘过’时发牌
        cmdBaseWorker.wOperateUser      = INVALID_WORD
        cmdBaseWorker.wProvideUser      = INVALID_WORD
        cmdBaseWorker.wExitUser         = INVALID_WORD
        cmdBaseWorker.cbOutCardCount  = 0 
        cmdBaseWorker.endType  = 0 

    },
    onCMD_StatusFree:function(body) 
    {
        cmdBaseWorker.lCellScore = body.lCellScore
    },
    onCMD_StatusCall:function(body) 
    {
        cmdBaseWorker.lCellScore = body.lCellScore
        cmdBaseWorker.wCurrentUserCall = body.wCurrentUserCall
        cmdBaseWorker.wBankerUser     = tableData.getUserWithUserId(body.dwBankerUserId).wChairID   
        cmdBaseWorker.cbCallRecord = body.cbCallRecord
    },
    onCMD_StatusPlay:function(body) 
    {	
        cmdBaseWorker.cbActionMask    = body.cbActionMask   
        cmdBaseWorker.wProvideUser    = body.wProvideUser   
        cmdBaseWorker.cbProvideCardData    = body.cbProvideCardData   
        //cmdBaseWorker.notallowout_1   = body.notallowout_1
        //cmdBaseWorker.notallowout_2   = body.notallowout_2
        //cmdBaseWorker.ischi           = body.ischi
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
    onCMD_CallNotify:function(body) 
    {        
        cmdBaseWorker.wBankerUser       = tableData.getUserWithUserId(body.dwBankerUserId).wChairID    
        cmdBaseWorker.wCurrentUserCall = body.wCurrentUserCall
    },
    onCMD_CallResult:function(body) 
    {     
        cmdBaseWorker.wCallUser = body.wCallUser
        cmdBaseWorker.cbCallRecord = body.cbCallRecord
        cmdBaseWorker.wCurrentUserCall = body.wCurrentUserCall
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
                //cmdBaseWorker.cbHandCardData[i][j] = isSelf?body.cbHandCardData[j]:0
                cmdBaseWorker.cbHandCardData[i][j] = body.cbHandCardData[i][j]
            }
        }
		cmdBaseWorker.cbMagicCardData    = body.cbMagicCardData     
        cmdBaseWorker.cbFlowerCardData    = body.cbFlowerCardData  
        cmdBaseWorker.bIsRandBanker     = body.bIsRandBanker   

        cmdBaseWorker.cbSiceCount     = body.cbSiceCount   
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
        cmdBaseWorker.cbReActionMask = body.cbReActionMask
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
        cmdBaseWorker.cbReActionMask = body.cbReActionMask
        cmdBaseWorker.cbActionMask    = body.cbActionMask   
        cmdBaseWorker.wProvideUser    = body.wProvideUser 
        cmdBaseWorker.cbProvideCardData    = body.cbProvideCardData    
       // cmdBaseWorker.handcount = body.handcount
        cmdBaseWorker.wCurrentUser = body.wCurrentUser
        cmdBaseWorker.wTakeCardUser = body.wTakeCardUser
        cmdBaseWorker.cbSendCardCount = body.cbSendCardCount
        cmdBaseWorker.sendCardArray = body.sendCardArray
        //cmdBaseWorker.handcarddate   = body.handcarddate
        cmdBaseWorker.cbLeftCardCount = cmdBaseWorker.cbLeftCardCount - cmdBaseWorker.cbSendCardCount
        
    },
    onCMD_OperateResult:function(body) 
    {
        cmdBaseWorker.cbReActionMask = body.cbReActionMask
        cmdBaseWorker.cbActionMask    = body.cbActionMask   
        cmdBaseWorker.wProvideUser    = body.wProvideUser   
        cmdBaseWorker.cbProvideCardData    = body.cbProvideCardData    
        cmdBaseWorker.wCurrentUser = body.wCurrentUser
        cmdBaseWorker.cbOperateCode = body.cbOperateCode
        cmdBaseWorker.wOperateUser = body.wOperateUser
        cmdBaseWorker.cbOperateCardCount = body.cbOperateCardCount
        cmdBaseWorker.cbOperateCardData = body.cbOperateCardData.slice(0, body.cbOperateCardCount)
        //cmdBaseWorker.handcount = body.handcount
        //cmdBaseWorker.handcarddate   = body.handcarddate
        if(cmdBaseWorker.cbOperateCode==WIK_REPLACE)
        {
            cmdBaseWorker.cbPlayerFlowerCount[cmdBaseWorker.wOperateUser]++
            cmdBaseWorker.cbPlayerFlowerCardData[cmdBaseWorker.wOperateUser] = 
            cmdBaseWorker.cbPlayerFlowerCardData[cmdBaseWorker.wOperateUser].concat(cmdBaseWorker.cbOperateCardData)
        }

    },
    onCMD_GameEnd:function(body) 
    {
        cmdBaseWorker.whukind         = body.whukind
        cmdBaseWorker.wFristWinner    = body.wFristWinner
        cmdBaseWorker.wExitUser       = body.wExitUser
        cmdBaseWorker.wProvideUser    = body.wProvideUser
        cmdBaseWorker.cbProvideCardData   = body.cbProvideCardData
        cmdBaseWorker.dwChiHuKind     = body.dwChiHuKind
        cmdBaseWorker.dwChiHuRight    = body.dwChiHuRight
        cmdBaseWorker.lGameTaiCount      = body.lGameTaiCount
        cmdBaseWorker.lGameScore      = body.lGameScore
        //cmdBaseWorker.laozhuan        = body.laozhuan
        cmdBaseWorker.cbHandCardCount = body.cbHandCardCount
        for(var i=0;i<GAME_PLAYER;i++)
        {
            cmdBaseWorker.cbHandCardData[i] = body.cbHandCardData[i].slice(0, cmdBaseWorker.cbHandCardCount[i])
        }
        cmdBaseWorker.endType  = body.endType

        cmdBaseWorker.cbWeaveCount    = body.cbWeaveCount    
        cmdBaseWorker.WeaveItemArray  = body.WeaveItemArray  
        cmdBaseWorker.cbGangScorecard = body.cbGangScorecard
        cmdBaseWorker.cbScoreData   = body.cbScoreData
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
    isMagicCard:function(cardData, cbMagicCardData) 
    {
        for(var i=0;i<cbMagicCardData.length;i++)
        {
            if(cardData==cbMagicCardData[i])
                return true
        }

        return false
    },
    isFlowerCard:function(cardData, cbFlowerCardData) 
    {
        for(var i=0;i<cbFlowerCardData.length;i++)
        {
            if(cardData==cbFlowerCardData[i])
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
    searchGangCardDatas:function(handMajiangs, weaveMajiangs) //自摸杠时找到杠哪个 服务器传? TODO
    {
        //暗杠
        var handCardDatas = handMajiangs[1]?[handMajiangs[1].cardData]:[]
        for(var i=0;i<handMajiangs[0].length;i++)
        {
            handCardDatas[handCardDatas.length] = handMajiangs[0][i].cardData
        }
        majiangLogic.sortWithCardData(handCardDatas)

        var anGangCardDatas = []
        for(var i=0;i<handCardDatas.length;i++)
        {
            var cardData = handCardDatas[i]
            if(i>0 && cardData == handCardDatas[i-1])
                continue

            var isHas = majiangLogic.isHas(handCardDatas, [], [cardData, cardData, cardData, cardData])
            if(isHas[0])
                anGangCardDatas[anGangCardDatas.length] = cardData
        }

        /////////增杠
        var weavePengCardDatas = []
        for(var i=0;i<weaveMajiangs.length;i++)
        {
            var majiangsOneGroup = weaveMajiangs[i]
            if(majiangsOneGroup.cbWeaveKind == WIK_PENG)
                weavePengCardDatas[weavePengCardDatas.length] = majiangsOneGroup[0].cardData   
        }

        var zengGangCardDatas = []
        for(var i=0;i<handCardDatas.length;i++)
        {
            var cardData = handCardDatas[i]
            if(i>0 && cardData == handCardDatas[i-1])
                continue
            var isHas = false
            for(var j=0;j<weavePengCardDatas.length;j++)
            {
                if(cardData==weavePengCardDatas[j])
                    isHas = true
            }
            if(isHas)
                zengGangCardDatas[zengGangCardDatas.length] = cardData
        }    

        var gangCardDatas = anGangCardDatas.concat(zengGangCardDatas)
        return gangCardDatas
    },

    bao2Cai:function(cardData)
    {
        if(REPLACE_CARD_DATA != INVALID_CARD_DATA && cardData == REPLACE_CARD_DATA)
            cardData = cmdBaseWorker.cbMagicCardData[0]
        return cardData
    }, 
    cai2Bao:function(cardData)
    {
        if(REPLACE_CARD_DATA != INVALID_CARD_DATA && cardData == cmdBaseWorker.cbMagicCardData[0])
            cardData = REPLACE_CARD_DATA
        return cardData
    },
    getSortedOperateCardDatas:function(provideCardData, action)
    {
        switch(action)
        {
            case WIK_LEFT:
                return [provideCardData, cmdBaseWorker.cai2Bao(cmdBaseWorker.bao2Cai(provideCardData)+1), cmdBaseWorker.cai2Bao(cmdBaseWorker.bao2Cai(provideCardData)+2)]
            case WIK_CENTER:
                return [ cmdBaseWorker.cai2Bao(cmdBaseWorker.bao2Cai(provideCardData)-1), provideCardData, cmdBaseWorker.cai2Bao(cmdBaseWorker.bao2Cai(provideCardData)+1)]
            case WIK_RIGHT:
                return [cmdBaseWorker.cai2Bao(cmdBaseWorker.bao2Cai(provideCardData)-2), cmdBaseWorker.cai2Bao(cmdBaseWorker.bao2Cai(provideCardData)-1), provideCardData]
            case WIK_PENG:
                return [provideCardData, provideCardData, provideCardData]
            case WIK_GANG:
                return [provideCardData, provideCardData, provideCardData, provideCardData]
        }
    },
    //给服务器的OperateCardDatas 要求provideCardData排在最前面
    sortedOperateCardDatas2OperateCardDatas:function(provideCardData, sortedOperateCardDatas)
    {
        var operateCardDatas = clone(sortedOperateCardDatas)
        for(var i = 0;i<operateCardDatas.length;i++)
        {
            if(operateCardDatas[i] == provideCardData)
            {
                return operateCardDatas.splice(i, 1).concat(operateCardDatas)
            }
        }
    }, 
    sortHandCardDatas:function(cardDatas)//使用前 先将cardData=0过滤掉
    {
        return majiangFactory.sortCardDatasWithScore(cardDatas)
    },
    sortWeaveCardDatas:function(kind, cardDatas)
    {
        if(kind == WIK_RIGHT || kind==WIK_CENTER || kind==WIK_LEFT)
        {
            cardDatas.sort(function(a,b)
            {   
                return cmdBaseWorker.bao2Cai(a) - cmdBaseWorker.bao2Cai(b)
            })
        }

        return cardDatas
    },


}



