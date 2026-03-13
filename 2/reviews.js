// ТЕМА

const toggle=document.getElementById("themeToggle");

toggle.onclick=()=>{

document.body.classList.toggle("light-theme");

};


const defaultReviews=[

{
name:"Агент Коля",
text:"После вступления стал видеть в темноте.",
img:""
},

{
name:"Стажёр Ира",
text:"Выдали щит и печеньки. Рекомендую.",
img:""
},

{
name:"Аноним 404",
text:"Пытался уйти, но теперь работаю тут.",
img:""
}

];


const reviewsContainer=document.getElementById("reviewsList");

const form=document.getElementById("reviewForm");

const nameInput=document.getElementById("reviewName");

const textInput=document.getElementById("reviewText");

const imageInput=document.getElementById("reviewImage");


let reviews=[];

const saved=getCookie("reviews");

if(saved){

reviews=JSON.parse(saved);

}else{

reviews=defaultReviews;

}


function renderReviews(){

reviewsContainer.innerHTML="";

reviews.forEach(r=>{

const div=document.createElement("div");

div.className="review-card";

let img="";

if(r.img){

img=`<img src="${r.img}" class="review-img">`;

}

div.innerHTML=`

<h4>${r.name}</h4>

<p>${r.text}</p>

${img}

`;

reviewsContainer.appendChild(div);

});

}

renderReviews();


form.addEventListener("submit",function(e){

e.preventDefault();

const name=nameInput.value.trim();

const text=textInput.value.trim();

if(name.length<2){

alert("Имя слишком короткое");

return;

}

if(text.length<5){

alert("Отзыв слишком короткий");

return;

}

const file=imageInput.files[0];

if(file){

const reader=new FileReader();

reader.onload=function(){

reviews.unshift({

name:name,

text:text,

img:reader.result

});

saveReviews();

};

reader.readAsDataURL(file);

}else{

reviews.unshift({

name:name,

text:text,

img:""

});

saveReviews();

}

});


function saveReviews(){

setCookie("reviews",JSON.stringify(reviews),30);

renderReviews();

form.reset();

}