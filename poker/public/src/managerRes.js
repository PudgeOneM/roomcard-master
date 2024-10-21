
var managerRes = {}

// var startPreloadSceneTips = [
//     '友情提示:电脑上也可以玩哦',
//     '通过关闭一些特效可以获得更流畅的游戏体验',
// ]
managerRes.startPreloadScene = function(resources, call, target)
{
    // cc.LoaderScene.preload(resources, call, target)
    // return;

    if(cc.isString(resources))
        resources = [resources]
    resources = resources || []

    var preloadScene = new cc.Scene()

    var startLoading = function()
    {
        preloadScene.unschedule(startLoading)
        cc.loader.load(resources,
            function (result, count, loadedCount) 
            {
                var percent = (loadedCount / count * 100) | 0
                percent = Math.min(percent, 100)
                preloadScene._label.setString("Loading... " + percent + "%")

                if(percent>=0)
                    preloadScene._label2.setString('在电脑微信上可以通过点击分享链接进行游戏')
                else if(percent>=0)
                    preloadScene._label2.setString('通过关闭一些特效可以获得更流畅的游戏体验')
            }, 
            function () 
            {
                call?call(target):''
            })
    }

    var t = preloadScene.onEnter
    preloadScene.onEnter = function()
    {
        t.apply(preloadScene)
        preloadScene.schedule(startLoading, 0.3)
    }

    //logo
    var logoWidth = 160
    var logoHeight = 200

    // bg
    var bgLayer = preloadScene._bgLayer = new cc.LayerColor(cc.color(11, 47, 45, 255))
    preloadScene.addChild(bgLayer, 0)

    //image move to CCSceneFile.js
    var fontSize = 24, lblHeight =  -logoHeight / 2 + 100

    // var loaderImage = "data:image/png;base64,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"
    // var loaderImage = "data:image/png;base64,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"
    //loading logo
    cc.loader.loadImg(loaderLogoImage, {isCrossOrigin : false }, function(err, img)
    {
        logoWidth = img.width
        logoHeight = img.height
        var texture2d = preloadScene._texture2d = new cc.Texture2D()
        texture2d.initWithElement(img)
        texture2d.handleLoadedTexture()
        var logo = preloadScene._logo = new cc.Sprite(texture2d)
        logo.setScale(cc.contentScaleFactor())
        logo.x = cc.visibleRect.center.x
        logo.y = cc.visibleRect.center.y
        preloadScene._bgLayer.addChild(logo, 10)
    })

    //loading percent
    var label = preloadScene._label = new cc.LabelTTF("Loading... 0%", "Arial", 24)
    label.setPosition(cc.pAdd(cc.visibleRect.center, cc.p(0, -logoHeight / 2 - 26)))
    label.setColor(cc.color(150, 150, 150))
    bgLayer.addChild(preloadScene._label, 10)

    var label2 = preloadScene._label2 = new cc.LabelTTF("", "Arial", 20)
    label2.setPosition(cc.pAdd(cc.visibleRect.center, cc.p(0, -cc.visibleRect.center.y+20)))
    label2.setColor(cc.color(0, 101, 59))
    bgLayer.addChild(preloadScene._label2, 10)

    cc.director.runScene(preloadScene)  
}

managerRes.preloadRes = function(onFinish)
{
	var g_resources = 
	[	
		resp_p.empty,
		resp_p.popBox1,
		resp_p.popBox2,
		resp_p.startResPlist,
		resp_p.startRes
	]

    for(var i in componentList)
    {
        var c = eval(componentList[i])
        if(typeof(c.preLoadRes)!='undefined')
            g_resources = g_resources.concat(c.preLoadRes)
    }

// console.log(8888, clone(g_resources))
	// for(var i in resp_c)
 //    {	
 //    	//cocos 加载mp3 iphone5 会卡半天
 //    	if(cc.path.extname(resp_c[i]) == '.mp3')// || cc.path.extname(resp_c[i]) == '.wav')
 //    		continue
 //        g_resources[g_resources.length] = resp_c[i]
 //    }

	managerRes.startPreloadScene(g_resources, function () {
        cc.spriteFrameCache.addSpriteFrames( resp_p.startResPlist, resp_p.startRes )

        for(var i in componentList)
        {
            var c = eval(componentList[i])
            if(typeof(c.onPreLoadRes)!='undefined')
                c.onPreLoadRes()
        }
        onFinish()
	})
}

