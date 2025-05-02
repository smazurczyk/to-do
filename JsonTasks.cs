namespace ToDo
{
    public class JsonTasks(List<TaskToDo> data)
    {
        public List<TaskToDo> Data { get; set; } = data;
    }
}