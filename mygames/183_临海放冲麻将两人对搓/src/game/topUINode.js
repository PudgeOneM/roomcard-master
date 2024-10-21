

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
        // var faceIds = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18]
        // var face = facePop.getFaceButton(faceIds, 6, 3)
        // topUINode.faceNode.addChild(face)

        var faceIds = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18]

        var voiceArray = [
            {manText:'不要吵，不要吵，搓麻将专心点', womanText:'不要吵了，不要吵了，专心打牌', soundId:1}, 
            {manText:'让让我我是新手啊', womanText:'不要催，让我牌看看清楚啊',soundId:2}, 
            {manText:'啊，牌打错了', womanText:'啊，牌打错了',soundId:3}, 
            {manText:'打牌快一点啊，和乌龟爬一样', womanText:'快一点啊,等的睡着了',soundId:4}, 
            {manText:'快输的连裤子都没了', womanText:'手气真差，要回去拜一下了', soundId:5},
            {manText:'这个牌吃的真当舒服，哈哈', womanText:'佩服，还是你水平高', soundId:6},
            {manText:'朋友还是你厉害，连庄那么多把', womanText:'朋友你要什么牌，我打给你', soundId:7},
            {manText:'吃吃吃，吃多了变猪头', womanText:'上家啊，让我吃一口', soundId:8},
        ]

        //var face = facePop.getFaceButton(faceIds, 6, 3)
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


        /////menuSide
        menuSide.init(topUINode.mainNode, [1,7,5,6,8])
        topUINode.menuNode.addChild( menuSide.menuSideBtn )

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








