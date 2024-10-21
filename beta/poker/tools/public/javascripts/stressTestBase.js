
function clone(_) {
    var e;
    switch (typeof _) {
        case "undefined":
            break;
        case "string":
            e = _ + "";
            break;
        case "number":
            e = _ - 0;
            break;
        case "boolean":
            e = _;
            break;
        case "object":
            if (null === _) e = null;
            else if (_ instanceof Array) { e = [];
                for (var R = 0, E = _.length; R < E; R++) e.push(clone(_[R])) } else { e = {};
                for (var D in _) e[D] = clone(_[D]) }
            break;
        default:
            e = _ }
    return e }

function isParent(_, e) {
    for (var R in e)
        if (e[R] === _) return !0;
    return !1 }

function xToString(_, e, R) {
    var E = "";
    if ("undefined" == typeof _ || null == _);
    else if ("string" == typeof _) E = _;
    else if ("boolean" == typeof _) E = _ === !0 ? "true" : "false";
    else if ("number" == typeof _) E = _.toString();
    else if ("object" == typeof _)
        if (_ instanceof Array == 1) {
            for (var D = "", r = 0; r < _.length; r++) 0 == r ? D += xToString(_[r], e, R) : D = D + "," + xToString(_[r], e, R);
            E = D } else E = JSON.stringify(_);
    for (var r in R) {
        var S = new RegExp(R[r], "g");
        E = E.replace(S, "") }
    return e && E.length > e ? E.slice(0, e) : E }

function createMultiArray(_) {
    function e(_, e) {
        for (var R = new Array(_), E = 0; E < _; E++) R[E] = clone(e);
        return R }
    for (var R, E = _.length - 1; E >= 0; E--) R = e(_[E], R);
    return R }

function idx2IdxArray(_, e) { _ += 1;
    for (var R = [], E = 0; E < e.length; E++) R[E] = 0;
    for (var E = e.length - 1; E >= 0 && (_ = Math.ceil(_), R[E] = (_ % e[E] == 0 ? e[E] : _ % e[E]) - 1, _ /= e[E], !(_ <= 1)); E--);
    return R }

function getWithIdxArray(_, e) {
    for (var R = e, E = 0; E < _.length; E++) R = R[_[E]];
    return R }

function setWithIdxArray(idxArray, array, value) {
    for (var expression = "array", i = 0; i < idxArray.length; i++) expression = expression + "[idxArray[" + i + "]]";
    expression += "=value", eval(expression) }

function getStructSize(type) {
    try {
        for (var size = 0, struct = type.structName ? eval(type.structName) : type, i = 0; i < struct.length; i++) {
            for (var subStruct = struct[i], sizet = sizeof(eval(subStruct[0])), j = 2; j < subStruct.length; j++) sizet *= subStruct[j];
            size += sizet }
        return size } catch (_) {
        return "getStructSize fail" } }

function getObjWithStructName(structName) {
    try {
        for (var struct = eval(structName), obj = {}, i = 0; i < struct.length; i++) {
            for (var subStruct = struct[i], t = eval(subStruct[0]), sizeArray = [], j = 2; j < subStruct.length; j++) sizeArray[sizeArray.length] = subStruct[j];
            var defaultValue;
            defaultValue = t.isBaseType ? null : getObjWithStructName(subStruct[0]), obj[subStruct[1]] = 0 == sizeArray.length ? defaultValue : createMultiArray(sizeArray, defaultValue) }
        return obj.structName = structName, obj } catch (_) {
        return "getObjWithStructName fail" } }

function structObj2Buffer(structObj) {
    function fillBuffer(structObj) {
        for (var struct = eval(structObj.structName), i = 0; i < struct.length; i++) {
            for (var subStruct = struct[i], t = eval(subStruct[0]), arraySize = 1, sizeArray = [], ii = 2; ii < subStruct.length; ii++) arraySize *= subStruct[ii], sizeArray[sizeArray.length] = subStruct[ii];
            for (var ii = 0; ii < arraySize; ii++) {
                var v = 1 == arraySize ? structObj[subStruct[1]] : getWithIdxArray(idx2IdxArray(ii, sizeArray), structObj[subStruct[1]]);
                t.isBaseType ? (v && (t.setBuffer ? t.setBuffer(dataView, pos, v) : dataView["set" + t.bufferType](pos, v, !0)), pos += t.size) : fillBuffer(v) } } }
    var struct = eval(structObj.structName),
        size = sizeof(struct),
        buffer = new ArrayBuffer(size),
        dataView = new DataView(buffer, 0),
        pos = 0;
    return fillBuffer(structObj), dataView.buffer }

function buffer2StructObj(buffer, structName) {
    function fillStructObj(structName) {
        var structObj = getObjWithStructName(structName);
        if (pos >= buffer.byteLength) return structObj;
        try {
            for (var struct = eval(structName), i = 0; i < struct.length; i++) {
                for (var subStruct = struct[i], t = eval(subStruct[0]), arraySize = 1, sizeArray = [], ii = 2; ii < subStruct.length; ii++) arraySize *= subStruct[ii], sizeArray[sizeArray.length] = subStruct[ii];
                for (var ii = 0; ii < arraySize; ii++) {
                    var v;
                    t.isBaseType ? (v = t.getBuffer ? t.getBuffer(dataView, pos) : dataView["get" + t.bufferType](pos, !0), pos += sizeof(t)) : v = fillStructObj(subStruct[0]), 1 == arraySize ? structObj[subStruct[1]] = v : setWithIdxArray(idx2IdxArray(ii, sizeArray), structObj[subStruct[1]], v) } } } catch (_) {}
        return structObj }
    var pos = 0,
        dataView = new DataView(buffer, 0);
    return fillStructObj(structName) }

function INTERFACE_VERSION(_, e) {}

function PROCESS_VERSION(_, e, R) {}

function GetProductVer(_) {}

function GetMainVer(_) {}

function GetSubVer(_) {}

function GetBuildVer(_) {}

function InterfaceVersionCompare(_, e) {}

function QUERYINTERFACE(_, e, R) {}

function QUERYINTERFACE_IUNKNOWNEX(_, e, R) {}

function QUERY_ME_INTERFACE(_) {}

function QUERY_OBJECT_INTERFACE(_, e) {}

function QUERY_OBJECT_PTR_INTERFACE(_, e) {}

function DECLARE_CREATE_MODULE(_) {}

function DECLARE_MODULE_DYNAMIC(_) {}

