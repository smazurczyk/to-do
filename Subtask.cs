namespace ToDo
{
    public class Subtask(string name, bool done = false)
    {
        public string Name { get; set; } = name;
        public bool Done { get; set; } = done;
    }
}