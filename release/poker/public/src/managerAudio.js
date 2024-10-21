

var managerAudio = {}

managerAudio.init = function()
{
    managerAudio.wxVoiceArray = []  //userId voiceLen voiceId localId
    managerAudio.wxVoiceLastId = []

    managerAudio.isVoiceDeviceUsing = false
    managerAudio.isWxVoicePlaying = false  
    managerAudio.isWxVoiceRecording = false
    // managerAudio.isWxInterfaceUsing = false //

    managerAudio.registReStartEvent()

}

managerAudio.registReStartEvent = function()
{
    var l = cc.EventListener.create({
        event: cc.EventListener.CUSTOM,
        eventName: "reStart",
        callback: function(event)
        {   
          if(managerAudio.isWxVoiceRecording)
              wx.stopRecord()
        }
    })
    cc.eventManager.addListener(l, 2)
}

managerAudio.stopAllEffects = function()
{
  cc.audioEngine.stopAllEffects()
}

managerAudio.playEffect = function(url, loop)
{ 
  if(!isOpenSound)
    return; 
  
  gameLog.log('managerAudio.playEffect:', managerAudio.isVoiceDeviceUsing)
  if(managerAudio.isVoiceDeviceUsing) return;
  var soundId = cc.audioEngine.playEffect(url, loop)
  //var soundId = cc.audioEngine.playMusic(url, loop)
  return soundId
}

managerAudio.stopEffect = function(soundId)
{
  cc.audioEngine.stopEffect(soundId)
}

managerAudio.pauseEffect = function(soundId) 
{
    cc.audioEngine.pauseEffect(soundId)
}

managerAudio.resumeEffect = function(soundId) 
{
    cc.audioEngine.resumeEffect(soundId)
}

managerAudio.pauseAllEffects = function() 
{
    cc.audioEngine.pauseAllEffects()
}

managerAudio.resumeAllEffects = function() 
{
    cc.audioEngine.resumeAllEffects()
}

managerAudio.setEffectsVolume = function(volume) 
{
    cc.audioEngine.setEffectsVolume(volume)
}


//需要特别处理
//1、任何接口都不能同时调用！！！ 甚至间隔太短也会有问题
//startrecord-stoprecord  2000
//stoprecord-upload 1000
//2、有几率会收不到事件 将所有超过两秒返回的事件全部忽略作不返回处理
managerAudio._whenWxNoCallBack = function(time, call)
{
  var id = cocos.setTimeout(function()
  { 
    gameLog.log('_whenWxNoCallBack')
    call()
  }, time)
  return id
}

managerAudio.wxStartRecord = function(cancel, success, fail)
{ 
    gameLog.log('wxStartRecord', managerAudio.isVoiceDeviceUsing, managerAudio.isWxVoicePlaying, managerAudio.isWxVoiceRecording)

    if(managerAudio.isWxVoicePlaying)
    {   
        fail?fail():''
        return;
    }
    
    gameLog.log('wx.startRecord')
    function cancleCall()
    {
        gameLog.lowxg('cancel wxStartRecord')
        managerAudio.isVoiceDeviceUsing = false
        // managerAudio.isWXRecordUserAgree = false
        cancel?cancel():''
    }

    function successCall()
    {
        gameLog.log('wxStartRecord success')
        managerAudio.isWxVoiceRecording = true
        success?success():''
    }

    function failCall()
    {
        gameLog.log('wxStartRecord fail')
        managerAudio.isVoiceDeviceUsing = false
        fail?fail():''
    }

    managerAudio.stopAllEffects() 
    managerAudio.isVoiceDeviceUsing = true   

    var timeout = false
    var id = managerAudio._whenWxNoCallBack(2000, function()
    {   
        timeout = true
        failCall()
    })
    wx.startRecord({
    cancel: function() 
    {   
        gameLog.log('cancel')
        if(timeout) return;
        else
        {
          cocos.clearTimeout(id)
          cancleCall()
        }
    },
    success: function()
    {
        gameLog.log('success')
        if(timeout)
        {
          wx.stopRecord()//还没测过
        }
        else
        {
          cocos.clearTimeout(id)
          successCall()
        }
    },
    fail: function()
    {   
        gameLog.log('fail')
        if(timeout) return;
        else
        {
          cocos.clearTimeout(id)
          failCall()
        }
    }
    })
}

managerAudio.wxStopRecordFailTime = 0
managerAudio.wxStopRecord = function(success, fail)
{
  gameLog.log('wxStopRecord', managerAudio.isVoiceDeviceUsing, managerAudio.isWxVoicePlaying, managerAudio.isWxVoiceRecording)
  if(managerAudio.wxStopRecordFailTime>5)
  {   
      socket.closeWithPop('微信录音无法正常使用,请尝试重新进入游戏', 1) //todo
      return;
  }

  gameLog.log('wx.stopRecord')
  function successCall(res)
  {     
      gameLog.log('wxStopRecord success')
      managerAudio.wxStopRecordFailTime = 0
      managerAudio.isWxVoiceRecording = false
      managerAudio.isVoiceDeviceUsing = false
      success?success(res):''
  }

  function failCall()
  {   
      gameLog.log('wxStopRecord fail')
      managerAudio.wxStopRecordFailTime = managerAudio.wxStopRecordFailTime + 1 
      fail?fail():''
      cocos.setTimeout(function()
      {
        managerAudio.wxStopRecord(success, fail)
      }, 2000)
  }

  var timeout = false
  var id = managerAudio._whenWxNoCallBack(2000, function()
  {   
      timeout = true
      failCall()
  })
  wx.stopRecord({
    success: function(res)
      {
          gameLog.log('success')
          if(timeout) return;
          else
          {
            cocos.clearTimeout(id)
            successCall(res)
          }
      },
      fail: function()
      {  
          gameLog.log('fail')
          if(timeout) return;
          else
          {
            cocos.clearTimeout(id)
            failCall()
          }
      }})
}

