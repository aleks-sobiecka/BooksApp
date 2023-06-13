/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars
{
  'use strict';
   
  const select = {
    templateOf: {
      product: '#template-book',
    },
    containerOf: {
      product: '.books-list',
      productImage: '.books-list .book__image'
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
    const bookImages = document.querySelectorAll(select.containerOf.productImage);
    //console.log(bookImages);

    for (const bookImage of bookImages){
      //console.log(bookImage);

      bookImage.addEventListener('click', function(event){
        event.preventDefault();
      });
      
      bookImage.addEventListener('dblclick', function(event){
        event.preventDefault();

        let id = bookImage.getAttribute('data-id');

        //if(favouriteBooks[id]){
        if(bookImage.classList.contains('favorite')){

          bookImage.classList.remove('favorite');

          const indexOfBook = favouriteBooks.indexOf(id);
          favouriteBooks.splice(indexOfBook,1);
        } else {
          bookImage.classList.add('favorite');
          favouriteBooks.push(id);
        }
        console.log(favouriteBooks);
      });


    }

  }
  
  
  
  render();
  initActions();
}