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
          userSettingPop.itemShowState = [true, true, true]
          menuSide.init(topUI.sideBoxNode, [1,7,5,6,8])
          topUI.menuNode.addChild( menuSide.menuSideBtn )

          //ip
          var location = locationPop.getButton();
          topUI.locationNode.addChild(location);

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
                
          var listener = topUI.getListener(topUI.imgResultBtn);
          cc.eventManager.addListener(listener, topUI.imgResultBtn);
    },
    getListener:function()
    {   
        var listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
           onTouchBegan: function (touch, event) {
                  if(topUI.imgResultBtn.visible == false) return false;
                  var locationInNode = topUI.imgResultBtn.convertToNodeSpace(touch.getLocation());
                  var s = topUI.imgResultBtn.getContentSize();
                  var rect1 = cc.rect(0, 0, s.width/2, s.height);
                  var rect2 = cc.rect(s.width/2, 0, s.width/2, s.height);
                  if (cc.rectContainsPoint(rect1, locationInNode)) {
                      return true;
                  }
                  if (cc.rectContainsPoint(rect2, locationInNode)) {
                      return true;
                  }
                  return false;
            },
            onTouchEnded: function (touch, event) {
                  var locationInNode = topUI.imgResultBtn.convertToNodeSpace(touch.getLocation());
                  var s = topUI.imgResultBtn.getContentSize();
                  var rect1 = cc.rect(0, 0, s.width/2, s.height);
                  var rect2 = cc.rect(s.width/2, 0, s.width/2, s.height);
                  if (cc.rectContainsPoint(rect1, locationInNode)) {
                      gameEnd.node.visible = true;
                      topUI.imgResultBtn.setSpriteFrame('shouwResult.png');
                  }
                  if (cc.rectContainsPoint(rect2, locationInNode)) {
                      gameEnd.node.visible = false;
                      topUI.imgResultBtn.setSpriteFrame('showTable.png');
                  }
            }
        })
        return listener;
    },
};
var mainScene = {
	runThisScene:function()
	{
  		mainScene.scene = new cc.Scene();

      cc.spriteFrameCache.addSpriteFrames(resp.amtOperate0Plist, resp.amtOperate0Res)
      cc.spriteFrameCache.addSpriteFrames(resp.amtOperate1Plist, resp.amtOperate1Res)
      cc.spriteFrameCache.addSpriteFrames(resp.gameEndPlist, resp.gameEnd)

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
           // mainScene.testCode();
           // gameGM.create();
           // sendLogToServer(gameLog.logS + 'wtmszhudongwtms')
           // showTipsTTF({str:'网络异常'})
           // var event = new cc.EventCustom("reStart")
           // cc.eventManager.dispatchEvent(event)
      }
      
      tableNode.init(resp.tableCCB);
      tableNode.bgSprMy.setScaleX(tableNode.node.width/tableNode.bgSprMy.width);
      tableNode.bgSprMy.setScaleY(tableNode.node.height/tableNode.bgSprMy.height);
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
              mainScene.leftNum.setProperty("21", resp.clockNum, 18, 25, "0");
              mainScene.leftNum.setAnchorPoint(cc.p(0.5,0.5));
              mainScene.leftNum.visible = false;
              tableNode.lbLeftCard.visible = false;
              tableNode.leftCardNode.addChild(mainScene.leftNum);

              //游戏内容
              handMahJong.init(mainScene.uiPlay);
              outMahJong.init(mainScene.uiPlay);
              disCardControl.init(mainScene.uiPlay);
              weaveControl.init(mainScene.uiPlay);
              operateBtn.init(mainScene.uiPlay);      //初始化吃碰杠胡过操作按钮
              selectChi.init(mainScene.uiPlay);
              operateAmt.init(mainScene.uiPlay);      //初始化吃碰杠胡自摸点炮动画管理器
              gameClock.hideClock();
              //mainScene.testCode();
              mainScene.dwUserID = [];
          }
      })
      cc.eventManager.addListener(l, 1);
  },
  inittopUICCB:function()
  {
      topUI.init();
      mainScene.uiTopUI.addChild(topUI.node);
  },
  testCode:function()
  {
      
      //测试代码
      var cbCardData = [1, 4, 7, 10, 0x11, 0x14, 0x17, 0x1A, 2, 2, 5, 5, 8, 8, 0x12, 0x12, 0x15, 0x15, 0x18, 0x18];
      handMahJong.setCardData(cbCardData, 20);
      return;
      outMahJong.showOutCard(0, 2, false, false);
      for(var i = 0; i < 20; i++)
      {
          disCardControl.addCardItem(0, i, 5);
          disCardControl.addCardItem(1, i, 5);
          disCardControl.addCardItem(2, i, 5);
      }
      mainScene._cbYingXi = [0, 0, 0];
      for(var i = 0; i < MAX_WEAVE; i++)
      {
          var array = [24, 25, 26];
          weaveControl.addWeaveItem(0, WIK_PENG, array);
          weaveControl.addWeaveItem(1, WIK_PENG, array);
          weaveControl.addWeaveItem(2, WIK_PENG, array);
      }
      var info = [];
      for(var i = 0; i < 3; i++)
      {
        info[i] = {};
        info[i].wActionMask = WIK_LEFT;
        info[i].cbActionCard = i+1;
        info[i].cbCardData = [];
        info[i].cbCardData[0] = i+2;
        info[i].cbCardData[1] = i+3;
      }
      selectChi.setSelectInfo(3, info);
      //结算框
        //结束信息
        var data = {};
        data.cbProvideCard = 1;
        data.sctAnalyseItem = {};
        data.sctAnalyseItem.cbCardEye = 1;
        data.sctAnalyseItem.bMagicEye = false;
        data.sctAnalyseItem.cbWeaveKind = [];
        data.sctAnalyseItem.cbCenterCard = [];
        data.sctAnalyseItem.cbCardData = [];
        for(var i = 0; i < MAX_WEAVE; i++)
        {
            data.sctAnalyseItem.cbWeaveKind[i] = WIK_PENG;
            data.sctAnalyseItem.cbCenterCard[i] = 2;
            data.sctAnalyseItem.cbCardData[i] = [2,2,2];
        }
        data.lGameScore = [100, -50, -50];
        data.cbCardCount = [4,4,4];
        data.cbCardData = [];
        data.cbCardData[0] = [1,2,3,4];
        data.cbCardData[1] = [2,3,4,5];
        data.cbCardData[2] = [3,4,5,6];
        data.cbYingxi = [10,10,10];
        data.wZongXi = 20;
        data.wFenLiuZi = 0;
        data.cbDiPai = [1,2,3,4,5,6,7,8,9,10,17,18,19,20,21,22,23,24,25,26,1,1];
        data.cbChiHuType = [];
        data.cbChiHuScore = [];
        for(var i = 0; i < MAX_CHR_COUNT; i++)
        {
            if(i % 10 == 0)
            {
              data.cbChiHuType[i] = 1;
              data.cbChiHuScore[i] = 100;
            }
        }
        weaveControl.cbWeaveCount = [0, 0, 0];
        weaveControl.cbWeaveArray = [];
        for(var i = 0; i < GAME_PLAYER; i++)
        {
          weaveControl.cbWeaveArray[i] = [];
          for(var j = 0; j < 5; j++)
          {
            weaveControl.cbWeaveArray[i][j] = {};
            weaveControl.cbWeaveArray[i][weaveControl.cbWeaveCount[i]].cbWeaveKind = WIK_PENG;
            weaveControl.cbWeaveArray[i][weaveControl.cbWeaveCount[i]].cbCardArray = [];
            weaveControl.cbWeaveArray[i][weaveControl.cbWeaveCount[i]].cbCardArray = [0x18,0x18,0x18];
            weaveControl.cbWeaveCount[i]++;
          }
        }
        mainScene._wMeChaird = 0;
        //gameEnd.setGameEndInfo(data);
        gameSet.create();
  },
  reset:function()
  {
  
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
              
              if(tableData.getUserWithUserId(selfdwUserID).cbUserStatus == US_SIT)
              {
                  socket.sendMessage(MDM_GF_FRAME, SUB_GF_USER_READY)
              }
          }
      })
      cc.eventManager.addListener(l, 1);
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
  //断线重连
  onEventScenePlay:function(data)
  {
      tableNode.roomOwnerTTF.visible = false;
      mainScene.reset();
      tableNode.shareButton.setVisible(false);
      mainScene.scene.unschedule(mainScene.updateTableUser);
      //设置变量 
      mainScene._wMeChaird       = gameLogic.getMeChaird();
      mainScene._wBankerUser     = data.wBankerUser;
      mainScene._wCurrentUser    = data.wCurrentUser;
      mainScene._cbLeftCardCount = data.cbLeftCardCount;
      mainScene._cbEnableIndex   = data.cbEnableIndex;
      mainScene._cbYingXi        = [0, 0, 0];
      mainScene._cbActionMask    = data.cbActionMask;
      mainScene._cbActionCard    = data.cbActionCard;
      mainScene.dwUserID         = data.dwUserID;
      mainScene._wDisCardUser    = INVALID_CHAIR;
      mainScene._cbDisCardData   = 0;
      mainScene._bDisCardOut     = true;
      mainScene._szNickName      = ["","",""];
      mainScene._szHeadImageUrl  = ["","",""];
      for (var i = 0; i < GAME_PLAYER; i++) {
          mainScene._szNickName[i] = tableData.getUserWithChairId(i).szNickName;
          mainScene._szHeadImageUrl[i] = tableData.getUserWithChairId(i).szHeadImageUrlPath;
      };
      //设置庄家
      mainScene.setBankerIcon(mainScene._wBankerUser,true);
      //设置表情  麦克风
      if(mainScene._wMeChaird == INVALID_CHAIR)
      {
          if(selfdwUserID == tableData.createrUserID)
          {
              topUI.emoji.visible = true;
          }
      }
      else
      {
          topUI.emoji.visible = true;
      }
      //设置剩余牌数
      tableNode.lbLeftCard.visible = true;
      mainScene.leftNum.visible = true;
      mainScene.leftNum.setString(mainScene._cbLeftCardCount);

      //设置弃牌牌堆
      for (var i = 0; i < GAME_PLAYER; i++) {
          for (var k = 0; k < data.cbDiscardCount[i]; k++) {
              if(data.cbDiscardCard[i][k] != 0)
                disCardControl.addCardItem(gameLogic.switchViewChairID(i), true, data.cbDiscardCard[i][k]);
              else
                disCardControl.addCardItem(gameLogic.switchViewChairID(i), false, data.cbJiePaiData[i][k]);
          };
      };
  
      //设置吃碰杠牌堆
      for (var i = 0; i < GAME_PLAYER; i++) {
          var wViewChairID = gameLogic.switchViewChairID(i);
          for (var k = 0; k < data.cbWeaveCount[i]; k++) {
              weaveControl.addWeaveItem(wViewChairID, data.WeaveItemArray[i][k].cbWeaveKind, data.WeaveItemArray[i][k].cbCardData);
          };
      };
      //设置操作管理器
      if(mainScene._wCurrentUser == INVALID_CHAIR)
      {
          if(data.wOutCardUser != INVALID_CHAIR)
          {
              outMahJong.showOutCard(gameLogic.switchViewChairID(data.wOutCardUser), data.cbOutCardData, true, false);
          }
          else if(data.cbSendCardData != 0)
          {
              outMahJong.showOutCard(gameLogic.switchViewChairID(data.wSendChaird), data.cbSendCardData, false, data.bWei);
          }
          operateBtn.setOperateInfo(mainScene._cbActionMask);
      }
      //设置本地玩家手牌
      handMahJong.setCardData(data.cbCardData, data.cbCardCount);
      //计时器
      gameClock.setGameClock(mainScene._wCurrentUser);
      //游戏设置
      mainScene.onSubGameSetResult(data);
      tableNode.lbLiuZi.setString('溜子:'+data.lLiuZi);
      if(tableNode.lbDouLiuZi.visible == true)
      {
          tableNode.lbLiuZi.visible = true;
      }
      //小相公
      for (var i = 0; i < GAME_PLAYER; i++)
      {
          mainScene.isXiaoXiangGong(i, data.bXiaoXiangGong[i]);
      };
  },
  //游戏开始
  onSubGameStart:function(data)
  {   
      if(tableNode.lbDouLiuZi.visible == true)
         tableNode.lbLiuZi.visible = true;
      mainScene.scene.unschedule(mainScene.updateTableUser);
      tableNode.roomOwnerTTF.visible = false;
      //设置变量 
      mainScene._wMeChaird       = gameLogic.getMeChaird();
      mainScene._wBankerUser     = data.wBankerUser;
      mainScene._wCurrentUser    = data.wBankerUser;
      mainScene._cbLeftCardCount = 22;
      mainScene._cbEnableIndex   = [];
      mainScene._cbYingXi        = [0, 0, 0];
      mainScene._cbActionMask    = data.cbUserAction;
      mainScene._wDisCardUser    = INVALID_CHAIR;
      mainScene._cbDisCardData   = 0;
      mainScene._bDisCardOut     = true;
      mainScene._szNickName      = ["","",""];
      mainScene._szHeadImageUrl  = ["","",""];
      for (var i = 0; i < GAME_PLAYER; i++) {
          mainScene._szNickName[i] = tableData.getUserWithChairId(i).szNickName;
          mainScene._szHeadImageUrl[i] = tableData.getUserWithChairId(i).szHeadImageUrlPath;
      };
      //设置庄家
      for (var i = 0; i < GAME_PLAYER; i++) {
          mainScene.setBankerIcon(i,false);
      }
      mainScene.setBankerIcon(mainScene._wBankerUser,true);
      //设置本地玩家手牌
      var cbCardCount = MAX_COUNT;
      if(mainScene._wMeChaird != mainScene._wBankerUser)
        cbCardCount = 19;
      handMahJong.setCardData(data.cbCardData, cbCardCount);
      //设置吃碰杠操作
      operateBtn.setOperateInfo(mainScene._cbActionMask);
      //计时器
      gameClock.setGameClock(mainScene._wBankerUser);
      mainScene.leftNum.setString(mainScene._cbLeftCardCount);
      mainScene.leftNum.visible = true;
      tableNode.lbLeftCard.visible = true;
      return true;
  },
  //有玩家出牌
  onSubOutCard:function(data)
  {
      operateBtn.hideOperate();
      mainScene._cbActionMask = WIK_NULL;
      mainScene._cbActionCard = 0;
      mainScene._wCurrentUser = INVALID_CHAIR;

      mainScene._wDisCardUser    = data.wOutCardUser;
      mainScene._cbDisCardData   = data.cbOutCardData;
      mainScene._bDisCardOut     = true;

      gameLogic.playGenderEffect(data.wOutCardUser, 0, data.cbOutCardData);
      //显示打出的牌
      var wViewChairID = gameLogic.switchViewChairID(data.wOutCardUser);
      outMahJong.showOutCard(wViewChairID, data.cbOutCardData, true, false);
      if(data.wOutCardUser == 0 && mainScene._wMeChaird == INVALID_CHAIR)
      {
          handMahJong.node.children[handMahJong.node.childrenCount-1].removeFromParent;
          handMahJong.onActionDown();
          handMahJong.onActionLR();
      }
      gameClock.hideClock();
      return true;
  },
  //发牌
  onSubSendCard:function(data)
  {
      //丢弃牌堆添加
      if(mainScene._wDisCardUser != INVALID_CHAIR && mainScene._cbDisCardData > 0)
      {
          disCardControl.addCardItem(gameLogic.switchViewChairID(mainScene._wDisCardUser), mainScene._bDisCardOut, mainScene._cbDisCardData);
      }


      gameClock.hideClock();
      operateBtn.hideOperate();
      mainScene._cbActionMask    = WIK_NULL;
      mainScene._cbActionCard    = 0;
      mainScene._wCurrentUser    = INVALID_CHAIR;
      //设置剩余牌数
      mainScene._cbLeftCardCount--;
      mainScene.leftNum.setString(mainScene._cbLeftCardCount);
      //显示出牌
      var wViewChairID = gameLogic.switchViewChairID(data.wCurrentUser);
      outMahJong.showOutCard(wViewChairID, data.cbCardData, false, data.bWei);
      if(data.bWei)
      {
          outMahJong.hide();
          //添加吃碰杠牌堆
          var cbCardArray = [data.cbCardData, data.cbCardData, data.cbCardData];
          weaveControl.addWeaveItem(wViewChairID, WIK_WEI, cbCardArray);
          mainScene._wCurrentUser = data.wCurrentUser;
          gameClock.setGameClock(mainScene._wCurrentUser);
          //播放动画
          operateAmt.setAmtInfo(data.wCurrentUser, WIK_WEI, 0);

          mainScene._wDisCardUser    = INVALID_CHAIR;
          mainScene._cbDisCardData   = 0;
          mainScene._bDisCardOut     = true;
      }
      else
      {
          gameLogic.playGenderEffect(data.wCurrentUser, 0, data.cbCardData);
          mainScene._wDisCardUser    = data.wCurrentUser;
          mainScene._cbDisCardData   = data.cbCardData;
          mainScene._bDisCardOut     = false;
      }
  },
  //有玩家操作
  onSubOperateNotify:function(data)
  {
      //用户界面
      if (data.cbActionMask!=WIK_NULL && data.wOperateUser == mainScene._wMeChaird)
      {
          //获取变量
          mainScene._cbActionMask = data.cbActionMask;
          mainScene._cbActionCard = data.cbActionCard;

          //设置界面
          operateBtn.setOperateInfo(mainScene._cbActionMask);
      }
      //计时器
      gameClock.setGameClock(INVALID_CHAIR);
      return true;
  },
  //操作结果
  onSubOperateResult:function(pOperateResult)
  {
      //变量定义
      operateBtn.hideOperate();
      mainScene._cbActionMask    = WIK_NULL;
      mainScene._cbActionCard    = 0;
      var wOperateViewID = gameLogic.switchViewChairID(pOperateResult.wOperateUser);
      //播放动画
      operateAmt.setAmtInfo(pOperateResult.wOperateUser, pOperateResult.cbOperateCode, 0);
      //设置变量
      mainScene._wCurrentUser = pOperateResult.wOperateUser;
      //添加吃碰杠牌堆
      weaveControl.addWeaveItem(wOperateViewID, pOperateResult.cbOperateCode, pOperateResult.cbOperateCard);
      //删除手牌
      if(pOperateResult.wOperateUser == mainScene._wMeChaird)
      {
          mainScene._cbEnableIndex = pOperateResult.cbEnableIndex;
      }
      //隐藏出牌
      outMahJong.hide();
      //计时器
      gameClock.setGameClock(mainScene._wCurrentUser);
      //小相公
      mainScene.isXiaoXiangGong(pOperateResult.wOperateUser, pOperateResult.bXiaoXiangGong);

      //清空出牌数据
      mainScene._wDisCardUser    = INVALID_CHAIR;
      mainScene._cbDisCardData   = 0;
      mainScene._bDisCardOut     = true;
      return true;
  },
    //游戏结束
  onSubGameEnd:function(data)
  {
      var wWinner = INVALID_CHAIR;
      for(var i = 0; i < GAME_PLAYER; i++)
      {
        if (data.lGameScore[i] > 0)
        {
          wWinner = i;
        }
      }
      if(wWinner != INVALID_CHAIR)
      {
          operateAmt.setAmtInfo(wWinner, WIK_CHI_HU, 0);
      }
      tableNode.lbLiuZi.setString('溜子:'+data.lLiuZi);
      //显示偎牌
      weaveControl.showWeiItem();
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
      var cbCardCount = 0;
      for (var i = 0; i < MAX_COUNT; i++) {
          if (data.cbCardData[i] > 0)
          {
              cbCardCount++;
          }
      };
      handMahJong.setCardData(data.cbCardData, cbCardCount);
      operateBtn.setOperateInfo(data.cbUserAction);
      return true;
  },
  //游戏设置
  onSubGameSetResult:function(data)
  {
      if(tableNode.lbMingTang.x != mainScene.ctPosX)
        mainScene.lbMingTangX = tableNode.lbMingTang.x;
      mainScene.strWxShare = "";
      switch(data.cbMingTang)
      {
        case 0:
        tableNode.lbMingTang.setString("小卓版");
        mainScene.strWxShare += '小卓版';
        break;
        case 1:
        tableNode.lbMingTang.setString("大卓版");
        mainScene.strWxShare += '大卓版';
        break;
        case 2:
        tableNode.lbMingTang.setString("全名堂");
        mainScene.strWxShare += '全名堂';
        break;
      }
      if(data.bDouLiuZi)
      {
          tableNode.lbDouLiuZi.visible = true;
          switch(data.cbZXScore)
          {
            case 0:
            tableNode.lbZXScore.setString("20/10/10");
            mainScene.strWxShare += ' 逗溜子(20/10/10;';
            break;
            case 1:
            tableNode.lbZXScore.setString("30/20/20");
            mainScene.strWxShare += ' 逗溜子(30/20/20;';
            break;
            case 2:
            tableNode.lbZXScore.setString("40/30/30");
            mainScene.strWxShare += ' 逗溜子(40/30/30;';
            break;
          }
          tableNode.lbZXScore.visible = true;
          switch(data.cbDeng)
          {
            case 0:
            tableNode.lbDeng.setString("1登=80");
            mainScene.strWxShare += '1登=80)';
            break;
            case 1:
            tableNode.lbDeng.setString("1登=100");
            mainScene.strWxShare += '1登=100)';
            break;
            case 2:
            tableNode.lbDeng.setString("1登=200");
            mainScene.strWxShare += '1登=200)';
            break;
          }
          tableNode.lbDeng.visible = true;
          tableNode.lbMingTang.x = mainScene.lbMingTangX;
      }
      else
      {
          tableNode.lbMingTang.x = mainScene.ctPosX;
      }
      mainScene.onListerMenuShare();
      return true;
  },
  isSitDownEnable:function()
  {
      var t = tableData.isUserSitDownEnable
      tableData.isUserSitDownEnable = function(dwUserID)
      {

          var isInside = false;
          if(mainScene.dwUserID[0] == 0)
            isInside = true;
          else
          {
              for(var i = 0; i < GAME_PLAYER; i++)
              {
                  if(dwUserID == mainScene.dwUserID[i])
                  {
                      isInside = true;
                  }
              }
          }

          return isInside && t(dwUserID)
      }
  },
  isXiaoXiangGong:function(wChaird, bXiaoXiangGong)
  {
      var wViewChaird = gameLogic.switchViewChairID(wChaird);
      if(bXiaoXiangGong)
      {
          tableNode['xxg'+wViewChaird].visible = true;
          tableNode['xxg'+wViewChaird].y = tableData.getChairWithShowChairId(wViewChaird).node.y; 
          if(wViewChaird == 1)
            tableNode['xxg'+wViewChaird].x = tableData.getChairWithShowChairId(wViewChaird).node.x-80;
          else
            tableNode['xxg'+wViewChaird].x = tableData.getChairWithShowChairId(wViewChaird).node.x+80;
      }
      else
      {
          tableNode['xxg'+wViewChaird].visible = false;
      }
  },  
  onListerMenuShare:function()
  {
      wx.onMenuShareAppMessage({
        title: wxData.data.share.title,
        desc: mainScene.strWxShare,
        link: wxData.data.share.link,
        imgUrl: wxData.data.share.imgurl.replace(/\/0/, '/64'),
        trigger: function (res) {
          // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
          // alert('用户点击发送给朋友');
        },
        success: function (res) {
        },
        cancel: function (res) {
        },
        fail: function (res) {
        }
      });

      wx.onMenuShareTimeline({
        title: wxData.data.share.title,
        desc: mainScene.strWxShare,
        link: wxData.data.share.link,
        imgUrl: wxData.data.share.imgurl.replace(/\/0/, '/64'),
        trigger: function (res) {
          // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
          // alert('用户点击发送给朋友');
        },
        success: function (res) {
        },
        cancel: function (res) {
        },
        fail: function (res) {
        }
      });
  },
}