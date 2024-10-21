
//大图片 需要预先加载
//下载是同步进行的 即.len个资源会同时下载 而非下载好一个再去下载另一个
var g_resources = 
[	//这个数组里的资源会进行MD5比对 决定是否下载还是取缓存 
	//不在这个数组预加载的话会 在游戏里调用资源时直接取缓存
	resp.bg_g,
	resp.bg_logo,
	resp.nums2,
	resp.nums3,

	resp.baseRes,
	resp.baseResPlist,
	resp.playRes,
	resp.playResPlist,
	resp.animationAction,
	resp.animationActionPlist,
	resp.animationGameEnd,
	resp.animationGameEndPlist,

	resp.playCCB,
	resp.topUICCB,
	resp.tableCCB,
	resp.gameEndPopCCB,
]

var base64Array = []
for(var i in base64ResConf)
{	
	try
	{	
		var item = {}
		item.type = 'png'
		item.src = base64ResConf[i].pngSourcePath
		item.realUrl = eval(base64ResConf[i].base64VarName)
	}
	catch(e)
	{
		var item = base64ResConf[i].pngSourcePath
	}
	base64Array[base64Array.length] = item
}

g_resources = g_resources.concat(base64Array)



