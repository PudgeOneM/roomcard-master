var child_process = require('child_process')
var fs = require("fs")
var qs = require('querystring');
var url = require("url")
var path = require('path')


require('./functions.js')

var sep = path.sep
var segX = '_'
// var timestamp // = new Date().getTime()


this.getRunGame = function(req, res) 
{ 
    res.write(getHtml_games('run'))
    res.end()
}

this.postRunGame = function(req, res) 
{
    var queryUrl = url.parse(req.url).query 
    var query = qs.parse(queryUrl)
    var gameName = query.gameName
    if(!gameName)
    {
      if(!fs.existsSync('runtime') )
      {
          child_process.execSync(mkdirS('runtime'))
          child_process.execSync(chmod777S('runtime'))
      }

      if(fs.existsSync(process.cwd() + '/tools/public/poker')) 
      {
          child_process.execSync(rmdirS(process.cwd() + '/tools/public/poker'))
      }
      child_process.execSync(linkS(process.cwd(), process.cwd() + '/tools/public/poker'))

      res.redirect('/')
    }
    else
    {
      runGame(gameName)
      res.end()
    }
}

this.getPublishGame = function(req, res) 
{ 
    res.write(getHtml_games('publish'))
    res.end()
}

this.postPublishGame = function(req, res) 
{ 
    var queryUrl = url.parse(req.url).query 
    var query = qs.parse(queryUrl)
    var gameName = query.gameName

    if(!gameName)
    {
      if(!fs.existsSync('publish') )
      {   
          child_process.execSync(mkdirS('publish'))
          child_process.execSync(chmod777S('publish'))
      }

      if(fs.existsSync(process.cwd() + '/tools/public/poker')) 
      {
          child_process.execSync(rmdirS(process.cwd() + '/tools/public/poker'))
      }

      child_process.execSync(linkS(process.cwd(), process.cwd() + '/tools/public/poker'))
      res.redirect('/')
    }
    else
    {
      publishGame(gameName)
      res.end()
    }
}

//输入c++代码 返回js代码
this.getC2js = function(res) 
{
    var body = '<html>'+
    '<head>'+
    '<meta http-equiv="Content-Type" '+
    'content="text/html; charset=UTF-8" />'+
    '<script src="/javascripts/headScripts.js"></script>'+ 
    '<link rel="stylesheet" href="/stylesheets/style.css" />'+
    '</head>'+
    '<body>'+
    '<p><a href="/">首页</a></p>'+
    '<textarea rows="8" cols="150" id= "c">c</textarea><br><br><br>'+
    '<textarea rows="8" cols="150" id= "js">js</textarea>'+
    '<p><button onclick="c2js()">转换</button></p>'+
    '</body>'+
    '</html>'

    res.writeHead(200, {"Content-Type": "text/html"})
    res.write(body)
    res.end()
}

this.getPublishCocos = function(res) 
{ 
    //var cmd = 'cd public;/usr/bin/env cocos compile -p web -m release -o publish' 
    var cmd = 'cd public;/usr/bin/env cocos compile -p web -m release' 
    child_process.exec(cmd, function(error)
               {
                  if(error)
                  {
                    res.render('index', { title: 'index' , tips: "error:" + error})
                  }
                  else
                    res.render('index', { title: 'index' , tips: "success"})
               })

}

////////////////////////////////////////////////////////////////////////////////////////////////////

