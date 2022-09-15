let input = document.querySelector('#search')
input.addEventListener('keyup',()=>{
  let div=document.querySelectorAll('.card')
  let txtValue;
  let filter = input.value.toUpperCase();
  let h2 = document.querySelectorAll('h2')
  console.log(div[0])
  for (i = 0; i < h2.length; i++) {
    txtValue=h2[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      div[i].style.display = "";
      
    } else {
        div[i].style.display = "none";
    }
  }
})