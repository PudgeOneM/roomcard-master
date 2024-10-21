
//majiangFactory2->majiangFactory
majiangFactory._gethandMajiangsListener = function(majiangs, parent, touchEndCall)
{
    var currentMajiangTipsNode = new cc.Node()
    var bg = new cc.Sprite('#mf_currentMjBg.png')
    currentMajiangTipsNode.addChild(bg)

    var where = {}
    where.name = 'hand'
    where.data = {idx:0}
    var mj = majiangFactory.getOne(1, 0, where)
    mj.x = 0
    mj.y = 0
    mj.isIgnoreDecorate = true
    currentMajiangTipsNode.addChild(mj)

    currentMajiangTipsNode.x = - 1000
    currentMajiangTipsNode.y = 100 + bg.height*0.5 + 80

    parent.addChild(currentMajiangTipsNode, 1000)

    var mjOriginY = majiangs[0][0].y
    var touchPosX2TouchedMj = function(locationInNode)
    {      
        for(var i=0;i<majiangs[0].length;i++)
        {
            var mj = majiangs[0][i]
            if(locationInNode.x>mj.x-mj.width*0.5 && locationInNode.x<mj.x+mj.width*0.5 
                && locationInNode.y>mj.y-mj.height*0.5 && locationInNode.y<mj.y+mj.height*0.5 )
                return mj
        }

        var mj = majiangs[1]
        if(mj && locationInNode.x>mj.x-mj.width*0.5 && locationInNode.x<mj.x+mj.width*0.5
            && locationInNode.y>mj.y-mj.height*0.5 && locationInNode.y<mj.y+mj.height*0.5 )
            return mj

        return null
    }

    var lastPlayTime = null
    var playSelectEffect = function()
    {
        var nowTime = new Date().getTime()

        if(!lastPlayTime || (nowTime - lastPlayTime) > 100)
        {
            lastPlayTime = nowTime
            managerAudio.playEffect('gameRes/sound/selectcard.mp3')
        }
    }

    var currentMajiang = null
    var touchedMjNum = 0
    var soundId = null
    var onTouch = function(touchedMj)
    {    
        if(currentMajiang)
            currentMajiang.y = mjOriginY
    
        if(!currentMajiang || currentMajiang!=touchedMj) 
        {
            touchedMjNum++
            if(touchedMjNum>1)
                playSelectEffect()
            // managerAudio.stopEffect(soundId)
            //soundId = managerAudio.playEffect(majiangFactory.resp + 'selectcard.mp3')
        }

        currentMajiang = touchedMj


        currentMajiangTipsNode.x = currentMajiang.x
        // currentMajiangTipsNode.y = 100 + bg.height*0.5 + 80
        mj.getChildByTag(101).setSpriteFrame('mf_' + currentMajiang.cardData + '.png') 
           
        currentMajiang.y = mjOriginY + 10


        // majiangFactory.currentDiscardMjNode.setVisible(false)
        var event = new cc.EventCustom("handMajiangTouched")
        event.setUserData(currentMajiang.cardData)
        cc.eventManager.dispatchEvent(event) 

        return true
           
    }

    var listener = cc.EventListener.create({
        event: cc.EventListener.TOUCH_ONE_BY_ONE,
        swallowTouches: true,
        onTouchBegan: function (touch, event) {
            var target = event.getCurrentTarget()

            var locationInNode = target.convertToNodeSpace(touch.getLocation())
            var touchedMj = touchPosX2TouchedMj(locationInNode)


            if(touchedMj && touchedMj.touchEnable)
            {
                return onTouch(touchedMj)
            }
            else
            {
                // if(currentPopMajiang)
                // {         
                //     currentPopMajiang.y = mjOriginY
                //     var event = new cc.EventCustom("handMajiangDown")
                //     event.setUserData(currentPopMajiang.cardData)
                //     cc.eventManager.dispatchEvent(event) 
                //     currentPopMajiang = null
                // }

                return false 
            }
        },
        onTouchMoved: function (touch, event) {
            var target = event.getCurrentTarget()
            var locationInNode = target.convertToNodeSpace(touch.getLocation())

            var touchedMj = touchPosX2TouchedMj(locationInNode)
            if(touchedMj && touchedMj.touchEnable)
            {
                onTouch(touchedMj)
            }
        },
        onTouchEnded: function (touch, event) {
            var target = event.getCurrentTarget()

            var locationInNode = target.convertToNodeSpace(touch.getLocation())

            if(currentMajiang && touchedMjNum == 1)
                touchEndCall?touchEndCall(currentMajiang):''

            if(currentMajiang)
            {
                currentMajiang.y = mjOriginY
                currentMajiang = null
            }
            currentMajiangTipsNode.x = -1000

            // majiangFactory.currentDiscardMjNode.setVisible(true)
            var event = new cc.EventCustom("handMajiangTouchEnd")
            cc.eventManager.dispatchEvent(event)

            touchedMjNum = 0
        }
    })

        // case 2:
        // {        
        //     var currentMajiang = null
        //     var currentPopMajiang = null
        //     var touchedMjNum = 0
        //     var isTouchFromPop = false
        //     var soundId = null
        //     var onTouch = function(locationX)
        //     {   
        //         var touchedMj = touchPosX2TouchedMj(locationX)
        //         if(!touchedMj)
        //             return 
                
        //         if(currentMajiang)
        //             currentMajiang.y = mjHeight*0.5
            
        //         if(!currentMajiang || currentMajiang!=touchedMj)//刚开始触摸麻将 或者摸到新的麻将 
        //         {
        //             touchedMjNum++
        //             if(touchedMjNum>1)
        //                 playSelectEffect()
        //         }

        //         currentMajiang = touchedMj

        //         currentMajiangTipsNode.x = currentMajiang.x
        //         mj.getChildByTag(101).setSpriteFrame('mf_' + currentMajiang.cardData + '.png') 

        //         currentMajiang.y = mjHeight*0.5 + 20
                   
        //         // majiangFactory.currentDiscardMjNode.setVisible(false)
        //         var event = new cc.EventCustom("handMajiangTouched")
        //         event.setUserData(currentMajiang.cardData)
        //         cc.eventManager.dispatchEvent(event)            
        //     }

        //     var listener = cc.EventListener.create({
        //         event: cc.EventListener.TOUCH_ONE_BY_ONE,
        //         swallowTouches: true,
        //         onTouchBegan: function (touch, event) {
        //             var target = event.getCurrentTarget()

        //             var locationInNode = target.convertToNodeSpace(touch.getLocation())
        //             var locationX = locationInNode.x<0?0:locationInNode.x
      
        //             if(currentPopMajiang)
        //             {
        //                 var touchedMj = touchPosX2TouchedMj(locationX)
        //                 isTouchFromPop = currentPopMajiang == touchedMj
        //                 currentPopMajiang.y = mjHeight*0.5
        //             }
        //             var s = target.getContentSize();
        //             var rect = cc.rect(0, 0, s.width, s.height)
        //             if (cc.rectContainsPoint(rect, locationInNode)) {
        //                 onTouch(locationX)
        //                 return true
        //             }
        //             return false
        //         },
        //         onTouchMoved: function (touch, event) {
        //             var target = event.getCurrentTarget()
        //             var locationInNode = target.convertToNodeSpace(touch.getLocation())
        //             var s = target.getContentSize();
        //             var rect = cc.rect(0, 0, s.width, s.height)
        //             if (cc.rectContainsPoint(rect, locationInNode)) {
        //                 onTouch(locationInNode.x<0?0:locationInNode.x)
        //             }
        //         },
        //         onTouchEnded: function (touch, event) {
        //             var target = event.getCurrentTarget()

        //             // var locationInNode = target.convertToNodeSpace(touch.getLocation())
        //             // var s = target.getContentSize();
        //             // var rect = cc.rect(0, 0, s.width, s.height)
        //             // if (cc.rectContainsPoint(rect, locationInNode)) {
        //             //     if(currentMajiang && touchedMjNum == 1)
        //             //         touchEndCall?touchEndCall(currentMajiang):''
        //             // }

        //             // if(currentMajiang)
        //             // {
        //                 if(isTouchFromPop && touchedMjNum==1)
        //                 {
        //                     touchEndCall?touchEndCall(currentPopMajiang):''
        //                     currentPopMajiang = null
        //                     isTouchFromPop = false
        //                     currentMajiang.y = mjHeight*0.5
        //                 }
        //                 else
        //                     currentPopMajiang = currentMajiang
        //             //}

        //             // if(currentMajiang)
        //             //     currentMajiang.y = mjHeight*0.5

        //             // majiangFactory.currentDiscardMjNode.setVisible(true)
        //             var event = new cc.EventCustom("handMajiangTouchEnd")
        //             cc.eventManager.dispatchEvent(event)

        //             currentMajiangTipsNode.x = -1000
        //             currentMajiang = null
        //             touchedMjNum = 0
        //             isTouchFromPop = false
        //         }
        //     })
        //     break
        // }
        // case 3:
        // {
        //     var currentMajiang = null
        //     var currentPopMajiang = null
        //     var touchedMjNum = 0
        //     var isTouchFromPop = false
        //     var soundId = null
        //     var onTouch = function(locationX)
        //     {   
        //         var touchedMj = touchPosX2TouchedMj(locationX)
        //         if(!touchedMj)
        //             return 
                
        //         if(currentMajiang)
        //             currentMajiang.y = mjHeight*0.5
            
        //         if(!currentMajiang || currentMajiang!=touchedMj)//刚开始触摸麻将 或者摸到新的麻将 
        //         {
        //             touchedMjNum++
        //             if(touchedMjNum>1)
        //                 playSelectEffect()
        //         }

        //         currentMajiang = touchedMj

        //         currentMajiangTipsNode.x = currentMajiang.x
        //         currentMajiangTipsNode.y = parent.height + bg.height*0.5 + 40
        //         mj.getChildByTag(101).setSpriteFrame('mf_' + currentMajiang.cardData + '.png') 

        //         currentMajiang.y = mjHeight*0.5 + 20
                   
        //         // majiangFactory.currentDiscardMjNode.setVisible(false)
        //         var event = new cc.EventCustom("handMajiangTouched")
        //         event.setUserData(currentMajiang.cardData)
        //         cc.eventManager.dispatchEvent(event)            
        //     }

        //     var listener = cc.EventListener.create({
        //         event: cc.EventListener.TOUCH_ONE_BY_ONE,
        //         swallowTouches: true,
        //         onTouchBegan: function (touch, event) {
        //             var target = event.getCurrentTarget()

        //             var locationInNode = target.convertToNodeSpace(touch.getLocation())
        //             var locationX = locationInNode.x<0?0:locationInNode.x
      
        //             if(currentPopMajiang)
        //             {
        //                 var touchedMj = touchPosX2TouchedMj(locationX)
        //                 isTouchFromPop = currentPopMajiang == touchedMj
        //                 currentPopMajiang.y = mjHeight*0.5
        //             }
        //             var s = target.getContentSize();
        //             var rect = cc.rect(0, 0, s.width, s.height)
        //             if (cc.rectContainsPoint(rect, locationInNode)) {
        //                 onTouch(locationX)
        //                 return true
        //             }
        //             return false
        //         },
        //         onTouchMoved: function (touch, event) {
        //             var target = event.getCurrentTarget()
        //             var locationInNode = target.convertToNodeSpace(touch.getLocation())
        //             if(isTouchFromPop)
        //             {
        //                 currentMajiangTipsNode.x = locationInNode.x
        //                 currentMajiangTipsNode.y = locationInNode.y
        //             }
        //             else
        //             {

        //                 var s = target.getContentSize();
        //                 var rect = cc.rect(0, 0, s.width, s.height)
        //                 if (cc.rectContainsPoint(rect, locationInNode)) {
        //                     onTouch(locationInNode.x<0?0:locationInNode.x)
        //                 }
        //             }
        //         },
        //         onTouchEnded: function (touch, event) {
        //             var target = event.getCurrentTarget()

        //             // var locationInNode = target.convertToNodeSpace(touch.getLocation())
        //             // var s = target.getContentSize();
        //             // var rect = cc.rect(0, 0, s.width, s.height)
        //             // if (cc.rectContainsPoint(rect, locationInNode)) {
        //             //     if(currentMajiang && touchedMjNum == 1)
        //             //         touchEndCall?touchEndCall(currentMajiang):''
        //             // }

        //             // if(currentMajiang)
        //             // {
        //                 if(isTouchFromPop && touchedMjNum==1)
        //                 {
        //                     touchEndCall?touchEndCall(currentPopMajiang):''
        //                     currentPopMajiang = null
        //                     isTouchFromPop = false
        //                     currentMajiang.y = mjHeight*0.5
        //                 }
        //                 else
        //                     currentPopMajiang = currentMajiang
        //             // }

        //             // if(currentMajiang)
        //             //     currentMajiang.y = mjHeight*0.5

        //             // majiangFactory.currentDiscardMjNode.setVisible(true)
        //             var event = new cc.EventCustom("handMajiangTouchEnd")
        //             cc.eventManager.dispatchEvent(event)

        //             currentMajiangTipsNode.x = -1000
        //             currentMajiang = null
        //             touchedMjNum = 0
        //             isTouchFromPop = false
        //         }
        //     })
        //     break
        // }

    return listener
}













