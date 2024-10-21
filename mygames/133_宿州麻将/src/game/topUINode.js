

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
        //selfdwUserID
        // var selfUser = tableData.getUserWithUserId(selfdwUserID)
        // var isMan =  selfUser.cbGender
        // var faceIds = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18]
        // var voiceArrayM = [
        //     {text:'不好意思 刚刚领导来电话了',soundId:1},
        //     {text:'杠后开花 对不起大家',soundId:2},
        //     {text:'快点 快点 赶不上火车了都',soundId:3},
        //     {text:'你这牌打的也太好了',soundId:4},
        //     {text:'哟 功夫这么好 少林寺练过的呀',soundId:5},
        //     {text:'这把 我赢定了',soundId:6},
        // ]
        // var voiceArrayF = [
        //     {text:'不好意思 刚刚领导来电话了',soundId:1},
        //     {text:'不要走决战到天亮',soundId:2},
        //     {text:'你这牌打得也太好了',soundId:3},
        //     {text:'手下留情老板给的零花钱都输完了',soundId:4},
        //     {text:'哟 功夫这么好 少林寺练过的呀',soundId:5},
        //     {text:'在座的都是渣渣',soundId:6},
        // ]
        // var voiceArray = isMan?voiceArrayM:voiceArrayF
        // var face = facePop2.getFaceButton(faceIds,voiceArray, 6, 3)

        // var ll = cc.EventListener.create({
        //     event: cc.EventListener.CUSTOM,
        //     eventName: "userFace",
        //     callback: function(event)
        //     {
        //         if(!facePop2.pop)
        //         {
        //             var pop = null;
        //             facePop2.voiceArray = selfUser.cbGender?voiceArrayM:voiceArrayF
        //             pop = facePop2.getPop(faceIds,6,3)
        //             pop.setPosition(cc.p(uiController.uiTop.getContentSize().width * 0.5,uiController.uiTop.getContentSize().height * 0.5))
        //             uiController.uiTop.addChild(pop)
        //             facePop2.pop = pop
        //             facePop2.pop.visible = false
        //         }
        //         var data = event.getUserData()
        //         var user = data[0]
        //         facePop2.voiceArray = user.cbGender?voiceArrayM:voiceArrayF
        //     }
        // })
        // cc.eventManager.addListener(ll,0.9)
        var faceIds = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18]
        var voiceArray = [
            {manText:'不好意思 刚刚领导来电话了', womanText:'不好意思 刚刚领导来电话了', soundId:1}, 
            {manText:'杠后开花 对不起大家', womanText:'不要走决战到天亮',soundId:2}, 
            {manText:'快点 快点 赶不上火车了都 ', womanText:'你这牌打得也太好了',soundId:3}, 
            {manText:'你这牌打的也太好了', womanText:'手下留情老板给的零花钱都输完了',soundId:4}, 
            {manText:'哟 功夫这么好 少林寺练过的呀', womanText:'哟 功夫这么好 少林寺练过的呀', soundId:5},
            {manText:'这把 我赢定了', womanText:'在座的都是渣渣', soundId:6},
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








