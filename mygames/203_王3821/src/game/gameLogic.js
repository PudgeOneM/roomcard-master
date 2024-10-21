
var cardLogic = {}
var MAX_IDX54 = 80
var IDX54_CHANGETO_COLOR = 0
//color:0 1 2 3 方块梅花红桃黑桃  
//num:1-13    
//idx54:1-79  
//idx54OfLaizi:idx54
//idx54OfChangeTo:idx54
//idx_laizi:idx54OfChangeTo + 5*16 + idx54OfLaizi*16  
//idx:idx54 and idx_laizi 

cardLogic.getIdx54WithNumAndColor = function(num, color) 
{
    var idx = color*16 + num
    return idx
}

cardLogic.getNumAndColorWithIdx54 = function(idx) 
{
    var color = Math.floor(idx/16) 
    var num = idx%16

    return [num, color]
}

cardLogic.getIdx_laiziWithNumAndColor = function(num, color, idx54OfLaizi) 
{
    var idx = cardLogic.getIdx54WithNumAndColor(num, color)
    idx_laizi = idx + 5*16 + idx54OfLaizi*16

    return idx_laizi
}

cardLogic.getNumAndColorWithIdx_laizi = function(idx54OfLaizi, idx_laizi) 
{
    var idx = idx_laizi - (5*16 + idx54OfLaizi*16)
    return cardLogic.getNumAndColorWithIdx54(idx) 
}

cardLogic.getIdx54WithColorAndIdx_laizi = function(idx_laizi, color) 
{
    var num = cardLogic.getNum(idx_laizi)
    return cardLogic.getIdx54WithNumAndColor(num, color) 
}

cardLogic.getIdx54OfLaiziWithColorAndIdx_laizi = function(idx_laizi, color) 
{
    var idx = cardLogic.getIdx54WithColorAndIdx_laizi(idx_laizi, color) 
    var idx54OfLaizi = (idx_laizi - idx)/16 - 5
    return idx54OfLaizi
}

cardLogic.getSortedIdx54sExcludeLaziAndSortedIdx54sOfLaizi = function(c_sortedIdx54s, idx54sOfLaiziTable)
{
    var sortedIdx54sExcludeLazi = []
    var sortedIdx54sOfLaizi = []
    for(var i=0;i<c_sortedIdx54s.length;i++)
    {
        var isLazi = false
        for(var j in idx54sOfLaiziTable)
        {
            if(c_sortedIdx54s[i] == idx54sOfLaiziTable[j])
            {
                sortedIdx54sOfLaizi[sortedIdx54sOfLaizi.length] = c_sortedIdx54s[i]
                isLazi = true
                break
            }
        }
        if(!isLazi)
            sortedIdx54sExcludeLazi[sortedIdx54sExcludeLazi.length] = c_sortedIdx54s[i] 
    }
    return [sortedIdx54sExcludeLazi, sortedIdx54sOfLaizi]
} 

cardLogic.getSortedIdx54sExcludeLaziAndSortedIdx54sOfLaizi2 = function(sortedIdxs)
{
    var sortedIdx54sExcludeLazi = []
    var sortedIdx54sOfLaizi = []
    for(var i=0;i<sortedIdxs.length;i++)
    {
        var idx = sortedIdxs[i] 
        var isLazi = idx>=80
        if(isLazi)
            sortedIdx54sOfLaizi[sortedIdx54sOfLaizi.length] = cardLogic.getIdx54OfLaiziWithColorAndIdx_laizi(idx, 0) 
        else
            sortedIdx54sExcludeLazi[sortedIdx54sExcludeLazi.length] = idx
    }

    return [sortedIdx54sExcludeLazi, sortedIdx54sOfLaizi]
} 

cardLogic.getColor = function(idx) 
{
    return Math.floor(idx/16) 
}

cardLogic.getNum = function(idx) 
{
    return idx%16
}

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

//cardLogic 不会考虑花色问题 即红桃10和黑桃10在这个logic算法里视为等价
cardLogic.isSameCard = function(card1, card2)
{
    return cardLogic.getNum(card1) == cardLogic.getNum(card2)
}

///////////////
cardLogic.sortWithNum = function(idxs)
{
    idxs.sort(function(a,b)
    {   
        if(cardLogic.getNum(a) == cardLogic.getNum(b))
            return a - b
        else
            return cardLogic.getNum(a) - cardLogic.getNum(b)
    })

    return idxs
}

cardLogic.isContinue = function(c_sortWithNum, sameNum)
{
    var idxs = clone(c_sortWithNum)
    var clen = idxs.length
    if(clen==0 || clen%sameNum!=0 || clen == sameNum)
        return false

    if(clen/sameNum>13)
        return false

    var is = true
    if(sameNum == 1)
    {

        if(cardLogic.getNum(idxs[idxs.length-1]) == 13 && 
            cardLogic.getNum(idxs[0]) == 1)
        {
            var s = idxs.splice(0, 1)
            idxs = idxs.concat(s)
        }    

        var lastIdx = 0
        for(var i=1;i<clen;i++)
        {
            var cardNum = cardLogic.getNum(idxs[i])  
            var lastCardNum = cardLogic.getNum(idxs[lastIdx])  
            var iska = cardNum==1&&lastCardNum==13

            if(cardNum-lastCardNum != 1 && !iska)
            {
                is = false
                break
            }
            lastIdx = i
        }

        return is
    }
    else
    {
        var subc = idxs.slice(0, sameNum)
        if(!cardLogic.isSameNum(subc))
        {
            is = false
            return is
        }

        for(var i=0;i<sameNum;i++)
        {
            var subIdxs = []
            for(var j=0;j<clen/sameNum;j++)
            {
                var cardIdx = idxs[j*sameNum + i]
                subIdxs[subIdxs.length] = cardIdx
            }

            var subis = cardLogic.isContinue(subIdxs, 1)
            if(!subis)
            {
                is = false
                break
            }
        }
    }
    return is
}

//223344 len=3
cardLogic.getContinueCardNums = function(minCardNum, len, sameNum)
{
    var cardNums = []

    // var maxCardNum = minCardNum + len - 1
    // if(maxCardNum == 15)
    // {
    //     return cardNums;
    // }

    if(sameNum == 1)
    {
        for(var j=0;j<len;j++)
        {   
            cardNums[j] = minCardNum + j
            if(cardNums[j] == 14)
                cardNums[j] = 1
        }
        return cardNums
    }
    else
    {
        var cardNumst = cardLogic.getContinueCardNums(minCardNum, len, 1)
        for(var i=0;i<cardNumst.length;i++)
        {
            for(var j=0;j<len*sameNum;j++)
                cardNums[j] = cardNumst[Math.floor(j/sameNum)]
        }

    }
    return cardNums
}

