managerRespreloadRes = managerRes.preloadRes
managerRes.preloadRes=function(onFinish)
{   
    var w
    if( (gameorientation == 'landscape' && isReversalWinSize) || 
        (gameorientation == 'portrait' && !isReversalWinSize) )
        w = 640
    else
        w = 960
    cc.view.setDesignResolutionSize(w, 0, cc.ResolutionPolicy.FIXED_WIDTH)//固定宽度
    managerRespreloadRes(onFinish)
}

headIconPopgetPop = headIconPop.getPop
headIconPop.getPop=function(dwUserID)
{   
    var node = headIconPopgetPop(dwUserID)
    if(gameorientation == 'portrait')
        node.setScale(0.8)
    else
        node.setScale(0.8)
    return node
}

chairFactorygetOne = chairFactory.getOne
chairFactory.getOne=function(chairNode)
{   
    var chair = chairFactorygetOne(chairNode)
    chair.node.setScale(0.8)
    return chair
}

chairFactory_getUserNodeInsetChair = chairFactory._getUserNodeInsetChair
chairFactory._getUserNodeInsetChair=function(chairNode)
{   
    var userNodeInsetChair = chairFactory_getUserNodeInsetChair()
    userNodeInsetChair.faceNode.setScale(1.25)
    return userNodeInsetChair
}

































