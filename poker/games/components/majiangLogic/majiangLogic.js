

var majiangLogic = {}

majiangLogic.getNum = function(idx) 
{
    return idx%16
}

majiangLogic.sortWithCardData = function(cardDatas)
{
    cardDatas.sort(function(a,b)
    {   
        return a-b
    })

    return cardDatas
}

majiangLogic.isIncludeSomeIdxs = function(uc_sortedIdxs, someIdxs_sorted) 
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

majiangLogic.isHas = function(c_sortedIdxsExcludeLazi, c_sortedIdxsOfLaizi, someIdxs_sorted)
{
    var arrIdxsOfSortedIdx54s = majiangLogic.isIncludeSomeIdxs(clone(c_sortedIdxsExcludeLazi), someIdxs_sorted) 
    if(!arrIdxsOfSortedIdx54s)
    {
        var arrIdxsOfSortedIdx54s2 = majiangLogic.isIncludeSomeIdxs(clone(c_sortedIdxsOfLaizi), someIdxs_sorted) 
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
                idxs[i] = majiangLogic.getIdx_laiziWithNumAndColor(someIdxs_sorted[i], 0, sortedIdx54sOfLaizi[0]) 
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

///////action start//////
majiangLogic.getSortedActionsWithMask = function(acitonMask)
{
    var actions = []

    if((acitonMask&WIK_REPLACE)!=0)
        actions[actions.length] = WIK_REPLACE

    if((acitonMask&WIK_RIGHT)!=0)
        actions[actions.length] = WIK_RIGHT

    if((acitonMask&WIK_CENTER)!=0)
        actions[actions.length] = WIK_CENTER

    if((acitonMask&WIK_LEFT)!=0)
        actions[actions.length] = WIK_LEFT

    //////
    if((acitonMask&WIK_PENG)!=0)
        actions[actions.length] = WIK_PENG

    if((acitonMask&WIK_GANG)!=0)
        actions[actions.length] = WIK_GANG

    if((acitonMask&WIK_LISTEN)!=0)
        actions[actions.length] = WIK_LISTEN

    if((acitonMask&WIK_CHI_HU)!=0)
        actions[actions.length] = WIK_CHI_HU

    return actions
}


majiangLogic.wik2Name = function(WIK)
{
    switch(WIK)
    {
        case WIK_LEFT:
            return 'chi'
        case WIK_CENTER:
            return 'chi'
        case WIK_RIGHT:
            return 'chi'
        case WIK_PENG:
            return 'peng'
        case WIK_GANG:
            return 'gang'
        case WIK_LISTEN:
            return 'ting'
        case WIK_CHI_HU:
            return 'hu'
        case WIK_REPLACE:
            return 'replace'
    }
}


//////////////////////////////////////////////////////////////////////////
//逻辑掩码
var MASK_COLOR = 0xF0                               //花色掩码
var MASK_VALUE = 0x0F                               //数值掩码

//动作标志
var WIK_NULL = 0x00                             //没有类型
var WIK_LEFT = 0x01                             //左吃类型
var WIK_CENTER = 0x02                               //中吃类型
var WIK_RIGHT = 0x04                                //右吃类型
var WIK_PENG = 0x08                             //碰牌类型
var WIK_GANG = 0x10                             //杠牌类型
var WIK_LISTEN = 0x20                               //听牌类型
var WIK_CHI_HU = 0x40                               //吃胡类型
var WIK_REPLACE = 0x80                              //花牌替换

//////////////////////////////////////////////////////////////////////////

///////action end//////