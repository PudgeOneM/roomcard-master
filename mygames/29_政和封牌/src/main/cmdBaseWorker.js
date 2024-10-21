
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
    wOutCardUser:INVALID_WORD,     
    wPassCardUser:null,
    cbPlayCount:0,
    bPass:[],

    //库存牌 手牌 打出牌
    cbRepertoryCardData:null,       //库存扑克
    cbHandCardCount:[],     //扑克数目
    cbHandCardData:[],   //手上扑克
    cbOutCardCount:null,                   //出牌数目
    cbOutCardData:[],     //出牌数据
    outCardType:{cbType:CT_ERROR, cbLength:0, cbLogicValue:0},
    
    //用于客户端显示的辅助数据
    lGameScore:null,//游戏得分 CMD_S_GameEnd
    wExitUser:null,//强退用户 CMD_S_GameEnd


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
        cmdBaseWorker.lTurnData = 0
        cmdBaseWorker.lPlayerData = []
        cmdBaseWorker.cbCallRecord = []
        cmdBaseWorker.cbHandCardCount = []
        cmdBaseWorker.cbHandCardData = []
        cmdBaseWorker.cbMagicCardData = []//[78, 79]
        cmdBaseWorker.lCellScore = 0
        cmdBaseWorker.dwLastWinner = []
        cmdBaseWorker.cbOutBombCount = []
        cmdBaseWorker.wOutCardUser = INVALID_WORD
        cmdBaseWorker.cbOutCardData = []
        cmdBaseWorker.outCardType = {cbType:CT_ERROR, cbLength:0, cbLogicValue:0}
    },
    onCMD_StatusFree:function(body) 
    {
        cmdBaseWorker.lCellScore = body.lCellScore
        cmdBaseWorker.dwLastWinner = body.dwLastWinner
    },
    onCMD_StatusCall:function(body) 
    {
        cmdBaseWorker.lCellScore = body.lCellScore
        cmdBaseWorker.wCurrentUserCall = body.wCurrentUserCall
        cmdBaseWorker.cbCallRecord = body.cbCallRecord

        for(var wChairID=0;wChairID<GAME_PLAYER;wChairID++)
        {
            cmdBaseWorker.cbHandCardData[wChairID] = []
            if( wChairID== tableData.getUserWithUserId(selfdwUserID).wChairID )
            {
                cmdBaseWorker.cbHandCardData[wChairID] = body.cbHandCardDataSelf.slice(0, body.cbHandCardCount[wChairID])
            }
        }
        cmdBaseWorker.cbHandCardCount = body.cbHandCardCount
    },
    onCMD_StatusPlay:function(body) 
    {
        cmdBaseWorker.lCellScore = body.lCellScore
        cmdBaseWorker.wCurrentUser = body.wCurrentUser
        cmdBaseWorker.wBankerUser = body.wBankerUser
        cmdBaseWorker.wOutCardUser = body.wOutCardUser
        cmdBaseWorker.cbOutCardCount = body.cbOutCardCount
        cmdBaseWorker.cbOutCardData = body.cbOutCardData.slice(0, body.cbOutCardCount)
        cmdBaseWorker.outCardType = gameLogic.GetCardType(cmdBaseWorker.cbOutCardData, cmdBaseWorker.cbHandCardCount[cmdBaseWorker.wOutCardUser]), 
        cmdBaseWorker.cbHandCardCount = body.cbHandCardCount
        cmdBaseWorker.cbOutBombCount = body.cbOutBombCount
        cmdBaseWorker.cbPlayCount = body.cbPlayCount
        cmdBaseWorker.bPass = body.bPass

        for(var wChairID=0;wChairID<GAME_PLAYER;wChairID++)
        {
            cmdBaseWorker.cbHandCardData[wChairID] = []
            if( wChairID== tableData.getUserWithUserId(selfdwUserID).wChairID )
            {
                cmdBaseWorker.cbHandCardData[wChairID] = body.cbHandCardDataSelf.slice(0, body.cbHandCardCount[wChairID])
            }
        }
    },
    onCMD_CallNotify:function(body) 
    {
        cmdBaseWorker.wCurrentUserCall = body.wCurrentUserCall
        cmdBaseWorker.cbHandCardCount = body.cbHandCardCount
        for(var wChairID=0;wChairID<GAME_PLAYER;wChairID++)
        {
            cmdBaseWorker.cbHandCardData[wChairID] = []
            if( wChairID== tableData.getUserWithUserId(selfdwUserID).wChairID )
            {
                cmdBaseWorker.cbHandCardData[wChairID] = body.cbHandCardDataSelf.slice(0, body.cbHandCardCount[wChairID])
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
        cmdBaseWorker.wBankerUser = body.wBankerUser
        cmdBaseWorker.wCurrentUser = body.wCurrentUser
        cmdBaseWorker.cbPlayCount = body.cbPlayCount

        for(var wChairID=0;wChairID<GAME_PLAYER;wChairID++)
        {
            cmdBaseWorker.cbHandCardCount[wChairID] = MAX_COUNT
            cmdBaseWorker.cbOutBombCount[wChairID] = 0

            cmdBaseWorker.cbHandCardData[wChairID] = []
            if( wChairID== tableData.getUserWithUserId(selfdwUserID).wChairID )
            {
                cmdBaseWorker.cbHandCardData[wChairID] = body.cbCardData.slice(0, cmdBaseWorker.cbHandCardCount[wChairID])
            }
        }

        cmdBaseWorker.wOutCardUser = INVALID_WORD
        cmdBaseWorker.outCardType = { cbType:CT_ERROR, cbLength:0, cbLogicValue:0 }
    },
    onCMD_OutCard:function(body) 
    {
        cmdBaseWorker.wCurrentUser = body.wCurrentUser
        cmdBaseWorker.wOutCardUser = body.wOutCardUser
        cmdBaseWorker.cbOutCardCount = body.cbOutCardCount
        cmdBaseWorker.cbOutCardData = body.cbOutCardData.slice(0, body.cbOutCardCount)
        cmdBaseWorker.outCardType = gameLogic.GetCardType(cmdBaseWorker.cbOutCardData, cmdBaseWorker.cbHandCardCount[cmdBaseWorker.wOutCardUser])
        cmdBaseWorker.bPass = body.bPass

        cmdBaseWorker.cbHandCardCount[cmdBaseWorker.wOutCardUser] -= body.cbOutCardCount
        if( cmdBaseWorker.wOutCardUser == tableData.getUserWithUserId(selfdwUserID).wChairID )
        {
            var originCard = cmdBaseWorker.cbOutCardData
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
    },
    onCMD_PassCard:function(body) 
    {
        cmdBaseWorker.wCurrentUser = body.wCurrentUser
        cmdBaseWorker.wPassCardUser = body.wPassCardUser
        cmdBaseWorker.bPass = body.bPass
    },
    onCMD_GameEnd:function(body) 
    {
        cmdBaseWorker.wExitUser = body.wExitUser
        cmdBaseWorker.cbOutBombCount = body.bBombCount
        cmdBaseWorker.lGameScore = body.lGameScore
        cmdBaseWorker.cbOutCardCount = body.bCardCount
        cmdBaseWorker.cbPlayCount = body.cbPlayCount

        for(var wChairID=0;wChairID<GAME_PLAYER;wChairID++)
        {
            cmdBaseWorker.cbHandCardData[wChairID] = body.bCardData[wChairID].slice(0, body.bCardCount[wChairID]) 
        }

        cmdBaseWorker.outCardType = { cbType:CT_ERROR, cbLength:0, cbLogicValue:0 }
    },
    fillCMD_OutCard:function(body, cards) 
    {
        body.cbOutCardCount = cards.length, 
        body.cbOutCardData = cards
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



