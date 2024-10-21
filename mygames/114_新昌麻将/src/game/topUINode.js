

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
        topUINode.riseCallBack = function()
        {
            console.log('1111111--YES--11111111')
            topUINode.setNode.setVisible(false)
            var psResult = getObjWithStructName('CMD_C_LackYes_Result');
            psResult.cbLackYes = true;
            socket.sendMessage(MDM_GF_GAME, SUB_C_LACKYES, psResult)
        }
        topUINode.notRiseCallBack = function()
        {
            console.log('11111111--NO--11111111')
            topUINode.setNode.setVisible(false)

            var psResult = getObjWithStructName('CMD_C_LackYes_Result');
            psResult.cbLackYes = false
            socket.sendMessage(MDM_GF_GAME, SUB_C_LACKYES, psResult)
        }
        topUINode.setLackYesCall = function()
        {
            console.log('2222222--YES---222222222')
            topUINode.pingCuoSet.setVisible(false);
            var psResult = getObjWithStructName('CMD_C_LackNo_Result')
            psResult.cbLackNo = 2;
            socket.sendMessage(MDM_GF_GAME, SUB_C_LACKNO, psResult);
        }
        topUINode.setLackNoCall = function()
        {
            console.log('2222222--NO----222222')
            topUINode.pingCuoSet.setVisible(false)
            var psResult = getObjWithStructName('CMD_C_LackNo_Result')
            psResult.cbLackNo = 1;
            socket.sendMessage(MDM_GF_GAME, SUB_C_LACKNO, psResult);
        }

    },
    _bindListener:function()
    {
    },
}








