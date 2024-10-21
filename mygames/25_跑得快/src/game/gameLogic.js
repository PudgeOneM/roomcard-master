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

cardLogic.isSameNum = function(idxs)
{
    var is = true
    var cardIdx = idxs[0]
    var candNum = cardLogic.getNum(cardIdx)
    for(var i in idxs)
    {
        if( candNum!= cardLogic.getNum(idxs[i]) )
        {
            is = false
            break
        }
    }
    return is
}

//出牌筛选
gameLogic.filtrateOutCardArray= function(cardArray)
{
    var selfChairId = tableData.getUserWithUserId(selfdwUserID).wChairID
    
    //报警上家必须出最大的）
    var bOutMax = false 
    for ( var i = 0; i < GAME_PLAYER; i++)
    {
        if ( cmdBaseWorker.cbHandCardCount[i] <= WARM_MAX && ( GAME_PLAYER + i - 1 ) % GAME_PLAYER == selfChairId )
        {
            bOutMax = true
            break
        }
    }

    if ( !bOutMax )
        return cardArray;

    var filtrateArray = []
    var bSingle = false
    for ( var i = 0; i < cardArray.length; i++ )
    {
        if ( cardArray[i].length > 1 )
            filtrateArray.push(cardArray[i])
        else 
            bSingle = true
    }

    if ( bSingle )
    {
        var maxCardDatas = []
        var maxCardScore = 0
        for ( var i = 0; i < cmdBaseWorker.cbHandCardCount[selfChairId]; i++ )
        {
            var handCardScore = gameLogic.num2Scores[cardLogic.getNum(cmdBaseWorker.cbHandCardData[selfChairId][i])];
            if ( handCardScore >= maxCardScore )
            {
                if ( handCardScore > maxCardScore )
                    maxCardDatas = []
                
                maxCardDatas.push(cmdBaseWorker.cbHandCardData[selfChairId][i])
                maxCardScore = handCardScore
            }
        }
    
        for ( var i = 0; i < maxCardDatas.length; i++ )
            filtrateArray.push([maxCardDatas[i]])
    }

    return filtrateArray
}

// 就出第一张 对子的话就出前两张 
gameLogic.getTipsArrayForFirstOut = function(handCardIdxs)
{
    var beginIdxs = [handCardIdxs[0]]
    for( var i = 1; i < 5; i++ )
    {
        if(handCardIdxs[i] == 0x33)
            beginIdxs.splice(0, 0, 0x33)
        else if( cardLogic.isSameNum([beginIdxs[0], handCardIdxs[i]] ) )
            beginIdxs[beginIdxs.length] = handCardIdxs[i]
    }

    var tipsArray = []
    for(var i=0;i<beginIdxs.length;i++)
    {
        if(i==0)
            tipsArray[beginIdxs.length-1 - i] = [beginIdxs[i]]
        else
            tipsArray[beginIdxs.length-1 - i] = tipsArray[beginIdxs.length - i].concat([beginIdxs[i]])
    }

    //解决点不下来  
    //getTipsArray点不下来可以不做这个处理 是因为手中确实没有别的打法了
    if(tipsArray.length==1)
        tipsArray = tipsArray.concat(tipsArray)

    for(var i=0;i<tipsArray.length;i++)
    {
        var t = tipsArray[i]
        if(t.length == 3 && handCardIdxs.length!=3)
            tipsArray.splice(i, 1)
    }

    return tipsArray
}

