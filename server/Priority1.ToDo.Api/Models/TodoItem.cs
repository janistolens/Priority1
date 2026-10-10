using Priority1.ToDo.Core.Domain;

namespace Priority1.ToDo.Api.Models;

public class TodoItem
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public bool IsComplete { get; set; }
    public DateTime? DueDate { get; set; }
    public int ListId { get; set; }
    public DateTime CreateDate { get; set; }
    public DateTime UpdateDate { get; set; }

    public static TodoItem From(Todo todo)
    {
        return new TodoItem
        {
            Id = todo.Id,
            Title = todo.Title,
            IsComplete = todo.IsComplete,
            DueDate = todo.DueDate,
            ListId = todo.TodoListId,
            CreateDate = todo.CreateDate,
            UpdateDate = todo.UpdateDate
        };
    }

    public Todo ToModel()
    {
        return new Todo
        {
            Id = Id,
            Title = Title,
            IsComplete = IsComplete,
            DueDate = DueDate,
            TodoListId = ListId,
            CreateDate = CreateDate,
            UpdateDate = UpdateDate
        };
    }
}
