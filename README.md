## Slide Up Modal
---------
### DEMO
``` javascript
    document.addEventListener("DOMContentLoaded", function(){
        // init slider
        var slider = new SlideDown({
            trigger: '#trigger',
            title: '底部弹出框测试',
            closeButtonText: '官兵来了',
            onShow: loadData,
            onClose: function(){
                console.log('done');
            }
        }); 
    
        // hide loading indicator after content loaded
        // you can replace you content here
        function loadData(){ 
            setTimeout(function(){
                slider.contentLoaded(function(inner){
                     inner.innerHTML = '<h3> THis is LOADED CONTENT</h3>'; 
                }); 
            }, 1500);
        }
    });
```


### API (as options) 
*  height: default 410px (header 55px, footer: 55px, body: 300px)
*  title: header content,
*  closeButtonText: button text to close the modal
*  trigger: `document.querySelector' to get the trigger
*  onShow: called when the modal shown
*  onHide: called when the modal hidden
*  onContentLoaded: call this func to hide the loading indicator, the modal body will be passed back as param, as callback(inner)


### happy to enjoy !
