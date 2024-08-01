import{f as _r}from"./chunk-3EYC4JTX.js";var hr=_r((Ue,He)=>{(function(g,x){typeof Ue=="object"&&typeof He<"u"?He.exports=x():typeof define=="function"&&define.amd?define(x):(g=typeof globalThis<"u"?globalThis:g||self,g.DOMPurify=x())})(Ue,function(){"use strict";function g(r){"@babel/helpers - typeof";return g=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(n){return typeof n}:function(n){return n&&typeof Symbol=="function"&&n.constructor===Symbol&&n!==Symbol.prototype?"symbol":typeof n},g(r)}function x(r,n){return x=Object.setPrototypeOf||function(s,c){return s.__proto__=c,s},x(r,n)}function Et(){if(typeof Reflect>"u"||!Reflect.construct||Reflect.construct.sham)return!1;if(typeof Proxy=="function")return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){})),!0}catch{return!1}}function K(r,n,o){return Et()?K=Reflect.construct:K=function(c,O,y){var D=[null];D.push.apply(D,O);var P=Function.bind.apply(c,D),Y=new P;return y&&x(Y,y.prototype),Y},K.apply(null,arguments)}function R(r){return At(r)||yt(r)||gt(r)||St()}function At(r){if(Array.isArray(r))return fe(r)}function yt(r){if(typeof Symbol<"u"&&r[Symbol.iterator]!=null||r["@@iterator"]!=null)return Array.from(r)}function gt(r,n){if(r){if(typeof r=="string")return fe(r,n);var o=Object.prototype.toString.call(r).slice(8,-1);if(o==="Object"&&r.constructor&&(o=r.constructor.name),o==="Map"||o==="Set")return Array.from(r);if(o==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(o))return fe(r,n)}}function fe(r,n){(n==null||n>r.length)&&(n=r.length);for(var o=0,s=new Array(n);o<n;o++)s[o]=r[o];return s}function St(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}var bt=Object.hasOwnProperty,ze=Object.setPrototypeOf,Ot=Object.isFrozen,Rt=Object.getPrototypeOf,Lt=Object.getOwnPropertyDescriptor,E=Object.freeze,S=Object.seal,Mt=Object.create,Ge=typeof Reflect<"u"&&Reflect,Z=Ge.apply,ce=Ge.construct;Z||(Z=function(n,o,s){return n.apply(o,s)}),E||(E=function(n){return n}),S||(S=function(n){return n}),ce||(ce=function(n,o){return K(n,R(o))});var Nt=b(Array.prototype.forEach),We=b(Array.prototype.pop),j=b(Array.prototype.push),J=b(String.prototype.toLowerCase),me=b(String.prototype.toString),Be=b(String.prototype.match),L=b(String.prototype.replace),Dt=b(String.prototype.indexOf),wt=b(String.prototype.trim),_=b(RegExp.prototype.test),pe=Ct(TypeError);function b(r){return function(n){for(var o=arguments.length,s=new Array(o>1?o-1:0),c=1;c<o;c++)s[c-1]=arguments[c];return Z(r,n,s)}}function Ct(r){return function(){for(var n=arguments.length,o=new Array(n),s=0;s<n;s++)o[s]=arguments[s];return ce(r,o)}}function l(r,n,o){var s;o=(s=o)!==null&&s!==void 0?s:J,ze&&ze(r,null);for(var c=n.length;c--;){var O=n[c];if(typeof O=="string"){var y=o(O);y!==O&&(Ot(n)||(n[c]=y),O=y)}r[O]=!0}return r}function k(r){var n=Mt(null),o;for(o in r)Z(bt,r,[o])===!0&&(n[o]=r[o]);return n}function Q(r,n){for(;r!==null;){var o=Lt(r,n);if(o){if(o.get)return b(o.get);if(typeof o.value=="function")return b(o.value)}r=Rt(r)}function s(c){return console.warn("fallback value for",c),null}return s}var $e=E(["a","abbr","acronym","address","area","article","aside","audio","b","bdi","bdo","big","blink","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","content","data","datalist","dd","decorator","del","details","dfn","dialog","dir","div","dl","dt","element","em","fieldset","figcaption","figure","font","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","img","input","ins","kbd","label","legend","li","main","map","mark","marquee","menu","menuitem","meter","nav","nobr","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","section","select","shadow","small","source","spacer","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","tr","track","tt","u","ul","var","video","wbr"]),de=E(["svg","a","altglyph","altglyphdef","altglyphitem","animatecolor","animatemotion","animatetransform","circle","clippath","defs","desc","ellipse","filter","font","g","glyph","glyphref","hkern","image","line","lineargradient","marker","mask","metadata","mpath","path","pattern","polygon","polyline","radialgradient","rect","stop","style","switch","symbol","text","textpath","title","tref","tspan","view","vkern"]),Te=E(["feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence"]),It=E(["animate","color-profile","cursor","discard","fedropshadow","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","foreignobject","hatch","hatchpath","mesh","meshgradient","meshpatch","meshrow","missing-glyph","script","set","solidcolor","unknown","use"]),ve=E(["math","menclose","merror","mfenced","mfrac","mglyph","mi","mlabeledtr","mmultiscripts","mn","mo","mover","mpadded","mphantom","mroot","mrow","ms","mspace","msqrt","mstyle","msub","msup","msubsup","mtable","mtd","mtext","mtr","munder","munderover"]),xt=E(["maction","maligngroup","malignmark","mlongdiv","mscarries","mscarry","msgroup","mstack","msline","msrow","semantics","annotation","annotation-xml","mprescripts","none"]),je=E(["#text"]),Ye=E(["accept","action","align","alt","autocapitalize","autocomplete","autopictureinpicture","autoplay","background","bgcolor","border","capture","cellpadding","cellspacing","checked","cite","class","clear","color","cols","colspan","controls","controlslist","coords","crossorigin","datetime","decoding","default","dir","disabled","disablepictureinpicture","disableremoteplayback","download","draggable","enctype","enterkeyhint","face","for","headers","height","hidden","high","href","hreflang","id","inputmode","integrity","ismap","kind","label","lang","list","loading","loop","low","max","maxlength","media","method","min","minlength","multiple","muted","name","nonce","noshade","novalidate","nowrap","open","optimum","pattern","placeholder","playsinline","poster","preload","pubdate","radiogroup","readonly","rel","required","rev","reversed","role","rows","rowspan","spellcheck","scope","selected","shape","size","sizes","span","srclang","start","src","srcset","step","style","summary","tabindex","title","translate","type","usemap","valign","value","width","xmlns","slot"]),_e=E(["accent-height","accumulate","additive","alignment-baseline","ascent","attributename","attributetype","azimuth","basefrequency","baseline-shift","begin","bias","by","class","clip","clippathunits","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","cx","cy","d","dx","dy","diffuseconstant","direction","display","divisor","dur","edgemode","elevation","end","fill","fill-opacity","fill-rule","filter","filterunits","flood-color","flood-opacity","font-family","font-size","font-size-adjust","font-stretch","font-style","font-variant","font-weight","fx","fy","g1","g2","glyph-name","glyphref","gradientunits","gradienttransform","height","href","id","image-rendering","in","in2","k","k1","k2","k3","k4","kerning","keypoints","keysplines","keytimes","lang","lengthadjust","letter-spacing","kernelmatrix","kernelunitlength","lighting-color","local","marker-end","marker-mid","marker-start","markerheight","markerunits","markerwidth","maskcontentunits","maskunits","max","mask","media","method","mode","min","name","numoctaves","offset","operator","opacity","order","orient","orientation","origin","overflow","paint-order","path","pathlength","patterncontentunits","patterntransform","patternunits","points","preservealpha","preserveaspectratio","primitiveunits","r","rx","ry","radius","refx","refy","repeatcount","repeatdur","restart","result","rotate","scale","seed","shape-rendering","specularconstant","specularexponent","spreadmethod","startoffset","stddeviation","stitchtiles","stop-color","stop-opacity","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke","stroke-width","style","surfacescale","systemlanguage","tabindex","targetx","targety","transform","transform-origin","text-anchor","text-decoration","text-rendering","textlength","type","u1","u2","unicode","values","viewbox","visibility","version","vert-adv-y","vert-origin-x","vert-origin-y","width","word-spacing","wrap","writing-mode","xchannelselector","ychannelselector","x","x1","x2","xmlns","y","y1","y2","z","zoomandpan"]),Xe=E(["accent","accentunder","align","bevelled","close","columnsalign","columnlines","columnspan","denomalign","depth","dir","display","displaystyle","encoding","fence","frame","height","href","id","largeop","length","linethickness","lspace","lquote","mathbackground","mathcolor","mathsize","mathvariant","maxsize","minsize","movablelimits","notation","numalign","open","rowalign","rowlines","rowspacing","rowspan","rspace","rquote","scriptlevel","scriptminsize","scriptsizemultiplier","selection","separator","separators","stretchy","subscriptshift","supscriptshift","symmetric","voffset","width","xmlns"]),ee=E(["xlink:href","xml:id","xlink:title","xml:space","xmlns:xlink"]),kt=S(/\{\{[\w\W]*|[\w\W]*\}\}/gm),Pt=S(/<%[\w\W]*|[\w\W]*%>/gm),Ft=S(/\${[\w\W]*}/gm),Ut=S(/^data-[\-\w.\u00B7-\uFFFF]/),Ht=S(/^aria-[\-\w]+$/),zt=S(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i),Gt=S(/^(?:\w+script|data):/i),Wt=S(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),Bt=S(/^html$/i),$t=S(/^[a-z][.\w]*(-[.\w]+)+$/i),jt=function(){return typeof window>"u"?null:window},Yt=function(n,o){if(g(n)!=="object"||typeof n.createPolicy!="function")return null;var s=null,c="data-tt-policy-suffix";o.currentScript&&o.currentScript.hasAttribute(c)&&(s=o.currentScript.getAttribute(c));var O="dompurify"+(s?"#"+s:"");try{return n.createPolicy(O,{createHTML:function(D){return D},createScriptURL:function(D){return D}})}catch{return console.warn("TrustedTypes policy "+O+" could not be created."),null}};function Ve(){var r=arguments.length>0&&arguments[0]!==void 0?arguments[0]:jt(),n=function(e){return Ve(e)};if(n.version="2.5.0",n.removed=[],!r||!r.document||r.document.nodeType!==9)return n.isSupported=!1,n;var o=r.document,s=r.document,c=r.DocumentFragment,O=r.HTMLTemplateElement,y=r.Node,D=r.Element,P=r.NodeFilter,Y=r.NamedNodeMap,Vt=Y===void 0?r.NamedNodeMap||r.MozNamedAttrMap:Y,qt=r.HTMLFormElement,Kt=r.DOMParser,te=r.trustedTypes,re=D.prototype,Zt=Q(re,"cloneNode"),Jt=Q(re,"nextSibling"),Qt=Q(re,"childNodes"),he=Q(re,"parentNode");if(typeof O=="function"){var Ee=s.createElement("template");Ee.content&&Ee.content.ownerDocument&&(s=Ee.content.ownerDocument)}var M=Yt(te,o),Ae=M?M.createHTML(""):"",ae=s,ye=ae.implementation,er=ae.createNodeIterator,tr=ae.createDocumentFragment,rr=ae.getElementsByTagName,ar=o.importNode,qe={};try{qe=k(s).documentMode?s.documentMode:{}}catch{}var w={};n.isSupported=typeof he=="function"&&ye&&ye.createHTMLDocument!==void 0&&qe!==9;var ge=kt,Se=Pt,be=Ft,nr=Ut,ir=Ht,or=Gt,Ke=Wt,lr=$t,Oe=zt,m=null,Ze=l({},[].concat(R($e),R(de),R(Te),R(ve),R(je))),p=null,Je=l({},[].concat(R(Ye),R(_e),R(Xe),R(ee))),f=Object.seal(Object.create(null,{tagNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},allowCustomizedBuiltInElements:{writable:!0,configurable:!1,enumerable:!0,value:!1}})),X=null,Re=null,Qe=!0,Le=!0,et=!1,tt=!0,H=!1,rt=!0,F=!1,Me=!1,Ne=!1,z=!1,ne=!1,ie=!1,at=!0,nt=!1,sr="user-content-",De=!0,V=!1,G={},W=null,it=l({},["annotation-xml","audio","colgroup","desc","foreignobject","head","iframe","math","mi","mn","mo","ms","mtext","noembed","noframes","noscript","plaintext","script","style","svg","template","thead","title","video","xmp"]),ot=null,lt=l({},["audio","video","img","source","image","track"]),we=null,st=l({},["alt","class","for","id","label","name","pattern","placeholder","role","summary","title","value","style","xmlns"]),oe="http://www.w3.org/1998/Math/MathML",le="http://www.w3.org/2000/svg",C="http://www.w3.org/1999/xhtml",B=C,Ce=!1,Ie=null,ur=l({},[oe,le,C],me),U,fr=["application/xhtml+xml","text/html"],cr="text/html",d,$=null,mr=s.createElement("form"),ut=function(e){return e instanceof RegExp||e instanceof Function},xe=function(e){$&&$===e||((!e||g(e)!=="object")&&(e={}),e=k(e),U=fr.indexOf(e.PARSER_MEDIA_TYPE)===-1?U=cr:U=e.PARSER_MEDIA_TYPE,d=U==="application/xhtml+xml"?me:J,m="ALLOWED_TAGS"in e?l({},e.ALLOWED_TAGS,d):Ze,p="ALLOWED_ATTR"in e?l({},e.ALLOWED_ATTR,d):Je,Ie="ALLOWED_NAMESPACES"in e?l({},e.ALLOWED_NAMESPACES,me):ur,we="ADD_URI_SAFE_ATTR"in e?l(k(st),e.ADD_URI_SAFE_ATTR,d):st,ot="ADD_DATA_URI_TAGS"in e?l(k(lt),e.ADD_DATA_URI_TAGS,d):lt,W="FORBID_CONTENTS"in e?l({},e.FORBID_CONTENTS,d):it,X="FORBID_TAGS"in e?l({},e.FORBID_TAGS,d):{},Re="FORBID_ATTR"in e?l({},e.FORBID_ATTR,d):{},G="USE_PROFILES"in e?e.USE_PROFILES:!1,Qe=e.ALLOW_ARIA_ATTR!==!1,Le=e.ALLOW_DATA_ATTR!==!1,et=e.ALLOW_UNKNOWN_PROTOCOLS||!1,tt=e.ALLOW_SELF_CLOSE_IN_ATTR!==!1,H=e.SAFE_FOR_TEMPLATES||!1,rt=e.SAFE_FOR_XML!==!1,F=e.WHOLE_DOCUMENT||!1,z=e.RETURN_DOM||!1,ne=e.RETURN_DOM_FRAGMENT||!1,ie=e.RETURN_TRUSTED_TYPE||!1,Ne=e.FORCE_BODY||!1,at=e.SANITIZE_DOM!==!1,nt=e.SANITIZE_NAMED_PROPS||!1,De=e.KEEP_CONTENT!==!1,V=e.IN_PLACE||!1,Oe=e.ALLOWED_URI_REGEXP||Oe,B=e.NAMESPACE||C,f=e.CUSTOM_ELEMENT_HANDLING||{},e.CUSTOM_ELEMENT_HANDLING&&ut(e.CUSTOM_ELEMENT_HANDLING.tagNameCheck)&&(f.tagNameCheck=e.CUSTOM_ELEMENT_HANDLING.tagNameCheck),e.CUSTOM_ELEMENT_HANDLING&&ut(e.CUSTOM_ELEMENT_HANDLING.attributeNameCheck)&&(f.attributeNameCheck=e.CUSTOM_ELEMENT_HANDLING.attributeNameCheck),e.CUSTOM_ELEMENT_HANDLING&&typeof e.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements=="boolean"&&(f.allowCustomizedBuiltInElements=e.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements),H&&(Le=!1),ne&&(z=!0),G&&(m=l({},R(je)),p=[],G.html===!0&&(l(m,$e),l(p,Ye)),G.svg===!0&&(l(m,de),l(p,_e),l(p,ee)),G.svgFilters===!0&&(l(m,Te),l(p,_e),l(p,ee)),G.mathMl===!0&&(l(m,ve),l(p,Xe),l(p,ee))),e.ADD_TAGS&&(m===Ze&&(m=k(m)),l(m,e.ADD_TAGS,d)),e.ADD_ATTR&&(p===Je&&(p=k(p)),l(p,e.ADD_ATTR,d)),e.ADD_URI_SAFE_ATTR&&l(we,e.ADD_URI_SAFE_ATTR,d),e.FORBID_CONTENTS&&(W===it&&(W=k(W)),l(W,e.FORBID_CONTENTS,d)),De&&(m["#text"]=!0),F&&l(m,["html","head","body"]),m.table&&(l(m,["tbody"]),delete X.tbody),E&&E(e),$=e)},ft=l({},["mi","mo","mn","ms","mtext"]),ct=l({},["foreignobject","desc","title","annotation-xml"]),pr=l({},["title","style","font","a","script"]),se=l({},de);l(se,Te),l(se,It);var ke=l({},ve);l(ke,xt);var dr=function(e){var t=he(e);(!t||!t.tagName)&&(t={namespaceURI:B,tagName:"template"});var a=J(e.tagName),u=J(t.tagName);return Ie[e.namespaceURI]?e.namespaceURI===le?t.namespaceURI===C?a==="svg":t.namespaceURI===oe?a==="svg"&&(u==="annotation-xml"||ft[u]):!!se[a]:e.namespaceURI===oe?t.namespaceURI===C?a==="math":t.namespaceURI===le?a==="math"&&ct[u]:!!ke[a]:e.namespaceURI===C?t.namespaceURI===le&&!ct[u]||t.namespaceURI===oe&&!ft[u]?!1:!ke[a]&&(pr[a]||!se[a]):!!(U==="application/xhtml+xml"&&Ie[e.namespaceURI]):!1},N=function(e){j(n.removed,{element:e});try{e.parentNode.removeChild(e)}catch{try{e.outerHTML=Ae}catch{e.remove()}}},Pe=function(e,t){try{j(n.removed,{attribute:t.getAttributeNode(e),from:t})}catch{j(n.removed,{attribute:null,from:t})}if(t.removeAttribute(e),e==="is"&&!p[e])if(z||ne)try{N(t)}catch{}else try{t.setAttribute(e,"")}catch{}},mt=function(e){var t,a;if(Ne)e="<remove></remove>"+e;else{var u=Be(e,/^[\r\n\t ]+/);a=u&&u[0]}U==="application/xhtml+xml"&&B===C&&(e='<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>'+e+"</body></html>");var A=M?M.createHTML(e):e;if(B===C)try{t=new Kt().parseFromString(A,U)}catch{}if(!t||!t.documentElement){t=ye.createDocument(B,"template",null);try{t.documentElement.innerHTML=Ce?Ae:A}catch{}}var h=t.body||t.documentElement;return e&&a&&h.insertBefore(s.createTextNode(a),h.childNodes[0]||null),B===C?rr.call(t,F?"html":"body")[0]:F?t.documentElement:h},pt=function(e){return er.call(e.ownerDocument||e,e,P.SHOW_ELEMENT|P.SHOW_COMMENT|P.SHOW_TEXT|P.SHOW_PROCESSING_INSTRUCTION|P.SHOW_CDATA_SECTION,null,!1)},Tr=function(e){return e instanceof qt&&(typeof e.nodeName!="string"||typeof e.textContent!="string"||typeof e.removeChild!="function"||!(e.attributes instanceof Vt)||typeof e.removeAttribute!="function"||typeof e.setAttribute!="function"||typeof e.namespaceURI!="string"||typeof e.insertBefore!="function"||typeof e.hasChildNodes!="function")},q=function(e){return g(y)==="object"?e instanceof y:e&&g(e)==="object"&&typeof e.nodeType=="number"&&typeof e.nodeName=="string"},I=function(e,t,a){w[e]&&Nt(w[e],function(u){u.call(n,t,a,$)})},dt=function(e){var t;if(I("beforeSanitizeElements",e,null),Tr(e)||_(/[\u0080-\uFFFF]/,e.nodeName))return N(e),!0;var a=d(e.nodeName);if(I("uponSanitizeElement",e,{tagName:a,allowedTags:m}),e.hasChildNodes()&&!q(e.firstElementChild)&&(!q(e.content)||!q(e.content.firstElementChild))&&_(/<[/\w]/g,e.innerHTML)&&_(/<[/\w]/g,e.textContent)||a==="select"&&_(/<template/i,e.innerHTML)||e.nodeType===7||rt&&e.nodeType===8&&_(/<[/\w]/g,e.data))return N(e),!0;if(!m[a]||X[a]){if(!X[a]&&vt(a)&&(f.tagNameCheck instanceof RegExp&&_(f.tagNameCheck,a)||f.tagNameCheck instanceof Function&&f.tagNameCheck(a)))return!1;if(De&&!W[a]){var u=he(e)||e.parentNode,A=Qt(e)||e.childNodes;if(A&&u)for(var h=A.length,v=h-1;v>=0;--v)u.insertBefore(Zt(A[v],!0),Jt(e))}return N(e),!0}return e instanceof D&&!dr(e)||(a==="noscript"||a==="noembed"||a==="noframes")&&_(/<\/no(script|embed|frames)/i,e.innerHTML)?(N(e),!0):(H&&e.nodeType===3&&(t=e.textContent,t=L(t,ge," "),t=L(t,Se," "),t=L(t,be," "),e.textContent!==t&&(j(n.removed,{element:e.cloneNode()}),e.textContent=t)),I("afterSanitizeElements",e,null),!1)},Tt=function(e,t,a){if(at&&(t==="id"||t==="name")&&(a in s||a in mr))return!1;if(!(Le&&!Re[t]&&_(nr,t))){if(!(Qe&&_(ir,t))){if(!p[t]||Re[t]){if(!(vt(e)&&(f.tagNameCheck instanceof RegExp&&_(f.tagNameCheck,e)||f.tagNameCheck instanceof Function&&f.tagNameCheck(e))&&(f.attributeNameCheck instanceof RegExp&&_(f.attributeNameCheck,t)||f.attributeNameCheck instanceof Function&&f.attributeNameCheck(t))||t==="is"&&f.allowCustomizedBuiltInElements&&(f.tagNameCheck instanceof RegExp&&_(f.tagNameCheck,a)||f.tagNameCheck instanceof Function&&f.tagNameCheck(a))))return!1}else if(!we[t]){if(!_(Oe,L(a,Ke,""))){if(!((t==="src"||t==="xlink:href"||t==="href")&&e!=="script"&&Dt(a,"data:")===0&&ot[e])){if(!(et&&!_(or,L(a,Ke,"")))){if(a)return!1}}}}}}return!0},vt=function(e){return e!=="annotation-xml"&&Be(e,lr)},_t=function(e){var t,a,u,A;I("beforeSanitizeAttributes",e,null);var h=e.attributes;if(h){var v={attrName:"",attrValue:"",keepAttr:!0,allowedAttributes:p};for(A=h.length;A--;){t=h[A];var ue=t,T=ue.name,Fe=ue.namespaceURI;if(a=T==="value"?t.value:wt(t.value),u=d(T),v.attrName=u,v.attrValue=a,v.keepAttr=!0,v.forceKeepAttr=void 0,I("uponSanitizeAttribute",e,v),a=v.attrValue,!v.forceKeepAttr&&(Pe(T,e),!!v.keepAttr)){if(!tt&&_(/\/>/i,a)){Pe(T,e);continue}H&&(a=L(a,ge," "),a=L(a,Se," "),a=L(a,be," "));var ht=d(e.nodeName);if(Tt(ht,u,a)){if(nt&&(u==="id"||u==="name")&&(Pe(T,e),a=sr+a),M&&g(te)==="object"&&typeof te.getAttributeType=="function"&&!Fe)switch(te.getAttributeType(ht,u)){case"TrustedHTML":{a=M.createHTML(a);break}case"TrustedScriptURL":{a=M.createScriptURL(a);break}}try{Fe?e.setAttributeNS(Fe,T,a):e.setAttribute(T,a),We(n.removed)}catch{}}}}I("afterSanitizeAttributes",e,null)}},vr=function i(e){var t,a=pt(e);for(I("beforeSanitizeShadowDOM",e,null);t=a.nextNode();)I("uponSanitizeShadowNode",t,null),!dt(t)&&(t.content instanceof c&&i(t.content),_t(t));I("afterSanitizeShadowDOM",e,null)};return n.sanitize=function(i){var e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},t,a,u,A,h;if(Ce=!i,Ce&&(i="<!-->"),typeof i!="string"&&!q(i))if(typeof i.toString=="function"){if(i=i.toString(),typeof i!="string")throw pe("dirty is not a string, aborting")}else throw pe("toString is not a function");if(!n.isSupported){if(g(r.toStaticHTML)==="object"||typeof r.toStaticHTML=="function"){if(typeof i=="string")return r.toStaticHTML(i);if(q(i))return r.toStaticHTML(i.outerHTML)}return i}if(Me||xe(e),n.removed=[],typeof i=="string"&&(V=!1),V){if(i.nodeName){var v=d(i.nodeName);if(!m[v]||X[v])throw pe("root node is forbidden and cannot be sanitized in-place")}}else if(i instanceof y)t=mt("<!---->"),a=t.ownerDocument.importNode(i,!0),a.nodeType===1&&a.nodeName==="BODY"||a.nodeName==="HTML"?t=a:t.appendChild(a);else{if(!z&&!H&&!F&&i.indexOf("<")===-1)return M&&ie?M.createHTML(i):i;if(t=mt(i),!t)return z?null:ie?Ae:""}t&&Ne&&N(t.firstChild);for(var ue=pt(V?i:t);u=ue.nextNode();)u.nodeType===3&&u===A||dt(u)||(u.content instanceof c&&vr(u.content),_t(u),A=u);if(A=null,V)return i;if(z){if(ne)for(h=tr.call(t.ownerDocument);t.firstChild;)h.appendChild(t.firstChild);else h=t;return(p.shadowroot||p.shadowrootmod)&&(h=ar.call(o,h,!0)),h}var T=F?t.outerHTML:t.innerHTML;return F&&m["!doctype"]&&t.ownerDocument&&t.ownerDocument.doctype&&t.ownerDocument.doctype.name&&_(Bt,t.ownerDocument.doctype.name)&&(T="<!DOCTYPE "+t.ownerDocument.doctype.name+`>
`+T),H&&(T=L(T,ge," "),T=L(T,Se," "),T=L(T,be," ")),M&&ie?M.createHTML(T):T},n.setConfig=function(i){xe(i),Me=!0},n.clearConfig=function(){$=null,Me=!1},n.isValidAttribute=function(i,e,t){$||xe({});var a=d(i),u=d(e);return Tt(a,u,t)},n.addHook=function(i,e){typeof e=="function"&&(w[i]=w[i]||[],j(w[i],e))},n.removeHook=function(i){if(w[i])return We(w[i])},n.removeHooks=function(i){w[i]&&(w[i]=[])},n.removeAllHooks=function(){w={}},n}var Xt=Ve();return Xt})});export default hr();