function runGame(gameName)
{   
    try
    { 
      var idx = gameName.split(segX)[0]
      if(fs.existsSync('runtime/' + idx) )
      {   
        child_process.execSync(rmdirS('runtime/' + idx))
      }

      child_process.execSync(mkdirS('runtime/' + idx))
      child_process.execSync(mkdirS('runtime/' + idx + '/res'))
      child_process.execSync(linkS(process.cwd() + '/games/mygames/' + gameName + '/res/gameRes', 'runtime/' + idx + '/res/gameRes'))
      child_process.execSync(copyfileS('games/mygames/' + gameName + '/index.html', 'runtime/' + idx))
      child_process.execSync(linkS(process.cwd() + '/public/publish/html5/project.json', 'runtime/' + idx + '/project.json'))
      // child_process.execSync(linkS(process.cwd() + '/public/worker.js', 'runtime/' + idx + '/worker.js'))

      if(fs.existsSync('games/mygames/' + gameName + '/publicRes/res/' ) )
          child_process.execSync(linkS(process.cwd() + '/games/mygames/' + gameName + '/publicRes/res/publicRes', 'runtime/' + idx + '/res/publicRes'))
      else
          child_process.execSync(linkS(process.cwd() + '/public/res/publicRes', 'runtime/' + idx + '/res/publicRes'))

      var t = dealComponentList(gameName)
      var pathArray_c = t[0]
      var resp_c = t[1]

      // fs.writeFileSync('games/mygames/' + gameName + '/src/main/cResPath.js' , 'var resp_c = ' + JSON.stringify(resp_c))

      //-------------------------------------copy componentsRes
      for(var i in resp_c)
      {
        var p = resp_c[i]
        var p2 = 'runtime/' + idx + '/res/' + path.dirname(p)
        if( !fs.existsSync(p2) )
        {
          child_process.execSync( mkdirS(p2) ) 
        }
        //优先用游戏定制的资源 如果没有才会用组件的默认资源
        
        var resP
        if(fs.existsSync('games/mygames/' + gameName + '/componentRes/' + p) )
          resP = 'games/mygames/' + gameName + '/componentRes/' + p
        else
          resP = 'games/' + p
        child_process.execSync( copyfileS( resP, 'runtime/' + idx + '/res/' + path.dirname(p)) )
      }

      //-------------------------------------资源md5 start
      
      // var resPath2Md5Map = getResPath2Md5Map( 'runtime/' + idx + '/res/',  gameName)

      //-------------------------------------资源md5 解决缓存 end
      var pathArray = ['public/conf.js']

      var requirePathPrefix = 
      [
        'games/mygames/' + gameName
      ]
      pathArray = pathArray.concat( getPathsWithRequire(requirePathPrefix, 'conf.js') ) 
      pathArray = pathArray.concat(['public/start.js','public/publish/html5/game.min.js']) 

      /////
      var requirePathPrefix = 
      [
        'public'
      ]
      pathArray = pathArray.concat( getPathsWithRequire(requirePathPrefix, 'jsList.js') ) 


      pathArray = pathArray.concat(pathArray_c)

      /////
      var requirePathPrefix = 
      [
        'games/mygames/' + gameName,
        'games/components'
      ]
      pathArray = pathArray.concat( getPathsWithRequire(requirePathPrefix, 'main.js') ) 
      
      

      var appendHtml = '<script type="text/javascript">' + '\n' +
          // 'var resPath2Md5Map = ' + JSON.stringify(resPath2Md5Map) + '\n' +
          'var publishTime = ' + new Date().getTime() + '\n' +
          '</script>' + '\n'

      for(var i in pathArray)
      {
        appendHtml  = appendHtml + '<script src="/poker/' + pathArray[i] + '"></script>' + '\n'
      }
      appendHtml = appendHtml + '</body>' + '\n' +'</html>'

      fs.appendFileSync('runtime/' + idx + '/index.html',appendHtml)
      return gameName.substring(gameName.split(segX)[0].length+1) + ':success '
    }
    catch(e)
    {
      console.log(gameName.split(segX)[1] + ':error ' + e)
      return gameName.substring(gameName.split(segX)[0].length+1) + ':error ' + e
    }

}