//癞子只作为方块1-13
//idx54sOfLaizi 索引越前在返回的IdxsArray中越先被处理为癞子 如[78,79] 78会优先作为癞子处理
cardLogic.getIdxsArrayWithLaiziIgnoreColor = function(uc_arrayOfIdxs, idx54sOfLaizi) 
{
    if(idx54sOfLaizi.length == 0)
        return uc_arrayOfIdxs
    else
    {
        var laiziCard = idx54sOfLaizi.splice(-1,1)//先做癞子的会沉底
        var idxsArr = []
        for(var i=0;i<uc_arrayOfIdxs.length;i++)
        {
            var originIdxs = uc_arrayOfIdxs[i]
            var hasLaizi = false
            for(var j=0;j<originIdxs.length;j++)
            {
                if(originIdxs[j] == laiziCard)
                {
                    hasLaizi = true
                    idxsArr[idxsArr.length] = clone(originIdxs)

                    originIdxs.splice(j,1)
                    for( var cardNum=1;cardNum<14;cardNum++ )
                    {   
                        var newIdxs = clone(originIdxs)
                        newIdxs[newIdxs.length] = cardLogic.getIdx_laiziWithNumAndColor(cardNum, IDX54_CHANGETO_COLOR, laiziCard)
                        idxsArr[idxsArr.length] = newIdxs
                    }
                    
                    break
                }
            }
            if(!hasLaizi)
                idxsArr[idxsArr.length] = originIdxs
        }
        return cardLogic.getIdxsArrayWithLaiziIgnoreColor(idxsArr, idx54sOfLaizi)
    }
}

cardLogic.hasSomeCardNums = function(sortedIdxs, someCardNums_sorted) 
{
    var arrIdxsOfsortedIdxs = []
    for(var i=0;i<someCardNums_sorted.length;i++)
    {
        if(i==0)
            var startJ = 0
        else
            var startJ = arrIdxsOfsortedIdxs[i-1] + 1

        for(var j=startJ;j<sortedIdxs.length;j++)
        {
            if(cardLogic.getNum(sortedIdxs[j]) == someCardNums_sorted[i])
            {
                arrIdxsOfsortedIdxs[i] = j
                break
            }
        }
        if(typeof(arrIdxsOfsortedIdxs[i]) == 'undefined' )
        {
            return false
        }
    }

    return arrIdxsOfsortedIdxs
}


cardLogic.getArrIdxsIncludeSomeCardNums = function(uc_sortedIdx54s, someCardNums_sorted) 
{
    var arrIdxsOfSortedIdx54s = []
    var currentIdxOfSortedIdx54s = -1
    for(var i=0;i<someCardNums_sorted.length;i++)
    {
        arrIdxsOfSortedIdx54s[i] = -1
        for(var j=0;j<uc_sortedIdx54s.length;j++)
        {
           if( cardLogic.isSameNum( [ someCardNums_sorted[i], uc_sortedIdx54s[j] ] ) )
           {
                currentIdxOfSortedIdx54s = currentIdxOfSortedIdx54s + j + 1 
                arrIdxsOfSortedIdx54s[i] = currentIdxOfSortedIdx54s
                uc_sortedIdx54s = uc_sortedIdx54s.slice(j+1, uc_sortedIdx54s.length)
                break
           }
        }
    }

    return arrIdxsOfSortedIdx54s 
}

cardLogic.isHasAnyOne = function(arrIdxsOfSortedIdx54s) 
{
    var hasAnyOne = false
    for(var i=0;i<arrIdxsOfSortedIdx54s.length;i++)
    {
        if(arrIdxsOfSortedIdx54s[i]!=-1)
            hasAnyOne = true
    }

    return hasAnyOne
}

cardLogic.isHas = function(c_sortedIdx54sExcludeLazi, c_sortedIdx54sOfLaizi, someCardNums_sorted)
{
    var arrIdxsOfSortedIdx54s = cardLogic.getArrIdxsIncludeSomeCardNums(clone(c_sortedIdx54sExcludeLazi), someCardNums_sorted) 
    if( !cardLogic.isHasAnyOne(arrIdxsOfSortedIdx54s) )
    {
        var arrIdxsOfSortedIdx54s2 = cardLogic.getArrIdxsIncludeSomeCardNums(clone(c_sortedIdx54sOfLaizi), someCardNums_sorted) 
        if(!cardLogic.isHasAnyOne(arrIdxsOfSortedIdx54s2)  || c_sortedIdx54sOfLaizi.length < someCardNums_sorted.length)
            return [false]
        else
        {
            arrIdxsOfSortedIdx54s = []
            for(var i=0;i<someCardNums_sorted.length;i++)
                arrIdxsOfSortedIdx54s[i] = -1
        }
    }

    var idxs = []
    var sortedIdx54sOfLaizi = cardLogic.getReverseArray( clone(c_sortedIdx54sOfLaizi) )
    var sortedIdx54sExcludeLazi =  clone(c_sortedIdx54sExcludeLazi) 
    for(var i=arrIdxsOfSortedIdx54s.length-1;i>=0;i--)
    {
        var arrIdx = arrIdxsOfSortedIdx54s[i]
        if(arrIdx == -1)
        {
            if(sortedIdx54sOfLaizi.length>0)
            {
                idxs[i] = cardLogic.getIdx_laiziWithNumAndColor(someCardNums_sorted[i], IDX54_CHANGETO_COLOR, sortedIdx54sOfLaizi[0]) 
                sortedIdx54sOfLaizi.splice(0,1)
            }
            else
                return [false]
        }
        else
        {
            idxs[i] = sortedIdx54sExcludeLazi[arrIdx]
            sortedIdx54sExcludeLazi.splice(arrIdx,1) // i 正比于 arrIdx
        }
    }

    var remained = [ sortedIdx54sExcludeLazi, sortedIdx54sOfLaizi ]

    return [idxs,remained]
}




// //
// cardLogic.isIncludeSomeCardNums = function(uc_sortedIdx54s, someCardNums_sorted) 
// {
//     var arrIdxsOfSortedIdx54s = []
//     var currentIdxOfSortedIdx54s = -1
//     var hasAnyOne = false
//     for(var i=0;i<someCardNums_sorted.length;i++)
//     {
//         for(var j=0;j<uc_sortedIdx54s.length;j++)
//         {
//            if( cardLogic.isSameNum( [ someCardNums_sorted[i], uc_sortedIdx54s[j] ] ) )
//            {
//                 hasAnyOne = true
//                 currentIdxOfSortedIdx54s = currentIdxOfSortedIdx54s + j + 1 
//                 arrIdxsOfSortedIdx54s[i] = currentIdxOfSortedIdx54s
//                 uc_sortedIdx54s = uc_sortedIdx54s.slice(j+1, uc_sortedIdx54s.length)
//                 break
//            }
//         }
//         if( typeof( arrIdxsOfSortedIdx54s[i] ) == 'undefined' )
//         {
//             arrIdxsOfSortedIdx54s[i] = -1
//         }
//     }

//     if(hasAnyOne)
//         return arrIdxsOfSortedIdx54s 
//     else
//         return false
// }

// cardLogic.isHas = function(c_sortedIdx54sExcludeLazi, c_sortedIdx54sOfLaizi, someCardNums_sorted)
// {
//     var arrIdxsOfSortedIdx54s = cardLogic.isIncludeSomeCardNums(clone(c_sortedIdx54sExcludeLazi), someCardNums_sorted) 
//     if(!arrIdxsOfSortedIdx54s)
//     {
//         var arrIdxsOfSortedIdx54s2 = cardLogic.isIncludeSomeCardNums(clone(c_sortedIdx54sOfLaizi), someCardNums_sorted) 
//         if(!arrIdxsOfSortedIdx54s2 || c_sortedIdx54sOfLaizi.length < someCardNums_sorted.length)
//             return [false]
//         else
//         {
//             arrIdxsOfSortedIdx54s = []
//             for(var i=0;i<someCardNums_sorted.length;i++)
//                 arrIdxsOfSortedIdx54s[i] = -1
//         }
//     }

