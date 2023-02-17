let row_id = NaN
let number_page = 0
let cells = NaN
//функция отображения части таблицы на сайте
function print_table(table,start,end){ //на вход получаем массив с данными, элемент с которого начинаем отображение таблицы и элемент следующий за последним
    let table_html = document.querySelector(".body-table")//находим тело таблицы
    table_html.innerHTML = "" //очищаем от старых данных
    for (i=start; i< end; i++){ //проходимся циклам по нужным элеметам массива и добавляем данные в таблицу
        table_html.innerHTML += `<tr id=${i}>
            <td class="num0">${table[i]["name"]["firstName"]}</td>
            <td class="num1">${table[i]["name"]["lastName"]}</td>
            <td class="num2">${table[i]["phone"]}</td>
            <td class="about-value num3">${table[i]["about"]}</td>
            <td class="num4"><div style="background-color:${table[i]["eyeColor"]}; width:20px; height:20px"></div></td>
        </tr>`
    }
    let rows = table_html.querySelectorAll("tr") //выбираем ряды тела таблицы
    for (i=0;i<rows.length;i++){ //проходимся по ним циклом
        rows[i].addEventListener('click', print_row_info) //вешаем на каждый ряд функцию открытия данных в режиме редактирования при клике
    }
}
//функция сортировки таблице по значениям колонки
function sort_column(table, column_name, column_table){//на вход получаем массив с данными, название колонки и объект заголовок колонки
    let theads = document.querySelectorAll("th")//находим все заголовки таблицы
    for (let i=0;i<theads.length;i+=1){//проходимся по ним циклам
        if (theads[i].classList[0] != column_name.toLowerCase()){//если класс заголовка колонки не совпадает с именем колонки
            theads[i].setAttribute("status", "no-sort")//меняем атрибут status на no-sort
            theads[i].querySelector("img").setAttribute("src", "")//удаляем стрелку
        }
        
    }
    let status = column_table.getAttribute("status")//получаем значение атрибута status заголовка колонки по которой был клик
    if (status == "no-sort" || status == "reverse"){//если список не сортирован или сортировка в обратном порядке
        if (column_name == "firstName" || column_name == "lastName"){//если значения колонки вложены в объект "name" объектов массива
            table.sort((x, y) => x["name"][column_name].localeCompare(y["name"][column_name]))//сортируем по алфавиту с указанием "name"
        } else{
            table.sort((x, y) => x[column_name].localeCompare(y[column_name]))//иначе просто сортируем по алфавиту
        }
        column_table.setAttribute("status","sort")//меняем статус на "sort"
        column_table.querySelector("img").setAttribute("src", "./arrow.png")//добавляем стрелку
        column_table.querySelector("img").style.rotate = "180deg"//поварачиваем ее вниз
        
    } else {//если статус будет "sort" 
        if (column_name == "firstName" || column_name == "lastName"){//если значения колонки вложены в объект "name" объектов массива
            table.sort((x, y) => y["name"][column_name].localeCompare(x["name"][column_name]))//сортируем по алфавиту в обратном порядке с указанием "name"
        } else{
            table.sort((x, y) => y[column_name].localeCompare(x[column_name]))//иначе просто сортируем по алфавиту в обратном порядке
        }
        column_table.setAttribute("status","reverse")//ставим статус "reverse"
        column_table.querySelector("img").style.rotate = "0deg"//поварачиваем стрелку вверх
    }
    let btn_pg = document.querySelector(".btn-pg")//получаем кнопку переключения на 1 страницу
    change_page(table,btn_pg)//вызываем функцию переключения страницы
}
//функция отображения данных ряда в форме редактирования
function print_row_info(event){
    let form = document.querySelector('.form')//записываем форму для редактированния данных в переменную
    form.style.display = "block"//включаем ее отображение
    cells = event.target.parentNode.querySelectorAll("td")//из ряда по которому кликнули берем все ячейки
    document.querySelector("#First-Name").value = cells[0].innerHTML//заполняем соответствующее поле формы данными из ячейки
    document.querySelector("#Last-Name").value = cells[1].innerHTML
    document.querySelector("#Phone").value = cells[2].innerHTML
    document.querySelector("#About").value = cells[3].innerHTML
    document.querySelector("#Eye-Color").value = cells[4].querySelector("div").style.backgroundColor//для цвета глаз берем свойство цвета фона из вложенного div
    row_id = event.target.parentNode.getAttribute("id")//обновляем значение индекса строки
}

