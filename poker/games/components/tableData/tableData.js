var selfdwUserID = null
var tableKey = null

var tableData = 
{   
    usersThisRoom:[],
    bIsOpened:0,
    cbPlayStatus:null,
    createrUserID:null,
    managerUserID:null,
    lTakeInScore:null,
    dwStaticBanker:null, //65535
    showChairId2ServerChairIdMap:[],
    //界面的椅子显示位置和服务器位置的对应关系 只有当玩家自己换座位时 这个对应关系才会变 其他玩家换座位无影响
    showChairIdTouched:null,
    itemTable:[],
    ADD_SCORE_NOTIFY_FUN:null,
    PAY_IN_GAME_RESULT:null,
    wMaxTimes:null,
    bIsControlOpen:null,
    dwEndTime:null,
    ///////////
    configServer:null,
    wKindID:null,
    hasPay:false,
    wRoundTime:null,
    dwOpenID:null,
    tableID:null,
    onEnterScene:null,
    wTotalPlayFees:null,
    isCreateTable:false,

    hasMainSceneEntered:false,
    onReStart:function()
    {   
        tableData.usersThisRoom = []
        tableData.bIsOpened = 0
        tableData.cbPlayStatus = null
        tableData.createrUserID = null
        tableData.managerUserID = null
        tableData.lTakeInScore = null
        tableData.dwStaticBanker = null
        tableData.showChairId2ServerChairIdMap = []
        //界面的椅子显示位置和服务器位置的对应关系 只有当玩家自己换座位时 这个对应关系才会变 其他玩家换座位无影响
        tableData.showChairIdTouched = null
        tableData.itemTable = []
        tableData.ADD_SCORE_NOTIFY_FUN = null
        tableData.PAY_IN_GAME_RESULT = null
        tableData.wMaxTimes = null
        tableData.bIsControlOpen = null
        tableData.dwEndTime = null
        tableData.configServer = null
        tableData.wKindID = null
        tableData.hasPay = false
        tableData.wRoundTime = null
        tableData.dwOpenID = null
        tableData.tableID = null
        tableData.onEnterScene = null
        tableData.wTotalPlayFees = null
        tableData.isCreateTable = false
        tableData.hasMainSceneEntered = false

        // cc.eventManager.removeCustomListeners('isOpenUpdate')
        // cc.eventManager.removeCustomListeners('scoreInGameUpdate')
        // cc.eventManager.removeCustomListeners('managerUserUpdate')
        // cc.eventManager.removeCustomListeners('userFace')
        // cc.eventManager.removeCustomListeners('payresult')
        // cc.eventManager.removeCustomListeners('isSelfSitChair')
        // cc.eventManager.removeCustomListeners('lookerUpdate')
    },
    enterListener:function(msg)
    {
        var head = buffer2StructObj(msg.slice(0, 8), 'TCP_Head') 
        switch(head.CommandInfo.wMainCmdID)
        {
        case MDM_GR_LOGON:      //登录消息  1
            {   
                gameLog.log('-----------------enterListener---登录消息-----------wSubCmdID----', head.CommandInfo.wSubCmdID)

                switch(head.CommandInfo.wSubCmdID)
                {
                case SUB_REQUEST_RECORD_VEDIO:
                {
                    //全局标识
                    isRecordScene = true
                    recordData ? recordData.receiveRecordData(msg.slice(8)) : ''
                    break
                }
                case SUB_GR_LOGON_SUCCESS: 
                {   
                    var body = buffer2StructObj(msg.slice(8), 'CMD_GR_LogonSuccess') 
                    tableData.wKindID = body.wKindID || 1
                    break
                }    
                case SUB_GR_LOGON_FINISH: 
                {
                    //init
                    tableData._initShowChairId2ServerChairIdMap()

                    //请求录像
                    if ( llb_replay && llb_replay.VideoId )
                    {
                        var req = getObjWithStructName('CMD_GR_RequestRecordVedio')
                        req.dwOpenID = llb_replay.VideoId
                        req.wRecordNum = llb_replay.VideoNum
                        socket.sendMessage(MDM_GR_LOGON, SUB_REQUEST_RECORD_VEDIO, req)
                        break
                    }

                    var pUserRule = getObjWithStructName('CMD_GR_UserRule')
                    socket.sendMessage( MDM_GR_USER, SUB_GR_USER_RULE, pUserRule )

                    tableKey = llb_room.roomkey
                    if(tableKey)
                    {
                        var accessTableByKey = getObjWithStructName('CMD_GR_C_AccessTableByKey') 
                        accessTableByKey.dwUserID = selfdwUserID
                        accessTableByKey.szTableKey = tableKey
                        socket.sendMessage(MDM_GR_MANAGE, SUB_GR_ACCESS_TABLE_BY_KEY, accessTableByKey)
                    }
                    else
                    {   
                        var options = llb_room.options
                        var allocateTable = getObjWithStructName('CMD_GR_C_AllocateTable')
                        allocateTable.szTableName = options.name
                        allocateTable.wRoundTime = options.endtime
                        allocateTable.lTakeInScore = options.takein
                        allocateTable.bIsControlOpen = options.canctrl
                        allocateTable.bIsTableOwnerFixed = options.lockowner
                        allocateTable.dwRtID = llb_room.rtid

                        tableData.lTakeInScore = options.takein
                        socket.sendMessage(MDM_GR_MANAGE, SUB_GR_ALLOCATE_TABLE, allocateTable) 

                    }
                    break
                }   
                case SUB_GR_COOKIE_CONFIRM_RESULT: 
                {   
                    var body = buffer2StructObj(msg.slice(8), 'CMD_GR_CookieConfirmResult') 
                    
                    if(body.bIsSuccess)
                    {
                        selfdwUserID = body.dwUserID

                        var LogonUserID = getObjWithStructName('CMD_GR_LogonUserID')
                        LogonUserID.dwPlazaVersion = 101253123
                        LogonUserID.dwFrameVersion = PROCESS_VERSION(6,0,3) 
                        LogonUserID.dwProcessVersion = '0x06060003'
                        LogonUserID.dwUserID = selfdwUserID
                        LogonUserID.szPassword = ''
                        LogonUserID.szMachineID = 'EBC332138399EE3D0517955B4F9D468B'
                        LogonUserID.wKindID = KIND_ID

                        socket.sendMessage(MDM_GR_LOGON,SUB_GR_LOGON_USERID,LogonUserID)
                    }

                    break
                }   
                case SUB_GR_LOGON_FAILURE:  //登录失败
                {
                    var body = buffer2StructObj(msg.slice(8), 'CMD_GR_LogonFailure') 
                    var str = body.szDescribeString.join('').replace(',','')
                    showTipsTTF({str:str}) 
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
                    this.configServer = body
                    break
                }    
                case SUB_GR_CONFIG_PROPERTY:  //102
                {   
                    var body = buffer2StructObj(msg.slice(8), 'CMD_GR_ConfigProperty') 
                    for(var i=0;i<body.cbPropertyCount;i++)
                    {   
                        if(body.PropertyInfo[i])
                            tableData.itemTable[body.PropertyInfo[i].wIndex] = body.PropertyInfo[i].lPropertyGold
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
                case SUB_GR_USER_ENTER:  //100 这个
                {   
                    var body = buffer2StructObj(msg.slice(8), 'tagUserInfoHead') 
                    if(body.dwMemberOverTime == INVALID_DWORD)
                        body.dwMemberOverTime = 0

                    //cbMemberOrder这个变量服务器也没维护 不用这个变量
                    // body.cbMemberOrder = body.dwMemberOverTime*1000 - new Date().getTime()>0

                    body.szNickName = body.szNickName.join('')
                    body.szHeadImageUrlPath = body.szHeadImageUrlPath.join('')
                    if(body.szHeadImageUrlPath.search('http') == -1)
                        body.szHeadImageUrlPath = ''
                    else
                    {
                        var items = body.szHeadImageUrlPath.split('\/')
                        var url = ''
                        for(var i=0;i<items.length-1;i++)
                        {
                            url += items[i]+'/'
                        }
                        url += '64'
                        body.szHeadImageUrlPath = url 
                    }


                    var idx = tableData.getIdxWithUserId(body.dwUserID)
                    idx = idx!=null?idx:tableData.usersThisRoom.length
                    tableData.usersThisRoom[idx] = body
                    break
                } 
                case SUB_GR_REQUEST_FAILURE:  
                {   
                    var body = buffer2StructObj(msg.slice(8), 'CMD_GR_RequestFailure') 
                    var str = (body.szDescribeString.join('')).replace(',','')
                    showTipsTTF({str:str})  
                    break
                } 
                case SUB_GR_USER_INFO_UPDATE:
                {   
                    var body = buffer2StructObj(msg.slice(8), 'tagUserInfoHead') 
                    if(body.dwMemberOverTime == INVALID_DWORD)
                        body.dwMemberOverTime = 0

                    //cbMemberOrder这个变量服务器也没维护 不用这个变量
                    //body.cbMemberOrder = body.dwMemberOverTime*1000 - new Date().getTime()>0

                    body.szNickName = body.szNickName.join('')
                    body.szHeadImageUrlPath = body.szHeadImageUrlPath.join('')
                    if(body.szHeadImageUrlPath.search('http') == -1)
                        body.szHeadImageUrlPath = ''
                    else
                    {
                        var items = body.szHeadImageUrlPath.split('\/')
                        var url = ''
                        for(var i=0;i<items.length-1;i++)
                        {
                            url += items[i]+'/'
                        }
                        url += '64'
                        body.szHeadImageUrlPath = url 
                    }

                    var idx = tableData.getIdxWithUserId(body.dwUserID)
                    var user = tableData.usersThisRoom[idx]
                    if(user)
                    {
                        for(var i in body)
                          user[i] = body[i]
                    }
                    break
                } 
                case SUB_GR_USER_DIAMOND:
                {
                    var body = buffer2StructObj(msg.slice(8), 'CMD_GR_UserDiamond') 
                    if(selfdwUserID == body.dwUserID)
                    {
                        var self = tableData.getUserWithUserId(selfdwUserID)
                        self.lDiamond = body.lDiamond
                    }
                    break
                }             
                }
                break
            }
        case MDM_GR_STATUS:     //状态信息  4
            {
                switch(head.CommandInfo.wSubCmdID)
                {
                case SUB_GR_TABLE_INFO:  //只会在进入游戏后收到一次
                {   
                    var body = buffer2StructObj(msg.slice(8), 'CMD_GR_TableInfo') 
                    var self = tableData.getUserWithUserId(selfdwUserID)
                    self.wTableID = tableData.tableID //玩家自己的3-100获取不到tableID
                    var serverChairId = self.wChairID 
                    if(serverChairId != INVALID_WORD)
                    {
                        //更新映射表
                        var touchedShowChairId = tableData.getShowChairIdWithServerChairId(serverChairId)
                        tableData.updateShowChairId2ServerChairIdMap(touchedShowChairId)  
                    }

                    var enterScene = function()
                    {
                        gameStart.enterMainScene()
                        var t = uiController.scene.onEnter
                        uiController.scene.onEnter = function()
                        {
                            t.apply(uiController.scene)

                            //有时间理一下这里的逻辑 todo
                            tableNode.initChairs()

                            tableData.onEnterScene()
                            var event = new cc.EventCustom("isOpenUpdate")
                            cc.eventManager.dispatchEvent(event)

                            var event = new cc.EventCustom("managerUserUpdate")
                            cc.eventManager.dispatchEvent(event)

                            var event = new cc.EventCustom("lookerUpdate")
                            cc.eventManager.dispatchEvent(event)

                            ////
                            var PAYINFO = getObjWithStructName('CMD_GR_C_GetPayInfo')
                            PAYINFO.szTableKey = tableKey
                            PAYINFO.dwUserID = selfdwUserID
                            socket.sendMessage(MDM_GR_MANAGE, SUB_GR_GET_PAYINFO_IN_GAME, PAYINFO)

                            var record = getObjWithStructName('CMD_GR_C_TableHistoryRecordReq') 
                            record.szTableKey = tableKey
                            socket.sendMessage(MDM_GR_USER, SUB_GR_USER_TABLE_HISTORY_RECORD_REQ, record)
                            
                            // if(self.cbUserStatus == US_NULL || self.cbUserStatus == US_FREE) // 玩家自己的3-100 在这个协议之后 所以
                            // {
                            //     var lookon = getObjWithStructName('CMD_GR_UserLookon') 
                            //     lookon.wTableID = tableData.tableID
                            //     socket.sendMessage(MDM_GR_USER, SUB_GR_USER_LOOKON, lookon)
                            // }

                            var GameOption = getObjWithStructName('CMD_GF_GameOption')
                            GameOption.cbAllowLookon = 1
                            GameOption.dwFrameVersion = INVALID_DWORD
                            GameOption.dwClientVersion = INVALID_DWORD 
                            socket.sendMessage(MDM_GF_FRAME, SUB_GF_GAME_OPTION, GameOption)

                            //这个要求放到lookon后面发 
                            var TakeInScore = getObjWithStructName('CMD_GR_C_GetTakeInScore')
                            TakeInScore.szTableKey = tableKey
                            socket.sendMessage(MDM_GR_MANAGE, SUB_GR_GET_TAKE_IN_SCORE, TakeInScore)

                            var event = new cc.EventCustom("mainSceneEntered")
                            cc.eventManager.dispatchEvent(event)

                            tableData.hasMainSceneEntered = true
                            socket.startBeat()
                        }
                    }

                    if(!isEnterFromLogin)
                    //if(cc.sys.isMobile && typeof(loginScene) != "undefined")
                    {
                        requestWxApi(tableData.dwOpenID, tableData.wKindID, tableData.configServer.wServerID, tableKey,
                        enterScene,
                        function()
                        {   
                            socket.closeWithPop('在获取微信数据时发生了错误', 1, 2)
                        })
                    }
                    else
                    {   

                        enterScene()
                    }
                    
                    break
                }      
                }
                break
            }
        case MDM_CM_SYSTEM:     //系统消息  1000
            {
                switch(head.CommandInfo.wSubCmdID)
                {
                case SUB_CM_SYSTEM_MESSAGE: 
                {   
                    var body = buffer2StructObj(msg.slice(8), 'CMD_CM_SystemMessage') 
                    var str = body.szString.join('').replace(',','')
                    showTipsTTF({str:str})    
                    break
                }     
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
                        tableData.isCreateTable = true
                        
                        tableKey = body.szTableKey.join('')

                        llb_room.roomkey = tableKey
                        llb_room.options = null
                        //setLocalStorage('llb_room',JSON.stringify(llb_room))
                        var domain = window.location.href.replace('http://','').split('/')[0]
                        var ss = domain.split('.')
                        domain = '.' + ss[ss.length-2] + '.' + ss[ss.length-1]

                        gameLog.log('llb_room_domain:', domain)
                        setCookie('llb_room',JSON.stringify(llb_room), 1, domain)

                        tableData.bIsOpened = body.bIsOpened
                        tableData.createrUserID = body.dwUserID

                        //tableData.getUserWithUserId(selfdwUserID).wTableID = body.wTableID
                        var accessTableByKey = getObjWithStructName('CMD_GR_C_AccessTableByKey') 
                        accessTableByKey.szTableKey = tableKey
                        socket.sendMessage(MDM_GR_MANAGE, SUB_GR_ACCESS_TABLE_BY_KEY, accessTableByKey)
                    }
                    else
                    {
                        var str = body.szDescribeString.join('').replace(',','')
                        socket.closeWithPop(str, 1, 2)
                    }

                    break
                }   

                case SUB_GR_ACCESS_TABLE_BY_KEY_RESULT:
                {
                    var body = buffer2StructObj(msg.slice(8), 'CMD_GR_S_AccessTableInfo') 
                    if(!body.bIsSucess || body.m_wTableID>this.configServer.wTableCount)
                    {   
                        var str = body.szDescribeString.join('').replace(',','')
                        socket.closeWithPop(str, 1, 2)
                    }
                    else
                    {  
                        tableData.bIsOpened = body.bIsOpened
                        tableData.createrUserID = body.dwUserID
                        tableData.dwStaticBanker = body.dwStaticBanker
                        tableData.lTakeInScore = body.lTakeInScore
                        tableData.wMaxTimes = body.wMaxTimes
                        tableData.bIsControlOpen = body.bIsControlOpen
                        tableData.managerUserID = body.dwTableOwner

                        tableData.dwEndTime = body.dwEndTime*1000

                        tableData.wRoundTime = body.wRoundTime
                        tableData.dwOpenID = body.dwOpenID
                        tableData.tableID = body.wTableID
                        tableData.wTotalPlayFees = body.wTotalPlayFees
                        //resultAddress = hallAddress + '/#!/record-tabledetail?openid=' + body.dwOpenID
                        // tableData.getUserWithUserId(selfdwUserID).wTableID = body.m_wTableID
                        
                        // var self = tableData.getUserWithUserId(selfdwUserID)
                    }
                    break
                }
                }
                break
            }
        }
        if(body)
        {
           gameLog.log('body:' + head.CommandInfo.wMainCmdID + '-' + head.CommandInfo.wSubCmdID, body)
        }
    },
    gameListener:function(msg)
    {
        var head = buffer2StructObj(msg.slice(0, 8), 'TCP_Head') 
        switch(head.CommandInfo.wMainCmdID)
        {
           case MDM_GF_FRAME: //100
                {   
                    switch(head.CommandInfo.wSubCmdID)
                    {
                    case SUB_GF_GAME_STATUS://在发出SUB_GF_GAME_OPTION时会收到这条协议
                    {   
                        var body = buffer2StructObj(msg.slice(8), 'CMD_GF_GameStatus') 
                        tableData.CMD_GF_GameStatus = body
                        break
                    }    
                    case SUB_GF_SYSTEM_MESSAGE: 
                    {   
                        var body = buffer2StructObj(msg.slice(8), 'CMD_CM_SystemMessage') 
                        var str = body.szString.join('').replace(',','')
                        if( body.wType == 513 ) // 踢出
                        {   
                            socket.closeWithPop(str, 2)
                        }
                        else if( body.wType == 1282 ) //游戏时间到
                        {
                            socket.registSocketListener(function(){})
                            if(tableData.bIsOpened)
                            {
                                cocos.setTimeout(
                                function()
                                {
                                    socket.closeWithPop(str, 2, 3)
                                }, 
                                4000)
                            }
                            else
                                socket.closeWithPop(str, 2)
                        }
                        else
                            showTipsTTF({str:str})
                        
                        break
                    }
                    case SUB_GF_USER_EXPRESSION: 
                    {   
                        var body = buffer2StructObj(msg.slice(8), 'CMD_GF_S_UserExpression') 

                        var user = tableData.getUserWithUserId(body.dwSendUserID)
                        var event = new cc.EventCustom("userFace")
                        event.setUserData([user, body.wItemIndex+1])
                        cc.eventManager.dispatchEvent(event)
                        break
                    }  
                    }
                    break
                }
        case MDM_GR_USER:       //用户信息  3
            {   
                switch(head.CommandInfo.wSubCmdID)
                {
                case SUB_GR_USER_CHAIR_MIX:
                {
                    showTipsTTF({str:'玩家座位打乱成功'})   
                    break
                }
                case SUB_GR_SITDOWN_SUCCESS:
                {
                    var GameOption = getObjWithStructName('CMD_GF_GameOption')
                    GameOption.cbAllowLookon = 1
                    GameOption.dwFrameVersion = INVALID_DWORD
                    GameOption.dwClientVersion = INVALID_DWORD 
                    socket.sendMessage(MDM_GF_FRAME, SUB_GF_GAME_OPTION, GameOption)

                    break
                }
                case SUB_GR_USER_ENTER:  //100 这个
                {   
                    var body = buffer2StructObj(msg.slice(8), 'tagUserInfoHead') 
                    if(body.dwMemberOverTime == INVALID_DWORD)
                        body.dwMemberOverTime = 0

                    //cbMemberOrder这个变量服务器也没维护 不用这个变量
                    //body.cbMemberOrder = body.dwMemberOverTime*1000 - new Date().getTime()>0

                    body.szNickName = body.szNickName.join('')
                    body.szHeadImageUrlPath = body.szHeadImageUrlPath.join('')
                    if(body.szHeadImageUrlPath.search('http') == -1)
                        body.szHeadImageUrlPath = ''
                    else
                    {
                        var items = body.szHeadImageUrlPath.split('\/')
                        var url = ''
                        for(var i=0;i<items.length-1;i++)
                        {
                            url += items[i]+'/'
                        }
                        url += '64'
                        body.szHeadImageUrlPath = url 
                    }

                   
                    var idx = tableData.getIdxWithUserId(body.dwUserID)
                    idx = idx!=null?idx:tableData.usersThisRoom.length
                    tableData.usersThisRoom[idx] = body

                    //牛牛改了 这里就可以去掉了
                    // var event = new cc.EventCustom("userEnter")
                    // event.setUserData([body.dwUserID,body.szNickName, body.szHeadImageUrlPath.replace(/\/0/, '/64')])
                    // cc.eventManager.dispatchEvent(event)

                    if( body.dwUserID != selfdwUserID &&  typeof(newsSide) != 'undefined' )
                    {   
                        var contentNode = new cc.Node()
                        var label = getLabel(16, 180, 2)
                        label.setStringNew(cc.formatStr('玩家%s进入房间', body.szNickName))
                        label.textAlign = cc.TEXT_ALIGNMENT_LEFT
                        label.setPositionX(90)
                        label.setFontFillColor(cc.color(0, 153, 149, 255))
                        contentNode.addChild(label)

                        newsSide.addNewsItem({
                            'iconurl':body.szHeadImageUrlPath,
                            'title':body.szNickName,
                            'contentNode':contentNode
                        })
                    }
                    break
                } 
                case SUB_GR_USER_INFO_UPDATE:
                {   
                    var body = buffer2StructObj(msg.slice(8), 'tagUserInfoHead') 
                    if(body.dwMemberOverTime == INVALID_DWORD)
                        body.dwMemberOverTime = 0

                    //cbMemberOrder这个变量服务器也没维护 不用这个变量
                    //body.cbMemberOrder = body.dwMemberOverTime*1000 - new Date().getTime()>0

                    body.szNickName = body.szNickName.join('')
                    body.szHeadImageUrlPath = body.szHeadImageUrlPath.join('')
                    if(body.szHeadImageUrlPath.search('http') == -1)
                        body.szHeadImageUrlPath = ''
                    else
                    {
                        var items = body.szHeadImageUrlPath.split('\/')
                        var url = ''
                        for(var i=0;i<items.length-1;i++)
                        {
                            url += items[i]+'/'
                        }
                        url += '64'
                        body.szHeadImageUrlPath = url 
                    }

                    var idx = tableData.getIdxWithUserId(body.dwUserID)
                    var user = tableData.usersThisRoom[idx]
                    if(user)
                    {
                        for(var i in body)
                          user[i] = body[i]
                    }
                    break
                } 
                case SUB_GR_USER_SCORE:  
                {   
                    var body = buffer2StructObj(msg.slice(8), 'CMD_GR_UserScore') 
                    var user = tableData.getUserWithUserId(body.dwUserID)

                    var event = new cc.EventCustom("scoreInGameUpdate")
                    event.setUserData([body.dwUserID, user.lScoreInGame, body.UserScore.lScoreInGame])
                    cc.eventManager.dispatchEvent(event)

                    for(var key in body.UserScore)
                    {
                        user[key] = body.UserScore[key]
                    }
 
                    break
                } 
                case SUB_GR_USER_STATUS: 
                {   
                    //可以完全忽略站立的状态，后端为了兼容网狐才会保留站立，前端逻辑上不存在这个状态，
                    var body = buffer2StructObj(msg.slice(8), 'CMD_GR_UserStatus') 
                    if(body.UserStatus.cbUserStatus == US_FREE)    break

                    if( body.dwUserID == selfdwUserID && body.UserStatus.cbUserStatus == US_NULL)  
                    {
                       socket.closeWithPop('游戏状态异常,你已断开连接', 1, 2)
                       break
                    }

                    var user = tableData.getUserWithUserId(body.dwUserID)
                    if(!user)
                    {
                        gameLog.log('无法识别的用户id')
                        break
                    }
                    var oldTableId = user.wTableID 
                    var oldStatus = user.cbUserStatus
                    var oldwChairID = user.wChairID
                    user.wTableID = body.UserStatus.wTableID
                    user.wChairID = body.UserStatus.wChairID
                    user.cbUserStatus = body.UserStatus.cbUserStatus

                    if(!tableData.hasMainSceneEntered) break
                    //if(!uiController.scene || !uiController.scene.isRunning()) break

                    var self = tableData.getUserWithUserId(selfdwUserID)          
                    if( (user.wTableID == self.wTableID || oldTableId == self.wTableID) ) 
                    {
                        if(oldStatus == US_LOOKON || user.cbUserStatus == US_LOOKON)
                        {
                            var event = new cc.EventCustom("lookerUpdate")
                            cc.eventManager.dispatchEvent(event)
                        }

                        tableData._refreshChairOnStatusChange(user, oldwChairID, oldTableId, oldStatus)
                    }

                    if(body.UserStatus.cbUserStatus == US_NULL)
                    {
                        var idx = tableData.getIdxWithUserId(body.dwUserID)
                        tableData.usersThisRoom.splice(idx, 1)
                        // delete tableData.usersThisRoom[idx]
                    }

                    break
                }  
                case SUB_GR_REQUEST_FAILURE:  
                {   
                    var body = buffer2StructObj(msg.slice(8), 'CMD_GR_RequestFailure') 
                    var str = (body.szDescribeString.join('')).replace(',','')
                    showTipsTTF({str:str})  
                    break
                } 
                case SUB_GR_USER_OPENING_SUCCESSS:   //400
                {   
                    var open = getObjWithStructName('CMD_GR_C_OpeningTwo')
                    open.wTableID = tableData.getUserWithUserId(selfdwUserID).wTableID
                    socket.sendMessage(MDM_GR_USER, SUB_GR_USER_OPENING_TWO, open)  

                    /////
                    var body = buffer2StructObj(msg.slice(8), 'CMD_GR_S_OpeningOne')
                    tableData.dwEndTime = body.dwEndTime * 1000
                    tableData.bIsOpened = true

                    var event = new cc.EventCustom("isOpenUpdate")
                    cc.eventManager.dispatchEvent(event)

                    break
                } 
                case SUB_GR_USER_OPENING_FAILURE:   //400
                {   
                    var body = buffer2StructObj(msg.slice(8), 'CMD_GR_S_OpeningOne') 
                    var str = (body.szDescribeString.join('')).replace(',','')
                    showTipsTTF({str:str})  
                    break
                } 
                case SUB_GR_PROPERTY_FAILURE:   
                {   
                    var body = buffer2StructObj(msg.slice(8), 'CMD_GR_PropertyFailure') 
                    var str = (body.szDescribeString.join('')).replace(',','')
                    showTipsTTF({str:str})   
                    break
                } 
                case SUB_GR_USER_WECHAT:   
                {   
                    var body = buffer2StructObj(msg.slice(8), 'CMD_GR_S_WeChat') 
                    body.szVoiceID = body.szVoiceID.join('')


                    var self = tableData.getUserWithUserId(selfdwUserID)
      
                    var wxVoice = {}
                    wxVoice.userId = body.dwUserID
                    wxVoice.voiceLen = body.wTime || 15
                    wxVoice.voiceId = body.szVoiceID
                    wxVoice.localId = null
                    
                    managerAudio.wxVoiceArray[managerAudio.wxVoiceArray.length] = wxVoice
                    if(!managerAudio.isWxVoicePlaying && !managerAudio.isWxVoiceRecording)
                    {
                        gameLog.log('playfirst4')
                        wxVoiceNode.playFirstWxVoice()
                    }

                    break
                } 
                case SUB_GR_USER_ADD_SCORE_NOTIFY:   
                {   
                    var body = buffer2StructObj(msg.slice(8), 'CMD_GR_S_AddScoreNotify') 
                    var user = tableData.getUserWithUserId(body.dwUserID)
                    user.lScoreInGame = body.lTakeInScore
                    
                    var chair = tableData.getChairWithServerChairId(user.wChairID)

                    if(chair)
                        chairFactory.setUserScore.call(chair.userNode, user.lScoreInGame)

                    if(tableData.ADD_SCORE_NOTIFY_FUN)
                    {
                        tableData.ADD_SCORE_NOTIFY_FUN()
                        tableData.ADD_SCORE_NOTIFY_FUN = null
                    }
                    break
                } 
                case SUB_GR_USER_ADD_SCORE_FAILURE:   
                {   
                    showTipsTTF({str:'房主拒绝了你的补分请求'}) 
                    break
                } 
                case SUB_GR_SITDOWN_FAILURE:   
                {   
                    var lookon = getObjWithStructName('CMD_GR_UserLookon') 
                    lookon.wTableID = tableData.getUserWithUserId(selfdwUserID).wTableID
                    socket.sendMessage(MDM_GR_USER, SUB_GR_USER_LOOKON, lookon)

                    break
                } 
                case SUB_GR_USER_TABLE_HISTORY_RECORD_RESULT:   
                {   
                    var body = buffer2StructObj(msg.slice(8), 'CMD_GR_S_TableHistoryRecord') 

                    var recordList = []
                    for(var i=0;i<body.wRecordCount;i++)
                    {
                        recordList[i] = {}
                        recordList[i].dwUserID = body.TableHistoryRecordInfo[i].dwUserID
                        recordList[i].szNickName = body.TableHistoryRecordInfo[i].szNickName.join('').replace(',','')
                        recordList[i].lScoreInGame = parseInt(body.TableHistoryRecordInfo[i].lScoreInGame)
                        recordList[i].lScoreInGameChange = parseInt(body.TableHistoryRecordInfo[i].lScore) 
                    }
                    // var event = new cc.EventCustom("history_record")
                    // event.setUserData(recordList)
                    // cc.eventManager.dispatchEvent(event)
                    if( typeof(reportSide) != 'undefined' )
                    {
                        reportSide.reportList  = recordList
                        reportSide.refreshReportListNode()
                    }

                    break
                } 
                case SUB_GR_PROPERTY_MESSAGE:   
                {   
                    gameLog.log(new Date().getTime())
                    var body = buffer2StructObj(msg.slice(8), 'CMD_GR_S_PropertyMessage') 

                    var sourceUser = tableData.getUserWithUserId(body.dwSourceUserID)
                    var targerUser = tableData.getUserWithUserId(body.dwTargerUserID)
                    var event = new cc.EventCustom("userItem")
                    event.setUserData([sourceUser, targerUser, body.wPropertyIndex])
                    cc.eventManager.dispatchEvent(event)


                    // // if(sourceUser.wTableID != self.wTableID )
                    // //     break;

                    // // if(sourceUser.wChairID!=INVALID_WORD && targerUser.wChairID!=INVALID_WORD)
                    // // {   
                    //     // managerRes.loadPlist('animationItem', 
                    //     // function()
                    //     // {
                    //         var sourceChair = tableData.getChairWithServerChairId(sourceUser.wChairID)
                    //         var targerChair = tableData.getChairWithServerChairId(targerUser.wChairID)

                    //         var sourcePos = sourceChair.node.convertToWorldSpace(sourceChair.userNode.getPosition())
                    //         var targerPos = targerChair.node.convertToWorldSpace(targerChair.userNode.getPosition())

                    //         sourcePos = uiController.uiTop.convertToNodeSpace(sourcePos)
                    //         targerPos = uiController.uiTop.convertToNodeSpace(targerPos)

                    //         // var spr = new cc.Sprite(resp_p['item'+body.wPropertyIndex])


                    //         var spr = new cc.Sprite(resp_p.empty)
                    //         spr.setPosition( cc.p(sourcePos.x,sourcePos.y) )
                    //         uiController.uiTop.addChild(spr)

                    //         var distance = Math.sqrt( Math.pow(targerPos.x - sourcePos.x, 2) + Math.pow(targerPos.y - sourcePos.y, 2) )
                    //         var actionTime = distance/900

                    //         var moveto = cc.moveTo( actionTime, cc.p(targerPos.x, targerPos.y) )
                    //         moveto = cc.EaseSineOut.create(moveto)
                    //         var anima = actionFactory.getAnimate('item' + body.wPropertyIndex + '_', true, null, function()
                    //             {
                    //                 spr.removeFromParent()
                    //             }, 2)

                    //         spr.runAction( cc.sequence(moveto,anima) )
                    //     // })
                    // //}
                    break
                } 
                case SUB_GR_USER_ADD_SCORE_SUGGEST:
                {
                    var self = tableData.getUserWithUserId(selfdwUserID)
                    var tableId = self.wTableID
                    var serverChairId

                    if(self.cbUserStatus == US_LOOKON)
                    {
                        serverChairId = tableData.getServerChairIdWithShowChairId(tableData.showChairIdTouched)
                    }
                    else
                    {
                        serverChairId = self.wChairID
                        var lookon = getObjWithStructName('CMD_GR_UserLookon') 
                        lookon.wTableID = tableData.getUserWithUserId(selfdwUserID).wTableID
                        socket.sendMessage(MDM_GR_USER, SUB_GR_USER_LOOKON, lookon)
                    }

                    var callY = function()
                    {
                        var UserSitDown = getObjWithStructName('CMD_GR_UserSitDown')
                        UserSitDown.wTableID = tableId
                        UserSitDown.wChairID = serverChairId
                        UserSitDown.szPassword = ''
                        gameLog.log('UserSitDown table:' + UserSitDown.wTableID + '-chair:' + UserSitDown.wChairID)
                        socket.sendMessage(MDM_GR_USER, SUB_GR_USER_SITDOWN, UserSitDown)
                    }

                    replenishScorePop.popReplenishScore(callY)
                    break
                }
                case SUB_GR_USER_ADD_SCORE_APPLY:
                {
                    var body = buffer2StructObj(msg.slice(8), 'CMD_GR_AddScore_Apply') 
                    replenishScorePop.popReplenishApply(body.dwUserID, body.lAddScore, body.dwOpenID)
                    break
                }
                case SUB_GR_USER_DIAMOND:
                {
                    var body = buffer2StructObj(msg.slice(8), 'CMD_GR_UserDiamond') 
                    if(selfdwUserID == body.dwUserID)
                    {
                        var self = tableData.getUserWithUserId(selfdwUserID)
                        self.lDiamond = body.lDiamond
                    }
                    break
                }
                case SUB_GR_USER_GET_LOCATION_RESULT:
                {
                    var body = buffer2StructObj(msg.slice(8), 'CMD_GR_S_GetLocation') 
                    for(var i=0;i<body.dwUserCount;i++)
                    {
                        var userAddrInfoItem = body.UserAddrInfo[i]
                        var user = tableData.getUserWithUserId(userAddrInfoItem.dwUserID)
                        user.szClientAddr = userAddrInfoItem.szClientAddr.join('').replace(',','')
                        user.szLatitude = parseFloat( userAddrInfoItem.szLatitude.join('').replace(',','') ) 
                        user.szLongitude = parseFloat(userAddrInfoItem.szLongitude.join('').replace(',',''))
                        user.szAddr = userAddrInfoItem.szAddr.join('').replace(',','')
                    }

                    var event = new cc.EventCustom("locationResult")
                    cc.eventManager.dispatchEvent(event)
                    break
                }             
                }
                break
            }
        case MDM_GR_STATUS:     //状态信息  4
            {
                switch(head.CommandInfo.wSubCmdID)
                {    
                case SUB_GR_TABLE_STATUS: 
                {   
                    var body = buffer2StructObj(msg.slice(8), 'CMD_GR_TableStatus') 

                    if(body.wTableID != tableData.getUserWithUserId(selfdwUserID).wTableID)
                        break

                    tableData.cbPlayStatus = body.TableStatus.cbPlayStatus
                    tableData.bIsOpened = body.TableStatus.cbRoomOpeningStatus

                    var event = new cc.EventCustom("isOpenUpdate")
                    cc.eventManager.dispatchEvent(event)
                    break
                }  
                case SUB_GR_TABLE_OWNER:
                {
                    var body = buffer2StructObj(msg.slice(8), 'CMD_GR_TableOwner') 
                    tableData.managerUserID = body.dwTableOwner

                    var event = new cc.EventCustom("managerUserUpdate")
                    cc.eventManager.dispatchEvent(event)

                    break
                }
                }
                break
            }
        case MDM_CM_SYSTEM:     //系统消息  1000
            {
                switch(head.CommandInfo.wSubCmdID)
                {
                case SUB_CM_SYSTEM_MESSAGE: 
                {   
                    var body = buffer2StructObj(msg.slice(8), 'CMD_CM_SystemMessage') 
                    var str = body.szString.join('').replace(',','')
                    showTipsTTF({str:str})   

                    var contentNode = new cc.Node()
                    var label = getLabel(16, 310, 2)
                    label.setStringNew(str)
                    label.textAlign = cc.TEXT_ALIGNMENT_LEFT
                    label.setPositionX(155)
                    label.setFontFillColor(cc.color(0, 153, 149, 255))
                    contentNode.addChild(label)

                    newsSide.addNewsItem({
                        'iconurl':2,
                        'title':'系统消息',
                        'contentNode':contentNode
                    })
                    break
                } 
                case SUB_CM_MAIL:
                {
                    var body = buffer2StructObj(msg.slice(8), 'CMD_GR_SendMail') 
                    body.szSystemMessage = body.szSystemMessage.join('').replace(',','')
                    body.szSrcNick = body.szSrcNick.join('').replace(',','')
                    var idxInMailArray = newsSide.addMailToStorage(body)
                    newsSide.addMailItem(body, idxInMailArray)
                    // var strName = body.szSrcNick.join('').replace(',','')
                    // // showTipsTTF({str:str})   

                    // var contentNode = new cc.Node()
                    // var label = getLabel(16, 240, 2)
                    // label.setStringNew(str)
                    // label.textAlign = cc.TEXT_ALIGNMENT_LEFT
                    // label.setPositionX(120)
                    // label.setFontFillColor(cc.color(0, 153, 149, 255))
                    // contentNode.addChild(label)

                    // newsSide.addNewsItem({
                    //     'iconurl':2,
                    //     'title':strName,
                    //     'contentNode':contentNode,
                    //     callyes:function()
                    //     {
                    //         var Mail_Confirm = getObjWithStructName('CMD_GR_C_Mail_Confirm') 
                    //         Mail_Confirm.dwUserID = selfdwUserID
                    //         Mail_Confirm.dwMailID = body.dwMailID
                    //         socket.sendMessage(MDM_GR_USER, SUB_GR_USER_MAIL_CONFIRM, Mail_Confirm)
                    //     },
                    // })
                }
                }
                break
            }
        case MDM_GR_MANAGE:  //6
            {
                switch(head.CommandInfo.wSubCmdID)
                {
                case SUB_GR_GET_TAKE_IN_SCORE_RESULT:
                {
                    var body = buffer2StructObj(msg.slice(8), 'CMD_GR_S_GetTakeInScoreResult') 
                    if(!body.bIsSucess)
                    {   
                        socket.closeWithPop('获取带入值出错,你已断开连接', 1, 2)
                    }
                    else
                    {   
                        var user = tableData.getUserWithUserId(body.dwUserID)
                        user.lScoreInGame = body.lTakeInScore
                    }
                    break
                }
                case SUB_GR_SET_CONTROL_TAKEIN_SUCCESSS:
                {
                    tableData.bIsControlOpen = tableData.bIsControlOpen==1?0:1
                    break
                }
                case SUB_GR_SET_MAX_TIMES_TAKEIN_RESULT:
                {
                    var body = buffer2StructObj(msg.slice(8), 'CMD_GR_S_SetMaxTimesTakeInResult') 
                    if(body.bIsSucess)
                    {
                        tableData.wMaxTimes = body.wMaxTimes
                    }
                    break
                }
                case SUB_GR_GET_PAYINFO_RESULT:
                {
                    var body = buffer2StructObj(msg.slice(8), 'CMD_GR_S_GetPayInfoResult') 
                    tableData.hasPay = body.bIsPayed
                    
                    var event = new cc.EventCustom("payresult")
                    cc.eventManager.dispatchEvent(event)

                    // var PAYINFO = getObjWithStructName('CMD_GR_C_GetPayInfo')
                    // PAYINFO.szTableKey = tableKey
                    // PAYINFO.dwUserID = selfdwUserID
                    // socket.sendMessage(MDM_GR_MANAGE, SUB_GR_GET_PAYINFO_IN_GAME, PAYINFO)
                    break
                }
                case SUB_GR_PAY_IN_GAME_RESULT:
                {
                    var body = buffer2StructObj(msg.slice(8), 'CMD_GR_S_PayInGameResult')
                    if(body.bIsSucess)
                    {
                        tableData.hasPay = true
                        var event = new cc.EventCustom("payresult")
                        cc.eventManager.dispatchEvent(event)

                        if(tableData.PAY_IN_GAME_RESULT)
                        {
                            tableData.PAY_IN_GAME_RESULT()
                            tableData.PAY_IN_GAME_RESULT = null
                        }
                    }
                    else
                    {
                        var str = body.szDescribeString.join('').replace(',','')
                        //showTips({str:str}) 
                        tableData.PAY_IN_GAME_RESULT = null
                        socket.closeWithPop(str, 4)
                    }
                    break
                }
                }
                break
            }
        }

        if(body)
        {
            gameLog.log('body:' + head.CommandInfo.wMainCmdID + '-' + head.CommandInfo.wSubCmdID, body)
        }
    },
    getUsersInAndOutTable:function(wTableID)
    {   
        var users = []
        for(var i=0;i<tableData.usersThisRoom.length;i++)
        {   
            if(tableData.usersThisRoom[i].wTableID == wTableID)
            {
               users[users.length] = tableData.usersThisRoom[i] 
            }
        }
        return users
    },
    getUsersInTable:function(wTableID)
    {   
        var users = []
        for(var i=0;i<tableData.usersThisRoom.length;i++)
        {   
            if(tableData.usersThisRoom[i].wTableID == wTableID && tableData.isInTable(tableData.usersThisRoom[i].cbUserStatus))
            {
               users[users.length] = tableData.usersThisRoom[i] 
            }

        }
        return users
    },
    getUsersWithTableIdAndStatus:function(wTableID, statusArr)
    {                   
        var users = []
        for(var i=0;i<tableData.usersThisRoom.length;i++)
        {      
            if(tableData.usersThisRoom[i].wTableID == wTableID)
            {   
                var isStatus = false
                for(var j in statusArr)
                {
                    if(tableData.usersThisRoom[i].cbUserStatus == statusArr[j])
                    {
                        isStatus = true
                        break
                    }
                }
                if(isStatus)
                    users[users.length] = tableData.usersThisRoom[i] 
            }
        }
        return users
    },
    getUserWithUserId:function(dwUserID)
    {
        for(var i=0;i<tableData.usersThisRoom.length;i++)
        {   
            if(tableData.usersThisRoom[i].dwUserID == dwUserID)
            {   
               // console.log('21212111qqqq11', tableData.usersThisRoom[i])
               return tableData.usersThisRoom[i]
            }
        }
    },
    getIdxWithUserId:function(dwUserID)
    {
        for(var i=0;i<tableData.usersThisRoom.length;i++)
        {   
            if(tableData.usersThisRoom[i].dwUserID == dwUserID)
            {   
               return i
            }
        }
    },
    getUserWithTableIdAndChairId:function(wTableID, wChairID)
    {
        wTableID = wTableID || tableData.getUserWithUserId(selfdwUserID).wTableID
        for(var i=0;i<tableData.usersThisRoom.length;i++)
        {   
            if(tableData.usersThisRoom[i].wTableID == wTableID && tableData.usersThisRoom[i].wChairID == wChairID)
            {
               return tableData.usersThisRoom[i]
            }
        }
    },
    getUserWithChairId:function(wChairID)
    {
        return tableData.getUserWithTableIdAndChairId(tableData.tableID, wChairID)
    },
    isInTable:function(cbUserStatus)
    {   
        if(cbUserStatus == US_SIT || cbUserStatus == US_READY  || cbUserStatus == US_PLAYING || cbUserStatus == US_OFFLINE )
        {
            return true
        }
        return false
    },
    isInPlay:function(cbUserStatus)
    {   
        if( cbUserStatus == US_PLAYING || cbUserStatus == US_OFFLINE )
        {
            return true
        }
        return false
    },
    isUserSitDownEnable:function(dwUserID)
    {
        var user = tableData.getUserWithUserId(dwUserID)
        var b = user.cbUserStatus == US_SIT || user.cbUserStatus == US_LOOKON || user.cbUserStatus == US_READY
        return b 
    },
    
    //////////////////chair start//////////
    //玩家自己换座位时showChairId2ServerChairIdMap映射表会发生改变
    _initShowChairId2ServerChairIdMap:function()
    {
        for( var i=0;i<GAME_PLAYER;i++ )
            tableData.showChairId2ServerChairIdMap[i] = i
    },
    _getOldShowChairIdWithNew:function(oldShowChairId, newShowChairId)
    {
        var getOldShowChairIdWithNew = []
        for(var i=0;i<GAME_PLAYER;i++)
        {
            var o = (oldShowChairId + i)%GAME_PLAYER
            var n = (newShowChairId + i)%GAME_PLAYER
            getOldShowChairIdWithNew[n] = o
        }

        return getOldShowChairIdWithNew
    },
    updateShowChairId2ServerChairIdMap:function(touchedShowChairId)
    {
        //更新showChairId2ServerChairIdMap
        var getOldShowChairIdWithNew = tableData._getOldShowChairIdWithNew(touchedShowChairId, 0)

        var newShowChairId2ServerChairIdMap = []
        for(var i=0;i<GAME_PLAYER;i++)
        {   
            var newShowChairIdX = i 
            var oldShowChairIdX = getOldShowChairIdWithNew[newShowChairIdX]
            var oldServerChairIdX = tableData.getServerChairIdWithShowChairId(oldShowChairIdX)
            newShowChairId2ServerChairIdMap[newShowChairIdX] = oldServerChairIdX
        }

        tableData.showChairId2ServerChairIdMap = newShowChairId2ServerChairIdMap
    },
    getServerChairIdWithShowChairId:function(showChairId)
    {
        return tableData.showChairId2ServerChairIdMap[showChairId]
    },
    getShowChairIdWithServerChairId:function(serverChairId)
    {
        for(var showChairId=0;showChairId<GAME_PLAYER;showChairId++)
        {
            if(tableData.getServerChairIdWithShowChairId(showChairId) == serverChairId)
                return showChairId
        }
    },
    getChairWithServerChairId:function(serverChairId)
    {   
        var showChairId = tableData.getShowChairIdWithServerChairId(serverChairId)
        var chair = tableData.getChairWithShowChairId(showChairId)
        return chair
    },
    getChairWithShowChairId:function(showChairId)
    {
        return tableNode._chairArray[showChairId]
    },
    getShowChairIdWithChair:function(chair)
    {
        for(var showChairId in tableNode._chairArray)
        {
            if(tableNode._chairArray[showChairId] == chair)
            {
                return showChairId
            }
        }
    },
    //////////////////chair end//////////
    _refreshChairOnStatusChange:function(user, oldwChairID, oldTableId, oldStatus)
    {
        var self = tableData.getUserWithUserId(selfdwUserID)          

        if(oldwChairID!=user.wChairID)
        {
            var event = new cc.EventCustom("playerCountInTableChange")
            cc.eventManager.dispatchEvent(event)
        }

        var isLeaveChair = oldwChairID != INVALID_WORD && user.wChairID == INVALID_WORD
        var isSitChair = user.wChairID != INVALID_WORD && oldwChairID == INVALID_WORD   
        var isChangeChair = user.wChairID != INVALID_WORD && user.wChairID != oldwChairID && oldwChairID != INVALID_WORD     
       
        //自己的状态发生变化时 如果是换座位需要刷新所有chair 否则也是只刷新一个座位
        if(user.dwUserID == selfdwUserID)
        {   
            var oldShowChairId = 0
            var newShowChairId = 0
            // if(user.cbUserStatus == US_SIT)
            //     socket.sendMessage(MDM_GF_FRAME, SUB_GF_USER_READY)

            if(isLeaveChair)
            {                
                var event = new cc.EventCustom("isSelfSitChair")
                event.setUserData(false)
                cc.eventManager.dispatchEvent(event)

                //维护user.userNodeInsetChair 
                user.userNodeInsetChair.removeFromParent()
                user.userNodeInsetChair = null
                tableNode._refreshChair(tableNode._chairArray[oldShowChairId], null)
            }
            else if(isSitChair)
            {   
                var event = new cc.EventCustom("isSelfSitChair")
                event.setUserData(true)
                cc.eventManager.dispatchEvent(event)

                //更新映射表
                var touchedShowChairId = tableData.getShowChairIdWithServerChairId(user.wChairID)
                tableData.updateShowChairId2ServerChairIdMap(touchedShowChairId)  

                //
                tableNode._onSelfSitChair()
            }
            else if(isChangeChair)
            {   
                //更新映射表
                var touchedShowChairId = tableData.getShowChairIdWithServerChairId(user.wChairID)
                tableData.updateShowChairId2ServerChairIdMap(touchedShowChairId)  

                //
                tableNode._onSelfChangeChair()
            }
            else //状态改变 比如ready-playing
            {        
                if(tableData.isInTable(user.cbUserStatus))                       
                    tableNode._refreshChair(tableNode._chairArray[newShowChairId], user)
            }
        }
        else
        //别的玩家状态发生变化时 只需要刷新1-2个chair就行了（换座位2个 不换座位1个）
        {
            var oldShowChairId = tableData.getShowChairIdWithServerChairId(oldwChairID)
            var newShowChairId = tableData.getShowChairIdWithServerChairId(user.wChairID)
            if(isLeaveChair)
            {
                user.userNodeInsetChair.removeFromParent()
                user.userNodeInsetChair = null
                tableNode._refreshChair(tableNode._chairArray[oldShowChairId], null)
            }
            else if(isSitChair)
            {   
                tableNode._refreshChair(tableNode._chairArray[newShowChairId], user)
            }
            else if(isChangeChair)
            {   
                tableNode._refreshChair(tableNode._chairArray[oldShowChairId], null)
                tableNode._refreshChair(tableNode._chairArray[newShowChairId], user)
            }
            else //状态改变 比如ready-playing
            {
                if(tableData.isInTable(user.cbUserStatus))                       
                    tableNode._refreshChair(tableNode._chairArray[newShowChairId], user)
            }
        }

    },
    // updateOnFree:function(player_allowStart)
    // {
    //     var users = tableData.getUsersInTable(tableData.getUserWithUserId(selfdwUserID).wTableID)
    //     if(users.length>=player_allowStart)
    //     {   
    //         // if(tableData.createrUserID == selfdwUserID)
    //         // {
    //         //     tableNode.shareButton.setVisible(false)
    //         // }
    //         if(tableData.managerUserID == selfdwUserID)
    //         {
    //             tableNode.shareButton.setVisible(false)
    //         }
    //     }  
    //     if(tableData.getUserWithUserId(selfdwUserID).cbUserStatus == US_SIT)
    //         socket.sendMessage(MDM_GF_FRAME, SUB_GF_USER_READY)
    // }
}