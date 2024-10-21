
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

        //格式化数据 把0过滤掉
        for(var i=0;i<GAME_PLAYER;i++)
        {
            var weaveItems = cmdBaseWorker.WeaveItemArray[i]
            //组合牌
            for(var j=0;j<MAX_WEAVE;j++)
            {
                var t = weaveItems[j].cbCardDatas
                for(var jj=0;jj<t.length;)
                {
                    if(t[jj]==0)
                        t.splice(jj, 1)
                    else
                        jj++
                }
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
                chooseItem.x = ( i%4 - (4-1)/2 ) * (majiangFactory.scale_upDown*majiangFactory.chooseItemMjScale*majiangFactory.downHandIntervalX*3 + 30)
            else
                chooseItem.x = ( i%4 - (last-1)/2 ) * (majiangFactory.scale_upDown*majiangFactory.chooseItemMjScale*majiangFactory.downHandIntervalX*3 + 30)

            chooseItem.y = curLine * (majiangFactory.scale_upDown*majiangFactory.chooseItemMjScale*majiangFactory.down_handHeight + 25)
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
            var mj = majiangFactory.getOne(sortedOperateCardDatas[i], 0, 0)
            mj.setScale(majiangFactory.scale_upDown*majiangFactory.chooseItemMjScale)
            mj.x = ( i - (showLen-1)/2 )*majiangFactory.scale_upDown*majiangFactory.chooseItemMjScale*majiangFactory.downHandIntervalX

            chooseItem.addChild(mj)
        }
        ////////////////////////////
        var bg = new cc.Scale9Sprite('mf_chooseItemBg.png')
        bg.width = majiangFactory.scale_upDown*majiangFactory.chooseItemMjScale*majiangFactory.downHandIntervalX*showLen + 10
        bg.height = majiangFactory.scale_upDown*majiangFactory.chooseItemMjScale*majiangFactory.down_handHeight + 10 
        bg.x = 0//bg.width/2
        bg.y = 0//bg.height/2
        bg.anchorX = 0.5
        bg.anchorY = 0.5
        chooseItem.addChild(bg, -1)

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
            cmdBaseWorker.onActionGang(cardDatas, operateUser, provideUser, majiangs4W4D, handGroupNode4D)
        else if(action == WIK_PENG)
            cmdBaseWorker.onActionPeng(cardDatas, operateUser, provideUser, majiangs4W4D, handGroupNode4D)
        else if(action == WIK_LEFT)
            cmdBaseWorker.onActionChi(action, cardDatas, operateUser, provideUser, majiangs4W4D, handGroupNode4D)
        else if(action == WIK_CENTER)
            cmdBaseWorker.onActionChi(action, cardDatas, operateUser, provideUser, majiangs4W4D, handGroupNode4D)
        else if(action == WIK_RIGHT)
            cmdBaseWorker.onActionChi(action, cardDatas, operateUser, provideUser, majiangs4W4D, handGroupNode4D)
        else if (action == WIK_SHOWEGG)
            cmdBaseWorker.onActionEgg(cardDatas, operateUser, provideUser, majiangs4W4D, handGroupNode4D)
    },
    peng2Gang:function(cardData ,majiangsOneDirection, direction)
    {
        for(var i=0;i<majiangsOneDirection.length;i++)
        {
            var majiangsOneGroup = majiangsOneDirection[i]
            if(majiangsOneGroup.cbWeaveKind == WIK_PENG && majiangsOneGroup[0].cardData == cardData)
            {
                var majiang = majiangFactory.getOne(cardData, 2, direction)
                var extralScal = 1
                if (direction == 0 || direction == 2)
                {                               
                    var waveWidth = majiang.width//direction==0?majiangFactory.downWeaveIntervalX:majiangFactory.upWeaveIntervalX
                    var handWidth = direction==0?majiangFactory.downHandIntervalX:majiangFactory.upHandIntervalX
                    var extralWidth = direction == 2?52:12
                    extralScal = (3*majiangFactory.scale_upDown*handWidth+extralWidth)/(5*(majiangFactory.scale_upDown*waveWidth))
                    //extralScal = (3*majiangFactory.scale_upDown*handWidth+3)/(5*(majiangFactory.scale_upDown*waveWidth))
                    //extralScal = extralScal>1?1:extralScal
                }
                else if (direction == 1 || direction == 3)
                {
                    majiang.setScale(1)
                    var waveheight = majiangFactory.rightWeaveIntervalY
                    var handheight = majiangFactory.leftHandIntervalY
                    extralScal = (3*(majiangFactory.scale_rightLeft+0.35)*handheight+3)/(5*(waveheight))
                }
                majiang.setScale(extralScal)

                var waveSep = cmdBaseWorker.getWaveSeption(direction, majiang, extralScal)
                var eggNum  = cmdBaseWorker.getEggNum(majiangsOneDirection, majiangsOneDirection.length-i)

                var pos = cmdBaseWorker.getWeaveMajiangPosAndTag(i, 3, direction, extralScal, majiang, false, waveSep, eggNum)
                //var pos = cmdBaseWorker.getWeaveMajiangPosAndTag(i, 3, direction)
                majiang.x = pos.x
                majiang.y = pos.y
                majiang.setLocalZOrder(pos.zOrder)
                var parent = majiangsOneGroup[0].getParent()
                parent.addChild(majiang)

                majiangsOneGroup[3] = majiang
                majiangsOneGroup.cbWeaveKind = WIK_GANG
                break
            }
        }
    },
    onActionGang:function(cardDatas, operateUser, provideUser, majiangs4W4D, handGroupNode4D)
    {
        var cardData = cardDatas[0]
        var gangType //0暗杠 1明杠 2增杠
        var operateUserDir = tableData.getShowChairIdWithServerChairId(operateUser.wChairID)
        var provideUserDir = tableData.getShowChairIdWithServerChairId(provideUser.wChairID)
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

        var deleteCardData = operateUser.dwUserID == selfdwUserID?cardData:0
        if(gangType==2)
        {
            majiangFactory.deleteHandMajiangs(operateHandMajiangs, operateUserDir, deleteCardData)
            majiangFactory.moveHandMajiangNew2Old(operateHandMajiangs, operateUserDir, handGroupNode4D[operateUserDir])
            cmdBaseWorker.peng2Gang(cardData, operateWeaveMajiangs, operateUserDir)
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

            if (cardData == 0x08 || cardData == 0x11 || cardData == 0x22 || cardData == 0x21)
                majiangFactory.isPublicAnGang = true

            var self = tableData.getUserWithUserId(selfdwUserID)
            var selfDir = tableData.getShowChairIdWithServerChairId(self.wChairID)
            cmdBaseWorker.addWeaveMajiangs1(operateWeaveMajiangs, operateUserDir, 
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
            majiangFactory.isPublicAnGang = false
        }
    },
    onActionChi:function(action, cardDatas, operateUser, provideUser, majiangs4W4D, handGroupNode4D)
    {
        var operateUserDir = tableData.getShowChairIdWithServerChairId(operateUser.wChairID)
        var provideUserDir = tableData.getShowChairIdWithServerChairId(provideUser.wChairID)
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
        if(operateUser.dwUserID == selfdwUserID)
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
        cmdBaseWorker.addWeaveMajiangs1(operateWeaveMajiangs, operateUserDir, 
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
        playNode.addHandMajiangNew(operateHandMajiangs, operateUserDir, maxCardData, 
                handGroupNode4D[operateUserDir])

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
        playNode.addHandMajiangNew(operateHandMajiangs, operateUserDir, maxCardData, 
                handGroupNode4D[operateUserDir])
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
        var cardDatas = weaveItem.cbCardDatas
        var majiangs = []
        var hasAddDirectionSpr = false
        for(var idxInGroup=0;idxInGroup<cardDatas.length;idxInGroup++)
        {
            var cardData = cardDatas[idxInGroup]
            if(weaveItem.cbWeaveKind==WIK_GANG && !weaveItem.cbPublicCard)
            {
                if(idxInGroup<3)
                    cardData = 0
                else if(!isSelf && !isPublicAnGang)
                    cardData = 0
            }

            var majiang = majiangFactory.getOne(cardData, 2, direction)

            var extralScal = 1
            if (direction == 0 || direction == 2)
            {                               
                var waveWidth = majiang.width//direction==0?majiangFactory.downWeaveIntervalX:majiangFactory.upWeaveIntervalX
                var handWidth = direction==0?majiangFactory.downHandIntervalX:majiangFactory.upHandIntervalX
                var extralWidth = direction == 2?52:12
                extralScal = (3*majiangFactory.scale_upDown*handWidth+extralWidth)/(5*(majiangFactory.scale_upDown*waveWidth))
                //extralScal = (3*majiangFactory.scale_upDown*handWidth+3)/(5*(majiangFactory.scale_upDown*waveWidth))
                //extralScal = extralScal>1?1:extralScal
            }
            else if (direction == 1 || direction == 3)
            {
                majiang.setScale(1)
                var waveheight = majiangFactory.rightWeaveIntervalY
                var handheight = majiangFactory.leftHandIntervalY
                extralScal = (3*(majiangFactory.scale_rightLeft+0.35)*handheight+3)/(5*(waveheight))
            }
            majiang.setScale(extralScal)

            var waveSep = cmdBaseWorker.getWaveSeption(direction, majiang, extralScal)
            var eggNum  = cmdBaseWorker.getEggNum(majiangsOneDirection, 0)

            var pos = cmdBaseWorker.getWeaveMajiangPosAndTag(groupIdx, idxInGroup, direction, extralScal, majiang, false, waveSep, eggNum)
            majiang.x = pos.x
            majiang.y = pos.y
            majiang.setLocalZOrder(pos.zOrder)
            if(weaveItem.provideDirection!=direction && !hasAddDirectionSpr && cardData == weaveItem.cbCenterCardData)
            {
                var zi = majiang.getChildByTag(101)
                var directionSpr = new cc.Sprite('#mf_weaveDirection.png')
                directionSpr.setRotation(180-weaveItem.provideDirection*90 - zi.getRotation())

                directionSpr.x = zi.width*0.5
                directionSpr.y = zi.height*0.5
                zi.addChild(directionSpr, 0, 101)
                hasAddDirectionSpr = true
            }
            majiangs[majiangs.length] = majiang
        }  
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
                            {
                                amountTTF.setString('x'+cmdBaseWorker.stAddEggInfo.cbCurEggCount)
                                amountTTF.setFontSize(24)
                            }
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
            operateUser.userNodeInsetChair.currentRoundNode.weaveMajiangsNode,
            selfDir
        )

        var isSelf = selfDir == operateUserDir
        // if ((isSelf && operateHandMajiangs[1]==null) || isSelf == false)
        if (isHaveNewMj == true && operateHandMajiangs[1]==null)
        {
             var maxCardData = operateHandMajiangs[0][operateHandMajiangs[0].length-1].cardData
             majiangFactory.deleteHandMajiangs(operateHandMajiangs, operateUserDir, maxCardData)
             playNode.addHandMajiangNew(operateHandMajiangs, operateUserDir, maxCardData, 
                    handGroupNode4D[operateUserDir])
        }
    },
    addNewEgg:function(cardData, operateWeaveMajiangs, groupIdx, idxInGroup, direction, operateUser)
    {
        var majiangsOneGroup = operateWeaveMajiangs[groupIdx]
        var majiang = majiangFactory.getOne(cardData, 2, direction)
        var isResetPos = (operateWeaveMajiangs.length != (groupIdx+1))
        var extralScal = 1
        if (direction == 0 || direction == 2)
        {                               
            var waveWidth = majiang.width//direction==0?majiangFactory.downWeaveIntervalX:majiangFactory.upWeaveIntervalX
            var handWidth = direction==0?majiangFactory.downHandIntervalX:majiangFactory.upHandIntervalX
            var extralWidth = direction == 2?52:12
            extralScal = (3*majiangFactory.scale_upDown*handWidth+extralWidth)/(5*(majiangFactory.scale_upDown*waveWidth))
            //extralScal = (3*majiangFactory.scale_upDown*handWidth+3)/(5*(majiangFactory.scale_upDown*waveWidth))
            //extralScal = extralScal>1?1:extralScal
        }
        else if (direction == 1 || direction == 3)
        {
            majiang.setScale(1)
            var waveheight = majiangFactory.rightWeaveIntervalY
            var handheight = majiangFactory.leftHandIntervalY
            extralScal = (3*(majiangFactory.scale_rightLeft+0.35)*handheight+3)/(5*(waveheight))
        }
        majiang.setScale(extralScal)

        var waveSep = cmdBaseWorker.getWaveSeption(direction, majiang, extralScal)
        var eggNum  = cmdBaseWorker.getEggNum(operateWeaveMajiangs, operateWeaveMajiangs.length-groupIdx)
        var pos = cmdBaseWorker.getWeaveMajiangPosAndTag(groupIdx, idxInGroup, direction, extralScal, majiang, true, waveSep, eggNum)
        majiang.x = pos.x
        majiang.y = pos.y

        majiang.setLocalZOrder(pos.zOrder)
        majiangsOneGroup[majiangsOneGroup.length] = majiang
        operateUser.userNodeInsetChair.currentRoundNode.weaveMajiangsNode.addChild(majiang)

        var amountTTF = cc.LabelTTF.create('', "Helvetica")
        amountTTF.setFontFillColor( cc.color(242, 226, 142, 255) )
        amountTTF.setTag(881)

        if (direction == 0)
        {
            amountTTF.x = majiang.width/2
            amountTTF.y = majiang.height + 10
        }
        else if (direction == 2)
        {
            amountTTF.x = majiang.width/2
            amountTTF.y =  - 10
        }
        else if (direction == 1)
        {
            amountTTF.x = majiang.width + 13
            amountTTF.y = majiang.height/2
        }
        else if (direction == 3)
        {
            amountTTF.x = -14
            amountTTF.y = majiang.height/2
        }
        
        // amountTTF.setString('')
        majiang.addChild(amountTTF)
        if (isResetPos == true)
            cmdBaseWorker.resetWavePos(operateWeaveMajiangs, groupIdx, extralScal, majiang, direction)
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
            var majiang = majiangFactory.getOne(cardData, 2, direction)

            var extralScal = 1
            if (direction == 0 || direction == 2)
            {                               
                var waveWidth = majiang.width
                var handWidth = direction==0?majiangFactory.downHandIntervalX:majiangFactory.upHandIntervalX
                var extralWidth = direction == 2?52:12
                extralScal = (3*majiangFactory.scale_upDown*handWidth+extralWidth)/(5*(majiangFactory.scale_upDown*waveWidth))
                //extralScal = extralScal>1?1:extralScal
            }
            else if (direction == 1 || direction == 3)
            {
                majiang.setScale(1)
                var waveheight = majiangFactory.rightWeaveIntervalY
                var handheight = majiangFactory.leftHandIntervalY
                extralScal = (3*(majiangFactory.scale_rightLeft+0.35)*handheight+1)/(5*(waveheight))
            }
            majiang.setScale(extralScal)

            var waveSep = cmdBaseWorker.getWaveSeption(direction, majiang, extralScal)
            var eggNum  = cmdBaseWorker.getEggNum(operateWeaveMajiangs, 0)

            var pos = cmdBaseWorker.getWeaveMajiangPosAndTag(groupIdx, idxInGroup, direction, extralScal, majiang, true, waveSep, eggNum)
            majiang.x = pos.x
            majiang.y = pos.y

            majiang.setLocalZOrder(pos.zOrder)
            if(weaveItem.provideDirection!=direction && !hasAddDirectionSpr && cardData == weaveItem.cbCenterCardData)
            {
                var zi = majiang.getChildByTag(101)
                var directionSpr = new cc.Sprite('#mf_weaveDirection.png')
                directionSpr.setRotation(180-weaveItem.provideDirection*90 - zi.getRotation())

                directionSpr.x = zi.width*0.5
                directionSpr.y = zi.height*0.5
                zi.addChild(directionSpr, 0, 101)
                hasAddDirectionSpr = true
            }
            majiangs[majiangs.length] = majiang

            var amountTTF = cc.LabelTTF.create('', "Helvetica")
            amountTTF.setFontFillColor( cc.color(242, 226, 142, 255) )
            amountTTF.setTag(881)

            if (direction == 0)
            {
                amountTTF.x = majiang.width/2
                amountTTF.y = majiang.height + 10
            }
            else if (direction == 2)
            {
                amountTTF.x = majiang.width/2
                amountTTF.y =  - 10
            }
            else if (direction == 1)
            {
                amountTTF.x = majiang.width + 13
                amountTTF.y = majiang.height/2
            }
            else if (direction == 3)
            {
                amountTTF.x = -14
                amountTTF.y = majiang.height/2
            }
            if (weaveItem.cbCardCount[idxInGroup] > 1)
            {
                amountTTF.setString('x' + weaveItem.cbCardCount[idxInGroup])
                amountTTF.setFontSize(24)
            }
            majiang.addChild(amountTTF)
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

                        var majiangNew = majiangFactory.getOne(0x11, 2, operateUserDir)
                        var extralScal = 1
                        if (operateUserDir == 0 || operateUserDir == 2)
                        {                               
                            var waveWidth = majiangNew.width
                            var handWidth = operateUserDir==0?majiangFactory.downHandIntervalX:majiangFactory.upHandIntervalX
                            var extralWidth = operateUserDir == 2?1:3
                            extralScal = (3*majiangFactory.scale_upDown*handWidth+extralWidth)/(5*(majiangFactory.scale_upDown*waveWidth))
                            extralScal = extralScal>1?1:extralScal
                        }
                        else if (operateUserDir == 1 || operateUserDir == 3)
                        {
                            majiangNew.setScale(1)
                            var waveheight = majiangFactory.rightWeaveIntervalY
                            var handheight = majiangFactory.leftHandIntervalY
                            extralScal = (3*(majiangFactory.scale_rightLeft+0.1)*handheight+3)/(5*(waveheight))
                        }
                        majiangNew.setScale(extralScal)

                        for(var i=stAddEggInfo.cbWaveItem+1; i<operateWeaveMajiangs.length;i++)
                        {
                            var majiangsOneGroup1 = operateWeaveMajiangs[i]
                            for (var j = 0; j < majiangsOneGroup1.length; j++)
                            {
                                var majiang1 = majiangsOneGroup1[j]
                                if (operateUserDir == 0)
                                    majiang1.x -= majiangNew.width*extralScal
                                else if (operateUserDir == 1)
                                    majiang1.y -= extralScal*majiangFactory.rightWeaveIntervalY
                                else if (operateUserDir == 2)
                                    majiang1.x += majiangNew.width*extralScal
                                else if (operateUserDir == 3)
                                    majiang1.y += extralScal*majiangFactory.rightWeaveIntervalY
                            }
                        }
                    }
                    else
                    {//数字减少一
                        var amountTTF = majiang.getChildByTag(881)
                        if (amountTTF)
                        {
                            amountTTF.setString('x'+stAddEggInfo.cbCurEggCount)
                            amountTTF.setFontSize(24)
                        }
                    }
                }
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
}































