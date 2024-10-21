

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
        var faceIds = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]
        var voiceArray = [
            {manText:'哎，都怪我今天风头不好', womanText:'哎，今天风头不好，明天再来过', soundId:1}, 
            {manText:'哎哟，牌打得不错喔', womanText:'不好意思，一不小心失误了',soundId:2}, 
            {manText:'别催了，别催了，我要想一想', womanText:'不会打你也不要乱打呀',soundId:3}, 
            {manText:'别说废话了，专心打牌', womanText:'废话这么多干嘛，快点出',soundId:4}, 
            {manText:'不怕输光，为国争光', womanText:'刚才跑开了，现在马上出', soundId:5},
            {manText:'敢不敢打得更烂一点', womanText:'麻将打得细，说明懂经济', soundId:6},
            {manText:'嗨，美女一起玩啊', womanText:'慢死了，动作快点好不好', soundId:7},
            {manText:'嘿嘿，新手上路请多包含', womanText:'你打牌之前是不是没洗手', soundId:8},
            {manText:'今天牌打得顺，下次再约过', womanText:'你们玩得挺开心呀，也算我一个吧', soundId:9},
            {manText:'你个猪队友，和你搭子太晦气了', womanText:'你这个猪队友', soundId:10},
            {manText:'你真是笨死了', womanText:'牌局可以输，牌品不可以输', soundId:11},
            {manText:'牌是你打得好啊', womanText:'佩服佩服，的确是高手', soundId:12},
            {manText:'朋友们，大家好', womanText:'朋友们，大家好', soundId:13},
            {manText:'为啥还不出', womanText:'一看就是老麻将了', soundId:14},
            {manText:'再也见不到牌技比你还臭的了', womanText:'这牌也太差了', soundId:15},
            {manText:'怎么这么慢', womanText:'专心打牌，别废话了', soundId:16},
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








