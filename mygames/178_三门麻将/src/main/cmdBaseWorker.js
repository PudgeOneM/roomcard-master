
var cmdBaseWorker = 
{   
    lCellScore:null,

    cbTingDataCount:0,
    tingData:[],
    //user变量
    wBankerUser:INVALID_WORD,
    wCurrentUserCall:INVALID_WORD,
    wCallUser:INVALID_WORD,
    wCurrentUser:INVALID_WORD,//当前需要出牌的玩家 m_wCurrentUser =INVALID_CHAIR时表示没人能出牌 在吃碰杠状态
    wResumeUser:INVALID_WORD, //用于如果所有人都‘过’时发牌
    wOutCardUser:INVALID_WORD,
    wProvideUser:INVALID_WORD,
    wTakeCardUser:INVALID_WORD,
    wOperateUser:INVALID_WORD,

    //cardData变量
    cbSendCardData:null,
    cbOutCardData:null,
    cbProvideCardData:null,
    cbMagicCardData:[],
    cbFlowerCardData:[],
    cbOutCardCount:0,

    //手牌 丢弃牌 动作牌 花牌 
    //动作牌、花牌会维护 
    //丢弃牌、手牌 通过playNode获得
    cbHandCardCount:null,
    cbHandCardData:null, 
    cbDiscardCount:null, 
    cbDiscardCardData:null,
    cbWeaveCount:[0, 0, 0, 0],
    WeaveItemArray:[[], [], [], []], 
    cbPlayerFlowerCount:[0, 0, 0, 0],
    cbPlayerFlowerCardData:[[], [], [], []],
    
    //牌堆 库存
    cbHeapCardInfo:null,
    cbLeftCardCount:null,

    //发牌
    cbSendCardCount:null,
    sendCardArray:null,

    //用于处理用户动作 服务器会把所有玩家选择的动作记录下来 然后把成功执行的动作返回 
    cbActionMask:null,
    cbOperateCode:null,
    cbOperateCardCount:0,
    cbOperateCardData:null,

    //用于客户端显示的辅助数据
    bIsRandBanker:null,
    dwChiHuKind:null,
    dwChiHuRight:null,
    lGameTaiCount:null,
    lGameScore:null,
    endType:0,
    wExitUser:INVALID_WORD,

    //其他
    bPlayerStatus: [[], [], [], []],
    cbCallRecord:null,
    cbSiceCount:null,
    TurnoverCard:null,
    dwLastWinner:[],
    cbReplaceCardCount:0,
    cbReplaceCardData:[],

    ///三门麻将
    cbHForbidOutData:null,
    cbMaCardData:null,
    cbFlowerFlag:null,
    cbZiKeCount:null,
    cbFlagMaxCount:null,
    bIsFirstReplace:true,
    bShowFlowerBigger:true, //0花牌显示小(默认)，1花牌显示大
    cbMagicCount:null,
    wUndertakeUser:null,
    bHIsFlag4Magic:null,
    bIsFreeStatus:false,
    bIsNxReplaceFlower:[0,0,0,0],
    bmyselfGameEndtype:false,

    init:function()
    {   
    },
    onReStart:function()
    {
        cmdBaseWorker.wBankerUser           = INVALID_WORD
        cmdBaseWorker.wTakeCardUser         = INVALID_WORD
        cmdBaseWorker.wCurrentUser          = INVALID_WORD//当前需要出牌的玩家 m_wCurrentUser=INVALID_CHAIR时表示没人能出牌 在吃碰杠状态
        cmdBaseWorker.wOutCardUser          = INVALID_WORD
        cmdBaseWorker.cbMagicCardData       = []
        cmdBaseWorker.cbFlowerCardData      = []
        cmdBaseWorker.cbPlayerFlowerCardData  = [[], [], [], []]
        cmdBaseWorker.wResumeUser           = INVALID_WORD //用于如果所有人都‘过’时发牌
        cmdBaseWorker.wOperateUser          = INVALID_WORD
        cmdBaseWorker.wProvideUser          = INVALID_WORD
        cmdBaseWorker.wExitUser             = INVALID_WORD
        cmdBaseWorker.cbOutCardCount        = 0 
        cmdBaseWorker.endType               = 0 
        cmdBaseWorker.cbHForbidOutData      = null
        cmdBaseWorker.cbMaCardData          = null
        cmdBaseWorker.cbFlowerFlag          = null
        cmdBaseWorker.cbZiKeCount           = null
        cmdBaseWorker.cbFlagMaxCount        = null
        cmdBaseWorker.bIsFirstReplace       = true
        cmdBaseWorker.bShowFlowerBigger     = false
        cmdBaseWorker.cbMagicCount          = null
        cmdBaseWorker.wUndertakeUser        = null
        cmdBaseWorker.bHIsFlag4Magic        = null
        cmdBaseWorker.bIsFreeStatus         = false
        cmdBaseWorker.bmyselfGameEndtype    = false
        cmdBaseWorker.bIsNxReplaceFlower    = [0,0,0,0]

    },
    onCMD_StatusFree:function(body) 
    {
        cmdBaseWorker.lCellScore = body.lCellScore
    },
    onCMD_StatusCall:function(body) 
    {
        cmdBaseWorker.lCellScore        = body.lCellScore
        cmdBaseWorker.wCurrentUserCall  = body.wCurrentUserCall
        cmdBaseWorker.wBankerUser       = tableData.getUserWithUserId(body.dwBankerUserId).wChairID   
        cmdBaseWorker.cbCallRecord      = body.cbCallRecord
    },
    onCMD_StatusPlay:function(body) 
    {	
        //console.log(9999, clone(body))
        cmdBaseWorker.TurnoverCard          = body.TurnoverCard   
        cmdBaseWorker.cbActionMask          = body.cbActionMask   
        cmdBaseWorker.wGetSendCardUser      = body.wGetSendCardUser   
        cmdBaseWorker.cbProvideCardData     = body.cbProvideCardData   

        cmdBaseWorker.wBankerUser           = tableData.getUserWithUserId(body.dwBankerUserId).wChairID   
        cmdBaseWorker.lCellScore            = body.lCellScore      
        cmdBaseWorker.wCurrentUser          = body.wCurrentUser    
        cmdBaseWorker.wTakeCardUser         = body.wTakeCardUser

        cmdBaseWorker.cbLeftCardCount       = body.cbLeftCardCount 
        cmdBaseWorker.wOutCardUser          = body.wOutCardUser    
        cmdBaseWorker.cbOutCardData         = body.cbOutCardData   
        cmdBaseWorker.cbDiscardCount        = body.cbDiscardCount  
        cmdBaseWorker.cbDiscardCardData     = body.cbDiscardCardData   
        cmdBaseWorker.cbHandCardCount       = body.cbHandCardCount     
        cmdBaseWorker.cbHandCardData        = [[],[],[],[]]

        cmdBaseWorker.cbHForbidOutData      = body.cbHForbidOutData //三门
        cmdBaseWorker.bIsFirstReplace       = false
        cmdBaseWorker.bmyselfGameEndtype    = false

        for(var i=0;i<GAME_PLAYER;i++)
        {
            var isSelf = tableData.getUserWithUserId(selfdwUserID).wChairID == i

            for(var j=0;j<cmdBaseWorker.cbHandCardCount[i];j++)
            {
                cmdBaseWorker.cbHandCardData[i][j] = isSelf?body.cbHandCardData[j]:0
            }
        }

        cmdBaseWorker.cbWeaveCount    = body.cbWeaveCount    
        cmdBaseWorker.WeaveItemArray  = body.WeaveItemArray  
        for(var i=0;i<GAME_PLAYER;i++)
        {
            for(var j=0;j<cmdBaseWorker.cbWeaveCount[i];j++)
            {
                var weaveItem = cmdBaseWorker.WeaveItemArray[i][j]
                if( !(weaveItem.cbWeaveKind&(WIK_MINGANG|WIK_ANGANG|WIK_PENGGANG)) )
                {
                    weaveItem.cbValidCardDatas = weaveItem.cbValidCardDatas.slice(0, 3)
                    weaveItem.cbChangeCardDatas = weaveItem.cbChangeCardDatas.slice(0, 3)
                } 
            }
        }
        cmdBaseWorker.cbPlayerFlowerCount    = body.cbPlayerFlowerCount   
        for(var i=0;i<GAME_PLAYER;i++)
        {   
            cmdBaseWorker.cbPlayerFlowerCardData[i]  = body.cbPlayerFlowerCardData[i].slice(0, body.cbPlayerFlowerCount[i])  
        }

        cmdBaseWorker.cbMagicCardData       = body.cbMagicCardData  
        cmdBaseWorker.cbFlowerCardData      = body.cbFlowerCardData  
        cmdBaseWorker.cbHeapCardInfo        = body.cbHeapCardInfo   
        cmdBaseWorker.cbCallRecord          = body.cbCallRecord  
        cmdBaseWorker.cbSendCardData        = body.cbSendCardData   
        cmdBaseWorker.bPlayerStatus         = body.bPlayerStatus
        cmdBaseWorker.cbTingDataCount       = body.cbTingDataCount
        cmdBaseWorker.tingData = body.tingData.slice(0, cmdBaseWorker.cbTingDataCount)
    },
    onCMD_TINGDATA:function(body) 
    {        
        cmdBaseWorker.cbTingDataCount   = body.cbTingDataCount
        cmdBaseWorker.tingData          = body.tingData.slice(0, cmdBaseWorker.cbTingDataCount)
    },
    onCMD_PlayerStatusUpdata:function(body) 
    {        
        cmdBaseWorker.bPlayerStatus     = body.bPlayerStatus
    },
    onCMD_CallNotify:function(body) 
    {        
        cmdBaseWorker.wBankerUser       = tableData.getUserWithUserId(body.dwBankerUserId).wChairID    
        cmdBaseWorker.wCurrentUserCall  = body.wCurrentUserCall
    },
    onCMD_CallResult:function(body) 
    {     
        cmdBaseWorker.wCallUser         = body.wCallUser
        cmdBaseWorker.cbCallRecord      = body.cbCallRecord
        cmdBaseWorker.wCurrentUserCall  = body.wCurrentUserCall
    },
    onCMD_GameStart:function(body) 
    {       
        //console.log(999, clone(body)) 
        cmdBaseWorker.bIsFirstReplace    = true
        cmdBaseWorker.bmyselfGameEndtype = false
        cmdBaseWorker.bIsNxReplaceFlower = [0,0,0,0]
        cmdBaseWorker.cbLeftCardCount = body.cbLeftCardCount
		cmdBaseWorker.wBankerUser     = tableData.getUserWithUserId(body.dwBankerUserId).wChairID    
        cmdBaseWorker.cbHandCardCount = [0, 0, 0, 0]
        cmdBaseWorker.cbHandCardData  = [[],[],[],[]]
        for(var wChairID=0;wChairID<GAME_PLAYER;wChairID++)
        {
            for(var j=0;j<MAX_COUNT-1;j++)
            {
                cmdBaseWorker.cbHandCardData[wChairID][cmdBaseWorker.cbHandCardCount[wChairID]++] = body.cbHandCardData[wChairID][j]
            }

            // var isSelf = tableData.getUserWithUserId(selfdwUserID).wChairID == wChairID
            // for(var j=0;j<MAX_COUNT-1;j++)
            // {
            //     cmdBaseWorker.cbHandCardData[wChairID][cmdBaseWorker.cbHandCardCount[wChairID]++] = 
            //     isSelf?body.cbHandCardData[wChairID][j]:0
            // }
        }
		cmdBaseWorker.cbMagicCardData     = body.cbMagicCardData     
        cmdBaseWorker.cbFlowerCardData    = body.cbFlowerCardData  
        cmdBaseWorker.bIsRandBanker       = body.bIsRandBanker   
        cmdBaseWorker.cbSiceCount         = body.cbSiceCount   
        cmdBaseWorker.cbHeapCardInfo      = body.cbHeapCardInfo   
        cmdBaseWorker.TurnoverCard        = body.TurnoverCard   
        cmdBaseWorker.cbCallRecord        = body.cbCallRecord
        cmdBaseWorker.bIsFreeStatus       = body.bIsFreeStatus

        ////////////////
        cmdBaseWorker.cbOutCardCount            = 0  
        cmdBaseWorker.cbPlayerFlowerCount       = [0, 0, 0, 0]
        cmdBaseWorker.cbPlayerFlowerCardData    = [[], [], [], []]
        cmdBaseWorker.cbWeaveCount              = [0, 0, 0, 0]
        cmdBaseWorker.WeaveItemArray            = [[], [], [], []]
        cmdBaseWorker.cbDiscardCount            = [0, 0, 0, 0]
        cmdBaseWorker.cbDiscardCardData         = [[], [], [], []]
        cmdBaseWorker.bPlayerStatus             = [[], [], [], []]
    },
    onCMD_OutCard:function(body)
    {
        cmdBaseWorker.bIsFirstReplace   = false
        cmdBaseWorker.wOutCardUser      = body.wOutCardUser
        cmdBaseWorker.cbOutCardData     = body.cbOutCardData
        cmdBaseWorker.cbOutCardCount++
        cmdBaseWorker.cbActionMask      = body.cbActionMask 
        cmdBaseWorker.wTakeCardUser     = INVALID_WORD
        cmdBaseWorker.cbHForbidOutData  = body.cbHForbidOutData //三门
        cmdBaseWorker.bIsNxReplaceFlower[cmdBaseWorker.wOutCardUser] = 0

        // if(cmdBaseWorker.cbActionMask!=WIK_NULL)
        // {
        //     cmdBaseWorker.wProvideUser    = body.wOutCardUser 
        //     cmdBaseWorker.cbProvideCardData    = body.cbOutCardData   
        //     cmdBaseWorker.wCurrentUser = INVALID_WORD
        // }


        // /////cbHandCardData
        // var user = cmdBaseWorker.wOutCardUser
        // var isSelf = tableData.getUserWithUserId(selfdwUserID).wChairID == user
        // var outCardData = isSelf?body.cbOutCardData:0
        // cmdBaseWorker.cbHandCardCount[user]--
        // for(var i=0;i<cmdBaseWorker.cbHandCardData[user].length;i++)
        // {
        //     if(cmdBaseWorker.cbHandCardData[user][i] == outCardData)
        //     {
        //        cmdBaseWorker.cbHandCardData[user].splice(i, 1) 
        //        break
        //     }
        // }

        /////cbDiscardCardData
        // cmdBaseWorker.cbDiscardCardData[cmdBaseWorker.wOutCardUser][cmdBaseWorker.cbDiscardCount[cmdBaseWorker.wOutCardUser]++] = cmdBaseWorker.cbOutCardData
    },
    onCMD_SendCard:function(body) 
    {      
        //console.log( 9999, clone(body) )

        cmdBaseWorker.cbActionMask          = body.cbActionMask   
        cmdBaseWorker.wGetSendCardUser      = body.wGetSendCardUser 
        cmdBaseWorker.cbSendCardData        = body.cbSendCardData    

        cmdBaseWorker.wCurrentUser          = body.wCurrentUser
        cmdBaseWorker.wTakeCardUser         = body.wTakeCardUser
        cmdBaseWorker.cbSendCardCount       = body.cbSendCardCount
        cmdBaseWorker.sendCardArray         = body.sendCardArray
        cmdBaseWorker.cbLeftCardCount = cmdBaseWorker.cbLeftCardCount - cmdBaseWorker.cbSendCardCount
        // /////cbHandCardData
        // var isSelf = tableData.getUserWithUserId(selfdwUserID).wChairID == cmdBaseWorker.wTakeCardUser
        // var wUser = cmdBaseWorker.wTakeCardUser
        // for(var i=0;i<cmdBaseWorker.cbSendCardCount;i++)
        // {
        //     var item = cmdBaseWorker.sendCardArray[i]
        //     if(item.cbCardData != SEND_DISCARD_CARD_DATA)
        //     {
        //         var cardData = isSelf?item.cbCardData:0
        //         cmdBaseWorker.cbHandCardData[wUser][cmdBaseWorker.cbHandCardCount[wUser]++] = cardData
        //     }
        // }


    },
    onCMD_OperateResult:function(body) 
    {
        //console.log(99999, clone(body))

        cmdBaseWorker.cbOperateCode         = body.cbOperateCode
        cmdBaseWorker.wOperateUser          = body.wOperateUser
        cmdBaseWorker.wProvideUser          = body.wProvideUser   
        cmdBaseWorker.cbProvideCardData     = body.cbProvideCardData   
        cmdBaseWorker.wCurrentUser          = body.wCurrentUser
        cmdBaseWorker.cbHForbidOutData      = body.cbHForbidOutData //三门

        if(cmdBaseWorker.cbOperateCode!=WIK_NULL)
        {
            /////weave
            cmdBaseWorker.cbOperateWeaveIdx    = body.cbOperateWeaveIdx   
            if( !(body.OperateWeaveItem.cbWeaveKind&(WIK_MINGANG|WIK_ANGANG|WIK_PENGGANG)) )
            {
                body.OperateWeaveItem.cbValidCardDatas = body.OperateWeaveItem.cbValidCardDatas.slice(0, 3)
                body.OperateWeaveItem.cbChangeCardDatas = body.OperateWeaveItem.cbChangeCardDatas.slice(0, 3)
            } 
            cmdBaseWorker.OperateWeaveItem    = body.OperateWeaveItem 
            cmdBaseWorker.WeaveItemArray[body.wOperateUser][body.cbOperateWeaveIdx] = body.OperateWeaveItem  
        
            if(body.cbOperateWeaveIdx+1>cmdBaseWorker.cbWeaveCount[body.wOperateUser])
                cmdBaseWorker.cbWeaveCount[body.wOperateUser] = body.cbOperateWeaveIdx+1  

            // /////discard
            // var isAnOrPengGang = body.OperateWeaveItem.cbWeaveKind==WIK_GANG && 
            // (body.OperateWeaveItem.cbWeaveKindType==2 || body.OperateWeaveItem.cbWeaveKindType==3)

            // if(!isAnOrPengGang)//吃碰明杠需要popDiscard
            //     cmdBaseWorker.cbDiscardCount[cmdBaseWorker.wProvideUser]--
        }

        cmdBaseWorker.cbActionMask    = body.cbActionMask   


// 11111111111111111 维护cbHandCardData todo

    },
    onCMD_ReplaceResult:function(body)
    {
        cmdBaseWorker.bIsFirstReplace       = false
        cmdBaseWorker.wOperateUser          = body.wOperateUser
        cmdBaseWorker.cbReplaceCardCount    = body.cbReplaceCardCount
        cmdBaseWorker.cbReplaceCardData     = body.cbReplaceCardData.slice(0, body.cbReplaceCardCount)
        cmdBaseWorker.cbPlayerFlowerCount[cmdBaseWorker.wOperateUser]++
        cmdBaseWorker.cbPlayerFlowerCardData[cmdBaseWorker.wOperateUser] = 
        cmdBaseWorker.cbPlayerFlowerCardData[cmdBaseWorker.wOperateUser].concat(cmdBaseWorker.cbReplaceCardData)
    },
    onCMD_ListenResult:function(body)
    {
        cmdBaseWorker.wOperateUser = body.wOperateUser
        cmdBaseWorker.wOutCardUser = body.wOperateUser
        cmdBaseWorker.cbOutCardData = body.cbOutCardData
        cmdBaseWorker.cbOutCardCount++
        cmdBaseWorker.cbActionMask    = body.cbActionMask 
        cmdBaseWorker.wTakeCardUser = INVALID_WORD

        cmdBaseWorker.wCurrentUser = body.wCurrentUser
    },
    onCMD_GameEnd:function(body) 
    {
        //console.log(1231,clone(body) )

        cmdBaseWorker.wCurrentUser = INVALID_WORD

        cmdBaseWorker.wExitUser         = body.wExitUser
        cmdBaseWorker.wProvideUser      = body.wProvideUser
        cmdBaseWorker.cbProvideCardData = body.cbProvideCardData
        cmdBaseWorker.dwChiHuKind       = body.dwChiHuKind
        cmdBaseWorker.dwChiHuRight      = body.dwChiHuRight
        cmdBaseWorker.lGameTaiCount     = body.lGameTaiCount
        cmdBaseWorker.lGameScore        = body.lGameScore
        cmdBaseWorker.cbHandCardCount   = body.cbHandCardCount
        cmdBaseWorker.cbMaCardData      = body.cbMaCardData
        cmdBaseWorker.cbFlowerFlag      = body.cbFlowerFlag
        cmdBaseWorker.cbZiKeCount       = body.cbZiKeCount
        cmdBaseWorker.cbFlagMaxCount    = body.cbFlagMaxCount
        cmdBaseWorker.cbMagicCount      = body.cbMagicCount
        cmdBaseWorker.wUndertakeUser    = body.wUndertakeUser
        cmdBaseWorker.bHIsFlag4Magic    = body.bHIsFlag4Magic
        cmdBaseWorker.bIsFreeStatus     = body.bIsFreeStatus
        cmdBaseWorker.wGetSendCardUser  = [0,0,0,0]
        cmdBaseWorker.bmyselfGameEndtype = true

        for(var i=0;i<GAME_PLAYER;i++)
        {
            cmdBaseWorker.cbHandCardData[i] = body.cbHandCardData[i].slice(0, cmdBaseWorker.cbHandCardCount[i])
        }
        cmdBaseWorker.endType  = body.endType

        cmdBaseWorker.cbWeaveCount    = body.cbWeaveCount    
        cmdBaseWorker.WeaveItemArray  = body.WeaveItemArray  
        for(var i=0;i<GAME_PLAYER;i++)
        {
            for(var j=0;j<cmdBaseWorker.cbWeaveCount[i];j++)
            {
                var weaveItem = cmdBaseWorker.WeaveItemArray[i][j]
                if( !(weaveItem.cbWeaveKind&(WIK_MINGANG|WIK_ANGANG|WIK_PENGGANG)) )
                {
                    weaveItem.cbValidCardDatas = weaveItem.cbValidCardDatas.slice(0, 3)
                    weaveItem.cbChangeCardDatas = weaveItem.cbChangeCardDatas.slice(0, 3)
                } 
            }
        }
    },
    sendMessage_operateCard:function(operateCards, action)
    {
        // cmdBaseWorker.wCurrentUser = INVALID_WORD
        
        CMD_C_OperateCard[2][2] = operateCards.length
        var OperateCard = getObjWithStructName('CMD_C_OperateCard')
        OperateCard.cbOperateCode = action
        OperateCard.cbOperateCardCount = operateCards.length
        OperateCard.cbOperateCardData = operateCards
        socket.sendMessage(MDM_GF_GAME,SUB_C_OPERATE_CARD,OperateCard)
    }

    ////////////////////
    // createOne:function(cardData, where, direction, isIgnoreDecorate, id)
    // {   
    //     var styleId = styleArray[0]

    //     var tt = ['hand','discard','weave','heap','flower','paper']
    //     var t = ['down_','right_','up_','left_']

    //     var prefix = t[direction] + tt[where]

    //     var frameName = 'style' + styleId + '_' + prefix + (cardData==0?0:'Bg') + '.png'
    //     var spr = new cc.Sprite("#" + frameName)
    //     spr.direction = direction
    //     spr.where = where
    //     spr.cardData = cardData
    //     spr.id = id
    //     //皮肤选择
    //     var l = cc.EventListener.create({
    //     event: cc.EventListener.CUSTOM,
    //     eventName: "styleChange",
    //     callback: function(event)
    //     {   
    //         // var styleArray = event.getUserData()//0麻将 1背景 后面有别的依次往后加
    //         var styleId = styleArray[0]
            
    //         var tt = ['hand','discard','weave','heap','flower','paper']
    //         var t =  ['down_','right_','up_','left_']
    //         var prefix = t[spr.direction] + tt[spr.where]
    //         var cardData = spr.cardData
    //         var frameName = 'style' + styleId + '_' + prefix + (cardData==0?0:'Bg') + '.png'
    //         spr.setSpriteFrame(frameName)

    //         spr.color = spr.color
    //     }
    //     })
    //     cc.eventManager.addListener(l, 1)   

    //     if(where == 3)
    //         var scale = majiangFactory.scale_heap
    //     else if(where == 4)
    //         var scale = majiangFactory.scale_flower
    //     else if(where == 5)
    //         var scale = majiangFactory.scale_paper
    //     else
    //         var scale = direction%2==0?majiangFactory.scale_upDown:majiangFactory.scale_rightLeft
    //     spr.setScale(scale)
        
    //     if(cardData!=0)
    //     {
    //         var scale = majiangFactory[prefix + 'ZiScale']
    //         var posScale = majiangFactory[prefix + 'ZiPosScale']

    //         //var zi = new cc.Sprite("#mf_" + cardData + '.png')
    //         var zi = null
    //         if(cardData >= 65)
    //             zi = new cc.Sprite("#replace_" + cardData + '.png')
    //         else
    //             zi = new cc.Sprite("#mf_" + cardData + '.png')

    //         zi.x = majiangFactory[prefix + 'Width'] * posScale.x 
    //         zi.y = majiangFactory[prefix + 'Height'] * posScale.y
    //         zi.scale = scale 

    //         switch(direction)
    //         {
    //             case 0:
    //             {
    //                 break
    //             }
    //             case 1: 
    //             {
    //                 zi.setRotation(-90)
    //                 break
    //             }
    //             case 2:
    //             {
    //                 break
    //             }
    //             case 3: 
    //             {
    //                 zi.setRotation(90)
    //                 break
    //             }
    //         }
    //         spr.addChild(zi, 0, 101)
    //     }

    //     if(!isIgnoreDecorate && majiangFactory.decorateMj)
    //         majiangFactory.decorateMj(spr)
        
    //     return spr
    // },

    // getFlowerMajiangsArray:function(flowerCardDatasArray)
    // {
    //     var flowerMajiangs4D = []
    //     for(showChairid=0;showChairid<GAME_PLAYER;showChairid++)//direction 0down 1right 2up 3left
    //     {
    //         var direction = showChairid

    //         var cardDatas = flowerCardDatasArray[direction]
    //         if(!cardDatas)
    //         {
    //             flowerMajiangs4D[direction] = []
    //             continue
    //         }

    //         var majiangsOneDirection = []
    //         for(var j=0;j<cardDatas.length;j++)
    //         {
    //             var cardData = cardDatas[j]

    //             var majiang = cmdBaseWorker.createOne(cardData, 4, direction)
    //             var pos = majiangFactory.getFlowerMajiangPosAndTag(j, direction)
    //             majiang.x = pos.x
    //             majiang.y = pos.y
    //             majiang.setLocalZOrder(pos.zOrder)
    //             majiangsOneDirection[j] = majiang
    //         }
    //         flowerMajiangs4D[direction] = majiangsOneDirection
    //     }

    //     return flowerMajiangs4D
    // },

    //  getHandMajiangsArray:function(handCardDatasArray, isLookon)
    // {
    //     var handMajiangs4D = []
    //     for(showChairid=0;showChairid<GAME_PLAYER;showChairid++)//direction 0down 1right 2up 3left
    //     {
    //         var direction = showChairid
    //         var oldHandCardDatas = handCardDatasArray[direction][0]
    //         var oldHandMjs = []
    //         for(var j=0;j<oldHandCardDatas.length;j++)
    //         {
    //             var cardData = isLookon?0:oldHandCardDatas[j]
    //             var majiang = cmdBaseWorker.createOne(cardData, 0, direction)
    //             majiang.idxInHandMajiangs = j
    //             var pos = majiangFactory.getHandMajiangPosAndTag(oldHandCardDatas.length, majiang.idxInHandMajiangs, direction, false)
    //             majiang.x = pos.x
    //             majiang.y = pos.y
    //             majiang.setLocalZOrder(pos.zOrder)
    //     //         if(direction==1)
    //     // console.log(222222,pos)
    //             oldHandMjs[j] = majiang
    //         }

    //         var newGetMj = null
    //         var newGetCardData = handCardDatasArray[direction][1]
    //         if(typeof(newGetCardData) == 'number')          
    //         {
    //             newGetCardData = isLookon?0:newGetCardData
    //             newGetMj = cmdBaseWorker.createOne(newGetCardData, 0, direction)
    //             var pos = majiangFactory.getHandMajiangPosAndTag(oldHandCardDatas.length, null, direction, true)
    //             newGetMj.x = pos.x
    //             newGetMj.y = pos.y
    //             newGetMj.setLocalZOrder(pos.zOrder)
    //             newGetMj.idxInHandMajiangs = null
    //         }  
    //         handMajiangs4D[direction] = [oldHandMjs, newGetMj]
    //     }

    //     return handMajiangs4D
    // },

    // addFlowerMajiangs:function(flowerMajiangs, direction, cardData, parent)
    // {
    //     var majiangs = flowerMajiangs
    //     var majiang = cmdBaseWorker.createOne(cardData, 4, direction)
    //     var i = majiangs.length
    //     var pos = majiangFactory.getFlowerMajiangPosAndTag(i, direction)
    //     majiang.x = pos.x
    //     majiang.y = pos.y
    //     majiang.setLocalZOrder(pos.zOrder)

    //     majiangs[i] = majiang
    //     parent.addChild(majiang)
    // },  

    //  addHandMajiangNew:function(handMajiangs, direction, cardData, parent)
    // {
    //     if(handMajiangs[1])
    //     {
    //         majiangFactory.addHandMajiangsOld(handMajiangs, direction, handMajiangs[1].cardData, parent)
    //         majiangFactory.deleteHandMajiangs(handMajiangs, direction, handMajiangs[1].cardData)
    //     }

    //     var oldMajiangs = handMajiangs[0]
    //     var majiang = cmdBaseWorker.createOne(cardData, 0, direction)
    //     var pos = majiangFactory.getHandMajiangPosAndTag(oldMajiangs.length, null, direction, true)
    //     majiang.x = pos.x
    //     majiang.y = pos.y
    //     majiang.setLocalZOrder(pos.zOrder)
    //     majiang.idxInHandMajiangs = null
    //     parent.addChild(majiang)

    //     handMajiangs[1] = majiang
    // },
    // addHandMajiangsOld:function(handMajiangs, direction, cardData, parent)
    // {
    //     var majiangs = handMajiangs[0]
    //     var majiang = cmdBaseWorker.createOne(cardData, 0, direction)
    //     parent.addChild(majiang)

    //     var insertMjIdx = majiangs.length
    //     for(var i=0;i<majiangs.length;i++)
    //     {
    //         var mj = majiangs[i]
    //         if(majiangFactory.cardData2ScoreMap[cardData]<majiangFactory.cardData2ScoreMap[mj.cardData])
    //         {
    //             insertMjIdx = i
    //             break
    //         }
    //     }
    //     var newLength = majiangs.length + 1
    //     for(var i=newLength-1;i>=0;i--)
    //     {
    //         var mj
    //         if(i>insertMjIdx)
    //             mj = majiangs[i-1]
    //         else if(i<insertMjIdx)
    //             mj = majiangs[i]
    //         else
    //             mj = majiang

    //         mj.idxInHandMajiangs = i
    //         var pos = majiangFactory.getHandMajiangPosAndTag(newLength, mj.idxInHandMajiangs, direction, false)
    //         mj.x = pos.x
    //         mj.y = pos.y
    //         mj.setLocalZOrder(pos.zOrder)
    //         majiangs[i] = mj
    //     }

    //     //GroupNodeSize变化后 所有麻将位置都要变 
    //     var newGetMj = handMajiangs[1]
    //     if(newGetMj)
    //     {
    //         var pos = majiangFactory.getHandMajiangPosAndTag(majiangs.length, null, direction, true)
    //         newGetMj.x = pos.x
    //         newGetMj.y = pos.y  
    //         newGetMj.setLocalZOrder(pos.zOrder)
    //         newGetMj.idxInHandMajiangs = null
    //     }

    //     var size = majiangFactory._getHandGroupNodeSize(direction, majiangs.length)
    //     parent.width = size.width
    //     parent.height = size.height
    // },  
    // addHandMajiang:function(handMajiangs, direction, cardData, parent, weaveCount)
    // {
    //     var handMajiangsLen = 0
    //     handMajiangsLen += handMajiangs[0].length
    //     handMajiangsLen += handMajiangs[1]?1:0
    //     if(handMajiangsLen + weaveCount*3 == MAX_COUNT-1)
    //         cmdBaseWorker.addHandMajiangNew(handMajiangs, direction, cardData, parent)
    //     else
    //         cmdBaseWorker.addHandMajiangsOld(handMajiangs, direction, cardData, parent)
    // },
}



