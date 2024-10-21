

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
        //face
        var faceIds = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18]
        var voiceArray1 = [
            {manText:'别催了,我想想打哪一张', womanText:'别催了,我想想打哪一张', soundId:1}, 
            {manText:'打一张来吃呀', womanText:'打一张来吃呀',soundId:2}, 
            {manText:'今天的牌真合你吃', womanText:'今天的牌真合你吃',soundId:3},
            {manText:'今天手气真好', womanText:'今天手气真好', soundId:4}, 
            {manText:'可以快点吗，兄弟', womanText:'可以快点吗，兄弟',soundId:5}, 
            {manText:'做你下家不合吃', womanText:'做你下家不合吃',soundId:6},
            {manText:'总是你糊有意思么', womanText:'总是你糊有意思么',soundId:7},
            {manText:'这张吃的好', womanText:'这张吃的好',soundId:8}, 
            {manText:'现在才开糊', womanText:'现在才开糊',soundId:9},
            {manText:'你今天很旺', womanText:'你今天很旺',soundId:10},
        ]
        var face = facePop2.getFaceButton(faceIds, voiceArray1, 6, 3)
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

        //record
        if (isRecordScene)
            recordNode.openPop(mainScene.top)

        /////menuSide
        ///
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








