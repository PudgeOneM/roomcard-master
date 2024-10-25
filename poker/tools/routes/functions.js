
var fs = require('fs')
var path = require('path')
var uglifyjs = require("uglify-js")
var Terser = require('terser');


//将非stringl类型递归转化为string
xToString = function(obj)
{
    if(typeof(obj) == "string")
        return obj
    else if (typeof(obj) == "boolean")
        if(obj === true)
            return 'true'
        else
            return 'false'
    else if (typeof(obj) == "number")
        return obj
    else if (typeof(obj) == "object")
    {
        if (obj instanceof Array == true)
        {
            var str = ''
            for (var i=0;i<obj.length;i++)
            {    
                if (i==0) 
                {
                    str = str + xToString(obj[i])
                }
                else
                {
                    str = str + ',' + xToString(obj[i])
                }
            }   
            //str = str + ']'
            return str
        }
        else
        {
            return JSON.stringify(obj)  //json对象转换成json对符串 
        }
    }
}


currentTime = function()
{ 
        var now   = new Date();
        var year  = now.getFullYear();       //年
        var month = now.getMonth() + 1;     //月
        var day   = now.getDate();            //日
        var hh    = now.getHours();            //时
        var mm    = now.getMinutes();          //分
        var clock = year + "-";
        if(month < 10)
            clock += "0";
        clock += month + "-";
        if(day < 10)
            clock += "0";
        clock += day + " ";
        if(hh < 10)
            clock += "0";
        clock += hh + ":";
        if (mm < 10) clock += '0'; 
        clock += mm; 
        return(clock); 
} 


clone = function(obj){  
    var o;  
    switch(typeof obj){  
    case 'undefined': break;  
    case 'string'   : o = obj + '';break;  
    case 'number'   : o = obj - 0;break;  
    case 'boolean'  : o = obj;break;  
    case 'object'   :  
        if(obj === null){  
            o = null;  
        }else{  
            if(obj instanceof Array){  
                o = [];  
                for(var i = 0, len = obj.length; i < len; i++){  
                    o.push(clone(obj[i]));  
                }  
            }else{  
                o = {};  
                for(var k in obj){  
                    o[k] = clone(obj[k]);  
                }  
            }  
        }  
        break;  
    default:          
        o = obj;break;  
    }  
    return o;     
}  


mkdirS = process.platform=='win32'?'mkdir ':'mkdir -p '
rmdirS = process.platform=='win32'?'rmdir /s /q ':'rm -rf '

chmod777S = function(path)
{
    return process.platform=='win32'?'cacls ' +  path  + ' /e /t /c /g everyone:F':'chmod -R 777 ' + path
}

