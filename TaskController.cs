using System.Text.Json;

namespace ToDo
{
    public class TaskController
    {
        public static string GetAll()
        {
            try
            {
                JsonTasks json = JsonTasks.CheckFile();
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
                JsonTasks json = JsonTasks.CheckFile();
                if (task.Name == null) throw new Exception("Task name is required.");
                task.Done ??= false;

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

        public static string Delete(string id)
        {
            try
            {
                JsonTasks json = JsonTasks.CheckFile();

                if (json.Data.Count == 0)
                {
                    throw new Exception("No tasks exist in the database.");
                }
                if (json.Data.Count == 1)
                {
                    if (json.Data[0].Id == id)
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

                int taskIndex = json.Data.FindIndex(e => e.Id == id);

                if (taskIndex < 0) throw new Exception("Invalid task id.");

                json.Data.RemoveAt(taskIndex);
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

        public static string Replace(TaskToDo task, string id)
        {
            try
            {
                JsonTasks json = JsonTasks.CheckFile();

                json.Data[json.Data.FindIndex(task => task.Id == id)] = task;

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

        public static string ChangeOrder(IndexJson newIndex, string id)
        {
            try
            {
                JsonTasks json = JsonTasks.CheckFile();

                int oldIndex = json.Data.FindIndex(task => task.Id == id);
                TaskToDo task = json.Data[oldIndex];
                json.Data.RemoveAt(oldIndex);
                json.Data.Insert(newIndex.Value, task);

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

        public static string Check(List<SimpleTask> changed)
        {
            try
            {
                JsonTasks json = JsonTasks.CheckFile();

                foreach (SimpleTask task in changed)
                {
                    int taskIndex = json.Data.FindIndex(e => e.Id == task.Id);
                    json.Data[taskIndex].Done = task.Done;

                    if(task.Subtasks != null)
                    {
                        if(task.Subtasks.Count == 1)
                        {
                            json.Data[taskIndex].Subtasks[task.Subtasks[0].Index].Done = task.Subtasks[0].Done;
                        }
                        else if(task.Subtasks.Count > 1)
                        {
                            foreach (SimpleSubtask subtask in task.Subtasks)
                            {
                                json.Data[taskIndex].Subtasks[subtask.Index].Done = subtask.Done;
                            }
                        }
                    }
                }

                File.WriteAllText("./data/ToDo.json", JsonSerializer.Serialize(json));
                ServerReponseSimpleTasks response = new(true, changed);
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
