

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

        var psResult = getObjWithStructName('CMD_C_PAOSHANG_RESUTL');
        psResult.maFen = 6
        psResult.isFanGui = false

        topUINode.callBackAddScore = function() 
        {   
            psResult.maFen += 2
            if(psResult.maFen >= 10){
                psResult.maFen = 10
            }
          
            topUINode.theScoreLabel.setString(psResult.maFen)            
        }

        topUINode.callBackSubScore = function() 
        {
            psResult.maFen -= 2
            if(psResult.maFen <= 2){
                psResult.maFen = 2
            }
        
            topUINode.theScoreLabel.setString(psResult.maFen)             
        }

        topUINode.callBackYouGui = function()  
        {       
            psResult.isFanGui = true
            psResult.bGameSetEnd = true

            socket.sendMessage(MDM_GF_GAME, SUB_C_PAOSHANG_RESULT, psResult); 
            topUINode.gameSetNode.visible = false;
        }

        topUINode.callBackWuGui = function()    
        {         
            psResult.isFanGui = false
            psResult.bGameSetEnd = true
        
            socket.sendMessage(MDM_GF_GAME, SUB_C_PAOSHANG_RESULT, psResult); 
            topUINode.gameSetNode.visible = false;
        }        
    },
    _bindListener:function()
    {
    },
}








