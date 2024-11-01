//#ifndef STRUCT_HEAD_FILE
//#define STRUCT_HEAD_FILE


//#pragma pack(1)

//////////////////////////////////////////////////////////////////////////////////
//游戏列表

//游戏类型
var tagGameType = 
[
	['WORD', 'wJoinID'],							//挂接索引
	['WORD', 'wSortID'],							//排序索引
	['WORD', 'wTypeID'],							//类型索引
	['TCHAR', 'szTypeName', LEN_TYPE],				//种类名字
]

//游戏种类
var tagGameKind = 
[
	['WORD', 'wTypeID'],							//类型索引
	['WORD', 'wJoinID'],							//挂接索引
	['WORD', 'wSortID'],							//排序索引
	['WORD', 'wKindID'],							//类型索引
	['WORD', 'wGameID'],							//模块索引
	['DWORD', 'dwOnLineCount'],						//在线人数
	['DWORD', 'dwFullCount'],						//满员人数
	['TCHAR', 'szKindName', LEN_KIND],				//游戏名字
	['TCHAR', 'szProcessName', LEN_PROCESS],			//进程名字
]

//游戏节点
var tagGameNode = 
[
	['WORD', 'wKindID'],							//名称索引
	['WORD', 'wJoinID'],							//挂接索引
	['WORD', 'wSortID'],							//排序索引
	['WORD', 'wNodeID'],							//节点索引
	['TCHAR', 'szNodeName', LEN_NODE],				//节点名称
]

//定制类型
var tagGamePage = 
[
	['WORD', 'wPageID'],							//页面索引
	['WORD', 'wKindID'],							//名称索引
	['WORD', 'wNodeID'],							//节点索引
	['WORD', 'wSortID'],							//排序索引
	['WORD', 'wOperateType'],						//控制类型
	['TCHAR', 'szDisplayName', LEN_PAGE],			//显示名称
]

//游戏房间
var tagGameServer = 
[
	['WORD', 'wKindID'],							//名称索引
	['WORD', 'wNodeID'],							//节点索引
	['WORD', 'wSortID'],							//排序索引
	['WORD', 'wServerID'],							//房间索引
	['WORD', 'wServerPort'],						//房间端口
	['DWORD', 'dwOnLineCount'],						//在线人数
	['DWORD', 'dwFullCount'],						//满员人数
	['TCHAR', 'szServerAddr', 32],					//房间名称
	['TCHAR', 'szServerName', LEN_SERVER],			//房间名称
]

//视频配置
var tagAVServerOption = 
[
	['WORD', 'wAVServerPort'],						//视频端口
	['DWORD', 'dwAVServerAddr'],						//视频地址
]

//在线信息
var tagOnLineInfoKind = 
[
	['WORD', 'wKindID'],							//类型标识
	['DWORD', 'dwOnLineCount'],						//在线人数
]

//在线信息
var tagOnLineInfoServer = 
[
	['WORD', 'wServerID'],							//房间标识
	['DWORD', 'dwOnLineCount'],						//在线人数
]

//////////////////////////////////////////////////////////////////////////////////
//用户信息

//桌子状态
var tagTableStatus = 
[
	['BYTE', 'cbTableLock'],						//锁定标志
	['BYTE', 'cbPlayStatus'],						//游戏标志
	['BYTE', 'cbRoomOpeningStatus'],				//开局标志
]

//用户状态
var tagUserStatus = 
[
	['WORD', 'wTableID'],							//桌子索引
	['WORD', 'wChairID'],							//椅子位置
	['BYTE', 'cbUserStatus'],						//用户状态
]

//用户属性
var tagUserAttrib = 
[
	['BYTE', 'cbCompanion'],						//用户关系
]

