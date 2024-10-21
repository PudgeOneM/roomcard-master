

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

        //face
        var faceIds = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18]
        var voiceArray = [
            {manText:'别吵了搓麻将专心点', womanText:'快点啊，等的睡着了', soundId:1}, 
            {manText:'吃吃吃就知道吃小心变猪头', womanText:'别吵了专心打麻将',soundId:2}, 
            {manText:'动作快点行么', womanText:'别催啦 我还没想好呢',soundId:3}, 
            {manText:'麻将这么差不来了', womanText:'技术太差回家练练再来',soundId:4}, 
            {manText:'你牌打不打的来', womanText:'你今天手气太差了', soundId:5},
            {manText:'小胡先胡下 运气快点来', womanText:'佩服还是你水平高', soundId:6},
            {manText:'这么厉害连庄好几副啊', womanText:'碰到你们就是缘分', soundId:7},
            {manText:'', womanText:'上家别小气 打一张吃一下', soundId:8},
        ]
        var face = facePop2.getFaceButton(faceIds, voiceArray, 6, 3)
        topUINode.faceNode.addChild(face)
        
        ////
        topUINode.limitUINode.setVisible( isInTable )

        /////newsSide
        newsSide.init(topUINode.mainNode)
        topUINode.newsNode.addChild( newsSide.newsBtnNode )

        /////reportSide
        reportSide.reportType = 2
        reportSide.init(topUINode.mainNode)
        topUINode.reportNode.addChild( reportSide.reportSideBtn )

        //location
        var location = locationPop.getButton()
        //location.setScale(0.96)
        // location.x = location.x + 2
        // location.loadTextures('localtionPop.png','localtionPop.png','localtionPop.png',ccui.Widget.PLIST_TEXTURE)
        topUINode.locationNode.addChild(location)
        
        /////menuSide
        menuSide.init(topUINode.mainNode, [1,7,5,6,8])
        topUINode.menuNode.addChild( menuSide.menuSideBtn )

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








