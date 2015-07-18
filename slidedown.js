/*
 *   by duanhong @ 2015-07-17   
 *
 *   SlideDown 底部弹出浮动框组件
 *
 *  ----------------------------------------------------- 
 *
 *  document.addEventListener("DOMContentLoaded", function(){
 *      // init slider
 *      var slider = new SlideDown({
 *          trigger: '#test-trigger',
 *          title: '底部弹出框测试',
 *          closeButtonText: '官兵来了',
 *          onHide: function(){
 *              console.log('done');
 *          }
 *      }); 
 *
 *      // hide loading indicator after content loaded
 *      // you can replace you content here
 *
 *      slider.contentLoaded(function(inner){
 *           inner.innerHTML = '<h3> THis is LOADED CONTENT</h3>'; 
 *      }); 
 * });
 */


!function(name, context, definition) {
    if( typeof module != 'undefined' && module.exports ) module.exports = definition();
    else if ( typeof define == 'function' && define.amd ) define(definition);
    else context[name] = definition();
}('SlideDown', this, function(){

    /*  
        
        repo: https://github.com/EarMaster/CSSClass 

    */
    ;(function () {
        // add indexOf to Array prototype for IE<8
        // this isn't failsafe, but it works on our behalf
        Array.prototype.CSSClassIndexOf = Array.prototype.indexOf || function (item) {
            var length = this.length;
            for (var i = 0; i<length; i++)
                if (this[i]===item) return i;
            return -1;
        };
        // check if classList interface is available (@see https://developer.mozilla.org/en-US/docs/Web/API/element.classList)
        var cl = ("classList" in document.createElement("a"));
        // actual Element prototype manipulation
        var p = Element.prototype;
        if(cl) {
            if(!p.hasClass)
                p.hasClass = function(c) {
                    var e = Array.prototype.slice.call(this.classList);
                    c = c.split(' ');
                    for(var i=0; i<c.length; i++)
                        if(!this.classList.contains(c[i]))
                            return false;
                    return true;
                };
            if(!p.addClass)
                p.addClass = function(c) {
                    c = c.split(' ');
                    for(var i=0; i<c.length; i++)
                        if(!this.hasClass(c[i]))
                            this.classList.add(c[i]);
                    return this;
                };
            if(!p.removeClass)
                p.removeClass = function(c) {
                    var e = this.className.split(' ');
                    c = c.split(' ');
                    for(var i=0; i<c.length; i++)
                        if(this.hasClass(c[i]))
                            this.classList.remove(c[i]);
                    return this;
                };
            if(!p.toggleClass)
                p.toggleClass = function(c) {
                    c = c.split(' ');
                    for(var i=0; i<c.length; i++)
                        this.classList.toggle(c[i]);
                    return this;
                };
        } else {
            if(!p.hasClass)
                p.hasClass = function(c) {
                    var e = this.className.split(' ');
                    c = c.split(' ');
                    for(var i=0; i<c.length; i++)
                        if(e.CSSClassIndexOf(c[i])===-1)
                            return false;
                    return true;
                };
            if(!p.addClass)
                p.addClass = function(c) {
                    c = c.split(' ');
                    for(var i=0; i<c.length; i++)
                        if(!this.hasClass(c[i]))
                            this.className = this.className!==''?(this.className+' '+c[i]):c[i];
                    return this;
                };
            if(!p.removeClass)
                p.removeClass = function(c) {
                    var e = this.className.split(' ');
                    c = c.split(' ');
                    for(var i=0; i<c.length; i++)
                        if(this.hasClass(c[i]))
                            e.splice(e.CSSClassIndexOf(c[i]), 1);
                    this.className = e.join(' ');
                    return this;
                };
            if(!p.toggleClass)
                p.toggleClass = function(c) {
                    c = c.split(' ');
                    for(var i=0; i<c.length; i++)
                        if (this.hasClass(c[i]))
                            this.removeClass(c[i]);
                        else
                            this.addClass(c[i]);
                    return this;
                };
        }
        var pl = NodeList.prototype;
        if (!pl.hasClass)
            pl.hasClass = function (c, all) {
                if (all===undefined) all = true;
                for (var i=this.length-1; i>=0; --i) {
                    var hc = this[i].hasClass(c);
                    if (all && !hc) return false;
                    if (!all && hc) return true;
                }
                return true;
            };
        if (!pl.addClass)
            pl.addClass = function (c) {
                for (var i=0; i<this.length; ++i)
                    this[i].addClass(c);
            };
        if (!pl.removeClass)
            pl.removeClass = function (c) {
                for (var i=0; i<this.length; ++i)
                    this[i].removeClass(c);
            };
        if (!pl.toggleClass)
            pl.toggleClass = function (c) {
                for (var i=0; i<this.length; ++i)
                    this[i].toggleClass(c);
            };
    })();

    function noop(){}

    function extend(target, source) {
        for(var pro in source) {
            if(pro in target) {
               target[pro] = source[pro] 
            }
        }
    }

    var SlideDown = function(options) {
        var that = this;

        that._options = {
            trigger: '',
            title: '',
            height: 410,
            html: '',
            closeButtonText: '关闭',
            onShow: noop,
            onHide: noop
        };

        extend(that._options, options);
        
        var trigger = document.querySelector(that._options.trigger);
        if(trigger) {
            trigger.addEventListener('click', function(){
                console.log('122121');
                that.show();
            }, false);
        }
    };

    SlideDown.prototype.show = function(){
        var that = this;

        if(that._container) {
            that._container.removeClass('hide');
            document.body.style.overflow = 'hidden';
            return;
        }

        var container = document.createElement('div'); 
        that._slidedown_id = 'slidedown-container' + (+new Date());
        container.className = 'slidedown-container';
        container.id = that._slidedown_id;
        container.style.height = that._options.height + 'px';
        
        var content = '<div class="slidedown-inner slide-in-down loading">' +
            '<div class="slidedown-header">' +
                '<h3 class="slidedown-title">' + that._options.title + '</h3>' +
            '</div>' +
            '<div class="slidedown-body" style="height:'+(that._options.height-110)+'px;">' +
                that._options.html +
            '</div>' +
            '<div class="slidedown-footer">' + 
                '<a href="javascript:void(0)" class="slidedown-close-btn">' +
                    that._options.closeButtonText +
                '</a>' +
            '</div>' +
        '</div>' +
        '<div class="slidedown-backdrop"></div>';

        container.innerHTML = content;
        that._container = container;
        document.body.appendChild(container);
        
        document.body.addEventListener('click', function(e){
            var target = e.target; 
            if(target.hasClass('slidedown-close-btn') || 
                target.hasClass('slidedown-backdrop')) {
                that.close();
            }
        }, false);
        that._options.onShow && that._options.onShow.call(null);
    };

    SlideDown.prototype.close = function() {
        var that = this;
        var container = that._container;
        var inner = container.firstElementChild;

        that._options.onHide.call(null, container.querySelector('.slidedown-body'));

        inner.addClass('slide-out-down');
        that._timeoutid && clearTimeout(that._timeoutid);
        that._timeoutid = setTimeout(function(){
            inner.removeClass('slide-out-down');
            container.addClass('hide');
        }, 500);
        document.body.removeClass('overflow-hidden');
    };

    SlideDown.prototype.contentLoaded = function(callback){
        var that = this;
        var container = that._container;
        var inner = container.firstElementChild;

        inner.removeClass('loading');
        callback && callback.call(null, inner.querySelector('.slidedown-body'));
    };

    return SlideDown;

});
