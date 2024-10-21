

var gameLog = {}
gameLog.logS = ''

gameLog.init = function()
{
	if(cc.game.config[cc.game.CONFIG_KEY.debugMode] == 0)
	{
		cc.log = function(str)
		{
			gameLog.logS = gameLog.logS + str + 'huanhang'
		}

	}
}

gameLog.log = function()
{
	if(cc.sys.isMobile)
	{	
		if(isOpenLogOnMobile)
		{
			for(var i in arguments)
			{	
				var a = arguments[i]
				if(typeof(a) == 'object') 
				{
					a = clone(arguments[i])
		            for(var ii in a)
		                {   
		                    if(typeof(a[ii]) == 'object')
		                        a[ii] = xToString(a[ii], 300)
		                }

				}
				cc.log(xToString(a, null,['"\\\\u0000","\\\\u0000"', '\\\\u0000','null,null,'])) 
			}
		}
	}
	else
	{	
		console.log(arguments)
	}
}

gameLog.warn = function()
{
}


gameLog.error = function()
{
}


gameLog.assert = function(cond, msg)
{
}
