// async function yup(){
//    try{ 
//         const res = await fetch('/api')
//         const data = await res.json()
//         console.log(data)
//         document.querySelector('img').src = data[4].image
//     }catch (error) {
//     console.error(error);
//     }
// }
// yup()
// document.querySelector(".submit").addEventListener('click',addQuote)

// async function addQuote(){
//    try{ 
//         const res = await fetch('/addQuote')
//         const data = await res.json()
//         console.log(data)
//     }catch (error) {
//     console.error(error);
//     }
// }
console.log("sadffa")
document.body.onload = getPics;



async function getPics(){
    const res = await fetch('http://localhost:8000/api/characters')
    const data= await res.json()


  for(i=0; i<data.length; i++){
    console.log(data[i].image)

    let cardshold = document.querySelector('.cards')
    let newImg = document.createElement("img")
    newImg.src=data[i].image
    let newDiv = document.createElement('div')
    newDiv.classList.add('card')
    let cardInner = document.createElement('div')
    cardInner.classList.add('card-inner') 
    let cardFront = document.createElement('div')
    cardFront.classList.add('card-front') 
    cardshold.appendChild(newDiv)
    newDiv.appendChild(cardInner)
    cardInner.appendChild(cardFront)
    cardFront.appendChild(newImg)

    let cardBack = document.createElement('div')
    cardBack.classList.add('card-back')

    cardInner.appendChild(cardBack)

    let charname = document.createElement('h2')
    charname.innerText=data[i].name
    cardBack.appendChild(charname)
    let list = document.createElement('ul')
    cardBack.appendChild(list)
    let li1 = document.createElement('li')
    let li2 = document.createElement('li')
    let li3 = document.createElement('li')
    li1.innerHTML=`<strong>Status:</strong> ${data[i].status}`
    li2.innerHTML=data[i].category= `<strong>Category:</strong> ${data[i].category}`
    li3.innerHTML=data[i].actor =`<strong>Portrayed By:</strong> ${data[i].actor}`
    
      list.appendChild(li1)
      list.appendChild(li2)
      list.appendChild(li3)
    
    



    


    // newimg.src=data[i].image
    // let dddd=document.querySelector('.dive')
    // dddd.appendChild(newimg)
  }
  



}