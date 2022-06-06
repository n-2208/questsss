const headElem = document.getElementById("head");
const buttonsElem = document.getElementById("buttons");
const pagesElem = document.getElementById("pages");

//Класс, который представляет сам тест
class Quiz
{
	constructor(type, questions, results)
	{
		//Тип теста: 1 - классический тест с правильными ответами, 2 - тест без правильных ответов
		this.type = type;

		//Массив с вопросами
		this.questions = questions;

		//Массив с возможными результатами
		this.results = results;

		//Количество набранных очков
		this.score = 0;

		//Номер результата из массива
		this.result = 0;

		//Номер текущего вопроса
		this.current = 0;
	}

	Click(index)
	{
		//Добавляем очки
		let value = this.questions[this.current].Click(index);
		this.score += value;

		let correct = -1;

		//Если было добавлено хотя одно очко, то считаем, что ответ верный
		if(value >= 1)
		{
			correct = index;
		}
		else
		{
			//Иначе ищем, какой ответ может быть правильным
			for(let i = 0; i < this.questions[this.current].answers.length; i++)
			{
				if(this.questions[this.current].answers[i].value >= 1)
				{
					correct = i;
					break;
				}
			}
		}

		this.Next();

		return correct;
	}

	//Переход к следующему вопросу
	Next()
	{
		this.current++;
		
		if(this.current >= this.questions.length) 
		{
			this.End();
		}
	}

	//Если вопросы кончились, этот метод проверит, какой результат получил пользователь
	End()
	{
		for(let i = 0; i < this.results.length; i++)
		{
			if(this.results[i].Check(this.score))
			{
				this.result = i;
			}
		}
	}
} 

//Класс, представляющий вопрос
class Question 
{
	constructor(text, answers)
	{
		this.text = text; 
		this.answers = answers; 
	}

	Click(index) 
	{
		return this.answers[index].value; 
	}
}

//Класс, представляющий ответ
class Answer 
{
	constructor(text, value) 
	{
		this.text = text; 
		this.value = value; 
	}
}

//Класс, представляющий результат
class Result 
{
	constructor(text, value)
	{
		this.text = text;
		this.value = value;
	}

	
	Check(value)
	{
		if(this.value <= value)
		{
			return true;
		}
		else 
		{
			return false;
		}
	}
}

//Массив с результатами
const results = 
[
	new Result("Вам многому нужно научиться. Перечитайте лекцию 1.3.1", 0),
	new Result("Вы уже неплохо разбираетесь. Обратите внимание на определения в лекции 1.3.1", 3),
	new Result("Ваш уровень выше среднего. Можете попробовать еще раз", 6),
	new Result("Вы в совершенстве знаете тему. Вы МОЛОДЕЦ!", 10)
];

//Массив с вопросами
const questions = 
[
	new Question("Совокупность приемов и способов воздействия на подчиненых - это ", 
	[
		new Answer("методы управления ", 1),
		new Answer("функции менеджмента ", 0),
		new Answer("теория захвата ", 0),
		new Answer("организация ", 0)
	]),

	new Question("Способы управления, обеспечивающие координацию действий подчиненных", 
	[
		new Answer("Экономические ", 0),
		new Answer("Психологические ", 0),
		new Answer("Организационно-административные ", 1),
		new Answer("социальные ", 0)
	]),

	new Question("Совокупность экономических рычагов и инструментов, которые могут воздействовать на создание благоприятных условий работы", 
	[
		new Answer("Экономические ", 1),
		new Answer("Психологические ", 0),
		new Answer("Организационно-административные ", 0),
		new Answer("социальные ", 0)
	]),
	
	new Question("Назовите первую функцию процесса управления?", 
	[
		new Answer("мотивация ", 0),
		new Answer("организация ", 0),
		new Answer("планировнаие ", 1),
		new Answer("контроль ", 0)
	]),
	
	new Question("Какова роль функции координации в управлении:", 
	[
		new Answer("формировать структуру организации ", 0),
		new Answer("поддерживать заинтересованность в высоких результатах ", 0),
		new Answer("обеспечивать согласованность работы организации в целом ", 1),
		new Answer("проверять состояние дел в организации ", 0)
	]),
	
	new Question("Наблюдение за предпринимаемыми действиями и внесение корректив – это функция:", 
	[
		new Answer("планирования", 0),
		new Answer("лидерства ", 0),
		new Answer("организации ", 1),
		new Answer("контроля ", 1)
	]),

	
];

//Сам тест
const quiz = new Quiz(1, questions, results);

Update();

//Обновление теста
function Update()
{
	//Проверяем, есть ли ещё вопросы
	if(quiz.current < quiz.questions.length) 
	{
		//Если есть, меняем вопрос в заголовке
		headElem.innerHTML = quiz.questions[quiz.current].text;

		//Удаляем старые варианты ответов
		buttonsElem.innerHTML = "";

		//Создаём кнопки для новых вариантов ответов
		for(let i = 0; i < quiz.questions[quiz.current].answers.length; i++)
		{
			let btn = document.createElement("button");
			btn.className = "button";

			btn.innerHTML = quiz.questions[quiz.current].answers[i].text;

			btn.setAttribute("index", i);

			buttonsElem.appendChild(btn);
		}
		
		//Выводим номер текущего вопроса
		pagesElem.innerHTML = (quiz.current + 1) + " / " + quiz.questions.length;

		//Вызываем функцию, которая прикрепит события к новым кнопкам
		Init();
	}
	else
	{
		//Если это конец, то выводим результат
		buttonsElem.innerHTML = "";
		headElem.innerHTML = quiz.results[quiz.result].text;
		pagesElem.innerHTML = "Очки: " + quiz.score;
	}
}

function Init()
{
	//Находим все кнопки
	let btns = document.getElementsByClassName("button");

	for(let i = 0; i < btns.length; i++)
	{
		//Прикрепляем событие для каждой отдельной кнопки
		//При нажатии на кнопку будет вызываться функция Click()
		btns[i].addEventListener("click", function (e) { Click(e.target.getAttribute("index")); });
	}
}

function Click(index) 
{
	//Получаем номер правильного ответа
	let correct = quiz.Click(index);

	//Находим все кнопки
	let btns = document.getElementsByClassName("button");

	//Делаем кнопки серыми
	for(let i = 0; i < btns.length; i++)
	{
		btns[i].className = "button button_passive";
	}

	//Если это тест с правильными ответами, то мы подсвечиваем правильный ответ зелёным, а неправильный - красным
	if(quiz.type == 1)
	{
		if(correct >= 0)
		{
			btns[correct].className = "button button_correct";
		}

		if(index != correct) 
		{
			btns[index].className = "button button_wrong";
		} 
	}
	else
	{
		//Иначе просто подсвечиваем зелёным ответ пользователя
		btns[index].className = "button button_correct";
	}

	//Ждём секунду и обновляем тест
	setTimeout(Update, 1000);
}