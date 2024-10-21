
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
    wVideoUser:INVALID_WORD,
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
    stHuaScore:null,
    cbOperatePlayerHandCardCount:null,

    cbPlayerFlowerCount:null,
    cbPlayerFlowerCardData:[[], [], [], []],
    afterEatForbidCard:[],

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
    cbQGWinner:[],
    cbHuaScore:[],
    endType:null,
    wExitUser:INVALID_WORD,

    //其他
    cbCallRecord:null,
    cbSiceCount:null,
    TurnoverCard:null,
    init:function()
    {   
    },
    onReStart:function()
    {
        cmdBaseWorker.wBankerUser       = INVALID_WORD
        cmdBaseWorker.wTakeCardUser     = INVALID_WORD
        cmdBaseWorker.wCurrentUser      = INVALID_WORD//当前需要出牌的玩家 m_wCurrentUser=INVALID_CHAIR时表示没人能出牌 在吃碰杠状态
        cmdBaseWorker.wOutCardUser      = INVALID_WORD
        cmdBaseWorker.cbPlayerFlowerCardData    = [[], [], [], []]
        cmdBaseWorker.cbMagicCardData   = []
        cmdBaseWorker.cbFlowerCardData  = []
        cmdBaseWorker.cbQGWinner        = []
        cmdBaseWorker.cbHuaScore        = []
        cmdBaseWorker.wResumeUser       = INVALID_WORD //用于如果所有人都‘过’时发牌
        cmdBaseWorker.wOperateUser      = INVALID_WORD
        cmdBaseWorker.wProvideUser      = INVALID_WORD
        cmdBaseWorker.wVideoUser        = INVALID_WORD
        cmdBaseWorker.wExitUser         = INVALID_WORD
        cmdBaseWorker.cbOutCardCount  = 0 
        cmdBaseWorker.cbOperatePlayerHandCardCount  = 0
        cmdBaseWorker.afterEatForbidCard = []
        cmdBaseWorker.stHuaScore        = null

    },
    onCMD_StatusFree:function(body) 
    {
        typeSelNode.haveSetGameType = false
        cmdBaseWorker.lCellScore = body.lCellScore
        cmdBaseWorker.cbGameType   = body.cbGameType
        cmdBaseWorker.bHaveSetType = body.bHaveSetType
    },
    onCMD_StatusCall:function(body) 
    {
        cmdBaseWorker.lCellScore = body.lCellScore
        cmdBaseWorker.wBankerUser     = tableData.getUserWithUserId(body.dwBankerUserId).wChairID   
        cmdBaseWorker.cbCallRecord = body.cbCallRecord
    },
    onCMD_StatusPlay:function(body) 
    {	
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

        cmdBaseWorker.cbPlayerFlowerCount    = body.cbPlayerFlowerCount   
        for(var i=0;i<GAME_PLAYER;i++)
        {   
            cmdBaseWorker.cbPlayerFlowerCardData[i]  = body.cbPlayerFlowerCardData[i].slice(0, body.cbPlayerFlowerCount[i])  
        }

        cmdBaseWorker.cbGameType   = body.cbGameType
        cmdBaseWorker.bHaveSetType = body.bHaveSetType
        cmdBaseWorker.cbWeaveCount    = body.cbWeaveCount    
        cmdBaseWorker.WeaveItemArray  = body.WeaveItemArray  
        cmdBaseWorker.cbMagicCardData  = body.cbMagicCardData  
        cmdBaseWorker.cbFlowerCardData    = body.cbFlowerCardData  

        cmdBaseWorker.wHeapHead     = body.wHeapHead   
        cmdBaseWorker.wHeapTail     = body.wHeapTail   
        cmdBaseWorker.cbHeapCardInfo     = body.cbHeapCardInfo   
        cmdBaseWorker.TurnoverCard     = body.TurnoverCard   

        cmdBaseWorker.cbCallRecord = body.cbCallRecord  
        cmdBaseWorker.afterEatForbidCard = body.cbAfterEatForbid

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
		cmdBaseWorker.wBankerUser     = tableData.getUserWithUserId(body.dwBankerUserId).wChairID  

        cmdBaseWorker.cbHandCardCount = [0, 0, 0, 0]
        cmdBaseWorker.cbHandCardData = [[],[],[],[]]
        for(var wChairID=0;wChairID<GAME_PLAYER;wChairID++)
        {
            cmdBaseWorker.cbHandCardData[wChairID] = body.cbHandCardData[wChairID].slice(0, MAX_COUNT-1)
            cmdBaseWorker.cbHandCardCount[wChairID] = MAX_COUNT-1
        }  
        // cmdBaseWorker.cbHandCardData = [[],[],[],[]]
        // for(var i=0;i<GAME_PLAYER;i++)
        // {
        //     var isSelf = tableData.getUserWithUserId(selfdwUserID).wChairID == i
        //     for(var j=0;j<MAX_COUNT-1;j++)
        //     {
        //         cmdBaseWorker.cbHandCardData[i][j] = isSelf?body.cbHandCardData[j]:0
        //     }
        // }
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
        cmdBaseWorker.cbPlayerFlowerCardData    = [[], [], [], []]
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
        cmdBaseWorker.sendCardArray = body.sendCardArray

        cmdBaseWorker.cbLeftCardCount = cmdBaseWorker.cbLeftCardCount - cmdBaseWorker.cbSendCardCount
        
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
        cmdBaseWorker.cbProvideCardData = body.cbProvideCardData    
        cmdBaseWorker.cbOperatePlayerHandCardCount = body.cbHandCardCount
        cmdBaseWorker.wCurrentUser = body.wCurrentUser
        cmdBaseWorker.cbOperateCode = body.cbOperateCode
        cmdBaseWorker.wOperateUser = body.wOperateUser
        cmdBaseWorker.cbOperateCardCount = body.cbOperateCardCount
        cmdBaseWorker.cbOperateCardData = body.cbOperateCardData.slice(0, body.cbOperateCardCount)

        if(cmdBaseWorker.cbOperateCode==WIK_REPLACE)
        {
            cmdBaseWorker.cbPlayerFlowerCardData[cmdBaseWorker.wOperateUser] = 
            cmdBaseWorker.cbPlayerFlowerCardData[cmdBaseWorker.wOperateUser].concat(cmdBaseWorker.cbOperateCardData)
        }
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
        cmdBaseWorker.cbHandCardCount = body.cbHandCardCount
        cmdBaseWorker.cbHandCardData  = body.cbHandCardData
        cmdBaseWorker.wWinner         = body.wWinner
        cmdBaseWorker.endType         = body.endType
        cmdBaseWorker.cbQGWinner      = body.cbQGWinner
        cmdBaseWorker.cbHuaScore      = body.cbHuaScore
        cmdBaseWorker.cbWeaveCount    = body.cbWeaveCount    
        cmdBaseWorker.WeaveItemArray  = body.WeaveItemArray  
        cmdBaseWorker.stHuaScore      = body.stHuaScore
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
    onListerMenuShare:function()
    {
      wx.onMenuShareAppMessage({
        title: wxData.data.share.title,
        desc: playNode.gameTypeTTF.getString(),
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
        desc: playNode.gameTypeTTF.getString(),
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
        case SUB_S_GAME_START: return 3000
        case SUB_S_OPERATE_RESULT: return 300
        case SUB_S_SEND_CARD: return 200
        case SUB_S_OUT_CARD: return 200
    }
    //这个是默认时间
    return 1000;
}



