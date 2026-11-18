const FORMSPREE_ENDPOINT = 'https://formspree.io/f/maeojppl';
const BUSINESS_EMAIL = 'frameandfetephotobooth@gmail.com';

const menuButton=document.querySelector('.menu-toggle');
const navs=document.querySelectorAll('.nav');
menuButton?.addEventListener('click',()=>{const open=[...navs].some(n=>n.classList.contains('open'));navs.forEach(n=>n.classList.toggle('open',!open));menuButton.setAttribute('aria-expanded',String(!open));});
navs.forEach(nav=>nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{navs.forEach(n=>n.classList.remove('open'));menuButton?.setAttribute('aria-expanded','false');})));
const year=document.getElementById('year'); if(year) year.textContent=new Date().getFullYear();
const form=document.getElementById('inquiry');
const review=document.getElementById('inquiry-review');
const status=document.getElementById('form-status');
let inquiryText='';
let pendingFormData=null;

form?.addEventListener('submit',e=>{
  e.preventDefault();
  if(!form.reportValidity()) return;
  pendingFormData=new FormData(form);
  const data=pendingFormData;
  const enhancements=data.getAll('enhancements');
  const lines=[
    'FRAME & FÊTE — EVENT EXPERIENCE REQUEST',
    `Name: ${data.get('name')}`,
    `Email: ${data.get('email')}`,
    `Phone: ${data.get('phone')||'Not provided'}`,
    `Preferred contact: ${data.get('contact_preference')}`,
    `Event: ${data.get('event')}`,
    `Date: ${data.get('date')}`,
    `Venue: ${data.get('venue')||'Not provided'}`,
    `Location: ${data.get('location')}`,
    `Estimated guests: ${data.get('guests')||'Not provided'}`,
    `Event start: ${data.get('event_time')||'Not provided'}`,
    `Booth ready time: ${data.get('booth_time')||'Not provided'}`,
    `Requested duration: ${data.get('duration')}`,
    `Setting: ${data.get('setting')||'Not provided'}`,
    `Experience: ${data.get('package')}`,
    `Enhancements: ${enhancements.length?enhancements.join(', '):'None selected'}`,
    `Additional notes: ${data.get('details')||'None'}`,
    '',
    'This is an inquiry only. Availability, final pricing, contract, and retainer are subject to confirmation by Frame & Fête.'
  ];
  inquiryText=lines.join('\n');
  review.hidden=false;
  review.innerHTML=`<h4>Review your experience request</h4><p><strong>${escapeHtml(data.get('package'))}</strong> · ${escapeHtml(data.get('event'))} · ${escapeHtml(data.get('date'))}</p><p>${escapeHtml(data.get('location'))} · ${escapeHtml(data.get('duration'))}</p><p>${enhancements.length?escapeHtml(enhancements.join(' · ')):'No enhancements selected yet.'}</p><p>When you're ready, submit this request directly to Frame & Fête. We'll review availability and follow up with your custom details.</p><div class="review-actions"><button class="gold-button" type="button" id="send-inquiry">SUBMIT MY INQUIRY →</button><button type="button" id="copy-inquiry">COPY REQUEST SUMMARY</button><button type="button" class="secondary" id="edit-inquiry">EDIT MY DETAILS</button></div><p class="form-help">Your inquiry will be sent to ${BUSINESS_EMAIL}. This does not reserve your date or collect payment.</p><p id="copy-status" aria-live="polite"></p><p id="send-status" aria-live="polite"></p>`;
  status.textContent='';
  review.scrollIntoView({behavior:'smooth',block:'nearest'});
  document.getElementById('copy-inquiry')?.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(inquiryText);document.getElementById('copy-status').textContent='Request summary copied.';}catch{document.getElementById('copy-status').textContent='Copy is unavailable in this browser.';}});
  document.getElementById('edit-inquiry')?.addEventListener('click',()=>{review.hidden=true;form.scrollIntoView({behavior:'smooth',block:'start'});});
  document.getElementById('send-inquiry')?.addEventListener('click',sendInquiry);
});

async function sendInquiry(){
  const button=document.getElementById('send-inquiry');
  const sendStatus=document.getElementById('send-status');
  if(!pendingFormData||!button) return;
  button.disabled=true; button.textContent='SENDING YOUR INQUIRY…';
  sendStatus.textContent='';
  const payload=new FormData();
  for(const [key,value] of pendingFormData.entries()) payload.append(key,value);
  payload.append('_subject',`Frame & Fête Event Inquiry — ${pendingFormData.get('event')} — ${pendingFormData.get('date')}`);
  payload.append('request_summary',inquiryText);
  payload.append('_replyto',String(pendingFormData.get('email')||''));
  try{
    const response=await fetch(FORMSPREE_ENDPOINT,{method:'POST',body:payload,headers:{'Accept':'application/json'}});
    if(!response.ok){let message='We could not submit your inquiry right now. Please try again or email us directly.';try{const result=await response.json();if(result.errors?.length) message=result.errors.map(x=>x.message).join(' ');}catch{} throw new Error(message);}
    review.innerHTML=`<div class="submission-success"><h4>Thank you! Your inquiry has been submitted.</h4><p>Your event request has been sent to Frame & Fête. We'll review your details and follow up using your preferred contact method.</p><p><strong>Remember:</strong> Your date is not reserved until availability is confirmed and booking is completed.</p></div>`;
    status.textContent='Inquiry successfully submitted.';
  }catch(error){
    button.disabled=false; button.textContent='TRY SUBMITTING AGAIN →';
    sendStatus.textContent=error.message||'Something went wrong. Please try again.';
    const fallback=document.createElement('p');
    fallback.className='form-help';
    fallback.textContent=`You can also email your request to ${BUSINESS_EMAIL}.`;
    sendStatus.after(fallback);
  }
}
function escapeHtml(value){return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
