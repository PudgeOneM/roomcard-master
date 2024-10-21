
var chatPop = 
{
    resp:'components/chatPop/res/',
    pop:null,
    faceNameArray:[],//这个数组下标有意义(itemIndex)
    talkNameArray:[],
    getPreLoadRes:function()
    {
        var resp = chatPop.resp

        return [
            resp + 'chatPop.plist', 
            resp + 'chatPop.png'
        ]
    },
    onPreLoadRes:function()
    {
        var resp = chatPop.resp
        cc.spriteFrameCache.addSpriteFrames(resp + 'chatPop.plist', resp + 'chatPop.png')
    },
    onReStart:function()
    {  
        chatPop.pop = null
    },
    getChatButton:function()
    {  
        var resp = chatPop.resp
        
        var button = new ccui.Button( resp + 'btn1.png', resp + 'btn2.png' )
        button.setTouchEnabled(true)
        button.addClickEventListener(function(button) {
            managerAudio.playEffect('publicRes/sound/click.mp3')
            if(!chatPop.pop)
            {
                var pop =  chatPop.getPop()
                pop.setPosition( cc.p( uiController.uiTop.getContentSize().width * 0.5, uiController.uiTop.getContentSize().height * 0.5) )
                uiController.uiTop.addChild(pop)
                chatPop.pop = pop

                // var t = pop.onExit
                // pop.onExit = function()
                // {
                //     t.apply(pop)
                //     chatPop.pop = null
                // }
            }
            chatPop.pop.setVisible(true)
        }.bind(this))

        return button
    },
    getPop:function()
    {  
        var resp = chatPop.resp
        var pop  = cc.BuilderReader.load(resp + 'chatPop.ccbi', chatPop)

        chatPop._initFaceNode()
        chatPop._initTalkNode()
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
                chatPop.pop.setVisible(false)
            }
        })
        cc.eventManager.addListener(listener, pop)

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
                chatPop.facelight.setVisible(true)
                chatPop.talklight.setVisible(false)
                chatPop.facenode.setVisible(true)
                chatPop.talknode.setVisible(false)
            }
        })
        cc.eventManager.addListener(listener, chatPop.facelight)

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
                chatPop.facelight.setVisible(false)
                chatPop.talklight.setVisible(true)
                chatPop.facenode.setVisible(false)
                chatPop.talknode.setVisible(true)
            }
        })
        cc.eventManager.addListener(listener, chatPop.talklight)

        return pop
    },
    _initFaceNode:function()
    {
        var faceIdArray = clone(chatPop.faceIdArray)  

        var listView = new ccui.ListView()
        listView.setDirection(ccui.ScrollView.DIR_VERTICAL)
        listView.setTouchEnabled(true)
        listView.setBounceEnabled(true)
        // listView.setScrollBarEnabled(false)
        listView.setBackGroundImage(resp_p.empty)
        listView.setBackGroundImageScale9Enabled(true)

        listView.setContentSize(chatPop.facenode.width, chatPop.facenode.height)
        listView.x = 0
        listView.y = 0
        chatPop.facenode.addChild(listView)


        for(var i=0;i<chatPop.faceNameArray.length;i+=5)
        {
            var faceNames = chatPop.faceNameArray.slice(i, Math.min(i+5, chatPop.faceNameArray.length))
            var faceItemIndexs = [i, i+1, i+2, i+3, i+4]
            listView.pushBackCustomItem( chatPop._getOneLineFaceItem(faceNames, faceItemIndexs))
        }

        listView.forceDoLayout()

        listView.setTouchEnabled(listView.getItem(0) && listView.getItem(0).getPositionY()+listView.getItem(0).getContentSize().height>listView.height)
    },
    _getOneLineFaceItem:function(faceNames, faceItemIndexs)
    {
        var default_item = new ccui.Layout()
        default_item.setContentSize(650, 130)
        
        for(var i=0;i<faceNames.length;i++)
        {
            var faceName = faceNames[i]
            var faceItemIndex = faceItemIndexs[i]
            var btn = chatPop._getFaceBtn(faceName, faceItemIndex)
            btn.setPosition( cc.p( 65 + i*130, 65 ) )
            default_item.addChild(btn)
        }

        return default_item
    },
    _getFaceBtn:function(faceName, faceItemIndex)
    {        
        var res = 'gameRes/pic/chatPop/face' + faceName + '.png'
        var btn = new ccui.Button( res, res )
        btn.setTouchEnabled(true)
        btn.addClickEventListener(function(btn) {
            var UserExpression = getObjWithStructName('CMD_GF_C_UserExpression')
            UserExpression.wItemIndex = faceItemIndex
            UserExpression.dwTargetUserID = ''
            socket.sendMessage(MDM_GF_FRAME,SUB_GF_USER_EXPRESSION,UserExpression)
            chatPop.pop.setVisible(false)
        }.bind(this))

        return btn
    },
    _initTalkNode:function()
    {
        var listView = new ccui.ListView()
        listView.setDirection(ccui.ScrollView.DIR_VERTICAL)
        listView.setTouchEnabled(true)
        listView.setBounceEnabled(true)
        // listView.setScrollBarEnabled(false)
        listView.setBackGroundImage(resp_p.empty)
        listView.setBackGroundImageScale9Enabled(true)

        listView.setContentSize(chatPop.talknode.width, chatPop.talknode.height)
        listView.x = 0
        listView.y = 0
        chatPop.talknode.addChild(listView)

        for(var i=0;i<chatPop.talkNameArray.length;i++)
        {
            var talkName = chatPop.talkNameArray[i]
            var talkItemIndex = i
            listView.pushBackCustomItem( chatPop._getOneLineTalkItem( talkName, talkItemIndex ) )
        }
        listView.forceDoLayout()
        listView.setTouchEnabled(listView.getItem(0) && listView.getItem(0).getPositionY()+listView.getItem(0).getContentSize().height>listView.height)
    },
    _getOneLineTalkItem:function(talkName, talkItemIndex)
    {
        var default_item = new ccui.Layout()
        default_item.setContentSize(650, 60)
        
        var resp = chatPop.resp
        var btn = new ccui.Button( resp+'talkBtn.png', resp+'talkBtn.png' )
        btn.x = 325
        btn.y = 30
        btn.setTouchEnabled(true)
        btn.addClickEventListener(function(btn) {
            var UserExpression = getObjWithStructName('CMD_GF_C_UserExpression')
            UserExpression.wItemIndex = talkItemIndex+1000
            UserExpression.dwTargetUserID = ''
            socket.sendMessage(MDM_GF_FRAME,SUB_GF_USER_EXPRESSION,UserExpression)
            chatPop.pop.setVisible(false)
        }.bind(this))

        default_item.addChild(btn)

        var label = cc.LabelTTF.create(talkName, "Helvetica", 28)
        label.color = cc.color(233, 233, 233)
        label.x = 325
        label.y = 26
        default_item.addChild(label)

        return default_item
    },
}












