
var gameStart = {}
gameStart.start = null
gameStart.reStart = null
gameStart.connectServer = null
gameStart.enterMainScene = null
gameStart.reStartTime = 0

gameStart.registUiController = function(mainScene)
{
    uiController = mainScene
}

gameStart.registReStartEvent = function(callback)
{
    var l = cc.EventListener.create({
        event: cc.EventListener.CUSTOM,
        eventName: "reStart",
        callback: function(event)
        {   
            // managerTouch.closeTouch()
            // cc.game.pause()
            //cc.director.getScheduler().pauseAllTargets()
            cc.director.getActionManager().removeAllActions()
            cc.director.getScheduler().unscheduleAllWithMinPriority(0)
        }
    })
    cc.eventManager.addListener(l, 3)

    var l = cc.EventListener.create({
        event: cc.EventListener.CUSTOM,
        eventName: "reStart",
        callback: function(event)
        {   
            gameStart.reStartTime = gameStart.reStartTime + 1
            // if(gameStart.reStartTime>6)
            // {
            //     managerTouch.openTouch()
            //     alert(1)
            //     socket.closeWithPop(null, 1, 2, true)
            //     return; 
            // }

            for(var i in componentList)
            {
                var c = eval(componentList[i])
                c.onReStart?c.onReStart():''
            }  

            var listenersMap = cc.eventManager._listenersMap
            for(var eventName in listenersMap)
            {
                if(eventName != 'game_on_hide' && eventName != 'game_on_show' 
                    && eventName != 'reStart' && eventName != 'resetGameData')
                    cc.eventManager.removeCustomListeners(eventName)  
            }
            callback?callback():''
            // cc.game.resume()
        }
    })
    cc.eventManager.addListener(l, 4)
}

gameStart.runGame = function()
{
	var onLandscape = function()
	{
	    document.getElementById('d').style.display = 'block'
	    // var onload = "var h=window.screen.height-60;style='padding-top:'+(h-300)/2/h*100 +'%'"
	    //document.getElementById("d").innerHTML='<img src="res/publicRes/2.png" onload=' + onload +'/>'
        document.getElementById("d").innerHTML='<img src="res/publicRes/2.png" />'
        
	    window.onorientationchange = function()
	    {
	        if(window.orientation == 0)
	            goHref(appendRefreshtime(window.location.href))
	    }   
	}
	if( typeof(window.orientation) != 'undefined' && window.orientation != 0) //竖屏 0 
	{
	    onLandscape()
	}
	else
	{
	    window.onorientationchange = function()
	    {
	        if( typeof(window.orientation) != 'undefined' && window.orientation != 0 )
	        {
	            onLandscape()
	        }
	    }
	    cc.game.run()
	}
}
gameStart.startShutDownBeat = function()
{
    gameStart.shutDownBeat = setInterval(function()
    {
        gameStart.isResizeing = false
    },500)
}

gameStart.startResizeMonitor = function() 
{
    //isResizeing=false持续1000ms
    var continueTimes = 0
    var monitor = setInterval(function()
    {
        if(!gameStart.isResizeing)
            continueTimes = continueTimes + 1
        else
            continueTimes = 0
        if(continueTimes>5)
        {
            var event = new cc.EventCustom("reStart")
            cc.eventManager.dispatchEvent(event)
            clearInterval(gameStart.shutDownBeat)
            gameStart.shutDownBeat = null
            clearInterval(monitor)
        }
    },100)
}

