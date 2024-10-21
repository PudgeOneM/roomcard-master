
var menuSide = 
{
    resp:'components/menuSide/res/',
    getPreLoadRes:function()
    {
        var resp = menuSide.resp

        return [
            resp + 'menuSide.plist', 
            resp + 'menuSide.png'
        ]
    },
    onPreLoadRes:function()
    {
        var resp = menuSide.resp
        cc.spriteFrameCache.addSpriteFrames(resp + 'menuSide.plist', resp + 'menuSide.png')
    },
    parentNode:null,
    itemIds:[],
    itemNodes:[],
    itemBtns:[],
    itemNamesMap:[
    '',
    '站起围观',
    '房主功能',
    '牌型提示',
    '上局回顾',
    '邀请好友',
    '返回大厅',
    '游戏规则',
    '玩家设置',
    ],
    itemHight:100,
    itemWidth:300,
    menuSideNode:null,
    menuSideBtn:null,
    init:function(parentNode, itemIds)
    {   
        menuSide.parentNode = parentNode
        menuSide.itemIds = itemIds
        ////
        menuSide._initSide()
        menuSide.parentNode.addChild(menuSide.menuSideNode)
        menuSide.menuSideNode.setVisible(false)    

        //////
        var resp = menuSide.resp
        var menuSideBtn = new ccui.Button( resp + 'btn1.png', resp + 'btn2.png' )
        menuSideBtn.setTouchEnabled(true)
        menuSideBtn.addClickEventListener(function(button) {
            managerAudio.playEffect('publicRes/sound/click.mp3')
            menuSide.menuSideNode.setVisible(true)
            if(menuSide.itemBtns[2])
                menuSide.itemBtns[2].title.color = tableData.managerUserID == selfdwUserID?cc.color(255,255,255):cc.color(150,150,150)

        }.bind(this))

        menuSide.menuSideBtn = menuSideBtn
    },
    _initSide:function() 
    {   
        var parentNode = menuSide.parentNode
        var itemIds = menuSide.itemIds

        var s = parentNode.getContentSize()
        var sideWidth = menuSide.itemWidth
        var sideHeight = menuSide.itemHight * itemIds.length

        var menuSideNode = new cc.Node()
        menuSideNode.setContentSize( sideWidth, sideHeight)
        menuSideNode.setAnchorPoint(cc.p(0, 1))
        menuSideNode.setPositionY(s.height)
        parentNode.addChild(menuSideNode)
        ///
        var bg = new cc.Scale9Sprite('ms_sp9_13.png')
        bg.width = sideWidth
        bg.height = sideHeight
        bg.x = sideWidth/2
        bg.y = sideHeight/2
        bg.anchorX = 0.5
        bg.anchorY = 0.5
        menuSideNode.addChild(bg, -1, 10)

        for(var i=0;i<itemIds.length;i++)
        {
            var id = itemIds[i]
            menuSide.itemBtns[id] = menuSide.getItemBtnNode(id)
            menuSide.itemBtns[id].setPositionY( sideHeight - menuSide.itemHight*(i+1) )
            menuSideNode.addChild(menuSide.itemBtns[id])
            
            menuSide.initItem(id)
        }

        var listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget()
                if(!target.isVisible()) return false
                var locationInNode = target.convertToNodeSpace(touch.getLocation())
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height)
                if (cc.rectContainsPoint(rect, locationInNode)) {
                    return true
                }
                menuSideNode.setVisible(false)
                return false
            },
            onTouchEnded: function (touch, event) {
                var target = event.getCurrentTarget()
                var locationInNode = target.convertToNodeSpace(touch.getLocation())

                var idx = Math.floor( (target.getContentSize().height-locationInNode.y)/menuSide.itemHight )
                var id = itemIds[idx]
                menuSide.onTouchItem(id)
            }
        })
        cc.eventManager.addListener(listener, menuSideNode)

        menuSide.menuSideNode = menuSideNode
    },
    getItemBtnNode:function(itemId)
    {
        var resp = menuSide.resp

        var itemBtnNode = new cc.Node()
        itemBtnNode.setContentSize( menuSide.itemWidth, menuSide.itemHight)

        var icon = new cc.Sprite( resp + 'icon_' + itemId + '.png')
        icon.setPosition(cc.p(50, menuSide.itemHight/2))
        itemBtnNode.addChild(icon)

        var title = new cc.LabelTTF(menuSide.itemNamesMap[itemId], "Helvetica", 25)
        title.setAnchorPoint(cc.p(0, 0.5))
        title.setPosition(cc.p(120, menuSide.itemHight/2))
        itemBtnNode.addChild(title)

        itemBtnNode.title = title

        return itemBtnNode
    },
    initItem:function(itemId)
    {
        var parentNode = menuSide.parentNode
        var itemIds = menuSide.itemIds
        var resp = menuSide.resp
        switch(itemId)
        {
            case 3: //牌型提示
            {
                var console = {}
                var win = cc.director._winSizeInPoints
                var s = parentNode.getContentSize()
                cc.director._winSizeInPoints = cc.size(s.width, s.height)
                var node = cc.BuilderReader.load(resp + 'tips.ccbi', console)
                cc.director._winSizeInPoints = cc.size(win.width, win.height)

                var listener = cc.EventListener.create({
                    event: cc.EventListener.TOUCH_ONE_BY_ONE,
                    swallowTouches: true,
                    onTouchBegan: function (touch, event) {
                        var target = event.getCurrentTarget()
                        if(!target.isVisible()) return false
                        var locationInNode = target.convertToNodeSpace(touch.getLocation())
                        var s = target.getContentSize();
                        var rect = cc.rect(0, 0, s.width, s.height)
                        if (cc.rectContainsPoint(rect, locationInNode)) {
                            return true
                        }
                        node.setVisible(false)
                        return false
                    },
                    onTouchEnded: function (touch, event) {
                    }
                })
                cc.eventManager.addListener(listener, node)

                node.setVisible(false)
                parentNode.addChild(node)

                console.node = node
                menuSide.itemNodes[3] = console
                break
            }
            case 4: //上局回顾
            {
                var console = {}
                var win = cc.director._winSizeInPoints
                var s = parentNode.getContentSize()
                cc.director._winSizeInPoints = cc.size(s.width, s.height)
                var node = cc.BuilderReader.load(resp + 'last.ccbi', console)
                cc.director._winSizeInPoints = cc.size(win.width, win.height)

                var listener = cc.EventListener.create({
                    event: cc.EventListener.TOUCH_ONE_BY_ONE,
                    swallowTouches: true,
                    onTouchBegan: function (touch, event) {
                        var target = event.getCurrentTarget()
                        if(!target.isVisible()) return false
                        var locationInNode = target.convertToNodeSpace(touch.getLocation())
                        var s = target.getContentSize();
                        var rect = cc.rect(0, 0, s.width, s.height)
                        if (cc.rectContainsPoint(rect, locationInNode)) {
                            return true
                        }
                        node.setVisible(false)
                        return false
                    },
                    onTouchEnded: function (touch, event) {
                    }
                })
                cc.eventManager.addListener(listener, node)

                node.setVisible(false)
                parentNode.addChild(node)

                console.node = node
                menuSide.itemNodes[4] = console
                break
            }
            case 7://游戏规则
            {
                var console = {}
                var win = cc.director._winSizeInPoints
                var s = parentNode.getContentSize()
                cc.director._winSizeInPoints = cc.size(s.width, s.height)
                var node = cc.BuilderReader.load(resp + 'rule.ccbi', console)
                cc.director._winSizeInPoints = cc.size(win.width, win.height)

                var listener = cc.EventListener.create({
                    event: cc.EventListener.TOUCH_ONE_BY_ONE,
                    swallowTouches: true,
                    onTouchBegan: function (touch, event) {
                        var target = event.getCurrentTarget()
                        if(!target.isVisible()) return false
                        var locationInNode = target.convertToNodeSpace(touch.getLocation())
                        var s = target.getContentSize();
                        var rect = cc.rect(0, 0, s.width, s.height)
                        if (cc.rectContainsPoint(rect, locationInNode)) {
                            return true
                        }
                        node.setVisible(false)
                        return false
                    },
                    onTouchEnded: function (touch, event) {
                    }
                })
                cc.eventManager.addListener(listener, node)

                node.setVisible(false)
                parentNode.addChild(node)

                console.node = node
                menuSide.itemNodes[7] = console

                break
            }

        }
    },
    onTouchItem:function(itemId)
    {
        switch(itemId)
        {
            case 1:
            {
                menuSide.menuSideNode.setVisible(false)    
                var lookon = getObjWithStructName('CMD_GR_UserLookon') 
                lookon.wTableID = tableData.getUserWithUserId(selfdwUserID).wTableID
                socket.sendMessage(MDM_GR_USER, SUB_GR_USER_LOOKON, lookon)
                break
            }
            case 2:
            {   
                if(tableData.managerUserID != selfdwUserID)
                    return;
                menuSide.menuSideNode.setVisible(false)    
                var node = roomOwnerPop.getPop(tableData.bIsControlOpen, tableData.wMaxTimes)
                node.setPosition( cc.p( uiController.uiTop.getContentSize().width * 0.5, uiController.uiTop.getContentSize().height * 0.5) )
                uiController.uiTop.addChild(node)
                break
            }
            case 3:
            {
                menuSide.menuSideNode.setVisible(false)    
                menuSide.itemNodes[3].node.setVisible(true)
                break
            }
            case 4:
            {
                menuSide.menuSideNode.setVisible(false)    
                menuSide.itemNodes[4].node.setVisible(true)
                break
            }
            case 5:
            {   
                menuSide.menuSideNode.setVisible(false)    

                var node = sharePop.getPop()
                node.setPosition( cc.p( uiController.uiTop.getContentSize().width * 0.5, uiController.uiTop.getContentSize().height * 0.5) )
                uiController.uiTop.addChild(node)
                break
            }
            case 6:
            {
                // var UserStandUp = getObjWithStructName('CMD_GR_UserStandUp')
                // UserStandUp.wTableID = tableData.getUserWithUserId(selfdwUserID).wTableID
                // UserStandUp.wChairID = tableData.getUserWithUserId(selfdwUserID).wChairID || ''
                // UserStandUp.cbForceLeave = true
                // socket.sendMessage(MDM_GR_USER, SUB_GR_USER_STANDUP, UserStandUp) 
                goHref(appendRefreshtime(hallAddress))
                break
            }
            case 7:
            {   
                menuSide.menuSideNode.setVisible(false)    
                menuSide.itemNodes[7].node.setVisible(true)
                break
            }
            case 8:
            {   
                menuSide.menuSideNode.setVisible(false)    

                var node = userSettingPop.getPop()
                node.setPosition( cc.p( uiController.uiTop.getContentSize().width * 0.5, uiController.uiTop.getContentSize().height * 0.5) )
                uiController.uiTop.addChild(node)
                break
            }
        }

    },


}












