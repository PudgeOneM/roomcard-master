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

          /////reportSide
          reportSide.reportType = 2
          reportSide.init(topUI.sideBoxNode)
          topUI.reportNode.addChild( reportSide.reportSideBtn )


          /////menuSide
          userSettingPop.itemShowState = [true, true, false]
          menuSide.init(topUI.sideBoxNode, [1,5,6,8])
          topUI.menuNode.addChild( menuSide.menuSideBtn )

          //IP
          var location = locationPop.getButton();
          topUI.locationNode.addChild(location);

          //麦克风节点
          var isInTable = tableData.isInTable(self.cbUserStatus); 
          wxVoiceNode.init(topUI.voicePlayNode);
          topUI.voiceNode.addChild(wxVoiceNode.voiceNode);
          //topUI.voiceNode.setVisible( selfdwUserID == tableData.createrUserID || isInTable);

          //表情节点
          var faceIds = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18];    
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
              handMahJong.init(mainScene.uiPlay);     //初始化手牌
              otherMahJong.init(mainScene.uiPlay);    //初始化其他玩家牌背
              disCardControl.init(mainScene.uiPlay);  //初始化打出去的牌堆
              weaveControl.init(mainScene.uiPlay);    //初始化吃碰杠牌堆
              outMahJong.init(mainScene.uiPlay);      //初始化打出去的那张牌
              operateBtn.init(mainScene.uiPlay);      //初始化吃碰杠胡过操作按钮
              selectGang.init(mainScene.uiPlay);      //初始化多项选择 杠
              selectChi.init(mainScene.uiPlay);       //初始化多项选择 吃
              gameClock.init();       //初始化计时器
              operateAmt.init(mainScene.uiPlay);      //初始化吃碰杠胡自摸点炮动画管理器
              baopi.init();
              mainScene._bSetUserMahJong = false;
          }
      })
      cc.eventManager.addListener(l, 1);
  },
  inittopUICCB:function()
  {
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
              //mainScene.testCode();
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
  testCode:function()
  {
      //测试代码
      //gameEnd.setGameEndInfo(null);
       mainScene._cbMagicIndex = 2;
       mainScene._cbPiziIndex1 = 0;
       mainScene._cbPiziIndex2 = 1;
      // var cbCardData = [1,2,3,4,5,6,7,8,9,17,18,19,20,21];
      // handMahJong.setCardData(cbCardData, 14, true);   
      // tableNode.laizipiNode.addChild(weaveControl.create(0, cbLaiZiPi));
      // tableNode.laizipiNode.visible = true;
      // gameClock.setGameClock(INVALID_CHAIR);
      // tableNode.leftCardBg.visible = true;
      // mainScene.leftNum.visible = true;
      // mainScene.leftNum.setString(77);
      // otherMahJong.setCardData();
      // otherMahJong.sendCardData(1, true);
      // otherMahJong.sendCardData(2, true);
      // otherMahJong.sendCardData(3, true);
      mainScene._wMeChaird = gameLogic.getMeChaird();
      mainScene._szNickName = [];
      for (var i = 0; i < GAME_PLAYER; i++) {
          topUI['baoNum'+i].setString(i);
          topUI['piNum'+i].setString(i);
          baopi.baoNum[i] = i;
          baopi.piNum[i] = i;
          mainScene._szNickName[i] = '武穴麻将'+i;
         // for (var j = 0; j < 17; j++) {
         //   disCardControl.addCardItem(i, gameLogic.switchToCardData(j));
         // };
         for (var j = 0; j < 3; j++) {
          weaveControl.cbWeaveArray[i][j] = {};
          weaveControl.cbWeaveArray[i][j].cbWeaveKind = WIK_GANG;
          weaveControl.cbWeaveArray[i][j].cbCenterCard = i;
          weaveControl.cbWeaveArray[i][j].cbPublicCard = i;
          weaveControl.cbWeaveArray[i][j].wProvideUser = i;
          weaveControl.cbWeaveArray[i][j].cbCardData = [];
          weaveControl.cbWeaveArray[i][j].cbCardData[0] = i;
          weaveControl.cbWeaveArray[i][j].cbCardData[1] = i;
          weaveControl.cbWeaveArray[i][j].cbCardData[2] = i;
          weaveControl.cbWeaveArray[i][j].cbCardData[3] = i;
          weaveControl.setCardData(i, j);
        };
      };
      var data = {};
      data.wProvideUser = 0;
      data.cbProvideCard = 2;
      data.dwChiHuRight = data.dwChiHuRight|CHR_QING_SHUI;
      data.dwChiHuRight = data.dwChiHuRight|CHR_QING_YI_SE;
      data.dwChiHuRight = data.dwChiHuRight|CHR_PENG_PENG_HU;
      data.dwChiHuRight = data.dwChiHuRight|CHR_DAN_DIAO;
      data.dwChiHuRight = data.dwChiHuRight|CHR_ZI_MO;
      data.cbFanCount = [1,2,3,4];
      data.lGameScore = [-20, 60, -20, -20];
      data.cbCardCount = [4, 5, 4, 4];
      data.cbCardData = 
      [
        [33, 34, 35, 36],
        [7, 8, 9, 2, 3],
        [49, 50, 51, 52],
        [17, 18, 19, 20 ],
      ];
      gameEnd.setGameEndInfo(data);
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
        else if (cbIndex == mainScene._cbPiziIndex1 || cbIndex == mainScene._cbPiziIndex2)
        {
          return cbCardData-100;
        }
        else if (cbCardData <= 0)
        {
          return -300;
        }
        return cbCardData;
      };
      cbCardData.sort(function(a, b) {return sortBP(b)-sortBP(a)});
  },
  //断线重连
  onEventScenePlay:function(data)
  {
      mainScene.reset();
      tableNode.shareButton.setVisible(false);
      mainScene.scene.unschedule(mainScene.updateTableUser);
      //设置变量 
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
      mainScene._cbPiziIndex1    = data.cbPiziIndex1;
      mainScene._cbPiziIndex2    = data.cbPiziIndex2;
      mainScene._szNickName      = ["","","",""];
      mainScene._bSetUserMahJong = true;
      for (var i = 0; i < GAME_PLAYER; i++) {
          mainScene._szNickName[i] = tableData.getUserWithChairId(i).szNickName;
      };
      //设置癞子皮
      var cbLaiZiPi = gameLogic.switchToCardData(mainScene._cbPiziIndex1);
      tableNode.laizipiNode.addChild(weaveControl.create(0, cbLaiZiPi));
      tableNode.laizipiNode.visible = true;

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
              baopi.updateData(i, data.cbDiscardCard[i][k]);
          };
      };

      //设置本地玩家手牌
      mainScene.sortHandCard(mainScene._cbCardData);
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

      handMahJong.setCardEnable(false);
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
      otherMahJong.setCardData();
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
                handMahJong.setCardEnable(true);
                //设置吃碰杠操作
                operateBtn.setOperateInfo(mainScene._cbActionMask);
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
      //隐藏弃牌上的箭头
      disCardControl.hideOutPointer();
  },
  //游戏开始
	onSubGameStart:function(data)
	{
      mainScene.scene.unschedule(mainScene.updateTableUser);
      gameEnd.clearGameData();
      tableMahJong.clearCardData();
  		//设置变量 
      mainScene._wMeChaird       = gameLogic.getMeChaird();
  		mainScene._wBankerUser     = data.wBankerUser;
  		mainScene._wCurrentUser    = data.wBankerUser;
  		mainScene._cbLeftCardCount = 82;
      mainScene._cbCardData      = [];
      mainScene._cbCardData      = data.cbCardData;
      mainScene._cbActionMask    = WIK_NULL;
      mainScene._cbMagicIndex    = data.cbMagicIndex;
      mainScene._cbPiziIndex1    = data.cbPiziIndex1;
      mainScene._cbPiziIndex2    = data.cbPiziIndex2;
      mainScene._szNickName      = ["","","",""];
      for (var i = 0; i < GAME_PLAYER; i++) {
          mainScene._szNickName[i] = tableData.getUserWithChairId(i).szNickName;
      };
      //设置庄家
      for (var i = 0; i < GAME_PLAYER; i++) {
          mainScene.setBankerIcon(i,false);
      }
      mainScene.setBankerIcon(mainScene._wBankerUser,true);
      //设置剩余牌数
      tableNode.leftCardBg.visible = true;
      mainScene.leftNum.visible = true;
      mainScene.leftNum.setString(mainScene._cbLeftCardCount);
      //设置计时器背景方向
      gameClock.setClockInfo();
      //播放骰子音效
      managerAudio.playEffect('gameRes/sound/dice.wav');
  		//播放骰子动画
      var spr = actionFactory.getSprWithAnimate('shaizi_anmi1', true, 0.15, function()
      {   
         var nSice1 = parseInt(Math.random()*6, 10);
         var nSice2 = parseInt(Math.random()*6, 10);
         mainScene.sice1 = new cc.Sprite("#SiceOne_" + nSice1 + '.png');
         mainScene.sice2 = new cc.Sprite("#SiceTwo_" + nSice2 + '.png');
         mainScene.sice1.setPosition( cc.p( mainScene.ctPosX-75, mainScene.ctPosY) );
         mainScene.sice2.setPosition( cc.p( mainScene.ctPosX+75, mainScene.ctPosY) );
         mainScene.uiPlay.addChild(mainScene.sice1); 
         mainScene.uiPlay.addChild(mainScene.sice2); 
         mainScene.scene.scheduleOnce(mainScene.setUserMahJong, 1);
      })
      spr.setPosition( cc.p( mainScene.ctPosX, mainScene.ctPosY) );
      mainScene.uiPlay.addChild(spr); 
      return true;
	},
  //有玩家出牌
  onSubOutCard:function(data)
  {
      operateBtn.hideOperate();
      mainScene._cbActionMask = WIK_NULL;
      mainScene._cbActionCard = 0;
      //接收出牌数据
      mainScene._wOutCardUser = data.wOutCardUser;
      mainScene._cbOutCardData = data.cbOutCardData;

      //显示打出的牌
      var wViewChairID = gameLogic.switchViewChairID(mainScene._wOutCardUser);
      outMahJong.showOutCard(wViewChairID, mainScene._cbOutCardData);
      if(mainScene._wOutCardUser == 0 && mainScene._wMeChaird == INVALID_CHAIR)
      {
        var cbCardData = [];
        handMahJong.setCardData(cbCardData, handMahJong.cbCardCount-1, false);
      }
      else if (mainScene._wOutCardUser != mainScene._wMeChaird) 
        otherMahJong.sendCardData(wViewChairID, false);
      //出牌音效
      var cbCardIndex = gameLogic.switchToCardIndex(mainScene._cbOutCardData);
      if (cbCardIndex != mainScene._cbPiziIndex1 && cbCardIndex != mainScene._cbPiziIndex2 && cbCardIndex != mainScene._cbMagicIndex)
      {
        var outUser = tableData.getUserWithChairId(mainScene._wOutCardUser);
        if (outUser.cbGender)
          managerAudio.playEffect('gameRes/sound/man/cardData'+mainScene._cbOutCardData+'.mp3');
        else
          managerAudio.playEffect('gameRes/sound/woman/cardData'+mainScene._cbOutCardData+'.mp3');
      }
      else
      {
        baopi.updateData(data.wOutCardUser, data.cbOutCardData);

        //播放动画
        operateAmt.setAmtInfo(data.wOutCardUser, WIK_GANG);
      }
      return true;
  },
  //发牌
  onSubSendCard:function(data)
  {
      if (!mainScene._bSetUserMahJong)
      {
          mainScene.scene.unschedule(mainScene.setUserMahJong);
          mainScene.setUserMahJong();
      }
      if(!data.bHaiDiLaoYue)
      {
        operateBtn.hideOperate();
        mainScene._cbActionMask = WIK_NULL;
        mainScene._cbActionCard = 0;
      }
      else
      {
        if (data.wCurrentUser == mainScene._wMeChaird)
        {
          operateBtn.hideOperate();
          mainScene._cbActionMask = WIK_NULL;
          mainScene._cbActionCard = 0;
        }
      }
      //发牌音效
      managerAudio.playEffect('gameRes/sound/carddown.wav');
      //设置剩余牌数
      mainScene._cbLeftCardCount--;
      mainScene.leftNum.setString(mainScene._cbLeftCardCount);
      //隐藏出牌
      outMahJong.hideOutCard();
      //丢弃牌堆添加
      if (mainScene._wOutCardUser != INVALID_CHAIR)
      {
          if(data.bHaiDiLaoYue)
          {
            if (data.wCurrentUser == mainScene._wMeChaird)
            {
              disCardControl.addCardItem(gameLogic.switchViewChairID(mainScene._wOutCardUser), mainScene._cbOutCardData);
            }
          }
          else          
            disCardControl.addCardItem(gameLogic.switchViewChairID(mainScene._wOutCardUser), mainScene._cbOutCardData);
      }
      //设置变量
      mainScene._wCurrentUser = data.wCurrentUser;
      mainScene._cbActionMask = data.cbActionMask;
      //发牌
      if (data.wCurrentUser == mainScene._wMeChaird || (data.wCurrentUser == 0 && mainScene._wMeChaird == INVALID_CHAIR)) 
      {
          //设置手牌
          handMahJong.sendCardData(data.cbCardData);

          handMahJong.setCardEnable(true);
          //设置吃碰杠操作
          operateBtn.setOperateInfo(mainScene._cbActionMask);
      }
      else
      {
          otherMahJong.sendCardData(gameLogic.switchViewChairID(mainScene._wCurrentUser), true);
          handMahJong.setCardEnable(false);
      }
      if (data.bHaiDiLaoYue)
      {
          mainScene._wCurrentUser = INVALID_CHAIR;
          handMahJong.setCardEnable(false);
          if (mainScene._cbActionMask != 0 && data.wCurrentUser == mainScene._wMeChaird)
          {
            operateBtn.setOperateInfo(mainScene._cbActionMask);
          }
      }
      //设置计时器
      gameClock.setGameClock(mainScene._wCurrentUser);
  },
  //有玩家操作
  onSubOperateNotify:function(data)
  {
      if (!mainScene._bSetUserMahJong)
      {
          mainScene.scene.unschedule(mainScene.setUserMahJong);
          mainScene.setUserMahJong();
      }
      //用户界面
      if (data.cbActionMask!=WIK_NULL && data.wOperateUser == mainScene._wMeChaird)
      {
          //获取变量
          mainScene._wCurrentUser = INVALID_CHAIR;
          mainScene._cbActionMask = data.cbActionMask;
          mainScene._cbActionCard = data.cbActionCard;

          //handMahJong.setCardEnable(true);

          //设置界面
          operateBtn.setOperateInfo(mainScene._cbActionMask);
      }
      //设置计时器
      gameClock.setGameClock(INVALID_CHAIR);
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
      var bBao = false;
      var bGangByPeng = false;
      //播放动画
      operateAmt.setAmtInfo(wOperateUser, pOperateResult.cbOperateCode);
      //设置变量
      mainScene._wCurrentUser = pOperateResult.wOperateUser;
      //设置组合
      if ((pOperateResult.cbOperateCode&WIK_GANG)!=0)
      {
        //设置变量
        mainScene._wCurrentUser=INVALID_CHAIR;

        //组合扑克
        var cbWeaveIndex=0xFF;
        for (var i=0;i<weaveControl.cbWeaveCount[wOperateViewID];i++) 
        {
          var cbWeaveKind=weaveControl.cbWeaveArray[wOperateViewID][i].cbWeaveKind;
          var cbCenterCard=weaveControl.cbWeaveArray[wOperateViewID][i].cbCenterCard;
          if ((cbCenterCard==cbOperateCard[0])&&(cbWeaveKind==WIK_PENG))
          {
            bGangByPeng = true;
            bBao = false;
            cbCardCount = 1;
            cbWeaveIndex=i;
            weaveControl.cbWeaveArray[wOperateViewID][cbWeaveIndex].cbPublicCard=true;
            weaveControl.cbWeaveArray[wOperateViewID][cbWeaveIndex].cbWeaveKind=pOperateResult.cbOperateCode;
            weaveControl.cbWeaveArray[wOperateViewID][cbWeaveIndex].cbCardData[3] = cbCenterCard;
            break;
          }
        }

        //组合扑克
        if (cbWeaveIndex==0xFF)
        {
          bBao = true;
          //暗杠判断
          cbPublicCard=(pOperateResult.wProvideUser==wOperateUser)?false:true;
          cbOperateCard[1] = cbOperateCard[0]; 
          cbOperateCard[2] = cbOperateCard[0]; 
          if (cbPublicCard)
          {
            cbCardCount = 3;
          }
          else
          {
            cbCardCount = 4;
            cbOperateCard[3] = cbOperateCard[0]; 
          }
          //设置扑克
          //cbWeaveIndex=weaveControl.cbWeaveCount[wOperateViewID]++;
          cbWeaveIndex=weaveControl.cbWeaveCount[wOperateViewID];
          weaveControl.cbWeaveArray[wOperateViewID][cbWeaveIndex].cbCardData = [];
          weaveControl.cbWeaveArray[wOperateViewID][cbWeaveIndex].cbPublicCard=cbPublicCard;
          weaveControl.cbWeaveArray[wOperateViewID][cbWeaveIndex].cbCenterCard=cbOperateCard[0];
          weaveControl.cbWeaveArray[wOperateViewID][cbWeaveIndex].cbWeaveKind=pOperateResult.cbOperateCode;
          weaveControl.cbWeaveArray[wOperateViewID][cbWeaveIndex].wProvideUser=pOperateResult.wProvideUser;
          for( var i = 0; i < 4; i++ ) 
            weaveControl.cbWeaveArray[wOperateViewID][cbWeaveIndex].cbCardData[i] = cbOperateCard[0];
        }

        //添加吃碰杠组合麻将
        weaveControl.setCardData(wOperateViewID, cbWeaveIndex);
     
        //设置扑克
        if (mainScene._wMeChaird==wOperateUser || (wOperateUser == 0 && mainScene._wMeChaird == INVALID_CHAIR))
        {
           handMahJong.setOperateCard(cbOperateCard, cbCardCount);
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
        bBao = true;
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

        mainScene.showChengBaoTip(wOperateUser);
        if (pOperateResult.cbActionMask & WIK_GANG && wOperateUser == mainScene._wMeChaird)
        {
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
  showChengBaoTip:function(wOperateUser)
  {
    var wOperateViewID = gameLogic.switchViewChairID(wOperateUser);
    if(weaveControl.cbWeaveCount[wOperateViewID] < 2) return;
    var nCount = 0;
    for (var i = 0; i < weaveControl.cbWeaveCount[wOperateViewID]; i++) {
        var cbWeaveKind = weaveControl.cbWeaveArray[wOperateViewID][i].cbWeaveKind;
        if ((cbWeaveKind&WIK_LEFT) || (cbWeaveKind&WIK_CENTER) || (cbWeaveKind&WIK_RIGHT) || (cbWeaveKind&WIK_PENG))
        {
          nCount++;
        }
    };
    if(nCount != 2) return;
    var fun = function () {
        topUI.baoTipBg.visible = false;
    };
    var user = tableData.getUserWithChairId(wOperateUser);
    //清一色两手提示
    if (mainScene.isQingYiSe(wOperateViewID))
    {
        topUI.baoTip.setString(mainScene._szNickName[wOperateUser]+'吃碰清一色两手');
        topUI.baoTipBg.visible = true;
        topUI.baoTipBg.scheduleOnce(fun, 10);
        if (user.cbGender)
            managerAudio.playEffect('gameRes/sound/man/qingyise.mp3');
        else
            managerAudio.playEffect('gameRes/sound/woman/qingyise.mp3');
    }
    //将一色两手提示
    if (mainScene.isJiangYiSe(wOperateViewID))
    {
        topUI.baoTip.setString(mainScene._szNickName[wOperateUser]+'吃碰将一色两手');
        topUI.baoTipBg.visible = true;
        topUI.baoTipBg.scheduleOnce(fun, 10);
        if (user.cbGender)
            managerAudio.playEffect('gameRes/sound/man/jiangyise.mp3');
        else
            managerAudio.playEffect('gameRes/sound/woman/jiangyise.mp3');
    }
    //风一色两手提示
    if (mainScene.isFengYiSe(wOperateViewID))
    {
        topUI.baoTip.setString(mainScene._szNickName[wOperateUser]+'吃碰风一色两手');
        topUI.baoTipBg.visible = true;
        topUI.baoTipBg.scheduleOnce(fun, 10);
        if (user.cbGender)
            managerAudio.playEffect('gameRes/sound/man/fengyise.mp3');
        else
            managerAudio.playEffect('gameRes/sound/woman/fengyise.mp3');
    }
  },
  isQingYiSe:function(wOperateViewID)
  {
      var cbColor = 0xFF;
      for (var i = 0; i < weaveControl.cbWeaveCount[wOperateViewID]; i++) {
          var cbWeaveKind = weaveControl.cbWeaveArray[wOperateViewID][i].cbWeaveKind;
          if ((cbWeaveKind&WIK_LEFT) || (cbWeaveKind&WIK_CENTER) || (cbWeaveKind&WIK_RIGHT) || (cbWeaveKind&WIK_PENG))
          {
              var cbColorNew = (weaveControl.cbWeaveArray[wOperateViewID][i].cbCenterCard&MASK_COLOR)>>4;
              if (cbColor != 0xFF)
              {
                if (cbColor != cbColorNew) return false;
                return true;
              }
              cbColor = cbColorNew;
          }
      };
      return true;
  },
  isJiangYiSe:function(wOperateViewID)
  {
     for (var i = 0; i < weaveControl.cbWeaveCount[wOperateViewID]; i++) {
          var cbWeaveKind = weaveControl.cbWeaveArray[wOperateViewID][i].cbWeaveKind;
          if ((cbWeaveKind&WIK_LEFT) || (cbWeaveKind&WIK_CENTER) || (cbWeaveKind&WIK_RIGHT)) return false;
          if (cbWeaveKind & WIK_PENG)
          {
              var cbValue = weaveControl.cbWeaveArray[wOperateViewID][i].cbCenterCard&MASK_VALUE;
              var cbColor = (weaveControl.cbWeaveArray[wOperateViewID][i].cbCenterCard&MASK_COLOR)>>4;
              if (cbValue != 2 && cbValue != 5 && cbValue != 8 || cbColor == 3) return false;
          }
      };
      return true;
  },
  isFengYiSe:function(wOperateViewID)
  {
      for (var i = 0; i < weaveControl.cbWeaveCount[wOperateViewID]; i++) {
          var cbWeaveKind = weaveControl.cbWeaveArray[wOperateViewID][i].cbWeaveKind;
          if ((cbWeaveKind&WIK_LEFT) || (cbWeaveKind&WIK_CENTER) || (cbWeaveKind&WIK_RIGHT)) return false;
          if (cbWeaveKind & WIK_PENG)
          {
              var cbColor = (weaveControl.cbWeaveArray[wOperateViewID][i].cbCenterCard&MASK_COLOR)>>4;
              if (cbColor != 3) return false;
          }
      };
      return true;
  },
  //游戏结束
  onsubGameEnd:function(data)
  {
      mainScene._cbActionCard = 0;
      mainScene._cbActionMask = WIK_NULL;
      operateBtn.hideOperate();
      // //摊牌
      // tableMahJong.setCardData(data.cbCardData, data.cbCardCount);
      // //清空手牌
      // var cbCardData = [];
      // handMahJong.setCardData(cbCardData, 0, true);
      // handMahJong.setCardEnable(false);
      // //清空其他玩家牌
      // otherMahJong.clearCardData();

      var wWinner = INVALID_CHAIR;
      for (var i = 0; i < GAME_PLAYER; i++) {
          if (data.lGameScore[i] > 0)
          {
              wWinner = i;
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
      mainScene.scene.scheduleOnce(function()
        {
          gameEnd.setGameEndInfo(data);
          headIconPop.kickUserOnGameEnd();
        }, 1.5);
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
	setUserMahJong:function()
	{
      mainScene._bSetUserMahJong = true;
  		mainScene.uiPlay.removeChild(mainScene.sice1);
  		mainScene.uiPlay.removeChild(mainScene.sice2);
      //设置癞子皮
      var cbLaiZiPi = gameLogic.switchToCardData(mainScene._cbPiziIndex1);
      tableNode.laizipiNode.addChild(weaveControl.create(0, cbLaiZiPi));
      tableNode.laizipiNode.visible = true;

      mainScene.sortHandCard(mainScene._cbCardData);
  		if (mainScene._wCurrentUser == mainScene._wMeChaird || (mainScene._wMeChaird == INVALID_CHAIR && mainScene._wCurrentUser == 0))
      {
          //本地玩家是庄家
          //设置本地玩家手牌
          handMahJong.setCardData(mainScene._cbCardData, MAX_COUNT, true);
          //显示其他三家玩家牌背
          otherMahJong.setCardData();
      }
      else
      {
          //设置本地玩家手牌
          handMahJong.setCardData(mainScene._cbCardData, MAX_COUNT-1, false);
          //设置本地玩家手牌不可点击
          handMahJong.setCardEnable(false);
          //显示其他三家玩家牌背
          otherMahJong.setCardData();     
          //显示庄家发牌牌背
          otherMahJong.sendCardData(gameLogic.switchViewChairID(mainScene._wBankerUser), true);
      }
      if (mainScene._wCurrentUser == mainScene._wMeChaird)
      {
          handMahJong.setCardEnable(true);
      }
      
      //设置计时器
      gameClock.setGameClock(mainScene._wCurrentUser);
	},
  updateTableUser:function()
  {
      var users = tableData.getUsersInTable(tableData.getUserWithUserId(selfdwUserID).wTableID)
      if(users.length>=GAME_PLAYER)
      {   
          if(tableData.managerUserID == selfdwUserID)
          {
              tableNode.shareButton.setVisible(false);
          }
      }  
      else
        tableNode.shareButton.setVisible(true);
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
}