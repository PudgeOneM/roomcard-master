
var facePop = 
{
    resp:'components/facePop/res/',
    width:96+10,
    height:96+10,
    pop:null,
    preLoadRes:
    [
    'components/facePop/res/animationFace.plist', 
    'components/facePop/res/animationFace.png'
    ],
    onPreLoadRes:function()
    {
        var resp = facePop.resp
        cc.spriteFrameCache.addSpriteFrames(resp + 'animationFace.plist', resp + 'animationFace.png')
    },
    onReStart:function()
    {  
        facePop.pop = null
    },
    getFaceButton:function(uc_faceIdArray, rowNum, lineNum)
    {  
        var resp = facePop.resp
        
        var button = new ccui.Button( resp + 'btn1.png', resp + 'btn2.png' )
        button.setTouchEnabled(true)
        button.addClickEventListener(function(button) {
            managerAudio.playEffect('publicRes/sound/click.mp3')
            if(!facePop.pop)
            {
                var pop =  facePop.getPop(uc_faceIdArray, rowNum, lineNum)
                pop.setPosition( cc.p( uiController.uiTop.getContentSize().width * 0.5, uiController.uiTop.getContentSize().height * 0.5) )
                uiController.uiTop.addChild(pop)
                facePop.pop = pop

                // var t = pop.onExit
                // pop.onExit = function()
                // {
                //     t.apply(pop)
                //     facePop.pop = null
                // }
            }
            facePop.pop.setVisible(true)
        }.bind(this))


        var l = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "userFace",
            callback: function(event)
            {   
                var data = event.getUserData()
                var user = data[0]
                var faceId = data[1]

                var spr = actionFactory.getSprWithAnimate('face' + (faceId) + '_', true, null, null, null, 2)
                var user = tableData.getUserWithUserId(user.dwUserID)
                user.userNodeInsetChair.faceNode.removeAllChildren()
                user.userNodeInsetChair.faceNode.addChild(spr)
            }
        })
        cc.eventManager.addListener(l, 1)

        return button
    },
    getPop:function(uc_faceIdArray, rowNum, lineNum)
    {  
        var pop = new cc.Node()
        //var pop = new cc.LayerColor(cc.color(144,144,144))
        pop.ignoreAnchorPointForPosition(false)
        pop.setAnchorPoint( cc.p(0.5, 0.5) )

        var width = rowNum * facePop.width
        var height = lineNum * facePop.height

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
            if(uc_faceIdArray.length == 0)
                break
            var s = uc_faceIdArray.splice(0, Math.min(rowNum, uc_faceIdArray.length))
            listView.pushBackCustomItem( facePop._getOneLineFaceItem( 
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
                facePop.pop.setVisible(false)
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
            var btn = facePop._getFaceBtn(faceId, params.callback)
            btn.setPosition( cc.p( facePop.width/2 + i*facePop.width, facePop.height/2 ) )
            default_item.addChild(btn)
        }

        return default_item
    },
    _getFaceBtn:function(faceId, callback)
    {
        var resp = faceId>100?'gameRes/pic/':facePop.resp //公共表情最多100个
        
        var res =  resp + 'face' + faceId + '.png'
        var btn = new ccui.Button( res, res )
        btn.setTouchEnabled(true)
        btn.addClickEventListener(function(btn) {
            var UserExpression = getObjWithStructName('CMD_GF_C_UserExpression')
            UserExpression.wItemIndex = faceId-1
            UserExpression.dwTargetUserID = ''
            socket.sendMessage(MDM_GF_FRAME,SUB_GF_USER_EXPRESSION,UserExpression)
            facePop.pop.setVisible(false)
            callback?callback():''
        }.bind(this))

        return btn
    }
}












