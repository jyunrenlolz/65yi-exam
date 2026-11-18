let bank=[],quiz=[],answers={},idx=0,quizMode="exam",timerSeconds=0,timerHandle=null;
const $=id=>document.getElementById(id);
fetch("questions.json").then(r=>r.json()).then(data=>bank=data).catch(()=>alert("題庫載入失敗，請確認 questions.json 存在。"));
function shuffle(a){return [...a].sort(()=>Math.random()-.5)}
function start(kind){
 if(!bank.length)return;
 quizMode=$("mode").value; let pool=kind==="wrong"?bank.filter(q=>(JSON.parse(localStorage.getItem("wrongIds")||"[]")).includes(q.id)):bank;
 quiz=kind==="all"||kind==="wrong"?pool:shuffle(pool);
 let n=$("count").value; if(n!=="all")quiz=quiz.slice(0,Number(n));
 if(kind==="practice")quiz=pool;
 answers={};idx=0;timerSeconds=Number($("timer").value)*60;
 $("home").classList.add("hidden");$("result").classList.add("hidden");$("quiz").classList.remove("hidden");
 if(timerHandle)clearInterval(timerHandle);
 if(timerSeconds){timerHandle=setInterval(()=>{timerSeconds--;showClock();if(timerSeconds<=0){clearInterval(timerHandle);finish()}},1000)}
 render();
}
function showClock(){$("clock").textContent=timerSeconds?`${Math.floor(timerSeconds/60)}:${String(timerSeconds%60).padStart(2,"0")}`:""}
function render(){
 let q=quiz[idx];$("category").textContent=q.category;$("qNum").textContent=`第 ${idx+1} / ${quiz.length} 題`;$("qType").textContent=q.type==="multiple"?"複選題":q.type==="truefalse"?"是非題":"單選題";
 $("questionText").textContent=q.question;$("progressFill").style.width=((idx+1)/quiz.length*100)+"%";
 $("answered").textContent=`已作答 ${Object.keys(answers).length} 題`;
 $("options").innerHTML="";$("feedback").classList.add("hidden");
 q.options.forEach((o,i)=>{let b=document.createElement("button");b.className="option";b.innerHTML=`<span class="letter">${String.fromCharCode(65+i)}</span><span>${o}</span>`;if((answers[idx]||[]).includes(i))b.classList.add("selected");b.onclick=()=>choose(i);$("options").appendChild(b)});
 $("prev").disabled=idx===0;$("next").textContent=idx===quiz.length-1?"檢視最後一題":"下一題";
}
function choose(i){let q=quiz[idx],a=answers[idx]||[];if(q.type==="multiple"){a=a.includes(i)?a.filter(x=>x!==i):[...a,i]}else a=[i];answers[idx]=a;render();if(quizMode==="instant")showFeedback()}
function showFeedback(){let q=quiz[idx],a=answers[idx]||[],ok=JSON.stringify([...a].sort())===JSON.stringify([...q.answer].sort());$("feedback").classList.remove("hidden");$("feedback").innerHTML=`<strong>${ok?"答對":"答錯"}</strong><br>${q.explanation}`}
$("prev").onclick=()=>{if(idx>0){idx--;render()}};
$("next").onclick=()=>{if(idx<quiz.length-1){idx++;render()}else $("confirm").classList.remove("hidden")};
$("submit").onclick=()=>$("confirm").classList.remove("hidden");
$("cancelSubmit").onclick=()=>$("confirm").classList.add("hidden");
$("confirmSubmit").onclick=()=>{$("confirm").classList.add("hidden");finish()};
function finish(){if(timerHandle)clearInterval(timerHandle);$("quiz").classList.add("hidden");$("result").classList.remove("hidden");let correct=0,wrong=0,unanswered=0,wrongIds=[];let cats={};
 quiz.forEach((q,i)=>{let a=answers[i]||[],ok=JSON.stringify([...a].sort())===JSON.stringify([...q.answer].sort());if(!a.length)unanswered++;else if(ok)correct++;else{wrong++;wrongIds.push(q.id)}cats[q.category]??={correct:0,total:0};cats[q.category].total++;if(ok)cats[q.category].correct++});
 localStorage.setItem("wrongIds",JSON.stringify(wrongIds));let score=Math.round(correct/quiz.length*100);$("score").textContent=`${score} 分`;
 $("stats").innerHTML=`<div class="stat"><strong>${correct}</strong>答對</div><div class="stat"><strong>${wrong}</strong>答錯</div><div class="stat"><strong>${unanswered}</strong>未作答</div>`;
 $("analysis").innerHTML=Object.entries(cats).map(([k,v])=>`<div class="analysis-row"><span>${k}</span><span>${v.correct}/${v.total}（${Math.round(v.correct/v.total*100)}%）</span></div>`).join("");
 $("review").innerHTML=quiz.map((q,i)=>{let a=answers[i]||[],ok=JSON.stringify([...a].sort())===JSON.stringify([...q.answer].sort());return `<div class="review-item"><h4>${i+1}. ${ok?"✓":"✗"} ${q.question}</h4><p><b>你的答案：</b>${a.length?a.map(n=>q.options[n]).join("、"):"未作答"}</p><p><b>正確答案：</b>${q.answer.map(n=>q.options[n]).join("、")}</p><p>${q.explanation}</p></div>`}).join("");
}
$("examMode").onclick=()=>start("exam");$("practiceMode").onclick=()=>start("practice");$("wrongMode").onclick=()=>start("wrong");$("allMode").onclick=()=>start("all");
$("homeBtn").onclick=()=>{$("result").classList.add("hidden");$("home").classList.remove("hidden")};$("retry").onclick=()=>start("exam");