//     var idxs = []
//     var sortedIdx54sOfLaizi = cardLogic.getReverseArray( clone(c_sortedIdx54sOfLaizi) )
//     var sortedIdx54sExcludeLazi =  clone(c_sortedIdx54sExcludeLazi) 
//     for(var i=arrIdxsOfSortedIdx54s.length-1;i>=0;i--)
//     {
//         var arrIdx = arrIdxsOfSortedIdx54s[i]
//         if(arrIdx == -1)
//         {
//             if(sortedIdx54sOfLaizi.length>0)
//             {
//                 idxs[i] = cardLogic.getIdx_laiziWithNumAndColor(someCardNums_sorted[i], 0, sortedIdx54sOfLaizi[0]) 
//                 sortedIdx54sOfLaizi.splice(0,1)
//             }
//             else
//                 return [false]
//         }
//         else
//         {
//             idxs[i] = sortedIdx54sExcludeLazi[arrIdx]
//             sortedIdx54sExcludeLazi.splice(arrIdx,1) // i 正比于 arrIdx
//         }
//     }

//     var remained = [ sortedIdx54sExcludeLazi, sortedIdx54sOfLaizi ]

//     return [idxs,remained]
// }


//[1,2,3,4], 2  -> [[1,2],[2,3],[3,4]]
//[1,2,3,4], 3  -> [[1,2,3],[2,3,4]]
cardLogic.sliceArray = function(baseArray, numOfPerGroup) 
{
    var subArray = []
    var subArrayLen = baseArray.length + 1 - numOfPerGroup

    for(var i=0;i<subArrayLen;i++)
    { 
        subArray[i] = []
        for(var j=0;j<numOfPerGroup;j++)
            subArray[i][j] = baseArray[i+j]
    }

    return subArray
}

cardLogic.getReverseArray = function(array) 
{
    var reverse = []
    for(var i=0;i<array.length;i++)
    {
        reverse[array.length-1-i] = array[i]
    }

    return reverse
}

















var gameLogic = {}

/////////////////////// 由于服务器和客户端算法不一样 需要进行数据格式转化 start ///////////////////////
gameLogic.getIdxWithDataItemAndChangeItem = function(data, changeData)
{
    var idx = cardLogic.getIdx_laiziWithNumAndColor(changeData, 0, data) 
    return idx
}

gameLogic.getIdxWithDataAndChangeData = function(data, changeData)
{
    var idxs = []
    var dataLaizi = []
    var changeDataLaizi = []
    for(var i=data.length-1;i>=0;i--)
    {   
        var dataItem = data[i]        
        var isLaizi = true
        for(var j=0;j<changeData.length;j++)
        {   
            if(dataItem == changeData[j])
            {
                isLaizi = false
                changeData.splice(j, 1)
                break
            }
        }

        if(!isLaizi)
        {
            data.splice(i, 1)

            idxs[idxs.length] = dataItem 
        }
    }

    for(var i=0;i<data.length;i++)
    {
        var idx = gameLogic.getIdxWithDataItemAndChangeItem(data[i], changeData[i])
        idxs[idxs.length] = idx 
    }
    // cardLogic.sortWithNum(idxs, true)
    return idxs
}

gameLogic.getDataItemAndChangeItemDataWithIdx = function(idx)
{
    var data
    var changeData

    if(idx >=80)
    {
        data = cardLogic.getIdx54OfLaiziWithColorAndIdx_laizi(idx, 0)
        changeData = cardLogic.getNum(idx)
    }
    else
    {
        data = idx
        changeData = idx
    }
    return [data, changeData]
}

gameLogic.getDataAndChangeDataWithIdxs = function(idxs)
{
    var data = []
    var changeData = []   

    for(var i=0;i<idxs.length;i++)
    {   
        var idx = idxs[i]
        var t = gameLogic.getDataItemAndChangeItemDataWithIdx(idx)
        data[i] = t[0] 
        changeData[i] = t[1] 
    }
    // cardLogic.sortWithNum(data, true)
    // cardLogic.sortWithNum(changeData, true)

    return [data, changeData]
}
/////////////////////// 由于服务器和客户端算法不一样 需要进行数据格式转化 end ///////////////////////

/////////////////////// 解析牌型  需要idxs才能唯一解析 start ///////////////////////
gameLogic.getCardsType = function(c_sortedIdxs) 
{
    var t = cardLogic.getSortedIdx54sExcludeLaziAndSortedIdx54sOfLaizi2(c_sortedIdxs)

    var cardsTypes = gameLogic._getCardsTypesWithLaizi(t[0], t[1]) 
    for(var i in cardsTypes)
    {
        var cardsType = cardsTypes[i]
        var idxs = cardLogic.sortWithNum( clone(cardsType.idxs) ) 
        var isSame = c_sortedIdxs.length == idxs.length
        for(var j=0;j<c_sortedIdxs.length;j++)
        {
            isSame = c_sortedIdxs[j] == idxs[j]
            if(!isSame)
                break
        }
        if(isSame)
            return cardsType
    }

    return {typeIdx:0, typeLevel:0, typeScores:0}
}

gameLogic.getCardsTypesWithIdx54s = function(c_sortedIdx54s, idx54sOfLaiziTable) 
{
    var cardsTypesMax = []
    var t = cardLogic.getSortedIdx54sExcludeLaziAndSortedIdx54sOfLaizi(c_sortedIdx54s, idx54sOfLaiziTable)
    var cardsTypes = gameLogic._getCardsTypesWithLaizi(t[0], t[1]) 

    console.log('getCardsTypesWithIdx54s:',cardsTypes, clone(t) )

    var maxTypeLevel = 0
    for(var i in cardsTypes)
    {
        if(cardsTypes[i].typeLevel>maxTypeLevel)
            maxTypeLevel = cardsTypes[i].typeLevel
    }

    for(var i=0;;i++)
    {   
        var kind = i 
        if(gameLogic.cardsParser[maxTypeLevel][kind])
        {
            var len = cardsTypesMax.length
            for(var j in cardsTypes)
            {   
                var c = cardsTypes[j]
                if(c.typeLevel == maxTypeLevel && c.typeKind == kind)
                {
                    if(!cardsTypesMax[len] || cardsTypesMax[len].typeScores < c.typeScores )
                        cardsTypesMax[len] = c
                }
            }
        }
        else
            break
    }

    return cardsTypesMax
}

// //////////////////////内部函数
gameLogic._getCardsTypesWithLaizi = function(c_sortedIdx54sExcludeLazi, c_sortedIdx54sOfLaizi) 
{
    var cardsTypes = [] 
    for(var level=gameLogic.cardsParser.length-1;level>0;level--)
    {
        var parsers = gameLogic.cardsParser[level]
        for(var i=0;i<parsers.length;i++)
        {
            var cardsParser = parsers[i]
            var cardsType = cardsParser.parser( c_sortedIdx54sExcludeLazi, c_sortedIdx54sOfLaizi ) 
            if(cardsType)
                cardsTypes[cardsTypes.length] = cardsType
        }
    }
    return cardsTypes
}


// a、比牌型索引 
// 牌型索引为0时表示不构成牌型 返回无法比较
// 牌型索引一样的话就比牌型分 分大的大
// 牌型索引不一样的话再比牌型等级->b

