
var cmdBaseWorker = 
{   
    lCellScore:null,
    wBankerUser:INVALID_WORD,
    wCurrentUser:INVALID_WORD,//当前需要出牌的玩家 m_wCurrentUser =INVALID_CHAIR时表示没人能出牌 在吃碰杠状态
    cbProvideCardData:null,
    cbActionMask:null,
    cbLeftCardCount:null,
    wOutCardUser:INVALID_WORD,
    cbOutCardData:null,
    // cbHeapCardData:null,
    cbDiscardCount:null,
    cbDiscardCardData:null,
    cbHandCardCount:null,
    cbHandCardData:null,
    cbSendCardData:null,
    wSendHeapDir:null,
    wSendHeapPosArray:null,
    cbWeaveCount:null,
    WeaveItemArray:null,
    cbMagicCardData:null,
    bIsRandBanker:null,
    cbSiceCount:null,
    wHeapHead:null,
    wHeapTail:null,
    cbHeapCardInfo:null,
    cbTurnoverCardData:null,
    wTurnoverCardHeapDir:null,
    wTurnoverCardHeapPos:null,
    wResumeUser:INVALID_WORD, //用于如果所有人都‘过’时发牌
    wOperateUser:INVALID_WORD,
    wProvideUser:INVALID_WORD,
    cbOperateCode:null,
    cbOperateCardData:null,
    wExitUser:INVALID_WORD,
    // cbProvideCardData:null,
    dwChiHuKind:null,
    dwChiHuRight:null,
    lGameScore:null,
    wWinner:null,
    endType:null,
    cbTempTest:null,
    cbIGameFan:null,
    cbCallRecord:null,
    
    cbSBankCount1:null,
    cbSBankCount2:null,
    cbSiceCount1:null,
    cbSiceCount2:null,
    wEndCardType:null,
    init:function()
    {   
    },
    onReStart:function()
    {
        cmdBaseWorker.lCellScore        = null
        cmdBaseWorker.wBankerUser       = INVALID_WORD
        cmdBaseWorker.wCurrentUser      = INVALID_WORD//当前需要出牌的玩家 m_wCurrentUser=INVALID_CHAIR时表示没人能出牌 在吃碰杠状态
        cmdBaseWorker.cbProvideCardData      = null
        cmdBaseWorker.cbActionMask      = null
        cmdBaseWorker.cbLeftCardCount   = null
        cmdBaseWorker.wOutCardUser      = INVALID_WORD
        cmdBaseWorker.cbOutCardData     = null
        cmdBaseWorker.cbDiscardCount    = null
        cmdBaseWorker.cbDiscardCardData     = null
        cmdBaseWorker.cbHandCardCount   = null
        cmdBaseWorker.cbHandCardData    = null
        cmdBaseWorker.cbSendCardData    = null
        cmdBaseWorker.cbWeaveCount      = null
        cmdBaseWorker.WeaveItemArray    = null
        cmdBaseWorker.cbMagicCardData    = null
        cmdBaseWorker.wResumeUser       = INVALID_WORD //用于如果所有人都‘过’时发牌
        cmdBaseWorker.wOperateUser      = INVALID_WORD
        cmdBaseWorker.wProvideUser      = INVALID_WORD
        cmdBaseWorker.cbOperateCode     = null
        cmdBaseWorker.cbOperateCardData     = null
        cmdBaseWorker.wExitUser         = INVALID_WORD
        // cmdBaseWorker.cbProvideCardData     = null
        cmdBaseWorker.dwChiHuKind       = null
        cmdBaseWorker.dwChiHuRight      = null
        cmdBaseWorker.lGameScore        = null
        cmdBaseWorker.cbTempTest        = null
        cmdBaseWorker.cbIGameFan        = null
        cmdBaseWorker.wEndCardType      = null
    },
    onCMD_StatusFree:function(body) 
    {
        cmdBaseWorker.lCellScore = body.lCellScore
    },
    onCMD_StatusCall:function(body) 
    {
        cmdBaseWorker.lCellScore = body.lCellScore
        cmdBaseWorker.wBankerUser     = tableData.getUserWithUserId(body.dwBankerUserId).wChairID   
        cmdBaseWorker.cbCallRecord = body.cbCallRecord
    },
    onCMD_StatusPlay:function(body) 
    {	
        cmdBaseWorker.wBankerUser     = tableData.getUserWithUserId(body.dwBankerUserId).wChairID   
        cmdBaseWorker.lCellScore      = body.lCellScore      
        cmdBaseWorker.wCurrentUser    = body.wCurrentUser    
        cmdBaseWorker.cbProvideCardData    = body.cbProvideCardData    
        cmdBaseWorker.cbActionMask    = body.cbActionMask    
        cmdBaseWorker.cbLeftCardCount = body.cbLeftCardCount 
        cmdBaseWorker.wOutCardUser    = body.wOutCardUser    
        cmdBaseWorker.cbOutCardData   = body.cbOutCardData   
        cmdBaseWorker.cbDiscardCount  = body.cbDiscardCount  
        cmdBaseWorker.cbDiscardCardData   = body.cbDiscardCardData   
        cmdBaseWorker.cbHandCardCount = body.cbHandCardCount     
        cmdBaseWorker.cbHandCardData  = body.cbHandCardData      
        cmdBaseWorker.cbSendCardData  = body.cbSendCardData  
        cmdBaseWorker.cbWeaveCount    = body.cbWeaveCount    
        cmdBaseWorker.WeaveItemArray  = body.WeaveItemArray  
        cmdBaseWorker.cbMagicCardData  = body.cbMagicCardData  


        cmdBaseWorker.wHeapHead     = body.wHeapHead   
        cmdBaseWorker.wHeapTail     = body.wHeapTail   
        cmdBaseWorker.cbHeapCardInfo     = body.cbHeapCardInfo   
        cmdBaseWorker.cbTurnoverCardData     = body.cbTurnoverCardData   
        cmdBaseWorker.wTurnoverCardHeapDir     = body.wTurnoverCardHeapDir   
        cmdBaseWorker.wTurnoverCardHeapPos     = body.wTurnoverCardHeapPos   


        cmdBaseWorker.cbCallRecord = body.cbCallRecord  

        //格式化数据 把0过滤掉
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
    },
    onCMD_Call:function(body) 
    {
        cmdBaseWorker.wBankerUser       = tableData.getUserWithUserId(body.dwBankerUserId).wChairID   
        cmdBaseWorker.cbCallRecord = body.cbCallRecord  
    },
    onCMD_GameStart:function(body) 
    {
        cmdBaseWorker.cbLeftCardCount =  body.cbLeftCardCount //MAX_REPERTORY-(MAX_COUNT-1)*4 - 1

		cmdBaseWorker.wBankerUser       = tableData.getUserWithUserId(body.dwBankerUserId).wChairID    
		cmdBaseWorker.wCurrentUser      = body.wCurrentUser     
		cmdBaseWorker.cbActionMask      = body.cbActionMask    
		cmdBaseWorker.cbHandCardData    = body.cbHandCardData      
		cmdBaseWorker.cbMagicCardData    = body.cbMagicCardData      
        cmdBaseWorker.bIsRandBanker     = body.bIsRandBanker   

        cmdBaseWorker.cbSiceCount     = body.cbSiceCount   
        cmdBaseWorker.wHeapHead     = body.wHeapHead   
        cmdBaseWorker.wHeapTail     = body.wHeapTail   
        cmdBaseWorker.cbHeapCardInfo     = body.cbHeapCardInfo   
        cmdBaseWorker.cbTurnoverCardData     = body.cbTurnoverCardData   
        cmdBaseWorker.wTurnoverCardHeapDir     = body.wTurnoverCardHeapDir   
        cmdBaseWorker.wTurnoverCardHeapPos     = body.wTurnoverCardHeapPos   

        cmdBaseWorker.cbCallRecord = body.cbCallRecord  

        cmdBaseWorker.cbSBankCount1     = body.cbSBankCount1
        cmdBaseWorker.cbSBankCount2     = body.cbSBankCount2
        cmdBaseWorker.cbSiceCount1     = body.cbSiceCount1
        cmdBaseWorker.cbSiceCount2     = body.cbSiceCount2 
        
    },
    onCMD_OutCard:function(body)
    {
        cmdBaseWorker.wOutCardUser = body.wOutCardUser
        cmdBaseWorker.cbOutCardData = body.cbOutCardData

        cmdBaseWorker.wCurrentUser = INVALID_WORD
    },
    onCMD_SendCard:function(body) 
    {
        cmdBaseWorker.cbLeftCardCount = body.cbLeftCardCount 
        cmdBaseWorker.cbSendCardData = body.cbSendCardData
        cmdBaseWorker.cbActionMask = body.cbActionMask
        cmdBaseWorker.wCurrentUser = body.wCurrentUser

        cmdBaseWorker.wSendHeapDir = body.wSendHeapDir
        cmdBaseWorker.wSendHeapPosArray = body.wSendHeapPosArray
    },
    onCMD_OperateNotify:function(body) 
    {
        cmdBaseWorker.wResumeUser = body.wResumeUser
        cmdBaseWorker.cbActionMask = body.cbActionMask
        cmdBaseWorker.cbProvideCardData = body.cbProvideCardData
    },
    onCMD_OperateResult:function(body) 
    {
        cmdBaseWorker.wOperateUser = body.wOperateUser
        cmdBaseWorker.wProvideUser = body.wProvideUser
        cmdBaseWorker.cbOperateCode = body.cbOperateCode
        cmdBaseWorker.cbOperateCardData = body.cbOperateCardData

        cmdBaseWorker.wCurrentUser = body.wCurrentUser //碰杠会有可能进入动作状态
        cmdBaseWorker.cbActionMask = body.cbActionMask
        cmdBaseWorker.cbLeftCardCount = body.cbLeftCardCount 
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
        cmdBaseWorker.wWinner  = body.wWinner
        cmdBaseWorker.endType  = body.endType
        cmdBaseWorker.cbWeaveCount    = body.cbWeaveCount    
        cmdBaseWorker.WeaveItemArray  = body.WeaveItemArray 
        cmdBaseWorker.cbTempTest      = body.cbTempTest
        cmdBaseWorker.cbIGameFan      = body.cbIGameFan
        cmdBaseWorker.wEndCardType    = body.wEndCardType
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
    }
}



