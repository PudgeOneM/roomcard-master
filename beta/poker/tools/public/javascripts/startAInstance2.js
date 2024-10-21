

function startAInstance(uid, timeout, testIdxForJudgeSuccess, isClose)
{

    //var sip = '192.168.2.120:56325' //测试
    var sip = '192.168.2.5:56325' //测试
    //var sip = '121.199.40.69:56325' //测试
    if(uid>2000)
    {   
        var createrUid = Math.ceil( (uid-2000)/7 )
        var s =  parseInt(tableKeyWithUid[createrUid]) 
        llb_room = '{ "rtid":1, "server":"'+ sip + '","roomkey": "' + s + '"}'
    }
    else
    {   
        llb_room = '{ "rtid":1, "server":"' + sip + '","options":{"name":"左岸小千-牛牛专场","endtime":300,"takein":200,"canctrl":1, "lockowner":0}}'
    }

    var instance = new WebSocket('ws://' + sip)
    instance.binaryType = "arraybuffer"

    instance.llb_room = JSON.parse( llb_room )

    instance.uid = uid
    instance.onopen = function() 
    {   
        instance.timeOutId = setTimeout(function()
        {   
            alert('timeout')
            instance.timeOut = true
            // changeReportWithUid(instance.uid, 'timeout')
            instance.close()
        },timeout)

        // changeReportWithUid(instance.uid, 'onopen')
        var LogonUserID = getObjWithStructName('CMD_GR_LogonUserID')
        LogonUserID.dwPlazaVersion = 101253123
        LogonUserID.dwFrameVersion = PROCESS_VERSION(6,0,3) 
        LogonUserID.dwProcessVersion = '0x06060003'
        LogonUserID.dwUserID = instance.uid 
        LogonUserID.szPassword = ''
        LogonUserID.szMachineID = 'EBC332138399EE3D0517955B4F9D468B'
        LogonUserID.wKindID = '27'

        sendMessage(instance,MDM_GR_LOGON,SUB_GR_LOGON_USERID,LogonUserID)
        instance.beat = setInterval(function()
        {
           sendMessage(instance, 0, 1) 
        }, 10000)   
    }

    instance.onmessage = function(evt) 
    { 
        var data = evt.data
        onSocketMessage(instance, testIdxForJudgeSuccess, data, isClose)
    } 

    instance.onerror = function(evt) 
    {   
       // changeReportWithUid(instance.uid, 'onerror')
    } 

    instance.onclose = function(evt) 
    {   
        clearInterval(instance.beat)
        //changeReportWithUid(instance.uid, 'onclose')
    } 
}

sendMessage = function(instance, mainCmdID,subCmdID,structObj)
{
    //var s = 'c-s:' + mainCmdID + '-' + subCmdID
    //changeReportWithUid(instance.uid, s)

    var obj1 = getObjWithStructName('TCP_Head')
    obj1.TCPInfo.cbDataKind = 0x05
    obj1.TCPInfo.cbCheckCode = ~0+1
    obj1.TCPInfo.wPacketSize = structObj?8 + sizeof(structObj):8
    obj1.CommandInfo.wMainCmdID = mainCmdID
    obj1.CommandInfo.wSubCmdID = subCmdID

    var buffer1 = structObj2Buffer(obj1)
    
    if(!structObj)
    {
        instance.send(buffer1)
        return;
    }
    var buffer2 = structObj2Buffer(structObj)
    var tmp = new Uint8Array( buffer1.byteLength + buffer2.byteLength)

    tmp.set( new Uint8Array( buffer1 ), 0 )
    tmp.set( new Uint8Array( buffer2 ), buffer1.byteLength )

    instance.send(tmp.buffer)
}


