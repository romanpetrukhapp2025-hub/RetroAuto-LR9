const toggle = document.getElementById('menuToggle');
const nav = document.getElementById('mainNav');
function closeMenu(){nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Відкрити меню');}
toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Закрити меню':'Відкрити меню');});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});


// LR9: client-side validation. No network request is made.
(() => {
 const form=document.getElementById('feedbackForm'); if(!form)return;
 const fields={name:form.elements.name,email:form.elements.email,phone:form.elements.phone,message:form.elements.message,consent:form.elements.consent};
 const messages={name:'Введіть коректне імʼя: 2–60 символів, тільки літери, пробіли, дефіси або апострофи.',email:'Введіть коректну адресу електронної пошти.',phone:'Введіть телефон у форматі +380XXXXXXXXX.',message:'Повідомлення має містити щонайменше 10 символів.',consent:'Потрібно підтвердити згоду.'};
 const emailPattern=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
 const phonePattern=/^\+380\d{9}$/;
 const namePattern=/^[\p{L}]+(?:[ '\u2019-][\p{L}]+)*$/u;
 const validate=(key)=>{const f=fields[key],value=key==='consent'?f.checked:f.value.trim(); let valid=false;
  if(key==='name')valid=value.length>=2&&value.length<=60&&namePattern.test(value);
  if(key==='email')valid=emailPattern.test(value)&&value.length<=254;
  if(key==='phone')valid=phonePattern.test(value);
  if(key==='message')valid=value.length>=10;
  if(key==='consent')valid=value===true;
  const wrapper=f.closest('.form-field'), error=document.getElementById(key+'Error');
  wrapper.classList.toggle('is-invalid',!valid);wrapper.classList.toggle('is-valid',valid);
  f.setAttribute('aria-invalid',String(!valid));error.textContent=valid?'':messages[key];return valid;
 };
 const phone=fields.phone;
 phone.addEventListener('input',()=>{let raw=phone.value.replace(/[^\d+]/g,''); if(raw.startsWith('0'))raw='+38'+raw;else if(raw.startsWith('380'))raw='+'+raw; else if(raw.startsWith('80'))raw='+3'+raw; if(raw.startsWith('+'))raw='+'+raw.slice(1).replace(/\D/g,'');else raw=raw.replace(/\D/g,'');phone.value=raw.slice(0,13); if(phone.dataset.touched==='true')validate('phone');});
 Object.entries(fields).forEach(([key,f])=>{f.addEventListener('blur',()=>{f.dataset.touched='true';validate(key)});f.addEventListener(key==='consent'?'change':'input',()=>{if(f.dataset.touched==='true')validate(key)});});
 const modal=document.getElementById('successModal'),dialog=modal.querySelector('[role=dialog]'),close=document.getElementById('modalClose'),ok=document.getElementById('modalOk');let previouslyFocused=null;
 function hideModal(){modal.hidden=true;document.body.style.overflow='';(previouslyFocused||form.querySelector('[type=submit]')).focus();}
 function showModal(){previouslyFocused=document.activeElement;modal.hidden=false;document.body.style.overflow='hidden';dialog.focus();}
 form.addEventListener('submit',e=>{e.preventDefault();let allValid=true,firstInvalid=null;Object.keys(fields).forEach(key=>{fields[key].dataset.touched='true';if(!validate(key)){allValid=false;firstInvalid??=fields[key]}});if(!allValid){firstInvalid.focus();return;}form.reset();Object.values(fields).forEach(f=>{f.dataset.touched='false';f.removeAttribute('aria-invalid');f.closest('.form-field').classList.remove('is-valid','is-invalid')});showModal();});
 close.addEventListener('click',hideModal);ok.addEventListener('click',hideModal);modal.addEventListener('click',e=>{if(e.target===modal)hideModal();});document.addEventListener('keydown',e=>{if(modal.hidden)return;if(e.key==='Escape')hideModal();if(e.key==='Tab'){const items=[close,ok];const i=items.indexOf(document.activeElement);if(e.shiftKey&&i<=0){e.preventDefault();ok.focus()}else if(!e.shiftKey&&i===items.length-1){e.preventDefault();close.focus()}}});
})();
