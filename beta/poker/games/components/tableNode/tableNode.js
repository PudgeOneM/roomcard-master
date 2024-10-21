
var tableNode = 
{   
    _chairArray:[],
    resp:'components/tableNode/res/',
    getPreLoadRes:function()
    {
        var resp = tableNode.resp
        var styleId = styleArray[1]

        return[
            resp + 'tableNode.plist', 
            resp + 'tableNode.png',
            resp + (gameKind.indexOf("25D")>=0?'25D_':'') + 's' + styleId + '_bg.jpg'
        ]
    },
    onPreLoadRes:function()
    {   
        var resp = tableNode.resp
        cc.spriteFrameCache.addSpriteFrames(resp + 'tableNode.plist', resp + 'tableNode.png')

        var styleId = styleArray[1]

        var t = new cc.SpriteFrame(resp + (gameKind.indexOf("25D")>=0?'25D_':'') + 's' + styleId + '_bg.jpg', cc.rect(0, 0, 1200, 1000))
        cc.spriteFrameCache.addSpriteFrame(t, 's' + styleId + '_bg.jpg')

        //资源异步加载
        var styleIdLast = []
        for(var i=0;i<2;i++)
        {   
            if(i==styleId) continue
            styleIdLast[styleIdLast.length] = i
        }

        var res = []
        for(var i=0;i<styleIdLast.length;i++)
        {
            res[i] = resp + (gameKind.indexOf("25D")>=0?'25D_':'') + 's' + styleIdLast[i] + '_bg.jpg'
        }
        cc.loader.load(res,
           function (result, count, loadedCount) 
           {}, 
           function() 
           {    
                for(var i=0;i<styleIdLast.length;i++)
                {
                    var t = new cc.SpriteFrame(resp + (gameKind.indexOf("25D")>=0?'25D_':'') + 's' + styleIdLast[i] + '_bg.jpg', cc.rect(0, 0, 1200, 1000))
                    cc.spriteFrameCache.addSpriteFrame(t, 's' + styleIdLast[i] + '_bg.jpg')
                } 
           })
    },
    onReStart:function()
    {
    },
    init:function(tableCCB)
    {	
        var resp = tableNode.resp

        var node = managerRes.loadCCB(tableCCB, tableNode)
        // adjustAfterLoad?adjustAfterLoad():''
        tableNode.animationManager = node.animationManager
        tableNode.node  = node
        //style
        var styleId = styleArray[1]
        tableNode.bgSpr = new cc.Sprite( '#s' + styleId + '_bg.jpg' )
        tableNode.bgSpr.x = node.width*0.5
        tableNode.bgSpr.y = 0
        tableNode.bgSpr.anchorX = 0.5
        tableNode.bgSpr.anchorY = 0

        tableNode.node.addChild(tableNode.bgSpr, -1)

        // tableNode.bgSpr.setScaleX(tableNode.node.width/tableNode.bgSpr.width)
        // tableNode.bgSpr.setScaleY(tableNode.node.height/tableNode.bgSpr.height)
        //皮肤选择
        var l = cc.EventListener.create({
        event: cc.EventListener.CUSTOM,
        eventName: "styleChange",
        callback: function(event)
        {   
            var styleId = styleArray[1]
            var frameName = 's' + styleId + '_bg.jpg'
            tableNode.bgSpr.setSpriteFrame(frameName)
        }
        })
        cc.eventManager.addListener(l, 1)   

        //uiStart
        tableNode.waitStartTTF = new cc.Sprite( '#tn_waitStart.png' )
        tableNode.uiStart.addChild(tableNode.waitStartTTF)

        tableNode.startNode = new cc.Node()
        tableNode.uiStart.addChild(tableNode.startNode)
        tableNode.startButton = new cc.Sprite('#tn_startBtn.png' )
        tableNode.startNode.addChild(tableNode.startButton)
        tableNode.shareButton = new cc.Sprite('#tn_shareBtn.png' )
        tableNode.startNode.addChild(tableNode.shareButton)

        tableNode.initCallOfStartNodeAndShareBtn()
        

        // ///////
        var l = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "isOpenUpdate",
            callback: function(event)
            {   
                tableNode.startNode.setVisible(tableData.managerUserID == selfdwUserID && !tableData.bIsOpened)
                tableNode.waitStartTTF.setVisible(tableData.managerUserID != selfdwUserID && !tableData.bIsOpened)   

                if(tableNode.closeClockTTF)
                    tableNode.closeClockTTF.setVisible(tableData.bIsOpened)
                if(tableNode.closeClockTTF2)
                    tableNode.closeClockTTF2.setVisible( tableData.bIsOpened )

                if(tableData.bIsOpened)
                {
                    if(tableNode.remainOpenTimeTTF)
                        tableNode.remainOpenTimeTTF.removeFromParent()
                    if(tableNode.remainOpenTimeTTF2)
                         tableNode.remainOpenTimeTTF2.removeFromParent()
                }

                // if(tableNode.remainOpenTimeTTF)
                //     tableNode.remainOpenTimeTTF.setVisible(!tableData.bIsOpened)
                // if(tableNode.remainOpenTimeTTF2)
                //     tableNode.remainOpenTimeTTF2.setVisible( !tableData.bIsOpened )


                if(!tableData.bIsOpened && tableNode.remainOpenTimeTTF)
                {
                    tableNode.startRemainOpenClock()
                }
                else if(tableNode.closeClockTTF)
                {
                    tableNode.closeClockTTF.setVisible(true)
                    tableNode.startCloseClock(tableNode.closeClockTTF)
                    if(tableNode.closeClockTTF2)
                        tableNode.closeClockTTF2.setVisible(true)
                }
            }
        })
        cc.eventManager.addListener(l, 1)

        ///////
        var l = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "managerUserUpdate",
            callback: function(event)
            {   
                tableNode.startNode.setVisible(tableData.managerUserID == selfdwUserID && !tableData.bIsOpened)
                tableNode.waitStartTTF.setVisible(tableData.managerUserID != selfdwUserID && !tableData.bIsOpened)   
            }
        })
        cc.eventManager.addListener(l, 1)

        ///////
        var l = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "playerCountInTableChange",
            callback: function(event)
            {   
                var usersInTable = tableData.getUsersInTable(tableData.getUserWithUserId(selfdwUserID).wTableID)
                var wMinUserCount = START_MODE==START_MODE_ALL_READY?2:SERVER_CHAIR
                tableNode.startButton.setVisible(usersInTable.length >= wMinUserCount)
                tableNode.shareButton.setVisible(usersInTable.length < wMinUserCount)
            }
        })
        cc.eventManager.addListener(l, 1) 
    },
    initChairs:function()
    {
        for(var showChairId=0;showChairId<SHOW_CHAIR;showChairId++)
        {     
            var chairNode = tableNode['chairNode' + showChairId]
            var chair = chairFactory.getOne(chairNode)
            cc.eventManager.addListener(tableNode._chairSprListener(), chair.userNode.chairSpr)
            tableNode._chairArray[showChairId]  = chair
        }

        tableNode._refreshAllChair()
    },
    //////////////////////////////////////
    _onSelfSitChair:function()
    {
        tableNode._onSelfChangeChair()
    },
    _onSelfChangeChair:function()
    {
        tableNode._refreshAllChair()

        //动画
        // var actions = []
        // for(var i=0;i<SERVER_CHAIR;i++)
        // {   
        //     var chair = tableNode._chairArray[i]
        //     var mbPos = cc.p( (tableNode.uiChair.getContentSize().width*0.5 - chair.node.getPosition().x) * 0.4, (tableNode.uiChair.getContentSize().height*0.5 - chair.node.getPosition().y) * 0.4 )
        //     var mb = cc.moveBy(0.05, mbPos )
        //     actions[actions.length] = cc.targetedAction(chair.node, 
        //         cc.sequence(mb,mb.reverse()))
        // }
        // var spawnAction = cc.spawn(actions)
        // var action = cc.sequence(
        //     cc.callFunc(function()
        //     {               
        //     }),
        //     spawnAction,
        //     cc.callFunc(function()
        //     {                      
        //         tableNode._refreshAllChair()
        //     })
        //     )
        // tableNode.node.runAction(action)
    },
    _refreshAllChair:function()
    {
        var self = tableData.getUserWithUserId(selfdwUserID)
        for(var showChairId=0;showChairId<SHOW_CHAIR;showChairId++)
        {     
            var chair = tableNode._chairArray[showChairId]
            var serverChairId = tableData.getServerChairIdWithShowChairId(showChairId)
            var user = tableData.getUserWithTableIdAndChairId(self.wTableID, serverChairId)
            chairFactory.refreshUserNode.call(chair, user)
        }
    },
    _refreshChair:function(chair, user)
    {   
        chairFactory.refreshUserNode.call(chair, user)
    },
    _chairSprListener:function()
    {
        var _chairSprListener = cc.EventListener.create(
        {   
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            onTouchBegan: function (touch, event) 
            {   
                var target = event.getCurrentTarget()

                if(managerTouch.isQuickTouch(target, 500))
                    return; 

                var user = tableData.getUserWithUserId(selfdwUserID)
                //gameLog.log(!target.isVisible() + '-' +user.cbUserStatus  + '-'+(!target.isVisible() || !tableData.isUserSitDownEnable(selfdwUserID)) ) 
                if(!target.isVisible() || user.cbUserStatus == US_SIT || !tableData.isUserSitDownEnable(selfdwUserID)) 
                    return false
                var locationInNode = target.convertToNodeSpace(touch.getLocation())
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height)
                if (cc.rectContainsPoint(rect, locationInNode)) 
                {        
                    return true
                }

                return false
            },
            onTouchCancelled:function(touch, event) {
            },
            onTouchEnded: function (touch, event) 
            {   
                var target = event.getCurrentTarget()
                if(!target.isVisible()) 
                    return false

                if(tableData.hasPay)
                {
                    sit(target)   
                }
                else
                {
                    var isVip = tableData.getUserWithUserId(selfdwUserID).dwMemberOverTime*1000 - new Date().getTime()>0
                    var call1 = function()
                    {   
                        node.removeFromParent()
                        tableData.PAY_IN_GAME_RESULT = function()
                        {
                           sit(target) 
                        }
                        
                        var PAY_IN_GAME = getObjWithStructName('CMD_GR_C_PayInGame') 
                        PAY_IN_GAME.szTableKey = tableKey
                        PAY_IN_GAME.dwUserID = selfdwUserID
                        socket.sendMessage(MDM_GR_MANAGE, SUB_GR_PAY_IN_GAME, PAY_IN_GAME)
                    }
                    var call2 = function()
                    {   
                        sit(target) 
                        node.removeFromParent()
                    }
                    var call3 = function()
                    {   
                        node.removeFromParent()
                    }

                    if(isVip)
                        var pop = popBox.getOneTwoBtn(call1, call3, call3)
                    else
                        var pop = popBox.getOneTwoBtn(call1, call3, call3)

                    var node = pop[0]
                    var control = pop[1]

                    if(isVip)
                        var str = '你已购买本游戏软件会员卡,在会员卡有效期间,游戏中创局/入座玩游戏都免费。(本局节省' + tableData.wTotalPlayFees + '钻)'
                    else 
                        var str = '本游戏工具为收费软件,按游戏时间扣除钻石,一经确定不予退还,是否花费' + tableData.wTotalPlayFees+'钻石'
                            +(tableData.wTotalPlayFees == tableData.wOriginalPlayFees?'':'(原价'+tableData.wOriginalPlayFees+'钻石)')+'开始牌局？'

                    control.mainLabel.setString( str )
                    control.leftBtnLabel.setString( '确定' )
                    control.rightBtnLabel.setString( '取消' )
                    node.setPosition( cc.p( uiController.sysTips.getContentSize().width * 0.5, uiController.sysTips.getContentSize().height * 0.6) )
                    uiController.sysTips.addChild(node) 
                }

                function sit(target)
                {
                    if(!tableData.isUserSitDownEnable(selfdwUserID))
                        return false
                    var chair = target.getParent().getParent().getChair()
                    var showChairId = tableData.getShowChairIdWithChair(chair)
                    tableData.showChairIdTouched = showChairId

                    var serverChairId = tableData.getServerChairIdWithShowChairId(showChairId)
                    var tableId = tableData.getUserWithUserId(selfdwUserID).wTableID

                    gameLog.log(showChairId, serverChairId)

                    var UserSitDown = getObjWithStructName('CMD_GR_UserSitDown')
                    UserSitDown.wTableID = tableId
                    UserSitDown.wChairID = ( serverChairId<SERVER_CHAIR?serverChairId:(SERVER_CHAIR-1) )
                    UserSitDown.szPassword = ''
                    //gameLog.log('UserSitDown table:' + UserSitDown.wTableID + '-chair:' + UserSitDown.wChairID)
                    socket.sendMessage(MDM_GR_USER, SUB_GR_USER_SITDOWN, UserSitDown)
                }  
            }
        })

        return _chairSprListener     
    },
    initCallOfStartNodeAndShareBtn:function()
    {
        var startCall = function() 
        {
            if( managerTouch.isQuickTouch(tableNode.startButton, 1000) )
                return;

            var s = function()
            {
                managerAudio.playEffect('components/tableNode/res/go.mp3')
                // var open = getObjWithStructName('CMD_GR_C_Opening')
                // open.wTableID = tableData.getUserWithUserId(selfdwUserID).wTableID
                // open.dwUserID = selfdwUserID
                //socket.sendMessage(MDM_GR_USER, SUB_GR_USER_OPENING, open) 
                
                var open = getObjWithStructName('CMD_GR_C_OpeningOne')
                open.wTableID = tableData.getUserWithUserId(selfdwUserID).wTableID
                open.dwUserID = selfdwUserID
                socket.sendMessage(MDM_GR_USER, SUB_GR_USER_OPENING_ONE, open) 
            }

            s()
        }

        var shareCall = function()
        {
            if(cc.sys.isMobile)
            {
                var node = sharePop.getPop()
                node.setPosition( cc.p( uiController.uiTop.getContentSize().width * 0.5, uiController.uiTop.getContentSize().height * 0.5) )
                uiController.uiTop.addChild(node)
            }
        }

        cocos.bindListener(startCall, tableNode.startButton)
        cocos.bindListener(shareCall, tableNode.shareButton)
    },
    registerCloseClock:function(clockLabel)
    {
        tableNode.closeClockTTF = clockLabel
        tableNode.closeClockTTF.setVisible(false)
        //tableNode.startCloseClock(tableNode._closeClockLabel)
    },
    startCloseClock:function(clockLabel)
    {
        //倒计时
        function checkTime(i)
        {
            return i<10?'0'+i:i
        }
        function getStrFun(str)
        {   
            var t = str.split(':')
            var hour = parseInt(t[0])
            var min = parseInt(t[1])
            var second = parseInt(t[2])   

            if(second>0)    second = second - 1
            else if(min>0)
            {
                min = min - 1
                second = 59
            }
            else
            {
                hour = hour - 1
                min = 59
                second = 59
            }

            if(hour < 0)
            {
                hour = 0
                min = 0
                second = 0
            }
            return hour + ':' + checkTime(min) + ':' + checkTime(second)
        }

        var t = tableData.dwEndTime - new Date().getTime()
        t = t<0?0:t

        var d = new Date(946656000000 + t)  
        var originStr = d.getHours() + ':' + checkTime(d.getMinutes()) + ':' + checkTime(d.getSeconds())

        function perSecondcallBack()
        {   
            if(clockLabel.getString() == '0:20:00')
                showTipsTTF({str:'提示:本局游戏将在20分钟后结束'})

            if(clockLabel.getString() == '0:10:00')
                showTipsTTF({str:'提示:本局游戏将在10分钟后结束'})

            if(clockLabel.getString() == '0:05:00')
                showTipsTTF({str:'提示:本局游戏将在5分钟后结束'})
            
        }

        clock.tickLabel(clockLabel, originStr, '0:00:00', getStrFun, null, perSecondcallBack) 
    },
    startRemainOpenClock:function()
    {
        //倒计时
        function checkTime(i)
        {
            return i<10?'0'+i:i
        }
        function getStrFun(str)
        {   
            var t = str.split(':')
            var min = parseInt(t[0])
            var second = parseInt(t[1])   

            if(second>0)    second = second - 1
            else if(min>0)
            {
                min = min - 1
                second = 59
            }

            if(min < 0)
            {
                min = 0
                second = 0
            }
            return checkTime(min) + ':' + checkTime(second)
        }

        var t = tableData.dwEndTime - new Date().getTime()
        t = t<0?0:t

        var d = new Date(946656000000 + t)  
        var originStr = checkTime(d.getMinutes()) + ':' + checkTime(d.getSeconds())

        clock.tickLabel( tableNode.remainOpenTimeTTF, originStr, '00:00', getStrFun ) 
    },
    decorateTableNode:function()
    {
        //topbar
        if(tableNode.topBarNode)
        {
            var topBarBg = new cc.Scale9Sprite('tn_topBar_bg.png')
            topBarBg.width = tableNode.topBarNode.width
            topBarBg.height = tableNode.topBarNode.height 
            topBarBg.x = tableNode.topBarNode.width/2
            topBarBg.y = tableNode.topBarNode.height/2
            tableNode.topBarNode.addChild(topBarBg, -1)
        }

        if(tableNode.tableKeyTTF)
            tableNode.tableKeyTTF.setString(tableKey)

        if(tableNode.gameEndTimeTTF)
        {
            var onEvent = function()
            {
                if(tableData.bIsOpened)
                {
                    function checkTime(i)
                    {
                        return i<10?'0'+i:i
                    }
                    var d = new Date(tableData.dwEndTime)
                    
                    tableNode.gameEndTimeTTF.setString( cc.formatStr('%s 结束', d.getHours() + ':' + checkTime(d.getMinutes()) ) )
                }
                else
                {
                    tableNode.gameEndTimeTTF.setString( '等待开局')
                }
            }

            var l = cc.EventListener.create({
                event: cc.EventListener.CUSTOM,
                eventName: "isOpenUpdate",
                callback: function(event)
                {   
                    onEvent()
                }
            })
            cc.eventManager.addListener(l, 1)
            onEvent()
        }

        if(tableNode.roomOwnerTTF)
        {
            var l = cc.EventListener.create({
                event: cc.EventListener.CUSTOM,
                eventName: "managerUserUpdate",
                callback: function(event)
                {   
                    var managerUser = tableData.getUserWithUserId(tableData.managerUserID)
                    var name = managerUser?managerUser.szNickName:'无'
                    tableNode.roomOwnerTTF.setString( cc.formatStr('%s', name) )
                }
            })
            cc.eventManager.addListener(l, 1)
        }

        if(tableNode.logoSpr)
        {
            var l = cc.EventListener.create({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: false,
                onTouchBegan: function (touch, event) {
                    var target = event.getCurrentTarget()
                    var locationInNode = target.convertToNodeSpace(touch.getLocation())
                    var s = target.getContentSize();
                    var rect = cc.rect(0, 0, s.width, s.height)
                    if (cc.rectContainsPoint(rect, locationInNode)) {
                        return true
                    }
                    return false
                },
                onTouchEnded: function (touch, event) {
                    var target = event.getCurrentTarget()
                    // sendLogToServer(gameLog.logS + 'wtmsniuniuwtms')
                    if(isOpenLogoTouchForReStart)
                    {
                        var event = new cc.EventCustom("reStart")
                        cc.eventManager.dispatchEvent(event)
                    }

                }
            })
            cc.eventManager.addListener(l, tableNode.logoSpr)
        }

        if(tableNode.roundTimeTTF)
        { 
            tableNode.roundTimeTTF.setString( (tableData.wRoundTime/60) + '分钟')
        }               

    },
    setBankerIcon:function(wChairID, isShow, iconName)
    {   
        if(wChairID == INVALID_WORD) return
        var tabelId = tableData.getUserWithUserId(selfdwUserID).wTableID
        var user = tableData.getUserWithTableIdAndChairId(tabelId, wChairID)
        if(user && user.userNodeInsetChair && tableData.isInTable(user.cbUserStatus))
        {
            if(!isShow)
                user.userNodeInsetChair.bankerNode.removeAllChildren()
            else
            {
                iconName = iconName || '#bankerIcon.png'
                var bankerIcon = new cc.Sprite( iconName )
                user.userNodeInsetChair.bankerNode.addChild(bankerIcon) 
            }
        }
    },

}

function showTips(args)
{
    var pos
    var isSit = tableData.isInTable(tableData.getUserWithUserId(selfdwUserID) && tableData.getUserWithUserId(selfdwUserID).cbUserStatus)
    if(isSit && hasEnterMainScene)
    {
        pos = {}
        var p = tableNode.chairNode0.getPosition()
        pos.x = tableNode.chairNode0.getParent().getContentSize().width * 0.5
        pos.y = p.y + 175
    }

    showTipsTTF(
        {str:args.str,
        pos:pos
    })
}

