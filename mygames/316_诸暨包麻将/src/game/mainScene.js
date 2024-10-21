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
          //record
          if ( isRecordScene )
              recordNode.openPop(mainScene.top)
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
           // sendLogToServer(gameLog.logS + 'wtms316 wtms');
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

      var l = cc.EventListener.create({
          event: cc.EventListener.CUSTOM,
          eventName: "recordPlayStart",
          callback: function(event)
          {   
              tableNode.remainOpenTimeTTF.visible = false;
              tableNode.remainOpenTimeTTF2.visible = false;
              tableNode.roundTimeNode.visible = false;
              tableNode.waitStartTTF.setVisible(false)
          }
      })
      cc.eventManager.addListener(l, 1)

      //点击桌面 麻将落下
      mainScene.listener = mainScene.getListener();
      cc.eventManager.addListener(mainScene.listener, mainScene.scene);
  },
  gameSetInfo:function(data)
  {
      mainScene._cbCun = data.cbCun;
      tableNode.labelCunResult.visible = true;
      if(mainScene._cbCun&CUN_SURE)
        tableNode.labelCunResult.setString("规则:存");
      else  if(mainScene._cbCun&CUN_CANCEL)
        tableNode.labelCunResult.setString("规则:不存");

     if(mainScene._cbCun == CUN_NULL)
        topUI.nodeCunType.visible = true;
      else 
        topUI.nodeCunType.visible = false

      mainScene._isReady = true;
  },
  initCallBack:function()
  {
      var chr_str = 
      [
        "无财",
        "独",
        "",
      ];

      topUI.callUnBaoTai = function()
      {
          var operateMsg = getObjWithStructName('CMD_C_DINGTAI');
          operateMsg.cbTaiCount = 0;
          operateMsg.cbMagicCount = 0;
          socket.sendMessage(MDM_GF_GAME, SUB_C_DINGTAI, operateMsg); 

          topUI.nodeDingTai.visible = false
      }
      topUI.callBaoTai = function()
      {
          var operateMsg = getObjWithStructName('CMD_C_DINGTAI');
          operateMsg.cbTaiCount = mainScene._cbTaiCount;
          operateMsg.cbMagicCount = mainScene._cbMagicCount;
          socket.sendMessage(MDM_GF_GAME, SUB_C_DINGTAI, operateMsg); 

          topUI.nodeDingTai.visible = false
      }
      topUI.callDicBaoTai = function()
      {
          if(mainScene._cbMagicCount+1 <=2)
          {
              mainScene._cbMagicCount++
          }
          else
          {
              mainScene._cbMagicCount = 0
              mainScene._cbTaiCount--
          }
          /////////////////////

          if(mainScene._cbTaiCount < mainScene._cbMinTaiCount)
          {
              mainScene._cbTaiCount = mainScene._cbMinTaiCount
              mainScene._cbMagicCount = mainScene._cbMaxMagicCount
              return
          }

          if(mainScene._cbMagicCount > mainScene._cbMaxMagicCount
            &&mainScene._cbTaiCount == mainScene._cbMinTaiCount)
          {
              mainScene._cbTaiCount = mainScene._cbMinTaiCount
              mainScene._cbMagicCount = mainScene._cbMaxMagicCount
              return
          }

          topUI.labelBaoTaiNumber.setString(chr_str[mainScene._cbMagicCount]+mainScene._cbTaiCount+"台");
      }
      topUI.callIncBaoTai = function()
      {
          if(mainScene._cbMagicCount-1 >=0)
          {
              mainScene._cbMagicCount--
          }
          else
          {
              mainScene._cbMagicCount =2
              mainScene._cbTaiCount++
          }
          /////////////////////

          if(mainScene._cbTaiCount >=MAX_TAI_COUNT&&mainScene._cbMagicCount<2)
          {
              mainScene._cbTaiCount = MAX_TAI_COUNT
              mainScene._cbMagicCount = 2
              return
          }
          topUI.labelBaoTaiNumber.setString(chr_str[mainScene._cbMagicCount]+mainScene._cbTaiCount+"台");
      }


      topUI.callCS= function()
      {
          if(handMahJong.cbMagicCard[0]==0x00 &&handMahJong.cbMagicCard[1]==0x00)
              return;

         if(handMahJong.cbMagicCard[0]==0x00 ||handMahJong.cbMagicCard[1]==0x00)
           {
              //可选两张时，只选择一张。就默认向上选择一张
              if(mainScene._cbMagicCount == 2)
              {
                  for(var i=0;i<2;i++)
                  {
                      if(handMahJong.cbMagicCard[i]!=0x00)
                      {
                          //有相邻牌，选择则一张
                          var changeIndex = 0;

                          if(i==0)
                          {
                              changeIndex =1;
                          }
                          else if(i==1)
                          {
                              changeIndex =0;
                          }
                          var cbCarlor = (handMahJong.cbMagicCard[i]&MASK_COLOR) >>4;
                          var cbValue = handMahJong.cbMagicCard[i]&MASK_VALUE;
   
                          if(cbCarlor<3)
                          {
                            if(cbValue==9)
                            {
                                handMahJong.cbMagicCard[changeIndex] = handMahJong.cbMagicCard[i]-8;
                            }
                            else
                            {
                                handMahJong.cbMagicCard[changeIndex] = handMahJong.cbMagicCard[i]+1;
                            }
                          }
                          else
                          {
                              if(cbValue==4)
                              {
                                  handMahJong.cbMagicCard[changeIndex] = handMahJong.cbMagicCard[i]-3;
                              }
                              else if(cbValue==7)
                              {
                                  handMahJong.cbMagicCard[changeIndex] = handMahJong.cbMagicCard[i]-2;
                              }
                              else
                              {
                                  handMahJong.cbMagicCard[changeIndex] = handMahJong.cbMagicCard[i]+1;
                              }
                          }
                          break;
                      }
                  }
              }
           }
         
          var operateMsg = getObjWithStructName('CMD_C_DINGCS');
          operateMsg.cbMagicCard[0]=handMahJong.cbMagicCard[0];
          operateMsg.cbMagicCard[1]=handMahJong.cbMagicCard[1];

          topUI.buttonDingCS.visible=false;
          topUI.buttonRenSu.visible = false;
          socket.sendMessage(MDM_GF_GAME, SUB_C_DINGCS, operateMsg); 
          
      }

      topUI.callBuCun= function()
      {
         topUI.nodeCunType.visible=false;
         var operateMsg = getObjWithStructName('CMD_C_CUN');
         operateMsg.cbCun = CUN_CANCEL;
         socket.sendMessage(MDM_GF_GAME, SUB_C_CUN, operateMsg); 
      }

      topUI.callCun= function()
      {
          topUI.nodeCunType.visible=false;
          var operateMsg = getObjWithStructName('CMD_C_CUN');
          operateMsg.cbCun = CUN_SURE;
          socket.sendMessage(MDM_GF_GAME, SUB_C_CUN, operateMsg); 
      }

      topUI.callRenSu = function()
      {
          topUI.buttonDingCS.visible=false;
          topUI.buttonRenSu.visible = false;

          var operateMsg = getObjWithStructName('CMD_C_LIUJU');
          operateMsg.bLiuJu = true;
          socket.sendMessage(MDM_GF_GAME, SUB_C_LIUJU, operateMsg); 
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
        if (handMahJong.isMagicCard(cbCardData))
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
      topUI.nodeCunType.visible = false
      mainScene.reset();
      tableNode.shareButton.setVisible(false);
      mainScene.scene.unschedule(mainScene.updateTableUser);
      mainScene._cbTaiCount      = 0;
      mainScene._cbMagicCount    = 0;
      mainScene._wBaoUser        = data.wBaoUser;
      mainScene._cbMinTaiCount   = 0;
      mainScene._cbMaxMagicCount = 0;
      mainScene._cbCun           = 0;
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
      mainScene._cbMinTaiCount    = data.cbMinTaiCount;
      mainScene._cbMaxMagicCount  = data.cbMaxMagicCount;
      mainScene._cbTaiCount       = mainScene._cbMinTaiCount ;
      mainScene._cbMagicCount     = mainScene._cbMaxMagicCount;
      mainScene._bDingCSEnd       = false;
      tableNode.labelLaoZhuang.visible = false
       //是否老庄
      if(data.bLaoZhuang)
           tableNode.labelLaoZhuang.visible = true


      if(data.bAlreadySureMagic)
      {
          tableNode['spriteBaoFlag'+gameLogic.switchViewChairID(data.wBaoUser)].visible = true;
       
          //显示财神
          for(var i=0;i<MAX_CS_TYPE;i++)
          {
              handMahJong.cbMagicCard[i]=data.cbMagicCard[i];
          }

          //显示定台结果
           var chr_str = 
          [
              "无财",
              "独",
              "",
          ];

          var str = chr_str[mainScene._cbMagicCount]+mainScene._cbTaiCount +"台"; 
          tableNode.labelTaiResult.visible = true;
          tableNode.labelTaiResult.setString(str);
      }

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

      handMahJong.handDataExcEx(" onEventScenePlay: ", mainScene._cbCardData, data.cbCardCount);
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
          handMahJong.setCardEnable(false,true); 
      }
      else
      {
          handMahJong.cbCantEatCard  = data.cbPreEatCard;
          handMahJong.setCardEnable(true,true); 
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
                  handMahJong.setCardEnable(true,true);
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
        handMahJong.setCardEnable(false,true);
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

      var chr_str = 
          [
              "无财",
              "独",
              "",
          ];


      if(data.bAlreadySureMagic)
      {
          mainScene._bDingCSEnd = true;
          //显示财神
          for(var i=0;i<MAX_CS_TYPE;i++)
          {
              handMahJong.cbMagicCard[i] = 0
              if(data.cbMagicCard[i])
              {
                  handMahJong.cbMagicCard[i]=data.cbMagicCard[i];
                  tableNode["spriteLaizi"+i].visible=true
                  tableNode["laizipiNode"+i].addChild(weaveControl.create(0, data.cbMagicCard[i]));
              }
          }

          handMahJong.showMagicCard()
      }
      else if(data.wBaoUser!=INVALID_CHAIR)
      {
          mainScene._bDingCSEnd = true;
          buHua.hideBuHua()
          if(data.wBaoUser == mainScene._wMeChaird)
          {
              handMahJong.isXuanCS = true;
              if(mainScene._cbMagicCount)
                topUI.buttonDingCS.visible = true
              else handMahJong.isXuanCS = false
              mainScene._cbMagicCount = data.cbMaxMagicCount;
              
              handMahJong.setCardEnable(true);
          }
          else
          {
              handMahJong.setCardEnable(false);
          }
 
          var str = chr_str[data.tUserDingTaiData[data.wBaoUser].cbMagicCount]+data.tUserDingTaiData[data.wBaoUser].cbTaiCount +"台"; 
          tableNode.labelTaiResult.visible = true;
          tableNode.labelTaiResult.setString(str);
          if(data.bQianZhiDingTai && mainScene._wMeChaird == data.wBaoUser)
          {
              topUI.buttonRenSu.visible = true;
          }
          else topUI.buttonRenSu.visible = false;

          gameClock.setGameClock(data.wBaoUser);

          tableNode['spriteBaoFlag'+gameLogic.switchViewChairID(data.wBaoUser)].visible = true;
      }
      else
      {
          //显示定台情况
          handMahJong.setCardEnable(false);

          
          if(data.wCurrentDingTaiUser==mainScene._wMeChaird)
          {
             
              topUI.labelBaoTaiNumber.setString(chr_str[mainScene._cbMaxMagicCount]+mainScene._cbMinTaiCount+"台");
              topUI.nodeDingTai.visible = true
              //topUI.spriteBaoTai.visible = false
          }
          else
          {
              //topUI.spriteBaoTai.visible = true
              topUI.nodeDingTai.visible = false
          }

          for(var i=0;i<GAME_PLAYER;i++)
          {
              var str = "";
              var wChair=gameLogic.switchViewChairID(i) 
              if(data.tUserDingTaiData[i].bAlreadyDingTai)//无台
              {
                  topUI["labelBaoTai"+wChair].visible = true;
                  topUI["labelBaoTai"+wChair].setString("不包");
              }
              else
              {
                  topUI["labelBaoTai"+wChair].visible=false
                  
                  if(data.tUserDingTaiData[i].cbTaiCount<2)
                      continue;

                  str = chr_str[data.tUserDingTaiData[i].cbMagicCount]+data.tUserDingTaiData[i].cbTaiCount +"台"; 
              
                  topUI["labelBaoTai"+wChair].visible = true;
                  topUI["labelBaoTai"+wChair].setString(str);

              }
          }
      }
      mainScene._cbCun = data.cbCun;
      if(data.cbCun&CUN_SURE)
      {
        tableNode.labelCunResult.visible = true;
        tableNode.labelCunResult.setString("规则:存");
      }
      else  if(data.cbCun&CUN_CANCEL)
      {
        tableNode.labelCunResult.visible = true;
        tableNode.labelCunResult.setString("规则:不存");
      }

      if(data.bReCheckTai)
      {
         topUI.buttonBuBao.visible = false;
      }
      else topUI.buttonBuBao.visible = true;

      // 判断是否手上都是非可出牌
      var bAllLimit = true;
      for(var i=0;i<handMahJong.cbCardCount;i++)
      {
        if(handMahJong.cbCardData[i]!=handMahJong.cbCantEatCard[0] && handMahJong.cbCardData[i]!=handMahJong.cbCantEatCard[1])
        {
          bAllLimit = false;
          break;
        }
        if(!bAllLimit)
          break;
      }

      if(bAllLimit)
      {
        handMahJong.cbCantEatCard[0]=0x00;
        handMahJong.cbCantEatCard[1]=0x00;
      }
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
      tableNode.roomOwnerTTF.visible = false;
      tableNode.labelTaiResult.visible = false;
      topUI.nodeCunType.visible = false
      gameEnd.clearGameData();
      tableMahJong.clearCardData();

      buHua.hideBuHua()
  		//设置变量
      mainScene._cbTaiCount      = 0;
      mainScene._cbMagicCount    = 0;

      mainScene._cbMinTaiCount   = 0;
      mainScene._cbMaxMagicCount = 0;
      handMahJong.cbMagicCard=[]
      handMahJong.cbMagicCard[0]=0;
      handMahJong.cbMagicCard[1]=0;
      handMahJong.cbCantEatCard[0] = 0x00;
      handMahJong.cbCantEatCard[1] = 0x00;
      mainScene._cbTokenCard      = 0;//本家最近摸的牌
      mainScene._bIsListened      = false; //本家是否已听牌的标志
      mainScene._wMeChaird        = gameLogic.getMeChaird();
  		mainScene._wBankerUser      = data.wBankerUser;
  		mainScene._wCurrentUser     = data.wBankerUser;
  		mainScene._cbLeftCardCount  = data.cbLeftCardCount;
      mainScene._cbCardData       = [];
      if(mainScene._wMeChaird != INVALID_CHAIR)
      {
          mainScene._cbCardData      = data.cbCardData[mainScene._wMeChaird];
      }
      mainScene._cbRecordData    = [];
      if (isRecordScene) 
      {
         mainScene._cbRecordData = data.cbCardData;
      }

      mainScene._cbActionMask     = data.cbUserAction;
      mainScene._cbMagicIndex     = data.cbMagicIndex;
      mainScene._szNickName       = ["","","",""];
      mainScene._bMustBuHua       = data.bMustBuHua;
      mainScene._cbSice1          = data.cbSice1;
      mainScene._cbSice2          = data.cbSice2;
      mainScene._bOutCard         = false;
      mainScene._cbHuaCardData    = [];
      mainScene._bDingCSEnd       = false;
      
      tableNode.labelLaoZhuang.visible = false
       //是否老庄
      if(data.bLaoZhuang)
           tableNode.labelLaoZhuang.visible = true

      topUI.nodeCunType.visible = false;
      for(var i=0;i<GAME_PLAYER;i++)
        tableNode['spriteBaoFlag'+i].visible = false;

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

      handMahJong.handDataExcEx(" onSubGameStart1: ", mainScene._cbCardData, MAX_COUNT);
      mainScene.sortHandCard(mainScene._cbCardData);
      handMahJong.handDataExcEx(" onSubGameStart2: ", mainScene._cbCardData, MAX_COUNT);

      //设置计时器背景方向
      gameClock.setClockInfo();
      //设置手牌
      mainScene.delayLoadCard();
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

      mainScene._cbCun = data.cbCun;
     if(data.cbCun&CUN_SURE)
      {
        tableNode.labelCunResult.visible = true;
        tableNode.labelCunResult.setString("规则:存");
      }
      else  if(data.cbCun&CUN_CANCEL)
      {
        tableNode.labelCunResult.visible = true;
        tableNode.labelCunResult.setString("规则:不存");
      }

      return true;
	},
  delayLoadCard:function()
  {
      //显示其他三家玩家牌背
      otherMahJong.setCardData(true);
      if (isRecordScene) 
      {
          var cbRecordData = [];
          for(var i = 0; i < GAME_PLAYER; i++)
          {
              cbRecordData[gameLogic.switchViewChairID(i)] = mainScene._cbRecordData[i];
              cbRecordData[gameLogic.switchViewChairID(i)].sort(function(a,b){return b-a;});
          }
          otherMahJong.setRecordData(gameLogic.switchViewChairID(mainScene._wBankerUser), cbRecordData);
      }
      if (mainScene._wCurrentUser == mainScene._wMeChaird || (mainScene._wMeChaird == INVALID_CHAIR && mainScene._wCurrentUser == 0))
      {
          handMahJong.handDataExcEx(" delayLoadCard1: ", mainScene._cbCardData, MAX_COUNT);
          //设置本地玩家手牌
          handMahJong.setCardData(mainScene._cbCardData, MAX_COUNT, true);
      }
      else
      {
          handMahJong.handDataExcEx(" delayLoadCard2: ", mainScene._cbCardData, MAX_COUNT-1);
          //设置本地玩家手牌
          handMahJong.setCardData(mainScene._cbCardData, MAX_COUNT-1, false);
          //设置本地玩家手牌不可点击
          handMahJong.setCardEnable(false); 
          //显示庄家发牌牌背
          otherMahJong.sendCardData(gameLogic.switchViewChairID(mainScene._wBankerUser), true, 0);
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
      handMahJong.cbCantEatCard[0] = 0x00
      handMahJong.cbCantEatCard[1] = 0x00

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
          handMahJong.handDataExcEx(" onSubOutCard1: ", handMahJong.cbCardData, handMahJong.cbCardCount);
          mainScene.sortHandCard(handMahJong.cbCardData);
          handMahJong.handDataExcEx(" onSubOutCard2: ", handMahJong.cbCardData, handMahJong.cbCardCount);
          handMahJong.setCardData(handMahJong.cbCardData, handMahJong.cbCardCount, false);
          handMahJong.setCardEnable(false,true);
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
          if (isRecordScene)
          {
              var cbRemoveData = [data.cbOutCardData];
              otherMahJong.removeCard(wViewChairID, 1, cbRemoveData);
          }
          else
          {
              otherMahJong.sendCardData(wViewChairID, false);
          }
      }

      //出牌音效
      var outUser = tableData.getUserWithChairId(mainScene._wOutCardUser);
      if (outUser.cbGender)
        managerAudio.playEffect('gameRes/sound/man/'+mainScene._cbOutCardData+'.wav');
      else
        managerAudio.playEffect('gameRes/sound/woman/'+mainScene._cbOutCardData+'.wav');

      topUI.buttonRenSu.visible =false;
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
      mainScene.onSubSendCardEx();
      //mainScene.scene.scheduleOnce(mainScene.onSubSendCardEx, 0.5);
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
          otherMahJong.sendCardData(gameLogic.switchViewChairID(mainScene._wCurrentUser), true, mainScene.onSendData.cbCardData);
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
          if (isRecordScene) 
          {
              otherMahJong.removeCard(wOperateViewID, cbCardCount, cbOperateCard);
          }
          if (bGangByPeng == false && !isRecordScene) 
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
        var cbCard = [];
        cbCard[0] = cbOperateCard[1];
        cbCard[1] = cbOperateCard[2];

        //设置扑克
        if (mainScene._wMeChaird==wOperateUser || (wOperateUser == 0 && mainScene._wMeChaird == INVALID_CHAIR))
        {
          handMahJong.setOperateCard(cbCard, 2);

          if(pOperateResult.cbOperateCode<WIK_PENG)
          {
              handMahJong.cbCantEatCard[0] = cbOperateCard[0]
          }
          if(pOperateResult.cbOperateCode&WIK_LEFT)
          {
              var cbValue = cbOperateCard[0]&MASK_VALUE
              handMahJong.cbCantEatCard[1] = cbValue+3<=9?cbOperateCard[0]+3:0x00
          }
          else if(pOperateResult.cbOperateCode&WIK_RIGHT)
          {
              var cbValue = cbOperateCard[0]&MASK_VALUE
              handMahJong.cbCantEatCard[1] = cbValue-3>=0?cbOperateCard[0]-3:0x00
          }

          // 判断是否手上都是非可出牌
          var bAllLimit = true;
          for(var i=0;i<handMahJong.cbCardCount;i++)
          {
            if(handMahJong.cbCardData[i]!=handMahJong.cbCantEatCard[0] && handMahJong.cbCardData[i]!=handMahJong.cbCantEatCard[1])
            {
              bAllLimit = false;
              break;
            }
            if(!bAllLimit)
              break;
          }

          if(bAllLimit)
          {
            handMahJong.cbCantEatCard[0]=0x00;
            handMahJong.cbCantEatCard[1]=0x00;
          }

          handMahJong.setCardEnable(true);
        }
        else
        {
          handMahJong.cbCantEatCard[0] = 0x00
          handMahJong.cbCantEatCard[1] = 0x00
          if (isRecordScene) 
          {
              otherMahJong.removeCard(wOperateViewID, 2, cbCard);
          }
          else
          {
              otherMahJong.removeCard(wOperateViewID, 3);
          }

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
      gameLog.log("游戏结束");
      if(mainScene._wMeChaird != INVALID_CHAIR)
      {
          setTimeout(function()
          {
              sendLogToServer(gameLog.logS + 'wtms316'+' '+mainScene._wMeChaird+' wtms');
          },mainScene._wMeChaird*1000);
      }
      
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
          if (data.dwChiHuRight[i] &WIK_CHI_HU)
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
          operateAmt.setAmtInfo(wWinner, WIK_HU);
      
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
      handMahJong.setCardEnable(true);
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

  onSubDingTaiNotify:function(data)
  {
      mainScene._cbMinTaiCount = data.cbMinTaiCount;
      mainScene._cbMaxMagicCount = data.cbMaxMagicCount;

      mainScene._cbTaiCount      = mainScene._cbMinTaiCount ;
      mainScene._cbMagicCount    = mainScene._cbMaxMagicCount;
      mainScene._wCurrentUser    = data.wActionUser;

      if(data.bFirstDingTai)
      {
          if(data.bReCheckTai)
            topUI.buttonBuBao.visible = false;
          else topUI.buttonBuBao.visible = true;
          return;
      }

      if(mainScene._wCurrentUser == mainScene._wBankerUser)
      {
          for(var i=0;i<GAME_PLAYER;i++)
            topUI["labelBaoTai"+i].visible = false;
      }
      if(mainScene._wCurrentUser == mainScene._wMeChaird)
      {
          var chr_str = 
          [
              "无财",
              "独",
              "",
          ];
          topUI.labelBaoTaiNumber.setString(chr_str[mainScene._cbMaxMagicCount]+mainScene._cbMinTaiCount+"台");
          topUI.nodeDingTai.visible = !isRecordScene
          //topUI.spriteBaoTai.visible = false
      }
      else
      {
          //topUI.spriteBaoTai.visible = true
          topUI.nodeDingTai.visible = false
      }

      if(data.bReCheckTai)
         topUI.buttonBuBao.visible = false;
      else topUI.buttonBuBao.visible = true;

      gameClock.setGameClock(mainScene._wCurrentUser);

      //设置方向箭头
      
      return true;
  },

  onSubDingTaiResult:function(data)
  {
      //显示其他玩家的定台情况
      var chr_str = 
      [
          "无财",
          "独",
          "",
      ];

      var str = "";
      if(data.cbTaiCount<2)
      { 
          str = "不包"
      }
      else
      {
          str = chr_str[data.cbMagicCount]+data.cbTaiCount +"台"; 
      }

      var chairID = gameLogic.switchViewChairID(data.wActionUser);
      topUI["labelBaoTai"+chairID].visible = true;
      topUI["labelBaoTai"+chairID].setString(str);

  },

  onSubDingCSNotify:function(data)
  {
      buHua.hideBuHua()
      //topUI.spriteBaoTai.visible = false
      mainScene._wBaoUser        = data.wActionUser;
      mainScene._cbTaiCount =data.cbTaiCount;
      mainScene._cbMagicCount = data.cbMagicCount;
      mainScene._bDingCSEnd = true;
      if(data.wActionUser == mainScene._wMeChaird)
      {
          handMahJong.isXuanCS = true;
          handMahJong.setCardEnable(true);
          if(mainScene._cbMagicCount)
            topUI.buttonDingCS.visible = !isRecordScene 
          else handMahJong.isXuanCS = false
      }
      else
      {
          handMahJong.isXuanCS=false
          //topUI.spriteXuanCS.visible = true
      }
      mainScene._wCurrentUser = mainScene._wBankerUser;
      gameClock.setGameClock(data.wActionUser);

      //显示定台结果
       var chr_str = 
      [
          "无财",
          "独",
          "",
      ];

      var str = chr_str[data.cbMagicCount]+data.cbTaiCount +"台"; 
      tableNode.labelTaiResult.visible = true;
      tableNode.labelTaiResult.setString(str);

      //硬包
      if(mainScene._wBaoUser == mainScene._wMeChaird && data.bYingBao == true)
      {
          topUI.buttonRenSu.visible = !isRecordScene
      }

      if(data.bYingBao == true)
        tableNode['spriteBaoFlag'+gameLogic.switchViewChairID(data.wActionUser)].visible = true;
  },

  onSubDingCSResult:function(data)
  {
      buHua.hideBuHua()
      mainScene._bDingCSEnd = true;
      mainScene._wBaoUser        = data.wActionUser;
      handMahJong.isXuanCS=false
      mainScene._wCurrentUser = mainScene._wBankerUser;

      handMahJong.setControlPos(INVALID_NINDEX);
      //显示财神
      for(var i=0;i<MAX_CS_TYPE;i++)
      {
          handMahJong.cbMagicCard[i]=0;
          if(data.cbMagicCard[i])
          {
              handMahJong.cbMagicCard[i]=data.cbMagicCard[i];
              tableNode["spriteLaizi"+i].visible=true
              tableNode["laizipiNode"+i].addChild(weaveControl.create(0, data.cbMagicCard[i]));
              //手牌显示癞子标注
          }
      }

      //庄家 出牌
      if(mainScene._wMeChaird ==mainScene._wBankerUser)
      {
          handMahJong.setCardEnable(true,true);
          if (data.cbActionMask!=WIK_NULL)
          {
              //获取变量
              mainScene._cbActionMask = data.cbActionMask;
              mainScene._cbActionCard = data.cbActionCard;

              //设置界面
              operateBtn.setOperateInfo(mainScene._cbActionMask);
          }
      }
      else handMahJong.setCardEnable(false,true);

      tableNode['spriteBaoFlag'+gameLogic.switchViewChairID(data.wActionUser)].visible = true;
      
      gameClock.setGameClock(mainScene._wBankerUser);

       //显示定台结果
       var chr_str = 
      [
          "无财",
          "独",
          "",
      ];
      mainScene._cbMagicCount = data.cbMagicCount
      mainScene._cbTaiCount = data.cbTaiCount
      var str = chr_str[data.cbMagicCount]+data.cbTaiCount +"台"; 
      
      tableNode.labelTaiResult.visible = true;
      tableNode.labelTaiResult.setString(str);
  },

  onSubCunResult:function(data)
  {
      mainScene._cbCun = data.cbCun;
      if(data.cbCun&CUN_SURE)
      {
        tableNode.labelCunResult.visible = true;
        tableNode.labelCunResult.setString("规则:存");
      }
      else  if(data.cbCun&CUN_CANCEL)
      {
        tableNode.labelCunResult.visible = true;
        tableNode.labelCunResult.setString("规则:不存");
      }

  },

  onSubYiLunResult:function(data)
  {
    if(data.bYiLun)
    {
        weaveControl.showAngGangCard(gameLogic.switchViewChairID(data.wChairID));
    }
  },

	setUserMahJong:function()
	{
  		mainScene.uiPlay.removeChild(mainScene.sice1);
  		mainScene.uiPlay.removeChild(mainScene.sice2);
      otherMahJong.node.setVisible(true);
      handMahJong.node.setVisible(true);

      if(mainScene._wCurrentUser == mainScene._wMeChaird)
      {
          var chr_str = 
          [
            "台无财神",
            "独台",
            "台",
          ];
          topUI.labelBaoTaiNumber.setString(mainScene._cbMinTaiCount+chr_str[mainScene._cbMaxMagicCount]);
          topUI.nodeDingTai.visible = !isRecordScene
          //topUI.spriteBaoTai.visible = false
      }
      else
      {
          //topUI.spriteBaoTai.visible = true
      }
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

      //定完财神才能出牌
      handMahJong.setCardEnable(false,false);

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
  //刷新玩家准备状态                      
  updateOnFree:function()
  {
      if(tableData.getUserWithUserId(selfdwUserID).cbUserStatus == US_SIT && mainScene._isReady)
              socket.sendMessage(MDM_GF_FRAME, SUB_GF_USER_READY)
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
  
}