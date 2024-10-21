

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

        //location
        var location = locationPop.getButton()
        location.setScale(0.96)
        location.x = location.x + 2
        //location.loadTextures('localtionPop.png','localtionPop.png','localtionPop.png',ccui.Widget.PLIST_TEXTURE)
        topUINode.locationNode.addChild(location)


        /////menuSide
        // userSettingPop.itemShowState = [true, true, false]

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
                var gmNode = pokerGmPop.getPop()
                topUINode.gmNode.addChild(gmNode, 0, 101)
            }
        }

        topUINode.sortBtnCall = function(btn)
        {
            topUINode.btnSort1.setVisible(false)
            topUINode.btnSort2.setVisible(false)
            topUINode.btnSort3.setVisible(false)
            btn.setVisible(true)
        }
        topUINode.tributeGiveCallBack = function()
        {
            
            topUINode.tributeSet.setVisible(false)
            
            cmdBaseWorker.cbTributeGiveSelectCard

            var tribute = getObjWithStructName('CMD_C_Tribute_Back');
            tribute.cbTributeType = 1;
            tribute.cbTributeCard = cmdBaseWorker.cbTributeGiveSelectCard;
            socket.sendMessage(MDM_GF_GAME, SUB_C_TRIBUTE_BACK, tribute);
        }

        topUINode.tributeBackCallBack = function()
        {
            
            topUINode.tributeSet.setVisible(false)
            
            cmdBaseWorker.cbTributeGiveSelectCard
            var tribute = getObjWithStructName('CMD_C_Tribute_Back')
            tribute.cbTributeType = 2;
            tribute.cbTributeCard = cmdBaseWorker.cbTributeGiveSelectCard
            socket.sendMessage(MDM_GF_GAME,SUB_C_TRIBUTE_BACK,tribute);
            
        }
        topUINode.btnSort1CallBack = function() 
        {
            gameLog.log('-----1111111111')
            topUINode.sortBtnCall(topUINode.btnSort2)
            var tribute = getObjWithStructName('CMD_C_Sort_Card')
            tribute.cbSortType = ST_COLOR 
            socket.sendMessage(MDM_GF_GAME,SUB_C_SORT_CARD,tribute);
        }
        topUINode.btnSort2CallBack = function() 
        {
            gameLog.log('-----22222222')
            topUINode.sortBtnCall(topUINode.btnSort3)
            var tribute = getObjWithStructName('CMD_C_Sort_Card')
            tribute.cbSortType = ST_TYPE// 
            socket.sendMessage(MDM_GF_GAME,SUB_C_SORT_CARD,tribute);
        }
        topUINode.btnSort3CallBack = function() 
        {
            gameLog.log('-----33333333')
            topUINode.sortBtnCall(topUINode.btnSort1)
            var tribute = getObjWithStructName('CMD_C_Sort_Card')
            tribute.cbSortType = ST_ORDER
            socket.sendMessage(MDM_GF_GAME,SUB_C_SORT_CARD,tribute);
        }
        topUINode.btnLiPaiCallBack = function() 
        {
           // topUINode.btnLiPai.setVisible(false)
            topUINode.btnRevert.setVisible(true)
            gameLog.log('-----btnLiPaiCallBack')
            //
            var cardSprs = playNode.handCards4D[0] 
            var selectCards = []
            for(var i=0;i<cardSprs.length;i++)
            {
                var cardSpr = cardSprs[i] 
                
                if ( cardSpr.y != cardSpr.originY || cardSpr.color.r == 144 ) 
                {
                    selectCards[selectCards.length] = cardSpr.cardData
                };
            }
            //
            var arrange = getObjWithStructName('CMD_C_Arrange_Card')
            arrange.cbArrangeCardCount = selectCards.length
            arrange.cbArrangeCardData = selectCards
            
            socket.sendMessage(MDM_GF_GAME,SUB_C_ARRANGE_CARD,arrange)
            
        }
        topUINode.btnRevertCallBack = function() 
        {
            topUINode.btnLiPai.setVisible(true)
            topUINode.btnRevert.setVisible(false)
            gameLog.log('-----btnRevertCallBack')

            var arrange = getObjWithStructName('CMD_C_Arrange_Card')
            arrange.cbArrangeCardCount = 0
            arrange.cbArrangeCardData = []
            
            socket.sendMessage(MDM_GF_GAME,SUB_C_ARRANGE_CARD,arrange)
            
        }
        topUINode.btn_tongHuaSsCallBack = function()
        {
          
            var handCardDatas = clone(cmdBaseWorker.cbHandCardData[tableData.getUserWithUserId(selfdwUserID).wChairID])
            handCardDatas = cardLogic.sortWithNum(handCardDatas)

            var tipsArrayTemp = gameLogic.getTHuaShunArray( handCardDatas, cmdBaseWorker.cbMagicCardData)
            var tipsArray = []
            for( var i = 0 ;i < tipsArrayTemp.length;i++ )
            {
                if ( gameLogic.getCardsColor(tipsArrayTemp[i]) != 0xF0 ) 
                {
                    tipsArray[tipsArray.length] = tipsArrayTemp[i];
                };
            }
            if (tipsArray.length == 0) 
            {
                return
            };
            cmdBaseWorker.cbTongHuaIdx = cmdBaseWorker.cbTongHuaIdx>tipsArray.length?0:cmdBaseWorker.cbTongHuaIdx;
            var needSelectedCardDatas = clone(tipsArray[cmdBaseWorker.cbTongHuaIdx])
            var cardSprs = playNode.handCards4D[0] 
            if (!needSelectedCardDatas) return;
            for(var i=0;i<cardSprs.length;i++)
            {
                var cardSpr = cardSprs[i] 
                cardSpr.y = cardSpr.originY

                for(var ii=0;ii<needSelectedCardDatas.length;ii++)
                {
                    if( (cardSpr.cardData) == (needSelectedCardDatas[ii]) )
                    {
                        cardSpr.y = cardSpr.originY + cardFactory.selectCardOffsetY
                        needSelectedCardDatas.splice(ii, 1)
                        break
                    }
                }
            }
            cmdBaseWorker.cbTongHuaIdx = (cmdBaseWorker.cbTongHuaIdx + 1)%tipsArray.length
            topUINode.btnLiPai.setVisible(tipsArray.length>0)
        }

        
    },
    _bindListener:function()
    {
    },
}