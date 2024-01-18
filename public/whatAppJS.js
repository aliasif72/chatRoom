const parentNode = document.getElementById('msgs');

const tileNode = document.getElementById('tiles');

const userNode = document.getElementById('listUsers');

const searchNode = document.getElementById('search');

const memberNode = document.getElementById('members');

const closeBtn = document.getElementById('close');

const btnhiddenNode = document.getElementById('btnhidden');

const closeGrp= document.getElementById('closeGrp');

const header= document.getElementById('header');

const listRequest= document.getElementById('listRequest');

const token=localStorage.getItem('token');


// REFRESH WINDOW OR REFRESH DATA EVERY SECOND
window.addEventListener("DOMContentLoaded", async function lsLoad() {

  header.innerHTML=`<li onclick="openProfile()">Welcome ${localStorage.getItem('name')}</li>
  <li onclick="openRequest()">Request</li>
  <li><img src="coin.png">${localStorage.getItem('coin')}</li>
  <li onclick="logOff()">Logout</li>`

  profileData.innerHTML=`<h2>Name : ${localStorage.getItem('name')}</h2>
  <h2>Contact : ${localStorage.getItem('number')}</h2>
  <button type="button" class="iconBtn" id="close" onclick="closeProfile()">Back to Chat</button>`
  
  if (!localStorage.getItem('chat')) {
    await latestMsg();
  }
   if (!localStorage.getItem('grpname')) {
     await getGrp();
   }
   if(localStorage.getItem('members'))
   {
    const gid=localStorage.getItem('groupid');
    const Member = JSON.parse(localStorage.getItem('members'));
    memberNode.innerHTML=' ';
    Member.forEach((ele)=>{
      const tile= `<p id='${obj.userId}'>${ele.name} <button type="button" class="remBtn" id="close" 
      onclick="removeFromGroup('${ele.userId}','${ele.id}')"><i class="fas fa-times"></i></button></p>`;
      memberNode.innerHTML=memberNode.innerHTML+tile;
    })}
  const groups=JSON.parse(localStorage.getItem('grpname'));
  const chatMsg = JSON.parse(localStorage.getItem('chat'));
  parentNode.innerHTML = ' ';
  tileNode.innerHTML=' ';
    for (let i = 0; i < chatMsg.length; i++) {
    await showMsg(chatMsg[i]);
    parentNode.scrollTop = parentNode.scrollHeight;
  }
    await showGroup(groups);
 let tile=`<button type="button" onclick= showUserOnly() class="tilebtn">Common Group</button>`;
  tileNode.innerHTML=tileNode.innerHTML+tile;
}
)

function openForm() {
document.getElementById("myForm").style.display = "block";
}

function openRequest() {
    document.getElementById("friendRequest").style.display = "block";
    getRequest();
    }

function closeForm() {
document.getElementById("myForm").style.display = "none";
}  

function closeRequest(){
    document.getElementById("friendRequest").style.display = "none";
}

function closeForm1() {
      document.getElementById("myForm1").style.display = "none";
    }

function openProfile(){
    document.querySelector(".chat-container").style.display = "none";
    document.querySelector(".profile").style.display = "block";
}

function closeProfile(){
    document.querySelector(".chat-container").style.display = "block";
    document.querySelector(".chat-container").style.display = "flex";
    document.querySelector(".profile").style.display = "none";
}
  

//OPEN FRIEND REQUEST
function friendRequest(){
    document.getElementById("requestDetails").style.display = "block";
}

//ON LOGOUT
function logOff(){
     localStorage.clear();
     window.location.href="/new.html";
      }
   