function DECLARE_MODULE_HELPER(_, e, R) {}
var WM_USER = 1024,
    INVALID_BYTE = 255,
    INVALID_WORD = 65535,
    INVALID_DWORD = 4294967295,
    SUB_GR_COOKIE_CONFIRM_RESULT = 103,
    SUB_GR_COOKIE_CONFIRM = 4,
    LEN_COOKIE = 256,
    llb_utoken = null,
    llb_user = null,
    llb_room = null,
    hallAddress = "",
    resultAddress = "",
    rechargeAddress = "",
    resLoadFinish = !1,
    enterServerFinish = !1,
    hasEnterMainScene = !1,
    uiController = {},
    WORD = { isBaseType: !0, size: 2, bufferType: "Uint16" },
    bool = { isBaseType: !0, size: 1, bufferType: "Uint8" },
    UCHAR = { isBaseType: !0, size: 1, bufferType: "Uint8", setBuffer: function(_, e, R) { _["set" + this.bufferType](e, R.charCodeAt(), !0) }, getBuffer: function(_, e) {
            var R = _["get" + this.bufferType](e, !0);
            return R = String.fromCharCode.apply(null, [R]) } },
    TCHAR = { isBaseType: !0, size: 2, bufferType: "Uint16", setBuffer: function(_, e, R) { _["set" + this.bufferType](e, R.charCodeAt(), !0) }, getBuffer: function(_, e) {
            var R = _["get" + this.bufferType](e, !0);
            return R = String.fromCharCode.apply(null, [R]) } },
    UINT = { isBaseType: !0, size: 4, bufferType: "Uint32" },
    BYTE = { isBaseType: !0, size: 1, bufferType: "Uint8" },
    DWORD = { isBaseType: !0, size: 4, bufferType: "Uint32" },
    DOUBLE = { isBaseType: !0, size: 8, bufferType: "Float64" },
    LONG = { isBaseType: !0, size: 4, bufferType: "Int32" },
    LONGLONG = { isBaseType: !0, size: 8, bufferType: "Int64", setBuffer: function(_, e, R) {
            var E = R > 0 ? 0 : 2147483648,
                D = Math.abs(R);
            _.setInt32(e, D, !0), _.setInt32(e + 4, E, !0) }, getBuffer: function(_, e) {
            var R = _.getInt32(e, !0);
            return R = 0 == _.getInt32(e + 4, !0) ? Math.abs(R) : -Math.abs(R) } },
    sizeof = function(_) {
        return _ && _.isBaseType ? _.size : getStructSize(_) },
    FACE_CX = 48,
    FACE_CY = 48,
    LEN_LESS_ACCOUNTS = 6,
    LEN_LESS_NICKNAME = 6,
    LEN_LESS_PASSWORD = 6,
    MAX_CHAIR = 4096,
    MAX_TABLE = 4e3,
    MAX_COLUMN = 32,
    MAX_ANDROID = 256,
    MAX_PROPERTY = 128,
    MAX_WHISPER_USER = 16,
    MAX_URL_LEN = 255,
    MAX_TABALE_RECORD = 128,
    MAX_KIND = 128,
    MAX_SERVER = 1024,
    INVALID_CHAIR = 65535,
    INVALID_TABLE = 65535,
    REVENUE_BENCHMARK = 0,
    REVENUE_DENOMINATOR = 1e3,
    SCORE = LONGLONG,
    SCORE_STRING = "%I64d",
    GAME_STATUS_FREE = 0,
    GAME_STATUS_PLAY = 100,
    GAME_STATUS_WAIT = 200,
    LEN_USER_CHAT = 128,
    TIME_USER_CHAT = 1,
    TRUMPET_MAX_CHAR = 128,
    PRIME_TYPE = 11,
    PRIME_KIND = 53,
    PRIME_NODE = 101,
    PRIME_PAGE = 53,
    PRIME_SERVER = 1009,
    PRIME_SERVER_USER = 503,
    PRIME_ANDROID_USER = 503,
    PRIME_PLATFORM_USER = 100003,
    LEN_COOKIE = 256,
    LEN_MD5 = 33,
    LEN_USERNOTE = 32,
    LEN_ACCOUNTS = 32,
    LEN_NICKNAME = 32,
    LEN_PASSWORD = 33,
    LEN_GROUP_NAME = 32,
    LEN_UNDER_WRITE = 32,
    LEN_QQ = 16,
    LEN_EMAIL = 33,
    LEN_USER_NOTE = 256,
    LEN_SEAT_PHONE = 33,
    LEN_MOBILE_PHONE = 12,
    LEN_PASS_PORT_ID = 19,
    LEN_COMPELLATION = 16,
    LEN_DWELLING_PLACE = 128,
    LEN_NETWORK_ID = 13,
    LEN_MACHINE_ID = 33,
    LEN_TYPE = 32,
    LEN_KIND = 32,
    LEN_NODE = 32,
    LEN_PAGE = 32,
    LEN_SERVER = 32,
    LEN_PROCESS = 32,
    LEN_KEYTABLE = 7,
    CP_NORMAL = 0,
    CP_FRIEND = 1,
    CP_DETEST = 2,
    CP_SHIELD = 3,
    GENDER_FEMALE = 0,
    GENDER_MANKIND = 1,
    GAME_GENRE_GOLD = 1,
    GAME_GENRE_SCORE = 2,
    GAME_GENRE_MATCH = 4,
    GAME_GENRE_EDUCATE = 8,
    SCORE_GENRE_NORMAL = 256,
    SCORE_GENRE_POSITIVE = 512,
    US_NULL = 0,
    US_FREE = 1,
    US_SIT = 2,
    US_READY = 3,
    US_LOOKON = 4,
    US_PLAYING = 5,
    US_OFFLINE = 6,
    MS_NULL = 0,
    MS_SIGNUP = 1,
    MS_MATCHING = 2,
    MS_OUT = 3,
    SRL_LOOKON = 1,
    SRL_OFFLINE = 2,
    SRL_SAME_IP = 4,
    SRL_ROOM_CHAT = 256,
    SRL_GAME_CHAT = 512,
    SRL_WISPER_CHAT = 1024,
    SRL_HIDE_USER_INFO = 2048,
    UD_NULL = 0,
    UD_IMAGE = 100,
    UD_CUSTOM = 200,
    UD_GAME_ID = 1,
    UD_USER_ID = 2,
    UD_NICKNAME = 3,
    UD_GENDER = 10,
    UD_GROUP_NAME = 11,
    UD_UNDER_WRITE = 12,
    UD_TABLE = 20,
    UD_CHAIR = 21,
    UD_SCORE = 30,
    UD_GRADE = 31,
    UD_USER_MEDAL = 32,
    UD_EXPERIENCE = 33,
    UD_LOVELINESS = 34,
    UD_WIN_COUNT = 35,
    UD_LOST_COUNT = 36,
    UD_DRAW_COUNT = 37,
    UD_FLEE_COUNT = 38,
    UD_PLAY_COUNT = 39,
    UD_WIN_RATE = 40,
    UD_LOST_RATE = 41,
    UD_DRAW_RATE = 42,
    UD_FLEE_RATE = 43,
    UD_GAME_LEVEL = 44,
    UD_NOTE_INFO = 50,
    UD_LOOKON_USER = 51,
    UD_IMAGE_FLAG = UD_IMAGE + 1,
    UD_IMAGE_GENDER = UD_IMAGE + 2,
    UD_IMAGE_STATUS = UD_IMAGE + 3,
    DB_ERROR = -1,
    DB_SUCCESS = 0,
    DB_NEEDMB = 18,
    PT_USE_MARK_DOUBLE_SCORE = 1,
    PT_USE_MARK_FOURE_SCORE = 2,
    PT_USE_MARK_GUARDKICK_CARD = 16,
    PT_USE_MARK_POSSESS = 32,
    MAX_PT_MARK = 4,
    VALID_TIME_DOUBLE_SCORE = 3600,
    VALID_TIME_FOUR_SCORE = 3600,
    VALID_TIME_GUARDKICK_CARD = 3600,
    VALID_TIME_POSSESS = 3600,
    VALID_TIME_KICK_BY_MANAGER = 3600,
    DEVICE_TYPE_PC = 0,
    DEVICE_TYPE_ANDROID = 16,
    DEVICE_TYPE_ITOUCH = 32,
    DEVICE_TYPE_IPHONE = 64,
    DEVICE_TYPE_IPAD = 128,
    VIEW_MODE_ALL = 1,
    VIEW_MODE_PART = 2,
    VIEW_INFO_LEVEL_1 = 16,
    VIEW_INFO_LEVEL_2 = 32,
    VIEW_INFO_LEVEL_3 = 64,
    VIEW_INFO_LEVEL_4 = 128,
    RECVICE_GAME_CHAT = 256,
    RECVICE_ROOM_CHAT = 512,
    RECVICE_ROOM_WHISPER = 1024,
    BEHAVIOR_LOGON_NORMAL = 0,
    BEHAVIOR_LOGON_IMMEDIATELY = 4096,
    RESULT_ERROR = -1,
    RESULT_SUCCESS = 0,
    RESULT_FAIL = 1,
    SCORE_REASON_WRITE = 0,
    SCORE_REASON_INSURE = 1,
    SCORE_REASON_PROPERTY = 2,
    LOGON_FAIL_SERVER_INVALIDATION = 200,
    STANDUP_REASON_NORMAL = 0,
    STANDUP_REASON_LEAVE = 1,
    STANDUP_REASON_OFFLINE = 2,
    DEFALUT_PAY = 0,
    CREATE_PAY = 1,
    GAME_PAY = 2,
    PROPERTY_PAY = 3,
    VER_IUnknownEx = INTERFACE_VERSION(1, 1),
    IID_IUnknownEx = [1609482782, 56307, 18160, 159, 87, 209, 205, 113, 28, 70, 222],
    IUnknownEx = "",
    BULID_VER = 0,
    PRODUCT_VER = 6,
    MAX_CONTENT = 512,
    PORT_AUTO_SELECT = INVALID_WORD,
    PORT_LOGON = 8300,
    PORT_CENTER = 8310,
    PORT_MANAGER = 8320,
    DK_MAPPED = 1,
    DK_ENCRYPT = 2,
    DK_COMPRESS = 4,
    SOCKET_TCP_BUFFER = 16384,
    SOCKET_TCP_PACKET = SOCKET_TCP_BUFFER - sizeof(TCP_Head),
    SOCKET_UDP_BUFFER = 16384,
    SOCKET_UDP_PACKET = SOCKET_UDP_BUFFER - sizeof(UDP_Head),
    TCP_Info = [
        ["BYTE", "cbDataKind"],
        ["BYTE", "cbCheckCode"],
        ["WORD", "wPacketSize"]
    ],
    TCP_Command = [
        ["WORD", "wMainCmdID"],
        ["WORD", "wSubCmdID"]
    ],
    TCP_Head = [
        ["TCP_Info", "TCPInfo"],
        ["TCP_Command", "CommandInfo"]
    ],
    TCP_Validate = [
        ["TCHAR", "szValidateKey", 64]
    ],
    TCP_Buffer = [
        ["TCP_Head", "Head"],
        ["BYTE", "cbBuffer", SOCKET_TCP_PACKET]
    ],
    UDP_Info = [
        ["BYTE", "cbDataKind"],
        ["BYTE", "cbCheckCode"],
        ["WORD", "wPacketSize"],
        ["WORD", "wPacketIndex"],
        ["WORD", "wConnectIndex"]
    ],
    UDP_Command = [
        ["WORD", "wMainCmdID"],
        ["WORD", "wSubCmdID"]
    ],
    UDP_Head = [
        ["UDP_Info", "UDPInfo"],
        ["UDP_Command", "CommandInfo"]
    ],
    UDP_Buffer = [
        ["UDP_Head", "Head"],
        ["BYTE", "cbBuffer", SOCKET_UDP_PACKET]
    ],
    MDM_KN_COMMAND = 0,
    SUB_KN_DETECT_SOCKET = 1,
    SUB_KN_VALIDATE_SOCKET = 2,
    IPC_VER = 1,
    IPC_PACKET = 10240 - sizeof(IPC_Head),
    IPC_BUFFER = sizeof(IPC_Head) + IPC_PACKET,
    IPC_Head = [
        ["WORD", "wVersion"],
        ["WORD", "wPacketSize"],
        ["WORD", "wMainCmdID"],
        ["WORD", "wSubCmdID"]
    ],
    IPC_Buffer = [
        ["IPC_Head", "Head"],
        ["BYTE", "cbBuffer", IPC_PACKET]
    ],
    g_dwPacketKey = 2774181210,
    g_SendByteMap = [112, 47, 64, 95, 68, 142, 110, 69, 126, 171, 44, 31, 180, 172, 157, 145, 13, 54, 155, 11, 212, 196, 57, 116, 191, 35, 22, 20, 6, 235, 4, 62, 18, 92, 139, 188, 97, 99, 246, 165, 225, 101, 216, 245, 90, 7, 240, 19, 242, 32, 107, 74, 36, 89, 137, 100, 215, 66, 106, 94, 61, 10, 119, 224, 128, 39, 184, 197, 140, 14, 250, 138, 213, 41, 86, 87, 108, 83, 103, 65, 232, 0, 26, 206, 134, 131, 176, 34, 40, 77, 63, 38, 70, 79, 111, 43, 114, 58, 241, 141, 151, 149, 73, 132, 229, 227, 121, 143, 81, 16, 168, 130, 198, 221, 255, 252, 228, 207, 179, 9, 93, 234, 156, 52, 249, 23, 159, 218, 135, 248, 21, 5, 60, 211, 164, 133, 46, 251, 238, 71, 59, 239, 55, 127, 147, 175, 105, 12, 113, 49, 222, 33, 117, 160, 170, 186, 124, 56, 2, 183, 129, 1, 253, 231, 29, 204, 205, 189, 27, 122, 42, 173, 102, 190, 85, 51, 3, 219, 136, 178, 30, 78, 185, 230, 194, 247, 203, 125, 201, 98, 195, 166, 220, 167, 80, 181, 75, 148, 192, 146, 76, 17, 91, 120, 217, 177, 237, 25, 233, 161, 28, 182, 50, 153, 163, 118, 158, 123, 109, 154, 48, 214, 169, 37, 199, 174, 150, 53, 208, 187, 210, 200, 162, 8, 243, 209, 115, 244, 72, 45, 144, 202, 226, 88, 193, 24, 82, 254, 223, 104, 152, 84, 236, 96, 67, 15],
    g_RecvByteMap = [81, 161, 158, 176, 30, 131, 28, 45, 233, 119, 61, 19, 147, 16, 69, 255, 109, 201, 32, 47, 27, 130, 26, 125, 245, 207, 82, 168, 210, 164, 180, 11, 49, 151, 87, 25, 52, 223, 91, 65, 88, 73, 170, 95, 10, 239, 136, 1, 220, 149, 212, 175, 123, 227, 17, 142, 157, 22, 97, 140, 132, 60, 31, 90, 2, 79, 57, 254, 4, 7, 92, 139, 238, 102, 51, 196, 200, 89, 181, 93, 194, 108, 246, 77, 251, 174, 74, 75, 243, 53, 44, 202, 33, 120, 59, 3, 253, 36, 189, 37, 55, 41, 172, 78, 249, 146, 58, 50, 76, 218, 6, 94, 0, 148, 96, 236, 23, 152, 215, 62, 203, 106, 169, 217, 156, 187, 8, 143, 64, 160, 111, 85, 103, 135, 84, 128, 178, 54, 71, 34, 68, 99, 5, 107, 240, 15, 199, 144, 197, 101, 226, 100, 250, 213, 219, 18, 122, 14, 216, 126, 153, 209, 232, 214, 134, 39, 191, 193, 110, 222, 154, 9, 13, 171, 225, 145, 86, 205, 179, 118, 12, 195, 211, 159, 66, 182, 155, 229, 35, 167, 173, 24, 198, 244, 184, 190, 21, 67, 112, 224, 231, 188, 241, 186, 165, 166, 83, 117, 228, 235, 230, 133, 20, 72, 221, 56, 42, 204, 127, 177, 192, 113, 150, 248, 63, 40, 242, 105, 116, 104, 183, 163, 80, 208, 121, 29, 252, 206, 138, 141, 46, 98, 48, 234, 237, 43, 38, 185, 129, 124, 70, 137, 115, 162, 247, 114],
    VERSION_FRAME = PROCESS_VERSION(6, 0, 3),
    VERSION_PLAZA = PROCESS_VERSION(9, 0, 3),
    VERSION_MOBILE_ANDROID = PROCESS_VERSION(6, 0, 3),
    VERSION_MOBILE_IOS = PROCESS_VERSION(6, 0, 3),
    VERSION_EFFICACY = 0,
    VERSION_FRAME_SDK = INTERFACE_VERSION(6, 3),
    szProduct = "��������",
    szPlazaClass = "AQPGamePlaza",
    szProductKey = "AQPGamePlatform",
    szCookieUrl = "http://www.caizhuqipai.com",
    szLogonServer = "www.caizhuqipai.com",
    szPlatformLink = "www.caizhuqipai.com",
    szProduct = "��������",
    szPlazaClass = "AQPGamePlaza",
    szProductKey = "AQPGamePlatform",
    szCookieUrl = "http://www.caizhuqipai.com",
    szLogonServer = "www.caizhuqipai.com",
    szPlatformLink = "http://www.caizhuqipai.com",
    szPlatformDB = "QPPlatformDB",
    szAccountsDB = "QPAccountsDB",
    szTreasureDB = "QPTreasureDB",
    szExerciseDB = "QPExerciseDB",
    szCompilation = "9E0F66DC-C919-4413-8C83-8759EF60E563",
    PT_ISSUE_AREA_WEB = 1,
    PT_ISSUE_AREA_GAME = 2,
    PT_ISSUE_AREA_SERVER = 4,
    PT_SERVICE_AREA_MESELF = 1,
    PT_SERVICE_AREA_PLAYER = 2,
    PT_SERVICE_AREA_LOOKON = 4,
    PT_TYPE_ERROR = 0,
    PT_TYPE_PROPERTY = 1,
    PT_TYPE_PRESENT = 2,
    PROPERTY_ID_CAR = 1,
    PROPERTY_ID_EGG = 2,
    PROPERTY_ID_CLAP = 3,
    PROPERTY_ID_KISS = 4,
    PROPERTY_ID_BEER = 5,
    PROPERTY_ID_CAKE = 6,
    PROPERTY_ID_RING = 7,
    PROPERTY_ID_BEAT = 8,
    PROPERTY_ID_BOMB = 9,
    PROPERTY_ID_SMOKE = 10,
    PROPERTY_ID_VILLA = 11,
    PROPERTY_ID_BRICK = 12,
    PROPERTY_ID_FLOWER = 13,
    PROPERTY_ID_TWO_CARD = 14,
    PROPERTY_ID_FOUR_CARD = 15,
    PROPERTY_ID_SCORE_CLEAR = 16,
    PROPERTY_ID_ESCAPE_CLEAR = 17,
    PROPERTY_ID_TRUMPET = 18,
    PROPERTY_ID_TYPHON = 19,
    PROPERTY_ID_GUARDKICK_CARD = 20,
    PROPERTY_ID_POSSESS = 21,
    PROPERTY_ID_BLUERING_CARD = 22,
    PROPERTY_ID_YELLOWRING_CARD = 23,
    PROPERTY_ID_WHITERING_CARD = 24,
    PROPERTY_ID_REDRING_CARD = 25,
    PROPERTY_ID_VIPROOM_CARD = 26,
    tagPropertyInfo = [
        ["WORD", "wIndex"],
        ["WORD", "wDiscount"],
        ["WORD", "wIssueArea"],
        ["SCORE", "lPropertyGold"],
        ["DOUBLE", "dPropertyCash"],
        ["SCORE", "lSendLoveLiness"],
        ["SCORE", "lRecvLoveLiness"]
    ],
    tagPropertyAttrib = [
        ["WORD", "wIndex"],
        ["WORD", "wPropertyType"],
        ["WORD", "wServiceArea"],
        ["TCHAR", "szMeasuringunit", 8],
        ["TCHAR", "szPropertyName", 32],
        ["TCHAR", "szRegulationsInfo", 256]
    ],
    tagPropertyItem = [
        ["tagPropertyInfo", "PropertyInfo"],
        ["tagPropertyAttrib", "PropertyAttrib"]
    ],
    UR_CANNOT_PLAY = 1,
    UR_CANNOT_LOOKON = 2,
    UR_CANNOT_WISPER = 4,
    UR_CANNOT_ROOM_CHAT = 8,
    UR_CANNOT_GAME_CHAT = 16,
    UR_CANNOT_BUGLE = 32,
    UR_GAME_DOUBLE_SCORE = 256,
    UR_GAME_KICK_OUT_USER = 512,
    UR_GAME_ENTER_VIP_ROOM = 1024,
    UR_GAME_MATCH_USER = 268435456,
    UR_GAME_CHEAT_USER = 536870912,
    UR_CAN_LIMIT_PLAY = 1,
    UR_CAN_LIMIT_LOOKON = 2,
    UR_CAN_LIMIT_WISPER = 4,
    UR_CAN_LIMIT_ROOM_CHAT = 8,
    UR_CAN_LIMIT_GAME_CHAT = 16,
    UR_CAN_KILL_USER = 256,
    UR_CAN_SEE_USER_IP = 512,
    UR_CAN_DISMISS_GAME = 1024,
    UR_CAN_LIMIT_USER_CHAT = 2048,
    UR_CAN_CONFINE_IP = 4096,
    UR_CAN_CONFINE_MAC = 8192,
    UR_CAN_SEND_WARNING = 16384,
    UR_CAN_MODIFY_SCORE = 32768,
    UR_CAN_FORBID_ACCOUNTS = 65536,
    UR_CAN_BIND_GAME = 1048576,
    UR_CAN_BIND_GLOBAL = 2097152,
    UR_CAN_ISSUE_MESSAGE = 16777216,
    UR_CAN_MANAGER_SERVER = 33554432,
    UR_CAN_MANAGER_OPTION = 67108864,
    UR_CAN_MANAGER_ANDROID = 134217728,
    SR_FORFEND_GAME_CHAT = 1,
    SR_FORFEND_ROOM_CHAT = 2,
    SR_FORFEND_WISPER_CHAT = 4,
    SR_FORFEND_WISPER_ON_GAME = 8,
    SR_ALLOW_DYNAMIC_JOIN = 16,
    SR_ALLOW_OFFLINE_TRUSTEE = 32,
    SR_ALLOW_AVERT_CHEAT_MODE = 64,
    SR_RECORD_GAME_SCORE = 256,
    SR_RECORD_GAME_TRACK = 512,
    SR_DYNAMIC_CELL_SCORE = 1024,
    SR_IMMEDIATE_WRITE_SCORE = 2048,
    SR_FORFEND_ROOM_ENTER = 4096,
    SR_FORFEND_GAME_ENTER = 8192,
    SR_FORFEND_GAME_LOOKON = 16384,
    SR_FORFEND_TAKE_IN_ROOM = 65536,
    SR_FORFEND_TAKE_IN_GAME = 131072,
    SR_FORFEND_SAVE_IN_ROOM = 262144,
    SR_FORFEND_SAVE_IN_GAME = 524288,
    SR_FORFEND_GAME_RULE = 1048576,
    SR_FORFEND_LOCK_TABLE = 2097152,
    SR_ALLOW_ANDROID_ATTEND = 4194304,
    SR_ALLOW_ANDROID_SIMULATE = 8388608,
    tagGameType = [
        ["WORD", "wJoinID"],
        ["WORD", "wSortID"],
        ["WORD", "wTypeID"],
        ["TCHAR", "szTypeName", LEN_TYPE]
    ],
    tagGameKind = [
        ["WORD", "wTypeID"],
        ["WORD", "wJoinID"],
        ["WORD", "wSortID"],
        ["WORD", "wKindID"],
        ["WORD", "wGameID"],
        ["DWORD", "dwOnLineCount"],
        ["DWORD", "dwFullCount"],
        ["TCHAR", "szKindName", LEN_KIND],
        ["TCHAR", "szProcessName", LEN_PROCESS]
    ],
    tagGameNode = [
        ["WORD", "wKindID"],
        ["WORD", "wJoinID"],
        ["WORD", "wSortID"],
        ["WORD", "wNodeID"],
        ["TCHAR", "szNodeName", LEN_NODE]
    ],
    tagGamePage = [
        ["WORD", "wPageID"],
        ["WORD", "wKindID"],
        ["WORD", "wNodeID"],
        ["WORD", "wSortID"],
        ["WORD", "wOperateType"],
        ["TCHAR", "szDisplayName", LEN_PAGE]
    ],
    tagGameServer = [
        ["WORD", "wKindID"],
        ["WORD", "wNodeID"],
        ["WORD", "wSortID"],
        ["WORD", "wServerID"],
        ["WORD", "wServerPort"],
        ["DWORD", "dwOnLineCount"],
        ["DWORD", "dwFullCount"],
        ["TCHAR", "szServerAddr", 32],
        ["TCHAR", "szServerName", LEN_SERVER]
    ],
    tagAVServerOption = [
        ["WORD", "wAVServerPort"],
        ["DWORD", "dwAVServerAddr"]
    ],
    tagOnLineInfoKind = [
        ["WORD", "wKindID"],
        ["DWORD", "dwOnLineCount"]
    ],
    tagOnLineInfoServer = [
        ["WORD", "wServerID"],
        ["DWORD", "dwOnLineCount"]
    ],
    tagTableStatus = [
        ["BYTE", "cbTableLock"],
        ["BYTE", "cbPlayStatus"],
        ["BYTE", "cbRoomOpeningStatus"]
    ],
    tagUserStatus = [
        ["WORD", "wTableID"],
        ["WORD", "wChairID"],
        ["BYTE", "cbUserStatus"]
    ],
    tagUserAttrib = [
        ["BYTE", "cbCompanion"]
    ],
    tagUserScore = [
        ["SCORE", "lScore"],
        ["SCORE", "lGrade"],
        ["SCORE", "lInsure"],
        ["SCORE", "lScoreInGame"],
        ["DWORD", "dwWinCount"],
        ["DWORD", "dwLostCount"],
        ["DWORD", "dwDrawCount"],
        ["DWORD", "dwFleeCount"],
        ["DWORD", "dwUserMedal"],
        ["DWORD", "dwExperience"],
        ["LONG", "lLoveLiness"]
    ],
    tagMobileUserScore = [
        ["SCORE", "lScore"],
        ["SCORE", "lScoreInGame"],
        ["DWORD", "dwWinCount"],
        ["DWORD", "dwLostCount"],
        ["DWORD", "dwDrawCount"],
        ["DWORD", "dwFleeCount"],
        ["DWORD", "dwExperience"]
    ],
    tagUsePropertyInfo = [
        ["WORD", "wPropertyCount"],
        ["WORD", "dwValidNum"],
        ["DWORD", "dwEffectTime"]
    ],
    tagUserProperty = [
        ["WORD", "wPropertyUseMark"],
        ["tagUsePropertyInfo", "PropertyInfo", MAX_PT_MARK]
    ],
    tagPropertyPackage = [
        ["WORD", "wTrumpetCount"],
        ["WORD", "wTyphonCount"]
    ],
    tagUserInfo = [
        ["DWORD", "dwUserID"],
        ["DWORD", "dwGameID"],
        ["DWORD", "dwGroupID"],
        ["TCHAR", "szNickName", LEN_NICKNAME],
        ["TCHAR", "szGroupName", LEN_GROUP_NAME],
        ["TCHAR", "szUnderWrite", LEN_UNDER_WRITE],
        ["WORD", "wFaceID"],
        ["DWORD", "dwCustomID"],
        ["BYTE", "cbGender"],
        ["BYTE", "cbMemberOrder"],
        ["BYTE", "cbMasterOrder"],
        ["WORD", "wTableID"],
        ["WORD", "wChairID"],
        ["BYTE", "cbUserStatus"],
        ["bool", "bIsOffLine"],
        ["SCORE", "lScore"],
        ["SCORE", "lGrade"],
        ["SCORE", "lInsure"],
        ["SCORE", "lScoreInGame"],
        ["SCORE", "lDiamond"],
        ["DWORD", "dwWinCount"],
        ["DWORD", "dwLostCount"],
        ["DWORD", "dwDrawCount"],
        ["DWORD", "dwFleeCount"],
        ["DWORD", "dwUserMedal"],
        ["DWORD", "dwExperience"],
        ["LONG", "lLoveLiness"],
        ["TCHAR", "szHeadImageUrlPath", MAX_URL_LEN]
    ],
    tagUserInfoHead = [
        ["DWORD", "dwGameID"],
        ["DWORD", "dwUserID"],
        ["DWORD", "dwGroupID"],
        ["TCHAR", "szNickName", LEN_NICKNAME],
        ["WORD", "wFaceID"],
        ["DWORD", "dwCustomID"],
        ["BYTE", "cbGender"],
        ["BYTE", "cbMemberOrder"],
        ["BYTE", "cbMasterOrder"],
        ["WORD", "wTableID"],
        ["WORD", "wChairID"],
        ["BYTE", "cbUserStatus"],
        ["SCORE", "lScore"],
        ["SCORE", "lGrade"],
        ["SCORE", "lInsure"],
        ["SCORE", "lScoreInGame"],
        ["SCORE", "lDiamond"],
        ["DWORD", "dwWinCount"],
        ["DWORD", "dwLostCount"],
        ["DWORD", "dwDrawCount"],
        ["DWORD", "dwFleeCount"],
        ["DWORD", "dwUserMedal"],
        ["DWORD", "dwExperience"],
        ["LONG", "lLoveLiness"],
        ["TCHAR", "szHeadImageUrlPath", MAX_URL_LEN]
    ],
    tagCustomFaceInfo = [
        ["DWORD", "dwDataSize"],
        ["DWORD", "dwCustomFace", FACE_CX * FACE_CY]
    ],
    tagUserRemoteInfo = [
        ["DWORD", "dwUserID"],
        ["DWORD", "dwGameID"],
        ["TCHAR", "szNickName", LEN_NICKNAME],
        ["BYTE", "cbGender"],
        ["BYTE", "cbMemberOrder"],
        ["BYTE", "cbMasterOrder"],
        ["WORD", "wKindID"],
        ["WORD", "wServerID"],
        ["TCHAR", "szGameServer", LEN_SERVER]
    ],
    tagTableHistoryRecordInfo = [
        ["DWORD", "dwUserID"],
        ["TCHAR", "szNickName", LEN_NICKNAME],
        ["SCORE", "lScore"],
        ["SCORE", "lScoreInGame"]
    ],
    tagGamePlaza = [
        ["WORD", "wPlazaID"],
        ["TCHAR", "szServerAddr", 32],
        ["TCHAR", "szServerName", 32]
    ],
    tagLevelItem = [
        ["LONG", "lLevelScore"],
        ["TCHAR", "szLevelName", 16]
    ],
    tagMemberItem = [
        ["BYTE", "cbMemberOrder"],
        ["TCHAR", "szMemberName", 16]
    ],
    tagMasterItem = [
        ["BYTE", "cbMasterOrder"],
        ["TCHAR", "szMasterName", 16]
    ],
    tagColumnItem = [
        ["BYTE", "cbColumnWidth"],
        ["BYTE", "cbDataDescribe"],
        ["TCHAR", "szColumnName", 16]
    ],
    tagAddressInfo = [
        ["TCHAR", "szAddress", 32]
    ],
    tagDataBaseParameter = [
        ["WORD", "wDataBasePort"],
        ["TCHAR", "szDataBaseAddr", 50],
        ["TCHAR", "szDataBaseUser", 32],
        ["TCHAR", "szDataBasePass", 32],
        ["TCHAR", "szDataBaseName", 32]
    ],
    tagServerOptionInfo = [
        ["WORD", "wKindID"],
        ["WORD", "wNodeID"],
        ["WORD", "wSortID"],
        ["WORD", "wRevenueRatio"],
        ["SCORE", "lServiceScore"],
        ["SCORE", "lRestrictScore"],
        ["SCORE", "lMinTableScore"],
        ["SCORE", "lMinEnterScore"],
        ["SCORE", "lMaxEnterScore"],
        ["BYTE", "cbMinEnterMember"],
        ["BYTE", "cbMaxEnterMember"],
        ["DWORD", "dwServerRule"],
        ["TCHAR", "szServerName", LEN_SERVER]
    ],
    tagMobileUserInfoHead = [
        ["DWORD", "dwGameID"],
        ["DWORD", "dwUserID"],
        ["WORD", "wFaceID"],
        ["DWORD", "dwCustomID"],
        ["BYTE", "cbGender"],
        ["BYTE", "cbMemberOrder"],
        ["WORD", "wTableID"],
        ["WORD", "wChairID"],
        ["BYTE", "cbUserStatus"],
        ["SCORE", "lScore"],
        ["SCORE", "lScoreInGame"],
        ["SCORE", "lDiamond"],
        ["DWORD", "dwWinCount"],
        ["DWORD", "dwLostCount"],
        ["DWORD", "dwDrawCount"],
        ["DWORD", "dwFleeCount"],
        ["DWORD", "dwExperience"]
    ],
    MDM_CM_SYSTEM = 1e3,
    SUB_CM_SYSTEM_MESSAGE = 1,
    SUB_CM_ACTION_MESSAGE = 2,
    SUB_CM_DOWN_LOAD_MODULE = 3,
    SMT_CHAT = 1,
    SMT_EJECT = 2,
    SMT_GLOBAL = 4,
    SMT_PROMPT = 8,
    SMT_TABLE_ROLL = 16,
    SMT_CLOSE_ROOM = 256,
    SMT_CLOSE_GAME = 512,
    SMT_CLOSE_LINK = 1024,
    CMD_CM_SystemMessage = [
        ["WORD", "wType"],
        ["WORD", "wLength"],
        ["TCHAR", "szString", 1024]
    ],
    ACT_BROWSE = 1,
    ACT_DOWN_LOAD = 2,
    tagActionHead = [
        ["UINT", "uResponseID"],
        ["WORD", "wAppendSize"],
        ["BYTE", "cbActionType"]
    ],
    BRT_IE = 1,
    BRT_PLAZA = 2,
    BRT_WINDOWS = 4,
    tagActionBrowse = [
        ["BYTE", "cbBrowseType"],
        ["TCHAR", "szBrowseUrl", 256]
    ],
    DLT_IE = 1,
    DLT_MODULE = 2,
    tagActionDownLoad = [
        ["BYTE", "cbDownLoadMode"],
        ["TCHAR", "szDownLoadUrl", 256]
    ],
    CMD_CM_ActionMessage = [
        ["WORD", "wType"],
        ["WORD", "wLength"],
        ["UINT", "nButtonType"],
        ["TCHAR", "szString", 1024]
    ],
    CMD_CM_DownLoadModule = [
        ["BYTE", "cbShowUI"],
        ["BYTE", "cbAutoInstall"],
        ["WORD", "wFileNameSize"],
        ["WORD", "wDescribeSize"],
        ["WORD", "wDownLoadUrlSize"]
    ],
    MDM_GR_LOGON = 1,
    SUB_GR_LOGON_USERID = 1,
    SUB_GR_LOGON_MOBILE = 2,
    SUB_GR_LOGON_ACCOUNTS = 3,
    SUB_GR_COOKIE_CONFIRM = 4,
    SUB_GR_LOGON_SUCCESS = 100,
    SUB_GR_LOGON_FAILURE = 101,
    SUB_GR_LOGON_FINISH = 102,
    SUB_GR_COOKIE_CONFIRM_RESULT = 103,
    SUB_GR_UPDATE_NOTIFY = 200,
    CMD_GR_LogonUserID = [
        ["DWORD", "dwPlazaVersion"],
        ["DWORD", "dwFrameVersion"],
        ["DWORD", "dwProcessVersion"],
        ["DWORD", "dwUserID"],
        ["TCHAR", "szPassword", LEN_MD5],
        ["TCHAR", "szMachineID", LEN_MACHINE_ID],
        ["WORD", "wKindID"]
    ],
    CMD_GR_LogonMobile = [
        ["WORD", "wGameID"],
        ["DWORD", "dwProcessVersion"],
        ["BYTE", "cbDeviceType"],
        ["WORD", "wBehaviorFlags"],
        ["WORD", "wPageTableCount"],
        ["DWORD", "dwUserID"],
        ["TCHAR", "szPassword", LEN_MD5],
        ["TCHAR", "szMachineID", LEN_MACHINE_ID]
    ],
    CMD_GR_LogonAccounts = [
        ["DWORD", "dwPlazaVersion"],
        ["DWORD", "dwFrameVersion"],
        ["DWORD", "dwProcessVersion"],
        ["TCHAR", "szPassword", LEN_MD5],
        ["TCHAR", "szAccounts", LEN_ACCOUNTS],
        ["TCHAR", "szMachineID", LEN_MACHINE_ID]
    ],
    CMD_GR_CookieConfirm = [
        ["UCHAR", "szCookie", LEN_COOKIE]
    ],
    CMD_GR_LogonSuccess = [
        ["DWORD", "dwUserRight"],
        ["DWORD", "dwMasterRight"],
        ["WORD", "wKindID"]
    ],
    CMD_GR_LogonFailure = [
        ["LONG", "lErrorCode"],
        ["TCHAR", "szDescribeString", 128]
    ],
    CMD_GR_UpdateNotify = [
        ["BYTE", "cbMustUpdatePlaza"],
        ["BYTE", "cbMustUpdateClient"],
        ["BYTE", "cbAdviceUpdateClient"],
        ["DWORD", "dwCurrentPlazaVersion"],
        ["DWORD", "dwCurrentFrameVersion"],
        ["DWORD", "dwCurrentClientVersion"]
    ],
    CMD_GR_CookieConfirmResult = [
        ["bool", "bIsSuccess"],
        ["DWORD", "dwUserID"]
    ],
    MDM_GR_CONFIG = 2,
    SUB_GR_CONFIG_COLUMN = 100,
    SUB_GR_CONFIG_SERVER = 101,
    SUB_GR_CONFIG_PROPERTY = 102,
    SUB_GR_CONFIG_FINISH = 103,
    SUB_GR_CONFIG_USER_RIGHT = 104,
    CMD_GR_ConfigColumn = [
        ["BYTE", "cbColumnCount"],
        ["tagColumnItem", "ColumnItem", MAX_COLUMN]
    ],
    CMD_GR_ConfigServer = [
        ["WORD", "wTableCount"],
        ["WORD", "wChairCount"],
        ["WORD", "wServerType"],
        ["DWORD", "dwServerRule"],
        ["WORD", "wServerID"]
    ],
    CMD_GR_ConfigProperty = [
        ["BYTE", "cbPropertyCount"],
        ["tagPropertyInfo", "PropertyInfo", MAX_PROPERTY]
    ],
    CMD_GR_ConfigUserRight = [
        ["DWORD", "dwUserRight"]
    ],
    MDM_GR_USER = 3,
    SUB_GR_USER_RULE = 1,
    SUB_GR_USER_LOOKON = 2,
    SUB_GR_USER_SITDOWN = 3,
    SUB_GR_USER_STANDUP = 4,
    SUB_GR_USER_INVITE = 5,
    SUB_GR_USER_INVITE_REQ = 6,
    SUB_GR_USER_REPULSE_SIT = 7,
    SUB_GR_USER_KICK_USER = 8,
    SUB_GR_USER_INFO_REQ = 9,
    SUB_GR_USER_CHAIR_REQ = 10,
    SUB_GR_USER_CHAIR_INFO_REQ = 11,
    SUB_GR_USER_OPENING = 12,
    SUB_GR_USER_TABLE_HISTORY_RECORD_REQ = 13,
    SUB_GR_USER_ADD_SCORE = 14,
    SUB_GR_USER_ADD_SCORE_CONFIRM = 15,
    SUB_GR_USER_ENTER = 100,
    SUB_GR_USER_SCORE = 101,
    SUB_GR_USER_STATUS = 102,
    SUB_GR_REQUEST_FAILURE = 103,
    SUB_GR_SITDOWN_SUCCESS = 104,
    SUB_GR_SITDOWN_FAILURE = 105,
    SUB_GR_USER_DIAMOND = 106,
    SUB_GR_USER_CHAT = 201,
    SUB_GR_USER_EXPRESSION = 202,
    SUB_GR_WISPER_CHAT = 203,
    SUB_GR_WISPER_EXPRESSION = 204,
    SUB_GR_COLLOQUY_CHAT = 205,
    SUB_GR_COLLOQUY_EXPRESSION = 206,
    SUB_GR_USER_WECHAT = 207,
    SUB_GR_PROPERTY_BUY = 300,
    SUB_GR_PROPERTY_SUCCESS = 301,
    SUB_GR_PROPERTY_FAILURE = 302,
    SUB_GR_PROPERTY_MESSAGE = 303,
    SUB_GR_PROPERTY_EFFECT = 304,
    SUB_GR_PROPERTY_TRUMPET = 305,
    SUB_GR_USER_OPENING_SUCCESSS = 400,
    SUB_GR_USER_OPENING_FAILURE = 401,
    SUB_GR_USER_TABLE_HISTORY_RECORD_RESULT = 402,
    SUB_GR_USER_ADD_SCORE_NOTIFY = 403,
    SUB_GR_USER_ADD_SCORE_SUCCESSS = 404,
    SUB_GR_USER_ADD_SCORE_FAILURE = 405,
    SUB_GR_USER_ADD_SCORE_SUGGEST = 406,
    SUB_GR_USER_ADD_SCORE_APPLY = 407,
    CMD_GR_UserLookon = [
        ["WORD", "wTableID"]
    ],
    CMD_GR_UserSitDown = [
        ["WORD", "wTableID"],
        ["WORD", "wChairID"],
        ["TCHAR", "szPassword", LEN_PASSWORD]
    ],
    CMD_GR_UserStandUp = [
        ["WORD", "wTableID"],
        ["WORD", "wChairID"],
        ["BYTE", "cbForceLeave"]
    ],
    CMD_GR_UserInvite = [
        ["WORD", "wTableID"],
        ["DWORD", "dwUserID"]
    ],
    CMD_GR_UserInviteReq = [
        ["WORD", "wTableID"],
        ["DWORD", "dwUserID"]
    ],
    CMD_GR_UserScore = [
        ["DWORD", "dwUserID"],
        ["tagUserScore", "UserScore"]
    ],
    CMD_GR_MobileUserScore = [
        ["DWORD", "dwUserID"],
        ["tagMobileUserScore", "UserScore"]
    ],
    CMD_GR_UserStatus = [
        ["DWORD", "dwUserID"],
        ["tagUserStatus", "UserStatus"]
    ],
    CMD_GR_RequestFailure = [
        ["LONG", "lErrorCode"],
        ["TCHAR", "szDescribeString", 256]
    ],
    CMD_GR_UserDiamond = [
        ["DWORD", "dwUserID"],
        ["SCORE", "lDiamond"]
    ],
    CMD_GR_C_UserChat = [
        ["WORD", "wChatLength"],
        ["DWORD", "dwChatColor"],
        ["DWORD", "dwTargetUserID"],
        ["TCHAR", "szChatString", LEN_USER_CHAT]
    ],
    CMD_GR_S_UserChat = [
        ["WORD", "wChatLength"],
        ["DWORD", "dwChatColor"],
        ["DWORD", "dwSendUserID"],
        ["DWORD", "dwTargetUserID"],
        ["TCHAR", "szChatString", LEN_USER_CHAT]
    ],
    CMD_GR_C_UserExpression = [
        ["WORD", "wItemIndex"],
        ["DWORD", "dwTargetUserID"]
    ],
    CMD_GR_S_UserExpression = [
        ["WORD", "wItemIndex"],
        ["DWORD", "dwSendUserID"],
        ["DWORD", "dwTargetUserID"]
    ],
    CMD_GR_C_WisperChat = [
        ["WORD", "wChatLength"],
        ["DWORD", "dwChatColor"],
        ["DWORD", "dwTargetUserID"],
        ["TCHAR", "szChatString", LEN_USER_CHAT]
    ],
    CMD_GR_S_WisperChat = [
        ["WORD", "wChatLength"],
        ["DWORD", "dwChatColor"],
        ["DWORD", "dwSendUserID"],
        ["DWORD", "dwTargetUserID"],
        ["TCHAR", "szChatString", LEN_USER_CHAT]
    ],
    CMD_GR_C_WisperExpression = [
        ["WORD", "wItemIndex"],
        ["DWORD", "dwTargetUserID"]
    ],
    CMD_GR_S_WisperExpression = [
        ["WORD", "wItemIndex"],
        ["DWORD", "dwSendUserID"],
        ["DWORD", "dwTargetUserID"]
    ],
    CMD_GR_C_WeChat = [
        ["DWORD", "dwUserID"],
        ["WORD", "wTableID"],
        ["TCHAR", "szVoiceID", LEN_USER_CHAT],
        ["WORD", "wTime"]
    ],
    CMD_GR_S_WeChat = [
        ["DWORD", "dwUserID"],
        ["WORD", "wTableID"],
        ["TCHAR", "szVoiceID", LEN_USER_CHAT],
        ["WORD", "wTime"]
    ],
    CMD_GR_ColloquyChat = [
        ["WORD", "wChatLength"],
        ["DWORD", "dwChatColor"],
        ["DWORD", "dwSendUserID"],
        ["DWORD", "dwConversationID"],
        ["DWORD", "dwTargetUserID", 16],
        ["TCHAR", "szChatString", LEN_USER_CHAT]
    ],
    CMD_GR_C_InviteUser = [
        ["WORD", "wTableID"],
        ["DWORD", "dwSendUserID"]
    ],
    CMD_GR_S_InviteUser = [
        ["DWORD", "dwTargetUserID"]
    ],
    CMD_GR_C_PropertyBuy = [
        ["BYTE", "cbRequestArea"],
        ["BYTE", "cbConsumeScore"],
        ["WORD", "wItemCount"],
        ["WORD", "wPropertyIndex"],
        ["DWORD", "dwTargetUserID"]
    ],
    CMD_GR_S_PropertySuccess = [
        ["BYTE", "cbRequestArea"],
        ["WORD", "wItemCount"],
        ["WORD", "wPropertyIndex"],
        ["DWORD", "dwSourceUserID"],
        ["DWORD", "dwTargetUserID"]
    ],
    CMD_GR_PropertyFailure = [
        ["WORD", "wRequestArea"],
        ["LONG", "lErrorCode"],
        ["TCHAR", "szDescribeString", 256]
    ],
    CMD_GR_S_PropertyMessage = [
        ["WORD", "wPropertyIndex"],
        ["WORD", "wPropertyCount"],
        ["DWORD", "dwSourceUserID"],
        ["DWORD", "dwTargerUserID"]
    ],
    CMD_GR_S_PropertyEffect = [
        ["DWORD", "wUserID"],
        ["BYTE", "cbMemberOrder"]
    ],
    CMD_GR_C_SendTrumpet = [
        ["BYTE", "cbRequestArea"],
        ["WORD", "wPropertyIndex"],
        ["DWORD", "TrumpetColor"],
        ["TCHAR", "szTrumpetContent", TRUMPET_MAX_CHAR]
    ],
    CMD_GR_S_SendTrumpet = [
        ["WORD", "wPropertyIndex"],
        ["DWORD", "dwSendUserID"],
        ["DWORD", "TrumpetColor"],
        ["TCHAR", "szSendNickName", 32],
        ["TCHAR", "szTrumpetContent", TRUMPET_MAX_CHAR]
    ],
    CMD_GR_UserRepulseSit = [
        ["WORD", "wTableID"],
        ["WORD", "wChairID"],
        ["DWORD", "dwUserID"],
        ["DWORD", "dwRepulseUserID"]
    ],
    CMD_GR_Opening = [
        ["WORD", "wTableID"],
        ["DWORD", "dwUserID"]
    ],
    CMD_GR_C_TableHistoryRecordReq = [
        ["TCHAR", "szTableKey", LEN_KEYTABLE]
    ],
    CMD_GR_S_TableHistoryRecord = [
        ["WORD", "wRoundCount"],
        ["SCORE", "lTatalTakeInScore"],
        ["WORD", "wRecordCount"],
        ["tagTableHistoryRecordInfo", "TableHistoryRecordInfo", MAX_TABALE_RECORD]
    ],
    CMD_GR_S_AddScoreNotify = [
        ["DWORD", "dwUserID"],
        ["SCORE", "lTakeInScore"]
    ],
    CMD_GR_AddScore = [
        ["SCORE", "lAddScore"],
        ["TCHAR", "szTableKey", LEN_KEYTABLE]
    ],
    CMD_GR_AddScore_Apply = [
        ["DWORD", "dwUserID"],
        ["SCORE", "lAddScore"],
        ["TCHAR", "szTableKey", LEN_KEYTABLE],
        ["DWORD", "dwOpenID"]
    ],
    CMD_GR_AddScore_Confirm = [
        ["DWORD", "dwUserID"],
        ["SCORE", "lAddScore"],
        ["TCHAR", "szTableKey", LEN_KEYTABLE],
        ["DWORD", "dwOpenID"],
        ["BYTE", "bConfirm"]
    ],
    CMD_GR_S_AddScoreSuggest = [
        ["DWORD", "dwUserID"]
    ],
    UR_LIMIT_SAME_IP = 1,
    UR_LIMIT_WIN_RATE = 2,
    UR_LIMIT_FLEE_RATE = 4,
    UR_LIMIT_GAME_SCORE = 8,
    CMD_GR_UserRule = [
        ["BYTE", "cbRuleMask"],
        ["WORD", "wMinWinRate"],
        ["WORD", "wMaxFleeRate"],
        ["LONG", "lMaxGameScore"],
        ["LONG", "lMinGameScore"]
    ],
    CMD_GR_UserInfoReq = [
        ["DWORD", "dwUserIDReq"],
        ["WORD", "wTablePos"]
    ],
    CMD_GR_ChairUserInfoReq = [
        ["WORD", "wTableID"],
        ["WORD", "wChairID"]
    ],
    MDM_GR_STATUS = 4,
    SUB_GR_TABLE_INFO = 100,
    SUB_GR_TABLE_STATUS = 101,
    SUB_GR_TABLE_OWNER = 200,
    CMD_GR_TableInfo = [
        ["tagTableStatus", "TableStatusArray"]
    ],
    CMD_GR_TableStatus = [
        ["WORD", "wTableID"],
        ["tagTableStatus", "TableStatus"]
    ],
    CMD_GR_TableOwner = [
        ["DWORD", "dwTableOwner"]
    ],
    MDM_GR_INSURE = 5,
    SUB_GR_QUERY_INSURE_INFO = 1,
    SUB_GR_SAVE_SCORE_REQUEST = 2,
    SUB_GR_TAKE_SCORE_REQUEST = 3,
    SUB_GR_TRANSFER_SCORE_REQUEST = 4,
    SUB_GR_QUERY_USER_INFO_REQUEST = 5,
    SUB_GR_USER_INSURE_INFO = 100,
    SUB_GR_USER_INSURE_SUCCESS = 101,
    SUB_GR_USER_INSURE_FAILURE = 102,
    SUB_GR_USER_TRANSFER_USER_INFO = 103,
    CMD_GR_C_QueryInsureInfoRequest = [
        ["BYTE", "cbActivityGame"]
    ],
    CMD_GR_C_SaveScoreRequest = [
        ["BYTE", "cbActivityGame"],
        ["SCORE", "lSaveScore"]
    ],
    CMD_GR_C_TakeScoreRequest = [
        ["BYTE", "cbActivityGame"],
        ["SCORE", "lTakeScore"],
        ["TCHAR", "szInsurePass", LEN_PASSWORD]
    ],
    CMD_GP_C_TransferScoreRequest = [
        ["BYTE", "cbActivityGame"],
        ["BYTE", "cbByNickName"],
        ["SCORE", "lTransferScore"],
        ["TCHAR", "szNickName", LEN_NICKNAME],
        ["TCHAR", "szInsurePass", LEN_PASSWORD]
    ],
    CMD_GR_C_QueryUserInfoRequest = [
        ["BYTE", "cbActivityGame"],
        ["BYTE", "cbByNickName"],
        ["TCHAR", "szNickName", LEN_NICKNAME]
    ],
    CMD_GR_S_UserInsureInfo = [
        ["BYTE", "cbActivityGame"],
        ["WORD", "wRevenueTake"],
        ["WORD", "wRevenueTransfer"],
        ["WORD", "wServerID"],
        ["SCORE", "lUserScore"],
        ["SCORE", "lUserInsure"],
        ["SCORE", "lTransferPrerequisite"]
    ],
    CMD_GR_S_UserInsureSuccess = [
        ["BYTE", "cbActivityGame"],
        ["SCORE", "lUserScore"],
        ["SCORE", "lUserInsure"],
        ["TCHAR", "szDescribeString", 128]
    ],
    CMD_GR_S_UserInsureFailure = [
        ["BYTE", "cbActivityGame"],
        ["LONG", "lErrorCode"],
        ["TCHAR", "szDescribeString", 128]
    ],
    CMD_GR_S_UserTransferUserInfo = [
        ["BYTE", "cbActivityGame"],
        ["DWORD", "dwTargetGameID"],
        ["TCHAR", "szNickName", LEN_NICKNAME]
    ],
    MDM_GR_MANAGE = 6,
    SUB_GR_SEND_WARNING = 1,
    SUB_GR_SEND_MESSAGE = 2,
    SUB_GR_LOOK_USER_IP = 3,
    SUB_GR_KILL_USER = 4,
    SUB_GR_LIMIT_ACCOUNS = 5,
    SUB_GR_SET_USER_RIGHT = 6,
    SUB_GR_QUERY_OPTION = 7,
    SUB_GR_OPTION_SERVER = 8,
    SUB_GR_OPTION_CURRENT = 9,
    SUB_GR_LIMIT_USER_CHAT = 10,
    SUB_GR_KICK_ALL_USER = 11,
    SUB_GR_DISMISSGAME = 12,
    SUB_GR_ALLOCATE_TABLE = 13,
    SUB_GR_ACCESS_TABLE_BY_KEY = 14,
    SUB_GR_GET_TAKE_IN_SCORE = 15,
    SUB_GR_SET_CONTROL_TAKEIN = 16,
    SUB_GR_SET_MAX_TIMES_TAKEIN = 17,
    SUB_GR_GET_PAYINFO_IN_GAME = 18,
    SUB_GR_PAY_IN_GAME = 19,
    SUB_GR_ALLOCATE_TABLE_RESULT = 100,
    SUB_GR_ACCESS_TABLE_BY_KEY_RESULT = 101,
    SUB_GR_GET_TAKE_IN_SCORE_RESULT = 102,
    SUB_GR_SET_CONTROL_TAKEIN_SUCCESSS = 200,
    SUB_GR_SET_CONTROL_TAKEIN_FAILURE = 201,
    SUB_GR_SET_MAX_TIMES_TAKEIN_RESULT = 202,
    SUB_GR_GET_PAYINFO_RESULT = 203,
    SUB_GR_PAY_IN_GAME_RESULT = 204,
    CMD_GR_SendWarning = [
        ["WORD", "wChatLength"],
        ["DWORD", "dwTargetUserID"],
        ["TCHAR", "szWarningMessage", LEN_USER_CHAT]
    ],
    CMD_GR_SendMessage = [
        ["BYTE", "cbGame"],
        ["BYTE", "cbRoom"],
        ["BYTE", "cbAllRoom"],
        ["WORD", "wChatLength"],
        ["TCHAR", "szSystemMessage", LEN_USER_CHAT]
    ],
    CMD_GR_LookUserIP = [
        ["DWORD", "dwTargetUserID"]
    ],
    CMD_GR_KickUser = [
        ["DWORD", "dwTargetUserID"]
    ],
    CMD_GR_LimitAccounts = [
        ["DWORD", "dwTargetUserID"]
    ],
    CMD_GR_SetUserRight = [
        ["DWORD", "dwTargetUserID"],
        ["BYTE", "cbGameRight"],
        ["BYTE", "cbAccountsRight"],
        ["BYTE", "cbLimitRoomChat"],
        ["BYTE", "cbLimitGameChat"],
        ["BYTE", "cbLimitPlayGame"],
        ["BYTE", "cbLimitSendWisper"],
        ["BYTE", "cbLimitLookonGame"]
    ],
    CMD_GR_OptionCurrent = [
        ["DWORD", "dwRuleMask"],
        ["tagServerOptionInfo", "ServerOptionInfo"]
    ],
    CMD_GR_ServerOption = [
        ["tagServerOptionInfo", "ServerOptionInfo"]
    ],
    CMD_GR_KickAllUser = [
        ["TCHAR", "szKickMessage", LEN_USER_CHAT]
    ],
    CMD_GR_DismissGame = [
        ["WORD", "wDismissTableNum"]
    ],
    CMD_GR_C_AllocateTable = [
        ["TCHAR", "szTableName", LEN_SERVER],
        ["WORD", "wRoundTime"],
        ["SCORE", "lTakeInScore"],
        ["bool", "bIsControlOpen"],
        ["bool", "bIsTableOwnerFixed"],
        ["DWORD", "dwRtID"]
    ],
    CMD_GR_S_AllocateTableResult = [
        ["LONG", "lResultCode"],
        ["TCHAR", "szDescribeString", 128],
        ["TCHAR", "szTableKey", LEN_KEYTABLE],
        ["TCHAR", "szTableName", LEN_SERVER],
        ["DWORD", "dwUserID"],
        ["WORD", "wTableID"],
        ["DWORD", "dwEndTime"],
        ["SCORE", "lTakeInScore"],
        ["bool", "bIsControlOpen"],
        ["bool", "bIsOpened"],
        ["WORD", "wMaxTimes"],
        ["bool", "bIsTableOwnerFixed"]
    ],
    CMD_GR_C_AccessTableByKey = [
        ["DWORD", "dwUserID"],
        ["TCHAR", "szTableKey", LEN_KEYTABLE]
    ],
    CMD_GR_S_AccessTableInfo = [
        ["bool", "bIsSucess"],
        ["TCHAR", "szTableName", LEN_SERVER],
        ["WORD", "wRoundTime"],
        ["DWORD", "dwEndTime"],
        ["DWORD", "dwUserID"],
        ["WORD", "wTableID"],
        ["DWORD", "dwOpenID"],
        ["SCORE", "lTakeInScore"],
        ["bool", "bIsControlOpen"],
        ["bool", "bIsOpened"],
        ["DWORD", "dwStaticBanker"],
        ["WORD", "wMaxTimes"],
        ["DWORD", "dwTableOwner"],
        ["bool", "bIsTableOwnerFixed"]
    ],
    CMD_GR_C_GetTakeInScore = [
        ["TCHAR", "szTableKey", LEN_KEYTABLE]
    ],
    CMD_GR_S_GetTakeInScoreResult = [
        ["bool", "bIsSucess"],
        ["SCORE", "lTakeInScore"],
        ["DWORD", "dwUserID"]
    ],
    CMD_GR_C_SetControlTakeIn = [
        ["bool", "bOpen"],
        ["TCHAR", "szTableKey", LEN_KEYTABLE]
    ],
    CMD_GR_C_SetMaxTimesTakeIn = [
        ["WORD", "wMaxTimes"],
        ["TCHAR", "szTableKey", LEN_KEYTABLE]
    ],
    CMD_GR_S_SetMaxTimesTakeInResult = [
        ["bool", "bIsSucess"],
        ["WORD", "wTableID"],
        ["WORD", "wMaxTimes"]
    ],
    CMD_GR_C_GetPayInfo = [
        ["TCHAR", "szTableKey", LEN_KEYTABLE],
        ["DWORD", "dwUserID"]
    ],
    CMD_GR_S_GetPayInfoResult = [
        ["bool", "bIsSucess"],
        ["WORD", "wTableID"],
        ["DWORD", "dwUserID"],
        ["bool", "bIsPayed"]
    ],
    CMD_GR_C_PayInGame = [
        ["TCHAR", "szTableKey", LEN_KEYTABLE],
        ["DWORD", "dwUserID"]
    ],
    CMD_GR_S_PayInGameResult = [
        ["WORD", "wTableID"],
        ["DWORD", "dwUserID"],
        ["bool", "bIsSucess"],
        ["TCHAR", "szDescribeString", 128]
    ],
    OSF_ROOM_CHAT = 1,
    OSF_GAME_CHAT = 2,
    OSF_ROOM_WISPER = 3,
    OSF_ENTER_TABLE = 4,
    OSF_ENTER_SERVER = 5,
    OSF_SEND_BUGLE = 12,
    CMD_GR_OptionServer = [
        ["BYTE", "cbOptionFlags"],
        ["BYTE", "cbOptionValue"]
    ],
    CMD_GR_LimitUserChat = [
        ["DWORD", "dwTargetUserID"],
        ["BYTE", "cbLimitFlags"],
        ["BYTE", "cbLimitValue"]
    ],
    MDM_GR_MATCH = 7,
    SUB_GR_MATCH_FEE = 400,
    SUB_GR_MATCH_NUM = 401,
    SUB_GR_LEAVE_MATCH = 402,
    SUB_GR_MATCH_INFO = 403,
    SUB_GR_MATCH_WAIT_TIP = 404,
    SUB_GR_MATCH_RESULT = 405,
    SUB_GR_MATCH_STATUS = 406,
    SUB_GR_MATCH_USER_COUNT = 407,
    SUB_GR_MATCH_DESC = 408,
    CMD_GR_Match_Num = [
        ["DWORD", "dwWaitting"],
        ["DWORD", "dwTotal"],
        ["DWORD", "dwMatchTotal"]
    ],
    CMD_GR_Match_Info = [
        ["TCHAR", "szTitle", 4, 64],
        ["WORD", "wGameCount"]
    ],
    CMD_GR_Match_Wait_Tip = [
        ["SCORE", "lScore"],
        ["WORD", "wRank"],
        ["WORD", "wCurTableRank"],
        ["WORD", "wUserCount"],
        ["WORD", "wPlayingTable"],
        ["TCHAR", "szMatchName", LEN_SERVER]
    ],
    CMD_GR_MatchResult = [
        ["TCHAR", "szDescribe", 256],
        ["DWORD", "dwGold"],
        ["DWORD", "dwMedal"],
        ["DWORD", "dwExperience"]
    ],
    MAX_MATCH_DESC = 4,
    CMD_GR_MatchDesc = [
        ["TCHAR", "szTitle", MAX_MATCH_DESC, 16],
        ["TCHAR", "szDescribe", MAX_MATCH_DESC, 64],
        ["COLORREF", "crTitleColor"],
        ["COLORREF", "crDescribeColor"]
    ],
    MDM_GF_FRAME = 100,
    SUB_GF_GAME_OPTION = 1,
    SUB_GF_USER_READY = 2,
    SUB_GF_LOOKON_CONFIG = 3,
    SUB_GF_USER_CHAT = 10,
    SUB_GF_USER_EXPRESSION = 11,
    SUB_GF_GAME_STATUS = 100,
    SUB_GF_GAME_SCENE = 101,
    SUB_GF_LOOKON_STATUS = 102,
    SUB_GF_SYSTEM_MESSAGE = 200,
    SUB_GF_ACTION_MESSAGE = 201,
    CMD_GF_GameOption = [
        ["BYTE", "cbAllowLookon"],
        ["DWORD", "dwFrameVersion"],
        ["DWORD", "dwClientVersion"]
    ],
    CMD_GF_LookonConfig = [
        ["DWORD", "dwUserID"],
        ["BYTE", "cbAllowLookon"]
    ],
    CMD_GF_LookonStatus = [
        ["BYTE", "cbAllowLookon"]
    ],
    CMD_GF_GameStatus = [
        ["BYTE", "cbGameStatus"],
        ["BYTE", "cbAllowLookon"]
    ],
    CMD_GF_C_UserChat = [
        ["WORD", "wChatLength"],
        ["DWORD", "dwChatColor"],
        ["DWORD", "dwTargetUserID"],
        ["TCHAR", "szChatString", LEN_USER_CHAT]
    ],
    CMD_GF_S_UserChat = [
        ["WORD", "wChatLength"],
        ["DWORD", "dwChatColor"],
        ["DWORD", "dwSendUserID"],
        ["DWORD", "dwTargetUserID"],
        ["TCHAR", "szChatString", LEN_USER_CHAT]
    ],
    CMD_GF_C_UserExpression = [
        ["WORD", "wItemIndex"],
        ["DWORD", "dwTargetUserID"]
    ],
    CMD_GF_S_UserExpression = [
        ["WORD", "wItemIndex"],
        ["DWORD", "dwSendUserID"],
        ["DWORD", "dwTargetUserID"]
    ],
    MDM_GF_GAME = 200,
    DTP_GR_TABLE_PASSWORD = 1,
    DTP_GR_NICK_NAME = 10,
    DTP_GR_GROUP_NAME = 11,
    DTP_GR_UNDER_WRITE = 12,
    DTP_GR_USER_NOTE = 20,
    DTP_GR_CUSTOM_FACE = 21,
    REQUEST_FAILURE_NORMAL = 0,
    REQUEST_FAILURE_NOGOLD = 1,
    REQUEST_FAILURE_NOSCORE = 2,
    REQUEST_FAILURE_PASSWORD = 3,
    REQUEST_FAILURE_NOTABLE = 4,
    REQUEST_FAILURE_STATUS_ERROR = 5,
    IPC_CMD_GF_SOCKET = 1,
    IPC_SUB_GF_SOCKET_SEND = 1,
    IPC_SUB_GF_SOCKET_RECV = 2,
    IPC_GF_SocketSend = [
        ["TCP_Command", "CommandInfo"],
        ["BYTE", "cbBuffer", SOCKET_TCP_PACKET]
    ],
    IPC_GF_SocketRecv = [
        ["TCP_Command", "CommandInfo"],
        ["BYTE", "cbBuffer", SOCKET_TCP_PACKET]
    ],
    IPC_CMD_GF_CONTROL = 2,
    IPC_SUB_GF_CLIENT_READY = 1,
    IPC_SUB_GF_CLIENT_CLOSE = 2,
    IPC_SUB_GF_CLOSE_PROCESS = 100,
    IPC_SUB_GF_ACTIVE_PROCESS = 101,
    IPC_SUB_GF_BOSS_COME = 200,
    IPC_SUB_GF_BOSS_LEFT = 201,
    IPC_CMD_GF_CONFIG = 3,
    IPC_SUB_GF_LEVEL_INFO = 100,
    IPC_SUB_GF_COLUMN_INFO = 101,
    IPC_SUB_GF_SERVER_INFO = 102,
    IPC_SUB_GF_PROPERTY_INFO = 103,
    IPC_SUB_GF_CONFIG_FINISH = 104,
    IPC_SUB_GF_USER_RIGHT = 107,
    IPC_GF_ServerInfo = [
        ["WORD", "wTableID"],
        ["WORD", "wChairID"],
        ["DWORD", "dwUserID"],
        ["DWORD", "dwUserRight"],
        ["DWORD", "dwMasterRight"],
        ["WORD", "wKindID"],
        ["WORD", "wServerID"],
        ["WORD", "wServerType"],
        ["DWORD", "dwServerRule"],
        ["TCHAR", "szServerName", LEN_SERVER],
        ["WORD", "wAVServerPort"],
        ["DWORD", "dwAVServerAddr"]
    ],
    IPC_GF_LevelInfo = [
        ["BYTE", "cbItemCount"],
        ["tagLevelItem", "LevelItem", 64]
    ],
    IPC_GF_ColumnInfo = [
        ["BYTE", "cbColumnCount"],
        ["tagColumnItem", "ColumnItem", MAX_COLUMN]
    ],
    IPC_GF_PropertyInfo = [
        ["BYTE", "cbPropertyCount"],
        ["tagPropertyInfo", "PropertyInfo", MAX_PROPERTY]
    ],
    IPC_GF_UserRight = [
        ["DWORD", "dwUserRight"]
    ],
    IPC_CMD_GF_USER_INFO = 4,
    IPC_SUB_GF_USER_ENTER = 100,
    IPC_SUB_GF_USER_SCORE = 101,
    IPC_SUB_GF_USER_STATUS = 102,
    IPC_SUB_GF_USER_ATTRIB = 103,
    IPC_SUB_GF_CUSTOM_FACE = 104,
    IPC_SUB_GR_KICK_USER = 105,
    IPC_GF_UserInfo = [
        ["BYTE", "cbCompanion"],
        ["tagUserInfoHead", "UserInfoHead"]
    ],
    IPC_GF_UserScore = [
        ["DWORD", "dwUserID"],
        ["tagUserScore", "UserScore"]
    ],
    IPC_GF_UserStatus = [
        ["DWORD", "dwUserID"],
        ["tagUserStatus", "UserStatus"]
    ],
    IPC_GF_UserAttrib = [
        ["DWORD", "dwUserID"],
        ["tagUserAttrib", "UserAttrib"]
    ],
    IPC_GF_CustomFace = [
        ["DWORD", "dwUserID"],
        ["DWORD", "dwCustomID"],
        ["tagCustomFaceInfo", "CustomFaceInfo"]
    ],
    IPC_GF_KickUser = [
        ["DWORD", "dwTargetUserID"]
    ],
    IPC_CMD_GF_PROPERTY_INFO = 5,
    IPC_SUB_GF_BUY_PROPERTY = 100,
    IPC_SUB_GF_PROPERTY_SUCCESS = 101,
    IPC_SUB_GF_PROPERTY_FAILURE = 102,
    IPC_SUB_GR_PROPERTY_MESSAGE = 103,
    IPC_SUB_GR_PROPERTY_TRUMPET = 104,
    IPC_GF_BuyProperty = [
        ["WORD", "wItemCount"],
        ["WORD", "wPropertyIndex"],
        ["TCHAR", "szNickName", LEN_NICKNAME]
    ],
    IPC_GR_PropertySuccess = [
        ["WORD", "wPropertyIndex"],
        ["WORD", "wPropertyCount"],
        ["DWORD", "dwSourceUserID"],
        ["DWORD", "dwTargetUserID"],
        ["TCHAR", "szSourceNickName", LEN_NICKNAME]
    ],
    IPC_GR_PropertyMessage = [
        ["WORD", "wPropertyIndex"],
        ["WORD", "wPropertyCount"],
        ["TCHAR", "szSourceNickName", LEN_NICKNAME],
        ["TCHAR", "szTargerNickName", LEN_NICKNAME]
    ],
    IPC_GR_PropertyFailure = [
        ["LONG", "lErrorCode"],
        ["TCHAR", "szDescribeString", 256]
    ],
    IPC_GR_PropertyTrumpet = [
        ["WORD", "wPropertyIndex"],
        ["DWORD", "dwSendUserID"],
        ["DWORD", "TrumpetColor"],
        ["TCHAR", "szSendNickName", 32],
        ["TCHAR", "szTrumpetContent", TRUMPET_MAX_CHAR]
    ];




