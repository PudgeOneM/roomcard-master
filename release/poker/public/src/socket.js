
var socket = {}
socket.registReStartEvent = function()
{
    var l = cc.EventListener.create({
        event: cc.EventListener.CUSTOM,
        eventName: "reStart",
        callback: function(event)
        {  
            socket.registSocketListener(function(){})
            socket.isOpen = false
            socket.instance.close()
        }
    })
    cc.eventManager.addListener(l, 1)
}

socket.connect = function(address, call)
{   
    socket.instance = new WebSocket(address)
    var instance = socket.instance
    instance.binaryType = "arraybuffer"
    gameLog.log('socket.connect')
    var timeout = false
    var id = window.setTimeout(function()
    {   
        timeout = true
        popTips('连接服务器超时', 1, 2)
        if(cc.game.isPaused)
            cc.game.resume()
    }, 10000)

    instance.onopen = function() 
    {    
        gameLog.log('socket onopen')
        if(!timeout)
        {
            window.clearTimeout(id)
            ////
            socket.isOpen = true
            // socket.lastBeatTime = new Date().getTime()
            // socket._startBeat()
            call?call():''
        }
    }

    instance.onmessage = function(evt) 
    { 
        // if(evt.data instanceof Blob)
        // {
        //     var reader = new FileReader()
        //     reader.readAsArrayBuffer(evt.data)
        //     reader.onload = function(evt)
        //     { 
        //         if(evt.target.readyState == FileReader.DONE)
        //             { 
        //                 socket._onSocketMessage(evt.target.result)
        //             } 
        //     }  
        // }
        var data = evt.data
        if ( evt.target.readyState == WebSocket.OPEN )
            socket._onSocketMessage(data)
    } 

    //不要用自带的事件 不可靠！用心跳包  
    instance.onerror = function(evt) //服务器主动断开也会收到这个消息
    {   
        // gameLog.log('socket onerror')
        // gameLog.log(evt)
    } 

    instance.onclose = function(evt) 
    {   
        // gameLog.log('socket onclose')
        // gameLog.log(evt)

        // if(socket.isOpen)
        // {   
        //     // window.clearInterval(socket._startBeatIntervalId)
        //     socket.isOpen = false
        //     // clearInterval(socket.socketUnnormalIntervalId)
        //     popTips('你已断开连接', 1, 2)
        //     // sendLogToServer(gameLog.logS + 'wtms异常断开wtms')
        // }
    } 
}

socket.closeWithPop = function(tips, leftbtnIdx, rightbtnIdx, hasClosed)
{   
    if(socket.isOpen && !hasClosed)
    {
        // window.clearInterval(socket._startBeatIntervalId)
        // cocos.clearInterval(socket.socketUnnormalIntervalId)
        gameLog.log('socket close' + tips)
        socket.isOpen = false
        socket.instance.close()
        popTips(tips || '你已断开连接', leftbtnIdx, rightbtnIdx)
        // cc.director.pause()
    }
    else if(hasClosed)
    {
        // cocos.clearInterval(socket.socketUnnormalIntervalId)
        gameLog.log('socket close' + tips)
        popTips(tips || '你已断开连接', leftbtnIdx, rightbtnIdx)
    }
    //
}

socket.sendMessage = function(mainCmdID,subCmdID,structObj)
{
    if(!socket.isOpen)
        return

    var obj1 = getObjWithStructName('TCP_Head')
    obj1.TCPInfo.cbDataKind = 0x05
    obj1.TCPInfo.cbCheckCode = ~0+1
    obj1.TCPInfo.wPacketSize = structObj?8 + sizeof(structObj):8
    obj1.CommandInfo.wMainCmdID = mainCmdID
    obj1.CommandInfo.wSubCmdID = subCmdID

    var buffer1 = structObj2Buffer(obj1)

    gameLog.log('c-s:' + mainCmdID + '-' + subCmdID + '-' + Math.ceil(new Date().getTime()/1000) )
    gameLog.log(mainCmdID + '-' + subCmdID + '-body:', structObj)
    
    if(!structObj)
    {
        socket.instance.send(buffer1)
        return;
    }
    var buffer2 = structObj2Buffer(structObj)
    var tmp = new Uint8Array( buffer1.byteLength + buffer2.byteLength)

    tmp.set( new Uint8Array( buffer1 ), 0 )
    tmp.set( new Uint8Array( buffer2 ), buffer1.byteLength )

    socket.instance.send(tmp.buffer)
}

socket.registSocketListener = function(call)
{
    socket.socketListener = call
}

socket.startBeat = function()
{
    // if( typeof(socket.socketUnnormalIntervalId)!='undefined' )
    //     return 

    socket.socketUnnormalIntervalId = cocos.setInterval(function()
    {
        if(socket.isOpen)
        {
            socket.lastBeatIntervalId = cocos.setTimeout(function()
            {   
                if(!isCloseBeat)
                {
                    showTipsTTF({str:'网络异常'})
                    var event = new cc.EventCustom("reStart")
                    cc.eventManager.dispatchEvent(event)
                }
            },7000)
            socket.sendMessage(0,3)
        }
    }, 12000)
}

//读取事件
socket._onSocketMessage = function(msg)
{
    // showTipsTTF({str:'收到消息'}) 
    var head = buffer2StructObj(msg.slice(0, 8), 'TCP_Head') 
    gameLog.log('s-c:' + head.CommandInfo.wMainCmdID + '-' + head.CommandInfo.wSubCmdID + '-' + Math.ceil(new Date().getTime()/1000) )
    //log(new Uint8Array(msg))

    if( head.CommandInfo.wMainCmdID == 0 && head.CommandInfo.wSubCmdID == 3 )
        cocos.clearTimeout(socket.lastBeatIntervalId)

    socket.socketListener(msg)
}