function publishGame(gameName)
{   
    try
    { 
      var idx = gameName.split(segX)[0]
      
      if(fs.existsSync('publish/' + idx) )
      {   
        child_process.execSync(rmdirS('publish/' + idx))
      }

      child_process.execSync(mkdirS('publish/' + idx))
      child_process.execSync(mkdirS('publish/' + idx + '/base64Res'))
      child_process.execSync(copyfileS('games/mygames/' + gameName + '/index.html', 'publish/' + idx))
      child_process.execSync(copyfileS('public/publish/html5/project.json', 'publish/' + idx))
      child_process.execSync(copyfileS('public/publish/html5/game.min.js', 'publish/' + idx + '/cocos.min.js'))
      child_process.execSync(mkdirS('publish/' + idx + '/res'))
      child_process.execSync(copydirS('games/mygames/' + gameName + '/res/gameRes', 'publish/' + idx + '/res'))
      // child_process.execSync(copydirS('public/res/publicRes', 'publish/' + idx + '/res'))
      child_process.execSync(copyfileS('public/start.js', 'publish/' + idx) )
      // child_process.execSync(copyfileS('public/worker.js', 'publish/' + idx) )
      child_process.execSync(copyfileS('public/conf.js', 'publish/' + idx) )


      if(fs.existsSync('games/mygames/' + gameName + '/publicRes/res/' ) )
          child_process.execSync(copydirS('games/mygames/' + gameName + '/publicRes/res/publicRes', 'publish/' + idx + '/res'))
      else
          child_process.execSync(copydirS('public/res/publicRes', 'publish/' + idx + '/res'))


      var t = dealComponentList(gameName)
      var pathArray_c = t[0]
      var resp_c = t[1]

      // fs.writeFileSync('games/mygames/' + gameName + '/src/main/cResPath.js' , 'var resp_c = ' + JSON.stringify(resp_c))

      //-------------------------------------copy componentsRes

      for(var i in resp_c)
      {
        var p = resp_c[i]
        var p2 = 'publish/' + idx + '/res/' + path.dirname(p)
        if( !fs.existsSync(p2) )
        {
          child_process.execSync( mkdirS(p2) ) 
        }
       
        //优先用游戏定制的资源 如果没有才会用组件的默认资源
        var resP
        if(fs.existsSync('games/mygames/' + gameName + '/componentRes/' + p) )
          resP = 'games/mygames/' + gameName + '/componentRes/' + p
        else
          resP = 'games/' + p
        child_process.execSync( copyfileS( resP, 'publish/' + idx + '/res/' + path.dirname(p)) )
      }

      //-------------------------------------资源md5 start
      // var resPath2Md5Map = getResPath2Md5Map('publish/' + idx + '/res/', gameName)

      //-------------------------------------资源md5 解决缓存 end

      //-------------------------------------资源base64 start
      var base64ResConfP = 'games/mygames/' + gameName + '/src/main/base64ResConf.js'
      var base64ResParams = []
      if( fs.existsSync(base64ResConfP) )
      {
        var confTxt = fs.readFileSync(base64ResConfP).toString()
        eval(confTxt)

        for(var i in base64ResConf)
        {
          var item = base64ResConf[i]
          var pngSourcePath = 'publish/' + idx + '/res/' + item.pngSourcePath
          // pngSourcePath = pngSourcePath.replace(/\?md5\=[\s\S]*/, '')
          var base64Code = 'data:image/png;base64,' + fs.readFileSync(pngSourcePath).toString("base64")
          var code = 'var ' + item.base64VarName + ' = "' + base64Code + '"'
          fs.writeFileSync('publish/' + idx + '/base64Res/' + i + '.js' , code)
          child_process.execSync(rmfileS(pngSourcePath))

          var p = {}
          p.url = 'base64Res/' + i + '.js'
          p.md5 = hex_md5(code)
          base64ResParams[base64ResParams.length] = p
        }
      }
      //-------------------------------------资源base64 end


      //压缩
      minifyJs(['publish/' + idx + '/conf.js'], 'publish/' + idx + '/conf.js')
      var requirePathPrefix = 
      [
        'games/mygames/' + gameName
      ]
      var minifyJsArray = getPathsWithRequire(requirePathPrefix, 'conf.js')
      minifyJs(minifyJsArray, 'publish/' + idx + '/conf.js', true)


      minifyJs(['publish/' + idx + '/start.js'], 'publish/' + idx + '/start.js')
      
      var requirePathPrefix = 
      [
        'public'
      ]
      var minifyJsArray = getPathsWithRequire(requirePathPrefix, 'jsList.js')
      minifyJs(minifyJsArray, 'publish/' + idx + '/public.min.js')

      var requirePathPrefix = 
      [
        'games/mygames/' + gameName,
        'games/components'
      ]
      var minifyJsArray = pathArray_c
      minifyJsArray = minifyJsArray.concat(getPathsWithRequire(requirePathPrefix, 'main.js'))

      minifyJs(minifyJsArray, 'publish/' + idx + '/game.min.js')

      var md5_conf = hex_md5(fs.readFileSync('publish/' + idx + '/conf.js').toString())
      var md5_start = hex_md5(fs.readFileSync('publish/' + idx + '/start.js').toString())
      var md5_cocos = hex_md5(fs.readFileSync('publish/' + idx + '/cocos.min.js').toString())
      var md5_public = hex_md5(fs.readFileSync('publish/' + idx + '/public.min.js').toString())
      var md5_game = hex_md5(fs.readFileSync('publish/' + idx + '/game.min.js').toString())
      
      //自定义加载方式  缓存public.min.js
      var appendHtml = 
      '<script type="text/javascript">' + '\n' +
      'var ua = navigator.userAgent.toLowerCase();' + '\n' +
      'var isWeixin = ua.indexOf("micromessenger") != -1;' + '\n' +
      'var isAndroid = ua.indexOf("android") != -1;' + '\n' +
      'var isIos = (ua.indexOf("iphone") != -1) || (ua.indexOf("ipad") != -1);' + '\n' +
      'if (!isWeixin) {' + '\n' +
      '    alert("请在微信客户端打开链接！");' + '\n' +
      '    var opened = window.open("about:blank", "_self");' + '\n' +
      '    opened.opener = null;' + '\n' +
      '    opened.close();' + '\n' +
      '}' + '\n' +
      '</script>' + '\n' +
      '<script src="conf.js?v=' + md5_conf + '"></script>' + '\n' +
      '<script src="start.js?v=' + md5_start + '"></script>' + '\n' +
      '<script type="text/javascript">' + '\n' +
          // 'var resPath2Md5Map = ' + JSON.stringify(resPath2Md5Map) + '\n' +
          'var publishTime = ' + new Date().getTime() + '\n' +
          'var params = [' + '\n' 

      for(var i in base64ResParams)
      {
        var str = '{"url":"'+base64ResParams[i].url+'","callback":null,"isDependLocalStorage":true,"md5":"' + base64ResParams[i].md5 + '"},' + '\n'
        appendHtml = appendHtml + str
      }
      
      appendHtml = appendHtml + '{"url":"cocos.min.js","callback":null,"isDependLocalStorage":false,"md5":"' + md5_cocos + '"},' + '\n' +
              '{"url":"public.min.js","callback":null,"isDependLocalStorage":false,"md5":"' + md5_public + '"},' + '\n' +
              '{"url":"game.min.js","callback":null,"isDependLocalStorage":false,"md5":"' + md5_game + '"},' + '\n' +
          ']' + '\n' +
          'loadJSArray(params)' + '\n' +
      '</script>' + '\n' +
      '</body>' + '\n' +
      '</html>'

      // var appendHtml = '<script src="start.js?v=' + md5_start + '"></script>' + '\n' +
      // '<script src="cocos.min.js?v=' + md5_cocos + '"></script>' + '\n' +
      // '<script src="public.min.js?v=' + md5_public + '"></script>' + '\n' +
      // '<script src="game.min.js?v=' + md5_game + '"></script>' + '\n' +
      // '</body>' + '\n' +
      // '</html>'
      fs.appendFileSync('publish/' + idx + '/index.html',appendHtml)
      return gameName.substring(gameName.split(segX)[0].length+1) + ':success '
    }
    catch(e)
    {
      console.log(gameName.split(segX)[1] + ':error ' + e)
      return gameName.substring(gameName.split(segX)[0].length+1) + ':error ' + e
    }

}

