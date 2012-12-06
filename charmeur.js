// Copyright (c) 2010-2012 Slash7 LLC http://charmhq.com/
// Copyright (c) 2010-2012 Thomas Fuchs http://mir.aculo.us/
// License: https://github.com/cheerful/charmeur/blob/master/MIT-LICENSE
(function(){
  var tab, box, email, shown = false, sending = false, openmsg = null, callbacks = {},
    VENDORS = ['webkit','moz','o','ms'],
    RESET = 'margin:0;padding:0;border:0;outline:0;font-weight:inherit;text-align:left;font-style:inherit;letter-spacing:inherit;background:transparent;'+
      'top:auto;left:auto;right:auto;bottom:auto;'+
      'font-size:100%;font-family:inherit;vertical-align:baseline;list-style:none;inherit;'+vendored('box-sizing','inherit')+vendored('box-shadow','none')+
      'color:inherit;line-height:1;font:14px/18px Arial;border-radius:0;-webkit-font-smoothing:subpixel-antialiased;text-rendering:auto;',
    STYLE =
      '@media screen {\n'+
      '#CHARM_TAB { '+RESET+'position:fixed;z-index:999999;left:-10px;cursor:pointer;top:50%;margin-top:-100px;width:40px;height:200px;color:#fff;'+
        ';background:url(images/feedback.png);background-size:100% 100%;'+
        vendored('transform','translateX(0)') + vendored('transition','all 0.4s') + '}\n'+
      '#CHARM_TAB:hover { '+vendored('transform','translateX(10px)')+' }\n'+
      '#CHARM_TAB.hidden {'+vendored('transform','translateX(-40px)')+'}\n'+
      '#CHARM_TAB.hidden:hover { '+vendored('transform','translateX(-40px)')+'}\n'+
      '#CHARM_BOX * { '+RESET+' }\n'+
      '#CHARM_BOX * :focus { outline:0; }\n'+
      '#CHARM_BOX b { font-weight:bold; }\n'+
      '#CHARM_BOX iframe { width:1px;height:1px;visibility:hidden;position:absolute; }\n'+
      '#CHARM_BOX, #CHARM_MESSAGE { '+RESET+
        'border:8px solid #fff;'+
        'position:fixed;'+
        'z-index:999999;left:50%;top:50%;margin-top:-148px;margin-left:-218px;'+
        'width:400px;'+
        'background:#35aec6;'+
        'background:-webkit-gradient(linear, left top, left bottom, from(#56c6dc), to(#35aec6));'+
        'background:-moz-linear-gradient(center bottom, #35aec6 0%, #56c6dc 100%);'+
        'text-shadow:0px 1px 0px rgba(0,0,0,0.15);padding:10px;color:#fff;'+
        'opacity:0;'+
        vendored('border-radius','9px')+
        vendored('box-shadow','0px 0px 20px rgba(0,0,0,0.3)')+
        vendored('transform','scale(1.5)')+
        vendored('transition', 'all 0.45s')+
      '}\n'+
      '#CHARM_MESSAGE { '+
        'height: auto; text-align:center; font:18px/22px Arial; margin-top: -60px; '+
      '}\n'+
      '#CHARM_YOUR_EMAIL { margin-top: 10px; }\n'+
      '#CHARM_EMAIL { display:block;margin:5px 0 9px 0;padding:8px;width:384px;height:20px;color:#000;background:#fff; '+
        vendored('box-shadow','inset 0px -2px 5px 5px rgba(0,0,0,0.03)')+
        vendored('border-radius','4px')+
      '}\n'+
      '#CHARM_YOUR_COMMENT { margin-top: 5px; }\n'+
      '#CHARM_COMMENT { margin:5px 0 9px 0;padding:8px;width:384px;height:104px;color:#000;background:#fff;resize:none; '+
        vendored('box-shadow','inset 0px -2px 5px 5px rgba(0,0,0,0.03)')+
        vendored('border-radius','4px')+
      '}\n'+
      '#CHARM_SUBMIT { width:auto;border:1px solid #fff;padding:4px 10px;'+
        'background:#fff;color:#000;font-weight:bold;'+vendored('border-radius','9px')+'cursor:pointer;text-shadow:0px 1px 0px #fff;'+
        'background:-webkit-gradient(linear, left top, left bottom, from(#fff), to(#ddd));'+
        'background:-moz-linear-gradient(center bottom, #ddd 0%, #fff 100%);'+
        'display:inherit;'+
        vendored('box-shadow','0px 1px 2px rgba(0,0,0,0.5)')+
      '}\n'+
      '#CHARM_SUBMIT:hover { background:#eee; }\n'+
      'a#CHARM_CANCEL { position:absolute;bottom:15px;right:12px;text-decoration:underline;color:#fff; }\n'+
      'a#CHARM_CANCEL:hover { color:#fff; }\n'+
      'a#CHARM_CANCEL, a#CHARM_CANCEL:hover { display:block;float:right;margin-top:7px;font-size:12px; }\n'+
      '#CHARM_BOX.open, #CHARM_MESSAGE.open { '+vendored('transform','scale(1)')+'opacity:1; }\n'+
      '#CHARM_BOX.closed, #CHARM_MESSAGE.closed { '+
        'opacity:0;'+
        vendored('transform','scale(1.5)')+
        vendored('transition', 'all 0.25s')+
      '}\n'+
      '#CHARM_MESSAGE { text-align:center;height:auto; }\n'+
      '* html #CHARM_TAB { position: absolute; }\n'+
      '* html #CHARM_TAB.hidden { display: none; }\n'+
      '* html #CHARM_SUBMIT { background:#fff; }\n'+      
      '*+html #CHARM_SUBMIT { background:#fff; }\n'+      
      '* html #CHARM_BOX { background:#35aec6; position:absolute; }\n'+
      '*+html #CHARM_BOX { background:#35aec6; }\n'+
      '* html #CHARM_MESSAGE { background:#35aec6; position:absolute; }\n'+
      '*+html #CHARM_MESSAGE { background:#35aec6; }\n'+
      '}\n'+
      '@media print {\n'+
      '#CHARM_TAB, #CHARM_BOX, #CHARM_MESSAGE { display:none !important; }\n'+
      '}\n'+
      '@media only screen and (-moz-min-device-pixel-ratio: 1.5), only screen and (-o-min-device-pixel-ratio: 3/2), only screen and (-webkit-min-device-pixel-ratio: 1.5), only screen and (min-device-pixel-ratio: 1.5) { #CHARM_TAB { background-image:url(images/feedback2x.png); }}',
    BOX =
      '<span id="CHARM_TEXT"></span>'+
      '<iframe id="CHARM_FORM_TARGET" name="CHARM_FORM_TARGET" src="javascript:void(0)" onload="__CHARM&&__CHARM.iFrameLoaded&&__CHARM.iFrameLoaded()" onerror="__CHARM&&__CHARM.iFrameError&&__CHARM.iFrameError()"></iframe>'+
      '<form id="CHARM_FORM" target="CHARM_FORM_TARGET" action="https://secure.charmhq.com/feedback" method="POST">'+
      '<div id="CHARM_YOUR_EMAIL"></div>'+
      '<div id="CHARM_YOUR_COMMENT"></div>'+
      '<textarea id="CHARM_COMMENT" name="content" class="ignore-return-pressed"></textarea>'+
      '<input id="CHARM_SUBMIT" type="submit" value=""> <a href="#" id="CHARM_CANCEL"></a>'+
      '</form>',
    DEFAULTS = {
      text: '<b>Do you have feedback or questions?</b><br/> Let us know and we will get right back to you by email.',
      submit: 'Send feedback',
      cancel: 'hide this',
      your_email: 'Your email address:',
      your_comment: 'Your message:',
      feedback_sending: 'Sending...',
      feedback_sent: 'Your feedback was sent!<br/>We will get back to you as soon as possible!',
      feedback_error: 'There was a problem sending your message.<br/>Please contact support directly.<br/><br/>close this message'
    };

  function vendored(property, value){
    var string = '';
    for(var i=0;i<VENDORS.length;i++)
      string += '-'+VENDORS[i]+'-'+property+":"+value+';';
    string += property+":"+value+';';
    return string;
  }
 
  function log(s){
    'console' in window && 'log' in console && console.log(s);
  }

  if(!("__CHARM" in window)) {
    log('no CHARM data found');
    return;
  }

  if(!(typeof __CHARM == 'object')) {
    log('CHARM must be an object');
    return;
  }
  
  function $(id){ return typeof id == 'string' ? document.getElementById(id) : id; }
  function css(id,style){ $(id).style.cssText += ';' + style; }
  
  function csstag(styles){
    var css = document.createElement('style');
    css.setAttribute('type','text/css');
    if('styleSheet' in css)
      css.styleSheet.cssText = styles;
    else
      css.innerHTML = styles;
    
    document.getElementsByTagName('head')[0].appendChild(css);
  }
  
  function init(){
    tab = document.createElement('a');
    tab.id = "CHARM_TAB";
    
    tab.href = "https://secure.charmhq.com/feedback/" + __CHARM.key;
    tab.onclick = function(){ show(); return false };
    document.body.appendChild(tab);
    csstag(STYLE);
  }

  function template(string){
    for(var prop in __CHARM)
      string = string.replace(new RegExp('{'+prop+'}'), __CHARM[prop]);
    return string;
  }

  function customize(id, property){
    $('CHARM_'+id.toUpperCase())[property||'innerHTML'] = template((id in __CHARM) ? __CHARM[id] : DEFAULTS[id]);
  }

  function userdata(name){
    if(name in __CHARM) data(name, __CHARM[name]);
  }

  function data(name, value){
    var node = document.createElement('input');
    node.type = 'hidden';
    node.value = value;
    node.name = name;
    $('CHARM_FORM').appendChild(node);
  }
  
  __CHARM.iFrameLoaded = function(){ 
    if(!sending) return; sending = false; success();
  };
  
  __CHARM.iFrameError = function(){ 
    if(!sending) return; sending = false; error();
  };
  
  function show(options){
    if(shown) return;
    hideTab();
    shown = true;
    
    callbacks = options || {};
    
    before();
    
    if(!box) {
      box = document.createElement('div');
      box.id = "CHARM_BOX";
      box.innerHTML = BOX;
      document.body.appendChild(box);
      
      if(!('email' in __CHARM) || !(/@/.test(__CHARM.email+''))){
        email = document.createElement('input');
        email.id   = 'CHARM_EMAIL';
        email.type = 'text';
        email.name = 'email';
        email.value = '';
        customize('your_email');
        customize('your_comment');
        $('CHARM_YOUR_EMAIL').appendChild(email);
        box.className = 'closed' + ($('CHARM_YOUR_EMAIL') ? ' with-email' : '');
      } else {
        $('CHARM_YOUR_EMAIL').parentNode.removeChild($('CHARM_YOUR_EMAIL'));
        $('CHARM_YOUR_COMMENT').parentNode.removeChild($('CHARM_YOUR_COMMENT'));
        userdata('email');
      }

      customize('text');
      customize('submit', 'value');
      customize('cancel');
      
      userdata('key');
      userdata('customer');
      userdata('customer_info');
      userdata('first_name');
      userdata('last_name');
      userdata('user_info');      
      userdata('customer_id');
      userdata('subject');

      data('location', location.href);
      data('user_agent', navigator.userAgent);
      data('local_time', (new Date).toString());

      if('charm_url' in __CHARM){
        $('CHARM_FORM').action = __CHARM['charm_url'];
      }

      setTimeout(function(){
        var scrollTop = document.body.scrollTop;
        
        box.className = 'open' + ($('CHARM_YOUR_EMAIL') ? ' with-email' : '');
        css(box, 'display:block');
        $('CHARM_FORM').onsubmit = function(){ 
          var ok = !($('CHARM_COMMENT').value.replace(/^\s+/, '').replace(/\s+$/, '') == "");
          if(ok){
            sending = true; 
            hide(); 
            message('feedback_sending', false);
          }
          return ok;
        };
        $('CHARM_CANCEL').onclick = function(){ cancel(); return false };
        
        setTimeout(function(){
          if($('CHARM_EMAIL'))
            $('CHARM_EMAIL').focus();
          else
            $('CHARM_COMMENT').focus();
          document.body.scrollTop = scrollTop;
        }, 10);
      }, 10);

      return;
    }
    css(box, 'display:block');
    box.offsetLeft;
    box.className = 'open' + ($('CHARM_YOUR_EMAIL') ? ' with-email' : '');
    if($('CHARM_EMAIL'))
      $('CHARM_EMAIL').focus();
    else
      $('CHARM_COMMENT').focus();
  }
  
  __CHARM.show = show;
  
  function cancel(){
    hide();
    showTab();
    after();
  }
  
  function success(){
    showTab();
    message('feedback_sent');
    if(__CHARM.success) __CHARM.success();
    if(callbacks.success) callbacks.success();
    after();
    $('CHARM_COMMENT').value = "";
    callbacks = {};
  }
  
  function error(){
    show();
    message('feedback_error', false);
    if(__CHARM.error) __CHARM.error();
    if(callbacks.error) callbacks.error();
    after();
    callbacks = {};
  }

  function message(id, autoclose){
    if(openmsg) closeMessage(openmsg);
    var msg = document.createElement('div');
    msg.id = "CHARM_MESSAGE";
    msg.innerHTML = template((id in __CHARM) ? __CHARM[id] : DEFAULTS[id]);
    document.body.appendChild(msg);
    msg.className = 'open';
    msg.onclick = function(){ closeMessage(msg); };
    if(autoclose === undefined || !autoclose === false)
      setTimeout(function(){ closeMessage(msg); }, 4000);
    openmsg = msg;
  }

  function closeMessage(msg){
    msg.className = 'closed';
    setTimeout(function(){
      if(msg && msg.parentNode) msg.parentNode.removeChild(msg);
    }, 260);
    openmsg = null;
  }
  
  function hide(){
    if(!shown) return;
    shown = false;
    box.className = 'closed' + ($('CHARM_YOUR_EMAIL') ? ' with-email' : '');
    setTimeout(function(){
      css(box, 'display:none');
    }, 260);
  }

  function hideTab(){
    tab.className = 'hidden';
  }

  function showTab(){
    tab.className = '';
  }
  
  function after(){
    if(__CHARM.after) __CHARM.after();
    if(callbacks.after) callbacks.after();
    callbacks = {};
  }
  
  function before(){
    if(__CHARM.before) __CHARM.before();
    if(callbacks.before) callbacks.before();
  }
  
  init();
})();
