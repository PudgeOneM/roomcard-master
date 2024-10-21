

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
            {manText:'管住庄家就输的少', womanText:'管住庄家就输的少', soundId:1}, 
            {manText:'好好打牌不要说话', womanText:'好好打牌不要说话',soundId:2}, 
            {manText:'急什么让我想想怎么打', womanText:'急什么让我想想怎么打',soundId:3}, 
            {manText:'快点吧我等的花儿也谢了', womanText:'快点吧我等的花儿也谢了',soundId:4}, 
            {manText:'你这么打牌我也是醉了', womanText:'你这么打牌我也是醉了', soundId:5},
            {manText:'人要赢的起也要输的起', womanText:'人要赢的起也要输的起', soundId:6},
            {manText:'上家管住阿，别放水', womanText:'上家管住阿，别放水', soundId:7},
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