// b、牌型等级一样 返回无法比较
// 牌型等级不一样的话 等级大的大 
gameLogic.compareTwoCardsType = function(cardsType1, cardsType2) 
{
    var result //0（前者大） 1（相等） 2（后者大） 3（无法比较）
    if(cardsType1.typeIdx == 0 || cardsType2.typeIdx == 0)
        result = 3
    else if(cardsType1.typeIdx == cardsType2.typeIdx)
    {
        var t = cardsType1.typeScores - cardsType2.typeScores
        if( t>0 )
            result = 0
        else if( t==0 )
            result = 1
        else if( t<0 )
            result = 2
    }
    else
    {
        if(cardsType1.typeLevel == cardsType2.typeLevel)
             result = 3
        else
        {
            var t = cardsType1.typeLevel - cardsType2.typeLevel
            if( t>0 )
                result = 0
            else if( t<0 )
                result = 2
        }           
    }

    return result
}

/////////////////////// 解析牌型  需要idxs才能唯一解析 end ///////////////////////


/////////////////////// 获取提示 需要idx54s + idx54sOfLaiziTable start ///////////////////////
//返回的是一个牌型由小到大的数组
gameLogic.getTipsArray = function(c_cardsType, sortedIdx54s, idx54sOfLaiziTable)
{

    var cardsType = clone(c_cardsType)

    if( typeof(cardsType)=='number' )
    {
        var originLevel = cardsType-1
        cardsType = {typeLevel:cardsType, typeScores:0, typeKind:0}
    }
    else
        var originLevel = cardsType.typeLevel

    var tipsArray = []

    var t = cardLogic.getSortedIdx54sExcludeLaziAndSortedIdx54sOfLaizi(sortedIdx54s, idx54sOfLaiziTable)
    
    for(var i=0;;i++)
    {
        cardsType = gameLogic._getBiggerType(originLevel, cardsType) 
        if(!cardsType)
            break
        var parser = gameLogic.cardsParser[cardsType.typeLevel][cardsType.typeKind]
        var idxs = parser.getIdxsIfHas(t[0], t[1], cardsType.typeScores, cardsType.typeIdx)

        if(idxs)
            tipsArray[tipsArray.length] = idxs
    }

    console.log('tipsArray:', tipsArray, sortedIdx54s)
    return tipsArray
}

////////
gameLogic._getBiggerType = function(originLevel, uc_cardsType) 
{
    var differLevel = uc_cardsType.typeLevel - originLevel

    if(differLevel<0)
        return false

    var parsers = gameLogic.cardsParser[uc_cardsType.typeLevel]
    if(!parsers)
        return false

    var parser = parsers[uc_cardsType.typeKind]
  
    if(differLevel==0)
        var typeIdx = uc_cardsType.typeIdx
    else
        var typeIdx = parser.typeIdx + parser.minLen
    biggerCardsType = parser.getType(uc_cardsType.typeScores + 1, typeIdx)
    
    
    if(biggerCardsType)
        return biggerCardsType
    else
    {
        if(originLevel==uc_cardsType.typeLevel)
        {
            uc_cardsType.typeLevel = uc_cardsType.typeLevel + 1
            uc_cardsType.typeScores = 0
            uc_cardsType.typeKind = 0
            return gameLogic._getBiggerType(originLevel, uc_cardsType)
        }
        else
        {
            if(parsers[uc_cardsType.typeKind+1])
                uc_cardsType.typeKind = uc_cardsType.typeKind + 1
            else
            {
                uc_cardsType.typeLevel = uc_cardsType.typeLevel + 1
                uc_cardsType.typeKind = 0
            }

            uc_cardsType.typeScores = 0
            return gameLogic._getBiggerType(originLevel, uc_cardsType)
        }
    }
}






// ////////
// gameLogic._getBiggerType = function(uc_cardsType, isBiggerLevel) 
// {
//     var parsers = gameLogic.cardsParser[uc_cardsType.typeLevel]
//     if(!parsers)
//         return false
//     var biggerCardsType
    
//     if(isBiggerLevel)
//     {   
//         for(var i=0;i<parsers.length;i++)
//         {
//             var parser = parsers[i]
//             var typeIdx = parser.minLen?parser.typeIdx + parser.minLen:parser.typeIdx
//             t = parser.getType(uc_cardsType.typeScores + 1, typeIdx)
//             if(t)
//                 biggerCardsType = t
//         }
//     }
//     else
//     {
//         var parser = parsers[uc_cardsType.typeKind]
//         biggerCardsType = parser.getType(uc_cardsType.typeScores + 1, uc_cardsType.typeIdx)
//     }

//     if(biggerCardsType)
//         return biggerCardsType

//     uc_cardsType.typeLevel = uc_cardsType.typeLevel + 1
//     uc_cardsType.typeScores = 0

//     return gameLogic._getBiggerType(uc_cardsType , true) 
// }

/////////////////////// 获取提示 需要idx54s + idx54sOfLaiziTable end ///////////////////////


/////////////////////// 排序扑克 用于显示（手牌) start ///////////////////////
gameLogic.sortIdxsWithScore = function(idx54s, idx54sOfBigCardTable) 
{
    idx54s.sort(function(a,b)
    {   
        return gameLogic._getScoreOfIdx(a, idx54sOfBigCardTable) - gameLogic._getScoreOfIdx(b, idx54sOfBigCardTable)
    })

    return idx54s
}

gameLogic._getScoreOfIdx = function(idx, idx54sOfLaiziTable) 
{
    var cardNum = cardLogic.getNum(idx) 
    var scores = gameLogic.num2Scores[cardNum]

    scores = scores * 4 + Math.floor(idx/16)%4

    for(var i=0;i<idx54sOfLaiziTable.length;i++)
    {
        if(idx54sOfLaiziTable[i] == idx)
        {
            scores = scores + 100
            break
        }
    }
    return scores
}
/////////////////////// 排序扑克 用于显示（手牌) end ///////////////////////


////autofill start//// 
gameLogic._isSubIdx54 = function(subIdx54s, idxs, idx54sOfLaizi)
{
    idxs = clone(idxs)
    var isSub = true //subIdx54s中所有元素在idxs中都有
    for(var i in subIdx54s)
    {   
        var idx54 = subIdx54s[i]
        var isLazi = false
        for(var ii in idx54sOfLaizi)
        {
            if(idx54 == idx54sOfLaizi[ii])
            {
                isLazi = true
                break
            }
        }

        var hasInIdxs = false //var hasInIdxs 这样写会有问题的 必须有个初始化 否则会默认上一次循环的值 而不是undefined
        for(var ii in idxs)
        {
            if(idxs[ii]>=80 )
            {
                if(isLazi)
                {
                    hasInIdxs = true
                    idxs.splice(ii, 1)
                    break
                }
            }
            else
            {
                if( cardLogic.getNum(idxs[ii]) == cardLogic.getNum(idx54) )
                {
                    hasInIdxs = true
                    idxs.splice(ii, 1)
                    break
                }   
            }
        }

        if(!hasInIdxs)
            isSub = false
    }

    return isSub
}

