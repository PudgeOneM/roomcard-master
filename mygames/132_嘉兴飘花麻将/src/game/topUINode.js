

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
        
        topUINode.gmSwitch.setVisible(false)
        
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

        //location
        var location = locationPop.getButton()
        topUINode.locationNode.addChild(location)

        /////reportSide
        reportSide.reportType = 2
        reportSide.init(topUINode.mainNode)
        topUINode.reportNode.addChild( reportSide.reportSideBtn )


        /////menuSide
        ///
        userSettingPop.itemShowState = [true, true, false]
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

        ///////////////嘉兴规则，开始///////////////////
        var psResult = getObjWithStructName('CMD_C_SELECT_RESULT')
        topUINode.selectHasPiaoHua = function()
        {
            psResult.cbSelectResult = 1   // 默认为飘花
            socket.sendMessage(MDM_GF_GAME, SUB_C_SELECT, psResult)

            topUINode.gameSelectNode.visible = false
        }

        topUINode.selectNoPiaoHua = function()
        {
            psResult.cbSelectResult = 100
            socket.sendMessage(MDM_GF_GAME, SUB_C_SELECT, psResult)

            topUINode.gameSelectNode.visible = false
        }

        ///////////////嘉兴规则，结束///////////////////



    },
    _bindListener:function()
    {
    },
}