majiangFactory.hideCurrentDiscardMj = function()
{
    majiangFactory.currentDiscardMjNode.x = -1000
}
    
majiangFactory.setCurrentDiscardMj = function(discardMajiangs4D, direction)
{
    var discardMajiangs = discardMajiangs4D[direction]
    if(discardMajiangs.length == 0) 
        return;
    
    var discardMajiang = discardMajiangs[discardMajiangs.length-1]
    var cardData = discardMajiang.cardData

    var self = tableData.getUserWithUserId(selfdwUserID)
    var d = tableData.getShowChairIdWithServerChairId(self.wChairID)
    if(d == direction)
    {
        majiangFactory.hideCurrentDiscardMj()
        return
    }

    majiangFactory.currentDiscardMjNode.setVisible(true)
    var mj = majiangFactory.currentDiscardMjNode.getChildByTag(101)
    mj.getChildByTag(101).setSpriteFrame('mf_' + cardData + '.png') 

    switch(direction)
    {
        case 0://down
        {
            majiangFactory.currentDiscardMjNode.x = 600
            majiangFactory.currentDiscardMjNode.y = 200
            break
        }
        case 1://right
        {
            majiangFactory.currentDiscardMjNode.x = 1050
            majiangFactory.currentDiscardMjNode.y = 480
            break
        }
        case 2://up
        {
            majiangFactory.currentDiscardMjNode.x = 600
            majiangFactory.currentDiscardMjNode.y = 630
            break
        }
        case 3://left
        {
            majiangFactory.currentDiscardMjNode.x = 150
            majiangFactory.currentDiscardMjNode.y = 480
            break
        }
    }  
}



