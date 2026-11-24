/* 화면 동작 — 보통은 고칠 필요가 없습니다. 내용은 index.html, 강의 정보는 config.js */
(function(){
  var L=window.LECTURES||{}, key=new URLSearchParams(location.search).get('k')||'default';
  var c=Object.assign({},L['default']||{},L[key]||{});
  function set(id,v,html){var e=document.getElementById(id);if(!e)return;if(!v){e.style.display='none';return}html?e.innerHTML=v:e.textContent=v}
  set('hTag',c.tag);set('hTitle',c.title,true);set('hSub',c.sub);set('hIntro',c.intro);
  set('hMeta',[c.date,c.place].filter(Boolean).join(' · '));
  if(c.title)document.title=c.title.replace(/<br\s*\/?>/g,' ')+' | AI 실습 페이지';
  var P=window.PROFILE||{};
  set('pName',P.name);set('pOne',[P.role,P.oneLine].filter(Boolean).join(' · '));
  var ul=document.getElementById('pLines');(P.lines||[]).forEach(function(l){var li=document.createElement('li');li.innerHTML='<em></em><span></span>';li.firstChild.textContent=l[0];li.lastChild.textContent=l[1];ul.appendChild(li)});
  var lk=document.getElementById('pLinks');var links=(P.links||[]).slice();if(P.contact)links.push(['강의 문의',P.contact]);
  links.forEach(function(l){var a=document.createElement('a');a.href=l[1];a.target='_blank';a.rel='noopener';a.textContent=l[0];lk.appendChild(a)});
  set('foot',window.FOOTNOTE);
  var C=window.CAMP;var band=document.getElementById('camp');
  if(!C||!C.show){if(band)band.style.display='none';var tc=document.querySelector('.tab.camp');if(tc)tc.style.display='none';var ta=document.getElementById('topApply');if(ta)ta.style.display='none';document.querySelectorAll('a[href="#camp"]').forEach(function(x){x.style.display='none'});}
  else{
    set('cKicker',C.kicker);set('cLead',C.lead);set('cNotice',C.notice);
    var t=document.getElementById('cTitle');(C.title||[]).forEach(function(x){var sp=document.createElement('span');sp.textContent=x;t.appendChild(sp)});
    var dl=document.getElementById('cSpec');(C.spec||[]).forEach(function(r){var d=document.createElement('div');var dt=document.createElement('dt');dt.textContent=r[0];var dd=document.createElement('dd');dd.textContent=r[1];d.appendChild(dt);d.appendChild(dd);dl.appendChild(d)});
    var sf=document.getElementById('cSfm');(C.steps||[]).forEach(function(r,i){var d=document.createElement('div');d.innerHTML='<b></b><span></span>';d.firstChild.textContent=r[0];if(i===2)d.firstChild.className='c';d.lastChild.textContent=r[1]+' · '+r[2];sf.appendChild(d)});
    var ap=document.getElementById('cApply');if(C.applyUrl)ap.href=C.applyUrl;else ap.style.display='none';
    var mo=document.getElementById('cMore');if(C.moreUrl)mo.href=C.moreUrl;else mo.style.display='none';
  }
})();

document.querySelectorAll('.tab').forEach(function(b){b.addEventListener('click',function(){
  if(b.dataset.t==='camp'){document.getElementById('camp').scrollIntoView({behavior:'smooth'});return}
  document.querySelectorAll('.tab').forEach(function(x){x.classList.remove('on')});
  document.querySelectorAll('.panel').forEach(function(x){x.classList.remove('on')});
  b.classList.add('on');document.getElementById('p-'+b.dataset.t).classList.add('on');
  b.scrollIntoView({inline:'center',block:'nearest',behavior:'smooth'});
  window.scrollTo({top:document.querySelector('.tabs').offsetTop,behavior:'smooth'});
})});

function cp(el){
  var t=el.querySelector('.txt')||el;
  var s=t.innerText.replace(/\s+\n/g,'\n').trim();
  if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(s).then(toast).catch(function(){fallback(s)})}else fallback(s);
}
function fallback(s){var a=document.createElement('textarea');a.value=s;a.style.position='fixed';a.style.opacity='0';document.body.appendChild(a);a.select();try{document.execCommand('copy')}catch(e){}a.remove();toast()}
var tt;function toast(){var t=document.getElementById('toast');t.classList.add('show');clearTimeout(tt);tt=setTimeout(function(){t.classList.remove('show')},1800)}

var cards=[].slice.call(document.querySelectorAll('.card[data-id]')).filter(function(c){return c.querySelector('.done')});
var total=cards.length;document.getElementById('totalN').textContent=total;
var done=new Set();
try{done=new Set(JSON.parse(localStorage.getItem('fab-done')||'[]'))}catch(e){}
function paint(){
  cards.forEach(function(c){var b=c.querySelector('.done');var on=done.has(c.dataset.id);b.classList.toggle('on',on);b.textContent=on?'완료 ✓':'완료 표시'});
  var n=cards.filter(function(c){return done.has(c.dataset.id)}).length;
  document.getElementById('doneN').textContent=n;document.getElementById('barFill').style.width=(n/total*100)+'%';
}
function dn(btn){var id=btn.closest('.card').dataset.id;done.has(id)?done.delete(id):done.add(id);try{localStorage.setItem('fab-done',JSON.stringify([].concat(Array.from(done))))}catch(e){}paint()}
paint();

var zz=1;function fz(d){zz=Math.max(.9,Math.min(1.4,zz+d*.1));document.body.style.zoom=zz}
var made=false;
function qr(on){
  document.getElementById('qr').classList.toggle('on',on);
  if(on&&!made){var u=location.href.split('#')[0];document.getElementById('qru').textContent=u;
    try{new QRCode(document.getElementById('qrc'),{text:u,width:260,height:260,correctLevel:QRCode.CorrectLevel.M});made=true}
    catch(e){document.getElementById('qrc').textContent='QR을 불러오지 못했어요. 위 주소를 직접 입력해 주세요.'}}
}

['myline','myepisode'].forEach(function(id){var t=document.getElementById(id);if(!t)return;var k='fab-'+id;
  try{t.value=localStorage.getItem(k)||''}catch(e){}
  t.addEventListener('input',function(){try{localStorage.setItem(k,t.value)}catch(e){}})});
