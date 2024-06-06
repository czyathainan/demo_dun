/**
 *@ https://github.com/czyathainan/demo_dun
 * 
 * ES6 语言标准
 * 
*/
function appendHTML(o,html) {
    var divTemp = document.createElement("div"), nodes = null
        , fragment = document.createDocumentFragment();
    divTemp.innerHTML = html;
    nodes = divTemp.childNodes;
    for (var i=0, length=nodes.length; i<length; i+=1) {
       fragment.appendChild(nodes[i].cloneNode(true));
    }
    o.appendChild(fragment);
    nodes = null;
    fragment = null;
}

var _ajax = function() {};
_ajax.prototype = {
    request: function(method, url, callback, postVars) {
        var xhr = this.createXhrObject()();
        xhr.onreadystatechange = function() {
            if (xhr.readyState !== 4) return;
            (xhr.status === 200) ?
                callback.success(xhr.responseText, xhr.responseXML) :
                callback.failure(xhr,status);
        };
        if (method !== "POST"&&postVars) {
            url += "?" + this.JSONStringify(postVars);
            postVars = null;
        }
        xhr.open(method, url, true);
        xhr.send(postVars);
    },
    createXhrObject: function() {
        var methods = [
            function() { return new XMLHttpRequest(); },
            function() { return new ActiveXObject("Msxml2.XMLHTTP"); },
            function() { return new ActiveXObject("Microsoft.XMLHTTP"); }
        ],
        i = 0,
        len = methods.length,obj;
        for (; i < len; i++) {
            try {
                methods[i];
            } catch(e) {
                continue;
            }
            this.createXhrObject = methods[i];
            return methods[i];
        }
        throw new Error("ajax created failure");
    },
    JSONStringify: function(obj) {
        return JSON.stringify(obj).replace(/"|{|}/g, "")
                    .replace(/b:b/g, "=")
                    .replace(/b,b/g, "&");
    }
}

var stcode_div_st1=0;
var show_stcode_unixtime=0;
var stcode = {
    _obj:null,
    _stcode:null,
    _img:null,
    _img_loaded:false,
    _is_draw_bg:false,
    _is_moving:false,
    _block_start_x:0,
    _block_start_y:0,
    _doing:false,
    _mark_w:50,
    _mark_h:50,
    _mark_offset:0,
    _img_w:240,
    _img_h:150,
    _result:false,
    _err_c:0,
    _onsuccess:null, 
    netStCodeImgUrl: '/net_stcode.php', 
    stcodeSuccess: function(){ console.log('stcodeSuccess方法未初始化') }, 
    _bind:function(elm,evType,fn){
        if(!elm){ return }
        //event.preventDefault();
        if (elm.addEventListener) {
            elm.addEventListener(evType, fn);//DOM2.0
            return true;
        }else if (elm.attachEvent) {
            var r = elm.attachEvent(evType, fn);//IE5+
            return r;
        }
    },
    _block_start_move:function(e){
        if(stcode._doing||!stcode._img_loaded){
            return;
        }
        e.preventDefault();
        var theEvent = window.event || e;
        if(theEvent.touches){
            theEvent = theEvent.touches[0];
        }

        //console.log("_block_start_move");
        var obj = document.getElementsByClassName('slide_block_text')[0];
        obj.style.display="none";
        stcode._draw_bg();
        stcode._block_start_x = theEvent.clientX;
        stcode._block_start_y = theEvent.clientY;
        stcode._doing = true;
        stcode._is_moving = true;
    },
    _block_on_move:function(e){
        if(!stcode._doing)return true;
        if(!stcode._is_moving)return true;
        e.preventDefault();
        var theEvent = window.event || e;
        if(theEvent.touches){
            theEvent = theEvent.touches[0];
        }
        stcode._is_moving = true;
        //console.log("_block_on_move");
        //document.getElementById('msg').innerHTML = "move:"+theEvent.clientX+";"+theEvent.clientY;
        var offset = theEvent.clientX - stcode._block_start_x;
        if(offset<0){
            offset = 0;
        }
        var max_off = stcode._img_w - stcode._mark_w;
        if(offset>max_off){
            offset = max_off;
        }
        var obj = document.getElementsByClassName('slide_block')[0];

        obj.style.cssText = "transform: translate("+offset+"px, 0px)";
        stcode._mark_offset = offset/max_off*(stcode._img_w-stcode._mark_w);
        stcode._draw_bg();
        stcode._draw_mark();
    },
    _block_on_end:function(e){
        if(!stcode._doing)return true;
        e.preventDefault();
        var theEvent = window.event || e;
        if(theEvent.touches){
            theEvent = theEvent.touches[0];
        }
        stcode._is_moving = false;
        stcode._send_result();
    },
    _send_result:function(){
        var haddle = {success:stcode._send_result_success,failure:stcode._send_result_failure};
		var stcodeDuplikey = document.getElementsByName('stcodeDuplikey')[0].value;
        stcode._result = false;
        var re = new _ajax();
        re.request('get', 'https://api.jiayyy.com/v1/dun/check-net-stcode?tn_r='+stcode._mark_offset+'&stcode_duplikey='+stcodeDuplikey,haddle);
		//re.request('get', '//api.jiayuan.com/v1/dun/check-net-stcode?tn_r='+stcode._mark_offset+'&stcode_duplikey='+stcodeDuplikey,haddle);
    },
    _send_result_success:function(responseText,responseXML){
        stcode._doing = false;
        if(responseText=='ok'){
			console.log('验证成功！');
            //stcode._stcode.innerHTML = '√验证成功';
            stcode._showmsg('√验证成功',1);
            stcode._result = true;
            document.getElementsByClassName('hgroup')[0].style.display="block";
            setTimeout(stcode.hide, 1500);
            if(stcode._onsuccess){
                stcode._onsuccess();
            }
			document.getElementsByClassName('slide_block')[0].style.display = 'none';
			setTimeout("document.getElementsByClassName('slide_block')[0].style.display='block';", 3000);
			//stcodeSuccess();
            stcode.stcodeSuccess();
        }else{
			console.log('拼接错误！');
            stcode._result = false;
            //stcode._showmsg('拼接错误');
            stcode._err_c++;
            if(stcode._err_c >= 1){
                stcode.refresh();
            }
        }
    }, 
    _send_result_failure:function(xhr,status){
        
    },
    _draw_fullbg:function(){
        var canvas_bg = document.getElementsByClassName('stcode_canvas_bg')[0];
        var ctx_bg = canvas_bg.getContext('2d');
        ctx_bg.drawImage(stcode._img, 0, stcode._img_h*2, stcode._img_w, stcode._img_h, 0, 0, stcode._img_w, stcode._img_h);
    },
    _draw_bg:function(){
        if(stcode._is_draw_bg){
            return;
        }
        stcode._is_draw_bg = true;
        var canvas_bg = document.getElementsByClassName('stcode_canvas_bg')[0];
        var ctx_bg = canvas_bg.getContext('2d');
        ctx_bg.drawImage(stcode._img, 0, 0, stcode._img_w, stcode._img_h, 0, 0, stcode._img_w, stcode._img_h);
    },
    _draw_mark:function(){
        var canvas_mark = document.getElementsByClassName('stcode_canvas_mark')[0];
        var ctx_mark = canvas_mark.getContext('2d');
        ctx_mark.clearRect(0,0,canvas_mark.width,canvas_mark.height);
        ctx_mark.drawImage(stcode._img, 0, stcode._img_h, stcode._mark_w,stcode._img_h,stcode._mark_offset,0,stcode._mark_w, stcode._img_h);
        var imageData = ctx_mark.getImageData(0, 0, stcode._img_w, stcode._img_h);
        var data = imageData.data;
        var x = stcode._img_h,y=stcode._img_w;
        for(var j = 0; j < x; j++) {
            var ii = 1,k1=-1;
            for(var k=0;k<y&&k>=0&&k>k1;){
                var i = (j*y+k)*4;
                k+=ii;
                var r = data[i]
                  , g = data[i+1]
                  , b = data[i+2];
                if(r+g+b<200) data[i+3] = 0;
                else{
                    var arr_pix = [1,-5];
                    var arr_op = [250,0];
                    for (var h =1; h<arr_pix[0]-arr_pix[1]; h++) {
                        var iiii = arr_pix[0]-1*h;
                        var op = parseInt(arr_op[0]-(arr_op[0]-arr_op[1])/(arr_pix[0]-arr_pix[1])*h);
                        var iii = (j*y+k+iiii*ii)*4;
                        data[iii+3] = op;
                    }
                    if(ii==-1){
                        break;
                    }
                    k1 = k;
                    k = y-1;
                    ii = -1;
                }
            }
        }
        ctx_mark.putImageData(imageData, 0, 0);
    },
    _reset:function(){
        stcode._mark_offset = 0;
        stcode._draw_bg();
        stcode._draw_mark();
        var obj = document.getElementsByClassName('slide_block')[0];
        obj.style.cssText = "transform: translate(0px, 0px)";
    },
    show:function(){
		var reg = new RegExp('(^|\\s)stcodeBtn(\\s|$)');
		if(!reg.test(this.getAttribute('class'))){
			console.log('样式值stcodeBtn不存在');
			return false;
		}
        var obj = document.getElementsByClassName('hgroup')[0];
        if(obj){
            obj.style.display="none";
        }
        stcode.refresh();
        stcode._stcode = this;
        document.getElementById('stcode_div_bg').style.display="block";
        document.getElementById('stcode_div').style.display="block";
		show_stcode_unixtime = new Date().getTime();
    },
    hide:function(){
		let unixTimestamp = new Date().getTime();
		if(unixTimestamp - show_stcode_unixtime < 1000){
			return false; //展现不足1秒，忽略隐藏
		}
        document.getElementById('stcode_div_bg').style.display="none";
        document.getElementById('stcode_div').style.display="none";
    },
    _showmsg:function(msg,status){
        var obj;
        if(!status){
            status = 0;
            obj = document.getElementsByClassName('stcode_msg_error')[0];
        }else{
            obj = document.getElementsByClassName('stcode_msg_ok')[0];
        }
        obj.innerHTML = msg;
        var setOpacity = function (ele, opacity) {
            if (ele.style.opacity != undefined) {
                ele.style.opacity = opacity / 100;
            } else {
                ele.style.filter = "alpha(opacity=" + opacity + ")";
            }
        };
        function fadeout(ele, opacity, speed) {
            if (ele) {
                var v = ele.style.filter.replace("alpha(opacity=", "").replace(")", "") || ele.style.opacity || 100;
                v < 1 && (v = v * 100);
                var count = speed / 1000;
                var avg = (100 - opacity) / count;
                var timer = null;
                timer = setInterval(function() {
                    if (v - avg > opacity) {
                        v -= avg;
                        setOpacity(ele, v);
                    } else {
                        setOpacity(ele, 0);
                        if(status==0){
                            stcode._reset();
                        }
                        clearInterval(timer);
                    }
                }, 100);
            }
        }
        function fadein(ele, opacity, speed) {
            if (ele) {
                var v = ele.style.filter.replace("alpha(opacity=", "").replace(")", "") || ele.style.opacity;
                v < 1 && (v = v * 100);
                var count = speed / 1000;
                var avg = count < 2 ? (opacity / count) : (opacity / count - 1);
                var timer = null;
                timer = setInterval(function() {
                    if (v < opacity) {
                        v += avg;
                        setOpacity(ele, v);
                    } else {
                        clearInterval(timer);
                        setTimeout(function() {fadeout(obj, 0, 6000);}, 100);
                    }
                }, 100);
            }
        }
        fadein(obj, 90, 3000);
    },
    _html:function(){
        var d = document.getElementById('stcode_div_bg');
        if(d)return;
        var html = '<div class="stcode_div_bg" id="stcode_div_bg"></div>'
			+'<div class="stcode_div" id="stcode_div">'
			+'	<div class="loading">加载中</div>'
			+'	<canvas class="stcode_canvas_bg"></canvas>'
			+'	<canvas class="stcode_canvas_mark"></canvas>'
			+'	<div class="hgroup"></div>'
			+'	<div class="stcode_msg_error"></div>'
			+'	<div class="stcode_msg_ok"></div>'
			+'	<div class="slide">'
			+'		<div class="slide_block"></div>'
			+'		<div class="slide_block_text">拖动箭头填充拼图</div>'
			+'	</div>'
			+'	<div class="tools">'
			+'		<div class="stcode_left_title">安全验证</div>'
			+'		<div class="stcode_refresh"></div>'
			+'	</div>'
			+'</div>';
        var bo = document.getElementsByTagName('body');
        appendHTML(bo[0],html);
    },
    refresh:function(){
        var isSupportWebp = !![].map && document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') == 0;
		var stcodeDuplikey = document.getElementsByName('stcodeDuplikey')[0].value;
        var _this = this;
        stcode._err_c = 0;
        stcode._is_draw_bg = false;
        stcode._result = false;
        stcode._img_loaded = false;
        var obj = document.getElementsByClassName('stcode_canvas_bg')[0];
        obj.style.display="none";
        obj = document.getElementsByClassName('stcode_canvas_mark')[0];
        obj.style.display="none";
        stcode._img = new Image();
		/*var img_url	= typeof(netStCodeUrl)!='undefined' ? netStCodeUrl : "/net_stcode.php";
			img_url	+= "?t="+Math.random()+"&stcode_duplikey="+stcodeDuplikey;
        if(!isSupportWebp){
            img_url+="&nowebp=1";
        }
        stcode._img.src = img_url;*/
        
        var img_url	= stcode.netStCodeImgUrl;
			img_url	+= "?t="+Math.random()+"&stcode_duplikey="+stcodeDuplikey;
        if(!isSupportWebp){
            img_url+="&nowebp=1";
        }
        stcode._img.src = img_url;
        
        stcode._img.onload = function(){
            stcode._draw_fullbg();
            var canvas_mark = document.getElementsByClassName('stcode_canvas_mark')[0];
            var ctx_mark = canvas_mark.getContext('2d');
            ctx_mark.clearRect(0,0,canvas_mark.width,canvas_mark.height);
            stcode._img_loaded = true;
            obj = document.getElementsByClassName('stcode_canvas_bg')[0];
            obj.style.display="";
            obj = document.getElementsByClassName('stcode_canvas_mark')[0];
            obj.style.display="";
        };
        obj = document.getElementsByClassName('slide_block')[0];
        obj.style.cssText = "transform: translate(0px, 0px)";
        obj = document.getElementsByClassName('slide_block_text')[0];
        obj.style.display="block";
    },
    init:function(){
        var _this = this;
        if(!stcode._img){
            stcode._html();
            var obj = document.getElementsByClassName('slide_block')[0];
            stcode._bind(obj,'mousedown',_this._block_start_move);
            stcode._bind(document,'mousemove',_this._block_on_move);
            stcode._bind(document,'mouseup',_this._block_on_end);
            stcode._bind(obj,'touchstart',_this._block_start_move);
            stcode._bind(document,'touchmove',_this._block_on_move);
            stcode._bind(document,'touchend',_this._block_on_end);
            
            //点击按钮关闭，先保留，用下面替代
            /*var obj = document.getElementsByClassName('stcode_close')[0];
            stcode._bind(obj,'touchstart',_this.hide);
            stcode._bind(obj,'click',_this.hide);*/
			
			stcode._bind(document.getElementsByClassName('stcode_div')[0], 'click', function(){
				clearTimeout(stcode_div_st1);
				stcode_div_st1=0;
				event.stopPropagation();
			});
			stcode._bind(document.getElementsByClassName('stcode_div')[0], 'touchstart', function(){
				clearTimeout(stcode_div_st1);
				stcode_div_st1=0;
				event.stopPropagation();
			});
			
			document.getElementsByClassName('stcodeBtn')[0].addEventListener('click', function(){
				clearTimeout(stcode_div_st1);
				stcode_div_st1=0;
				event.stopPropagation();
			});
			document.getElementsByClassName('stcodeBtn')[0].addEventListener('touchstart', function(){
				clearTimeout(stcode_div_st1);
				stcode_div_st1=0;
				event.stopPropagation();
			});
			
			stcode._bind(document.body, 'click', function(){
				stcode_div_st1 = setTimeout(function(){
					stcode.hide();
					stcode_div_st1=0;
				}, 200);
				event.stopPropagation();
			});
			//不能加
			/*stcode._bind(document.body, 'touchstart', function(){
				stcode_div_st1 = setTimeout(function(){
					stcode.hide();
					stcode_div_st1=0;
				}, 200);
				event.stopPropagation();
			});*/
			
            var obj2 = document.getElementsByClassName('stcode_refresh')[0];
            stcode._bind(obj2,'touchstart',_this.refresh);
            stcode._bind(obj2,'click',_this.refresh);
			
            var objs = document.getElementsByClassName('stcodeBtn',-1);
            for (var i in objs) {
                var o = objs[i];
                //o.innerHTML = '点击进行验证';
                stcode._bind(o,'touchstart',_this.show);
                stcode._bind(o,'click',_this.show);
            }
        }
    },
    result:function(){
        return stcode._result;
    },
    onsuccess:function(fn){
        stcode._onsuccess = fn;
    },
    getRandString:function(length){
      let result = '';
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      return result;
    }
}
//ES6首次访问页面不会执行，必须刷新一次才行
/*window.onload = function(){
    stcode.init();
    console.log('stcode.init 完成')
}*/

export default stcode
