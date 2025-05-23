document.addEventListener('DOMContentLoaded', function() {
    // Плавная прокрутка для якорных ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Обработка формы
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Получаем данные формы
            const formData = new FormData(this);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });

            // Здесь можно добавить отправку данных на сервер
            console.log('Отправка формы:', formObject);
            
            // Очищаем форму
            this.reset();
            
            // Показываем сообщение об успехе
            alert('Спасибо! Ваша заявка принята. Мы свяжемся с вами в ближайшее время.');
        });
    }

    // Добавляем класс для фиксированного хедера при прокрутке
    const header = document.querySelector('header');
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            header.classList.remove('scroll-up');
            return;
        }
        
        if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
            header.classList.remove('scroll-up');
            header.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
            header.classList.remove('scroll-down');
            header.classList.add('scroll-up');
        }
        lastScroll = currentScroll;
    });

    // Отслеживание прокрутки для изменения стиля шапки
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Form Application Logic
    const formSteps = document.querySelectorAll('.step');
    const optionButtons = document.querySelectorAll('.option-btn');
    const optionsList = document.querySelector('.options-list');
    
    let currentStep = 0;
    const totalSteps = formSteps.length;
    const selectedOptions = {
        equipment: '',
        district: '',
        time: '',
        problem: ''
    };

    // Show current step
    function showStep(step) {
        formSteps.forEach(s => s.classList.remove('active'));
        formSteps[step].classList.add('active');
        currentStep = step;

        // Update selected options list on last step
        if (step === totalSteps - 1) {
            updateOptionsList();
        }
    }

    // Обработка выбора опции
    optionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const step = this.closest('.step');
            const buttonsInStep = step.querySelectorAll('.option-btn');
            
            // Снимаем выделение со всех кнопок в текущем шаге
            buttonsInStep.forEach(btn => {
                btn.classList.remove('selected');
            });
            
            // Выделяем выбранную кнопку
            this.classList.add('selected');
            
            // Сохраняем выбранное значение
            const value = this.getAttribute('data-value');
            const stepNumber = step.getAttribute('data-step');
            if (stepNumber) {
                switch(stepNumber) {
                    case '1':
                        selectedOptions.equipment = value;
                        break;
                    case '2':
                        selectedOptions.district = value;
                        break;
                    case '3':
                        selectedOptions.time = value;
                        break;
                    case '4':
                        selectedOptions.problem = value;
                        break;
                }
            }

            // Если это не последний шаг, переходим к следующему
            if (currentStep < totalSteps - 1) {
                showStep(currentStep + 1);
            } else {
                // На последнем шаге обрабатываем отправку формы
                const name = document.querySelector('input[type="text"]').value;
                const phone = document.querySelector('input[type="tel"]').value;

                if (!name || !phone) {
                    alert('Пожалуйста, заполните все поля');
                    return;
                }

                // Здесь можно добавить отправку данных на сервер
                console.log('Form submitted:', {
                    name,
                    phone,
                    ...selectedOptions
                });

                // Показываем сообщение об успехе
                alert('Спасибо! Ваша заявка принята. Мы свяжемся с вами в ближайшее время.');
            }
        });
    });

    // Обработка кнопки "Назад"
    const prevButtons = document.querySelectorAll('.prev-btn');
    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (currentStep > 0) {
                showStep(currentStep - 1);
            }
        });
    });

    // Update selected options list
    function updateOptionsList() {
        if (!optionsList) return;
        
        optionsList.innerHTML = '';
        for (const [key, value] of Object.entries(selectedOptions)) {
            if (value) {
                const li = document.createElement('li');
                li.textContent = `${getOptionLabel(key)}: ${value}`;
                optionsList.appendChild(li);
            }
        }
    }

    // Get option label
    function getOptionLabel(key) {
        const labels = {
            equipment: 'Тип техники',
            district: 'Район',
            time: 'Время ремонта',
            problem: 'Проблема'
        };
        return labels[key] || key;
    }

    // Initialize form
    showStep(0);

    // Функции для работы модального окна заказа
    function openOrderModal() {
        const modal = document.getElementById('orderModal');
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function closeOrderModal() {
        const modal = document.getElementById('orderModal');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Закрытие модального окна при клике вне его области
    document.getElementById('orderModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeOrderModal();
        }
    });

    // Обработка отправки формы
    document.querySelector('.order-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = this.querySelector('input[name="name"]').value;
        const phone = this.querySelector('input[name="phone"]').value;
        
        // Здесь можно добавить отправку данных на сервер
        console.log('Отправка формы:', { name, phone });
        
        // Очистка формы и закрытие модального окна
        this.reset();
        closeOrderModal();
        
        // Показываем сообщение об успешной отправке
        alert('Спасибо! Мы свяжемся с вами в ближайшее время.');
    });

    // Добавляем обработчики для всех кнопок "Заказать"
    document.querySelectorAll('.order-button').forEach(button => {
        button.addEventListener('click', openOrderModal);
    });

    // Бургер-меню
    const burgerMenu = document.querySelector('.burger-menu');
    const navLinks = document.querySelector('.nav-links');

    if (burgerMenu && navLinks) {
        burgerMenu.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Закрытие меню при клике на ссылку
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                burgerMenu.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });

        // Закрытие меню при клике вне его области
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !burgerMenu.contains(e.target)) {
                burgerMenu.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    }

    // Price list functionality
    const showMoreButtons = document.querySelectorAll('.show-more-btn');
    
    showMoreButtons.forEach(button => {
        button.addEventListener('click', function() {
            const priceList = this.previousElementSibling;
            const hiddenItems = priceList.querySelectorAll('.price-item.hidden');
            const isHidden = hiddenItems.length > 0;
            
            if (isHidden) {
                // Показываем все скрытые элементы
                hiddenItems.forEach(item => {
                    item.classList.remove('hidden');
                });
                this.textContent = 'Скрыть';
            } else {
                // Скрываем все элементы, кроме первых 5
                const allItems = priceList.querySelectorAll('.price-item');
                allItems.forEach((item, index) => {
                    if (index >= 5) {
                        item.classList.add('hidden');
                    }
                });
                this.textContent = 'Показать все';
            }
        });
    });
}); 