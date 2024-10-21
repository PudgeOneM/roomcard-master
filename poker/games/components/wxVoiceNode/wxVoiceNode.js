
var wxVoiceNode = 
{   
    wxVoiceMaxTime:15,
    voiceNode:null,
    voiceIconSpr:null,
    voiceBg:null,
    voiceSecond:null,
    voicePlaySpr:null,
    voicePlayNode:null,
    isPlayFirstWxVoice:false,
    resp:'components/wxVoiceNode/res/',
    preLoadRes:
    [
    'components/wxVoiceNode/res/wxVoiceNode.plist', 
    'components/wxVoiceNode/res/wxVoiceNode.png'
    ],
    onPreLoadRes:function()
    {
        var resp = wxVoiceNode.resp
        cc.spriteFrameCache.addSpriteFrames(resp + 'wxVoiceNode.plist', resp + 'wxVoiceNode.png')
    },
    init:function(voicePlayNode)
    {
        var voiceNode = new cc.Node()
        var voiceIconSpr = new cc.Sprite('#wvn_voiceIcon01.png')
        var voiceBg = new cc.Sprite('#wvn_voiceBg.png')
        var voiceSecond = cc.LabelTTF.create('1', "Helvetica", 24)   
        //
        wxVoiceNode.voicePlayNode = voicePlayNode
        
        voiceIconSpr.isTouchEnable = true
        cc.eventManager.addListener(wxVoiceNode._getVoiceIconListener(), voiceIconSpr)  
        voiceNode.addChild(voiceIconSpr)
  
        //
        voiceBg.setVisible(false)
        voiceBg.setPosition(cc.p( -10, 40 ))
        voiceBg.setAnchorPoint(cc.p(0.5, 0))
        voiceNode.addChild(voiceBg)
        voiceSecond = cc.LabelTTF.create('1', "Helvetica", 24)   
        voiceSecond.setPosition(cc.p( 62.5, 45 ))
        voiceSecond.setAnchorPoint(cc.p(1, 0.5))
        var t = cc.LabelTTF.create("''", "Helvetica", 24)   
        t.setPosition(cc.p( 62.5, 45 ))
        t.setAnchorPoint(cc.p(0, 0.5))
        voiceBg.addChild(voiceSecond)
        voiceBg.addChild(t)

        ////////
        var l = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "wxPlay",
            callback: function(event)
            {
                voiceIconSpr.color = managerAudio.isWxVoicePlaying?cc.color(100,100,100):cc.color(255,255,255)
                voiceIconSpr.isTouchEnable = !managerAudio.isWxVoicePlaying
            }
        })
        cc.eventManager.addListener(l, 1)

        var l = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "wxPlayEnd",
            callback: function(event)
            {
                voiceIconSpr.color = managerAudio.isWxVoicePlaying?cc.color(100,100,100):cc.color(255,255,255)
                voiceIconSpr.isTouchEnable = !managerAudio.isWxVoicePlaying


                if(wxVoiceNode.voicePlaySpr)
                {
                    wxVoiceNode.voicePlaySpr.removeFromParent()
                    wxVoiceNode.voicePlaySpr = null
                }
                gameLog.log('playfirst1')
                wxVoiceNode.isPlayFirstWxVoice = false
                wxVoiceNode.playFirstWxVoice() 
            }
        })
        cc.eventManager.addListener(l, 1)


        wxVoiceNode.voiceNode = voiceNode
        wxVoiceNode.voiceIconSpr = voiceIconSpr
        wxVoiceNode.voiceBg = voiceBg
        wxVoiceNode.voiceSecond = voiceSecond
        
    },
    _getVoiceIconListener:function()
    {
        var onVoiceStateChange = function(isWxVoiceRecordingJustNow)
        {
            if(isWxVoiceRecordingJustNow)
            {   
                wxVoiceNode.voiceIconSpr.setSpriteFrame('wvn_voiceIcon01.png')
                wxVoiceNode.voiceBg.setVisible(false)
            }
            else
            {                
                wxVoiceNode.voiceIconSpr.setSpriteFrame('wvn_voiceIcon02.png') 
                wxVoiceNode.voiceBg.setVisible(true)
            }
        }

        var stopRecoard = function(isNeedUpload, voiceLen)
        { 
            var call = isNeedUpload?function(res)
            {   
                managerAudio.wxUpload(res.localId, function(res)
                {
                    var v = getObjWithStructName('CMD_GR_C_WeChat')
                    v.dwUserID = selfdwUserID
                    v.wTableID = tableData.getUserWithUserId(selfdwUserID).wTableID

                    v.szVoiceID = res.serverId
                    v.wTime = voiceLen
                    socket.sendMessage(MDM_GR_USER, SUB_GR_USER_WECHAT, v) 
                })
            }:null

            onVoiceStateChange(true)
            managerAudio.wxStopRecord(call)
        }

        var listener = cc.EventListener.create
        ({
        event: cc.EventListener.TOUCH_ONE_BY_ONE,
        swallowTouches: true,
        onTouchBegan: function (touch, event) {
            var target = event.getCurrentTarget()
            if( !target.isTouchEnable || !isRealVisible(target))
                return false

            var locationInNode = target.convertToNodeSpace(touch.getLocation())
            var s = target.getContentSize();
            var rect = cc.rect(0, 0, s.width, s.height)
            if (cc.rectContainsPoint(rect, locationInNode)) {
                return true
            }
            return false
        },
        onTouchEnded: function (touch, event) 
        {         
            var target = event.getCurrentTarget()
            if( managerTouch.isQuickTouch(target, 3000) )
                return;
            var locationInNode = target.convertToNodeSpace(touch.getLocation())
            var s = target.getContentSize();
            var rect = cc.rect(0, 0, s.width, s.height)

            if (cc.rectContainsPoint(rect, locationInNode)) 
            {   
                if(!managerAudio.isWxVoiceRecording)
                {   
                    function timeOutCallback()
                    {  
                        stopRecoard(true, wxVoiceNode.wxVoiceMaxTime + 1)
                    }

                    function getStrFun(str)
                    {
                        return parseInt(str) - 1
                    }
                    managerAudio.wxStartRecord(function()
                    {
                    },
                    function()
                    {   
                        onVoiceStateChange(false)
                        clock.tickLabel(wxVoiceNode.voiceSecond, wxVoiceNode.wxVoiceMaxTime, 0, getStrFun, timeOutCallback)
                    },
                    function()
                    {
                    })
                }
                else
                {   
                    wxVoiceNode.voiceSecond.clearTick()
                    stopRecoard( true, wxVoiceNode.wxVoiceMaxTime - parseInt(wxVoiceNode.voiceSecond.getString()) + 1)   
                }
            }
            else
            {
                if(managerAudio.isWxVoiceRecording)
                {   
                    wxVoiceNode.voiceSecond.clearTick()
                    stopRecoard(false)
                }
            }
        }
        })

        return listener
    },
    playFirstWxVoice:function() 
    {
        if(wxVoiceNode.isPlayFirstWxVoice)
            return;
        var wxVoice = managerAudio.wxVoiceArray[0]
        if(!wxVoice)
            return;
        wxVoiceNode.isPlayFirstWxVoice = true
        var userId = wxVoice.userId
        var voiceId = wxVoice.voiceId

        managerAudio.wxDownload(voiceId, 
            function(res) 
            {
                managerAudio.wxVoiceArray[0].localId = res.localId
                managerAudio.wxVoiceLastId[userId] = res.localId
                managerAudio.wxPlay(res.localId,
                function()
                {
                    var user = tableData.getUserWithUserId(userId)
                    if(wxVoiceNode.voicePlaySpr)
                    {
                        wxVoiceNode.voicePlaySpr.removeFromParent()
                        wxVoiceNode.voicePlaySpr = null
                    }
                    if(user)
                    {
                        if(tableData.isInTable(user.cbUserStatus))
                        {   
                            wxVoiceNode.voicePlaySpr = actionFactory.getSprWithAnimate('wvn_voicePlay_')
                            user.userNodeInsetChair.voiceNode.addChild(wxVoiceNode.voicePlaySpr)
                        }
                        else
                        {
                            wxVoiceNode.voicePlaySpr = actionFactory.getSprWithAnimate('wvn_voicePlay2_')
                            wxVoiceNode.voicePlayNode.addChild(wxVoiceNode.voicePlaySpr)
                        }
                    }
                },
                function()
                {   
                    gameLog.log('playfirst2')
                    wxVoiceNode.isPlayFirstWxVoice = false
                    wxVoiceNode.playFirstWxVoice()
                }) 
            },
            function()
            {
                 gameLog.log('playfirst3')
                wxVoiceNode.isPlayFirstWxVoice = false
                wxVoiceNode.playFirstWxVoice()
            })
    },

}