

var topUINode = 
{   
    voicePlaySpr:null,
    baoPiGuCount:0,
    qiangGangCount:0,
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

        //chat
        // var faceIds = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18]
        // var chat = chatPop.getChatButton(faceIds, 6, 3)
        // topUINode.chatNode.addChild(chat)
        ////
        var faceIds = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18]

        var voiceArray = [
            {manText:'哎，都怪我今天风头不好', womanText:'哎，今天风头不好，明天再来过', soundId:1}, 
            {manText:'别说废话了，专心打牌', womanText:'专心打牌，别废话了',soundId:2}, 
            {manText:'怎么这么慢', womanText:'慢死了，动作快点好不好',soundId:3}, 
            {manText:'你个猪队友，和你搭子太晦气了', womanText:'你这个猪队友',soundId:4}, 
            {manText:'为啥还不出', womanText:'废话这么多干嘛，快点出', soundId:5},
            {manText:'敢不敢打得更烂一点', womanText:'不会打你也不要乱打呀', soundId:6},
            {manText:'牌是你打得好啊', womanText:'佩服佩服，的确是高手', soundId:7},
            {manText:'朋友们，大家好', womanText:'朋友们，大家好', soundId:8},
        ]
        
        var face = facePop2.getFaceButton(faceIds, voiceArray, 6, 3)
        topUINode.chatNode.addChild(face)

        topUINode.limitUINode.setVisible( isInTable )

        /////newsSide
        newsSide.init(topUINode.mainNode)
        topUINode.newsNode.addChild( newsSide.newsBtnNode )

        /////reportSide
        reportSide.reportType = 2
        reportSide.init(topUINode.mainNode)
        topUINode.reportNode.addChild( reportSide.reportSideBtn )


        /////menuSide
        userSettingPop.itemShowState = [true, true, false]
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
        topUINode.baoPiGu = function()
        {
            topUINode.baoPiGuCount++
            if(topUINode.baoPiGuCount%2!=0)
            {
                topUINode.baoPiGu_0.setVisible(false)
                topUINode.baoPiGu_1.setVisible(true)
            }
            else
            {
                topUINode.baoPiGu_0.setVisible(true)
                topUINode.baoPiGu_1.setVisible(false)
            }

        }
        topUINode.piGu = function(){
            topUINode.baoPiGuCount++
            if(topUINode.baoPiGuCount%2!=0)
            {
                topUINode.baoPiGu_0.setVisible(false)
                topUINode.baoPiGu_1.setVisible(true)
            }
            else
            {
                topUINode.baoPiGu_0.setVisible(true)
                topUINode.baoPiGu_1.setVisible(false)
            }
        }
        topUINode.qG = function () {
            topUINode.qiangGangCount++
            if(topUINode.qiangGangCount%2!=0)
            {
                topUINode.qiangGang_0.setVisible(false)
                topUINode.qiangGang_1.setVisible(true)
            }
            else
            {
                topUINode.qiangGang_0.setVisible(true)
                topUINode.qiangGang_1.setVisible(false)
            }
        }
        topUINode.qiangGang = function()
        {
            topUINode.qiangGangCount++
            if(topUINode.qiangGangCount%2!=0)
            {
                topUINode.qiangGang_0.setVisible(false)
                topUINode.qiangGang_1.setVisible(true)
            }
            else
            {
                topUINode.qiangGang_0.setVisible(true)
                topUINode.qiangGang_1.setVisible(false)
            }
        }
        topUINode.sure = function()
        {
            var baopigu = 0
            var qianggang = 0
            if(topUINode.qiangGangCount % 2 == 0)
                qianggang = 1
            if(topUINode.baoPiGuCount % 2 == 0)
                baopigu = 1
            var CallCard = getObjWithStructName('CMD_C_CommitMorden') 
            CallCard.wBaoPiGuType = baopigu
            CallCard.wQiangGangType = qianggang
            socket.sendMessage(MDM_GF_GAME, SUB_C_COMITMORDEN, CallCard)
            topUINode.chooseNode.setVisible(false)
        }
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