function getHtml_games(actionName)
{
    var html =
    '<head>'+
    '<meta http-equiv="Content-Type" '+
    'content="text/html; charset=UTF-8" />'+
    '<script src="/javascripts/headScripts.js"></script>'+ 
    '<link rel="stylesheet" href="/stylesheets/style.css" />'+
    '</head>'+
    '<body>'+
    '<p><a href="/">首页</a></p>'+
    '<p><input id="isAll" type="checkbox" onclick="chooseAll()"/>全选</p>'+
    '<p><button onclick="' + actionName +'()">' + actionName + '</button></p>'+
    '<table width="1000" border="0" cellspacing="0" cellpadding="10" ">' 

    var files = fs.readdirSync('games/mygames/')

    var id = 0
    for(var i in files)
    { 
      var gameIdx = files[i].split(segX)[0]
      var gameName = files[i].substring(files[i].split(segX)[0].length+1) 
      if (gameIdx.search(/[0-9]+/)<0 || !gameName) continue

      id = id + 1
      html = html + '<tr>'
      var h = '<input id=' + id + ' type="checkbox" value =' + files[i] + ' />'+gameIdx+'_'+gameName
       
      html = html +  '<td>' + h + '</td>'
      html = html + '</tr>'

    }
    
    html = html + '</table></body></html>' 

    return html
}