majiangFactory.showChoosePopOfAction = function(cardDatasArray, actionArray, actionCall)
{
    var len = actionArray.length
    for(var i=0;i<len;i++)
    {
        var cardDatas = cardDatasArray[i]
        var chooseItem = majiangFactory._getChooseItemOfAction(cardDatas, actionArray[i], actionCall)

        chooseItem.x = ( i - (len-1)/2 ) * (62*3 + 30)
        chooseItem.y = 0
        majiangFactory.chooseItemsNode.addChild(chooseItem)
    }
}


majiangFactory._getChooseItemOfAction = function(sortedOperateCardDatas, action, actionCall)
{        
    var chooseItem = new cc.Node()
    // var provideCardData = cardDatas[0]
    ////////////////////////////
    var showLen = sortedOperateCardDatas.length
    if(action == WIK_GANG)
        showLen = 1
    for(var i=0;i<showLen;i++)
    {
        var where = {}
        where.name = 'hand'
        where.data = {idx:0}
        var mj = majiangFactory.getOne(sortedOperateCardDatas[i], 0, where)
        mj.isIgnoreDecorate = true
        mj.setScale(62/84)
        mj.x = ( i - (showLen-1)/2 )*62
        mj.y = 0
        if( (action == WIK_LEFT && i==0) || (action == WIK_CENTER && i==1) || (action == WIK_RIGHT && i==2) )
        {
            // provideCardData = i
            mj.color = cc.color(122, 122, 122)
        }

        chooseItem.addChild(mj)
    }

    ////////////////////////////
    var bg = new cc.Scale9Sprite('mf_chooseItemBg.png')
    bg.width = 196
    bg.height = 90
    chooseItem.addChild(bg, -1)

    var listener = cc.EventListener.create({
        event: cc.EventListener.TOUCH_ONE_BY_ONE,
        swallowTouches: false,
        onTouchBegan: function (touch, event) {
            var target = event.getCurrentTarget()
            var locationInNode = target.convertToNodeSpace(touch.getLocation())
            var rect = cc.rect(0, 0, target.getContentSize().width, target.getContentSize().height)
            var isTouchInNode = cc.rectContainsPoint(rect, locationInNode)
            if (isTouchInNode) {
                return true
            }
            return false
        },
        onTouchEnded: function (touch, event) {
            var target = event.getCurrentTarget()
            var locationInNode = target.convertToNodeSpace(touch.getLocation())
            var rect = cc.rect(0, 0, target.getContentSize().width, target.getContentSize().height)
            var isTouchInNode = cc.rectContainsPoint(rect, locationInNode)
            if (isTouchInNode) {
                majiangFactory.chooseItemsNode.removeAllChildren()
                actionCall?actionCall(sortedOperateCardDatas, action):''
            }
        }
    })
    cc.eventManager.addListener(listener, bg)

    return chooseItem
}
    
