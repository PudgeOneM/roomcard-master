
//表情+快捷语音
var facePop2 = 
{
    resp:'components/facePop2/res/',
    width:96+10,
    height:96+10,
    pop:null,
    pageCount:2,
    pageBtns:[],
    pageNodes:[],
    voiceArray:[],
    lastSendTime:0,
    getPreLoadRes:function()
    {
        var resp = facePop2.resp
        
        return [
            resp + 'animationFace.plist', 
            resp + 'animationFace.png',
            resp + 'pageBtn0_1.png',
            resp + 'pageBtn0_2.png',
            resp + 'pageBtn1_1.png',
            resp + 'pageBtn1_2.png',
            resp + 'chatBg1.png',
            resp + 'chatBg2.png',
        ]
    },
    onPreLoadRes:function()
    {
        var resp = facePop2.resp
        cc.spriteFrameCache.addSpriteFrames(resp + 'animationFace.plist', resp + 'animationFace.png')
    },
    onReStart:function()
    {  
        facePop2.pop = null
    },
    getFaceButton:function(uc_faceIdArray, uc_voiceArray, rowNum, lineNum)
    {  
        var self = this
        var resp = facePop2.resp
        self.voiceArray = uc_voiceArray
        
        var button = new ccui.Button( resp + 'btn1.png', resp + 'btn2.png' )
        button.setTouchEnabled(true)
        button.addClickEventListener(function(button) {
            managerAudio.playEffect('publicRes/sound/click.mp3')
            if(!facePop2.pop)
            {
                var pop =  facePop2.getPop(uc_faceIdArray, rowNum, lineNum)
                pop.setPosition( cc.p( uiController.uiTop.getContentSize().width * 0.5, uiController.uiTop.getContentSize().height * 0.5) )
                uiController.uiTop.addChild(pop)
                facePop2.pop = pop

                // var t = pop.onExit
                // pop.onExit = function()
                // {
                //     t.apply(pop)
                //     facePop2.pop = null
                // }
            }
            facePop2.pop.setVisible(true)
        }.bind(this))

        var l = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "userFace",
            callback: function(event)
            {   
                var data = event.getUserData()
                var user = data[0]
                var faceId = data[1]

                cocos.clearTimeout(user.userNodeInsetChair.faceNode.hideCommonVoiceId)

                if ( faceId < 1000 )
                {
                    var spr = actionFactory.getSprWithAnimate('face' + (faceId) + '_', true, null, null, null, 2)
                    var user = tableData.getUserWithUserId(user.dwUserID)
                    user.userNodeInsetChair.faceNode.removeAllChildren()
                    user.userNodeInsetChair.faceNode.addChild(spr)
                }
                else
                {
                    self.showCommonVoice(user, faceId)
                }
            }
        })
        cc.eventManager.addListener(l, 1)

        return button
    },
    getPop:function(uc_faceIdArray, rowNum, lineNum)
    {  
        var self = this
        var selfUser = tableData.getUserWithUserId(selfdwUserID)

        var pop = new cc.Node()
        //var pop = new cc.LayerColor(cc.color(144,144,144))
        pop.ignoreAnchorPointForPosition(false)
        pop.setAnchorPoint( cc.p(0.5, 0.5) )

        var width = rowNum * this.width
        var height = lineNum * this.height

        if(uc_faceIdArray.length > rowNum*lineNum)
            height = height + 30

        pop.setContentSize( width, height) 

        var bg = new cc.Scale9Sprite('s_sp9_15.png')
        bg.width = width + 10
        bg.height = height + 20
        bg.x = width/2
        bg.y = height/2
        bg.anchorX = 0.5
        bg.anchorY = 0.5
        pop.addChild(bg, -1, 10)

        //page----------------
        var onClickPageBtn = function(pageBtn)
        {
            for ( var i = 0; i < self.pageCount; i++ )
            {
                if ( self.pageBtns[i].index == pageBtn.index )
                {
                    var btnRes = self.resp + 'pageBtn' + i + '_2.png'
                    self.pageBtns[i].loadTextures(btnRes, btnRes)
                    self.pageNodes[i].setVisible(true)   
                } 
                else
                {
                    var btnRes = self.resp + 'pageBtn' + i + '_1.png'
                    self.pageBtns[i].loadTextures(btnRes, btnRes)
                    self.pageNodes[i].setVisible(false)   
                } 
            }
        }

        for ( var i = 0; i < this.pageCount; i++ )
        {
            var btnRes = this.resp + 'pageBtn' + i + '_1.png'
            var pageBtn = new ccui.Button(btnRes, btnRes)
            pageBtn.x = 1.5
            pageBtn.setAnchorPoint( cc.p(1, 1) )
            var pageBtnHeight = pageBtn.height + 1
            //pageBtn.y = (height - this.pageCount * pageBtnHeight ) / 2 + (this.pageCount - i - 0.5) * pageBtnHeight
            pageBtn.y = height - 20 - i * pageBtnHeight
            pageBtn.index = i
            pop.addChild(pageBtn)
            this.pageBtns[i] = pageBtn;

            pageBtn.addClickEventListener(function(pageBtn) {
                onClickPageBtn(pageBtn)
            }.bind(this))

            var pageNode = new cc.Node()
            pageNode.ignoreAnchorPointForPosition(false)
            pageNode.setAnchorPoint( cc.p(0.5, 0.5) )
            pageNode.x = width/2
            pageNode.y = height/2
            pageNode.setContentSize(width, height) 
            pop.addChild(pageNode)
            this.pageNodes[i] = pageNode
        }

        onClickPageBtn(this.pageBtns[0])

        //快捷语音页------------
        var listView_Voice = new ccui.ListView()
        listView_Voice.setDirection(ccui.ScrollView.DIR_VERTICAL)
        listView_Voice.setTouchEnabled(true)
        listView_Voice.setBounceEnabled(true)
        listView_Voice.setBackGroundImage(resp_p.empty)
        listView_Voice.setBackGroundImageScale9Enabled(true)
        listView_Voice.setGravity(ccui.ListView.GRAVITY_CENTER_HORIZONTAL)
        listView_Voice.setContentSize(width, height)
        listView_Voice.x = 0
        listView_Voice.y = 0
        listView_Voice.setItemsMargin(3)
        this.pageNodes[0].addChild(listView_Voice)

        for( var i = 0; i < self.voiceArray.length; i++ )
        {
            var voiceText = ''
            if ( this.voiceArray[i].text )
                voiceText = this.voiceArray[i].text
            else if ( selfUser.cbGender )
                voiceText = this.voiceArray[i].manText
            else
                voiceText = this.voiceArray[i].womanText

            var btn = new ccui.Button(this.resp + 'btn3.png')
            btn.setScale9Enabled(true)
            btn.setTitleFontSize(20)
            btn.width = width - 60
            btn.height = 40
            btn.setTitleText(voiceText)
            btn.index = i

            listView_Voice.pushBackCustomItem(btn)

            btn.addClickEventListener(function(btn) {
                self._sendExpression(btn.index + 1 + 1000)
            }.bind(this))
        }

        //表情页----------------
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
        this.pageNodes[1].addChild(listView)

        for(var i=0;;i++)
        {
            if(uc_faceIdArray.length == 0)
                break
            var s = uc_faceIdArray.splice(0, Math.min(rowNum, uc_faceIdArray.length))
            listView.pushBackCustomItem( facePop2._getOneLineFaceItem( 
                {
                    faceIds:s
                } ) )
        }
        listView.forceDoLayout()

        listView.setTouchEnabled(listView.getItem(0) && listView.getItem(0).getPositionY()+listView.getItem(0).getContentSize().height>listView.height)
        
        //////////
        var listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget()
                var locationInNode = target.convertToNodeSpace(touch.getLocation())
                var rect = cc.rect(0, 0, target.getContentSize().width, target.getContentSize().height)
                var isTouchInNode = cc.rectContainsPoint(rect, locationInNode)
                
                if (isTouchInNode) {
                    return false
                }
                
                return true
            },
            onTouchEnded: function (touch, event) { 
                facePop2.pop.setVisible(false)
            }
        })
        cc.eventManager.addListener(listener, pop)

        return pop
    },
    _getOneLineFaceItem:function(params)
    {
        var default_item = new ccui.Layout()
        default_item.setContentSize(106*3, 106)
        
        var faceIds = params.faceIds

        for(var i=0;i<faceIds.length;i++)
        {
            var faceId = faceIds[i]
            var btn = facePop2._getFaceBtn(faceId, params.callback)
            btn.setPosition( cc.p( facePop2.width/2 + i*facePop2.width, facePop2.height/2 ) )
            default_item.addChild(btn)
        }

        return default_item
    },
    _getFaceBtn:function(faceId, callback)
    {
        var self = this
        var resp = faceId>100?'gameRes/pic/':facePop2.resp //公共表情最多100个
        
        var res =  resp + 'face' + faceId + '.png'
        var btn = new ccui.Button( res, res )
        btn.setTouchEnabled(true)
        btn.addClickEventListener(function(btn) {
            self._sendExpression(faceId)
            callback?callback():''
        }.bind(this))

        return btn
    },
    _sendExpression:function(faceId)
    {
        var nowTime = new Date().getTime()
        if ( nowTime - this.lastSendTime < 2000 )
        {
            showTipsTTF({str:'发送太频繁'}) 
        }
        else
        {
            this.lastSendTime = nowTime
            var UserExpression = getObjWithStructName('CMD_GF_C_UserExpression')
            UserExpression.wItemIndex = faceId-1
            UserExpression.dwTargetUserID = ''
            socket.sendMessage(MDM_GF_FRAME,SUB_GF_USER_EXPRESSION,UserExpression)
        }

        this.pop.setVisible(false)
    },
    showCommonVoice:function(user, voiceIndex)
    {
        var chair = tableData.getChairWithServerChairId(user.wChairID)
        voiceIndex -= 1 + 1000

        var hideCommonVoice = function()
        {
            user.userNodeInsetChair.faceNode.removeAllChildren()
        }

        hideCommonVoice()

        var bRight = chairFactory.isRight(chair.node)
        var bg
        if ( bRight ) 
            bg = new cc.Scale9Sprite(this.resp + 'chatBg2.png', cc.rect(0, 0, 54, 68), cc.rect(10, 34, 7, 7))
        else
            bg = new cc.Scale9Sprite(this.resp + 'chatBg1.png', cc.rect(0, 0, 54, 68), cc.rect(30, 34, 7, 7))
        
        bg.anchorX = 0
        user.userNodeInsetChair.faceNode.addChild(bg)

        var voiceText = ''
        if ( this.voiceArray[voiceIndex].text )
            voiceText = this.voiceArray[voiceIndex].text
        else if ( user.cbGender )
            voiceText = this.voiceArray[voiceIndex].manText
        else
            voiceText = this.voiceArray[voiceIndex].womanText

        var voiceTextNode = cc.LabelTTF.create('', "Helvetica", 16)
        voiceTextNode.setFontFillColor( cc.color(244, 230, 159) )
        voiceTextNode.setString(voiceText)
        voiceTextNode.anchorX = 0
        voiceTextNode.anchorY = 0
        voiceTextNode.x = 20
        bg.addChild(voiceTextNode)

        bg.width = voiceTextNode.width + voiceTextNode.x * 2
        bg.height = voiceTextNode.height + 40
        bg.y = 0

        if ( bRight ) 
        {
           bg.x = -(user.userNodeInsetChair.circleRope.width / 2 + bg.width)
           bg.anchorY = 1
           voiceTextNode.y = 12
        }
        else
        {
            bg.x = user.userNodeInsetChair.circleRope.width / 2
            bg.anchorY = 0
            voiceTextNode.y = 25
        }

        var soundId = this.voiceArray[voiceIndex].soundId
        if( user.cbGender )
            managerAudio.playEffect('gameRes/sound/commonVoice/man/commonVoice' + soundId + '.mp3')
        else
            managerAudio.playEffect('gameRes/sound/commonVoice/woman/commonVoice' + soundId + '.mp3')

        user.userNodeInsetChair.faceNode.hideCommonVoiceId = cocos.setTimeout(hideCommonVoice, 3000)
    }
}