var uploadVoicefailTimes = 0
managerAudio.wxUpload = function(localId, success, fail)
{
    gameLog.log('wxUpload', managerAudio.isVoiceDeviceUsing, managerAudio.isWxVoicePlaying, managerAudio.isWxVoiceRecording)

    gameLog.log('wx.uploadVoice')
    function successCall(res)
    {   
        gameLog.log('uploadVoice success')
        uploadVoicefailTimes = 0
        success?success(res):''
    }

    function failCall()
    {   
        gameLog.log('uploadVoice fail')
        showTipsTTF({str:'上传语音失败'}) 
        uploadVoicefailTimes = uploadVoicefailTimes + 1
        if(uploadVoicefailTimes>=2)
        {
            //sendLogToServer(gameLog.logS + 'wtms上传语音失败wtms')
            alert('获取录音权限异常，请尝试重启微信')
        }
        fail?fail():''
    }

    var timeout = false
    var id = managerAudio._whenWxNoCallBack(5000, function()
    {   
        timeout = true
        failCall()
    })
    wx.uploadVoice({
      localId:localId,
      isShowProgressTips: 0,
      success: function (res) {
          gameLog.log('success')
          if(timeout) return;
          else
          {
            cocos.clearTimeout(id)
            successCall(res)
          }
      },
      fail: function()
      {   
          gameLog.log('fail')
          if(timeout) return;
          else
          {
            cocos.clearTimeout(id)
            failCall()
          }
      }
    })
}

managerAudio.wxDownload = function(serverId, success, fail)
{ 
    gameLog.log('wxDownload', managerAudio.isVoiceDeviceUsing, managerAudio.isWxVoicePlaying, managerAudio.isWxVoiceRecording)

    gameLog.log('wx.downloadVoice')
    function successCall(res)
    {        
        gameLog.log('wxDownload success'+serverId)
        success?success(res):''
    }

    function failCall()
    {   
        gameLog.log('downloadVoice fail')
        managerAudio._popWxVoiceArray()
        fail?fail():''
    }

    var timeout = false
    var id = managerAudio._whenWxNoCallBack(5000, function()
    {   
        timeout = true
        failCall()
    })

    wx.downloadVoice({
          serverId: serverId,
          isShowProgressTips: 0,
          success: function (res) {
              gameLog.log('success')
              if(timeout) return;
              else
              {
                cocos.clearTimeout(id)
                successCall(res)
              }
          },
          fail: function()
          {   
              gameLog.log('fail')
              if(timeout) return;
              else
              {
                cocos.clearTimeout(id)
                gameLog.log('wxvoice1:' + managerAudio.wxVoiceArray)
                failCall()
                gameLog.log('wxvoice2:' + managerAudio.wxVoiceArray)
              }
          }
        })
}

managerAudio.wxPlay = function(localId, success, fail)
{ 
  gameLog.log('wxPlay', managerAudio.isVoiceDeviceUsing, managerAudio.isWxVoicePlaying, managerAudio.isWxVoiceRecording)

  gameLog.log('wx.playVoice')
  function successCall()
  {   
      gameLog.log('wxPlay success ' + localId)
      managerAudio.isWxVoicePlaying = true
      managerAudio.isVoiceDeviceUsing = true

      var event = new cc.EventCustom("wxPlay")
      cc.eventManager.dispatchEvent(event)
      
      managerAudio._startWxPlayEndTimeout(localId)
      success?success():''
  }

  function failCall()
  {   
      gameLog.log('wxPlay fail')
      managerAudio._popWxVoiceArray()
      fail?fail():''
  }

  var timeout = false
  var id = managerAudio._whenWxNoCallBack(2000, function()
  {   
      timeout = true
      failCall()
  })

  //安卓下，同时只能播放一个audio音频，不支持多个audio音频同时播放
  managerAudio.stopAllEffects() 
  wx.playVoice({
    localId:localId,
    success:function()
    {   
        gameLog.log('success')
        if(timeout) return;
        else
        {
          cocos.clearTimeout(id)
          successCall()
        }
    },
    fail:function()
    {    
        gameLog.log('fail')
        if(timeout) return;
        else
        {
          cocos.clearTimeout(id)
          failCall()
        }
    }
  })
}


//微信的playend事件不靠谱！
managerAudio._startWxPlayEndTimeout = function(localId)
{ 
  var voiceLen = 0
  for(var i in managerAudio.wxVoiceArray)
  {
    if(managerAudio.wxVoiceArray[i].localId == localId)
    voiceLen = managerAudio.wxVoiceArray[i].voiceLen
  }

  cocos.setTimeout(function()
  {
      managerAudio._popWxVoiceArray()
      managerAudio.isVoiceDeviceUsing = false
  },voiceLen*1000)
}


managerAudio._popWxVoiceArray = function()
{   
    managerAudio.wxVoiceArray.splice(0, 1)
    managerAudio.isWxVoicePlaying = managerAudio.wxVoiceArray.length != 0
    var event = new cc.EventCustom("wxPlayEnd")
    cc.eventManager.dispatchEvent(event)
}




//进入后台后禁止微信播放
managerAudio.stop = function()
{
  managerAudio.setEffectsVolume(0)
}

//重进后重新播放微信
managerAudio.recover = function()
{
  managerAudio.setEffectsVolume(1)
}




