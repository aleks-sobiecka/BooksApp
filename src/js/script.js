/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars
{
  'use strict';
   
  const select = {
    templateOf: {
      product: '#template-book',
    },
    containerOf: {
      product: '.books-list',
      productImage: '.books-list .book__image',
    }
  };
  const templates = {
    product: Handlebars.compile(document.querySelector(select.templateOf.product).innerHTML),
  };
  const data = dataSource;

  const favouriteBooks = [];
  
  function render(){
    for (let productData in data.books){
      //console.log(productData);

      productData = data.books[productData];
      //console.log(productData);

      const generatedHTML = templates.product(productData);
      //console.log(generatedHTML);

      const generatedDOM = utils.createDOMFromHTML(generatedHTML);
      //console.log(generatedDOM);

      const productContainer = document.querySelector(select.containerOf.product);
      //console.log(productContainer);

      productContainer.appendChild(generatedDOM);
    }
  }

  function initActions(){
    const bookImagesList = document.querySelector(select.containerOf.product);
    //console.log(bookImagesList);

    bookImagesList.addEventListener('click', function(event){
      event.preventDefault();
    });

    bookImagesList.addEventListener('dblclick', function(event){
      event.preventDefault();
      //console.log(event.target.offsetParent);

      if (event.target.offsetParent.classList.contains('book__image')){
        let id = event.target.offsetParent.getAttribute('data-id');

        if(event.target.offsetParent.classList.contains('favorite')){
          event.target.offsetParent.classList.remove('favorite');

          const indexOfBook = favouriteBooks.indexOf(id);
          favouriteBooks.splice(indexOfBook,1);

        } else {
          event.target.offsetParent.classList.add('favorite');
          favouriteBooks.push(id);
        }
        console.log('favouritebooks:', favouriteBooks);
      } 
    });
  }
  
  render();
  initActions();
}