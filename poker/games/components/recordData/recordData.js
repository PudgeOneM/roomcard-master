//游戏消息
var Record_Msg_Head = 
[
	['WORD', 'wSubCmdID'],	//子消息
	['WORD', 'wMsgSize'],	//消息长度
]

//用户数据
var tagVedioUserData = 
[
 ['DWORD', 'dwUserId'],
 ['SCORE', 'ulScore'],
 ['TCHAR', 'acNickName', LEN_NICKNAME],
 ['TCHAR', 'acPictURL', MAX_URL_LEN],
]

//同步牌局录像
var CMD_GR_S_SyncRecordVedio = 
[
 ['DWORD', 'dwUserID'],       						//请求玩家ID
 ['DWORD', 'dwOpenID'],       						//房间开局ID
 ['WORD', 'wRecordNum'],       						//第几局
 ['tagVedioUserData', 'arUserInfo', 4],   			//四个玩家信息
 ['TCHAR', 'acTableKey', LEN_KEYTABLE],   			//房间号  
 ['WORD', 'wVedioLen'],       						//录像长度
 //['char', 'acVedioData', 10000],     				//录像信息
]

var recordData = 
{
	recordList:[],
	onReStart:function()
	{
	},
	init:function()
	{
		this.recordList = []
	},
	receiveRecordData:function(msg)
	{
		this.init()

		var recordHeadSize = sizeof(eval('CMD_GR_S_SyncRecordVedio'))
		var recordHead = buffer2StructObj(msg.slice(0, recordHeadSize), 'CMD_GR_S_SyncRecordVedio')

		//解析录像消息
		this.parseMsgItem(msg.slice(recordHeadSize, recordHeadSize + recordHead.wVedioLen))

		tableKey = recordHead.acTableKey.join('') 
		tableData.tableID = tableKey
		for ( var i = 0; i < GAME_PLAYER; i++ )
		{
            var user = getObjWithStructName('tagUserInfoHead')
			user.dwUserID 			= recordHead.arUserInfo[i].dwUserId
			user.szNickName 		= recordHead.arUserInfo[i].acNickName
			user.szHeadImageUrlPath = recordHead.arUserInfo[i].acPictURL
			user.lScoreInGame 		= recordHead.arUserInfo[i].ulScore
			user.wTableID 			= tableData.tableID
			user.cbUserStatus 		= US_SIT
			user.wChairID 			= i

			user.szNickName = user.szNickName.join('')
            user.szHeadImageUrlPath = user.szHeadImageUrlPath.join('')
            if(user.szHeadImageUrlPath.search('http') == -1)
                user.szHeadImageUrlPath = ''
            else
            {
                var items = user.szHeadImageUrlPath.split('\/')
                var url = ''
                for(var j=0;j<items.length-1;j++)
                {
                    url += items[j]+'/'
                }
                url += '64'
                user.szHeadImageUrlPath = url 
            }

			var idx = tableData.getIdxWithUserId(user.dwUserID)
            idx = idx != null ? idx : tableData.usersThisRoom.length
            tableData.usersThisRoom[idx] = user
		}

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

	            var event = new cc.EventCustom("mainSceneEntered")
	            cc.eventManager.dispatchEvent(event)

	            tableData.hasMainSceneEntered = true

	        	recordNode.playStart()

	        	//断开连接
	        	socket.isOpen = false
	            socket.instance.close()
	        }
    	}

        if(!isEnterFromLogin)
        {
            requestWxApi(llb_replay.VideoId, KIND_ID, 0, 0,
            enterScene,
            function()
            {   
                socket.closeWithPop('在获取微信数据时发生了错误-replay', 1)
            })
        }
        else
        {   
            enterScene()
        }
	},
	parseMsgItem:function(msgItems)
	{
		if ( msgItems.byteLength == 0 )
			return

		var headSize = sizeof(eval('Record_Msg_Head'))
		var msgHead = buffer2StructObj(msgItems.slice(0, headSize), 'Record_Msg_Head')

		//组合消息包，适应cmdListener.gameListener
		var obj1 = getObjWithStructName('TCP_Head')
	    obj1.TCPInfo.cbDataKind = 0x05
	    obj1.TCPInfo.cbCheckCode = ~0+1
	    obj1.TCPInfo.wPacketSize = 8
	    obj1.CommandInfo.wMainCmdID = MDM_GF_GAME
	    obj1.CommandInfo.wSubCmdID = msgHead.wSubCmdID

	    var buffer1 = structObj2Buffer(obj1)
	    var tmp = new Uint8Array( buffer1.byteLength + msgHead.wMsgSize)
    	tmp.set( new Uint8Array( buffer1 ), 0 )
    	tmp.set( new Uint8Array( msgItems.slice(headSize, headSize + msgHead.wMsgSize) ), buffer1.byteLength )

		//插入
		this.recordList.push(tmp.buffer)

		this.parseMsgItem(msgItems.slice(headSize + msgHead.wMsgSize))
	},
	addRecord:function(data)
	{
		this.recordList.push(data)
	},
	getRecordData:function(index)
	{
		return this.recordList[index]
	},
	getRecordLength:function()
	{
		return this.recordList.length
	},
}