//用户积分
var tagUserScore = 
[
	//积分信息
	['SCORE', 'lScore'],								//用户分数
	['SCORE', 'lGrade'],								//用户成绩
	['SCORE', 'lInsure'],							//用户银行
	['SCORE', 'lScoreInGame'],						//带入分值

	//输赢信息
	['DWORD', 'dwWinCount'],							//胜利盘数
	['DWORD', 'dwLostCount'],						//失败盘数
	['DWORD', 'dwDrawCount'],						//和局盘数
	['DWORD', 'dwFleeCount'],						//逃跑盘数

	//全局信息
	['DWORD', 'dwUserMedal'],						//用户奖牌
	['DWORD', 'dwExperience'],						//用户经验
	['LONG', 'lLoveLiness'],						//用户魅力
]

//用户积分
var tagMobileUserScore = 
[
	//积分信息
	['SCORE', 'lScore'],								//用户分数
	['SCORE', 'lScoreInGame'],						//带入分值

	//输赢信息
	['DWORD', 'dwWinCount'],							//胜利盘数
	['DWORD', 'dwLostCount'],						//失败盘数
	['DWORD', 'dwDrawCount'],						//和局盘数
	['DWORD', 'dwFleeCount'],						//逃跑盘数

	//全局信息
	['DWORD', 'dwExperience'],						//用户经验
]


//道具使用
var tagUsePropertyInfo = 
[
	['WORD', 'wPropertyCount'],                     //道具数目
	['WORD', 'dwValidNum'],						    //有效数字
	['DWORD', 'dwEffectTime'],                       //生效时间
]


//用户道具
var tagUserProperty = 
[
	['WORD', 'wPropertyUseMark'],                   //道具标示
	['tagUsePropertyInfo', 'PropertyInfo', MAX_PT_MARK],			//使用信息   
]

//道具包裹
var tagPropertyPackage = 
[
	['WORD', 'wTrumpetCount'],                     //小喇叭数
	['WORD', 'wTyphonCount'],                      //大喇叭数
]

//用户经纬度
var tagUserLocation = 
[
	['TCHAR', 'szLatitude', LEN_LATITUDE],			//纬度
	['TCHAR', 'szLongitude', LEN_LONGITUDE],			//经度
]

//用户信息
var tagUserInfo = 
[
	//基本属性
	['DWORD', 'dwUserID'],							//用户 I D
	['DWORD', 'dwGameID'],							//游戏 I D
	['DWORD', 'dwGroupID'],							//社团 I D
	['TCHAR', 'szNickName', LEN_NICKNAME],			//用户昵称
	['TCHAR', 'szGroupName', LEN_GROUP_NAME],		//社团名字
	['TCHAR', 'szUnderWrite', LEN_UNDER_WRITE],		//个性签名

	//头像信息
	['WORD', 'wFaceID'],							//头像索引
	['DWORD', 'dwCustomID'],							//自定标识

	//用户资料
	['BYTE', 'cbGender'],							//用户性别
	['BYTE', 'cbMemberOrder'],						//会员等级
	['SYSTEMTIME', 'SystemMemberOvertime'],				//会员期限
	['BYTE', 'cbMasterOrder'],						//管理等级

	//用户状态
	['WORD', 'wTableID'],							//桌子索引
	['WORD', 'wChairID'],							//椅子索引
	['BYTE', 'cbUserStatus'],						//用户状态
	['bool', 'bIsSwitch'],							//用户切换判断

	//积分信息
	['SCORE', 'lScore'],								//用户分数
	['SCORE', 'lGrade'],								//用户成绩
	['SCORE', 'lInsure'],							//用户银行
	['SCORE', 'lScoreInGame'],						//带入分值
	['SCORE', 'lDiamond'],							//用户钻石

	//游戏信息
	['DWORD', 'dwWinCount'],							//胜利盘数
	['DWORD', 'dwLostCount'],						//失败盘数
	['DWORD', 'dwDrawCount'],						//和局盘数
	['DWORD', 'dwFleeCount'],						//逃跑盘数
	['DWORD', 'dwUserMedal'],						//用户奖牌
	['DWORD', 'dwExperience'],						//用户经验
	['LONG', 'lLoveLiness'],						//用户魅力

	//微信信息
	['TCHAR', 'szHeadImageUrlPath', MAX_URL_LEN],	//微信头像url
]

