
var CMD_C_Gm = 
[
    ['BYTE', 'cbGmMagicData'],
    ['BYTE', 'cbGmCardDatas', 100]
]
var majiangGmPop2 = majiangGmPop = 
{   
    resp:'components/majiangGmPop2/res/',
    user0Idxs:[0x01,0x01,0x02,0x02,0x03,0x03,0x04,0x04,0x05,0x05,0x06,0x06,0x07,0x07,0x08,0x08],
    user1Idxs:[0x11,0x11,0x12,0x12,0x13,0x13,0x14,0x14,0x15,0x15,0x16,0x16,0x17,0x17,0x18,0x18],
    user2Idxs:[0x01,0x01,0x02,0x02,0x03,0x03,0x04,0x04,0x05,0x05,0x06,0x06,0x07,0x07,0x08,0x08],
    user3Idxs:[0x11,0x11,0x12,0x12,0x13,0x13,0x14,0x14,0x15,0x15,0x16,0x16,0x17,0x17,0x18,0x18],
    user4Idxs:[1,2,1,1,1,1,1,1,1,1,1,1,1,1,1],

    currentIdx:0x11,
    preLoadRes:
    [
    'components/majiangGmPop2/res/majiangGmPop.plist', 
    'components/majiangGmPop2/res/majiangGmPop.png'
    ],
    onPreLoadRes:function()
    {
        var resp = majiangGmPop.resp
        cc.spriteFrameCache.addSpriteFrames(resp + 'majiangGmPop.plist', resp + 'majiangGmPop.png')
    },
    getPop:function()
    {   
        var control = {}
        control.submitChangeCall = function()
        {
            var idxs = []
            for(var i=0;i<5;i++)
            {
                var len = i==4?14:(MAX_COUNT-1)
                for(var j=0;j<len;j++)
                {
                    idxs[idxs.length] = majiangGmPop['user'+i+'Idxs'][j]
                }
            }

            var gm = getObjWithStructName('CMD_C_Gm')
            gm.cbGmMagicData = majiangGmPop.user4Idxs[14]
            gm.cbGmCardDatas = idxs
            socket.sendMessage(MDM_GF_GAME,666,gm)
            node.removeFromParent()
        }

        control.gameEndCall = function()
        {
            socket.sendMessage(MDM_GF_GAME,777)
            node.removeFromParent()
        }

        var node  = managerRes.loadCCB('components/majiangGmPop2/res/majiangGmPop.ccbi', control)
        majiangGmPop.refreshUserIdx(control)
   
        function getListener1(idx)
        {
            var listener = cc.EventListener.create({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: true,
                onTouchBegan: function (touch, event) {
                    var target = event.getCurrentTarget()
                    var locationInNode = target.convertToNodeSpace(touch.getLocation())
                    var s = target.getContentSize();
                    var rect = cc.rect(0, 0, s.width, s.height)
                    if (cc.rectContainsPoint(rect, locationInNode)) {
                        return true
                    }
                    return false
                },
                onTouchEnded: function (touch, event) {
                    majiangGmPop.currentIdx = idx
                }
            })

            return listener
        }
        for(var i=1;i<73;i++)
        {
            var spr = control['idx'+i]
            if(!spr)    continue

            var l = getListener1(i)
            cc.eventManager.addListener(l, spr)
        }


        function getListener2(i, j)
        {
            var listener = cc.EventListener.create({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: true,
                onTouchBegan: function (touch, event) {
                    var target = event.getCurrentTarget()
                    var locationInNode = target.convertToNodeSpace(touch.getLocation())
                    var s = target.getContentSize();
                    var rect = cc.rect(0, 0, s.width, s.height)
                    if (cc.rectContainsPoint(rect, locationInNode)) {
                        return true
                    }
                    return false
                },
                onTouchEnded: function (touch, event) {
                    var idxs = majiangGmPop['user'+i+'Idxs']
                    idxs[j] = majiangGmPop.currentIdx
                    control['userIdx'+i+'_'+j].setSpriteFrame('mgp_' + idxs[j] + '.png') 
                }
            })
            return listener
        }
        for(var i=0;i<5;i++)
        {
            var len = i==4?15:(MAX_COUNT-1)
            for(var j=0;j<len;j++)
            {
                var spr = control['userIdx'+i+'_'+j]
                var l = getListener2(i, j)
                cc.eventManager.addListener(l, spr)
            }
        }

        return node
    },
    refreshUserIdx:function(control)
    {
        for(var i=0;i<5;i++)
        {
            var idxs = majiangGmPop['user'+i+'Idxs'] 
            var len = i==4?15:(MAX_COUNT-1)

            for(var j=0;j<len;j++)
            {
                var spr = control['userIdx'+i+'_'+j]
                spr.setSpriteFrame('mgp_' + idxs[j] + '.png') 
            }
        }
    }

}