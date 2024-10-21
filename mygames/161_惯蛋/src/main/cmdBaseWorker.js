
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
    cbChangeChair:0,
    //队伍数据
    cbTeamProcess:null,
    cbCurTeam:null,
    cbLastResult:null,
    cbTributeGiveCard:null,
    cbTributeGiveSelectCard:null,

    //上贡相关
    cbTributeProgress:null,
    cbTributeProCards:null,
    cbNewCards:null,
    wTributeUser:null,
    //客户端数据
    lCellScore:0,//单元积分
    cbTurnOver:null,//一轮结束
    dwLastWinner:[],
    cbDiCardData:[],
    cbOutBombCount:[0, 0, 0, 0],
    cbOutCardTimes:null,
    cbMagicCardData:[],
    cbTurnoverCardData:[],
    cbTongHuaIdx:0,
    cbSortType:0,
    cbArrangeCardCount:[],
    cbArrangeCardData:[],
    cbTHSCompare:0,//同花顺是否区分花色 0不区分 1区分
    init:function()
    {   
    },
    onReStart:function()
    {
        cmdBaseWorker.lTurnData = 0
        cmdBaseWorker.lPlayerData = []
        cmdBaseWorker.cbCallRecord = []
        cmdBaseWorker.cbHandCardData = []
        cmdBaseWorker.cbMagicCardData = []//[78, 79]
        cmdBaseWorker.lCellScore = 0
        cmdBaseWorker.dwLastWinner = []
        cmdBaseWorker.cbOutBombCount = [0, 0, 0, 0 ]
        cmdBaseWorker.outCardType = {typeIdx:0, typeLevel:0, typeScores:0}
        cmdBaseWorker.cbTributeGiveSelectCard = INVALID_BYTE
        cmdBaseWorker.wTributeUser = INVALID_WORD
        cmdBaseWorker.cbTributeProgress = 0
        cmdBaseWorker.cbTongHuaIdx = 0
        cmdBaseWorker.cbSortType = 0
        cmdBaseWorker.cbArrangeCardCount = [0,0,0,0]
        cmdBaseWorker.cbArrangeCardData = []
        cmdBaseWorker.cbTHSCompare = 0

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
                cmdBaseWorker.cbHandCardData[wChairID].reverse()
               // cmdBaseWorker.sortHandCardDatas(cmdBaseWorker.cbHandCardData[wChairID]) 
            }
        }
        cmdBaseWorker.cbHandCardCount = body.cbHandCardCount
    },
    onTributeResult:function(body)
    {
        cmdBaseWorker.wCurrentUser = body.wCurrentUser
        cmdBaseWorker.wTributeUser = body.wTributeUser
        cmdBaseWorker.cbTributeProgress = body.cbTributeProgress
        cmdBaseWorker.cbTributeProCards = body.cbTributeProCards
        cmdBaseWorker.cbNewCards = body.cbNewCards
        var selfChairID = tableData.getUserWithUserId(selfdwUserID).wChairID
        
        for(var wChairID=0;wChairID<GAME_PLAYER;wChairID++)
        {
            cmdBaseWorker.cbHandCardData[wChairID] = []
            if( wChairID== tableData.getUserWithUserId(selfdwUserID).wChairID )
            {
                cmdBaseWorker.cbHandCardData[wChairID] = body.cbHandCardDataSelf.slice(0, MAX_COUNT)
                if(cmdBaseWorker.cbSortType == ST_TYPE)
                    cmdBaseWorker.sortArrangeCard(wChairID);
                cmdBaseWorker.cbHandCardData[wChairID].reverse()
            }
        }
    },
    onSortCard:function(body)
    {
        cmdBaseWorker.cbHandCardCount = body.cbHandCardCount
        for(var wChairID=0;wChairID<GAME_PLAYER;wChairID++)
        {
            cmdBaseWorker.cbHandCardData[wChairID] = []
            if( wChairID== tableData.getUserWithUserId(selfdwUserID).wChairID )
            {
                cmdBaseWorker.cbSortType = body.cbSortType
                cmdBaseWorker.cbHandCardData[wChairID] = body.cbHandCardDataSelf.slice(0, body.cbHandCardCount[wChairID])
                if(body.cbSortType == ST_TYPE){
                    
                    cmdBaseWorker.sortArrangeCard(wChairID)
                    //var originalCards = body.cbHandCardDataSelf.slice(0, body.cbHandCardCount[wChairID])
                    //var sortedCards = []
                   // gameLogic.sortCardsByType( originalCards, sortedCards)
                    //cmdBaseWorker.cbHandCardData[wChairID] = sortedCards.slice(0, sortedCards.length)
                }
                cmdBaseWorker.cbHandCardData[wChairID].reverse()
            }
        }
    },
    onArrangeCard:function(body)
    {
        for(var wChairID=0;wChairID<GAME_PLAYER;wChairID++)
        {
            cmdBaseWorker.cbHandCardData[wChairID] = []
            if( wChairID== tableData.getUserWithUserId(selfdwUserID).wChairID )
            {
                cmdBaseWorker.cbHandCardData[wChairID] = body.cbHandCardDataSelf.slice(0, body.cbHandCardCount[wChairID])
                cmdBaseWorker.cbArrangeCardData[wChairID] = body.cbArrangeCardData.slice(0,body.cbArrangeCardCount)
                cmdBaseWorker.cbArrangeCardCount[wChairID] = body.cbArrangeCardCount
                if(cmdBaseWorker.cbSortType == ST_TYPE)
               {
                    cmdBaseWorker.sortArrangeCard(wChairID)
                }
                cmdBaseWorker.cbHandCardData[wChairID].reverse()
            }
        }
        var test = 0
    },
    onCMD_StatusPlay:function(body) 
    {
        var roundTable = [2,3,4,5,6,7,8,9,10,11,12,13,1];
        //body.cbCurTeam = 0
        //body.cbTeamProcess[body.cbCurTeam] = 12
        var mainCard = 2
        if( body.cbCurTeam != INVALID_BYTE )
            mainCard = roundTable[body.cbTeamProcess[body.cbCurTeam]]

        gameLogic.num2Scores  = 
        [
            0,
            12,
            13,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            14,
            15
        ]
        
        var index = 1;
        for( var i = 1;i <= 13;i++ ) //2-K 
        {
            if ( i == mainCard ) 
            {
                gameLogic.num2Scores[mainCard] = 13
            }
            else if(i != mainCard && i==1 )
            {
                gameLogic.num2Scores[i] = 12
            }
            else 
            {
                gameLogic.num2Scores[i] = index
                index++
            }
        }

        cmdBaseWorker.cbSortType = body.cbSortType
        cmdBaseWorker.cbCurTeam = body.cbCurTeam;
        cmdBaseWorker.cbTeamProcess = body.cbTeamProcess;
        cmdBaseWorker.cbLastResult = body.cbLastResult;
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
        cmdBaseWorker.cbHandCardCount = body.cbHandCardCount
        for(var wChairID=0;wChairID<GAME_PLAYER;wChairID++)
        {
            cmdBaseWorker.cbHandCardData[wChairID] = []
            if( wChairID== tableData.getUserWithUserId(selfdwUserID).wChairID )
            {
                cmdBaseWorker.cbHandCardData[wChairID] = body.cbHandCardDataSelf.slice(0, body.cbHandCardCount[wChairID])
                cmdBaseWorker.cbArrangeCardData[wChairID] = body.cbArrangeCardData.slice(0,body.cbArrangeCardCount)////
                cmdBaseWorker.cbArrangeCardCount[wChairID] = body.cbArrangeCardCount////
                ///
                if(body.cbSortType == ST_TYPE){
                    cmdBaseWorker.sortArrangeCard(wChairID)
                    //var originalCards = body.cbHandCardDataSelf.slice(0, body.cbHandCardCount[wChairID])
                    //var sortedCards = []
                    //gameLogic.sortCardsByType( originalCards, sortedCards)
                    //cmdBaseWorker.cbHandCardData[wChairID] = sortedCards.slice(0, sortedCards.length)
                }
                cmdBaseWorker.cbHandCardData[wChairID].reverse()
            }
        }
       
        cmdBaseWorker.cbTributeGiveCard = body.cbTributeGiveCard

        cmdBaseWorker.wTributeUser = body.wTributeUser
        cmdBaseWorker.cbTributeProgress = body.cbTributeProgress
        cmdBaseWorker.cbTributeProCards = body.cbTributeProCards
        cmdBaseWorker.cbNewCards = body.cbNewCards
        cmdBaseWorker.setMainValue()
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
                cmdBaseWorker.cbHandCardData[wChairID].reverse()
                ///cmdBaseWorker.sortHandCardDatas(cmdBaseWorker.cbHandCardData[wChairID]) 
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
        cmdBaseWorker.cbChangeChair = body.cbChangeChair;
        cmdBaseWorker.cbCurTeam = body.cbCurTeam;
        cmdBaseWorker.cbTeamProcess = body.cbTeamProcess
        cmdBaseWorker.cbLastResult = body.cbLastResult;
        cmdBaseWorker.wCurrentUser = body.wCurrentUser
        cmdBaseWorker.wBankerUser = body.wBankerUser
        cmdBaseWorker.cbDiCardData = body.cbDiCardData
        cmdBaseWorker.cbMagicCardData = body.cbMagicCardData
        cmdBaseWorker.cbTributeGiveCard = body.cbTributeGiveCard
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
                if(cmdBaseWorker.cbSortType == ST_TYPE)
                    cmdBaseWorker.sortArrangeCard(wChairID);
                cmdBaseWorker.cbHandCardData[wChairID].reverse()
            }
        }
        cmdBaseWorker.cbHandCardCount = body.cbHandCardCount

        cmdBaseWorker.cbOutBombCount = [0, 0, 0, 0]
        cmdBaseWorker.cbArrangeCardCount = [0, 0, 0, 0]
        cmdBaseWorker.lPlayerData = [ [0], [0], [0], [0] ]
        cmdBaseWorker.cbTributeProgress = body.cbTributeProgress

        cmdBaseWorker.cbOutCardCount = 0
        cmdBaseWorker.cbOutCardData = []
        cmdBaseWorker.setMainValue()
        if (!cmdBaseWorker.cbTributeProCards) 
        {
            gameLog.log(':-------》》》》cbTributeProCards《《《《:-----------')
        }
        //
       // if (!cmdBaseWorker.cbTributeProCards) 
        //{
          //   gameLog.log(':》》》》cbTributeProCards《《《《:')
            cmdBaseWorker.cbTributeProCards = [INVALID_BYTE,INVALID_BYTE,INVALID_BYTE,INVALID_BYTE]
       // };
        gameLogic.setCardsScore();
       //
    },
    onCMD_OutCard:function(body) 
    {
        cmdBaseWorker.wCurrentUser = body.wCurrentUser
        cmdBaseWorker.wOutCardUser = body.wOutCardUser
        cmdBaseWorker.cbOutCardCount = body.cbOutCardCount
        cmdBaseWorker.cbOutCardData = body.cbOutCardData.slice(0, body.cbOutCardCount)

        
        /**/
        
        gameLogic.setCardsScore();
        /**/

        cmdBaseWorker.outCardType = gameLogic.getCardsType(cardLogic.sortWithNum(clone(cmdBaseWorker.cbOutCardData))) 

        cmdBaseWorker.wWinOrder = body.wWinOrder
        cmdBaseWorker.lTurnData = body.lTurnData
        cmdBaseWorker.lPlayerData = body.lPlayerData

        if( cmdBaseWorker.wOutCardUser == tableData.getUserWithUserId(selfdwUserID).wChairID )
        {
            cmdBaseWorker.cbArrangeCardData[body.wOutCardUser] = body.cbArrangeCardData.slice(0,body.cbArrangeCardCount)
            cmdBaseWorker.cbArrangeCardCount[body.wOutCardUser] = body.cbArrangeCardCount

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

        //出牌后牌型重新排序
        if ( cmdBaseWorker.wOutCardUser == tableData.getUserWithUserId(selfdwUserID).wChairID )
        {
            var wChairID = cmdBaseWorker.wOutCardUser

            cmdBaseWorker.cbHandCardCount = body.cbHandCardCount
            cmdBaseWorker.cbHandCardData[wChairID] = body.cbHandCardDataSelf.slice(0, body.cbHandCardCount[wChairID])

            if(cmdBaseWorker.cbSortType == ST_TYPE)
                cmdBaseWorker.sortArrangeCard(wChairID);
            cmdBaseWorker.cbHandCardData[wChairID].reverse()
        };
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
            ///cmdBaseWorker.sortHandCardDatas(cmdBaseWorker.cbHandCardData[wChairID]) 
            cmdBaseWorker.cbHandCardData[wChairID].reverse()
        }
        cmdBaseWorker.cbHandCardCount = body.cbHandCardCount  

        cmdBaseWorker.dwLastWinner = body.dwLastWinner
        cmdBaseWorker.cbOutCardTimes = body.cbOutCardTimes

        cmdBaseWorker.outCardType = {typeIdx:0, typeLevel:0, typeScores:0}
        cmdBaseWorker.cbMagicCardData = []
    },
    fillCMD_OutCard:function(body, cardsType,OutArrangeCard) 
    {
        body.cbArrangeCount = OutArrangeCard.length
        body.cbArrangeData = OutArrangeCard
        body.cbOutCardCount = cardsType.cardDatas.length
        body.cbOutCardData = cardsType.cardDatas
        body.cbTypeLevel = cardsType.typeLevel
    },
    sortArrangeCard:function(wChairID)
    {
        if (cmdBaseWorker.cbArrangeCardCount.length == 0) 
        {
            cmdBaseWorker.cbArrangeCardCount = [0,0,0,0]
        };
        var arrangeCards = cmdBaseWorker.cbHandCardData[wChairID].slice(0, cmdBaseWorker.cbArrangeCardCount[wChairID])
        var originalCards = cmdBaseWorker.cbHandCardData[wChairID].slice(cmdBaseWorker.cbArrangeCardCount[wChairID], cmdBaseWorker.cbHandCardCount[wChairID])
        var sortedCards = []
        gameLogic.sortCardsByType( originalCards, sortedCards)

        arrangeCards = arrangeCards.concat(sortedCards)
        cmdBaseWorker.cbHandCardData[wChairID] = arrangeCards.slice(0,arrangeCards.length)
    },
    setMainValue:function()
    {
        var curLaiZi = 0;
        if ( cmdBaseWorker.cbCurTeam != INVALID_BYTE ) 
        {
            curLaiZi = cmdBaseWorker.cbTeamProcess[cmdBaseWorker.cbCurTeam]
        };
        cmdBaseWorker.mainValue = curLaiZi+2 >12 ? curLaiZi -11: curLaiZi + 2;  

    }
    ,        
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



