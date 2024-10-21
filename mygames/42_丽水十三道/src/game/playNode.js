
////先理解cardFactory(components/cardFactory/cardFactory)
var callTime = 20
var outCardTime = 60

var playNode = 
{   
    handCards4D:[],//手牌扑克精灵数组 4个方向的
    handGroupNode4D:[],//手牌扑克精灵父节点 4个方向的
    residualCard:[],//手牌中剩余的牌
    duiziArray:[],
    santiaoArray:[],
    shunziArray:[],
    tonghuaArray:[],
    sizhangArray:[],
    tonghuashunArray:[],
    nowSelectCardArray:[],
    headCardDatas:[],
    centerCardDatas:[],
    tailCardDatas:[],
    tipsArray:[],
    typeList:[],
    isLookingResult:false,
    isSpecialType:false,
    lastSelect:-1,
    isOutCard:false,//已经出牌
    //如果在动画执行期间游戏开始了 则强制终止动画 
    gameEndAction:null,
    startTime:0,
    playActionTime:0,
    ///////////////////////init start///////////////////////
    init:function()
    {   
        playNode._registEvent()
        playNode._initCallBack()
        var node = managerRes.loadCCB(resp.playCCB, this)
        playNode.animationManager = node.animationManager
        playNode.node  = node
        cardFactory.defaultCardColor = cc.color(255, 255, 255)
        ///
        cardFactory.handCountOneRowMax = MAX_COUNT
        cardFactory.handCountOneRowMin = Math.ceil(cardFactory.handCountOneRowMax*0.6) 
        cardFactory.handGroupNodeHeight = 225//180//200
        cardFactory.outCountOneRow_upDown = Math.ceil(cardFactory.handCountOneRowMax*0.5) 
        cardFactory.outCountOneRow_rightLeft = Math.ceil(cardFactory.handCountOneRowMax/3) 
        cardFactory.intervalXRightAndDownOut = 50
        cardFactory.selectCardOffsetY = 15
        cardFactory.handIntervalYScale = 0.45//0.45
        cardFactory.outIntervalXScale = 0.36//0.36
        cardFactory.outIntervalYScale = 0.45

        cardFactory.handGroupNodeWidth = playNode.node.width-20
        cardFactory.init( playNode.decorateCard )

        playNode.addChooseType()
    },
    adaptUi:function()
    {
    },
    onReStart:function()
    {
        playNode.isLookingResult = false
        playNode.lastOutCardType = {}

        cocos.clearInterval(playNode.updateOnFree, playNode.node)
    },
    initCurrentRoundNode:function(currentRoundNode)
    {
        //currentRoundNode是绑定在chair上的一个节点 用于存放当前轮用到的节点
        currentRoundNode.scoreChange = new cc.Node()
        currentRoundNode.addChild( currentRoundNode.scoreChange, 1)  

        currentRoundNode.handCardsNode = new cc.Node()
        currentRoundNode.addChild( currentRoundNode.handCardsNode )  
    },
    clearCurrentRoundNode:function(currentRoundNode)
    {           
        //一轮结束 clearCurrentRoundNode
        currentRoundNode.scoreChange.removeAllChildren()
    },
    setCurrentRoundNodesVisible:function(isVisible)
    {
        var users = tableData.getUsersInTable( tableData.getUserWithUserId(selfdwUserID).wTableID )
        for(var i in users)
        {
            users[i].userNodeInsetChair.currentRoundNode.setVisible(isVisible)
        }
    },
    updateCurrentRoundNode:function(currentRoundNode, userId)
    {
        var user = tableData.getUserWithUserId(userId)
        var showChairId = tableData.getShowChairIdWithServerChairId(user.wChairID)
        
        if(showChairId==1||showChairId==2)
            sign = 0
        else
            sign = 1

        currentRoundNode.scoreChange.setPosition( cc.p(-20 * sign, 85) )  

        var direction = cardFactory.showChairId2Direction(showChairId)
        var chairNode = tableData.getChairWithShowChairId(showChairId).node
        //设置三处四方向的扑克位置 
        if(direction==0)
        {
            //hand
            currentRoundNode.handCardsNode.x = -chairNode.x + playNode.node.width*0.5
            currentRoundNode.handCardsNode.y = -chairNode.y
        }
    },
    _registEvent:function() 
    {
        var l = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "userNodeInsetChairInit",
            callback: function(event)
            {   
                var currentRoundNode = new cc.Node()
                playNode.initCurrentRoundNode(currentRoundNode)
                //////
                var userNodeInsetChair = event.getUserData()
                userNodeInsetChair.addChild(currentRoundNode)
                userNodeInsetChair.currentRoundNode = currentRoundNode  
            }
        })
        cc.eventManager.addListener(l, 1)

        var l = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "userNodeInsetChairUpdate",
            callback: function(event)
            {   
                var data = event.getUserData()
                var currentRoundNode = data[0].currentRoundNode
                var userId = data[1]
                playNode.updateCurrentRoundNode(currentRoundNode, userId)   
            }
        })
        cc.eventManager.addListener(l, 1)

        var l = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "cmdEvent",
            callback: function(event)
            {   
                var data = event.getUserData()
                var callFunName = data[0]
                playNode[callFunName]()
            }
        })
        cc.eventManager.addListener(l, 1)
    },
    callFunc:function(selectCardDatas,len)
    {
        var cardSprs = playNode.handCards4D[0]
        for(var i = 0;i<cardSprs.length;i++)//每次点击前先把牌归位
        {
            var cardSpr = cardSprs[i]
            cardSpr.y = cardSpr.originY
        }
        for(var i = 0;i<len;i++)
        {
            for(var j = 0;j<cardSprs.length;j++)
            {
                var cardSpr = cardSprs[j]
                if (cardSpr.cardData == selectCardDatas[i])
                {
                    cardSpr.y = cardSpr.originY + cardFactory.selectCardOffsetY
                    break;
                };
                
            }
        }
    },
    sendChangeCard:function()
    {
        var cardDatas = getObjWithStructName('CMD_C_MoveCard')
        cardDatas.headCardDatas = playNode.headCardDatas
        cardDatas.centerCardDatas = playNode.centerCardDatas
        cardDatas.tailCardDatas = playNode.tailCardDatas
        cardDatas.handCaardDatas = playNode.residualCard
        socket.sendMessage(MDM_GF_GAME,SUB_C_MOVE_CARD,cardDatas) 
    },
    sortShunZi:function(cardDatas,level)
    {
        if(level == 1 && cardLogic.getNum(cardDatas[0])==1
            &&cardLogic.getNum(cardDatas[1])==12&&cardLogic.getNum(cardDatas[2])==13)
        {
            cardDatas.sort(function(a, b)
            {
                var num1 = cardLogic.getNum(a)
                if(num1 == 1)num1 = 14
                var num2 = cardLogic.getNum(b)
                if(num2 == 1)num2 = 14
                return num1 - num2
            })
        }
        else if((level == 2 || level==3) && cardLogic.getNum(cardDatas[0])==1&&
            cardLogic.getNum(cardDatas[1])==10&&cardLogic.getNum(cardDatas[2])==11
            &&cardLogic.getNum(cardDatas[3])==12&&cardLogic.getNum(cardDatas[4])==13)
        {
            cardDatas.sort(function(a, b)
            {
                var num1 = cardLogic.getNum(a)
                if(num1 == 1)num1 = 14
                var num2 = cardLogic.getNum(b)
                if(num2 == 1)num2 = 14
                return num1 - num2
            })
        }
    },
    pushCallFunc:function(cards,level,auto)
    {
        var cardDatas = clone(cards)
        var tempCards = clone(cards)
        //var cardType = gameLogic.getType(cardLogic.sortWithNum(cardDatas))
        var cardType = gameLogic.getType(cardLogic.sortWithNum(cardDatas))
        var fileName = 'level_'+cardType.level
        cardDatas = tempCards
        playNode.sortShunZi(cardDatas,level)
        var startIdx = 0;
        var len = 0;
        switch(level)
        {
            case 1:
            {
                playNode.headCardDatas =  cardDatas
                startIdx = 0;
                len = 3;
                playNode.chooseTypeControl.closeHead.setVisible(true);

                var spr = playNode.chooseTypeControl.bg.getChildByTag(100)
                spr.setSpriteFrame(fileName+'.png');
                spr.setVisible(true);
                playNode.chooseTypeControl.headButton.setVisible(false)
            }
            break
            case 2:
            {
                playNode.centerCardDatas = cardDatas
                startIdx = 3;
                len = 5;
                playNode.chooseTypeControl.closeCenter.setVisible(true);
                
                var spr = playNode.chooseTypeControl.bg.getChildByTag(101)
                spr.setSpriteFrame(fileName+'.png');
                spr.setVisible(true);
                playNode.chooseTypeControl.centerButton.setVisible(false)
            }
            break
            case 3:
            {
                playNode.tailCardDatas = cardDatas;
                startIdx = 8;
                len = 5;
                playNode.chooseTypeControl.closeTail.setVisible(true);

                var spr = playNode.chooseTypeControl.bg.getChildByTag(102)
                spr.setSpriteFrame(fileName+'.png');
                spr.setVisible(true);
                playNode.chooseTypeControl.tailButton.setVisible(false)
            }
            break
        }
        var idx = 0;
        for(var i=startIdx;i<startIdx+len;i++)//将选中的牌添加到对应道中
        {
            var cardData = cardDatas[idx]
            var spr = playNode.chooseTypeControl.bg.getChildByTag(i)
            spr.setSpriteFrame('hand_' + cardData + '.png')
            spr.cardData = cardData
            spr.color = spr.color
            spr.setLocalZOrder(i)
            spr.setVisible(true)
            idx++
        }
        if(playNode.residualCard.length>=cardDatas.length)
            cardFactory.deleteHandCards(playNode.handCards4D[0],0,cardDatas)//删除选中牌
        playNode.nowSelectCardArray = []//清空当前选中数组
        playNode.residualCard = []
        var cardSprs = playNode.handCards4D[0]
        for(var i = 0;i<cardSprs.length;i++)//每次点击前先把牌归位
        {
            var cardSpr = cardSprs[i]
            playNode.residualCard[i] = cardSpr.cardData
        }
        playNode.sendChangeCard()//通知服务器每一道的变化
        if(auto)
        {
            if(playNode.headCardDatas.length==3 && playNode.centerCardDatas.length == 5 && playNode.tailCardDatas.length == 0)
            {
                if(playNode.inspectCard(playNode.residualCard,3))//检查牌型是否符合规则
                {
                    playNode.pushCallFunc(playNode.residualCard,3,false)
                }
                else
                    showTips({str:'牌型不符合规则，头道必须小于中道，中道必须小于尾道！'}) 
            }
            else if(playNode.headCardDatas.length==3 && playNode.centerCardDatas.length == 0 && playNode.tailCardDatas.length == 5)
            {
                if(playNode.inspectCard(playNode.residualCard,2))//检查牌型是否符合规则
                {
                    playNode.pushCallFunc(playNode.residualCard,2,false)
                }
                else
                    showTips({str:'牌型不符合规则，头道必须小于中道，中道必须小于尾道！'})
            }
            else if(playNode.headCardDatas.length==0 && playNode.centerCardDatas.length == 5 && playNode.tailCardDatas.length == 5)
            {
                if(playNode.inspectCard(playNode.residualCard,1))//检查牌型是否符合规则
                {
                    playNode.pushCallFunc(playNode.residualCard,1,false)
                }
                else
                    showTips({str:'牌型不符合规则，头道必须小于中道，中道必须小于尾道！'})
            }
        }  
        
        playNode.duizi.setEnabled(false);
        playNode.liangdui.setEnabled(false);
        playNode.santiao.setEnabled(false);
        playNode.shunzi.setEnabled(false);
        playNode.tonghua.setEnabled(false);
        playNode.hulu.setEnabled(false);
        playNode.tiezhi.setEnabled(false);
        playNode.tonghuashun.setEnabled(false);
        playNode.getHandType()
    },
    _initCallBack:function()
    {   
        playNode.duizi1 = function()
        {
            if(playNode.duiziArray.length>0 || playNode.santiaoArray.length>0)
            { 
                var idx1 = -1
                var idx2 = -1
                if(playNode.santiaoArray.length>0)
                {
                    idx1 = parseInt(playNode.santiaoArray.length *Math.random());
                }
                if(playNode.duiziArray.length>0)
                {
                    idx2 = parseInt(playNode.duiziArray.length *Math.random());
                }
                if(idx1>=0 && idx2>=0)
                {
                    var idx = (parseInt(10 *Math.random()))
                    if(idx %2 == 0)
                        playNode.callFunc(playNode.santiaoArray[idx1],2);
                    else
                        playNode.callFunc(playNode.duiziArray[idx2],2);
                }
                else
                {
                    if(idx1>=0)
                        playNode.callFunc(playNode.santiaoArray[idx1],2);
                    else
                        playNode.callFunc(playNode.duiziArray[idx2],2);
                }  
            }
        }
        playNode.liangdui1 = function()
        {
            if(playNode.duiziArray.length>1 || (playNode.duiziArray.length>0 && playNode.santiaoArray.length>0))
            {      
                var idx1 = -1
                var idx2 = -1        
                if(playNode.santiaoArray.length>0)
                {
                    idx1 = parseInt(playNode.santiaoArray.length *Math.random());
                }
                idx2 = parseInt(playNode.duiziArray.length *Math.random());
                var idx3 = idx2
                if(playNode.duiziArray.length>1)
                {
                    while(idx3 == idx2)
                    {
                        idx2 = parseInt(playNode.duiziArray.length *Math.random());
                        if(idx3 != idx2)break
                    }
                    if(idx1>=0 && idx2>=0 && idx3>=0)
                    {
                        var idx = parseInt(3*Math.random());
                        if(idx == 0)playNode.callFunc(playNode.duiziArray[idx2].concat(playNode.duiziArray[idx3]),4);  
                        else if(idx == 1)playNode.callFunc(playNode.duiziArray[idx2].concat(playNode.santiaoArray[idx1]),4);  
                        else playNode.callFunc(playNode.duiziArray[idx3].concat(playNode.santiaoArray[idx1]),4);  
                    }
                    else
                        playNode.callFunc(playNode.duiziArray[idx2].concat(playNode.duiziArray[idx3]),4);    
                }
                else
                {
                    playNode.callFunc(playNode.duiziArray[idx2].concat(playNode.santiaoArray[idx1]),4);  
                }
                 
            }
        }
        playNode.santiao1 = function()
        {
            if(playNode.santiaoArray.length>0)
            {
                var idx = parseInt(playNode.santiaoArray.length *Math.random());
                playNode.callFunc(playNode.santiaoArray[idx],3)
            }   
        }
        playNode.shunzi1 = function()
        {
            if(playNode.shunziArray.length>0)
            {
                var cardData = []
                var idx = 0 
                if(playNode.shunziArray.length>1)
                {
                    idx = parseInt(playNode.shunziArray.length *Math.random());
                }
                var typeCount = parseInt((playNode.shunziArray[idx].length-5)*Math.random());
                if(typeCount>0)
                {
                    var j = 0
                    for(var i = typeCount;i<typeCount+5;i++)
                    {
                        cardData[j] = playNode.shunziArray[idx][i]
                        j++
                    }
                    playNode.callFunc(cardData,5)
                }
                else
                {
                    playNode.callFunc(playNode.shunziArray[idx],5)
                }
            }
        }
        playNode.tonghua1 = function()
        {
            if(playNode.tonghuaArray.length>0)
            {
                var cardData = []
                if(playNode.tonghuaArray.length>1)
                {
                    var idx = parseInt(playNode.tonghuaArray.length *Math.random());
                    cardData = gameLogic.getRandomArrayElements(playNode.tonghuaArray[idx],5)
                }
                else
                {
                    cardData = gameLogic.getRandomArrayElements(playNode.tonghuaArray[0],5)
                }
                playNode.callFunc(cardData,5)
            }
        }
        playNode.hulu1 = function()
        {
            if(playNode.santiaoArray.length>0 && playNode.duiziArray.length>0)
            {
                var idx1 = 0
                var idx2 = 0
                if(playNode.santiaoArray.length>1)
                {
                    idx1 = parseInt(playNode.santiaoArray.length *Math.random());
                }
                if(playNode.duiziArray.length>1)
                {
                    idx2 = parseInt(playNode.duiziArray.length *Math.random());
                }
                playNode.callFunc(playNode.santiaoArray[idx1].concat(playNode.duiziArray[idx2]),5)
            }
            else if(playNode.santiaoArray.length>1)
            {
                var idx1 = parseInt(playNode.santiaoArray.length *Math.random());
                var idx2 = idx1
                while(true)
                {
                    idx2 = parseInt(playNode.santiaoArray.length *Math.random());
                    if(idx2 != idx1)break
                }
                playNode.callFunc(playNode.santiaoArray[idx1].concat(playNode.santiaoArray[idx2]),5)
            }
            
        }
        playNode.tiezhi1 = function()
        {
            if(playNode.sizhangArray.length>0)
            {
                var idx = parseInt(playNode.sizhangArray.length *Math.random());
                playNode.callFunc(playNode.sizhangArray[idx],4)
            }
        }
        playNode.tonghuashun1 = function()
        {
            if(playNode.tonghuashunArray.length>0)
            {
                var cardData = []
                var idx = 0 
                if(playNode.tonghuashunArray.length>1)
                {
                    idx = parseInt(playNode.tonghuashunArray.length *Math.random());
                }
                var typeCount = parseInt((playNode.tonghuashunArray[idx].length-5)*Math.random());
                if(typeCount>0)
                {
                    var j = 0
                    for(var i = typeCount;i<typeCount+5;i++)
                    {
                        cardData[j] = playNode.tonghuashunArray[idx][i]
                        j++
                    }
                    playNode.callFunc(cardData,5)
                }
                else
                {
                    playNode.callFunc(playNode.tonghuashunArray[idx],5)
                }
            }
        }  
        /*playNode.buttonContinue1 = function()
        {
            playNode.isLookingResult = false
            playNode.buttonContinue.setVisible(false)
            playNode.continueTime.setVisible(false)
        }*/
    },
    decorateCard:function(card)
    {
    },
    ///////////////////////init end///////////////////////

    ///////////////cmdEvent start//////////
    updateOnFree:function()
    {
        if(!playNode.isLookingResult)
        {            
            if(tableData.getUserWithUserId(selfdwUserID).cbUserStatus == US_SIT)
            {
                socket.sendMessage(MDM_GF_FRAME, SUB_GF_USER_READY)
            }
        }
    },
    /*updateContinue:function()
    {
        var timer = playNode.continueTime.getString()
        timer--
        if(timer<=0)
        {
            playNode.isLookingResult = false
            playNode.buttonContinue.setVisible(false)
            playNode.continueTime.setVisible(false)
            cocos.clearInterval(playNode.updateContinue, playNode.node)
            return
        }
        playNode.continueTime.setString(timer)
    },*/
    onCMD_StatusFree:function() 
    {
        cocos.setInterval(playNode.updateOnFree, 1000, playNode.node)
    },
    onCMD_StatusCall:function()
    {
    },
    onCMD_StatusPlay:function() 
    {      
        playNode.residualCard = []
        playNode.headCardDatas = []
        playNode.centerCardDatas = []
        playNode.tailCardDatas = []
        var playerCount = 0
        for(var wChairID=0;wChairID<GAME_PLAYER;wChairID++)
        {
            var user = tableData.getUserWithChairId(wChairID)
            if(user)
            {
                playerCount++
            }
        }
        playActionTime = 1000+playerCount*3000

        if(cmdBaseWorker.cbGameTime>0)
        {
            var str= "第"+cmdBaseWorker.cbGameTime+"局"
            tableNode.gameTime.setString(str)
            tableNode.gameTime.setVisible(true)
        }

        for(var showChairid=0;showChairid<GAME_PLAYER;showChairid++)
        {
            var wChairID = tableData.getServerChairIdWithShowChairId(showChairid)
            var user = tableData.getUserWithChairId(wChairID)
            var callBody = cmdBaseWorker.cbCallRecord[wChairID]
            var outCardsNode = playNode['outCards' + showChairid]

            if(callBody.callFlag==255) //未出牌 
            {
                if(user.dwUserID == selfdwUserID)
                {
                    cocos.clearInterval(playNode.updateOnFree, playNode.node)
                    playNode.node.stopAction(playNode.gameEndAction)
                    playNode.resetPlayNode()

                    var outCardDatasArray = []
                    var handCardDatasArray = []
                    for(var showChairId=0;showChairId<GAME_PLAYER;showChairId++)
                    {
                        var direction = cardFactory.showChairId2Direction(showChairId)
                        outCardDatasArray[direction] = []
                        handCardDatasArray[direction] = []
                        var wChairID = tableData.getServerChairIdWithShowChairId(showChairId)

                        if(wChairID== tableData.getUserWithUserId(selfdwUserID).wChairID )
                        {
                            for(var i = 0;i<MAX_COUNT;i++) 
                            {
                                if(cmdBaseWorker.cbResidualCard[wChairID][i]>0)
                                    playNode.residualCard[i] = cmdBaseWorker.cbResidualCard[wChairID][i]
                            }
                            for(var i = 0;i<3;i++)
                            {
                                if(callBody.headCardDatas[i]>0)
                                    playNode.headCardDatas[i] = callBody.headCardDatas[i]
                            }
                            for(var i = 0;i<5;i++)
                            {
                                if(callBody.centerCardDatas[i]>0)
                                    playNode.centerCardDatas[i] = callBody.centerCardDatas[i]
                                if(callBody.tailCardDatas[i]>0)
                                    playNode.tailCardDatas[i] = callBody.tailCardDatas[i]
                            }
                            if(playNode.residualCard.length==0 && playNode.headCardDatas.length==0&&playNode.centerCardDatas.length==0&&playNode.tailCardDatas.length==0)
                            {
                                playNode.residualCard =  cmdBaseWorker.cbHandCardData[wChairID]
                            }
                        }

                        handCardDatasArray[direction] = cardLogic.sortWithNum(playNode.residualCard)
                        handCardDatasArray[direction].sort(function(a, b)
                        {
                            return gameLogic.num2Scores[cardLogic.getNum(a) ] - gameLogic.num2Scores[cardLogic.getNum(b) ]
                        })
                    }
                    playNode.sendCardsAction(handCardDatasArray, outCardDatasArray)

                    playNode.duizi.setVisible(true);
                    playNode.liangdui.setVisible(true);
                    playNode.santiao.setVisible(true);
                    playNode.shunzi.setVisible(true);
                    playNode.tonghua.setVisible(true);
                    playNode.hulu.setVisible(true);
                    playNode.tiezhi.setVisible(true);
                    playNode.tonghuashun.setVisible(true);

                    playNode.chooseTypeNode.setVisible(true)     

                    playNode.chooseTypeControl.bg.getChildByTag(555).setVisible(false)
                    playNode.chooseTypeControl.cancelType.setVisible(false)
                    playNode.chooseTypeControl.sureType.setVisible(false)
                    playNode.chooseTypeControl.bg.getChildByTag(500).setVisible(false)

                    if(playNode.headCardDatas.length == 3)
                        playNode.pushCallFunc(playNode.headCardDatas,1,false)
                    if(playNode.centerCardDatas.length == 5)
                        playNode.pushCallFunc(playNode.centerCardDatas,2,false)
                    if(playNode.tailCardDatas.length == 5)
                        playNode.pushCallFunc(playNode.tailCardDatas,3,false)

                    var cardDatas = playNode.residualCard.concat(playNode.headCardDatas,playNode.centerCardDatas,playNode.tailCardDatas)
                    //var tempCardDatas = clone(cardDatas)
                    //playNode.showChooseType(tempCardDatas)
                    playNode.getHandType()
                    if(cardDatas.length == MAX_COUNT)
                    {
                        var specialType = gameLogic.isSpecialType(playNode.sortWithNum(cardDatas))
                        if(specialType.specialType>0)
                        {
                            var fileName = specialType.specialType+'.png'
                            var specialTypeSpr = playNode.chooseTypeControl.bg.getChildByTag(555)
                            specialTypeSpr.setSpriteFrame(fileName)
                            specialTypeSpr.setVisible(true)
            
                            playNode.chooseTypeControl.bg.getChildByTag(500).setVisible(true)
                            playNode.chooseTypeControl.cancelType.setVisible(true);
                            playNode.chooseTypeControl.sureType.setVisible(true);
                            playNode.isSpecialType = true
            
                            playNode.setButtonState(false)
                        }
                        else
                        {
                            playNode.isSpecialType = false
            
                            playNode.chooseTypeControl.bg.getChildByTag(555).setVisible(false)
                            playNode.chooseTypeControl.cancelType.setVisible(false)
                            playNode.chooseTypeControl.sureType.setVisible(false)
                            playNode.chooseTypeControl.bg.getChildByTag(500).setVisible(false)
                            playNode.setButtonState(true)
                        }
                        playNode.chooseTypeControl.bg.getChildByTag(555).setLocalZOrder(101)
                        playNode.chooseTypeControl.cancelType.setLocalZOrder(101)
                        playNode.chooseTypeControl.sureType.setLocalZOrder(101)
                        playNode.chooseTypeControl.bg.getChildByTag(500).setLocalZOrder(100)
                    }
                }
                else
                {
                    chairFactory.showFiredCircle.call(user.userNodeInsetChair, 60)
                }
            }
            else if(callBody.callFlag!=254)
            {
                outCardsNode.setVisible(true)
                var typeSpr = outCardsNode.getChildByTag(100)
                if(callBody.callFlag!=0)
                {
                    typeSpr.setSpriteFrame('special_words.png')
                    typeSpr.y = 60
                }
                else
                    typeSpr.setSpriteFrame('empty.png')

                var cardDatas = ( callBody.headCardDatas.concat(callBody.centerCardDatas) ).concat(callBody.tailCardDatas)
                for(var i=0;i<13;i++)
                {
                    var cardData = cardDatas[i]
                    outCardsNode.getChildByTag(i).setSpriteFrame('out_'+cardData+'.png')
                }
            }
        }


    },
    onCMD_CallNotify:function()
    {
    },
    onCMD_CallResult:function()
    {
        var showChairid = tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wCallUser)
        var user = tableData.getUserWithChairId(cmdBaseWorker.wCallUser)

        var outCardsNode = playNode['outCards' + showChairid]
        outCardsNode.setVisible(true)
        chairFactory.hideFiredCircle.call(user.userNodeInsetChair)

        var callBody = cmdBaseWorker.callBody

        var typeSpr = outCardsNode.getChildByTag(100)
        if(callBody.callFlag!=0)
        {
            typeSpr.setSpriteFrame('special_words.png')
            typeSpr.y = 60
        }
        else
            typeSpr.setSpriteFrame('empty.png')
        //var cardDatas = ( callBody.headCardDatas.concat(callBody.centerCardDatas) ).concat(callBody.tailCardDatas)
        for(var i=0;i<13;i++)
        {
            //var cardData = cardDatas[i]
            outCardsNode.getChildByTag(i).setSpriteFrame('out_0.png')
        }
        if(tableData.getUserWithUserId(selfdwUserID).wChairID == cmdBaseWorker.wCallUser)
        {    
            playNode.handGroupNode4D[0].removeAllChildren()

            playNode.chooseTypeControl.frame.x = -2000
            playNode.chooseTypeNode.setVisible(false)
            playNode.duizi.setVisible(false);
            playNode.liangdui.setVisible(false);
            playNode.santiao.setVisible(false);
            playNode.shunzi.setVisible(false);
            playNode.tonghua.setVisible(false);
            playNode.hulu.setVisible(false);
            playNode.tiezhi.setVisible(false);
            playNode.tonghuashun.setVisible(false);
            playNode.chooseTypeControl.closeHead.setVisible(false)
            playNode.chooseTypeControl.closeCenter.setVisible(false)
            playNode.chooseTypeControl.closeTail.setVisible(false)
            playNode.isOutCard = true
            playNode.chooseTypeControl.clockNode.removeAllChildren()
        }

    },
    _getHandCardsGroupNode:function()
    {
        var handCards = playNode.handCards4D

        var touchEndCall = function(endCardSpr)
        {
            var cardSprs = playNode.handCards4D[0]
            if(endCardSpr.y == endCardSpr.originY)
            {
                // for(var i=0;i<cardSprs.length;i++)
                // {
                //     var cardSpr = cardSprs[i]
                //     cardSpr.y = cardSpr.originY
                //     cardSpr.color = cardSpr.originColor
                // }
            }
            else
            {
                //autoFill
                var selectCardDatas   = []
                for(var i=0;i<cardSprs.length;i++)
                {
                    var cardSpr = cardSprs[i]
                    if(cardSpr.y != cardSpr.originY)
                        selectCardDatas[selectCardDatas.length] = cardSpr.cardData
                }
                selectCardDatas = cardLogic.sortWithNum(selectCardDatas)

                var needSelectedCardDatas = cardFactory.getNeedSelectedCardDatas_autoFill(playNode.tipsArray, selectCardDatas)
                for(var i=0;i<needSelectedCardDatas.length;i++)
                {
                    for(var ii=0;ii<cardSprs.length;ii++)
                    {
                        var cardSpr = cardSprs[ii]
                        if(cardSpr.y == cardSpr.originY && 
                            cardLogic.getNum(cardSpr.cardData) == cardLogic.getNum(needSelectedCardDatas[i]) )
                        {
                            cardSpr.y = cardSpr.originY + cardFactory.selectCardOffsetY
                            break
                        }
                    }
                }
            }
        }

        var touchEndCalls = []
        if(tableData.getUserWithUserId(selfdwUserID).wChairID == tableData.getServerChairIdWithShowChairId(0))
        {
            touchEndCalls[0] = function(endCardSpr)
            {
                touchEndCall(endCardSpr)
            }
        }

        playNode.handGroupNode4D = cardFactory.getHandGroupNodes(handCards, touchEndCalls)

    },
    sendCardsAction:function(handCardDatasArray)
    {   
        var self = tableData.getUserWithUserId(selfdwUserID)
        var selfShowChairId = tableData.getShowChairIdWithServerChairId(self.wChairID)
        var selfDir = cardFactory.showChairId2Direction(selfShowChairId)

        playNode.handCards4D = cardFactory.getHandCardsArray(handCardDatasArray)
        playNode._getHandCardsGroupNode()
        
        var user = tableData.getUserWithUserId(selfdwUserID)
        var direction = tableData.getShowChairIdWithServerChairId(user.wChairID)
        var handCardsNode = user.userNodeInsetChair.currentRoundNode.handCardsNode
        //var handCardsNode = playNode.chooseTypeControl.handNode
        handCardsNode.removeAllChildren()

        handCardsNode.addChild(playNode.handGroupNode4D[direction])
    },
    onCMD_GameStart:function() 
    {
        /*playNode.isLookingResult = true
        playNode.buttonContinue.setVisible(false)
        playNode.continueTime.setVisible(false)
        cocos.clearInterval(playNode.updateContinue, playNode.node)*/
        cocos.clearInterval(playNode.updateOnFree, playNode.node)
        playNode.node.stopAction(playNode.gameEndAction)
        playNode.resetPlayNode()
        
        var self = tableData.getUserWithUserId(selfdwUserID)
        if(self.wChairID == INVALID_WORD)return

        if(cmdBaseWorker.cbGameTime>0)
        {
            var str= "第"+cmdBaseWorker.cbGameTime+"局"
            tableNode.gameTime.setString(str)
            tableNode.gameTime.setVisible(true)
        }
        
        var playerCount = 0
        for(var wChairID=0;wChairID<GAME_PLAYER;wChairID++)
        {
            var user = tableData.getUserWithChairId(wChairID)
            if(user && user.dwUserID!=selfdwUserID)
                chairFactory.showFiredCircle.call(user.userNodeInsetChair, 60)
            if(user)
            {
                playerCount++
            }
        }
        playActionTime = 1000+playerCount*3000

        for(var i = 0;i<3;i++)
        {
            playNode.clearOutCard(i+1)
        }
        var outCardDatasArray = []
        var handCardDatasArray = []
        for(var showChairId=0;showChairId<GAME_PLAYER;showChairId++)
        {
            var direction = cardFactory.showChairId2Direction(showChairId)
            outCardDatasArray[direction] = []
            handCardDatasArray[direction] = []
            var wChairID = tableData.getServerChairIdWithShowChairId(showChairId)

            handCardDatasArray[direction] = cardLogic.sortWithNum(cmdBaseWorker.cbHandCardData[wChairID])
            handCardDatasArray[direction].sort(function(a, b)
            {
                return gameLogic.num2Scores[cardLogic.getNum(a) ] - gameLogic.num2Scores[cardLogic.getNum(b) ]
            })
        }
        playNode.sendCardsAction(handCardDatasArray, outCardDatasArray)

        {
            playNode.chooseTypeNode.setVisible(true)
            playNode.residualCard = cmdBaseWorker.cbHandCardData[tableData.getUserWithUserId(selfdwUserID).wChairID]   
        }
        /*for(var wChairID=0;wChairID<GAME_PLAYER;wChairID++)
        {
            if(tableData.getUserWithUserId(selfdwUserID).wChairID == wChairID)
            {
                var tempCardDatas = clone(playNode.residualCard)
                playNode.showChooseType(tempCardDatas)
            }
        }*/
        playNode.getHandType()
        if(playNode.residualCard.length == MAX_COUNT)
        {
            var specialType = gameLogic.isSpecialType(playNode.sortWithNum(playNode.residualCard))
            if(specialType.specialType>0)
            {
                var fileName = specialType.specialType+'.png'
                var specialTypeSpr = playNode.chooseTypeControl.bg.getChildByTag(555)
                specialTypeSpr.setSpriteFrame(fileName)
                specialTypeSpr.setVisible(true)

                playNode.chooseTypeControl.bg.getChildByTag(500).setVisible(true)
                playNode.chooseTypeControl.cancelType.setVisible(true);
                playNode.chooseTypeControl.sureType.setVisible(true);
                playNode.isSpecialType = true

                playNode.setButtonState(false)
            }
            else
            {
                playNode.isSpecialType = false

                playNode.chooseTypeControl.bg.getChildByTag(555).setVisible(false)
                playNode.chooseTypeControl.cancelType.setVisible(false)
                playNode.chooseTypeControl.sureType.setVisible(false)
                playNode.chooseTypeControl.bg.getChildByTag(500).setVisible(false)
                playNode.setButtonState(true)
            }
            playNode.chooseTypeControl.bg.getChildByTag(555).setLocalZOrder(101)
            playNode.chooseTypeControl.cancelType.setLocalZOrder(101)
            playNode.chooseTypeControl.sureType.setLocalZOrder(101)
            playNode.chooseTypeControl.bg.getChildByTag(500).setLocalZOrder(100)
        }
        playNode.isOutCard = false
        playNode.chooseTypeControl.clockNode.removeAllChildren()
        showTipsTTF({str:'60秒后将自动出牌!', color:cc.color(222, 222, 22), size:24})
        playNode.startOutCardClock(true,60)
        //playNode.callEnter(cmdBaseWorker.wCurrentUserCall, 0)
    },
    startOutCardClock:function(isCan, time)
    {   
        time = typeof(time) == 'number'?time:outCardTime

        if( isCan )
        {
            var c = clock.getOneClock(time, 
            function()
            {
                /*if(!playNode.isOutCard)//自动出牌在服务器处理了，这里只是客户端的倒计时显示
                    playNode.autoOutCard()*/
            },
            function()
            {
                if(parseInt( c.clockLabel.getString() ) <= 3 )
                    managerAudio.playEffect('gameRes/sound/tick.mp3')
            }
            )
            playNode.chooseTypeControl.clockNode.addChild(c.clockNode)
            //playNode.clockNode.addChild(c.clockNode)
        }  
    },
    onCMD_OutCard:function() 
    {
    },
    onCMD_PassCard:function() 
    {
    },
    onCMD_GameEnd:function() 
    {
        // var record = getObjWithStructName('CMD_GR_C_TableHistoryRecordReq') 
        // record.szTableKey = tableKey
        // socket.sendMessage(MDM_GR_USER, SUB_GR_USER_TABLE_HISTORY_RECORD_REQ, record)

        playNode.isLookingResult = true   
        cocos.setInterval(playNode.updateOnFree, 1000, playNode.node)

        var users_cbGender = []
        var szNickName_gameEnd = []
        for(var wChairID=0;wChairID<GAME_PLAYER;wChairID++)
        {
            var user = tableData.getUserWithChairId(wChairID)
            if(user)
            {
                users_cbGender[wChairID] = user.cbGender
                szNickName_gameEnd[wChairID] = user.szNickName
            }
        }

        if(cmdBaseWorker.wExitUser != INVALID_WORD) 
        {
            playNode.gameEndAction = cc.sequence( 
                cc.delayTime(7.5), //看牌2秒
                cc.callFunc(function()
                {     
                    headIconPop.kickUserOnGameEnd()
                    var record = getObjWithStructName('CMD_GR_C_TableHistoryRecordReq') 
                    record.szTableKey = tableKey
                    socket.sendMessage(MDM_GR_USER, SUB_GR_USER_TABLE_HISTORY_RECORD_REQ, record)
                    var continueCall = function()
                    {
                        playNode.isLookingResult = false   
                        var user = tableData.getUserWithUserId(selfdwUserID)
                        if(user.cbUserStatus == US_SIT)//只有坐下未准备的情况 才会resetPlayNode
                        {
                            playNode.resetPlayNode()
                            var isLastWinner = false
                            for(var i=0;i<cmdBaseWorker.dwLastWinner.length;i++)
                            {   
                                isLastWinner =  cmdBaseWorker.dwLastWinner[i] == selfdwUserID
                                if(isLastWinner)
                                    break
                            }

                            if(isLastWinner)//有的游戏需要上轮赢得玩家站起
                            {
                                var lookon = getObjWithStructName('CMD_GR_UserLookon') 
                                lookon.wTableID = tableData.tableID
                                socket.sendMessage(MDM_GR_USER, SUB_GR_USER_LOOKON, lookon) 
                            }
                        } 
                        /*playNode.buttonContinue.setVisible(true)
                        playNode.continueTime.setString(10)
                        playNode.continueTime.setVisible(true)
                        cocos.setInterval(playNode.updateContinue, 1000, playNode.node)*/
                    }
                    playNode.popGameEnd(continueCall, szNickName_gameEnd) 
                }) 
            )

            playNode.node.runAction(playNode.gameEndAction)  
            return 
        }
        // ////////////////////////////////////////////////////////

        var baseScoreChair0 = [0, 0, 0]
        var extraScoreChair0 = [0, 0, 0]
        var chairid = tableData.getServerChairIdWithShowChairId(0)
        for(var showChairid = 1;showChairid<GAME_PLAYER;showChairid++)
        {
            var wChairID = tableData.getServerChairIdWithShowChairId(showChairid)
            for(var ii=0;ii<3;ii++)
            {
                baseScoreChair0[ii] += cmdBaseWorker.lBaseScore[chairid][wChairID][ii]
                extraScoreChair0[ii] += cmdBaseWorker.lExtraScore[chairid][wChairID][ii]
            }
        }

        var actions_campareHead = [cc.delayTime(0)]
        var actions_campareCenter = [cc.delayTime(0)]
        var actions_campareTail = [cc.delayTime(0)]
        var actions_daqiang = [cc.delayTime(0)]
        var actions_special = [cc.delayTime(0)]

        var callBodys = clone(cmdBaseWorker.cbCallRecord)
        for(var wChairID=GAME_PLAYER-1;wChairID>=0;wChairID--)
        {
            var callBody = callBodys[wChairID]
            callBody.wChairID = wChairID
            if(callBody.callFlag!=0) callBodys.splice(wChairID ,1)
        }
        //头道动画
        callBodys.sort( function(a, b)
        {
            return gameLogic.compareType({level:a.headLevel, score:a.headScore}, 
                {level:b.headLevel, score:b.headScore})
        })

        for(var i=0;i<callBodys.length;i++)
        {
            var callBody = callBodys[i]
            var wChairID = callBody.wChairID
            var showChairid = tableData.getShowChairIdWithServerChairId(wChairID)
            var outCardsNode = playNode['outCards' + showChairid]

            var cardSprs = [outCardsNode.getChildByTag(0), outCardsNode.getChildByTag(1), outCardsNode.getChildByTag(2)]
            var cardDatas = callBody.headCardDatas
            var daoNum = 0
            var level = callBody.headLevel
            var typeSpr = outCardsNode.getChildByTag(100)
            var isMan = users_cbGender[wChairID].cbGender
            actions_campareHead[actions_campareHead.length] = playNode.getTurnCardAction(cardSprs, cardDatas, daoNum, level, typeSpr, isMan)
        }

        actions_campareHead[actions_campareHead.length] = cc.callFunc(
                function()
                {   
                      var baseScore =  baseScoreChair0[0] 
                      var extraScore =  extraScoreChair0[0] 

                      var baseScorePng = baseScore>=0?resp.nums5:resp.nums4
                      var extraScorePng = extraScore>=0?resp.nums5:resp.nums4


                      var baseScoreLabel = new ccui.TextAtlas(':' + Math.abs(baseScore), baseScorePng, 24.6, 32, "0")
                      var extraScoreLabel = new ccui.TextAtlas(';:' + Math.abs(extraScore) + '<', extraScorePng, 24.6, 32, "0")

                      playNode.headScoreNode.addChild(baseScoreLabel)
                      extraScoreLabel.x = 80
                      playNode.headScoreNode.addChild(extraScoreLabel)
                })
        //中道动画
        callBodys.sort( function(a, b)
        {
            return gameLogic.compareType({level:a.centerLevel, score:a.centerScore}, 
                {level:b.centerLevel, score:b.centerScore})
        } )

        for(var i=0;i<callBodys.length;i++)
        {
            var callBody = callBodys[i]
            var wChairID = callBody.wChairID
            var showChairid = tableData.getShowChairIdWithServerChairId(wChairID)
            var outCardsNode = playNode['outCards' + showChairid]

            var cardSprs = []
            for(var ii=0;ii<5;ii++)
            {
                cardSprs[ii] = outCardsNode.getChildByTag(3+ii)
            }
            var cardDatas = callBody.centerCardDatas
            var daoNum = 1
            var level = callBody.centerLevel
            var typeSpr = outCardsNode.getChildByTag(100)
            var isMan = users_cbGender[wChairID].cbGender
            actions_campareCenter[actions_campareCenter.length] = playNode.getTurnCardAction(cardSprs, cardDatas, daoNum, level, typeSpr, isMan)
        }

        actions_campareCenter[actions_campareCenter.length] = cc.callFunc(
                function()
                {   
                      var baseScore =  baseScoreChair0[1] 
                      var extraScore =  extraScoreChair0[1] 

                      var baseScorePng = baseScore>=0?resp.nums5:resp.nums4
                      var extraScorePng = extraScore>=0?resp.nums5:resp.nums4


                      var baseScoreLabel = new ccui.TextAtlas(':' + Math.abs(baseScore), baseScorePng, 24.6, 32, "0")
                      var extraScoreLabel = new ccui.TextAtlas(';:' + Math.abs(extraScore) + '<', extraScorePng, 24.6, 32, "0")

                      playNode.centerScoreNode.addChild(baseScoreLabel)
                      extraScoreLabel.x = 80
                      playNode.centerScoreNode.addChild(extraScoreLabel)
                })
        //尾道动画
        callBodys.sort( function(a, b)
        {
            return gameLogic.compareType({level:a.tailLevel, score:a.tailScore}, 
                {level:b.tailLevel, score:b.tailScore})
        } )

        for(var i=0;i<callBodys.length;i++)
        {
            var callBody = callBodys[i]
            var wChairID = callBody.wChairID
            var showChairid = tableData.getShowChairIdWithServerChairId(wChairID)
            var outCardsNode = playNode['outCards' + showChairid]

            var cardSprs = []
            for(var ii=0;ii<5;ii++)
            {
                cardSprs[ii] = outCardsNode.getChildByTag(8+ii)
            }
            var cardDatas = callBody.tailCardDatas
            var daoNum = 2
            var level = callBody.tailLevel
            var typeSpr = outCardsNode.getChildByTag(100)
            var isMan = users_cbGender[wChairID].cbGender
            actions_campareTail[actions_campareTail.length] = playNode.getTurnCardAction(cardSprs, cardDatas, daoNum, level, typeSpr, isMan)
        }

        actions_campareTail[actions_campareTail.length] = cc.callFunc(
                function()
                {   
                      var baseScore =  baseScoreChair0[2] 
                      var extraScore =  extraScoreChair0[2] 

                      var baseScorePng = baseScore>=0?resp.nums5:resp.nums4
                      var extraScorePng = extraScore>=0?resp.nums5:resp.nums4


                      var baseScoreLabel = new ccui.TextAtlas(':' + Math.abs(baseScore), baseScorePng, 24.6, 32, "0")
                      var extraScoreLabel = new ccui.TextAtlas(';:' + Math.abs(extraScore) + '<', extraScorePng, 24.6, 32, "0")

                      playNode.tailScoreNode.addChild(baseScoreLabel)
                      extraScoreLabel.x = 80
                      playNode.tailScoreNode.addChild(extraScoreLabel)
                

                      var totalScore = 0
                      for(var i=0;i<3;i++)
                      {
                          totalScore += baseScoreChair0[i] 
                          totalScore += extraScoreChair0[i] 
                      } 
                      var chairid0 = tableData.getServerChairIdWithShowChairId(0)
                      totalScore = cmdBaseWorker.lGameScore[chairid0]
                      var totalScorePng = totalScore>=0?resp.nums5:resp.nums4
                      var totalScoreLabel = new ccui.TextAtlas(':' + Math.abs(totalScore), totalScorePng, 24.6, 32, "0")
                      totalScoreLabel.totalScore = totalScore
                      playNode.totalScoreNode.addChild(totalScoreLabel, 0, 101)
                })

        //打枪动画
        for(var wChairID1=0;wChairID1<GAME_PLAYER;wChairID1++)
        {
            for(var wChairID2=0;wChairID2<GAME_PLAYER;wChairID2++)
            {
                if(wChairID1==wChairID2) continue

                if(cmdBaseWorker.bIsDaqiang[wChairID1][wChairID2])
                {
                    var showChairid1 = tableData.getShowChairIdWithServerChairId(wChairID1)
                    var showChairid2 = tableData.getShowChairIdWithServerChairId(wChairID2)
                    actions_daqiang[actions_daqiang.length] = playNode.getDaqiangAction(showChairid1, showChairid2)
                }
            }
        }

        //
        if(cmdBaseWorker.wDa3qiangUser!=INVALID_WORD)
        {
            var showChairid = tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wDa3qiangUser)
            actions_special[actions_special.length] = playNode.getSpecialAction(0, showChairid, users_cbGender[cmdBaseWorker.wDa3qiangUser])
        }



        for(var wChairID=0;wChairID<GAME_PLAYER;wChairID++)
        {
            var callBody = cmdBaseWorker.cbCallRecord[wChairID]
            if(callBody.callFlag!=0 && callBody.callFlag!=254)
            {
                var showChairid = tableData.getShowChairIdWithServerChairId(wChairID)
                var head = cardLogic.sortWithNum(callBody.headCardDatas)
                var center = cardLogic.sortWithNum(callBody.centerCardDatas)
                var tail = cardLogic.sortWithNum(callBody.tailCardDatas)
                var cardDatas = head.concat(center,tail)

                actions_special[actions_special.length] = playNode.getSpecialAction(callBody.callFlag, showChairid, users_cbGender[wChairID], cardDatas)
            }
        }
        var self = tableData.getUserWithUserId(selfdwUserID)
        if((self.wChairID == INVALID_WORD)
            ||((self.wChairID != INVALID_WORD)&&(cmdBaseWorker.cbCallRecord[self.wChairID].callFlag==254))
            )
        {
            playNode.headScoreNode.setVisible(false)
            playNode.centerScoreNode.setVisible(false)
            playNode.totalScoreNode.setVisible(false)
            playNode.tailScoreNode.setVisible(false)
        }
        else
        {
            playNode.headScoreNode.setVisible(true)
            playNode.centerScoreNode.setVisible(true)
            playNode.totalScoreNode.setVisible(true)
            playNode.tailScoreNode.setVisible(true)
        }

        playNode.gameEndAction = cc.sequence( 
            cc.callFunc(function()
            {   
                // managerTouch.closeTouch()
                playNode.playGenderEffect('start_compare', tableData.getUserWithUserId(selfdwUserID).cbGender)
                for(var i=0;i<GAME_PLAYER;i++)
                {
                    var chair = tableData.getChairWithServerChairId(i)
                    var scoreTTF = chair.userNode.userScore

                    var t = parseInt(scoreTTF.getString()) - cmdBaseWorker.lGameScore[i]
                    scoreTTF.setString(  t  )
                }
            }),
            cc.delayTime(0.5),
            cc.sequence(actions_campareHead),
            cc.sequence(actions_campareCenter),
            cc.sequence(actions_campareTail),
            cc.sequence(actions_daqiang),
            cc.sequence(actions_special),
            cc.callFunc(function()
            {     
                playNode._showSprsOnGameEnd()
            }), 
            cc.delayTime(7.5), //看牌2秒
            cc.callFunc(function()
            {   
                var self = tableData.getUserWithUserId(selfdwUserID)
                if((self.wChairID != INVALID_WORD)&&(cmdBaseWorker.cbCallRecord[self.wChairID].callFlag==254))
                {
                    cocos.clearInterval(playNode.updateOnFree, playNode.node)
                    playNode.node.stopAction(playNode.gameEndAction)
                    playNode.resetPlayNode()
                    return
                }
                headIconPop.kickUserOnGameEnd()
                var record = getObjWithStructName('CMD_GR_C_TableHistoryRecordReq') 
                record.szTableKey = tableKey
                socket.sendMessage(MDM_GR_USER, SUB_GR_USER_TABLE_HISTORY_RECORD_REQ, record)
                var continueCall = function()
                {
                    playNode.isLookingResult = false   
                    var user = tableData.getUserWithUserId(selfdwUserID)
                    if(user.cbUserStatus == US_SIT)//只有坐下未准备的情况 才会resetPlayNode
                    {
                        // playNode.resetPlayNode()
                        var isLastWinner = false
                        for(var i=0;i<cmdBaseWorker.dwLastWinner.length;i++)
                        {   
                            isLastWinner =  cmdBaseWorker.dwLastWinner[i] == selfdwUserID
                            if(isLastWinner)
                                break
                        }

                        if(isLastWinner)//有的游戏需要上轮赢得玩家站起
                        {
                            var lookon = getObjWithStructName('CMD_GR_UserLookon') 
                            lookon.wTableID = tableData.tableID
                            socket.sendMessage(MDM_GR_USER, SUB_GR_USER_LOOKON, lookon) 
                        }
                    }
                    /*playNode.buttonContinue.setVisible(true)
                    playNode.continueTime.setString(10)
                    playNode.continueTime.setVisible(true)
                    cocos.setInterval(playNode.updateContinue, 1000, playNode.node)*/
                }
                continueCall()
                
                //playNode.popGameEnd(continueCall, szNickName_gameEnd) 
            }) 
        )           
        playNode.node.runAction(playNode.gameEndAction)
    },
    // ///////////////cmdEvent end//////////



    ////////////gameend start//////////
    _showSprsOnGameEnd:function()
    {
        for(var showChairid=0;showChairid<GAME_PLAYER;showChairid++)
        {
            var direction = showChairid
            var wChairID = tableData.getServerChairIdWithShowChairId(showChairid)

            var user = tableData.getUserWithChairId(wChairID)
            if(!user) continue
            var self = tableData.getUserWithUserId(selfdwUserID)
            if((self.wChairID != INVALID_WORD)&&(cmdBaseWorker.cbCallRecord[self.wChairID].callFlag==254))
            {
                cocos.clearInterval(playNode.updateOnFree, playNode.node)
                playNode.node.stopAction(playNode.gameEndAction)
                playNode.resetPlayNode()
                return
            }
            var chair = tableData.getChairWithServerChairId(wChairID)
            
            var scoreTTF = chair.userNode.userScore
            scoreTTF.setString(  user.lScoreInGame  )

            // if(playData.hasGetSendCardsWithdwUserID(user.dwUserID) && tableData.isInTable(user.cbUserStatus))
            // if(tableData.isInTable(user.cbUserStatus))
            // {   
            var score = cmdBaseWorker.lGameScore[wChairID]
            var scoreNode = user.userNodeInsetChair.currentRoundNode.scoreChange

            var scoreLabel = new ccui.TextAtlas()
            scoreLabel.setProperty(Math.abs(score), score>0?resp.nums2:resp.nums3, 22, 33, "0")
            scoreNode.addChild(scoreLabel)
            
            var sign = score>0?new cc.Sprite('#plus.png'):new cc.Sprite('#minus.png')
            sign.setAnchorPoint(cc.p(0,0.5))
            scoreNode.addChild(sign)

            var signPosx
            var swidth = scoreLabel.getContentSize().width + sign.getContentSize().width
            if( chairFactory.isRight(chair.node) )
            {
                signPosx = - swidth
            }
            else
            {   
                signPosx = 0 
            }
            sign.setPositionX(signPosx) 
            scoreLabel.setPositionX(signPosx + scoreLabel.getContentSize().width * 0.5 + sign.getContentSize().width)    

            if(user.dwUserID == selfdwUserID)
            {
                if(score!= 0)
                {
                    // var sp = score>0?'gameEndWin.png':'gameEndLose.png'
                    // playNode.winOrLoseSpr.setSpriteFrame(sp) 
                    managerAudio.playEffect(score>0?'gameRes/sound/win.mp3':'gameRes/sound/lost.mp3')
                }
            }

        }

    },
    _removeSprsOnGameEnd:function()
    {
        playNode.winOrLoseSpr.setSpriteFrame('empty.png') 
        for(var wChairID=0;wChairID<GAME_PLAYER;wChairID++)
        {   
            var user = tableData.getUserWithChairId(wChairID)
            if(!user) continue

            playNode.clearCurrentRoundNode(user.userNodeInsetChair.currentRoundNode)
            chairFactory.hideFiredCircle.call(user.userNodeInsetChair)
        }
    },
    popGameEnd:function(continueCall, szNickName_gameEnd)
    {
        var cbWinFlag = []
        for(var wChairID=0;wChairID<GAME_PLAYER;wChairID++)
        {
            if(wChairID==cmdBaseWorker.wExitUser)
                cbWinFlag[wChairID] = 6
        }

        var control = {}
        control.exitCall = function()
        {
        }

        control.continueCall = function()
        {
            continueCall()
            node.removeFromParent()
        }
        var node  = cc.BuilderReader.load(resp.gameEndPopCCB, control)

        // control.resultTTF.setString( args.msg )
        for(var wChairID=0;wChairID<GAME_PLAYER;wChairID++)
        {
            if(typeof(cbWinFlag[wChairID])!='undefined')
            {
                control['winflag'+wChairID].setVisible(true)
                control['winflag'+wChairID].setSpriteFrame('winFlag_' + cbWinFlag[wChairID] + '.png') 
            }
            else
                control['winflag'+wChairID].setVisible(false)
            var score = cmdBaseWorker.lGameScore[wChairID]
            control['name'+wChairID].setString(szNickName_gameEnd[wChairID])
            control['win'+wChairID].setVisible(score>0)
            if(score>0)
            {
                control['scoreTTF'+wChairID].setString('+' + score)
                control['scoreTTF'+wChairID].color = cc.color(255, 0, 0)
                control['frame'+wChairID].setSpriteFrame('gend5.png')
            }
            else
            {
                control['scoreTTF'+wChairID].setString(score==0?'-'+score:score)
                control['scoreTTF'+wChairID].color = cc.color(0, 255, 0)
                control['frame'+wChairID].setSpriteFrame('gend6.png')
            }

            // var str = args.PlayerData[i]==-1?'(两帮)':('(' + args.PlayerData[i] + '分)')
            // control['pScoreTTF'+i].setString(str)
            // control['pScoreTTF'+i].x = control['scoreTTF'+i].width
        }

        node.setPosition( cc.p( mainScene.uiTop.getContentSize().width * 0.5, mainScene.uiTop.getContentSize().height * 0.5) )
        mainScene.top.addChild(node) 
    },
    ///gameend end////
    playGenderEffect:function(name, isMan)
    {
        if(isMan)
            managerAudio.playEffect('gameRes/sound/man/' + name + '.mp3')
        else
            managerAudio.playEffect('gameRes/sound/woman/' + name + '.mp3') 
    },
    resetPlayNode:function()
    {
        for(var i=0;i<GAME_PLAYER;i++)
        {
            tableNode.setBankerIcon(i, false)
        }

        for(var i=0;i<GAME_PLAYER;i++)
        {
            playNode['outCards' + i].setVisible(false)
        }
 
        playNode.headScoreNode.removeAllChildren()
        playNode.centerScoreNode.removeAllChildren()
        playNode.tailScoreNode.removeAllChildren()
        playNode.totalScoreNode.removeAllChildren()  

        playNode._removeSprsOnGameEnd()

        //同步数据
        for(var wChairID=0;wChairID<GAME_PLAYER;wChairID++)
        {
            var user = tableData.getUserWithChairId(wChairID)
            if(!user) continue

            var chair = tableData.getChairWithServerChairId(wChairID)
            var scoreTTF = chair.userNode.userScore
            scoreTTF.setString(  user.lScoreInGame  )
        }
    },
    getSelectCard:function()
    {
        var cardSprs = playNode.handCards4D[0]
        var selectCardDatas   = []
        for(var i=0;i<cardSprs.length;i++)
        {
            var cardSpr = cardSprs[i]
            if(cardSpr.y != cardSpr.originY)
                selectCardDatas[selectCardDatas.length] = cardSpr.cardData
        }
        //selectCardDatas = cardLogic.sortWithNum(selectCardDatas)
        return selectCardDatas
    },
    resetHandCard:function(handCards)
    {
        //cocos.clearInterval(playNode.updateOnFree, playNode.node)
        //playNode.node.stopAction(playNode.gameEndAction)
        //playNode.resetPlayNode()

        var outCardDatasArray = []
        var handCardDatasArray = []
        for(var showChairId=0;showChairId<GAME_PLAYER;showChairId++)
        {
            var direction = cardFactory.showChairId2Direction(showChairId)
            outCardDatasArray[direction] = []
            handCardDatasArray[direction] = []
            var wChairID = tableData.getServerChairIdWithShowChairId(showChairId)
            handCardDatasArray[direction] = cardLogic.sortWithNum(playNode.residualCard.concat(handCards))
            handCardDatasArray[direction].sort(function(a, b)
            {
                return gameLogic.num2Scores[cardLogic.getNum(a) ] - gameLogic.num2Scores[cardLogic.getNum(b) ]
            })
        }
      
        playNode.sendCardsAction(handCardDatasArray, outCardDatasArray)
        playNode.residualCard = handCardDatasArray[0]

        playNode.duizi.setEnabled(false);
        playNode.liangdui.setEnabled(false);       
        playNode.santiao.setEnabled(false);
        playNode.shunzi.setEnabled(false);
        playNode.tonghua.setEnabled(false);
        playNode.hulu.setEnabled(false);
        playNode.tiezhi.setEnabled(false);
        playNode.tonghuashun.setEnabled(false);
        playNode.getHandType()
    },
    clearOutCard:function(level)
    {
        var startIdx = 0;
        var len = 0;
        switch(level)
        {
            case 1:
            {
                playNode.headCardDatas =  []
                var spr = playNode.chooseTypeControl.bg.getChildByTag(100)
                spr.setVisible(false);
                startIdx = 0;
                len = 3;
                playNode.chooseTypeControl.headButton.setVisible(true)
            }
            break
            case 2:
            {
                playNode.centerCardDatas = []
                var spr = playNode.chooseTypeControl.bg.getChildByTag(101)
                spr.setVisible(false);
                startIdx = 3;
                len = 5;
                playNode.chooseTypeControl.centerButton.setVisible(true)
            }
            break
            case 3:
            {
                playNode.tailCardDatas = []
                var spr = playNode.chooseTypeControl.bg.getChildByTag(102)
                spr.setVisible(false);
                startIdx = 8;
                len = 5;
                playNode.chooseTypeControl.tailButton.setVisible(true)
            }
            break
        }
        for(var i=startIdx;i<startIdx+len;i++)//
        {
            var spr = playNode.chooseTypeControl.bg.getChildByTag(i)
            spr.setVisible(false)
        }
        playNode.lastSelect = -1
    },
    inspectCard:function(cardDatas,level)//检查选中牌是否符合规则
    {
        var ret1 = true
        var ret2 = true
        switch(level)
        {
            case 1://头道
            {
                headType = gameLogic.getType(cardLogic.sortWithNum(cardDatas))
                if(playNode.centerCardDatas.length >0)//中道有牌
                {    
                    centerType = gameLogic.getType(cardLogic.sortWithNum(playNode.centerCardDatas))
                    if(!(centerType.level >headType.level || (centerType.level == headType.level && centerType.score>headType.score)))
                       ret1 = false
                }
                if(playNode.tailCardDatas.length >0)//尾道有牌
                {
                    tailType = gameLogic.getType(cardLogic.sortWithNum(playNode.tailCardDatas))
                    if(!(tailType.level >headType.level || (tailType.level == headType.level && tailType.score>headType.score)))
                       ret2 = false
                }
                return ret1&&ret2
            }
            break
            case 2://中道
            {
                centerType = gameLogic.getType(cardLogic.sortWithNum(cardDatas))
                if(playNode.headCardDatas.length >0)//头道有牌
                {    
                    headType = gameLogic.getType(cardLogic.sortWithNum(playNode.headCardDatas))
                    if(!(centerType.level >headType.level || (centerType.level == headType.level && centerType.score>headType.score)))
                       ret1 = false
                }
                if(playNode.tailCardDatas.length >0)//尾道有牌
                {
                    tailType = gameLogic.getType(cardLogic.sortWithNum(playNode.tailCardDatas))
                    if(!(tailType.level >centerType.level || (tailType.level == centerType.level && tailType.score>centerType.score)))
                       ret2 = false
                }
                return ret1&&ret2
            }
            break
            case 3://尾道
            {
                tailType = gameLogic.getType(cardLogic.sortWithNum(cardDatas))
                if(playNode.headCardDatas.length >0)//头道有牌
                {    
                    headType = gameLogic.getType(cardLogic.sortWithNum(playNode.headCardDatas))
                    if(!(tailType.level >headType.level || (tailType.level == headType.level && tailType.score>headType.score)))
                       ret1 = false
                }
                if(playNode.centerCardDatas.length >0)//中道有牌
                {    
                    centerType = gameLogic.getType(cardLogic.sortWithNum(playNode.centerCardDatas))
                    if(!(tailType.level >centerType.level || (tailType.level == centerType.level && tailType.score>centerType.score)))
                       ret2 = false
                }
                return ret1&&ret2
            }
            break
        }
    },
    changeChooseType:function(idx)
    {
        var type = playNode.typeList[idx]
        if(!type)return
        playNode.lastSelect = -1
        {
            playNode.chooseTypeControl.bg.getChildByTag(555).setVisible(false)
            playNode.chooseTypeControl.cancelType.setVisible(false)
            playNode.chooseTypeControl.sureType.setVisible(false)
            playNode.chooseTypeControl.bg.getChildByTag(500).setVisible(false)
            playNode.setButtonState(true)
        }

        playNode.nowSelectCardArray = []//清空当前选中牌
        var cardSprs = playNode.handCards4D[0]
        for(var i = 0;i<cardSprs.length;i++)//每次点击前先把牌归位
        {
            var cardSpr = cardSprs[i]
            cardSpr.y = cardSpr.originY
        }
        
        {
            if(playNode.headCardDatas.length > 0)
            {
                playNode.resetHandCard(playNode.headCardDatas)
                playNode.clearOutCard(1)//清空对应道上的牌
            }
            if(playNode.centerCardDatas.length > 0)
            {
                playNode.resetHandCard(playNode.centerCardDatas)
                playNode.clearOutCard(2)//清空对应道上的牌
            }
            if(playNode.tailCardDatas.length > 0)
            {
                playNode.resetHandCard(playNode.tailCardDatas)
                playNode.clearOutCard(3)//清空对应道上的牌
            }
        }
       
        playNode.pushCallFunc(type.head.cardDatas,1,false)
        playNode.pushCallFunc(type.center.cardDatas,2,false)
        playNode.pushCallFunc(type.tail.cardDatas,3,false)
    },
    OnChooseCard:function(idx)
    {
        idx--
        if(idx<0 || idx>=13)return
        if(playNode.lastSelect < 0)
        {
            playNode.lastSelect = idx
            var spr = playNode.chooseTypeControl.bg.getChildByTag(idx)
            spr.color = cc.color(144, 144, 144)
        }
        else if(playNode.lastSelect == idx)
        {
            var spr = playNode.chooseTypeControl.bg.getChildByTag(idx)
            spr.color = cc.color(255, 255, 255)
            playNode.lastSelect = -1
            return
        }
        else
        {
            var tempIdx1 = playNode.lastSelect
            var tempIdx2 = idx
            var lastLevel = 0
            var currentLevel = 0
            var temp1 = 0
            var temp2 = 0
            if(playNode.lastSelect>=8)
            {
                tempIdx1=tempIdx1-8
                lastLevel = 3
                temp1 = playNode.tailCardDatas[tempIdx1]
            }
            else if(playNode.lastSelect>=3)
            {
                tempIdx1=tempIdx1-3
                lastLevel = 2
                temp1 = playNode.centerCardDatas[tempIdx1]
            }
            else
            {
                lastLevel = 1
                temp1 = playNode.headCardDatas[tempIdx1]
            }
            if(idx>=8)
            {
                tempIdx2=tempIdx2-8
                currentLevel = 3
                temp2 = playNode.tailCardDatas[tempIdx2]
            }
            else if(idx>=3)
            {
                tempIdx2=tempIdx2-3
                currentLevel = 2
                temp2 = playNode.centerCardDatas[tempIdx2]
            }
            else
            {
                currentLevel = 1
                temp2 = playNode.headCardDatas[tempIdx2]
            }

            var getArray = function(idx)
            {
                if(idx>=8) return playNode.tailCardDatas
                else if(idx>=3)return playNode.centerCardDatas
                else return playNode.headCardDatas
            }
            var lastArray = getArray(playNode.lastSelect)
            lastArray[tempIdx1] = temp2

            var currentArray = getArray(idx)
            currentArray[tempIdx2] = temp1
            

            var chooseSpr = playNode.chooseTypeControl.bg.getChildByTag(playNode.lastSelect)
            //chooseSpr.setSpriteFrame('hand_' + temp2 + '.png')
            var currentSpr = playNode.chooseTypeControl.bg.getChildByTag(idx)
            //currentSpr.setSpriteFrame('hand_' + temp1 + '.png')*/
           
            playNode.clearOutCard(lastLevel)//清空对应道上的牌
            playNode.pushCallFunc(lastArray,lastLevel,false)

            playNode.clearOutCard(currentLevel)//清空对应道上的牌
            playNode.pushCallFunc(currentArray,currentLevel,false)

            currentSpr.color = cc.color(255, 255, 255)
            chooseSpr.color = cc.color(255, 255, 255)
            playNode.lastSelect = -1
        }
    },
    /////////
    addChooseType:function()
    {
        var control = {}
        control.headButton1 = function()
        {
            if(playNode.headCardDatas.length != 0)//当前道上已经有牌，则将道上的牌全部放下去
            {
                /*playNode.resetHandCard(playNode.headCardDatas)
                playNode.clearOutCard(1)//清空对应道上的牌
                control.closeHead.setVisible(false)
                playNode.sendChangeCard()*/
                return
            }
            playNode.nowSelectCardArray = playNode.getSelectCard()//自动选出的类型+通过手牌点击上去的单个牌
            if(playNode.nowSelectCardArray.length!=3)
            {
                showTips({str:'头道选择的牌必须是3张'}) 
            }
            else
            {
                if(playNode.inspectCard(playNode.nowSelectCardArray,1))//检查牌型是否符合规则
                {
                    playNode.pushCallFunc(playNode.nowSelectCardArray,1,true)
                }
                else
                    showTips({str:'牌型不符合规则，头道必须小于中道，中道必须小于尾道！'}) 
            }
        }
        control.centerButton1 = function()
        {
            if(playNode.centerCardDatas.length != 0)//当前道上已经有牌，则将道上的牌全部放下去
            {
                /*playNode.resetHandCard(playNode.centerCardDatas)
                playNode.clearOutCard(2)//清空对应道上的牌
                control.closeCenter.setVisible(false)
                playNode.sendChangeCard()*/
                return
            }
            playNode.nowSelectCardArray = playNode.getSelectCard()//自动选出的类型+通过手牌点击上去的单个牌
            if(playNode.nowSelectCardArray.length!=5)
            {
                showTips({str:'中道选择的牌必须是5张'}) 
            }
            else
            {
                if(playNode.inspectCard(playNode.nowSelectCardArray,2))//检查牌型是否符合规则
                {
                    playNode.pushCallFunc(playNode.nowSelectCardArray,2,true)
                }
                else
                    showTips({str:'牌型不符合规则，头道必须小于中道，中道必须小于尾道！'}) 
            }
        }
        control.tailButton1 = function()
        {
            if(playNode.tailCardDatas.length != 0)//当前道上已经有牌，则将道上的牌全部放下去
            {
                /*playNode.resetHandCard(playNode.tailCardDatas)
                playNode.clearOutCard(3)//清空对应道上的牌
                control.closeTail.setVisible(false)
                playNode.sendChangeCard()*/
                return
            }
            playNode.nowSelectCardArray = playNode.getSelectCard()//自动选出的类型+通过手牌点击上去的单个牌
            if(playNode.nowSelectCardArray.length!=5)
            {
                showTips({str:'尾道选择的牌必须是5张'}) 
            }
            else
            {
                if(playNode.inspectCard(playNode.nowSelectCardArray,3))//检查牌型是否符合规则
                {
                    playNode.pushCallFunc(playNode.nowSelectCardArray,3,true)
                }
                else
                    showTips({str:'牌型不符合规则，头道必须小于中道，中道必须小于尾道！'}) 
            }
        }
        control.closeHead1 = function()
        {
            playNode.resetHandCard(playNode.headCardDatas)//重新整理手牌         
            playNode.clearOutCard(1)//清空对应道上的牌
            control.closeHead.setVisible(false)
            playNode.sendChangeCard()
        }
        control.closeCenter1 = function()
        {
            playNode.resetHandCard(playNode.centerCardDatas)
            playNode.clearOutCard(2)//清空对应道上的牌
            control.closeCenter.setVisible(false)
            playNode.sendChangeCard()
        }
        control.closeTail1 = function()
        {
            playNode.resetHandCard(playNode.tailCardDatas)
            playNode.clearOutCard(3)//清空对应道上的牌
            control.closeTail.setVisible(false)
            playNode.sendChangeCard()
        }

        control.chooseType11 = function()
        {
            if(playNode.typeList[0])
            {
                playNode.changeChooseType(0)
            }
        }
        control.chooseType22 = function()
        {
           if(playNode.typeList[1])
            {
                playNode.changeChooseType(1)
            } 
        }
        control.chooseType33 = function()
        {
            if(playNode.typeList[2])
            {
                playNode.changeChooseType(2)
            }
        }
        control.chooseType44 = function()
        {
            if(playNode.typeList[3])
            {
                playNode.changeChooseType(3)
            }
        }
        control.chooseType55 = function()
        {
            if(playNode.typeList[4])
            {
                playNode.changeChooseType(4)
            }
        }
        control.cancelType1 = function()
        {
            playNode.chooseTypeControl.bg.getChildByTag(555).setVisible(false)
            control.cancelType.setVisible(false)
            control.sureType.setVisible(false)
            playNode.chooseTypeControl.bg.getChildByTag(500).setVisible(false)

            playNode.setButtonState(true)
        }
        control.sureType1 = function()
        {
            playNode.setButtonState(true)
            var cardDatas = clone(cmdBaseWorker.cbHandCardData[tableData.getUserWithUserId(selfdwUserID).wChairID])
            var specialType = gameLogic.isSpecialType(cardLogic.sortWithNum(cardDatas))
            if(playNode.isSpecialType)
            {
                var headType = gameLogic.getType(cardLogic.sortWithNum(specialType.head.cardDatas))
                var centerType = gameLogic.getType(cardLogic.sortWithNum(specialType.center.cardDatas))
                var tailType = gameLogic.getType(cardLogic.sortWithNum(specialType.tail.cardDatas))
                if((centerType.level > tailType.level) || 
                (centerType.level == tailType.level && centerType.score>tailType.score))
                {
                    var temp = specialType.center.cardDatas
                    specialType.center.cardDatas = specialType.tail.cardDatas
                    specialType.tail.cardDatas = temp
                }   
                playNode.pushCallFunc(specialType.head.cardDatas,1,false)
                playNode.pushCallFunc(specialType.center.cardDatas,2,false)
                playNode.pushCallFunc(specialType.tail.cardDatas,3,false)
            } 
            playNode.chooseTypeControl.bg.getChildByTag(555).setVisible(false)
            control.cancelType.setVisible(false)
            control.sureType.setVisible(false)
            playNode.chooseTypeControl.bg.getChildByTag(500).setVisible(false)    
            playNode.outCard(specialType.specialType)//特殊牌型直接出牌
        }
        control.button1 = function(){ playNode.OnChooseCard(1)}
        control.button2 = function(){ playNode.OnChooseCard(2)}
        control.button3 = function(){ playNode.OnChooseCard(3)}
        control.button4 = function(){ playNode.OnChooseCard(4)}
        control.button5 = function(){ playNode.OnChooseCard(5)}
        control.button6 = function(){ playNode.OnChooseCard(6)}
        control.button7 = function(){ playNode.OnChooseCard(7)}
        control.button8 = function(){ playNode.OnChooseCard(8)}
        control.button9 = function(){ playNode.OnChooseCard(9)}
        control.button10 = function(){ playNode.OnChooseCard(10)}
        control.button11 = function(){ playNode.OnChooseCard(11)}
        control.button12 = function(){ playNode.OnChooseCard(12)}
        control.button13 = function(){ playNode.OnChooseCard(13)}

        control.sureCall = function()
        {
            playNode.outCard(0)
        }

        var node  = cc.BuilderReader.load(resp.chooseTypeCCB, control)
        node.setPosition( cc.p( tableNode.uiChair.getContentSize().width * 0.5, tableNode.uiChair.getContentSize().height * 0.5) )
        //node.scale = 0.8
        playNode.uiTop.addChild(node)
        node.setVisible(false)

        //var listener = playNode.getChooseTypeBgListener()
        //cc.eventManager.addListener(listener, control.bg)

        playNode.chooseTypeNode = node
        playNode.chooseTypeControl = control
    },
    setButtonState:function(state)
    {
        playNode.chooseTypeControl.tailButton.setVisible(state)
        playNode.chooseTypeControl.centerButton.setVisible(state)
        playNode.chooseTypeControl.headButton.setVisible(state) 

        playNode.chooseTypeControl.button_1.setVisible(state)
        playNode.chooseTypeControl.button_2.setVisible(state)
        playNode.chooseTypeControl.button_3.setVisible(state)
        playNode.chooseTypeControl.button_4.setVisible(state)
        playNode.chooseTypeControl.button_5.setVisible(state)
        playNode.chooseTypeControl.button_6.setVisible(state)
        playNode.chooseTypeControl.button_7.setVisible(state)
        playNode.chooseTypeControl.button_8.setVisible(state)
        playNode.chooseTypeControl.button_9.setVisible(state)
        playNode.chooseTypeControl.button_10.setVisible(state)
        playNode.chooseTypeControl.button_11.setVisible(state)
        playNode.chooseTypeControl.button_12.setVisible(state)
        playNode.chooseTypeControl.button_13.setVisible(state)
    },
    autoOutCard:function()
    {
        var cardDatas = clone(cmdBaseWorker.cbHandCardData[tableData.getUserWithUserId(selfdwUserID).wChairID])
        var specialType = gameLogic.isSpecialType(cardLogic.sortWithNum(cardDatas))
        if(playNode.isSpecialType)
        {
            playNode.chooseTypeControl.bg.getChildByTag(555).setVisible(false)
            playNode.chooseTypeControl.cancelType.setVisible(false)
            playNode.chooseTypeControl.sureType.setVisible(false)
            playNode.chooseTypeControl.bg.getChildByTag(500).setVisible(false)
            
            var headType = gameLogic.getType(cardLogic.sortWithNum(specialType.head.cardDatas))
            var centerType = gameLogic.getType(cardLogic.sortWithNum(specialType.center.cardDatas))
            var tailType = gameLogic.getType(cardLogic.sortWithNum(specialType.tail.cardDatas))
            if((centerType.level > tailType.level) || 
            (centerType.level == tailType.level && centerType.score>tailType.score))
            {
                var temp = specialType.center.cardDatas
                specialType.center.cardDatas = specialType.tail.cardDatas
                specialType.tail.cardDatas = temp
            }   
            playNode.pushCallFunc(specialType.head.cardDatas,1,false)
            playNode.pushCallFunc(specialType.center.cardDatas,2,false)
            playNode.pushCallFunc(specialType.tail.cardDatas,3,false)   
        }
        else
        {   
            if(playNode.typeList.length>0 && playNode.typeList[0])
            {
                playNode.changeChooseType(0)
            }
            else
            {
                var getArray = function(cardDatas,start,len)//获取数组的前len个元素
                {
                    var cards = []
                    for(var i =start;i<len;i++)
                    {
                        cards[cards.length] = cardDatas[i]       
                    } 
                    return cards
                }
                var cards = cardLogic.sortWithNum(cardDatas)//正常情况下，不会出现这种情况
                playNode.pushCallFunc(getArray(cards,0,3),1,false)
                playNode.pushCallFunc(getArray(cards,3,5),2,false)
                playNode.pushCallFunc(getArray(cards,8,5),3,false)    
            }
        }
        playNode.outCard(specialType.specialType)
    },
    outCard:function(special)
    {
        var callFlag = 0
        if(!(playNode.headCardDatas.length ==3 && playNode.centerCardDatas.length ==5 && playNode.tailCardDatas.length ==5))
        {
            showTipsTTF({str:'相公啦!', color:cc.color(222, 222, 22), size:24})
            return
        }
        var cardDatas = cardLogic.sortWithNum(playNode.headCardDatas).concat(cardLogic.sortWithNum(playNode.centerCardDatas),cardLogic.sortWithNum(playNode.tailCardDatas))
        var specialType = gameLogic.isSpecialType(cardDatas)
        
        var headType = gameLogic.getType(cardLogic.sortWithNum(playNode.headCardDatas))
        var centerType = gameLogic.getType(cardLogic.sortWithNum(playNode.centerCardDatas))
        var tailType = gameLogic.getType(cardLogic.sortWithNum(playNode.tailCardDatas))
        if(
           (headType.level > centerType.level)
           ||(headType.level == centerType.level && headType.score>centerType.score)
           ||(centerType.level > tailType.level)
           ||(centerType.level == tailType.level && centerType.score>tailType.score)
           )
        {
            if(!specialType.specialType)
            {
                showTipsTTF({str:'牌型不符合规则，头道必须小于中道，中道必须小于尾道!', color:cc.color(222, 222, 22), size:24})
                return
            }
        }
        
        if(specialType.specialType)
        {
            callFlag = specialType.specialType
            if(callFlag == special_sanhua)
            {
                var head = (
                    (cardLogic.getColor(playNode.headCardDatas[0]) == cardLogic.getColor(playNode.headCardDatas[1]))
                    &&(cardLogic.getColor(playNode.headCardDatas[1]) == cardLogic.getColor(playNode.headCardDatas[2]))
                    )
               var center = (
                    (cardLogic.getColor(playNode.centerCardDatas[0]) == cardLogic.getColor(playNode.centerCardDatas[1]))
                    &&(cardLogic.getColor(playNode.centerCardDatas[1]) == cardLogic.getColor(playNode.centerCardDatas[2]))
                    &&(cardLogic.getColor(playNode.centerCardDatas[2]) == cardLogic.getColor(playNode.centerCardDatas[3]))
                    &&(cardLogic.getColor(playNode.centerCardDatas[3]) == cardLogic.getColor(playNode.centerCardDatas[4]))
                    )
               var tail = (
                    (cardLogic.getColor(playNode.tailCardDatas[0]) == cardLogic.getColor(playNode.tailCardDatas[1]))
                    &&(cardLogic.getColor(playNode.tailCardDatas[1]) == cardLogic.getColor(playNode.tailCardDatas[2]))
                    &&(cardLogic.getColor(playNode.tailCardDatas[2]) == cardLogic.getColor(playNode.tailCardDatas[3]))
                    &&(cardLogic.getColor(playNode.tailCardDatas[3]) == cardLogic.getColor(playNode.tailCardDatas[4]))
                    )
                if(!(head && center && tail))
                    callFlag = 0
            }
            if(callFlag == special_liuduiban)
            {
                if(special==0)
                {
                    if(headType.level == level_tiezhi || centerType.level == level_tiezhi || tailType.level == level_tiezhi)
                    {
                        callFlag = 0
                    }
                }
            }
        }
        if(special>0)
            callFlag = special
        {
            var call = getObjWithStructName('CMD_C_Call')
            call.callBody.callFlag = callFlag
            call.callBody.headCardDatas = playNode.headCardDatas
            call.callBody.headLevel = headType.level
            call.callBody.headScore = headType.score

            call.callBody.centerCardDatas = playNode.centerCardDatas
            call.callBody.centerLevel = centerType.level
            call.callBody.centerScore = centerType.score

            call.callBody.tailCardDatas = playNode.tailCardDatas
            call.callBody.tailLevel = tailType.level
            call.callBody.tailScore = tailType.score

            socket.sendMessage(MDM_GF_GAME,SUB_C_CALL,call)

            playNode.chooseTypeControl.frame.x = -2000
            playNode.chooseTypeNode.setVisible(false)
            playNode.duizi.setVisible(false);
            playNode.liangdui.setVisible(false);
            playNode.santiao.setVisible(false);
            playNode.shunzi.setVisible(false);
            playNode.tonghua.setVisible(false);
            playNode.hulu.setVisible(false);
            playNode.tiezhi.setVisible(false);
            playNode.tonghuashun.setVisible(false);
            playNode.chooseTypeControl.closeHead.setVisible(false)
            playNode.chooseTypeControl.closeCenter.setVisible(false)
            playNode.chooseTypeControl.closeTail.setVisible(false)
            for(var i = 1;i<=3;i++)
                playNode.clearOutCard(i)//清空对应道上的牌
        }
        playNode.isOutCard = true
        playNode.chooseTypeControl.clockNode.removeAllChildren()
    },
    hideAllChooseType:function()
    {
        for(var i = 1;i<=5;i++)
        {
            for(var j = 1;j<=3;j++)
            {
                var tag = 10000+i*10+j
                playNode.chooseTypeControl.bg.getChildByTag(tag).setVisible(false)
            }
        }
    },
    showChooseType:function(cardDatas)
    {
        var getTypeString = function(type)
        {    
            if(type == 0)return 'bt_wulong.png'
            if(type == 1)return 'btn_duizi.png'
            if(type == 2)return 'btn_liangdui.png'
            if(type == 3)return 'btn_santiao.png'
            if(type == 4)return 'btn_sunzi.png'
            if(type == 5)return 'btn_tonghua.png'
            if(type == 6)return 'btn_hulu.png'
            if(type == 7)return 'btn_tiezhi.png'
            if(type == 8)return 'btn_tonghuashun.png'
        }
        playNode.hideAllChooseType()
        playNode.playGenderEffect('start_poker', tableData.getUserWithUserId(selfdwUserID).cbGender)

        playNode.typeList = []
        var unique = function(typeData)
        {
            for(var i = 0;i<playNode.typeList.length;i++)
            {
                var nowType = playNode.typeList[i]
                if((nowType.head.type == typeData.head.type)
                     && (nowType.center.type == typeData.center.type)
                      && (nowType.tail.type == typeData.tail.type))
                {
                    return false
                }
            }
            return true
        }
        var nowLevel = 8
        var centerLevel = 8
        for(var i = 0;i<5;i++)
        {
            var cards = clone(cardDatas)
            var chooseType = playNode.getChooseTypeList(cards,nowLevel,centerLevel)
            if(chooseType.head.cardDatas.length ==3 && chooseType.center.cardDatas.length ==5 &&chooseType.tail.cardDatas.length ==5)
            {
                var headType = gameLogic.getType(playNode.sortWithNum(chooseType.head.cardDatas))
                var centerType = gameLogic.getType(playNode.sortWithNum(chooseType.center.cardDatas))
                var tailType = gameLogic.getType(playNode.sortWithNum(chooseType.tail.cardDatas))
                if(tailType.level == 0)break
                nowLevel = chooseType.tail.type
                centerLevel = chooseType.center.type-1
                if(chooseType.center.type <1)
                {
                    nowLevel = nowLevel-1;
                    centerLevel = nowLevel;
                }

                chooseType.tail.type = tailType.level
                chooseType.center.type = centerType.level
                chooseType.head.type = headType.level

                if((centerType.level > tailType.level) || 
                    (centerType.level == tailType.level && centerType.score>tailType.score))
                {
                    var temp = chooseType.center.cardDatas
                    chooseType.center.cardDatas = chooseType.tail.cardDatas
                    chooseType.tail.cardDatas = temp

                    var tempType = centerType.level
                    chooseType.center.type = chooseType.tail.type
                    chooseType.tail.type = tempType

                    var temp1 = centerType
                    centerType = tailType
                    tailType = temp1
                }   
                var ret = true
                if(
                    //(chooseType.center.type == 0)//中道为乌龙
                    (headType.level > centerType.level)
                    ||(headType.level == centerType.level && headType.score>centerType.score)
                    ||(centerType.level > tailType.level)
                    ||(centerType.level == tailType.level && centerType.score>tailType.score)
                    )
                {
                    ret = false
                }
                if(ret && unique(chooseType))
                    playNode.typeList[playNode.typeList.length] = chooseType
                else
                {
                    nowLevel = chooseType.tail.type-1;
                    centerLevel = nowLevel;
                }
                if(headType.level == 0 && centerType.level == 1 && tailType.level == 2)
                {
                    nowLevel = tailType.level-1;
                    centerLevel = nowLevel;
                }
                if(nowLevel<=0)
                    break
                //cardDatas = playNode.sortWithNum(chooseType.tail.cardDatas.concat(chooseType.center.cardDatas,chooseType.head.cardDatas))
                
            }
            else
                break
        }
        for(var i=0;i<playNode.typeList.length;i++)
        {
            for(var j = 1;j<=3;j++)
            {
                var tag = 10000+(i+1)*10+j
                var spr = playNode.chooseTypeControl.bg.getChildByTag(tag)
                var type = playNode.typeList[i]
                var fileName = ''
                if(j == 1)fileName = getTypeString(type.head.type)
                else if(j==2)fileName = getTypeString(type.center.type)
                else fileName = getTypeString(type.tail.type)
                spr.setSpriteFrame(fileName)
                spr.setVisible(true)
            }
        }
    },
    getTurnCardAction:function(cardSprs, cardDatas, daoNum, level, typeSpr, isMan)
    {
        var levelName = 'level_' + level
        if(level==3 && daoNum==0)//0头1中2尾
            levelName += '_y'
        if(level==6 && daoNum==1)
            levelName += '_y'
        var actions = []
        for(var i=0;i<cardSprs.length;i++)
        {    
            var target = cardSprs[i]
            var endCardIdx = cardDatas[i]
            var a1 = playNode.getTurnOverAction(target, endCardIdx)
            actions[actions.length] = cc.targetedAction( target, a1 )   
        }

        var spawn = cc.spawn(actions)

        var sequence = cc.sequence(spawn,
            cc.callFunc(
            function()
            {   
                typeSpr.setSpriteFrame(levelName + '.png')
                typeSpr.y = 65*(2-daoNum)
                playNode.playGenderEffect(levelName, isMan)
            }),
            cc.delayTime(0.7),//1
            cc.callFunc(
            function()
            {   
                typeSpr.setSpriteFrame('empty.png') 
            })
            )
        return sequence
    },
    getTurnOverAction:function(target, endCardIdx, endAction, scale)
    {
        scale = scale || target.getScale()
        // //var a1 = cc.orbitCamera(0.2, 1, 0, 0, 90, 0, 0) 安卓不支持
        var a1 = cc.delayTime(0.2)   //cc.scaleTo(0.5, scale*1.8, scale*1.8)
        var a2 = cc.callFunc(
                    function()
                    {   
                        target.setSpriteFrame('out_' + endCardIdx + '.png') 
                        // target.setFlippedX(true) 
                    })
        // var a3 = cc.orbitCamera(0.2, 1, 0, 90, 90, 0, 0)
        var a3 = cc.delayTime(0.2)  //cc.scaleTo(0.5, scale, scale)
        var a4 = cc.sequence(a1, a2, a3)

        return endAction?cc.sequence(a4, endAction):a4
    },
    getDaqiangAction:function(showChairid1, showChairid2)
    {
        var outCardsNode1 = playNode['outCards' + showChairid1]
        var outCardsNode2 = playNode['outCards' + showChairid2]


        var qiang = new cc.Sprite('#shoot_gun.png')

        var isFlip = outCardsNode1.x>outCardsNode2.x

        var tan = Math.abs(outCardsNode1.y-outCardsNode2.y)/Math.abs(outCardsNode1.x-outCardsNode2.x)
        var rotation = (isFlip?-1:1)*(outCardsNode1.y>outCardsNode2.y?1:-1)*Math.atan(tan)/3.14*180

        qiang.setFlippedX(isFlip)
        qiang.rotation = rotation


        var sequence = cc.sequence(
            cc.callFunc(
            function()
            {   
                outCardsNode1.addChild(qiang)
                managerAudio.playEffect('gameRes/sound/daqiang2.mp3')
            }),
            cc.delayTime(0.2),
            cc.callFunc(
            function()
            {   
                managerAudio.playEffect('gameRes/sound/daqiang2.mp3')
            }),
            cc.delayTime(0.2),
            cc.callFunc(
            function()
            {   
                managerAudio.playEffect('gameRes/sound/daqiang2.mp3')
            }),
            cc.delayTime(0.6),
            cc.callFunc(
            function()
            {   
                qiang.removeFromParent()
                if(showChairid1==0 || showChairid2==0)
                {
                    var wChairID1 = tableData.getServerChairIdWithShowChairId(showChairid1)
                    var wChairID2 = tableData.getServerChairIdWithShowChairId(showChairid2)

                    var totalScoreLabel = playNode.totalScoreNode.getChildByTag(101)
                    var totalScore = totalScoreLabel.totalScore 

                    for(var i=0;i<3;i++)
                    {
                        totalScore += cmdBaseWorker.lBaseScore[wChairID1][wChairID2][i]*(showChairid1==0?1:-1)
                        totalScore += cmdBaseWorker.lExtraScore[wChairID1][wChairID2][i]*(showChairid1==0?1:-1)
                    }
                    var chairid0 = tableData.getServerChairIdWithShowChairId(0)
                    totalScore = cmdBaseWorker.lGameScore[chairid0]
                    playNode.totalScoreNode.removeAllChildren()

                    var totalScorePng = totalScore>=0?resp.nums5:resp.nums4
                    var totalScoreLabel = new ccui.TextAtlas(':' + Math.abs(totalScore), totalScorePng, 24.6, 32, "0")
                    totalScoreLabel.totalScore = totalScore
                    playNode.totalScoreNode.addChild(totalScoreLabel, 0, 101)
                }


            })
            )


        return sequence
    },
    getSpecialAction:function(specialType, showChairid, isMan, cardDatas)
    {
        var outCardsNode = playNode['outCards' + showChairid]
        var spr = new cc.Sprite('#special_'+specialType+'.png')

        var sequence = cc.sequence(
                cc.callFunc(
                function()
                {   
                    outCardsNode.getChildByTag(100).setSpriteFrame('empty.png')   
                    outCardsNode.addChild(spr)
                    playNode.playGenderEffect('special_'+specialType, isMan)

                    if(specialType==0)//全垒打
                    {
                        var totalScoreLabel = playNode.totalScoreNode.getChildByTag(101)
                        var totalScore = totalScoreLabel.totalScore 

                        if(showChairid==0)
                        {
                            var chairid0 = tableData.getServerChairIdWithShowChairId(0)
                            for(showid=1;showid<GAME_PLAYER;showid++)
                            {
                                var wChairID = tableData.getServerChairIdWithShowChairId(showid)
                                for(var i=0;i<3;i++)
                                {
                                    totalScore += cmdBaseWorker.lBaseScore[chairid0][wChairID][i]*2
                                    totalScore += cmdBaseWorker.lExtraScore[chairid0][wChairID][i]*2
                                }
                            }
                        }
                        else
                        {
                            var chairid = tableData.getServerChairIdWithShowChairId(showChairid)
                            var chairid0 = tableData.getServerChairIdWithShowChairId(0)
                            for(var i=0;i<3;i++)
                            {
                                totalScore -= cmdBaseWorker.lBaseScore[chairid][chairid0][i]*2
                                totalScore -= cmdBaseWorker.lExtraScore[chairid][chairid0][i]*2
                            }
                        }
                        var chairid0 = tableData.getServerChairIdWithShowChairId(0)
                        totalScore = cmdBaseWorker.lGameScore[chairid0]
                        playNode.totalScoreNode.removeAllChildren()

                        var totalScorePng = totalScore>=0?resp.nums5:resp.nums4
                        var totalScoreLabel = new ccui.TextAtlas(':' + Math.abs(totalScore), totalScorePng, 24.6, 32, "0")
                        totalScoreLabel.totalScore = totalScore
                        playNode.totalScoreNode.addChild(totalScoreLabel, 0, 101)
                    }
                    else
                    {
                        for(var i=0;i<13;i++)
                        {
                            var cardData = cardDatas[i]
                            outCardsNode.getChildByTag(i).setSpriteFrame('out_'+cardData+'.png')
                        }
                        var joinNum = 0
                        for(wChairID=0;wChairID<GAME_PLAYER;wChairID++)
                        {
                            if(cmdBaseWorker.cbCallRecord[wChairID].callFlag!=254)
                                joinNum += 1
                        }

                        var totalScoreLabel = playNode.totalScoreNode.getChildByTag(101)
                        var totalScore = totalScoreLabel.totalScore 

                        var map = [6, 6, 6, 12, 12, 12, 12, 13, 26]

                        //totalScore += map[specialType-1]*(showChairid==0?(joinNum-1):-1)
                        //totalScore += map[specialType-1]*(showChairid==0?1:-1)
                        //totalScore = cmdBaseWorker.lGameScore[showChairid]
                        totalScore = 0//现在特殊牌型牌型大的直接抢水，不再算差值
                        playNode.totalScoreNode.removeAllChildren()

                        var totalScorePng = totalScore>=0?resp.nums5:resp.nums4
                        var totalScoreLabel = new ccui.TextAtlas(':' + Math.abs(totalScore), totalScorePng, 24.6, 32, "0")
                        totalScoreLabel.totalScore = totalScore

                        playNode.totalScoreNode.addChild(totalScoreLabel, 0, 101)
                    }
                }),
                cc.delayTime(0.7),
                cc.callFunc(
                function()
                {   
                    spr.removeFromParent()
                })
                )

        
        return sequence

    },
    getChooseTypeList:function(cardDatas,level,centerLevel)
    {
        var getArray = function(cardDatas,len)//获取数组的前len个元素
        {
            var cards = []
            for(var i =0;i<len;i++)
            {
                cards[i] = cardDatas[i]       
            } 
            return cards
        }
        var deleteCard = function(array1,array2)//删除array1中含有array2的元素
        {
            var tempResidualCard = []

            for(var i =0;i<array2.length;i++)
            {  
                for(var j=0;j<array1.length;j++)
                {
                    if(array1[j] == array2[i])
                    {
                        array1[j] = 0
                        break
                    } 
                }   
            } 
            var j = 0
            for(var i = 0;i<array1.length;i++)
            {
                if(array1[i]>0)
                {
                    tempResidualCard[j] =  array1[i]
                    j++
                }
            }
            return tempResidualCard
        }
        var sortWithNum = function(array)
        {
            if(array.length<=0)return
            for(var i=0;i<array.length-1;i++)
            {
                for(var j=0;j<array.length-1-i;j++)
                {
                    var num1 = cardLogic.getNum(array[j])
                    var num2 = cardLogic.getNum(array[j+1])
                    if(num1 == 1)num1 = 14//A最大
                    if(num2 == 1)num2 = 14
                    if(num1 < num2)
                    {
                        var temp = array[j];
                        array[j] = array[j+1]
                        array[j+1] = temp
                    }
                }
            }
        }
        var getDifferArray = function(array,len,type)//type为-1，从最小的开始获取，type为1，从最大的开始获取
        {
            var cards = []
            if(array.length<=0)return cards
            var array1 = clone(array)
            if(type == 1)
                array1 = cardLogic.sortWithNum(array1)
            else if(type == -1)
                sortWithNum(array1)
            for(var i =array1.length-1;i>=0;i--)
            {
                if(cards.length == len)break
                if(i == array1.length-1)
                   cards[cards.length] =  array1[i]
                else
                {
                    var ret = false
                    for(var j = 0;j<cards.length;j++)
                    {
                        if(array1[i] == cards[j])
                        {
                            ret = true
                            break
                        }
                    }
                    if(!ret)
                        cards[cards.length] =  array1[i]   
                }       
            }
            return cards
        }
        var sortDuizi = function(duiziArray)//从大到小
        {
            if(duiziArray.length<=0)return
            for(var i=0;i<duiziArray.length-1;i++)
            {
                for(var j=0;j<duiziArray.length-1-i;j++)
                {
                    var duizi1 = cardLogic.getNum(duiziArray[j][0])
                    var duizi2 = cardLogic.getNum(duiziArray[j+1][0])
                    if(duizi1 == 1)duizi1 = 14//A最大
                    if(duizi2 == 1)duizi2 = 14
                    if(duizi1 < duizi2)
                    {
                        var temp = duiziArray[j];
                        duiziArray[j] = duiziArray[j+1]
                        duiziArray[j+1] = temp
                    }
                }
            }
        }
        var isShunz = function(shunziArray,num1,num2,num3)
        {
            if(shunziArray.length<=0)return true
            for(var i = 0;i<shunziArray.length;i++)
            {
                var shunzi = shunziArray[i]
                for(var j = 0;j<shunzi.length;j++)
                {
                    if((shunzi[j]==num1)||(shunzi[j]==num2)||(shunzi[j]==num3))
                        return false
                }
            }
            return true
        }
        var getLevelDatas = function(tempResidualCard,level,lastLevel)
        {
            var tempCardDatas = []
            var nowLevel = 0

            if(playNode.duiziArray.length>1)
            {
                sortDuizi(playNode.duiziArray)
            }
            if(playNode.santiaoArray.length>1)
            {
                sortDuizi(playNode.santiaoArray)
            }
            var duiziData = []
            if(playNode.duiziArray.length>1)
            {
                for(var i = 0;i<playNode.duiziArray.length;i++)
                {
                    duiziData[duiziData.length] = playNode.duiziArray[i][0]
                    duiziData[duiziData.length] = playNode.duiziArray[i][1]
                }
            }     
            if(playNode.tonghuashunArray.length>0 && lastLevel>=8)
            {
                tempCardDatas = getArray(playNode.tonghuashunArray[0],5)  
                nowLevel = 8 
            }
            else if(playNode.sizhangArray.length>0 && lastLevel>=7)
            {
                tempCardDatas = playNode.sizhangArray[0]
                tempResidualCard = deleteCard(tempResidualCard,tempCardDatas)
                var tempArr1 = clone(tempResidualCard)
                tempResidualCard = deleteCard(tempResidualCard, duiziData);
                var cards = getDifferArray(tempResidualCard, 1, -1);
                if (cards.length < 1)//存在一种情况，除了尾道剩下的都是对子，此时把所有对子删除之后，中道手牌将不够5张，此时就只能拆开对子做单牌
                {
                    tempResidualCard = tempArr1;
                    cards = getDifferArray(tempResidualCard, 1, -1);
                } 
                tempCardDatas[tempCardDatas.length] = cards[0]
                tempResidualCard = deleteCard(tempResidualCard,cards)
                nowLevel = 7 
            }
            else if(((playNode.santiaoArray.length>0 && playNode.duiziArray.length>0) || (playNode.santiaoArray.length>1))&& lastLevel>=6)
            {
                var duizi = []
                var santiao = playNode.santiaoArray[0]
                if(playNode.duiziArray.length>0)
                {
                    duizi = playNode.duiziArray[playNode.duiziArray.length-1]
                }
                else if(playNode.santiaoArray.length>1)
                {
                    var arr = playNode.santiaoArray[playNode.santiaoArray.length-1]
                    duizi = getArray(arr,2)
                }
                if(playNode.shunziArray.length>0)
                {
                    for(var i = 0;i<playNode.santiaoArray.length;i++)//确定三条，尝试不拆顺子
                    {
                        var ret = isShunz(playNode.shunziArray,playNode.santiaoArray[i][0],playNode.santiaoArray[i][1],playNode.santiaoArray[i][2])
                        if(ret)
                        {
                            santiao = playNode.santiaoArray[i]
                            playNode.santiaoArray[i] = []//在这里把数组清空，防止下边的对子再选中这个
                            break
                        } 
                    }
                    for(var i = 1;i<playNode.santiaoArray.length;i++)//确定对子，尝试不拆顺子
                    {
                        if(playNode.santiaoArray[i].length<=0)continue
                        duizi = getArray(playNode.santiaoArray[i],2)
                    }
                    for(var i = playNode.duiziArray.length-1;i>=0;i--)//确定对子，尝试不拆顺子
                    {
                        var ret = isShunz(playNode.shunziArray,playNode.duiziArray[i][0],playNode.duiziArray[i][1])
                        if(ret)
                        {
                            duizi = playNode.duiziArray[i]
                            break
                        } 
                    }                 
                }     
                tempCardDatas = santiao.concat(duizi)
                nowLevel = 6
            }
            else if(playNode.tonghuaArray.length>0 && lastLevel>=5)
            {
                tempCardDatas = getArray(playNode.tonghuaArray[0],5)
                nowLevel = 5
            }
            else if(playNode.shunziArray.length>0 && lastLevel>=4)
            {
                tempCardDatas = getArray(playNode.shunziArray[0],5)
                nowLevel = 4
            }
            else if(playNode.santiaoArray.length>0 && lastLevel>=3)
            {
                tempCardDatas = playNode.santiaoArray[0]
                tempResidualCard = deleteCard(tempResidualCard,tempCardDatas)
                var tempArr1 = clone(tempResidualCard)
                tempResidualCard = deleteCard(tempResidualCard, duiziData);
                var cards = getDifferArray(tempResidualCard, 2, -1);
                if (cards.length < 1)//存在一种情况，除了尾道剩下的都是对子，此时把所有对子删除之后，中道手牌将不够5张，此时就只能拆开对子做单牌
                {
                    tempResidualCard = tempArr1;
                    cards = getDifferArray(tempResidualCard, 2, -1);
                } 
                for(var i = 0;i<cards.length;i++)
                {
                    tempCardDatas[tempCardDatas.length] = cards[i]
                }
                tempResidualCard = deleteCard(tempResidualCard,cards)
               
                nowLevel = 3
            } 
            else if((playNode.duiziArray.length>1 || (playNode.duiziArray.length>0 && playNode.santiaoArray.length>0))&&lastLevel>=2)
            {
                if(playNode.duiziArray.length>2)
                {
                    tempCardDatas = playNode.duiziArray[0].concat(playNode.duiziArray[1])
                    tempResidualCard = deleteCard(tempResidualCard,tempCardDatas)

                    var tempArr1 = clone(tempResidualCard)
                    tempResidualCard = deleteCard(tempResidualCard, duiziData);
                    var cards = getDifferArray(tempResidualCard, 1, -1);
                    if (cards.length < 1)//存在一种情况，除了尾道剩下的都是对子，此时把所有对子删除之后，中道手牌将不够5张，此时就只能拆开对子做单牌
                    {
                        tempResidualCard = tempArr1;
                        cards = getDifferArray(tempResidualCard, 1, -1);
                    } 
                    tempCardDatas[tempCardDatas.length] = cards[0]
                    tempResidualCard = deleteCard(tempResidualCard,cards)
                }
                else if(playNode.duiziArray.length>1)  
                {
                    tempCardDatas = playNode.duiziArray[0].concat(playNode.duiziArray[1])
                    tempResidualCard = deleteCard(tempResidualCard,tempCardDatas);
                    var tempArr1 = clone(tempResidualCard)
                    tempResidualCard = deleteCard(tempResidualCard, duiziData);
                    var cards = getDifferArray(tempResidualCard, 1, -1);
                    if (cards.length < 1)//存在一种情况，除了尾道剩下的都是对子，此时把所有对子删除之后，中道手牌将不够5张，此时就只能拆开对子做单牌
                    {
                        tempResidualCard = tempArr1;
                        cards = getDifferArray(tempResidualCard, 1, -1);
                    }   
                    tempCardDatas[tempCardDatas.length] = cards[0]
                    tempResidualCard = deleteCard(tempResidualCard,cards)
                }  
                else if(playNode.duiziArray.length>0 && playNode.santiaoArray.length>0)
                {
                    tempCardDatas = playNode.duiziArray[0]
                    tempResidualCard = deleteCard(tempResidualCard,tempCardDatas)
                    var tempArr1 = clone(tempResidualCard)
                    tempResidualCard = deleteCard(tempResidualCard, duiziData);
                    var cards = getDifferArray(tempResidualCard, 1, -1);
                    if (cards.length < 1)//存在一种情况，除了尾道剩下的都是对子，此时把所有对子删除之后，中道手牌将不够5张，此时就只能拆开对子做单牌
                    {
                        tempResidualCard = tempArr1;
                        cards = getDifferArray(tempResidualCard, 1, -1);
                    }
                    var cards = getArray(playNode.santiaoArray[0],2)
                    for(var i = 0;i<cards.length;i++)
                    {
                        tempCardDatas[tempCardDatas.length] = cards[i]
                    }
                    tempResidualCard = deleteCard(tempResidualCard,cards)

                    var cards1 = getDifferArray(tempResidualCard,1,-1)
                    
                    tempCardDatas[tempCardDatas.length] = cards1[0]
                    
                    tempResidualCard = deleteCard(tempResidualCard,cards1)
                }
                else if(playNode.santiaoArray.length>1)
                {
                    var cards1 = getArray(playNode.santiaoArray[0],2)
                    var cards2 = getArray(playNode.santiaoArray[1],2)

                    for(var i = 0;i<cards1.length;i++)
                    {
                        tempCardDatas[tempCardDatas.length] = cards1[i]
                    }
                    for(var i = 0;i<cards2.length;i++)
                    {
                        tempCardDatas[tempCardDatas.length] = cards2[i]
                    }

                    tempResidualCard = deleteCard(tempResidualCard,tempCardDatas)

                    var cards = getDifferArray(tempResidualCard,1,-1)
                    
                    tempCardDatas[tempCardDatas.length] = cards[0]
                    tempResidualCard = deleteCard(tempResidualCard,cards)
                    
                }  
                nowLevel = 2
            }
            else if(playNode.duiziArray.length>0 || playNode.santiaoArray.length>0 && lastLevel>=1)
            { 
                if(playNode.duiziArray.length>0)
                {
                    tempCardDatas = playNode.duiziArray[0]
                }
                else if(playNode.santiaoArray.length>0)
                {
                    tempCardDatas = getArray(playNode.santiaoArray[0],2)       
                }
                tempResidualCard = deleteCard(tempResidualCard,tempCardDatas)
                var tempArr1 = clone(tempResidualCard)
                tempResidualCard = deleteCard(tempResidualCard, duiziData);
                var cards = getDifferArray(tempResidualCard, 3, -1);
                if (cards.length < 3)//存在一种情况，除了尾道剩下的都是对子，此时把所有对子删除之后，中道手牌将不够5张，此时就只能拆开对子做单牌
                {
                    tempResidualCard = tempArr1;
                    cards = getDifferArray(tempResidualCard, 3, -1);
                }
                for(var i = 0;i<cards.length;i++)
                {
                    tempCardDatas[tempCardDatas.length] = cards[i]
                }
                tempResidualCard = deleteCard(tempResidualCard,cards)

                nowLevel = 1
            }
            else
            {
                var array = clone(tempResidualCard)
                sortWithNum(array)
                for(var i =0;i<5;i++)
                {
                    tempCardDatas[tempCardDatas.length] = array[i]
                } 
                nowLevel = 0
            }
            if(level == 1)type.tail.cardDatas = tempCardDatas
            else if(level == 2)type.center.cardDatas = tempCardDatas
            else if(level == 3)type.tail.cardDatas = tempCardDatas

            return nowLevel
        }

        var type = {
            'head':{cardDatas:null, type:0},
            'center':{cardDatas:null, type:0},
            'tail':{cardDatas:null, type:0},
        }
        var tempResidualCard = cardDatas

        playNode.getType(playNode.sortWithNum(tempResidualCard))
        type.tail.type = getLevelDatas(tempResidualCard,3,level)
        tempResidualCard = deleteCard(tempResidualCard,type.tail.cardDatas)

        var minLevel = centerLevel<type.tail.type?centerLevel:type.tail.type
        playNode.getType(playNode.sortWithNum(tempResidualCard))
        type.center.type = getLevelDatas(tempResidualCard,2,minLevel)
        tempResidualCard = deleteCard(tempResidualCard,type.center.cardDatas)

        type.head.cardDatas = tempResidualCard

        return type
    },
    getType:function(sortedCardDatas)
    {
        playNode.duiziArray = []
        playNode.santiaoArray = []
        playNode.shunziArray = []
        playNode.tonghuaArray = []
        playNode.sizhangArray = []
        playNode.tonghuashunArray = []

        var array = gameLogic.analyseCardDatas(sortedCardDatas)
        playNode.duiziArray = array[0]
        playNode.santiaoArray = array[1]
        playNode.shunziArray = array[2]
        playNode.tonghuaArray = array[3]
        playNode.sizhangArray = array[4]
        playNode.tonghuashunArray = array[5]
        
        for(var i =0;i<playNode.sizhangArray.length;i++)
        {
            var sizhang = clone(playNode.sizhangArray[i])
            playNode.santiaoArray[playNode.santiaoArray.length] = sizhang.slice(0,3)
        } 

        //检查是否铁支
        if(playNode.sizhangArray.length>0)
        {
            playNode.tiezhi.setEnabled(true);
        }
    
        //检查是否葫芦
        if((playNode.santiaoArray.length>0 && playNode.duiziArray.length>0)||playNode.santiaoArray.length>1)
        {
            playNode.hulu.setEnabled(true);
        }
    
        //同花 顺子
        if(playNode.tonghuashunArray.length>0)
        {
            playNode.tonghua.setEnabled(true);
            playNode.shunzi.setEnabled(true);
            playNode.tonghuashun.setEnabled(true);
        }
        if(playNode.tonghuaArray.length>0)
        {
            playNode.tonghua.setEnabled(true);
        }
        if(playNode.shunziArray.length>0)
        {
            playNode.shunzi.setEnabled(true);
        }
    
        //三条
        if(playNode.santiaoArray.length>0)
        {
            playNode.santiao.setEnabled(true);
            playNode.duizi.setEnabled(true);
        }
    
        //两对
        if(playNode.duiziArray.length>1 || (playNode.santiaoArray.length>0 && playNode.duiziArray.length>0))
        {
            playNode.liangdui.setEnabled(true);
        }
        if(playNode.duiziArray.length>0)
        {
            playNode.duizi.setEnabled(true);
        }
        //return { level:level_wulong, score:gameLogic.getScore(level_wulong, sortedCardDatas) }
    },
    sortWithNum:function(cardDatas)
    {
        cardDatas.sort(function(a,b)
        {   
            if(cardLogic.getNum(a) == cardLogic.getNum(b))
             return a - b
            else
                return cardLogic.getNum(a) - cardLogic.getNum(b)
        })

        return cardDatas
    },
    getHandType:function()
    {
        playNode.duizi.setVisible(true);
        playNode.liangdui.setVisible(true);
        playNode.santiao.setVisible(true);
        playNode.shunzi.setVisible(true);
        playNode.tonghua.setVisible(true);
        playNode.hulu.setVisible(true);
        playNode.tiezhi.setVisible(true);
        playNode.tonghuashun.setVisible(true);

        playNode.duizi.setEnabled(false);
        playNode.liangdui.setEnabled(false);
        playNode.santiao.setEnabled(false);
        playNode.shunzi.setEnabled(false);
        playNode.tonghua.setEnabled(false);
        playNode.hulu.setEnabled(false);
        playNode.tiezhi.setEnabled(false);
        playNode.tonghuashun.setEnabled(false);

        //playNode.chooseTypeControl.bg.getChildByTag(888).setVisible(false);


        playNode.getType(playNode.sortWithNum(playNode.residualCard))
    },
}
popTips = function(tips, leftbtnIdx, rightbtnIdx)
{
    function getObjWithidx(idx)
    {
        switch(idx)
        {
            case 1:
            {
                var str = '重新连接'
                var call = function()
                {   
                    goHref(appendRefreshtime(window.location.href))
                } 
                break
            }
            case 2:
            {
                var str = '进入大厅'
                var call = function()
                {
                    goHref(appendRefreshtime(hallAddress))
                }
                break
            }
            case 3:
            {
                var str = '查看战绩'
                var call = function()
                {   
                    goHref(appendRefreshtime(resultAddress))
                }

                break
            }
            case 4:
            {
                var str = '去充值'
                var call = function()
                {   
                    goHref(appendRefreshtime(rechargeAddress))
                }

                break
            }
        }

        return {str:str, call:call}
    }

    var cancleCall = null
    // var cancleCall = function(){}
    var func = function()
    {
        if(rightbtnIdx)
        {
            var left = getObjWithidx(leftbtnIdx)
            var right = getObjWithidx(rightbtnIdx)
    
            var call1 = function()
            {   
                node.removeFromParent()
                left.call()
            }
            var call2 = function()
            {   
                node.removeFromParent()
                right.call()
            }
    
            var pop = popBox.getOneTwoBtn(call1, call2, cancleCall)
            var node = pop[0]
            var control = pop[1]
            control.mainLabel.setString( tips )
            control.leftBtnLabel.setString( left.str )
            control.rightBtnLabel.setString( right.str )
        }
        else
        {   
            var left = getObjWithidx(leftbtnIdx)
            var call = function()
            {   
                node.removeFromParent()
                left.call()
            }
            var pop = popBox.getOneSingleBtn(call, cancleCall)
            var node = pop[0]
            var control = pop[1]
            control.mainLabel.setString( tips )
            control.btnLabel.setString( left.str )
        }
    
        if(hasEnterMainScene)
        {   
            node.setPosition( cc.p( uiController.sysTips.getContentSize().width * 0.5, uiController.sysTips.getContentSize().height * 0.6) )
            uiController.sysTips.addChild(node) 
        }
        else
        {   
            var scene = cc.director.getRunningScene()
            node.setPosition( cc.p( scene.getContentSize().width * 0.5, scene.getContentSize().height * 0.6) )
            scene.addChild(node)
        }
    }
    if(leftbtnIdx == 2 && rightbtnIdx == 3)
    {
        cocos.setTimeout(
            function()
            {
                func()
            }, 
            playActionTime)
    }
    else
       func() 
}