///[1], [[1,2,3],[1,2,3,4]] ->undefined
///[1], [[2,3],[2,3,4]]  ->undefined
///[1], [[1,2,3],[2,3,4]] ->0
///[1,2], [[1,2,3],[1,2,3,4]] ->undefined
///[1,2], [[1,3],[2,3,4]]  ->undefined
///[1,2], [[2,3],[1,2,3,4]] ->1
gameLogic._getIdxIfOnlyOne = function(subIdx54s, idxsArray, idx54sOfLaiziTable)
{
    var idx 
    for(var i in idxsArray)
    {
        var idxs = idxsArray[i]
        var isSubIdx54 = gameLogic._isSubIdx54(subIdx54s, idxs, idx54sOfLaiziTable)
        if(isSubIdx54)
        {
            if(idx) 
                return 
            else
                idx = i
        }
    }
    return idx
}

gameLogic.getNeedSelectedIdx54s_autoFill = function(isDownCard, tipsArray, subIdx54s, idx54sOfLaiziTable)
{
    if(isDownCard || tipsArray.length == 0)
        return [];

    var idx = gameLogic._getIdxIfOnlyOne(subIdx54s, tipsArray, idx54sOfLaiziTable)
    if(idx)
    {
        var tipsIdxs = tipsArray[idx]
        var selectedIdxs = clone(subIdx54s)
        var needSelectedIdx54s = clone(tipsIdxs)

        //检索tipsIdxs 如果检索到selectedIdxs中同时存在 则从两个数组同时remove 并继续
        for(var i=needSelectedIdx54s.length-1;i>=0;i--)
        {
            needSelectedIdx54s[i] = needSelectedIdx54s[i]>=80?cardLogic.getIdx54OfLaiziWithColorAndIdx_laizi(needSelectedIdx54s[i], 0):needSelectedIdx54s[i]
            for(var j in selectedIdxs)
            {
                if( selectedIdxs[j] == needSelectedIdx54s[i]) 
                {
                    needSelectedIdx54s.splice(i, 1)
                    selectedIdxs.splice(j, 1)
                    break 
                }
            }
        }

        for(var i=needSelectedIdx54s.length-1;i>=0;i--)
        {
            for(var j in selectedIdxs)
            {
                if( cardLogic.getNum(selectedIdxs[j]) == cardLogic.getNum(needSelectedIdx54s[i]) )
                {
                    needSelectedIdx54s.splice(i, 1)
                    selectedIdxs.splice(j, 1)
                    break 
                }
            }
        }

        return needSelectedIdx54s
    }
    return [];
},
////autofill end//// 

////ChooseType start/////
gameLogic.getChooseTypeItem = function(listViewWidth, params)
{
    var default_item = new ccui.Layout();
    default_item.setContentSize(listViewWidth-10, 120)
    
    var scrollView = new ccui.ScrollView()
    scrollView.setDirection(ccui.ScrollView.DIR_HORIZONTAL)
    scrollView.setTouchEnabled(true)
    scrollView.setBounceEnabled(true)

    scrollView.setScrollBarEnabled(false)
    scrollView.setContentSize(cc.size(listViewWidth-140, 120))
    scrollView.x = 15
    scrollView.y = 5
    default_item.addChild(scrollView)

    var cardScale = 0.6
    var cards = params.idxs   
    var cardsPos = cardFactory.getCardsPosArray({width:cardFactory.width*cardScale, 
        height:cardFactory.height*cardScale}, cards.length, 20) 

    var scrollViewRect = scrollView.getContentSize()
    var width = cardsPos[cardsPos.length-1][0] - cardsPos[0][0] + cardFactory.width*cardScale
    scrollView.setInnerContainerSize(cc.size(width + 10 ,scrollViewRect.height))

    for(var i in cards)
    {
        var cardidx = cards[i]>=80?cardLogic.getIdx54OfLaiziWithColorAndIdx_laizi(cards[i], 0):cards[i] 
        var card = cardFactory.getOne(cardidx)
        card.setScale(cardScale)
        card.setPosition(cc.p(cardsPos[i][0] + cardFactory.width*cardScale*0.5, cardsPos[i][1] + cardFactory.height*cardScale*0.5))
        scrollView.addChild(card)
    }

    var cardTypeSpr = new cc.Sprite("#" + 'lzddz_typeIcon' + params.id + '.png')
    cardTypeSpr.setPosition(cc.p( 35, 85) )
    default_item.addChild(cardTypeSpr)


    // var cardType = params.cardType
    var btn = new ccui.Button(resp.yes, resp.yes)
    btn.setTouchEnabled(true)
    btn.setPosition(cc.p( listViewWidth-65, 60 ))
    btn.addClickEventListener(function(btn) {
        params.sureCall() 
    }.bind(this))
    default_item.addChild(btn)

    return default_item
}
////ChooseType end/////

gameLogic.getSoundName = function(cardsType, isFirstOut)
{
    var name = ''
    switch(cardsType.id)
    {
        case 1:
        {
            if(cardsType.idxs.length>1)
            {
                if(isFirstOut)
                    name = name + 'shunzi'
                else
                    name = 'dani'
            }
            else
                name = name + 'danzhang' + cardLogic.getNum(cardsType.idxs[0])
            break
        }
        case 2:
        {
            if(cardsType.idxs.length>2)
            {
                if(isFirstOut)
                    name = name + 'liandui'
                else
                    name = 'dani'
            }   
            else
                name = name + 'duizi' + cardLogic.getNum(cardsType.idxs[0])
            break
        }
        case 3:
        {
            if(cardsType.idxs.length==3)
                name = name + 'sange' + cardLogic.getNum(cardsType.idxs[0])
            else if(cardsType.idxs.length==4)
            {
                if(isFirstOut)
                    name = name + 'sandaiyi'
                else
                    name = 'dani'
            }  
            else if(cardsType.idxs.length==5)
            {
                if(isFirstOut)
                    name = name + 'sandaier'
                else
                    name = 'dani'
            }  
            else
            {
                if(isFirstOut)
                    name = name + 'feiji'
                else
                    name = 'dani'
            }  
            break
        }   
        case 4:
        {
            if(isFirstOut)
                name = name + 'zhadan'
            else
                name = 'dani'
            break
        }
        case 5:
        {
            name = name + 'wangzha'
            break
        }
    } 

    return name
}


/////////////////
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

gameLogic.scores2Num = function(score)
{
    for(var num=0;num<16;num++)
    {
        if ( gameLogic.num2Scores[num] == score)
            return num
    }
}

gameLogic.cardsParser= []
gameLogic.cardsParser[0] = []
gameLogic.cardsParser[0][0] =   
{
    typeLevel:0,
    typeKind:0,
    typeIdx:0,
    //所有牌型score都从1开始累加1
    getType:function(typeScores)
    {
        return false
    },
    parser:function(uc_sortedIdxs)
    {
        return {idxs:uc_sortedIdxs, typeIdx:this.typeIdx, typeLevel:this.typeLevel, typeScores:0,typeKind:this.typeKind}
    },
    //调用前要做安全判断（getType）
    getIdxsIfHas:function(c_sortedIdx54sExcludeLazi, c_sortedIdx54sOfLaizi, typeScores)
    {
        return false
    }
}


