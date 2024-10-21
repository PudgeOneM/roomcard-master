
var gameLogic_majiang = {
    resp:'components/gameLogic_majiang/res/',
}

var gameLogic = gameLogic_majiang

gameLogic.sortHandIdxs = function(idxs)
{
    return majiangLogic.sortWithIdx(idxs)
}

gameLogic.getSoundName = function(idx) 
{
    return idx
}



gameLogic.getActionSoundName = function(WIK, num) 
{ 
	num = num || 1
    var name = typeof(WIK)=='number'?majiangLogic.wik2Name(WIK):WIK
    return name + (Math.ceil(Math.random()*10))%num        
}