// 逻辑符号  正则没有对本身的逻辑运算符
// !!表示取反 
// &&表示并且 
// ||表示或者
// ((  xxxxx  )) 内容块  
// !! && ||属于同级
isMatch_regexp = function(regexpStr, targetStr)
{   
    //匹配最外层的括号内内容
    //parenthesesStr  第一个匹配到的括号内内容 带括号的 
    //如果没有匹配到则将参数字符串返回
    //特别的如果parenthesesRightStr前面有！！需要并入
    function getFirstParenthesesStr(regexpStr)
    {
        var parenthesesStr
        var parenthesesLeftStr
        var parenthesesRightStr

        var searchStartIdx = regexpStr.search(/\(\(/)
        if( searchStartIdx >=0 )
        {   
            var regexpStrOther = regexpStr.substr(searchStartIdx+2)
            var searchEndIdx = searchStartIdx  //searchStartIdx searchEndIdx 间是一段包括括号的 字符串
 
            for(var count=1;count>0;)
            {
                var searchStart1 = regexpStrOther.search(/\(\(/)
                var searchStart2 = regexpStrOther.search(/\)\)/)
                if(searchStart1<searchStart2)
                {
                    count=count+1
                    regexpStrOther = regexpStrOther.substr(searchStart1+2)
                    searchEndIdx = searchEndIdx + searchStart1+2
                }
                else
                {
                    count=count-1
                    regexpStrOther = regexpStrOther.substr(searchStart2+2)
                    searchEndIdx = searchEndIdx + searchStart2+2
                }
            }

            parenthesesRightStr = regexpStr.substr(searchEndIdx+2)
            if(searchStartIdx>=2&&regexpStr.substr(searchStartIdx-2,2) == '!!')
            {
                parenthesesLeftStr = regexpStr.substr(0, searchStartIdx-2)
                parenthesesStr = regexpStr.substr(searchStartIdx-2, searchEndIdx-searchStartIdx+2)
            }
            else
            {
              parenthesesLeftStr = regexpStr.substr(0, searchStartIdx)
              parenthesesStr = regexpStr.substr(searchStartIdx, searchEndIdx-searchStartIdx+2)
            }
        }
        else
        {
            return regexpStr
        }
        //console.log('getFirstParenthesesStr:',parenthesesStr, parenthesesLeftStr, parenthesesRightStr)
        return [parenthesesStr, parenthesesLeftStr, parenthesesRightStr]
    }

    //匹配最后一个前面带 || &&  操作符的regexpStr 连带操作符一起返回 操作符跟在operatorRightStr上
    //如果没有匹配到则将参数字符串返回
    function getLastOperatorRightStr(regexpStr)
    {
        var operatorLefttStr
        var operatorRightStr

        var lastIndex1 = regexpStr.lastIndexOf('&&')
        var lastIndex2 = regexpStr.lastIndexOf('||')

        var lastIndex = lastIndex1>lastIndex2?lastIndex1:lastIndex2

        if(lastIndex>=0)
        {
            operatorLefttStr = regexpStr.substr(0, lastIndex)
            operatorRightStr = regexpStr.substr(lastIndex)
        }
        else
        {
            return regexpStr
        }

        return [operatorLefttStr, operatorRightStr]
    }


    var str = getFirstParenthesesStr(regexpStr)

    //console.log(str, regexpStr)
    if( str != regexpStr) //匹配到括号
    {
        var parenthesesStr = str[0]
        var parenthesesLeftStr = str[1]
        var parenthesesRightStr = str[2]

        var isMatch = true
        //console.log('1111:',parenthesesStr)
        if(parenthesesStr.substr(0,2) == '!!')
        {
           var parenthesesStr = parenthesesStr.substr(4,parenthesesStr.length-6)
           //console.log('22222:',parenthesesStr)

           isMatch = isMatch && !isMatch_regexp(parenthesesStr, targetStr)
        }
        else
        {   
           var parenthesesStr = parenthesesStr.substr(2,parenthesesStr.length-4)
           //console.log('33333:',parenthesesStr)
           isMatch = isMatch && isMatch_regexp(parenthesesStr, targetStr)
        }

        if(parenthesesLeftStr)
        {
            var operator = parenthesesLeftStr.substr(-2)
            if(operator=='||')
            {
                isMatch = isMatch ||  isMatch_regexp( parenthesesLeftStr.substr(0, parenthesesLeftStr.length-2), targetStr )
            }
            else if(operator=='&&')
            {
                isMatch = isMatch &&  isMatch_regexp( parenthesesLeftStr.substr(0, parenthesesLeftStr.length-2), targetStr )
            }
        }

        if(parenthesesRightStr)
        {
            var operator = parenthesesRightStr.substr(0,2)
            //console.log('4444',parenthesesRightStr)
            if(operator=='||')
            {
                var parenthesesRightStr = parenthesesRightStr.substr(2)
                //console.log('5555',parenthesesRightStr)

                isMatch = isMatch ||  isMatch_regexp( parenthesesRightStr, targetStr )
            }
            else if(operator=='&&')
            { 
                var parenthesesRightStr = parenthesesRightStr.substr(2)
                isMatch = isMatch &&  isMatch_regexp( parenthesesRightStr, targetStr )
            }
        }

        return isMatch
    }
    else //没有括号
    {   
        var str = getLastOperatorRightStr(regexpStr)
        if(str != regexpStr)
        {   
            var operatorLefttStr = str[0]
            var operator = str[1].substr(0,2)
            var operatorRightStr = str[1].substr(2)

            if(operator == '||')
            {
                return isMatch_regexp(operatorLefttStr, targetStr) || isMatch_regexp(operatorRightStr, targetStr)

            }
            else if(operator == '&&')
            {
                return isMatch_regexp(operatorLefttStr, targetStr) && isMatch_regexp(operatorRightStr, targetStr)
            }
        }
        else //没有匹配碰到的第一个前面带 || &&  操作符的regexpStr
        {
            if(str.substr(0,2) == '!!')
                return !targetStr.match( new RegExp(str.substr(2)) ) 
            else
                return targetStr.match( new RegExp(str) )
        }
    }

}


walkFiles = function(filePath, floor, handleFile) 
{  
    handleFile(filePath, floor) 
    if(!fs.statSync(filePath).isDirectory()) 
    {
        return 
    }
    floor++  
    var files = fs.readdirSync(filePath)
    files.forEach(function(item) 
    {  
        var tmpPath = filePath + '/' + item  
        if(fs.statSync(tmpPath).isDirectory()) 
        {
            walkFiles(tmpPath, floor, handleFile)
        }
        else
        {
            handleFile(tmpPath, floor)  
        }
    }) 
}

minifyJs = async function(srcPaths, targetPath, isAppend) {
    const jsArray = [];

    srcPaths.forEach(srcPath => {
        if (path.extname(srcPath) === '.js') {
            jsArray.push(path.resolve(srcPath)); // 使用绝对路径
        } else {
            walkFiles(srcPath, 0, handleFile);
        }
    });

    console.log('JS Files to minify:', jsArray);

    function handleFile(filePath) {
        if (path.extname(filePath) === '.js') {
            jsArray.push(path.resolve(filePath)); // 使用绝对路径
        }
    }

    if (jsArray.length === 0) {
        console.error('没有找到要压缩的 JavaScript 文件。');
        return;
    }

    try {
        const minifiedCodes = await Promise.all(jsArray.map(file => minifyWithTerser(file)));
        
        const resultCode = minifiedCodes.join('\n'); // 合并所有压缩后的代码

        if (isAppend) {
            fs.appendFileSync(targetPath, resultCode);
        } else {
            fs.writeFileSync(targetPath, resultCode);
        }
    } catch (error) {
        console.error('处理过程中发生错误:', error);
    }
}

async function minifyWithTerser(file) {
    const code = fs.readFileSync(file, 'utf8');
    const result = await Terser.minify(code);
    if (result.error) {
        throw new Error(`压缩失败: ${result.error.message}`);
    }
    return result.code;
}

/////////////////////////md5 start////////////////////
var hexcase = 0; 
var b64pad  = ""; 
var chrsz   = 8; 

hex_md5 = function(s){ return binl2hex(core_md5(str2binl(s), s.length * chrsz));}
b64_md5 = function(s){ return binl2b64(core_md5(str2binl(s), s.length * chrsz));}
str_md5 = function(s){ return binl2str(core_md5(str2binl(s), s.length * chrsz));}
hex_hmac_md5 = function(key, data) { return binl2hex(core_hmac_md5(key, data)); }
b64_hmac_md5 = function(key, data) { return binl2b64(core_hmac_md5(key, data)); }
str_hmac_md5 = function(key, data) { return binl2str(core_hmac_md5(key, data)); }

function core_md5(x, len)
{
  x[len >> 5] |= 0x80 << ((len) % 32);
  x[(((len + 64) >>> 9) << 4) + 14] = len;

  var a =  1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d =  271733878;

  for(var i = 0; i < x.length; i += 16)
  {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;

    a = md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
    d = md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
    c = md5_ff(c, d, a, b, x[i+ 2], 17,  606105819);
    b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
    a = md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
    d = md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426);
    c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
    b = md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
    a = md5_ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
    d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
    c = md5_ff(c, d, a, b, x[i+10], 17, -42063);
    b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
    a = md5_ff(a, b, c, d, x[i+12], 7 ,  1804603682);
    d = md5_ff(d, a, b, c, x[i+13], 12, -40341101);
    c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
    b = md5_ff(b, c, d, a, x[i+15], 22,  1236535329);

    a = md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
    d = md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
    c = md5_gg(c, d, a, b, x[i+11], 14,  643717713);
    b = md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
    a = md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
    d = md5_gg(d, a, b, c, x[i+10], 9 ,  38016083);
    c = md5_gg(c, d, a, b, x[i+15], 14, -660478335);
    b = md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
    a = md5_gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
    d = md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
    c = md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
    b = md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501);
    a = md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
    d = md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
    c = md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473);
    b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);

    a = md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
    d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
    c = md5_hh(c, d, a, b, x[i+11], 16,  1839030562);
    b = md5_hh(b, c, d, a, x[i+14], 23, -35309556);
    a = md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
    d = md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353);
    c = md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
    b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
    a = md5_hh(a, b, c, d, x[i+13], 4 ,  681279174);
    d = md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
    c = md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
    b = md5_hh(b, c, d, a, x[i+ 6], 23,  76029189);
    a = md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
    d = md5_hh(d, a, b, c, x[i+12], 11, -421815835);
    c = md5_hh(c, d, a, b, x[i+15], 16,  530742520);
    b = md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);

    a = md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
    d = md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415);
    c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
    b = md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
    a = md5_ii(a, b, c, d, x[i+12], 6 ,  1700485571);
    d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
    c = md5_ii(c, d, a, b, x[i+10], 15, -1051523);
    b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
    a = md5_ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
    d = md5_ii(d, a, b, c, x[i+15], 10, -30611744);
    c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
    b = md5_ii(b, c, d, a, x[i+13], 21,  1309151649);
    a = md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
    d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
    c = md5_ii(c, d, a, b, x[i+ 2], 15,  718787259);
    b = md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);

    a = safe_add(a, olda);
    b = safe_add(b, oldb);
    c = safe_add(c, oldc);
    d = safe_add(d, oldd);
  }
  return Array(a, b, c, d);

}

