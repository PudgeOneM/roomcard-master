var ZORDER_MAX = 100;  
var ZORDER_OPERATE_SECELT = 99;  
var ZORDER_OPERATE_BTN = 98;  
var SCALE_H_NO_MOBILE = 1;

var topUI = {
    init:function()
    {     
          var node  = managerRes.loadCCB(resp.topUICCB, this );
          topUI.node = node;
          
          newsSide.init(topUI.sideBoxNode)
          topUI.newsNode.addChild( newsSide.newsBtnNode )
          topUI.newsNode.x+=50;
          /////reportSide
          reportSide.reportType = 2
          reportSide.init(topUI.sideBoxNode)
          topUI.reportNode.addChild( reportSide.reportSideBtn )
          topUI.reportNode.x+=50;
          /////menuSide
          userSettingPop.itemShowState = [true, true, false]
          menuSide.init(topUI.sideBoxNode, [1,5,6,7,8])
          topUI.menuNode.addChild( menuSide.menuSideBtn )
                    //IP
          var location = locationPop.getButton();
          topUI.locationNode.addChild(location);
          //麦克风节点
          var isInTable = tableData.isInTable(self.cbUserStatus); 
          wxVoiceNode.init(topUI.voicePlayNode);
          topUI.voiceNode.addChild(wxVoiceNode.voiceNode);
          //topUI.voiceNode.setVisible( selfdwUserID == tableData.createrUserID || isInTable);
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
          
          //表情节点
          var faceIds = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18]
          topUI.emoji.addChild(facePop.getFaceButton(faceIds, 6, 3));  
          topUI.emoji.visible = false;

          if(!cc.sys.isMobile)
          {
              if (topUI.node.height < 640)
              {
                  SCALE_H_NO_MOBILE = topUI.node.height/640;
              }
          }
    },
};
var mainScene = {
	runThisScene:function()
	{
  		mainScene.scene = new cc.Scene();

      //mainNodeCCB
      mainScene.initmainNodeCCB();

      //tableCCB
      mainScene.inittableCCB();

      //topUICCp
      mainScene.inittopUICCB();

      //uiPlay
      mainScene.initUiPlayCCB();

      //事件回调 或者监听
      mainScene.addEventListener();

      //运行mainScene
      cc.director.runScene(mainScene.scene);
	},
  initmainNodeCCB:function()
  {
      if(cc.sys.isMobile)
      {
          mainScene.node = mainNode.getNode(2, this)
          mainScene.ctPosX = cc.director.getVisibleSize().height/2;
          mainScene.ctPosY = cc.director.getVisibleSize().width/2;
      }
      else
      {
          mainScene.node = mainNode.getNode(3, this)
          mainScene.ctPosX = cc.director.getVisibleSize().width/2;
          mainScene.ctPosY = cc.director.getVisibleSize().height/2;
      }

      mainScene.scene.addChild(mainScene.node);
  },
  inittableCCB:function()
  {
      tableNode.gmCall = function()
      {
           // gameGM.create();
           // sendLogToServer(gameLog.logS + 'wtmszhudongwtms')
           // showTipsTTF({str:'网络异常'})
           // var event = new cc.EventCustom("reStart")
           // cc.eventManager.dispatchEvent(event)
      }
      
      tableNode.init(resp.tableCCB);
      mainScene.uiTable.addChild(tableNode.node);
      tableNode.tableID.setString( cc.formatStr(tableKey) );
      tableNode.btnGM.visible = false;
      tableNode.spriteLaizi1.visible=false
      tableNode.spriteLaizi2.visible=false

      tableNode["spriteLaizi"+0]=tableNode.spriteLaizi1;
      tableNode["spriteLaizi"+1]=tableNode.spriteLaizi2;
      tableNode["laizipiNode"+0]=tableNode.laizipiNode1;
      tableNode["laizipiNode"+1]=tableNode.laizipiNode2;
  },
  initUiPlayCCB:function()
  {
      //mainSceneEnter 事件回调
      var l = cc.EventListener.create({
          event: cc.EventListener.CUSTOM,
          eventName: "mainSceneEntered",
          callback: function(event)
          {   
              //剩余牌数节点
              mainScene.leftNum = new ccui.TextAtlas();
              mainScene.leftNum.setProperty("91", resp.clockNum, 18, 25, "0");
              mainScene.leftNum.setAnchorPoint(cc.p(0.5,0.5));
              mainScene.leftNum.visible = false;
              tableNode.leftCardNode.addChild(mainScene.leftNum);

              //游戏内容
               
              otherMahJong.init(mainScene.uiPlay);    //初始化其他玩家牌背
              otherMahJong.setCardData(false);
              weaveControl.init(mainScene.uiPlay);    //初始化吃碰杠牌堆

              handMahJong.init(mainScene.uiPlay);     //初始化手牌
              disCardControl.init(mainScene.uiPlay);  //初始化打出去的牌堆
              
              outMahJong.init(mainScene.uiPlay);      //初始化打出去的那张牌
              operateBtn.init(mainScene.uiPlay);      //初始化吃碰杠胡过操作按钮
              selectGang.init(mainScene.uiPlay);      //初始化多项选择 杠
              selectChi.init(mainScene.uiPlay);       //初始化多项选择 吃
              gameClock.init();       //初始化计时器
              operateAmt.init(mainScene.uiPlay);      //初始化吃碰杠胡自摸点炮动画管理器
              buHua.init();
              huaCardControl.init(mainScene.uiPlay);  //初始化花牌牌堆
          }
      })
      cc.eventManager.addListener(l, 1);
  },
  inittopUICCB:function()
  {
      mainScene.initCallBack();
      topUI.init();
      mainScene.uiTopUI.addChild(topUI.node);


      
  },
  addEventListener:function()
  {
      //游戏时间
      tableNode.registerCloseClock(tableNode.gameTime);
      var l = cc.EventListener.create({
          event: cc.EventListener.CUSTOM,
          eventName: "isOpenUpdate",
          callback: function(event)
          {   
              mainScene.scene.unschedule(mainScene.updateTableUser);
              tableNode.remainOpenTimeTTF2.setVisible( !tableData.bIsOpened )
              tableNode.roundTime.setString(tableData.wRoundTime/60);
              tableNode.roundTimeNode.visible = !tableData.bIsOpened;
          }
      })
      cc.eventManager.addListener(l, 1)

      //更新房主
      if(tableNode.roomOwnerTTF)
      {
          var l = cc.EventListener.create({
              event: cc.EventListener.CUSTOM,
              eventName: "managerUserUpdate",
              callback: function(event)
              {   
                  var managerUser = tableData.getUserWithUserId(tableData.managerUserID)
                  var name = managerUser?managerUser.szNickName:'无'
                  tableNode.roomOwnerTTF.setString( cc.formatStr('房主:%s', name) ) 
              }
          })
          cc.eventManager.addListener(l, 1)
      }

      //添加坐下回调  显示麦克风
      var l = cc.EventListener.create({
          event: cc.EventListener.CUSTOM,
          eventName: "isSelfSitChair",
          callback: function(event)
          {   
              topUI.emoji.setVisible( event.getUserData() )
              //topUI.voiceNode.setVisible(selfdwUserID == tableData.createrUserID || event.getUserData())
              if(tableData.getUserWithUserId(selfdwUserID).cbUserStatus == US_SIT)
              {
                  socket.sendMessage(MDM_GF_FRAME, SUB_GF_USER_READY)
              }
          }
      })
      cc.eventManager.addListener(l, 1);

      //点击桌面 麻将落下
      mainScene.listener = mainScene.getListener();
      cc.eventManager.addListener(mainScene.listener, mainScene.scene);
  },
  gameSetInfo:function(data)
  {
      mainScene._cbRule = data.cbRule;
      tableNode.labelRule.visible = true;
      tableNode.cellScore.setString(data.lCellScore);
      if(mainScene._cbRule&RULE_ONLY_ZIMO)
        tableNode.labelRule.setString("规则:只能自摸");
      else  if(mainScene._cbRule&RULE_CAN_DIAN_PAO)
        tableNode.labelRule.setString("规则:允许点炮");

      //if(tableData.managerUserID == selfdwUserID && mainScene._cbRule == RULE_NULL)
        //topUI.nodeHuType.visible = true
      //else 
        //topUI.nodeHuType.visible = false

      tableNode.labelZhuaMa.visible = true;
      tableNode.labelZhuaMa.setString("抓码:"+data.cbZhuaMaCount);
      mainScene._isReady = true;

      if(mainScene._cbRule == RULE_NULL)
          topUI.nodeHuType.visible = true;
        else topUI.nodeHuType.visible = false;
      
  },
  initCallBack:function()
  {

      topUI.callOnlyZimo= function()
      {
         topUI.nodeHuType.visible=false;
         var operateMsg = getObjWithStructName('CMD_C_RuleSet');
         operateMsg.cbRule = RULE_ONLY_ZIMO;
         socket.sendMessage(MDM_GF_GAME, SUB_C_RULE_SET, operateMsg); 

         topUI.nodeZhuaMa.visible=true
      }

      topUI.callCanDianPao= function()
      {
          topUI.nodeHuType.visible=false;
          var operateMsg = getObjWithStructName('CMD_C_RuleSet');
          operateMsg.cbRule = RULE_CAN_DIAN_PAO;
          socket.sendMessage(MDM_GF_GAME, SUB_C_RULE_SET, operateMsg); 
          topUI.nodeZhuaMa.visible=true
      }

      topUI.callRenSu = function()
      {
          topUI.buttonRenSu.visible = false;

          var operateMsg = getObjWithStructName('CMD_C_LIUJU');
          operateMsg.bLiuJu = true;
          socket.sendMessage(MDM_GF_GAME, SUB_C_LIUJU, operateMsg); 
      }

      topUI.callZhuaMa0 = function()
      {
          topUI.nodeZhuaMa.visible=false
          var operateMsg = getObjWithStructName('CMD_C_ZhuaMa');
          operateMsg.cbZhuaMaCount = 0;
          socket.sendMessage(MDM_GF_GAME, SUB_C_ZHUA_MA, operateMsg); 

      }

      topUI.callZhuaMa2 = function()
      {
          topUI.nodeZhuaMa.visible=false
          var operateMsg = getObjWithStructName('CMD_C_ZhuaMa');
          operateMsg.cbZhuaMaCount = 2;
          socket.sendMessage(MDM_GF_GAME, SUB_C_ZHUA_MA, operateMsg); 
      }

      topUI.callZhuaMa4 = function()
      {
          topUI.nodeZhuaMa.visible=false
          var operateMsg = getObjWithStructName('CMD_C_ZhuaMa');
          operateMsg.cbZhuaMaCount = 4;
          socket.sendMessage(MDM_GF_GAME, SUB_C_ZHUA_MA, operateMsg); 
      }

      topUI.callZhuaMa6 = function()
      {
          topUI.nodeZhuaMa.visible=false
          var operateMsg = getObjWithStructName('CMD_C_ZhuaMa');
          operateMsg.cbZhuaMaCount = 6;
          socket.sendMessage(MDM_GF_GAME, SUB_C_ZHUA_MA, operateMsg); 
      }
      
  },
  reset:function()
  {
      gameEnd.clearGameData();
      tableMahJong.clearCardData();
      handMahJong.clearCardData();
      handMahJong.init(mainScene.uiPlay);     //初始化手牌
  },
	getListener:function()
  {   
      var listener = cc.EventListener.create({
          event: cc.EventListener.TOUCH_ONE_BY_ONE,
          swallowTouches: true,
         onTouchBegan: function (touch, event) {
              var localPos = touch.getLocation();
              if (localPos.x < cc.director.getVisibleSize().width - 100) 
              {
              	return true;
              }
              return false;
          },
          onTouchEnded: function (touch, event) {
              handMahJong.setControlPos(INVALID_NINDEX);
          }
      })
      return listener;
  },
  sortHandCard:function(cbCardData)
  {
      var sortBP = function(cbCardData)
      {
        var cbIndex = gameLogic.switchToCardIndex(cbCardData);
        if (cbIndex == mainScene._cbMagicIndex)
        {
          return cbCardData-200;
        }
        else if (cbCardData == 0)
        {
          return cbCardData-300;
        }
        return cbCardData;
      };
      cbCardData.sort(function(a, b) {return sortBP(b)-sortBP(a)});

  },
  //断线重连
  onEventScenePlay:function(data)
  {
      mainScene._isReady = false;
      tableNode.roomOwnerTTF.visible = false;
      mainScene.reset();
      tableNode.shareButton.setVisible(false);
      mainScene.scene.unschedule(mainScene.updateTableUser);
      mainScene._cbRule           = 0;
      mainScene._cbTokenCard     = data.cbSendCardData;
      mainScene._cbCellScore     = data.lCellScore;
      mainScene._wMeChaird       = gameLogic.getMeChaird();
      mainScene._wBankerUser     = data.wBankerUser;
      mainScene._wCurrentUser    = data.wCurrentUser;
      mainScene._cbActionCard    = data.cbActionCard;
      mainScene._cbActionMask    = data.cbActionMask;
      mainScene._cbLeftCardCount = data.cbLeftCardCount;
      mainScene._wOutCardUser    = data.wOutCardUser;
      mainScene._cbOutCardData   = data.cbOutCardData;
      mainScene._cbCardData      = [];
      mainScene._cbCardData      = data.cbCardData;
      mainScene._cbSendCardData  = data.cbSendCardData;
      mainScene._cbMagicIndex    = data.cbMagicIndex;
      mainScene._szNickName      = ["","","",""];
      mainScene._bOutCard        = false;
      mainScene._cbHuaCardData    = [];
      //if(data.bLaoZhuang)
      //{
          //tableNode.labelFanBei.visible = true;
      //}
      //else tableNode.labelFanBei.visible = false;

      topUI.nodeHuType.visible = false
      for (var i = 0; i < GAME_PLAYER; i++) {
          mainScene._szNickName[i] = tableData.getUserWithChairId(i).szNickName;
          //设置花数
          buHua.updateBuHua(i, data.cbHuaCount[i]);
          mainScene._cbHuaCardData[i] = [];
          for (var k = 0; k < 87; k++) {
            mainScene._cbHuaCardData[i][k] = 0;
          };
      };

      //设置庄家
      mainScene.setBankerIcon(mainScene._wBankerUser,true);
      //设置表情  麦克风
      if(mainScene._wMeChaird == INVALID_CHAIR)
      {
          if(selfdwUserID == tableData.createrUserID)
          {
              topUI.emoji.visible = true;
              //topUI.voiceNode.setVisible(true);
          }
      }
      else
      {
          topUI.emoji.visible = true;
          //topUI.voiceNode.setVisible(true);
      }


      //设置底分
      tableNode.cellScore.setString(mainScene._cbCellScore);
      //设置计时器根据庄家旋转角度
      gameClock.setClockInfo();
      //设置计时器
      gameClock.setGameClock(mainScene._wCurrentUser);
      //设置剩余牌数
      tableNode.leftCardBg.visible = true;
      mainScene.leftNum.visible = true;
      mainScene.leftNum.setString(mainScene._cbLeftCardCount);

      //设置弃牌牌堆
      for (var i = 0; i < GAME_PLAYER; i++) {
          for (var k = 0; k < data.cbDiscardCount[i]; k++) {
              disCardControl.addCardItem(gameLogic.switchViewChairID(i), data.cbDiscardCard[i][k]);
          };
      };
      
      //设置本地玩家手牌
      mainScene.sortHandCard(mainScene._cbCardData);

      //牌的位置替换,摸到的牌，显示在最右侧
      if(mainScene._wCurrentUser == mainScene._wMeChaird )
      {
          for(var i=0;i< data.cbCardCount;i++)
          {
              if(mainScene._cbTokenCard== mainScene._cbCardData[i])
              {
                  var card = mainScene._cbCardData[0];
                  mainScene._cbCardData[0] = mainScene._cbCardData[i];
                  mainScene._cbCardData[i] = card;
                  break;
              }
          }
      }

      if (mainScene._wCurrentUser == mainScene._wMeChaird || (mainScene._wCurrentUser == 0 && mainScene._wMeChaird == INVALID_CHAIR) || data.bHaiDiLaoYue)
      {
          if (data.cbSendCardData > 0) 
            handMahJong.setCardData(mainScene._cbCardData, data.cbCardCount, true);
          else if(data.cbCardCount == MAX_COUNT)
            handMahJong.setCardData(mainScene._cbCardData, data.cbCardCount, true);
          else
            handMahJong.setCardData(mainScene._cbCardData, data.cbCardCount, false);
      }
      else
          handMahJong.setCardData(mainScene._cbCardData, data.cbCardCount, false);

      if(mainScene._wCurrentUser != mainScene._wMeChaird)
      {
          handMahJong.setCardEnable(false); 
      }
      else
      {
          handMahJong.setCardEnable(true,mainScene._cbTokenCard); 
      }
      
      //设置其他玩家牌背
      var chaird1 = 0;
      var chaird2 = 0;
      var chaird3 = 0;
      if(mainScene._wMeChaird == INVALID_CHAIR)
      {
          chaird1 = (0+1)%GAME_PLAYER;
          chaird2 = (0+2)%GAME_PLAYER;
          chaird3 = (0+3)%GAME_PLAYER;
      }
      else
      {
          chaird1 = (mainScene._wMeChaird+1)%GAME_PLAYER;
          chaird2 = (mainScene._wMeChaird+2)%GAME_PLAYER;
          chaird3 = (mainScene._wMeChaird+3)%GAME_PLAYER;
      }
      otherMahJong.setCardData(true);
      otherMahJong.removeCard(1, data.cbWeaveCount[chaird1]*3);
      otherMahJong.removeCard(2, data.cbWeaveCount[chaird2]*3);
      otherMahJong.removeCard(3, data.cbWeaveCount[chaird3]*3);

      //设置吃碰杠牌堆
      for (var i = 0; i < GAME_PLAYER; i++) {
          var wViewChairID = gameLogic.switchViewChairID(i);
          weaveControl.cbWeaveArray[wViewChairID] = data.WeaveItemArray[i];
          for (var k = 0; k < data.cbWeaveCount[i]; k++) {
              weaveControl.setCardData(wViewChairID, k);
          };
      };

      //设置发送牌
      if (data.bHaiDiLaoYue)
      {
          mainScene._wCurrentUser = INVALID_CHAIR;
      }
      if (mainScene._wCurrentUser != INVALID_CHAIR)
      {
          if (mainScene._wCurrentUser == mainScene._wMeChaird || (mainScene._wCurrentUser == 0 && mainScene._wMeChaird == INVALID_CHAIR))
          {
              //当前出牌用户自检是否有花 有则补花
              if (!mainScene.checkBuHua()) 
              {
                  handMahJong.setCardEnable(true);
                  //设置吃碰杠操作
                  operateBtn.setOperateInfo(mainScene._cbActionMask);
              }
          }
          else
          {
              otherMahJong.sendCardData(gameLogic.switchViewChairID(mainScene._wCurrentUser), true);
          }
      }
      else
      {
          
          outMahJong.showOutCard(gameLogic.switchViewChairID(mainScene._wOutCardUser), mainScene._cbOutCardData);
          //设置操作管理器
          operateBtn.setOperateInfo(mainScene._cbActionMask);
      }
      //当前出牌用户自检是否有花 有则补花
      if (mainScene.checkBuHua()) 
      {
        handMahJong.setCardEnable(false);
        mainScene.scene.scheduleOnce(mainScene.onUserBuHua, 0.5);
      }
      //隐藏弃牌上的箭头
      disCardControl.hideOutPointer();

      for (var i = 0; i < GAME_PLAYER; i++) {
          //设置花牌牌堆
          for (var k = 0; k < 40; k++) {
              if (data.cbHuaCardData[i][k] > 0)
              {
                mainScene._cbHuaCardData[i][data.cbHuaCardData[i][k]]++;
                huaCardControl.addCardItem(gameLogic.switchViewChairID(i), data.cbHuaCardData[i][k]);
              }
          };
      };


      if(mainScene._wBankerUser != mainScene._wMeChaird)//还在游戏中，隐藏开始等按钮
      {
          tableNode.startNode.setVisible(false);
          tableNode.roomOwnerTTF.setVisible(false);
          tableNode.remainOpenTimeTTF2.setVisible(false);
          tableNode.remainOpenTimeTTF.setVisible(false);
          tableNode.waitStartTTF.setVisible(false);
      }

      mainScene._cbRule = data.cbRule;
      if(data.cbRule&RULE_ONLY_ZIMO)
      {
        tableNode.labelRule.visible = true;
        tableNode.labelRule.setString("规则:只能自摸");
      }
      else  if(data.cbRule&RULE_CAN_DIAN_PAO)
      {
        tableNode.labelRule.visible = true;
        tableNode.labelRule.setString("规则:允许点炮");
      }

      tableNode.labelZhuaMa.visible = true;
      tableNode.labelZhuaMa.setString("抓码:"+data.cbZhuaMaCount);

  },
  //游戏开始
	onSubGameStart:function(data)
	{
      mainScene._isReady = false;
      //如果旁观用户没关闭结算框   程序主动给他关闭
      if(mainScene._wMeChaird == INVALID_CHAIR)
      {
        if(gameEnd.node)
        {
          if(gameEnd.node._parent)
          {
            gameEnd.node.visible = false;
            gameEnd.node.removeFromParent();
          }
        }
      }
      tableNode.roomOwnerTTF.visible = false
      topUI.nodeHuType.visible = false
      gameEnd.clearGameData();
      tableMahJong.clearCardData();

      buHua.hideBuHua()

      handMahJong.cbMagicCard=[]
      handMahJong.cbMagicCard[0]=0;
      handMahJong.cbMagicCard[1]=0;

      mainScene._cbTokenCard      = 0;//本家最近摸的牌
      mainScene._bIsListened      = false; //本家是否已听牌的标志
      mainScene._wMeChaird        = gameLogic.getMeChaird();
  		mainScene._wBankerUser      = data.wBankerUser;
  		mainScene._wCurrentUser     = data.wBankerUser;
  		mainScene._cbLeftCardCount  = data.cbLeftCardCount;
      mainScene._cbCardData       = [];
      mainScene._cbCardData       = data.cbCardData;
      mainScene._cbActionMask     = data.cbUserAction;
      mainScene._cbMagicIndex     = data.cbMagicIndex;
      mainScene._szNickName       = ["","","",""];
      mainScene._bMustBuHua       = data.bMustBuHua;
      mainScene._cbSice1          = data.cbSice1;
      mainScene._cbSice2          = data.cbSice2;
      mainScene._bOutCard         = false;
      mainScene._cbHuaCardData    = [];
      //if(data.bLaoZhuang)
      //{
          //tableNode.labelFanBei.visible = true
      //}
      //else tableNode.labelFanBei.visible = false

      topUI.nodeHuType.visible = false;


      for (var i = 0; i < GAME_PLAYER; i++) {
          mainScene._szNickName[i] = tableData.getUserWithChairId(i).szNickName;
          mainScene._cbHuaCardData[i]   = [];
          for (var k = 0; k < 87; k++) {
            mainScene._cbHuaCardData[i][k] = 0;
          };
      };
      //设置庄家
      for (var i = 0; i < GAME_PLAYER; i++) {
          mainScene.setBankerIcon(i,false);
      }
      mainScene.setBankerIcon(mainScene._wBankerUser,true);

      mainScene.sortHandCard(mainScene._cbCardData);

      mainScene.scene.scheduleOnce(mainScene.delayLoadCard,0.1);
      //设置计时器背景方向
      gameClock.setClockInfo();
      //播放骰子音效
      managerAudio.playEffect('gameRes/sound/dice.wav');
  		//播放骰子动画
      var spr = actionFactory.getSprWithAnimate('shaizi_anmi', true, 0.1, function()
      {   
         mainScene.sice1 = new cc.Sprite("#SiceOne_" + mainScene._cbSice1 + '.png');
         mainScene.sice2 = new cc.Sprite("#SiceTwo_" + mainScene._cbSice2 + '.png');
         mainScene.sice1.setPosition( cc.p( mainScene.ctPosX-75, mainScene.ctPosY) );
         mainScene.sice2.setPosition( cc.p( mainScene.ctPosX+75, mainScene.ctPosY) );
         mainScene.uiPlay.addChild(mainScene.sice1); 
         mainScene.uiPlay.addChild(mainScene.sice2); 
         
      })
      spr.setPosition( cc.p( mainScene.ctPosX, mainScene.ctPosY) );
      mainScene.uiPlay.addChild(spr); 

      mainScene.scene.scheduleOnce(mainScene.setUserMahJong, 2.5);

      mainScene._cbRule = data.cbRule;
     if(data.cbRule&RULE_ONLY_ZIMO)
      {
        tableNode.labelRule.visible = true;
        tableNode.labelRule.setString("规则:只能自摸");
      }
      else  if(data.cbRule&RULE_CAN_DIAN_PAO)
      {
        tableNode.labelRule.visible = true;
        tableNode.labelRule.setString("规则:允许点炮");
      }

      tableNode.labelZhuaMa.visible = true;
      tableNode.labelZhuaMa.setString("抓码:"+data.cbZhuaMaCount);

      return true;
	},
  delayLoadCard:function()
  {
      //显示其他三家玩家牌背
      otherMahJong.setCardData(true);
      if (mainScene._wCurrentUser == mainScene._wMeChaird || (mainScene._wMeChaird == INVALID_CHAIR && mainScene._wCurrentUser == 0))
      {
          //设置本地玩家手牌
          handMahJong.setCardData(mainScene._cbCardData, MAX_COUNT, true);
      }
      else
      {
          //设置本地玩家手牌
          handMahJong.setCardData(mainScene._cbCardData, MAX_COUNT-1, false);
          //设置本地玩家手牌不可点击
          handMahJong.setCardEnable(false); 
          //显示庄家发牌牌背
          otherMahJong.sendCardData(gameLogic.switchViewChairID(mainScene._wBankerUser), true);
      }

      otherMahJong.node.setVisible(false);
      handMahJong.node.setVisible(false);
  },
  //补花 多张
  onSubReplaceCard:function(data)
  {
      //播放补花音效
      managerAudio.playEffect('gameRes/sound/action_buflower.wav');
      //把花牌当做弃牌显示
      var nBuHuaNum = 0;
      for (var i = 0; i < MAX_COUNT; i++) {
        if (data.cbHuaCard[i] > 0)
        {
          huaCardControl.addCardItem(gameLogic.switchViewChairID(data.wReplaceUser), data.cbHuaCard[i]);
          nBuHuaNum++;
          mainScene._cbHuaCardData[data.wReplaceUser][data.cbHuaCard[i]]++;
          
        }
      };
      buHua.updateBuHua(data.wReplaceUser, nBuHuaNum);
      //设置剩余牌数
      mainScene._cbLeftCardCount = mainScene._cbLeftCardCount-nBuHuaNum;
      mainScene.leftNum.setString(mainScene._cbLeftCardCount);

      //替换补花麻将
      if (data.wReplaceUser == mainScene._wMeChaird) 
      {
          handMahJong.setHuaCardData(data.cbHuaCard, data.cbReplaceCard);

          //handMahJong.handDataExcEx('补花');
          //当前出牌用户自检是否有花 有则补花
          if (mainScene.checkBuHua()) 
          {
            handMahJong.setCardEnable(false);
            mainScene.scene.scheduleOnce(mainScene.onUserBuHua, 0.5);
          }
          else
          {
              if (mainScene._bOutCard == false)
              {
                  if (mainScene._wMeChaird == mainScene._wCurrentUser)
                  {
                    mainScene.sortHandCard(handMahJong.cbCardData);
                    handMahJong.setCardData(handMahJong.cbCardData, handMahJong.cbCardCount, true);
                  }
                  else
                  {
                    mainScene.sortHandCard(handMahJong.cbCardData);
                    handMahJong.setCardData(handMahJong.cbCardData, handMahJong.cbCardCount, false);
                  }
              }
          }
          mainScene._cbActionMask = data.cbUserAction;
      }
      handMahJong.setCardEnable(false);
      if (data.bBuHuaUser == false)
      {
          if (mainScene._wMeChaird == mainScene._wCurrentUser)
          {
             handMahJong.setCardEnable(true);
             operateBtn.setOperateInfo(mainScene._cbActionMask);
          }
      }
      //重置补花玩家计时器
      gameClock.setGameClock(mainScene._wCurrentUser);
      //隐藏弃牌上的箭头
      disCardControl.hideOutPointer();
      return true;
  },

  //有玩家出牌
  onSubOutCard:function(data)
  {
      mainScene._bOutCard = true;
      operateBtn.hideOperate();
      mainScene._cbActionMask = WIK_NULL;
      mainScene._cbActionCard = 0;
      //接收出牌数据
      mainScene._wOutCardUser = data.wOutCardUser;
      mainScene._cbOutCardData = data.cbOutCardData;

      if(mainScene._wOutCardUser == mainScene._wMeChaird)
      {
          //服务器下发，才隐藏手牌
          for (var i = 0; i < handMahJong.cbCardCount; i++) {
              if (handMahJong.cbCardData[i] == mainScene._cbOutCardData)
              {
                handMahJong.cbCardData[i] = 0;
                handMahJong.cbCardCount--;
                break;
              }
          };
          mainScene.sortHandCard(handMahJong.cbCardData);
          handMahJong.setCardData(handMahJong.cbCardData, handMahJong.cbCardCount, false);
          handMahJong.setCardEnable(false);
      }


      //显示打出的牌
      var wViewChairID = gameLogic.switchViewChairID(mainScene._wOutCardUser);
      outMahJong.showOutCard(wViewChairID, mainScene._cbOutCardData);
      if(mainScene._wOutCardUser == 0 && mainScene._wMeChaird == INVALID_CHAIR)
      {
        var cbCardData = [];
        handMahJong.setCardData(cbCardData, handMahJong.cbCardCount-1, false);
      }
      else if (mainScene._wOutCardUser != mainScene._wMeChaird) 
      {
        otherMahJong.sendCardData(wViewChairID, false);

      }
      //出牌音效
      var outUser = tableData.getUserWithChairId(mainScene._wOutCardUser);
      if (outUser.cbGender)
        managerAudio.playEffect('gameRes/sound/man/cardData'+mainScene._cbOutCardData+'.mp3');
      else
        managerAudio.playEffect('gameRes/sound/woman/cardData'+mainScene._cbOutCardData+'.mp3');

      return true;
  },
  //发牌
  onSubSendCard:function(data)
  {
      //发牌延时0.5秒
      mainScene.onSendData = data;

      operateBtn.hideOperate();
      mainScene._cbActionMask = WIK_NULL;
      mainScene._cbActionCard = 0;
      //设置剩余牌数
      mainScene._cbLeftCardCount--;
      mainScene.leftNum.setString(mainScene._cbLeftCardCount);
      //丢弃牌堆添加
      if (mainScene._wOutCardUser != INVALID_CHAIR)
      {
          disCardControl.addCardItem(gameLogic.switchViewChairID(mainScene._wOutCardUser), mainScene._cbOutCardData);
      }
      //隐藏出牌
      outMahJong.hideOutCard();
      mainScene.scene.scheduleOnce(mainScene.onSubSendCardEx, 0.5);
  },
  //发牌
  onSubSendCardEx:function()
  {
      //发牌音效
      managerAudio.playEffect('gameRes/sound/carddown.wav');
                  //设置变量
      mainScene._wCurrentUser = mainScene.onSendData.wCurrentUser;
      mainScene._cbActionMask = mainScene.onSendData.cbActionMask;
      
      //发牌
      if (mainScene.onSendData.wCurrentUser == mainScene._wMeChaird || (mainScene.onSendData.wCurrentUser == 0 && mainScene._wMeChaird == INVALID_CHAIR)) 
      {
          //设置手牌
          handMahJong.sendCardData(mainScene.onSendData.cbCardData);
          mainScene._cbTokenCard = mainScene.onSendData.cbCardData;
          //当前出牌用户自检是否有花 有则补花
          if (mainScene.checkBuHua()) 
          {
             handMahJong.setCardEnable(false);
             mainScene.scene.scheduleOnce(mainScene.onUserBuHua, 0.5);
          }
          else
          {
              handMahJong.setCardEnable(true);
              //设置吃碰杠操作
              operateBtn.setOperateInfo(mainScene._cbActionMask);
          }

      }
      else
      {
          otherMahJong.sendCardData(gameLogic.switchViewChairID(mainScene._wCurrentUser), true);
          handMahJong.setCardEnable(false);
      }

      //设置计时器
      gameClock.setGameClock(mainScene._wCurrentUser);
  },
  //有玩家操作
  onSubOperateNotify:function(data)
  {
      //设置计时器
      gameClock.setGameClock(INVALID_CHAIR);
      
      if (data.cbActionMask!=WIK_NULL && data.wOperateUser == mainScene._wMeChaird)
      {
          //获取变量
          mainScene._wCurrentUser = INVALID_CHAIR;
          mainScene._cbActionMask = data.cbActionMask;
          mainScene._cbActionCard = data.cbActionCard;

          //设置界面
          operateBtn.setOperateInfo(mainScene._cbActionMask);
      }
      
      return true;
  },
  //操作结果
  onSubOperateResult:function(pOperateResult)
  {
      //变量定义
      operateBtn.hideOperate();
      mainScene._cbActionMask = WIK_NULL;
      mainScene._cbActionCard = 0;
      var cbPublicCard=true;
      var wOperateUser=pOperateResult.wOperateUser;
      var cbOperateCard = [];
      cbOperateCard = pOperateResult.cbOperateCard;
      var wOperateViewID = gameLogic.switchViewChairID(wOperateUser);
      var wProviderViewID = gameLogic.switchViewChairID(pOperateResult.wProvideUser);
      var cbCardCount = 0;
      var bGangByPeng = false;
      //播放动画
      operateAmt.setAmtInfo(wOperateUser, pOperateResult.cbOperateCode);
      //设置变量
      mainScene._wCurrentUser = pOperateResult.wOperateUser;

      //设置组合
      if (pOperateResult.cbOperateCode&WIK_GANG)
      {
        //设置变量
        mainScene._wCurrentUser=INVALID_CHAIR;

        //组合扑克
        var cbWeaveIndex=0xFF;
        if(pOperateResult.bBuGang)
        for (var i=0;i<weaveControl.cbWeaveCount[wOperateViewID];i++) 
        {
          var cbWeaveKind=weaveControl.cbWeaveArray[wOperateViewID][i].cbWeaveKind;
          var cbCenterCard=weaveControl.cbWeaveArray[wOperateViewID][i].cbCenterCard;
          if ((cbCenterCard==cbOperateCard[0]||cbCenterCard==cbOperateCard[1]||cbCenterCard==cbOperateCard[2]||cbCenterCard==cbOperateCard[3])&&(cbWeaveKind==WIK_PENG))
          {
              bGangByPeng = true;
              cbCardCount = 1;
              cbWeaveIndex=i;
              weaveControl.cbWeaveArray[wOperateViewID][cbWeaveIndex].cbPublicCard=true;
              weaveControl.cbWeaveArray[wOperateViewID][cbWeaveIndex].cbWeaveKind=pOperateResult.cbOperateCode;
              weaveControl.cbWeaveArray[wOperateViewID][cbWeaveIndex].cbCardData= cbOperateCard;
              break;
          }
        }

        //组合扑克
        if (cbWeaveIndex==0xFF)
        {
          //暗杠判断
          cbPublicCard=(pOperateResult.wProvideUser==wOperateUser)?false:true; 
          if (cbPublicCard)
          {
            cbCardCount = 3;
          }
          else
          {
            cbCardCount = 4;
          }
          //设置扑克
          //cbWeaveIndex=weaveControl.cbWeaveCount[wOperateViewID]++;
          cbWeaveIndex=weaveControl.cbWeaveCount[wOperateViewID];
          weaveControl.cbWeaveArray[wOperateViewID][cbWeaveIndex].cbCardData = [];
          weaveControl.cbWeaveArray[wOperateViewID][cbWeaveIndex].cbPublicCard=cbPublicCard;
          weaveControl.cbWeaveArray[wOperateViewID][cbWeaveIndex].cbCenterCard=cbOperateCard[0];
          weaveControl.cbWeaveArray[wOperateViewID][cbWeaveIndex].cbWeaveKind=pOperateResult.cbOperateCode;
          weaveControl.cbWeaveArray[wOperateViewID][cbWeaveIndex].wProvideUser=pOperateResult.wProvideUser;
          weaveControl.cbWeaveArray[wOperateViewID][cbWeaveIndex].cbCardData= cbOperateCard;
        }

        //添加吃碰杠组合麻将
        weaveControl.setCardData(wOperateViewID, cbWeaveIndex);
     
        //设置扑克
        if (mainScene._wMeChaird==wOperateUser || (wOperateUser == 0 && mainScene._wMeChaird == INVALID_CHAIR))
        {
            var cbCard = [];
            if(cbCardCount==3)
            {
                cbCard[0] = cbOperateCard[1];
                cbCard[1] = cbOperateCard[2];
                cbCard[2] = cbOperateCard[3];
            }
            else  if(cbCardCount==4)
            {
                cbCard[0] = cbOperateCard[1];
                cbCard[1] = cbOperateCard[2];
                cbCard[2] = cbOperateCard[3];
                cbCard[3] = cbOperateCard[0];
            }
            else if(cbCardCount==1)
            {
                cbCard[0] = cbOperateCard[3];
            }

           handMahJong.setOperateCard(cbCard, cbCardCount);
           handMahJong.setCardEnable(false);
        }
        else
        {
          if (bGangByPeng == false) 
          {
              otherMahJong.removeCard(wOperateViewID, 3);
          } 
        }
      }
      else if (pOperateResult.cbOperateCode!=WIK_NULL)
      {
        //设置组合
        //var cbWeaveIndex=weaveControl.cbWeaveCount[wOperateViewID]++;
        var cbWeaveIndex=weaveControl.cbWeaveCount[wOperateViewID];
        weaveControl.cbWeaveArray[wOperateViewID][cbWeaveIndex].cbCardData = [];
        weaveControl.cbWeaveArray[wOperateViewID][cbWeaveIndex].cbPublicCard=true;
        weaveControl.cbWeaveArray[wOperateViewID][cbWeaveIndex].cbCenterCard=cbOperateCard[0];
        weaveControl.cbWeaveArray[wOperateViewID][cbWeaveIndex].cbWeaveKind=pOperateResult.cbOperateCode;
        weaveControl.cbWeaveArray[wOperateViewID][cbWeaveIndex].wProvideUser=pOperateResult.wProvideUser;
        weaveControl.cbWeaveArray[wOperateViewID][cbWeaveIndex].cbCardData = cbOperateCard;

        //删除扑克

        //设置扑克
        if (mainScene._wMeChaird==wOperateUser || (wOperateUser == 0 && mainScene._wMeChaird == INVALID_CHAIR))
        {
          var cbCard = [];
          cbCard[0] = cbOperateCard[1];
          cbCard[1] = cbOperateCard[2];
          handMahJong.setOperateCard(cbCard, 2);
          handMahJong.setCardEnable(true);
        }
        else
        {
          otherMahJong.removeCard(wOperateViewID, 3);
        }

        //组合界面
        var cbWeaveCard = cbOperateCard;
        var cbWeaveKind = pOperateResult.cbOperateCode;
        var cbWeaveCardCount = 3;
        //添加吃碰杠组合麻将
        weaveControl.setCardData(wOperateViewID, cbWeaveIndex);

        if (pOperateResult.cbActionMask & WIK_GANG && wOperateUser == mainScene._wMeChaird)
        {
            pOperateResult.cbOperateCode = WIK_NULL
            mainScene._wOutCardUser = wOperateUser
            mainScene._cbOutCardData = 0;
            //设置吃碰杠操作
            operateBtn.setOperateInfo(pOperateResult.cbActionMask);
        }

      }

      //隐藏出牌
      outMahJong.hideOutCard();
      if (pOperateResult.cbOperateCode!=WIK_NULL) 
      {
        mainScene._wOutCardUser = INVALID_CHAIR;
        mainScene._cbOutCardData = 0;
      }
      //设置计时器
      if (mainScene._wCurrentUser != INVALID_CHAIR)
      {
          gameClock.setGameClock(mainScene._wCurrentUser);
      }


      return true;
  },
  //游戏结束
  onsubGameEnd:function(data)
  {
      mainScene._cbActionCard = 0;
      mainScene._cbActionMask = WIK_NULL;
      operateBtn.hideOperate();
      // //摊牌
      tableMahJong.setCardData(data.cbCardData, data.cbCardCount);
      // //清空手牌
      var cbCardData = [];
      handMahJong.setCardData(cbCardData, 0, true);
      handMahJong.setCardEnable(false);
      // //清空其他玩家牌
      otherMahJong.clearCardData();

      var wWinner = INVALID_CHAIR;
      for (var i = 0; i < GAME_PLAYER; i++) {
           topUI['spriteBale'+i].visible = false;
          if (data.dwChiHuRight[i] &WIK_CHI_HU)
          {
              wWinner = i;
              if (wWinner != data.wProvideUser)
              {
                operateAmt.setAmtInfo(wWinner, WIK_HU);
              }
          }
      };
      if (wWinner == data.wProvideUser)
      {
        if (wWinner != INVALID_CHAIR)
        {
           //自摸
           var wViewChairID = gameLogic.switchViewChairID(wWinner);
           operateAmt.setAmtInfo(wWinner, WIK_ZIMO);
        }
      }
      else if (wWinner != INVALID_CHAIR)
      {
         //点炮
          var wViewChairID = gameLogic.switchViewChairID(data.wProvideUser);
          operateAmt.setAmtInfo(data.wProvideUser, WIK_DIANPAO);
          
      }

      if(data.cbZhuaMaCount==2)
      {
          topUI.nodeZhongMa2.visible = true;
          topUI.spriteMa2_0.removeAllChildren();
          topUI.spriteMa2_1.removeAllChildren();

          topUI.spriteMa2_0.addChild(weaveControl.create(0, data.cbMaData[0]))
          topUI.spriteMa2_1.addChild(weaveControl.create(0, data.cbMaData[1]))

          topUI.labelZhongMaCount2.setString(data.cbZhongMaCount);
      }
      else 
      if(data.cbZhuaMaCount==4)
      {
          topUI.nodeZhongMa4.visible = true;
          topUI.spriteMa4_0.removeAllChildren();
          topUI.spriteMa4_1.removeAllChildren();
          topUI.spriteMa4_2.removeAllChildren();
          topUI.spriteMa4_3.removeAllChildren();

          topUI.spriteMa4_0.addChild(weaveControl.create(0, data.cbMaData[0]))
          topUI.spriteMa4_1.addChild(weaveControl.create(0, data.cbMaData[1]))
          topUI.spriteMa4_2.addChild(weaveControl.create(0, data.cbMaData[2]))
          topUI.spriteMa4_3.addChild(weaveControl.create(0, data.cbMaData[3]))
          topUI.labelZhongMaCount4.setString(data.cbZhongMaCount);
      } 
      else 
      if(data.cbZhuaMaCount==6)
      {
          topUI.nodeZhongMa6.visible = true;
          topUI.spriteMa6_0.removeAllChildren();
          topUI.spriteMa6_1.removeAllChildren();
          topUI.spriteMa6_2.removeAllChildren();
          topUI.spriteMa6_3.removeAllChildren();
          topUI.spriteMa6_4.removeAllChildren();
          topUI.spriteMa6_5.removeAllChildren();

          topUI.spriteMa6_0.addChild(weaveControl.create(0, data.cbMaData[0]))
          topUI.spriteMa6_1.addChild(weaveControl.create(0, data.cbMaData[1]))
          topUI.spriteMa6_2.addChild(weaveControl.create(0, data.cbMaData[2]))
          topUI.spriteMa6_3.addChild(weaveControl.create(0, data.cbMaData[3]))
          topUI.spriteMa6_4.addChild(weaveControl.create(0, data.cbMaData[4]))
          topUI.spriteMa6_5.addChild(weaveControl.create(0, data.cbMaData[5]))

          topUI.labelZhongMaCount6.setString(data.cbZhongMaCount);
      }

      mainScene.scene.scheduleOnce(function()
        {
          gameEnd.setGameEndInfo(data);
          headIconPop.kickUserOnGameEnd();
        }, 3);
      return true;
  },
  //GM换牌
  onSubGameGM:function(data)
  {
      var nCardCount = 0;
      for (var i = 0; i < MAX_COUNT; i++) {
          if (data.cbCardData[i] > 0)
          {
              nCardCount++;
          }
      };
       data.cbCardData.sort(function(a,b){return b-a;});
      if (mainScene._wCurrentUser == mainScene._wMeChaird)
      {
          handMahJong.setCardData(data.cbCardData, nCardCount, true);
          //当前出牌用户自检是否有花 有则补花
          mainScene._cbActionMask = data.cbUserAction;
          operateBtn.setOperateInfo(mainScene._cbActionMask);
      }
      else
      {
          handMahJong.setCardData(data.cbCardData, nCardCount, false);
      }
      return true;
  },


  onSubRuleSetResult:function(data)
  {
      mainScene._cbRule = data.cbRule;
      if(data.cbRule&RULE_ONLY_ZIMO)
      {
        tableNode.labelRule.visible = true;
        tableNode.labelRule.setString("规则:只能自摸");
      }
      else  if(data.cbRule&RULE_CAN_DIAN_PAO)
      {
        tableNode.labelRule.visible = true;
        tableNode.labelRule.setString("规则:允许点炮");
      }

  },

  OnZhuaMaResult:function(data)
  {
      tableNode.labelZhuaMa.visible = true;
      tableNode.labelZhuaMa.setString("抓码:"+data.cbZhuaMaCount);
  },

	setUserMahJong:function()
	{
  		mainScene.uiPlay.removeChild(mainScene.sice1);
  		mainScene.uiPlay.removeChild(mainScene.sice2);
      otherMahJong.node.setVisible(true);
      handMahJong.node.setVisible(true);

      //设置癞子皮
      //var cbLaiZiPi = gameLogic.switchToCardData(mainScene._cbMagicIndex);
      if (mainScene._bMustBuHua) 
      {
          //当前出牌用户自检是否有花 有则补花
          if (mainScene.checkBuHua()) 
          {
              handMahJong.setCardEnable(false);
              mainScene.scene.scheduleOnce(mainScene.onUserBuHua, 0.5);
          }
      }
      else
      {
          //if (mainScene._wCurrentUser == mainScene._wMeChaird)
          //{
              //handMahJong.setCardEnable(true);
              //设置吃碰杠操作
              //operateBtn.setOperateInfo(mainScene._cbActionMask);
          //}
          
          //设置计时器
          //gameClock.setGameClock(mainScene._wCurrentUser);
      }
      gameClock.setGameClock(mainScene._wBankerUser);

      //本家是庄家，可以出牌
      //if(mainScene._wBankerUser == mainScene._wMeChaird)
      //{
          //handMahJong.setCardEnable(true);
      //}
        
      //运城麻将无花牌，故在此判断玩家是否有杠和听
      operateBtn.setOperateInfo(mainScene._cbActionMask);

      //设置剩余牌数
      tableNode.leftCardBg.visible = true;
      mainScene.leftNum.visible = true;
      mainScene.leftNum.setString(mainScene._cbLeftCardCount);

      if(mainScene._wBankerUser == mainScene._wMeChaird)
      {
          handMahJong.setCardEnable(true)
      }

	},
  checkBuHua:function()
  {
      if(mainScene._wMeChaird == INVALID_CHAIR) return false;
      for (var i = 0; i < handMahJong.cbCardCount; i++) {
         if(handMahJong.cbCardData[i] == 0x33 || handMahJong.cbCardData[i] == 0x34) continue;
         color = (handMahJong.cbCardData[i] & MASK_COLOR)>>4;
         if (color > 3) return true;
      }
      return false;
  },
  onUserBuHua:function()
  {
      //发送补花
      socket.sendMessage(MDM_GF_GAME, SUB_C_REPLACE_CARD);
  },
  updateTableUser:function()
  {
      var users = tableData.getUsersInTable(tableData.getUserWithUserId(selfdwUserID).wTableID)
      if(users.length>=GAME_PLAYER)
      {   
          if(tableData.managerUserID == selfdwUserID)
          {
              tableNode.shareButton.setVisible(false)
          }
      }  
  },
  setBankerIcon:function(wChairID, isShow)
  {   
      var tabelId = tableData.getUserWithUserId(selfdwUserID).wTableID
      var user = tableData.getUserWithTableIdAndChairId(tabelId, wChairID)
      if(user)
      {
          if(!isShow)
              user.userNodeInsetChair.bankerNode.removeAllChildren()
          else
          {
              var bankerIcon = new cc.Sprite( '#bankerIcon.png' )
              user.userNodeInsetChair.bankerNode.addChild(bankerIcon) 
          }
      }
  },

    //刷新玩家准备状态                      
  updateOnFree:function()
  {
      if(tableData.getUserWithUserId(selfdwUserID).cbUserStatus == US_SIT && mainScene._isReady)
              socket.sendMessage(MDM_GF_FRAME, SUB_GF_USER_READY)
  },   
}