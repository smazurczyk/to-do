namespace ToDo
{
    public class SimpleTask(string id, bool done, List<SimpleSubtask> subtasks)
    {
        public string Id { get; } = id;
        public bool Done { get; } = done;
        public List<SimpleSubtask> Subtasks { get; } = subtasks;
    }
}
