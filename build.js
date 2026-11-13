// FreelanceMath static site generator. Run: node build.js  -> writes ./dist
// Env (all optional): SITE_URL, CONTACT_EMAIL, GA_ID (G-XXXX), ADSENSE_PUB (ca-pub-XXXX)
const fs = require('fs'), path = require('path');
const E = process.env, NAME = 'FreelanceMath';
const SITE = (E.SITE_URL || 'https://example.com').replace(/\/$/, '');
const MAIL = E.CONTACT_EMAIL || 'REPLACE_WITH_YOUR_EMAIL', GA = E.GA_ID || '', PUB = E.ADSENSE_PUB || '';
const H = "var m=function(n){return n.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})},p=function(n){return m(n)+'%'};var need=function(c,msg){if(!c)throw Error(msg)};";
eval(H);

const T = [
{ s:'hourly-rate-calculator', t:'Freelance Hourly Rate Calculator', c:'Pricing',
  d:'Find the hourly rate you must charge to reach your income goal after expenses, savings and unpaid time.',
  f:[['income','Desired yearly take-home income',60000],['exp','Yearly business expenses',6000],['tax','Tax / savings set-aside (%)',20],['hrs','Billable hours per week',25],['wks','Working weeks per year',46]],
  fn:v=>{need(v.tax<100,'Set-aside must be below 100%.');need(v.hrs>0&&v.wks>0,'Hours and weeks must be above zero.');var g=(v.income+v.exp)/(1-v.tax/100);return [['Revenue needed per year',m(g)],['Minimum hourly rate',m(g/(v.hrs*v.wks))]]},
  u:'Freelancers and consultants setting or reviewing their rates.',
  x:'Revenue needed = (take-home income + expenses) ÷ (1 − set-aside %). Hourly rate = revenue needed ÷ (billable hours per week × working weeks).',
  l:'The set-aside is a flat percentage, not a tax calculation. Check local rules or ask an accountant for your real tax figure.',
  q:[['Why use billable hours instead of full-time hours?','Admin, pitching and revisions are often unpaid. Enter only the hours you expect to invoice.'],['What is the set-aside percentage?','The share of revenue you reserve for taxes or savings before counting it as income.']]},
{ s:'project-quote-calculator', t:'Project Quote Calculator', c:'Pricing',
  d:'Turn an hours estimate into a fixed-price quote with a safety buffer and project expenses.',
  f:[['hours','Estimated hours',40],['rate','Hourly rate',50],['buf','Contingency buffer (%)',15],['exp','Project expenses (software, assets)',200]],
  fn:v=>{var l=v.hours*v.rate,b=l*v.buf/100;return [['Labour',m(l)],['Buffer',m(b)],['Expenses',m(v.exp)],['Quote total',m(l+b+v.exp)]]},
  u:'Anyone who prices projects as a fixed fee rather than by the hour.',
  x:'Labour = hours × rate. Buffer = labour × buffer %. Quote = labour + buffer + expenses.',
  l:'The quote is only as good as your hours estimate. Revisit estimates after each project to see how far off they were.',
  q:[['How big should the buffer be?','It depends on how well-defined the scope is. Vague scopes and new client types justify a larger buffer.'],['Should expenses carry a buffer?','Here they are added at cost. Add your own markup if you resell tools or assets.']]},
{ s:'profit-margin-calculator', t:'Profit Margin Calculator', c:'Pricing',
  d:'Calculate profit, profit margin and markup from your cost and selling price.',
  f:[['cost','Cost',60],['price','Selling price',100]],
  fn:v=>{need(v.price>0,'Selling price must be above zero.');need(v.cost>0,'Cost must be above zero.');var pr=v.price-v.cost;return [['Profit',m(pr)],['Profit margin',p(pr/v.price*100)],['Markup',p(pr/v.cost*100)]]},
  u:'Sellers of products or services checking whether a price is profitable.',
  x:'Profit = price − cost. Margin = profit ÷ price × 100. Markup = profit ÷ cost × 100.',
  l:'Only the cost you enter is counted. Include labour, fees and shipping for a realistic margin.',
  q:[['What is the difference between margin and markup?','Margin is profit as a share of the price; markup is profit as a share of the cost. The same sale gives a lower margin than markup.'],['Can margin be negative?','Yes, when the price is below cost. This tool shows the loss as a negative profit.']]},
{ s:'markup-price-calculator', t:'Markup Price Calculator', c:'Pricing',
  d:'Work out the selling price for a target markup and see the resulting profit margin.',
  f:[['cost','Cost',60],['mk','Markup (%)',40]],
  fn:v=>{var pr=v.cost*(1+v.mk/100);return [['Selling price',m(pr)],['Profit per sale',m(pr-v.cost)],['Resulting margin',p(v.mk/(100+v.mk)*100)]]},
  u:'Resellers and service sellers who price as "cost plus a percentage".',
  x:'Price = cost × (1 + markup ÷ 100). Margin = markup ÷ (100 + markup) × 100.',
  l:'Does not account for market prices or competitors; a markup that looks fine may still be too high for your market.',
  q:[['Why is my margin lower than my markup?','Margin is measured against the higher selling price, so it is always lower than the markup percentage.'],['Is a 100% markup a 100% margin?','No. A 100% markup gives a 50% margin.']]},
{ s:'break-even-calculator', t:'Break-Even Calculator', c:'Business',
  d:'Find how many units you must sell to cover fixed costs.',
  f:[['fix','Fixed costs',5000],['price','Price per unit',25],['vc','Variable cost per unit',10]],
  fn:v=>{need(v.price>v.vc,'Price per unit must be higher than variable cost per unit.');var u=v.fix/(v.price-v.vc);return [['Contribution per unit',m(v.price-v.vc)],['Break-even units',m(Math.ceil(u)).replace('.00','')],['Break-even revenue',m(Math.ceil(u)*v.price)]]},
  u:'Small businesses and side-hustlers planning a launch or a price change.',
  x:'Break-even units = fixed costs ÷ (price − variable cost), rounded up to whole units.',
  l:'Assumes constant price and costs. Discounts, volume pricing and step costs will move the real figure.',
  q:[['What counts as a fixed cost?','Costs that do not change with sales volume, such as rent, subscriptions and insurance.'],['Why round up?','You cannot sell part of a unit, so the break-even point is the next whole unit.']]},
{ s:'invoice-total-calculator', t:'Invoice Total Calculator', c:'Business',
  d:'Calculate an invoice total with a discount and tax or VAT.',
  f:[['sub','Subtotal',1200],['disc','Discount (%)',10],['tax','Tax / VAT rate (%)',8]],
  fn:v=>{need(v.disc<=100,'Discount cannot exceed 100%.');var d=v.sub*v.disc/100,a=v.sub-d,t=a*v.tax/100;return [['Discount',m(d)],['After discount',m(a)],['Tax',m(t)],['Invoice total',m(a+t)]]},
  u:'Freelancers who invoice with discounts and sales tax or VAT.',
  x:'Discount applies first, then tax is charged on the discounted amount: total = subtotal × (1 − discount) × (1 + tax).',
  l:'Some jurisdictions tax before discounts or require specific rounding. Confirm your local invoicing rules.',
  q:[['Is tax applied before or after the discount?','This tool applies it after. Some regions differ, so check your local rules.'],['Does it round per line item?','No. It calculates on the subtotal you enter.']]},
{ s:'roi-calculator', t:'ROI Calculator', c:'Business',
  d:'Calculate return on investment as profit and percentage.',
  f:[['inv','Amount invested',2000],['ret','Amount returned',2600]],
  fn:v=>{need(v.inv>0,'Amount invested must be above zero.');var g=v.ret-v.inv;return [['Net profit',m(g)],['ROI',p(g/v.inv*100)]]},
  u:'Anyone comparing the payback of a tool, ad spend or equipment purchase.',
  x:'ROI = (amount returned − amount invested) ÷ amount invested × 100.',
  l:'ROI ignores time. A 30% return over one year is very different from 30% over five.',
  q:[['Is a higher ROI always better?','Not necessarily. Consider the time taken, the risk and the amount of capital tied up.'],['Can ROI be negative?','Yes, when you get back less than you put in.']]},
{ s:'percentage-change-calculator', t:'Percentage Change Calculator', c:'Business',
  d:'Calculate the percentage increase or decrease between two values.',
  f:[['old','Old value',80],['nw','New value',100]],
  fn:v=>{need(v.old>0,'Old value must be above zero.');var d=v.nw-v.old;return [['Difference',m(d)],['Change',p(d/v.old*100)],['Direction',d>0?'Increase':d<0?'Decrease':'No change']]},
  u:'Anyone tracking income, prices or traffic month to month.',
  x:'Change % = (new − old) ÷ old × 100.',
  l:'Percentages are relative to the old value, so a 50% drop followed by a 50% rise does not return to the start.',
  q:[['Why is the old value required to be above zero?','Percentage change from zero is undefined.'],['How do I calculate a decrease?','Enter the higher value as old and the lower as new; the result is negative.']]},
{ s:'loan-emi-calculator', t:'Loan EMI Calculator', c:'Money',
  d:'Estimate the monthly instalment, total interest and total repayment on a fixed-rate loan.',
  f:[['pr','Loan amount',10000],['rate','Annual interest rate (%)',12],['yrs','Loan term (years)',3]],
  fn:v=>{need(v.yrs>0,'Term must be above zero.');var r=v.rate/1200,n=Math.round(v.yrs*12),e=r===0?v.pr/n:v.pr*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1);return [['Monthly instalment',m(e)],['Total repayment',m(e*n)],['Total interest',m(e*n-v.pr)]]},
  u:'Borrowers comparing loan offers or planning a repayment budget.',
  x:'EMI = P × r × (1 + r)ⁿ ÷ ((1 + r)ⁿ − 1), where r is the monthly rate (annual ÷ 12) and n the number of months.',
  l:'Assumes a fixed rate and equal monthly payments. Fees, insurance and variable rates are not included.',
  q:[['Is this the same as a bank quote?','Banks may add fees or use different compounding, so treat this as an estimate.'],['What if the rate is 0%?','The loan amount is simply divided across the months.']]},
{ s:'compound-interest-calculator', t:'Compound Interest Calculator', c:'Money',
  d:'See how savings grow with monthly compounding and regular monthly contributions.',
  f:[['pr','Starting amount',1000],['mc','Monthly contribution',100],['rate','Annual return (%)',7],['yrs','Years',10]],
  fn:v=>{need(v.yrs>0,'Years must be above zero.');var r=v.rate/1200,n=Math.round(v.yrs*12),g=r===0?1:Math.pow(1+r,n),fv=v.pr*g+(r===0?v.mc*n:v.mc*(g-1)/r),c=v.pr+v.mc*n;return [['Future value',m(fv)],['Total contributed',m(c)],['Interest earned',m(fv-c)]]},
  u:'Savers and investors estimating long-term growth.',
  x:'FV = P × (1 + r)ⁿ + C × ((1 + r)ⁿ − 1) ÷ r, with monthly rate r, n months, and contributions C paid at month end.',
  l:'Assumes a constant return. Real returns vary, and inflation, fees and taxes are not included.',
  q:[['Is the return guaranteed?','No. The tool shows what a constant rate would produce, not a forecast.'],['When are contributions made?','At the end of each month.']]},
{ s:'savings-goal-calculator', t:'Savings Goal Calculator', c:'Money',
  d:'Find the monthly amount to save to reach a target by a deadline.',
  f:[['goal','Savings goal',10000],['cur','Current savings',1000],['rate','Annual return (%)',4],['mo','Months to goal',24]],
  fn:v=>{need(v.mo>=1,'Months to goal must be at least 1.');var r=v.rate/1200,n=Math.round(v.mo),g=r===0?1:Math.pow(1+r,n),d=v.goal-v.cur*g;if(d<=0)return [['Monthly saving needed',m(0)],['Note','Your current savings already reach the goal.']];var s=r===0?d/n:d*r/(g-1);return [['Monthly saving needed',m(s)],['Total you will contribute',m(s*n)],['Growth from returns',m(v.goal-v.cur-s*n)]]},
  u:'People saving for an emergency fund, equipment or a deposit.',
  x:'Monthly saving = (goal − current × (1 + r)ⁿ) × r ÷ ((1 + r)ⁿ − 1), deposits at month end.',
  l:'Assumes a steady return; use 0% for a cautious, cash-only estimate.',
  q:[['What return should I enter?','Use your account\'s actual interest rate, or 0% to ignore growth.'],['What if I already have enough?','The tool tells you that no further saving is needed.']]},
{ s:'work-hours-cost-calculator', t:'Cost in Work Hours Calculator', c:'Money',
  d:'Convert a price into the hours and working days of earnings it represents.',
  f:[['price','Price of the item',300],['rate','Your hourly earnings (after tax)',25],['hpd','Hours in a working day',8]],
  fn:v=>{need(v.rate>0,'Hourly earnings must be above zero.');need(v.hpd>0,'Hours per day must be above zero.');var h=v.price/v.rate;return [['Hours of work',m(h)],['Working days',m(h/v.hpd)]]},
  u:'Anyone weighing a purchase against the time it takes to earn it.',
  x:'Hours = price ÷ hourly earnings. Working days = hours ÷ hours per working day.',
  l:'Use after-tax earnings for a realistic figure. Unpaid time spent working is not counted.',
  q:[['Which hourly figure should I use?','Your take-home hourly amount after tax and expenses gives the most honest answer.'],['Is this a spending recommendation?','No. It only expresses a price in terms of your time.']]},
{ s:'late-fee-calculator', t:'Late Fee Calculator', c:'Business',
  d:'Work out the late fee on an overdue invoice and the total now due.',
  f:[['amt','Invoice amount',1000],['rate','Late-fee rate per month (%)',1.5],['days','Days overdue',45]],
  fn:v=>{need(v.amt>0,'Invoice amount must be above zero.');need(v.rate>=0,'Late-fee rate cannot be negative.');need(v.days>=0,'Days overdue cannot be negative.');var f=v.amt*v.rate/100*v.days/30;return [['Late fee',m(f)],['Total due',m(v.amt+f)],['Fee per 30 days',m(v.amt*v.rate/100)]]},
  u:'Freelancers chasing overdue invoices who need a clear late-fee figure to quote.',
  x:'Late fee = invoice amount × monthly rate % × (days overdue ÷ 30). Total due = invoice amount + late fee.',
  l:'Only charge a late fee if your contract or invoice terms allow it. Some jurisdictions cap late fees.',
  q:[['Is the fee charged per month or per day?','Per month, pro-rated by day: 45 days counts as 1.5 months.'],['What if no late fee was agreed?','Then this tool only shows what the fee would be — check your contract before charging it.']]},
{ s:'cash-runway-calculator', t:'Cash Runway Calculator', c:'Business',
  d:'See how many months your savings last at your current monthly spending.',
  f:[['sav','Cash savings',12000],['exp','Monthly expenses',3000]],
  fn:v=>{need(v.exp>0,'Monthly expenses must be above zero.');need(v.sav>=0,'Savings cannot be negative.');return [['Cash runway (months)',m(v.sav/v.exp)],['Monthly expenses',m(v.exp)],['Cash savings',m(v.sav)]]},
  u:'Freelancers and small businesses checking how long they can keep going without new income.',
  x:'Runway (months) = cash savings ÷ monthly expenses.',
  l:'Assumes spending stays flat and no new income arrives. Irregular bills will shorten the real runway.',
  q:[['Does it count future income?','No — it shows how long savings alone last.'],['What counts as monthly expenses?','All regular outgoings: rent, subscriptions, food, insurance and business costs.']]},
{ s:'utilization-rate-calculator', t:'Utilization Rate Calculator', c:'Business',
  d:'Find what share of your available working hours you actually bill for.',
  f:[['bill','Billable hours per week',25],['avail','Available hours per week',40]],
  fn:v=>{need(v.avail>0,'Available hours must be above zero.');need(v.bill>=0,'Billable hours cannot be negative.');need(v.bill<=v.avail,'Billable hours cannot exceed available hours.');return [['Utilization rate',p(v.bill/v.avail*100)],['Non-billable hours',m(v.avail-v.bill)],['Billable hours',m(v.bill)]]},
  u:'Freelancers tracking how much of their working week turns into invoiced time.',
  x:'Utilization = billable hours ÷ available hours × 100. Non-billable hours = available − billable.',
  l:'Available hours are the hours you could work, not 24 hours a day. Admin and pitching count as non-billable here.',
  q:[['What is a good utilization rate?','Many freelancers aim for 60–75%; the rest goes to admin, marketing and learning.'],['Should holidays count?','No — use a typical working week, excluding holiday weeks.']]},
{ s:'retainer-pricing-calculator', t:'Retainer Pricing Calculator', c:'Pricing',
  d:'Price a monthly retainer from hours, hourly rate and a retainer discount.',
  f:[['hrs','Hours per month',20],['rate','Hourly rate',50],['disc','Retainer discount (%)',10]],
  fn:v=>{need(v.hrs>0,'Hours per month must be above zero.');need(v.rate>0,'Hourly rate must be above zero.');need(v.disc>=0&&v.disc<100,'Discount must be between 0% and 100%.');var f=v.hrs*v.rate,d=f*v.disc/100;return [['Full price',m(f)],['Discount',m(d)],['Monthly retainer',m(f-d)]]},
  u:'Freelancers offering clients a fixed monthly block of hours at a discounted rate.',
  x:'Full price = hours × hourly rate. Discount = full price × discount %. Retainer = full price − discount.',
  l:'The discount is the only benefit priced here — it does not value the income stability a retainer brings.',
  q:[['Why discount a retainer?','Clients pay for guaranteed hours in advance, so a small discount is common in exchange for that certainty.'],['What if hours go unused?','Agree in advance whether unused hours roll over, expire, or are refunded.']]}
];

