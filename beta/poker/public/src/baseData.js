
var WM_USER = 0x0400
var INVALID_BYTE = 0xFF					//无效数值
var INVALID_WORD = 0xFFFF				//无效数值
var INVALID_DWORD = 0xFFFFFFFF				//无效数值
var INVALID_LONG = ((0xFFFFFFFF-1)/2)				//无效数值
var SUB_GR_COOKIE_CONFIRM_RESULT = 103								//cookie验证结果
var SUB_GR_COOKIE_CONFIRM = 4									//cookie验证
var LEN_COOKIE = 256									//cookie数据最大长度

//开始模式
var START_MODE_ALL_READY = 0x00								//所有准备
var START_MODE_FULL_READY = 0x01								//满人开始
var START_MODE_PAIR_READY = 0x02								//配对开始
var START_MODE_TIME_CONTROL = 0x10								//时间控制
var START_MODE_MASTER_CONTROL = 0x11								//管理控制

var llb_utoken = null
var llb_user = null
var llb_room = null
var llb_replay = {}
var hallAddress = ''
var resultAddress = ''
var rechargeAddress = ''

var hasEnterMainScene = false
var uiController = null

var isOpenEffect = true
var isOpenSound = true
var isOpenPTH = true
var START_MODE = START_MODE_FULL_READY 
var isRecordScene = false



