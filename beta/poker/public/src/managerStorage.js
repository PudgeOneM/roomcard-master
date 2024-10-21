
function setCookie(c_name,value,expiredays,domain,path)
{
    expiredays = expiredays || 0
    domain = domain || window.location.href
    path = path || '/'

    var exdate = new Date()
    exdate.setDate(exdate.getDate() + expiredays)
    document.cookie = c_name + "=" + escape(value) + ";expires=" + 
    exdate.toGMTString() + ";domain=" + domain + ";path=" + path
}


function getCookie(c_name)
{
    if(document.cookie.length > 0)
    {
        c_start = document.cookie.indexOf(c_name + "=")
     
        if(c_start != -1)
        {
            c_start = c_start + c_name.length + 1
            c_end = document.cookie.indexOf(";", c_start)
            if(c_end == -1)
                c_end = document.cookie.length
        
            return unescape(document.cookie.substring(c_start,c_end))
        }
    }
    
    return ""
}

function setLocalStorage(c_name, value)
{
    try
    {
      localStorage[c_name] = value
    }
    catch(e)
    {
      localStorage.clear()
      localStorage[c_name] = value
    }
}

function getLocalStorage(c_name)
{
    return localStorage[c_name]
}




















