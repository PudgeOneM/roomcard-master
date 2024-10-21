
var cmdBaseWorker = 
{   
    bGameSetEnd:null,  
    isFanGui:false,    
    maFen:null,         
    cbMafenData:null,   
    cbGangData:null,   
    cbDiceNumber:null,
    cbShowMafenData:null,
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
    //cbFengCardData:null,
    //cbFengCardCount:null,
    cbHandCardCount:null,
    cbHandCardData:null,
    cbSendCardData:null,
    cbWeaveCount:null,
    WeaveItemArray:null,
    cbMagicCardData:null,
    bIsRandBanker:null,
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
    init:function()
    {   
    },
    onReStart:function()
    {
        cmdBaseWorker.bGameSetEnd       = null      
        cmdBaseWorker.cbMafenData       = null       
        cmdBaseWorker.cbGangData        = null  
        cmdBaseWorker.cbDiceNumber      = null
        cmdBaseWorker.cbShowMafenData   = null
        cmdBaseWorker.lCellScore        = null       
        cmdBaseWorker.wBankerUser       = INVALID_WORD
        cmdBaseWorker.wCurrentUser      = INVALID_WORD//当前需要出牌的玩家 m_wCurrentUser=INVALID_CHAIR时表示没人能出牌 在吃碰杠状态
        cmdBaseWorker.cbProvideCard     = null
        cmdBaseWorker.cbActionMask      = null
        cmdBaseWorker.cbLeftCardCount   = null
        cmdBaseWorker.wOutCardUser      = INVALID_WORD
        cmdBaseWorker.cbOutCardData     = null
        cmdBaseWorker.cbDiscardCount    = null
        cmdBaseWorker.cbDiscardCard     = null
        cmdBaseWorker.cbHandCardCount   = null
        cmdBaseWorker.cbHandCardData    = null
        cmdBaseWorker.cbSendCardData    = null
        cmdBaseWorker.cbWeaveCount      = null
        cmdBaseWorker.WeaveItemArray    = null
        cmdBaseWorker.cbMagicCardData   = null
        cmdBaseWorker.wResumeUser       = INVALID_WORD //用于如果所有人都‘过’时发牌
        cmdBaseWorker.wOperateUser      = INVALID_WORD
        cmdBaseWorker.wProvideUser      = INVALID_WORD
        cmdBaseWorker.cbOperateCode     = null
        cmdBaseWorker.cbOperateCard     = null
        cmdBaseWorker.wExitUser         = INVALID_WORD
        cmdBaseWorker.dwChiHuKind       = null
        cmdBaseWorker.dwChiHuRight      = null
        cmdBaseWorker.lGameScore        = null
    },
    onCMD_StatusFree:function(body) 
    {
        cmdBaseWorker.lCellScore       = body.lCellScore
        cmdBaseWorker.bGameSetEnd      = body.bGameSetEnd   
        cmdBaseWorker.isFanGui         = body.isFanGui    
        cmdBaseWorker.maFen            = body.maFen    
    },
    onCMD_StatusPlay:function(body) 
    {	
        cmdBaseWorker.lCellScore       = body.lCellScore    
        cmdBaseWorker.isFanGui         = body.isFanGui     
        cmdBaseWorker.maFen            = body.maFen         
        cmdBaseWorker.wBankerUser      = tableData.getUserWithUserId(body.dwBankerUserId).wChairID   
        cmdBaseWorker.wCurrentUser     = body.wCurrentUser    
        cmdBaseWorker.cbProvideCard    = body.cbProvideCard    
        cmdBaseWorker.cbActionMask     = body.cbActionMask    
        cmdBaseWorker.cbLeftCardCount  = body.cbLeftCardCount 
        cmdBaseWorker.wOutCardUser     = body.wOutCardUser    
        cmdBaseWorker.cbOutCardData    = body.cbOutCardData   
        cmdBaseWorker.cbDiscardCount   = body.cbDiscardCount  
        cmdBaseWorker.cbDiscardCard    = body.cbDiscardCard   
        cmdBaseWorker.cbHandCardCount  = body.cbHandCardCount     
        cmdBaseWorker.cbHandCardData   = body.cbHandCardData      
        cmdBaseWorker.cbSendCardData   = body.cbSendCardData  
        cmdBaseWorker.cbWeaveCount     = body.cbWeaveCount    
        cmdBaseWorker.WeaveItemArray   = body.WeaveItemArray  
        cmdBaseWorker.cbMagicCardData  = body.cbMagicCardData 

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
    onCMD_GameStart:function(body) 
    {
        cmdBaseWorker.cbLeftCardCount = MAX_REPERTORY-(MAX_COUNT-1)*4 - 1

		cmdBaseWorker.wBankerUser       = tableData.getUserWithUserId(body.dwBankerUserId).wChairID    
		cmdBaseWorker.wCurrentUser      = body.wCurrentUser     
		cmdBaseWorker.cbActionMask      = body.cbActionMask    
		cmdBaseWorker.cbHandCardData    = body.cbHandCardData  
		cmdBaseWorker.cbMagicCardData   = body.cbMagicCardData  
        cmdBaseWorker.bIsRandBanker     = body.bIsRandBanker  
        cmdBaseWorker.cbMafenData       = body.cbMafenData 
        cmdBaseWorker.cbDiceNumber      = body.cbDiceNumber
        cmdBaseWorker.isFanGui          = body.isFanGui
        cmdBaseWorker.maFen             = body.maFen
        
    },
    onCMD_OutCard:function(body)
    {
        cmdBaseWorker.wOutCardUser = body.wOutCardUser
        cmdBaseWorker.cbOutCardData = body.cbOutCardData
        cmdBaseWorker.wCurrentUser = INVALID_WORD
    },
    onCMD_SendCard:function(body) 
    {
        cmdBaseWorker.cbLeftCardCount -= 1
        cmdBaseWorker.cbSendCardData = body.cbSendCardData
        cmdBaseWorker.cbActionMask = body.cbActionMask
        cmdBaseWorker.wCurrentUser = body.wCurrentUser
        cmdBaseWorker.cbMafenData  = body.cbMafenData
    },

    onCMD_OperateNotify:function(body) 
    {
        cmdBaseWorker.wResumeUser   = body.wResumeUser
        cmdBaseWorker.cbActionMask  = body.cbActionMask
        cmdBaseWorker.cbProvideCard = body.cbProvideCard
        cmdBaseWorker.cbGangData    = body.cbGangData  
    },
    onCMD_OperateResult:function(body) 
    {
        cmdBaseWorker.wOperateUser = body.wOperateUser
        cmdBaseWorker.wProvideUser = body.wProvideUser
        cmdBaseWorker.cbOperateCode = body.cbOperateCode
        cmdBaseWorker.cbOperateCard = body.cbOperateCard

        cmdBaseWorker.wCurrentUser = body.wCurrentUser
        cmdBaseWorker.cbActionMask = body.cbActionMask



        //if(cmdBaseWorker.cbOperateCode == WIK_GANG)
            //cmdBaseWorker.cbLeftCardCount--
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
        cmdBaseWorker.wWinner         = body.wWinner
        cmdBaseWorker.endType         = body.endType
        cmdBaseWorker.cbShowMafenData = body.cbShowMafenData
    },

    onCMD_GameSetEnd:function(body)
    {
        cmdBaseWorker.maFen     = body.maFen
        cmdBaseWorker.isFanGui  = body.isFanGui
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



