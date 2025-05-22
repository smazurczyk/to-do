using System.Text.Json;

namespace ToDo
{
    internal class Program
    {
        static void Main(string[] args)
        {
            WebApplicationBuilder builder = WebApplication.CreateBuilder(args);
            WebApplication app = builder.Build();
            RouteGroupBuilder api = app.MapGroup("/todo/api");
            string PORT = builder.Configuration["PORT"] ?? "3000";

            JsonTasks.CheckFile();

            app.UseDefaultFiles();
            app.UseStaticFiles();

            app.MapGet("/", async context =>
            {
                context.Response.Redirect($"http://localhost:{PORT}/todo");
            });
            api.MapGet("/", TaskController.GetAll); // get all tasks
            api.MapPost("/", TaskController.Add); // add new task
            api.MapDelete("/{id}", TaskController.Delete); // delete task
            api.MapPut("/{id}", TaskController.Replace); // edit task
            api.MapPatch("/{id}", TaskController.ChangeOrder); // change order
            api.MapPatch("/", TaskController.Check); // mark tasks as done

            Console.BackgroundColor = ConsoleColor.DarkGreen;
            Console.WriteLine($"Server is running on port {PORT}");
            app.Run($"http://localhost:{PORT}/");
        }
    }
}