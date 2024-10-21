
var stressTestReport = {}
var tableKeyWithUid = []

changeReportWithUid = function(uid, str)
{    
    if(!stressTestReport[uid])
        stressTestReport[uid] = '<br>'

    stressTestReport[uid] = stressTestReport[uid] + '>' + str

    var s = JSON.stringify(stressTestReport, null, '<br>')
    s = s.replace('}','<br>}')
    document.getElementById('testReport').innerHTML = s
    // s = ''
    // for(var i in tableKeyWithUid)
    // {
    //     s = s + '<br>' + tableKeyWithUid[i]
    // }
    // document.getElementById('tableKeyWithUid').innerHTML = s

}

clearStressTestReport = function()
{
    stressTestReport = {}
    document.getElementById('testReport').innerHTML = ''
}

clearTableKeyWithUid = function()
{
    tableKeyWithUid = []
}


createRoom = function() 
{
    var isClose = document.getElementById('isCloseSocket1').checked 
	var userBeginId = parseInt( document.getElementById(1).value ) 
	var userEndId = parseInt( document.getElementById(2).value )
	var sendInterval = parseInt( document.getElementById(3).value )
	var timeout = parseInt( document.getElementById(4).value )
	var testIdxForJudgeSuccess = 1

    clearStressTestReport()
    clearTableKeyWithUid()

	var uids = []
    for(var i=userBeginId;i<=userEndId;i++ )
    {
    	uids[uids.length] = i
    }

    var idx = 0
    var interval = setInterval(function()
    {	
    	if(uids[idx])
    	{
      		var worker = new Worker('/javascripts/startAInstance.js');  
            worker.onmessage = function(event) {
                var d = event.data
                if(d[0] == 'updateTableKeyWithUid')
                {
                    tableKeyWithUid[d[1][0]] = d[1][1]
                }
                else if(d[0] == 'changeReportWithUid')
                {
                    changeReportWithUid(d[1][0],d[1][1])
                }
            }
            worker.postMessage([uids[idx], timeout, testIdxForJudgeSuccess, isClose]) 
            idx = idx + 1
    	}
    	else
    	{
    		clearInterval(interval)
    	}
    },sendInterval)
}


fillRoom = function() 
{
    var isClose = document.getElementById('isCloseSocket2').checked 
	var userBeginId = parseInt( document.getElementById(5).value ) 
	var userEndId = parseInt( document.getElementById(6).value )
	var sendInterval = parseInt( document.getElementById(7).value )
	var timeout = parseInt( document.getElementById(8).value )
	var testIdxForJudgeSuccess = 2

	clearStressTestReport()
    
    var uids = []
    for(var i=userBeginId;i<=userEndId;i++ )
    {   
    	for(var ii=0;ii<7;ii++)
    	{
    		uids[uids.length] = 2000 + i*7 - ii
    	}
        uids[uids.length] = i

    }

    var idx = 0
    var interval = setInterval(function()
    {   
        var uid = uids[idx]
        if(uid)
        {
            var worker = new Worker('/javascripts/startAInstance.js');  
            worker.onmessage = function(event) {
                var d = event.data
                if(d[0] == 'changeReportWithUid')
                {
                    changeReportWithUid(d[1][0],d[1][1])
                }
            }

            var createrUid = uid>2000?Math.ceil( (uid-2000)/7 ):uid
            var s =  parseInt(tableKeyWithUid[createrUid]) 
            worker.postMessage([uid, timeout, testIdxForJudgeSuccess, isClose, s]) 
            idx = idx + 1
        }
        else
        {
            clearInterval(interval)
        }
    },sendInterval)
}


startGame = function() 
{
    var isClose = document.getElementById('isCloseSocket3').checked 
    var userBeginId = parseInt( document.getElementById(9).value ) 
    var userEndId = parseInt( document.getElementById(10).value )
    var sendInterval = parseInt( document.getElementById(11).value )
    var timeout = parseInt( document.getElementById(12).value )
    var testIdxForJudgeSuccess = 3

    clearStressTestReport()
    
    var uids = []
    for(var i=userBeginId;i<=userEndId;i++ )
    {   
        for(var ii=0;ii<7;ii++)
        {
            uids[uids.length] = 2000 + i*7 - ii
        }
        uids[uids.length] = i

    }

    var idx = 0
    var interval = setInterval(function()
    {   
        var uid = uids[idx]
        if(uid)
        {
            var worker = new Worker('/javascripts/startAInstance.js');  
            worker.onmessage = function(event) {
                var d = event.data
                if(d[0] == 'changeReportWithUid')
                {
                    changeReportWithUid(d[1][0],d[1][1])
                }
            }

            var createrUid = uid>2000?Math.ceil( (uid-2000)/7 ):uid
            var s =  parseInt(tableKeyWithUid[createrUid]) 
            worker.postMessage([uid, timeout, testIdxForJudgeSuccess, isClose, s]) 
            idx = idx + 1
        }
        else
        {
            clearInterval(interval)
        }
    },sendInterval)

}


playGame = function() 
{
    var isClose = document.getElementById('isCloseSocket4').checked 
    var userBeginId = parseInt( document.getElementById(13).value ) 
    var userEndId = parseInt( document.getElementById(14).value )
    var sendInterval = parseInt( document.getElementById(15).value )
    var timeout = parseInt( document.getElementById(16).value )

    var joinerNum = parseInt( document.getElementById(17).value )

    var testIdxForJudgeSuccess = 4

    clearStressTestReport()
    
    var uids = []
    for(var i=userBeginId;i<=userEndId;i++ )
    {   
        for(var ii=0;ii<(joinerNum-1);ii++)
        {
            uids[uids.length] = 2000 + i*7 - ii
        }
        uids[uids.length] = i

    }

    var idx = 0
    var interval = setInterval(function()
    {   
        var uid = uids[idx]
        if(uid)
        {
            var worker = new Worker('/javascripts/startAInstance.js');  
            worker.onmessage = function(event) {
                var d = event.data
                if(d[0] == 'changeReportWithUid')
                {
                    changeReportWithUid(d[1][0],d[1][1])
                }
            }

            var createrUid = uid>2000?Math.ceil( (uid-2000)/7 ):uid
            var s =  parseInt(tableKeyWithUid[createrUid]) 
            worker.postMessage([uid, timeout, testIdxForJudgeSuccess, isClose, s]) 
            idx = idx + 1
        }
        else
        {
            clearInterval(interval)
        }
    },sendInterval)
}


restartServer = function()
{	
	alert(1)
	// alert(test)
	// test.restartServer()
}

refresh = function()
{
	window.location.href = window.location.href
}