majiangFactory.getActionPlayNodePos = function(direction)
{
    var pos = {}
    switch(direction)
    {
        case 0://down
        {
            pos.x = 600
            pos.y = 200
            break
        }
        case 1://right
        {
            pos.x = 1050
            pos.y = 480
            break
        }
        case 2://up
        {
            pos.x = 600
            pos.y = 680  
            break
        }
        case 3://left
        {
            pos.x = 150
            pos.y = 480
            break
        }
    }  
    return pos
}

majiangFactory.peng2Gang = function(cardData ,majiangsOneDirection, direction)
{
    for(var i=0;i<majiangsOneDirection.length;i++)
    {
        var majiangsOneGroup = majiangsOneDirection[i]
        if(majiangsOneGroup.cbWeaveKind == WIK_PENG && majiangsOneGroup[0].cardData == cardData)
        {
            var where = {}
            where.name = 'weave'
            where.data = {weaveIdx:i, idxInWeave:3}
            var mj = majiangFactory.getOne(cardData, direction, where)
            var parent = majiangsOneGroup[0].getParent()
            parent.addChild(mj)

            majiangsOneGroup[3] = mj
            majiangsOneGroup.cbWeaveKind = WIK_GANG
            break
        }
    }
}

majiangFactory.weaveItem2Majiangs = function(operateDirection, weaveIdx, weaveItem, isPublicAnGang)
{
    var cbValidCardDatas = weaveItem.cbValidCardDatas
    var wProvideUser = weaveItem.wProvideUser
    var provideShowChairId = tableData.getShowChairIdWithServerChairId(wProvideUser)
    var provideDirection = majiangFactory.showChairId2Direction(provideShowChairId)

    var operateUser = tableData.getServerChairIdWithShowChairId(operateDirection)

    var arrowIdx = -1
    if(provideDirection!=operateDirection)
    {
        if(weaveItem.cbWeaveKind == WIK_LEFT)
            arrowIdx = 0
        else if(weaveItem.cbWeaveKind == WIK_CENTER)
            arrowIdx = 1
        else if(weaveItem.cbWeaveKind == WIK_RIGHT)
            arrowIdx = 2      
        else if(weaveItem.cbWeaveKind == WIK_PENG)
            arrowIdx = 1    
        else if(weaveItem.cbWeaveKind&(WIK_GANG|WIK_MINGANG|WIK_ANGANG|WIK_PENGGANG))
            arrowIdx = 3   
    }
console.log(55555, arrowIdx, weaveItem.cbWeaveKind, provideDirection, operateDirection)
    var majiangs = []
    for(var i=0;i<cbValidCardDatas.length;i++)
    {
        var cardData = cbValidCardDatas[i]
        if(weaveItem.cbWeaveKind==WIK_ANGANG)
        {
            if(i<3)
                cardData = 0
            else if( tableData.getUserWithUserId(selfdwUserID).wChairID!=operateUser && !isPublicAnGang)
                cardData = 0
        }
        var where = {}
        where.name = 'weave'
        where.data = {weaveIdx:weaveIdx, idxInWeave:i}

        var mj = majiangFactory.getOne(cardData, operateDirection, where)

        if(i == arrowIdx)
        {
            var zi = mj.getChildByTag(101)
            var directionSpr = new cc.Sprite('#mf_weaveDirection.png')
            directionSpr.setRotation(180-provideDirection*90 - zi.getRotation())

            directionSpr.x = zi.width*0.5
            directionSpr.y = 10
            directionSpr.scale = operateDirection==0?1:1.4
            zi.addChild(directionSpr, 0, 101)
        }

        majiangs[majiangs.length] = mj
    }  
    majiangs.weaveItem = weaveItem
    majiangs.cbWeaveKind = weaveItem.cbWeaveKind

    return majiangs
}




