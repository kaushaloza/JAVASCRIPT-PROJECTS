const reviews = [
    {
        id: 1,
        name: "user-1",
        job: "job-1",
        img: "https://images.pexels.com/photos/937481/pexels-photo-937481.jpeg?cs=srgb&dl=pexels-mentatdgt-937481.jpg&fm=jpg",
        text: "text-1"
    },
    {
        id: 2,
        name: "user-2",
        job: "job-2",
        img: "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?cs=srgb&dl=pexels-stefan-stefancik-91227.jpg&fm=jpg",
        text: "text-2"
    },
    {
        id: 3,
        name: "user-3",
        job: "job-3",
        img: "https://images.pexels.com/photos/532220/pexels-photo-532220.jpeg?cs=srgb&dl=pexels-pixabay-532220.jpg&fm=jpg",
        text: "text-3"
    },
    {
        id: 4,
        name: "user-4",
        job: "job-4",
        img: "https://images.pexels.com/photos/712513/pexels-photo-712513.jpeg?cs=srgb&dl=pexels-andrea-piacquadio-712513.jpg&fm=jpg",
        text: "text-4"
    },
    {
        id: 5,
        name: "user-5",
        job: "job-5",
        img: "https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?cs=srgb&dl=pexels-hannah-nelson-1065084.jpg&fm=jpg",
        text: "text-5"
    },
    {
        id: 6,
        name: "user-6",
        job: "job-6",
        img: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?cs=srgb&dl=pexels-creation-hill-1681010.jpg&fm=jpg",
        text: "text-6"
    },
]

let currentItem = 0;
const img = document.getElementById('person-img');
const author = document.getElementById('author');
const job = document.getElementById('job');
const info = document.getElementById('info');


const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const randomBtn = document.querySelector('.random-btn');
let randomNumber;

function randomGenerator(){
 randomNumber = Math.floor(Math.random() * (((reviews.length - 1) - 0 ) + 1))
}

randomBtn.addEventListener('click', () => {
    randomGenerator();  
    showPerson(randomNumber);
})
    
   

//load init item

window.addEventListener('DOMContentLoaded', function(){
    showPerson(currentItem);
})

function showPerson(number){
    const item = reviews[number];
    img.src = item.img;
    author.textContent = item.name;
    job.textContent = item.job;
    info.textContent = item.text; 
}

prevBtn.addEventListener('click',() => {
    if(currentItem === 0){
        currentItem = 5;
    }
    else{

    
    currentItem = currentItem - 1;

    }

    showPerson(currentItem);
});


nextBtn.addEventListener('click',() => {
    if(currentItem === 5){
        currentItem = 0;
    }
    else{

    
    currentItem = currentItem + 1;

    }
    showPerson(currentItem);
});


 