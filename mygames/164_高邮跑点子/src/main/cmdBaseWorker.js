
var cmdBaseWorker = 
{   
    lCellScore:null,

    cbTingDataCount:0,
    tingData:[],
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
    cbSendCardData:null,
    cbOutCardData:null,
    cbProvideCardData:null,
    cbMagicCardData:[],
    cbFlowerCardData:[],
    cbOutCardCount:0,

    //手牌 丢弃牌 动作牌 花牌 
    //动作牌、花牌会维护 
    //丢弃牌、手牌 通过playNode获得
    cbHandCardCount:null,
    cbHandCardData:null, 
    cbDiscardCount:null, 
    cbDiscardCardData:null,
    cbWeaveCount:[0, 0, 0, 0],
    WeaveItemArray:[[], [], [], []], 
    cbPlayerFlowerCount:[0, 0, 0, 0],
    cbPlayerFlowerCardData:[[], [], [], []],
    
    //牌堆相关
    wHeapHead:null,
    wHeapTail:null,
    cbHeapCardInfo:null,
    //库存相关
    cbLeftCardCount:null,

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
    bPlayerStatus: [[], [], [], []],
    cbCallRecord:null,
    cbSiceCount:null,
    TurnoverCard:null,
    dwLastWinner:[],
    cbReplaceCardCount:0,
    cbReplaceCardData:[],

    cbXi:null,
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
        cmdBaseWorker.TurnoverCard     = body.TurnoverCard   

        cmdBaseWorker.cbActionMask    = body.cbActionMask   
        cmdBaseWorker.wProvideUser    = body.wProvideUser   
        cmdBaseWorker.cbProvideCardData    = body.cbProvideCardData   

        cmdBaseWorker.wBankerUser     = tableData.getUserWithUserId(body.dwBankerUserId).wChairID   
        cmdBaseWorker.lCellScore      = body.lCellScore      
        cmdBaseWorker.wCurrentUser    = body.wCurrentUser    
        cmdBaseWorker.wTakeCardUser = body.wTakeCardUser

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
        for(var i=0;i<GAME_PLAYER;i++)
        {
            for(var j=0;j<cmdBaseWorker.cbWeaveCount[i];j++)
            {
                var weaveItem = cmdBaseWorker.WeaveItemArray[i][j]
                if(weaveItem.cbWeaveKind!=WIK_GANG 
                    || (weaveItem.cbWeaveKind==WIK_GANG && weaveItem.cbValidCardDatas[0]==cmdBaseWorker.TurnoverCard[0].cbCardData)
                )
                {
                    weaveItem.cbValidCardDatas = weaveItem.cbValidCardDatas.slice(0, 3)
                    weaveItem.cbChangeCardDatas = weaveItem.cbChangeCardDatas.slice(0, 3)
                } 
            }
        }
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

        cmdBaseWorker.cbCallRecord = body.cbCallRecord  


        cmdBaseWorker.cbSendCardData     = body.cbSendCardData   

        cmdBaseWorker.bPlayerStatus = body.bPlayerStatus

        cmdBaseWorker.cbTingDataCount = body.cbTingDataCount
        cmdBaseWorker.tingData = body.tingData.slice(0, cmdBaseWorker.cbTingDataCount)
    },
    onCMD_TINGDATA:function(body) 
    {        
        cmdBaseWorker.cbTingDataCount = body.cbTingDataCount
        cmdBaseWorker.tingData = body.tingData.slice(0, cmdBaseWorker.cbTingDataCount)
    },
    onCMD_PlayerStatusUpdata:function(body) 
    {        
        cmdBaseWorker.bPlayerStatus = body.bPlayerStatus
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
        cmdBaseWorker.cbLeftCardCount = body.cbLeftCardCount
		cmdBaseWorker.wBankerUser = tableData.getUserWithUserId(body.dwBankerUserId).wChairID    
        
        cmdBaseWorker.cbHandCardCount = [0, 0, 0, 0]
        cmdBaseWorker.cbHandCardData = [[],[],[],[]]
        for(var wChairID=0;wChairID<GAME_PLAYER;wChairID++)
        {
            var isSelf = tableData.getUserWithUserId(selfdwUserID).wChairID == wChairID
            for(var j=0;j<MAX_COUNT-1;j++)
            {
                cmdBaseWorker.cbHandCardData[wChairID][cmdBaseWorker.cbHandCardCount[wChairID]++] = 
                isSelf?body.cbHandCardData[j]:0
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

        ////////////////
        cmdBaseWorker.cbOutCardCount = 0  
        cmdBaseWorker.cbPlayerFlowerCount = [0, 0, 0, 0]
        cmdBaseWorker.cbPlayerFlowerCardData    = [[], [], [], []]
        cmdBaseWorker.cbWeaveCount = [0, 0, 0, 0]
        cmdBaseWorker.WeaveItemArray    = [[], [], [], []]
        cmdBaseWorker.cbDiscardCount = [0, 0, 0, 0]
        cmdBaseWorker.cbDiscardCardData    = [[], [], [], []]

        cmdBaseWorker.bPlayerStatus    = [[], [], [], []]
    },
    onCMD_OutCard:function(body)
    {
        cmdBaseWorker.wOutCardUser = body.wOutCardUser
        cmdBaseWorker.cbOutCardData = body.cbOutCardData
        cmdBaseWorker.cbOutCardCount++
        cmdBaseWorker.cbActionMask    = body.cbActionMask 
        cmdBaseWorker.wTakeCardUser = INVALID_WORD

        if(cmdBaseWorker.cbActionMask!=WIK_NULL)
        {
            cmdBaseWorker.wProvideUser    = body.wOutCardUser 
            cmdBaseWorker.cbProvideCardData    = body.cbOutCardData   
            cmdBaseWorker.wCurrentUser = INVALID_WORD
        }


        // /////cbHandCardData
        // var user = cmdBaseWorker.wOutCardUser
        // var isSelf = tableData.getUserWithUserId(selfdwUserID).wChairID == user
        // var outCardData = isSelf?body.cbOutCardData:0
        // cmdBaseWorker.cbHandCardCount[user]--
        // for(var i=0;i<cmdBaseWorker.cbHandCardData[user].length;i++)
        // {
        //     if(cmdBaseWorker.cbHandCardData[user][i] == outCardData)
        //     {
        //        cmdBaseWorker.cbHandCardData[user].splice(i, 1) 
        //        break
        //     }
        // }

        /////cbDiscardCardData
        // cmdBaseWorker.cbDiscardCardData[cmdBaseWorker.wOutCardUser][cmdBaseWorker.cbDiscardCount[cmdBaseWorker.wOutCardUser]++] = cmdBaseWorker.cbOutCardData
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

        cmdBaseWorker.cbLeftCardCount = cmdBaseWorker.cbLeftCardCount - cmdBaseWorker.cbSendCardCount
        
        // /////cbHandCardData
        // var isSelf = tableData.getUserWithUserId(selfdwUserID).wChairID == cmdBaseWorker.wTakeCardUser
        // var wUser = cmdBaseWorker.wTakeCardUser
        // for(var i=0;i<cmdBaseWorker.cbSendCardCount;i++)
        // {
        //     var item = cmdBaseWorker.sendCardArray[i]
        //     if(item.cbCardData != SEND_DISCARD_CARD_DATA)
        //     {
        //         var cardData = isSelf?item.cbCardData:0
        //         cmdBaseWorker.cbHandCardData[wUser][cmdBaseWorker.cbHandCardCount[wUser]++] = cardData
        //     }
        // }
    },
    onCMD_OperateResult:function(body) 
    {
        console.log(99999, clone(body))

        cmdBaseWorker.cbOperateCode = body.cbOperateCode
        cmdBaseWorker.wOperateUser = body.wOperateUser
        cmdBaseWorker.wProvideUser    = body.wProvideUser   
        cmdBaseWorker.cbProvideCardData    = body.cbProvideCardData   

        cmdBaseWorker.wCurrentUser = body.wCurrentUser

        if(cmdBaseWorker.cbOperateCode!=WIK_NULL)
        {
            /////weave
            cmdBaseWorker.cbOperateWeaveIdx    = body.cbOperateWeaveIdx   
            if(body.OperateWeaveItem.cbWeaveKind!=WIK_GANG
                || (body.OperateWeaveItem.cbWeaveKind==WIK_GANG && body.OperateWeaveItem.cbValidCardDatas[0]==cmdBaseWorker.TurnoverCard[0].cbCardData)
            )
            {
                body.OperateWeaveItem.cbValidCardDatas = body.OperateWeaveItem.cbValidCardDatas.slice(0, 3)
                body.OperateWeaveItem.cbChangeCardDatas = body.OperateWeaveItem.cbChangeCardDatas.slice(0, 3)
            } 
            cmdBaseWorker.OperateWeaveItem    = body.OperateWeaveItem 
            cmdBaseWorker.WeaveItemArray[body.wOperateUser][body.cbOperateWeaveIdx] = body.OperateWeaveItem  
        
            if(body.cbOperateWeaveIdx+1>cmdBaseWorker.cbWeaveCount[body.wOperateUser])
                cmdBaseWorker.cbWeaveCount[body.wOperateUser] = body.cbOperateWeaveIdx+1  

            // /////discard
            // var isAnOrPengGang = body.OperateWeaveItem.cbWeaveKind==WIK_GANG && 
            // (body.OperateWeaveItem.cbWeaveKindType==2 || body.OperateWeaveItem.cbWeaveKindType==3)

            // if(!isAnOrPengGang)//吃碰明杠需要popDiscard
            //     cmdBaseWorker.cbDiscardCount[cmdBaseWorker.wProvideUser]--
        }

        cmdBaseWorker.cbActionMask    = body.cbActionMask   



// 11111111111111111 维护cbHandCardData todo

    },
    onCMD_ReplaceResult:function(body)
    {
        cmdBaseWorker.wOperateUser = body.wOperateUser
        cmdBaseWorker.cbReplaceCardCount = body.cbReplaceCardCount
        cmdBaseWorker.cbReplaceCardData = body.cbReplaceCardData.slice(0, body.cbReplaceCardCount)

        cmdBaseWorker.bIsDaXi = body.bIsDaXi



  
        cmdBaseWorker.cbPlayerFlowerCount[cmdBaseWorker.wOperateUser]++
        cmdBaseWorker.cbPlayerFlowerCardData[cmdBaseWorker.wOperateUser] = 
        cmdBaseWorker.cbPlayerFlowerCardData[cmdBaseWorker.wOperateUser].concat(cmdBaseWorker.cbReplaceCardData)
    },
    onCMD_ListenResult:function(body)
    {
        cmdBaseWorker.wOperateUser = body.wOperateUser
        cmdBaseWorker.wOutCardUser = body.wOperateUser
        cmdBaseWorker.cbOutCardData = body.cbOutCardData
        cmdBaseWorker.cbOutCardCount++
        cmdBaseWorker.cbActionMask    = body.cbActionMask 
        cmdBaseWorker.wTakeCardUser = INVALID_WORD

        if(cmdBaseWorker.cbActionMask!=WIK_NULL)
        {
            cmdBaseWorker.wProvideUser    = body.wOperateUser 
            cmdBaseWorker.cbProvideCardData    = body.cbOutCardData   
            cmdBaseWorker.wCurrentUser = INVALID_WORD
        }
    },
    onCMD_GameEnd:function(body) 
    {
        console.log(1231,clone(body) )
        cmdBaseWorker.wExitUser       = body.wExitUser
        cmdBaseWorker.wProvideUser    = body.wProvideUser
        cmdBaseWorker.cbProvideCardData   = body.cbProvideCardData
        cmdBaseWorker.dwChiHuKind     = body.dwChiHuKind
        cmdBaseWorker.dwChiHuRight    = body.dwChiHuRight
        cmdBaseWorker.lGameTaiCount      = body.lGameTaiCount
        cmdBaseWorker.lGameScore      = body.lGameScore
        cmdBaseWorker.cbHandCardCount = body.cbHandCardCount
        for(var i=0;i<GAME_PLAYER;i++)
        {
            cmdBaseWorker.cbHandCardData[i] = body.cbHandCardData[i].slice(0, cmdBaseWorker.cbHandCardCount[i])
        }
        cmdBaseWorker.endType  = body.endType

        cmdBaseWorker.cbWeaveCount    = body.cbWeaveCount    
        cmdBaseWorker.WeaveItemArray  = body.WeaveItemArray  
        for(var i=0;i<GAME_PLAYER;i++)
        {
            for(var j=0;j<cmdBaseWorker.cbWeaveCount[i];j++)
            {
                var weaveItem = cmdBaseWorker.WeaveItemArray[i][j]
                if(weaveItem.cbWeaveKind!=WIK_GANG 
                    || (weaveItem.cbWeaveKind==WIK_GANG && weaveItem.cbValidCardDatas[0]==cmdBaseWorker.TurnoverCard[0].cbCardData)
                )
                {
                    weaveItem.cbValidCardDatas = weaveItem.cbValidCardDatas.slice(0, 3)
                    weaveItem.cbChangeCardDatas = weaveItem.cbChangeCardDatas.slice(0, 3)
                } 
            }
        }

        cmdBaseWorker.cbXi = body.cbXi    
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
    isTingCard:function(cardData, tingData) 
    {
        for(var i=0;i<tingData.length;i++)
        {
            if(cardData==tingData[i].cbTingCardData)
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
    sendMessage_ting:function(operateCards)
    {
        CMD_C_OperateCard[2][2] = operateCards.length
        var OperateCard = getObjWithStructName('CMD_C_OperateCard')
        OperateCard.cbOperateCode = WIK_LISTEN
        OperateCard.cbOperateCardCount = operateCards.length
        OperateCard.cbOperateCardData = operateCards
        socket.sendMessage(MDM_GF_GAME,SUB_C_OPERATE_CARD,OperateCard)
    },
    analyseCard_PengGang:function(handCardDatas, weaveItemArray)
    {
        var pengGangCardDatas = []

        /////////增杠
        for(var i=0;i<weaveItemArray.length;i++)
        {
            var weaveItem = weaveItemArray[i]
            if(weaveItem.cbWeaveKind == WIK_PENG)
            {
                var isHas = gameLogic.isHas(handCardDatas, [], [ weaveItem.cbChangeCardDatas[0] ])
                if( isHas[0] )
                    pengGangCardDatas[pengGangCardDatas.length] = weaveItem.cbChangeCardDatas[0]
            }
        }
        return pengGangCardDatas
    },
    analyseCard_AnGang:function(handCardDatas)
    {
        gameLogic.sortWithCardData(handCardDatas)

        var anGangCardDatas = []
        for(var i=0;i<handCardDatas.length;i++)
        {
            var cardData = handCardDatas[i]
            if(cmdBaseWorker.isMagicCard(cardData, cmdBaseWorker.cbMagicCardData))
                continue
            if(i>0 && cardData == handCardDatas[i-1])
                continue
            //高邮规则：翻财神那张牌，如果手里有3张可以暗杠出去 算小喜 不用摸牌
            if(cardData == cmdBaseWorker.TurnoverCard[0].cbCardData)
                var isHas = gameLogic.isHas(handCardDatas, [], [cardData, cardData, cardData])
            else
                var isHas = gameLogic.isHas(handCardDatas, [], [cardData, cardData, cardData, cardData])
            if(isHas[0])
                anGangCardDatas[anGangCardDatas.length] = cardData
        }

        return anGangCardDatas
    },
    searchGangCardDatas:function(handMajiangs, weaveItemArray) //自摸杠时找到杠哪个 服务器传? TODO
    {

        //暗杠
        var handCardDatas = handMajiangs[1]?[handMajiangs[1].cardData]:[]
        for(var i=0;i<handMajiangs[0].length;i++)
        {
            handCardDatas[handCardDatas.length] = handMajiangs[0][i].cardData
        }

        var pengGangCardDatas = cmdBaseWorker.analyseCard_PengGang(handCardDatas, weaveItemArray)
        var anGangCardDatas = cmdBaseWorker.analyseCard_AnGang(handCardDatas)


        var gangCardDatas = anGangCardDatas.concat(pengGangCardDatas)
        return gangCardDatas

        // gameLogic.sortWithCardData(handCardDatas)

        // var anGangCardDatas = []
        // for(var i=0;i<handCardDatas.length;i++)
        // {
        //     var cardData = handCardDatas[i]
        //     if(i>0 && cardData == handCardDatas[i-1])
        //         continue

        //     //高邮规则：翻财神那张牌，如果手里有3张可以暗杠出去 算小喜 不用摸牌
        //     if(cardData == cmdBaseWorker.TurnoverCard[0].cbCardData)
        //         var isHas = gameLogic.isHas(handCardDatas, [], [cardData, cardData, cardData])
        //     else
        //         var isHas = gameLogic.isHas(handCardDatas, [], [cardData, cardData, cardData, cardData])
        //     if(isHas[0])
        //         anGangCardDatas[anGangCardDatas.length] = cardData
        // }

        // /////////增杠
        // var weavePengCardDatas = []
        // for(var i=0;i<weaveMajiangs.length;i++)
        // {
        //     var majiangsOneGroup = weaveMajiangs[i]
        //     if(majiangsOneGroup.weaveItem.cbWeaveKind == WIK_PENG)
        //         weavePengCardDatas[weavePengCardDatas.length] = majiangsOneGroup[0].cardData   
        // }

        // var zengGangCardDatas = []
        // for(var i=0;i<handCardDatas.length;i++)
        // {
        //     var cardData = handCardDatas[i]
        //     if(i>0 && cardData == handCardDatas[i-1])
        //         continue
        //     var isHas = false
        //     for(var j=0;j<weavePengCardDatas.length;j++)
        //     {
        //         if(cardData==weavePengCardDatas[j])
        //             isHas = true
        //     }
        //     if(isHas)
        //         zengGangCardDatas[zengGangCardDatas.length] = cardData
        // }    

        // var gangCardDatas = anGangCardDatas.concat(zengGangCardDatas)
        // return gangCardDatas
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


}