majiangFactory.insertHandMajiangsOld = majiangFactory.addHandMajiangsOld

majiangFactory.moveHandMajiangNew2Old = function(handMajiangs, direction, parent)
{
    if(handMajiangs[1])
    {
        majiangFactory.insertHandMajiangsOld(handMajiangs, direction, handMajiangs[1].cardData, parent)
        majiangFactory.deleteHandMajiangs(handMajiangs, direction, handMajiangs[1].cardData)
    }
}

//‘增删减查’
majiangFactory.addWeaveMajiangs = function(majiangsOneDirection, direction, weaveItem, parent, selfDirection)
{
    var isPublicAnGang = majiangFactory.isPublicAnGang
    var groupIdx = majiangsOneDirection.length

    var isSelf = selfDirection == direction
    var majiangsOneGroup = majiangFactory.weaveItem2Majiangs(direction, groupIdx, weaveItem, isPublicAnGang)
    for(var i=0;i<majiangsOneGroup.length;i++)
    {
        parent.addChild(majiangsOneGroup[i])
    }
    majiangsOneDirection[groupIdx] = majiangsOneGroup
},

//处理吃碰杠 主要会调用到手牌堆、丢弃牌堆、吃碰杠牌堆的‘增删减查’
majiangFactory.onActionResult = function(action, cardDatas, operateUser, provideUser, majiangs4W4D, mjsNode)
{
    if(action==WIK_REPLACE)
        majiangFactory.onActionReplace(cardDatas, operateUser, provideUser, majiangs4W4D, mjsNode)
    if(action==WIK_GANG)
        majiangFactory.onActionGang(cardDatas, operateUser, provideUser, majiangs4W4D, mjsNode)
    else if(action == WIK_PENG)
        majiangFactory.onActionPeng(cardDatas, operateUser, provideUser, majiangs4W4D, mjsNode)
    else if(action == WIK_LEFT)
        majiangFactory.onActionChi(action, cardDatas, operateUser, provideUser, majiangs4W4D, mjsNode)
    else if(action == WIK_CENTER)
        majiangFactory.onActionChi(action, cardDatas, operateUser, provideUser, majiangs4W4D, mjsNode)
    else if(action == WIK_RIGHT)
        majiangFactory.onActionChi(action, cardDatas, operateUser, provideUser, majiangs4W4D, mjsNode)
}