////////////parserConf start//////
gameLogic.initCardsParser = function(conf)
{   
    var typeIdx = 0
    for(var i=0;i<conf.length;i++)
    {
        var typeLevel = i + 1
        gameLogic.cardsParser[typeLevel] = []
        var c = conf[i]
        for(var typeKind=0;typeKind<c.length;typeKind++)
        {
            var item = conf[i][typeKind]
            var p = clone( cardsParserConf[item.id] ) || {} //自定义
            p.typeLevel = typeLevel
            p.typeKind = typeKind
            typeIdx = typeIdx + 100//要求一个牌型最多只有100种类别 比如顺子 3-13张为11种不同类别顺子
            p.typeIdx = typeIdx
            for(var j in item)
            {
                p[j] = item[j]
            }
            gameLogic.cardsParser[typeLevel][typeKind] = p
        }
    }
}

var cardsParserConf = []

cardsParserConf[1] = 
{
    typeLevel:0,
    typeKind:0,
    typeIdx:0,
    id:1,
    name:'顺子',//单张score=num2Scores 顺子score=顺子最小单牌-minCardNum+1
    minLen:5,
    maxLen:12,
    minCardNum:3,
    maxCardNum:14,//顺子时 A的cardNum作为14
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
    parser:function(c_sortedIdx54sExcludeLazi, c_sortedIdx54sOfLaizi)
    {
        var l = c_sortedIdx54sExcludeLazi.length + c_sortedIdx54sOfLaizi.length
        var len = l
        var typeIdx = len + this.typeIdx

        for(var typeScores=15;typeScores>=0;typeScores--)
        {
            if(!this.getType(typeScores, typeIdx))
                continue

            var idxs = this.getIdxsIfHas(c_sortedIdx54sExcludeLazi, c_sortedIdx54sOfLaizi, typeScores, typeIdx)
            if( idxs && idxs.length == l )
              return {id:this.id, idxs:idxs, typeIdx:typeIdx, typeLevel:this.typeLevel, typeScores:typeScores,typeKind:this.typeKind} 
        }
        return false
    }, 
    getIdxsIfHas:function(c_sortedIdx54sExcludeLazi, c_sortedIdx54sOfLaizi, typeScores, typeIdx)
    {       
        var len = typeIdx - this.typeIdx

        if(len==1)
        {
            var num = gameLogic.scores2Num(typeScores)
            var someCardNums_sorted = [num]
        }
        else
        {
            var minCardNum = typeScores-1 + this.minCardNum
            var someCardNums_sorted = cardLogic.sortWithNum( cardLogic.getContinueCardNums(minCardNum, len, 1) )
        }
        
        var idxs = cardLogic.isHas(c_sortedIdx54sExcludeLazi, c_sortedIdx54sOfLaizi, someCardNums_sorted)[0]
        
        if(!idxs)
            return false

        if(cardLogic.getNum(idxs[idxs.length-1]) == 13 && 
            cardLogic.getNum(idxs[0]) == 1)
        {

            var s = idxs.splice(0, 1)
            idxs = idxs.concat(s)
        }

        idxs = cardLogic.getReverseArray(idxs)
        return idxs
    }
}

cardsParserConf[2] = 
{
    typeLevel:0,
    typeKind:0,
    typeIdx:0,
    id:2,
    name:'连对',//单张score=num2Scores 顺子score=顺子最小单牌-minCardNum+1
    minLen:2,
    maxLen:12,
    minCardNum:3,
    maxCardNum:14,//顺子时 A的cardNum作为14
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
    parser:function(c_sortedIdx54sExcludeLazi, c_sortedIdx54sOfLaizi)
    {   
        var l = c_sortedIdx54sExcludeLazi.length + c_sortedIdx54sOfLaizi.length
        if(l%2!=0)
            return false

        var len = l/2
        var typeIdx = len + this.typeIdx

        for(var typeScores=15;typeScores>=0;typeScores--)
        {
            if(!this.getType(typeScores, typeIdx))
                continue

            var idxs = this.getIdxsIfHas(c_sortedIdx54sExcludeLazi, c_sortedIdx54sOfLaizi, typeScores, typeIdx)
            if( idxs && idxs.length == l )
              return {id:this.id, idxs:idxs, typeIdx:typeIdx, typeLevel:this.typeLevel, typeScores:typeScores,typeKind:this.typeKind} 
        }
        return false
    }, 
    getIdxsIfHas:function(c_sortedIdx54sExcludeLazi, c_sortedIdx54sOfLaizi, typeScores, typeIdx)
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
            var someCardNums_sorted = cardLogic.sortWithNum( cardLogic.getContinueCardNums(minCardNum, len, 2) )
        }
        
        var idxs = cardLogic.isHas(c_sortedIdx54sExcludeLazi, c_sortedIdx54sOfLaizi, someCardNums_sorted)[0]
        
        if(!idxs)
            return false

        if(cardLogic.getNum(idxs[idxs.length-1]) == 13 && 
            cardLogic.getNum(idxs[0]) == 1)
        {
            var s = idxs.splice(0, 2)
            idxs = idxs.concat(s)
        }

        idxs = cardLogic.getReverseArray(idxs)
        return idxs
    }
}