// --- self-test (build fails if a tool is wrong) ---
const near = (a, b, tol, msg) => { if (Math.abs(a - b) > tol) throw Error('TEST FAIL ' + msg + ': ' + a + ' vs ' + b); };
const num = s => parseFloat(String(s).replace(/,/g, ''));
const run = (s, o) => { const t = T.find(x => x.s === s), v = {}; t.f.forEach(f => v[f[0]] = f[2]); Object.assign(v, o); return t.fn(v); };
T.forEach(t => { const v = {}; t.f.forEach(f => v[f[0]] = f[2]); t.fn(v).forEach(r => { if (/NaN|Infinity/.test(r[1])) throw Error('TEST FAIL bad output in ' + t.s); }); });
near(num(run('hourly-rate-calculator')[1][1]), 71.74, .01, 'hourly');
near(num(run('markup-price-calculator')[0][1]), 84, .001, 'markup price');
near(num(run('markup-price-calculator')[2][1]), 28.57, .01, 'markup margin');
near(num(run('loan-emi-calculator')[0][1]), 332.14, .01, 'emi');
near(num(run('compound-interest-calculator')[0][1]), 19318, 20, 'compound');
near(num(run('profit-margin-calculator')[1][1]), 40, .001, 'margin');
near(num(run('percentage-change-calculator')[1][1]), 25, .001, 'pct');
near(num(run('invoice-total-calculator')[3][1]), 1166.4, .001, 'invoice');
near(num(run('break-even-calculator')[1][1]), 334, .001, 'break-even');
near(num(run('savings-goal-calculator', { rate: 0, cur: 1000, goal: 10000, mo: 18 })[0][1]), 500, .001, 'savings');
near(num(run('late-fee-calculator')[0][1]), 22.5, .001, 'late fee');
near(num(run('cash-runway-calculator')[0][1]), 4, .001, 'runway');
near(num(run('utilization-rate-calculator')[0][1]), 62.5, .001, 'utilization');
near(num(run('retainer-pricing-calculator')[2][1]), 900, .001, 'retainer');
try { run('break-even-calculator', { price: 5 }); throw Error('TEST FAIL guard'); } catch (e) { if (/TEST FAIL/.test(e.message)) throw e; }
console.log('All tool self-tests passed.');