function md5_cmn(q, a, b, x, s, t)
{
  return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s),b);
}
function md5_ff(a, b, c, d, x, s, t)
{
  return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
}
function md5_gg(a, b, c, d, x, s, t)
{
  return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
}
function md5_hh(a, b, c, d, x, s, t)
{
  return md5_cmn(b ^ c ^ d, a, b, x, s, t);
}
function md5_ii(a, b, c, d, x, s, t)
{
  return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
}

function core_hmac_md5(key, data)
{
  var bkey = str2binl(key);
  if(bkey.length > 16) bkey = core_md5(bkey, key.length * chrsz);

  var ipad = Array(16), opad = Array(16);
  for(var i = 0; i < 16; i++)
  {
    ipad[i] = bkey[i] ^ 0x36363636;
    opad[i] = bkey[i] ^ 0x5C5C5C5C;
  }

  var hash = core_md5(ipad.concat(str2binl(data)), 512 + data.length * chrsz);
  return core_md5(opad.concat(hash), 512 + 128);
}

function safe_add(x, y)
{
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}

function bit_rol(num, cnt)
{
  return (num << cnt) | (num >>> (32 - cnt));
}

function str2binl(str)
{
  var bin = Array();
  var mask = (1 << chrsz) - 1;
  for(var i = 0; i < str.length * chrsz; i += chrsz)
    bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (i%32);
  return bin;
}

