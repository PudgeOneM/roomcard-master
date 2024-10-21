
////先理解majiangFactory(components/majiangFactory/majiangFactory)
var playNode = 
{   
    handMajiangs4D:[],//手牌麻将精灵数组 4个方向的
    discardMajiangs4D:[],//丢弃麻将精灵数组 4个方向的
    weaveMajiangs4D:[],//吃碰杠麻将精灵数组 4个方向的
    heapMajiangs4D:[],
    flowerMajiangs4D:[],
    isLookingResult:false,

    gameEndAction:null,
    isInChooseTingCardTime:false,

    chooseItemsNode:null,//用于操作 吃和杠会出现多种情况
    currentDiscardMjNode:null,
    chooseItemMjScale:0.8,
    currentDiscardMjScale:1.1,
    ///////////////////////init start///////////////////////
    init:function()
    {   
        playNode._registEvent()
        playNode._initCallBack()
        var node = managerRes.loadCCB(resp.playCCB, this)
        playNode.animationManager = node.animationManager
        playNode.node  = node
        playNode._bindListener()

        playNode.scoreTTF = tableNode.scoreTTF
        playNode.laiziNode = tableNode.laiziNode
        playNode.mjsNode = tableNode.mjsNode
        playNode.gamesetNode.setVisible(false)

        majiangFactory.weaveItem2Majiangs = playNode.weaveItem2Majiangs
        majiangFactory.isShowHeap = false
        majiangFactory.isPublicAnGang = true
        majiangFactory.init( playNode.decorateMj )



        /////chooseActionsNode
        playNode.chooseItemsNode = new cc.Node()
        playNode.chooseItemsNode.x = playNode.actionNode.width*0.5
        playNode.chooseItemsNode.y = 200

        playNode.actionNode.addChild(playNode.chooseItemsNode)

        /////currentDiscardMjNode
        var currentDiscardMjNode = new cc.Node()
        var bg = new cc.Sprite('#mf_currentDiscardMjBg.png')
        currentDiscardMjNode.addChild(bg)

        var where = {}
        where.name = 'hand'
        where.data = {idx:0}
        var mj = majiangFactory.getOne(1, 0, where)
        mj.x = 0
        mj.y = 0
        mj.isIgnoreDecorate = true
        currentDiscardMjNode.addChild(mj, 0, 101)

        currentDiscardMjNode.x = -1000
        currentDiscardMjNode.setVisible(false)
        playNode.actionNode.addChild(currentDiscardMjNode)
        
        playNode.currentDiscardMjNode = currentDiscardMjNode







        // /////chooseItemsNode
        // playNode.chooseItemsNode = new cc.Node()
        // playNode.chooseItemsNode.x = majiangFactory.mjsNode.width*0.5
        // playNode.chooseItemsNode.y = majiangFactory.scale_upDown*majiangFactory.down_handHeight + majiangFactory.scale_upDown*playNode.chooseItemMjScale*majiangFactory.down_handHeight*0.5 + 30 

        // majiangFactory.mjsNode.addChild(playNode.chooseItemsNode)

        // /////currentDiscardMjNode
        // var currentDiscardMjNode = new cc.Node()

        // var bg = new cc.Scale9Sprite('mf_currentDiscardMjBg.png')
        // bg.width = majiangFactory.scale_upDown*majiangFactory.down_handWidth*playNode.currentDiscardMjScale + 10
        // bg.height = majiangFactory.scale_upDown*majiangFactory.down_handHeight*playNode.currentDiscardMjScale + 10 
        // bg.x = 0
        // bg.y = 0
        // bg.anchorX = 0.5
        // bg.anchorY = 0.5
        // currentDiscardMjNode.addChild(bg)

        // var mj = majiangFactory.getOne(1, 0, 0, true)
        // mj.setCascadeOpacityEnabled(true)

        // mj.setScale(majiangFactory.scale_upDown*playNode.currentDiscardMjScale)
        // currentDiscardMjNode.addChild(mj, 0, 101)

        // currentDiscardMjNode.x = -1000
        // currentDiscardMjNode.setVisible(false)
        // majiangFactory.mjsNode.addChild(currentDiscardMjNode)

        // playNode.currentDiscardMjNode = currentDiscardMjNode

        cocos.setTimeout(playNode.registWxShareMenu, 1000)
    },
    registWxShareMenu:function()
    {
        if(wxData)
        {
          wx.onMenuShareAppMessage({
            title: wxData.data.share.title,
            desc: '高邮跑点子，上限60分，包三嘴，把把双',
            link: wxData.data.share.link,
            imgUrl: wxData.data.share.imgurl.replace(/\/0/, '/64'),
            trigger: function (res) {
              // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
              // alert('用户点击发送给朋友');
            },
            success: function (res) {
            },
            cancel: function (res) {
            },
            fail: function (res) {
            }
          });

          wx.onMenuShareTimeline({
            title: wxData.data.share.title,
            desc: '高邮跑点子，上限60分，包三嘴，把把双',
            link: wxData.data.share.link,
            imgUrl: wxData.data.share.imgurl.replace(/\/0/, '/64'),
            trigger: function (res) {
              // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
              // alert('用户点击发送给朋友');
            },
            success: function (res) {
            },
            cancel: function (res) {
            },
            fail: function (res) {
            }
          });
        }
    },
    onReStart:function()
    {
        playNode.handMajiangs4D = []
        playNode.discardMajiangs4D = []
        playNode.weaveMajiangs4D = []
        playNode.isLookingResult = false

        cocos.clearInterval(playNode.updateOnFree, playNode.node)
    },
    initCurrentRoundNode:function(currentRoundNode)
    {
        //currentRoundNode是绑定在chair上的一个节点 用于存放当前轮用到的节点
        currentRoundNode.scoreChange = new cc.Node()
        currentRoundNode.addChild( currentRoundNode.scoreChange, 10)   

        currentRoundNode.upTTF = cc.LabelTTF.create('', "Helvetica", 16)
        currentRoundNode.upTTF.setFontFillColor( cc.color(242, 226, 142, 255) )
        currentRoundNode.upTTF.enableStroke(cc.color(0, 0, 0, 255), 2)
        currentRoundNode.upTTF.anchorY = 0
        currentRoundNode.addChild( currentRoundNode.upTTF )   
        currentRoundNode.upTTF.setVisible(false)

        currentRoundNode.playerStatusNode = new cc.Node()
        currentRoundNode.addChild( currentRoundNode.playerStatusNode)   
    },
    clearCurrentRoundNode:function(currentRoundNode)
    {           
        //一轮结束 clearCurrentRoundNode
        currentRoundNode.scoreChange.removeAllChildren()
        currentRoundNode.upTTF.setString('')
        currentRoundNode.playerStatusNode.removeAllChildren()
    },
    setCurrentRoundMajiangsVisible:function(isVisible)
    {
        var users = tableData.getUsersInTable( tableData.getUserWithUserId(selfdwUserID).wTableID )
        for(var i in users)
        {
        }
    },
    updateCurrentRoundNode:function(currentRoundNode, userId)
    {
        var user = tableData.getUserWithUserId(userId)
        var showChairId = tableData.getShowChairIdWithServerChairId(user.wChairID)

        currentRoundNode.upTTF.setPositionY(65)

        var direction = showChairid = tableData.getShowChairIdWithServerChairId(user.wChairID)
        //设置三处四方向的麻将位置 
        if(direction==0)
        {
            currentRoundNode.scoreChange.setPosition( cc.p(100, 30) )  
            currentRoundNode.playerStatusNode.setPosition( cc.p(40, 20) )  
        }
        else if(direction==2)
        {       
            currentRoundNode.scoreChange.setPosition( cc.p(-70, -30) )  
            currentRoundNode.playerStatusNode.setPosition( cc.p(-40, 20) )  
        } 
        else if(direction==1)
        { 
            currentRoundNode.scoreChange.setPosition( cc.p(-150, -50) )  
            currentRoundNode.playerStatusNode.setPosition( cc.p(-40, 20) )  
        }
        else if(direction==3)
        {   
            currentRoundNode.scoreChange.setPosition( cc.p(100, 30) )  
            currentRoundNode.playerStatusNode.setPosition( cc.p(40, 20) )  
        } 
    },
    _registEvent:function() 
    {
        var l = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "userNodeInsetChairInit",
            callback: function(event)
            {   
                var currentRoundNode = new cc.Node()
                playNode.initCurrentRoundNode(currentRoundNode)
                //////
                var userNodeInsetChair = event.getUserData()
                userNodeInsetChair.addChild(currentRoundNode)
                userNodeInsetChair.currentRoundNode = currentRoundNode  
            }
        })
        cc.eventManager.addListener(l, 1)

        var l = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "userNodeInsetChairUpdate",
            callback: function(event)
            {   
                var data = event.getUserData()
                var currentRoundNode = data[0].currentRoundNode
                var userId = data[1]
                playNode.updateCurrentRoundNode(currentRoundNode, userId)   
            }
        })
        cc.eventManager.addListener(l, 1)

        var l = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "cmdEvent",
            callback: function(event)
            {   
                var data = event.getUserData()
                var callFunName = data[0]
                playNode[callFunName]()
            }
        })
        cc.eventManager.addListener(l, 1)

        var l = cc.EventListener.create({
        event: cc.EventListener.CUSTOM,
        eventName: "handMajiangUp",
        callback: function(event)
        {   
            var cardData = event.getUserData()

            if( playNode.isInChooseTingCardTime )
            {
                playNode.tingHuCardNode.setVisible(true)
                playNode.updataTingHuCardNode(cardData)
            }
        }
        })
        cc.eventManager.addListener(l, 1)

        var l = cc.EventListener.create({
        event: cc.EventListener.CUSTOM,
        eventName: "handMajiangDown",
        callback: function(event)
        {   
            playNode.tingHuCardNode.setVisible(false)
        }
        })
        cc.eventManager.addListener(l, 1)   
    },
    _initCallBack:function()
    {   
        //林州规则：
        playNode.minusCall1 = function()
        {
            var s = playNode.gamesetTTF1.getString()
            s = parseInt(s)
            playNode.gamesetTTF1.setString( s==0?0:(s-1) )
        }

        playNode.plusCall1 = function()
        {
            var s = playNode.gamesetTTF1.getString()
            s = parseInt(s)
            playNode.gamesetTTF1.setString( s==2?2:(s+1) )
        }

        playNode.minusCall2 = function()
        {
            var s = playNode.gamesetTTF2.getString()
            s = parseInt(s)
            playNode.gamesetTTF2.setString( s==0?0:(s-1) )
        }

        playNode.plusCall2 = function()
        {
            var s = playNode.gamesetTTF2.getString()
            s = parseInt(s)
            playNode.gamesetTTF2.setString( s==2?2:(s+1) )
        }

        playNode.gamesetSureCall = function()
        {
            var call = getObjWithStructName('CMD_C_Call')
            call.xiapao = playNode.gamesetTTF1.getString()
            call.jiading = playNode.gamesetTTF2.getString()
            socket.sendMessage(MDM_GF_GAME,SUB_C_CALL,call)

            playNode.gamesetNode.setVisible(false)
        }
    },
    _bindListener:function()
    {
        var bindListener = function(callFunc, node)
        {
            var listener = cc.EventListener.create({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: false,
                onTouchBegan: function (touch, event) {
                    var target = event.getCurrentTarget()
                    if(!target.isVisible()) return false
                    var locationInNode = target.convertToNodeSpace(touch.getLocation())
                    var rect = cc.rect(0, 0, target.getContentSize().width, target.getContentSize().height)
                    var isTouchInNode = cc.rectContainsPoint(rect, locationInNode)
                    
                    if(isTouchInNode) {
                        return true
                    }
                    return false
                },
                onTouchEnded: function (touch, event) {
                    var target = event.getCurrentTarget()
                    var locationInNode = target.convertToNodeSpace(touch.getLocation())
                    var rect = cc.rect(0, 0, target.getContentSize().width, target.getContentSize().height)
                    var isTouchInNode = cc.rectContainsPoint(rect, locationInNode)
                    
                    if(isTouchInNode) 
                        callFunc()
                }
            })
            cc.eventManager.addListener(listener, node)
        }

        ////////////////////////吃////////////////////////
        var actionCall_chi = function()
        {
            var btn = playNode.btn_chi
            var actions = btn.actions
            var provideCardData = cmdBaseWorker.cbProvideCardData

            var sendChi = function(sortedOperateCardDatas, action)
            {
                var operateCardDatas = cmdBaseWorker.sortedOperateCardDatas2OperateCardDatas(provideCardData, sortedOperateCardDatas)
                cmdBaseWorker.sendMessage_chi(operateCardDatas, action)
                playNode.hideActionBtns()
            }

            if(actions.length>1)
            {
                playNode.btn_chi.setVisible(false)
                playNode.btn_peng.setVisible(false)
                playNode.btn_gang.setVisible(false)
                playNode.btn_ting.setVisible(false)
                playNode.btn_hu.setVisible(false)

                var cardDatasArray = []
                for(var i=0;i<actions.length;i++)
                {
                    cardDatasArray[i] = cmdBaseWorker.getSortedOperateCardDatas(provideCardData, actions[i])
                }

                playNode.showChoosePopOfAction(cardDatasArray, actions, sendChi)
            }
            else
            {
                var sortedOperateCardDatas = cmdBaseWorker.getSortedOperateCardDatas(provideCardData, actions[0])
                sendChi(sortedOperateCardDatas, actions[0])
            }  
        }
        bindListener(actionCall_chi, playNode.btn_chi)

        ////////////////////////碰////////////////////////
        var actionCall_peng = function()
        {
            var btn = playNode.btn_peng
            cmdBaseWorker.sendMessage_peng([cmdBaseWorker.cbProvideCardData, cmdBaseWorker.cbProvideCardData, cmdBaseWorker.cbProvideCardData] )
            playNode.hideActionBtns()
        }
        bindListener(actionCall_peng, playNode.btn_peng)

        ////////////////////////杠////////////////////////
        var actionCall_gang = function()
        {
            var btn = playNode.btn_gang
            var sendGang = function(sortedOperateCardDatas)
            {
                cmdBaseWorker.sendMessage_gang(sortedOperateCardDatas)
                playNode.hideActionBtns()
            }

            var isMinGang = cmdBaseWorker.wProvideUser != tableData.getUserWithUserId(selfdwUserID).wChairID

            if(isMinGang) 
            {  
                sendGang([cmdBaseWorker.cbProvideCardData, cmdBaseWorker.cbProvideCardData, cmdBaseWorker.cbProvideCardData, cmdBaseWorker.cbProvideCardData])
            }
            else
            {
                var selfChairId = tableData.getUserWithUserId(selfdwUserID).wChairID
                var direction = tableData.getShowChairIdWithServerChairId(selfChairId)
                
                if(cmdBaseWorker.bPlayerStatus[selfChairId][1])//听牌状态 暗杠只会判断摸上来的牌能不能暗杠 
                    var cardDatas = [  cmdBaseWorker.cbProvideCardData  ]
                else
                {
                    var cardDatas = cmdBaseWorker.searchGangCardDatas(playNode.handMajiangs4D[direction], cmdBaseWorker.WeaveItemArray[selfChairId])
                }
               
                if(cardDatas.length>1)
                {
                    playNode.btn_chi.setVisible(false)
                    playNode.btn_peng.setVisible(false)
                    playNode.btn_gang.setVisible(false)
                    playNode.btn_ting.setVisible(false)
                    playNode.btn_hu.setVisible(false)

                    var cardDatasArray = []
                    var actions = []
                    for(var i=0;i<cardDatas.length;i++)
                    {
                        cardDatasArray[i] = [cardDatas[i], cardDatas[i], cardDatas[i], cardDatas[i]]
                        actions[i] = WIK_GANG
                    }
                    playNode.showChoosePopOfAction(cardDatasArray, actions, sendGang)
                }
                else
                {
                    sendGang([cardDatas[0], cardDatas[0], cardDatas[0], cardDatas[0]])
                }
            }
        }
        bindListener(actionCall_gang, playNode.btn_gang)

        ////////////////////////胡////////////////////////
        var actionCall_hu = function()
        {
            var btn = playNode.btn_hu
            cmdBaseWorker.sendMessage_hu([cmdBaseWorker.cbProvideCardData])
            playNode.hideActionBtns()
        }
        bindListener(actionCall_hu, playNode.btn_hu)

        ////////////////////////过////////////////////////
        var actionCall_guo = function()
        {
            var btn = playNode.btn_guo
            cmdBaseWorker.sendMessage_guo([])
            playNode.hideActionBtns()  
        }
        bindListener(actionCall_guo, playNode.btn_guo)

        ////////////////////////补花////////////////////////
        var actionCall_replace = function()//不需要玩家手动触发 只要收到这个动作 自动执行
        {
            alert('actionCall_replace')  
        }

        ////////////////////////听////////////////////////
        var actionCall_ting = function()
        {
            cmdBaseWorker.sendMessage_ting([])
            playNode.hideActionBtns() 

            // if(!playNode.isInChooseTingCardTime)
            // {
            //     var event = new cc.EventCustom("confirmTing")
            //     cc.eventManager.dispatchEvent(event)    
            //     playNode.btn_ting.setSpriteFrame("btn_buting.png") 
            // }
            // else
            // {   
            //     var event = new cc.EventCustom("cancleTing")
            //     cc.eventManager.dispatchEvent(event)  
            //     playNode.btn_ting.setSpriteFrame("btn_ting.png") 
            // }
            // playNode.isInChooseTingCardTime = !playNode.isInChooseTingCardTime
        }
        bindListener(actionCall_ting, playNode.btn_ting)
    },
    decorateMj:function(mj)
    {
        if(mj.isIgnoreDecorate)
            return;

        var cardData = mj.cardData 
        if( gameLogic.isMagicCard(mj.cardData, cmdBaseWorker.cbMagicCardData) ) 
        {
            var s = new cc.Sprite("#caiShen.png")
            var zi = mj.getChildByTag(101)
            if(zi)
            {
                s.x = 0.5*zi.width - 5
                s.y = 0.5*zi.height + 5
                zi.addChild(s)
            }
        }

        //设置麻将触摸
        if(mj.direction==0 && mj.where.name == 'hand')
        {
            var self = tableData.getUserWithUserId(selfdwUserID)
            var isSelfDown = self.wChairID != INVALID_WORD && tableData.getShowChairIdWithServerChairId(self.wChairID)==0
            if(isSelfDown)
            {
                if(!MAGIC_CARD_ALLOWOUT && gameLogic.isMagicCard(mj.cardData, cmdBaseWorker.cbMagicCardData))
                {
                    mj.touchEnable = false
                    mj.color = cc.color(155, 155, 155)
                }
                else
                {
                    mj.touchEnable = true
                    mj.color = cc.color(255, 255, 255)                     
                }
            }
            else
            {
                mj.touchEnable = false
                mj.color = cc.color(255, 255, 255)
            }

            var l = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "confirmTing",
            callback: function(event)
            {   
                mj.touchEnable = gameLogic.isTingCard(mj.cardData, cmdBaseWorker.tingData) 
                mj.color = mj.touchEnable?cc.color(255, 255, 255):cc.color(155, 155, 155)   
            }
            })
            cc.eventManager.addListener(l, 1)

            var l = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "cancleTing",
            callback: function(event)
            {   
                if(!MAGIC_CARD_ALLOWOUT && gameLogic.isMagicCard(mj.cardData, cmdBaseWorker.cbMagicCardData))
                {
                    mj.touchEnable = false
                    mj.color = cc.color(155, 155, 155)
                }
                else
                {
                    mj.touchEnable = true
                    mj.color = cc.color(255, 255, 255)                     
                }
            }
            })
            cc.eventManager.addListener(l, 1)
        }

        if(mj.where.name!='hand')
        {
            //麻将弹起时高亮，麻将弹下是恢复
            var l = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "handMajiangUp",
            callback: function(event)
            {   
                var cardData = event.getUserData()
                
                if(mj.cardData == cardData)
                    mj.color = cc.color(150, 150, 220)
                else
                    mj.color = cc.color(255, 255, 255)
            }
            })
            cc.eventManager.addListener(l, 1)

            var l = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "handMajiangDown",
            callback: function(event)
            {   
                var cardData = event.getUserData()
                if(mj.cardData == cardData)
                    mj.color = cc.color(255, 255, 255)
            }
            })
            cc.eventManager.addListener(l, 1)   
        }
    },
    ///////////////////////init end///////////////////////

    ///////////////cmdEvent start//////////
    updateOnFree:function()
    {
        var users = tableData.getUsersInTable(tableData.getUserWithUserId(selfdwUserID).wTableID)
        if(!playNode.isLookingResult)
        {
            if(tableData.getUserWithUserId(selfdwUserID).cbUserStatus == US_SIT)
                socket.sendMessage(MDM_GF_FRAME, SUB_GF_USER_READY)
        }
    },
    onCMD_StatusFree:function() 
    {
        cocos.setInterval(playNode.updateOnFree, 1000, playNode.node)
    },
    onCMD_StatusCall:function()
    {
        tableNode.setBankerIcon(cmdBaseWorker.wBankerUser, true)
        var currentUser = tableData.getUserWithChairId(cmdBaseWorker.wCurrentUserCall)
        chairFactory.showFiredCircle.call(currentUser.userNodeInsetChair, 20)
        
        if( tableData.getUserWithUserId(selfdwUserID).wChairID == cmdBaseWorker.wCurrentUserCall )
        {
            playNode.gamesetNode.setVisible(true)
            var isBanker = tableData.getUserWithUserId(selfdwUserID).wChairID == cmdBaseWorker.wBankerUser
            playNode.jiadingBtn1.setEnabled(!isBanker)
            playNode.jiadingBtn2.setEnabled(!isBanker)

            playNode.gamesetTTF1.setString('0')
            playNode.gamesetTTF2.setString('0')
        }

        for(var i=0;i<GAME_PLAYER;i++)
        {
            if(cmdBaseWorker.cbCallRecord[i][0]!=INVALID_BYTE)
            {
                var user = tableData.getUserWithTableIdAndChairId(self.wTableID, i)
                user.userNodeInsetChair.currentRoundNode.upTTF.setString( '下跑:'+cmdBaseWorker.cbCallRecord[i][0]+' 加顶:' + cmdBaseWorker.cbCallRecord[i][1] ) 
            }
        }
    },
    onCMD_StatusPlay:function() 
    {
        tableNode.setBankerIcon(cmdBaseWorker.wBankerUser, true)
        playNode.scoreTTF.setString(cmdBaseWorker.cbLeftCardCount)
        playNode.showLaizi()

        //初始化CardData2ScoreMap
        var cardDatas = []
        var scores = []
        var magicCardData = cmdBaseWorker.cbMagicCardData 
        for(var i=0;i<magicCardData.length;i++)
        {
            if(magicCardData[i] == INVALID_CARD_DATA)
                break
            cardDatas[cardDatas.length] = magicCardData[i]
            scores[scores.length] = -1000+magicCardData[i]
        }
        cardDatas[cardDatas.length] = REPLACE_CARD_DATA
        scores[scores.length] = magicCardData[0]
        majiangFactory.initCardData2ScoreMap( cardDatas, scores )

        var self = tableData.getUserWithUserId(selfdwUserID)
        for(var i=0;i<GAME_PLAYER;i++)
        {
            var user = tableData.getUserWithTableIdAndChairId(self.wTableID, i)
            user.userNodeInsetChair.currentRoundNode.upTTF.setString( '下跑:'+cmdBaseWorker.cbCallRecord[i][0]+' 加顶:' + cmdBaseWorker.cbCallRecord[i][1] )
        }


        var handCardDatasArray = [[[], null], [[], null], [[], null], [[], null]]
        var discardCardDatasArray = [[],[],[],[]]
        var weaveItemArray = [[],[],[],[]]

        var cbPlayerFlowerCardData = [[],[],[],[]]

        for(var wChairID=0;wChairID<GAME_PLAYER;wChairID++)
        {
            var isSelf = tableData.getUserWithChairId(wChairID).dwUserID == selfdwUserID
            var direction = tableData.getShowChairIdWithServerChairId(wChairID)
            var weaveItems = cmdBaseWorker.WeaveItemArray[wChairID]
            // //组合牌
            // for(var j=0;j<MAX_WEAVE;j++)
            // {
            //     weaveItems[j].provideDirection = tableData.getShowChairIdWithServerChairId(weaveItems[j].wProvideUser)
            // }
            weaveItemArray[direction] = weaveItems

            var cardDatas = []
            for(var j=0;j<MAX_COUNT;j++)
            {
                cardDatas[j] = 0
            }
            var handCardDatas = cmdBaseWorker.cbHandCardData[wChairID]
            if(cmdBaseWorker.cbHandCardCount[wChairID] + cmdBaseWorker.cbWeaveCount[wChairID]*3 == MAX_COUNT)
            {
                if(isSelf)
                {
                    if(cmdBaseWorker.cbSendCardData == INVALID_CARD_DATA)
                        var newGetCardData = handCardDatas[handCardDatas.length-1]
                    else
                        var newGetCardData = cmdBaseWorker.cbSendCardData
                }
                else   
                    var newGetCardData = 0

                for(var j=0;j<handCardDatas.length;j++)
                {
                    if(handCardDatas[j] == newGetCardData)
                    {
                        handCardDatas.splice(j, 1)
                        handCardDatasArray[direction][0] = handCardDatas
                        break
                    }
                }
                handCardDatasArray[direction][1] = newGetCardData
            }
            else
                handCardDatasArray[direction][0] = handCardDatas

            discardCardDatasArray[direction] = cmdBaseWorker.cbDiscardCardData[wChairID].slice(0, cmdBaseWorker.cbDiscardCount[wChairID])
       
            cbPlayerFlowerCardData[direction] = cmdBaseWorker.cbPlayerFlowerCardData[wChairID]
        }
        // console.log(6666, handCardDatasArray, discardCardDatasArray, weaveItemArray)
        cmdBaseWorker.sortHandCardDatas(handCardDatasArray[0][0]) 
        // get heapCardDatasArray
        var heapCardDatasArray = majiangFactory.getHeapCardDatasArray(cmdBaseWorker.cbHeapCardInfo, cmdBaseWorker.TurnoverCard)
        
        playNode.sendCardsAction(handCardDatasArray, discardCardDatasArray, weaveItemArray, heapCardDatasArray, cbPlayerFlowerCardData) 


        if(cmdBaseWorker.wOutCardUser!=INVALID_WORD)
        {
            var d = tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wOutCardUser)
            playNode.setCurrentDiscardMj(playNode.discardMajiangs4D, d)
        }


        playNode.updatePlayerStatusNode()

        if(self.wChairID!=INVALID_WORD && cmdBaseWorker.bPlayerStatus[self.wChairID][1])//听牌时手牌全暗
        {
            var handMajiangs = playNode.handMajiangs4D[0][0]

            for(var i=0;i<handMajiangs.length;i++)
            {
                handMajiangs[i].touchEnable = false
                handMajiangs[i].color = cc.color(155, 155, 155)
            }
        }


        playNode.timer = majiangTimer4D.getTimer()
        playNode.timer.x = 600
        playNode.timer.y = 434
        playNode.mjsNode.addChild(playNode.timer)

        playNode.timer.initFenwei( tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wBankerUser) )
        
        //动作中并且不是自摸动作
        var switchUsers = []
        if(cmdBaseWorker.wCurrentUser!=INVALID_WORD)
        {
            var currentDirection = tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wCurrentUser)
            switchUsers[0] = currentDirection
            playNode.checkHandCardTouch(currentDirection)
        }
        else if(cmdBaseWorker.wProvideUser==cmdBaseWorker.wTakeCardUser)
            switchUsers[0] = tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wTakeCardUser)        
        playNode.timer.switchTimer(switchUsers)

        /////吃碰杠胡
        var sortedActions = gameLogic.getSortedActionsWithMask(cmdBaseWorker.cbActionMask)
        var isActioning = sortedActions.length>0
        if(isActioning)
            playNode.showActionBtns(sortedActions)
    },
    onCMD_TINGDATA:function() 
    {        
    },
    onCMD_PlayerStatusUpdata:function() 
    {            
        playNode.updatePlayerStatusNode()
    },
    onCMD_CallNotify:function(body) 
    {
        cocos.clearInterval(playNode.updateOnFree, playNode.node)
        playNode.node.stopAction(playNode.gameEndAction)
        playNode.resetPlayNode()

        tableNode.setBankerIcon(cmdBaseWorker.wBankerUser, true)

        var user = tableData.getUserWithChairId(cmdBaseWorker.wCurrentUserCall)
        chairFactory.showFiredCircle.call(user.userNodeInsetChair, 20)
        if( tableData.getUserWithUserId(selfdwUserID).wChairID == cmdBaseWorker.wCurrentUserCall )
        {
            playNode.gamesetNode.setVisible(true)
            var isBanker = tableData.getUserWithUserId(selfdwUserID).wChairID == cmdBaseWorker.wBankerUser
            playNode.jiadingBtn1.setEnabled(!isBanker)
            playNode.jiadingBtn2.setEnabled(!isBanker)

            playNode.gamesetTTF1.setString('0')
            playNode.gamesetTTF2.setString('0')
        }
    },
    onCMD_CallResult:function(body) 
    {     
        var callUser = tableData.getUserWithChairId(cmdBaseWorker.wCallUser)
        chairFactory.hideFiredCircle.call(callUser.userNodeInsetChair)
        callUser.userNodeInsetChair.currentRoundNode.upTTF.setString( '下跑:'+cmdBaseWorker.cbCallRecord[cmdBaseWorker.wCallUser][0]+' 加顶:' + cmdBaseWorker.cbCallRecord[cmdBaseWorker.wCallUser][1] )

        if(cmdBaseWorker.wCurrentUserCall!=INVALID_WORD)
        {
            var currentUser = tableData.getUserWithChairId(cmdBaseWorker.wCurrentUserCall)
            chairFactory.showFiredCircle.call(currentUser.userNodeInsetChair, 20)
        }

        if( tableData.getUserWithUserId(selfdwUserID).wChairID == cmdBaseWorker.wCurrentUserCall )
        {
            playNode.gamesetNode.setVisible(true)
            var isBanker = tableData.getUserWithUserId(selfdwUserID).wChairID == cmdBaseWorker.wBankerUser
            playNode.jiadingBtn1.setEnabled(!isBanker)
            playNode.jiadingBtn2.setEnabled(!isBanker)

            playNode.gamesetTTF1.setString('0')
            playNode.gamesetTTF2.setString('0')
        }
    },
    onCMD_GameStart:function() 
    {        
        //有叫分的话这里注释
        cocos.clearInterval(playNode.updateOnFree, playNode.node)
        playNode.node.stopAction(playNode.gameEndAction)
        playNode.resetPlayNode()

        //初始化CardData2ScoreMap
        var cardDatas = []
        var scores = []
        var magicCardData = cmdBaseWorker.cbMagicCardData 
        for(var i=0;i<magicCardData.length;i++)
        {
            if(magicCardData[i] == INVALID_CARD_DATA)
                break
            cardDatas[cardDatas.length] = magicCardData[i]
            scores[scores.length] = -1000+magicCardData[i]
        }
        cardDatas[cardDatas.length] = REPLACE_CARD_DATA
        scores[scores.length] = magicCardData[0]
        majiangFactory.initCardData2ScoreMap( cardDatas, scores )

        var self = tableData.getUserWithUserId(selfdwUserID)
        for(var i=0;i<GAME_PLAYER;i++)
        {
            var user = tableData.getUserWithTableIdAndChairId(self.wTableID, i)
            user.userNodeInsetChair.currentRoundNode.upTTF.setString( '下跑:'+cmdBaseWorker.cbCallRecord[i][0]+' 加顶:' + cmdBaseWorker.cbCallRecord[i][1] )
        }

        //get handCardDatasArray
        var handCardDatasArray = []
        for(var i=0;i<GAME_PLAYER;i++)
        {
            var direction = i
            var serverChairid = tableData.getServerChairIdWithShowChairId(direction)

            var cardDatas = []
            for(var ii=0;ii<MAX_COUNT;ii++)
            {
                cardDatas[ii] = 0
            }
            if(serverChairid==self.wChairID)
                cardDatas = cmdBaseWorker.cbHandCardData[serverChairid]

            var oldCardDatas = cardDatas.slice(0, MAX_COUNT-1)
            handCardDatasArray[direction] = [oldCardDatas, null]
        }
        cmdBaseWorker.sortHandCardDatas(handCardDatasArray[0][0]) 
        //get heapCardDatasArray 
        var heapCardDatasArray = majiangFactory.getHeapCardDatasArray(cmdBaseWorker.cbHeapCardInfo, cmdBaseWorker.TurnoverCard)       
       
        playNode.sendCardsAction(handCardDatasArray, [[],[],[],[]], [[],[],[],[]], heapCardDatasArray, []) 

        playNode.setCurrentRoundMajiangsVisible(false)


        playNode.actionNode.setVisible(false)
        playNode.mjsNode.setVisible(false)
        managerTouch.closeTouch() //避免在不知道牌的情况下 把牌打出去
        //提前保存可能被破坏的数据  掷骰子是庄家出牌破坏数据 因为可能庄家筛子先出完
        var bankerShowChairid = tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wBankerUser)
        
        playNode.timer = majiangTimer4D.getTimer()
        playNode.timer.x = 600
        playNode.timer.y = 434
        playNode.mjsNode.addChild(playNode.timer)
        playNode.timer.initFenwei( bankerShowChairid )

        // var map = [0,0,1,2,3,1,1,2,3,3,1,2,3]
        // var takerChairid = (cmdBaseWorker.wBankerUser + 
        //     map[ cmdBaseWorker.cbSiceCount[0]+cmdBaseWorker.cbSiceCount[1] ])%GAME_PLAYER
        // var takerShowChairid = tableData.getShowChairIdWithServerChairId(takerChairid)

        function gameStart()
        {
            playNode.showLaizi()

            playNode.setCurrentRoundMajiangsVisible(true)
            playNode.actionNode.setVisible(true)
            playNode.mjsNode.setVisible(true)
            // /playNode.currentDiscardMjNode.setVisible(true)
            playNode.actionBtns.setVisible(true)

            managerTouch.openTouch()
        }

        tableNode.setBankerIcon(cmdBaseWorker.wBankerUser, true)
        playNode.playDiceOneDirection(gameStart, cmdBaseWorker.cbSiceCount[0], 
            cmdBaseWorker.cbSiceCount[1], tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wBankerUser))

        // function bankerPlayDice()
        // {
        //     playNode.playDiceOneDirection(takePlayDice, cmdBaseWorker.cbSiceCount[0], 
        //         cmdBaseWorker.cbSiceCount[1], bankerShowChairid)
        // }

        // function takePlayDice()
        // {
        //     tableNode.setBankerIcon(cmdBaseWorker.wBankerUser, true)
        //     playNode.playDiceOneDirection(gameStart, cmdBaseWorker.cbSiceCount[2], 
        //         cmdBaseWorker.cbSiceCount[3], takerShowChairid)
        // }

        // if(cmdBaseWorker.bIsRandBanker)
        //     playNode.playDiceForRandBanker(bankerPlayDice, bankerShowChairid)
        // else
        //     bankerPlayDice()

    },
    onCMD_OutCard:function() 
    {
        playNode.onUserOutCard()

        var sortedActions = gameLogic.getSortedActionsWithMask(cmdBaseWorker.cbActionMask)
        if(sortedActions.length>0)
            playNode.showActionBtns(sortedActions)
    },
    onCMD_SendCard:function() 
    {
        if(cmdBaseWorker.cbOutCardCount != 0)
            managerAudio.playEffect('gameRes/sound/sendcard.mp3')

        playNode.scoreTTF.setString(cmdBaseWorker.cbLeftCardCount)
        
        var takeDir =  tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wTakeCardUser)   
        ///////
        for(var i=0;i<cmdBaseWorker.cbSendCardCount;i++)
        {
            var item = cmdBaseWorker.sendCardArray[i]
            //牌堆
            var heapMajiangsDir = tableData.getShowChairIdWithServerChairId(item.wHeapDir)  
            majiangFactory.deleteHeapMajiangs(playNode.heapMajiangs4D[heapMajiangsDir], [item.wHeapPos])
            //手牌
            if(item.cbCardData == SEND_DISCARD_CARD_DATA)//丢弃牌
                continue
            var cardData = tableData.getUserWithChairId(cmdBaseWorker.wTakeCardUser).dwUserID == selfdwUserID?item.cbCardData:0
            majiangFactory.addHandMajiang(playNode.handMajiangs4D[takeDir], takeDir, cardData, playNode.mjsNode, playNode.weaveMajiangs4D[takeDir].length)
        }

        var switchUsers = []
        if(cmdBaseWorker.wCurrentUser!=INVALID_WORD)
        {
            var currentDirection = tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wCurrentUser)
            switchUsers[0] = currentDirection
            playNode.checkHandCardTouch(currentDirection)
        }        
        else if(cmdBaseWorker.wProvideUser==cmdBaseWorker.wTakeCardUser)
            switchUsers[0] = tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wTakeCardUser)        
        playNode.timer.switchTimer(switchUsers)

        /////摸到麻将时有可能出现杠听胡补花
        var sortedActions = gameLogic.getSortedActionsWithMask(cmdBaseWorker.cbActionMask)
        if(sortedActions.length>0)
            playNode.showActionBtns(sortedActions)  //自摸杠 cardData不确定 需要searchGangCardDatas
        else if(cmdBaseWorker.wCurrentUser!=INVALID_WORD 
            && tableData.getUserWithChairId(cmdBaseWorker.wCurrentUser).dwUserID == selfdwUserID 
            && cmdBaseWorker.bPlayerStatus[cmdBaseWorker.wCurrentUser][1]) 
        {
            cmdBaseWorker.wCurrentUser = INVALID_WORD
            var OutCard = getObjWithStructName('CMD_C_OutCard')
            OutCard.cbOutCardData = playNode.handMajiangs4D[0][1].cardData
            socket.sendMessage(MDM_GF_GAME,SUB_C_OUT_CARD,OutCard)
        }
    },
    onCMD_OperateResult:function() 
    {
        playNode.hideActionBtns()
        playNode.hideCurrentDiscardMj()
        
        if(cmdBaseWorker.cbOperateCode != WIK_NULL)
        {
            //动作效果
            var operateUser = tableData.getUserWithChairId(cmdBaseWorker.wOperateUser)
            var provideUser = tableData.getUserWithChairId(cmdBaseWorker.wProvideUser)

            playNode.onActionResult(cmdBaseWorker.cbOperateCode, cmdBaseWorker.cbOperateWeaveIdx, cmdBaseWorker.OperateWeaveItem, 
                cmdBaseWorker.wOperateUser, cmdBaseWorker.wProvideUser, cmdBaseWorker.cbProvideCardData)

            if(cmdBaseWorker.cbOperateCode == WIK_GANG && cmdBaseWorker.OperateWeaveItem.cbWeaveKindType==2)
                var WIK = WIK_XIAOXI
            else
                var WIK = cmdBaseWorker.cbOperateCode

            playNode.playAction(WIK, operateUser)
        }

        var switchUsers = []
        if(cmdBaseWorker.wCurrentUser!=INVALID_WORD)
        {
            var currentDirection = tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wCurrentUser)
            switchUsers[0] = currentDirection
            playNode.checkHandCardTouch(currentDirection)
        }
        else if(cmdBaseWorker.wProvideUser==cmdBaseWorker.wTakeCardUser)
            switchUsers[0] = tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wTakeCardUser)        
        playNode.timer.switchTimer(switchUsers)

        if(tableData.getUserWithUserId(selfdwUserID).wChairID != INVALID_WORD)
        {
            var sortedActions = gameLogic.getSortedActionsWithMask(cmdBaseWorker.cbActionMask)
            if(sortedActions.length>0)
            {
                cmdBaseWorker.wProvideUser = cmdBaseWorker.wOperateUser //执行完上一个动作wProvideUser需要更新
                cmdBaseWorker.cbProvideCardData  = cmdBaseWorker.cbProvideCardData //cbProvideCardData仍有意义 碰杠可能触发胡 
                playNode.showActionBtns(sortedActions)  //吃碰后杠 cardData不确定 需要searchGangCardDatas
            }
            else if(cmdBaseWorker.wCurrentUser!=INVALID_WORD 
                && tableData.getUserWithChairId(cmdBaseWorker.wCurrentUser).dwUserID == selfdwUserID 
                && cmdBaseWorker.bPlayerStatus[cmdBaseWorker.wCurrentUser][1]) 
            {
                cmdBaseWorker.wCurrentUser = INVALID_WORD
                var OutCard = getObjWithStructName('CMD_C_OutCard')
                OutCard.cbOutCardData = playNode.handMajiangs4D[0][1].cardData
                socket.sendMessage(MDM_GF_GAME,SUB_C_OUT_CARD,OutCard)
            }
        }
    },
    onCMD_ReplaceResult:function()
    {    
        playNode.hideActionBtns()
        playNode.hideCurrentDiscardMj()
        
        var cbReplaceCardData = cmdBaseWorker.cbReplaceCardData

        var operateUser = tableData.getUserWithChairId(cmdBaseWorker.wOperateUser)
        var operateUserDir = tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wOperateUser)
        
        var operateHandMajiangs = playNode.handMajiangs4D[operateUserDir]
        var operateFlowerMajiangs = playNode.flowerMajiangs4D[operateUserDir]

        for(var i=0;i<cbReplaceCardData.length;i++)
        {
            var deleteCardData = operateUser.dwUserID == selfdwUserID?cbReplaceCardData[i]:0
            var flowerCardData = cbReplaceCardData[i]
            majiangFactory.deleteHandMajiangs(operateHandMajiangs, operateUserDir, deleteCardData)

            majiangFactory.addFlowerMajiangs(operateFlowerMajiangs, operateUserDir, flowerCardData, playNode.mjsNode)
        }    