//SIGNUP
async function signUp(event) {  
    event.preventDefault();
      const name = event.target.name.value;
      const number = event.target.number.value;
      const password = event.target.password.value;
      const isPrime = event.target.isPrime.value;

      const userData = {
          name,
          number,
          password,
          isPrime
      }
      try {
          let res = await axios.post("http://localhost:3000/user/signup", userData);
          if (res.status === 201) {
              alert(`${res.data.message}`);
          }
      }
      catch (err) {
          alert(`${err.response.data.message}`);
      }
  }
  
  //LOGIN
  async function logUp(event) {
    event.preventDefault();
      const number = event.target.number.value;
      const password = event.target.chpassword.value;
      const userData = {
          number,
          password
      }
      try {
          let res = await axios.post("http://localhost:3000/user/login", userData);
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('name', res.data.name);
          localStorage.setItem('coin', res.data.coin);
          localStorage.setItem('number', res.data.number);
                 alert(`${res.data.message}`);
          window.location.href="/whatApp.html";
          //parentNode.innerHTML=parent.innerHTML+`<p class="join">${name} joined</p>`;
          }
      catch (err) {
          console.log(err);
          alert(`${err.response.data.message}`);
      }
  }
  
  //SAVE MESSAGE
  async function saveMsg(event)
  {
  event.preventDefault();
  const gid=localStorage.getItem('groupid');
  const message = event.target.msg.value;
  event.target.msg.value=' ';
  let obj = {
    message,
    gid:gid,
  }
  try {
     const token = localStorage.getItem('token');
     let res = await axios.post("http://localhost:3000/verifiedUser/sendMsg", obj, { headers: { "authorization": token } })
        console.log(res.status);
        let merged = JSON.parse(localStorage.getItem('chat'));
        if(merged.length===10)
        {
          merged.shift();
        }
        merged.push(res.data);
        localStorage.setItem('chat',JSON.stringify(merged));
        showMsg(res.data);
        parentNode.scrollTop=parentNode.scrollHeight;  
      }
  catch (err) {
    console.log(err);
  }
  }
  
  //REFRESH
  async function nextMsg(event) {
      event.preventDefault();
      if(!localStorage.getItem('token'))
      {
        return window.location.href="/public/new.html";
      }
        const token=localStorage.getItem('token');
        const gid = localStorage.getItem('groupid');
        try {
          let msgid=0;
          let getmsgId=[];
        if(localStorage.getItem('chat'))
        {
        getmsgId=JSON.parse(localStorage.getItem('chat'));
        msgid=getmsgId[getmsgId.length-1].id;
         }
        let resp = await axios.get(`http://localhost:3000/verifiedUser/getMsg?${gid}&what=next&msgid=${msgid}`, { headers: { "authorization": token } });
        console.log(resp);
        parentNode.innerHTML = ' ';
        let mergedChat=[...getmsgId,...resp.data];
        while(mergedChat.length>10)
        {
          mergedChat.shift();
        }
        localStorage.setItem('chat', JSON.stringify(mergedChat));
        let parsedChat = JSON.parse(localStorage.getItem('chat'));
        console.log(parsedChat);
        for (let i = 0; i < parsedChat.length; i++) {
          await showMsg(parsedChat[i]);
          parentNode.scrollTop=parentNode.scrollHeight;  
                      }
      }
      catch (err) {
        console.log(err);
      }
    }
  
  //LATEST MESSAGE
    async function latestMsg() {
        const token=localStorage.getItem('token');
        try{
        let resp = await axios.get("http://localhost:3000/verifiedUser/latestMsg", { headers: { "authorization": token } });
        console.log(resp);
        localStorage.setItem('chat', JSON.stringify(resp.data));
           }
      catch (err) {
        console.log(err);
      }
    }
  
    //DISPLAY MESSAGES
    function showMsg(obj) {
      const leaf = `<p class="chatbox">${obj.name} : ${obj.message}</p>`
      parentNode.innerHTML = parentNode.innerHTML + leaf;
    }
  
  
    //OLDER MESSAGES
    async function oldMsg(event)
    {
      event.preventDefault();
      if(!localStorage.getItem('token'))
      {
       return window.location.href="/public/new.html";
      }
      const token = localStorage.getItem('token');
      const gid = localStorage.getItem('groupid');
      try {
        let msgid=0;
        let getmsgId=[];
      if(localStorage.getItem('chat'))
      {
      getmsgId=JSON.parse(localStorage.getItem('chat'));
      msgid=getmsgId[0].id;
      console.log(msgid);
       }
      let resp = await axios.get(`http://localhost:3000/verifiedUser/getMsg?gid=${gid}&what=old&msgid=${msgid}`, { headers: { "authorization": token } });
      console.log(resp);
      parentNode.innerHTML = ' ';
      let mergedChat=[...getmsgId,...resp.data];
      while(mergedChat.length>10)
      {
        mergedChat.shift();
      }
      localStorage.setItem('chat', JSON.stringify(mergedChat));
      let parsedChat = JSON.parse(localStorage.getItem('chat'));
      console.log(parsedChat);
      for (let i = 0; i < parsedChat.length; i++) {
        await showMsg(parsedChat[i]);
        parentNode.scrollTop=parentNode.scrollHeight;  
                    }
    }
    catch (err) {
      console.log(err);
    }
    }
  
    //GET MEMBERS OF A GROUP
    async function getMembers(grpid)
    {
      try{
      const token=localStorage.getItem('token');
      let resp = await axios.get(`http://localhost:3000/user/login/getMembers/?gid=${grpid}`, { headers: { "authorization": token } });
      console.log(resp);
      localStorage.setItem('members',JSON.stringify(resp.data.users));
      localStorage.setItem('chat',JSON.stringify(resp.data.chats));
      localStorage.setItem('isAdmin',resp.data.admin.isAdmin);
      localStorage.setItem('groupid',grpid);
      memberNode.innerHTML='';
      parentNode.innerHTML='';
      for(let i=0;i<resp.data.chats.length;i++)
      {
      showMsg(resp.data.chats[i]);
      }
      if(resp.data.admin.isAdmin===true)
      {
      for(let i=0;i<resp.data.users.length;i++)
      {
      showMember(resp.data.users[i],"membtnmini",grpid);
    }
  }
  else{
  
    for(let i=0;i<resp.data.users.length;i++)
      {
      showMember(resp.data.users[i],"membtnmini2",grpid);
    }
  }
    }
  catch(err)
  {
    console.log(err);
  }
      }
    
  //SHOW ONLY USERS
  async function showUserOnly()
  {
    try{
    let resp = await axios.get("http://localhost:3000/user/login/showUserOnly");
    console.log(resp);
    localStorage.setItem('members',JSON.stringify(resp.data.users));
    localStorage.setItem('chat',JSON.stringify(resp.data.chats));
    localStorage.setItem('groupid',JSON.stringify(undefined));
    localStorage.setItem('isAdmin',JSON.stringify(undefined));
    memberNode.innerHTML='';
    parentNode.innerHTML='';
    for(let i=0;i<resp.data.chats.length;i++)
    {
    showMsg(resp.data.chats[i]);
    }
  //JSON.parse(localStorage.getItem('members'))
  resp.data.users.forEach(ele=>
      {
      const tile= `<div class="membtn" ><p style="margin-left: 1.8em;margin-top:1.5em;">${ele.name}</p>
      </div>`;
      memberNode.innerHTML=memberNode.innerHTML+tile;
    })  
  }
  catch(err)
  {
    console.log(err)
  }
  }
  
  
    //ADD GROUP
    async function addGrp(event)
    {
      event.preventDefault();
      const grpName=event.target.grpName.value;
      const obj={
        grpName
      }
      event.target.grpName.value=' ';
      closeGrp.click();
      let mergedGrp=[];
      const token = localStorage.getItem('token');
      let resp = await axios.post("http://localhost:3000/user/login/addGrp", obj, { headers: { "authorization": token } });
      console.log(resp);
      mergedGrp = JSON.parse(localStorage.getItem('grpname'));
      resp.data.message.isAdmin=true;
      mergedGrp.push(resp.data.message);
      localStorage.setItem('grpname',JSON.stringify(mergedGrp));
      showGroup1(resp.data.message);
      
    }
  
    
  
    async function getGrp()
    {
      const token = localStorage.getItem('token');
      let resp = await axios.get("http://localhost:3000/user/login/getGrp",{ headers: { "authorization": token } });
      console.log(resp);
      localStorage.setItem('grpname', JSON.stringify(resp.data.message));
         }
  
  //SHOW GROUP
    function showGroup(obj)
    {
      obj.forEach(ele=>
        {
      let tile=`<button type="button" onclick= getMembers('${ ele.id}') class="tilebtn">${ele.grpName}</button>`;
      if(ele.isAdmin===true)
      {
        tile=`<div id="${ ele.id}"><button type="button" onclick= "getMembers('${ ele.id}')" ondblclick="deleteGrp('${ ele.id}')" class="tilebtn">${ele.grpName}</button></div>`;
      }
      tileNode.innerHTML=tileNode.innerHTML+tile;
  })
    }
  
    function showGroup1(ele)
    {
      let tile=`<button type="button" onclick= getMembers('${ ele.id}') class="tilebtn">${ele.grpName}</button>`;
      if(ele.isAdmin===true)
      {
        tile=`<div id="${ ele.id}"><button type="button" onclick= "getMembers('${ ele.id}')" ondblclick="deleteGrp('${ ele.id}')" class="tilebtn">${ele.grpName}</button></div>`;
      }
      tileNode.innerHTML=tileNode.innerHTML+tile;
  }
        
      //GROUP MESSAGES
    async function grpMsg(event)
    {
      event.preventDefault();
        }
  
    //SEARCH USERS
    async function openForm1(event) {
      document.getElementById("myForm1").style.display = "block";
      const filterer=searchNode.value.toLowerCase();
      let resp = await axios.get(`http://localhost:3000/user/login/getUsers/?search=${filterer}`);
      console.log(resp);
      userNode.innerHTML='';
      resp.data.forEach(ele=>
        {
          userNode.innerHTML=userNode.innerHTML+`<p>${ele.name}<a onclick="return addUser('${ele.id}','${ele.name}')">
           <span>&#10004</span></a></p>`;
        }
      )
        }
     
          
    function closeForm1() {
      
      document.getElementById("myForm1").style.display = "none";
  
    }
  
  
  async function addUser(id,name)
  {
    if(localStorage.getItem('groupid')){
    const gid=localStorage.getItem('groupid');
    let resp = await axios.get(`http://localhost:3000/user/addToGroup/?id=${id}&gid=${gid}`,{ headers: { "authorization": token } });
    console.log(resp.data.message);
   closeBtn.click();    
   localStorage.removeItem(members);
    const user={
      userId:id,
      name:name
    }
     showMember(user,"membtnmini",gid);
    }
    else{
      sender=localStorage.getItem('name');
    let resp = await axios.get(`http://localhost:3000/user/login/sendRequest/?id=${id}&nm=${sender}`,{ headers: { "authorization": token } });
    console.log(resp.data.message);
    closeBtn.click();    
    }
  }
  
  async function getRequest()
  {
    const request = await axios.get(`http://localhost:3000/user/login/getRequest`,{ headers: { "authorization": token } });
    console.log(request.data.request);
    listRequest.innerHTML='';
    request.data.request.forEach((ele)=>{
      listRequest.innerHTML = listRequest.innerHTML +
      `<li class='${ele.from}'>'${ele.name}'<a onclick="return acceptReq('${ele.from}')"><span> &#10004</span></a> </li>`;
    })
    }
  

    async function acceptReq(id)
    {
      const request = await axios.get(`http://localhost:3000/user/login/acceptRequest?idd=${id}`,{ headers: { "authorization": token } });
      console.log(request);
      const item = listRequest.getElementsByClassName(`"${id}"`);
      listRequest.remove(item);
      }
    
      


  
  async function makeAdmin(id,gid)
  {
    let resp = await axios.get(`http://localhost:3000/user/makeAdmin/?id=${id}&gid=${gid}`);
    console.log(resp.data.message);
  }
  
  async function removeAdmin(id,gid)
  {
    let resp = await axios.get(`http://localhost:3000/user/removeAdmin/?id=${id}&gid=${gid}`);
    console.log(resp.data.message);
  }
  
  async function removeFromGroup(id,gid)
  {
    let resp = await axios.get(`http://localhost:3000/user/removeFromGroup/?id=${id}&gid=${gid}`);
    console.log(resp.data.message);
     getMembers(gid);
     const child=document.getElementById(id);
     memberNode.removeChild(child);
  }
  
  
  async function deleteGrp(gid)
  {
    
    let resp = await axios.get(`http://localhost:3000/user/deleteGrp/?gid=${gid}`);
    console.log(resp.data.message);
    localStorage.removeItem('grpname'); 
     const child=document.getElementById(gid);
     tileNode.removeChild(child);
  }