//#ifndef CMD_OX_HEAD_FILE
//#define CMD_OX_HEAD_FILE

//////////////////////////////////////////////////////////////////////////
//公共宏定义

var KIND_ID = 27                                    //游戏 I D
var GAME_PLAYER = 8                                 //游戏人数
var GAME_NAME = "牛牛"                        //游戏名字
var MAX_COUNT = 5                                   //最大数目
var MAX_JETTON_AREA = 4                                 //下注区域
var MAX_TIMES = 5                                   //最大赔率

var VERSION_SERVER = PROCESS_VERSION(6,0,3)             //程序版本
var VERSION_CLIENT = PROCESS_VERSION(6,0,3)             //程序版本

//结束原因
var GER_NO_PLAYER = 0x10                                //没有玩家

//游戏状态
var GS_TK_FREE = GAME_STATUS_FREE                   //等待开始
var GS_TK_CALL = GAME_STATUS_PLAY                   //叫庄状态
var GS_TK_SCORE = GAME_STATUS_PLAY+1                    //下注状态
var GS_TK_PLAYING = GAME_STATUS_PLAY+2                  //游戏进行


var SERVER_LEN = 32 

//////////////////////////////////////////////////////////////////////////
//服务器命令结构

var SUB_S_GAME_START = 100                                  //游戏开始
var SUB_S_ADD_SCORE = 101                                   //加注结果
var SUB_S_PLAYER_EXIT = 102                                 //用户强退
var SUB_S_SEND_CARD = 103                                   //发牌消息
var SUB_S_GAME_END = 104                                    //游戏结束
var SUB_S_OPEN_CARD = 105                                   //用户摊牌
var SUB_S_CALL_BANKER = 106                                 //用户叫庄
var SUB_S_ALL_CARD = 107                                    //发牌消息
var SUB_S_AMDIN_COMMAND = 108                                   //系统控制
var SUB_S_BANKER_OPERATE = 109                                  //存取款
var SUB_S_STATIC_BANKER_UP = 110                                    //申请常庄
var SUB_S_CONFIRM_STATIC_BANKER = 111                                   //确认常庄
var SUB_S_STATIC_BANKER_DOWN = 112                                  //常庄退庄