onSocketMessage = function(instance, testIdxForJudgeSuccess, msg, isClose)
{   
    var head = buffer2StructObj(msg.slice(0, 8), 'TCP_Head') 
    //var s = 's-c:' + head.CommandInfo.wMainCmdID + '-' + head.CommandInfo.wSubCmdID
    // stressTestReport[s] = stressTestReport[s]?stressTestReport[s] + 1:1  //不能这么写的 多个线程同时修改这个数据会出现命中失败
    // changeReportWithProtocolName(s)
   
    switch(head.CommandInfo.wMainCmdID)
    {
    case MDM_GF_FRAME: //100
        {   
            switch(head.CommandInfo.wSubCmdID)
            {    
            case SUB_GF_GAME_SCENE://在发出SUB_GF_GAME_OPTION时会收到这条协议  
            {   
                if(!instance.timeOut)
                {
                    if(testIdxForJudgeSuccess == 1)
                    {   
                        clearTimeout(instance.timeOutId) 
                        if(!instance.success)
                        {
                            //changeReportWithUid(instance.uid, 'enterGameScene')
                            instance.success = true
                            alert('successenter')
                            if(isClose)
                                instance.close()
                        }
                    } 
                    else if(testIdxForJudgeSuccess == 2)
                    {
                        clearTimeout(instance.timeOutId) 
                        if(!instance.success)
                        {
                            //changeReportWithUid(instance.uid, 'enterGameScene')
                            instance.success = true
                            if(isClose)
                                instance.close()
                        }
                    }
                }

                break
            }      
            }
            break
        }
    case MDM_GR_LOGON:      //登录消息  1
        {   
            switch(head.CommandInfo.wSubCmdID)
            { 
            case SUB_GR_LOGON_FINISH: 
            {
                var pUserRule = getObjWithStructName('CMD_GR_UserRule')
                sendMessage(instance,  MDM_GR_USER, SUB_GR_USER_RULE, pUserRule )
                if(instance.llb_room.roomkey)
                {
                    instance.tableKey = instance.llb_room.roomkey
                    tableKeyWithUid[instance.uid] = instance.tableKey
                    var accessTableByKey = getObjWithStructName('CMD_GR_C_AccessTableByKey') 
                    accessTableByKey.dwUserID =   instance.uid  
                    accessTableByKey.szTableKey = instance.tableKey
                    sendMessage(instance,MDM_GR_MANAGE, SUB_GR_ACCESS_TABLE_BY_KEY, accessTableByKey)
                }
                else
                {   
                    var options = instance.llb_room.options
                    var allocateTable = getObjWithStructName('CMD_GR_C_AllocateTable')
                    allocateTable.szTableName = options.name
                    allocateTable.wRoundTime = options.endtime
                    allocateTable.lTakeInScore = options.takein
                    allocateTable.bIsControlOpen = options.canctrl
                    allocateTable.bIsTableOwnerFixed = options.lockowner
                    allocateTable.dwRtID = instance.llb_room.rtid
                    sendMessage(instance,MDM_GR_MANAGE, SUB_GR_ALLOCATE_TABLE, allocateTable) 
                }
                break
            }     
            }
            break
        }
    case MDM_GR_USER:       //用户信息  3
        {   
            switch(head.CommandInfo.wSubCmdID)
            {
            }
            break
        }
    case MDM_GR_STATUS:     //状态信息  4
        {
            switch(head.CommandInfo.wSubCmdID)
            {
            }
            break
        }
    case MDM_CM_SYSTEM:     //系统消息  1000
        {
            switch(head.CommandInfo.wSubCmdID)
            { 
            }
            break
        }
    case MDM_GR_MANAGE:  //6
        {
            switch(head.CommandInfo.wSubCmdID)
            {
            case SUB_GR_ALLOCATE_TABLE_RESULT: 
            {   
                var body = buffer2StructObj(msg.slice(8), 'CMD_GR_S_AllocateTableResult') 

                if(body.lResultCode == 0)
                {
                    if(!instance.timeOut)
                    {
                        if(testIdxForJudgeSuccess == 1)
                        {   
                            clearTimeout(instance.timeOutId) 
                            alert('successcreate')
                            //changeReportWithUid(instance.uid, 'createTableSuccess')
                            if(isClose)
                                instance.close()
                        } 
                    }
                }
                else
                {
                    // changeReportWithUid(instance.uid, 'ALLOCATE_TABLE_RESULT失败')
                    instance.close()
                    // var str = body.szDescribeString.join('').replace(',','')
                    // socket.close(str, 1, 2)
                }

                break
            }   

            case SUB_GR_ACCESS_TABLE_BY_KEY_RESULT:
            {
                var body = buffer2StructObj(msg.slice(8), 'CMD_GR_S_AccessTableInfo') 
                if(!body.bIsSucess || body.m_wTableID>this.configServer.wTableCount)
                {   
                   // changeReportWithUid(instance.uid, 'ACCESS_TABLE_BY_KEY失败')
                    instance.close()
                    // socket.close('房间口令错误或者房间暂时无法进入,请重试', 1, 2)
                }
                else
                {  

                
                    var GameOption = getObjWithStructName('CMD_GF_GameOption')
                    GameOption.cbAllowLookon = 1
                    GameOption.dwFrameVersion = INVALID_DWORD
                    GameOption.dwClientVersion = INVALID_DWORD 
                    sendMessage(instance, MDM_GF_FRAME, SUB_GF_GAME_OPTION, GameOption)
                    

                }

                break
            }

            }
            break
        }
    }
//document.getElementById('testReport').innerHTML = JSON.stringify(stressTestReport)

}
