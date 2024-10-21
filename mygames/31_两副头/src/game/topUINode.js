

var topUINode = 
{   
    voicePlaySpr:null,
    taoshang:1,
    pingju:1,
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
        var face = facePop.getFaceButton(faceIds, 6, 3)
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
        // userSettingPop.itemShowState = [true, true, false]

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
                    //playNode.sendCardsAction()


            if(topUINode.gmNode.getChildByTag(101))
                topUINode.gmNode.removeChildByTag(101)
            else
            {
                var gmNode = pokerGmPop.getPop()
                topUINode.gmNode.addChild(gmNode, 0, 101)
            }
        }
        topUINode.quantao1 = function()
        {
            topUINode.taoshang++
            var locationX = topUINode.taoshang2.x 
            topUINode.taoshang2.x = topUINode.taoshang1.x
            topUINode.taoshang1.x = locationX
        }
        topUINode.pingju1 = function()
        {
            topUINode.pingju++
            var locationX = topUINode.PingJu2.x 
            topUINode.PingJu2.x = topUINode.PingJu1.x
            topUINode.PingJu1.x = locationX
        }
        topUINode.YouPingJu = function  () {
            // body...
            if(topUINode.PingJu1.x == 33)
            {
                topUINode.pingju++
                topUINode.PingJu2.x = 33
                topUINode.PingJu1.x = -136
            }
        }
        topUINode.WuPingJu = function  () {
            if(topUINode.PingJu2.x == 33)
            {
                topUINode.pingju++
                topUINode.PingJu2.x = -136
                topUINode.PingJu1.x = 33
            }
        }
        topUINode.sure = function()
        {
            console.log(topUINode.taoshang,topUINode.pingju)
            var taoShang = 0
            var pingJu = 0
            if(topUINode.taoshang % 2 == 0)
                taoShang = 1
            if(topUINode.pingju % 2 == 0)
                pingJu = 1
            var CallCard = getObjWithStructName('CMD_C_CommitMorden') 
            CallCard.wTaoShangType = taoShang
            CallCard.wPingJuType = pingJu
            socket.sendMessage(MDM_GF_GAME, SUB_C_COMMITMORDEN, CallCard)
            topUINode.chooseMorden.setVisible(false)
        }
    },
    _bindListener:function()
    {
    },
}