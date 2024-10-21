
var newsSide = 
{
    resp:'components/newsSide/res/',
    newsSideNode:null,
    newsListNode:null,
    newsBtnNode:null,
    newsplayDot:null,
    messageSpr:null,
    newsListView:null,
    preLoadRes:
    [
    'components/newsSide/res/newsSide.plist', 
    'components/newsSide/res/newsSide.png'
    ],
    onPreLoadRes:function()
    {
        var resp = newsSide.resp
        cc.spriteFrameCache.addSpriteFrames(resp + 'newsSide.plist', resp + 'newsSide.png')
    },
    onReStart:function()
    {  
        newsSide.newsListView = null
    },
    init:function(parentNode)
    {   
        ////
        newsSide._initSide(parentNode)
        parentNode.addChild(newsSide.newsSideNode)
        newsSide.newsSideNode.setVisible(false)    

        //////
        var resp = newsSide.resp
        var newsBtnNode = new cc.Node()

        var btn = new ccui.Button( resp + 'btn1.png', resp + 'btn2.png' )
        btn.setTouchEnabled(true)
        btn.addClickEventListener(function(button) {
            managerAudio.playEffect('publicRes/sound/click.mp3')
            newsSide.newsSideNode.setVisible(true)
        }.bind(this))
        newsBtnNode.addChild(btn)

        var newsplayDot = new cc.Sprite('#ns_dot.png')
        newsplayDot.setPosition(cc.p(23, 16))
        newsplayDot.setVisible(false)
        newsBtnNode.addChild(newsplayDot, 2)

        var messageSpr = new cc.Sprite('#ns_message.png')
        newsBtnNode.addChild(messageSpr)

        newsSide.newsBtnNode = newsBtnNode
        newsSide.newsplayDot = newsplayDot
        newsSide.messageSpr = messageSpr


        var mailArray = getLocalStorage('mailArray' + selfdwUserID)
        mailArray = typeof(mailArray) == 'undefined'?[]:JSON.parse(mailArray)

        for(var i=mailArray.length-1;i>=0;i--)
        {
            if(mailArray[i] == null)
                mailArray.splice(i,1)
        }
        setLocalStorage('mailArray' + selfdwUserID, JSON.stringify(mailArray).replace(/\\u0000/g, ''))

        for(var i=mailArray.length-1;i>=0;i--)
        {
            newsSide.addMailItem(mailArray[i], i)
        }
    },
    addMailToStorage:function(body) 
    {
        var mailArray = getLocalStorage('mailArray' + selfdwUserID)
        mailArray = typeof(mailArray) == 'undefined'?[]:JSON.parse(mailArray)
        var idxInMailArray = mailArray.length
        mailArray[idxInMailArray] = body

        setLocalStorage('mailArray' + selfdwUserID, JSON.stringify(mailArray).replace(/\\u0000/g, ''))

        return idxInMailArray
    },
    addMailItem:function(body, idxInMailArray)
    {
        var str = body.szSystemMessage
        var strName = body.szSrcNick

        var contentNode = new cc.Node()
        var label = getLabel(16, 240, 2)
        label.setStringNew(str)
        label.textAlign = cc.TEXT_ALIGNMENT_LEFT
        label.setPositionX(120)
        label.setFontFillColor(cc.color(0, 153, 149, 255))
        contentNode.addChild(label)

        newsSide.addNewsItem({
            'iconurl':2,
            'title':strName,
            'contentNode':contentNode,
            callyes:function()
            {
                var mailArray = getLocalStorage('mailArray' + selfdwUserID)
                mailArray = JSON.parse(mailArray)
                mailArray[idxInMailArray] = null
                setLocalStorage('mailArray' + selfdwUserID, JSON.stringify(mailArray).replace(/\\u0000/g, ''))
            },
        })
    },
    _initSide:function(parentNode)
    {  
        var win = cc.director._winSizeInPoints
        var s = parentNode.getContentSize()
        cc.director._winSizeInPoints = cc.size(s.width, s.height)
        var resp = newsSide.resp
        var newsSideNode = cc.BuilderReader.load(resp + 'newsSide.ccbi', this)
        cc.director._winSizeInPoints = cc.size(win.width, win.height)
        
        var listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget()
                if(!target.isVisible()) return false
                var locationInNode = target.convertToNodeSpace(touch.getLocation())
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height)
                if (cc.rectContainsPoint(rect, locationInNode)) {
                    return true
                }
                newsSide.newsSideNode.setVisible(false)
                return false
            },
            onTouchEnded: function (touch, event) {
            }
        })
        cc.eventManager.addListener(listener, newsSideNode)

        newsSide.newsSideNode = newsSideNode
    },
    addNewsItem:function(params) 
    {
        if(!newsSide.newsListView )
        {
            newsSide.newsListView = new ccui.ListView()
            // var t = newsSide.newsListView.onExit 在这来不及了 必须立即newsSide.newsListView = null
            // newsSide.newsListView.onExit = function()
            // {
            //     t.apply(newsSide.newsListView)
            //     newsSide.newsListView = null

            //     console.log(999999)
            // }

            var listView = newsSide.newsListView
            listView.setDirection(ccui.ScrollView.DIR_VERTICAL)
            listView.setTouchEnabled(true)
            listView.setBounceEnabled(true)
            listView.setBackGroundImage(resp_p.empty)
            listView.setBackGroundImageScale9Enabled(true)

            listView.setContentSize(newsSide.newsListNode.getContentSize().width,newsSide.newsListNode.getContentSize().height-10)
            listView.x = 0
            listView.y = 0
            newsSide.newsListNode.addChild(listView)
        }

        var listView = newsSide.newsListView

        listView.pushBackCustomItem(newsSide._getNewsplayItem(listView.width, params ) )
        listView.forceDoLayout()
        listView.setTouchEnabled(listView.getItem(0) && listView.getItem(0).getPositionY()+listView.getItem(0).getContentSize().height>listView.height)
       
        newsSide.newsplayDot.setVisible(true)

        if(!newsSide.messageSpr.getNumberOfRunningActions())
        {
            var action = cc.blink(5, 10);
            newsSide.messageSpr.runAction(action)
        }
    },
    _getNewsplayItem:function(listViewWidth, params) 
    {
        var default_item = new ccui.Layout();
        default_item.setContentSize(listViewWidth-10, 100)
        
        var iconurl = params.iconurl
        var title =  params.title
        var contentNode = params.contentNode


        var removeItem = function()
        {
            newsSide.newsListView.removeChild(default_item, true)
            newsSide.newsplayDot.setVisible(newsSide.newsListView._items.length != 0)
        }

        if(!params.callno && !params.callyes)
        {
            var closeBtn = new ccui.Button()
            closeBtn.setTouchEnabled(true)
            closeBtn.setScale9Enabled(true)
            closeBtn.loadTextures(resp_p.empty, resp_p.empty, resp_p.empty)
            closeBtn.setContentSize( cc.size(listViewWidth-10, 100)  )
            closeBtn.setPosition(cc.p( (listViewWidth-10)/2, 50 ))
            closeBtn.addClickEventListener(function(closeBtn) {
                removeItem()
            }.bind(this))
            default_item.addChild(closeBtn)
        }

        var callno = function()
        {
            removeItem()
            params.callno?params.callno():''
        }

        var callyes = function()
        {
            removeItem()
            params.callyes?params.callyes():''
        }

        //////
        var headSprName = '#headIcon.png'
        if(iconurl == 2)
            headSprName = '#headIcon2.png'

        var iconspr = new cc.Sprite(headSprName)
        var hnode = getCircleNodeWithSpr(iconspr)
        hnode.setScale(0.8)
        hnode.setPosition(cc.p(40, 50))
        default_item.addChild(hnode)

        if(typeof(iconurl) == 'string')
        {
            cc.loader.loadImg(iconurl, {isCrossOrigin : false}, function(err,img){
                var texture2d = new cc.Texture2D()
                texture2d.initWithElement(img)
                texture2d.handleLoadedTexture()

                var frame = new cc.SpriteFrame(texture2d, cc.rect(0, 0, texture2d.getContentSize().width, texture2d.getContentSize().height))
                iconspr.setSpriteFrame(frame)
            })
        }
        
        var titleLabel = getLabel(18, 120, 1)
        titleLabel.textAlign = cc.TEXT_ALIGNMENT_LEFT
        titleLabel.setStringNew(title)
        titleLabel.setFontFillColor( cc.color(255, 255, 255, 255) )
        titleLabel.setPosition(cc.p(60 + 75, 68))
        default_item.addChild(titleLabel)

        contentNode.setPosition(cc.p(75, 38))
        default_item.addChild(contentNode)

        var iconno = new cc.Sprite('#ns_iconno.png')
        iconno.setScale(0.8)
        iconno.setPosition(cc.p(listViewWidth-105, 50))
        default_item.addChild(iconno)
        iconno.setVisible(params.callno)


        var iconyes = new cc.Sprite('#ns_iconyes.png')
        iconyes.setScale(0.8)
        iconyes.setPosition(cc.p(listViewWidth-40, 50))
        default_item.addChild(iconyes)
        iconyes.setVisible(params.callyes)
        iconyes.isyes = true

        //////
        var listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget()
                if(!target.isVisible()) return false
                var locationInNode = target.convertToNodeSpace(touch.getLocation())
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height)
                if (cc.rectContainsPoint(rect, locationInNode)) {
                    return true
                }
                return false
            },
            onTouchEnded: function (touch, event) {
                var target = event.getCurrentTarget()
                if( managerTouch.isQuickTouch(target, 1000) )
                    return;
                if(target.isyes)
                    callyes()
                else
                    callno()
 
            }
        })
        cc.eventManager.addListener(listener.clone(), iconno)
        cc.eventManager.addListener(listener.clone(), iconyes)

        var spr9 = new cc.Scale9Sprite('s_sp9_16.png')
        spr9.width = listViewWidth
        spr9.height = 2 
        spr9.x = listViewWidth/2
        spr9.y = 0
        default_item.addChild(spr9)


        return default_item

    },
}












