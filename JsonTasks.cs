using System.Text.Json;

namespace ToDo
{
    public class JsonTasks(List<TaskToDo> data)
    {
        public List<TaskToDo> Data { get; set; } = data;

        static public JsonTasks CheckFile()
        {
            if(!Directory.Exists("./data"))
            {
                Directory.CreateDirectory("./data");
            }
            if (!File.Exists("./data/ToDo.json"))
            {
                File.WriteAllText("./data/ToDo.json", """{"Data":[]}""");
            }
            else
            {
                try
                {
                    JsonSerializer.Deserialize<JsonTasks>(File.ReadAllText("./data/ToDo.json"));
                }
                catch
                {
                    File.WriteAllText("./data/ToDo.json", """{"Data": []}""");
                }
            }

            return JsonSerializer.Deserialize<JsonTasks>(File.ReadAllText("./data/ToDo.json"));
        }
    }
}