//如果没有parent(第一层ccb) ccb的百分比是以winsize为准的  
managerRes.loadCCB = function(ccbpath, owner)
{
    if(isReversalWinSize) 
    {
        var s = cc.director.getWinSize()
        cc.director._winSizeInPoints = cc.size(s.height, s.width)
        var node  = cc.BuilderReader.load(ccbpath, owner)
        cc.director._winSizeInPoints = cc.size(s.width, s.height)
    }
    else
        var node  = cc.BuilderReader.load(ccbpath, owner)

    return node
}











// managerRes.resPath = {}

// managerRes.plistsHasLoad = []
// managerRes.isLoadingRes = false
// managerRes.onLoadRes = function(){}

// managerRes.initPlists = function(plistNames)
// {

// 	for(var i in plistNames)
// 	{	
// 		managerRes.plistsHasLoad[plistNames[i]] = false
// 	}

// 	managerRes.unSilentloadingNum = 0
// }

// managerRes.loadPlistSilent = function(plistName, cb)
// {	
// 	plistPath = managerRes.resPath[plistName + 'Plist'].replace(/\.plist[\s\S]*/, '')

// 	if(managerRes.plistsHasLoad[plistName] == false)
// 	{	
// 		var res = [plistPath + '.plist', plistPath + '.png']
// 	    cc.loader.load(res,
//         function (result, count, loadedCount) 
//         {
//         }, 
//         function() 
//         {	
// 	        cc.spriteFrameCache.addSpriteFrames(plistPath + '.plist', plistPath + '.png' )  
//         	cb?cb(plistPath):'' 
//   			managerRes.plistsHasLoad[plistName] = true
//         })
// 	}
// 	else
// 	{
// 		cb?cb(plistPath):'' 
// 	}
// }

// managerRes.loadPlist = function(plistName, cb, maxTime, timeoutCb)
// {	
// 	plistPath = managerRes.resPath[plistName + 'Plist'].replace(/\.plist[\s\S]*/, '')
// 	maxTime = maxTime || 5000
// 	if(managerRes.isLoadingRes)
// 	{
// 		var old = managerRes.onLoadRes
// 		managerRes.onLoadRes = function()
// 		{	
// 			old?old():''
// 			managerRes.loadPlist(plistPath, cb)
// 		}
// 		return;
// 	}

// 	if(managerRes.plistsHasLoad[plistName] == false)
// 	{	
// 		managerRes.isLoadingRes = true
// 		uiController.topListener.setSwallowTouches(true)
// 		actionFactory.showLoadAnimation()
// 		function loadEnd()
// 		{
// 			managerRes.isLoadingRes = false
// 	       	uiController.topListener.setSwallowTouches(false)
// 	        actionFactory.hideLoadAnimation()
// 	        managerRes.onLoadRes()
// 	  		managerRes.onLoadRes = function(){}
// 		}

// 		var timeout = false
// 	    var id = window.setTimeout(function()
// 	    {   
// 	        timeout = true
// 	        loadEnd()
// 	  		timeoutCb?timeoutCb():''
// 	  		showTipsTTF({str:'资源下载超时'}) 
// 	    }, maxTime)
// 	   	var res = [plistPath + '.plist', plistPath + '.png']
// 	    cc.loader.load(res,
// 	    function (result, count, loadedCount) 
// 	    {
// 	    }, 
// 	    function() 
// 	    {	
// 	    	cc.spriteFrameCache.addSpriteFrames( plistPath + '.plist', plistPath + '.png' ) 
//     		managerRes.plistsHasLoad[plistName] = true
// 	       	if(!timeout)
// 	        {
// 	            window.clearTimeout(id)
// 				loadEnd()
// 	  			cb?cb(plistPath):'' 
// 	        }
// 	    })
// 	}
// 	else
// 	{
// 		cb?cb(plistPath):'' 
// 	}
// }


