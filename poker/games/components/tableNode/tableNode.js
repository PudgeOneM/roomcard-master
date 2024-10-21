
var tableNode = 
{   
    _chairArray:[],
    init:function( tableCCB, adjustAfterLoad)
    {	
        var node = managerRes.loadCCB(tableCCB, tableNode)
        adjustAfterLoad?adjustAfterLoad():''
        tableNode.animationManager = node.animationManager
        tableNode.node  = node

        if(tableNode.tableKeyTTF)
            tableNode.tableKeyTTF.setString(tableKey)

        // tableNode.shareButton.setVisible(cc.sys.isMobile)

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
                var wMinUserCount = START_MODE==START_MODE_ALL_READY?2:GAME_PLAYER
                tableNode.startButton.setVisible(usersInTable.length >= wMinUserCount)
                tableNode.shareButton.setVisible(usersInTable.length < wMinUserCount)
            }
        })
        cc.eventManager.addListener(l, 1) 
    },
    initChairs:function()
    {
        for(var i=0;i<GAME_PLAYER;i++)
        {     
            var chairNode = tableNode['chairNode' + i]
            var chair = chairFactory.getOne(chairNode)
            cc.eventManager.addListener(tableNode._chairSprListener(), chair.userNode.chairSpr)
            tableNode._chairArray[i]  = chair
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
        //动画
        var actions = []
        for(var i=0;i<GAME_PLAYER;i++)
        {   
            var chair = tableNode._chairArray[i]
            var mbPos = cc.p( (tableNode.uiChair.getContentSize().width*0.5 - chair.node.getPosition().x) * 0.4, (tableNode.uiChair.getContentSize().height*0.5 - chair.node.getPosition().y) * 0.4 )
            var mb = cc.moveBy(0.05, mbPos )
            actions[actions.length] = cc.targetedAction(chair.node, 
                cc.sequence(mb,mb.reverse()))
        }
        var spawnAction = cc.spawn(actions)
        var action = cc.sequence(
            cc.callFunc(function()
            {               
            }),
            spawnAction,
            cc.callFunc(function()
            {                      
                tableNode._refreshAllChair()
            })
            )
        tableNode.node.runAction(action)
    },
    _refreshAllChair:function()
    {
        var self = tableData.getUserWithUserId(selfdwUserID)
        for(var i=0;i<GAME_PLAYER;i++)
        {   
            var showChairId = i
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
                        var str = cc.formatStr("你已购买本游戏软件日卡/周卡,在日卡/周卡有效期间,游戏中创局/入座玩游戏都免费。(本局节省%d钻)", tableData.wTotalPlayFees)
                    else
                        var str = cc.formatStr("本游戏工具为收费软件,按游戏时间扣除钻石,一经确定不予退还,是否花费%d钻石开始牌局？", tableData.wTotalPlayFees)

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
                    UserSitDown.wChairID = serverChairId
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
        tableNode.startCall = function() 
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

            // if(tableData.hasPay)
            // {
                s()
            //}
            // else
            // {
            //     var isVip = true//tableData.getUserWithUserId(selfdwUserID).cbMemberOrder
            //     var call1 = function()
            //     {   
            //         node.removeFromParent()
            //         tableData.PAY_IN_GAME_RESULT = function()
            //         {
            //             s()
            //         }
                    
            //         var PAY_IN_GAME = getObjWithStructName('CMD_GR_C_PayInGame') 
            //         PAY_IN_GAME.szTableKey = tableKey
            //         PAY_IN_GAME.dwUserID = selfdwUserID
            //         socket.sendMessage(MDM_GR_MANAGE, SUB_GR_PAY_IN_GAME, PAY_IN_GAME)
            //     }
            //     var call2 = function()
            //     {   
            //         s()
            //         node.removeFromParent()
            //     }
            //     var call3 = function()
            //     {   
            //         node.removeFromParent()
            //     }

            //     if(isVip)
            //         var pop = popBox.getOneTwoBtn(call2, call3, call3)
            //     else
            //         var pop = popBox.getOneTwoBtn(call1, call3, call3)

            //     var node = pop[0]
            //     var control = pop[1]

            //     if(isVip)
            //         var str = cc.formatStr("你已购买本游戏软件日卡/周卡,在日卡/周卡有效期间,游戏中创局/入座玩游戏都免费。(本局节省%d钻)", tableData.wTotalPlayFees)
            //     else
            //         var str = cc.formatStr("本游戏工具为收费软件,按游戏时间扣除钻石,一经确定不予退还,是否花费%d钻石开始牌局？", tableData.wTotalPlayFees)

            //     control.mainLabel.setString( str )
            //     control.leftBtnLabel.setString( '确定' )
            //     control.rightBtnLabel.setString( '取消' )
            //     node.setPosition( cc.p( uiController.sysTips.getContentSize().width * 0.5, uiController.sysTips.getContentSize().height * 0.6) )
            //     uiController.sysTips.addChild(node) 
            // }

        }

        tableNode.shareCall = function()
        {
            if(cc.sys.isMobile)
            {
                var node = sharePop.getPop()
                node.setPosition( cc.p( uiController.uiTop.getContentSize().width * 0.5, uiController.uiTop.getContentSize().height * 0.5) )
                uiController.uiTop.addChild(node)
            }
        }
    },
    // initStartNodeAndShareBtn:function()
    // {
    //     tableNode.shareButton.setVisible(cc.sys.isMobile)
    //     tableNode.startNode.setVisible(tableData.createrUserID == selfdwUserID && !tableData.bIsOpened)
    //     tableNode.waitStartTTF.setVisible(tableData.createrUserID != selfdwUserID && !tableData.bIsOpened)

    //     ///////
    //     var l = cc.EventListener.create({
    //         event: cc.EventListener.CUSTOM,
    //         eventName: "isOpenUpdate",
    //         callback: function(event)
    //         {   
    //             tableNode.startNode.setVisible(tableData.createrUserID == selfdwUserID && !tableData.bIsOpened)
    //             tableNode.waitStartTTF.setVisible(tableData.createrUserID != selfdwUserID && !tableData.bIsOpened)   


    //             tableNode.remainOpenTimeTTF.setVisible(!tableData.bIsOpened)
    //             if(!tableData.bIsOpened)
    //             {
    //                 tableNode.startRemainOpenClock()
    //             }
    //             else if(tableNode._closeClockLabel)
    //                 tableNode.startCloseClock(tableNode._closeClockLabel)
    //         }
    //     })
    //     cc.eventManager.addListener(l, 1)
    // },
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

        // if(tableNode.roomTimeLengthTTF)
        // {
        //     // var onEvent = function()
        //     // {
        //     //     if(tableData.bIsOpened)
        //     //     {
        //     //         function checkTime(i)
        //     //         {
        //     //             return i<10?'0'+i:i
        //     //         }
        //     //         var d = new Date(tableData.dwEndTime)
                    
        //     //         tableNode.gameEndTimeTTF.setString( cc.formatStr('%s结束', d.getHours() + ':' + checkTime(d.getMinutes()) ) )
        //     //     }
        //     //     else
        //     //         tableNode.gameEndTimeTTF.setString( '等待开局')
        //     // }

        //     // var l = cc.EventListener.create({
        //     //     event: cc.EventListener.CUSTOM,
        //     //     eventName: "isOpenUpdate",
        //     //     callback: function(event)
        //     //     {   
        //     //         onEvent()
        //     //     }
        //     // })
        //     // cc.eventManager.addListener(l, 1)
        //     // onEvent()
        // }


        if(tableNode.roomOwnerTTF)
        {
            var l = cc.EventListener.create({
                event: cc.EventListener.CUSTOM,
                eventName: "managerUserUpdate",
                callback: function(event)
                {   
                    var managerUser = tableData.getUserWithUserId(tableData.managerUserID)
                    var name = managerUser?managerUser.szNickName:'无'
                    tableNode.roomOwnerTTF.setString( cc.formatStr('房主:%s', name) )
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
            tableNode.roundTimeTTF.setString( '牌局时间:' + (tableData.wRoundTime/60) + '分钟')
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

