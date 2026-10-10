using System.ComponentModel.DataAnnotations;
using Priority1.ToDo.Core.Domain;

namespace Priority1.ToDo.Api.Models.Requests;

public class CreateTodoRequest
{
    private string _title = string.Empty;

    [Required]
    [MaxLength(200)]
    public string Title
    {
        get => _title;
        set => _title = value?.Trim() ?? string.Empty;
    }

    public bool IsComplete { get; set; }

    public DateTime? DueDate { get; set; }

    [Range(1, int.MaxValue)]
    public int ListId { get; set; }

    public Todo ToModel()
    {
        return new Todo
        {
            Title = Title,
            IsComplete = IsComplete,
            DueDate = DueDate,
            TodoListId = ListId
        };
    }
}