// //#ifndef _UNICODE
// var myprintf = _snprintf
// var mystrcpy = strcpy
// var mystrlen = strlen
// var myscanf = _snscanf
// var myLPSTR = LPCSTR
// var myatoi = atoi
// var myatoi64 = _atoi64
// //#else
// var myprintf = swprintf
// var mystrcpy = wcscpy
// var mystrlen = wcslen
// var myscanf = _snwscanf
// var myLPSTR = LPWSTR
// var myatoi = _wtoi
// var myatoi64 = _wtoi64
//#endif


//#pragma pack(push)  
//#pragma pack(1)

//游戏状态
var CMD_S_StatusFree = 
[
    ['LONGLONG', 'lCellScore'],                         //基础积分

    //历史积分
    ['LONGLONG', 'lTurnScore', GAME_PLAYER],            //积分信息
    ['LONGLONG', 'lCollectScore', GAME_PLAYER],         //积分信息
    ['TCHAR', 'szGameRoomName', SERVER_LEN],            //房间名称
]

//游戏状态
var CMD_S_StatusCall = 
[
    ['WORD', 'wCallBanker'],                        //叫庄用户
    ['BYTE', 'cbDynamicJoin'],                      //动态加入 
    ['BYTE', 'cbPlayStatus', GAME_PLAYER],          //用户状态

    //历史积分
    ['LONGLONG', 'lTurnScore', GAME_PLAYER],            //积分信息
    ['LONGLONG', 'lCollectScore', GAME_PLAYER],         //积分信息
    ['TCHAR', 'szGameRoomName', SERVER_LEN],            //房间名称
    ['DWORD', 'dwTimeCountDown'],                   //倒计时间
]