majiangFactory.onActionReplace = function(cardDatas, operateUser, provideUser, majiangs4W4D, mjsNode)
{
    var operateUserDir = tableData.getShowChairIdWithServerChairId(operateUser.wChairID)
    var operateHandMajiangs = majiangs4W4D.handMajiangs4D[operateUserDir]
    var operateFlowerMajiangs = majiangs4W4D.flowerMajiangs4D[operateUserDir]
    var operateFlowerMajiangsNode = operateUser.userNodeInsetChair.currentRoundNode.flowerMajiangsNode

    for(var i=0;i<cardDatas.length;i++)
    {
        var deleteCardData = (operateUser.dwUserID == selfdwUserID || isRecordScene)?cardDatas[i]:0
        var flowerCardData = cardDatas[i]
        majiangFactory.deleteHandMajiangs(operateHandMajiangs, operateUserDir, deleteCardData)

        majiangFactory.addFlowerMajiangs(operateFlowerMajiangs, operateUserDir, flowerCardData, mjsNode)
    }
}

var WIK_MINGANG = 0x1010                                //杠牌类型
var WIK_ANGANG = 0x2020                             //杠牌类型
var WIK_PENGGANG = 0x3040                               //杠牌类型

majiangFactory.onActionGang = function(cardDatas, operateUser, provideUser, majiangs4W4D, mjsNode)
{
    var cardData = cardDatas[0]
    var gangType //0暗杠 1明杠 2增杠
    var operateUserDir = tableData.getShowChairIdWithServerChairId(operateUser.wChairID)
    var provideUserDir = tableData.getShowChairIdWithServerChairId(provideUser.wChairID)
    var operateWeaveMajiangs = majiangs4W4D.weaveMajiangs4D[operateUserDir]
    var operateHandMajiangs = majiangs4W4D.handMajiangs4D[operateUserDir]
    var provideDiscardMajiangs = majiangs4W4D.discardMajiangs4D[provideUserDir]
    var WIKS = [WIK_ANGANG, WIK_MINGANG, WIK_PENGGANG]


    var isHasInWeave = false
    for(var i=0;i<operateWeaveMajiangs.length;i++)
    {
        var majiangsOneGroup = operateWeaveMajiangs[i]
        if(majiangsOneGroup.cbWeaveKind == WIK_PENG && majiangsOneGroup[0].cardData == cardData)
        {
            isHasInWeave = true
            break
        }
    }

    if(isHasInWeave)
        gangType = 2
    else if(operateUser==provideUser)
        gangType = 0
    else
        gangType = 1

    var deleteCardData = (operateUser.dwUserID == selfdwUserID || isRecordScene)?cardData:0
    if(gangType==2)
    {
        majiangFactory.deleteHandMajiangs(operateHandMajiangs, operateUserDir, deleteCardData)
        majiangFactory.moveHandMajiangNew2Old(operateHandMajiangs, operateUserDir, mjsNode)
        majiangFactory.peng2Gang(cardData, operateWeaveMajiangs, operateUserDir)
    }
    else
    {
        var deleteLen = 4
        if(gangType==1)
        {
            majiangFactory.popDiscardMajiangs(provideDiscardMajiangs)
            deleteLen = deleteLen - 1
        }
        for(var i=0;i<deleteLen;i++)
        {
            majiangFactory.deleteHandMajiangs(operateHandMajiangs, operateUserDir, deleteCardData)
        }

        var self = tableData.getUserWithUserId(selfdwUserID)
        var selfDir = tableData.getShowChairIdWithServerChairId(self.wChairID)
        majiangFactory.addWeaveMajiangs(operateWeaveMajiangs, operateUserDir, 
            {
                'cbCardDatas':[cardData, cardData, cardData, cardData],
                'cbValidCardDatas':[cardData, cardData, cardData, cardData],
                'cbChangeCardDatas':[cardData, cardData, cardData, cardData],
                'wProvideUser':provideUser.wChairID,
                'provideDirection':provideUserDir,
                'cbCenterCardData':cardData,
                'cbWeaveKind':WIKS[gangType],
                'cbPublicCard':gangType,
            }, 
            mjsNode,
            selfDir,
            majiangFactory.isPublicAnGang
            )
    }
}

