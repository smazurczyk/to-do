using System.Text.Json;

namespace ToDo
{
    public class ServerResponseTaskList
    {
        public bool Ok { get; set; }
        public List<TaskToDo>? Data { get; set; }
        public string? Error { get; set; }


        public ServerResponseTaskList(bool ok, JsonTasks? data = null, string? error = null)
        {   
            this.Ok = ok;
            this.Error = error;
            if (data != null)
            {
                this.Data = data.Data;
            }
            else
            {
                this.Data = [];
            }
        }

        public string Serialize()
        {
            return JsonSerializer.Serialize(this);
        }
    }

    public class ServerResponseSingleTask
    {
        public bool Ok { get; set; }
        public TaskToDo? Data { get; set; }
        public string? Error { get; set; }


        public ServerResponseSingleTask(bool ok, TaskToDo? data = null, string? error = null)
        {
            this.Ok = ok;
            this.Error = error;
            if (data != null)
            {
                this.Data = data;
            }
            else
            {
                this.Data = null;
            }
        }

        public string Serialize()
        {
            return JsonSerializer.Serialize(this);
        }
    }

    public class ServerReponseSimpleTasks
    {
        public bool Ok { get; set; }
        public List<SimpleTask>? Data { get; set; }
        public string? Error { get; set; }


        public ServerReponseSimpleTasks(bool ok, List<SimpleTask>? data = null, string? error = null)
        {
            this.Ok = ok;
            this.Error = error;
            if (data != null)
            {
                this.Data = data;
            }
            else
            {
                this.Data = null;
            }
        }

        public string Serialize()
        {
            return JsonSerializer.Serialize(this);
        }
    }
}