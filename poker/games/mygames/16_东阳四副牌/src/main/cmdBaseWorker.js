
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


    //客户端数据
    lCellScore:0,//单元积分
    cbTurnOver:null,//一轮结束
    cbHandCardDataOffLine:[],
    dwLastWinner:[],
    cbDiCardData:[],
    cbGameState:[],//游戏状态
    wReplaceUser:null,
    cbOutBombCount:[0, 0, 0, 0],
    cbOutCardTimes:null,
    cbMagicCardData:[],
    cbTurnoverCardData:[],
    init:function()
    {   
    },
    onReStart:function()
    {
        cmdBaseWorker.cbHandCardDataOffLine = []
        cmdBaseWorker.cbGameState = []
        cmdBaseWorker.wReplaceUser = INVALID_WORD
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
        cmdBaseWorker.lCellScore = body.lCellScore
        cmdBaseWorker.dwLastWinner = body.dwLastWinner
    },
    onCMD_StatusCall:function(body) 
    {
        cmdBaseWorker.initCardData2ScoreMap()

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
        

        cmdBaseWorker.cbDiCardData = body.cbDiCardData
        cmdBaseWorker.cbMagicCardData = body.cbMagicCardData
        for(var i=cmdBaseWorker.cbMagicCardData.length-1;i>=0;i--)
        {
            if(cmdBaseWorker.cbMagicCardData[i]==INVALID_CARD_DATA)
                cmdBaseWorker.cbMagicCardData.splice(i, 1)
        }

        cmdBaseWorker.cbTurnoverCardData = body.cbTurnoverCardData
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
        // cmdBaseWorker.cbGameState = body.cbGameState

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

        cmdBaseWorker.lPlayerData = [ [0,0], [0,0], [0,0], [0,0] ]
        cmdBaseWorker.cbGameState = body.cbGameState
        cmdBaseWorker.wReplaceUser = body.wReplaceUser
    },
    onCMD_OutCard:function(body) 
    {
        cmdBaseWorker.wCurrentUser = body.wCurrentUser
        cmdBaseWorker.wOutCardUser = body.wOutCardUser
        cmdBaseWorker.cbOutCardCount = body.cbOutCardCount
        cmdBaseWorker.cbOutCardData = body.cbOutCardData.slice(0, body.cbOutCardCount)
        cmdBaseWorker.outCardType = gameLogic.getCardsType(cardLogic.sortWithNum(clone(cmdBaseWorker.cbOutCardData))) 

        cmdBaseWorker.wWinOrder = body.wWinOrder
        cmdBaseWorker.lTurnData = body.lTurnData
        cmdBaseWorker.lPlayerData = body.lPlayerData

        var isOutCardUserOffLine = cmdBaseWorker.cbGameState[cmdBaseWorker.wOutCardUser] == US_OFFLINE_TRUSTEE 
        var isDeleteCard = cmdBaseWorker.wOutCardUser == tableData.getUserWithUserId(selfdwUserID).wChairID || isOutCardUserOffLine

        if(isDeleteCard)
        {
            var originCard = gameLogic.getOriginCard(cmdBaseWorker.cbOutCardData)

            var handCardData = cmdBaseWorker.cbHandCardData[cmdBaseWorker.wOutCardUser]

            if(isOutCardUserOffLine)
            {
                handCardData = cmdBaseWorker.cbHandCardDataOffLine[cmdBaseWorker.wOutCardUser]
            }

            for(var i=0;i<originCard.length;i++)
            {
                var outCardData = originCard[i]
                for(var ii=0;ii<handCardData.length;ii++)
                {
                    if(handCardData[ii] == outCardData)
                    {
                        handCardData.splice(ii, 1)
                        cmdBaseWorker.cbHandCardDataOffLine[cmdBaseWorker.wOutCardUser] = []
                        cmdBaseWorker.cbHandCardDataOffLine[cmdBaseWorker.wOutCardUser] = handCardData
                        break
                    }
                }
            }

            
        }

        cmdBaseWorker.cbHandCardData[wCurrentUser] = body.cbHandCardDataNext.slice(0, body.cbHandCardCount[wCurrentUser])
        cmdBaseWorker.sortHandCardDatas(cmdBaseWorker.cbHandCardData[wCurrentUser]) 

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
    },
    onCMD_OffLineOutCard:function(body)
    {
        cmdBaseWorker.cbGameState = body.cbGameState
        cmdBaseWorker.wReplaceUser = body.wReplaceUser
        cmdBaseWorker.wOutCardUser = body.wOutCardUser
        cmdBaseWorker.wOffLineUser = body.wOffLineUser

        for(var wChairID=0;wChairID<GAME_PLAYER;wChairID++)
        {
            cmdBaseWorker.cbHandCardDataOffLine[wChairID] = []
            if(cmdBaseWorker.cbGameState[wChairID] == US_OFFLINE_TRUSTEE)
            {
                cmdBaseWorker.cbHandCardDataOffLine[wChairID] = body.cbHandCardData[wChairID].slice(0, body.cbHandCardCount[wChairID])
                cmdBaseWorker.sortHandCardDatas(cmdBaseWorker.cbHandCardDataOffLine[wChairID]) 
                cmdBaseWorker.cbHandCardDataOffLine[wChairID].reverse()
            }
        }
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
        //return cardFactory.sortCardDatasWithScore(cardDatas)
        
        //东阳四副牌特殊排列 个数越多越靠前
        cardDatas = cardLogic.sortWithNum(cardDatas)

        var wangCount = 0
        for(var i=cardDatas.length-1;i>=0;i--) 
        {   
            if(cardDatas[i]>=78)
                wangCount++
            else
                break
        }

        var wangCardDatas = []
        var needSortArray = []
        for(var i=0;i<cardDatas.length;i++)
        {
            var cardData = cardDatas[i]
            if( wangCount>=4 && cardData>=78)
               wangCardDatas[wangCardDatas.length] = cardData
           else 
           {
                if( needSortArray.length>0 && 
                    cardLogic.getNum(needSortArray[needSortArray.length-1][0]) == cardLogic.getNum(cardData))
                {
                    var unWangCardDatas = needSortArray[needSortArray.length-1]
                    unWangCardDatas[unWangCardDatas.length] = cardData
                }
                else
                    needSortArray[needSortArray.length] = [cardData]
           }
        }

        needSortArray.sort(function(a,b)
        {   
            if(a.length == b.length)
                return gameLogic.num2Scores[cardLogic.getNum(a[0])] - gameLogic.num2Scores[cardLogic.getNum(b[0])]
            else
                return a.length - b.length
        })

        var t = []
        for(var i=0;i<needSortArray.length;i++)
        {
            t = t.concat( needSortArray[i] )
        } 

        t = t.concat(wangCardDatas)
  

        for(var i=0;i<cardDatas.length;i++)
        {
            cardDatas[i] = t[i]
        }

        return cardDatas
    },
}



