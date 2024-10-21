

var cardLogic = {}
//color:0 1 2 3 方块梅花红桃黑桃  
//num:1-13   
cardLogic.getColor = function(cardData) 
{
    return Math.floor(cardData/16) 
}

cardLogic.getNum = function(cardData) 
{
    return cardData%16
}

cardLogic.getCardData = function(num, color) 
{
    var cardData = color*16 + num
    return cardData
}
///////////////
cardLogic.sortWithNum = function(cardDatas)
{
    cardDatas.sort(function(a,b)
    {   
        if(cardLogic.getNum(a) == cardLogic.getNum(b))
            return a - b
        else
            return cardLogic.getNum(a) - cardLogic.getNum(b)
    })

    return cardDatas
}