//////////parserConf start//////
var cardType =  
{
    id:3,
    name:'sange', //带0-len*2任意牌
    //三连 带0-len*2任意牌
    parser:function(c_sortedIdx54sExcludeLazi)
    {
        if ( c_sortedIdx54sExcludeLazi.length == 0 )
            return false

        var numsHas3 = []
        for(var i=3;i<15;i++)
        {
            var num = i==14?1:i
            var someCardNums_sorted = [num, num, num]
            var isHas = gameLogic.isHas(c_sortedIdx54sExcludeLazi, [], someCardNums_sorted)
            var idxs = isHas[0]
            if(idxs)
            {
                var remained = isHas[1][0]
                var isHas4 = false
                for(var j=0;j<remained.length;j++)
                {
                    if(cardLogic.isSameNum([num, remained[j]])) 
                    {
                        isHas4 = true
                        break
                    }
                }
                if(!isHas4)
                    numsHas3[numsHas3.length] = i
            }
        }

        if ( numsHas3.length == 0 )
            return false

        var maxContinueLen = 0
        var currentContinueLen = 0
        var currentMaxNum = numsHas3[0]
        var maxNum = numsHas3[0]
        var startNum = numsHas3[0]
        for(var i=0;i<numsHas3.length;i++)
        {   
            if(numsHas3[i] == startNum + 1)
            {
                currentContinueLen += 1
                currentMaxNum = numsHas3[i]
            }
            else
            {
                currentContinueLen = 1
            }

            startNum = numsHas3[i]
        
            if ( currentContinueLen > maxContinueLen )
            {
                maxContinueLen = currentContinueLen;
                maxNum = currentMaxNum;
            }
        }

        if(c_sortedIdx54sExcludeLazi.length<=maxContinueLen*5)
        {
            var san = []
            var yi = []
            for(var i=c_sortedIdx54sExcludeLazi.length-1;i>=0;i--)
            {
                var n = cardLogic.getNum(c_sortedIdx54sExcludeLazi[i])
                n = n < 3 ? n + 13 : n
                if(n<=maxNum && maxNum-n<maxContinueLen)
                    san[san.length] = c_sortedIdx54sExcludeLazi[i]
                else
                    yi[yi.length] = c_sortedIdx54sExcludeLazi[i]
            }

            if ( san.length <= 3 )
                return {id:this.id, cardDatas:san.concat(yi), typeIdx:this.typeIdx, typeLevel:this.typeLevel, typeScores:0,typeKind:this.typeKind,name:'sange'}
            else
                return {id:this.id, cardDatas:san.concat(yi), typeIdx:this.typeIdx, typeLevel:this.typeLevel, typeScores:0,typeKind:this.typeKind,name:'feiji'}
        }

        return false
    }, 
}


// 最后一手有出牌权时能出的牌
// 333、333444、333444555 、333444555666、 333444555666777
// 333+4、3334444+56、333444555+678、333444555666+789j

// 任何时候可以出的牌
// 333+45、333444+5678、333444555+6789jq
gameLogic.initCardsParser(
[ 
    [
        cardType,
        // {id:3, minLen:1, maxLen:1, minCardNum:1, maxCardNum:13},
        // {id:3},
        // {id:3, minLen:1, maxLen:1, minCardNum:1, maxCardNum:13, type:1},//三带1只能作为最后一手出
        // {id:3, type:1},
    ],
    [
        {id:1, minLen:1, maxLen:1, minCardNum:1, maxCardNum:15, name:'danzhang'},
        {id:1, name:'shunzi'},
        {id:2, minLen:1, maxLen:1, minCardNum:1, maxCardNum:13, name:'duizi'},
        {id:2, minLen:2, name:'liandui'},
        {id:3, minLen:1, maxLen:1, minCardNum:1, maxCardNum:13, type:3, name:'sange'},
        {id:3, type:3, name:'feiji'},
    ], 
    [
        {id:4, name:'zhadan'},
    ], 
    [
        {id:5},
    ], 
])

// gameLogic.initCardsParser(
// [ 
//     [
//         {id:1, minLen:1, maxLen:1, minCardNum:1, maxCardNum:15, name:'danzhang'},
//         {id:1, name:'shunzi'},
//         {id:2, minLen:1, maxLen:1, minCardNum:1, maxCardNum:13, name:'duizi'},
//         {id:2, minLen:3, name:'liandui'},
//         {id:3, minLen:1, maxLen:1, minCardNum:1, maxCardNum:13, type:0, name:'sange'},
//         {id:3, minLen:1, maxLen:1, minCardNum:1, maxCardNum:13, type:1, name:'sandaiyi'},
//         {id:3, minLen:1, maxLen:1, minCardNum:1, maxCardNum:13, type:2, name:'sandaiyidui'},
//         {id:3, type:0, name:'feiji'},
//         {id:3, type:1, name:'feiji'},
//         {id:3, type:2, name:'feiji'},
//         c1,
//         c2,
//     ], 
//     [
//         {id:4, type:2, name:'zhadan'},
//     ], 
//     [
//         {id:4, type:1, name:'zhadan'},
//     ], 
//     [
//         {id:4, type:3, name:'zhadan'},
//     ], 
//     [
//         {id:5, name:'wangzha'},
//     ], 
// ])