// --- templates ---
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const CSS = `:root{--bg:#f5f8f7;--fg:#12231f;--mu:#52645f;--c:#fff;--b:#d9e3e0;--a:#0b6b5d;--ab:#fff;--er:#b42318}
@media(prefers-color-scheme:dark){:root{--bg:#0d1715;--fg:#e6f0ed;--mu:#9bb0aa;--c:#14221f;--b:#27393560;--a:#5fd0bb;--ab:#0d1715;--er:#ff8f85}}
*{box-sizing:border-box}body{margin:0;font:16px/1.65 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;background:var(--bg);color:var(--fg)}
a{color:var(--a)}.w{max-width:980px;margin:auto;padding:0 16px}h1,h2,h3{font-family:Georgia,"Times New Roman",serif;line-height:1.25}h1{font-size:clamp(1.7rem,4.5vw,2.5rem);margin:.6em 0 .3em}h2{margin-top:2rem}
header{background:var(--c);border-bottom:1px solid var(--b)}header .w{display:flex;gap:18px;align-items:center;flex-wrap:wrap;padding:12px 16px}header .lg{margin-right:auto;font:700 1.2rem Georgia,serif;color:var(--fg);text-decoration:none}header a{text-decoration:none}
footer{margin-top:3rem;border-top:1px solid var(--b);padding:20px 0;color:var(--mu);font-size:.92rem}footer a{margin-right:14px}
.g{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px;padding:0;list-style:none}.card{display:block;height:100%;background:var(--c);border:1px solid var(--b);border-radius:10px;padding:16px;color:inherit;text-decoration:none}.card:hover,.card:focus-visible{border-color:var(--a)}.card strong{display:block;color:var(--a)}.card small{color:var(--mu)}
.tool{background:var(--c);border:1px solid var(--b);border-radius:10px;padding:20px;margin:16px 0}label{display:block;font-weight:600;margin:14px 0 4px}input[type=text],input[type=search],input[inputmode]{width:100%;padding:11px;font-size:1rem;border:1px solid var(--mu);border-radius:8px;background:var(--bg);color:var(--fg)}
button{padding:10px 16px;border-radius:8px;border:1px solid var(--a);background:var(--a);color:var(--ab);font-size:1rem;cursor:pointer}button.s{background:none;color:var(--a)}.row{display:flex;gap:10px;margin-top:16px;flex-wrap:wrap}
#out{margin-top:12px}#out div{display:flex;justify-content:space-between;gap:12px;padding:10px 0;border-bottom:1px solid var(--b)}#out b{font-size:1.1rem}#msg{color:var(--er);min-height:1.5em;margin:8px 0 0}
.bc{font-size:.9rem;color:var(--mu);margin-top:16px}.chips{display:flex;gap:8px;flex-wrap:wrap;margin:12px 0}.chips button{padding:6px 12px;font-size:.92rem}.chips button[aria-pressed=true]{background:var(--a);color:var(--ab)}
.hero{padding:32px 0 8px}.hero p{max-width:60ch;color:var(--mu)}.ad[hidden]{display:none}.ad{margin:20px 0;min-height:90px}
#ck{position:fixed;left:12px;right:12px;bottom:12px;max-width:640px;margin:auto;background:var(--c);border:1px solid var(--a);border-radius:10px;padding:12px 16px;display:none;gap:12px;align-items:center;font-size:.92rem}.ex{background:var(--bg);border-left:3px solid var(--a);padding:8px 14px}`;
const nav = [['/', 'Home'], ['/tools/', 'All tools'], ['/about/', 'About'], ['/contact/', 'Contact']];
const foot = [['/privacy/', 'Privacy Policy'], ['/terms/', 'Terms'], ['/disclaimer/', 'Disclaimer'], ['/cookies/', 'Cookies']];
const CK = `<div id="ck" role="dialog" aria-label="Cookie notice"><span>This site stores your choice in your browser. If analytics or advertising are enabled, they may use cookies. <a href="/cookies/">Details</a></span><button id="ckb">Got it</button></div><script>try{if(!localStorage.getItem('ck'))document.getElementById('ck').style.display='flex';document.getElementById('ckb').onclick=function(){localStorage.setItem('ck','1');document.getElementById('ck').style.display='none'}}catch(e){}</script>`;
const pages = [];
const page = (url, title, desc, body, ld = [], js = '') => {
  pages.push(url);
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><meta name="description" content="${esc(desc)}"><link rel="canonical" href="${SITE}${url}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${SITE}${url}"><meta property="og:type" content="website"><meta property="og:site_name" content="${NAME}"><meta name="twitter:card" content="summary"><link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='7' fill='%230b6b5d'/%3E%3Cpath d='M9 22V10h14M9 16h9' stroke='white' stroke-width='3' fill='none'/%3E%3C/svg%3E"><style>${CSS}</style>${PUB ? `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${PUB}" crossorigin="anonymous"></script>` : ''}${GA ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${GA}"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA}')</script>` : ''}${ld.map(x => `<script type="application/ld+json">${JSON.stringify(x)}</script>`).join('')}</head><body><header><div class="w"><a class="lg" href="/">${NAME}</a><nav aria-label="Main" style="display:flex;gap:16px;flex-wrap:wrap">${nav.map(n => `<a href="${n[0]}">${n[1]}</a>`).join('')}</nav></div></header><main class="w">${body}</main><footer><div class="w"><p>${foot.map(n => `<a href="${n[0]}">${n[1]}</a>`).join('')}</p><p>© ${new Date().getFullYear()} ${NAME}. Free calculators for general information only.</p></div></footer>${CK}${js ? `<script>${js}</script>` : ''}</body></html>`;
  const f = path.join('dist', url, 'index.html'); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, html);
};
const AD = '<aside class="ad" aria-label="Advertisement" hidden><!-- AdSense unit goes here: delete the hidden attribute and paste your ad code after approval --></aside>';
const card = t => `<li><a class="card" href="/tools/${t.s}/" data-c="${t.c}" data-n="${esc((t.t + ' ' + t.d).toLowerCase())}"><strong>${t.t}</strong><small>${t.c}</small><div>${t.d}</div></a></li>`;
const cats = [...new Set(T.map(t => t.c))];
fs.rmSync('dist', { recursive: true, force: true });

// Tool pages
const RUN = `var $=function(i){return document.getElementById(i)},o=$('out'),msg=$('msg');
function run(){var v={};try{F.forEach(function(f){var r=$(f[0]).value.trim(),n=Number(r);if(r===''||!isFinite(n))throw Error('Enter a valid number for "'+f[1]+'".');if(n<0)throw Error('"'+f[1]+'" cannot be negative.');v[f[0]]=n});var res=fn(v);msg.textContent='';o.innerHTML=res.map(function(r){return '<div><span>'+r[0]+'</span><b>'+r[1]+'</b></div>'}).join('');o.dataset.t=res.map(function(r){return r[0]+': '+r[1]}).join('\\n')}catch(e){o.innerHTML='';o.dataset.t='';msg.textContent=e.message}}
F.forEach(function(f){$(f[0]).addEventListener('input',run)});
$('rs').onclick=function(){F.forEach(function(f){$(f[0]).value=f[2]});run()};
$('cp').onclick=function(){var t=o.dataset.t;if(!t)return;var b=$('cp');(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(function(){b.textContent='Copied'},function(){b.textContent='Copy failed'});setTimeout(function(){b.textContent='Copy result'},1500)};run();`;
T.forEach(t => {
  const url = `/tools/${t.s}/`, rel = T.filter(x => x.c === t.c && x !== t).slice(0, 3), v = {}; t.f.forEach(f => v[f[0]] = f[2]);
  const ex = t.fn(v).map(r => `${r[0]}: <b>${r[1]}</b>`).join('; ');
  const body = `<nav class="bc" aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/tools/">Tools</a> / ${t.t}</nav><h1>${t.t}</h1><p>${t.d}</p>
<section class="tool" aria-label="Calculator"><div>${t.f.map(f => `<label for="${f[0]}">${f[1]}</label><input type="text" inputmode="decimal" id="${f[0]}" value="${f[2]}">`).join('')}</div><p id="msg" role="alert"></p><div class="row"><button class="s" id="rs" type="button">Reset</button><button id="cp" type="button">Copy result</button></div><div id="out" aria-live="polite"></div></section>${AD}
<h2>Who this is for</h2><p>${t.u}</p><h2>How to use it</h2><p>Fill in ${t.f.map(f => '“' + f[1] + '”').join(', ')}. Results update as you type. Use <em>Copy result</em> to save the numbers, or <em>Reset</em> to return to the example values.</p>
<h2>Formula</h2><p>${t.x}</p><h2>Worked example</h2><p class="ex">With the pre-filled values (${t.f.map(f => f[1] + ' = ' + f[2]).join('; ')}), the tool returns ${ex}.</p>
<h2>Limitations</h2><p>${t.l} Results are estimates for general information, not financial, tax or legal advice. All calculations happen in your browser and nothing you type is sent to us.</p>
<h2>Frequently asked questions</h2>${t.q.map(q => `<h3>${q[0]}</h3><p>${q[1]}</p>`).join('')}
<h2>Related tools</h2><ul class="g">${rel.map(card).join('')}</ul>`;
  page(url, `${t.t} – Free Online Tool | ${NAME}`, t.d, body, [
    { '@context': 'https://schema.org', '@type': 'WebApplication', name: t.t, url: SITE + url, description: t.d, applicationCategory: 'FinanceApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: t.q.map(q => ({ '@type': 'Question', name: q[0], acceptedAnswer: { '@type': 'Answer', text: q[1] } })) },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [['Home', '/'], ['Tools', '/tools/'], [t.t, url]].map((b, i) => ({ '@type': 'ListItem', position: i + 1, name: b[0], item: SITE + b[1] })) }
  ], `${H}var F=${JSON.stringify(t.f)},fn=${t.fn.toString()};${RUN}`);
});

// Directory
page('/tools/', `All Tools – Free Freelancer & Money Calculators | ${NAME}`, 'Browse every free calculator: pricing, business and personal money tools that run in your browser.',
  `<h1>All tools</h1><label for="q">Search tools</label><input type="search" id="q" placeholder="e.g. hourly rate, loan, margin"><div class="chips" role="group" aria-label="Filter by category"><button type="button" class="s" aria-pressed="true" data-k="">All</button>${cats.map(c => `<button type="button" class="s" aria-pressed="false" data-k="${c}">${c}</button>`).join('')}</div><p id="none" hidden>No tools match your search.</p><ul class="g" id="list">${T.map(card).join('')}</ul>`, [],
  `var q=document.getElementById('q'),k='',L=[].slice.call(document.querySelectorAll('#list a'));function f(){var s=q.value.toLowerCase().trim(),n=0;L.forEach(function(a){var ok=(!k||a.dataset.c===k)&&(!s||a.dataset.n.indexOf(s)>-1);a.parentNode.hidden=!ok;if(ok)n++});document.getElementById('none').hidden=n>0}q.oninput=f;[].forEach.call(document.querySelectorAll('.chips button'),function(b){b.onclick=function(){k=b.dataset.k;[].forEach.call(document.querySelectorAll('.chips button'),function(x){x.setAttribute('aria-pressed',x===b)});f()}});var m=location.search.match(/[?&]q=([^&]*)/);if(m){q.value=decodeURIComponent(m[1].replace(/\\+/g,' '));f()}`);

// Home
page('/', `${NAME} – Free Calculators for Freelancers & Small Businesses`, 'Free, private calculators for freelancers: hourly rate, project quotes, margins, break-even, invoices, loans and savings. No sign-up.',
  `<section class="hero"><h1>Price your work with numbers you can check.</h1><p>${T.length} free calculators for freelancers and small-business owners. Every formula is shown, every calculation runs in your browser, and there is nothing to sign up for.</p><form action="/tools/" method="get" role="search"><label for="hq">Find a tool</label><div class="row" style="margin-top:0"><input type="search" id="hq" name="q" placeholder="e.g. hourly rate" style="flex:1"><button>Search</button></div></form></section>
<h2>Popular tools</h2><ul class="g">${T.slice(0, 6).map(card).join('')}</ul><p><a href="/tools/">See all ${T.length} tools</a></p>${AD}
${cats.map(c => `<h2>${c}</h2><ul class="g">${T.filter(t => t.c === c).map(card).join('')}</ul>`).join('')}
<h2>Why these tools</h2><p>Freelancers often set prices by guesswork. These calculators turn income goals, costs and time into concrete figures, and each page explains the formula and its limits so you can judge the result yourself.</p>`,
  [{ '@context': 'https://schema.org', '@type': 'WebSite', name: NAME, url: SITE + '/', potentialAction: { '@type': 'SearchAction', target: SITE + '/tools/?q={q}', 'query-input': 'required name=q' } }]);

// Legal & info pages
const doc = (url, title, desc, secs) => page(url, `${title} | ${NAME}`, desc, `<nav class="bc"><a href="/">Home</a> / ${title}</nav><h1>${title}</h1>` + secs.map(s => `<h2>${s[0]}</h2><p>${s[1]}</p>`).join(''));
const upd = new Date().toISOString().slice(0, 10);
doc('/about/', 'About Us', `About ${NAME}.`, [['Our purpose', `${NAME} offers free, browser-based calculators for freelancers and small-business owners. Each tool shows its formula, a worked example and its limitations.`], ['How the site works', 'Calculations run entirely in your browser. We do not receive the numbers you enter. The site may be supported by advertising.'], ['Accuracy', `We test every calculator against known values before publishing. If you spot an error, please tell us through the <a href="/contact/">contact page</a>.`]]);
doc('/contact/', 'Contact Us', `Contact ${NAME}.`, [['Email', `Write to <a href="mailto:${MAIL}">${MAIL}</a> for questions, corrections, suggestions for new tools or privacy requests.`], ['What to include', 'For a calculation problem, include the tool name, the values you entered and the result you expected.']]);
doc('/privacy/', 'Privacy Policy', `How ${NAME} handles data.`, [['Last updated', upd], ['Data you enter', 'Values typed into calculators are processed in your browser and are not sent to or stored on our servers.'], ['Local storage', 'We store one item in your browser to remember that you dismissed the cookie notice.'], ['Analytics and advertising', 'If enabled, Google Analytics may collect usage data such as pages viewed and approximate location, and Google AdSense and its partners may use cookies to serve and measure ads. See <a href="https://policies.google.com/technologies/partner-sites">how Google uses data from sites that use its services</a>. You can manage ad personalisation at <a href="https://adssettings.google.com">Google Ad Settings</a>.'], ['Children', 'The site is not directed at children under 13 and we do not knowingly collect their data.'], ['Your rights and contact', `For privacy questions or requests, email <a href="mailto:${MAIL}">${MAIL}</a>.`], ['Changes', 'We will update this page and its date when our practices change.']]);
doc('/terms/', 'Terms and Conditions', 'Terms of use.', [['Last updated', upd], ['Use of the site', 'You may use the tools for personal or business purposes. Do not misuse the site, attempt to disrupt it or copy its content wholesale.'], ['No warranty', 'The tools are provided "as is". We aim for accuracy but do not guarantee that results are complete or error-free.'], ['Limitation of liability', 'To the extent permitted by law, we are not liable for losses arising from reliance on the tools or content.'], ['Changes', 'We may update the site and these terms at any time.']]);
doc('/disclaimer/', 'Disclaimer', 'Not financial, tax or legal advice.', [['General information only', 'Content and calculators on this site are estimates for general information. They are not financial, investment, tax, accounting or legal advice.'], ['Your responsibility', 'Check results against your own records and consult a qualified professional before making significant decisions.'], ['External links', 'We are not responsible for the content of external sites we link to.']]);
doc('/cookies/', 'Cookie Policy', 'Cookies and local storage used by the site.', [['Essential storage', 'The site saves your cookie-notice choice in your browser local storage. No login cookies are used.'], ['Analytics and advertising', 'If the owner enables Google Analytics or Google AdSense, those services may set cookies. You can block or delete cookies in your browser settings.'], ['More information', 'See the <a href="/privacy/">Privacy Policy</a> for details.']]);

// 404, robots, sitemap, ads.txt
fs.writeFileSync('dist/404.html', `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page not found | ${NAME}</title><meta name="robots" content="noindex"></head><body style="font-family:system-ui;max-width:600px;margin:60px auto;padding:0 16px"><h1>Page not found</h1><p><a href="/">Go home</a> or <a href="/tools/">browse all tools</a>.</p></body></html>`);
fs.writeFileSync('dist/robots.txt', `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`);
fs.writeFileSync('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map(u => `<url><loc>${SITE}${u}</loc><lastmod>${upd}</lastmod></url>`).join('\n')}\n</urlset>\n`);
if (PUB) fs.writeFileSync('dist/ads.txt', `google.com, ${PUB.replace('ca-', '')}, DIRECT, f08c47fec0942fa0\n`);
console.log(`Built ${pages.length} pages into ./dist` + (MAIL.startsWith('REPLACE') ? '  (WARNING: set CONTACT_EMAIL)' : ''));
