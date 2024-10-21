


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
    name:'sidaier',
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
                return {name:this.name, id:this.id, typeIdx:typeIdx, typeLevel:this.typeLevel, typeScores:typeScores,typeKind:this.typeKind}
        }
        else 
        {
            var minCardNum = typeScores-1 + this.minCardNum
            var maxCardNum = minCardNum + len - 1
            if(minCardNum >= this.minCardNum && maxCardNum <= this.maxCardNum)
                return {name:this.name, id:this.id, typeIdx:typeIdx, typeLevel:this.typeLevel, typeScores:typeScores,typeKind:this.typeKind}
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
              return {name:this.name, id:this.id, cardDatas:cardDatas, typeIdx:typeIdx, typeLevel:this.typeLevel, typeScores:typeScores,typeKind:this.typeKind} 
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
c1.name = 'sidaier'
var c2 = clone(cardType)
c2.id = 102
c2.type = 1
c2.name = 'sidailiangdui'


// var endCardType = 
// {
//     id:2,
//     name:'duizi',
//     getType:function(typeScores)
//     {
//         return false
//     },
//     parser:function(c_sortedCardDatasExcludeLazi, c_sortedCardDatasOfLaizi)
//     {
//         var cardSprs = playNode.handCards4D[0]
//         var iaAollowOut = true

//         var l = c_sortedCardDatasExcludeLazi.length + c_sortedCardDatasOfLaizi.length

//         //手里牌剩两张或者多余两张
//         //并且打出的牌只包含癞子牌
//         //打出的是两张牌
//         //

//         if(l %2 == 0 && cardSprs != null && c_sortedCardDatasExcludeLazi.length == 0)
//         {
//             var type = 0

//             var typeScore = c_sortedCardDatasOfLaizi[0] == 79?15:14
//             var typeIdx = 301
//             var typeLevel = 1
//             var typeKind = 2

//             if(c_sortedCardDatasOfLaizi[0] != c_sortedCardDatasOfLaizi[1])
//                 type = 1

//             if(cardSprs.length == 2 || iaAollowOut && type == 1 )
//             {

//                 return {name:this.name, id:this.id,cardDatas:c_sortedCardDatasOfLaizi,
//                     typeIdx:typeIdx,
//                     typeLevel:typeLevel ,
//                     typeScores:typeScore,
//                     typeKind:typeKind
//                 } 
//             }
//             else if(cardSprs.length > 2 && type == 0)
//             {
//                 return{name:this.name, id:this.id,cardDatas:c_sortedCardDatasOfLaizi,
//                     typeIdx:typeIdx, 
//                     typeLevel:typeLevel, 
//                     typeScores:typeScore,
//                     typeKind:typeKind
//                 }
                
//             }

//         }

//         return false
//     },
//     getCardDatasIfHas:function(c_sortedCardDatasExcludeLazi, c_sortedCardDatasOfLaizi, typeScores)
//     {
//         return false
//     }
// }


//typeScores  牌型下可以比较的最小的牌
//typeLevel 牌型等级 比如 4炸可以压 4炸等级下的单张对子。。
//typeIdx  牌型索引 为0时构不成牌型 同一Kind下的顺子长度不同也无法比较
//typeKind 区分同一等级里面的不同牌型 例:单张Kind = 1 对子Kind = 2 不同Kind之间是无法比较的
endCardType = 
{
    typeLevel:1,
    typeKind:2,
    typeIdx:300,
    id:2,
    name:'duizi',//单张score=num2Scores 顺子score=顺子最小单牌-minCardNum+1
    minLen:1,
    maxLen:1,
    minCardNum:14,
    maxCardNum:15,//顺子时 A的cardNum作为14
    getType:function(typeScores, typeIdx)
    {
        var len = typeIdx - this.typeIdx
        if(len > this.maxLen || len < this.minLen)
            return false
        if(len==1) 
        {
            var cardNum = gameLogic.scores2Num(typeScores)
            if(cardNum && cardNum>=this.minCardNum && cardNum<=this.maxCardNum)
                return {name:this.name, id:this.id, typeIdx:typeIdx, typeLevel:this.typeLevel, typeScores:typeScores,typeKind:this.typeKind}
        }
        else 
        {
            var minCardNum = typeScores-1 + this.minCardNum
            var maxCardNum = minCardNum + len - 1
            if(minCardNum >= this.minCardNum && maxCardNum <= this.maxCardNum)
                return {name:this.name, id:this.id, typeIdx:typeIdx, typeLevel:this.typeLevel, typeScores:typeScores,typeKind:this.typeKind}
        }
        return false
    },
    parser:function(c_sortedCardDatasExcludeLazi, c_sortedCardDatasOfLaizi)
    {   
        var l = c_sortedCardDatasExcludeLazi.length + c_sortedCardDatasOfLaizi.length
        if(l%2!=0 || playNode.handCards4D[0] == null)
            return false

        if(c_sortedCardDatasExcludeLazi.length != 0)
            return false

        var isAllowOut = c_sortedCardDatasOfLaizi[0] != c_sortedCardDatasOfLaizi[1] && cmdBaseWorker.cbOutUserHandCount != 2
        

        if(isAllowOut )
            return false

        var len = l/2
        var typeIdx = len + this.typeIdx //1
      //  console.log("liangzhang")
        for(var typeScores=15;typeScores>=0;typeScores--)
        {
            if(!this.getType(typeScores, typeIdx))
                continue

            var cardDatas = this.getCardDatasIfHas(c_sortedCardDatasExcludeLazi, c_sortedCardDatasOfLaizi, typeScores, typeIdx)
            if( cardDatas && cardDatas.length == l )
              return {name:this.name, id:this.id, cardDatas:cardDatas, typeIdx:typeIdx, typeLevel:this.typeLevel, typeScores:typeScores,typeKind:this.typeKind} 
        }
        return false
    }, 
    getCardDatasIfHas:function(c_sortedCardDatasExcludeLazi, c_sortedCardDatasOfLaizi, typeScores, typeIdx)
    {
        var len = typeIdx - this.typeIdx
        if(len==1)
        {
            var num = gameLogic.scores2Num(typeScores)
            var someCardNums_sorted = [num, num]
        }
        else
        {
            var minCardNum = typeScores-1 + this.minCardNum
            var someCardNums_sorted = cardLogic.sortWithNum( gameLogic.getContinueCardNums(minCardNum, len, 2) )
        }
        
        var cardDatas = gameLogic.isHas(c_sortedCardDatasExcludeLazi, c_sortedCardDatasOfLaizi, someCardNums_sorted)[0]
        
        if(!cardDatas)
            return false

        if(cardLogic.getNum(cardDatas[cardDatas.length-1]) == 13 && 
            cardLogic.getNum(cardDatas[0]) == 1)
        {
            var s = cardDatas.splice(0, 2)
            cardDatas = cardDatas.concat(s)
        }

        cardDatas.reverse()
        return cardDatas
    }
}


var c3 = clone(endCardType)

//id : 相同牌的最大张数
//minlen : 允许出的牌最小张数    
//maxlen : 允许出的牌最大张数
//minCardNum : 15张牌里能出的牌(最小数量)
//maxCardNum : 15张牌里能出的牌(最大数量)
//type : 带的是对子还是单张 
//name : 牌型名字
gameLogic.initCardsParser(
[ 
    [
        {id:1, minLen:1, maxLen:1, minCardNum:1, maxCardNum:15, name:'danzhang'},
        {id:1, name:'shunzi'},
        {id:2, minLen:1, maxLen:1, minCardNum:1, maxCardNum:13, name:'duizi'},
        {id:2, minLen:3, name:'liandui'},
        {id:3, minLen:1, maxLen:1, minCardNum:1, maxCardNum:13, type:0, name:'sange'},
        //{id:3, minLen:1, maxLen:1, minCardNum:1, maxCardNum:13, type:1, name:'sandaiyi'},
       // {id:3, minLen:1, maxLen:1, minCardNum:1, maxCardNum:13, type:2, name:'sandaiyidui'},
        //{id:3, type:0, name:'feiji'},
        //{id:3, type:1, name:'feiji'},
        //{id:3, type:2, name:'feiji'},
      //  c1,
       // c2,
        c3,
    ], 
    [
        {id:4, name:'zhadan'},
    ], 
    [
        {id:4, length: 5, name:'zhadan'},
    ], 
    [
        {id:4, length: 6, name:'zhadan'},
    ], 
    [
        {id:4, length: 7, name:'zhadan'},
    ], 
    [
        {id:4, length: 8, name:'zhadan'},
    ], 
    [
        {id:4, length: 9, type:2, name:'zhadan'},
    ], 
    [
        {id:4, length: 10, type:2, name:'zhadan'},
    ], 
    [
        {id:4, length: 11, type:2, name:'zhadan'},
    ],
    [
        {id:4, length: 12, type:2, name:'zhadan'},
    ],
    [
        {id:5, type:1, name:'wangzha'},
    ], 
])

