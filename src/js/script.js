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
      //tabica książkami aktualnie dodanymi do ulubionych
      thisBooksList.favouriteBooks = [];
      //tablica z aktualnie wyfiltrowanymi książkami
      thisBooksList.filters = [];

      thisBooksList.initData();
      thisBooksList.getElements();
    }

    //utworzenie dostępu do listy książek zapisanej w danych
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
      //console.log(thisBooksList.dom.bookImagesList);
    }

    //wygenerowanie książek na stronie korzystając z listy danych książek
    render(){
      const thisBooksList = this;

      thisBooksList.initActions();

      //przejście po wszystkich książkach z bazy danych
      for (let productData in thisBooksList.data){
        //console.log(productData); --> pokazuje ID z tablicy

        productData = thisBooksList.data[productData];
        //console.log(productData); --> pokazuje obiekt za każdego ID

        //znalezienie ustawień dla rtingu każdej książki
        const ratingBgc = thisBooksList.determineRatingBgc(productData.rating);
        //console.log(ratingBgc);

        const ratingWidth = productData.rating *10;
        //console.log(ratingWidth);

        //przypisane właściwości do poszczególnych książek
        productData.ratingBgc = ratingBgc;
        productData.ratingWidth = ratingWidth;

        const generatedHTML = templates.product(productData);
        //console.log(generatedHTML);

        const generatedDOM = utils.createDOMFromHTML(generatedHTML);
        //console.log(generatedDOM);

        thisBooksList.dom.productContainer.appendChild(generatedDOM);
      }
    }
  
    //dodawanie książek do ulubionych
    //filtrowanie książek
    initActions(){
      const thisBooksList = this;

      thisBooksList.dom.bookImagesList.addEventListener('click', function(event){
        event.preventDefault();
      });

      thisBooksList.dom.bookImagesList.addEventListener('dblclick', function(event){
        event.preventDefault();

        //event.target - klikniety element
        //offsetParent - sprawdzamy element wyżej
        if (event.target.offsetParent.classList.contains('book__image')){
          let id = event.target.offsetParent.getAttribute('data-id');

          if(event.target.offsetParent.classList.contains('favorite')){
            event.target.offsetParent.classList.remove('favorite');

            //sprawdzenie jaki index w tablicy ulubionych ma książka która ma być usunięta (w tablicy mamy numery id książek)
            const indexOfBook = thisBooksList.favouriteBooks.indexOf(id);
            //usuniecie tej książki z tablicy uubionych
            thisBooksList.favouriteBooks.splice(indexOfBook,1);

          } else {
            //dodanie książki do tablicy ulubionych i nadanie jej klasy ulubionej
            event.target.offsetParent.classList.add('favorite');
            thisBooksList.favouriteBooks.push(id);
          }
          //console.log('favouritebooks:', thisBooksList.favouriteBooks);
        } 
      });

      thisBooksList.dom.filtersForm.addEventListener('change', function(event){
        event.preventDefault();

        //sprawdzenie czy zmieniony element to filtr
        if(event.target.tagName === 'INPUT' && event.target.type === 'checkbox' && event.target.name === 'filter'){
        //console.log(event.target.value);

          //jeśli filtr został zaznaczony
          if (event.target.checked){
            //dodanie do tablicy z filtrami nazyw tego filra
            thisBooksList.filters.push(event.target.value);
          } else {
            const indexOfFilter = thisBooksList.filters.indexOf(event.target.value);
            //usunięcie z tablicy z filtrami nazwy tego filtra używając jego indexu(pozycji) w tej tablicy
            thisBooksList.filters.splice(indexOfFilter,1);
          }
        }
        //console.log(thisBooksList.filters);

        thisBooksList.filterBooks();
      });
    }
  
    //filtrowanie książek - ustawnienia dla książek
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
    }

    //ustawienia dla poszczególnych ratingów
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
  //tworzenie instancji klasy
  const app = new BooksList();

  app.render();
}