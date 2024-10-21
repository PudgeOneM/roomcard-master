

//大图片 需要预先加载
//下载是同步进行的 即.len个资源会同时下载 而非下载好一个再去下载另一个
var g_resources = 
[	//这个数组里的资源会进行MD5比对 决定是否下载还是取缓存 
	//不在这个数组预加载的话会 在游戏里调用资源时直接取缓存
	resp.mahJongResPlist,
	resp.mahJongRes,
	resp.baseResPlist,
	resp.baseRes,
	resp.amtOperate0Plist,
	resp.amtOperate0Res,
	resp.amtOperate1Plist,
	resp.amtOperate1Res,
	resp.gameEndPlist,
	resp.gameEnd,
	resp.gameSetPlist,
	resp.gameSet,
	resp.btnChi,
	resp.btnPeng,
	resp.btnGang,
	resp.btnHu,
	resp.btnPass,
	resp.clockNum,

	resp.tableCCB,
	resp.topUICCB,
	resp.ruleCCB,
	resp.gameEndCCB,
	resp.gameSetCCB,
]
