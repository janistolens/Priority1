using System.ComponentModel.DataAnnotations;
using Priority1.ToDo.Core.Domain;

namespace Priority1.ToDo.Api.Models.Requests;

public class UpdateTodoRequest
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

    public Todo ToModel(int id)
    {
        return new Todo
        {
            Id = id,
            Title = Title,
            IsComplete = IsComplete
        };
    }
}
