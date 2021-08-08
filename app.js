//book class which will represent a book
//hence everytime we create a book it will instantiate a book object
class Book{
    constructor(title,author,isbn){
        this.title=title;
        this.author=author;
        this.isbn=isbn;
    }
}

//UI class which will hanc=dle UI tasks
//book displays in list, remove,alert
class UI{
    //static as we don't want to instantiate the UI class
    static displayBooks(){
        
        const books = localStore.getBooks();

        //loop through books and call method to add book to list
        books.forEach((book)=>UI.addBookToList(book));
    }
    static addBookToList(book){
        //create roe to add in tbody
        const list=document.querySelector('#book-list');

        //create tr tage into it
        const row= document.createElement('tr');
        row.innerHTML=
        `<td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>`;
        list.appendChild(row);//append row to list
        //call displaybooks it will loop through the books and then add them to the list created above
    }

    static deleteBook(ele){
        if(ele.classList.contains('delete')){
            ele.parentElement.parentElement.remove();
        }
    }

    static validation(message, className){
        const div = document.createElement('div');
        div.className=`alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form =document.querySelector('#book-form');
        container.insertBefore(div,form);//insert div before form
        //container is parent and insert before form
        //disappear in 5 seconds
        setTimeout(()=>document.querySelector('.alert').remove(),5000);
    }

    static clearFields(){
        document.querySelector('#title').value='';
        document.querySelector('#author').value='';
        document.querySelector('#isbn').value='';

    }
}

//store class will handle storage
//not remove on refereshing, stored in local browser
//local store only key value pairs item book is string of entire book no objects 
class localStore{
    static getBooks(){
        let books;
        if(localStorage.getItem('books')===null){
            books=[];
        }
        else{
            books=JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }
    static addBooks(book){
        const books=localStore.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }
    static removeBooks(isbn){
        const books=localStore.getBooks();
        books.forEach((book,index)=>{
            if(book.isbn===isbn){
                books.splice(index,1);
            }
        });
        localStorage.setItem('books', JSON.stringify(books));
    }
}

//event to display books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

//event to add a book
document.querySelector('#book-form').addEventListener('submit',
    (e)=>{
        e.preventDefault(); //prevemt actual submit
        //get form values
        const title=document.querySelector('#title').value;
        const author=document.querySelector('#author').value;
        const isbn=document.querySelector('#isbn').value;
        //validation of fields
        if(title==='' || author==='' || isbn===''){
            UI.validation('*Please fill in all the fields','danger');
        }
        else{
            //instantiate book
            const book = new Book(title,author,isbn);
            console.log(book);
            //add book to ui display
            UI.addBookToList(book);
            //add book to store
            localStore.addBooks(book);
            //show success of adding book
            UI.validation('Book added succesfully','success');
            //clear im=nput fields
            UI.clearFields();
        }       
    })

//event to remove a book
//all events done both in UI and storage
document.querySelector('#book-list').addEventListener('click',
(e)=>{
    //remove book from UI display
    UI.deleteBook(e.target);
    //remove book from local store
    localStore.removeBooks(e.target.parentElement.previousElementSibling.textContent);
    //show success of deleting book
    UI.validation('Book deleted succesfully','success');
})