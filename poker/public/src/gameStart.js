require('loginScene.js')
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
    gameLog.log("---------------------------------game.onStart----------------------------------------")
    var domain = window.location.href.replace('http://','').split('/')[0]
    if(domain.indexOf("zqwlkj.net")>=0)
        loaderLogoImage ="data:image/png;base64,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"
    
    isReversalWinSize = cc.sys.isMobile && gameorientation == 'landscape' //ipad的cc.sys.isMobile==true
    socket.registReStartEvent()
    managerAudio.init()
    gameLog.init()
    hallAddress = getCookie('hurl') || window.location.href.replace(/\/poker\/[\s\S]+/, '')

    cc.view.enableRetina(true)

    var w
    if( (gameorientation == 'landscape' && isReversalWinSize) || 
        (gameorientation == 'portrait' && !isReversalWinSize) )
        w = 640
    else
        w = 960
    cc.view.setDesignResolutionSize(w, 0, cc.ResolutionPolicy.FIXED_WIDTH)//固定宽度
    
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