majiangFactory.onActionChi = function(action, cardDatas, operateUser, provideUser, majiangs4W4D, mjsNode)
{
    var operateUserDir = tableData.getShowChairIdWithServerChairId(operateUser.wChairID)
    var provideUserDir = tableData.getShowChairIdWithServerChairId(provideUser.wChairID)
    var operateWeaveMajiangs = majiangs4W4D.weaveMajiangs4D[operateUserDir]
    var operateHandMajiangs = majiangs4W4D.handMajiangs4D[operateUserDir]
    var provideDiscardMajiangs = majiangs4W4D.discardMajiangs4D[provideUserDir]

    var weaveCardDatas = cardDatas
    // if(action == WIK_LEFT)
    //     weaveCardDatas = [cardData, cardData+1, cardData+2]
    // else if(action == WIK_CENTER)
    //     weaveCardDatas = [cardData-1, cardData, cardData+1]
    // else if(action == WIK_RIGHT)
    //     weaveCardDatas = [cardData-2, cardData-1, cardData]

    var provideCardData = provideDiscardMajiangs[provideDiscardMajiangs.length-1].cardData
    if(operateUser.dwUserID == selfdwUserID || isRecordScene)
    {
        var deleteCardDatas = clone(weaveCardDatas)
        for(var i=0;i<deleteCardDatas.length;i++)
        {
            if(deleteCardDatas[i] == provideCardData)
            {
                deleteCardDatas.splice(i, 1)
                break
            }
        }
    }
    else
        var deleteCardDatas = [0, 0]
    //////
    majiangFactory.popDiscardMajiangs(provideDiscardMajiangs)
    for(var i=0;i<deleteCardDatas.length;i++)
    {
        majiangFactory.deleteHandMajiangs(operateHandMajiangs, operateUserDir, deleteCardDatas[i])
    }
    var self = tableData.getUserWithUserId(selfdwUserID)
    var selfDir = tableData.getShowChairIdWithServerChairId(self.wChairID)
    majiangFactory.addWeaveMajiangs(operateWeaveMajiangs, operateUserDir, 
    {
        'cbCardDatas':weaveCardDatas,
        'cbValidCardDatas':weaveCardDatas,
        'cbChangeCardDatas':weaveCardDatas,
        'wProvideUser':provideUser.wChairID,
        'provideDirection':provideUserDir,
        'cbCenterCardData':provideCardData,
        'cbWeaveKind':action,
        'cbPublicCard':1,
    }, 
    mjsNode,
    selfDir,
    majiangFactory.isPublicAnGang
    )

    var maxCardData = operateHandMajiangs[0][operateHandMajiangs[0].length-1].cardData
    majiangFactory.deleteHandMajiangs(operateHandMajiangs, operateUserDir, maxCardData)
    majiangFactory.addHandMajiangNew(operateHandMajiangs, operateUserDir, maxCardData, 
            mjsNode)

}

