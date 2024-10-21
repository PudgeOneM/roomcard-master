
var typeSelNode = 
{   
    haveSetGameType:false,
    isDealProcess:false,
    nodeX:0,
    /////////////////////////
    init:function()
    {   
        typeSelNode._InitBtnListener()
        var node = managerRes.loadCCB(resp.typeSelCCB, this)
        typeSelNode.node  = node
        node.setPosition( cc.p( mainScene.uiTop.getContentSize().width * 0.5, mainScene.uiTop.getContentSize().height * 0.5 + 20) )
        typeSelNode.node.setVisible(false)
        typeSelNode.nodeX = typeSelNode.node.x
        tableNode.startButton.setVisible(false)
        typeSelNode.node.x += 2000
        topUINode.ModeBtnTable.setVisible(false)

        var l = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "managerUserUpdate",
            callback: function(event)
            {  
               typeSelNode.userUpdate()
            }
        })
        cc.eventManager.addListener(l, 1) 

        var ll = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "playerCountInTableChange",
            callback: function(event)
            {   
                var usersInTable = tableData.getUsersInTable(tableData.getUserWithUserId(selfdwUserID).wTableID)
                var wMinUserCount = START_MODE==START_MODE_ALL_READY?2:GAME_PLAYER
                tableNode.startButton.setVisible(usersInTable.length >= wMinUserCount && cmdBaseWorker.bHaveSetType == true)
                tableNode.shareButton.setVisible(usersInTable.length < wMinUserCount)
            }
        })
        cc.eventManager.addListener(ll, 1) 

        typeSelNode.bindListener(typeSelNode.fengding_0_0, typeSelNode.ThreeCaiDiao_0)
        typeSelNode.bindListener(typeSelNode.fengding_1_0, typeSelNode.FiveZiMo_0)
        typeSelNode.bindListener(typeSelNode.fengding_2_0, typeSelNode.FiveBei_0)
        typeSelNode.bindListener(typeSelNode.fengding_3_0, typeSelNode.ThreeOneOne_0)
        typeSelNode.bindListener(typeSelNode.fengding_4_0, typeSelNode.FiveOneOne_0)
    },
    startBtnEnabled:function()
    {
        if (cmdBaseWorker.bHaveSetType == true)
        {
            topUINode.ModeBtnTable.setVisible(true)

            var usersInTable = tableData.getUsersInTable(tableData.getUserWithUserId(selfdwUserID).wTableID)
            var wMinUserCount = START_MODE==START_MODE_ALL_READY?2:GAME_PLAYER
            tableNode.startButton.setVisible(usersInTable.length >= wMinUserCount)
            tableNode.shareButton.setVisible(usersInTable.length < wMinUserCount)
        }
    },
    userUpdate:function()
    {
         if (typeSelNode.haveSetGameType == false && tableData.createrUserID != 4294967295 && cmdBaseWorker.bHaveSetType == false && playNode.isRevSence == true)
         {
            typeSelNode.btn_SelEnter.setVisible(true)
            typeSelNode.selBtnClose.setVisible(false)
            var usersInTable = tableData.getUsersInTable(tableData.getUserWithUserId(selfdwUserID).wTableID)
            typeSelNode.node.setVisible(selfdwUserID == tableData.createrUserID)
            if (selfdwUserID == tableData.createrUserID)
            {
                typeSelNode.isDealProcess = true
                typeSelNode.node.x = typeSelNode.nodeX
            }
            else
                typeSelNode.node.x += 2000
            typeSelNode.haveSetGameType = true;
         }
    },
    setGameType:function()
    {
        typeSelNode.fengding_0_0.setVisible(true)
        typeSelNode.fengding_0_1.setVisible(false)
        typeSelNode.fengding_1_0.setVisible(true)
        typeSelNode.fengding_1_1.setVisible(false)
        typeSelNode.fengding_2_0.setVisible(true)
        typeSelNode.fengding_2_1.setVisible(false)
        typeSelNode.fengding_3_0.setVisible(true)
        typeSelNode.fengding_3_1.setVisible(false)
        typeSelNode.fengding_4_0.setVisible(true)
        typeSelNode.fengding_4_1.setVisible(false)

        if (cmdBaseWorker.stWinType.cbThreeCaiDiao == 1)
        {
            typeSelNode.fengding_0_0.setVisible(false)
            typeSelNode.fengding_0_1.setVisible(true)
            typeSelNode.fengding_1_0.setVisible(true)
            typeSelNode.fengding_1_1.setVisible(false)
        }
        else if (cmdBaseWorker.stWinType.cbFiveZiMo == 1)
        {
            typeSelNode.fengding_0_0.setVisible(true)
            typeSelNode.fengding_0_1.setVisible(false)
            typeSelNode.fengding_1_0.setVisible(false)
            typeSelNode.fengding_1_1.setVisible(true)
        }

        if (cmdBaseWorker.stWinType.cbFiveBei == 1)
        {
            typeSelNode.fengding_2_0.setVisible(false)
            typeSelNode.fengding_2_1.setVisible(true)
            typeSelNode.fengding_3_0.setVisible(true)
            typeSelNode.fengding_3_1.setVisible(false)
            typeSelNode.fengding_4_0.setVisible(true)
            typeSelNode.fengding_4_1.setVisible(false)
        }
        else if (cmdBaseWorker.stWinType.cbThreeOneOne == 1)
        {
            typeSelNode.fengding_2_0.setVisible(true)
            typeSelNode.fengding_2_1.setVisible(false)
            typeSelNode.fengding_3_0.setVisible(false)
            typeSelNode.fengding_3_1.setVisible(true)
            typeSelNode.fengding_4_0.setVisible(true)
            typeSelNode.fengding_4_1.setVisible(false)
        }
        else if (cmdBaseWorker.stWinType.YaoFiveOneOne == 1)
        {
            typeSelNode.fengding_2_0.setVisible(true)
            typeSelNode.fengding_2_1.setVisible(false)
            typeSelNode.fengding_3_0.setVisible(true)
            typeSelNode.fengding_3_1.setVisible(false)
            typeSelNode.fengding_4_0.setVisible(false)
            typeSelNode.fengding_4_1.setVisible(true)
        }
    },
    ThreeCaiDiao_0:function()
    {
        if (typeSelNode.isDealProcess == false)
            return 
        typeSelNode.fengding_0_0.setVisible(false)
        typeSelNode.fengding_0_1.setVisible(true)
        typeSelNode.fengding_1_0.setVisible(true)
        typeSelNode.fengding_1_1.setVisible(false)
    },
    FiveZiMo_0:function()
    {
        if (typeSelNode.isDealProcess == false)
            return 
        typeSelNode.fengding_0_0.setVisible(true)
        typeSelNode.fengding_0_1.setVisible(false)
        typeSelNode.fengding_1_0.setVisible(false)
        typeSelNode.fengding_1_1.setVisible(true)
    },
    FiveBei_0:function()
    {
        if (typeSelNode.isDealProcess == false)
            return 
        typeSelNode.fengding_2_0.setVisible(false)
        typeSelNode.fengding_2_1.setVisible(true)
        typeSelNode.fengding_3_0.setVisible(true)
        typeSelNode.fengding_3_1.setVisible(false)
        typeSelNode.fengding_4_0.setVisible(true)
        typeSelNode.fengding_4_1.setVisible(false)
    },
    ThreeOneOne_0:function()
    {
        if (typeSelNode.isDealProcess == false)
            return 
        typeSelNode.fengding_2_0.setVisible(true)
        typeSelNode.fengding_2_1.setVisible(false)
        typeSelNode.fengding_3_0.setVisible(false)
        typeSelNode.fengding_3_1.setVisible(true)
        typeSelNode.fengding_4_0.setVisible(true)
        typeSelNode.fengding_4_1.setVisible(false)
    },
    FiveOneOne_0:function()
    {
        if (typeSelNode.isDealProcess == false)
            return 
        typeSelNode.fengding_2_0.setVisible(true)
        typeSelNode.fengding_2_1.setVisible(false)
        typeSelNode.fengding_3_0.setVisible(true)
        typeSelNode.fengding_3_1.setVisible(false)
        typeSelNode.fengding_4_0.setVisible(false)
        typeSelNode.fengding_4_1.setVisible(true)
    },
    bindListener:function(target, clickFun)
    {   
        var listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget()
                
                var locationInNode = target.convertToNodeSpace(touch.getLocation())
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height)
                if (cc.rectContainsPoint(rect, locationInNode)) {
                    if (clickFun && target.isVisible()) clickFun()
                        return true
                }
                return false
            },
            onTouchEnded: function (touch, event) {
            }
        })

        cc.eventManager.addListener(listener, target)
    },
    _InitBtnListener:function()
    {
        typeSelNode.btnSelEnter = function()
        {
            if (typeSelNode.isDealProcess == false)
                return 
            var GameType = getObjWithStructName('CMD_C_GameType')

            if (typeSelNode.fengding_0_1.isVisible())
            {
                GameType.cbThreeCaiDiao = 1
                GameType.cbFiveZiMo = 0
            }
            else if (typeSelNode.fengding_1_1.isVisible())
            {
                GameType.cbThreeCaiDiao = 0
                GameType.cbFiveZiMo = 1
            }

            if (typeSelNode.fengding_2_1.isVisible())
            {
                GameType.cbFiveBei = 1
                GameType.cbThreeOneOne = 0
                GameType.YaoFiveOneOne = 0
            }
            else if (typeSelNode.fengding_3_1.isVisible())
            {
                GameType.cbFiveBei = 0
                GameType.cbThreeOneOne = 1
                GameType.YaoFiveOneOne = 0
            }
            else if (typeSelNode.fengding_4_1.isVisible())
            {
                GameType.cbFiveBei = 0
                GameType.cbThreeOneOne = 0
                GameType.YaoFiveOneOne = 1
            }

            typeSelNode.sendMessage_Type(GameType)
            typeSelNode.node.setVisible(false)
            typeSelNode.node.x += 2000
        }

        typeSelNode.SelBtnClose = function()
        {
            typeSelNode.node.setVisible(false)
            typeSelNode.node.x += 2000
        }
    },
    sendMessage_Type:function(type)
    {
        socket.sendMessage(MDM_GF_GAME, SUB_C_TYPE_SEL, type)
    },
}