cc.game.onStart = function(){

    var domain = window.location.href.replace('http://','').split('/')[0]
    if(getCookie('hcode') == 'snowgame')
        loaderLogoImage = loaderLogoImage_xueqiu
    else if(domain.indexOf("xueqiuyouxi")>=0 )
        loaderLogoImage = loaderLogoImage_xueqiu
    else if(domain.indexOf("zqwlkj.net")>=0 || domain.indexOf("lang28.com")>=0)
        loaderLogoImage = loaderLogoImage_zhangqu
    else
        loaderLogoImage = loaderLogoImage_default

    
    isReversalWinSize = cc.sys.isMobile && gameorientation == 'landscape' //ipad的cc.sys.isMobile==true
    socket.registReStartEvent()
    managerAudio.init()
    gameLog.init()
    hallAddress = getCookie('hurl') || window.location.href.replace(/\/poker\/[\s\S]+/, '')

    cc.view.enableRetina(true)


    if(gameorientation == 'landscape')
    {
        if(!isReversalWinSize)
            cc.view.setDesignResolutionSize(1200, 0, cc.ResolutionPolicy.FIXED_WIDTH)
        else
           cc.view.setDesignResolutionSize(0, 1200, cc.ResolutionPolicy.FIXED_HEIGHT)
    }
    else if(gameorientation == 'portrait')
        cc.view.setDesignResolutionSize(800, 0, cc.ResolutionPolicy.FIXED_WIDTH)

    if(cc.sys.os == cc.sys.OS_WINDOWS || cc.sys.os == cc.sys.OS_OSX)   
    {
        cc.view.resizeWithBrowserSize(true)
        cc.view.setResizeCallback(function()
        {
            if(uiController)
            {
                if(!gameStart.shutDownBeat)
                {
                    gameStart.startShutDownBeat()
                    gameStart.startResizeMonitor()
                }
                gameStart.isResizeing = true
            }
        })
    } 

    cc.loader.resPath = 'res'
    
    if(typeof(getLocalStorage('isOpenPTH_' + KIND_ID)) == 'undefined')
        setLocalStorage('isOpenPTH_' + KIND_ID, defaultLanguage==0?'close':'open')

    var styleArrayLocal = getLocalStorage('styleArray_' + KIND_ID)
    if(styleArrayLocal)
        styleArray = JSON.parse(styleArrayLocal)

    managerRes.preloadRes(function()
    {
        if(isEnterFromLogin)
        {   
            loginScene.runThisScene()
        }
        else
        {
            try
            {
                llb_utoken = getCookie('llb_utoken')
                llb_room = getCookie('llb_room') 
                gameLog.log('llb_room:', llb_room)
                llb_room = JSON.parse( llb_room )

                var GetQueryString = function(name)
                {
                     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
                     var r = window.location.search.substr(1).match(reg);
                     if(r!=null)return  unescape(r[2]); return null;
                }

                if( GetQueryString('act') == 'replay' )
                {
                    llb_replay.VideoId = GetQueryString('videoid')
                    llb_replay.VideoNum = GetQueryString('videonum')
                    gameLog.log('llb_replay.VideoId = ' + llb_replay.VideoId)
                    gameLog.log('llb_replay.VideoNum = ' + llb_replay.VideoNum)
                }

                gameStart.start()
            }
            catch(e)
            {
                alert('请从大厅进入游戏'+'llb_room:'+getCookie('llb_room'))
            }
        }
    })

    // var hideTimeoutId
    cc.eventManager.addCustomListener(cc.game.EVENT_HIDE, function () 
    {
        gameLog.log('EVENT_HIDE')

        // hideTimeoutId = setTimeout(function()
        // {
        //     hideTimeoutId = null
        // },30000)
        managerAudio.stop()
    })
    cc.eventManager.addCustomListener(cc.game.EVENT_SHOW, function () 
    {   
        gameLog.log('EVENT_SHOW')

        // if(typeof(hideTimeoutId)!='undefined')
        // {
        //     if(hideTimeoutId)
        //     {
        //         clearTimeout(hideTimeoutId)
        //         hideTimeoutId = null
        //     }
        //     else
        //     {   
        //         if(cc.sys.isMobile)
        //         {
        //             socket.closeWithPop(null, 1)
        //         }
        //     }
        // }
        managerAudio.recover()
    })
}
