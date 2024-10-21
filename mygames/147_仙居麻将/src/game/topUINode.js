

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
            {manText:'不好意思，自摸', womanText:'不好意思，自摸', soundId:1}, 
            {manText:'上家追我追的这么紧', womanText:'上家追我追的这么紧',soundId:2}, 
            {manText:'这牌打的吓死宝宝了', womanText:'这牌打的吓死宝宝了',soundId:3}, 
            {manText:'花来，花来，我胡了', womanText:'花来，花来，我胡了',soundId:4}, 
            {manText:'这把不胡，我把麻将都吃了', womanText:'这把不胡，我把麻将都吃了', soundId:5},
            {manText:'手气这么烂，带本钱也吃回一张', womanText:'手气这么烂，带本钱也吃回一张', soundId:7},
            {manText:'百桌吃，百桌碰，一般人都做不到', womanText:'百桌吃，百桌碰，一般人都做不到', soundId:6},
            {manText:'这么早听牌都胡不了，人都气死', womanText:'这么早听牌都胡不了，人都气死', soundId:8},
            {manText:'出牌怎么这么慢', womanText:'出牌怎么这么慢', soundId:9},
            {manText:'美女，牌打得这么好，加个微信呗', womanText:'帅哥，牌打得这么好，加个微信呗', soundId:10},
            {manText:'你这个傻子', womanText:'你这个傻子', soundId:11},
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

        //record
        if ( isRecordScene )
            recordNode.openPop(mainScene.top)
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








