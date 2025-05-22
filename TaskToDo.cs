namespace ToDo
{
    public class TaskToDo(string name, string? id = null, Subtask[]? subtasks = null, ulong? deadLine = null, bool? done = null)
    {
        public string Id { get; } = id != null ? id : Guid.NewGuid().ToString();
        public string Name { get; set; } = name;
        public bool? Done { get; set; } = done;
        public ulong? Deadline { get; set; } = deadLine;
        public Subtask[]? Subtasks { get; set; } = subtasks;
    }
} 