//游戏状态
var CMD_S_StatusScore = 
[
    //下注信息
    ['BYTE', 'cbPlayStatus', GAME_PLAYER],          //用户状态
    ['BYTE', 'cbDynamicJoin'],                      //动态加入
    ['LONGLONG', 'lTurnMaxScore'],                      //最大下注
    ['LONGLONG', 'lTableScore', GAME_PLAYER],           //下注数目
    ['WORD', 'wBankerUser'],                        //庄家用户
    ['TCHAR', 'szGameRoomName', SERVER_LEN],            //房间名称

    //历史积分
    ['LONGLONG', 'lTurnScore', GAME_PLAYER],            //积分信息
    ['LONGLONG', 'lCollectScore', GAME_PLAYER],         //积分信息
    ['DWORD', 'dwTimeCountDown'],                   //倒计时间
]

//游戏状态
var CMD_S_StatusPlay = 
[
    //状态信息
    ['BYTE', 'cbPlayStatus', GAME_PLAYER],          //用户状态
    ['BYTE', 'cbDynamicJoin'],                      //动态加入
    ['LONGLONG', 'lTurnMaxScore'],                      //最大下注
    ['LONGLONG', 'lTableScore', GAME_PLAYER],           //下注数目
    ['WORD', 'wBankerUser'],                        //庄家用户

    //扑克信息
    ['BYTE', 'cbHandCardData', GAME_PLAYER, MAX_COUNT],//桌面扑克
    ['BYTE', 'bOxCard', GAME_PLAYER],               //牛牛数据
    ['BYTE', 'cbCardType', GAME_PLAYER],            //是否特殊牌型

    //历史积分
    ['LONGLONG', 'lTurnScore', GAME_PLAYER],            //积分信息
    ['LONGLONG', 'lCollectScore', GAME_PLAYER],         //积分信息
    ['TCHAR', 'szGameRoomName', SERVER_LEN],            //房间名称
    ['DWORD', 'dwTimeCountDown'],                   //倒计时间
]

