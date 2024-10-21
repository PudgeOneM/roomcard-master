
var cmdBaseWorker = 
{   
    lCellScore:null,
    cbGameType:0,
    bHaveSetType:false,
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
    isShowEggTime:false,
    cbUserTingMode:1,

    wLookBaoUser:INVALID_WORD,
    bLookedBao:false,
    bExistBao:false,

    //手牌 丢弃牌 动作牌 花牌
    cbHandCardCount:null,
    cbHandCardData:null,
    cbDiscardCount:null,
    cbDiscardCardData:null,
    cbWeaveCount:null,
    WeaveItemArray:null,
    cbPlayerFlowerCount:null,
    cbPlayerFlowerCardData:[[], [], [], []],
    cbListenUserEggItem:[[], []],
    bLookedBao:[false,false,false,false],
    cbEggStatus:0,
    stAddEggInfo:[],

    cbOperatePlayerHandCardCount:null,
    //库存相关
    cbLeftCardCount:null,
    cbEastUser:null,

    //允许出牌
    cbAllowTing:[],
    cbAllowTingCount:0,
    cbTingUser:[false, false, false, false],
    isLastFourCard:false,
    isAutoDisCard2:false,
    isAutoDisCard:false,
    cbListening:[false,false,false,false],
    cbTingUserRev:[],
    
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
    afterEatForbidCard:[],

    //用于客户端显示的辅助数据
    bIsRandBanker:null,
    cbCurFeng:INVALID_BYTE,
    cbWinnerClipValue:0,
    isWinnerVastZhang:false,
    dwChiHuKind:null,
    dwChiHuRight:null,
    lGameScore:null,
    lGangScore:null,
    wWinner:null,
    endType:null,
    wExitUser:INVALID_WORD,
    cbWinType:0,
    dwWinFan:0,
    dwWinFan2:0,
    isBaoZhuang:false,

    //其他
    cbSiceCount:null,
    cbCaiShenPos:null,
    TurnoverCard:null,
    cbChengBaoUser:null,
    cbFiveSTime:false,
    init:function()
    {   
    },
    onReStart:function()
    {
        cmdBaseWorker.wBankerUser       = INVALID_WORD
        cmdBaseWorker.wTakeCardUser     = INVALID_WORD
        cmdBaseWorker.wCurrentUser      = INVALID_WORD//当前需要出牌的玩家 m_wCurrentUser=INVALID_CHAIR时表示没人能出牌 在吃碰杠状态
        cmdBaseWorker.wOutCardUser      = INVALID_WORD
        cmdBaseWorker.wLookBaoUser      = INVALID_WORD
        cmdBaseWorker.bLookedBao        = false
        cmdBaseWorker.bExistBao         = false
        cmdBaseWorker.cbPlayerFlowerCardData = [[], [], [], []]
        cmdBaseWorker.isShowEggTime     = false
        cmdBaseWorker.cbUserTingMode    = 1
        cmdBaseWorker.cbMagicCardData   = []
        cmdBaseWorker.cbFlowerCardData  = []
        cmdBaseWorker.cbAllowTingCount  = 0
        cmdBaseWorker.isLastFourCard    = false
        cmdBaseWorker.isAutoDisCard2   = false
        cmdBaseWorker.isAutoDisCard     = false
        for (var i = 0; i < GAME_PLAYER; i++)
        {
            cmdBaseWorker.cbTingUserRev[i] = INVALID_BYTE
            cmdBaseWorker.cbListening[i]   = false
            cmdBaseWorker.cbTingUser[i]    = 0
            cmdBaseWorker.cbListenUserEggItem[i] = [0, 0]
            cmdBaseWorker.bLookedBao[i]    = false
        }
        cmdBaseWorker.cbEggStatus       = 0
        cmdBaseWorker.stAddEggInfo      = []
        cmdBaseWorker.cbAllowTing       = []
        cmdBaseWorker.cbCurFeng         = INVALID_BYTE
        cmdBaseWorker.cbWinnerClipValue = 0
        cmdBaseWorker.isWinnerVastZhang = false
        cmdBaseWorker.afterEatForbidCard= []
        cmdBaseWorker.wResumeUser       = INVALID_WORD //用于如果所有人都‘过’时发牌
        cmdBaseWorker.wOperateUser      = INVALID_WORD
        cmdBaseWorker.wProvideUser      = INVALID_WORD
        cmdBaseWorker.wExitUser         = INVALID_WORD
        cmdBaseWorker.cbOutCardCount    = 0 
        cmdBaseWorker.cbOperatePlayerHandCardCount  = 0
        cmdBaseWorker.cbChengBaoUser    = null
        cmdBaseWorker.isBaoZhuang       = false
        cmdBaseWorker.cbWinType         = 0
        cmdBaseWorker.dwWinFan          = 0
        cmdBaseWorker.dwWinFan2         = 0
        cmdBaseWorker.cbFiveSTime       = false
    },
    onCMD_StatusFree:function(body) 
    {
        cmdBaseWorker.lCellScore = body.lCellScore
        cmdBaseWorker.cbGameType   = body.cbGameType
        cmdBaseWorker.bHaveSetType = body.bHaveSetType
    },
    onCMD_StatusCall:function(body) 
    {
    },
    onCMD_StatusPlay:function(body) 
    {	
        cmdBaseWorker.wBankerUser     =  tableData.getUserWithUserId(body.rrr).wChairID   
        cmdBaseWorker.cbActionMask    = body.cbActionMask   
        cmdBaseWorker.wProvideUser    = body.wProvideUser   
        cmdBaseWorker.cbEastUser      = tableData.getUserWithUserId(body.dwEastUser).wChairID
        cmdBaseWorker.cbProvideCardData    = body.cbProvideCardData   
        cmdBaseWorker.lCellScore      = body.lCellScore      
        cmdBaseWorker.wCurrentUser    = body.wCurrentUser

        cmdBaseWorker.cbTingUser     = body.cbUserListen 
        cmdBaseWorker.cbListenUserEggItem = body.cbListenUserEggItem
        cmdBaseWorker.bLookedBao     = body.bLookedBao

        cmdBaseWorker.cbAllowTingCount = body.cbAllowTingCount
        cmdBaseWorker.cbAllowTing = body.cbAllowTing.slice(0, cmdBaseWorker.cbAllowTingCount)
        cmdBaseWorker.cbListening = body.isFinishTing
        cmdBaseWorker.cbTingUserRev = body.cbTingUserRev
        cmdBaseWorker.isAutoDisCard = body.isAutoDiscard
        cmdBaseWorker.isAutoDisCard2 = body.isAutoDisCard2

        cmdBaseWorker.isLastFourCard= body.isLastFourCard
        cmdBaseWorker.isShowEggTime = body.isShowEggTime
 
        cmdBaseWorker.cbLeftCardCount = body.cbLeftCardCount 
        cmdBaseWorker.cbCurFeng       = body.cbCurFeng
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
                cmdBaseWorker.cbHandCardData[i][j] = isSelf?body.cbHandCardData[j]:0
        }

        cmdBaseWorker.cbGameType   = body.cbGameType
        cmdBaseWorker.bHaveSetType = body.bHaveSetType

        cmdBaseWorker.cbFengCardCount = body.cbFengCardCount
        cmdBaseWorker.cbPlayerFlowerCount = body.cbPlayerFlowerCount   

        for(var i=0;i<GAME_PLAYER;i++)
            cmdBaseWorker.cbPlayerFlowerCardData[i]  = [] 

        cmdBaseWorker.cbMagicCardData  = body.cbMagicCardData  
        cmdBaseWorker.cbFlowerCardData  = body.cbFlowerCardData    

        cmdBaseWorker.wHeapHead     = body.wHeapHead   
        cmdBaseWorker.wHeapTail     = body.wHeapTail   
        cmdBaseWorker.cbHeapCardInfo= body.cbHeapCardInfo   
        cmdBaseWorker.TurnoverCard  = body.TurnoverCard   
        cmdBaseWorker.cbWeaveCount    = body.cbWeaveCount    
        cmdBaseWorker.WeaveItemArray  = body.WeaveItemArray  

        for(var i=0;i<GAME_PLAYER;i++)
        {
            var weaveItems = cmdBaseWorker.WeaveItemArray[i]
            //组合牌
            for(var j=0;j<MAX_WEAVE;j++)
            {
                var t = weaveItems[j].cbCardData || weaveItems[j].cbCardDatas
                for(var jj=0;jj<t.length;jj++)
                {
                    if(t[jj]==0)
                        t.splice(jj, 1)
                }

                weaveItems[j].cbValidCardDatas = clone(t)
                weaveItems[j].cbChangeCardDatas = clone(t)
            }
        }
    },
    onCMD_Call:function(body) 
    { 
    },
    onCMD_GameStart:function(body) 
    {
        cmdBaseWorker.cbLeftCardCount =  body.cbLeftCardCount
        cmdBaseWorker.cbEastUser        = tableData.getUserWithUserId(body.dwEastUser).wChairID 
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
		cmdBaseWorker.cbMagicCardData   = body.cbMagicCardData   
        cmdBaseWorker.cbFlowerCardData  = body.cbFlowerCardData    
        cmdBaseWorker.bIsRandBanker     = body.bIsRandBanker   

        cmdBaseWorker.cbSiceCount       = body.cbSiceCount  
        cmdBaseWorker.cbCaiShenPos      = body.cbCaiShenPos 

        cmdBaseWorker.wHeapHead         = body.wHeapHead   
        cmdBaseWorker.wHeapTail         = body.wHeapTail   
        cmdBaseWorker.cbHeapCardInfo    = body.cbHeapCardInfo   
        cmdBaseWorker.TurnoverCard      = body.TurnoverCard   
        cmdBaseWorker.cbCurFeng         = body.cbCurFeng

        cmdBaseWorker.cbOutCardCount = 0  
        cmdBaseWorker.cbPlayerFlowerCount = [0, 0, 0, 0]
        cmdBaseWorker.cbPlayerFlowerCardData    = [[], [], [], []]
        cmdBaseWorker.cbFengCardCount = 0
        cmdBaseWorker.cbFengCardData = []
        cmdBaseWorker.cbWinnerClipValue = 0
    },
    onCMD_OutCard:function(body)
    {
        cmdBaseWorker.cbActionMask     = body.cbActionMask   
        cmdBaseWorker.wProvideUser     = body.wOutCardUser 
        cmdBaseWorker.cbProvideCardData= body.cbOutCardData    
        cmdBaseWorker.cbUserTingMode   = body.cbUserTingMode

        cmdBaseWorker.wOutCardUser = body.wOutCardUser
        cmdBaseWorker.cbOutCardData = body.cbOutCardData
        cmdBaseWorker.wCurrentUser = INVALID_WORD
        cmdBaseWorker.cbListening = body.isFinishTing
 
        cmdBaseWorker.cbOutCardCount += 1
    },
    onCMD_SendCard:function(body) 
    {
        cmdBaseWorker.cbActionMask    = body.cbActionMask   
        cmdBaseWorker.wProvideUser    = body.wProvideUser 
        cmdBaseWorker.cbProvideCardData    = body.cbProvideCardData    

        cmdBaseWorker.wCurrentUser = body.wCurrentUser
        cmdBaseWorker.wTakeCardUser = body.wTakeCardUser
        cmdBaseWorker.cbSendCardCount = body.cbSendCardCount
        cmdBaseWorker.sendCardArray = body.sendCardArray
        cmdBaseWorker.isLastFourCard = body.isLastFourCard
        cmdBaseWorker.isAutoDisCard = body.isAutoDisCard
        cmdBaseWorker.cbListenUserEggItem = body.cbListenUserEggItem
        cmdBaseWorker.cbLeftCardCount = cmdBaseWorker.cbLeftCardCount - cmdBaseWorker.cbSendCardCount  
    },
    CMD_S_LookBao:function(body)
    {
        cmdBaseWorker.cbActionMask    = body.cbActionMask   
        cmdBaseWorker.wLookBaoUser    = body.wLookBaoUser   
    },
    CMD_S_ChangeBao:function(body)
    {
        cmdBaseWorker.bLookedBao      = body.bLookedBao
        cmdBaseWorker.bExistBao       = body.bExistBao
        cmdBaseWorker.TurnoverCard    = body.TurnoverCard   
    },
    onCMD_S_OperateEggRes:function(body)
    {
        cmdBaseWorker.cbOperateCode = body.cbOperateCode
        cmdBaseWorker.wOperateUser  = body.wOperateUser
        var isSelf = tableData.getUserWithUserId(selfdwUserID).wChairID == cmdBaseWorker.wOperateUser
        if (isSelf)
            cmdBaseWorker.cbActionMask  = body.cbActionMask   
        cmdBaseWorker.cbOperateCardCount = body.cbOperateCardCount
        cmdBaseWorker.cbOperateCardData = body.cbOperateCardData.slice(0, body.cbOperateCardCount)
    },
    onCMD_S_OperateEggEnd:function(body)
    {
        cmdBaseWorker.wCurrentUser = body.wCurrentUser
    },
    onCMD_OperateResult:function(body) 
    {
        cmdBaseWorker.cbActionMask    = body.cbActionMask   
        cmdBaseWorker.wProvideUser    = body.wProvideUser   
        cmdBaseWorker.cbProvideCardData = body.cbProvideCardData    
        cmdBaseWorker.cbOperatePlayerHandCardCount = body.cbHandCardCount
        cmdBaseWorker.wCurrentUser = body.wCurrentUser
        cmdBaseWorker.cbOperateCode = body.cbOperateCode
        cmdBaseWorker.wOperateUser = body.wOperateUser
        cmdBaseWorker.cbOperateCardCount = body.cbOperateCardCount
        cmdBaseWorker.TurnoverCard      = body.TurnoverCard   
        cmdBaseWorker.cbEggStatus   = body.cbEggStatus
        cmdBaseWorker.stAddEggInfo  = body.stAddEggInfo
        cmdBaseWorker.isShowEggTime = body.isShowEggTime
        cmdBaseWorker.cbUserTingMode= body.cbUserTingMode

        cmdBaseWorker.cbListenUserEggItem = body.cbListenUserEggItem
        cmdBaseWorker.cbTingUserRev = body.cbTingUserRev
        cmdBaseWorker.isAutoDisCard = body.isAutoDisCard
        cmdBaseWorker.cbAllowTingCount = body.cbAllowTingCount
        cmdBaseWorker.cbAllowTing = body.cbAllowTing.slice(0, cmdBaseWorker.cbAllowTingCount)
        cmdBaseWorker.cbOperateCardData = body.cbOperateCardData.slice(0, body.cbOperateCardCount)
    },
    onSMD_GameType:function(body)
    {
        cmdBaseWorker.cbGameType      =  body.cbGameType
        cmdBaseWorker.bHaveSetType    =  true
    },
    onCMD_GameEnd:function(body) 
    {
        cmdBaseWorker.wExitUser       = body.wExitUser
        cmdBaseWorker.wProvideUser    = body.wProvideUser
        cmdBaseWorker.cbProvideCardData   = body.cbProvideCardData
        cmdBaseWorker.dwChiHuKind     = body.dwChiHuKind
        cmdBaseWorker.dwChiHuRight    = body.dwChiHuRight
        cmdBaseWorker.lGameScore      = body.lGameScore

        cmdBaseWorker.lGangScore      = body.lGangScore
        cmdBaseWorker.isBaoZhuang     = body.isBaoZhuang
        cmdBaseWorker.cbWinType       = body.cbWinType
        cmdBaseWorker.dwWinFan        = body.dwWinFan
        cmdBaseWorker.dwWinFan2       = body.dwWinFan2

        cmdBaseWorker.cbChengBaoUser  = body.cbChengBaoUser
        cmdBaseWorker.wWinner         = body.wWinner
        cmdBaseWorker.endType         = body.endType
        cmdBaseWorker.cbWinnerClipValue=body.cbWinnerClipValue
        cmdBaseWorker.isWinnerVastZhang=body.isWinnerVastZhang

        cmdBaseWorker.cbWeaveCount    = body.cbWeaveCount    
        cmdBaseWorker.WeaveItemArray  = body.WeaveItemArray  
        cmdBaseWorker.stAddEggInfo    = body.stAddEggInfo
        cmdBaseWorker.cbHandCardCount = body.cbHandCardCount
        for(var i=0;i<GAME_PLAYER;i++)
        {
            cmdBaseWorker.cbHandCardData[i] = body.cbHandCardData[i].slice(0, cmdBaseWorker.cbHandCardCount[i])
        }

        for(var i=0;i<GAME_PLAYER;i++)
        {
            var weaveItems = cmdBaseWorker.WeaveItemArray[i]
            //组合牌
            for(var j=0;j<MAX_WEAVE;j++)
            {
                var t = weaveItems[j].cbCardData || weaveItems[j].cbCardDatas
                for(var jj=0;jj<t.length;jj++)
                {
                    if(t[jj]==0)
                        t.splice(jj, 1)
                }

                weaveItems[j].cbValidCardDatas = clone(t)
                weaveItems[j].cbChangeCardDatas = clone(t)
            }
        }
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

        if((acitonMask&WIK_SHOWEGG)!=0)
            actions[actions.length] = WIK_SHOWEGG

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
            case WIK_SHOWEGG:
                return 'egg'
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
    sendMessage_Ting:function(operateCards)
    {
        CMD_C_OperateCard[2][2] = operateCards.length
        var OperateCard = getObjWithStructName('CMD_C_OperateCard')
        OperateCard.cbOperateCode = WIK_LISTEN
        OperateCard.cbOperateCardCount = operateCards.length
        OperateCard.cbOperateCardData = operateCards
        socket.sendMessage(MDM_GF_GAME,SUB_C_OPERATE_CARD,OperateCard)
    },
    sendMessage_ShowEgg:function(operateCards)
    {
        CMD_C_OperateCard[2][2] = operateCards.length
        var OperateCard = getObjWithStructName('CMD_C_OperateCard')
        OperateCard.cbOperateCode = WIK_SHOWEGG
        OperateCard.cbOperateCardCount = operateCards.length
        OperateCard.cbOperateCardData = operateCards
        socket.sendMessage(MDM_GF_GAME,SUB_C_OPERATE_CARD,OperateCard)
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
        var selfChairId = tableData.getUserWithUserId(selfdwUserID).wChairID
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
            if(i>0 && idx == handIdxs[i-1] || cmdBaseWorker.isMagicCard(idx, cmdBaseWorker.cbMagicCardData))
                continue

            if (cmdBaseWorker.cbTingUser[selfChairId] != 0)
            { // 听牌 状况 只允许当前牌杠
                if (idx != cmdBaseWorker.cbProvideCardData)
                    continue
            }

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
    getEggGroup:function(serchFengIdx, serchZiIdx, YiSuoAmount)
    {
        var idxs = []

        if (YiSuoAmount >= 2)
        {
            for (var i = 0; i < serchFengIdx.length; i++)
                idxs[idxs.length] = [0x11, 0x11, serchFengIdx[i]]

            for (var i = 0; i < serchZiIdx.length; i++)
                idxs[idxs.length] = [0x11, 0x11, serchZiIdx[i]]
        }
        if (YiSuoAmount > 0)
        {
            serchFengIdx[serchFengIdx.length] = 0x11
            serchZiIdx[serchZiIdx.length] = 0x11
        }

        for (var i = 0; i < serchFengIdx.length; i++)
        {
            for (var j = i+1; j < serchFengIdx.length; j++)
            {
                for (var k = j+1; k < serchFengIdx.length; k++)
                {
                    idxs[idxs.length] = [serchFengIdx[i], serchFengIdx[j], serchFengIdx[k]]
                }
            }
        }

        for (var i = 0; i < serchZiIdx.length; i++)
        {
            for (var j = i+1; j < serchZiIdx.length; j++)
            {
                for (var k = j+1; k < serchZiIdx.length; k++)
                {
                    idxs[idxs.length] = [serchZiIdx[i], serchZiIdx[j], serchZiIdx[k]]
                }
            }
        }

        return idxs
    },
    searchEggIdxs:function(handMajiangs, weaveMajiangs)
    {
        var selfChairId = tableData.getUserWithUserId(selfdwUserID).wChairID
        var handIdxs = handMajiangs[1]?[handMajiangs[1].cardData]:[]
        for(var i=0;i<handMajiangs[0].length;i++)
            handIdxs[handIdxs.length] = handMajiangs[0][i].cardData

        majiangLogic.sortWithCardData(handIdxs)

        /////////增蛋
        var isCalYiTiao = false
        var isExistFeng = false
        var isExistZi   = false
        var showEggsIdxs = []
        for(var i=0; i<weaveMajiangs.length; i++)
        {
            var majiangsOneGroup = weaveMajiangs[i]
            if(majiangsOneGroup.cbWeaveKind == WIK_SHOWEGG)
            {
                for (var j = 0; j < majiangsOneGroup.length; j++)
                {
                    if (majiangsOneGroup[j].cardData >= 0x31 && majiangsOneGroup[j].cardData <= 0x34)
                    { // 东南西北
                        isExistFeng = true;
                        for(var k=0; k<handIdxs.length; k++)
                        {
                            var idx = handIdxs[k]
                            if(k>0 && idx == handIdxs[k-1])
                                continue
                            if (idx >= 0x31 && idx <= 0x34 || (idx == 0x11 && isCalYiTiao == false))
                            {
                                showEggsIdxs[showEggsIdxs.length] = [idx]
                                if (idx == 0x11)
                                    isCalYiTiao = true
                            }
                        }

                        break
                    }   
                    else if (majiangsOneGroup[j].cardData >= 0x35 && majiangsOneGroup[j].cardData <= 0x37)
                    { // 中发白
                        isExistZi   = true;
                        for(var k=0; k<handIdxs.length; k++)
                        {
                            var idx = handIdxs[k]
                            if(k>0 && idx == handIdxs[k-1])
                                continue
                            if (idx >= 0x35 && idx <= 0x37 || (idx == 0x11 && isCalYiTiao == false))
                            {
                                showEggsIdxs[showEggsIdxs.length] = [idx]
                                if (idx == 0x11)
                                    isCalYiTiao = true
                            }
                        }

                        break
                    }
                }
            }
        }

        //下蛋
        var serchFengIdx = []
        var serchZiIdx   = []
        var YiSuoAmount = 0
        for(var i=0; i<handIdxs.length; i++)
        {
            var idx = handIdxs[i]
            if (idx == 0x11)
                YiSuoAmount++
            if(i>0 && idx == handIdxs[i-1])
                continue

            if (idx >= 0x31 && idx <= 0x34 && !isExistFeng)
                serchFengIdx[serchFengIdx.length] = idx
            else if (idx >= 0x35 && idx <= 0x37 && !isExistZi)
                serchZiIdx[serchZiIdx.length] = idx
        }
        if (cmdBaseWorker.isShowEggTime == true)
            showEggsIdxs = []
        var eggGroup = cmdBaseWorker.getEggGroup(serchFengIdx, serchZiIdx, YiSuoAmount)
        showEggsIdxs = showEggsIdxs.concat(eggGroup)

///////////////////////////////////////////////////////////
        if (cmdBaseWorker.cbTingUser[selfChairId] != 0 && showEggsIdxs.length > 1)
        { //wanjia听 则需要按照服务器的听牌item来确定
            var idxsArray = []
            for (var j =0; j < 2; j++)
            {
                if (cmdBaseWorker.cbListenUserEggItem[selfChairId][j] == 0)
                    continue

                for(var k=0; k<showEggsIdxs.length; k++)
                {
                    var eggLength = showEggsIdxs[k].length
                    if (eggLength == 3)
                    {
                        if (showEggsIdxs[k][0] >= 0x35 && showEggsIdxs[k][0] <= 0x37)
                        {
                            if (cmdBaseWorker.cbListenUserEggItem[selfChairId][0]==0x38 || cmdBaseWorker.cbListenUserEggItem[selfChairId][1]==0x38)
                                idxsArray[idxsArray.length] = showEggsIdxs[k]
                        }
                    }
                    else if (eggLength == 1)
                    {
                        if (cmdBaseWorker.cbListenUserEggItem[selfChairId][0]==showEggsIdxs[k][0] || cmdBaseWorker.cbListenUserEggItem[selfChairId][1]==showEggsIdxs[k][0])
                            idxsArray[idxsArray.length] = showEggsIdxs[k]
                    }
                }
                break
            }

            return idxsArray
        }

        return showEggsIdxs
    },
    showChoosePopOfAction:function(cardDatasArray, actionArray, actionCall)
    { 
        var len = actionArray.length
        var last= len
        var curLine = 0
        for(var i=0;i<len;i++)
        {
            var cardDatas = cardDatasArray[i]
            var chooseItem = cmdBaseWorker._getChooseItemOfAction(cardDatas, actionArray[i], actionCall)

            if (i%4 == 0 && i != 0)
            {
                curLine++
                last -= 4
            }

            if (last >= 4)
                chooseItem.x = ( i%4 - (4-1)/2 ) * (62*3 + 30) - 30//(majiangFactory.scale_upDown*majiangFactory.chooseItemMjScale*majiangFactory.downHandIntervalX*3 + 30)
            else
                chooseItem.x = ( i%4 - (last-1)/2 ) * (62*3 + 30) - 30//(majiangFactory.scale_upDown*majiangFactory.chooseItemMjScale*majiangFactory.downHandIntervalX*3 + 30)

            chooseItem.y = curLine * (61 + 40)//(majiangFactory.scale_upDown*majiangFactory.chooseItemMjScale*majiangFactory.down_handHeight + 25)
            majiangFactory.chooseItemsNode.addChild(chooseItem)
        }
    },
    _getChooseItemOfAction:function(sortedOperateCardDatas, action, actionCall)
    {        
        var chooseItem = new cc.Node()
        ////////////////////////////
        var showLen = sortedOperateCardDatas.length
        for(var i=0;i<showLen;i++)
        {
            var where = {}
            where.name = 'hand'
            where.data = {idx:0}
            var mj = majiangFactory.getOne(sortedOperateCardDatas[i], 0, where)
            mj.isIgnoreDecorate = true
            mj.setScale(62/84)
            mj.x = ( i - (showLen-1)/2 )*62
            mj.y = 0
            if( (action == WIK_LEFT && i==0) || (action == WIK_CENTER && i==1) || (action == WIK_RIGHT && i==2) )
            {
                // provideCardData = i
                mj.color = cc.color(122, 122, 122)
            }

            chooseItem.addChild(mj)
        }
        ////////////////////////////
        var bg = new cc.Scale9Sprite('mf_chooseItemBg.png')
        bg.width = showLen == 4 ? 260 : 196
        bg.height = 90
        chooseItem.addChild(bg, -1)
        chooseItem.bg = bg

        var listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget()
                var locationInNode = target.convertToNodeSpace(touch.getLocation())
                var rect = cc.rect(0, 0, target.getContentSize().width, target.getContentSize().height)
                var isTouchInNode = cc.rectContainsPoint(rect, locationInNode)
                if (isTouchInNode) {
                    return true
                }
                return false
            },
            onTouchEnded: function (touch, event) {
                var target = event.getCurrentTarget()
                var locationInNode = target.convertToNodeSpace(touch.getLocation())
                var rect = cc.rect(0, 0, target.getContentSize().width, target.getContentSize().height)
                var isTouchInNode = cc.rectContainsPoint(rect, locationInNode)
                if (isTouchInNode) {
                    majiangFactory.chooseItemsNode.removeAllChildren()
                    actionCall?actionCall(sortedOperateCardDatas, action):''
                }
            }
        })
        cc.eventManager.addListener(listener, bg)

        return chooseItem
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
    isFlowerCard:function(idx, cbFlowerCardData) 
    {
        for(var i=0;i<cbFlowerCardData.length;i++)
        {
            if(idx==cbFlowerCardData[i])
                return true
        }

        return false
    },
    isCaiHua:function(cardData)
    {
        var isMagic = false
        var isHua = false
        var cbColor=(cmdBaseWorker.cbMagicCardData[0]&MASK_COLOR)>>4;
        var cbValue=cmdBaseWorker.cbMagicCardData[0]&MASK_VALUE;
        if (cbColor == 4)
            isHua = true

        if (isHua)
        {
            if (cbValue <= 4)
            {
                if (cardData >= 0x41 && cardData <= 0x44)
                    isMagic = true
            }
            else
            {
                if (cardData >= 0x45 && cardData <= 0x48)
                    isMagic = true
            }
        }

        return isMagic
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
    setTingLogo:function(chairid)
    {
        var user = tableData.getUserWithTableIdAndChairId(self.wTableID, chairid)
        var tingNode = user.userNodeInsetChair.currentRoundNode.tingNode
        tingNode.removeAllChildren()

        if (cmdBaseWorker.cbTingUser[chairid] == 1)
        {
            var ting = new cc.Sprite("#" + 'ting.png')
            tingNode.addChild(ting)
        }
        else if (cmdBaseWorker.cbTingUser[chairid] == 2)
        {
            var ting = new cc.Sprite("#" + 'qiting.png')
            tingNode.addChild(ting)
        }
    },
    userTing:function(chairid)
    {
        var selfChairId = tableData.getUserWithUserId(selfdwUserID).wChairID

        // var user = tableData.getUserWithTableIdAndChairId(self.wTableID, chairid)
        // var tingNode = user.userNodeInsetChair.currentRoundNode.tingNode

        // if (cmdBaseWorker.cbTingUser[chairid] == 1)
        // {
        //     var ting = new cc.Sprite("#" + 'ting.png')
        //     tingNode.addChild(ting)
        // }
        // else if (cmdBaseWorker.cbTingUser[chairid] == 2)
        // {
        //     var ting = new cc.Sprite("#" + 'qiting.png')
        //     tingNode.addChild(ting)
        // }

        cmdBaseWorker.setTingLogo(chairid)
        if (chairid != selfChairId)
            return

        if (cmdBaseWorker.cbListening[chairid] == false)
        {
            if (cmdBaseWorker.cbTingUser[selfChairId] != 0)
            {
                var curDir = tableData.getShowChairIdWithServerChairId(selfChairId)  
                var majiangs = playNode.handMajiangs4D[curDir]
                for(var j=0;j<majiangs[0].length;j++)
                {
                    var majiang = majiangs[0][j]
                    if (majiang)
                        cmdBaseWorker.setForbidMajiangColor(majiang, selfChairId)
                }

                var majiang = playNode.handMajiangs4D[curDir][1]
                if (majiang)
                    cmdBaseWorker.setForbidMajiangColor(majiang, selfChairId)
            }
        }
    },
    setForbidMajiangColor:function(majiang, id)
    {
        var CardData = majiang.cardData
        var isForbid = false
        for (var i=0; i < cmdBaseWorker.cbAllowTingCount; i++)
        {
            if (CardData == cmdBaseWorker.cbAllowTing[i])
            {
                isForbid = true
                break
            }
        }

        if (isForbid == false)
        {
            majiang.color = cc.color(180,180,180)
            var zi = majiang.getChildByTag(101)
            if (zi)
                zi.color = cc.color(180,180,180)
        }
    },
    isForbidMajiang:function(majiang, operateUser)
    {
        if (cmdBaseWorker.cbTingUser[operateUser] == 0) 
            return false

        var isForbid = true
        var CardData = majiang.cardData
        for (var i=0; i < cmdBaseWorker.cbAllowTingCount; i++)
        {
            if (CardData == cmdBaseWorker.cbAllowTing[i])
            {
                isForbid = false
                break
            }
        }
        return isForbid
    },
    setMajiangColorNor:function()
    {
        var selfChairId = tableData.getUserWithUserId(selfdwUserID).wChairID
        if (cmdBaseWorker.cbTingUser[selfChairId] != 0)
        {
            var curDir = tableData.getShowChairIdWithServerChairId(selfChairId)  
            var majiangs = playNode.handMajiangs4D[curDir]
            for(var j=0;j<majiangs[0].length;j++)
            {
                var majiang = majiangs[0][j]
                majiang.color = cc.color(255,255,255)
                var zi = majiang.getChildByTag(101)
                if (zi)
                    zi.color = cc.color(255,255,255)
            }

            var majiang = playNode.handMajiangs4D[curDir][1]
            if (majiang)
            {
                majiang.color = cc.color(255,255,255)
                var zi = majiang.getChildByTag(101)
                if (zi)
                    zi.color = cc.color(255,255,255)
            }
        }
    },
    autoDisCard:function(cardData)
    {
        var a = cc.sequence( 
            cc.delayTime(0.8),
            cc.callFunc(function()
            {   
                var OutCard = getObjWithStructName('CMD_C_OutCard')
                OutCard.cbOutCardData = cardData
                socket.sendMessage(MDM_GF_GAME,SUB_C_OUT_CARD,OutCard)
                playNode.hideActionBtns()
            }) 
        )           
        playNode.node.runAction(a)
    },
    ///////////////////////////operate////////////////////////////
    //处理吃碰杠 主要会调用到手牌堆、丢弃牌堆、吃碰杠牌堆的‘增删减查’
    onActionResult:function(action, cardDatas, operateUser, provideUser, majiangs4W4D, handGroupNode4D)
    {
        if(action==WIK_GANG)
            majiangFactory.onActionGang(cardDatas, operateUser, provideUser, majiangs4W4D, handGroupNode4D)
        else if(action == WIK_PENG)
            cmdBaseWorker.onActionPeng(cardDatas, operateUser, provideUser, majiangs4W4D, handGroupNode4D)
        else if(action == WIK_LEFT)
            majiangFactory.onActionChi(action, cardDatas, operateUser, provideUser, majiangs4W4D, handGroupNode4D)
        else if(action == WIK_CENTER)
            majiangFactory.onActionChi(action, cardDatas, operateUser, provideUser, majiangs4W4D, handGroupNode4D)
        else if(action == WIK_RIGHT)
            majiangFactory.onActionChi(action, cardDatas, operateUser, provideUser, majiangs4W4D, handGroupNode4D)
        else if (action == WIK_SHOWEGG)
            cmdBaseWorker.onActionEgg(cardDatas, operateUser, provideUser, majiangs4W4D, handGroupNode4D)
    },
    onActionPeng:function(cardDatas, operateUser, provideUser, majiangs4W4D, handGroupNode4D)
    {
        var cardData = cardDatas[0]
        var operateUserDir = tableData.getShowChairIdWithServerChairId(operateUser.wChairID)
        var provideUserDir = tableData.getShowChairIdWithServerChairId(provideUser.wChairID)
        var operateWeaveMajiangs = majiangs4W4D.weaveMajiangs4D[operateUserDir]
        var operateHandMajiangs = majiangs4W4D.handMajiangs4D[operateUserDir]
        var provideDiscardMajiangs = majiangs4W4D.discardMajiangs4D[provideUserDir]

        var weaveCardDatas = [cardData, cardData, cardData]

        if(operateUser.dwUserID == selfdwUserID)
        {
            var deleteCardDatas = [cardData, cardData]
        }
        else
            var deleteCardDatas = [0, 0]

        //////
        if (cmdBaseWorker.stAddEggInfo.bIsQEgg == true)// 补蛋状态
            cmdBaseWorker.toDealQEgg(cmdBaseWorker.stAddEggInfo)
        else //普通碰牌
            majiangFactory.popDiscardMajiangs(provideDiscardMajiangs)

        for(var i=0;i<deleteCardDatas.length;i++)
        {
            majiangFactory.deleteHandMajiangs(operateHandMajiangs, operateUserDir, deleteCardDatas[i])
        }

        var self = tableData.getUserWithUserId(selfdwUserID)
        var selfDir = tableData.getShowChairIdWithServerChairId(self.wChairID)
        cmdBaseWorker.addWeaveMajiangs1(operateWeaveMajiangs, operateUserDir, 
        {
            'cbCardDatas':weaveCardDatas,
            'cbValidCardDatas':weaveCardDatas,
            'cbChangeCardDatas':weaveCardDatas,
            'wProvideUser':provideUser.wChairID,
            'provideDirection':provideUserDir,
            'cbCenterCardData':cardData,
            'cbWeaveKind':WIK_PENG,
            'cbPublicCard':1,
        }, 
        playNode.mjsNode,
        selfDir,
        majiangFactory.isPublicAnGang
        )
       
        var maxCardData = operateHandMajiangs[0][operateHandMajiangs[0].length-1].cardData
        majiangFactory.deleteHandMajiangs(operateHandMajiangs, operateUserDir, maxCardData)
        majiangFactory.addHandMajiangNew(operateHandMajiangs, operateUserDir, maxCardData, 
                playNode.mjsNode)
    },
    addWeaveMajiangs1:function(majiangsOneDirection, direction, weaveItem, parent, selfDirection)
    {
        var isPublicAnGang = majiangFactory.isPublicAnGang
        var groupIdx = majiangsOneDirection.length
        var isSelf = selfDirection == direction
        var majiangsOneGroup = cmdBaseWorker.weaveItem2Majiangs1(majiangsOneDirection, groupIdx, direction, weaveItem, isSelf, isPublicAnGang)
        for(var i=0;i<majiangsOneGroup.length;i++)
        {
            parent.addChild(majiangsOneGroup[i])
        }
        majiangsOneDirection[groupIdx] = majiangsOneGroup
    },
    weaveItem2Majiangs1:function(majiangsOneDirection, groupIdx, direction, weaveItem, isSelf, isPublicAnGang)
    {
        var cbValidCardDatas = weaveItem.cbValidCardDatas
        var wProvideUser = weaveItem.wProvideUser
        var provideShowChairId = tableData.getShowChairIdWithServerChairId(wProvideUser)
        var provideDirection = majiangFactory.showChairId2Direction(provideShowChairId)

        var operateUser = tableData.getServerChairIdWithShowChairId(direction)

        var arrowIdx = -1
        if(provideDirection!=direction)
        {
            if(weaveItem.cbWeaveKind == WIK_LEFT)
                arrowIdx = 0
            else if(weaveItem.cbWeaveKind == WIK_CENTER)
                arrowIdx = 1
            else if(weaveItem.cbWeaveKind == WIK_RIGHT)
                arrowIdx = 2      
            else if(weaveItem.cbWeaveKind == WIK_PENG)
                arrowIdx = 1    
            else if(weaveItem.cbWeaveKind&(WIK_GANG|WIK_MINGANG|WIK_ANGANG|WIK_PENGGANG))
                arrowIdx = 3   
        }

        var majiangs = []
        for(var i=0;i<cbValidCardDatas.length;i++)
        {
            var cardData = cbValidCardDatas[i]
            if(weaveItem.cbWeaveKind==WIK_ANGANG)
            {
                if(i<3)
                    cardData = 0
                else if( tableData.getUserWithUserId(selfdwUserID).wChairID!=operateUser && !isPublicAnGang)
                    cardData = 0
            }
            var where = {}
            where.name = 'weave'
            where.data = {weaveIdx:groupIdx, idxInWeave:i}

            var mj = majiangFactory.getOne(cardData, direction, where)

            if(i == arrowIdx)
            {
                var zi = mj.getChildByTag(101)
                var directionSpr = new cc.Sprite('#mf_weaveDirection.png')
                directionSpr.setRotation(180-provideDirection*90 - zi.getRotation())

                directionSpr.x = zi.width*0.5
                directionSpr.y = 10
                directionSpr.scale = direction==0?1:1.4

                zi.addChild(directionSpr, 0, 101)
            }

            majiangs[majiangs.length] = mj
        }  
        majiangs.weaveItem = weaveItem
        majiangs.cbWeaveKind = weaveItem.cbWeaveKind

        return majiangs
    },
    ///////////蛋相关
    onActionEgg:function(cardDatas, operateUser, provideUser, majiangs4W4D, handGroupNode4D)
    {
        var operateUserDir = tableData.getShowChairIdWithServerChairId(operateUser.wChairID)
        var operateWeaveMajiangs = majiangs4W4D.weaveMajiangs4D[operateUserDir]
        var operateHandMajiangs = majiangs4W4D.handMajiangs4D[operateUserDir]

         var isHaveNewMj = false
        if (operateHandMajiangs[1])
            isHaveNewMj = true

        // 补蛋
        if (cardDatas.length == 1)
        {
            var isExist = false
            for(var i=0;i<operateWeaveMajiangs.length;i++)
            {
                var majiangsOneGroup = operateWeaveMajiangs[i]
                if(majiangsOneGroup.cbWeaveKind == WIK_SHOWEGG)
                { 
                   for (var j = 0; j < majiangsOneGroup.length; j++)
                    {
                        var majiang = majiangsOneGroup[j]
                        if (majiang.cardData == cardDatas[0])
                        { //已添加  数字增加以下
                            var amountTTF = majiang.getChildByTag(881)
                            if (amountTTF)
                                amountTTF.setString('x'+cmdBaseWorker.stAddEggInfo.cbCurEggCount)

                            var deleteCardData = operateUser.dwUserID == selfdwUserID?cardDatas[0]:0
                            majiangFactory.deleteHandMajiangs(operateHandMajiangs, operateUserDir, deleteCardData)
                            isExist = true
                            break
                        }
                    }

                    if (isExist == true)
                        break
                }
            }
            if (isExist == false)
            {
                for(var i=0;i<operateWeaveMajiangs.length;i++)
                {
                    var majiangsOneGroup = operateWeaveMajiangs[i]
                    if(majiangsOneGroup.cbWeaveKind == WIK_SHOWEGG)
                    {
                        var cbActionType = 0
                        for (var j = 0; j < majiangsOneGroup.length; j++)
                        {
                            if (majiangsOneGroup[j].cardData >= 0x31 && majiangsOneGroup[j].cardData <= 0x34)
                                cbActionType = 1 // 东西南北
                            else if (majiangsOneGroup[j].cardData >= 0x35 && majiangsOneGroup[j].cardData <= 0x37)
                                cbActionType = 2 // 中发白
                        }

                        if (cbActionType == 2){
                            if (cardDatas[0] >= 0x35 && cardDatas[0] <= 0x37 || cardDatas[0] == 0x11) 
                            {// 没有添加  新添加进去
                                cmdBaseWorker.addNewEgg(cardDatas[0], operateWeaveMajiangs, i, majiangsOneGroup.length, operateUserDir, operateUser)
                                var deleteCardData = operateUser.dwUserID == selfdwUserID?cardDatas[0]:0
                                majiangFactory.deleteHandMajiangs(operateHandMajiangs, operateUserDir, deleteCardData)
                                break
                            }
                        }
                        else if (cbActionType == 1) {
                            if (cardDatas[0] >= 0x31 && cardDatas[0] <= 0x34 || cardDatas[0] == 0x11) 
                            {   // 没有添加  新添加进去
                                cmdBaseWorker.addNewEgg(cardDatas[0], operateWeaveMajiangs, i, majiangsOneGroup.length, operateUserDir, operateUser)
                                var deleteCardData = operateUser.dwUserID == selfdwUserID?cardDatas[0]:0
                                majiangFactory.deleteHandMajiangs(operateHandMajiangs, operateUserDir, deleteCardData)
                                break
                            }
                        }
                    }
                }
            }
            return
        }

        var cardUsed  = []
        var cardEggDatas = []
        var cardEggCount= []
        for (var i = 0; i < cardDatas.length; i++)
        {
            if ((cardDatas[i] >= 0x31 && cardDatas[i] <= 0x37) || cardDatas[i] == 0x11) {
                if (i > 0 && cardDatas[i] == cardDatas[i-1])
                    continue

                for (var j = 0; j < cardUsed.length; j++) {
                    if (cardUsed[j] == cardDatas[i])
                        continue
                }

                var cardCount = 1
                cardUsed[cardUsed,length] = cardDatas[i]

                for (var j = i+1; j < cardDatas.length; j++) {
                    if (cardDatas[i] == cardDatas[j])
                        cardCount++
                }

                cardEggDatas[cardEggDatas.length] = cardDatas[i]
                cardEggCount[cardEggCount.length] = cardCount
            }
        }

        var deleteLen = 3
        var deleteCardDatas = operateUser.dwUserID == selfdwUserID?cardDatas:[0, 0, 0]
        for(var i=0;i<deleteLen;i++)
            majiangFactory.deleteHandMajiangs(operateHandMajiangs, operateUserDir, deleteCardDatas[i])

        var self = tableData.getUserWithUserId(selfdwUserID)
        var selfDir = tableData.getShowChairIdWithServerChairId(self.wChairID)
        cmdBaseWorker.addWeaveMajiangs(operateWeaveMajiangs, operateUserDir, 
            {
                'cbCardDatas':cardEggDatas,
                'cbCardCount':cardEggCount,
                'provideDirection':operateUserDir,
                'cbCenterCardData':cardDatas[0],
                'cbWeaveKind':WIK_SHOWEGG,
                'cbPublicCard':1,
            }, 
            playNode.mjsNode,
            selfDir
        )

        var isSelf = selfDir == operateUserDir
        // if ((isSelf && operateHandMajiangs[1]==null) || isSelf == false)
        if (isHaveNewMj == true && operateHandMajiangs[1]==null)
        {
             var maxCardData = operateHandMajiangs[0][operateHandMajiangs[0].length-1].cardData
             majiangFactory.deleteHandMajiangs(operateHandMajiangs, operateUserDir, maxCardData)
             majiangFactory.addHandMajiangNew(operateHandMajiangs, operateUserDir, maxCardData, 
                    playNode.mjsNode)
        }
    },
    addNewEgg:function(cardData, operateWeaveMajiangs, groupIdx, idxInGroup, direction, operateUser)
    {
        var majiangsOneGroup = operateWeaveMajiangs[groupIdx]
        var groupSize = majiangsOneGroup.length
        var idxInCurWave = 2
        if (groupSize == 4)
            idxInCurWave = 1

        var where = {}
        where.name = 'weave'
        where.data = {weaveIdx:groupIdx, idxInWeave:idxInCurWave}
        var majiang = majiangFactory.getOne(cardData, direction, where)

        if (direction == 0)
        {
            if (groupSize != 2)
                majiang.y += majiang.height/2
            if (groupSize == 3)
            {
                majiang.x = majiangsOneGroup[2].x
                majiang.zIndex = majiangsOneGroup[2].zIndex - 1
            }
            else if (groupSize == 4)
            {
                majiang.x = majiangsOneGroup[1].x
                majiang.zIndex = majiangsOneGroup[1].zIndex - 1
            }
        }
        else if (direction == 1)
        {
            if (groupSize == 3)
            {
                majiang.y = majiangsOneGroup[2].y-2
                majiang.x = majiangsOneGroup[2].x - majiang.width/2 - 15
                majiang.zIndex = majiangsOneGroup[2].zIndex + 1
            }
            else if (groupSize == 4)
            {
                majiang.y = majiangsOneGroup[1].y-2
                majiang.x = majiangsOneGroup[1].x - majiang.width/2 - 15
                majiang.zIndex = majiangsOneGroup[1].zIndex + 1
            }
            else
                majiang.zIndex = majiangsOneGroup[1].zIndex - 1
        }
        else if (direction == 2)
        {
            if (groupSize != 2)
                majiang.y += majiang.height/2
            if (groupSize == 3)
            {
                majiang.x = majiangsOneGroup[2].x
                majiang.setLocalZOrder(1)
            }
            else if (groupSize == 4)
            {
                majiang.x = majiangsOneGroup[1].x
                majiang.setLocalZOrder(0)
            }
            else
                majiang.zIndex = majiangsOneGroup[1].zIndex + 1
        }
        else if (direction == 3)
        {
            if (groupSize == 3)
            {
                majiang.y = majiangsOneGroup[2].y
                majiang.x = majiangsOneGroup[2].x + majiang.width/2 - 1
                majiang.setLocalZOrder(1001)
            }
            else if (groupSize == 4)
            {
                majiang.y = majiangsOneGroup[1].y
                majiang.x = majiangsOneGroup[1].x + majiang.width/2 - 2
                majiang.setLocalZOrder(1000)
            }
            else
                majiang.zIndex = majiangsOneGroup[1].zIndex + 1
        }

        majiangsOneGroup[majiangsOneGroup.length] = majiang
        var parent = majiangsOneGroup[0].getParent()
        parent.addChild(majiang)

        var amountTTF = cc.LabelTTF.create('', "Helvetica")
        amountTTF.setFontFillColor( cc.color(255, 0, 0, 255) )
        amountTTF.enableStroke(cc.color(0, 0, 0, 255), 1)
        amountTTF.height = 80
        amountTTF.setTag(881)
        amountTTF.setAnchorPoint(0.5,0.5)

        amountTTF.x = majiang.width/2
        amountTTF.y = majiang.height/2

        if (direction == 0)
        {
            amountTTF.setFontSize(38)
            if (groupSize >= 3)
            {
                amountTTF.x += 7
                amountTTF.y = majiang.height + 8
            }
            else if (groupSize == 2)
            {
                amountTTF.x = majiang.width/2
                amountTTF.y = majiang.height - 5
            }
        }
        else if (direction == 2)
        {
            amountTTF.setFontSize(24)
            if (groupSize >= 3)
                amountTTF.y = majiang.height + 5
            else if (groupSize == 2)
            {
                amountTTF.x = majiang.width/2
                amountTTF.y =  - 7
            }
        }
        else if (direction == 1)
        {
            amountTTF.setFontSize(30)
            if (groupSize >= 3)
            {
                amountTTF.y += 8
                amountTTF.x = 0 - 10
            }
            else if (groupSize == 2)
            {
                amountTTF.x = majiang.width/2 + 19
                amountTTF.y = majiang.height/2 + 10
            }
        }
        else if (direction == 3)
        {
            amountTTF.setFontSize(38)
            if (groupSize >= 3)
                amountTTF.x = majiang.width + 10
            else if (groupSize == 2)
            {
                amountTTF.x = -14
                amountTTF.y = majiang.height/2 + 8
            }
        }
        
        amountTTF.setString('')
        majiang.addChild(amountTTF, 2220)
        // if (isResetPos == true)
        //     cmdBaseWorker.resetWavePos(operateWeaveMajiangs, groupIdx, extralScal, majiang, direction)
    },
    //‘增删减查’
    addWeaveMajiangs:function(operateWeaveMajiangs, direction, weaveItem, parent, selfDirection)
    { // 蛋专用
        var groupIdx = operateWeaveMajiangs.length
        var isSelf = selfDirection == direction
        var majiangsOneGroup = cmdBaseWorker.weaveItem2Majiangs(operateWeaveMajiangs, groupIdx, direction, weaveItem, isSelf)
        for(var i=0;i<majiangsOneGroup.length;i++)
        {
            parent.addChild(majiangsOneGroup[i])
        }
        operateWeaveMajiangs[groupIdx] = majiangsOneGroup
    },
    weaveItem2Majiangs:function(operateWeaveMajiangs, groupIdx, direction, weaveItem, isSelf)
    { // 蛋专用
        var majiangs = []
        var hasAddDirectionSpr = false
        for(var idxInGroup=0;idxInGroup<weaveItem.cbCardDatas.length;idxInGroup++)
        {
            var cardData = weaveItem.cbCardDatas[idxInGroup]
            if (cardData == 0) continue

            var where = {}
            where.name = 'weave'
            where.data = {weaveIdx:groupIdx, idxInWeave:idxInGroup}
            var majiang = majiangFactory.getOne(cardData, direction, where)
            if(weaveItem.provideDirection!=direction && !hasAddDirectionSpr && cardData == weaveItem.cbCenterCardData)
            {
                // var zi = majiang.getChildByTag(101)
                // var directionSpr = new cc.Sprite('#mf_weaveDirection.png')
                // directionSpr.setRotation(180-weaveItem.provideDirection*90 - zi.getRotation())

                // directionSpr.x = zi.width*0.5
                // directionSpr.y = zi.height*0.5
                // zi.addChild(directionSpr, 0, 101)
                // hasAddDirectionSpr = true
            }
            majiangs[majiangs.length] = majiang

            var amountTTF = cc.LabelTTF.create('', "Helvetica")
            amountTTF.setFontFillColor( cc.color(255, 0, 0, 255) )
            amountTTF.enableStroke(cc.color(0, 0, 0, 255), 1)
            amountTTF.height = 80
            amountTTF.setTag(881)
            amountTTF.setLocalZOrder(2222)

            if (direction == 0)
            {
                amountTTF.setFontSize(38)
                amountTTF.x = majiang.width/2
                amountTTF.y = majiang.height - 5
            }
            else if (direction == 2)
            {
                amountTTF.setFontSize(24)
                amountTTF.x = majiang.width/2
                amountTTF.y =  - 7
            }
            else if (direction == 1)
            {
                amountTTF.setFontSize(30)
                amountTTF.x = majiang.width/2 + 19
                amountTTF.y = majiang.height/2 + 10
            }
            else if (direction == 3)
            {
                amountTTF.setFontSize(38)
                amountTTF.x = -14
                amountTTF.y = majiang.height/2 + 8
            }
            if (weaveItem.cbCardCount[idxInGroup] > 1)
                amountTTF.setString('x' + weaveItem.cbCardCount[idxInGroup])
            majiang.addChild(amountTTF)
        }  
        majiangs.cbWeaveKind = weaveItem.cbWeaveKind
        return majiangs
    },
    weaveItem2MajiangsEgg:function(operateWeaveMajiangs, groupIdx, direction, weaveItem, isEnd)
    { // 蛋专用 用以重连 加 结算框
        var majiangs = []
        var hasAddDirectionSpr = false
        for(var idxInGroup=0;idxInGroup<weaveItem.cbCardDatas.length;idxInGroup++)
        {
            var cardData = weaveItem.cbCardDatas[idxInGroup]
            if (cardData == 0) continue

            if (idxInGroup < 3)
            {
                var where = {}
                where.name = 'weave'
                where.data = {weaveIdx:groupIdx, idxInWeave:idxInGroup}
                var majiang = majiangFactory.getOne(cardData, direction, where)
                if(weaveItem.provideDirection!=direction && !hasAddDirectionSpr && cardData == weaveItem.cbCenterCardData)
                {
                    // var zi = majiang.getChildByTag(101)
                    // var directionSpr = new cc.Sprite('#mf_weaveDirection.png')
                    // directionSpr.setRotation(180-weaveItem.provideDirection*90 - zi.getRotation())

                    // directionSpr.x = zi.width*0.5
                    // directionSpr.y = zi.height*0.5
                    // zi.addChild(directionSpr, 0, 101)
                    // hasAddDirectionSpr = true
                }
                majiangs[majiangs.length] = majiang

                var amountTTF = cc.LabelTTF.create('', "Helvetica")
                amountTTF.setFontFillColor( cc.color(255, 0, 0, 255) )
                amountTTF.enableStroke(cc.color(0, 0, 0, 255), 1)
                amountTTF.height = 80
                amountTTF.setTag(881)
                amountTTF.setLocalZOrder(2222)

                if (direction == 0)
                {
                    if (isEnd)
                        amountTTF.setFontSize(50)
                    else
                        amountTTF.setFontSize(38)
                    amountTTF.x = majiang.width/2
                    amountTTF.y = majiang.height - 5
                }
                else if (direction == 2)
                {
                    amountTTF.setFontSize(24)
                    amountTTF.x = majiang.width/2
                    amountTTF.y =  - 7
                }
                else if (direction == 1)
                {
                    amountTTF.setFontSize(30)
                    amountTTF.x = majiang.width/2 + 19
                    amountTTF.y = majiang.height/2 + 10
                }
                else if (direction == 3)
                {
                    amountTTF.setFontSize(38)
                    amountTTF.x = -14
                    amountTTF.y = majiang.height/2 + 8
                }
                if (weaveItem.cbCardCount[idxInGroup] > 1 || isEnd)
                    amountTTF.setString('x' + weaveItem.cbCardCount[idxInGroup])
                majiang.addChild(amountTTF)
            }
            else
            {
                var groupSize = idxInGroup
                var where = {}
                where.name = 'weave'
                where.data = {weaveIdx:groupIdx, idxInWeave:1}
                var majiang = majiangFactory.getOne(cardData, direction, where)
                if (direction == 0)
                {
                    if (groupSize != 2)
                        majiang.y += majiang.height/2
                    if (groupSize == 3)
                    {
                        majiang.x = majiangs[2].x
                        majiang.zIndex = majiangs[2].zIndex - 1
                    }
                    else if (groupSize == 4)
                    {
                        majiang.x = majiangs[1].x
                        majiang.zIndex = majiangs[1].zIndex - 1
                    }
                }
                else if (direction == 1)
                {
                    if (groupSize == 3)
                    {
                        majiang.y = majiangs[2].y-2
                        majiang.x = majiangs[2].x - majiang.width/2 - 15
                        majiang.zIndex = majiangs[2].zIndex + 1
                    }
                    else if (groupSize == 4)
                    {
                        majiang.y = majiangs[1].y-2
                        majiang.x = majiangs[1].x - majiang.width/2 - 15
                        majiang.zIndex = majiangs[1].zIndex + 1
                    }
                    else
                        majiang.zIndex = majiangs[1].zIndex - 1
                }
                else if (direction == 2)
                {
                    if (groupSize != 2)
                        majiang.y += majiang.height/2
                    if (groupSize == 3)
                    {
                        majiang.x = majiangs[2].x
                        majiang.setLocalZOrder(1)
                    }
                    else if (groupSize == 4)
                    {
                        majiang.x = majiangs[1].x
                        majiang.setLocalZOrder(0)
                    }
                    else
                        majiang.zIndex = majiangs[1].zIndex + 1
                }
                else if (direction == 3)
                {
                    if (groupSize == 3)
                    {
                        majiang.y = majiangs[2].y
                        majiang.x = majiangs[2].x + majiang.width/2 - 1
                        majiang.setLocalZOrder(1001)
                    }
                    else if (groupSize == 4)
                    {
                        majiang.y = majiangs[1].y
                        majiang.x = majiangs[1].x + majiang.width/2 - 2
                        majiang.setLocalZOrder(1000)
                    }
                    else
                        majiang.zIndex = majiangs[1].zIndex + 1
                }
                majiangs[majiangs.length] = majiang

                var amountTTF = cc.LabelTTF.create('', "Helvetica")
                amountTTF.setFontFillColor( cc.color(255, 0, 0, 255) )
                amountTTF.enableStroke(cc.color(0, 0, 0, 255), 1)
                amountTTF.height = 80
                amountTTF.setTag(881)
                amountTTF.setAnchorPoint(0.5,0.5)

                amountTTF.x = majiang.width/2
                amountTTF.y = majiang.height/2

                if (direction == 0)
                {
                    if (isEnd)
                        amountTTF.setFontSize(50)
                    else
                        amountTTF.setFontSize(38)
                    if (groupSize >= 3)
                    {
                        amountTTF.x += 7
                        amountTTF.y = majiang.height + 8
                    }
                    else if (groupSize == 2)
                    {
                        amountTTF.x = majiang.width/2
                        amountTTF.y = majiang.height - 5
                    }
                }
                else if (direction == 2)
                {
                    amountTTF.setFontSize(24)
                    if (groupSize >= 3)
                        amountTTF.y = majiang.height + 5
                    else if (groupSize == 2)
                    {
                        amountTTF.x = majiang.width/2
                        amountTTF.y =  - 7
                    }
                }
                else if (direction == 1)
                {
                    amountTTF.setFontSize(30)
                    if (groupSize >= 3)
                    {
                        amountTTF.y += 8
                        amountTTF.x = 0 - 10
                    }
                    else if (groupSize == 2)
                    {
                        amountTTF.x = majiang.width/2 + 19
                        amountTTF.y = majiang.height/2 + 10
                    }
                }
                else if (direction == 3)
                {
                    amountTTF.setFontSize(38)
                    if (groupSize >= 3)
                        amountTTF.x = majiang.width + 10
                    else if (groupSize == 2)
                    {
                        amountTTF.x = -14
                        amountTTF.y = majiang.height/2 + 8
                    }
                }

                if (weaveItem.cbCardCount[idxInGroup] > 1 || isEnd)
                    amountTTF.setString('x' + weaveItem.cbCardCount[idxInGroup])
                majiang.addChild(amountTTF, 2220)
            }
            
        }  
        majiangs.cbWeaveKind = weaveItem.cbWeaveKind
        return majiangs
    },
    getWeaveMajiangPosAndTag:function(groupIdx, idxInGroup, direction, extralScal, majiang, isEgg, waveSep, eggNum)
    {
        var pos = {}
        switch(direction)
        {
            case 0://down
            {
                var y = majiangFactory.scale_upDown*(majiangFactory.down_handHeight-majiangFactory.down_weaveHeight)*0.5

                var waveAmount = 0
                if (eggNum[0] > 0)
                    waveAmount += eggNum[0]*4
                if (eggNum[1] == 1)
                    waveAmount += eggNum[1]*5
                if (eggNum[2] > 0)
                    waveAmount += eggNum[2]*2
                waveAmount += (groupIdx-eggNum[0]-eggNum[1]-eggNum[2])*3
                gameLog.log("0000:::", waveAmount, groupIdx)
                var widthOneGroup = waveAmount*extralScal*majiang.width + groupIdx*waveSep*extralScal
                pos.x = ( (idxInGroup==3&&isEgg==false?1:idxInGroup)+0.5 )*extralScal*majiang.width + (widthOneGroup)
                //pos.x = ( (idxInGroup==3&&isEgg==false?1:idxInGroup)+0.5 )*extralScal*majiang.width + groupIdx*(widthOneGroup)
                //( (idxInGroup==3?1:idxInGroup)+0.5 )*majiangFactory.scale_upDown*extralScal*majiangFactory.downWeaveIntervalX + groupIdx*(widthOneGroup)
                pos.y = -y + (idxInGroup==3&&isEgg==false?majiangFactory.downWeaveGangOffset*extralScal:0)
                pos.zOrder = 0    
                break
            }
            case 1://right
            {
                pos.x = 0.2*(majiangFactory.right_weaveWidth - majiangFactory.right_handWidth)*majiangFactory.scale_rightLeft
                //majiangFactory.scale_rightLeft*majiangFactory.right_handWidth*0.5 + 
                //(idxInGroup==3?majiangFactory.rightWeaveGangOffset:0)
                // var widthOneGroup = majiangFactory.scale_rightLeft*majiangFactory.rightWeaveIntervalY*3 + majiangFactory.rightWeaveIntervalPerGroup
                //var widthOneGroup = (majiangFactory.scale_rightLeft+0.1)*majiangFactory.leftHandIntervalY*3
                var waveAmount = 0
                if (eggNum[0] > 0)
                    waveAmount += eggNum[0]*4
                if (eggNum[1] == 1)
                    waveAmount += eggNum[1]*5
                if (eggNum[2] > 0)
                    waveAmount += eggNum[2]*2
                waveAmount += (groupIdx-eggNum[0]-eggNum[1]-eggNum[2])*3
                gameLog.log("1111:::", waveAmount, groupIdx)
                var widthOneGroup = waveAmount*extralScal*majiangFactory.rightWeaveIntervalY + groupIdx*waveSep*extralScal
                pos.y = ( (idxInGroup==3&&isEgg==false?1.45:idxInGroup)+0.5)*extralScal*majiangFactory.rightWeaveIntervalY + widthOneGroup - 2.9*(extralScal*majiangFactory.rightWeaveIntervalY)
                //( (idxInGroup==3&&isEgg==false?1.45:idxInGroup)+0.5)*extralScal*majiangFactory.rightWeaveIntervalY + groupIdx*widthOneGroup - 2*(extralScal*majiangFactory.rightWeaveIntervalY)
            
                pos.zOrder = idxInGroup==3&&isEgg==false?100:( 10*(4 - groupIdx) + 5-idxInGroup)
                break
            }
            case 2://up
            {
                //var widthOneGroup = majiangFactory.scale_upDown*majiangFactory.upWeaveIntervalX*3 + majiangFactory.upWeaveIntervalPerGroup
                //var widthOneGroup = majiangFactory.scale_upDown*majiangFactory.upHandIntervalX*3
                var y = majiangFactory.scale_upDown*(majiangFactory.up_handHeight-majiangFactory.up_weaveHeight)*0.5

                var waveAmount = 0
                if (eggNum[0] > 0)
                    waveAmount += eggNum[0]*4
                if (eggNum[1] == 1)
                    waveAmount += eggNum[1]*5
                if (eggNum[2] > 0)
                    waveAmount += eggNum[2]*2
                waveAmount += (groupIdx-eggNum[0]-eggNum[1]-eggNum[2])*3

                var widthOneGroup = waveAmount*extralScal*majiang.width + groupIdx*waveSep*extralScal
                pos.x = -( (idxInGroup==3&&isEgg==false?1:idxInGroup)+0.5 )*majiang.width*extralScal - widthOneGroup + majiang.width*extralScal + 38
                //-( (idxInGroup==3&&isEgg==false?1:idxInGroup)+0.5 )*majiang.width*extralScal - groupIdx*widthOneGroup + majiang.width*extralScal
                pos.y = -y + (idxInGroup==3&&isEgg==false?majiangFactory.upWeaveGangOffset*extralScal:0)

                pos.zOrder = 0 
                break
            }
            case 3://left
            {
                pos.x = -0.2*(majiangFactory.left_weaveWidth - majiangFactory.left_handWidth)*majiangFactory.scale_rightLeft
                //majiangFactory.scale_rightLeft*majiangFactory.right_handWidth*0.5 + 
                //(idxInGroup==3?majiangFactory.rightWeaveGangOffset:0)
                // var widthOneGroup = majiangFactory.scale_rightLeft*majiangFactory.leftWeaveIntervalY*3 + majiangFactory.leftWeaveIntervalPerGroup
                //var widthOneGroup = (majiangFactory.scale_rightLeft+0.1)*majiangFactory.rightHandIntervalY*3
                var waveAmount = 0
                if (eggNum[0] > 0)
                    waveAmount += eggNum[0]*4
                if (eggNum[1] == 1)
                    waveAmount += eggNum[1]*5
                if (eggNum[2] > 0)
                    waveAmount += eggNum[2]*2
                waveAmount += (groupIdx-eggNum[0]-eggNum[1]-eggNum[2])*3

                var widthOneGroup = waveAmount*extralScal*majiangFactory.rightWeaveIntervalY + groupIdx*waveSep*extralScal
                pos.y = -( (idxInGroup==3&&isEgg==false?0.55:idxInGroup)+0.5)*extralScal*majiangFactory.rightWeaveIntervalY - widthOneGroup + 2.2*(extralScal*majiangFactory.rightWeaveIntervalY)
                //-( (idxInGroup==3&&isEgg==false?0.55:idxInGroup)+0.5)*extralScal*majiangFactory.rightWeaveIntervalY - groupIdx*widthOneGroup + 2*(extralScal*majiangFactory.rightWeaveIntervalY)
                
                pos.zOrder = idxInGroup==3&&isEgg==false?100:(10*groupIdx + idxInGroup-5)
                gameLog.log("@@@@@@@@@:::", pos.zOrder, groupIdx, idxInGroup)
                break
            }
        }
        return pos
    },
    resetWavePos:function(operateWeaveMajiangs, startPos, extralScal, majiang1, direction)
    {
        for(var i=startPos+1; i<operateWeaveMajiangs.length;i++)
        {
            var majiangsOneGroup = operateWeaveMajiangs[i]
            for (var j = 0; j < majiangsOneGroup.length; j++)
            {
                var majiang = majiangsOneGroup[j]
                if (direction == 0)
                    majiang.x += extralScal*majiang1.width
                else if (direction == 1)
                    majiang.y += extralScal*majiangFactory.rightWeaveIntervalY
                else if (direction == 2)
                    majiang.x -= majiang1.width*extralScal
                else if (direction == 3)
                    majiang.y -= extralScal*majiangFactory.rightWeaveIntervalY
            }
        }
    },
    getWaveSeption:function(direction, majiang, extralScal)
    {
        var waveSep = 0
        if (direction == 0 || direction == 2)
        {                               
           var waveWidth = extralScal*majiang.width*15    //wave 
           var handWidth = (direction==0?majiangFactory.downHandIntervalX:majiangFactory.upHandIntervalX)*majiangFactory.scale_upDown*12
           if (direction==2)
               handWidth += (majiang.width*extralScal) + 25

           waveSep = (handWidth - waveWidth)/4
        }
        else if (direction == 1 || direction == 3)
        {
            var waveHeight = extralScal*majiangFactory.rightWeaveIntervalY*15    //wave 
            var handHeight = majiangFactory.rightHandIntervalY*(majiangFactory.scale_rightLeft+0.1)*12
            if (direction == 1)
                handHeight += 0.6*(extralScal*majiangFactory.rightWeaveIntervalY)
            else
                handHeight += 0.5*(extralScal*majiangFactory.rightWeaveIntervalY)

            waveSep = (handHeight - waveHeight)/4
        }

        if (waveSep < 0)
            waveSep = 0

        return waveSep
    },
    getEggNum:function(operateWeaveMajiangs, reduce)
    {
        var eggNum = [0, 0, 0]
        for(var i=0;i<operateWeaveMajiangs.length - reduce;i++)
        {
            var majiangsOneGroup = operateWeaveMajiangs[i]
            if(majiangsOneGroup.cbWeaveKind == WIK_SHOWEGG)
            { 
               if (majiangsOneGroup.length == 4)
               {
                    eggNum[0] += 1
                    if (eggNum[0] > 2)
                        eggNum[0] = 2
               }
                else if (majiangsOneGroup.length == 5)
                    eggNum[1] = 1
                else if (majiangsOneGroup.length == 2)
                {
                    eggNum[2] ++
                    if (eggNum[2] > 2)
                        eggNum[2] = 2
                }
            }
        }

        return eggNum
    },
    getEggNum2:function(weaveItems, reduce)
    {
        var eggNum = [0, 0, 0]
        for(var i=0;i<weaveItems.length - reduce;i++)
        {
            var weaveItem = weaveItems[i]
            if(weaveItem.cbWeaveKind == WIK_SHOWEGG)
            { 
                var numEgg = 0
                var cardDatas = weaveItem.cbCardDatas
                for (var k = 0; k < cardDatas.length; k++)
                {
                    var cardData = cardDatas[k]
                    if (cardData == 0)
                    {
                        if (numEgg == 4)
                        {
                            eggNum[0] += 1
                            if (eggNum[0] > 2)
                                eggNum[0] = 2
                        }
                        else if (numEgg == 2)
                        {
                            eggNum[2] ++
                            if (eggNum[2] > 2)
                                eggNum[2] = 2
                        }
                        break
                    }
                    else
                    {
                        numEgg++
                        if (numEgg == 5)
                        {
                            eggNum[1] = 1
                            break
                        }
                    }
                }
            }
        }

        return eggNum
    },
    toDealQEgg:function(stAddEggInfo)
    {
        var operateUserDir = tableData.getShowChairIdWithServerChairId(stAddEggInfo.wOperateEggUser)
        var operateWeaveMajiangs = playNode.weaveMajiangs4D[operateUserDir]
        if (operateWeaveMajiangs)
        {
            var majiangsOneGroup = operateWeaveMajiangs[stAddEggInfo.cbWaveItem]
            if(majiangsOneGroup && majiangsOneGroup.cbWeaveKind == WIK_SHOWEGG)
            {
                if (majiangsOneGroup.length >= (stAddEggInfo.cbPosInWave+1) && majiangsOneGroup[stAddEggInfo.cbPosInWave].cardData == stAddEggInfo.cbOperateEggData)
                {
                    var majiang = majiangsOneGroup[stAddEggInfo.cbPosInWave]
                    if (stAddEggInfo.cbCurEggCount == 0)
                    { // 这个要去移动其余wave的位置
                        majiang.removeFromParent()
                        majiangsOneGroup.splice(stAddEggInfo.cbPosInWave, 1)
                        majiangsOneGroup.cbWeaveKind = WIK_SHOWEGG

                        // var majiangNew = majiangFactory.getOne(0x11, operateUserDir, 2)
                        // var extralScal = 1
                        // if (operateUserDir == 0 || operateUserDir == 2)
                        // {                               
                        //     var waveWidth = majiangNew.width
                        //     var handWidth = operateUserDir==0?majiangFactory.downHandIntervalX:majiangFactory.upHandIntervalX
                        //     var extralWidth = operateUserDir == 2?1:3
                        //     extralScal = (3*majiangFactory.scale_upDown*handWidth+extralWidth)/(5*(majiangFactory.scale_upDown*waveWidth))
                        //     extralScal = extralScal>1?1:extralScal
                        // }
                        // else if (operateUserDir == 1 || operateUserDir == 3)
                        // {
                        //     majiangNew.setScale(1)
                        //     var waveheight = majiangFactory.rightWeaveIntervalY
                        //     var handheight = majiangFactory.leftHandIntervalY
                        //     extralScal = (3*(majiangFactory.scale_rightLeft+0.1)*handheight+3)/(5*(waveheight))
                        // }
                        // majiangNew.setScale(extralScal)

                        // for(var i=stAddEggInfo.cbWaveItem+1; i<operateWeaveMajiangs.length;i++)
                        // {
                        //     var majiangsOneGroup1 = operateWeaveMajiangs[i]
                        //     for (var j = 0; j < majiangsOneGroup1.length; j++)
                        //     {
                        //         var majiang1 = majiangsOneGroup1[j]
                        //         if (operateUserDir == 0)
                        //             majiang1.x -= majiangNew.width*extralScal
                        //         else if (operateUserDir == 1)
                        //             majiang1.y -= extralScal*majiangFactory.rightWeaveIntervalY
                        //         else if (operateUserDir == 2)
                        //             majiang1.x += majiangNew.width*extralScal
                        //         else if (operateUserDir == 3)
                        //             majiang1.y += extralScal*majiangFactory.rightWeaveIntervalY
                        //     }
                        // }
                    }
                    else
                    {//数字减少一
                        var amountTTF = majiang.getChildByTag(881)
                        if (amountTTF)
                            amountTTF.setString('x'+stAddEggInfo.cbCurEggCount)
                    }
                }
            }
        }
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
}































