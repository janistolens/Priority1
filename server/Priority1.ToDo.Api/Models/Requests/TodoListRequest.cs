using System.ComponentModel.DataAnnotations;
using Priority1.ToDo.Core.Domain;

namespace Priority1.ToDo.Api.Models.Requests;

public class TodoListRequest
{
    private string _title = string.Empty;

    [Required]
    [MaxLength(200)]
    public string Title
    {
        get => _title;
        set => _title = value?.Trim() ?? string.Empty;
    }

    public TodoList ToModel()
    {
        return new TodoList { Title = Title };
    }

    public TodoList ToModel(int id)
    {
        return new TodoList { Id = id, Title = Title };
    }
}
