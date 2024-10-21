
var cmdBaseWorker = 
{   
    lCellScore:null,
    wBankerUser:INVALID_WORD,
    wCurrentUser:INVALID_WORD,//当前需要出牌的玩家 m_wCurrentUser =INVALID_CHAIR时表示没人能出牌 在吃碰杠状态
    cbProvideCard:null,
    cbActionMask:null,
    cbLeftCardCount:null,
    wOutCardUser:INVALID_WORD,
    cbOutCardData:null,
    cbDiscardCount:null,
    cbDiscardCard:null,
    cbFengCardData:null,
    cbFengCardCount:null,
    cbHandCardCount:null,
    cbHandCardData:null,
    cbSendCardData:null,
    cbWeaveCount:null,
    WeaveItemArray:null,
    bMagicCardData:null,
    bIsRandBanker:null,
    bBuHuaUser:null,
    cbHuaCount:null,
    cbHuaCardData:null,     //花牌数据
    cbHuaCards:null,

    wResumeUser:INVALID_WORD, //用于如果所有人都‘过’时发牌
    wOperateUser:INVALID_WORD,
    wProvideUser:INVALID_WORD,
    cbOperateCode:null,
    cbOperateCard:null,
    wExitUser:INVALID_WORD,
    // cbProvideCard:null,
    dwChiHuKind:null,
    dwChiHuRight:null,
    lGameScore:null,
    wWinner:null,
    endType:null,
    cbHuaCard:null,
    cbReplaceCard:null,
    cbDingPengData:null,
    cbIsPreStartEnd:null,
    cbCanSendCard:null,
    cbTempTest:null,
    wLaZi:null,
    cbPlayType:null,
    cbIsOutReady:null,
    cbEndCard:null,
    cbIGameFan:null,
    cbIGameHu:null,
    init:function()
    {   
        cmdBaseWorker._registEvent()
    },
    reset:function()
    {
        cmdBaseWorker.lCellScore        = null
        cmdBaseWorker.wBankerUser       = INVALID_WORD
        cmdBaseWorker.wCurrentUser      = INVALID_WORD//当前需要出牌的玩家 m_wCurrentUser=INVALID_CHAIR时表示没人能出牌 在吃碰杠状态
        cmdBaseWorker.cbProvideCard      = null
        cmdBaseWorker.cbActionMask      = null
        cmdBaseWorker.cbLeftCardCount   = null
        cmdBaseWorker.wOutCardUser      = INVALID_WORD
        cmdBaseWorker.cbOutCardData     = null
        cmdBaseWorker.cbDiscardCount    = null
        cmdBaseWorker.cbDiscardCard     = null
        cmdBaseWorker.cbFengCardData    = null
        cmdBaseWorker.cbFengCardCount   = null
        cmdBaseWorker.cbHandCardCount   = null
        cmdBaseWorker.cbHandCardData    = null
        cmdBaseWorker.cbSendCardData    = null
        cmdBaseWorker.cbWeaveCount      = null
        cmdBaseWorker.WeaveItemArray    = null
        cmdBaseWorker.bMagicCardData    = null
        cmdBaseWorker.wResumeUser       = INVALID_WORD //用于如果所有人都‘过’时发牌
        cmdBaseWorker.wOperateUser      = INVALID_WORD
        cmdBaseWorker.wProvideUser      = INVALID_WORD
        cmdBaseWorker.cbOperateCode     = null
        cmdBaseWorker.cbOperateCard     = null
        cmdBaseWorker.wExitUser         = INVALID_WORD
        // cmdBaseWorker.cbProvideCard     = null
        cmdBaseWorker.dwChiHuKind       = null
        cmdBaseWorker.dwChiHuRight      = null
        cmdBaseWorker.lGameScore        = null
        cmdBaseWorker.cbHuaCard         = null
        cmdBaseWorker.cbReplaceCard     = null
        cmdBaseWorker.cbHuaCount        = null
        cmdBaseWorker.cbHuaCardData     = null
        cmdBaseWorker.cbHuaCards        = null
        cmdBaseWorker.cbDingPengData    = null
        cmdBaseWorker.cbIsPreStartEnd   = null
        cmdBaseWorker.cbCanSendCard     = null
        cmdBaseWorker.cbTempTest        = null
        cmdBaseWorker.wLaZi             = null
        cmdBaseWorker.cbPlayType        = null
        cmdBaseWorker.cbIsOutReady      = 0
        cmdBaseWorker.cbEndCard         = null
        cmdBaseWorker.cbIGameFan        = null
        cmdBaseWorker.cbIGameHu         = null
    },
    _registEvent:function()
    {  
        var l = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "resetGameData",
            callback: function(event)
            {   
                cmdBaseWorker.reset()
            }
        })
        cc.eventManager.addListener(l, 1)
    },
    onCMD_StatusFree:function(body) 
    {
        cmdBaseWorker.lCellScore = body.lCellScore
        cmdBaseWorker.cbPlayType = body.cbPlayType
    },
    onCMD_StatusPlay:function(body) 
    {	
        cmdBaseWorker.cbPlayType      = body.cbPlayType
        cmdBaseWorker.lCellScore      = body.lCellScore      
        cmdBaseWorker.wBankerUser     = tableData.getUserWithUserId(body.dwBankerUserId).wChairID   
        cmdBaseWorker.wCurrentUser    = body.wCurrentUser    
        cmdBaseWorker.cbProvideCard   = body.cbProvideCard    
        cmdBaseWorker.cbActionMask    = body.cbActionMask    
        cmdBaseWorker.cbLeftCardCount = body.cbLeftCardCount 
        cmdBaseWorker.wOutCardUser    = body.wOutCardUser    
        cmdBaseWorker.cbOutCardData   = body.cbOutCardData   
        cmdBaseWorker.cbDiscardCount  = body.cbDiscardCount  
        cmdBaseWorker.cbDiscardCard   = body.cbDiscardCard   
        cmdBaseWorker.cbFengCardData  = body.cbFengCardData  
        cmdBaseWorker.cbFengCardCount = body.cbFengCardCount 
        cmdBaseWorker.cbHandCardCount = body.cbHandCardCount     
        cmdBaseWorker.cbHandCardData  = body.cbHandCardData      
        cmdBaseWorker.cbSendCardData  = body.cbSendCardData  
        cmdBaseWorker.cbWeaveCount    = body.cbWeaveCount    
        cmdBaseWorker.WeaveItemArray  = body.WeaveItemArray  
        cmdBaseWorker.bMagicCardData  = body.cbMagicCardData  
        cmdBaseWorker.cbHuaCardData   = body.cbHuaCardData
        cmdBaseWorker.cbHuaCount      = 0
        cmdBaseWorker.cbCanSendCard   = 0
        cmdBaseWorker.cbIsOutReady    = 0
        cmdBaseWorker.cbDingPengData  = body.cbDingPengData
        cmdBaseWorker.cbIsPreStartEnd = body.cbIsPreStartEnd
        gameLog.log('当前状态----' + cmdBaseWorker.cbIsPreStartEnd)   
        for(var i=0;i<GAME_PLAYER;i++)
        {
            var weaveItems = cmdBaseWorker.WeaveItemArray[i]
            //组合牌
            for(var j=0;j<MAX_WEAVE;j++)
            {
                var t = weaveItems[j].cbCardData
                for(var jj=0;jj<t.length;jj++)
                {
                    if(t[jj]==0)
                        t.splice(jj, 1)
                }
            }
        }
        cmdBaseWorker.setHuaCards();

    },
    onCMD_GameStart:function(body) 
    {
        cmdBaseWorker.cbLeftCardCount = MAX_REPERTORY-(MAX_COUNT-1)*4 - 1 - 1
        cmdBaseWorker.cbPlayType      = body.cbPlayType
		cmdBaseWorker.wBankerUser       = tableData.getUserWithUserId(body.dwBankerUserId).wChairID    
		cmdBaseWorker.wCurrentUser      = body.wCurrentUser     
		cmdBaseWorker.cbActionMask      = body.cbActionMask    
		cmdBaseWorker.cbHandCardData    = body.cbHandCardData      
		cmdBaseWorker.bMagicCardData    = body.cbMagicCardData      
        cmdBaseWorker.bIsRandBanker     = body.bIsRandBanker   
        cmdBaseWorker.bBuHuaUser        = body.bBuHuaUser
        cmdBaseWorker.cbHuaCount        = 0
        cmdBaseWorker.cbDingPengData    = body.cbDingPengData
        cmdBaseWorker.setHuaCards();
        cmdBaseWorker.cbHuaCardData = []
        cmdBaseWorker.cbIsPreStartEnd = 0
        cmdBaseWorker.cbCanSendCard   = 0
        cmdBaseWorker.cbIsOutReady = 0

        for (var i = 0 ;i < 4;i++)
        {
            cmdBaseWorker.cbHuaCardData[i] = []
            for(var j = 0 ;j < MAX_HUA_CARD;j++ )
            {
                cmdBaseWorker.cbHuaCardData[i][j] = 0
            }
        }


    },
    onCMD_ReplaceCard:function(body)
    {
        //cmdBaseWorker.cbHuaCard[body.wReplaceUser] = body.cbHuaCard
        //cmdBaseWorker.cbReplaceCard[body.wReplaceUser] = body.cbReplaceCard
        cmdBaseWorker.cbHandCardData = body.cbHandCardData
    },
    onCMD_OutCard:function(body) 
    {
        cmdBaseWorker.wOutCardUser = body.wOutCardUser
        cmdBaseWorker.cbOutCardData = body.cbOutCardData
        cmdBaseWorker.cbEndCard = cmdBaseWorker.cbOutCardData
        cmdBaseWorker.wCurrentUser = INVALID_WORD

        console.log(33333,   cmdBaseWorker.wOutCardUser,  cmdBaseWorker.cbOutCardData)
    },
    onCMD_SendCard:function(body) 
    {
        cmdBaseWorker.cbEndCard = body.cbSendCardData
        cmdBaseWorker.cbLeftCardCount -= 1
        cmdBaseWorker.cbSendCardData = body.cbSendCardData
        cmdBaseWorker.cbActionMask = body.cbActionMask
        cmdBaseWorker.wCurrentUser = body.wCurrentUser
    },
    onCMD_OperateNotify:function(body) 
    {
        cmdBaseWorker.wResumeUser = body.wResumeUser
        cmdBaseWorker.cbActionMask = body.cbActionMask
        cmdBaseWorker.cbProvideCard = body.cbProvideCard
        cmdBaseWorker.cbEndCard = body.cbProvideCard
    },
    onCMD_OperateResult:function(body) 
    {
        cmdBaseWorker.wOperateUser = body.wOperateUser
        cmdBaseWorker.wProvideUser = body.wProvideUser
        cmdBaseWorker.cbOperateCode = body.cbOperateCode
        cmdBaseWorker.cbOperateCard = body.cbOperateCard

        cmdBaseWorker.wCurrentUser = body.wOperateUser
    },
    onCMD_GameEnd:function(body) 
    {
        cmdBaseWorker.wExitUser       = body.wExitUser
        cmdBaseWorker.wProvideUser    = body.wProvideUser
        cmdBaseWorker.cbProvideCard   = body.cbProvideCard
        cmdBaseWorker.dwChiHuKind     = body.dwChiHuKind
        cmdBaseWorker.dwChiHuRight    = body.dwChiHuRight
        cmdBaseWorker.lGameScore      = body.lGameScore
        cmdBaseWorker.cbHandCardCount = body.cbHandCardCount
        cmdBaseWorker.cbHandCardData  = body.cbHandCardData
        cmdBaseWorker.WeaveItemArray  = body.WeaveItemArray
        cmdBaseWorker.cbWeaveCount    = body.cbWeaveCount
        cmdBaseWorker.wWinner         = body.wWinner
        cmdBaseWorker.endType         = body.endType
        cmdBaseWorker.wLaZi           = body.wLaZi
        cmdBaseWorker.cbTempTest      = body.cbTempTest
        cmdBaseWorker.cbIGameFan      = body.cbIGameFan
        cmdBaseWorker.cbIGameHu       = body.cbIGameHu
    },
    onCMD_PingCuoResult:function(body)
    {
        cmdBaseWorker.cbPlayType = body.cbPingCuoCuo
    },
    onCMD_DingPengResult:function(body)
    {
        cmdBaseWorker.cbDingPengData = body.cbDingPengData
        for(var i = 0;i<4;i++)
        {
            playNode.setDingPIcon(i,cmdBaseWorker.cbDingPengData[i] == 2)
        }


        cmdBaseWorker.cbIsPreStartEnd = 2
        for (var i = 0 ;i < 4;i++)
        {
            if (cmdBaseWorker.cbDingPengData[i] == 0 ) 
            {
                cmdBaseWorker.cbIsPreStartEnd = 1 ;
                break;
            };
        }
        if (cmdBaseWorker.cbIsPreStartEnd ==  2) {
            if ( playNode.isPlaying )
            playNode.onCMD_StatusPlay()
                else
            playNode.onCMD_GameStart()
        }
        
    },
    setHuaCards:function()
    {
        var magicIndex = cmdBaseWorker.bMagicCardData
        cmdBaseWorker.cbHuaCards = []
        if (magicIndex == 53){  
            cmdBaseWorker.cbHuaCards= [54,55,65,66,67,68,69,70,71,72];
        }else if(magicIndex == 54){
            cmdBaseWorker.cbHuaCards = [53,55,65,66,67,68,69,70,71,72];
        }else if(magicIndex == 55){ 
            cmdBaseWorker.cbHuaCards = [53,54,65,66,67,68,69,70,71,72];
        }else if(magicIndex < 53){ 
            cmdBaseWorker.cbHuaCards = [55,65,66,67,68,69,70,71,72];
        }else if ( magicIndex > 55 && magicIndex < 69 ){
            cmdBaseWorker.cbHuaCards = [53,54,55,69,70,71,72];
        }else{
            cmdBaseWorker.cbHuaCards = [53,54,55,65,66,67,68];
        }
    },

}



