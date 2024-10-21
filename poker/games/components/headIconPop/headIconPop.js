
var headIconPop = 
{
    kickUserPoolOnGameEnd:[],
    resp:'components/headIconPop/res/',
    preLoadRes:
    [
    'components/headIconPop/res/headIconPop.plist', 
    'components/headIconPop/res/headIconPop.png',
    'components/headIconPop/res/circle00.png',
    'components/headIconPop/res/circle01.png',
    ],
    onPreLoadRes:function()
    {
        var resp = headIconPop.resp
        cc.spriteFrameCache.addSpriteFrames(resp + 'headIconPop.plist', resp + 'headIconPop.png')
        // cc.spriteFrameCache.addSpriteFrames(resp + 'animationItem.plist', resp + 'animationItem.png')

        // for(var i=1;i<11;i++)
        // {   
        //     resp_p['item'+i] = resp + 'item'+i + '.png'
        //     resp_p['item'+i+'_gray'] = resp + 'item'+i+'_gray.png'
        // }
    },
    kickUserOnGameEnd:function()
    {
        if(tableData.managerUserID == selfdwUserID)
        {
            for(var i in headIconPop.kickUserPoolOnGameEnd)
            {
                var userid = headIconPop.kickUserPoolOnGameEnd[i]
                var user = tableData.getUserWithUserId(userid)
                if(user.cbUserStatus == US_SIT || user.cbUserStatus == US_READY || user.cbUserStatus == US_LOOKON)
                {
                    var KickUser = getObjWithStructName('CMD_GR_KickUser')
                    KickUser.dwTargetUserID = userid
                    socket.sendMessage(MDM_GR_USER,SUB_GR_USER_KICK_USER,KickUser)
                }
            }
        }
        headIconPop.kickUserPoolOnGameEnd = []
    },
    getPop:function(dwUserID)
    {   
        var resp = headIconPop.resp
        var user = tableData.getUserWithUserId(dwUserID)
        var self = tableData.getUserWithUserId(selfdwUserID)
        var control = {}

        var node  = cc.BuilderReader.load('components/headIconPop/res/headIconPop.ccbi', control)
        control.nameLabel.setString(user.szNickName)  
        control.idLabel.setString('id:' + (200000 + user.dwUserID*88 + 66666) )       
     
        var headIcon = new cc.Sprite('#headIcon.png')
        var hnode = getCircleNodeWithSpr(headIcon)
        hnode.setScale(0.8)
        control.headNode.addChild(hnode)

        var url = user.szHeadImageUrlPath
        cc.loader.loadImg(url, {isCrossOrigin : false}, function(err,img){
                var texture2d = new cc.Texture2D()
                texture2d.initWithElement(img)
                texture2d.handleLoadedTexture()

                var frame = new cc.SpriteFrame(texture2d, cc.rect(0, 0, texture2d.getContentSize().width, texture2d.getContentSize().height))
                headIcon.setSpriteFrame(frame)
        })

        control.nameLabel.y = 410
        control.vipLabel.visible = false
        if(dwUserID == selfdwUserID)
        {
            control.diamondSpr.setVisible(true)
            control.diamondTTF.setVisible(true)
            control.diamondTTF.setString(self.lDiamond)
            control.diamondSpr.setPositionX( control.diamondTTF.getPositionX() -  control.diamondTTF.getContentSize().width - 18)
       
            var t = user.dwMemberOverTime*1000 - new Date().getTime()
            if(t>0)
            {
                control.nameLabel.y = 420
                control.vipLabel.visible = true
               
                t = Math.ceil(t/1000) 
                var day = Math.floor( t/(24*3600) )
                var hour = Math.floor( (t - 24*3600*day)/3600 )
                var minute = Math.floor( (t - 24*3600*day - 3600*hour)/60 )
                var second = t - 24*3600*day - 3600*hour - 60*minute 

                if(day>0)
                {
                    var originStr = '会员剩余时间：'+day+'天'+hour+'时'+(minute<10?'0'+minute:minute)+'分'
                    // var endStr = '会员剩余时间：'+0+'天'+0+'时'+0+'分'
                    control.vipLabel.setString(originStr)
                }
                else
                {
                    var originStr = '会员剩余时间：'+hour+'时'+(minute<10?'0'+minute:minute)+'分'+(second<10?'0'+second:second)+'秒'
                    var endStr = '会员剩余时间：00时00分00秒'
                
                    function getStrFun(str)
                    {   
                        var hasDay = str[str.length-1] == '分'
                        if(hasDay)
                        {
                            return str//没有人会点开这个头像看个1分钟的
                        }
                        else
                        {
                            var t = str.split('：')[1]
                            var hour = parseInt(t.split('时')[0] )
                            t = t.split('时')[1] 
                            var min = parseInt(t.split('分')[0])
                            t = t.split('分')[1] 
                            var second = parseInt(t.split('秒')[0])

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
                            console.log(321231, hour, min, second)
                            return '会员剩余时间：'+hour+'时'+(min<10?'0'+min:min)+'分'+(second<10?'0'+second:second)+'秒'
                        }
                    }

                    clock.tickLabel(control.vipLabel, originStr, endStr, getStrFun) 
                }

 
            }
        }
        else
        {
            control.diamondSpr.setVisible(false)
            control.diamondTTF.setVisible(false)
        }


        //item
        var listView = new ccui.ListView()
        listView.setDirection(ccui.ScrollView.DIR_HORIZONTAL)
        listView.setTouchEnabled(true)
        listView.setBounceEnabled(true)
        listView.setBackGroundImage(resp_p.empty)
        listView.setBackGroundImageScale9Enabled(true)

        listView.setContentSize(control.itemListNode.getContentSize().width-10,control.itemListNode.getContentSize().height+10)
        listView.x = 5
        listView.y = -10
        control.itemListNode.addChild(listView)

        for(var i=1;i<11;i++)
        {   
            var default_item = new ccui.Layout()
            default_item.setContentSize(100, listView.getContentSize().height)

            var isshortDiamond = self.lDiamond<tableData.itemTable[i]
            var isTouchEnable = dwUserID!=selfdwUserID && !isshortDiamond && tableData.isInTable(self.cbUserStatus)
            if(isTouchEnable)
                var itemIconBtn = new ccui.Button('gameRes/pic/headIconPop/item'+i+'.png', 
                    'gameRes/pic/headIconPop/item'+i+'_gray.png')
            else
                var itemIconBtn = new ccui.Button('gameRes/pic/headIconPop/item'+i+'_gray.png', 
                    'gameRes/pic/headIconPop/item'+i+'_gray.png')
            //itemIconBtn.setTouchEnabled(isTouchEnable)
            itemIconBtn.setPosition(cc.p(50, 90))
            itemIconBtn.setTag(i)
            itemIconBtn.addClickEventListener(function(itemIconBtn) {
                if(isshortDiamond)
                {
                    popTips('钻石余额不足,请充值！', 4)
                    return
                }

                if(!isTouchEnable) return
                if( managerTouch.isQuickTouch(headIconPop, 500) )
                    return;
                gameLog.log(new Date().getTime())
                var idx = itemIconBtn.getTag()

                var PropertyBuy = getObjWithStructName('CMD_GR_C_PropertyBuy') 
                PropertyBuy.cbRequestArea = 4
                PropertyBuy.wItemCount = 1
                PropertyBuy.wPropertyIndex = idx
                PropertyBuy.dwTargetUserID = dwUserID
                PropertyBuy.cbConsumeScore = false
                socket.sendMessage(MDM_GR_USER, SUB_GR_PROPERTY_BUY, PropertyBuy)

                node.removeFromParent()
            }.bind(this))
            default_item.addChild(itemIconBtn)

            var coin = new cc.Sprite('#hip_diamond.png')
            coin.setPosition(cc.p(30, 36))
           // coin.setScale(0.5)
            default_item.addChild(coin)

            var label = cc.LabelTTF.create(tableData.itemTable[i], "Helvetica", 24)
            label.setFontFillColor(cc.color(0, 143, 81, 255) )
            label.anchorX = 0
            label.anchorY = 0.5 

            label.setPosition(cc.p(44,36))
            default_item.addChild(label)

            listView.pushBackCustomItem(default_item)
        }
        listView.forceDoLayout()

        listView.setTouchEnabled(listView.getItem(listView._items.length-1) && listView.getItem(listView._items.length-1).getPositionX()+listView.getItem(0).getContentSize().width>listView.width)
   
        //
        control.timeLabel.setString("牌局数")
        if(user.dwDrawCount)
        {
            control.winRateLabel.setString("胜/平/逃") 
            control.winRateNumLabel.setString(user.dwWinCount + '/' + user.dwDrawCount + '/' + user.dwFleeCount )
        }
        else
        {
            control.winRateLabel.setString("胜/逃") 
            control.winRateNumLabel.setString(user.dwWinCount + '/' + user.dwFleeCount )
        }

        var winRateNumLabelW = control.winRateNumLabel.getContentSize().width
        var scale = winRateNumLabelW < 150?1:150/winRateNumLabelW

        control.winRateNumLabel.setScaleX(scale)

        var count = user.dwWinCount + user.dwLostCount + user.dwDrawCount + user.dwFleeCount
        control.timeNumLabel.setString(count)

        var rate = count==0?0:Math.floor( user.dwWinCount / count * 100 ) 
        var left = new cc.ProgressTimer(new cc.Sprite(resp + 'circle00.png'))
        left.type = cc.ProgressTimer.TYPE_RADIAL
        left.setReverseDirection(true)
        left.x = 0
        left.y = 0
        left.setPercentage(rate)
        var right = new cc.ProgressTimer(new cc.Sprite(resp + 'circle01.png'))
        right.type = cc.ProgressTimer.TYPE_RADIAL
        right.x = 0
        right.y = 0
        right.setPercentage(100-rate)
        control.circleNode.addChild(right)
        control.circleNode.addChild(left)

        var listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget()
                var locationInNode = target.convertToNodeSpace(touch.getLocation())
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height)
                if (cc.rectContainsPoint(rect, locationInNode)) {
                    return true
                }
                node.removeFromParent()
                return false
            },
            onTouchEnded: function (touch, event) {
                // node.removeFromParent()
            }
        })
        cc.eventManager.addListener(listener, node)

        listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
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
                if(managerAudio.wxVoiceLastId[dwUserID])
                {
                    if(!managerAudio.isWxVoicePlaying && !managerAudio.isWxVoiceRecording)
                        managerAudio.wxPlay(managerAudio.wxVoiceLastId[dwUserID])
                }
            }
        })
        cc.eventManager.addListener(listener, control.voiceSpr)

        listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
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
                node.removeFromParent()
            }
        })
        cc.eventManager.addListener(listener, control.closeSpr)



        listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget()
                if( !isRealVisible(target) )
                    return false
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
                if(managerTouch.isQuickTouch(target))
                    return;

                var hasAddToPool = false
                for(var i in headIconPop.kickUserPoolOnGameEnd)
                {
                    if(headIconPop.kickUserPoolOnGameEnd[i] == user.dwUserID)
                    {
                        hasAddToPool = true
                        break
                    }
                }

                if(hasAddToPool)
                {
                    showTipsTTF({str:'将在这轮游戏结束时踢出该玩家'})
                }
                else
                {
                    if(user.cbUserStatus == US_PLAYING || user.cbUserStatus == US_OFFLINE)
                    {
                        headIconPop.kickUserPoolOnGameEnd[headIconPop.kickUserPoolOnGameEnd.length] = user.dwUserID
                        showTipsTTF({str:'将在这轮游戏结束时踢出该玩家'})
                    }
                    else
                    {
                        var KickUser = getObjWithStructName('CMD_GR_KickUser')
                        //alert(user.dwUserID)
                        KickUser.dwTargetUserID = user.dwUserID
                        socket.sendMessage(MDM_GR_USER,SUB_GR_USER_KICK_USER,KickUser)
                    }
                }
                node.removeFromParent()
            }
            })
        cc.eventManager.addListener(listener, control.kickSpr)


        listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget()
                if( !isRealVisible(target) )
                    return false

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
                if(managerTouch.isQuickTouch(target))
                    return;
                var bankdown = getObjWithStructName('CMD_C_Static_Banker_Down')
                //alert(user.dwUserID)
                bankdown.dwPlayerID = user.dwUserID
                socket.sendMessage(MDM_GF_GAME,SUB_C_STATIC_BANKER_DOWN, bankdown)
                node.removeFromParent()
            }
            })
        cc.eventManager.addListener(listener, control.bankdownSpr)

        var isShowBankDown = dwUserID != selfdwUserID && tableData.managerUserID == selfdwUserID && dwUserID == tableData.dwStaticBanker
        var isShowKick = dwUserID != selfdwUserID && tableData.managerUserID == selfdwUserID && !tableData.bIsOpened
        
        control.bankdownSpr.setVisible(isShowBankDown)
        control.kickSpr.setVisible(isShowKick)

        if(gameorientation == 'landscape')
            node.setScale(0.8)
        return node
    }

}