// //四代2
// var cardType = 
// {
//     id:101,
//     name:'sidaier',
//     minLen:1,
//     maxLen:1,
//     minCardNum:1,
//     maxCardNum:13,//顺子时 A的cardNum作为14
//     type:0,//0带2单 1带2对
//     getType:function(typeScores, typeIdx)
//     {
//         var len = typeIdx - this.typeIdx
//         if(len > this.maxLen || len < this.minLen)
//             return false
//         if(len==1)
//         {
//             var cardNum = gameLogic.scores2Num(typeScores)
//             if(cardNum && cardNum>=this.minCardNum && cardNum<=this.maxCardNum)
//                 return {name:this.name, id:this.id, typeIdx:typeIdx, typeLevel:this.typeLevel, typeScores:typeScores,typeKind:this.typeKind}
//         }
//         else 
//         {
//             var minCardNum = typeScores-1 + this.minCardNum
//             var maxCardNum = minCardNum + len - 1
//             if(minCardNum >= this.minCardNum && maxCardNum <= this.maxCardNum)
//                 return {name:this.name, id:this.id, typeIdx:typeIdx, typeLevel:this.typeLevel, typeScores:typeScores,typeKind:this.typeKind}
//         }
//         return false
//     },
//     parser:function(c_sortedCardDatasExcludeLazi, c_sortedCardDatasOfLaizi)
//     {
//         var l = c_sortedCardDatasExcludeLazi.length + c_sortedCardDatasOfLaizi.length
//         var n 
//         switch(this.type)
//         {
//             case 0:
//             {
//                 n = 6
//                 break
//             }
//             case 1:
//             {
//                 n = 8
//                 break
//             }
//         }

//         if(l%n!=0)
//             return false

//         var len = l/n
//         var typeIdx = len + this.typeIdx

//         for(var typeScores=15;typeScores>=0;typeScores--)
//         {
//             if(!this.getType(typeScores, typeIdx))
//                 continue
//             var cardDatas = this.getCardDatasIfHas(c_sortedCardDatasExcludeLazi, c_sortedCardDatasOfLaizi, typeScores, typeIdx)
//             if( cardDatas && cardDatas.length == l )
//               return {name:this.name, id:this.id, cardDatas:cardDatas, typeIdx:typeIdx, typeLevel:this.typeLevel, typeScores:typeScores,typeKind:this.typeKind} 
//         }
//         return false
//     }, 
//     getCardDatasIfHas:function(c_sortedCardDatasExcludeLazi, c_sortedCardDatasOfLaizi, typeScores, typeIdx)
//     {           
//         var len = typeIdx - this.typeIdx
//         if(len==1)
//         {   
//             var num = gameLogic.scores2Num(typeScores)
//             var minCardNum = num
//             var maxCardNum = num
//             var someCardNums_sorted = [num, num, num, num]
//         }
//         else
//         {   
//             //不做连顺
//             // var minCardNum = typeScores-1 + this.minCardNum
//             // var maxCardNum = minCardNum + len - 1
//             // var someCardNums_sorted = cardLogic.sortWithNum( cardLogic.getContinueCardNums(minCardNum, len, 3) )
//         }
//         var isHas = gameLogic.isHas(c_sortedCardDatasExcludeLazi, c_sortedCardDatasOfLaizi, someCardNums_sorted)
//         var san = isHas[0]
        
//         if(!san)
//             return false

//         //不做连顺
//         // if(cardLogic.getNum(san[san.length-1]) == 13 && 
//         //     cardLogic.getNum(san[0]) == 1)
//         // {
//         //     var s = san.splice(0, 3)
//         //     san = san.concat(s)
//         // }
//         san = san.reverse()

