

gameStart.start = function(isRepeat)
{   
    gameStart.registUiController(mainScene)

    var callback = function()
    {
        playNode.onReStart()
        cmdBaseWorker.onReStart()
        gameStart.connectServer()  
    }
    gameStart.registReStartEvent(callback)

    gameStart._loadRes(function()
    {            
        gameStart.connectServer()
    })
}

gameStart.enterMainScene = function()
{   
    mainScene.runThisScene()
    hasEnterMainScene = true

    managerAudio.setEffectsVolume(0.5)
}

gameStart.connectServer = function()
{   
    var ip = llb_room.server
    gameLog.log(ip)
    
    socket.connect('ws://' + ip, gameStart._onConnect)
}


//////////////内部函数////////////////////
gameStart._onConnect = function()
{   
    var l = function(msg)
    {   
        gameLog.log('-----------------tableData.enterListener------------------')
        tableData.enterListener(msg)
    }
    socket.registSocketListener(l)

    tableData.onEnterScene = function()
    {
        var l = function(msg)
        {   
            cmdListener.enterListener(msg)
            tableData.gameListener(msg)
        }
        socket.registSocketListener(l)

        if(tableData.isCreateTable)
            socket.sendMessage(MDM_GF_GAME, 333)
    }
    var cookieConfirm = getObjWithStructName( 'CMD_GR_CookieConfirm' )
    cookieConfirm.szCookie = llb_utoken
    socket.sendMessage( MDM_GR_LOGON, SUB_GR_COOKIE_CONFIRM, cookieConfirm )
}

gameStart._loadRes = function(onLoad)
{   
    managerRes.startPreloadScene(g_resources, function () {

        cc.spriteFrameCache.addSpriteFrames(resp.baseResPlist, resp.baseRes)
        cc.spriteFrameCache.addSpriteFrames(resp.playResPlist, resp.playRes)
        
        cc.spriteFrameCache.addSpriteFrames(resp.animationStartPlist, resp.animationStart)
        cc.spriteFrameCache.addSpriteFrames(resp.animationBombPlist, resp.animationBomb)

        cc.spriteFrameCache.addSpriteFrames(resp.gameEndResPlist, resp.gameEndRes)
        
        var t = new cc.SpriteFrame(resp_p.empty, cc.rect(0, 0, 2, 2))
        cc.spriteFrameCache.addSpriteFrame(t, "empty.png")

        t = new cc.SpriteFrame(resp.gameEndWin, cc.rect(0, 0, 236, 162))
        cc.spriteFrameCache.addSpriteFrame(t, "gameEndWin.png")
        t = new cc.SpriteFrame(resp.gameEndLose, cc.rect(0, 0, 236, 162))
        cc.spriteFrameCache.addSpriteFrame(t, "gameEndLose.png")
        
        t = new cc.SpriteFrame(resp.bg_g, cc.rect(0, 0, 960, 640))
        cc.spriteFrameCache.addSpriteFrame(t, "bg_g.jpg")

        t = new cc.SpriteFrame(resp.bg_logo, cc.rect(0, 0, 139, 176))
        cc.spriteFrameCache.addSpriteFrame(t, "bg_logo.jpg")

        onLoad?onLoad():''
    })

}

   