console.log(4444, cmdBaseWorker.cbOutCardCount,cmdBaseWorker.bIsDaXi)
        if(cmdBaseWorker.cbOutCardCount != 0)//开局补花
        {

            if(cmdBaseWorker.bIsDaXi)
                playNode.playAction(WIK_DAXI, operateUser)

            playNode.playAction(WIK_REPLACE, operateUser)
        }
    },
    onCMD_ListenResult:function()
    {
        var operateUser = tableData.getUserWithChairId(cmdBaseWorker.wOperateUser)

        // playNode.hideActionBtns()
        // majiangFactory.hideCurrentDiscardMj()

        // var switchUsers = []
        // if(cmdBaseWorker.wCurrentUser!=INVALID_WORD)
        //     switchUsers[0] = tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wCurrentUser)
        // else if(cmdBaseWorker.wProvideUser==cmdBaseWorker.wTakeCardUser)
        //     switchUsers[0] = tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wTakeCardUser)        
        // playNode.timer.switchTimer(switchUsers)

        // playNode.onUserOutCard()

        if(tableData.getUserWithUserId(selfdwUserID).wChairID == cmdBaseWorker.wOperateUser)
        {
            var handMajiangs = playNode.handMajiangs4D[0][0]
            for(var i=0;i<handMajiangs.length;i++)
            {
                handMajiangs[i].touchEnable = false
                handMajiangs[i].color = cc.color(155, 155, 155)
            }     
        }

        var sortedActions = gameLogic.getSortedActionsWithMask(cmdBaseWorker.cbActionMask)
        if(sortedActions.length>0)
            playNode.showActionBtns(sortedActions)

        playNode.playAction(WIK_LISTEN, operateUser)
    },
    onCMD_GameEnd:function() 
    {
        ////////////////5张牌日志////////////////
        var handCardDatas = playNode.getHandCardDatas( playNode.handMajiangs4D[0] )
        var discardCardDatas = playNode.getDiscardCardDatas( playNode.discardMajiangs4D )
        var weaveCardDatas = playNode.getWeaveCardDatas(cmdBaseWorker.cbWeaveCount, cmdBaseWorker.WeaveItemArray)

        var showCardDatas = (handCardDatas.concat(discardCardDatas)).concat(weaveCardDatas)

        var cardDatas = []
        for(var i=0;i<showCardDatas.length;i++)
        {
            var cardData = showCardDatas[i]
            if(typeof(cardDatas[cardData]) == 'undefined')
                cardDatas[cardData] = 0
            else
                cardDatas[cardData]++
        
            var totalCardData = cardData==cmdBaseWorker.TurnoverCard[0].cbCardData?3:4

            if(cardDatas[cardData]>totalCardData)
            {
               sendLogToServer(gameLog.logS + 'wtmsfiveCard'+selfdwUserID+'-wtms')
               break
            }
        }
        ///////////////////////////////////////

        playNode.gamesetNode.setVisible(false)
        cmdBaseWorker.wCurrentUser = INVALID_WORD

        playNode.isLookingResult = true   
        playNode.hideActionBtns()

        cocos.setInterval(playNode.updateOnFree, 1000, playNode.node)

        var userData_gameEnd = []
        for(var i=0;i<GAME_PLAYER;i++)
        {
            var user = tableData.getUserWithChairId(i)
            userData_gameEnd[i] = {}

            if(user)
            {
                userData_gameEnd[i].szNickName = user.szNickName
                userData_gameEnd[i].szHeadImageUrlPath = user.szHeadImageUrlPath
            }
        }

        if(cmdBaseWorker.endType == 3)
        {
            var provideDiscardMajiangs = playNode.discardMajiangs4D[tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wProvideUser)]
            //抢杠情况不会到丢弃区
            if(provideDiscardMajiangs.length>0 && provideDiscardMajiangs[provideDiscardMajiangs.length-1].cardData == cmdBaseWorker.cbProvideCardData)
                majiangFactory.popDiscardMajiangs(provideDiscardMajiangs)
        }

        playNode.playAnimationOfGameEnd(onPlayAnimationOfGameEnd)
        function onPlayAnimationOfGameEnd()
        {
            playNode.gameEndAction = cc.sequence( 
                cc.callFunc(function()
                {     
                    playNode.timer.resetTimer()
                    playNode.hideCurrentDiscardMj()
                    playNode._showSprsOnGameEnd()
                }), 
                cc.delayTime(1), //看牌5秒
                cc.callFunc(function()
                {   
                    headIconPop.kickUserOnGameEnd()
                    var record = getObjWithStructName('CMD_GR_C_TableHistoryRecordReq') 
                    record.szTableKey = tableKey
                    socket.sendMessage(MDM_GR_USER, SUB_GR_USER_TABLE_HISTORY_RECORD_REQ, record)

                    var continueCall = function()
                    {
                        playNode.isLookingResult = false   
                        var user = tableData.getUserWithUserId(selfdwUserID)
                        if(user.cbUserStatus == US_SIT)//只有坐下未准备的情况 才会resetPlayNode
                        {
                            playNode.resetPlayNode()
                            var isLastWinner = false
                            for(var i=0;i<cmdBaseWorker.dwLastWinner.length;i++)
                            {   
                                isLastWinner =  cmdBaseWorker.dwLastWinner[i] == selfdwUserID
                                if(isLastWinner)
                                    break
                            }
                            if(isLastWinner)//有的游戏需要上轮赢得玩家站起
                            {
                                var lookon = getObjWithStructName('CMD_GR_UserLookon') 
                                lookon.wTableID = tableData.tableID
                                socket.sendMessage(MDM_GR_USER, SUB_GR_USER_LOOKON, lookon) 
                            }
                        } 
                    }
                    playNode.popGameEnd(continueCall, userData_gameEnd) 
                    playNode.mjsNode.removeAllChildren()
                }) 
            )           
            playNode.node.runAction(playNode.gameEndAction)
        }        
    },
    ///////////////cmdEvent end//////////
    onUserOutCard:function()
    {
        var outUser = tableData.getUserWithChairId(cmdBaseWorker.wOutCardUser)
        var outDir = tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wOutCardUser)  
        var outCardData = cmdBaseWorker.cbOutCardData

        playNode.timer.switchTimer([])
        playNode.playMajiangEffect(outCardData, outUser.cbGender)
        managerAudio.playEffect('gameRes/sound/discard.mp3')

        var majiangs = playNode.handMajiangs4D[outDir]
        if(outUser.dwUserID==selfdwUserID)
        {
            majiangFactory.deleteHandMajiangs(majiangs, outDir, outCardData)
            var newMj = majiangs[1]
            if(newMj)
            {
                majiangFactory.addHandMajiangsOld(majiangs, outDir, newMj.cardData, playNode.mjsNode)
                majiangFactory.deleteHandMajiangNew(majiangs)
            }
        }
        else
            majiangFactory.deleteHandMajiangs(majiangs, outDir, 0)

        majiangFactory.addDiscardMajiangs(playNode.discardMajiangs4D[outDir], outDir,outCardData, playNode.mjsNode)

        playNode.setCurrentDiscardMj(playNode.discardMajiangs4D, outDir)
    },
    updatePlayerStatusNode:function()
    {
        for(var wChairID=0;wChairID<GAME_PLAYER;wChairID++)
        {
            var user = tableData.getUserWithTableIdAndChairId(self.wTableID, wChairID)
            var playerStatusNode = user.userNodeInsetChair.currentRoundNode.playerStatusNode
            playerStatusNode.removeAllChildren()

            var statusList = cmdBaseWorker.bPlayerStatus[wChairID]
            var posY = 0
            for(var i=0;i<statusList.length;i++)
            {
                if(statusList[i])
                {
                    var icon = new cc.Sprite('#playerStatus_' + i + '.png')
                    icon.y = posY
                    posY -= 20
                    playerStatusNode.addChild(icon)
                }
            }
        } 
    },
    ////////////sendCardsAction start//////////
    // updataTingHuCardNode:function(cardData)
    // {
    //     playNode.tingHuCardNode.removeAllChildren()

    //     for(var i=0;i<cmdBaseWorker.cbTingDataCount;i++)
    //     {
    //         var tingDataItem = cmdBaseWorker.tingData[i]
    //         if(tingDataItem.cbTingCardData == cardData)
    //         {
    //             var cbHuCardData = tingDataItem.cbHuCardData
    //             for(var j=0;j<tingDataItem.cbHuCardDataCount;j++)
    //             {
    //                 var mj = majiangFactory.getOne(cbHuCardData[j], 0, 0, true)
    //                 mj.x = 50 + 80*j
    //                 playNode.tingHuCardNode.addChild(mj)
    //             }
    //             break
    //         }
    //     }
    // },

    updataTingHuCardNode:function(cardData)
    {
        var cardDataArray = []
        for(var i=0;i<cmdBaseWorker.cbTingDataCount;i++)
        {
            var tingDataItem = cmdBaseWorker.tingData[i]
            if(tingDataItem.cbTingCardData == cardData)
            {
                cardDataArray = tingDataItem.cbHuCardData.slice(0, tingDataItem.cbHuCardDataCount)
                break
            }
        }
        // var cardDataArray = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18]
        var rowNum = Math.min(cardDataArray.length, 7)
        var lineNum = Math.ceil(cardDataArray.length/7)

        var pop = playNode.tingHuCardNode
        pop.removeAllChildren()

        pop.ignoreAnchorPointForPosition(false)
        pop.setAnchorPoint( cc.p(0.5, 0.5) )

        var width = rowNum * 110
        var height = lineNum * 70
        pop.setContentSize( width, height) 

        var bg = new cc.Scale9Sprite('s_sp9_19.png')
        bg.width = width + 10
        bg.height = height + 20
        bg.x = width/2
        bg.y = height/2
        bg.anchorX = 0.5
        bg.anchorY = 0.5
        pop.addChild(bg, -1, 10)

        var listView = new ccui.ListView()
        listView.setDirection(ccui.ScrollView.DIR_VERTICAL)
        listView.setTouchEnabled(true)
        listView.setBounceEnabled(true)
        // listView.setScrollBarEnabled(false)
        listView.setBackGroundImage(resp_p.empty)
        listView.setBackGroundImageScale9Enabled(true)

        listView.setContentSize(width, height)
        listView.x = 0
        listView.y = 0
        pop.addChild(listView)

        for(var i=0;;i++)
        {
            if(cardDataArray.length == 0)
                break
            var s = cardDataArray.splice(0, Math.min(rowNum, cardDataArray.length))
            listView.pushBackCustomItem( playNode._getOneLine_TingHuCard( 
                {
                    cardDatas:s
                } ) )
        }
        listView.forceDoLayout()

        listView.setTouchEnabled(listView.getItem(0) && listView.getItem(0).getPositionY()+listView.getItem(0).getContentSize().height>listView.height)
    },
    _getOneLine_TingHuCard:function(params)
    {
        var default_item = new ccui.Layout()
        default_item.setContentSize(110, 70)
        
        var cardDatas = params.cardDatas

        for(var i=0;i<cardDatas.length;i++)
        {
            var cardData = cardDatas[i]
            var item = playNode._getOneItem_TingHuCard(cardData)


            item.setPosition( cc.p( i*110, 0 ) )
            default_item.addChild(item)
        }

        return default_item
    },
    _getOneItem_TingHuCard:function(cardData)
    {
        var item = new cc.Node()
        item.setAnchorPoint( cc.p(0, 0) )

        var bg = new cc.Scale9Sprite('s_sp9_20.png')
        bg.width = 105
        bg.height = 65
        bg.x = 55
        bg.y = 35
        bg.anchorX = 0.5
        bg.anchorY = 0.5
        item.addChild(bg)

        var where = {}
        where.name = 'paper'
        where.data = {}
        var mj = majiangFactory.getOne(cardData, 0, where)
        mj.isIgnoreDecorate = true
        mj.x = 30
        mj.y = 35
        item.addChild(mj)

        var tipsTTF = new cc.LabelTTF('还有' + playNode._getCountOfLastCardData(cardData) + '张', "Helvetica", 14)
        tipsTTF.setFontFillColor(cc.color(0, 192, 192, 192) )
        tipsTTF.x = 80
        tipsTTF.y = 20
        item.addChild(tipsTTF)

        return item
    },
    _getCountOfLastCardData:function(cardData)
    {
        var lastCardData = cardData==cmdBaseWorker.TurnoverCard[0].cbCardData?3:4

        var handCardDatas = playNode.getHandCardDatas( playNode.handMajiangs4D[0] )
        var discardCardDatas = playNode.getDiscardCardDatas( playNode.discardMajiangs4D )
        var weaveCardDatas = playNode.getWeaveCardDatas(cmdBaseWorker.cbWeaveCount, cmdBaseWorker.WeaveItemArray)

        var showCardDatas = (handCardDatas.concat(discardCardDatas)).concat(weaveCardDatas)

        for(var i=0;i<showCardDatas.length;i++)
        {
            if(showCardDatas[i] == cardData)
                lastCardData--
        }

        return lastCardData
    },  
    _gethandMajiangsListener:function(touchEndCall)
    {
        var majiangs = playNode.handMajiangs4D[0]

        var currentMajiangTipsNode = new cc.Node()
        var bg = new cc.Sprite('#mf_currentMjBg.png')
        currentMajiangTipsNode.addChild(bg)

        var where = {}
        where.name = 'hand'
        where.data = {idx:0}
        var mj = majiangFactory.getOne(1, 0, where)
        mj.x = 0
        mj.y = 0
        mj.isIgnoreDecorate = true
        currentMajiangTipsNode.addChild(mj)

        currentMajiangTipsNode.x = - 1000
        currentMajiangTipsNode.y = 100 + bg.height*0.5 + 80

        playNode.mjsNode.addChild(currentMajiangTipsNode, 1000)

        var mjOriginY = majiangs[0][0].y
        var touchPosX2TouchedMj = function(locationInNode)
        {      
            for(var i=0;i<majiangs[0].length;i++)
            {
                var mj = majiangs[0][i]
                if(locationInNode.x>mj.x-mj.width*0.5 && locationInNode.x<mj.x+mj.width*0.5 
                    && locationInNode.y>mj.y-mj.height*0.5 && locationInNode.y<mj.y+mj.height*0.5 )
                    return mj
            }

            var mj = majiangs[1]
            if(mj && locationInNode.x>mj.x-mj.width*0.5 && locationInNode.x<mj.x+mj.width*0.5
                && locationInNode.y>mj.y-mj.height*0.5 && locationInNode.y<mj.y+mj.height*0.5 )
                return mj

            return null
        }

        var lastPlayTime = null
        var playSelectEffect = function()
        {
            var nowTime = new Date().getTime()

            if(!lastPlayTime || (nowTime - lastPlayTime) > 100)
            {
                lastPlayTime = nowTime
                managerAudio.playEffect('gameRes/sound/selectcard.mp3')
            }
        }

        var currentMajiang = null
        var currentPopMajiang = null
        var touchedMjNum = 0
        var isTouchFromPop = false
        var soundId = null
        var onTouch = function(touchedMj)
        {   
            if(!currentMajiang)//刚开始触摸麻将
            {
                touchedMjNum = 1

                currentMajiang = touchedMj
                if(currentPopMajiang)
                {
                    isTouchFromPop = currentPopMajiang == currentMajiang

                    currentPopMajiang.y = mjOriginY
                    var event = new cc.EventCustom("handMajiangDown")
                    event.setUserData(currentPopMajiang.cardData)
                    cc.eventManager.dispatchEvent(event) 
                }

                currentMajiang.y = mjOriginY + 20
                var event = new cc.EventCustom("handMajiangUp")
                event.setUserData(currentMajiang.cardData)
                cc.eventManager.dispatchEvent(event) 

                //////
                currentMajiangTipsNode.x = currentMajiang.x
                currentMajiangTipsNode.y = 100 + bg.height*0.5 + 80
                mj.getChildByTag(101).setSpriteFrame('mf_' + currentMajiang.cardData + '.png') 
            }
            else if(currentMajiang && currentMajiang!=touchedMj)//摸到新的麻将 
            {
                touchedMjNum++
                playSelectEffect()

                currentMajiang.y = mjOriginY
                var event = new cc.EventCustom("handMajiangDown")
                event.setUserData(currentMajiang.cardData)
                cc.eventManager.dispatchEvent(event) 


                currentMajiang = touchedMj
                currentMajiang.y = mjOriginY + 20
                var event = new cc.EventCustom("handMajiangUp")
                event.setUserData(currentMajiang.cardData)
                cc.eventManager.dispatchEvent(event) 

                //////
                currentMajiangTipsNode.x = currentMajiang.x
                currentMajiangTipsNode.y = 100 + bg.height*0.5 + 80
                mj.getChildByTag(101).setSpriteFrame('mf_' + currentMajiang.cardData + '.png') 
            }
               
            playNode.currentDiscardMjNode.setVisible(false)
            return true
        }

        var listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget()

                var locationInNode = target.convertToNodeSpace(touch.getLocation())

                var touchedMj = touchPosX2TouchedMj(locationInNode)
                if(touchedMj && touchedMj.touchEnable)
                {
                    return onTouch(touchedMj)
                }
                else
                {
                    if(currentPopMajiang)
                    {         
                        currentPopMajiang.y = mjOriginY
                        var event = new cc.EventCustom("handMajiangDown")
                        event.setUserData(currentPopMajiang.cardData)
                        cc.eventManager.dispatchEvent(event) 
                        currentPopMajiang = null
                    }

                    return false 
                }
            },
            onTouchMoved: function (touch, event) {
                var target = event.getCurrentTarget()
                var locationInNode = target.convertToNodeSpace(touch.getLocation())

                var touchedMj = touchPosX2TouchedMj(locationInNode)
                if(touchedMj && touchedMj.touchEnable)
                {
                    onTouch(touchedMj)
                }
            },
            onTouchEnded: function (touch, event) 
            {
                var target = event.getCurrentTarget()

                var locationInNode = target.convertToNodeSpace(touch.getLocation())
                
                if(isTouchFromPop && currentPopMajiang == touchPosX2TouchedMj(locationInNode) 
                && touchedMjNum==1) //单击弹出的那张麻将
                {
                    touchEndCall?touchEndCall(currentPopMajiang):''
                    currentPopMajiang = null
                    isTouchFromPop = false

                    currentMajiang.y = mjOriginY
                    var event = new cc.EventCustom("handMajiangDown")
                    event.setUserData(currentMajiang.cardData)
                    cc.eventManager.dispatchEvent(event)  
                }
                else
                {
                    currentPopMajiang = currentMajiang
                }

                currentMajiangTipsNode.x = -1000
                currentMajiang = null
                touchedMjNum = 0
                isTouchFromPop = false

                var event = new cc.EventCustom("handMajiangTouchEnd")
                cc.eventManager.dispatchEvent(event)

                playNode.currentDiscardMjNode.setVisible(true)
            }
        })
            

        return listener
    },
    _bindHandMajiangsListener:function()
    {
        var handMajiangs = playNode.handMajiangs4D

        if(tableData.getUserWithUserId(selfdwUserID).wChairID == tableData.getServerChairIdWithShowChairId(0))
        {
            var touchEndCall = function(majiang)
            {
                if(playNode.isInChooseTingCardTime)
                {
                    cmdBaseWorker.sendMessage_operateCard([majiang.cardData], WIK_LISTEN )
                    playNode.hideActionBtns()   
                }
                else
                {
                    var isCurrentUser = tableData.getUserWithUserId(selfdwUserID).wChairID == cmdBaseWorker.wCurrentUser
                    if(isCurrentUser && majiang.touchEnable)
                    {
                        cmdBaseWorker.wCurrentUser = INVALID_WORD
                        var OutCard = getObjWithStructName('CMD_C_OutCard')
                        OutCard.cbOutCardData = majiang.cardData
                        socket.sendMessage(MDM_GF_GAME,SUB_C_OUT_CARD,OutCard)
                        // playNode.hideActionBtns()
                    }
                }
            }

            var listener = playNode._gethandMajiangsListener(touchEndCall)
            var mjsListenerNode = new cc.Node
            mjsListenerNode.width = playNode.mjsNode.width
            mjsListenerNode.height = playNode.mjsNode.height
            playNode.mjsNode.addChild(mjsListenerNode)
            cc.eventManager.addListener(listener, mjsListenerNode)
        }
    },
    sendCardsAction:function(handCardDatasArray, discardCardDatasArray, weaveItemArray, heapCardDatasArray, flowerCardDatasArray)
    {   
        // flowerCardDatasArray = [ [0x41,0x42,0x43,0x44,0x45,0x46,0x47,0x48],[0x41,0x42,0x43,0x44,0x45,0x46,0x47,0x48],[0x41,0x42,0x43,0x44,0x45,0x46,0x47,0x48],[0x41,0x42,0x43,0x44,0x45,0x46,0x47,0x48] ]
        // heapCardDatasArray = [ [1,0,0,0,0,0,0,0,0,0,0,0,0,0],[],[],[] ]
        // discardCardDatasArray = [[55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,4,4,55],[55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,4,4,55],[4,4,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55],[55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55]]
        // weaveCardDatasArray = [[[1,2,3,4],[2,3,4],[4,5,6],[7,8,1]],[],[[1,2,3],[2,3,4,5],[4,5,6],[7,8,1]],[]]
        var self = tableData.getUserWithUserId(selfdwUserID)
        var selfDir = tableData.getShowChairIdWithServerChairId(self.wChairID)

        playNode.flowerMajiangs4D = majiangFactory.getFlowerMajiangsArray(flowerCardDatasArray)
        playNode.heapMajiangs4D = majiangFactory.getHeapMajiangsArray(heapCardDatasArray)
        playNode.handMajiangs4D = majiangFactory.getHandMajiangsArray(handCardDatasArray, tableData.getUserWithUserId(selfdwUserID).wChairID == INVALID_WORD)
        playNode.discardMajiangs4D = majiangFactory.getDiscardMajiangsArray(discardCardDatasArray)
        playNode.weaveMajiangs4D = majiangFactory.getWeaveMajiangsArray(weaveItemArray, selfDir)

        playNode._bindHandMajiangsListener()

        var self = tableData.getUserWithUserId(selfdwUserID)
        for(var showChairid=0;showChairid<4;showChairid++)
        {
            var direction = showChairid
            var chairid = tableData.getServerChairIdWithShowChairId(direction)

            var user = tableData.getUserWithTableIdAndChairId(self.wTableID, chairid)

            var flowerMajiangs = playNode.flowerMajiangs4D[direction]
            for(var j=0;j<flowerMajiangs.length;j++)
            {
                var mj = flowerMajiangs[j]
                playNode.mjsNode.addChild(mj)
            }

            var heapMajiangs = playNode.heapMajiangs4D[direction]
            for(var j=0;j<heapMajiangs.length;j++)
            {
                var mj = heapMajiangs[j]
                if(mj)
                    playNode.mjsNode.addChild(mj)
            }

            var discardMajiangs = playNode.discardMajiangs4D[direction]
            for(var j=0;j<discardMajiangs.length;j++)
            {
                var mj = discardMajiangs[j]
                playNode.mjsNode.addChild(mj)
            }

            var handMajiangs = playNode.handMajiangs4D[direction]
            var oldMajiangs = handMajiangs[0]
            for(var j=0;j<oldMajiangs.length;j++)
            {
                var mj = oldMajiangs[j]
                playNode.mjsNode.addChild(mj)
            }
            var newMajiangs = handMajiangs[1]
            if(newMajiangs)
                playNode.mjsNode.addChild(newMajiangs)

            var weaveMajiangs = playNode.weaveMajiangs4D[direction]
            for(var weaveIdx=0;weaveIdx<weaveMajiangs.length;weaveIdx++)
            {
                var weave = weaveMajiangs[weaveIdx]
                for(var idxInWeave=0;idxInWeave<weave.length;idxInWeave++)
                {
                    var mj = weave[idxInWeave]
                    playNode.mjsNode.addChild(mj)
                }
            }

            // handMajiangsNode.addChild(playNode.handWeaveNode4D[direction])
        }

    },
    ////////////sendCardsAction end//////////


    ////////////gameend start//////////
    _showSprsOnGameEnd:function()
    {

    },
    _removeSprsOnGameEnd:function()
    {
        for(var chairId=0;chairId<GAME_PLAYER;chairId++)
        {   
            var user = tableData.getUserWithTableIdAndChairId(null, chairId)
            if(user)
                playNode.clearCurrentRoundNode(user.userNodeInsetChair.currentRoundNode)
        }
    },
    getDisplayHandMajiangPosAndTag:function(length, idxInCardDatas, direction, isNewGetMj)
    {
        var pos = {}
        switch(direction) //越大的牌靠newMj越近
        {
            case 0://down
            {   
                pos.scale = majiangFactory.scale_upDown*majiangFactory.downHandIntervalX/majiangFactory.downWeaveIntervalX

                if(isNewGetMj)
                    pos.x = ( length+0.5 )*pos.scale*majiangFactory.downWeaveIntervalX + majiangFactory.downMjAndNewMjInterval*majiangFactory.scale_upDown
                else
                    pos.x = ( idxInCardDatas+0.5 )*pos.scale*majiangFactory.downWeaveIntervalX
                pos.y = pos.scale*majiangFactory.down_weaveHeight*0.5 
                pos.zOrder = 0
                break
            }
            case 1://right
            {
                pos.scale = majiangFactory.scale_rightLeft*majiangFactory.rightHandIntervalY/majiangFactory.rightWeaveIntervalY

                pos.x = 1.2*(majiangFactory.right_weaveWidth - majiangFactory.right_handWidth)*majiangFactory.scale_rightLeft
                if(isNewGetMj)
                {
                    pos.y = ( length+0.5 )*pos.scale*majiangFactory.rightWeaveIntervalY + majiangFactory.rightMjAndNewMjInterval*majiangFactory.scale_rightLeft
                    pos.zOrder = 0
                }
                else
                {
                    pos.y = ( idxInCardDatas+0.5 )*pos.scale*majiangFactory.rightWeaveIntervalY
                    pos.zOrder = length-idxInCardDatas
                }
                break
            }
            case 2://up
            {
                pos.scale = majiangFactory.scale_upDown*majiangFactory.upHandIntervalX/majiangFactory.upWeaveIntervalX
                if(isNewGetMj)
                    pos.x = ( 0.5 )*pos.scale*majiangFactory.upWeaveIntervalX
                else
                    pos.x = ( length-1-idxInCardDatas+0.5+1 )*pos.scale*majiangFactory.upWeaveIntervalX + majiangFactory.upMjAndNewMjInterval*majiangFactory.scale_upDown
                pos.y = pos.scale*majiangFactory.up_weaveHeight*0.5
                pos.zOrder = 0
                break
            }
            case 3://left
            {
                pos.scale = majiangFactory.scale_rightLeft*majiangFactory.leftHandIntervalY/majiangFactory.leftWeaveIntervalY

                pos.x = -1.2*(majiangFactory.left_weaveWidth - majiangFactory.left_handWidth)*majiangFactory.scale_rightLeft + 0.5*pos.scale*majiangFactory.left_weaveWidth
                if(isNewGetMj)
                {
                    pos.y = ( length+0.5 )*pos.scale*majiangFactory.leftWeaveIntervalY + majiangFactory.leftMjAndNewMjInterval*majiangFactory.scale_rightLeft
                    //pos.zOrder = -1
                    pos.zOrder = 0
                }
                else
                {
                    pos.y = ( idxInCardDatas+0.5 )*pos.scale*majiangFactory.leftWeaveIntervalY
                    // pos.zOrder = idxInCardDatas
                    pos.zOrder = length-idxInCardDatas
                }
                break
            }
        }

        return pos
    },
    popGameEnd:function(continueCall, userData_gameEnd)
    {
        var control = {}
        control.continueCall = function()
        {
            continueCall()
            node.removeFromParent()
        }
        var node  = managerRes.loadCCB(resp.gameEndPopCCB, control)

        playNode.gameEndControl = control

        control.gendTitle.setSpriteFrame('gendTitle'+cmdBaseWorker.endType + '.png')

        for(var showChairid=0;showChairid<4;showChairid++)
        {
            var direction = showChairid
            var wChairID = tableData.getServerChairIdWithShowChairId(showChairid)

            var gendBar = control['gendBar'+wChairID]
            var headNode = control['headNode'+wChairID]
            var handCardNode = control['handCardNode'+wChairID]
            var flowerCardNode = control['flowerCardNode'+wChairID]
            var resultTTF = control['resultTTF'+wChairID]
            //头像
            var headIcon = new cc.Sprite('#headIcon.png')
            var hnode = getRectNodeWithSpr(headIcon)
            // hnode.x = 70
            // hnode.y = 60
            var url = userData_gameEnd[wChairID].szHeadImageUrlPath
            if(url)
            { 
                (function(headIcon, url)
                {
                    cc.loader.loadImg(url, {isCrossOrigin : false}, function(err,img){
                            var texture2d = new cc.Texture2D()
                            texture2d.initWithElement(img)
                            texture2d.handleLoadedTexture()

                            var frame = new cc.SpriteFrame(texture2d, cc.rect(0, 0, texture2d.getContentSize().width, texture2d.getContentSize().height))
                            headIcon.setSpriteFrame(frame)
                    })
                }(headIcon, url))
            }

            var userName = getLabel(14, 90, 2)
            userName.setFontFillColor( cc.color(255, 255, 255, 255) )
            userName.x = 0
            userName.y = 52
            userName.setStringNew(userData_gameEnd[wChairID].szNickName)
            hnode.addChild(userName)   

            headNode.addChild(hnode)

            var dir = (wChairID-cmdBaseWorker.wBankerUser+GAME_PLAYER)%4
            var dirSpr = new cc.Sprite('#gendDir' + dir + '.png')
            dirSpr.x = 32-13
            dirSpr.y = 32-13
            hnode.addChild(dirSpr)   

            if(wChairID == cmdBaseWorker.wBankerUser)
            {
                var bankerSpr = new cc.Sprite('#gendIcon_banker.png')
                bankerSpr.x = -32
                bankerSpr.y = 32
                hnode.addChild(bankerSpr)   
            }


            //胡型
            var chrStr = ''
            for (var i = 0; i < map_mask2Name.length; i++) 
            {
                var chr_type = window[ map_mask2Name[i][0] ] 
                if (cmdBaseWorker.dwChiHuRight[wChairID] & chr_type)
                {
                    // if(chrStr == '')
                    //     chrStr += '胡型：'
                    chrStr += map_mask2Name[i][1] + ' ';
                }
            }
            resultTTF.setString(chrStr)

       
            //显示麻将
            
            //吃碰杠 牌
            var cardNode = new cc.Node()
            cardNode.width = 1200
            cardNode.height = 120

            var weaveItems = cmdBaseWorker.WeaveItemArray[wChairID]
            var weaveLen = 0
            for(var weaveIdx=0;weaveIdx<weaveItems.length;weaveIdx++)
            {
                var weaveItem = weaveItems[weaveIdx]
                if(weaveItem.cbWeaveKind == WIK_NULL)
                    continue
                weaveLen++
                weaveItem.wProvideUser = tableData.getServerChairIdWithShowChairId(0)//这样就不显示箭头了
                var majiangsOneWeave = majiangFactory.weaveItem2Majiangs(0, weaveIdx, weaveItem, true)

                for(var idxInWeave=0;idxInWeave<majiangsOneWeave.length;idxInWeave++)
                {
                    var mj = majiangsOneWeave[idxInWeave]
                    cardNode.addChild(mj)
                }
            }

            //手牌            
            var oldHandCardDatas = clone(cmdBaseWorker.cbHandCardData[wChairID])
            var newGetCardData = null

            if(oldHandCardDatas.length + weaveLen*3 == MAX_COUNT)
            {
                if( cmdBaseWorker.dwChiHuKind[wChairID] == WIK_CHI_HU
                && cmdBaseWorker.cbProvideCardData != INVALID_CARD_DATA )
                {
                    for(var j=0;j<oldHandCardDatas.length;j++)
                    {
                        if(oldHandCardDatas[j] == cmdBaseWorker.cbProvideCardData)
                        {
                            newGetCardData = oldHandCardDatas.splice(j, 1)[0]
                            break
                        }
                    }
                }
                else
                    newGetCardData = oldHandCardDatas.splice(oldHandCardDatas.length-1, 1)[0]
            }
            else if( cmdBaseWorker.dwChiHuKind[wChairID] == WIK_CHI_HU
                && cmdBaseWorker.cbProvideCardData != INVALID_CARD_DATA )
                newGetCardData = cmdBaseWorker.cbProvideCardData 


            var handCardDatasArray = [ [oldHandCardDatas, newGetCardData] ]
            var handMajiangs= majiangFactory.getHandMajiangsArray(handCardDatasArray, false, true)[0]
            for(var i=0;i<handMajiangs[0].length;i++)
            {
                cardNode.addChild(handMajiangs[0][i])
            }
            if(handMajiangs[1])
            {
                cardNode.addChild(handMajiangs[1])
                handMajiangs[1].color = cc.color(188, 255, 188)
            }
 
            cardNode.scaleX = handCardNode.width/cardNode.width
            cardNode.scaleY = handCardNode.height/cardNode.height
            cardNode.x = -4
            cardNode.y = 0
            handCardNode.addChild(cardNode)


            // //花牌
            var cardNode = new cc.Node()
            cardNode.width = 1200
            cardNode.height = 46

            var flowerCardDatas = cmdBaseWorker.cbPlayerFlowerCardData[wChairID]

            var flowerCardDatasArray = [ flowerCardDatas ]
            var flowerMajiangs= majiangFactory.getFlowerMajiangsArray(flowerCardDatasArray)[0]
            for(var i=0;i<flowerMajiangs.length;i++)
            {
                cardNode.addChild(flowerMajiangs[i])
            }
            cardNode.scaleX = flowerCardNode.width/cardNode.width
            cardNode.scaleY = flowerCardNode.height/cardNode.height
            cardNode.x = -68
            cardNode.y = -85
            flowerCardNode.addChild(cardNode)


            /////////
            if(wChairID==cmdBaseWorker.wExitUser)
                control['winflag'+wChairID].setSpriteFrame('gendFlag0.png') 
            else if(cmdBaseWorker.dwChiHuKind[wChairID] == WIK_CHI_HU)
                control['winflag'+wChairID].setSpriteFrame('gendFlag1.png') 
            else if(wChairID==cmdBaseWorker.wProvideUser)
                control['winflag'+wChairID].setSpriteFrame('gendFlag2.png') 
            else
                control['winflag'+wChairID].setSpriteFrame('empty.png') 

            var xi = cmdBaseWorker.cbXi[wChairID]
            var xiStr = ''
            if(xi[0])
                xiStr += '小喜x'+xi[0]+' '
            if(xi[1])
                xiStr += '大喜x'+xi[1]+' '
            
            control['xiTTF'+wChairID].setString(xiStr)

            control['taiTTF'+wChairID].setString((cmdBaseWorker.lGameScore[wChairID]>0?'+':'') + cmdBaseWorker.lGameScore[wChairID]) 
            control['fenTTF'+wChairID].setString((cmdBaseWorker.lGameScore[wChairID]>0?'+':'') + cmdBaseWorker.lGameScore[wChairID]) 

        }
       
        mainScene.top.addChild(node) 
    },
    // popGameEnd:function(continueCall, userData_gameEnd)
    // {

    //     var control = {}
    //     control.continueCall = function()
    //     {
    //         continueCall()
    //         node.removeFromParent()
    //     }
    //     var node  = managerRes.loadCCB(resp.gameEndPopCCB, control)

    //     playNode.gameEndControl = control

    //     control.gendTitle.setSpriteFrame('gendTitle'+cmdBaseWorker.endType + '.png')

    //     for(var showChairid=0;showChairid<4;showChairid++)
    //     {
    //         var direction = showChairid
    //         var wChairID = tableData.getServerChairIdWithShowChairId(showChairid)

    //         var gendBar = control['gendBar'+wChairID]

    //         //头像
    //         var headIcon = new cc.Sprite('#headIcon.png')
    //         var hnode = getRectNodeWithSpr(headIcon)
    //         hnode.x = 55
    //         hnode.y = 50
    //         var url = userData_gameEnd[wChairID].szHeadImageUrlPath
    //         if(url)
    //         { 
    //             (function(headIcon, url)
    //             {
    //                 cc.loader.loadImg(url, {isCrossOrigin : false}, function(err,img){
    //                         var texture2d = new cc.Texture2D()
    //                         texture2d.initWithElement(img)
    //                         texture2d.handleLoadedTexture()

    //                         var frame = new cc.SpriteFrame(texture2d, cc.rect(0, 0, texture2d.getContentSize().width, texture2d.getContentSize().height))
    //                         headIcon.setSpriteFrame(frame)
    //                 })
    //             }(headIcon, url))
    //         }

    //         var userName = getLabel(14, 90, 2)
    //         userName.setFontFillColor( cc.color(255, 255, 255, 255) )
    //         userName.x = 0
    //         userName.y = 52
    //         userName.setStringNew(userData_gameEnd[wChairID].szNickName)
    //         hnode.addChild(userName)   

    //         gendBar.addChild(hnode)

    //         var dir = (wChairID-cmdBaseWorker.wBankerUser+GAME_PLAYER)%4
    //         var dirSpr = new cc.Sprite('#gendDir' + dir + '.png')
    //         dirSpr.x = 32-13
    //         dirSpr.y = 32-13
    //         hnode.addChild(dirSpr)   

    //         if(wChairID == cmdBaseWorker.wBankerUser)
    //         {
    //             var bankerSpr = new cc.Sprite('#gendIcon_banker.png')
    //             bankerSpr.x = -32
    //             bankerSpr.y = 32
    //             hnode.addChild(bankerSpr)   
    //         }


    //         //胡型
    //         var resultTTF = cc.LabelTTF.create('', "Helvetica", 16)
    //         resultTTF.setFontFillColor( cc.color(244, 230, 159) )
    //         var chrStr = ''
    //         for (var i = 0; i < map_mask2Name.length; i++) 
    //         {
    //             var chr_type = window[ map_mask2Name[i][0] ] 
    //             if (cmdBaseWorker.dwChiHuRight[wChairID] & chr_type)
    //             {
    //                 // if(chrStr == '')
    //                 //     chrStr += '胡型：'
    //                 chrStr += map_mask2Name[i][1] + ' ';
    //             }
    //         }
    //         resultTTF.setString(chrStr)
    //         resultTTF.anchorX = 0
    //         resultTTF.x = 102
    //         resultTTF.y = 15
    //         gendBar.addChild(resultTTF, 2)
       


    //         //显示麻将
    //         var majiangsNode = new cc.Node()
    //         majiangsNode.scale = 0.65
    //         majiangsNode.x = 100
    //         majiangsNode.y = gendBar.height - 12 - 0.5*(majiangFactory.down_handHeight*majiangFactory.scale_upDown*majiangsNode.scale)
    //         gendBar.addChild(majiangsNode)

    //         //吃碰杠的牌
    //         var weaveItems = cmdBaseWorker.WeaveItemArray[wChairID]

    //         var groupLen = 0 
    //         for(var groupIdx=0;groupIdx<weaveItems.length;groupIdx++)
    //         {
    //             var weaveItem = weaveItems[groupIdx]
    //             if(weaveItem.cbWeaveKind == WIK_NULL)
    //                 continue
    //             groupLen += 1
    //             // if(weaveItem.cbWeaveKind!=WIK_GANG)
    //             //     weaveItem.cbValidCardDatas = weaveItem.cbValidCardDatas.slice(0, 3)

    //             weaveItem.wProvideUser = tableData.getServerChairIdWithShowChairId(0)//这样就不显示箭头了
    //             var majiangsOneGroup = majiangFactory.weaveItem2Majiangs(0, groupIdx, weaveItem, true)
                
    //             for(var idxInGroup=0;idxInGroup<majiangsOneGroup.length;idxInGroup++)
    //             {
    //                 var mj = majiangsOneGroup[idxInGroup]
    //                 majiangsNode.addChild(mj)
    //             }
    //         }
    //         var widthOneGroup = majiangFactory.scale_upDown*majiangFactory.downHandIntervalX*3
    //         var startPos = groupLen*widthOneGroup
    //         //手牌
    //         var handCardDatas = cmdBaseWorker.cbHandCardData[wChairID]
    //         var hasLightProvideMj = false
    //         for(var j=0;j<handCardDatas.length;j++)
    //         {
    //             var cardData = handCardDatas[j]
    //             var where = {}
    //             where.name = 'hand'
    //             where.data = {idx:0}
    //             var majiang = majiangFactory.getOne(cardData, wChairID, where)
    //             majiang.idxInHandMajiangs = j
    //             var pos = playNode.getDisplayHandMajiangPosAndTag(handCardDatas.length, majiang.idxInHandMajiangs, 0, false)
    //             majiang.x = startPos + pos.x
    //             majiang.y = 0//pos.y
    //             majiang.setScale(pos.scale)
    //             // majiang.setLocalZOrder(pos.zOrder)

    //             majiangsNode.addChild(majiang)

    //             if(!hasLightProvideMj && cmdBaseWorker.dwChiHuKind[wChairID] == WIK_CHI_HU && majiang.cardData == cmdBaseWorker.cbProvideCardData)
    //             {
    //                 majiang.color = cc.color(188, 255, 188)
    //                 hasLightProvideMj = true 
    //             }
    //         }

    //         ///花牌
    //         var flowersNode = new cc.Node()
    //         flowersNode.scale = 0.7
    //         flowersNode.x = 100
    //         flowersNode.y = gendBar.height - 12 - 0.5*(majiangFactory.down_handHeight*majiangFactory.scale_upDown*majiangsNode.scale)
    //         gendBar.addChild(flowersNode)

    //         var flowerCardDatas = cmdBaseWorker.cbPlayerFlowerCardData[wChairID]
    //         for(var j=0;j<flowerCardDatas.length;j++)
    //         {
    //             var cardData = flowerCardDatas[j]
    //             var where = {}
    //             where.name = 'flower'
    //             where.data = {idx:0}

    //             var majiang = majiangFactory.getOne(cardData, wChairID, where)
    //             var pos = majiangFactory.getFlowerMajiangPosAndTag(j, 0)
    //             majiang.x = pos.x
    //             majiang.y = 5-0.5*(majiangFactory.down_handHeight*majiangFactory.scale_upDown*majiangsNode.scale)-0.5*majiang.height*majiang.scale
    //             // majiang.setLocalZOrder(pos.zOrder)
    //             flowersNode.addChild(majiang)
    //         }


    //         ///////////
    //         if(wChairID==cmdBaseWorker.wExitUser)
    //             control['winflag'+wChairID].setSpriteFrame('gendFlag0.png') 
    //         else if(cmdBaseWorker.dwChiHuKind[wChairID] == WIK_CHI_HU)
    //             control['winflag'+wChairID].setSpriteFrame('gendFlag1.png') 
    //         else if(wChairID==cmdBaseWorker.wProvideUser)
    //             control['winflag'+wChairID].setSpriteFrame('gendFlag2.png') 
    //         else
    //             control['winflag'+wChairID].setSpriteFrame('empty.png') 
  

    //         var xi = cmdBaseWorker.cbXi[wChairID]
    //         var xiStr = ''
    //         if(xi[0])
    //             xiStr += '小喜x'+xi[0]+' '
    //         if(xi[1])
    //             xiStr += '大喜x'+xi[1]+' '
            
    //         control['xiTTF'+wChairID].setString(xiStr)
    //         control['taiTTF'+wChairID].setString((cmdBaseWorker.lGameTaiCount[wChairID]>0?'+':'') + cmdBaseWorker.lGameTaiCount[wChairID]) 
    //         control['fenTTF'+wChairID].setString((cmdBaseWorker.lGameScore[wChairID]>0?'+':'') + cmdBaseWorker.lGameScore[wChairID]) 

    //     }
       
    //     mainScene.top.addChild(node) 
    // },
    ///gameend end////


    /////other ui start////////
    showGameset:function()
    {
        var isBanker = tableData.getUserWithUserId(selfdwUserID).wChairID == cmdBaseWorker.wBankerUser
        playNode.jiadingBtn1.setEnabled(!isBanker)
        playNode.jiadingBtn2.setEnabled(!isBanker)

        playNode.gamesetTTF1.setString('0')
        playNode.gamesetTTF2.setString('0')

        playNode.gamesetNode.setVisible(true)
    },
    hideCurrentDiscardMj:function()
    {
        playNode.currentDiscardMjNode.x = -1000
    },
    setCurrentDiscardMj:function(discardMajiangs4D, direction)
    {
        var discardMajiangs = discardMajiangs4D[direction]
        if(discardMajiangs.length == 0) 
            return;
        
        var discardMajiang = discardMajiangs[discardMajiangs.length-1]
        var cardData = discardMajiang.cardData

        var self = tableData.getUserWithUserId(selfdwUserID)
        var d = tableData.getShowChairIdWithServerChairId(self.wChairID)
        if(d == direction)
        {
            playNode.hideCurrentDiscardMj()
            return
        }

        playNode.currentDiscardMjNode.setVisible(true)
        var mj = playNode.currentDiscardMjNode.getChildByTag(101)
        mj.getChildByTag(101).setSpriteFrame('mf_' + cardData + '.png') 

        switch(direction)
        {
            case 0://down
            {
                playNode.currentDiscardMjNode.x = 600
                playNode.currentDiscardMjNode.y = 200
                break
            }
            case 1://right
            {
                playNode.currentDiscardMjNode.x = 1050
                playNode.currentDiscardMjNode.y = 480
                break
            }
            case 2://up
            {
                playNode.currentDiscardMjNode.x = 600
                playNode.currentDiscardMjNode.y = 630
                break
            }
            case 3://left
            {
                playNode.currentDiscardMjNode.x = 150
                playNode.currentDiscardMjNode.y = 480
                break
            }
        }  
    },
    showLaizi:function()
    {
        for(var i=0;i<TURNOVER_COUNT_MAGIC;i++)
        {
            var cardData = cmdBaseWorker.cbMagicCardData[i] //cmdBaseWorker.TurnoverCard[i].cbCardData
            if(cardData == 0)
                continue
            var bg = new cc.Sprite('#bg_top.png')
            bg.x = 50*i + 25
            bg.y = - 30
           


            var where = {}
            where.name = 'weave'
            where.data = {weaveIdx:0, idxInWeave:0}
            var mj = majiangFactory.getOne(cardData, 0, where)
            mj.isIgnoreDecorate = true
            mj.x = 50*i + 25
            mj.y = -30
            mj.scaleX = (bg.width-5)/mj.width
            mj.scaleY = (bg.height-5)/mj.height

            playNode.laiziNode.addChild(bg)
            playNode.laiziNode.addChild(mj)
        }


        // var majiang = majiangFactory.getOne(0, 3, 0)
        // majiang.x = majiangFactory.downHeapIntervalX*majiangFactory.scale_heap*0.5 + 2
        // majiang.y = -90
        // playNode.laiziNode.addChild(majiang)
        // var majiang = majiangFactory.getOne(0, 3, 0)
        // majiang.x = majiangFactory.downHeapIntervalX*majiangFactory.scale_heap*1.5 + 2
        // majiang.y = -90
        // playNode.laiziNode.addChild(majiang)
        // var majiang = majiangFactory.getOne(0, 3, 0)
        // majiang.x = majiangFactory.downHeapIntervalX*majiangFactory.scale_heap*2.5 + 2
        // majiang.y = -90
        // playNode.laiziNode.addChild(majiang)


        // var majiang = majiangFactory.getOne(cmdBaseWorker.TurnoverCard[0].cbCardData, 3, 0)
        // majiang.x = majiangFactory.downHeapIntervalX*majiangFactory.scale_heap*0.5 + 2
        // majiang.y = -90 + majiangFactory.downHeapOffset*majiangFactory.scale_heap 
        // playNode.laiziNode.addChild(majiang)
        // var majiang = majiangFactory.getOne(0, 3, 0)
        // majiang.x = majiangFactory.downHeapIntervalX*majiangFactory.scale_heap*1.5 + 2
        // majiang.y = -90 + majiangFactory.downHeapOffset*majiangFactory.scale_heap 
        // playNode.laiziNode.addChild(majiang)
        // var majiang = majiangFactory.getOne(0, 3, 0)
        // majiang.x = majiangFactory.downHeapIntervalX*majiangFactory.scale_heap*2.5 + 2
        // majiang.y = -90 + majiangFactory.downHeapOffset*majiangFactory.scale_heap 
        // playNode.laiziNode.addChild(majiang)
    },
    hideLaizi:function()
    {
        playNode.laiziNode.removeAllChildren()
    },
    playAction:function(WIK, user)
    {
        console.log(99999, WIK, gameLogic.wik2Name(WIK))
        playNode.playActionEffect(WIK, user.cbGender)
        if( WIK & (WIK_LEFT|WIK_CENTER|WIK_RIGHT|WIK_PENG|WIK_GANG|WIK_XIAOXI) )
        {
            managerAudio.playEffect('gameRes/sound/weave.mp3')
        }

        playNode.playAnimationWithDirection(gameLogic.wik2Name(WIK), tableData.getShowChairIdWithServerChairId(user.wChairID))
    },
    hideActionBtns:function()
    {
        playNode.chooseItemsNode.removeAllChildren() 
        playNode.btn_guo.setVisible(false)
        playNode.btn_chi.setVisible(false)
        playNode.btn_peng.setVisible(false)
        playNode.btn_gang.setVisible(false)
        playNode.btn_ting.setVisible(false)
        playNode.btn_hu.setVisible(false)

        if(playNode.isInChooseTingCardTime)
        {
            var event = new cc.EventCustom("cancleTing")
            cc.eventManager.dispatchEvent(event)  
            playNode.isInChooseTingCardTime = false
        }
    },
    showActionBtns:function(sortedActions)
    {
        for(var i=sortedActions.length-1;i>=0;i--)
        {
            if(sortedActions[i] == WIK_REPLACE)
            {
                var self = tableData.getUserWithUserId(selfdwUserID)
                var selfDir = tableData.getShowChairIdWithServerChairId(self.wChairID)
                var handMajiangs = playNode.handMajiangs4D[selfDir]

                var handCardDatas = handMajiangs[1]?[handMajiangs[1].cardData]:[]
                for(var j=0;j<handMajiangs[0].length;j++)
                {
                    handCardDatas[handCardDatas.length] = handMajiangs[0][j].cardData
                }
                gameLogic.sortWithCardData(handCardDatas)

                var operateCards = []
                for(var j=0;j<handCardDatas.length;j++)
                {
                    if(cmdBaseWorker.isFlowerCard(handCardDatas[j], cmdBaseWorker.cbFlowerCardData))
                        operateCards[operateCards.length] = handCardDatas[j]

                } 
                cmdBaseWorker.sendMessage_replace(operateCards)
                return;
            }
        }

        playNode.btn_guo.setVisible(true)
        for(var i=sortedActions.length-1;i>=0;i--)
        {   
            var btn = null
            var action = sortedActions[i]
            if(action == WIK_CHI_HU)
                btn = playNode.btn_hu
            else if(action == WIK_LISTEN)
            {
                btn = playNode.btn_ting
                playNode.isInChooseTingCardTime = false
                btn.setSpriteFrame("btn_ting.png") 
            }
            else if(action == WIK_GANG)
            {
                btn = playNode.btn_gang
                //暗杠碰杠算小喜
                // if(tableData.getUserWithUserId(selfdwUserID).wChairID == cmdBaseWorker.wProvideUser)
                //     btn.setSpriteFrame("btn_xiaoxi.png")
                // else
                    btn.setSpriteFrame("btn_gang.png")
            }
            else if(action == WIK_PENG)
                btn = playNode.btn_peng
            else if(action == WIK_LEFT || action == WIK_CENTER || action == WIK_RIGHT)
            {
                btn = playNode.btn_chi
                btn.actions = sortedActions.slice(0, i+1)
            }

            btn.setVisible(true)
            btn.setPositionX(-110 * (sortedActions.length-1-i +1))
            if(btn==playNode.btn_chi)
                break
        }
    },
    playAnimationOfGameEnd:function(call)
    {
        if(cmdBaseWorker.endType == 0)
            call()
        else if(cmdBaseWorker.endType == 1)
        {
            var spr = actionFactory.getSprWithAnimate('lj', true, 0.15, call)
            playNode.mjsNode.addChild(spr)
            spr.x = playNode.mjsNode.width*0.5
            spr.y = playNode.mjsNode.height*0.5
        }
        else if(cmdBaseWorker.endType == 2)
        {
            playNode.playAnimationWithDirection('zim', tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wProvideUser), call)
            playNode.playGenderEffect('zimo0', tableData.getUserWithChairId(cmdBaseWorker.wProvideUser).cbGender)
        }
        else if(cmdBaseWorker.endType == 3)
        {
            playNode.playAnimationWithDirection('dp', tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wProvideUser))

            var hasCall = false
            for(var i=0;i<GAME_PLAYER;i++)
            {
                if(cmdBaseWorker.dwChiHuKind[i] == WIK_CHI_HU)
                {
                    if(!hasCall)
                        hasCall = true
                    else
                        call = null
                    playNode.playAnimationWithDirection('hu', tableData.getShowChairIdWithServerChairId(i), call)
                    playNode.playActionEffect(WIK_CHI_HU, tableData.getUserWithChairId(i).cbGender)
                }
            }
        }
    },
    showChoosePopOfAction:function(cardDatasArray, actionArray, actionCall)
    {
        var len = actionArray.length
        for(var i=0;i<len;i++)
        {
            var cardDatas = cardDatasArray[i]
            var chooseItem = playNode._getChooseItemOfAction(cardDatas, actionArray[i], actionCall)

            chooseItem.x = ( i - (len-1)/2 ) * (62*3 + 30)
            chooseItem.y = 0
            playNode.chooseItemsNode.addChild(chooseItem)
        }
    },
    _getChooseItemOfAction:function(sortedOperateCardDatas, action, actionCall)
    {        
        var chooseItem = new cc.Node()
        // var provideCardData = cardDatas[0]
        ////////////////////////////
        var showLen = sortedOperateCardDatas.length
        if(action == WIK_GANG)
            showLen = 1
        for(var i=0;i<showLen;i++)
        {
            var where = {}
            where.name = 'hand'
            where.data = {idx:0}
            var mj = majiangFactory.getOne(sortedOperateCardDatas[i], 0, where)
            mj.isIgnoreDecorate = true
            mj.setScale(62/84)
            mj.x = ( i - (showLen-1)/2 )*62
            mj.y = 0
            if( (action == WIK_LEFT && i==0) || (action == WIK_CENTER && i==1) || (action == WIK_RIGHT && i==2) )
            {
                // provideCardData = i
                mj.color = cc.color(122, 122, 122)
            }

            chooseItem.addChild(mj)
        }

        ////////////////////////////
        var bg = new cc.Scale9Sprite('mf_chooseItemBg.png')
        bg.width = 196
        bg.height = 90
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
                    playNode.chooseItemsNode.removeAllChildren()
                    actionCall?actionCall(sortedOperateCardDatas, action):''
                }
            }
        })
        cc.eventManager.addListener(listener, bg)

        return chooseItem
    },
    /////other ui end////////
    
    getSoundName:function(cardData) 
    {
        return cardData
    },
    getActionSoundName:function(name, num) 
    { 
        num = num || 1
        return name + (Math.ceil(Math.random()*10))%num        
    },
    playMajiangEffect:function(cardData, isMan)
    {
        var name = playNode.getSoundName(cardData)
        playNode.playGenderEffect(name, isMan)
    },
    playActionEffect:function(WIK, isMan)
    {
        var name = playNode.getActionSoundName(gameLogic.wik2Name(WIK))

        playNode.playGenderEffect(name, isMan)
    },
    playGenderEffect:function(name, isMan)
    {
        var resPrefix = 'gameRes/sound/' + (isOpenPTH?'pth':'fy')
        
        if(isMan)
            managerAudio.playEffect(resPrefix + '/man/' + name + '.mp3')
        else
            managerAudio.playEffect(resPrefix + '/woman/' + name + '.mp3') 
    },
    getActionPlayNodePos:function(direction,name)
    {
        var pos = {}
        pos.z = playNode.mjsNode.zOrder + 1

        //83 × 55
        switch(direction)
        {
            case 0://down
            {
                pos.x = 600
                pos.y = 200
                break
            }
            case 1://right
            {
                pos.x = 1050 
                pos.y = 480 
                break
            }
            case 2://up
            {
                pos.x = 600
                pos.y = 680  
                break
            }
            case 3://left
            {
                pos.x = 150//150 
                pos.y = 480//480 
                break
            }
        }  
        return pos
    },
    playAnimationWithDirection:function(name, direction, call)
    {
        if(!isOpenEffect)
        {
            call?call():''
            return; 
        }

        var spr = actionFactory.getSprWithAnimate(name + '_', true, 0.15, call)
        

        var pos = playNode.getActionPlayNodePos(direction,name)
        spr.x = pos.x
        spr.y = pos.y
        playNode.mjsNode.addChild(spr,pos.z) 
    },
    playDiceForRandBanker:function(call, bankerDirection)
    {   
        var numBigger =  getRandNum(6, 12) 
        var numSmaller = getRandNum(5, numBigger-1) 
        var endNum1_banker =  getRandNum(Math.max(1, numBigger-6) , Math.min(6, numBigger-1))
        var endNum2_banker = numBigger - endNum1_banker

        function getEndNums(direction)
        {
            if(direction == bankerDirection)
                return [endNum1_banker, endNum2_banker]
            else
            {
                var endNum1_ubanker = getRandNum(Math.max(1, numSmaller-6), Math.min(6, numSmaller-1))
                var endNum2_ubanker = numSmaller - endNum1_ubanker  
                return [endNum1_ubanker, endNum2_ubanker]
            }
        }

        function playDice(direction)
        {
            var nums = getEndNums(direction)
            if(direction == 3)
                playNode.playDiceOneDirection(call, nums[0], nums[1], direction)
            else
                playNode.playDiceOneDirection(function()
                    {
                        playDice(direction+1)
                    }, nums[0], nums[1], direction)
        }

        playDice(0)
    },
    playDiceOneDirection:function(call, endNum1, endNum2, direction)
    {
        var w = playNode.mjsNode.width
        var h = playNode.mjsNode.height

        var sign = direction%2==0?1:-1

        var beginHOffset = 120*sign
        var sprPosY = direction%2==0?0+beginHOffset:h+beginHOffset


        var controlPoints1 = [
        cc.p(0.1*w, sprPosY+0.1*h*sign),
        cc.p(0.9*w, sprPosY+0.3*h*sign),
        cc.p(0.55*w, sprPosY+0.45*h*sign),
        ]
        var controlPoints2 = [
        cc.p(0.9*w, sprPosY+0.15*h*sign),
        cc.p(0.1*w, sprPosY+0.3*h*sign),
        cc.p(0.45*w, sprPosY+0.4*h*sign),
        ]


        var chairNode = tableNode['chairNode'+direction] 

        var diceSpr1 = dice.getThrowedDiceSpr(controlPoints1, endNum1, 1.2, function()
        {
            call?call():''
        }) 
        diceSpr1.x = chairNode.x
        diceSpr1.y = chairNode.y
        
        var diceSpr2 = dice.getThrowedDiceSpr(controlPoints2, endNum2, 1.2) 
        diceSpr2.x = chairNode.x
        diceSpr2.y = chairNode.y

        playNode.mjsNode.addChild(diceSpr1)
        playNode.mjsNode.addChild(diceSpr2)

        managerAudio.playEffect('gameRes/sound/dice.mp3') 
    },
    resetPlayNode:function()
    {
        playNode._removeSprsOnGameEnd()
        playNode.hideLaizi()
        playNode.tingHuCardNode.setVisible(false)

        for(var i=0;i<GAME_PLAYER;i++)
        {
            tableNode.setBankerIcon(i, false)
        }
    },

