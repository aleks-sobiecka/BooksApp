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
      form: '.filters',
    }
  };
  const templates = {
    product: Handlebars.compile(document.querySelector(select.templateOf.product).innerHTML),
  };

  class BooksList{
    constructor(){
      const thisBooksList = this;
      thisBooksList.favouriteBooks = [];
      thisBooksList.filters = [];

      thisBooksList.initData();
      thisBooksList.getElements();
    }

    initData(){
      const thisBooksList = this;
      thisBooksList.data = dataSource.books;
    }
    
    getElements(){
      const thisBooksList = this;

      thisBooksList.dom = {};
      thisBooksList.dom.productContainer = document.querySelector(select.containerOf.product);
      thisBooksList.dom.bookImagesList = document.querySelector(select.containerOf.product);
      thisBooksList.dom.filtersForm = document.querySelector(select.containerOf.form);
    }

    render(){
      const thisBooksList = this;

      thisBooksList.initActions();

      for (let productData in thisBooksList.data){
      //console.log(productData);

        productData = thisBooksList.data[productData];
        //console.log(productData);

        const ratingBgc = thisBooksList.determineRatingBgc(productData.rating);
        //console.log(ratingBgc);

        const ratingWidth = productData.rating *10;
        //console.log(ratingWidth);

        productData.ratingBgc = ratingBgc;
        productData.ratingWidth = ratingWidth;

        const generatedHTML = templates.product(productData);
        //console.log(generatedHTML);

        const generatedDOM = utils.createDOMFromHTML(generatedHTML);
        //console.log(generatedDOM);

        thisBooksList.dom.productContainer.appendChild(generatedDOM);
      }
    }
  
    initActions(){
      const thisBooksList = this;

      thisBooksList.dom.bookImagesList.addEventListener('click', function(event){
        event.preventDefault();
      });

      thisBooksList.dom.bookImagesList.addEventListener('dblclick', function(event){
        event.preventDefault();

        if (event.target.offsetParent.classList.contains('book__image')){
          let id = event.target.offsetParent.getAttribute('data-id');

          if(event.target.offsetParent.classList.contains('favorite')){
            event.target.offsetParent.classList.remove('favorite');

            const indexOfBook = thisBooksList.favouriteBooks.indexOf(id);
            thisBooksList.favouriteBooks.splice(indexOfBook,1);

          } else {
            event.target.offsetParent.classList.add('favorite');
            thisBooksList.favouriteBooks.push(id);
          }
        //console.log('favouritebooks:', favouriteBooks);
        } 
      });

      thisBooksList.dom.filtersForm.addEventListener('change', function(event){
        event.preventDefault();

        if(event.target.tagName === 'INPUT' && event.target.type === 'checkbox' && event.target.name === 'filter'){
        //console.log(event.target.value);

          if (event.target.checked){
            thisBooksList.filters.push(event.target.value);
          } else {
            const indexOfFilter = thisBooksList.filters.indexOf(event.target.value);
            thisBooksList.filters.splice(indexOfFilter,1);
          }
        }
        //console.log(thisBooksList.filters);

        thisBooksList.filterBooks();
      });
    }
  
    filterBooks(){
      const thisBooksList = this;

      for (let product of thisBooksList.data){
        let shouldBeHidden = false;

        for (const filterChecked of thisBooksList.filters){
          if (!product.details[filterChecked]){
            shouldBeHidden = true;
            break;
          }
        }

        const checkedBook = document.querySelector('.book__image[data-id="' + product.id + '"]');

        if (shouldBeHidden == true){
          checkedBook.classList.add('hidden'); 
        } else {
          checkedBook.classList.remove('hidden'); 
        } 
      } 

    /* for (const filterChecked of filters){
      for (let product of data.books){

        const checkedBook = document.querySelector('.book__image[data-id="' + product.id + '"]');

        if (product.details[filterChecked] === false){
          checkedBook.classList.add('hidden');
        } else if (product.details[filterChecked] === true){
          checkedBook.classList.remove('hidden');
        } else {
          checkedBook.classList.remove('hidden');
        }
      }
    } */
    }

    determineRatingBgc(rating){
      let background = '';

      if (rating < 6){
        background =  'linear-gradient(to bottom,  #fefcea 0%, #f1da36 100%)';
      } else if (rating > 6 && rating <= 8){
        background =  'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%)';
      } else if (rating > 8 && rating <= 9){
        background =  'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)';
      } else if (rating > 9){
        background =  'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%)';
      } 

      return background;
    }
  
  }
  const app = new BooksList();

  app.render();
}