//         // if(this.type == 0)
//         //     return san

//         var remained = isHas[1]
//         var sortedCardDatasExcludeLazi_remain = remained[0]
//         var sortedCardDatasOfLaizi_remain = remained[1]

//         var yi = []

//         switch(this.type)
//         {
//             case 0:
//             {
//                 for(var typeScores=15;typeScores>0;typeScores--)
//                 {
//                     for(;;)
//                     {
//                         var num = gameLogic.scores2Num(typeScores)
//                         var someCardNums_sorted = [num]
//                         var isHas = gameLogic.isHas(sortedCardDatasExcludeLazi_remain, sortedCardDatasOfLaizi_remain, someCardNums_sorted)
//                         var cardDatas = isHas[0]
//                         var bool = cardDatas && ( cardLogic.getNum(cardDatas[0])<minCardNum || cardLogic.getNum(cardDatas[0])>maxCardNum )
//                         bool = bool && !(cardLogic.getNum(cardDatas[0]) == 1 && maxCardNum == 14)
//                         if( bool )
//                         {
//                             yi[yi.length] = cardDatas
//                             sortedCardDatasExcludeLazi_remain = isHas[1][0]
//                             sortedCardDatasOfLaizi_remain = isHas[1][1]
//                         }
//                         else
//                             break
//                     }
//                 }
//                 yi = yi.reverse()
//                 break
//             }
//             case 1:
//             {
//                 for(var typeScores=1;typeScores<14;typeScores++)
//                 {
//                     var num = gameLogic.scores2Num(typeScores)
//                     var someCardNums_sorted = [num, num]
//                     var isHas = gameLogic.isHas(sortedCardDatasExcludeLazi_remain, sortedCardDatasOfLaizi_remain, someCardNums_sorted)
//                     var cardDatas = isHas[0]
//                     var bool = cardDatas && ( cardLogic.getNum(cardDatas[0])<minCardNum || cardLogic.getNum(cardDatas[0])>maxCardNum )
//                     bool = bool && !(cardLogic.getNum(cardDatas[0]) == 1 && maxCardNum == 14)
//                     if( bool )
//                     {
//                         yi[yi.length] = cardDatas
//                         sortedCardDatasExcludeLazi_remain = isHas[1][0]
//                         sortedCardDatasOfLaizi_remain = isHas[1][1]
//                     }
//                 }
//                 break
//             }
//         }

//         if(yi.length<len*2)
//             return false

//         var y = []
//         for(var i=0;i<len*2;i++)
//         {
//             y = y.concat(yi[i])
//         }

//         y = y.reverse()
//         var cardDatas = san.concat(y)
        
//         return cardDatas
//     }
// }

// var c1 = clone(cardType)
// c1.name = 'sidaier'
// var c2 = clone(cardType)
// c2.id = 102
// c2.type = 1
// c2.name = 'sidailiangdui'

// gameLogic.initCardsParser(
// [ 
//     [
//         {id:1, minLen:1, maxLen:1, minCardNum:1, maxCardNum:15, name:'danzhang'},
//         {id:1, name:'shunzi'},
//         {id:2, minLen:1, maxLen:1, minCardNum:1, maxCardNum:13, name:'duizi'},
//         {id:2, minLen:3, name:'liandui'},
//         {id:3, minLen:1, maxLen:1, minCardNum:1, maxCardNum:13, type:0, name:'sange'},
//         {id:3, minLen:1, maxLen:1, minCardNum:1, maxCardNum:13, type:1, name:'sandaiyi'},
//         {id:3, minLen:1, maxLen:1, minCardNum:1, maxCardNum:13, type:2, name:'sandaiyidui'},
//         {id:3, type:0, name:'feiji'},
//         {id:3, type:1, name:'feiji'},
//         {id:3, type:2, name:'feiji'},
//         c1,
//         c2,
//     ], 
//     [
//         {id:4, type:2, name:'zhadan'},
//     ], 
//     [
//         {id:4, type:1, name:'zhadan'},
//     ], 
//     [
//         {id:4, type:3, name:'zhadan'},
//     ], 
//     [
//         {id:5, name:'wangzha'},
//     ], 
// ])

