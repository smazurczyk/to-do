using System;
using Microsoft.AspNetCore.Builder;

namespace ToDo
{
    internal class Program
    {
        static void Main(string[] args)
        {
            WebApplicationBuilder builder = WebApplication.CreateBuilder(args);
            WebApplication app = builder.Build();
            RouteGroupBuilder api = app.MapGroup("/api/todo");

            api.MapGet("/", TaskController.GetAll); // get all tasks
            api.MapPost("/", TaskController.Add); // add new task
            api.MapPatch("/{id}", TaskController.Edit); // edit task
            api.MapDelete("/{id}", TaskController.Delete); // delete task

            app.Run("http://localhost:3000/");
        }
    }
}