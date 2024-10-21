// //#ifndef SERVER_RULE_HEAD_FILE
// //#define SERVER_RULE_HEAD_FILE

// //////////////////////////////////////////////////////////////////////////////////

// //聊天规则
// var SR_FORFEND_GAME_CHAT = 0x00000001							//禁止公聊
// var SR_FORFEND_ROOM_CHAT = 0x00000002							//禁止公聊
// var SR_FORFEND_WISPER_CHAT = 0x00000004							//禁止私聊
// var SR_FORFEND_WISPER_ON_GAME = 0x00000008							//禁止私聊

// //高级规则
// var SR_ALLOW_DYNAMIC_JOIN = 0x00000010							//动态加入
// var SR_ALLOW_OFFLINE_TRUSTEE = 0x00000020							//断线代打
// var SR_ALLOW_AVERT_CHEAT_MODE = 0x00000040							//隐藏信息

// //游戏规则
// var SR_RECORD_GAME_SCORE = 0x00000100							//记录积分
// var SR_RECORD_GAME_TRACK = 0x00000200							//记录过程
// var SR_DYNAMIC_CELL_SCORE = 0x00000400							//动态底分
// var SR_IMMEDIATE_WRITE_SCORE = 0x00000800							//即时写分

// //房间规则
// var SR_FORFEND_ROOM_ENTER = 0x00001000							//禁止进入
// var SR_FORFEND_GAME_ENTER = 0x00002000							//禁止进入
// var SR_FORFEND_GAME_LOOKON = 0x00004000							//禁止旁观

// //银行规则
// var SR_FORFEND_TAKE_IN_ROOM = 0x00010000							//禁止取款
// var SR_FORFEND_TAKE_IN_GAME = 0x00020000							//禁止取款
// var SR_FORFEND_SAVE_IN_ROOM = 0x00040000							//禁止存钱
// var SR_FORFEND_SAVE_IN_GAME = 0x00080000							//禁止存款

// //其他规则
// var SR_FORFEND_GAME_RULE = 0x00100000							//禁止配置
// var SR_FORFEND_LOCK_TABLE = 0x00200000							//禁止锁桌
// var SR_ALLOW_ANDROID_ATTEND = 0x00400000							//允许陪玩
// var SR_ALLOW_ANDROID_SIMULATE = 0x00800000							//允许占位

// //////////////////////////////////////////////////////////////////////////////////

// //房间规则
// // class CServerRule
// // {
// // 	//聊天规则
// // public:
// // 	//禁止公聊
// // 	var (dwServerRule&SR_FORFEND_GAME_CHAT)! =0; }
// // 	//禁止公聊
// // 	var (dwServerRule&SR_FORFEND_ROOM_CHAT)! =0; }
// // 	//禁止私聊
// // 	var (dwServerRule&SR_FORFEND_WISPER_CHAT)! =0; }
// // 	//禁止私聊
// // 	var (dwServerRule&SR_FORFEND_WISPER_ON_GAME)! =0; }

// // 	//模式规则
// // public:
// // 	//动态加入
// // 	var (dwServerRule&SR_ALLOW_DYNAMIC_JOIN)! =0; }
// // 	//断线代打
// // 	var (dwServerRule&SR_ALLOW_OFFLINE_TRUSTEE)! =0; }
// // 	//隐藏信息
// // 	var (dwServerRule&SR_ALLOW_AVERT_CHEAT_MODE)! =0; }

// // 	//游戏规则
// // public:
// // 	//记录积分
// // 	var (dwServerRule&SR_RECORD_GAME_SCORE)! =0; }
// // 	//记录过程
// // 	var (dwServerRule&SR_RECORD_GAME_TRACK)! =0; }
// // 	//动态底分
// // 	var (dwServerRule&SR_DYNAMIC_CELL_SCORE)! =0; }
// // 	//即时写分
// // 	var (dwServerRule&SR_IMMEDIATE_WRITE_SCORE)! =0; }

// // 	//房间规则
// // public:
// // 	//禁止进入
// // 	var (dwServerRule&SR_FORFEND_ROOM_ENTER)! =0; }
// // 	//禁止进入
// // 	var (dwServerRule&SR_FORFEND_GAME_ENTER)! =0; }
// // 	//禁止旁观
// // 	var (dwServerRule&SR_FORFEND_GAME_LOOKON)! =0; }

// // 	//银行规则
// // public:
// // 	//禁止取款
// // 	var (dwServerRule&SR_FORFEND_TAKE_IN_ROOM)! =0; }
// // 	//禁止取款
// // 	var (dwServerRule&SR_FORFEND_TAKE_IN_GAME)! =0; }
// // 	//禁止存钱
// // 	var (dwServerRule&SR_FORFEND_SAVE_IN_ROOM)! =0; }
// // 	//禁止存钱
// // 	var (dwServerRule&SR_FORFEND_SAVE_IN_GAME)! =0; }

// // 	//其他规则
// // public:
// // 	//禁止配置
// // 	var (dwServerRule&SR_FORFEND_GAME_RULE)! =0; }
// // 	//禁止锁桌
// // 	var (dwServerRule&SR_FORFEND_LOCK_TABLE)! =0; }
// // 	//允许陪玩
// // 	var (dwServerRule&SR_ALLOW_ANDROID_ATTEND)! =0; }
// // 	//允许占位
// // 	var (dwServerRule&SR_ALLOW_ANDROID_SIMULATE)! =0; }