//用户信息
var tagUserInfoHead = 
[
	//用户属性
	['DWORD', 'dwGameID'],							//游戏 I D
	['DWORD', 'dwUserID'],							//用户 I D
	['DWORD', 'dwGroupID'],							//社团 I D
	['TCHAR', 'szNickName', LEN_NICKNAME],			//用户昵称

	//头像信息
	['WORD', 'wFaceID'],							//头像索引
	['DWORD', 'dwCustomID'],							//自定标识

	//用户属性
	['BYTE', 'cbGender'],							//用户性别
	['BYTE', 'cbMemberOrder'],						//会员等级
	['BYTE', 'cbMasterOrder'],						//管理等级
	['DWORD', 'dwMemberOverTime'],					//会员到期时间

	//用户状态
	['WORD', 'wTableID'],							//桌子索引
	['WORD', 'wChairID'],							//椅子索引
	['BYTE', 'cbUserStatus'],						//用户状态

	//积分信息
	['SCORE', 'lScore'],								//用户分数
	['SCORE', 'lGrade'],								//用户成绩
	['SCORE', 'lInsure'],							//用户银行
	['SCORE', 'lScoreInGame'],						//带入分值
	['SCORE', 'lDiamond'],							//用户钻石

	//游戏信息
	['DWORD', 'dwWinCount'],							//胜利盘数
	['DWORD', 'dwLostCount'],						//失败盘数
	['DWORD', 'dwDrawCount'],						//和局盘数
	['DWORD', 'dwFleeCount'],						//逃跑盘数
	['DWORD', 'dwUserMedal'],						//用户奖牌
	['DWORD', 'dwExperience'],						//用户经验
	['LONG', 'lLoveLiness'],						//用户魅力

	//微信信息
	['TCHAR', 'szHeadImageUrlPath', MAX_URL_LEN],	//微信头像url
]

//头像信息
var tagCustomFaceInfo = 
[
	['DWORD', 'dwDataSize'],							//数据大小
	['DWORD', 'dwCustomFace', FACE_CX*FACE_CY],		//图片信息
]

//用户信息
var tagUserRemoteInfo = 
[
	//用户信息
	['DWORD', 'dwUserID'],							//用户标识
	['DWORD', 'dwGameID'],							//游戏标识
	['TCHAR', 'szNickName', LEN_NICKNAME],			//用户昵称

	//等级信息
	['BYTE', 'cbGender'],							//用户性别
	['BYTE', 'cbMemberOrder'],						//会员等级
	['BYTE', 'cbMasterOrder'],						//管理等级

	//位置信息
	['WORD', 'wKindID'],							//类型标识
	['WORD', 'wServerID'],							//房间标识
	['TCHAR', 'szGameServer', LEN_SERVER],			//房间位置
]


var tagTableHistoryRecordInfo = 
[
	['DWORD', 'dwUserID'],							//用户标识
	['TCHAR', 'szNickName', LEN_NICKNAME],			//用户昵称
	['SCORE', 'lScore'],								//用户得分
	['SCORE', 'lScoreInGame'],						//带入分值
]

var tagUserAddrInfo = 
[
	['DWORD', 'dwUserID'],							//用户标识
	['TCHAR', 'szClientAddr', LEN_IP],				//用户IP地址
	['TCHAR', 'szLatitude', LEN_LATITUDE],			//纬度
	['TCHAR', 'szLongitude', LEN_LONGITUDE],			//经度
	['TCHAR', 'szAddr', LEN_ADDR],					//地址名称
]
//////////////////////////////////////////////////////////////////////////////////

//广场子项
var tagGamePlaza = 
[
	['WORD', 'wPlazaID'],							//广场标识
	['TCHAR', 'szServerAddr', 32],					//服务地址
	['TCHAR', 'szServerName', 32],					//服务器名
]

//级别子项
var tagLevelItem = 
[
	['LONG', 'lLevelScore'],						//级别积分
	['TCHAR', 'szLevelName', 16],					//级别描述
]

