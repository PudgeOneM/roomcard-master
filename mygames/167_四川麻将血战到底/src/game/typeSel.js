
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

        typeSelNode.bindListener(typeSelNode.fengding_0_0, typeSelNode.Two_0)
        typeSelNode.bindListener(typeSelNode.fengding_1_0, typeSelNode.Three_0)
        typeSelNode.bindListener(typeSelNode.fengding_2_0, typeSelNode.four_0)
        typeSelNode.bindListener(typeSelNode.fengding_3_0, typeSelNode.Five_0)
        typeSelNode.bindListener(typeSelNode.fengding_33_0, typeSelNode.FiveFan_0)

        typeSelNode.bindListener(typeSelNode.fengding_4_0, typeSelNode.addFen_0)
        typeSelNode.bindListener(typeSelNode.fengding_5_0, typeSelNode.addFan_0)
        typeSelNode.bindListener(typeSelNode.fengding_6_0, typeSelNode.DianPao_0)
        typeSelNode.bindListener(typeSelNode.fengding_7_0, typeSelNode.ZiMo_0)

        typeSelNode.bindListener(typeSelNode.fengding_8_0, typeSelNode.Change_0)
        typeSelNode.bindListener(typeSelNode.fengding_8_1, typeSelNode.Change_1)
        typeSelNode.fengding_8_0.setLocalZOrder(1)
        typeSelNode.fengding_8_1.setLocalZOrder(0)
        typeSelNode.bindListener(typeSelNode.fengding_9_0, typeSelNode.YaoJiang_0)
        typeSelNode.bindListener(typeSelNode.fengding_9_1, typeSelNode.YaoJiang_1)
        typeSelNode.fengding_9_0.setLocalZOrder(1)
        typeSelNode.fengding_9_1.setLocalZOrder(0)
        typeSelNode.bindListener(typeSelNode.fengding_10_0, typeSelNode.TianDi_0)
        typeSelNode.bindListener(typeSelNode.fengding_10_1, typeSelNode.TianDi_1)
        typeSelNode.fengding_10_0.setLocalZOrder(1)
        typeSelNode.fengding_10_1.setLocalZOrder(0)
        typeSelNode.bindListener(typeSelNode.fengding_11_0, typeSelNode.menZhong_0)
        typeSelNode.bindListener(typeSelNode.fengding_11_1, typeSelNode.menZhong_1)
        typeSelNode.fengding_11_0.setLocalZOrder(1)
        typeSelNode.fengding_11_1.setLocalZOrder(0)
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
        typeSelNode.fengding_33_0.setVisible(true)
        typeSelNode.fengding_33_1.setVisible(false)

        if (cmdBaseWorker.stWinType.cbFengDingType >= 0 && cmdBaseWorker.stWinType.cbFengDingType <= 3)
        {
            typeSelNode['fengding_'+cmdBaseWorker.stWinType.cbFengDingType+'_0'].setVisible(false)
            typeSelNode['fengding_'+cmdBaseWorker.stWinType.cbFengDingType+'_1'].setVisible(true)
        }
        else if (cmdBaseWorker.stWinType.cbFengDingType == 4)
        {//5fan
            typeSelNode.fengding_33_0.setVisible(false)
            typeSelNode.fengding_33_1.setVisible(true)
        }
        else
        {
            typeSelNode.fengding_1_0.setVisible(false)
            typeSelNode.fengding_1_1.setVisible(true)
        }

        typeSelNode.fengding_4_0.setVisible(true)
        typeSelNode.fengding_4_1.setVisible(false)
        typeSelNode.fengding_5_0.setVisible(true)
        typeSelNode.fengding_5_1.setVisible(false)
        if (cmdBaseWorker.stWinType.cbZiMoType == 0)
        {
            typeSelNode.fengding_4_0.setVisible(false)
            typeSelNode.fengding_4_1.setVisible(true)
        }
        else
        {
            typeSelNode.fengding_5_0.setVisible(false)
            typeSelNode.fengding_5_1.setVisible(true)
        }

        typeSelNode.fengding_6_0.setVisible(true)
        typeSelNode.fengding_6_1.setVisible(false)
        typeSelNode.fengding_7_0.setVisible(true)
        typeSelNode.fengding_7_1.setVisible(false)
        if (cmdBaseWorker.stWinType.cbGFlowerType == 0)
        {
            typeSelNode.fengding_6_0.setVisible(false)
            typeSelNode.fengding_6_1.setVisible(true)
        }
        else
        {
            typeSelNode.fengding_7_0.setVisible(false)
            typeSelNode.fengding_7_1.setVisible(true)
        }

        typeSelNode.fengding_8_0.setVisible(true)
        typeSelNode.fengding_8_1.setVisible(false)
        typeSelNode.fengding_9_0.setVisible(true)
        typeSelNode.fengding_9_1.setVisible(false)
        typeSelNode.fengding_10_0.setVisible(true)
        typeSelNode.fengding_10_1.setVisible(false)
        typeSelNode.fengding_11_0.setVisible(true)
        typeSelNode.fengding_11_1.setVisible(false)
        if (cmdBaseWorker.stWinType.cbChangeCard == 1)
        {
            typeSelNode.fengding_8_0.setVisible(false)
            typeSelNode.fengding_8_1.setVisible(true)
            typeSelNode.fengding_8_0.setLocalZOrder(0)
            typeSelNode.fengding_8_1.setLocalZOrder(1)
        }
        if (cmdBaseWorker.stWinType.YaoJiuJiangDui == 1)
        {
            typeSelNode.fengding_9_0.setVisible(false)
            typeSelNode.fengding_9_1.setVisible(true)
            typeSelNode.fengding_9_0.setLocalZOrder(0)
            typeSelNode.fengding_9_1.setLocalZOrder(1)
        }
        if (cmdBaseWorker.stWinType.cbTianDiHu == 1)
        {
            typeSelNode.fengding_10_0.setVisible(false)
            typeSelNode.fengding_10_1.setVisible(true)
            typeSelNode.fengding_10_0.setLocalZOrder(0)
            typeSelNode.fengding_10_1.setLocalZOrder(1)
        }
        if (cmdBaseWorker.stWinType.cbMenQingZhongZhang == 1)
        {
            typeSelNode.fengding_11_0.setVisible(false)
            typeSelNode.fengding_11_1.setVisible(true)
            typeSelNode.fengding_11_0.setLocalZOrder(0)
            typeSelNode.fengding_11_1.setLocalZOrder(1)
        }
    },
    Two_0:function()
    {
        if (typeSelNode.isDealProcess == false)
            return 
        typeSelNode.fengding_0_0.setVisible(false)
        typeSelNode.fengding_0_1.setVisible(true)
        typeSelNode.fengding_1_0.setVisible(true)
        typeSelNode.fengding_1_1.setVisible(false)
        typeSelNode.fengding_2_0.setVisible(true)
        typeSelNode.fengding_2_1.setVisible(false)
        typeSelNode.fengding_3_0.setVisible(true)
        typeSelNode.fengding_3_1.setVisible(false)
        typeSelNode.fengding_33_0.setVisible(true)
        typeSelNode.fengding_33_1.setVisible(false)
    },
    Three_0:function()
    {
        if (typeSelNode.isDealProcess == false)
            return 
        typeSelNode.fengding_0_0.setVisible(true)
        typeSelNode.fengding_0_1.setVisible(false)
        typeSelNode.fengding_1_0.setVisible(false)
        typeSelNode.fengding_1_1.setVisible(true)
        typeSelNode.fengding_2_0.setVisible(true)
        typeSelNode.fengding_2_1.setVisible(false)
        typeSelNode.fengding_3_0.setVisible(true)
        typeSelNode.fengding_3_1.setVisible(false)
        typeSelNode.fengding_33_0.setVisible(true)
        typeSelNode.fengding_33_1.setVisible(false)
    },
    four_0:function()
    {
        if (typeSelNode.isDealProcess == false)
            return 
        typeSelNode.fengding_0_0.setVisible(true)
        typeSelNode.fengding_0_1.setVisible(false)
        typeSelNode.fengding_1_0.setVisible(true)
        typeSelNode.fengding_1_1.setVisible(false)
        typeSelNode.fengding_2_0.setVisible(false)
        typeSelNode.fengding_2_1.setVisible(true)
        typeSelNode.fengding_3_0.setVisible(true)
        typeSelNode.fengding_3_1.setVisible(false)
        typeSelNode.fengding_33_0.setVisible(true)
        typeSelNode.fengding_33_1.setVisible(false)
    },
    FiveFan_0:function()
    {
        if (typeSelNode.isDealProcess == false)
            return 
        typeSelNode.fengding_0_0.setVisible(true)
        typeSelNode.fengding_0_1.setVisible(false)
        typeSelNode.fengding_1_0.setVisible(true)
        typeSelNode.fengding_1_1.setVisible(false)
        typeSelNode.fengding_2_0.setVisible(true)
        typeSelNode.fengding_2_1.setVisible(false)
        typeSelNode.fengding_3_0.setVisible(true)
        typeSelNode.fengding_3_1.setVisible(false)
        typeSelNode.fengding_33_0.setVisible(false)
        typeSelNode.fengding_33_1.setVisible(true)
    },
    Five_0:function()
    {
        if (typeSelNode.isDealProcess == false)
            return 
        typeSelNode.fengding_0_0.setVisible(true)
        typeSelNode.fengding_0_1.setVisible(false)
        typeSelNode.fengding_1_0.setVisible(true)
        typeSelNode.fengding_1_1.setVisible(false)
        typeSelNode.fengding_2_0.setVisible(true)
        typeSelNode.fengding_2_1.setVisible(false)
        typeSelNode.fengding_3_0.setVisible(false)
        typeSelNode.fengding_3_1.setVisible(true)
        typeSelNode.fengding_33_0.setVisible(true)
        typeSelNode.fengding_33_1.setVisible(false)
    },
    addFen_0:function()
    {
        if (typeSelNode.isDealProcess == false)
            return 
        typeSelNode.fengding_4_0.setVisible(false)
        typeSelNode.fengding_4_1.setVisible(true)
        typeSelNode.fengding_5_0.setVisible(true)
        typeSelNode.fengding_5_1.setVisible(false)
    },
    addFan_0:function()
    {
        if (typeSelNode.isDealProcess == false)
            return 
        typeSelNode.fengding_4_0.setVisible(true)
        typeSelNode.fengding_4_1.setVisible(false)
        typeSelNode.fengding_5_0.setVisible(false)
        typeSelNode.fengding_5_1.setVisible(true)
    },
    DianPao_0:function()
    {
        if (typeSelNode.isDealProcess == false)
            return 
        typeSelNode.fengding_6_0.setVisible(false)
        typeSelNode.fengding_6_1.setVisible(true)
        typeSelNode.fengding_7_0.setVisible(true)
        typeSelNode.fengding_7_1.setVisible(false)
    },
    ZiMo_0:function()
    {
        if (typeSelNode.isDealProcess == false)
            return 
        typeSelNode.fengding_6_0.setVisible(true)
        typeSelNode.fengding_6_1.setVisible(false)
        typeSelNode.fengding_7_0.setVisible(false)
        typeSelNode.fengding_7_1.setVisible(true)
    },
    Change_0:function()
    {
        if (typeSelNode.isDealProcess == false)
            return 
        typeSelNode.fengding_8_0.setVisible(false)
        typeSelNode.fengding_8_1.setVisible(true)
        typeSelNode.fengding_8_0.setLocalZOrder(0)
        typeSelNode.fengding_8_1.setLocalZOrder(1)
    },
    Change_1:function()
    {
        if (typeSelNode.isDealProcess == false)
            return 
        typeSelNode.fengding_8_0.setVisible(true)
        typeSelNode.fengding_8_1.setVisible(false)
        typeSelNode.fengding_8_0.setLocalZOrder(1)
        typeSelNode.fengding_8_1.setLocalZOrder(0)
    },
    YaoJiang_0:function()
    {
       gameLog.log("GameSel_1111")
       if (typeSelNode.isDealProcess == false)
            return 
       typeSelNode.fengding_9_0.setVisible(false)
       typeSelNode.fengding_9_1.setVisible(true)
       typeSelNode.fengding_9_0.setLocalZOrder(0)
       typeSelNode.fengding_9_1.setLocalZOrder(1)
    },
    YaoJiang_1:function()
    {
        gameLog.log("GameSel_11115")
        if (typeSelNode.isDealProcess == false)
            return 
       typeSelNode.fengding_9_0.setVisible(true)
       typeSelNode.fengding_9_1.setVisible(false)
       typeSelNode.fengding_9_0.setLocalZOrder(1)
       typeSelNode.fengding_9_1.setLocalZOrder(0)
    },
    TianDi_0:function()
    {
        gameLog.log("GameSel_11114")
        if (typeSelNode.isDealProcess == false)
            return 
       typeSelNode.fengding_10_0.setVisible(false)
       typeSelNode.fengding_10_1.setVisible(true)
       typeSelNode.fengding_10_0.setLocalZOrder(0)
       typeSelNode.fengding_10_1.setLocalZOrder(1)
    },
    TianDi_1:function()
    {
        gameLog.log("GameSel_11113")
        if (typeSelNode.isDealProcess == false)
            return 
        typeSelNode.fengding_10_0.setVisible(true)
        typeSelNode.fengding_10_1.setVisible(false)
        typeSelNode.fengding_10_0.setLocalZOrder(1)
        typeSelNode.fengding_10_1.setLocalZOrder(0)
    },
    menZhong_0:function()
    {
        gameLog.log("GameSel_11110")
        if (typeSelNode.isDealProcess == false)
            return 
        typeSelNode.fengding_11_0.setVisible(false)
        typeSelNode.fengding_11_1.setVisible(true)
        typeSelNode.fengding_11_0.setLocalZOrder(0)
        typeSelNode.fengding_11_1.setLocalZOrder(1)
    },
    menZhong_1:function()
    {
        gameLog.log("GameSel_11112")
        if (typeSelNode.isDealProcess == false)
            return 
       typeSelNode.fengding_11_0.setVisible(true)
       typeSelNode.fengding_11_1.setVisible(false)
       typeSelNode.fengding_11_0.setLocalZOrder(1)
       typeSelNode.fengding_11_1.setLocalZOrder(0)
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
                GameType.cbFengDingType = 0
            else if (typeSelNode.fengding_1_1.isVisible())
                GameType.cbFengDingType = 1
            else if (typeSelNode.fengding_2_1.isVisible())
                GameType.cbFengDingType = 2
            else if (typeSelNode.fengding_3_1.isVisible())
                GameType.cbFengDingType = 3
            else if (typeSelNode.fengding_33_1.isVisible())
                GameType.cbFengDingType = 4

           if (typeSelNode.fengding_4_1.isVisible())
                GameType.cbZiMoType = 0
            else if (typeSelNode.fengding_5_1.isVisible())
                GameType.cbZiMoType = 1

            if (typeSelNode.fengding_6_1.isVisible())
                GameType.cbGFlowerType = 0
            else if (typeSelNode.fengding_7_1.isVisible())
                GameType.cbGFlowerType = 1

            if (typeSelNode.fengding_8_1.isVisible())
                GameType.cbChangeCard = 1
            else
                GameType.cbChangeCard = 0

            if (typeSelNode.fengding_9_1.isVisible())
                GameType.YaoJiuJiangDui = 1
            else
                GameType.YaoJiuJiangDui = 0

            if (typeSelNode.fengding_10_1.isVisible())
                GameType.cbTianDiHu = 1
            else
                GameType.cbTianDiHu = 0

            if (typeSelNode.fengding_11_1.isVisible())
                GameType.cbMenQingZhongZhang = 1
            else
                GameType.cbMenQingZhongZhang = 0
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
        socket.sendMessage(MDM_GF_GAME,SUB_C_TYPE_SEL,type)
    },
}

