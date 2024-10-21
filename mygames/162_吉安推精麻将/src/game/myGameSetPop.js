
var myGameSetPop = 
{	
	resp:'gameRes/plist/',	
    pop:null,
    typeName : ['飘精个数', '精牌玩法', '德国玩法', '七对分数', '杠精玩法', '封顶', '抢杠', '抄庄'],
    itemName : [
                   ['必飘一正精或两副精', '必须飘一个精', '不飘精'],
                   ['飘精不可吃碰杠', '飘精可吃碰杠'],
                   ['飘不够德国必自摸', '飘不够德国可点炮'],
                   ['大七和小七分一样', '大七比小七多一倍'],
                   ['有杠精', '无杠精'],
                   ['500封顶', '256封顶', '不封顶'],
                   ['抢杠胡翻倍', '抢杠胡不翻倍'],
                   ['抄庄', '不抄庄']
                ],  //该数组的 0 位置是默认值, 每个下标分别对应typeName中的值

	onPreLoadRes:function()
	{
		cc.spriteFrameCache.addSpriteFrames(this.resp + 'GameSetPopRes.plist', this.resp + 'GameSetPopRes.png')
	},
	onReStart:function()
	{
		if(myGameSetPop.pop)			
			myGameSetPop.pop.removeFromParent()

		myGameSetPop.pop = null
	},
    createGameSetPop:function(popNode)
    {
        var width = popNode.getContentSize().width
        var height = popNode.getContentSize().height
        var self = this
        if(!self.typeName || !self.itemName)
            return

        //button
        for(var type=0; type<self.typeName.length; type++)
        {
            var itemName = self.itemName[type]
            for(var item=0; item<itemName.length; item++)
            {
                var res = ''
                if(item == 0)
                    res = type + '_' + item + '_1.png'
                else
                    res = type + '_' + item + '_0.png'
              
                var myButton = new ccui.Button()
                myButton.loadTextures(res, res, res, ccui.Widget.PLIST_TEXTURE)
                myButton.setZoomScale(0)
                myButton.myType = type
                myButton.myItem = item
                myButton.myBool = item == 0
                myButton.setAnchorPoint(cc.p(0, 0)) 
                myGameSetPop.setButtonPosition(myButton, width, height)
                popNode.addChild(myButton)

                myButton.addClickEventListener(function(btn)
                {
                    var res = btn.myType + '_' + btn.myItem + '_1.png'
                    btn.loadTextures(res, res, res, ccui.Widget.PLIST_TEXTURE)
                    btn.myBool = true
                    myGameSetPop.resetConflictsButtons(btn)
                });
            }
        }

        //OK button        
        var OKbtn = new ccui.Button()
        OKbtn.loadTextures('gameSetBtnOK.png', 'gameSetBtnOK.png', 'gameSetBtnOK.png', ccui.Widget.PLIST_TEXTURE)
        OKbtn.setZoomScale(0.05)
        OKbtn.setAnchorPoint(cc.p(0.5, 0.5)) 
        OKbtn.setPosition(cc.p(width*0.5 , height*0.1))
        popNode.addChild(OKbtn)
        OKbtn.addClickEventListener(function(btn){
                myGameSetPop.setGameSelectData()
            });


        var listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                return true
            },
            onTouchEnded: function (touch, event) {
            
            }
        })
        cc.eventManager.addListener(listener, popNode)

        myGameSetPop.pop = popNode

    },

    //选择按钮时，某些按钮的设置和属性要发生变化
    resetConflictsButtons:function(btn)
    {
        var self = this
        var children = myGameSetPop.pop.children
        if(!children)
            return

        for(var i=0; i<children.length; i++)
        {
            if(!children[i] || typeof(children[i].myType) == "undefined")
                continue

            var myType = children[i].myType
            var myItem = children[i].myItem
            
            //首先判断同级, 只能有一个被选中
            if(myType == btn.myType)
            {
                if(myItem != btn.myItem)
                {
                    var res = myType + '_' + myItem + '_0.png'
                    children[i].loadTextures(res, res, res, ccui.Widget.PLIST_TEXTURE)
                    children[i].myBool = false
                }
            }
            else  //再判断不同级, 选“必须飘一个精”时，则德国玩法只能选“飘不够必须自摸”
            {
                if(btn.myType == 0 && btn.myItem == 1)
                {
                    if(myType != 2)
                        continue

                    if(myItem == 0) {
                        var res = myType + '_' + myItem + '_1.png'
                        children[i].loadTextures(res, res, res, ccui.Widget.PLIST_TEXTURE)
                        children[i].myBool = true
                    }   

                    if(myItem == 1){
                        var res = myType + '_' + myItem + '_0.png'
                        children[i].loadTextures(res, res, res, ccui.Widget.PLIST_TEXTURE)    
                        children[i].myBool = false                
                    }
                    children[i].setTouchEnabled(false)
                    children[i].color = cc.color(155, 155, 155)
                }
                else if(btn.myType == 0 && (btn.myItem == 2 || btn.myItem == 0))
                {
                    if(myType != 2)
                        continue

                    children[i].setTouchEnabled(true)
                    children[i].color = cc.color(255, 255, 255)
                }
            }
        }

    },

    //由于切图size不一致，版面不整齐，重新设置位置
    setButtonPosition:function(btn, width, height)
    {
        if(!btn || typeof(btn) == 'undefined')
            return

        var type = btn.myType
        var item = btn.myItem
        var pos_x = width*0.23 + item * 260
        var pos_y = height*0.78 - type*50
        switch(type)
        {
            case 0:
            {
                if(item <= 1)
                    btn.setPosition(cc.p(pos_x, height*0.79 - type*50-3))
                else
                    btn.setPosition(cc.p(width*0.23 + item * 225, height*0.79 - type*50-3))

                break
            }
            case 1: 
            {
                btn.setPosition(cc.p(pos_x, pos_y +2))
                break
            }
            case 2:
            {
                btn.setPosition(cc.p(pos_x, pos_y -1))
                break
            }
            case 3: 
            {
                btn.setPosition(cc.p(pos_x, pos_y -2))
                break
            }
            case 4: 
            {
                btn.setPosition(cc.p(pos_x, pos_y -4))
                break
            }
            case 5: 
            {
                if(item <= 1)
                    btn.setPosition(cc.p(pos_x, pos_y -5))
                else
                    btn.setPosition(cc.p(width*0.23 + item * 225, pos_y -5))

                break
            }
            case 6: 
            {
                btn.setPosition(cc.p(pos_x, pos_y -7))
                break
            }
            case 7: 
            {
                btn.setPosition(cc.p(pos_x, pos_y -9))
                break
            }
        }
    },

    setGameSelectData:function()
    {
        var psResult = getObjWithStructName('CMD_C_SELECT_RESULT')
        var children = myGameSetPop.pop.children
        for(var i=0; i<children.length; i++)
        {
            if(!children[i] || typeof(children[i].myType)=="undefined")
                continue

            var type = children[i].myType
            var item = children[i].myItem
            if(children[i].myBool)
                psResult.bGameSetResult[type] = item+1
        }
        psResult.bGameHasSelect = true
        socket.sendMessage(MDM_GF_GAME, SUB_C_SELECT, psResult)        
        topUINode.gameSetPopNode.visible = false
        topUINode.gameSetPopNode.removeFromParent()
    }

}