function getPathsWithRequire(requirePathPrefix, jsPath)
{ 

  //console.log('start',jsPath)
  var pathArray = []
  if(path.basename(jsPath)[0] == '.')
    return pathArray

  var jsPathX
  for(var i in requirePathPrefix)
  { 
    var p = requirePathPrefix[i] + '/' + jsPath
    if( fs.existsSync(p) )
    {
        jsPathX = p
        if(fs.statSync(p).isDirectory()) 
        { 
            var files = fs.readdirSync(p)
            files.forEach(function(item) 
            {  
                pathArray = pathArray.concat(getPathsWithRequire(requirePathPrefix, jsPath + '/' + item  ))
            }) 
        }
        else
        {   
            if(path.extname(p) == '.js')
            {
                var jsCode = fs.readFileSync(p).toString()

                jsCode.replace(/[^\w\/ ]require\(([^\)]+)\)/g, function(word,a)
                { 
                  a = a.replace(/[^\w\.\/]/g, '')
                  pathArray = pathArray.concat(getPathsWithRequire(requirePathPrefix, a))
                })
            }
        }
      break
    }
  }

  if(jsPathX&&!fs.statSync(jsPathX).isDirectory())
  {
    pathArray[pathArray.length] = jsPathX
    //console.log('end',jsPathX)
  }


  //清除已包含过的 
  for(var i=0;;i++)
  {
    if(!pathArray[i])
      break
    for(var j=pathArray.length;j>i;j--)
    { 
      if(!pathArray[j])
        continue
      if(pathArray[i] == pathArray[j])
      {
        pathArray.splice(j,1)
      }
    }
  }
  return pathArray

}


function getResPath2Md5Map(resPath, gameName)
{
    var resPath2Md5Map = {}

    var publicResPathTxt = fs.readFileSync(process.cwd() + '/public/src/publicResPath.js').toString()
    eval(publicResPathTxt)

    for(var i in resp_p)
    {
      var p = resp_p[i]
      var md5 = hex_md5(fs.readFileSync(resPath + p).toString())
      resPath2Md5Map[p] = md5
    }

    //////
    var cResPathTxt = fs.readFileSync('games/mygames/' + gameName + '/src/main/cResPath.js').toString()
    eval(cResPathTxt)

    for(var i in resp_c)
    {
      var p = resp_c[i]
      var md5 = hex_md5(fs.readFileSync(resPath + p).toString())
      resPath2Md5Map[p] = md5
    }

    //////
    var gameResPathTxt = fs.readFileSync('games/mygames/' + gameName + '/src/main/gameResPath.js').toString()
    eval(gameResPathTxt)

    for(var i in resp)
    {
      var p = resp[i]
      var md5 = hex_md5(fs.readFileSync(resPath + p).toString())
      resPath2Md5Map[p] = md5
    }


    return resPath2Md5Map

}


