using System.Text.Json;

namespace ToDo
{
    public class TaskController
    {
        public static string GetAll()
        {
            try
            {
                JsonTasks? json = JsonSerializer.Deserialize<JsonTasks>(File.ReadAllText("./data/ToDo.json"));
                ServerResponseTaskList response = new(true, json);
                return response.Serialize();
            }
            catch (Exception ex)
            {
                ServerResponseSingleTask exception = new(false, null, ex.Message);
                return exception.Serialize();
            }
        }

        public static string Add(TaskToDo task)
        {
            try
            {
                JsonTasks? json = JsonSerializer.Deserialize<JsonTasks>(File.ReadAllText("./data/ToDo.json"));
                if (task.Name == null) throw new Exception("Task name is required.");
                if (task.Done == null) task.Done = false;

                json.Data.Add(task);
                File.WriteAllText("./data/ToDo.json", JsonSerializer.Serialize(json));
                ServerResponseSingleTask response = new(true, task);
                return response.Serialize();
            }
            catch (Exception ex)
            {
                ServerResponseSingleTask exception = new(false, null, ex.Message);
                return exception.Serialize();
            }
        }

        public static string Edit(TaskToDo task, string id)
        {
            try
            {
                JsonTasks? json = JsonSerializer.Deserialize<JsonTasks>(File.ReadAllText("./data/ToDo.json"));

                if (json.Data.Count == 0) throw new Exception("No tasks exist in the database.");

                if (json.Data.Count == 1)
                {
                    if (json.Data[0].id == id)
                    {
                        if (task.Name != null)
                        {
                            json.Data[0].Name = task.Name;
                        }
                        if (task.Done != null)
                        {
                            json.Data[0].Done = task.Done;
                        }
                        if (task.Deadline != null)
                        {
                            json.Data[0].Deadline = task.Deadline;
                        }
                        if(task.Subtasks != null)
                        {
                            json.Data[0].Subtasks = task.Subtasks;
                        }

                        File.WriteAllText("./data/ToDo.json", JsonSerializer.Serialize(json));
                        ServerResponseSingleTask emptyDataResponse = new(true, json.Data[0]);
                        return emptyDataResponse.Serialize();
                    }
                    else
                    {
                        throw new Exception("Invalid task id.");
                    }
                }

                int taskId = json.Data.FindIndex(0, json.Data.Count, e => e.id == id);
                if (taskId < 0) throw new Exception("Invalid task id.");

                if (task.Name != null)
                {
                    json.Data[taskId].Name = task.Name;
                }
                if (task.Done != null)
                {
                    json.Data[taskId].Done = task.Done;
                }
                if (task.Deadline != null)
                {
                    json.Data[taskId].Deadline = task.Deadline;
                }
                if (task.Subtasks != null)
                {
                    json.Data[taskId].Subtasks = task.Subtasks;
                }

                File.WriteAllText("./data/ToDo.json", JsonSerializer.Serialize(json));
                ServerResponseSingleTask response = new(true, json.Data[taskId]);
                return response.Serialize();
            }
            catch (Exception ex)
            {
                ServerResponseSingleTask exception = new(false, null, ex.Message);
                return exception.Serialize();
            }
        }

        public static string Delete(string id)
        {
            try 
            {
                JsonTasks? json = JsonSerializer.Deserialize<JsonTasks>(File.ReadAllText("./data/ToDo.json"));


                if(json.Data.Count == 0)
                {
                    throw new Exception("No tasks exist in the database.");
                }
                if (json.Data.Count == 1)
                {
                    if (json.Data[0].id == id)
                    {
                        json.Data = [];
                        File.WriteAllText("./data/ToDo.json", JsonSerializer.Serialize(json));
                        ServerResponseSingleTask emptyDataResponse = new(true, null);
                        return emptyDataResponse.Serialize();
                    }
                    else
                    {
                        throw new Exception("Invalid task id.");
                    }
                }

                int taskId = json.Data.FindIndex(0, json.Data.Count, e => e.id == id);

                if (taskId < 0) throw new Exception("Invalid task id.");

                json.Data.RemoveAt(taskId);
                File.WriteAllText("./data/ToDo.json", JsonSerializer.Serialize(json));
                ServerResponseSingleTask response = new(true, null);
                return response.Serialize();
            }
            catch (Exception ex)
            {
                ServerResponseSingleTask exception = new(false, null, ex.Message);
                return exception.Serialize();
            }
        }
    }
} 
