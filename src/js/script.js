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
  const filtersForm = document.querySelector(select.containerOf.form);
  const data = dataSource;

  const favouriteBooks = [];
  const filters = [];
  
  function render(){
    for (let productData in data.books){
      //console.log(productData);

      productData = data.books[productData];
      //console.log(productData);

      const ratingBgc = determineRatingBgc(productData.rating);
      //console.log(ratingBgc);

      const ratingWidth = productData.rating *10;
      //console.log(ratingWidth);

      productData.ratingBgc = ratingBgc;
      productData.ratingWidth = ratingWidth;

      const generatedHTML = templates.product(productData);
      console.log(generatedHTML);

      const generatedDOM = utils.createDOMFromHTML(generatedHTML);
      //console.log(generatedDOM);

      const productContainer = document.querySelector(select.containerOf.product);
      //console.log(productContainer);

      productContainer.appendChild(generatedDOM);
    }
  }

  function initActions(){
    const bookImagesList = document.querySelector(select.containerOf.product);

    bookImagesList.addEventListener('click', function(event){
      event.preventDefault();
    });

    bookImagesList.addEventListener('dblclick', function(event){
      event.preventDefault();

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

    filtersForm.addEventListener('change', function(event){
      event.preventDefault();

      if(event.target.tagName === 'INPUT' && event.target.type === 'checkbox' && event.target.name === 'filter'){
        //console.log(event.target.value);

        if (event.target.checked){
          filters.push(event.target.value);
        } else {
          const indexOfFilter = filters.indexOf(event.target.value);
          filters.splice(indexOfFilter,1);
        }
      }
      console.log(filters);

      filterBooks();
    });
  }
  
  function filterBooks(){
    for (let product of data.books){
      let shouldBeHidden = false;

      for (const filterChecked of filters){
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

  function determineRatingBgc(rating){
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
  

  render();
  initActions();
}