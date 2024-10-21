

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

    }

    var cookieConfirm = getObjWithStructName( 'CMD_GR_CookieConfirm' )
    cookieConfirm.szCookie = llb_utoken
    socket.sendMessage( MDM_GR_LOGON, SUB_GR_COOKIE_CONFIRM, cookieConfirm )
}

gameStart._loadRes = function(onLoad)
{   
    managerRes.startPreloadScene(g_resources, function () {
        cc.spriteFrameCache.addSpriteFrames(resp.playResPlist, resp.playRes)
        
        cc.spriteFrameCache.addSpriteFrames(resp.gameEndResPlist, resp.gameEndRes)
        cc.spriteFrameCache.addSpriteFrames(resp.actionResPlist, resp.actionRes)

        var t = new cc.SpriteFrame(resp_p.empty, cc.rect(0, 0, 2, 2))
        cc.spriteFrameCache.addSpriteFrame(t, "empty.png")

        t = new cc.SpriteFrame(resp.bg_logo, cc.rect(0, 0, 139, 176))
        cc.spriteFrameCache.addSpriteFrame(t, "bg_logo.jpg")

        //动画资源异步加载
        var res = 
        [
        resp.animationAction, resp.animationActionPlist, 
        resp.animationGameEnd, resp.animationGameEndPlist,
        resp.animationFace, resp.animationFacePlist,
        resp.animationItem, resp.animationItemPlist
        ]
        cc.loader.load(res,
           function (result, count, loadedCount) 
           {}, 
           function() 
           {    
               cc.spriteFrameCache.addSpriteFrames(resp.animationGameEndPlist, resp.animationGameEnd)
               cc.spriteFrameCache.addSpriteFrames(resp.animationActionPlist, resp.animationAction)
               cc.spriteFrameCache.addSpriteFrames(resp.animationFacePlist, resp.animationFace)
               cc.spriteFrameCache.addSpriteFrames(resp.animationItemPlist, resp.animationItem)
           })

        onLoad?onLoad():''
    })

}

   
