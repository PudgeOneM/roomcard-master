
var typeSelNode = 
{   
    haveSetGameType:false,
    /////////////////////////
    init:function()
    {   
        typeSelNode._InitBtnListener()

        var node = managerRes.loadCCB(resp.typeSelCCB, this)
        typeSelNode.node  = node
        node.setPosition( cc.p( mainScene.uiTop.getContentSize().width * 0.5, mainScene.uiTop.getContentSize().height * 0.5 + 20) )
        typeSelNode.node.setVisible(false)
        var l = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "managerUserUpdate",
            callback: function(event)
            {  
               typeSelNode.userUpdate()
            }
        })
        cc.eventManager.addListener(l, 1) 

        var l = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "playerCountInTableChange",
            callback: function(event)
            {   
                var usersInTable = tableData.getUsersInTable(tableData.getUserWithUserId(selfdwUserID).wTableID)
                var wMinUserCount = START_MODE==START_MODE_ALL_READY?2:GAME_PLAYER
                if (cmdBaseWorker.bHaveSetType==true && usersInTable.length >= wMinUserCount)
                    tableNode.startButton.setVisible(true)
                else
                    tableNode.startButton.setVisible(false)
            }
        })
        cc.eventManager.addListener(l, 1) 
    },
    startBtnEnabled:function()
    {
        if (cmdBaseWorker.bHaveSetType == true)
        {
            var usersInTable = tableData.getUsersInTable(tableData.getUserWithUserId(selfdwUserID).wTableID)
            var wMinUserCount = START_MODE==START_MODE_ALL_READY?2:GAME_PLAYER
            if (cmdBaseWorker.bHaveSetType==true && usersInTable.length >= wMinUserCount)
                tableNode.startButton.setVisible(true)
        }
    },
    userUpdate:function()
    {
         if (typeSelNode.haveSetGameType == false && tableData.createrUserID != 4294967295 && cmdBaseWorker.bHaveSetType == false && playNode.isRevSence == true)
         {
            var usersInTable = tableData.getUsersInTable(tableData.getUserWithUserId(selfdwUserID).wTableID)
            typeSelNode.node.setVisible(selfdwUserID == tableData.createrUserID)
            typeSelNode.haveSetGameType = true;
         }
    },
    _InitBtnListener:function()
    {
        typeSelNode.selTwo = function()
        {
            typeSelNode.node.setVisible(false)
            typeSelNode.sendMessage_Type(0)
        }

        typeSelNode.selThree = function()
        {
            typeSelNode.node.setVisible(false)
            typeSelNode.sendMessage_Type(1)
        }

        typeSelNode.selFive = function()
        {
            typeSelNode.node.setVisible(false)
            typeSelNode.sendMessage_Type(2)
        }

        typeSelNode.selTen = function()
        {
            typeSelNode.node.setVisible(false)
            typeSelNode.sendMessage_Type(3)
        }
    },
    sendMessage_Type:function(type)
    {
        var GameType = getObjWithStructName('CMD_C_GameType')
        GameType.cbGameType = type
        socket.sendMessage(MDM_GF_GAME,SUB_C_TYPE_SEL,GameType)
    },
}

