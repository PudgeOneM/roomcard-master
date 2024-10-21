
onmessage = function(event) {
    var a = event.data
    startAInstance()
};

function startAInstance()
{   
  self.postMessage('')
  setInterval(function()
  {
    self.postMessage('')
  }, 10000)
}