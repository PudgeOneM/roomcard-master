var replenishScorePop = 
{   
    lastReplenishScoreTime:null,
    resp:'components/replenishScorePop/res/',
    getPreLoadRes:function()
    {
        var resp = replenishScorePop.resp

        return [
            resp + 'replenishScorePop.plist', 
            resp + 'replenishScorePop.png'
        ]
    },
    onPreLoadRes:function()
    {
        var resp = replenishScorePop.resp
        cc.spriteFrameCache.addSpriteFrames(resp + 'replenishScorePop.plist', resp + 'replenishScorePop.png')
    },
    onReStart:function()
    {
        // cc.eventManager.removeCustomListeners('replenish_apply')
    },
    getPop:function(totalScore, minGetScore, callY, callN)
    {   
        var control = {}
        control.sureCall = function()
        {
            if(control.scoreLabel1.getString()!='0')
            {
                replenishScorePop.lastReplenishScoreTime = new Date().getTime()

                var AddScore = getObjWithStructName('CMD_GR_AddScore') 
                AddScore.lAddScore = control.scoreLabel1.getString()
                AddScore.szTableKey = tableKey
                socket.sendMessage(MDM_GR_USER, SUB_GR_USER_ADD_SCORE, AddScore)

                node.removeFromParent()

                tableData.ADD_SCORE_NOTIFY_FUN = callY

                if( selfdwUserID != tableData.managerUserID )  
                    showTipsTTF({str:'补分申请已提交'}) 
                //callY?callY():''
            }
        }
        var node = cc.BuilderReader.load('components/replenishScorePop/res/replenishScorePop.ccbi', control)

        var lastcd = replenishScorePop.lastReplenishScoreTime?30 - Math.ceil( (new Date().getTime() - replenishScorePop.lastReplenishScoreTime)/1000 ):0
        if( lastcd <=0 )
        {
            control.sureLabel.setString( '确定买入' )
            control.sureBtn.setEnabled(true) 
        }
        else
        {
            control.sureBtn.setEnabled(false) 
            control.sureLabel.setString( '确定买入(' + (lastcd<10?'0'+lastcd:lastcd) + ')' ) 
            var id = window.setInterval(function()
            {   
                lastcd = lastcd - 1
                control.sureLabel.setString( '确定买入(' + (lastcd<10?'0'+lastcd:lastcd) + ')' ) 
                if(lastcd == 0)
                {   
                    window.clearInterval(id)
                    control.sureLabel.setString( '确定买入' )
                    control.sureBtn.setEnabled(true) 
                }
            }, 1000)

            var t = node.onExit
            node.onExit = function()
            {
                t.apply(node)
                window.clearInterval(id)
            }
        }

        //
        var maxTimes = tableData.wMaxTimes
        //var maxTimes = Math.min( Math.floor(totalScore*0.9/minGetScore), tableData.wMaxTimes )

        replenishScorePop._refresh.call(control, totalScore, minGetScore, Math.min(1, maxTimes), maxTimes)  
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
                return false
            },
            onTouchMoved: function (touch, event) {
                var target = event.getCurrentTarget()
                var delta = touch.getDelta()
                
                if(gameorientation == 'portrait')
                    var offset = delta.x
                else if(gameorientation == 'landscape')
                    var offset = - delta.y

                var pos = control.barSpr.getPositionX() + offset
                var maxpos = control.progressBarNode.getContentSize().width
                pos = pos<0?0:pos
                pos = pos>maxpos?maxpos:pos
                control.barSpr.setPositionX(pos)

                var times = Math.ceil(pos/maxpos * maxTimes)
                var getScore = times * minGetScore
                //var cutScore = Math.floor(getScore * 0.1)
                //var lastScore = totalScore - getScore - cutScore

                control.scoreLabel1.setString(getScore)
                //control.scoreLabel2.setString(lastScore)
                //control.scoreLabel3.setString(cutScore)
            },
            onTouchEnded: function (touch, event) {
                var target = event.getCurrentTarget()
            }
        })
        cc.eventManager.addListener(listener, control.barSpr)


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
                return false
            },
            onTouchEnded: function (touch, event) {
                node.removeFromParent()
                callN?callN():''
            }
        })
        cc.eventManager.addListener(listener, control.closeIcon)


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
                callN?callN():''
                return false
            },
            onTouchEnded: function (touch, event) {
                // node.removeFromParent()
                // callN?callN():''
            }
        })
        cc.eventManager.addListener(listener, node)
        
        if(gameorientation == 'landscape')
            node.setScale(0.8)
        return node
    },
    _refresh:function(totalScore, minGetScore, times, maxTimes)
    {   
        if(times>maxTimes)
            times = maxTimes

        var maxX = this.progressBarNode.getContentSize().width
        this.barSpr.setPositionX(maxTimes>0?times/maxTimes * maxX:0)

        var getScore = times * minGetScore
        //var cutScore = Math.floor(getScore * 0.1)
        //var lastScore = totalScore - getScore - cutScore

        this.scoreLabel1.setString(getScore)
        //this.scoreLabel2.setString(lastScore)
        //this.scoreLabel3.setString(cutScore)
    },
    popReplenishApply:function(wApplicantID, lAddScore, dwOpenID)
    {
        var event = new cc.EventCustom("replenish_apply")
        event.setUserData([wApplicantID, lAddScore, dwOpenID])
        cc.eventManager.dispatchEvent(event)
    },
    popReplenishScore:function(c1, c2)
    {
        var self = tableData.getUserWithUserId(selfdwUserID)
        var totalScore = self.lScore
        var minGetScore = tableData.lTakeInScore 
        var node = replenishScorePop.getPop(totalScore, minGetScore, c1, c2)
        node.setPosition( cc.p( uiController.uiTop.getContentSize().width * 0.5, uiController.uiTop.getContentSize().height * 0.5) )
        uiController.uiTop.addChild(node)
    },
}