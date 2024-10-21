//默认有平局  非全讨
var selTypeNode = {
    hasSetGameType:null,
    GameType:null,
    EndType:null,
    GameText:null,
    EndText:null,
    init:function()
    {
        selTypeNode.hasSetGameType = false
        selTypeNode._registListener()
        var node = managerRes.loadCCB(resp.typeSelCCB, this)
        selTypeNode.node = node._children[0]
        selTypeNode.fanpaiNode = node._children[1]

        selTypeNode.node.setVisible(false)
        selTypeNode.fanpaiNode.setVisible(false)
        tableNode.startButton.setVisible(false)

        GameText = selTypeNode.node._children[6]
        EndText = selTypeNode.node._children[7]
       // GameText._string = '有平局'
       // EndText._string = '非全讨'
        GameType = 0
        EndType = 0

        selTypeNode._initListener()
        
    },
    _setStartBtnEnabled:function()
    {
        tableNode.startButton.setVisible(true)
    },
    _setFanpaiVisable:function(spr)
    {
        selTypeNode.fanpaiNode.removeAllChildren()
        selTypeNode.fanpaiNode.setVisible(true)
        selTypeNode.fanpaiNode.addChild(spr)
    },
    _initListener:function()
    {
        var l = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "managerUserUpdate",
            callback: function(event)
            {   
                console.log('managerUserUpdate:::',selTypeNode)
                mainScene.uiPlay.addChild(selTypeNode.node)
                mainScene.uiPlay.addChild(selTypeNode.fanpaiNode)
                //selTypeNode._addUiToMainScene()
            }
        })
        cc.eventManager.addListener(l, 2)
    },
    _addUiToMainScene:function()
    {
        if(selTypeNode.hasSetGameType == false)
        {
            selTypeNode.node.setVisible(selfdwUserID == tableData.createrUserID)
            selTypeNode.hasSetGameType = true
        }
    },
    _setShowText:function(string,node)
    {
        node._string = string
    },
    _registListener:function()
    {
        selTypeNode.setType1Hide = function()
        {
            selTypeNode.node._children[1].setVisible(true)
            selTypeNode.node._children[2].setVisible(false)
            console.log("无平局")
            // GameText._string = ''
            // GameText._string = '有平局'
            EndType = 1
        }
        selTypeNode.setType2Hide = function()
        {
            console.log("有平局")
            selTypeNode.node._children[2].setVisible(true)
            selTypeNode.node._children[1].setVisible(false)
            // GameText._string = ''
            // GameText._string = '无平局'
            EndType = 0
        }
        selTypeNode.setType3Hide = function()
        {
            console.log("全讨")
            selTypeNode.node._children[3].setVisible(true)
            selTypeNode.node._children[4].setVisible(false)
            // EndText._string = ''
            // EndText._string = '非全讨'
            GameType = 1
        }
        selTypeNode.setType4Hide = function()
        {
            console.log("非全讨")
            selTypeNode.node._children[4].setVisible(true)
            selTypeNode.node._children[3].setVisible(false)
            // EndText._string = ''
            // EndText._string = '全讨'
            GameType = 0
        }
        selTypeNode.enterType = function()
        {
            console.log("确认玩法")
            selTypeNode._sendMessageToServer()
        }
    },
    _sendMessageToServer:function()
    {
        selTypeNode._setStartBtnEnabled()
        cmdBaseWorker.hasSetGameType = (GameType + 1) * (EndType + 2)
        playNode.setTypeName(cmdBaseWorker.hasSetGameType)
        selTypeNode.node.setVisible(false)
        var CallType = getObjWithStructName('CMD_C_GameType')
        CallType.cbIsQuanTao = GameType
        CallType.cbIsPingJu = EndType
        socket.sendMessage(MDM_GF_GAME, SUB_C_TYPE, CallType)
    }
}


















