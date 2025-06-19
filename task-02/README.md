### Задача 2: Система управления задачами (ToDo)

**Сложность:** ⭐⭐ Начинающий

**Что изучаем:**

- Массивы и объекты
- Методы массивов (push, filter, find, map)
- Работа со свойствами объектов
- Циклы и итерации

**📚 Ресурсы для изучения:**

- [Learn.js - Массивы](https://learn.javascript.ru/array) - основы работы с массивами
- [Learn.js - Методы массивов](https://learn.javascript.ru/array-methods) - map, filter, reduce и другие
- [Learn.js - Объекты](https://learn.javascript.ru/object) - создание и работа с объектами
- [YouTube - Массивы JavaScript](https://www.youtube.com/results?search_query=javascript+%D0%BC%D0%B0%D1%81%D1%81%D0%B8%D0%B2%D1%8B+%D0%BC%D0%B5%D1%82%D0%BE%D0%B4%D1%8B) - видеоуроки по массивам

**Техническое задание:**
Создайте систему для управления списком задач:

1. **Структура задачи:**
    
    ```jsx
    
    javascript
    {
      id: 1,
      title: "Изучить JavaScript",
      completed: false,
      priority: "high",// low, medium, high
      createdAt: "2024-01-15"
    }
    
    ```
    
2. **Функции для реализации:**
    - `addTask(title, priority)` - добавить задачу
    - `removeTask(id)` - удалить задачу
    - `toggleTask(id)` - изменить статус выполнения
    - `filterTasks(status)` - фильтрация по статусу ('all', 'completed', 'pending')
    - `getTasksByPriority(priority)` - задачи по приоритету
    - `getTasksStats()` - статистика (всего, выполнено, осталось)
3. **Дополнительно:**
    - Поиск задач по тексту `searchTasks(query)`
    - Сортировка по дате или приоритету