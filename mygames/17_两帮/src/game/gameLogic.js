


gameLogic.getTipsArrayForFirstOut = function(cardDatas)
{
    var cardsType = {typeLevel:0, typeScores:0, typeKind:0}
    var tipsArray =  gameLogic.getTipsArray(cardsType, cardLogic.sortWithNum(cardDatas), cmdBaseWorker.cbMagicCardData)

    return tipsArray
}

gameLogic.num2Scores  = 
[
    0,
    12,
    13,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    14,
    15
]

//四代2
var cardType = 
{
    id:101,
    name:'四带二',
    minLen:1,
    maxLen:1,
    minCardNum:1,
    maxCardNum:13,//顺子时 A的cardNum作为14
    type:0,//0带2单 1带2对
    getType:function(typeScores, typeIdx)
    {
        var len = typeIdx - this.typeIdx
        if(len > this.maxLen || len < this.minLen)
            return false
        if(len==1)
        {
            var cardNum = gameLogic.scores2Num(typeScores)
            if(cardNum && cardNum>=this.minCardNum && cardNum<=this.maxCardNum)
                return {id:this.id, typeIdx:typeIdx, typeLevel:this.typeLevel, typeScores:typeScores,typeKind:this.typeKind}
        }
        else 
        {
            var minCardNum = typeScores-1 + this.minCardNum
            var maxCardNum = minCardNum + len - 1
            if(minCardNum >= this.minCardNum && maxCardNum <= this.maxCardNum)
                return {id:this.id, typeIdx:typeIdx, typeLevel:this.typeLevel, typeScores:typeScores,typeKind:this.typeKind}
        }
        return false
    },
    parser:function(c_sortedCardDatasExcludeLazi, c_sortedCardDatasOfLaizi)
    {
        var l = c_sortedCardDatasExcludeLazi.length + c_sortedCardDatasOfLaizi.length
        var n 
        switch(this.type)
        {
            case 0:
            {
                n = 6
                break
            }
            case 1:
            {
                n = 8
                break
            }
        }

        if(l%n!=0)
            return false

        var len = l/n
        var typeIdx = len + this.typeIdx

        for(var typeScores=15;typeScores>=0;typeScores--)
        {
            if(!this.getType(typeScores, typeIdx))
                continue
            var cardDatas = this.getCardDatasIfHas(c_sortedCardDatasExcludeLazi, c_sortedCardDatasOfLaizi, typeScores, typeIdx)
            if( cardDatas && cardDatas.length == l )
              return {id:this.id, cardDatas:cardDatas, typeIdx:typeIdx, typeLevel:this.typeLevel, typeScores:typeScores,typeKind:this.typeKind} 
        }
        return false
    }, 
    getCardDatasIfHas:function(c_sortedCardDatasExcludeLazi, c_sortedCardDatasOfLaizi, typeScores, typeIdx)
    {           
        var len = typeIdx - this.typeIdx
        if(len==1)
        {   
            var num = gameLogic.scores2Num(typeScores)
            var minCardNum = num
            var maxCardNum = num
            var someCardNums_sorted = [num, num, num, num]
        }
        else
        {   
            //不做连顺
            // var minCardNum = typeScores-1 + this.minCardNum
            // var maxCardNum = minCardNum + len - 1
            // var someCardNums_sorted = cardLogic.sortWithNum( cardLogic.getContinueCardNums(minCardNum, len, 3) )
        }
        var isHas = gameLogic.isHas(c_sortedCardDatasExcludeLazi, c_sortedCardDatasOfLaizi, someCardNums_sorted)
        var san = isHas[0]
        
        if(!san)
            return false

        //不做连顺
        // if(cardLogic.getNum(san[san.length-1]) == 13 && 
        //     cardLogic.getNum(san[0]) == 1)
        // {
        //     var s = san.splice(0, 3)
        //     san = san.concat(s)
        // }
        san = san.reverse()

        // if(this.type == 0)
        //     return san

        var remained = isHas[1]
        var sortedCardDatasExcludeLazi_remain = remained[0]
        var sortedCardDatasOfLaizi_remain = remained[1]

        var yi = []

        switch(this.type)
        {
            case 0:
            {
                for(var typeScores=15;typeScores>0;typeScores--)
                {
                    for(;;)
                    {
                        var num = gameLogic.scores2Num(typeScores)
                        var someCardNums_sorted = [num]
                        var isHas = gameLogic.isHas(sortedCardDatasExcludeLazi_remain, sortedCardDatasOfLaizi_remain, someCardNums_sorted)
                        var cardDatas = isHas[0]
                        var bool = cardDatas && ( cardLogic.getNum(cardDatas[0])<minCardNum || cardLogic.getNum(cardDatas[0])>maxCardNum )
                        bool = bool && !(cardLogic.getNum(cardDatas[0]) == 1 && maxCardNum == 14)
                        if( bool )
                        {
                            yi[yi.length] = cardDatas
                            sortedCardDatasExcludeLazi_remain = isHas[1][0]
                            sortedCardDatasOfLaizi_remain = isHas[1][1]
                        }
                        else
                            break
                    }
                }
                yi = yi.reverse()
                break
            }
            case 1:
            {
                for(var typeScores=1;typeScores<14;typeScores++)
                {
                    var num = gameLogic.scores2Num(typeScores)
                    var someCardNums_sorted = [num, num]
                    var isHas = gameLogic.isHas(sortedCardDatasExcludeLazi_remain, sortedCardDatasOfLaizi_remain, someCardNums_sorted)
                    var cardDatas = isHas[0]
                    var bool = cardDatas && ( cardLogic.getNum(cardDatas[0])<minCardNum || cardLogic.getNum(cardDatas[0])>maxCardNum )
                    bool = bool && !(cardLogic.getNum(cardDatas[0]) == 1 && maxCardNum == 14)
                    if( bool )
                    {
                        yi[yi.length] = cardDatas
                        sortedCardDatasExcludeLazi_remain = isHas[1][0]
                        sortedCardDatasOfLaizi_remain = isHas[1][1]
                    }
                }
                break
            }
        }

        if(yi.length<len*2)
            return false

        var y = []
        for(var i=0;i<len*2;i++)
        {
            y = y.concat(yi[i])
        }

        y = y.reverse()
        var cardDatas = san.concat(y)
        
        return cardDatas
    }
}

