
gameStart.start = function()
{   
    gameStart.registProxy()

    gameLog.log('llb_utoken:',llb_utoken)
    gameLog.log('llb_room:',llb_room)
    var callback = function()
    {
        //mainScene.reset();
        gameStart.connectServer();
    }
    gameStart.registReStartEvent(callback)
    gameStart.loadRes(function()
    {            
        gameStart.connectServer()
    })
}

gameStart.loadRes = function(onLoad)
{   
    //15秒内未进入mainscene则发送log
    // gameStart.enterTimeoutId = setTimeout(function()
    // {
    //     sendLogToServer(gameLog.logS + 'wtms卡在加载界面wtms')s
    // },15000)

    managerRes.startPreloadScene(g_resources, function () {
        cc.spriteFrameCache.addSpriteFrames(resp.baseResPlist, resp.baseRes)
        cc.spriteFrameCache.addSpriteFrames(resp.SiceRollResPlist, resp.SiceRollRes)
        cc.spriteFrameCache.addSpriteFrames(resp.gameResPlist, resp.gameRes)
        cc.spriteFrameCache.addSpriteFrames(resp.gameEndPlist, resp.gameEnd)
        cc.spriteFrameCache.addSpriteFrames(resp.gameSetPlist, resp.gameSet)

        cc.spriteFrameCache.addSpriteFrames(resp.dingTaiPlist, resp.dingTai)
        cc.spriteFrameCache.addSpriteFrames(resp.huAnimalPlist, resp.huAnimal)
        onLoad?onLoad():''
    }, this)

}

gameStart.connectServer = function()
{   
    var ip = llb_room.server
    gameLog.log(ip)
    socket.connect('ws://' + ip, gameStart._onConnect)
}
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
            playData.enterListener(msg)
            tableData.gameListener(msg)
        }
        socket.registSocketListener(l)
    }

    var cookieConfirm = getObjWithStructName( 'CMD_GR_CookieConfirm' )
    cookieConfirm.szCookie = llb_utoken
    socket.sendMessage( MDM_GR_LOGON, SUB_GR_COOKIE_CONFIRM, cookieConfirm )
}

gameStart.enterMainScene = function()
{   
  
    mainScene.runThisScene()
    hasEnterMainScene = true

    // if(gameStart.enterTimeoutId)
    // {
    //     window.clearTimeout(gameStart.enterTimeoutId)
    //     gameStart.enterTimeoutId = null
    // }

}

gameStart.registProxy = function()
{
    uiController = mainScene
    // managerRes.resPath = resp
}
   

function showTips(args)
{
    // var pos
    // var isSit = tableData.isInTable(tableData.getUserWithUserId(selfdwUserID) && tableData.getUserWithUserId(selfdwUserID).cbUserStatus)
    // if(isSit && hasEnterMainScene)
    // {
    //     pos = {}
    //     pos.x = cc.director.getWinSize().width * 0.5
    //     pos.y = cc.director.getWinSize().height * 0.15 + 175
    // }

    // showTipsTTF(
    //     {str:args.str,
    //     pos:pos
    // })
}



