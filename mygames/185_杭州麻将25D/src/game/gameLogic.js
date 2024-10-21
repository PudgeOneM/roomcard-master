

var gameLogic = {}
gameLogic.isIncludeSomeIdxs = function(uc_sortedIdxs, someIdxs_sorted) 
{
    var arrIdxsOfSortedIdxs = []
    var currentIdxOfSortedIdxs = -1
    var hasAnyOne = false
    for(var i=0;i<someIdxs_sorted.length;i++)
    {
        for(var j=0;j<uc_sortedIdxs.length;j++)
        {
           if( someIdxs_sorted[i] == uc_sortedIdxs[j] ) 
           {
                hasAnyOne = true
                currentIdxOfSortedIdxs = currentIdxOfSortedIdxs + j + 1 
                arrIdxsOfSortedIdxs[i] = currentIdxOfSortedIdxs
                uc_sortedIdxs = uc_sortedIdxs.slice(j+1, uc_sortedIdxs.length)
                break
           }
        }
        if( typeof( arrIdxsOfSortedIdxs[i] ) == 'undefined' )
        {
            arrIdxsOfSortedIdxs[i] = -1
        }
    }

    if(hasAnyOne)
        return arrIdxsOfSortedIdxs 
    else
        return false
}

gameLogic.isHas = function(c_sortedIdxsExcludeLazi, c_sortedIdxsOfLaizi, someIdxs_sorted)
{
    var arrIdxsOfSortedIdx54s = gameLogic.isIncludeSomeIdxs(clone(c_sortedIdxsExcludeLazi), someIdxs_sorted) 
    if(!arrIdxsOfSortedIdx54s)
    {
        var arrIdxsOfSortedIdx54s2 = gameLogic.isIncludeSomeIdxs(clone(c_sortedIdxsOfLaizi), someIdxs_sorted) 
        if(!arrIdxsOfSortedIdx54s2 || c_sortedIdxsOfLaizi.length < someIdxs_sorted.length)
            return [false]
        else
        {
            arrIdxsOfSortedIdx54s = []
            for(var i=0;i<someIdxs_sorted.length;i++)
                arrIdxsOfSortedIdx54s[i] = -1
        }
    }

    var idxs = []
    var sortedIdx54sOfLaizi = clone(c_sortedIdxsOfLaizi).reverse()
    var sortedIdx54sExcludeLazi =  clone(c_sortedIdxsExcludeLazi) 
    for(var i=arrIdxsOfSortedIdx54s.length-1;i>=0;i--)
    {
        var arrIdx = arrIdxsOfSortedIdx54s[i]
        if(arrIdx == -1)
        {
            if(sortedIdx54sOfLaizi.length>0)
            {
                idxs[i] = gameLogic.getIdx_laiziWithNumAndColor(someIdxs_sorted[i], 0, sortedIdx54sOfLaizi[0]) 
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

// ///////action start//////
// gameLogic.getSortedActionsWithMask = function(acitonMask)
// {
//     var actions = []

//     if((acitonMask&WIK_REPLACE)!=0)
//         actions[actions.length] = WIK_REPLACE

//     if((acitonMask&WIK_RIGHT)!=0)
//         actions[actions.length] = WIK_RIGHT

//     if((acitonMask&WIK_CENTER)!=0)
//         actions[actions.length] = WIK_CENTER

//     if((acitonMask&WIK_LEFT)!=0)
//         actions[actions.length] = WIK_LEFT

//     if((acitonMask&WIK_PENG)!=0)
//         actions[actions.length] = WIK_PENG

//     if((acitonMask&WIK_MINGANG)!=0)
//         actions[actions.length] = WIK_MINGANG
    
//     if((acitonMask&WIK_ANGANG)!=0)
//         actions[actions.length] = WIK_ANGANG
    
//     if((acitonMask&WIK_PENGGANG)!=0)
//         actions[actions.length] = WIK_PENGGANG

//     if((acitonMask&WIK_LISTEN)!=0)
//         actions[actions.length] = WIK_LISTEN

//     if((acitonMask&WIK_CHI_HU)!=0)
//         actions[actions.length] = WIK_CHI_HU

//     return actions
// }


// gameLogic.wik2Name = function(WIK)
// {
//     switch(WIK)
//     {
//         case WIK_LEFT:
//             return 'chi'
//         case WIK_CENTER:
//             return 'chi'
//         case WIK_RIGHT:
//             return 'chi'
//         case WIK_PENG:
//             return 'peng'
//         case WIK_MINGANG:
//             return 'mingang'
//         case WIK_ANGANG:
//             return 'angang'    
//         case WIK_PENGGANG:
//             return 'penggang'
//         case WIK_LISTEN:
//             return 'ting'
//         case WIK_CHI_HU:
//             return 'hu'
//         case WIK_REPLACE:
//             return 'replace'
//     }
// }

// ///////action end//////

gameLogic.isMagicCard =function(cardData, cbMagicCardData) 
{
    for(var i=0;i<cbMagicCardData.length;i++)
    {
        if(cardData==cbMagicCardData[i])
            return true
    }

    return false
}

gameLogic.isFlowerCard =function(cardData, cbFlowerCardData) 
{
    for(var i=0;i<cbFlowerCardData.length;i++)
    {
        if(cardData==cbFlowerCardData[i])
            return true
    }

    return false
}

gameLogic.isTingCard =function(cardData, tingData) 
{
    for(var i=0;i<tingData.length;i++)
    {
        if(cardData==tingData[i].cbTingCardData)
            return true
    }
    return false
}

gameLogic.sortWithCardData = function(cardDatas)
{
    cardDatas.sort(function(a,b)
    {   
        return a-b
    })

    return cardDatas
}


gameLogic.analyseCard_Chi = function(handCardDatas, cbProvideCardData)
{
    var weaveItems = []
    if( gameLogic.isHas(handCardDatas, [], [cbProvideCardData-2, cbProvideCardData-1])[0] )
    {
        var weaveItem = clone(tagWeaveItem)
        weaveItem.cbValidCardDatas = [cbProvideCardData-2, cbProvideCardData-1, cbProvideCardData]
        weaveItem.cbWeaveKind = WIK_RIGHT
        weaveItems[weaveItems.length] = weaveItem
    }

    if( gameLogic.isHas(handCardDatas, [], [cbProvideCardData-1, cbProvideCardData+1])[0] )
    {
        var weaveItem = clone(tagWeaveItem)
        weaveItem.cbValidCardDatas = [cbProvideCardData-1, cbProvideCardData, cbProvideCardData+1]
        weaveItem.cbWeaveKind = WIK_CENTER
        weaveItems[weaveItems.length] = weaveItem
    }

    if( gameLogic.isHas(handCardDatas, [], [cbProvideCardData+1, cbProvideCardData+2])[0] )
    {
        var weaveItem = clone(tagWeaveItem)
        weaveItem.cbValidCardDatas = [cbProvideCardData, cbProvideCardData+1, cbProvideCardData+2]
        weaveItem.cbWeaveKind = WIK_LEFT
        weaveItems[weaveItems.length] = weaveItem
    }

    return weaveItems
}


gameLogic.analyseCard_Peng = function(handCardDatas, cbProvideCardData)
{
    var weaveItems = []
    if( gameLogic.isHas(handCardDatas, [], [cbProvideCardData, cbProvideCardData])[0] )
    {
        var weaveItem = clone(tagWeaveItem)
        weaveItem.cbValidCardDatas = [cbProvideCardData, cbProvideCardData, cbProvideCardData]
        weaveItem.cbWeaveKind = WIK_PENG
        weaveItems[weaveItems.length] = weaveItem
    }

    return weaveItems
}

gameLogic.analyseCard_MinGang = function(handCardDatas, cbProvideCardData)
{
    var weaveItems = []
    if( gameLogic.isHas(handCardDatas, [], [cbProvideCardData, cbProvideCardData, cbProvideCardData])[0] )
    {
        var weaveItem = clone(tagWeaveItem)
        weaveItem.cbValidCardDatas = [cbProvideCardData, cbProvideCardData, cbProvideCardData, cbProvideCardData]
        weaveItem.cbWeaveKind = WIK_MINGANG
        weaveItems[weaveItems.length] = weaveItem
    }

    return weaveItems
}


gameLogic.analyseCard_AnGang = function(handCardDatas)
{
    var weaveItems = []

    gameLogic.sortWithCardData(handCardDatas)
    for(var i=0;i<handCardDatas.length;i++)
    {
        var cardData = handCardDatas[i]
        if(gameLogic.isMagicCard(cardData, cmdBaseWorker.cbMagicCardData))
            continue
        if(i>0 && cardData == handCardDatas[i-1])
            continue
        var isHas = gameLogic.isHas(handCardDatas, [], [cardData, cardData, cardData, cardData])
        if(isHas[0])
        {
            var weaveItem = clone(tagWeaveItem)
            weaveItem.cbValidCardDatas = [cardData, cardData, cardData, cardData]
            weaveItem.cbWeaveKind = WIK_ANGANG
            weaveItems[weaveItems.length] = weaveItem
        }
    }  
    
    return weaveItems
}


gameLogic.analyseCard_PengGang = function(weaveItemArray, handCardDatas)
{
    var weaveItems = []

    for(var i=0;i<weaveItemArray.length;i++)
    {
        var weaveItem = weaveItemArray[i]
        if(weaveItem.cbWeaveKind == WIK_PENG)
        {
            if( gameLogic.isHas(handCardDatas, [], [ weaveItem.cbChangeCardDatas[0] ])[0] )
            {
                var weaveItem2 = clone(tagWeaveItem)
                weaveItem2.cbValidCardDatas = [weaveItem.cbChangeCardDatas[0]]
                weaveItem2.cbWeaveKind = WIK_PENGGANG
                weaveItems[weaveItems.length] = weaveItem2 
                break
            }
        }
    } 
    
    return weaveItems
}


gameLogic.sortHandCardDatas = function(cardDatas)//使用前 先将cardData=0过滤掉
{
    return majiangFactory.sortCardDatasWithScore(cardDatas)
}






