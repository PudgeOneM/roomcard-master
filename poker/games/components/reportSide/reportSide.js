
var reportSide = 
{   
    isHideCloseClock:true,
    resp:'components/reportSide/res/',
    preLoadRes:
    [
    'components/reportSide/res/reportSide.plist', 
    'components/reportSide/res/reportSide.png'
    ],
    onPreLoadRes:function()
    {
        var resp = reportSide.resp
        cc.spriteFrameCache.addSpriteFrames(resp + 'reportSide.plist', resp + 'reportSide.png')
    },
    reportType:1,
    reportList:null,
    reportSideNode:null,
    reportSideBtn:null,
    lookerListView:null,
    reportListView:null,
    init:function(parentNode)
    {   
        ////
        reportSide._initSide(parentNode)
        parentNode.addChild(reportSide.reportSideNode)
        reportSide.reportSideNode.setVisible(false)    

        //////
        var resp = reportSide.resp
        var reportSideBtn = new ccui.Button( resp + 'btn1.png', resp + 'btn2.png' )
        reportSideBtn.setTouchEnabled(true)
        reportSideBtn.addClickEventListener(function(button) {
            managerAudio.playEffect('publicRes/sound/click.mp3')
            reportSide.reportSideNode.setVisible(true)
        }.bind(this))

        reportSide.reportSideBtn = reportSideBtn
    },
    onReStart:function()
    {  
        reportSide.lookerListView = null
        reportSide.reportListView = null
    },
    _initSide:function(parentNode) 
    {  
        var win = cc.director._winSizeInPoints
        var s = parentNode.getContentSize()
        cc.director._winSizeInPoints = cc.size(s.width, s.height)
        var resp = reportSide.resp
        var reportSideNode = cc.BuilderReader.load(resp + 'reportSide.ccbi', this)
        cc.director._winSizeInPoints = cc.size(win.width, win.height)

        reportSide['type' + reportSide.reportType + 'Node'].setVisible(true)


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
                reportSide.reportSideNode.setVisible(false)    
                return false
            },
            onTouchEnded: function (touch, event) {
            }
        })
        cc.eventManager.addListener(listener, reportSideNode)

        reportSide.refreshLookerListNode()
        if(!reportSide.isHideCloseClock)
        {
            var l = cc.EventListener.create({
                event: cc.EventListener.CUSTOM,
                eventName: "isOpenUpdate",
                callback: function(event)
                {   
                    if(tableData.bIsOpened)
                    {
                        tableNode.startCloseClock(reportSide.tableCloseClockLabel)
                        reportSide.tableCloseClockLabel.setVisible(true)
                    }
                }
            })
            cc.eventManager.addListener(l, 1)
        }

        var l = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "lookerUpdate",
            callback: function(event)
            {   
                reportSide.refreshLookerListNode()
            }
        })
        cc.eventManager.addListener(l, 1)

        reportSide.reportSideNode = reportSideNode
    },
    refreshLookerListNode:function()
    {
        var self = tableData.getUserWithUserId(selfdwUserID)
        var usersInAndOutTable = tableData.getUsersInAndOutTable(self.wTableID)

        var lookerList = []
        var subLookerList = []
        for(var i in usersInAndOutTable)
        {   
            
            var user = usersInAndOutTable[i]
            if(user.cbUserStatus == US_LOOKON)
            {
                if(subLookerList.length==2)
                {   
                    subLookerList[subLookerList.length] = user
                    lookerList[lookerList.length] = subLookerList
                    subLookerList = []
                }
                else
                {   
                    subLookerList[subLookerList.length] = user
                }
            }
        }
        if(subLookerList.length>0)
            lookerList[lookerList.length] = subLookerList
 
        /////
        if(!reportSide.lookerListView )
        {
            reportSide.lookerListView = new ccui.ListView()
            // var t = reportSide.lookerListView.onExit
            // reportSide.lookerListView.onExit = function()
            // {
            //     t.apply(reportSide.lookerListView)
            //     reportSide.lookerListView = null
            // }

            var listView = reportSide.lookerListView
            listView.setDirection(ccui.ScrollView.DIR_VERTICAL)
            listView.setTouchEnabled(true)
            listView.setBounceEnabled(true)
            listView.setBackGroundImage(resp_p.empty)
            listView.setBackGroundImageScale9Enabled(true)

            listView.setContentSize(reportSide.lookerListNode.getContentSize().width,reportSide.lookerListNode.getContentSize().height-10)
            listView.x = 0
            listView.y = 0
            // listView.addEventListener(this.selectedItemEvent, this)
            reportSide.lookerListNode.addChild(listView)
        }
        reportSide.lookerListView.removeAllChildren()

        var listView = reportSide.lookerListView
        for(var i=0;i<lookerList.length;i++)
        {   
            listView.pushBackCustomItem(reportSide._getLookerItem(listView.width, lookerList[i]))
        }
        listView.forceDoLayout()
        listView.setTouchEnabled(listView.getItem(0) && listView.getItem(0).getPositionY()+listView.getItem(0).getContentSize().height>listView.height)
    },
    _getLookerItem:function(listViewWidth, looker)
    {
        var default_item = new ccui.Layout();
        default_item.setContentSize(listViewWidth-10, 100)

        function fun(user, posx)
        {
            var headIcon = new cc.Sprite('#headIcon.png')
            var hnode = getCircleNodeWithSpr(headIcon)
            hnode.setScale(0.8)
            hnode.setPosition(cc.p(posx, default_item.height*0.6))
            default_item.addChild(hnode)

            var szNickName = getLabel(16, 100, 2)
            szNickName.setStringNew(user.szNickName)
            //var szNickName = new cc.LabelTTF(user.szNickName, "Helvetica", 20)
            szNickName.setFontFillColor(cc.color(242, 234, 211, 255) )
            szNickName.setPosition(cc.p(posx, default_item.height*0.15))
            default_item.addChild(szNickName)

            var url = user.szHeadImageUrlPath
            cc.loader.loadImg(url, {isCrossOrigin : false}, function(err,img){
                    var texture2d = new cc.Texture2D()
                    texture2d.initWithElement(img)
                    texture2d.handleLoadedTexture()

                    var frame = new cc.SpriteFrame(texture2d, cc.rect(0, 0, texture2d.getContentSize().width, texture2d.getContentSize().height))
                    headIcon.setSpriteFrame(frame)
            })
        }

        for(var i=0;i<looker.length;i++)
        {
            var user = looker[i]
            fun( user, default_item.width*(0.3*i + 0.2) )
        }

        return default_item
    },
    refreshReportListNode:function()
    {
        reportSide.reportList.sort(function(a,b)
        {   
            return parseInt(b.lScoreInGameChange) - parseInt(a.lScoreInGameChange)
        })

        //////
        if(!reportSide.reportListView )
        {
            reportSide.reportListView = new ccui.ListView()
            // var t = reportSide.reportListView.onExit
            // reportSide.reportListView.onExit = function()
            // {
            //     t.apply(reportSide.reportListView)
            //     reportSide.reportListView = null
            // }

            var listView = reportSide.reportListView
            listView.setDirection(ccui.ScrollView.DIR_VERTICAL)
            listView.setTouchEnabled(true)
            listView.setBounceEnabled(true)
            listView.setBackGroundImage(resp_p.empty)
            listView.setBackGroundImageScale9Enabled(true);
            listView.setContentSize(reportSide.reportListNode.getContentSize().width,reportSide.reportListNode.getContentSize().height-10)
            reportSide.reportListNode.addChild(listView)
        }
        reportSide.reportListView.removeAllChildren()

        var listView = reportSide.reportListView

        for(var i=0;i<reportSide.reportList.length;i++)
        {   
            gameLog.log( i.toString() + '-' + reportSide.reportList[i].lScoreInGameChange.toString())

            listView.pushBackCustomItem(reportSide._getRecordItem(listView.width, reportSide.reportList[i]))
        }
        listView.forceDoLayout()

        listView.setTouchEnabled(listView.getItem(0) && listView.getItem(0).getPositionY()+listView.getItem(0).getContentSize().height>listView.height)

    },
    _getRecordItem:function(listViewWidth, record)
    {
        var default_item = new ccui.Layout();
        default_item.setContentSize(listViewWidth-10, 50)
        var szNickName = getLabel(24, 150, 1)
        szNickName.setStringNew(record.szNickName)
        var lScoreInGame = new cc.LabelTTF(record.lScoreInGame.toString(), "Helvetica", 24)
        var lScoreInGameChange = new cc.LabelTTF(record.lScoreInGameChange.toString(), "Helvetica", 24)
        
        var color = record.dwUserID == selfdwUserID?cc.color(0, 153, 149, 255):cc.color(242, 234, 211, 255)
        szNickName.setFontFillColor( color )
        lScoreInGame.setFontFillColor( color )
        lScoreInGameChange.setFontFillColor( color )

        szNickName.setPositionY(default_item.height*0.5)
        lScoreInGame.setPositionY(default_item.height*0.5)
        lScoreInGameChange.setPositionY(default_item.height*0.5)

        switch(reportSide.reportType)
        {
            case 1:
            {
                szNickName.setPositionX(default_item.width*0.2)
                lScoreInGame.setPositionX(default_item.width*0.5)
                lScoreInGameChange.setPositionX(default_item.width*0.8)

                default_item.addChild(szNickName)
                default_item.addChild(lScoreInGame)
                default_item.addChild(lScoreInGameChange)

                break
            }
            case 2:
            {
                szNickName.setPositionX(default_item.width*0.3)
                lScoreInGameChange.setPositionX(default_item.width*0.7)

                default_item.addChild(szNickName)
                default_item.addChild(lScoreInGameChange)

                break
            }
        }

        return default_item
    },
}












