!function(t){function e(r){if(n[r])return n[r].exports;var i=n[r]={exports:{},id:r,loaded:!1};return t[r].call(i.exports,i,i.exports,e),i.loaded=!0,i.exports}var n={};return e.m=t,e.c=n,e.p="",e(0)}([function(t,e,n){"use strict";var r=n(1);"undefined"!=typeof window&&(window.Record=r,window.record=new r),t.exports=r},function(t,e){"use strict";function n(t){return this.key=r(t),this.value=t,this.instantiate()}function r(t){var e=null==t?t:t.valueOf();return e instanceof Object||"function"==typeof t?null:String(e)}!Object.setPrototypeOf&&"__proto__"in Object.prototype&&(Object.setPrototypeOf=function(t,e){return t.__proto__=e,t});var i,s,a=Function.prototype.apply,o=Array.prototype.slice;n.prototype={map:function(){},value:null,name:null,parent:null,accessor:null,process:null,running:!1,next:null,target:null,written:!1,instantiate:function(){function t(){var n,r;if(this instanceof t)return r=e.branch(),arguments.length>0?r.accessor.apply(null,arguments):r.accessor;n=s,s=e,s.running=!0;try{return e.exec.apply(e,arguments)}finally{s.running=!1,s=n}}var e=this;this.map=Object.create(this.map),this.target=this.target,this.accessor=t,Object.setPrototypeOf&&Object.setPrototypeOf(this.accessor,this.map),Object.defineProperties(this.accessor,{valueOf:{value:function(){return e.value}},toString:{value:function(){return String(e.valueOf())}},name:{value:this.key}})},branch:function c(){var c=Object.create(this);return c.origin=this,c.instantiate(),c},select:function(t){var e,s=r(t);if(null!=s&&this.map[s]!==n.prototype.map[s])return this.map[s];if(i==this||!this.target){if("function"==typeof t)return this.target=t,this.accessor;var e=this.create(t);return this.next=e,this.target||(this.target=e.accessor),e.accessor}return null},exec:function(t){if(!arguments.length)return this.next&&this.next.accessor;var e,n,s,c=o.call(arguments,1),u=r(t);if(t instanceof Array&&(t=arguments[0]=this.exec(t)),n=this.select(t))return c.length?a.call(n,null,c):n;s=i,i=this;try{if(e=a.call(this.target,this.accessor,arguments),e===!1)throw new RangeError(this.accessor+" returned false");return null==e?e=this.exec.apply(this,arguments):"function"!=typeof e?e=this.exec(e):u&&(this.map[u]=e),this.target=e}finally{i=s}},create:function(t){var e=r(t),i=new n(t);return i.parent=this,i.process=this.process||this,null!=e&&(this.map[e]=i.accessor),i},get:function(t){return this.map[t]!==n.prototype.map[t]?this.map[t]:null},has:function(t){return this.map[t]!==n.prototype.map[t]}},t.exports=new n("").accessor}]);