//获得jspath数组 和 respath
function dealComponentList(gameName)
{
    var pathArray = []
    var resp_c = {}

    var componentListTxt = fs.readFileSync('games/mygames/' + gameName + '/componentList.js').toString()
    eval(componentListTxt)
    for(var i in componentList)
    {
      var component = componentList[i]
      pathArray[pathArray.length] = 'games/components/' + component + '/' + component + '.js'
      var resp = 'components/' + component + '/res'

      if(fs.existsSync('games/' + resp) )
      {
        var files = fs.readdirSync('games/' + resp)
        for(var i in files)
        { 
          if(fs.statSync('games/' + resp + '/' + files[i]).isDirectory()) 
            continue
          if(files[i][0] == '.' || files[i] == 'fileLookup.plist') 
            continue
           
          var name = component+files[i].replace('.', '')
          resp_c[name] = resp + '/' + files[i]
        }
      }

    }

    pathArray[pathArray.length] = 'games/mygames/' + gameName + '/componentList.js'
    return [pathArray, resp_c]
}

this.stressTesting = function(res) 
{ 
    var body = '<html>'+
    '<head>'+
    '<meta http-equiv="Content-Type" '+
    'content="text/html; charset=UTF-8" />'+
    // '<script src="/javascripts/stressTestBase.js"></script>'+ 
    '<script src="/javascripts/stressTest.js"></script>'+ 
    '<link rel="stylesheet" href="/stylesheets/style.css" />'+
    '</head>'+
    '<body>'+
    '<p><a href="/">首页</a></p>'+
    // '<p><a href="javascript:void(0)" onclick="refresh()">刷新</a></p>'+
    '<label id="testReport"></label>'+

    '<HR align=left width="420px" color=#000000 SIZE=1>'+
    '<table border="0" cellspacing="1" cellpadding="1">'+
    '<tr>'+
    '  <td>创建房间:</td>'+
    '  <td></td>'+
    '  <td></td>'+
    '  <td><button style="width:80px;float:right" onclick="createRoom()">开始测试</button></td>'+
    '</tr>'+
    '<tr>'+
    '  <td>是否断开：<input id=isCloseSocket1 type="checkbox" checked="true"/></td>'+
    '</tr>'+
    '<tr>'+
    '  <td>创建者起始id:</td>'+
    '  <td><input type="text" id= 1 style="width:100px;" value=1 onfocus="if(value==1){value=\'\'}" onblur="if(value==\'\'){value=1}"/></td>'+
    '  <td>创建者结束id:</td>'+
    '  <td><input type="text" id= 2 style="width:100px;" value=2000 onfocus="if(value==2000){value=\'\'}" onblur="if(value==\'\'){value=2000}"/></td>'+
    '</tr>'+
    '<tr>'+
    '  <td>发送间隔:</td>'+
    '  <td><input type="text" id= 3 style="width:100px;" value="0" onfocus="if(value==\'0\'){value=\'\'}" onblur="if(value==\'\'){value=\'0\'}" /></td>'+
    '  <td>超时时间:</td>'+
    '  <td><input type="text" id= 4 style="width:100px;" value="1000000" onfocus="if(value==\'1000000\'){value=\'\'}" onblur="if(value==\'\'){value=\'1000000\'}"/></td>'+
    '</tr>'+
    '</table>'+


    '<HR align=left width="420px" color=#000000 SIZE=1>'+
    '<table border="0" cellspacing="1" cellpadding="1">'+
    '<tr>'+
    '  <td>充满房间:</td>'+
    '  <td></td>'+
    '  <td></td>'+
    '  <td><button style="width:80px;float:right" onclick="fillRoom()">开始测试</button></td>'+
    '</tr>'+
    '<tr>'+
    '  <td>是否断开：<input id=isCloseSocket2 type="checkbox"/></td>'+
    '</tr>'+
    '<tr>'+
    '  <td>创建者起始id:</td>'+
    '  <td><input type="text" id= 5 style="width:100px;" value=1 onfocus="if(value==1){value=\'\'}" onblur="if(value==\'\'){value=1}"/></td>'+
    '  <td>创建者结束id:</td>'+
    '  <td><input type="text" id= 6 style="width:100px;" value=2000 onfocus="if(value==2000){value=\'\'}" onblur="if(value==\'\'){value=2000}"/></td>'+
    '</tr>'+
    '<tr>'+
    '  <td>发送间隔:</td>'+
    '  <td><input type="text" id= 7 style="width:100px;" value="0" onfocus="if(value==\'0\'){value=\'\'}" onblur="if(value==\'\'){value=\'0\'}" /></td>'+
    '  <td>超时时间:</td>'+
    '  <td><input type="text" id= 8 style="width:100px;" value="1000000" onfocus="if(value==\'1000000\'){value=\'\'}" onblur="if(value==\'\'){value=\'1000000\'}"/></td>'+
    '</tr>'+
    '</table>'+


    '<HR align=left width="420px" color=#000000 SIZE=1>'+
    '<table border="0" cellspacing="1" cellpadding="1">'+
    '<tr>'+
    '  <td>开始游戏:</td>'+
    '  <td></td>'+
    '  <td></td>'+
    '  <td><button style="width:80px;float:right" onclick="startGame()">开始测试</button></td>'+
    '</tr>'+
    '<tr>'+
    '  <td>是否断开：<input id=isCloseSocket3 type="checkbox"/></td>'+
    '</tr>'+
    '<tr>'+
    '  <td>创建者起始id:</td>'+
    '  <td><input type="text" id= 9 style="width:100px;" value=1 onfocus="if(value==1){value=\'\'}" onblur="if(value==\'\'){value=1}"/></td>'+
    '  <td>创建者结束id:</td>'+
    '  <td><input type="text" id= 10 style="width:100px;" value=2000 onfocus="if(value==2000){value=\'\'}" onblur="if(value==\'\'){value=2000}"/></td>'+
    '</tr>'+
    '<tr>'+
    '  <td>发送间隔:</td>'+
    '  <td><input type="text" id= 11 style="width:100px;" value="0" onfocus="if(value==\'0\'){value=\'\'}" onblur="if(value==\'\'){value=\'0\'}" /></td>'+
    '  <td>超时时间:</td>'+
    '  <td><input type="text" id= 12 style="width:100px;" value="1000000" onfocus="if(value==\'1000000\'){value=\'\'}" onblur="if(value==\'\'){value=\'1000000\'}"/></td>'+
    '</tr>'+
    '</table>'+


    '<HR align=left width="420px" color=#000000 SIZE=1>'+
    '<table border="0" cellspacing="1" cellpadding="1">'+
    '<tr>'+
    '  <td>循环游戏:</td>'+
    '  <td></td>'+
    '  <td></td>'+
    '  <td><button style="width:80px;float:right" onclick="playGame()">开始测试</button></td>'+
    '</tr>'+
    '<tr>'+
    '  <td>是否断开：<input id=isCloseSocket4 type="checkbox"/></td>'+
    '</tr>'+
    '<tr>'+
    '  <td>创建者起始id:</td>'+
    '  <td><input type="text" id= 13 style="width:100px;" value=1 onfocus="if(value==1){value=\'\'}" onblur="if(value==\'\'){value=1}"/></td>'+
    '  <td>创建者结束id:</td>'+
    '  <td><input type="text" id= 14 style="width:100px;" value=2000 onfocus="if(value==2000){value=\'\'}" onblur="if(value==\'\'){value=2000}"/></td>'+
    '</tr>'+
    '<tr>'+
    '  <td>发送间隔:</td>'+
    '  <td><input type="text" id= 15 style="width:100px;" value="0" onfocus="if(value==\'0\'){value=\'\'}" onblur="if(value==\'\'){value=\'0\'}" /></td>'+
    '  <td>超时时间:</td>'+
    '  <td><input type="text" id= 16 style="width:100px;" value="1000000" onfocus="if(value==\'1000000\'){value=\'\'}" onblur="if(value==\'\'){value=\'1000000\'}"/></td>'+
    '</tr>'+

    '<tr>'+
    '  <td>参与人数:</td>'+
    '  <td><input type="text" id= 17 style="width:100px;" value="8" onfocus="if(value==\'8\'){value=\'\'}" onblur="if(value==\'\'){value=\'8\'}" /></td>'+
    '</tr>'+

    '</table>'+
    '<HR align=left width="420px" color=#000000 SIZE=1>'+


    '<br><button onclick="restartServer()" style="position:absolute;left:400px">重启服务器</button>'+

    '<label id="tableKeyWithUid"></label>'+
    '</body>'+
    '</html>'

    res.writeHead(200, {"Content-Type": "text/html"})
    res.write(body)
    res.end()
}


