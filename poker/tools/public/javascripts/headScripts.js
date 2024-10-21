

chooseAll = function()
{	
	for(var i=1;;i++)
	{	
		var checkbox = document.getElementById(i)
		if(!checkbox)
			break
		checkbox.checked = document.getElementById('isAll').checked
	}

}

run = function()
{	
	function req(i)
	{	
		var checkbox = document.getElementById(i)
		httpRequest('POST', '/runGame?gameName=' + checkbox.value,function(ret, data)
		{
			if(ret)
			{
				var idx = checkbox.value.split('_')[0]
				window.open('/poker/runtime/'+idx+'/index.html',i)
			}
		})
	}

	httpRequest('POST', '/runGame',function(ret, data)
	{
		if(ret)
		{
			for(var i=1;;i++)
			{	
				var checkbox = document.getElementById(i)
				if(!checkbox)
					break
				if(checkbox.checked)
					req(i)
			}
			document.write(data)
		}
	})
}

publish = function()
{	
	function req(i)
	{	
		var checkbox = document.getElementById(i)
		httpRequest('POST', '/publishGame?gameName=' + checkbox.value,function(ret, data)
		{
			if(ret)
			{
				var idx = checkbox.value.split('_')[0]
				window.open('/poker/publish/'+idx+'/index.html',i)
			}
		})
	}

	httpRequest('POST', '/publishGame',function(ret, data)
	{
		if(ret)
		{
			for(var i=1;;i++)
			{	
				var checkbox = document.getElementById(i)
				if(!checkbox)
					break
				if(checkbox.checked)
					req(i)
			}
			document.write(data)
		}
	})
}

function httpRequest(type, url, callback)
{
	var xmlhttp
	if (window.XMLHttpRequest)
  		xmlhttp = new XMLHttpRequest()
	else
	  	xmlhttp = new ActiveXObject("Microsoft.XMLHTTP")
	xmlhttp.onreadystatechange = function()
	{
		if(xmlhttp.readyState==4)
		{
			callback?callback(xmlhttp.status==200, xmlhttp.responseText):''
		}
	}

	xmlhttp.open(type,url,true)
	xmlhttp.send()
}


c2js = function()
{	

	var str = document.getElementById('c').value


	str = str.replace(/TEXT\(([^\)]+)\)/g,'$1')

	//转换宏
	str = str.replace(/#define[^\n\S]+(\S+)\(([^\)]+)\)[^\n\S]+\\[^\/]+\/\//g,'function $1\($2\)\n{\n}\n\n\/\/')
	// str = str.replace(/#define[^\n\S]+(\S+)\(([^\)]+)\)[^\n\S]+\\[^\/]+\/\//g,'$1 = function\($2\)\n{\n}\n\n\/\/')
	str = str.replace(/#define[^\n\S]+(\S+[^\n\S]+)(\S+)/g,'var $1 = $2')
	str = str.replace(/#define[^\n\S]+(\S+[^\n\S]+)(\S+)/g,'$1 = $2')



	str = str.replace(/(#include[^\n]*)/g,'\/\/$1')
	str = str.replace(/(#ifdef[^\n]+)/g,'\/\/$1')
	str = str.replace(/(#ifndef[^\n]+)/g,'\/\/$1')
	str = str.replace(/(#else[^\n]*)/g,'\/\/$1')
	str = str.replace(/(#endif[^\n]*)/g,'\/\/$1')
	str = str.replace(/(#pragma[^\n]*)/g,'\/\/$1')

	str = str.replace(/(#define[^\n]*)/g,'\/\/$1')

	//转换结构体
	str = str.replace(/struct[^\n\S]+(\S+)[^\S]*\{([^\}]+)\}\;/g, function(word,a,b)
		{
			var newB = b.replace(/([^\n\S]+)(\S+)[^\n\S]+(\S+);/g, function(word,aa,bb,cc)
			{
				cc = cc.replace(/\]/g,'')
				cc = cc.split('[')
				cc[0] = "'" + cc[0] + "'"
				cc = cc.join(', ')

				return 	aa + '\[' + "'" + bb + "', " + cc + '\],' 
			})

			return 'var ' + a + ' = \n\[' + newB + '\]'
			// return a + ' = \n\[' + newB + '\]'

		})


	//转换结构体继承
	str = str.replace(/struct[^\n\S]+(\S+)[^\S]\:[^\S](\S+)[^\S]*\{([^\}]+)\}\;/g, function(word,a,aa,b)
		{
			var newB = b.replace(/([^\n\S]+)(\S+)[^\n\S]+(\S+);/g, function(word,aa,bb,cc)
			{
				cc = cc.replace(/\]/g,'')
				cc = cc.split('[')
				cc[0] = "'" + cc[0] + "'"
				cc = cc.join(', ')

				return 	aa + '\[' + "'" + bb + "', " + cc + '\],' 
			})

			return 'var ' + a + ' = ' + aa + '\.concat\(\n\[' + newB + '\]\)'
			// return a + ' = \n\[' + newB + '\]'

		})


	//转换c++函数
	str = str.replace(/\n[^\s\/]+[^\n\S]+\S+[^\n\S]+(\w+)\(([^\)]*)\)\s+\{([^\}]+)\}|\n[^\s\/]+[^\n\S]+(\w+)\(([^\)]*)\)\s+\{([^\}]+)\}/g, 
	function(word,a,b,c,d,e,f)
	{
		var funName = a || d
		var params = b || e
		var body = c || f
		body = '\/\*' + body + '\*\/'

		params = params.split(',')
		for(var i in params)
		{	
			var s = params[i].split(' ')
			params[i] = s[s.length-1]
		}
		params = params.join(', ')

		return '\nfunction ' + funName + '\(' + params + '\)' + '\n\{\n' + body + '\n\}'
		// return '\n' + funName + ' = function\(' + params + '\)' + '\n\{\n' + body + '\n\}'
	})


	str = str.replace(/interface[^\n\S]+(\S+)\s*(\{[^\}]+\}\;)/g,'var $1 = \'\'\n\/\*$2\*\/')
	// str = str.replace(/interface[^\n\S]+(\S+)\s*(\{[^\}]+\}\;)/g,'$1 = \'\'\n\/\*$2\*\/')


	str = str.replace(/([^\s\/][^\=\n]+)\=/g, function(word,a)
	{	
		var a = a.split(/\s/)
		var end = a.length - 1
		for(var i=end;i>=0;i--)
		{	
			if(!a[i])
				a.splice(i, 1)
		}
		a = a[a.length-1]
		if(a)
		{
			a = a.split('[')[0]
			return 'var ' + a + ' ='
			// return a + ' ='
		}
		else
			return word
	})

	str = str.replace(/(\=\s*)\{([^\}]+)\}\;/g,'$1\[$2\]')

	str = str.replace(/([0-9]+)L/g,'$1')


	//str = str.replace(/function (\S+)\(/g, '$1 = function\(')

	document.getElementById('js').value = str

}


searchFile = function()
{
	var md5 = document.getElementById(1).value
	httpRequest('POST', '/searchFile?md5=' + md5,function(ret, data)
	{
		if(ret)
		{
			document.getElementById('testReport').innerHTML = data
		}
	})

}

createGameModel = function()
{
	
}
