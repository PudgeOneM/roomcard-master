var gameSet = 
{
	create:function()
	{
      if(gameSet.node && gameSet.node._parent) return;
      gameSet.initCallBack();
    	gameSet.node  = cc.BuilderReader.load(resp.gameSetCCB, gameSet );
      gameSet.node.x = mainScene.ctPosX;
      gameSet.node.y = mainScene.ctPosY;
    	topUI.node.addChild(gameSet.node, ZORDER_MAX);
      gameSet.cbMingTang = 0;
      gameSet.bDouLiuZi = false;
      gameSet.cbZXScore = 0;
      gameSet.cbDeng = 0;
      gameSet.md = ["mt0","mt1","mt2","open","close","zx0","zx1","zx2","deng0","deng1","deng2"];
      for(var i = 0; i < 11; i++)
      {
          var item =  gameSet[gameSet.md[i]];
          var listener = gameSet.getListener(item);
          cc.eventManager.addListener(listener, item);
      }
      gameSet.updateSetView(0);
	},
	getListener:function()
    {   
        var listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                  var target = event.getCurrentTarget();
                  var locationInNode = target.convertToNodeSpace(touch.getLocation());
                  for(var i = 0; i < 11; i++)
                  {
                      var item = gameSet[gameSet.md[i]];
                      var s = item.getContentSize();
                      var rect = cc.rect(0, -10, s.width+50, s.height+20);
                      if (item == target && cc.rectContainsPoint(rect, locationInNode)) 
                      {
                          return true;
                      }
                  }
                  return false;
            },
            onTouchEnded: function (touch, event) 
            {
                var target = event.getCurrentTarget();
                for(var i = 0; i < 11; i++)
                {
                    var item = gameSet[gameSet.md[i]];
                    if (item == target) 
                    {
                        gameSet.updateSetView(i);
                        break;
                    }
                }
            }
        })
        return listener;
    },
    initCallBack:function()
    {
        gameSet.callOK = function()
        {
            gameSet.node.visible = false;
            gameSet.node.removeFromParent();
            var setData = getObjWithStructName('CMD_C_GAMESET_RESUTL');
            setData.cbMingTang = gameSet.cbMingTang;
            setData.bDouLiuZi = gameSet.bDouLiuZi;
            setData.cbZXScore = gameSet.cbZXScore;
            setData.cbDeng = gameSet.cbDeng;
            socket.sendMessage(MDM_GF_GAME, SUB_C_GAMESET_RESULT, setData); 
        }
    },
    updateSetView:function(nIndex)
    {
        switch(nIndex)
        {
           case 0:
           gameSet.cbMingTang = 0;
           break;
           case 1:
           gameSet.cbMingTang = 1;
           break;
           case 2:
           gameSet.cbMingTang = 2;
           break;
           case 3:
           gameSet.bDouLiuZi = true;
           break;
           case 4:
           gameSet.bDouLiuZi = false;
           break;
           case 5:
           gameSet.cbZXScore = 0;
           break;
           case 6:
           gameSet.cbZXScore = 1;
           break;
           case 7:
           gameSet.cbZXScore = 2;
           break;
           case 8:
           gameSet.cbDeng = 0;
           break;
           case 9:
           gameSet.cbDeng = 1;
           break;
           case 10:
           gameSet.cbDeng = 2;
           break;
        }
        for(var i = 0; i < 11; i++)
        {
            gameSet[gameSet.md[i]].visible = false;
        }
        gameSet["douliuzi"].visible = false;
        gameSet['mt'+gameSet.cbMingTang].visible = true;
        if(gameSet.bDouLiuZi)
        {
            gameSet["open"].visible = true;
            gameSet["douliuzi"].visible = true;
            gameSet['zx'+gameSet.cbZXScore].visible = true;
            gameSet['deng'+gameSet.cbDeng].visible = true;
        }
        else
        {
            gameSet["close"].visible = true;
            gameSet.cbZXScore = 0;
            gameSet.cbDeng = 0;
        }
    },
};