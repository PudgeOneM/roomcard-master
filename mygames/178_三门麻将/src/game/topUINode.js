

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

        var self = tableData.getUserWithUserId(selfdwUserID)
        var isInTable = tableData.isInTable(self.cbUserStatus) 
        
        topUINode.gmSwitch.setVisible(isOpenGm)
        //voice
        wxVoiceNode.init(topUINode.voicePlayNode)
        topUINode.voiceNode.addChild(wxVoiceNode.voiceNode)
        // topUINode.voiceNode.setVisible( selfdwUserID == tableData.createrUserID || isInTable)

        //chat
        // var faceIds = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18]
        // var chat = chatPop.getChatButton(faceIds, 6, 3)
        // topUINode.chatNode.addChild(chat)
        // 
        var faceIds = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18]
        var voiceArray = [
            {manText:'按这个节奏，这个牌要打一年了', womanText:'按这个节奏，这个牌要打一年了', soundId:1}, 
            {manText:'不要吵，好好打牌', womanText:'不要吵，好好打牌',soundId:2}, 
            {manText:'不要催，我要考虑一下', womanText:'不要催，我要考虑一下',soundId:3},
            {manText:'没吃没碰，上家太厉害了', womanText:'没吃没碰，上家太厉害了', soundId:4}, 
            {manText:'美女牌打得那么好微信加一个', womanText:'帅哥牌打得那么好微信加一个',soundId:5}, 
            {manText:'美女晚上一起吃宵夜', womanText:'帅哥晚上一起吃宵夜',soundId:6},
            {manText:'你的技术太烂了', womanText:'你的技术太烂了',soundId:7},
            {manText:'牌打快一点', womanText:'牌打快一点',soundId:8}, 
            {manText:'上家打个牌吃一下', womanText:'上家打个牌吃一下',soundId:9},
            {manText:'一把都不糊，内裤都输掉了', womanText:'一把都不糊，内裤都输掉了',soundId:10},
            {manText:'这把牌胡不了，我把麻将吃了', womanText:'这把牌胡不了，我把麻将吃了',soundId:11},
            {manText:'运气太差了，这么好的牌都胡不了', womanText:'运气太差了，这么好的牌都胡不了',soundId:12},
        ]
        var chat = myFacePoP.getFaceButton(faceIds, voiceArray, 6, 3)
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

        //record
        if(isRecordScene)
            recordNode.openPop(mainScene.top)

        /////menuSide
        //userSettingPop.itemShowState = [true, true, false]
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

recordNode.getPlayInterval=function(subId)
{
    switch(subId)
    {
        case SUB_S_GAME_START: return 3000
        case SUB_S_OPERATE_RESULT: return 2000
    }

    //这个是默认时间
    return 1000;
}