function binl2str(bin)
{
  var str = "";
  var mask = (1 << chrsz) - 1;
  for(var i = 0; i < bin.length * 32; i += chrsz)
    str += String.fromCharCode((bin[i>>5] >>> (i % 32)) & mask);
  return str;
}

function binl2hex(binarray)
{
  var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
  var str = "";
  for(var i = 0; i < binarray.length * 4; i++)
  {
    str += hex_tab.charAt((binarray[i>>2] >> ((i%4)*8+4)) & 0xF) +
           hex_tab.charAt((binarray[i>>2] >> ((i%4)*8  )) & 0xF);
  }
  return str;
}

function binl2b64(binarray)
{
  var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var str = "";
  for(var i = 0; i < binarray.length * 4; i += 3)
  {
    var triplet = (((binarray[i   >> 2] >> 8 * ( i   %4)) & 0xFF) << 16)
                | (((binarray[i+1 >> 2] >> 8 * ((i+1)%4)) & 0xFF) << 8 )
                |  ((binarray[i+2 >> 2] >> 8 * ((i+2)%4)) & 0xFF);
    for(var j = 0; j < 4; j++)
    {
      if(i * 8 + j * 6 > binarray.length * 32) str += b64pad;
      else str += tab.charAt((triplet >> 6*(3-j)) & 0x3F);
    }
  }
  return str;
}

