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
          var self = tableData.getUserWithUserId(selfdwUserID)
          var isInTable = tableData.isInTable(self.cbUserStatus); 
          wxVoiceNode.init(topUI.voicePlayNode);
          topUI.voiceNode.addChild(wxVoiceNode.voiceNode);
          //topUI.voiceNode.setVisible( selfdwUserID == tableData.createrUserID || isInTable);

          //表情节点
          var faceIds = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18];   
          var voiceArray = [
            {manText:'哎，都怪我今天风头不好', womanText:'哎，今天风头不好，明天再来过', soundId:1}, 
            {manText:'哎哟，牌打得不错喔', womanText:'废话这么多干嘛，快点出',soundId:2}, 
            {manText:'别催了，别催了，我要想一想', womanText:'刚才跑开了，现在马上出',soundId:3}, 
            {manText:'敢不敢打得更烂一点', womanText:'慢死了，动作快点好不好',soundId:4}, 
            {manText:'今天牌打得顺，下次再约过', womanText:'你打牌之前是不是没洗手', soundId:5},
            {manText:'牌是你打得好啊', womanText:'牌局可以输，牌品不可以输', soundId:6},
            {manText:'为啥还不出', womanText:'这牌也太差了', soundId:7},
            {manText:'怎么这么慢', womanText:'专心打牌，别废话了', soundId:8},
          ]
          var face = facePop2.getFaceButton(faceIds, voiceArray, 6, 3);
          topUI.emoji.addChild(face);
          topUI.emoji.visible = isInTable;

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
      cc.spriteFrameCache.addSpriteFrames(resp.amtOperate2Plist, resp.amtOperate2Res)

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

      var getListenerL = function()
      {   
          var listener = cc.EventListener.create({
              event: cc.EventListener.TOUCH_ONE_BY_ONE,
              swallowTouches: true,
             onTouchBegan: function (touch, event) {
                    if(tableNode.gameOptionNode.visible == false) return false;
                    var locationInNode = tableNode.btnOptionL.convertToNodeSpace(touch.getLocation());
                    var s = tableNode.btnOptionL.getContentSize();
                    var rect = cc.rect(0, 0, s.width, s.height);
                    if (cc.rectContainsPoint(rect, locationInNode)) {
                        return true;
                    }
                    return false;
              },
              onTouchEnded: function (touch, event) {
                    tableNode.gameOptionNode.visible = false;
                    var psResult = getObjWithStructName('CMD_C_GAMEOPTION_RESUTL');
                    psResult.bGameOption = false;
                    socket.sendMessage(MDM_GF_GAME, SUB_C_GAMEOPTION_RESULT, psResult); 
              }
          })
          return listener;
      }
      var getListenerR = function()
      {   
          var listener = cc.EventListener.create({
              event: cc.EventListener.TOUCH_ONE_BY_ONE,
              swallowTouches: true,
             onTouchBegan: function (touch, event) {
                    if(tableNode.gameOptionNode.visible == false) return false;
                    var locationInNode = tableNode.btnOptionR.convertToNodeSpace(touch.getLocation());
                    var s = tableNode.btnOptionR.getContentSize();
                    var rect = cc.rect(0, 0, s.width, s.height);
                    if (cc.rectContainsPoint(rect, locationInNode)) {
                        return true;
                    }
                    return false;
              },
              onTouchEnded: function (touch, event) {
                    tableNode.gameOptionNode.visible = false;
                    var psResult = getObjWithStructName('CMD_C_GAMEOPTION_RESUTL');
                    psResult.bGameOption = true;
                    socket.sendMessage(MDM_GF_GAME, SUB_C_GAMEOPTION_RESULT, psResult); 
              }
          })
          return listener;
      }
      cc.eventManager.addListener(getListenerL(), tableNode.btnOptionL);
      cc.eventManager.addListener(getListenerR(), tableNode.btnOptionR);
      tableNode['huxiNode'+0].visible = false;
      tableNode['huxiNode'+1].visible = false;
      tableNode['huxiNode'+2].visible = false;

      var btnRefresh = new cc.Sprite("#btn_refresh.png");
      tableNode.btnRefreshNode.addChild(btnRefresh);
      var self = tableData.getUserWithUserId(selfdwUserID)
      var isInTable = tableData.isInTable(self.cbUserStatus); 
      tableNode.btnRefreshNode.visible = isInTable;
      var getListenerRefresh = function()
      {   
          var listener = cc.EventListener.create({
              event: cc.EventListener.TOUCH_ONE_BY_ONE,
              swallowTouches: true,
             onTouchBegan: function (touch, event) {
                    if(tableNode.btnRefreshNode.visible == false) return false;
                    var locationInNode = btnRefresh.convertToNodeSpace(touch.getLocation());
                    var s = btnRefresh.getContentSize();
                    var rect = cc.rect(0, 0, s.width, s.height);
                    if (cc.rectContainsPoint(rect, locationInNode)) {
                        return true;
                    }
                    return false;
              },
              onTouchEnded: function (touch, event) {
                    handMahJong.setCardData(handMahJong._cbCardData, handMahJong._cbCardCount, true);
              }
          })
          return listener;
      }
      cc.eventManager.addListener(getListenerRefresh(), btnRefresh);

      var btnTing = new cc.Sprite("#btn_ting.png");
      tableNode.btnTingNode.addChild(btnTing);
      tableNode.btnTingNode.visible = false;

      var getListenerTing = function()
      {   
          var listener = cc.EventListener.create({
              event: cc.EventListener.TOUCH_ONE_BY_ONE,
              swallowTouches: true,
             onTouchBegan: function (touch, event) {
                    if(tableNode.btnTingNode.visible == false) return false;
                    var locationInNode = btnTing.convertToNodeSpace(touch.getLocation());
                    var s = btnTing.getContentSize();
                    var rect = cc.rect(0, 0, s.width, s.height);
                    if (cc.rectContainsPoint(rect, locationInNode)) {
                        return true;
                    }
                    return false;
              },
              onTouchEnded: function (touch, event) {
                    tingWnd.node.visible = true;
              }
          })
          return listener;
      }
      cc.eventManager.addListener(getListenerTing(), btnTing);
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
              mainScene._cbLeftCardCount = 80;
              mainScene.leftNum.setProperty("80", resp.clockNum, 18, 25, "0");
              mainScene.leftNum.setAnchorPoint(cc.p(0.5,0.5));
              tableNode.leftCardNode.addChild(mainScene.leftNum);

              //游戏内容
              handMahJong.init(mainScene.uiPlay);
              outMahJong.init(mainScene.uiPlay);
              disCardControl.init(mainScene.uiPlay);
              weaveControl.init(mainScene.uiPlay);
              operateBtn.init(mainScene.uiPlay);      //初始化吃碰杠胡过操作按钮
              selectChi.init(mainScene.uiPlay);
              selectBi.init(mainScene.uiPlay);
              operateAmt.init(mainScene.uiPlay);      //初始化吃碰杠胡自摸点炮动画管理器
              disPatchAmt.init(mainScene.uiPlay);
              outAmt.init(mainScene.uiPlay);
              tingWnd.init(mainScene.uiPlay);
              mainScene.dwUserID = [];
              mainScene._bDisPatchEnd = false;
              mainScene._bGameStart   = false;
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
      disPatchAmt.clear();
      mainScene._cbLeftCardCount = 80;
      disPatchAmt.init(mainScene.uiPlay);
      mainScene._cbDisCardData = 5;
      mainScene._wBankerUser = 0;
      mainScene._wCurrentUser = INVALID_CHAIR;
      //测试代码
      var cbCardData = [1 ,3 ,3 ,6 ,6 ,8 ,9 ,0x11, 0x12, 0x13, 0x13, 0x14, 0x14 ,0x14 ,0x14, 0x15 ,0x16 ,0x16, 0x1a ,0x1a];
      handMahJong.setCardData(cbCardData, 20, false);
      disPatchAmt.onActionMove();
      outMahJong.showOutCard(1, 2, false, false);
      disCardControl.addCardItem(0, true, 2, false);
      for(var i = 0; i < MAX_WEAVE; i++)
      {
          var cbCardArray = [1, 1, 1, 1];
          weaveControl.addWeaveItem(0, WIK_TI, cbCardArray, 0);
          weaveControl.addWeaveItem(1, WIK_TI, cbCardArray, 0);
          weaveControl.addWeaveItem(2, WIK_TI, cbCardArray, 0);
          disCardControl.addCardItem(0, true, 2, false);
          disCardControl.addCardItem(1, true, 2, false);
          disCardControl.addCardItem(2, true, 2, false);
      }
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
              tableNode.btnRefreshNode.visible = true;
              //topUI.voiceNode.setVisible(selfdwUserID == tableData.createrUserID || event.getUserData())
              
              if(tableData.getUserWithUserId(selfdwUserID).cbUserStatus == US_SIT)
              {
                  socket.sendMessage(MDM_GF_FRAME, SUB_GF_USER_READY)
              }
          }
      })
      cc.eventManager.addListener(l, 1);
      //点击桌面 隐藏多项选择吃
      mainScene.listener = mainScene.getListener();
      cc.eventManager.addListener(mainScene.listener, mainScene.scene);
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
              selectChi.hide();
              selectBi.hide();
              tingWnd.node.visible = false;
          }
      })
      return listener;
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
      mainScene._bChouWei     = false;
      mainScene._bGameStart   = true;
      mainScene._bDisPatchEnd = true;
      tableNode.roomOwnerTTF.visible = false;
      mainScene.reset();
      tableNode.shareButton.setVisible(false);
      mainScene.scene.unschedule(mainScene.updateTableUser);
      //设置变量 
      mainScene._wMeChaird       = gameLogic.getMeChaird();
      mainScene._wBankerUser     = data.wBankerUser;
      mainScene._wCurrentUser    = data.wCurrentUser;
      mainScene._cbLeftCardCount = data.cbLeftCardCount;
      mainScene._cbYingXi        = [0, 0, 0];
      mainScene._cbActionMask    = data.cbActionMask;
      mainScene._cbActionCard    = data.cbActionCard;
      mainScene.dwUserID         = data.dwUserID;
      mainScene._wDisCardUser    = INVALID_CHAIR;
      mainScene._cbDisCardData   = 0;
      mainScene._bDisCardOut     = true;
      mainScene._szNickName      = ["","",""];
      mainScene._szHeadImageUrl  = ["","",""];
      mainScene._bSanTiWuKan     = data.bSanTiWuKan;
      for (var i = 0; i < GAME_PLAYER; i++) {
          mainScene._szNickName[i] = tableData.getUserWithChairId(i).szNickName;
          mainScene._szHeadImageUrl[i] = tableData.getUserWithChairId(i).szHeadImageUrlPath;
      };
      //设置庄家
      mainScene.setBankerIcon(mainScene._wBankerUser,true);
      //设置剩余牌数
      mainScene.leftNum.setString(mainScene._cbLeftCardCount);

      //设置弃牌牌堆
      for (var i = 0; i < GAME_PLAYER; i++) {
          for (var k = 0; k < data.cbDiscardCount[i]; k++) {
              if(data.cbDiscardCard[i][k] != 0)
                disCardControl.addCardItem(gameLogic.switchViewChairID(i), true, data.cbDiscardCard[i][k], true);
              else
                disCardControl.addCardItem(gameLogic.switchViewChairID(i), false, data.cbJiePaiData[i][k], true);
          };
      };
  
      //设置吃碰杠牌堆
      for (var i = 0; i < GAME_PLAYER; i++) {
          var wViewChairID = gameLogic.switchViewChairID(i);
          for (var k = 0; k < data.cbWeaveCount[i]; k++) {
              weaveControl.addWeaveItem(wViewChairID, data.WeaveItemArray[i][k].cbWeaveKind, data.WeaveItemArray[i][k].cbCardData, INVALID_CHAIR, data.WeaveItemArray[i][k].cbPublicCard);
          };
      };
      //设置操作管理器
      if(mainScene._wCurrentUser == INVALID_CHAIR)
      {
          if(data.wOutCardUser != INVALID_CHAIR)
          {
              outMahJong.showOutCard(gameLogic.switchViewChairID(data.wOutCardUser), data.cbOutCardData, true, false);
              if (!data.bWei)
              {
                mainScene._wDisCardUser    = data.wOutCardUser;
                mainScene._cbDisCardData   = data.cbOutCardData;
                mainScene._bDisCardOut     = false;
              }
          }
          else if(data.cbSendCardData != 0)
          {
              outMahJong.showOutCard(gameLogic.switchViewChairID(data.wSendChaird), data.cbSendCardData, false, false);
              if (!data.bWei)
              {
                mainScene._wDisCardUser    = data.wSendChaird;
                mainScene._cbDisCardData   = data.cbSendCardData;
                mainScene._bDisCardOut     = false;
              }
          }
      }
      operateBtn.setOperateInfo(mainScene._cbActionMask);
      //设置本地玩家手牌
      handMahJong.setCardData(data.cbCardData, data.cbCardCount, true);
      //计时器
      gameClock.setGameClock(mainScene._wCurrentUser);
      //小相公
      for (var i = 0; i < GAME_PLAYER; i++)
      {
          mainScene.isXiaoXiangGong(i, data.bXiaoXiangGong[i]);
      };
      //游戏设置
      mainScene.onSubGameOption(data.bGameOption);
      //黄番
      mainScene.showHuangFan(data.cbHuangZhuang);
      //听牌
      if (mainScene._wCurrentUser != mainScene._wMeChaird && mainScene._wMeChaird != INVALID_CHAIR) 
      {
          tingWnd.updataTing(mainScene._wMeChaird);
      }
  },
  //游戏开始
  onSubGameStart:function(data)
  {   
      gameEnd.clearGameData();
      mainScene.scene.unschedule(mainScene.updateTableUser);
      tableNode.roomOwnerTTF.visible = false;
      //设置变量 
      mainScene._bChouWei        = false;
      mainScene._bPao            = false;
      mainScene._dataPao         = {};
      mainScene._newData         = {};
      mainScene._bGameStart      = true;
      mainScene._wMeChaird       = gameLogic.getMeChaird();
      mainScene._wBankerUser     = data.wBankerUser;
      mainScene._wCurrentUser    = data.wCurrentUser;
      mainScene._cbLeftCardCount = 80;
      mainScene._cbYingXi        = [0, 0, 0];
      mainScene._cbActionMask    = data.cbUserAction;
      mainScene._wDisCardUser    = INVALID_CHAIR;
      mainScene._cbDisCardData   = data.cbSendCard;
      mainScene._bDisCardOut     = true;
      mainScene._szNickName      = ["","",""];
      mainScene._szHeadImageUrl  = ["","",""];
      mainScene._cbActionBk      = data.cbUserActionBk;
      mainScene._cbCardTi        = data.cbCardTi;
      mainScene._bDisPatchEnd    = false;
      mainScene._bSanTiWuKan     = data.bSanTiWuKan;
      for (var i = 0; i < GAME_PLAYER; i++) {
          mainScene._szNickName[i] = tableData.getUserWithChairId(i).szNickName;
          mainScene._szHeadImageUrl[i] = tableData.getUserWithChairId(i).szHeadImageUrlPath;
      };
      //黄番
      mainScene.showHuangFan(data.cbHuangZhuang);
      //设置庄家
      for (var i = 0; i < GAME_PLAYER; i++) {
          mainScene.setBankerIcon(i,false);
      }
      mainScene.setBankerIcon(mainScene._wBankerUser,true);
      //设置本地玩家手牌
      handMahJong.setCardData(data.cbCardData, MAX_COUNT-1, false);
      //发牌动画
      disPatchAmt.onActionMove();
      mainScene.leftNum.setString(mainScene._cbLeftCardCount);
      return true;
  },
  //有玩家出牌
  onSubOutCard:function(data)
  {
      mainScene.isDisPatchEnd();
      operateBtn.hideOperate();
      mainScene._bChouWei     = false;
      mainScene._bPao         = false;
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
          var child = handMahJong.node.children[handMahJong.node.childrenCount-1];
          child.visible = false;
          child.removeFromParent();
          handMahJong.onActionDown();
          handMahJong.onActionLR();
      }
      tingWnd.updataTing(data.wOutCardUser);
      tingWnd.updataLeftCard();
      return true;
  },
  //发牌
  onSubSendCard:function(data)
  {
      mainScene._bPao         = false;
      mainScene.isDisPatchEnd();
      //丢弃牌堆添加
      if(mainScene._wDisCardUser != INVALID_CHAIR && mainScene._cbDisCardData > 0)
      {
          disCardControl.addCardItem(gameLogic.switchViewChairID(mainScene._wDisCardUser), mainScene._bDisCardOut, mainScene._cbDisCardData, false);
      }

      operateBtn.hideOperate();
      mainScene._cbActionMask    = WIK_NULL;
      mainScene._cbActionCard    = 0;
      //mainScene._wCurrentUser    = INVALID_CHAIR;
      mainScene._bChouWei        = data.bChouWei;
      //设置剩余牌数
      mainScene._cbLeftCardCount--;
      mainScene.leftNum.setString(mainScene._cbLeftCardCount);
      //显示出牌
      var wViewChairID = gameLogic.switchViewChairID(data.wCurrentUser);
      outMahJong.showOutCard(wViewChairID, data.cbCardData, false, data.cbUserAction&WIK_WEI, data.cbUserAction&WIK_TI);

      if(data.cbUserAction&(WIK_WEI | WIK_TI))
      {
          if(!(data.cbUserAction & WIK_WEI))
          {
              gameLogic.playGenderEffect(data.wCurrentUser, 0, data.cbCardData);
          }
          mainScene._newData = {};
          mainScene._newData.wOperateUser = data.wCurrentUser;
          mainScene._newData.cbOperateCode = data.cbUserAction;
          mainScene._newData.cbCardTi = data.cbCardTi.concat();
          mainScene._cbDisCardData = data.cbCardData;
          if(data.bNextJiePai)
          {
              mainScene._wDisCardUser    = data.wCurrentUser;
              mainScene._cbDisCardData   = data.cbCardData;
              mainScene._bDisCardOut     = false;
          }
      }
      else
      {
          gameLogic.playGenderEffect(data.wCurrentUser, 0, data.cbCardData);
          mainScene._wDisCardUser    = data.wCurrentUser;
          mainScene._cbDisCardData   = data.cbCardData;
          mainScene._bDisCardOut     = false;
      }
      tingWnd.updataLeftCard();
  },
  //有玩家操作
  onSubOperateNotify:function(data)
  {
      mainScene.isDisPatchEnd();
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
      mainScene.isDisPatchEnd();

      //变量定义
      operateBtn.hideOperate();
      mainScene._cbActionMask    = WIK_NULL;
      mainScene._cbActionCard    = 0;
      var wOperateViewID = gameLogic.switchViewChairID(pOperateResult.wOperateUser);

      //提
      for(var k = 0; k < MAX_WEAVE; k++)
      {
        if(pOperateResult.cbCardTi[k] == 0) break;
        var cbCardArray = [pOperateResult.cbCardTi[k], pOperateResult.cbCardTi[k], pOperateResult.cbCardTi[k], pOperateResult.cbCardTi[k]];
        var nIndex = 0;
        if(mainScene._wMeChaird == INVALID_CHAIR)
        {
          nIndex = 2;
        }
        weaveControl.addWeaveItem(wOperateViewID, WIK_TI, cbCardArray, nIndex);
      }


      //播放动画
      operateAmt.setAmtInfo(pOperateResult.wOperateUser, pOperateResult.cbOperateCode, 0);
      //设置变量
      if(pOperateResult.cbEnableOut < 2)
        mainScene._wCurrentUser = pOperateResult.wOperateUser;
      else
        mainScene._wCurrentUser = INVALID_CHAIR;
      //添加吃碰杠牌堆
      weaveControl.addWeaveItem(wOperateViewID, pOperateResult.cbOperateCode, pOperateResult.cbOperateCard, 1);
      weaveControl.addWeaveItem(wOperateViewID, pOperateResult.cbOperateCode, pOperateResult.cbOperateCard1, 0);
      weaveControl.addWeaveItem(wOperateViewID, pOperateResult.cbOperateCode, pOperateResult.cbOperateCard2, 0);

      //计时器
      gameClock.setGameClock(mainScene._wCurrentUser);
      //小相公
      mainScene.isXiaoXiangGong(pOperateResult.wOperateUser, pOperateResult.bXiaoXiangGong);

      //清空出牌数据
      mainScene._wDisCardUser    = INVALID_CHAIR;
      mainScene._cbDisCardData   = 0;
      mainScene._bDisCardOut     = true;

      outMahJong.hide();

      tingWnd.updataLeftCard();
      return true;
  },
  //提 偎
  onSubOperateTPW:function(data)
  {
      mainScene._bPao         = false;
      mainScene.isDisPatchEnd();
      mainScene._wCurrentUser = data.wOperateUser;
      var wViewChairID = gameLogic.switchViewChairID(data.wOperateUser);
      //播放动画
      if (data.cbOperateCode & WIK_WEI)
      {
        operateAmt.setAmtInfo(data.wOperateUser, WIK_WEI, 0);
      }
      else if (data.cbOperateCode & WIK_TI)
      {
        var cbOperateCode = WIK_TI;
        for(var i = 0; i < MAX_WEAVE; i++)
        {
            var cbWeaveKind = weaveControl.cbWeaveArray[wViewChairID][i].cbWeaveKind;
            if(cbWeaveKind == WIK_TI || cbWeaveKind == WIK_PAO)
            {
                cbOperateCode = WIK_BAKUAI;
                mainScene._wCurrentUser = INVALID_CHAIR;
                break;
            }
        }
        operateAmt.setAmtInfo(data.wOperateUser, cbOperateCode, 0);
      }
      //庄家 提 偎 操作
      //添加吃碰杠牌堆
      var bDisCard = true;
      if(data.cbOperateCode & WIK_TI)
      {
          for(var k = 0; k < MAX_WEAVE; k++)
          {
            if(data.cbCardTi[k] == 0) break;
            if (mainScene._cbDisCardData == data.cbCardTi[k]) 
            {
                bDisCard = false;
            }
            var bSelf = true;
            for(var i = 0; i < weaveControl.cbWeaveCount[wViewChairID]; i++)
            {
                if(weaveControl.cbWeaveArray[wViewChairID][i].cbCardArray[0] == data.cbCardTi[k])
                {
                    weaveControl.modifyWeaveItem(wViewChairID, i, WIK_TI, data.cbCardTi[k]);
                    bSelf = false;
                }
            }
            if(bSelf)
            {
                var cbCardArray = [data.cbCardTi[k], data.cbCardTi[k], data.cbCardTi[k], data.cbCardTi[k]];
                var nIndex = 0;
                if(mainScene._wMeChaird == INVALID_CHAIR)
                {
                  nIndex = 2;
                }
                weaveControl.addWeaveItem(wViewChairID, WIK_TI, cbCardArray, nIndex);
            }
          }
      }
      if(data.cbOperateCode & WIK_WEI)
      {
          var cbCardArray = [mainScene._cbDisCardData, mainScene._cbDisCardData, mainScene._cbDisCardData, 0];
          weaveControl.addWeaveItem(wViewChairID, WIK_WEI, cbCardArray, 1);
          bDisCard = false;
      }

      if(data.bInsert)
      {
          handMahJong.insertCard();
      }
      
      gameClock.setGameClock(mainScene._wCurrentUser);

      if (!bDisCard) 
      {
          outMahJong.hide();
          mainScene._wDisCardUser    = INVALID_CHAIR;
          mainScene._cbDisCardData   = 0;
          mainScene._bDisCardOut     = true;
      }
    
      tingWnd.updataLeftCard();
  },
  //跑
  onSubOperatePao:function(data)
  {
      mainScene.isDisPatchEnd();
      operateBtn.hideOperate();
      var wViewChairID = gameLogic.switchViewChairID(data.wOperateUser);
      //小相公
      mainScene.isXiaoXiangGong(data.wOperateUser, data.bXiaoXiangGong);

      for(var k = 0; k < MAX_WEAVE; k++)
      {
        if(data.cbCardTi[k] == 0) break;
        var cbCardArray = [data.cbCardTi[k], data.cbCardTi[k], data.cbCardTi[k], data.cbCardTi[k]];
        var nIndex = 0;
        if(mainScene._wMeChaird == INVALID_CHAIR)
        {
          nIndex = 2;
        }
        weaveControl.addWeaveItem(wViewChairID, WIK_TI, cbCardArray, nIndex);
      }

      if (data.bZhenPao)
      {
          mainScene._wCurrentUser = data.wOperateUser;
          //播放动画
          var cbOperateCode = WIK_PAO;
          for(var i = 0; i < MAX_WEAVE; i++)
          {
              var cbWeaveKind = weaveControl.cbWeaveArray[wViewChairID][i].cbWeaveKind;
              if(cbWeaveKind == WIK_TI || cbWeaveKind == WIK_PAO)
              {
                  cbOperateCode = WIK_BAKUAI;
                  mainScene._wCurrentUser = INVALID_CHAIR;
                  tingWnd.updataTing(data.wOperateUser);
                  break;
              }
          }
          operateAmt.setAmtInfo(data.wOperateUser, cbOperateCode, 0);

          //设置数据
          if(data.cbWeaveIndex == INVALID_INDEX)
          {
              var cbCardArray = [mainScene._cbDisCardData, mainScene._cbDisCardData, mainScene._cbDisCardData, mainScene._cbDisCardData];
              var nIndex = 1;
              if(mainScene._wMeChaird == INVALID_CHAIR)
              {
                nIndex = 0;
              }
              weaveControl.addWeaveItem(wViewChairID, WIK_PAO, cbCardArray, nIndex);
          }
          else
          {
              weaveControl.modifyWeaveItem(wViewChairID, data.cbWeaveIndex, WIK_PAO, mainScene._cbDisCardData);
          }
          gameClock.setGameClock(mainScene._wCurrentUser);
          mainScene._wDisCardUser    = INVALID_CHAIR;
          mainScene._cbDisCardData   = 0;
          mainScene._bDisCardOut     = true;
          outMahJong.hide();
      }
      else
      {
          mainScene._wCurrentUser = INVALID_CHAIR;
      }

      if (data.cbActionMask!=WIK_NULL && data.wOperateUser == mainScene._wMeChaird && data.cbActionMask!=WIK_PAO)
      {
          //获取变量
          mainScene._cbActionMask = data.cbActionMask;

          //设置界面
          operateBtn.setOperateInfo(mainScene._cbActionMask);
      }

      tingWnd.updataLeftCard();
  },
  //游戏结束
  onSubGameEnd:function(data)
  {
      mainScene._bGameStart  = false;
      outAmt.actNode.visible = false;
      var wWinner = INVALID_CHAIR;
      for(var i = 0; i < GAME_PLAYER; i++)
      {
        if (data.lGameScore[i] > 0)
        {
          wWinner = i;
        }
      }
      if(wWinner != INVALID_CHAIR && !data.bLiuJu)
      {
          operateAmt.setAmtInfo(wWinner, WIK_CHI_HU, 0);
      }
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
      mainScene._bSanTiWuKan     = data.bSanTiWuKan;
      handMahJong.setCardData(data.cbCardData, cbCardCount, true);
      operateBtn.setOperateInfo(data.cbUserAction);
      return true;
  },
  //游戏设置
  onSubGameOption:function(bGameOption)
  {
      if (bGameOption)
      {
          tableNode.lbOption.setString('全名堂2');
          mainScene._cbMingTang = 1;
      }
      else
      {
          tableNode.lbOption.setString('全名堂1');
          mainScene._cbMingTang = 0;
      }
      mainScene.onListerMenuShare();
  },
  gameSetOption:function()
  {
      if (selfdwUserID == tableData.createrUserID)
      {
          tableNode.gameOptionNode.visible = true;
      }
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
  //收到消息  没发完牌的玩家中断发牌 显示手牌 
  isDisPatchEnd:function()
  {
      outAmt.actNode.visible = false;
      if(mainScene._bDisPatchEnd) return ;
      mainScene._bDisPatchEnd = true;
      mainScene._cbLeftCardCount = 19;
      mainScene.leftNum.setString(mainScene._cbLeftCardCount);
      disPatchAmt.node.unschedule(disPatchAmt.onActionMove);
      handMahJong.setCardData(handMahJong._cbCardData, handMahJong._cbCardCount, true);
  },
  //显示黄番
  showHuangFan:function(cbHuangZhuang)
  {
      if (cbHuangZhuang > 0)
      {
          var strHuangFan = '黄番:'+cbHuangZhuang;
          tableNode.lbHuangFan.setString(strHuangFan);
          tableNode.lbHuangFan.visible = true;
      }
      else
      {
          tableNode.lbHuangFan.visible = false;
      }
  },
  onListerMenuShare:function()
  {
      wx.onMenuShareAppMessage({
        title: wxData.data.share.title,
        desc: tableNode.lbOption.getString(),
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
        desc: tableNode.lbOption.getString(),
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