//用户叫庄
var CMD_S_CallBanker = 
[
    ['WORD', 'wCallBanker'],                        //叫庄用户
    ['bool', 'bFirstTimes'],                        //首次叫庄
]

//游戏开始
var CMD_S_GameStart = 
[
    //下注信息
    ['LONGLONG', 'lTurnMaxScore'],                      //最大下注
    ['WORD', 'wBankerUser'],                        //庄家用户
]

//用户下注
var CMD_S_AddScore = 
[
    ['WORD', 'wAddScoreUser'],                      //加注用户
    ['LONGLONG', 'lAddScoreCount'],                     //加注数目
]

//游戏结束
var CMD_S_GameEnd = 
[
    ['LONGLONG', 'lGameTax', GAME_PLAYER],              //游戏税收
    ['LONGLONG', 'lGameScore', GAME_PLAYER],            //游戏得分
    ['BYTE', 'cbCardData', GAME_PLAYER, MAX_COUNT],         //用户扑克
]

//发牌数据包
var CMD_S_SendCard = 
[
    ['BYTE', 'cbCardData', GAME_PLAYER, MAX_COUNT], //用户扑克
    ['BYTE', 'cbCardType', GAME_PLAYER],            //是否特殊牌型
]

//发牌数据包
var CMD_S_AllCard = 
[
    ['bool', 'bAICount', GAME_PLAYER],
    ['BYTE', 'cbCardData', GAME_PLAYER, MAX_COUNT], //用户扑克
]

