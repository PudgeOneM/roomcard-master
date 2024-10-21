

var topUINode = 
{   
    voicePlaySpr:null,
    recordList:[], 
    emojiHasinit:null,
    lastBankUpTime:null,
    //刚进房间时去服务器拉取一次 
    //每一轮结束时拉取一次 （根据输赢大小重新排列 如果玩家在表里则永远排在第一）
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

        //chat
        chatPop.faceNameArray = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18]
        chatPop.talkNameArray = [
        '666',
        '不作死，就不会死',
        '打牌这么厉害，你麻麻知道吗',
        '还有谁！',
        '好好打牌，不要说话',
        '好牌，好牌',
        '和你合作真是太愉快了',
        '急什么，让我想想怎么打',
        '快出！快出！快出！重要的事情说三遍',
        '快点吧，我等到花儿都谢了',
        '奶奶的，容我喝一杯82年的龙井压压惊',
        '你们城里人真会玩',
        '你这么打牌，我也是醉了',
        '牌友诚可贵，且打且珍惜',
        '人要赢得起，也要输得起',
        '天下还有这样的烂牌',
        '我的时间非常值钱',
        '我要胡了，你们随意',
        '我已经稳坐钓鱼台，你随便打',
        '我只想安静的做个宝宝',
        '有钱就是任性',
        '这手牌，我的内心几乎是崩溃的',
        'boss，带我装逼带我飞',
        'we are family，好牌友一辈子'
        ]
        var chat = chatPop.getChatButton()
        topUINode.chatNode.addChild(chat)
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
        menuSide.init(topUINode.mainNode, [1, 2, 3, 4, 5, 6])
        topUINode.menuNode.addChild( menuSide.menuSideBtn )
        // //location
        // var location = locationPop.getButton()
        // topUINode.locationNode.addChild(location)

        //////tips
        var t = menuSide.itemNodes[3].listNode
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

        //last
        topUINode.lastListNode = menuSide.itemNodes[4].listNode


        topUINode.bankerButton.setVisible( tableData.dwStaticBanker != selfdwUserID )
        topUINode.bankerDownButton.setVisible( tableData.dwStaticBanker == selfdwUserID )
    },
    _initCallBack:function()
    { 
        topUINode.addScoreCall = function()
        {   
            managerAudio.playEffect('gameRes/sound/click.mp3')
            replenishScorePop.popReplenishScore()  
        }

        topUINode.bankerCall = function()
        {  
            managerAudio.playEffect('gameRes/sound/click.mp3')
            var score = tableData.getUserWithUserId(selfdwUserID).lScoreInGame
            if( score >= tableData.lTakeInScore * 0.5)
            {
                var creater = tableData.getUserWithUserId(tableData.managerUserID)
                var self = tableData.getUserWithUserId(selfdwUserID)
                if(!creater || creater.wTableID != tableData.getUserWithUserId(selfdwUserID).wTableID)
                {
                    showTips({str:Word_0.w_007})    
                    return 
                }

                if( !tableData.isInTable(self.cbUserStatus) )
                {
                    showTips({str:Word_0.w_008})    
                    return 
                }   

                var call = function()
                {
                    topUINode.lastBankUpTime = new Date().getTime()
                    socket.sendMessage(MDM_GF_GAME,SUB_C_STATIC_BANKER_UP)
                    node.removeFromParent()
                }

                var pop = popBox.getOneTwoBtn(call)
                var node = pop[0]
                var control = pop[1]
                control.mainLabel.setString( Word_0.w_002 )
                control.rightBtnLabel.setString( Word_0.w_004 )

                var lastcd = topUINode.lastBankUpTime?60 - Math.ceil( (new Date().getTime() - topUINode.lastBankUpTime)/1000 ):0
                if( lastcd <=0 )
                {
                    control.leftBtnLabel.setString( Word_0.w_003 )
                    control.leftBtn.setEnabled(true) 
                }
                else
                {
                    control.leftBtn.setEnabled(false) 
                    control.leftBtnLabel.setString( Word_0.w_003 + '(' + (lastcd<10?'0'+lastcd:lastcd) + ')')
                    var id = window.setInterval(function()
                    {   
                        lastcd = lastcd - 1
                        control.leftBtnLabel.setString( Word_0.w_003 + '(' + (lastcd<10?'0'+lastcd:lastcd) + ')' )
                        if(lastcd == 0)
                        {   
                            window.clearInterval(id)
                            control.leftBtnLabel.setString( Word_0.w_003 )
                            control.leftBtn.setEnabled(true) 
                        }
                    }, 1000)
                    var t = node.onExit
                    node.onExit = function()
                    {
                        t.apply(node)
                        window.clearInterval(id)
                    }
                }
            }
            else
            {
                var call = function()
                {   
                    node.removeFromParent()  
                    replenishScorePop.popReplenishScore()
                }
                var pop = popBox.getOneTwoBtn(call)
                var node = pop[0]
                var control = pop[1]
                control.mainLabel.setString( Word_0.w_005 )
                control.leftBtnLabel.setString( Word_0.w_006 )
                control.rightBtnLabel.setString( Word_0.w_004 )
            }

            node.setPosition( cc.p( mainScene.uiTop.getContentSize().width * 0.5, mainScene.uiTop.getContentSize().height * 0.6) )
            mainScene.uiTop.addChild(node)

        }

        topUINode.bankerDownCall = function()
        {   
            managerAudio.playEffect('gameRes/sound/click.mp3')
            var bankdown = getObjWithStructName('CMD_C_Static_Banker_Down')
            //alert(user.dwUserID)
            bankdown.dwPlayerID = selfdwUserID
            socket.sendMessage(MDM_GF_GAME,SUB_C_STATIC_BANKER_DOWN, bankdown)
        }
        
    },
    _bindListener:function()
    {
    },
    onBankerApply:function(wApplicantID)
    {       
        var user = tableData.getUserWithUserId(wApplicantID)
        var contentNode = new cc.Node()
        var label = getLabel(16, 180, 2)
        label.setStringNew(cc.formatStr(Word_0.w_011, user.szNickName))
        label.textAlign = cc.TEXT_ALIGNMENT_LEFT
        label.setPositionX(90)
        label.setFontFillColor(cc.color(0, 153, 149, 255))
        contentNode.addChild(label)

        newsSide.addNewsItem({
            'iconurl':user.szHeadImageUrlPath.replace(/\/0/, '/64'),
            'title':user.szNickName,
            'contentNode':contentNode,
            callno:function()
            {
                var confirmBanker = getObjWithStructName('CMD_C_Confirm_Static_Banker')
                confirmBanker.dwStaticBanker = wApplicantID
                confirmBanker.bConfirm = 0
                socket.sendMessage(MDM_GF_GAME, SUB_C_CONFIRM_STATIC_BANKER, confirmBanker)     
            },
            callyes:function()
            {
                var confirmBanker = getObjWithStructName('CMD_C_Confirm_Static_Banker')
                confirmBanker.dwStaticBanker = wApplicantID
                confirmBanker.bConfirm = 1
                socket.sendMessage(MDM_GF_GAME, SUB_C_CONFIRM_STATIC_BANKER, confirmBanker)     
            },

        })
    },
    onReplenishApply:function(wApplicantID, lAddScore, dwOpenID)
    {
        var user = tableData.getUserWithUserId(wApplicantID)
        var contentNode = new cc.Node()
        var label = getLabel(16, 180, 2)
        label.setStringNew(cc.formatStr(Word_0.w_016, user.szNickName, lAddScore))
        label.textAlign = cc.TEXT_ALIGNMENT_LEFT
        label.setPositionX(90)
        label.setFontFillColor(cc.color(0, 153, 149, 255))
        contentNode.addChild(label)

        newsSide.addNewsItem({
            'iconurl':user.szHeadImageUrlPath.replace(/\/0/, '/64'),
            'title':user.szNickName,
            'contentNode':contentNode,
            callno:function()
            {
                var confirm = getObjWithStructName('CMD_GR_AddScore_Confirm')
                confirm.dwUserID = wApplicantID
                confirm.lAddScore = lAddScore
                confirm.szTableKey = tableKey
                confirm.dwOpenID = dwOpenID    
                confirm.bConfirm = 0
                socket.sendMessage(MDM_GR_USER, SUB_GR_USER_ADD_SCORE_CONFIRM, confirm)   
            },
            callyes:function()
            {
                var confirm = getObjWithStructName('CMD_GR_AddScore_Confirm')
                confirm.dwUserID = wApplicantID
                confirm.lAddScore = lAddScore
                confirm.szTableKey = tableKey
                confirm.dwOpenID = dwOpenID    
                confirm.bConfirm = 1
                socket.sendMessage(MDM_GR_USER, SUB_GR_USER_ADD_SCORE_CONFIRM, confirm)   
            },
        })
    },
   refreshLastListNode:function(CMD_S_GameEnd, niuIdxWithChairidArray)
    {
        if(niuIdxWithChairidArray.length==0 || CMD_S_GameEnd.lGameScore.length==0)
            return;
        //init data
        var lastList = []
        var tableId = tableData.getUserWithUserId(selfdwUserID).wTableID
        for(var i=0;i<GAME_PLAYER;i++)
        {   
            var chairId = i
            var user = tableData.getUserWithTableIdAndChairId(tableId, chairId)
            if(!user || !playData.hasGetSendCardsWithdwUserID(user.dwUserID) ) continue
            var subLastList = {}
            subLastList.user = user
            subLastList.niuIdx = playData.niuIdxWithChairidArray[chairId]
            subLastList.lGameScore = CMD_S_GameEnd.lGameScore[chairId]
            subLastList.lGameScore = subLastList.lGameScore>0?'+'+subLastList.lGameScore:subLastList.lGameScore
            subLastList.cbCardData = CMD_S_GameEnd.cbCardData[chairId]
            lastList[lastList.length] = subLastList
        }

        /////
        if(!topUINode.lastListView )
        {
            topUINode.lastListView = new ccui.ListView()
            var listView = topUINode.lastListView
            listView.setDirection(ccui.ScrollView.DIR_VERTICAL)
            listView.setTouchEnabled(true)
            listView.setBounceEnabled(true)
            listView.setBackGroundImage(resp_p.empty)
            listView.setBackGroundImageScale9Enabled(true)

            listView.setContentSize(topUINode.lastListNode.getContentSize().width,topUINode.lastListNode.getContentSize().height-10)
            listView.x = 0
            listView.y = 0
            // listView.addEventListener(this.selectedItemEvent, this)
            topUINode.lastListNode.addChild(listView)
        }
        topUINode.lastListView.removeAllChildren()

        var listView = topUINode.lastListView
        for(var i=0;i<lastList.length;i++)
        {   
            listView.pushBackCustomItem(topUINode._getLastItem(listView.width, lastList[i]))
        }
        listView.forceDoLayout()
        listView.setTouchEnabled(listView.getItem(0) && listView.getItem(0).getPositionY()+listView.getItem(0).getContentSize().height>listView.height)
    },
    _getLastItem:function(listViewWidth, last)
    {
        var default_item = new ccui.Layout();
        default_item.setContentSize(listViewWidth-10, 100)

        function fun(user)
        {
            var headIcon = new cc.Sprite('#headIcon.png')
            var hnode = getCircleNodeWithSpr(headIcon)
            hnode.setScale(0.8)
            hnode.setPosition(cc.p(60, default_item.height*0.5))
            default_item.addChild(hnode)

            var color = user.dwUserID == selfdwUserID?cc.color(0, 153, 149, 255):cc.color(242, 234, 211, 255)
            
            var szNickName = getLabel(16, 120, 1)
            szNickName.setStringNew(user.szNickName)
            //var szNickName = new cc.LabelTTF(user.szNickName, "Helvetica", 16)
            szNickName.setFontFillColor( color )
            szNickName.setPosition(cc.p(60, default_item.height*0.9))
            default_item.addChild(szNickName)

            var url = user.szHeadImageUrlPath
            url = url.replace(/\/0/, '/64')
            cc.loader.loadImg(url, {isCrossOrigin : false}, function(err,img){
                    var texture2d = new cc.Texture2D()
                    texture2d.initWithElement(img)
                    texture2d.handleLoadedTexture()

                    var frame = new cc.SpriteFrame(texture2d, cc.rect(0, 0, texture2d.getContentSize().width, texture2d.getContentSize().height))
                    headIcon.setSpriteFrame(frame)
            })

            var niuIdxLabel = new cc.LabelTTF(Word_0['niuIdx_' + last.niuIdx], "Helvetica", 16)
            niuIdxLabel.setFontFillColor( color )
            niuIdxLabel.setPosition(cc.p(160, default_item.height*0.9))
            default_item.addChild(niuIdxLabel)

            var lGameScoreLabel = new cc.LabelTTF(last.lGameScore, "Helvetica", 16)
            lGameScoreLabel.setFontFillColor( color )
            lGameScoreLabel.setPosition(cc.p(360, default_item.height*0.9))
            default_item.addChild(lGameScoreLabel)
            for(var i=0;i<5;i++)
            {   
                var cardIdx = last.cbCardData[i]
                var isNeedFrame = i<3&&last.niuIdx!=0
                var card =  cardFactory.getOne(cardIdx, null, isNeedFrame)
                card.setScale(0.33)
                isNeedFrame?card.getChildByTag(101).setVisible(true):''
                var pos = cc.p( 160 + i*(card.getContentSize().width*0.33+3), default_item.height*0.5 )
                card.setPosition(pos)
                default_item.addChild(card) 
            }
        }

        fun( last.user )
        
        return default_item
    },

}








