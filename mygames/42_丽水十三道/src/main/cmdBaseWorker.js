
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
    cbResidualCard:[],
    cbOutCardCount:null,                   //出牌数目
    cbOutCardData:null,     //出牌数据
    cbOutChangeCard:null,       //变幻扑克
    cbGameTime:null,//当前游戏局数

    //用于客户端显示的辅助数据
    lGameScore:null,//游戏得分 CMD_S_GameEnd
    wExitUser:null,//强退用户 CMD_S_GameEnd


    //客户端数据
    cbMagicCardData:[],
    lCellScore:0,//单元积分
    cbCallScore:null,
    cbTurnOver:null,//一轮结束
    dwLastWinner:[],

    init:function()
    {   
    },
    onReStart:function()
    {
        cmdBaseWorker.lTurnData = 0
        cmdBaseWorker.lPlayerData = []
        cmdBaseWorker.cbCallRecord = []
        cmdBaseWorker.cbHandCardData = []
        cmdBaseWorker.cbMagicCardData = []
        cmdBaseWorker.lCellScore = 0
    },
    onCMD_StatusFree:function(body) 
    {
        cmdBaseWorker.lCellScore = body.lCellScore
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
                cmdBaseWorker.sortHandCardDatas(cmdBaseWorker.cbHandCardData[wChairID]) 
            }
        }
        cmdBaseWorker.cbHandCardCount = body.cbHandCardCount
    },
    onCMD_StatusPlay:function(body) 
    {
        //初始化cardData2ScoreMap
        // cmdBaseWorker.initCardData2ScoreMap()
        cmdBaseWorker.lCellScore = body.lCellScore
        cmdBaseWorker.cbGameTime = body.cbGameTime
        for(var wChairID=0;wChairID<GAME_PLAYER;wChairID++)
        {
            cmdBaseWorker.cbHandCardData[wChairID] = []
            if( wChairID== tableData.getUserWithUserId(selfdwUserID).wChairID )
            {
                cmdBaseWorker.cbHandCardData[wChairID] = body.cbHandCardDataSelf
                cmdBaseWorker.sortHandCardDatas(cmdBaseWorker.cbHandCardData[wChairID]) 
                cmdBaseWorker.cbResidualCard[wChairID] = body.cbResidualCard
            }
            else
            {
                //应该服务器处理 todo
                body.cbCallRecord[wChairID].headCardDatas = [0,0,0]
                body.cbCallRecord[wChairID].headLevel = 0
                body.cbCallRecord[wChairID].headScore = 0

                body.cbCallRecord[wChairID].centerCardDatas = [0,0,0,0,0]
                body.cbCallRecord[wChairID].centerLevel = 0
                body.cbCallRecord[wChairID].centerScore = 0

                body.cbCallRecord[wChairID].tailCardDatas = [0,0,0,0,0]
                body.cbCallRecord[wChairID].tailLevel = 0
                body.cbCallRecord[wChairID].tailScore = 0
            }
        }
        cmdBaseWorker.cbCallRecord = body.cbCallRecord

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
                cmdBaseWorker.sortHandCardDatas(cmdBaseWorker.cbHandCardData[wChairID]) 
            }
        }
        cmdBaseWorker.cbHandCardCount = body.cbHandCardCount
    },
    onCMD_CallResult:function(body) 
    {     
        cmdBaseWorker.wCallUser = body.wCallUser
        //应该服务器处理 todo
        if(tableData.getUserWithUserId(selfdwUserID).wChairID != cmdBaseWorker.wCallUser)
        {
            body.callBody.headCardDatas = [0,0,0]
            body.callBody.headLevel = 0
            body.callBody.headScore = 0

            body.callBody.centerCardDatas = [0,0,0,0,0]
            body.callBody.centerLevel = 0
            body.callBody.centerScore = 0

            body.callBody.tailCardDatas = [0,0,0,0,0]
            body.callBody.tailLevel = 0
            body.callBody.tailScore = 0
        }
        cmdBaseWorker.callBody = body.callBody


    },
    onCMD_GameStart:function(body) 
    {
        cmdBaseWorker.cbCallRecord = []
        //初始化cardData2ScoreMap
        // cmdBaseWorker.initCardData2ScoreMap()

        cmdBaseWorker.wCurrentUser = body.wCurrentUser
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
        cmdBaseWorker.cbGameTime = body.cbGameTime
    },
    onCMD_OutCard:function(body) 
    {
        cmdBaseWorker.wCurrentUser = body.wCurrentUser
        cmdBaseWorker.wOutCardUser = body.wOutCardUser
        cmdBaseWorker.cbOutCardCount = body.cbOutCardCount
        cmdBaseWorker.cbOutCardData = body.cbOutCardData.slice(0, body.cbOutCardCount)
        cmdBaseWorker.cbOutChangeCard = body.cbOutChangeCard.slice(0, body.cbOutCardCount)

        cmdBaseWorker.wWinOrder = body.wWinOrder
        cmdBaseWorker.lTurnData = body.lTurnData
        cmdBaseWorker.lPlayerData = body.lPlayerData
    },
    onCMD_PassCard:function(body) 
    {
        cmdBaseWorker.cbTurnOver = body.cbTurnOver
        cmdBaseWorker.wCurrentUser = body.wCurrentUser
        cmdBaseWorker.wPassCardUser = body.wPassCardUser
    
        cmdBaseWorker.lPlayerData = body.lPlayerData
    },
    onCMD_GameEnd:function(body) 
    {
        cmdBaseWorker.wExitUser = body.wExitUser
        cmdBaseWorker.lGameScore = body.lGameScore
        cmdBaseWorker.lBaseScore = body.lBaseScore
        cmdBaseWorker.lExtraScore = body.lExtraScore
        cmdBaseWorker.bIsDaqiang = body.bIsDaqiang
        cmdBaseWorker.wDa3qiangUser = body.wDa3qiangUser
        cmdBaseWorker.cbCallRecord = body.cbCallRecord
    },
    fillCMD_OutCard:function(body, cardsType) 
    {
        var starNum = cmdBaseWorker.getStarNum(cardsType)
        body.shangCount = starNum>0?starNum-6:0
        body.cbOutCardCount = cardsType.idxs.length
        var t = gameLogic.getDataAndChangeDataWithIdxs(cardsType.idxs)
        body.cbOutCardData = t[0]
        body.cbOutChangeCard = t[1]
    },
    // initCardData2ScoreMap:function()
    // {
    //     var cardDatas = []
    //     var scores = []
    //     for(var num=1;num<16;num++) //大王小王 num=14,15 color=4(不属于普通花色 方片梅花红桃黑桃分别是0123)
    //     {
    //         for(var color=0;color<5;color++)
    //         {
    //             cardDatas[cardDatas.length] = color*16+num
    //             scores[scores.length] = gameLogic.num2Scores[num]*5 + color
    //         }
    //     }

    //     var magicCardData = cmdBaseWorker.cbMagicCardData 
    //     for(var i=0;i<magicCardData.length;i++)
    //     {
    //         if(magicCardData[i] == INVALID_CARD_DATA)
    //             break
    //         cardDatas[cardDatas.length] = magicCardData[i]
    //         scores[scores.length] = 1000+magicCardData[i]
    //     }
    //     // cardFactory.initCardData2ScoreMap( cardDatas, scores )
    // },
    sortHandCardDatas:function(cardDatas)
    {
        //return cardFactory.sortCardDatasWithScore(cardDatas)
        
        //东阳四副牌特殊排列 个数越多越靠前
        // cardDatas = cardLogic.sortWithNum(cardDatas)
        // var wangCardDatas = []
        // var unWangCardDatasArray = []
        // for(var i=0;i<cardDatas.length;i++)
        // {
        //     var cardData = cardDatas[i]
        //     if(cardData>=78)
        //        wangCardDatas[wangCardDatas.length] = cardData
        //    else 
        //    {
        //         if( unWangCardDatasArray.length>0 && 
        //             cardLogic.isSameCard(unWangCardDatasArray[unWangCardDatasArray.length-1][0], cardData) )
        //         {
        //             var unWangCardDatas = unWangCardDatasArray[unWangCardDatasArray.length-1]
        //             unWangCardDatas[unWangCardDatas.length] = cardData
        //         }
        //         else
        //             unWangCardDatasArray[unWangCardDatasArray.length] = [cardData]
        //    }
        // }

        // unWangCardDatasArray.sort(function(a,b)
        // {   
        //     if(a.length == b.length)
        //         return gameLogic.num2Scores[cardLogic.getNum(a[0])] - gameLogic.num2Scores[cardLogic.getNum(b[0])]
        //     else
        //         return a.length - b.length
        // })

        // var t = []
        // for(var i=0;i<unWangCardDatasArray.length;i++)
        // {
        //     t = t.concat( unWangCardDatasArray[i] )
        // } 

        // t = t.concat(wangCardDatas)

        // for(var i=0;i<cardDatas.length;i++)
        // {
        //     cardDatas[i] = t[i]
        // }

        return cardDatas
    },
    getStarNum:function(cardsType)
    {
        var starNum = 0
        if(cardsType.typeLevel >= 26)
            starNum = 16
        else if(cardsType.typeLevel >= 25)
            starNum = 15
        else if(cardsType.typeLevel >= 22)
            starNum = 14
        else if(cardsType.typeLevel >= 21)
            starNum = 13
        else if(cardsType.typeLevel >= 17)
            starNum = 12
        else if(cardsType.typeLevel >= 16)
            starNum = 11
        else if(cardsType.typeLevel >= 13)
            starNum = 10
        else if(cardsType.typeLevel >= 12)
            starNum = 9
        else if(cardsType.typeLevel >= 9)
            starNum = 8
        else if(cardsType.typeLevel >= 5)
            starNum = 7
        else
            starNum = 0

        return starNum
    }
}



