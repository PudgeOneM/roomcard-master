

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

        ////location
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
            //  ['WORD', 'wWinner'],
    // ['WORD', 'wExitUser'],                          //强退用户
    // ['BYTE', 'endType'],                            //0强退 1流局 2自摸 3点炮
    // ['WORD', 'wProvideUser'],                       //供应用户
    // ['BYTE', 'cbProvideCardData'],                      //供应扑克
    // ['DWORD', 'dwChiHuKind', GAME_PLAYER],          //胡牌类型
    // ['DWORD', 'dwChiHuRight', GAME_PLAYER],         //胡牌类型

    // ['SCORE', 'lGameScore', GAME_PLAYER],           //游戏积分
    // ['BYTE', 'cbHandCardCount', GAME_PLAYER],           //扑克数目
    // ['BYTE', 'cbHandCardData', GAME_PLAYER, MAX_COUNT], //扑克数据

    // //组合扑克
    // ['BYTE', 'cbWeaveCount', GAME_PLAYER],                  //组合数目
    // ['tagWeaveItem', 'WeaveItemArray', GAME_PLAYER, MAX_WEAVE],     //组合扑克
        //     var body = {}
        //     body.wExitUser = INVALID_CHAIR
        //     body.endType = 2
        //     body.wProvideUser = 1
        //     body.cbProvideCardData = 1
        //     body.dwChiHuRight = [1, 1, 0, 0]
        //     body.cbFanCount = [1, 1, 1, 1]
        //     body.lGameScore = [1, 0, -1, 0]
        //     body.cbHandCardCount = [13, 13, 13, 13]
        //     body.cbHandCardData = [
        //         [1,1,2,2,3,3,4,4,5,5,6,6,7],
        //         [17,17,18,18,19,19,20,20,21,21,22,22,23],
        //         [1,1,2,2,3,3,4,4,5,5,6,6,7],
        //         [17,17,18,18,19,19,20,20,21,21,22,22,23]
        //     ]
        //     body.cbWeaveCount = [0,0,0,0]
        //     body.WeaveItemArray = [
        //         [0, 0, 0, 0, [0,0,0,0]],
        //         [0, 0, 0, 0, [0,0,0,0]],
        //         [0, 0, 0, 0, [0,0,0,0]],
        //         [0, 0, 0, 0, [0,0,0,0]]
        //     ]
        //     body.dwChiHuKind = [64, 0, 0, 0]

        //     cmdBaseWorker.onCMD_GameEnd(body)
        //     var event = new cc.EventCustom("cmdEvent")
        //     event.setUserData(['onCMD_GameEnd'])
        //     cc.eventManager.dispatchEvent(event)
        }
    },
    _bindListener:function()
    {
    },
}