function cancel_edit(){
    document.querySelector("#First-Name").value = cells[0].innerHTML//заполняем соответствующее поле формы данными из ячейки
    document.querySelector("#Last-Name").value = cells[1].innerHTML
    document.querySelector("#Phone").value = cells[2].innerHTML
    document.querySelector("#About").value = cells[3].innerHTML
    document.querySelector("#Eye-Color").value = cells[4].querySelector("div").style.backgroundColor//для цвета глаз берем свойство цвета фона из вложенного div
}
//функция сохранения изменений строки
function save_change(table, index_row){//на вход получаем таблицу и индекс строки
    table[index_row]["name"]["firstName"] = document.querySelector("#First-Name").value//переписываем данные таблицы данными с формы редактирования
    table[index_row]["name"]["lastName"] = document.querySelector("#Last-Name").value
    table[index_row]["phone"] = document.querySelector("#Phone").value
    table[index_row]["about"] = document.querySelector("#About").value
    table[index_row]["eyeColor"] = document.querySelector("#Eye-Color").value
    print_table(table,number_page*10,number_page*10+10)//перепечатываем таблицу
}
//
function get_table_data(){//функция получения данных с json
    return fetch('./data_table.json')//делаем запрос на получение данных
    .then(response => response.json())//переводим ответ в формат json
    .then(json => {
        let table_data = []//объявляем пустой массив
        for (let i in json){//проходимся по json циклом
            table_data.push(//добавляем в массив данные с json
                {
                    "id":json[i]["id"],
                    "name":{
                        "firstName":json[i]["name"]["firstName"],
                        "lastName":json[i]["name"]["lastName"]
                    },
                    "phone":json[i]["phone"],
                    "about":json[i]["about"],
                    "eyeColor":json[i]["eyeColor"]
                }
            )
        }
        return table_data//возвращаем готовый массив
    })
}
//функция переключеия страницы
function change_page(table,new_page_btn){//на вход получаем таблицу и кнопку переключения страницы
    number_page = +new_page_btn.innerHTML -1//записываем в переменную номер кнопки -1 (переводим в вид индекса)
    let last_page = document.querySelector(".active")//находим активную кнопку переключения страницы
    last_page.classList.remove("active")//удаляем у нее класс "active"
    new_page_btn.classList.add("active")//к текущей кнопке добавляем класс "active"
    print_table(table,number_page*10,number_page*10+10)//перепечатываем таблицу
}
//функция создания кнопок переключения страниц
function create_btn_pages(table){//на вход получаем таблицу
    let number_of_pages = Math.ceil(table.length/10)//делим длину массива на количество строк на странице и округляем в большую сторону
    let div_btn_pg = document.querySelector(".btn-pages")//находим контейнер для кнопок
    for (let i = 1; i<=number_of_pages;i+=1){//запускаем цикл для создания кнопок
        if (i==1){//если это первая кнопкы
            div_btn_pg.innerHTML += `<div class="btn-pg active">${i}</div>`//добавляем класс "active"
        } else{
            div_btn_pg.innerHTML += `<div class="btn-pg">${i}</div>`//иначе без класса "active"
        }
    }
    let buttons = document.querySelectorAll(".btn-pg")//берем все кнопки переключения страниц
    for (let i=0;i<buttons.length;i+=1){//проходимся по ним циклом
        buttons[i].addEventListener('click',function(){change_page(table,buttons[i])})//вешаем функцию переключения страниц при клике
    }
}
//функция для показа/скрытия колонок
function col_visible(btn, col_num){//на вход получаем кнопку по которой кликнули и номер колонки
    let active = btn.classList[1]//берем второй класс кнопки
    let column = document.querySelectorAll(`.num${col_num}`)//находим все ячейки нужного столбца
    if (active=="active-hide"){//если колонка скрыта
        btn.classList.remove("active-hide")//удаляем класс
        btn.innerHTML = btn.innerHTML.replace("Показать", "Скрыть")//меняем текст кнопки
        for (let i=0;i<column.length;i+=1){//проходимся циклом по столбцу
            if (col_num == 3 && i !=0){
                column[i].style.display = "-webkit-box"//для значений таблицы "Описание" используем "-webkit-box" для обрезки в две строки
            } else{
                column[i].style.display = "table-cell"//для остальных ставим стандартное знаяение ячеек таблицы
            }
        }
    } else{
        btn.classList.add("active-hide")//если столбец не был скрыт добавляем класс
        btn.innerHTML = btn.innerHTML.replace("Скрыть","Показать")//меняем текст на кнопке
        for (let i=0;i<column.length;i+=1){//проходимся циклом по ячейкам столбца
            column[i].style.display = "none"//скрываем ячейки
        }
    }
}
function set_btn_func(table_data){
    //находим заголовки колонок и вешаем на них функцию сортировки при клике
    
    let firstname = document.querySelector(".firstname")
    firstname.addEventListener('click', function(){sort_column(table_data, "firstName", firstname)})
    let lastname = document.querySelector(".lastname")
    lastname.addEventListener('click', function(){sort_column(table_data, "lastName", lastname)})
    let phone = document.querySelector(".phone")
    phone.addEventListener('click', function(){sort_column(table_data, "phone", phone)})
    let about = document.querySelector(".about")
    about.addEventListener('click', function(){sort_column(table_data, "about", about)})
    let eyecolor = document.querySelector(".eyecolor")
    eyecolor.addEventListener('click', function(){sort_column(table_data, "eyeColor", eyecolor)})
    //вешаем функции на кнопки "Cохранить" и "Отменить"
    let button_save = document.querySelector(".btn-save")
    button_save.addEventListener('click', function (){save_change(table_data, row_id)})
    let button_cancel = document.querySelector('.btn-cancel')
    button_cancel.addEventListener('click', cancel_edit)
    //вешаем функцию на кнопки показа/скрытия колонок
    let hide_col_btns = document.querySelectorAll(".hide_btn")
    for (let i=0; i<hide_col_btns.length;i+=1){
        hide_col_btns[i].addEventListener('click', function(){col_visible(hide_col_btns[i],i)})
    }
}

window.addEventListener('load', function () {//когда прогрузится страница
    
    get_table_data().then((table_data) => {//ждем конца преобразования json файла в массив
        print_table(table_data,0,10)//печатаем первую страницу таблицы
        set_btn_func(table_data)//устанавливаем функции на клик по элементам
        create_btn_pages(table_data)//создаем кнопки переключения страниц
    })
    
    
    
})