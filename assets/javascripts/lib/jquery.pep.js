/*! jquery.pep.js // Brian Gonzalez - @brianmgonzalez // v0.5.6 // 2013-09-08 */
!function(a,b,c){"use strict";var d="pep";var e={initiate:function(){},start:function(){},drag:function(){},stop:function(){},rest:function(){},callIfNotStarted:["stop","rest"],startThreshold:[0,0],grid:[1,1],debug:false,activeClass:"pep-active",multiplier:1,velocityMultiplier:1.9,shouldPreventDefault:true,allowDragEventPropagation:true,stopEvents:"",hardwareAccelerate:true,useCSSTranslation:true,disableSelect:true,cssEaseString:"cubic-bezier(0.190, 1.000, 0.220, 1.000)",cssEaseDuration:750,shouldEase:true,droppable:false,droppableActiveClass:"pep-dpa",overlapFunction:false,constrainTo:false,removeMargins:true,place:true,deferPlacement:false,axis:null,forceNonCSS3Movement:false};function f(b,c){this.name=d;this.el=b;this.$el=a(b);this.defaults=e;this.options=a.extend({},this.defaults,c);this.$document=a(this.$el[0].ownerDocument);this.$body=this.$document.find("body");this.moveTrigger="MSPointerMove touchmove mousemove";this.startTrigger="MSPointerDown touchstart mousedown";this.stopTrigger="MSPointerUp touchend mouseup";this.stopEvents=[this.stopTrigger,this.options.stopEvents].join(" ");if(this.options.constrainTo==="parent"){this.$container=this.$el.parent()}else if(this.options.constrainTo==="window"){this.$container=this.$document}if(this.isPointerEventCompatible())this.applyMSDefaults();this.CSSEaseHash=this.getCSSEaseHash();this.scale=1;this.started=false;this.disabled=false;this.resetVelocityQueue();this.init()}f.prototype.init=function(){var a=this;if(this.options.debug)this.buildDebugDiv();if(this.options.disableSelect)this.disableSelect();if(this.options.place&&!this.options.deferPlacement){this.positionParent();this.placeObject()}this.ev={};this.pos={};this.subscribe()};f.prototype.subscribe=function(){var a=this;this.$el.on(this.startTrigger,function(b){a.handleStart(b)});this.$document.on(this.stopEvents,function(b){a.handleStop(b)});this.$document.on(this.moveTrigger,function(b){a.moveEvent=b})};f.prototype.handleStart=function(b){var c=this;if(this.isValidMoveEvent(b)&&!this.disabled){if(this.isPointerEventCompatible()&&b.preventManipulation)b.preventManipulation();b=this.normalizeEvent(b);if(this.options.place&&this.options.deferPlacement){this.positionParent();this.placeObject()}this.log({type:"event",event:b.type});if(this.options.hardwareAccelerate&&!this.hardwareAccelerated){this.hardwareAccelerate();this.hardwareAccelerated=true}var d=this.options.initiate.call(this,b,this);if(d===false)return;clearTimeout(this.restTimeout);this.$el.addClass(this.options.activeClass);this.removeCSSEasing();this.startX=this.ev.x=b.pep.x;this.startY=this.ev.y=b.pep.y;this.startEvent=this.moveEvent=b;this.active=true;if(this.options.shouldPreventDefault)b.preventDefault();if(!this.options.allowDragEventPropagation)b.stopPropagation();!function e(){if(!c.active)return;c.handleMove();c.requestAnimationFrame(e)}(a,c)}};f.prototype.handleMove=function(){if(typeof this.moveEvent==="undefined")return;var a=this.normalizeEvent(this.moveEvent);var c=b.parseInt(a.pep.x/this.options.grid[0])*this.options.grid[0];var d=b.parseInt(a.pep.y/this.options.grid[1])*this.options.grid[1];this.addToLIFO({time:a.timeStamp,x:c,y:d});var e,f;if(this.startTrigger.split(" ").indexOf(a.type)>-1){e=0;f=0}else{e=c-this.ev.x;f=d-this.ev.y}this.dx=e;this.dy=f;this.ev.x=c;this.ev.y=d;if(e===0&&f===0){this.log({type:"event",event:"** stopped **"});return}var g=Math.abs(this.startX-c);var h=Math.abs(this.startY-d);if(!this.started&&(g>this.options.startThreshold[0]||h>this.options.startThreshold[1])){this.started=true;this.$el.addClass("pep-start");this.options.start.call(this,this.startEvent,this)}if(this.options.droppable){this.calculateActiveDropRegions()}var i=this.options.drag.call(this,a,this);if(i===false){this.resetVelocityQueue();return}this.log({type:"event",event:a.type});this.log({type:"event-coords",x:this.ev.x,y:this.ev.y});this.log({type:"velocity"});var j=this.handleConstraint(e,f);if(!this.shouldUseCSSTranslation()){var k=e>=0?"+="+Math.abs(e/this.scale)*this.options.multiplier:"-="+Math.abs(e/this.scale)*this.options.multiplier;var l=f>=0?"+="+Math.abs(f/this.scale)*this.options.multiplier:"-="+Math.abs(f/this.scale)*this.options.multiplier;if(this.options.constrainTo){k=j.x!==false?j.x:k;l=j.y!==false?j.y:l}this.moveTo(k,l)}else{e=e/this.scale*this.options.multiplier;f=f/this.scale*this.options.multiplier;if(this.options.constrainTo){e=j.x===false?e:0;f=j.y===false?f:0}this.moveToUsingTransforms(e,f)}};f.prototype.handleStop=function(a){if(!this.active)return;this.log({type:"event",event:a.type});this.active=false;this.$el.removeClass("pep-start").addClass("pep-ease");if(this.options.droppable){this.calculateActiveDropRegions()}if(this.options.shouldEase)this.ease(a,this.started);if(this.started||!this.started&&this.options.callIfNotStarted.indexOf("stop")>-1){this.options.stop.call(this,a,this)}this.started=false;this.resetVelocityQueue()};f.prototype.ease=function(a,b){var c=this.$el.position();var d=this.velocity();var e=this.dt;var f=d.x/this.scale*this.options.multiplier;var g=d.y/this.scale*this.options.multiplier;var h=this.handleConstraint(f,g);if(this.cssAnimationsSupported())this.$el.css(this.getCSSEaseHash());var i=d.x>0?"+="+f:"-="+Math.abs(f);var j=d.y>0?"+="+g:"-="+Math.abs(g);if(this.options.constrainTo){i=h.x!==false?h.x:i;j=h.y!==false?h.y:j}var k=!this.cssAnimationsSupported()||this.options.forceNonCSS3Movement;this.moveTo(i,j,k);var l=this;this.restTimeout=setTimeout(function(){if(l.options.droppable){l.calculateActiveDropRegions()}if(b||!b&&l.options.callIfNotStarted.indexOf("rest")>-1){l.options.rest.call(l,a,l)}l.$el.removeClass([l.options.activeClass,"pep-ease"].join(" "))},this.options.cssEaseDuration)};f.prototype.normalizeEvent=function(a){a.pep={};if(this.isPointerEventCompatible()||!this.isTouch(a)){a.pep.x=a.originalEvent.pageX;a.pep.y=a.originalEvent.pageY;a.pep.type=a.type}else{a.pep.x=a.originalEvent.touches[0].pageX;a.pep.y=a.originalEvent.touches[0].pageY;a.pep.type=a.type}return a};f.prototype.resetVelocityQueue=function(){this.velocityQueue=new Array(5)};f.prototype.moveTo=function(a,b,c){c=c===false||typeof c==="undefined"?false:true;if(this.options.axis==="x"){b="+=0"}else if(this.options.axis==="y"){a="+=0"}var d=200;this.log({type:"delta",x:a,y:b});if(c){this.$el.animate({top:b,left:a},d,"easeOutQuad",{queue:false})}else{this.$el.stop(true,false).css({top:b,left:a})}};f.prototype.moveToUsingTransforms=function(a,b){if(this.options.axis==="x")b=0;if(this.options.axis==="y")a=0;var c=this.matrixToArray(this.matrixString());if(!this.cssX)this.cssX=parseInt(c[4],10);if(!this.cssY)this.cssY=parseInt(c[5],10);this.cssX=this.cssX+a;this.cssY=this.cssY+b;this.log({type:"delta",x:a,y:b});c[4]=this.cssX;c[5]=this.cssY;this.translation=this.arrayToMatrix(c);this.$el.css({"-webkit-transform":this.translation,"-moz-transform":this.translation,"-ms-transform":this.translation,"-o-transform":this.translation,transform:this.translation})};f.prototype.matrixString=function(){var a=function(a){return!(!a||a==="none"||a.indexOf("matrix")===-1)};var b="matrix(1, 0, 0, 1, 0, 0)";if(a(this.$el.css("-webkit-transform")))b=this.$el.css("-webkit-transform");if(a(this.$el.css("-moz-transform")))b=this.$el.css("-moz-transform");if(a(this.$el.css("-ms-transform")))b=this.$el.css("-ms-transform");if(a(this.$el.css("-o-transform")))b=this.$el.css("-o-transform");if(a(this.$el.css("transform")))b=this.$el.css("transform");return b};f.prototype.matrixToArray=function(a){return a.split("(")[1].split(")")[0].split(",")};f.prototype.arrayToMatrix=function(a){return"matrix("+a.join(",")+")"};f.prototype.addToLIFO=function(a){var b=this.velocityQueue;b=b.slice(1,b.length);b.push(a);this.velocityQueue=b};f.prototype.velocity=function(){var a=0;var b=0;for(var c=0;c<this.velocityQueue.length-1;c++){if(this.velocityQueue[c]){a+=this.velocityQueue[c+1].x-this.velocityQueue[c].x;b+=this.velocityQueue[c+1].y-this.velocityQueue[c].y;this.dt=this.velocityQueue[c+1].time-this.velocityQueue[c].time}}return{x:a*this.options.velocityMultiplier,y:b*this.options.velocityMultiplier}};f.prototype.requestAnimationFrame=function(a){return b.requestAnimationFrame&&b.requestAnimationFrame(a)||b.webkitRequestAnimationFrame&&b.webkitRequestAnimationFrame(a)||b.mozRequestAnimationFrame&&b.mozRequestAnimationFrame(a)||b.oRequestAnimationFrame&&b.mozRequestAnimationFrame(a)||b.msRequestAnimationFrame&&b.msRequestAnimationFrame(a)||b.setTimeout(a,1e3/60)};f.prototype.positionParent=function(){if(!this.options.constrainTo||this.parentPositioned)return;this.parentPositioned=true;if(this.options.constrainTo==="parent"){this.$container.css({position:"relative"})}else if(this.options.constrainTo==="window"&&this.$container.get(0).nodeName!=="#document"&&this.$container.css("position")!=="static"){this.$container.css({position:"static"})}};f.prototype.placeObject=function(){if(this.objectPlaced)return;this.objectPlaced=true;this.offset=this.options.constrainTo==="parent"||this.hasNonBodyRelative()?this.$el.position():this.$el.offset();if(parseInt(this.$el.css("left"),10))this.offset.left=this.$el.css("left");if(parseInt(this.$el.css("top"),10))this.offset.top=this.$el.css("top");if(this.options.removeMargins)this.$el.css({margin:0});this.$el.css({position:"absolute",top:this.offset.top,left:this.offset.left})};f.prototype.hasNonBodyRelative=function(){return this.$el.parents().filter(function(){var b=a(this);return b.is("body")||b.css("position")==="relative"}).length>1};f.prototype.setScale=function(a){this.scale=a};f.prototype.setMultiplier=function(a){this.options.multiplier=a};f.prototype.removeCSSEasing=function(){if(this.cssAnimationsSupported())this.$el.css(this.getCSSEaseHash(true))};f.prototype.disableSelect=function(){this.$el.css({"-webkit-touch-callout":"none","-webkit-user-select":"none","-khtml-user-select":"none","-moz-user-select":"none","-ms-user-select":"none","user-select":"none"})};f.prototype.handleConstraint=function(b,d){var e=this.$el.position();this.pos.x=e.left;this.pos.y=e.top;var f={x:false,y:false};var g,h,i,j;this.log({type:"pos-coords",x:this.pos.x,y:this.pos.y});if(a.isArray(this.options.constrainTo)){if(this.options.constrainTo[3]!==c&&this.options.constrainTo[1]!==c){h=this.options.constrainTo[1];i=this.options.constrainTo[3]}if(this.options.constrainTo[0]!==false&&this.options.constrainTo[2]!==false){g=this.options.constrainTo[2];j=this.options.constrainTo[0]}if(this.pos.x+b<i)f.x=i;if(this.pos.y+d<j)f.y=j}else if(typeof this.options.constrainTo==="string"){h=this.$container.width()-this.$el.outerWidth();g=this.$container.height()-this.$el.outerHeight();if(this.pos.x+b<0)f.x=0;if(this.pos.y+d<0)f.y=0}if(this.pos.x+b>h)f.x=h;if(this.pos.y+d>g)f.y=g;return f};f.prototype.getCSSEaseHash=function(a){if(typeof a==="undefined")a=false;var b;if(a){b=""}else if(this.CSSEaseHash){return this.CSSEaseHash}else{b=["all",this.options.cssEaseDuration+"ms",this.options.cssEaseString].join(" ")}return{"-webkit-transition":b,"-moz-transition":b,"-ms-transition":b,"-o-transition":b,transition:b}};f.prototype.calculateActiveDropRegions=function(){var b=this;this.activeDropRegions=[];a.each(a(this.options.droppable),function(c,d){var e=a(d);if(b.isOverlapping(e,b.$el)){e.addClass(b.options.droppableActiveClass);b.activeDropRegions.push(e)}else{e.removeClass(b.options.droppableActiveClass)}})};f.prototype.isOverlapping=function(a,b){if(this.options.overlapFunction){return this.options.overlapFunction(a,b)}var c=a[0].getBoundingClientRect();var d=b[0].getBoundingClientRect();return!(c.right<d.left||c.left>d.right||c.bottom<d.top||c.top>d.bottom)};f.prototype.isTouch=function(a){return a.type.search("touch")>-1};f.prototype.isPointerEventCompatible=function(){return"MSPointerEvent"in b};f.prototype.applyMSDefaults=function(a){this.$body.css({"-ms-touch-action":"none","touch-action":"none","-ms-scroll-chaining":"none","-ms-scroll-limit":"0 0 0 0",overflow:"hidden"})};f.prototype.isValidMoveEvent=function(a){return!this.isTouch(a)||this.isTouch(a)&&a.originalEvent.touches&&a.originalEvent.touches.length===1};f.prototype.shouldUseCSSTranslation=function(){if(typeof this.useCSSTranslation!=="undefined")return this.useCSSTranslation;var a=false;if(!this.options.useCSSTranslation||typeof Modernizr!=="undefined"&&!Modernizr.csstransforms){a=false}else{a=true}this.useCSSTranslation=a;return a};f.prototype.cssAnimationsSupported=function(){if(typeof this.cssAnimationsSupport!=="undefined"){return this.cssAnimationsSupport}if(typeof Modernizr!=="undefined"&&Modernizr.cssanimations){this.cssAnimationsSupport=true;return true}var a=false,b=document.createElement("div"),d="animation",e="",f="Webkit Moz O ms Khtml".split(" "),g="";if(b.style.animationName){a=true}if(a===false){for(var h=0;h<f.length;h++){if(b.style[f[h]+"AnimationName"]!==c){g=f[h];d=g+"Animation";e="-"+g.toLowerCase()+"-";a=true;break}}}this.cssAnimationsSupport=a;return a};f.prototype.hardwareAccelerate=function(){this.$el.css({"-webkit-perspective":1e3,perspective:1e3,"-webkit-backface-visibility":"hidden","backface-visibility":"hidden"})};f.prototype.getMovementValues=function(){return{ev:this.ev,pos:this.pos,velocity:this.velocity()}};f.prototype.buildDebugDiv=function(){var b;if(a("#pep-debug").length===0){b=a("<div></div>");b.attr("id","pep-debug").append("<div style='font-weight:bold; background: red; color: white;'>DEBUG MODE</div>").append("<div id='pep-debug-event'>no event</div>").append("<div id='pep-debug-ev-coords'>event coords: <span class='pep-x'>-</span>, <span class='pep-y'>-</span></div>").append("<div id='pep-debug-pos-coords'>position coords: <span class='pep-x'>-</span>, <span class='pep-y'>-</span></div>").append("<div id='pep-debug-velocity'>velocity: <span class='pep-x'>-</span>, <span class='pep-y'>-</span></div>").append("<div id='pep-debug-delta'>&Delta; movement: <span class='pep-x'>-</span>, <span class='pep-y'>-</span></div>").css({position:"fixed",bottom:5,right:5,zIndex:99999,textAlign:"right",fontFamily:"Arial, sans",fontSize:10,border:"1px solid #DDD",padding:"3px",background:"white",color:"#333"})}var c=this;setTimeout(function(){c.debugElements={$event:a("#pep-debug-event"),$velocityX:a("#pep-debug-velocity .pep-x"),$velocityY:a("#pep-debug-velocity .pep-y"),$dX:a("#pep-debug-delta .pep-x"),$dY:a("#pep-debug-delta .pep-y"),$evCoordsX:a("#pep-debug-ev-coords .pep-x"),$evCoordsY:a("#pep-debug-ev-coords .pep-y"),$posCoordsX:a("#pep-debug-pos-coords .pep-x"),$posCoordsY:a("#pep-debug-pos-coords .pep-y")}},0);a("body").append(b)};f.prototype.log=function(a){if(!this.options.debug)return;switch(a.type){case"event":this.debugElements.$event.text(a.event);break;case"pos-coords":this.debugElements.$posCoordsX.text(a.x);this.debugElements.$posCoordsY.text(a.y);break;case"event-coords":this.debugElements.$evCoordsX.text(a.x);this.debugElements.$evCoordsY.text(a.y);break;case"delta":this.debugElements.$dX.text(a.x);this.debugElements.$dY.text(a.y);break;case"velocity":var b=this.velocity();this.debugElements.$velocityX.text(Math.round(b.x));this.debugElements.$velocityY.text(Math.round(b.y));break}};f.prototype.toggle=function(a){if(typeof a==="undefined"){this.disabled=!this.disabled}else{this.disabled=!a}};a.extend(a.easing,{easeOutQuad:function(a,b,c,d,e){return-d*(b/=e)*(b-2)+c},easeOutCirc:function(a,b,c,d,e){return d*Math.sqrt(1-(b=b/e-1)*b)+c},easeOutExpo:function(a,b,c,d,e){return b===e?c+d:d*(-Math.pow(2,-10*b/e)+1)+c}});a.fn[d]=function(b){return this.each(function(){if(!a.data(this,"plugin_"+d)){var c=new f(this,b);a.data(this,"plugin_"+d,c);a.pep.peps.push(c)}})};a.pep={};a.pep.peps=[];a.pep.toggleAll=function(b){a.each(this.peps,function(a,c){c.toggle(b)})};a.pep.unbind=function(a){var b=a.data("plugin_"+d);if(typeof b==="undefined")return;b.toggle(false);a.removeData("plugin_"+d)}}(jQuery,window);