this.virtualUserEnter = function(req, res) 
{
    var queryUrl = url.parse(req.url).query 
    var query = qs.parse(queryUrl)
    var uid = query.uid

    var body = '<html>'+
    '<head>'+
    '<meta http-equiv="Content-Type" '+
    'content="text/html; charset=UTF-8" />'+
    '<script src="/javascripts/stressTestBase.js"></script>'+ 
    '<script src="/javascripts/startAInstance2.js"></script>'+ 
    '</head>'+
    '<body>'+
    '<script type="text/javascript">'+
    '  startAInstance(' + uid + ', 3000, 1, true)'+
    '</script>'+
    '</body>'+
    '</html>'

    res.writeHead(200, {"Content-Type": "text/html"})
    res.write(body)
    res.end()


}

this.getSearchFile = function(res) 
{ 
    var body = '<html>'+
    '<head>'+
    '<meta http-equiv="Content-Type" '+
    'content="text/html; charset=UTF-8" />'+
    '<script src="/javascripts/headScripts.js"></script>'+ 
    '<link rel="stylesheet" href="/stylesheets/style.css" />'+
    '</head>'+
    '<body>'+
    '<p><a href="/">首页</a></p>'+
    // '<p><a href="javascript:void(0)" onclick="refresh()">刷新</a></p>'+
    '<label id="testReport"></label>'+

    '<HR align=left width="420px" color=#000000 SIZE=1>'+
    '<table border="0" cellspacing="1" cellpadding="1" style="width:425px;">'+
    '<tr>'+
    '  <td>MD5:</td>'+
    '  <td><input type="text" id= 1 style="width:200px;" value=""/></td>'+
    '  <td></td>'+
    '  <td></td>'+
    '  <td><button style="width:80px;float:right" onclick="searchFile()">搜索</button></td>'+
    '</tr>'+

    '</body>'+
    '</html>'

    res.writeHead(200, {"Content-Type": "text/html"})
    res.write(body)
    res.end()
}


 