var c1 = clone(cardType)
var c2 = clone(cardType)
c2.type = 1

// gameLogic.initCardsParser(
// [ 
//     [
//         {id:1, minLen:1, maxLen:1, minCardNum:1, maxCardNum:15},
//         {id:1},
//         {id:2, minLen:1, maxLen:1, minCardNum:1, maxCardNum:13},
//         {id:2, minLen:3},
//         {id:3, minLen:1, maxLen:1, minCardNum:1, maxCardNum:13, type:0},
//         {id:3, minLen:1, maxLen:1, minCardNum:1, maxCardNum:13, type:1},
//         {id:3, minLen:1, maxLen:1, minCardNum:1, maxCardNum:13, type:2},
//         {id:3, type:0},
//         {id:3, type:1},
//         {id:3, type:2},
//         c1,
//         c2,
//     ], 
//     [
//         {id:4},
//     ], 
//     [
//         {id:5},
//     ], 
// ])


gameLogic.initCardsParser(
[ 
    [
        {id:1, minLen:1, maxLen:1, minCardNum:1, maxCardNum:15}, //单张
        {id:2, minLen:1, maxLen:1, minCardNum:1, maxCardNum:13}, //对子
        {id:3, minLen:1, maxLen:1, minCardNum:1, maxCardNum:13},//三张
    ], 
    [
        {id:4, length:4},
    ],
    [
        {id:4, length:5},
    ], 
    [
        {id:4, length:6},
    ], 
    [
        {id:4, length:7},
    ], 
    [
        {id:4, length:8},
    ],  
    [
        {id:5, type:1},
    ], 
])
