

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

        //chat
        //
        chatPop.faceNameArray = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18]

         var voiceArray = [
            '别吵了搓麻将专心点',  
            '吃吃吃就知道吃小心变猪头', 
            '动作快点行么',  
            '麻将这么差不来了', 
            '你牌打不打的来', 
            '小胡先胡下 运气快点来',
            '这么厉害连庄好几副啊', 
        ]
        var voiceArray1 = [
            '快点啊，等的睡着了', 
            '别吵了专心打麻将', 
            '别催啦 我还没想好呢',  
            '技术太差回家练练再来', 
            '你今天手气太差了',  
            '佩服还是你水平高',
            '碰到你们就是缘分', 
            '上家别小气 打一张吃一下',
            
        ]
        //self.cbGender = 0
        if ( self.cbGender  )//man
        {
            chatPop.talkNameArray = voiceArray
        }
         else   //woman
        {
            chatPop.talkNameArray = voiceArray1
        }

        

        var chat = chatPop.getChatButton()
        topUINode.chatNode.addChild(chat)
        //////
        
        //////
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
        userSettingPop.itemShowState = [true, true, false]
        menuSide.init(topUINode.mainNode, [1,7,5,6,8])
        topUINode.menuNode.addChild( menuSide.menuSideBtn )

        //location
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








