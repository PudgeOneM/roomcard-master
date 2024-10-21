
var cmdBaseWorker = 
{   
    laiziIdxs:[], //有癞子会赋值这个变量
    lCellScore:0,//单元积分
    cbShowCount:0,
    wCurrentUserCall:null,//当前玩家
    wCallUser:null,
    cbCallScore:null,
    wCurrentUser:null,//当前玩家
    cbCallRecord:[],//叫分信息
    cbHandCardDataSelf:null,//自家
    cbHandCardData:null,//4家手上扑克
    cbHandCardCount:null,//扑克数目
    wWinOrder:null,//胜利列表
    // wTurnWiner:null, //本轮胜者
    wOutCardUser:null,//出牌玩家
    cbOutCardCount:null, //出牌数目
    cbOutCardData:null, //出牌数据
    cbOutCardChange:null,//变幻扑克
    cbDiCardData:null,  //底牌显示
    wBankerUser:null,//庄家玩家
    cbBankerScore:null,//庄家叫分
    cbTurnOver:null,//一轮结束
    wPassCardUser:null,//放弃玩家
    wExitUser:null,//用户输赢标记
    lGameScore:null,//游戏积分

    init:function()
    {   
    },
    onReStart:function()
    {
        cmdBaseWorker.laiziIdxs        = []
        cmdBaseWorker.lCellScore       = 0
        cmdBaseWorker.cbShowCount = 0
        wCurrentUserCall=null
        wCallUser=null
        cbCallScore=null
        cmdBaseWorker.wCurrentUser      = null
        cmdBaseWorker.cbCallRecord      = []
        cmdBaseWorker.cbHandCardDataSelf   = null
        cmdBaseWorker.cbHandCardData   = null
        cmdBaseWorker.cbHandCardCount      = null
        cmdBaseWorker.wWinOrder     = null
        cmdBaseWorker.wOutCardUser    = null
        cmdBaseWorker.cbOutCardCount     = null
        cmdBaseWorker.cbOutCardData   = null
        cmdBaseWorker.cbOutCardChange    = null
        cmdBaseWorker.cbDiCardData    = null
        cmdBaseWorker.wBankerUser      = null
        cmdBaseWorker.cbBankerScore    = null
        cmdBaseWorker.cbTurnOver    = null
        cmdBaseWorker.wPassCardUser=null
        cmdBaseWorker.wExitUser=null
        cmdBaseWorker.lGameScore      = null
    
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

        cmdBaseWorker.cbHandCardCount = body.cbHandCardCount
        cmdBaseWorker.cbHandCardDataSelf = body.cbHandCardDataSelf

    },
    onCMD_StatusPlay:function(body) 
    {
        cmdBaseWorker.lCellScore = body.lCellScore
        cmdBaseWorker.wCurrentUser = body.wCurrentUser
        cmdBaseWorker.wWinOrder = body.wWinOrder
        cmdBaseWorker.wOutCardUser = body.wOutCardUser
        cmdBaseWorker.cbOutCardCount = body.cbOutCardCount
        cmdBaseWorker.cbOutCardData = body.cbOutCardData
        cmdBaseWorker.cbOutCardChange = body.cbOutCardChange
        
        cmdBaseWorker.cbHandCardCount = body.cbHandCardCount
        cmdBaseWorker.cbHandCardDataSelf = body.cbHandCardDataSelf

        cmdBaseWorker.cbDiCardData = body.cbDiCardData
        cmdBaseWorker.cbCallRecord = body.cbCallRecord

        cmdBaseWorker.cbShowCount = body.cbShowCount 
    },
    onCMD_CallNotify:function(body) 
    {
        cmdBaseWorker.wCurrentUserCall = body.wCurrentUserCall
        cmdBaseWorker.cbHandCardCount = body.cbHandCardCount
        cmdBaseWorker.cbHandCardDataSelf = body.cbHandCardDataSelf
        cmdBaseWorker.cbShowCount = 0
    },
    onCMD_CallResult:function(body) 
    {     
        cmdBaseWorker.wCallUser = body.wCallUser
        cmdBaseWorker.cbCallScore = body.cbCallScore
        cmdBaseWorker.wCurrentUserCall = body.wCurrentUserCall

        for(var i=0;i<GAME_PLAYER;i++)
        {
            cmdBaseWorker.cbCallRecord[i] = 0
        }

        cmdBaseWorker.cbCallRecord[cmdBaseWorker.wCallUser] = cmdBaseWorker.cbCallScore
    },
    onCMD_GameStart:function(body) 
    {
        cmdBaseWorker.wCurrentUser = body.wCurrentUser
        cmdBaseWorker.cbHandCardCount = body.cbHandCardCount
        cmdBaseWorker.cbHandCardDataSelf = body.cbHandCardDataSelf
        cmdBaseWorker.cbCallRecord = body.cbCallRecord

        cmdBaseWorker.cbShowCount = body.cbShowCount 
    },
    onCMD_BankerInfo:function(body) 
    {
        cmdBaseWorker.wBankerUser = body.wBankerUser
        cmdBaseWorker.wCurrentUser = body.wCurrentUser
        cmdBaseWorker.cbBankerScore = body.cbBankerScore
        cmdBaseWorker.cbDiCardData = body.cbDiCardData
    },
    onCMD_OutCard:function(body) 
    {
        // cmdBaseWorker.wCurrentUser = INVALID_WORD
        cmdBaseWorker.wCurrentUser = body.wCurrentUser
        cmdBaseWorker.wWinOrder = body.wWinOrder
        cmdBaseWorker.wOutCardUser = body.wOutCardUser
        cmdBaseWorker.cbOutCardCount = body.cbOutCardCount
        cmdBaseWorker.cbOutCardData = body.cbOutCardData
        cmdBaseWorker.cbOutCardChange = body.cbOutCardChange

        cmdBaseWorker.cbCallScore = body.cbCallScore
        cmdBaseWorker.cbCallRecord[cmdBaseWorker.wOutCardUser] = cmdBaseWorker.cbCallScore

        // cmdBaseWorker.lastOutUser = body.wOutCardUser
    },
    onCMD_PassCard:function(body) 
    {
        cmdBaseWorker.cbTurnOver = body.cbTurnOver
        cmdBaseWorker.wCurrentUser = body.wCurrentUser
        cmdBaseWorker.wPassCardUser = body.wPassCardUser
    },
    onCMD_GameEnd:function(body) 
    {
        cmdBaseWorker.wExitUser = body.wExitUser
        cmdBaseWorker.lGameScore = body.lGameScore
        cmdBaseWorker.cbHandCardCount = body.cbHandCardCount
        cmdBaseWorker.cbHandCardData = body.cbHandCardData
        cmdBaseWorker.cbCallRecord = body.cbCallRecord

    },

    fillCMD_OutCard:function(body, idxs) 
    {
        body.cbOutCardCount = idxs.length
        var t = gameLogic.getDataAndChangeDataWithIdxs(idxs)
        body.cbOutCardData = t[0]
        body.cbOutCardChange = t[1]
    }



}



