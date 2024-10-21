
var managerTouch = {}

managerTouch.isQuickTouch = function(target, range)
{	
	var nowTime = new Date().getTime()
	range = range || 500

	if(target.lastTouchTime && (nowTime - target.lastTouchTime) < range )
	{
		return true
	}
	else
	{	
		target.lastTouchTime = nowTime
		return false
	}
}


managerTouch.closeTouch = function()
{	
	if(uiController && uiController.topListener)
		uiController.topListener.setSwallowTouches(true)
}

managerTouch.openTouch = function()
{	
	if(uiController && uiController.topListener)
		uiController.topListener.setSwallowTouches(false)
}