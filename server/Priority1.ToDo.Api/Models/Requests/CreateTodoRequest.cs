using System.ComponentModel.DataAnnotations;
using Priority1.ToDo.Core.Domain;

namespace Priority1.ToDo.Api.Models.Requests;

public class CreateTodoRequest
{
    [Required]
    public string Title { get; set; } = string.Empty;

    public bool IsComplete { get; set; }

    [Range(1, int.MaxValue)]
    public int ListId { get; set; }

    public Todo ToModel()
    {
        return new Todo
        {
            Title = Title,
            IsComplete = IsComplete,
            TodoListId = ListId
        };
    }
}
