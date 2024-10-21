
var cmdBaseWorker = 
{   
    lCellScore:null,
    cbGameType:0,
    bHaveSetType:false,
    wBankerUser:INVALID_WORD,
    wCurrentUser:INVALID_WORD,//当前需要出牌的玩家 m_wCurrentUser =INVALID_CHAIR时表示没人能出牌 在吃碰杠状态
    cbProvideCard:null,
    cbActionMask:null,
    cbLeftCardCount:null,
    cbEastUser:null,
    wOutCardUser:INVALID_WORD,
    cbOutCardData:null,
    cbDiscardCount:null,
    cbDiscardCard:null,
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
    cbGangKaiTimes:null,
    wExitUser:INVALID_WORD,
    // cbProvideCard:null,
    dwChiHuKind:null,
    dwChiHuRight:null,
    lGameScore:null,
    cbChengBaoUser:null,
    wWinner:null,
    endType:null,
    cbWarnTimes:0,
    init:function()
    {   
    },
    onReStart:function()
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
        cmdBaseWorker.cbOperateCard     = null
        cmdBaseWorker.wExitUser         = INVALID_WORD
        // cmdBaseWorker.cbProvideCard     = null
        cmdBaseWorker.dwChiHuKind       = null
        cmdBaseWorker.dwChiHuRight      = null
        cmdBaseWorker.lGameScore        = null
        cmdBaseWorker.lGangScore        = null
        cmdBaseWorker.cbChengBaoUser    = null
    },
    onCMD_StatusFree:function(body) 
    {
        cmdBaseWorker.lCellScore   = body.lCellScore
        cmdBaseWorker.cbGameType   = body.cbGameType
        cmdBaseWorker.bHaveSetType = body.bHaveSetType
    },
    onCMD_StatusPlay:function(body) 
    {	
        cmdBaseWorker.lCellScore      = body.lCellScore      
        cmdBaseWorker.wBankerUser     = tableData.getUserWithUserId(body.dwBankerUserId).wChairID   
        cmdBaseWorker.cbEastUser      = tableData.getUserWithUserId(body.dwEastUser).wChairID   
        cmdBaseWorker.wCurrentUser    = body.wCurrentUser    
        cmdBaseWorker.cbProvideCard   = body.cbProvideCard    
        cmdBaseWorker.cbActionMask    = body.cbActionMask    
        cmdBaseWorker.cbLeftCardCount = body.cbLeftCardCount 
        cmdBaseWorker.cbGameType      = body.cbGameType
        cmdBaseWorker.bHaveSetType    = body.bHaveSetType
        cmdBaseWorker.wOutCardUser    = body.wOutCardUser    
        cmdBaseWorker.cbOutCardData   = body.cbOutCardData   
        cmdBaseWorker.cbDiscardCount  = body.cbDiscardCount  
        cmdBaseWorker.cbDiscardCard   = body.cbDiscardCard   
        cmdBaseWorker.cbHandCardCount = body.cbHandCardCount     
        cmdBaseWorker.cbHandCardData  = body.cbHandCardData      
        cmdBaseWorker.cbSendCardData  = body.cbSendCardData  
        cmdBaseWorker.cbWeaveCount    = body.cbWeaveCount    
        cmdBaseWorker.WeaveItemArray  = body.WeaveItemArray  
        cmdBaseWorker.cbMagicCardData  = body.cbMagicCardData  

        for(var i=0;i<GAME_PLAYER2;i++)
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
        // cmdBaseWorker.cbLeftCardCount = MAX_REPERTORY-(MAX_COUNT-1)*4 - 1 - 1
        cmdBaseWorker.cbLeftCardCount   = MAX_REPERTORY-(MAX_COUNT-1)*2 - 1
        cmdBaseWorker.cbEastUser        = tableData.getUserWithUserId(body.dwEastUser).wChairID    
		cmdBaseWorker.wBankerUser       = tableData.getUserWithUserId(body.dwBankerUserId).wChairID    
		cmdBaseWorker.wCurrentUser      = body.wCurrentUser     
		cmdBaseWorker.cbActionMask      = body.cbActionMask    
		cmdBaseWorker.cbHandCardData    = body.cbHandCardData      
		cmdBaseWorker.cbMagicCardData   = body.cbMagicCardData      
        cmdBaseWorker.bIsRandBanker     = body.bIsRandBanker   

    },
    onCMD_OutCard:function(body)
    {
        cmdBaseWorker.wOutCardUser = body.wOutCardUser
        cmdBaseWorker.cbOutCardData = body.cbOutCardData

        cmdBaseWorker.wCurrentUser = INVALID_WORD
    },
    onCMD_SendCard:function(body) 
    {
        cmdBaseWorker.cbLeftCardCount -= body.cbCardReduce
        cmdBaseWorker.cbSendCardData = body.cbSendCardData
        cmdBaseWorker.cbActionMask = body.cbActionMask
        cmdBaseWorker.wCurrentUser = body.wCurrentUser
    },
    onCMD_OperateNotify:function(body) 
    {
        cmdBaseWorker.wResumeUser = body.wResumeUser
        cmdBaseWorker.cbActionMask = body.cbActionMask
        cmdBaseWorker.cbProvideCard = body.cbProvideCard
    },
    onCMD_OperateResult:function(body) 
    {
        cmdBaseWorker.wOperateUser = body.wOperateUser
        cmdBaseWorker.wProvideUser = body.wProvideUser
        cmdBaseWorker.cbOperateCode = body.cbOperateCode
        cmdBaseWorker.cbOperateCard = body.cbOperateCard

        cmdBaseWorker.wCurrentUser = body.wCurrentUser //碰杠会有可能进入动作状态
        cmdBaseWorker.cbActionMask = body.cbActionMask
        cmdBaseWorker.cbWarnTimes = body.cbWarnTimes
        // if(cmdBaseWorker.cbOperateCode == WIK_GANG)
        //     cmdBaseWorker.cbLeftCardCount--
    },
    onCMD_GangScore:function(body) 
    {
        cmdBaseWorker.lGangScore      = body.lGangScore
    },
    onSMD_GameType:function(body)
    {
        cmdBaseWorker.cbGameType      =  body.cbGameType
        cmdBaseWorker.bHaveSetType    =  true
    },
    onCMD_GameEnd:function(body) 
    {
        cmdBaseWorker.wExitUser       = body.wExitUser
        cmdBaseWorker.wProvideUser    = body.wProvideUser
        cmdBaseWorker.cbGangKaiTimes  = body.cbGangKaiTimes
        cmdBaseWorker.cbProvideCard   = body.cbProvideCard
        cmdBaseWorker.dwChiHuKind     = body.dwChiHuKind
        cmdBaseWorker.dwChiHuRight    = body.dwChiHuRight
        cmdBaseWorker.lGameScore      = body.lGameScore
        cmdBaseWorker.cbHandCardCount = body.cbHandCardCount
        cmdBaseWorker.cbHandCardData  = body.cbHandCardData
        cmdBaseWorker.cbChengBaoUser  = body.cbChengBaoUser
        cmdBaseWorker.wWinner  = body.wWinner
        cmdBaseWorker.endType  = body.endType
    },
    // fillCMD_OutCard:function(body, idxs) 
    // {
    //     // body.cbOutCardCount = idxs.length
    //     // var t = gameLogic.getDataAndChangeDataWithIdxs(idxs)
    //     // body.cbOutCardData = t[0]
    //     // body.cbOutCardChange = t[1]
    // }
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

    showChoosePopOfAction:function(cardDatasArray, actionArray, actionCall)
    {
        var len = actionArray.length
        for(var i=0;i<len;i++)
        {
            var cardDatas = cardDatasArray[i]
            var chooseItem = cmdBaseWorker._getChooseItemOfAction(cardDatas, actionArray[i], actionCall)

            chooseItem.x = ( i - (len-1)/2 ) * (majiangFactory.scale_upDown*majiangFactory.chooseItemMjScale*majiangFactory.downHandIntervalX*4 + 30)
            chooseItem.y = 0
            majiangFactory.chooseItemsNode.addChild(chooseItem)
        }
    },
    _getChooseItemOfAction:function(sortedOperateCardDatas, action, actionCall)
    {        
        var chooseItem = new cc.Node()
        // var provideCardData = cardDatas[0]
        ////////////////////////////
        var showLen = sortedOperateCardDatas.length
        if(action == WIK_GANG)
            showLen = 4
        for(var i=0;i<showLen;i++)
        {
            var mj = majiangFactory.getOne(sortedOperateCardDatas[i], 0, 0)
            mj.setScale(majiangFactory.scale_upDown*majiangFactory.chooseItemMjScale)
            mj.x = ( i - (showLen-1)/2 )*majiangFactory.scale_upDown*majiangFactory.chooseItemMjScale*majiangFactory.downHandIntervalX

            chooseItem.addChild(mj)
        }

        ////////////////////////////
        var bg = new cc.Scale9Sprite('mf_chooseItemBg.png')
        bg.width = majiangFactory.scale_upDown*majiangFactory.chooseItemMjScale*majiangFactory.downHandIntervalX*showLen + 10
        bg.height = majiangFactory.scale_upDown*majiangFactory.chooseItemMjScale*majiangFactory.down_handHeight + 10 
        bg.x = 0//bg.width/2
        bg.y = 0//bg.height/2
        bg.anchorX = 0.5
        bg.anchorY = 0.5
        chooseItem.addChild(bg, -1)

        var listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget()
                var locationInNode = target.convertToNodeSpace(touch.getLocation())
                var rect = cc.rect(0, 0, target.getContentSize().width, target.getContentSize().height)
                var isTouchInNode = cc.rectContainsPoint(rect, locationInNode)
                if (isTouchInNode) {
                    return true
                }
                return false
            },
            onTouchEnded: function (touch, event) {
                var target = event.getCurrentTarget()
                var locationInNode = target.convertToNodeSpace(touch.getLocation())
                var rect = cc.rect(0, 0, target.getContentSize().width, target.getContentSize().height)
                var isTouchInNode = cc.rectContainsPoint(rect, locationInNode)
                if (isTouchInNode) {
                    majiangFactory.chooseItemsNode.removeAllChildren()
                    actionCall?actionCall(sortedOperateCardDatas, action):''
                }
            }
        })
        cc.eventManager.addListener(listener, bg)

        return chooseItem
    },
}