majiangFactory.onActionPeng = function(cardDatas, operateUser, provideUser, majiangs4W4D, mjsNode)
{
    var cardData = cardDatas[0]
    var operateUserDir = tableData.getShowChairIdWithServerChairId(operateUser.wChairID)
    var provideUserDir = tableData.getShowChairIdWithServerChairId(provideUser.wChairID)
    var operateWeaveMajiangs = majiangs4W4D.weaveMajiangs4D[operateUserDir]
    var operateHandMajiangs = majiangs4W4D.handMajiangs4D[operateUserDir]
    var provideDiscardMajiangs = majiangs4W4D.discardMajiangs4D[provideUserDir]

    var weaveCardDatas = [cardData, cardData, cardData]

    if(operateUser.dwUserID == selfdwUserID || isRecordScene)
    {
        var deleteCardDatas = [cardData, cardData]
    }
    else
        var deleteCardDatas = [0, 0]

    //////
    majiangFactory.popDiscardMajiangs(provideDiscardMajiangs)
    for(var i=0;i<deleteCardDatas.length;i++)
    {
        majiangFactory.deleteHandMajiangs(operateHandMajiangs, operateUserDir, deleteCardDatas[i])
    }

    var self = tableData.getUserWithUserId(selfdwUserID)
    var selfDir = tableData.getShowChairIdWithServerChairId(self.wChairID)
    majiangFactory.addWeaveMajiangs(operateWeaveMajiangs, operateUserDir, 
    {
        'cbCardDatas':weaveCardDatas,
        'cbValidCardDatas':weaveCardDatas,
        'cbChangeCardDatas':weaveCardDatas,
        'wProvideUser':provideUser.wChairID,
        'provideDirection':provideUserDir,
        'cbCenterCardData':cardData,
        'cbWeaveKind':WIK_PENG,
        'cbPublicCard':1,
    }, 
    mjsNode,
    selfDir,
    majiangFactory.isPublicAnGang
    )
   
    var maxCardData = operateHandMajiangs[0][operateHandMajiangs[0].length-1].cardData
    majiangFactory.deleteHandMajiangs(operateHandMajiangs, operateUserDir, maxCardData)
    majiangFactory.addHandMajiangNew(operateHandMajiangs, operateUserDir, maxCardData, 
            mjsNode)
}