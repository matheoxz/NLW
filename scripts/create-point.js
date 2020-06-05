
function populateUFs(){
    const ufSelect = document.querySelector('select[name=uf]')
    fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
    .then((res)=> res.json())
    .then(states=>{
        for(const state of states){
            ufSelect.innerHTML += `<option value="${state.id}">${state.nome}</option>`
        }    
    })
}

populateUFs()

function getCities(event){
    const citySelect = document.querySelector('select[name=city]')
    const stateInput = document.querySelector('[name = state]')
    const ufValue = event.target.value
    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`
    
    const indexOfSelectedState = event.target.selectedIndex
    stateInput.value = event.target.options[indexOfSelectedState].text
   
    fetch(url)
    .then(res=> res.json())
    .then(cities=>{
        citySelect.innerHTML = ''
        citySelect.disabled = true
        for(const city of cities){
            citySelect.innerHTML += `<option value="${city.value}">${city.nome}</option>`
        }    
        citySelect.disabled = false
    })
}

document
    .querySelector('select[name = uf]')
    .addEventListener('change', getCities)


let selectedItems = []   
    //itens de coleta
const itemsToCollect = document.querySelectorAll('.items-grid li')
for(let item of itemsToCollect){
    item.addEventListener('click', handleSelectedItem)
}

const colletctedItems = document.querySelector('input[name=items]')

function handleSelectedItem(event){

    const itemli = event.target
    itemli.classList.toggle('selected')

    const itemId = itemli.dataset.id

    const alreadySelected = selectedItems.findIndex(item => item == itemId)
    if(alreadySelected >= 0){
        const filteredItems = selectedItems.filter(item => item != itemId)
        selectedItems = filteredItems
    }
    else{
        selectedItems.push(itemId)
    }

    
    colletctedItems.value = selectedItems

}