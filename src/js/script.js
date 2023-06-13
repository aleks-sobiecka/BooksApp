/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars
{
  'use strict';
   
  const select = {
    templateOf: {
      product: '#template-book',
    },
    containerOf: {
      product: '.books-list'
    }
  };
  const templates = {
    product: Handlebars.compile(document.querySelector(select.templateOf.product).innerHTML),
  };
  const data = dataSource;
  //console.log(dataSource);
  
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
  
  
  render();
}