
var cmdBaseWorker = 
{   
    lTurnData:INVALID_LONG,//当前回合数据 一般显示在牌桌右下角 
    lPlayerData:[],//玩家数据 一般显示在玩家头像上方
    cbCallRecord:[], //叫分信息 不需要时设置为INVALID_BYTE
    wWinCount:null,                        //胜利人数
    wWinOrder:null,           //胜利列表

    //user变量
    wBankerUser:null,
    wCurrentUserCall:null,                     //当前玩家
    wCallUser:null,                        //当前玩家
    wCurrentUser:null,                     //当前玩家
    wOutCardUser:null,     
    wPassCardUser:null,

    //库存牌 手牌 打出牌
    cbRepertoryCardData:null,       //库存扑克
    cbHandCardCount:null,     //扑克数目
    cbHandCardData:[],   //手上扑克
    cbOutCardCount:null,                   //出牌数目
    cbOutCardData:null,     //出牌数据
    outCardType:{typeIdx:0, typeLevel:0, typeScores:0},
    
    //用于客户端显示的辅助数据
    lGameScore:null,//游戏得分 CMD_S_GameEnd
    wExitUser:null,//强退用户 CMD_S_GameEnd
    wShowHandUser:null,
    hasGameType:null,


    //客户端数据
    lCellScore:0,//单元积分
    cbTurnOver:null,//一轮结束
    dwLastWinner:[],
    cbDiCardData:[],
    cbOutBombCount:[0, 0, 0, 0],
    cbOutCardTimes:null,
    cbMagicCardData:[],
    cbTurnoverCardData:[],
    init:function()
    {   
    },
    onReStart:function()
    {
        cmdBaseWorker.hasGameType = null
        cmdBaseWorker.wShowHandUser = null
        cmdBaseWorker.lTurnData = 0
        cmdBaseWorker.lPlayerData = []
        cmdBaseWorker.cbCallRecord = []
        cmdBaseWorker.cbHandCardData = []
        cmdBaseWorker.cbMagicCardData = []//[78, 79]
        cmdBaseWorker.lCellScore = 0
        cmdBaseWorker.dwLastWinner = []
        cmdBaseWorker.cbOutBombCount = [0, 0, 0, 0 ]
        cmdBaseWorker.outCardType = {typeIdx:0, typeLevel:0, typeScores:0}
    },
    onCMD_StatusFree:function(body) 
    {
        cmdBaseWorker.hasGameType = body.hasGameType
        cmdBaseWorker.lCellScore = body.lCellScore
        cmdBaseWorker.dwLastWinner = body.dwLastWinner
    },
    onCMD_StatusCall:function(body) 
    {
        cmdBaseWorker.initCardData2ScoreMap()

        cmdBaseWorker.hasGameType = body.hasGameType
        cmdBaseWorker.lCellScore = body.lCellScore
        cmdBaseWorker.wCurrentUserCall = body.wCurrentUserCall
        cmdBaseWorker.cbCallRecord = body.cbCallRecord

        for(var wChairID=0;wChairID<GAME_PLAYER;wChairID++)
        {
            cmdBaseWorker.cbHandCardData[wChairID] = []
            if( wChairID== tableData.getUserWithUserId(selfdwUserID).wChairID )
            {
                cmdBaseWorker.cbHandCardData[wChairID] = body.cbHandCardDataSelf.slice(0, body.cbHandCardCount[wChairID])
                cmdBaseWorker.sortHandCardDatas(cmdBaseWorker.cbHandCardData[wChairID]) 
            }
        }
        cmdBaseWorker.cbHandCardCount = body.cbHandCardCount
    },
    onCMD_StatusPlay:function(body) 
    {
        cmdBaseWorker.hasGameType = body.hasGameType
        cmdBaseWorker.cbShowHandCardData = body.cbShowHandCardData
        cmdBaseWorker.wisShowFriend = body.wisShowFriend
        cmdBaseWorker.wShowHandUser = body.wShowHandUser
        cmdBaseWorker.lCellScore = body.lCellScore
        cmdBaseWorker.wCurrentUser = body.wCurrentUser
        cmdBaseWorker.wBankerUser = body.wBankerUser
        cmdBaseWorker.cbCallRecord = body.cbCallRecord
        cmdBaseWorker.wWinOrder = body.wWinOrder
        cmdBaseWorker.lTurnData = body.lTurnData
        cmdBaseWorker.lPlayerData = body.lPlayerData
        cmdBaseWorker.wOutCardUser = body.wOutCardUser
        cmdBaseWorker.cbOutCardCount = body.cbOutCardCount
        cmdBaseWorker.cbOutCardData = body.cbOutCardData.slice(0, body.cbOutCardCount)
        cmdBaseWorker.outCardType = gameLogic.getCardsType(cardLogic.sortWithNum(clone(cmdBaseWorker.cbOutCardData))) 
        cmdBaseWorker.cbOutUserHandCount = body.cbOutUserHandCount

        cmdBaseWorker.cbDiCardData = body.cbDiCardData
        cmdBaseWorker.cbMagicCardData = body.cbMagicCardData
        for(var i=cmdBaseWorker.cbMagicCardData.length-1;i>=0;i--)
        {
            if(cmdBaseWorker.cbMagicCardData[i]==INVALID_CARD_DATA)
                cmdBaseWorker.cbMagicCardData.splice(i, 1)
        }

        cmdBaseWorker.cbTurnoverCardData = body.cbTurnoverCardData
        cmdBaseWorker.cbTurnoverFirendCardData = body.cbTurnoverFirendCardData
        cmdBaseWorker.cbOutBombCount = body.cbOutBombCount

        //初始化cardData2ScoreMap
        cmdBaseWorker.initCardData2ScoreMap()

        for(var wChairID=0;wChairID<GAME_PLAYER;wChairID++)
        {
            cmdBaseWorker.cbHandCardData[wChairID] = []
            if( wChairID== tableData.getUserWithUserId(selfdwUserID).wChairID )
            {
                cmdBaseWorker.cbHandCardData[wChairID] = body.cbHandCardDataSelf.slice(0, body.cbHandCardCount[wChairID])
                cmdBaseWorker.sortHandCardDatas(cmdBaseWorker.cbHandCardData[wChairID]) 
            }
        }
        cmdBaseWorker.cbHandCardCount = body.cbHandCardCount
    },
    onCMD_CallNotify:function(body) 
    {
        cmdBaseWorker.initCardData2ScoreMap()
        
        cmdBaseWorker.wCurrentUserCall = body.wCurrentUserCall
        cmdBaseWorker.cbHandCardCount = body.cbHandCardCount
        for(var wChairID=0;wChairID<GAME_PLAYER;wChairID++)
        {
            cmdBaseWorker.cbHandCardData[wChairID] = []
            if( wChairID== tableData.getUserWithUserId(selfdwUserID).wChairID )
            {
                cmdBaseWorker.cbHandCardData[wChairID] = body.cbHandCardDataSelf.slice(0, body.cbHandCardCount[wChairID])
                cmdBaseWorker.sortHandCardDatas(cmdBaseWorker.cbHandCardData[wChairID]) 
            }
        }

    },
    onCMD_CallResult:function(body) 
    {     
        cmdBaseWorker.wCallUser = body.wCallUser
        cmdBaseWorker.cbCallRecord = body.cbCallRecord
        cmdBaseWorker.wCurrentUserCall = body.wCurrentUserCall
    },
    onCMD_GameStart:function(body) 
    {
        cmdBaseWorker.cbShowHandCardData = body.cbShowHandCardData
        cmdBaseWorker.wShowHandUser = body.wShowHandUser
        cmdBaseWorker.wCurrentUser = body.wCurrentUser
        cmdBaseWorker.wBankerUser = body.wBankerUser
        cmdBaseWorker.cbDiCardData = body.cbDiCardData
        cmdBaseWorker.cbMagicCardData = body.cbMagicCardData
        for(var i=cmdBaseWorker.cbMagicCardData.length-1;i>=0;i--)
        {
            if(cmdBaseWorker.cbMagicCardData[i]==INVALID_CARD_DATA)
                cmdBaseWorker.cbMagicCardData.splice(i, 1)
        }

        cmdBaseWorker.cbTurnoverCardData = body.cbTurnoverCardData
        cmdBaseWorker.cbTurnoverFirendCardData = body.cbTurnoverFirendCardData

        //初始化cardData2ScoreMap
        cmdBaseWorker.initCardData2ScoreMap()
        for(var wChairID=0;wChairID<GAME_PLAYER;wChairID++)
        {
            cmdBaseWorker.cbHandCardData[wChairID] = []
            if( wChairID== tableData.getUserWithUserId(selfdwUserID).wChairID )
            {
                cmdBaseWorker.cbHandCardData[wChairID] = body.cbHandCardDataSelf.slice(0, body.cbHandCardCount[wChairID])
                cmdBaseWorker.sortHandCardDatas(cmdBaseWorker.cbHandCardData[wChairID]) 
            }
        }
        cmdBaseWorker.cbHandCardCount = body.cbHandCardCount

        cmdBaseWorker.cbOutBombCount = [0, 0, 0, 0]

        cmdBaseWorker.lPlayerData = [ [0], [0], [0], [0] ]
    },
    onCMD_OutCard:function(body) 
    {
        cmdBaseWorker.cbShowHandCardData = body.cbShowHandCardData
        cmdBaseWorker.wShowHandUser = body.wShowHandUser
        cmdBaseWorker.wCurrentUser = body.wCurrentUser
        cmdBaseWorker.wOutCardUser = body.wOutCardUser
        cmdBaseWorker.cbOutCardCount = body.cbOutCardCount
        cmdBaseWorker.cbOutCardData = body.cbOutCardData.slice(0, body.cbOutCardCount)
        cmdBaseWorker.outCardType = gameLogic.getCardsType(cardLogic.sortWithNum(clone(cmdBaseWorker.cbOutCardData))) 
        cmdBaseWorker.wisShowFriend = body.wisShowFriend
        cmdBaseWorker.cbOutUserHandCount = body.cbOutUserHandCount

        cmdBaseWorker.wWinOrder = body.wWinOrder
        cmdBaseWorker.lTurnData = body.lTurnData
        cmdBaseWorker.lPlayerData = body.lPlayerData

        if( cmdBaseWorker.wOutCardUser == tableData.getUserWithUserId(selfdwUserID).wChairID )
        {
            var originCard = gameLogic.getOriginCard(cmdBaseWorker.cbOutCardData)

            var handCardData = cmdBaseWorker.cbHandCardData[cmdBaseWorker.wOutCardUser]
            for(var i=0;i<originCard.length;i++)
            {
                var outCardData = originCard[i]
                for(var ii=0;ii<handCardData.length;ii++)
                {
                    if(handCardData[ii] == outCardData)
                    {
                        handCardData.splice(ii, 1)
                        break
                    }
                }
            }
        }
        if(cmdBaseWorker.outCardType.typeLevel>1)
            cmdBaseWorker.cbOutBombCount[cmdBaseWorker.wOutCardUser]++
    },
    onCMD_PassCard:function(body) 
    {
        cmdBaseWorker.cbTurnOver = body.cbTurnOver
        cmdBaseWorker.wCurrentUser = body.wCurrentUser
        cmdBaseWorker.wPassCardUser = body.wPassCardUser
    
        cmdBaseWorker.lPlayerData = body.lPlayerData

        if(cmdBaseWorker.cbTurnOver)
            cmdBaseWorker.outCardType = {typeIdx:0, typeLevel:0, typeScores:0}
    },
    onCMD_GameEnd:function(body) 
    {
        cmdBaseWorker.wExitUser = body.wExitUser
        cmdBaseWorker.lGameScore = body.lGameScore
        cmdBaseWorker.wWinOrder = body.wWinOrder
        cmdBaseWorker.lTurnData = body.lTurnData
        cmdBaseWorker.lPlayerData = body.lPlayerData

        for(var wChairID=0;wChairID<GAME_PLAYER;wChairID++)
        {
            cmdBaseWorker.cbHandCardData[wChairID] = body.cbHandCardData[wChairID].slice(0, body.cbHandCardCount[wChairID])
            cmdBaseWorker.sortHandCardDatas(cmdBaseWorker.cbHandCardData[wChairID]) 
            cmdBaseWorker.cbHandCardData[wChairID].reverse()
        }
        cmdBaseWorker.cbHandCardCount = body.cbHandCardCount  

        cmdBaseWorker.dwLastWinner = body.dwLastWinner
        cmdBaseWorker.cbOutCardTimes = body.cbOutCardTimes

        cmdBaseWorker.outCardType = {typeIdx:0, typeLevel:0, typeScores:0}
        cmdBaseWorker.cbMagicCardData = []
        cmdBaseWorker.cbWinType = body.cbWinType
    },
    onCMD_GameType:function(body)
    {
        cmdBaseWorker.hasGameType = body.hasGameType
    },
    fillCMD_OutCard:function(body, cardsType) 
    {
        body.cbOutCardCount = cardsType.cardDatas.length
        body.cbOutCardData = cardsType.cardDatas
        body.cbTypeLevel = cardsType.typeLevel
    },        
    initCardData2ScoreMap:function()
    {
        var cardDatas = []
        var scores = []
        for(var num=1;num<16;num++) //大王小王 num=14,15 color=4(不属于普通花色 方片梅花红桃黑桃分别是0123)
        {
            for(var color=0;color<5;color++)
            {
                cardDatas[cardDatas.length] = color*16+num
                scores[scores.length] = gameLogic.num2Scores[num]*5 + color
            }
        }

        var magicCardData = cmdBaseWorker.cbMagicCardData 

        for(var i=0;i<magicCardData.length;i++)
        {
            if(magicCardData[i] == INVALID_CARD_DATA)
                break
            cardDatas[cardDatas.length] = magicCardData[i]
            scores[scores.length] = 1000+magicCardData[i]
        }
        cardFactory.initCardData2ScoreMap( cardDatas, scores )
    },
    //排列手牌
    sortHandCardDatas:function(cardDatas)
    {
        return cardFactory.sortCardDatasWithScore(cardDatas)
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
}



