const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

const SAVE_FUNCTION = "/.netlify/functions/saveMath";
const FETCH_HISTORY = "/.netlify/functions/fetchMath";

let sympy;
SymPy.load().then(module => {
  sympy = module;
  console.log("SymPy.js loaded!");
  loadHistory();
});

// Parse natural language
function parseMathInput(input) {
  input = input.toLowerCase();
  if (input.startsWith("derivative of")) return { expr: input.replace("derivative of","").trim(), type:"diff" };
  if (input.startsWith("integrate")) return { expr: input.replace("integrate","").trim(), type:"int" };
  return { expr: input, type:"eval" };
}

// Generate step-by-step notes
function generateSteps(parsed, type, result) {
  const steps = [];
  if(type==="diff") {
    steps.push({icon:"🟢", text:`Identify function to differentiate: ${parsed}`, class:"derivative"});
    steps.push({icon:"🟢", text:"Apply derivative rules (power, sum, constants)", class:"derivative"});
    steps.push({icon:"🟢", text:`Result: ${result}`, class:"derivative"});
  } else if(type==="int") {
    steps.push({icon:"🔵", text:`Identify function to integrate: ${parsed}`, class:"integral"});
    steps.push({icon:"🔵", text:"Apply integration rules (power, trig, constants)", class:"integral"});
    steps.push({icon:"🔵", text:`Add constant of integration`, class:"integral"});
    steps.push({icon:"🔵", text:`Result: ${result}`, class:"integral"});
  } else {
    steps.push({icon:"⚪", text:`Simplified: ${result}`, class:"simplify"});
  }
  return steps;
}

// Solve math
async function solveMath(question) {
  if(!sympy) return { answer:"Loading SymPy...", steps:[] };
  try {
    const {expr,type} = parseMathInput(question);
    const parsed = sympy.parse(expr);
    let result;
    switch(type){
      case "diff": result = parsed.diff('x').toString(); break;
      case "int": result = parsed.integrate('x').toString(); break;
      default: result = parsed.toString();
    }
    const steps = generateSteps(parsed,type,result);
    return { answer: result, steps };
  } catch(e){
    return { answer:"❌ Cannot process expression.", steps:[{icon:"⚪",text:"Try simpler arithmetic",class:"simplify"}] };
  }
}

// Save to DB
async function saveToDB(question,answer,steps){
  try{
    await fetch(SAVE_FUNCTION,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({question,answer,steps})
    });
  } catch(err){ console.error("Failed to save:",err); }
}

// Load chat history
async function loadHistory(){
  try{
    const res=await fetch(FETCH_HISTORY);
    const data=await res.json();
    if(data&&data.logs){
      data.logs.forEach(log=>{
        addMessage(log.question,'user');
        addMessage(log.answer,'bot',log.steps);
      });
    }
  } catch(err){ console.error("Failed to load history:",err); }
}

// Submit
chatForm.addEventListener('submit', async e=>{
  e.preventDefault();
  const question = userInput.value.trim();
  if(!question) return;
  userInput.value='';
  addMessage(question,'user');
  const {answer,steps}=await solveMath(question);
  addMessage(answer,'bot',steps);
  saveToDB(question,answer,steps);
});

// Add chat messages with step cards
async function addMessage(message,type,steps=[]){
  const div=document.createElement('div');
  div.classList.add('chat-message',type==='user'?'user-message':'bot-message');

  if(type==='bot'){
    div.textContent="";
    chatBox.appendChild(div);
    chatBox.scrollTop=chatBox.scrollHeight;
    for(let i=0;i<message.length;i++){
      div.textContent+=message[i];
      chatBox.scrollTop=chatBox.scrollHeight;
      await new Promise(r=>setTimeout(r,20));
    }
    if(steps.length>0){
      const notesDiv=document.createElement('div');
      notesDiv.classList.add('notes');
      steps.forEach(step=>{
        const stepDiv=document.createElement('div');
        stepDiv.classList.add('note-step',step.class);
        stepDiv.innerHTML=`<span class="icon">${step.icon}</span>${step.text}`;
        notesDiv.appendChild(stepDiv);
      });
      notesDiv.addEventListener('click',()=>notesDiv.classList.toggle('expanded'));
      chatBox.appendChild(notesDiv);
      chatBox.scrollTop=chatBox.scrollHeight;
    }
  } else {
    div.textContent=message;
    chatBox.appendChild(div);
    chatBox.scrollTop=chatBox.scrollHeight;
  }
}
