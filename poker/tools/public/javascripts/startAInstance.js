


importScripts('/javascripts/stressTestBase.js');      

onmessage = function(event) {
    var a = event.data
    startAInstance(a[0], a[1], a[2], a[3], a[4])
};


function startAInstance(uid, timeout, testIdxForJudgeSuccess, isClose, tableKey)
{   
    var sip = '114.55.61.155:56325' //测试

    //var sip = '192.168.2.5:56325' //测试
    //var sip = '192.168.2.5:56325' //测试
    //var sip = '121.199.40.69:56325' //测试
    if(testIdxForJudgeSuccess>1)
    {   
        if(!tableKey)
        {
            self.postMessage( [ 'changeReportWithUid', [uid, 'invalidTableKey'] ])
            return
        }
        llb_room = '{ "rtid":1, "server":"'+ sip + '","roomkey": "' + tableKey + '"}'
    }
    else
    {   
        llb_room = '{ "rtid":1, "server":"' + sip + '","options":{"name":"左岸小千-牛牛专场","endtime":1800,"takein":200,"canctrl":0, "lockowner":0}}'
    }

    var instance = new WebSocket('ws://' + sip)
    instance.binaryType = "arraybuffer"

    instance.llb_room = JSON.parse( llb_room )

    instance.uid = uid

    instance.onopen = function() 
    {   
        instance.timeOutId = setTimeout(function()
        {   
            instance.timeOut = true
            self.postMessage( [ 'changeReportWithUid', [instance.uid, 'timeout'] ])
            // changeReportWithUid(instance.uid, 'timeout')
            instance.close()
        },timeout)

        // changeReportWithUid(instance.uid, 'onopen')
        self.postMessage( [ 'changeReportWithUid', [instance.uid, 'onopen'] ])
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
        console.log('websocketerror:', evt)
        self.postMessage( [ 'changeReportWithUid', [instance.uid, 'onerror'] ])
       // changeReportWithUid(instance.uid, 'onerror')
    } 

    instance.onclose = function(evt) 
    {   
        clearInterval(instance.beat)
        self.postMessage( [ 'changeReportWithUid', [instance.uid, 'onclose'] ])
        //changeReportWithUid(instance.uid, 'onclose')
        self.close()
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
    gameLog.log('-----------------------------------------------------------onSocketMessage')
    switch(head.CommandInfo.wMainCmdID)
    {
    case MDM_GF_FRAME: //100
        {   
            switch(head.CommandInfo.wSubCmdID)
            {    
            case SUB_GF_GAME_SCENE://在发出SUB_GF_GAME_OPTION时会收到这条协议  
            {   
                if(!instance.hasEnterGameScene)
                {
                    instance.hasEnterGameScene = true
                    self.postMessage( [ 'changeReportWithUid', [instance.uid, 'enterGameScene'+instance.tableKey] ])
                    if(testIdxForJudgeSuccess == 2)
                    {  
                        clearTimeout(instance.timeOutId) 
                        if(isClose)
                            instance.close()
                    } 
                    else
                    {   
                        if(instance.uid<=2000)//发开始
                        {   
                            var AddScore = getObjWithStructName('CMD_GR_AddScore') 
                            AddScore.lAddScore = 600
                            AddScore.szTableKey = instance.tableKey
                            sendMessage(instance, MDM_GR_USER, SUB_GR_USER_ADD_SCORE, AddScore)
                        }
                        else
                        {
                            var PAY_IN_GAME = getObjWithStructName('CMD_GR_C_PayInGame') 
                            PAY_IN_GAME.szTableKey = instance.tableKey
                            PAY_IN_GAME.dwUserID = instance.uid
                            sendMessage(instance, MDM_GR_MANAGE, SUB_GR_PAY_IN_GAME, PAY_IN_GAME)
                        }
                    } 
                }

                
                break
            }      
            }
            break
        }
    case MDM_GF_GAME:       //游戏消息 200
        {
            switch(head.CommandInfo.wSubCmdID)
            {  
                case SUB_S_SEND_CARD: 
                {   
                    setTimeout(function()
                    {
                        var OxCard = getObjWithStructName('CMD_C_OxCard')
                        OxCard.bOX = 0
                        sendMessage(instance, MDM_GF_GAME, SUB_C_OPEN_CARD, OxCard) 
                    },2000)

                    break
                }   
                case SUB_S_GAME_END: 
                {   
           


                    break
                }   
                case SUB_S_CALL_BANKER: 
                {   
                    var body = buffer2StructObj(msg.slice(8), 'CMD_S_CallBanker') 

                    instance.isBanker = instance.chairid  ==  body.wCallBanker
                    if( instance.isBanker)
                    {
                        var CallBanker = getObjWithStructName('CMD_C_CallBanker')
                        CallBanker.bBanker = 1
                        sendMessage(instance, MDM_GF_GAME, SUB_C_CALL_BANKER, CallBanker) 
                    }

                    break
                }  
                case SUB_S_GAME_START: 
                {   
                    self.postMessage( [ 'changeReportWithUid', [instance.uid, 'gameStart'] ])
                    if(testIdxForJudgeSuccess == 3)
                    {  
                        clearTimeout(instance.timeOutId) 
                        if(isClose)
                            instance.close()
                    } 

                    if(!instance.isBanker)
                    {
                        setTimeout(function()
                        {
                            var AddScore = getObjWithStructName('CMD_C_AddScore') 
                            AddScore.lScore = 1
                            sendMessage(instance, MDM_GF_GAME, SUB_C_ADD_SCORE, AddScore)
                        },2000)
                    }
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
                    // tableKeyWithUid[instance.uid] = instance.tableKey
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
    case MDM_GR_CONFIG:  //配置信息  2
        {
            switch(head.CommandInfo.wSubCmdID)
            {
            case SUB_GR_CONFIG_SERVER:  //101
            {   
                var body = buffer2StructObj(msg.slice(8), 'CMD_GR_ConfigServer') 
                instance.configServer = body
                break
            }    
            case SUB_GR_CONFIG_PROPERTY:  //102
            {   
                // var body = buffer2StructObj(msg.slice(8), 'CMD_GR_ConfigProperty') 
                // for(var i=0;i<body.cbPropertyCount;i++)
                // {   
                //     if(body.PropertyInfo[i])
                //         tableData.itemTable[body.PropertyInfo[i].wIndex] = body.PropertyInfo[i].lPropertyGold
                // }
                // break
            }     
            }
            break
        }
    case MDM_GR_USER:       //用户信息  3
        {   
            switch(head.CommandInfo.wSubCmdID)
            {
                case SUB_GR_SITDOWN_SUCCESS:
                {
                    var GameOption = getObjWithStructName('CMD_GF_GameOption')
                    GameOption.cbAllowLookon = 1
                    GameOption.dwFrameVersion = INVALID_DWORD
                    GameOption.dwClientVersion = INVALID_DWORD 
                    sendMessage(instance, MDM_GF_FRAME, SUB_GF_GAME_OPTION, GameOption)

                    break
                }
                case SUB_GR_USER_STATUS: 
                {   
                    //可以完全忽略站立的状态，后端为了兼容网狐才会保留站立，前端逻辑上不存在这个状态，
                    var body = buffer2StructObj(msg.slice(8), 'CMD_GR_UserStatus') 
                    if(body.UserStatus.cbUserStatus == US_SIT  && body.dwUserID == instance.uid)  
                    {   
                        setTimeout(function()
                        {
                            sendMessage(instance, MDM_GF_FRAME, SUB_GF_USER_READY)
                        },6000)

                        if(instance.uid<=2000 && !instance.hasOpen)
                        {
                            instance.hasOpen = true
                            setTimeout(function()
                            {
                                var open = getObjWithStructName('CMD_GR_Opening')
                                open.wTableID = instance.tableId
                                open.dwUserID = instance.uid
                                sendMessage(instance, MDM_GR_USER, SUB_GR_USER_OPENING, open) 
                            }, 1000)
                        }

                    }

                    break
                }  

                case SUB_GR_USER_ADD_SCORE_NOTIFY:   
                {   
                    if(instance.uid<2000)
                        var chairid = 0
                    else
                    {   
                        var c = (instance.uid-2000)%7
                        var chairid = c==0?7:c
                    }
                    instance.chairid = chairid


                    var UserSitDown = getObjWithStructName('CMD_GR_UserSitDown')
                    UserSitDown.wTableID = instance.tableId
                    UserSitDown.wChairID = instance.chairid
                    UserSitDown.szPassword = ''
                    //gameLog.log('UserSitDown table:' + UserSitDown.wTableID + '-chair:' + UserSitDown.wChairID)
                    sendMessage(instance, MDM_GR_USER, SUB_GR_USER_SITDOWN, UserSitDown)

                    // var GameOption = getObjWithStructName('CMD_GF_GameOption')
                    // GameOption.cbAllowLookon = 1
                    // GameOption.dwFrameVersion = INVALID_DWORD
                    // GameOption.dwClientVersion = INVALID_DWORD 
                    // sendMessage(instance, MDM_GF_FRAME, SUB_GF_GAME_OPTION, GameOption)

                    break
                } 
                case SUB_GR_USER_ADD_SCORE_FAILURE:   
                {   
                    self.postMessage( [ 'changeReportWithUid', [instance.uid, 'addScoreFail'] ])
                    break
                } 
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
            case SUB_GR_PAY_IN_GAME_RESULT:
            {
                var body = buffer2StructObj(msg.slice(8), 'CMD_GR_S_PayInGameResult')
                if(body.bIsSucess)
                {
                    var AddScore = getObjWithStructName('CMD_GR_AddScore') 
                    AddScore.lAddScore = 600
                    AddScore.szTableKey = instance.tableKey
                    sendMessage(instance, MDM_GR_USER, SUB_GR_USER_ADD_SCORE, AddScore)
                }
                else
                {
                    self.postMessage( [ 'changeReportWithUid', [instance.uid, 'payFail'] ])
                }
                break
            }
            case SUB_GR_ALLOCATE_TABLE_RESULT: 
            {   
                var body = buffer2StructObj(msg.slice(8), 'CMD_GR_S_AllocateTableResult') 

                if(body.lResultCode == 0)
                {
                    instance.tableKey = body.szTableKey.join('')
                    instance.tableKey = instance.tableKey.replace('\u0000', '')

                    self.postMessage( [ 'changeReportWithUid', [instance.uid, 'createTableSuccess' + instance.tableKey] ])
                    if(testIdxForJudgeSuccess == 1)
                    {   
                        self.postMessage([ 'updateTableKeyWithUid', [instance.uid, instance.tableKey] ])
                        clearTimeout(instance.timeOutId) 
                        if(isClose)
                            instance.close()
                    }
                    else
                    {
                        var accessTableByKey = getObjWithStructName('CMD_GR_C_AccessTableByKey') 
                        accessTableByKey.szTableKey = instance.tableKey
                        sendMessage(instance, MDM_GR_MANAGE, SUB_GR_ACCESS_TABLE_BY_KEY, accessTableByKey)
                    } 
                    
                }
                else
                {
                    self.postMessage( [ 'changeReportWithUid', [instance.uid, 'createTableFail'] ])
                    instance.close()
                }

                break
            }   

            case SUB_GR_ACCESS_TABLE_BY_KEY_RESULT:
            {
                var body = buffer2StructObj(msg.slice(8), 'CMD_GR_S_AccessTableInfo') 
                if(!body.bIsSucess || body.m_wTableID>instance.configServer.wTableCount)
                {   
                    self.postMessage( [ 'changeReportWithUid', [instance.uid, 'enterRoomFail'+ instance.tableKey +'-'+body.bIsSucess+'-'+body.m_wTableID+'-'+instance.configServer.wTableCount] ])
                    instance.close()
                }
                else
                {  
                    self.postMessage( [ 'changeReportWithUid', [instance.uid, 'enterRoomSuccess'] ])

                    instance.tableId = body.wTableID

                    var lookon = getObjWithStructName('CMD_GR_UserLookon') 
                    lookon.wTableID = body.wTableID
                    sendMessage(instance, MDM_GR_USER, SUB_GR_USER_LOOKON, lookon)

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
