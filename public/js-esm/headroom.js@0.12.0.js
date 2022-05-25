/**
 * Bundled by jsDelivr using Rollup v2.70.1 and Terser v5.10.0.
 * Original file: /npm/headroom.js@0.12.0/dist/headroom.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self&&self;var t={exports:{}},n=t.exports=function(){function t(){return"undefined"!=typeof window}function n(){var t=!1;try{var n={get passive(){t=!0}};window.addEventListener("test",n,n),window.removeEventListener("test",n,n)}catch(n){t=!1}return t}function o(){return!!(t()&&function(){}.bind&&"classList"in document.documentElement&&Object.assign&&Object.keys&&requestAnimationFrame)}function s(t){return 9===t.nodeType}function e(t){return t&&t.document&&s(t.document)}function i(t){var n=t.document,o=n.body,s=n.documentElement;return{scrollHeight:function(){return Math.max(o.scrollHeight,s.scrollHeight,o.offsetHeight,s.offsetHeight,o.clientHeight,s.clientHeight)},height:function(){return t.innerHeight||s.clientHeight||o.clientHeight},scrollY:function(){return void 0!==t.pageYOffset?t.pageYOffset:(s||o.parentNode||o).scrollTop}}}function r(t){return{scrollHeight:function(){return Math.max(t.scrollHeight,t.offsetHeight,t.clientHeight)},height:function(){return Math.max(t.offsetHeight,t.clientHeight)},scrollY:function(){return t.scrollTop}}}function l(t){return e(t)?i(t):r(t)}function a(t,o,s){var e,i=n(),r=!1,a=l(t),h=a.scrollY(),c={};function u(){var t=Math.round(a.scrollY()),n=a.height(),e=a.scrollHeight();c.scrollY=t,c.lastScrollY=h,c.direction=t>h?"down":"up",c.distance=Math.abs(t-h),c.isOutOfBounds=t<0||t+n>e,c.top=t<=o.offset[c.direction],c.bottom=t+n>=e,c.toleranceExceeded=c.distance>o.tolerance[c.direction],s(c),h=t,r=!1}function d(){r||(r=!0,e=requestAnimationFrame(u))}var f=!!i&&{passive:!0,capture:!1};return t.addEventListener("scroll",d,f),u(),{destroy:function(){cancelAnimationFrame(e),t.removeEventListener("scroll",d,f)}}}function h(t){return t===Object(t)?t:{down:t,up:t}}function c(t,n){n=n||{},Object.assign(this,c.options,n),this.classes=Object.assign({},c.options.classes,n.classes),this.elem=t,this.tolerance=h(this.tolerance),this.offset=h(this.offset),this.initialised=!1,this.frozen=!1}return c.prototype={constructor:c,init:function(){return c.cutsTheMustard&&!this.initialised&&(this.addClass("initial"),this.initialised=!0,setTimeout((function(t){t.scrollTracker=a(t.scroller,{offset:t.offset,tolerance:t.tolerance},t.update.bind(t))}),100,this)),this},destroy:function(){this.initialised=!1,Object.keys(this.classes).forEach(this.removeClass,this),this.scrollTracker.destroy()},unpin:function(){!this.hasClass("pinned")&&this.hasClass("unpinned")||(this.addClass("unpinned"),this.removeClass("pinned"),this.onUnpin&&this.onUnpin.call(this))},pin:function(){this.hasClass("unpinned")&&(this.addClass("pinned"),this.removeClass("unpinned"),this.onPin&&this.onPin.call(this))},freeze:function(){this.frozen=!0,this.addClass("frozen")},unfreeze:function(){this.frozen=!1,this.removeClass("frozen")},top:function(){this.hasClass("top")||(this.addClass("top"),this.removeClass("notTop"),this.onTop&&this.onTop.call(this))},notTop:function(){this.hasClass("notTop")||(this.addClass("notTop"),this.removeClass("top"),this.onNotTop&&this.onNotTop.call(this))},bottom:function(){this.hasClass("bottom")||(this.addClass("bottom"),this.removeClass("notBottom"),this.onBottom&&this.onBottom.call(this))},notBottom:function(){this.hasClass("notBottom")||(this.addClass("notBottom"),this.removeClass("bottom"),this.onNotBottom&&this.onNotBottom.call(this))},shouldUnpin:function(t){return"down"===t.direction&&!t.top&&t.toleranceExceeded},shouldPin:function(t){return"up"===t.direction&&t.toleranceExceeded||t.top},addClass:function(t){this.elem.classList.add.apply(this.elem.classList,this.classes[t].split(" "))},removeClass:function(t){this.elem.classList.remove.apply(this.elem.classList,this.classes[t].split(" "))},hasClass:function(t){return this.classes[t].split(" ").every((function(t){return this.classList.contains(t)}),this.elem)},update:function(t){t.isOutOfBounds||!0!==this.frozen&&(t.top?this.top():this.notTop(),t.bottom?this.bottom():this.notBottom(),this.shouldUnpin(t)?this.unpin():this.shouldPin(t)&&this.pin())}},c.options={tolerance:{up:0,down:0},offset:0,scroller:t()?window:null,classes:{frozen:"headroom--frozen",pinned:"headroom--pinned",unpinned:"headroom--unpinned",top:"headroom--top",notTop:"headroom--not-top",bottom:"headroom--bottom",notBottom:"headroom--not-bottom",initial:"headroom"}},c.cutsTheMustard=o(),c}();export{n as default};
//# sourceMappingURL=/sm/fece924d4fbd7f727a8b11d6a602f788dc19866ebfff80199414b024bcd9b836.map