//用户退出
var CMD_S_PlayerExit = 
[
    ['WORD', 'wPlayerID'],                          //退出用户
]

//用户摊牌
var CMD_S_Open_Card = 
[
    ['WORD', 'wPlayerID'],                          //摊牌用户
    ['BYTE', 'bOpen'],                              //摊牌标志
]

//申请常庄
var CMD_S_Static_Banker_Up = 
[
    ['DWORD', 'dwApplicantID'],                     //申请者ID
]

//确认常庄
var CMD_S_Confirm_Static_Banker = 
[
    ['DWORD', 'dwStaticBanker'],                        //常庄ID
]

//常庄退庄
var CMD_S_Static_Banker_Down = 
[
    ['DWORD', 'dwPlayerID'],                            //退庄用户ID
]

//////////////////////////////////////////////////////////////////////////
//客户端命令结构
var SUB_C_CALL_BANKER = 1                                   //用户叫庄
var SUB_C_ADD_SCORE = 2                                 //用户加注
var SUB_C_OPEN_CARD = 3                                 //用户摊牌
var SUB_C_SPECIAL_CLIENT_REPORT = 4                                   //特殊终端
var SUB_C_AMDIN_COMMAND = 5                                 //系统控制
var SUB_C_STATIC_BANKER_UP = 6                                  //申请常庄
var SUB_C_CONFIRM_STATIC_BANKER = 7                                 //常庄确认
var SUB_C_STATIC_BANKER_DOWN = 8                                    //常庄退庄

