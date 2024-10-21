
var chairFactory = 
{   
    resp:'components/chairFactory/res/',
    getPreLoadRes:function()
    {        
        var resp = chairFactory.resp

        return [
            resp + 'chairFactory.plist', 
            resp + 'chairFactory.png'
        ]
    },
    onPreLoadRes:function()
    {
        var resp = chairFactory.resp
        cc.spriteFrameCache.addSpriteFrames(resp + 'chairFactory.plist', resp + 'chairFactory.png')
    },
    onReStart:function()
    {
        // cc.eventManager.removeCustomListeners('userNodeInsetChairInit')
        // cc.eventManager.removeCustomListeners('userNodeInsetChairUpdate')
    },
    getOne:function(chairNode)
    {	  
        var chair = {}
        var getChair = function()
        {
            return chair
        }
        chair.node = chairNode
        chair.node.getChair = getChair

        chair.userNode = new cc.Node()
        chair.node.addChild(chair.userNode)

        chairFactory._initUserNode.call(chair)


        var l = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "scoreInGameUpdate",
            callback: function(event)
            {   
                var data = event.getUserData()
                var dwUserID = data[0]
                var oldScore = data[1]
                var newScore = data[2]
                var serverChairId = tableData.getUserWithUserId(dwUserID).wChairID

                if(tableData.getChairWithServerChairId(serverChairId) == chair)
                    chair.userNode.userScore.setString(newScore)
            }
        })
        cc.eventManager.addListener(l, 1)


        return chair
    },
    ///////////UserNode start/////////
    _initUserNode:function()
    {
        var chair = this
        var userNode = chair.userNode

        /////chairSpr
        userNode.chairSpr = new cc.Sprite('#cf_chairEmptyIcon.png')
        userNode.addChild(userNode.chairSpr)

        /////headNode
        userNode.headNode = new cc.Node()
        userNode.addChild(userNode.headNode)

        userNode.headIcon = new cc.Sprite('#headIcon.png')
        var hnode = getRectNodeWithSpr(userNode.headIcon, true)
        hnode.setScale(1.13)
        userNode.headNode.addChild(hnode)
        cc.eventManager.addListener(chairFactory._headIconListener(), userNode.headIcon)
      
        userNode.bgFrame = new cc.Sprite('#cf_frame.png')
        userNode.bgFrame.y = -11
        userNode.headNode.addChild(userNode.bgFrame)

        //getLabel取行数会不准
        //所以昵称的width要足够大 不会出现昵称要显示3行就行了 
        userNode.userName = getLabel(20, 150, 2)
        userNode.userName.setFontFillColor( cc.color(242, 255, 233, 255) )
        userNode.userName.setPosition(cc.p(0, 62))
        userNode.headNode.addChild(userNode.userName)   

        // userNode.vipFrame = new cc.Sprite('#cf_vipFrame.png')
        // userNode.headNode.addChild(userNode.vipFrame)   

        userNode.userScore = cc.LabelTTF.create('', "Helvetica", 26)
        userNode.userScore.setFontFillColor( cc.color(255, 199, 6, 255) )
        userNode.userScore.setPosition(cc.p(0, -48.5))
        userNode.headNode.addChild(userNode.userScore)  

        userNode.headNode.setVisible(false)
        userNode.chairSpr.setVisible(true)

    },
    refreshUserNode:function(user)
    {   
        var chair = this
        var userNode = chair.userNode

        if(user)  //有人坐
        {   
            //维护user.userNodeInsetChair 
            if(!user.userNodeInsetChair)
            {
                user.userNodeInsetChair = chairFactory._getUserNodeInsetChair()
                var event = new cc.EventCustom("userNodeInsetChairInit")
                event.setUserData(user.userNodeInsetChair)
                cc.eventManager.dispatchEvent(event)
            }
            else
                user.userNodeInsetChair.removeFromParent(false)

            var userNodeInsetChair = user.userNodeInsetChair

            var event = new cc.EventCustom("userNodeInsetChairUpdate")
            event.setUserData([user.userNodeInsetChair, user.dwUserID])
            cc.eventManager.dispatchEvent(event)

            userNodeInsetChair.setNodeDirty() //必须要有这一行 否则node不会重新渲染
            chair.userNode.addChild(userNodeInsetChair)

            //////
            userNode.chairSpr.setVisible(false)

            userNode.userScore.setString(user.lScoreInGame)
            chairFactory.refreshWithState.call(userNode, user)
            userNode.headNode.setVisible(true)
            userNode.headIcon.dwUserID = user.dwUserID

            var url = user.szHeadImageUrlPath
            if(url)
            { 
                cc.loader.loadImg(url, {isCrossOrigin : false}, function(err,img){
                        var texture2d = new cc.Texture2D()
                        texture2d.initWithElement(img)
                        texture2d.handleLoadedTexture()

                        var frame = new cc.SpriteFrame(texture2d, cc.rect(0, 0, texture2d.getContentSize().width, texture2d.getContentSize().height))
                        userNode.headIcon.setSpriteFrame(frame)
                })
            }
            else
            {
                userNode.headIcon.setSpriteFrame('headIcon.png')    
            }

            userNode.headNode.setPosition(cc.p(0, 0))
            userNode.userName.setStringNew(user.szNickName)


            var isVip = user.dwMemberOverTime*1000 - new Date().getTime()>0
            userNode.bgFrame.setSpriteFrame( isVip?'cf_vipFrame.png':'cf_frame.png' )

            // userNode.vipFrame.setVisible(user.dwMemberOverTime*1000 - new Date().getTime()>0)
            // userNodeInsetChair.bankerNode.setPosition( cc.p(25 * (chairFactory.isRight(chair.node)?1:-1), 25) )  
            userNodeInsetChair.bankerNode.setPosition( cc.p(18, 19.5) )              
        }
        else
        {   
            userNode.headNode.setVisible(false)
            userNode.chairSpr.setVisible(true)

            var self = tableData.getUserWithUserId(selfdwUserID)
            if( self.cbUserStatus == US_LOOKON)
            {   
                userNode.chairSpr.setSpriteFrame('cf_chairSeatIcon.png')
            }
            else
            {
                userNode.chairSpr.setSpriteFrame('cf_chairEmptyIcon.png')
            }
        }
    },
    refreshWithState:function(user)
    {
        var userNode = this
        var cbUserStatus = user.cbUserStatus
        var name = user.szNickName
        if(cbUserStatus == US_OFFLINE)
        {      
            userNode.headIcon.color = cc.color(155, 155, 155)

            var s = actionFactory.getSprWithAnimate('cf_offLine_', false, 0.5)
            s.setPositionY(-8)

            var t = new cc.LabelTTF('', "Helvetica", 18)
            t.color = cc.color(255, 255, 0)
            function getStrFun(str)
            {
                var t = parseInt(str) - 1
                return t<0?0:t
            }

            function perSecondcallBack()
            {   
                if(t.getString() == '175')
                    showTipsTTF({str:'提示:玩家' + name + '掉线了'})

                if(t.getString() == '170')
                    showTipsTTF({str:'提示:玩家' + name + '掉线了'})  

                if(t.getString() == '165')
                    showTipsTTF({str:'提示:玩家' + name + '掉线了'})              
            }

            clock.tickLabel(t, 180, 0, getStrFun, null, perSecondcallBack)
            t.setPosition( cc.p(13, 32) )
            s.addChild(t)
            
            var a = userNode.headNode.getChildByTag(100123)
            if(a)
            {   
                a.stopAllActions()
                a.removeFromParent()
            }
            userNode.headNode.addChild(s, 0, 100123)
        }
        else if(cbUserStatus == US_READY)
        {
            userNode.headIcon.color = cc.color(255, 255, 255)
            var a = userNode.headNode.getChildByTag(100123)
            if(a)
            {   
                a.stopAllActions()
                a.removeFromParent()
            }
            var s = new cc.Sprite('#cf_readyIcon.png')
            userNode.headNode.addChild(s, 0, 100123)
        }
        else
        {
            userNode.headIcon.color = cc.color(255, 255, 255)
            var a = userNode.headNode.getChildByTag(100123)
            if(a)
            {   
                a.stopAllActions()
                a.removeFromParent()
            }
        }
    },
    ///////////UserNode end/////////

    ///////////userNodeInsetChair start/////////
    _getUserNodeInsetChair:function() //和玩家数据绑定的node(和chair无关) 玩家chair换了后会先从原chair移出 再加入新的chair
    {
        var userNodeInsetChair = new cc.Node()

        //////////
        userNodeInsetChair.firedCircleNode = new cc.Node()
        userNodeInsetChair.firedCircleNode.setVisible(false)
        userNodeInsetChair.addChild(userNodeInsetChair.firedCircleNode)
        
        userNodeInsetChair.circleRope = new cc.ProgressTimer(new cc.Sprite('#cf_circleRope.png'))
        userNodeInsetChair.circleRope.type = cc.ProgressTimer.TYPE_RADIAL
        userNodeInsetChair.circleRope.setReverseDirection(true)
        userNodeInsetChair.firedCircleNode.addChild(userNodeInsetChair.circleRope)   

        userNodeInsetChair.fireNode = new cc.Node()
        var radius =  userNodeInsetChair.circleRope.getContentSize().width / 2
        userNodeInsetChair.fireNode.setPosition(cc.p(0, 0))
        userNodeInsetChair.firedCircleNode.addChild(userNodeInsetChair.fireNode)   

        ///////
        userNodeInsetChair.bankerNode = new cc.Node()    
        userNodeInsetChair.addChild(userNodeInsetChair.bankerNode)

        /////玩家离座时 如果有语音在播放需要发一个语音播放完成的事件
        userNodeInsetChair.voiceNode = new cc.Node()
        userNodeInsetChair.addChild(userNodeInsetChair.voiceNode, 100)

        /////
        userNodeInsetChair.faceNode = new cc.Node()
        userNodeInsetChair.addChild(userNodeInsetChair.faceNode, 100)

        return userNodeInsetChair
    },
    showFiredCircle:function(countTime)
    {
        var userNodeInsetChair = this
        // 进度条
        // 4段贝塞尔曲线 圆运动
        userNodeInsetChair.firedCircleNode.setVisible(true)

        var to = cc.progressFromTo(countTime, 100, 0)
        userNodeInsetChair.circleRope.runAction(to)
        var radius =  userNodeInsetChair.circleRope.getContentSize().width / 2 - 2

        //
        var fireSpr = actionFactory.getSprWithAnimate('cf_fire_', false, 0.05)
        userNodeInsetChair.fireNode.addChild(fireSpr)
        fireSpr.x = 0
        fireSpr.y = radius

        var moveto1 = cc.moveTo( countTime/8, cc.p(radius, radius) )
        var moveto2 = cc.moveTo( countTime/4, cc.p(radius, -radius) )
        var moveto3 = cc.moveTo( countTime/4, cc.p(-radius, -radius) )
        var moveto4 = cc.moveTo( countTime/4, cc.p(-radius, radius) )
        var moveto5 = cc.moveTo( countTime/8, cc.p(0, radius) )

        fireSpr.runAction( cc.sequence(moveto1, moveto2, moveto3, moveto4, moveto5 ) )
    },
    hideFiredCircle:function()
    {
        var userNodeInsetChair = this
        userNodeInsetChair.firedCircleNode.setVisible(false)
        userNodeInsetChair.circleRope.stopAllActions()
        // userNodeInsetChair.fireNode.stopAllActions()
        userNodeInsetChair.fireNode.removeAllChildren()
    },
    ///////////userNodeInsetChair end/////////
    _headIconListener:function()
    {
        var _headIconListener = cc.EventListener.create(
        {
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) 
            {
                var target = event.getCurrentTarget()
                //if(!target.getParent().getParent().getParent().isVisible()) 
                if(!isRealVisible(target))    
                    return false
                
                var locationInNode = target.convertToNodeSpace(touch.getLocation())
                var s = target.getContentSize();
                var rect = cc.rect(-20, -20, s.width+40, s.height+40)// 小尺寸屏幕太难点中了
                if (cc.rectContainsPoint(rect, locationInNode)) {
                    return true
                }
                return false
            },
            onTouchEnded: function (touch, event) 
            {   
                var target = event.getCurrentTarget()
                var node = headIconPop.getPop(target.dwUserID)
                node.setPosition( cc.p( uiController.uiTop.getContentSize().width * 0.5, uiController.uiTop.getContentSize().height * 0.5) )
                uiController.uiTop.addChild(node)
            }
        })

        return _headIconListener     
    },
    isRight:function(chairNode)
    {   
        return chairNode.getPositionX() > tableNode.uiChair.getContentSize().width*0.51
    }
}