cardsParserConf[3] = 
{
    typeLevel:0,
    typeKind:0,
    typeIdx:0,
    id:3,
    name:'三连带X', //单张score=num2Scores 顺子score=顺子最小单牌-minCardNum+1
    minLen:2,
    maxLen:12,
    minCardNum:3,
    maxCardNum:14,//顺子时 A的cardNum作为14
    type:0, //0:不带  1:带1  2:带2(必须一对) 3:带2(不需要一对) 
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
    parser:function(c_sortedIdx54sExcludeLazi, c_sortedIdx54sOfLaizi)
    {
        var l = c_sortedIdx54sExcludeLazi.length + c_sortedIdx54sOfLaizi.length
        var n 
        switch(this.type)
        {
            case 0:
            {
                n = 3
                break
            }
            case 1:
            {
                n = 4
                break
            }
            case 2:
            {
                n = 5
                break
            }
            case 3:
            {
                n = 5
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
            var idxs = this.getIdxsIfHas(c_sortedIdx54sExcludeLazi, c_sortedIdx54sOfLaizi, typeScores, typeIdx)
            if( idxs && idxs.length == l )
              return {id:this.id, idxs:idxs, typeIdx:typeIdx, typeLevel:this.typeLevel, typeScores:typeScores,typeKind:this.typeKind} 
        }
        return false
    }, 
    getIdxsIfHas:function(c_sortedIdx54sExcludeLazi, c_sortedIdx54sOfLaizi, typeScores, typeIdx)
    {           
        var len = typeIdx - this.typeIdx
        if(len==1)
        {   
            var num = gameLogic.scores2Num(typeScores)
            var minCardNum = num
            var maxCardNum = num
            var someCardNums_sorted = [num, num, num]
        }
        else
        {
            var minCardNum = typeScores-1 + this.minCardNum
            var maxCardNum = minCardNum + len - 1
            var someCardNums_sorted = cardLogic.sortWithNum( cardLogic.getContinueCardNums(minCardNum, len, 3) )
        }
        
        var isHas = cardLogic.isHas(c_sortedIdx54sExcludeLazi, c_sortedIdx54sOfLaizi, someCardNums_sorted)
        var san = isHas[0]
        if(!san)
            return false

        if(cardLogic.getNum(san[san.length-1]) == 13 && 
            cardLogic.getNum(san[0]) == 1)
        {
            var s = san.splice(0, 3)
            san = san.concat(s)
        }
        san = cardLogic.getReverseArray(san)

        if(this.type == 0)
            return san

        var remained = isHas[1]
        var sortedIdx54sExcludeLazi_remain = remained[0]
        var sortedIdx54sOfLaizi_remain = remained[1]

        var yi = []

        switch(this.type)
        {
            case 1:
            {
                var t = []
                for(var typeScores=15;typeScores>0;typeScores--)
                {
                    for(;;)
                    {
                        var num = gameLogic.scores2Num(typeScores)
                        var someCardNums_sorted = [num]
                        var isHas = cardLogic.isHas(sortedIdx54sExcludeLazi_remain, sortedIdx54sOfLaizi_remain, someCardNums_sorted)
                        var idxs = isHas[0]
                        var bool = idxs && ( cardLogic.getNum(idxs[0])<minCardNum || cardLogic.getNum(idxs[0])>maxCardNum )
                        bool = bool && !(cardLogic.getNum(idxs[0]) == 1 && maxCardNum == 14)
                        if( bool )
                        {
                            yi[yi.length] = idxs
                            sortedIdx54sExcludeLazi_remain = isHas[1][0]
                            sortedIdx54sOfLaizi_remain = isHas[1][1]
                        }
                        else
                            break
                    }
                }
                // for(var typeScores=15;typeScores>0;typeScores--)
                // {
                //     var num = gameLogic.scores2Num(typeScores)
                //     var someCardNums_sorted = [num]
                //     var isHas = cardLogic.isHas(sortedIdx54sExcludeLazi_remain, sortedIdx54sOfLaizi_remain, someCardNums_sorted)
                //     var idxs = isHas[0]

                //     var bool = idxs && ( cardLogic.getNum(idxs[0])<minCardNum || cardLogic.getNum(idxs[0])>maxCardNum )
                //     bool = bool && !(cardLogic.getNum(idxs[0]) == 1 && maxCardNum == 14)
                //     if( bool )
                //     {
                //         yi[yi.length] = idxs
                //         sortedIdx54sExcludeLazi_remain = isHas[1][0]
                //         sortedIdx54sOfLaizi_remain = isHas[1][1]
                //     }
                // }
                yi = cardLogic.getReverseArray(yi)
                break
            }
            case 2:
            {
                for(var typeScores=1;typeScores<14;typeScores++)
                {
                    var num = gameLogic.scores2Num(typeScores)
                    var someCardNums_sorted = [num, num]
                    var isHas = cardLogic.isHas(sortedIdx54sExcludeLazi_remain, sortedIdx54sOfLaizi_remain, someCardNums_sorted)
                    var idxs = isHas[0]
                    var bool = idxs && ( cardLogic.getNum(idxs[0])<minCardNum || cardLogic.getNum(idxs[0])>maxCardNum )
                    bool = bool && !(cardLogic.getNum(idxs[0]) == 1 && maxCardNum == 14)
                    if( bool )
                    {
                        yi[yi.length] = idxs
                        sortedIdx54sExcludeLazi_remain = isHas[1][0]
                        sortedIdx54sOfLaizi_remain = isHas[1][1]
                    }
                }
                break
            }
            case 3:
            {
                var t = []
                for(var typeScores=15;typeScores>0;typeScores--)
                {
                    for(;;)
                    {
                        var num = gameLogic.scores2Num(typeScores)
                        var someCardNums_sorted = [num]
                        var isHas = cardLogic.isHas(sortedIdx54sExcludeLazi_remain, sortedIdx54sOfLaizi_remain, someCardNums_sorted)
                        var idxs = isHas[0]
                        var bool = idxs && ( cardLogic.getNum(idxs[0])<minCardNum || cardLogic.getNum(idxs[0])>maxCardNum )
                        bool = bool && !(cardLogic.getNum(idxs[0]) == 1 && maxCardNum == 14)
                        if( bool )
                        {
                            t[t.length] = idxs
                            sortedIdx54sExcludeLazi_remain = isHas[1][0]
                            sortedIdx54sOfLaizi_remain = isHas[1][1]
                        }
                        else
                            break
                    }
                }
                var item = []
                for(var i=t.length-1;i>=0;i--)
                {
                    item[item.length] = t[i][0]
                    if(item.length == 2)
                    {
                        yi[yi.length] = item
                        item = []
                    }
                }
                break
            }
        }

        if(yi.length<len)
            return false

        var y = []
        for(var i=0;i<len;i++)
        {
            y = y.concat(yi[i])
        }
        y = cardLogic.getReverseArray(y)
        var idxs = san.concat(y)
        return idxs
    }
}

cardsParserConf[4] = 
{   
    typeLevel:0,
    typeKind:0,
    typeIdx:0,
    id:4,
    name:'炸弹',
    length:4, 
    type:0,//0带不带癞子都算 1不能带癞子（硬炸） 2必须带癞子（软炸）
    getType:function(typeScores)
    {
        if(typeScores>13 || typeScores < 1)
            return false
        else 
            return {typeIdx:this.typeIdx, typeLevel:this.typeLevel, typeScores:typeScores,typeKind:this.typeKind}
    },
    parser:function(c_sortedIdx54sExcludeLazi, c_sortedIdx54sOfLaizi)
    {
        var l = c_sortedIdx54sExcludeLazi.length + c_sortedIdx54sOfLaizi.length
        var is = true
        is = l == this.length
        if(!is)
            return false
        for(var typeScores=13;typeScores>=1;typeScores--)
        {
            if(!this.getType(typeScores))
                continue
            var idxs = this.getIdxsIfHas(c_sortedIdx54sExcludeLazi, c_sortedIdx54sOfLaizi, typeScores)
            if(idxs)
              return {id:this.id, idxs:idxs, typeIdx:this.typeIdx, typeLevel:this.typeLevel, typeScores:typeScores,typeKind:this.typeKind} 
        }
        return false
    },  
    getIdxsIfHas:function(c_sortedIdx54sExcludeLazi, c_sortedIdx54sOfLaizi, typeScores)
    {
        for(var num=0;num<16;num++)
        {
            if ( gameLogic.num2Scores[num] == typeScores)
                break
        }

        var someCardNums_sorted = []
        for(var i=0;i<this.length;i++)
        {   
            someCardNums_sorted[i] = num
        }
        var isHas = cardLogic.isHas(c_sortedIdx54sExcludeLazi, c_sortedIdx54sOfLaizi, someCardNums_sorted)
        var idxs = isHas[0]
       
        if(!idxs)
            return false

        var remained = isHas[1]
        var sortedIdx54sExcludeLazi_remain = remained[0]
        var sortedIdx54sOfLaizi_remain = remained[1]  

        var usedLaziNum = c_sortedIdx54sOfLaizi.length-sortedIdx54sOfLaizi_remain.length
        var isYinzha = usedLaziNum == 0 || usedLaziNum == this.length

        if(this.type==1 && !isYinzha)
            return false

        if(this.type==2 && isYinzha)
            return false
        idxs = cardLogic.getReverseArray(idxs)
        return idxs
    }
}

cardsParserConf[5] = 
{   
    typeLevel:0,
    typeKind:0,
    typeIdx:0,
    id:5,
    name:'王炸',
    type:0,//0王炸(2) 1天王炸(4张)
    typeIdx:0,
    getType:function(typeScores)
    {
        if(typeScores>1 || typeScores < 1)
            return false
        else 
            return {typeIdx:this.typeIdx, typeLevel:this.typeLevel, typeScores:typeScores,typeKind:this.typeKind}
    },
    parser:function(c_sortedIdx54sExcludeLazi, c_sortedIdx54sOfLaizi)
    {
        var l = c_sortedIdx54sExcludeLazi.length + c_sortedIdx54sOfLaizi.length
        var is = true
        var length
        switch(this.type)
        {
            case 0:
            {
                length = 2
                break
            }
            case 1:
            {
                length = 4
                break
            }
        }
        is = l == length
        if(!is)
            return false

        var idxs = this.getIdxsIfHas(c_sortedIdx54sExcludeLazi, c_sortedIdx54sOfLaizi)
        if(idxs)
            return {id:this.id, idxs:idxs, typeIdx:this.typeIdx, typeLevel:this.typeLevel, typeScores:1,typeKind:this.typeKind} 
        
        return false
    },  
    getIdxsIfHas:function(c_sortedIdx54sExcludeLazi, c_sortedIdx54sOfLaizi)
    {
        var t = c_sortedIdx54sExcludeLazi.concat(c_sortedIdx54sOfLaizi)
        var _78Num = 0
        var _79Num = 0
        for(var i=0;i<t.length;i++)
        {
            if(t[i] == 78)
                _78Num = _78Num + 1

            if(t[i] == 79)
                _79Num = _79Num + 1
        }

        switch(this.type)
        {
            case 0:
            {
                if(_78Num>0 && _79Num>0 )
                    return [79, 78]
                break
            }
            case 1:
            {
                if(_78Num>1 && _79Num>1 )
                    return [79, 79, 78, 78]
                break
            }
        }
        return false
    }
}
////////////parserConf end//////








// 就出第一张 对子的话就出前两张 
gameLogic.getTipsArrayForFirstOut = function(handCardIdxs)
{
    var beginIdxs = [handCardIdxs[0]]
    for(var i=1;i<5;i++)
    {
        if( cardLogic.isSameNum([beginIdxs[0], handCardIdxs[i]] ) )
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

    return tipsArray
}

/////////////////
gameLogic.num2Scores  = 
[
    0,
    10,
    11,
    13,
    1,
    2,
    3,
    4,
    12,
    5,
    6,
    7,
    8,
    9,
    14,
    15
]

var cardType1 = 
{
    id:101,
    name:'小王3821',
    getType:function(typeScores)
    {
        if(typeScores>1 || typeScores < 1)
            return false
        else 
            return {typeIdx:this.typeIdx, typeLevel:this.typeLevel, typeScores:typeScores,typeKind:this.typeKind}
    },
    parser:function(c_sortedIdx54sExcludeLazi, c_sortedIdx54sOfLaizi)
    {
        var l = c_sortedIdx54sExcludeLazi.length + c_sortedIdx54sOfLaizi.length
        var is = true
        is = l == 5
        if(!is)
            return false

        var idxs = this.getIdxsIfHas(c_sortedIdx54sExcludeLazi, c_sortedIdx54sOfLaizi)
        if(idxs)
            return {id:this.id, idxs:idxs, typeIdx:this.typeIdx, typeLevel:this.typeLevel, typeScores:1,typeKind:this.typeKind} 
        
        return false
    },
    getIdxsIfHas:function(c_sortedIdx54sExcludeLazi, c_idx54sOfLaizi)
    {
        //小王不能用癞子来代替
        var hasXiaoWang = false
        var sortedIdx54sExcludeLazi = clone(c_sortedIdx54sExcludeLazi)
        for(var i in sortedIdx54sExcludeLazi)
        {
            if(sortedIdx54sExcludeLazi[i] == 78)
            {
                hasXiaoWang = true
                sortedIdx54sExcludeLazi.splice(i,1)
                break
            }
        }

        var idx54sOfLaizi = clone(c_idx54sOfLaizi)
        for(var i in idx54sOfLaizi)
        {
            if(idx54sOfLaizi[i] == 78)
            {
                hasXiaoWang = true
                idx54sOfLaizi.splice(i,1)
                break
            }
        }
        if(!hasXiaoWang)
            return false

        var someCardNums_sorted = [1, 2, 3, 8]
        var isHas = cardLogic.isHas(sortedIdx54sExcludeLazi, idx54sOfLaizi, someCardNums_sorted)
        var idxs = isHas[0]
        if(!idxs)
            return false

        idxs[idxs.length] = 78
        gameLogic.sortIdxsWithScore(idxs, []) 
        idxs = cardLogic.getReverseArray(idxs)

        return idxs
    }

}

var cardType2 = 
{
    name:'大王3821',
    id:102,
    getType:function(typeScores)
    {
        if(typeScores>1 || typeScores < 1)
            return false
        else 
            return {typeIdx:this.typeIdx, typeLevel:this.typeLevel, typeScores:typeScores,typeKind:this.typeKind}
    },
    parser:function(c_sortedIdx54sExcludeLazi, c_sortedIdx54sOfLaizi)
    {
        var l = c_sortedIdx54sExcludeLazi.length + c_sortedIdx54sOfLaizi.length
        var is = true
        is = l == 5
        if(!is)
            return false

        var idxs = this.getIdxsIfHas(c_sortedIdx54sExcludeLazi, c_sortedIdx54sOfLaizi)
        if(idxs)
            return {id:this.id, idxs:idxs, typeIdx:this.typeIdx, typeLevel:this.typeLevel, typeScores:1,typeKind:this.typeKind} 
        
        return false
    },
    getIdxsIfHas:function(c_sortedIdx54sExcludeLazi, c_idx54sOfLaizi)
    {
        //大王不能用癞子来代替
        var hasDaWang = false
        var sortedIdx54sExcludeLazi = clone(c_sortedIdx54sExcludeLazi)
        for(var i in sortedIdx54sExcludeLazi)
        {
            if(sortedIdx54sExcludeLazi[i] == 79)
            {
                hasDaWang = true
                sortedIdx54sExcludeLazi.splice(i,1)
                break
            }
        }

        var idx54sOfLaizi = clone(c_idx54sOfLaizi)
        for(var i in idx54sOfLaizi)
        {
            if(idx54sOfLaizi[i] == 79)
            {
                hasDaWang = true
                idx54sOfLaizi.splice(i,1)
                break
            }
        }
        if(!hasDaWang)
            return false

        var someCardNums_sorted = [1, 2, 3, 8]
        var isHas = cardLogic.isHas(sortedIdx54sExcludeLazi, idx54sOfLaizi, someCardNums_sorted)
        var idxs = isHas[0]
        if(!idxs)
            return false

        idxs[idxs.length] = 79
        gameLogic.sortIdxsWithScore(idxs, []) 
        idxs = cardLogic.getReverseArray(idxs)

        return idxs
    }
}

gameLogic.initCardsParser(
[ 
    [
        {id:1, minLen:1, maxLen:1, minCardNum:1, maxCardNum:15},
        {id:1, minLen:3, maxLen:13, minCardNum:1},
        {id:2, minLen:1, maxLen:1, minCardNum:1, maxCardNum:13},
        {id:2, minLen:2, maxLen:13, minCardNum:1},
    ], 
    [
        {id:3, minLen:1, maxLen:1, minCardNum:1, maxCardNum:13},
    ], 
    [
        {id:4},
    ], 
    [
        cardType1,
    ], 
    [
        cardType2,
    ], 
    [
        {id:5},
    ], 
])