//用户叫庄
var CMD_C_CallBanker = 
[
    ['BYTE', 'bBanker'],                            //做庄标志
]

//终端类型
var CMD_C_SPECIAL_CLIENT_REPORT = 
[
    ['WORD', 'wUserChairID'],                       //用户方位
]

//用户加注
var CMD_C_AddScore = 
[
    ['LONGLONG', 'lScore'],                             //加注数目
]

//用户摊牌
var CMD_C_OxCard = 
[
    ['BYTE', 'bOX'],                                //牛牛标志
]

//常庄确认
var CMD_C_Confirm_Static_Banker = 
[
    ['DWORD', 'dwStaticBanker'],                        //常庄ID
    ['BYTE', 'bConfirm'],                           //常庄同意标志
]

//////////////////////////////////////////////////////////////////////////
var RQ_SET_WIN_AREA = 1
var RQ_RESET_CONTROL = 2
var RQ_PRINT_SYN = 3

var CMD_C_AdminReq = 
[
    ['BYTE', 'cbReqType'],
    ['BYTE', 'cbExtendData', 20],           //附加数据
]

//请求回复
var ACK_SET_WIN_AREA = 1
var ACK_PRINT_SYN = 2
var ACK_RESET_CONTROL = 3

var CR_ACCEPT = 2           //接受
var CR_REFUSAL = 3          //拒绝

var CMD_S_CommandResult = 
[
    ['BYTE', 'cbAckType'],                  //回复类型
    ['BYTE', 'cbResult'],
    ['BYTE', 'cbExtendData', 20],           //附加数据
]

var IDM_ADMIN_COMMDN = WM_USER+1000

//控制区域信息
var tagControlInfo = 
[
    ['INT', 'nAreaWin'],        //控制区域
]

//服务器控制返回
var S_CR_FAILURE = 0        //失败
var S_CR_UPDATE_SUCCES = 1      //更新成功
var S_CR_SET_SUCCESS = 2        //设置成功
var S_CR_CANCEL_SUCCESS = 3     //取消成功
var CMD_S_ControlReturns = 
[
    ['BYTE', 'cbReturnsType'],              //回复类型
    ['BYTE', 'cbControlArea'],  //控制区域
    ['BYTE', 'cbControlTimes'],         //控制次数
]


//客户端控制申请
var C_CA_UPDATE = 1     //更新
var C_CA_SET = 2        //设置
var C_CA_CANCELS = 3        //取消
var CMD_C_ControlApplication = 
[
    ['BYTE', 'cbControlAppType'],           //申请类型
    ['BYTE', 'cbControlArea'],  //控制区域
    ['BYTE', 'cbControlTimes'],         //控制次数
]


//#pragma pack(pop)

//#endif