/////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
    //处理吃碰杠 
    onActionResult:function(action, operateWeaveIdx, operateWeaveItem, operateUserChairId, provideUserChairId, provideCardData)
    {
        if(action==WIK_GANG)
            playNode.onActionGang(operateWeaveIdx, operateWeaveItem, operateUserChairId, provideUserChairId, provideCardData)
        else if(action == WIK_PENG)
            playNode.onActionPeng(operateWeaveIdx, operateWeaveItem, operateUserChairId, provideUserChairId, provideCardData)
        else if(action == WIK_LEFT)
            playNode.onActionChi(operateWeaveIdx, operateWeaveItem, operateUserChairId, provideUserChairId, provideCardData)
        else if(action == WIK_CENTER)
            playNode.onActionChi(operateWeaveIdx, operateWeaveItem, operateUserChairId, provideUserChairId, provideCardData)
        else if(action == WIK_RIGHT)
            playNode.onActionChi(operateWeaveIdx, operateWeaveItem, operateUserChairId, provideUserChairId, provideCardData)
    },
    onActionPeng:function(operateWeaveIdx, operateWeaveItem, operateUserChairId, provideUserChairId, provideCardData)
    {        
        var operateDir = tableData.getShowChairIdWithServerChairId(operateUserChairId)
        var operateUser = tableData.getUserWithChairId(operateUserChairId)

        var provideDir = tableData.getShowChairIdWithServerChairId(provideUserChairId)
        var provideUser = tableData.getUserWithChairId(provideUserChairId)

        var operateHandMajiangs = playNode.handMajiangs4D[operateDir]


        majiangFactory.popDiscardMajiangs(playNode.discardMajiangs4D[provideDir])

        var addHandCardData = operateUser.dwUserID == selfdwUserID?provideCardData:0
        majiangFactory.addHandMajiang(operateHandMajiangs, operateDir, 
            addHandCardData, playNode.mjsNode, playNode.weaveMajiangs4D[operateDir].length)

        for(var i=0;i<3;i++)
        {
            var deleteCardData = operateUser.dwUserID == selfdwUserID?operateWeaveItem.cbValidCardDatas[i]:0
            majiangFactory.deleteHandMajiangs(operateHandMajiangs, 
                operateDir, deleteCardData)
        }
        var oldMajiangs = operateHandMajiangs[0]
        var maxRightCardData = oldMajiangs[oldMajiangs.length-1].cardData
        majiangFactory.deleteHandMajiangs(operateHandMajiangs, 
                operateDir, maxRightCardData)
        majiangFactory.addHandMajiangNew(operateHandMajiangs, operateDir, maxRightCardData, playNode.mjsNode)


        majiangFactory.updateWeaveMajiangs(playNode.weaveMajiangs4D[operateDir], operateDir, operateWeaveIdx, 
            operateWeaveItem, playNode.mjsNode)
    },
    onActionGang:function(operateWeaveIdx, operateWeaveItem, operateUserChairId, provideUserChairId, provideCardData)
    {
        var operateDir = tableData.getShowChairIdWithServerChairId(operateUserChairId)
        var operateUser = tableData.getUserWithChairId(operateUserChairId)

        var provideDir = tableData.getShowChairIdWithServerChairId(provideUserChairId)
        var provideUser = tableData.getUserWithChairId(provideUserChairId)

        var operateHandMajiangs = playNode.handMajiangs4D[operateDir]


        if(operateWeaveItem.cbWeaveKindType == 1)//明杠1 
        {
            majiangFactory.popDiscardMajiangs(playNode.discardMajiangs4D[provideDir])

            var addHandCardData = operateUser.dwUserID == selfdwUserID?provideCardData:0
            majiangFactory.addHandMajiang(operateHandMajiangs, operateDir, 
                addHandCardData, playNode.mjsNode, playNode.weaveMajiangs4D[operateDir].length)

            for(var i=0;i<4;i++)
            {
                var deleteCardData = operateUser.dwUserID == selfdwUserID?operateWeaveItem.cbValidCardDatas[i]:0
                majiangFactory.deleteHandMajiangs(operateHandMajiangs, 
                    operateDir, deleteCardData)
            }


            majiangFactory.updateWeaveMajiangs(playNode.weaveMajiangs4D[operateDir], operateDir, operateWeaveIdx, 
                operateWeaveItem, playNode.mjsNode)
        }
        else if(operateWeaveItem.cbWeaveKindType == 2)//暗杠2
        {
            for(var i=0;i<4;i++)
            {
                var deleteCardData = operateUser.dwUserID == selfdwUserID?operateWeaveItem.cbValidCardDatas[i]:0
                majiangFactory.deleteHandMajiangs(operateHandMajiangs, 
                    operateDir, deleteCardData)
            }

            majiangFactory.updateWeaveMajiangs(playNode.weaveMajiangs4D[operateDir], operateDir, operateWeaveIdx, 
                operateWeaveItem, playNode.mjsNode)
        }
        else if(operateWeaveItem.cbWeaveKindType == 3)//碰杠3
        {
            for(var i=0;i<1;i++)
            {
                var deleteCardData = operateUser.dwUserID == selfdwUserID?operateWeaveItem.cbValidCardDatas[i]:0
                majiangFactory.deleteHandMajiangs(operateHandMajiangs, 
                    operateDir, deleteCardData)
            }
            majiangFactory.updateWeaveMajiangs(playNode.weaveMajiangs4D[operateDir], operateDir, operateWeaveIdx, 
                operateWeaveItem, playNode.mjsNode)
        }
    },
    onActionChi:function(operateWeaveIdx, operateWeaveItem, operateUserChairId, provideUserChairId, provideCardData)
    {        
        var operateDir = tableData.getShowChairIdWithServerChairId(operateUserChairId)
        var operateUser = tableData.getUserWithChairId(operateUserChairId)

        var provideDir = tableData.getShowChairIdWithServerChairId(provideUserChairId)
        var provideUser = tableData.getUserWithChairId(provideUserChairId)

        var operateHandMajiangs = playNode.handMajiangs4D[operateDir]

        majiangFactory.popDiscardMajiangs(playNode.discardMajiangs4D[provideDir])

        var addHandCardData = operateUser.dwUserID == selfdwUserID?provideCardData:0
        majiangFactory.addHandMajiang(operateHandMajiangs, operateDir, 
            addHandCardData, playNode.mjsNode, playNode.weaveMajiangs4D[operateDir].length)

        for(var i=0;i<3;i++)
        {
            var deleteCardData = operateUser.dwUserID == selfdwUserID?operateWeaveItem.cbValidCardDatas[i]:0
            majiangFactory.deleteHandMajiangs(operateHandMajiangs, 
                operateDir, deleteCardData)
        }

        var oldMajiangs = operateHandMajiangs[0]
        var maxRightCardData = oldMajiangs[oldMajiangs.length-1].cardData
        majiangFactory.deleteHandMajiangs(operateHandMajiangs, 
                operateDir, maxRightCardData)
        majiangFactory.addHandMajiangNew(operateHandMajiangs, operateDir, maxRightCardData, playNode.mjsNode)

        majiangFactory.updateWeaveMajiangs(playNode.weaveMajiangs4D[operateDir], operateDir, operateWeaveIdx, 
            operateWeaveItem, playNode.mjsNode)
    },

    //检测手牌是否全变不可出状态 有的麻将规则存在漏洞
    //onCMD_StatusPlay onCMD_SendCard onCMD_OperateResult
    checkHandCardTouch:function(direction)
    {
        var handMajiangs = playNode.handMajiangs4D[direction]
        var isAllUnTouch = true

        if(handMajiangs[1] && handMajiangs[1].touchEnable)
            isAllUnTouch = false
        else
        {
           for(var i=0;i<handMajiangs[0].length;i++)
           {
                if(handMajiangs[0][i].touchEnable)
                {
                    isAllUnTouch = false
                    break
                }
           }
        }

        if(isAllUnTouch)
        {
            mj = handMajiangs[1]?handMajiangs[1]:handMajiangs[0][0]
            mj.touchEnable = true
            mj.color = cc.color(255, 255, 255)      
        }
    },
    weaveItem2Majiangs:function(operateDirection, weaveIdx, weaveItem, isPublicAnGang)
    {
        var cbValidCardDatas = weaveItem.cbValidCardDatas
        var wProvideUser = weaveItem.wProvideUser
        var provideShowChairId = tableData.getShowChairIdWithServerChairId(wProvideUser)
        var provideDirection = majiangFactory.showChairId2Direction(provideShowChairId)

        var operateUser = tableData.getServerChairIdWithShowChairId(operateDirection)

        var arrowIdx = -1
        if(provideDirection!=operateDirection)
        {
            if(weaveItem.cbWeaveKind == WIK_LEFT)
                arrowIdx = 0
            else if(weaveItem.cbWeaveKind == WIK_CENTER)
                arrowIdx = 1
            else if(weaveItem.cbWeaveKind == WIK_RIGHT)
                arrowIdx = 2      
            else if(weaveItem.cbWeaveKind == WIK_PENG)
                arrowIdx = 1    
            else if(weaveItem.cbWeaveKind == WIK_GANG)
                arrowIdx = 3   
        }
 
        var majiangs = []
        for(var i=0;i<cbValidCardDatas.length;i++)
        {
            var cardData = cbValidCardDatas[i]
            if(weaveItem.cbWeaveKind==WIK_GANG && weaveItem.cbWeaveKindType == 2)
            {
                if( cardData != cmdBaseWorker.TurnoverCard[0].cbCardData )
                {
                    if(i<3)
                        cardData = 0
                    else if( tableData.getUserWithUserId(selfdwUserID).wChairID!=operateUser && !isPublicAnGang)
                        cardData = 0
                }
                else
                {
                    if(i==3)
                        continue
                }
            }

            var where = {}
            where.name = 'weave'
            where.data = {weaveIdx:weaveIdx, idxInWeave:i}
            var mj = majiangFactory.getOne(cardData, operateDirection, where)

            if(i == arrowIdx)
            {
                var zi = mj.getChildByTag(101)
                var directionSpr = new cc.Sprite('#mf_weaveDirection.png')
                directionSpr.setRotation(180-provideDirection*90 - zi.getRotation())


                directionSpr.x = zi.width*0.5
                directionSpr.y = 10
                directionSpr.scale = operateDirection==0?1:1.4
                zi.addChild(directionSpr, 0, 101)
            }


            if(weaveItem.cbWeaveKind==WIK_GANG && weaveItem.cbWeaveKindType == 2)
            {
                if( (cardData != cmdBaseWorker.TurnoverCard[0].cbCardData && i==3)
                    || (cardData == cmdBaseWorker.TurnoverCard[0].cbCardData && i==1) 
                    )
                {
                    var zi = mj.getChildByTag(101)
                    var iconXiaoxi = new cc.Sprite('#weaveIcon_xiaoxi.png')
                    // iconXiaoxi.setRotation(180-provideDirection*90 - zi.getRotation())

                    iconXiaoxi.x = zi.width*0.5
                    iconXiaoxi.y = zi.height*0.5
                    zi.addChild(iconXiaoxi, 0, 101)
                }
            }

            majiangs[majiangs.length] = mj
        }  
        majiangs.weaveItem = weaveItem

        return majiangs
    },
    getHandCardDatas:function(handMajiangs)
    {
        var handCardDatas = handMajiangs[1]?[handMajiangs[1].cardData]:[]
        for(var i=0;i<handMajiangs[0].length;i++)
        {
            handCardDatas[handCardDatas.length] = handMajiangs[0][i].cardData
        }

        return handCardDatas
    },
    getDiscardCardDatas:function(discardMajiangs4D)
    {
        var discardCardDatas = []

        for(var i=0;i<GAME_PLAYER;i++)
        {
            var discardMajiangs = discardMajiangs4D[i]
            for(var j=0;j<discardMajiangs.length;j++)
            {
                discardCardDatas[discardCardDatas.length] = discardMajiangs[j].cardData
            }
        }

        return discardCardDatas
    },
    getWeaveCardDatas:function(cbWeaveCount4D, WeaveItemArray4D)
    {
        var weaveCardDatas = []

        for(var i=0;i<GAME_PLAYER;i++)
        {
            var weaveCount = cbWeaveCount4D[i]
            var weaveItems = WeaveItemArray4D[i] 
            for(var j=0;j<weaveCount;j++)
            {
                weaveCardDatas = weaveCardDatas.concat(weaveItems[j].cbValidCardDatas)
            }
        }

        return weaveCardDatas
    }

}