// // 	//聊天规则
// // public:
// // 	//禁止公聊
// // 	var (bEnable =var =true)?dwServerRule| =var SR_FORFEND_GAME_CHAT:dwServerRule& =~SR_FORFEND_GAME_CHAT; }
// // 	//禁止公聊
// // 	var (bEnable =var =true)?dwServerRule| =var SR_FORFEND_ROOM_CHAT:dwServerRule& =~SR_FORFEND_ROOM_CHAT; }
// // 	//禁止私聊
// // 	var (bEnable =var =true)?dwServerRule| =var SR_FORFEND_WISPER_CHAT:dwServerRule& =~SR_FORFEND_WISPER_CHAT; }
// // 	//禁止私聊
// // 	var (bEnable =var =true)?dwServerRule| =var SR_FORFEND_WISPER_ON_GAME:dwServerRule& =~SR_FORFEND_WISPER_ON_GAME; }

// // 	//模式规则
// // public:
// // 	//动态加入
// // 	var (bEnable =var =true)?dwServerRule| =var SR_ALLOW_DYNAMIC_JOIN:dwServerRule& =~SR_ALLOW_DYNAMIC_JOIN; }
// // 	//断线代打
// // 	var (bEnable =var =true)?dwServerRule| =var SR_ALLOW_OFFLINE_TRUSTEE:dwServerRule& =~SR_ALLOW_OFFLINE_TRUSTEE; }
// // 	//隐藏信息
// // 	var (bEnable =var =true)?dwServerRule| =var SR_ALLOW_AVERT_CHEAT_MODE:dwServerRule& =~SR_ALLOW_AVERT_CHEAT_MODE; }

// // 	//游戏规则
// // public:
// // 	//记录积分
// // 	var (bEnable =var =true)?dwServerRule| =var SR_RECORD_GAME_SCORE:dwServerRule& =~SR_RECORD_GAME_SCORE; }
// // 	//记录过程
// // 	var (bEnable =var =true)?dwServerRule| =var SR_RECORD_GAME_TRACK:dwServerRule& =~SR_RECORD_GAME_TRACK; }
// // 	//动态底分
// // 	var (bEnable =var =true)?dwServerRule| =var SR_DYNAMIC_CELL_SCORE:dwServerRule& =~SR_DYNAMIC_CELL_SCORE; }
// // 	//即时写分
// // 	var (bEnable =var =true)?dwServerRule| =var SR_IMMEDIATE_WRITE_SCORE:dwServerRule& =~SR_IMMEDIATE_WRITE_SCORE; }

// // 	//房间规则
// // public:
// // 	//禁止进入
// // 	var (bEnable =var =true)?dwServerRule| =var SR_FORFEND_ROOM_ENTER:dwServerRule& =~SR_FORFEND_ROOM_ENTER; }
// // 	//禁止进入
// // 	var (bEnable =var =true)?dwServerRule| =var SR_FORFEND_GAME_ENTER:dwServerRule& =~SR_FORFEND_GAME_ENTER; }
// // 	//禁止旁观
// // 	var (bEnable =var =true)?dwServerRule| =var SR_FORFEND_GAME_LOOKON:dwServerRule& =~SR_FORFEND_GAME_LOOKON; }

// // 	//银行规则
// // public:
// // 	//禁止取款
// // 	var (bEnable =var =true)?dwServerRule| =var SR_FORFEND_TAKE_IN_ROOM:dwServerRule& =~SR_FORFEND_TAKE_IN_ROOM; }
// // 	//禁止取款
// // 	var (bEnable =var =true)?dwServerRule| =var SR_FORFEND_TAKE_IN_GAME:dwServerRule& =~SR_FORFEND_TAKE_IN_GAME; }
// // 	//禁止存钱
// // 	var (bEnable =var =true)?dwServerRule| =var SR_FORFEND_SAVE_IN_ROOM:dwServerRule& =~SR_FORFEND_SAVE_IN_ROOM; }
// // 	//禁止存钱
// // 	var (bEnable =var =true)?dwServerRule| =var SR_FORFEND_SAVE_IN_GAME:dwServerRule& =~SR_FORFEND_SAVE_IN_GAME; }

// // 	//其他规则
// // public:
// // 	//禁止配置
// // 	var (bEnable =var =true)?dwServerRule| =var SR_FORFEND_GAME_RULE:dwServerRule& =~SR_FORFEND_GAME_RULE; }
// // 	//禁止锁桌
// // 	var (bEnable =var =true)?dwServerRule| =var SR_FORFEND_LOCK_TABLE:dwServerRule& =~SR_FORFEND_LOCK_TABLE; }
// // 	//允许陪玩
// // 	var (bEnable =var =true)?dwServerRule| =var SR_ALLOW_ANDROID_ATTEND:dwServerRule& =~SR_ALLOW_ANDROID_ATTEND; }
// // 	//允许占位
// // 	var (bEnable =var =true)?dwServerRule| =var SR_ALLOW_ANDROID_SIMULATE:dwServerRule& =~SR_ALLOW_ANDROID_SIMULATE; }
// // };

// //////////////////////////////////////////////////////////////////////////////////

// //#endif