//会员子项
var tagMemberItem = 
[
	['BYTE', 'cbMemberOrder'],						//等级标识
	['TCHAR', 'szMemberName', 16],					//等级名字
]

//管理子项
var tagMasterItem = 
[
	['BYTE', 'cbMasterOrder'],						//等级标识
	['TCHAR', 'szMasterName', 16],					//等级名字
]

//列表子项
var tagColumnItem = 
[
	['BYTE', 'cbColumnWidth'],						//列表宽度
	['BYTE', 'cbDataDescribe'],						//字段类型
	['TCHAR', 'szColumnName', 16],					//列表名字
]

//地址信息
var tagAddressInfo = 
[
	['TCHAR', 'szAddress', 32],						//服务地址
]

//数据信息
var tagDataBaseParameter = 
[
	['WORD', 'wDataBasePort'],						//数据库端口
	['TCHAR', 'szDataBaseAddr', 50],					//数据库地址
	['TCHAR', 'szDataBaseUser', 32],					//数据库用户
	['TCHAR', 'szDataBasePass', 32],					//数据库密码
	['TCHAR', 'szDataBaseName', 32],					//数据库名字
]

//房间配置
var tagServerOptionInfo = 
[
	//挂接属性
	['WORD', 'wKindID'],							//挂接类型
	['WORD', 'wNodeID'],							//挂接节点
	['WORD', 'wSortID'],							//排列标识

	//税收配置
	['WORD', 'wRevenueRatio'],						//税收比例
	['SCORE', 'lServiceScore'],						//服务费用

	//房间配置
	['SCORE', 'lRestrictScore'],						//限制积分
	['SCORE', 'lMinTableScore'],						//最低积分
	['SCORE', 'lMinEnterScore'],						//最低积分
	['SCORE', 'lMaxEnterScore'],						//最高积分

	//会员限制
	['BYTE', 'cbMinEnterMember'],					//最低会员
	['BYTE', 'cbMaxEnterMember'],					//最高会员

	//房间属性
	['DWORD', 'dwServerRule'],						//房间规则
	['TCHAR', 'szServerName', LEN_SERVER],			//房间名称
]

//用户信息
var tagMobileUserInfoHead = 
[
	//用户属性
	['DWORD', 'dwGameID'],							//游戏 I D
	['DWORD', 'dwUserID'],							//用户 I D

	//头像信息
	['WORD', 'wFaceID'],							//头像索引
	['DWORD', 'dwCustomID'],							//自定标识

	//用户属性
	['BYTE', 'cbGender'],							//用户性别
	['BYTE', 'cbMemberOrder'],						//会员等级
	['DWORD', 'dwMemberOverTime'],					//会员到期时间

	//用户状态
	['WORD', 'wTableID'],							//桌子索引
	['WORD', 'wChairID'],							//椅子索引
	['BYTE', 'cbUserStatus'],						//用户状态

	//积分信息
	['SCORE', 'lScore'],								//用户分数
	['SCORE', 'lScoreInGame'],						//带入分值
	['SCORE', 'lDiamond'],							//用户钻石

	//游戏信息
	['DWORD', 'dwWinCount'],							//胜利盘数
	['DWORD', 'dwLostCount'],						//失败盘数
	['DWORD', 'dwDrawCount'],						//和局盘数
	['DWORD', 'dwFleeCount'],						//逃跑盘数
	['DWORD', 'dwExperience'],						//用户经验
]
//////////////////////////////////////////////////////////////////////////////////

//邮件
var tagMail = 
[
	['DWORD', 'dwMailID'],							//邮件ID
	['DWORD', 'dwDstUserID'],						//用户ID
	['TCHAR', 'szSrcNick', LEN_NICKNAME],			//发件人昵称
	['TCHAR', 'szSystemMessage', LEN_USER_CHAT],		//邮件消息
]

// typedef CList<tagMail *>			CMailList;							//邮件信息
//////////////////////////////////////////////////////////////////////////////////

//#pragma pack()

//#endif