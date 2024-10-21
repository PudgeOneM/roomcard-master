// var gameScanner = {}

// gameScanner.scanArray = []


// gameScanner.init = function()
// {
// 	//微信stoprecord 不返回事件
// 	var callEveryScan = function()
// 	{	
// 		if(managerAudio.isWxVoiceRecording)
// 		{
// 			if(!this.beginTime)
// 				this.beginTime = new Date().getTime()
// 		}
// 		else
// 			this.beginTime = null
// 	}
// 	var isTrigger = function()
// 	{	
// 		return this.beginTime && new Date().getTime() - this.beginTime > 20000
// 	}
// 	var triggerFun = function()
// 	{	
// 		managerAudio.wxStopRecord()
// 		this.beginTime = new Date().getTime() - 15000
// 	}
// 	gameScanner.addScanTarget(callEveryScan, isTrigger, triggerFun)


// 	// //微信播放结束不返回事件
// 	// var callEveryScan = function()
// 	// {	
// 	// 	if(managerAudio.isWxVoicePlaying)
// 	// 	{	
// 	// 		//新的语音被播放
// 	// 		if(!this.localId || this.localId != managerAudio.wxVoiceArray[0][3])
// 	// 		{
// 	// 			if(!this.beginTime)
// 	// 			{
// 	// 				this.beginTime = new Date().getTime()
// 	// 				this.localId = managerAudio.wxVoiceArray[0][3]
// 	// 			}

// 	// 		}
// 	// 	}
// 	// 	else
// 	// 		this.beginTime = null
// 	// }
// 	// var isTrigger = function()
// 	// {	
// 	// 	return this.beginTime && new Date().getTime() - this.beginTime > 15000
// 	// }
// 	// var triggerFun = function()
// 	// {	

// 	// 	wx.stopVoice({
// 	//       localId: voice.localId
// 	//     });
// 	// }
// 	// gameScanner.addScanTarget(callEveryScan, isTrigger, triggerFun)

// }

// gameScanner.start = function()
// {
// 	// gameScanner.init()

// 	// window.setInterval(function()
// 	// {
// 	// 	for(var i in gameScanner.scanArray)
// 	// 	{
// 	// 		var  scanTarget = gameScanner.scanArray[i]
// 	// 		scanTarget.callEveryScan()
// 	// 		if(scanTarget.isTrigger())
// 	// 			scanTarget.triggerFun()
// 	// 	}
// 	// },1000)
// }

// gameScanner.addScanTarget = function(callEveryScan, isTrigger, triggerFun)
// {
// 	var scanTarget = {}
// 	gameScanner.scanArray[gameScanner.scanArray.length] = scanTarget

// 	scanTarget.callEveryScan = callEveryScan
// 	scanTarget.isTrigger = isTrigger
// 	scanTarget.triggerFun = triggerFun
// }


