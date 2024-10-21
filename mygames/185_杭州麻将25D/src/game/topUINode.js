

var topUINode = 
{   
    voicePlaySpr:null,
    // recordList:[], 
    init:function()
    {   
        topUINode._initCallBack()
        var node = managerRes.loadCCB(resp.topUICCB, this)
        topUINode.animationManager = node.animationManager
        topUINode.node  = node

        topUINode._bindListener()

        topUINode.menuNode = tableNode.menuNode
        topUINode.reportNode = tableNode.reportNode
        topUINode.newsNode = tableNode.newsNode
        topUINode.locationNode = tableNode.locationNode


        var self = tableData.getUserWithUserId(selfdwUserID)
        var isInTable = tableData.isInTable(self.cbUserStatus) 
        
        topUINode.gmSwitch.setVisible(isOpenGm)
        //voice
        wxVoiceNode.init(topUINode.voicePlayNode)
        topUINode.voiceNode.addChild(wxVoiceNode.voiceNode)
        // topUINode.voiceNode.setVisible( selfdwUserID == tableData.createrUserID || isInTable)



        chatPop.faceNameArray = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18]
        chatPop.talkNameArray = [
        '666',
        '不作死，就不会死',
        '打牌这么厉害，你麻麻知道吗',
        '还有谁！',
        '好好打牌，不要说话',
        '好牌，好牌',
        '和你合作真是太愉快了',
        '急什么，让我想想怎么打',
        '快出！快出！快出！重要的事情说三遍',
        '快点吧，我等到花儿都谢了',
        '奶奶的，容我喝一杯82年的龙井压压惊',
        '你们城里人真会玩',
        '你这么打牌，我也是醉了',
        '牌友诚可贵，且打且珍惜',
        '人要赢得起，也要输得起',
        '天下还有这样的烂牌',
        '我的时间非常值钱',
        '我要胡了，你们随意',
        '我已经稳坐钓鱼台，你随便打',
        '我只想安静的做个宝宝',
        '有钱就是任性',
        '这手牌，我的内心几乎是崩溃的',
        'boss，带我装逼带我飞',
        'we are fammly，好牌友一辈子'
        ]
        var chat = chatPop.getChatButton()
        topUINode.chatNode.addChild(chat)

        ////
        topUINode.limitUINode.setVisible( isInTable )

        /////newsSide
        newsSide.init(topUINode.mainNode)
        topUINode.newsNode.addChild( newsSide.newsBtnNode )

        /////reportSide
        reportSide.reportType = 2
        reportSide.init(topUINode.mainNode)
        topUINode.reportNode.addChild( reportSide.reportSideBtn )


        /////menuSide
        menuSide.init(topUINode.mainNode, [1,7,5,6,8])
        topUINode.menuNode.addChild( menuSide.menuSideBtn )

        ////location
        var location = locationPop.getButton()
        topUINode.locationNode.addChild(location)

            //////rule
        var t = menuSide.itemNodes[7].listNode
        var scrollView = new ccui.ScrollView()
        scrollView.setDirection(ccui.ScrollView.DIR_VERTICAL)
        scrollView.setTouchEnabled(true)
        scrollView.setBounceEnabled(true)

        var size = t.getContentSize()
        scrollView.setContentSize( size )
        scrollView.x = size.width*0.5
        scrollView.y = size.height*0.5
        scrollView.anchorX = 0.5
        scrollView.anchorY = 0.5

        var rule = cc.BuilderReader.load(resp.ruleCCB , {})

        scrollView.addChild(rule) 
        scrollView.setInnerContainerSize(rule.getContentSize())
        t.addChild(scrollView)

    },
    _initCallBack:function()
    { 
        topUINode.gmSwitchCall = function() 
        {
            if(topUINode.gmNode.getChildByTag(101))
                topUINode.gmNode.removeChildByTag(101)
            else
            {
                var gmNode = majiangGmPop.getPop()
                topUINode.gmNode.addChild(gmNode, 0, 101)
            }
        }
    },
    _bindListener:function()
    {
    },
}