/////////////////////////md5 end////////////////////

mkdirS = function(p)
{   
    p = p.replace(/\//g, path.sep)
    var cmd = ''
    // if(!fs.existsSync(p) )
    // {   
        cmd = process.platform=='win32'?'mkdir ' + p:'mkdir -p ' + p
    // }

    return cmd
}

rmdirS = function(p)
{   
    p = p.replace(/\//g, path.sep)
    var cmd = process.platform=='win32'?'rmdir /s /q ' + p:'rm -rf ' + p
    return cmd
}

rmfileS = function(p)
{   
    p = p.replace(/\//g, path.sep)
    var cmd = process.platform=='win32'?'del /s /q ' + p:'rm -rf ' + p
    return cmd
}

chmod777S = function(p)
{
    p = p.replace(/\//g, path.sep)
    var cmd = process.platform=='win32'?'cacls ' +  p  + ' /e /t /c /g everyone:F':'chmod -R 777 ' + p
    return cmd
}

linkS = function(sourceDir, targetDir)
{
    sourceDir = sourceDir.replace(/\//g, path.sep)
    targetDir = targetDir.replace(/\//g, path.sep)

    var cmd = process.platform=='win32'?'mklink /D ' + targetDir + ' ' + sourceDir:'ln -s ' + sourceDir + ' ' + targetDir
    return cmd
}

copydirS = function(sourceDir, targetDir)
{
    sourceDir = sourceDir.replace(/\//g, path.sep)
    targetDir = targetDir.replace(/\//g, path.sep)

    var cmd = ( process.platform=='win32'?'xcopy /e /h ':'cp -r ' ) + sourceDir + ' ' + targetDir
    // xcopy "games\mygames\16_东阳四副牌\res\gameRes" "publish\16\res\gameRes" /e /h
    // xcopy "public/res/publicRes" "publish\16\res\publicRes" /e /h

    console.log('Generated command:', cmd);
    return cmd
}

copyfileS = function(sourceDir, targetDir)
{
    sourceDir = sourceDir.replace(/\//g, path.sep)
    targetDir = targetDir.replace(/\//g, path.sep)

    var cmd = ( process.platform=='win32'?'copy /y ':'cp -r ' ) + sourceDir + ' ' + targetDir
    return cmd
}


searchOneFile = function(path, call)
{
    var result = false
    if(fs.statSync(path).isDirectory())
    {
        var files = fs.readdirSync(path)
        files.forEach(function(item) 
        {  
            var r = searchOneFile(path + '/' + item, call)
            if(r)
            {   
                result = r
                return result 
            }
        }) 
    }
    else
        if( call(path) )
            return path

    return result
}