this.postSearchFile = function(req, res) 
{
    var queryUrl = url.parse(req.url).query 
    var query = qs.parse(queryUrl)
    var md5 = query.md5

    var call = function(path)
    {
        var md5t = hex_md5(fs.readFileSync(path).toString())
        return md5t == md5?path:false
    }
    var r = searchOneFile('tools/public/searchFile', call)

    if(r)
      res.write(r)
    else
      res.write('none')
    res.end()
}




this.getCreateGameModel = function(res) 
{


// 做成超链接 点击跳转填参数 填好后再生成






//     var html =
//     '<head>'+
//     '<meta http-equiv="Content-Type" '+
//     'content="text/html; charset=UTF-8" />'+
//     '<script src="/javascripts/headScripts.js"></script>'+ 
//     '<link rel="stylesheet" href="/stylesheets/style.css" />'+
//     '</head>'+
//     '<body>'+
//     '<p><a href="/">首页</a></p>'+
//     '<p><button onclick="createGameModel()"> 创建 </button></p>'+
//     '<table width="1000" border="0" cellspacing="0" cellpadding="10" ">' 


  
  
  
  




//     var files = fs.readdirSync('games/')

//     var id = 0
//     for(var i in files)
//     { 
//       var gameIdx = files[i].split(segX)[0]
//       var gameName = files[i].split(segX)[1]
//       if (gameIdx.search(/[0-9]+/)<0) continue

//       id = id + 1
//       html = html + '<tr>'
//       var h = '<input id=' + id + ' type="checkbox" value =' + files[i] + ' />'+gameName
       
//       html = html +  '<td>' + h + '</td>'
//       html = html + '</tr>'

//     }
    
//     html = html + '</table></body></html>' 

//     res.writeHead(200, {"Content-Type": "text/html"})
//     res.write(html)
//     res.end()
}

