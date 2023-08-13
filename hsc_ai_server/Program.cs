using System.Collections;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Xml;
using System.Diagnostics;
using OpenAI_API;
using Newtonsoft.Json;

public partial class Program
{
    static WebApplicationBuilder builder;
    static WebApplication app;
    static string currentSubject;

    static Dictionary<string, string> subjectMap = new Dictionary<string, string>()
    {
        { "MATH", Environment.CurrentDirectory + "/json/math.json" },
        { "PHYSICS", Environment.CurrentDirectory + "/json/physics.json" },
        { "BIOLOGY", Environment.CurrentDirectory + "/json/biology.json" },
        { "CHEMISTRY", Environment.CurrentDirectory + "/json/chemistry.json" },
        { "ENGINEERING", Environment.CurrentDirectory + "/json/physics.json" },
        { "SOFTWARE", Environment.CurrentDirectory + "/json/physics.json" },
        { "BUSINESS", Environment.CurrentDirectory + "/json/physics.json" },
        { "ECONOMICS", Environment.CurrentDirectory + "/json/physics.json" },
        { "ENGLISH", Environment.CurrentDirectory + "/json/physics.json" },
    };

    static Dictionary<string, string> topicMap = new Dictionary<string, string>()
    {
        { "MATH", Environment.CurrentDirectory + "/modules/math/topics/" },
        { "PHYSICS", Environment.CurrentDirectory + "/modules/physics/topics/" },
        { "BIOLOGY", Environment.CurrentDirectory + "/modules/biology/topics/" },
        { "CHEMISTRY", Environment.CurrentDirectory + "/modules/chemistry/topics/" },
        { "ENGINEERING", Environment.CurrentDirectory + "/modules/engineering/topics/" },
        { "SOFTWARE", Environment.CurrentDirectory + "/modules/software/topics/" },
        { "BUSINESS", Environment.CurrentDirectory + "/modules/business/topics/" },
        { "ECONOMICS", Environment.CurrentDirectory + "/modules/economics/topics/" },
        { "ENGLISH", Environment.CurrentDirectory + "/modules/english/topics/" },
    };

    static Dictionary<string, user> loginMap = new Dictionary<string, user>();

    public static void Main(string[] args)
    {
        builder = WebApplication.CreateBuilder();
        app = builder.Build();

        Init();
    }

    /*
     * Init
     * Initialize app functions
     */
    public static void Init()
    {
        // Get index.html
        app.MapGet("/", async (context) =>
        {
            context.Response.ContentType = "text/html";
            await context.Response.SendFileAsync("wwwroot/index.html");
        });

        // Get subject json
        app.MapPost("/subject", async (context) =>
        {
            var body = await new StreamReader(context.Request.Body).ReadToEndAsync();
            string serial = JsonConvert.SerializeObject(File.ReadAllText(subjectMap[body]));
            currentSubject = body;
            await context.Response.WriteAsync(serial);
        });

        // Get ai response given query
        app.MapPost("/ai/{id}", async (context) =>
        {
            var body = await new StreamReader(context.Request.Body).ReadToEndAsync();
            string id = context.Request.RouteValues["id"] as string;

            string? apiKey = Environment.GetEnvironmentVariable("OPENAI_API_KEY");
            var api = new OpenAI_API.OpenAIAPI(apiKey);
            var chat = api.Chat.CreateConversation();

            chat.AppendSystemMessage(globals.systemPrompt); // Basic params
            if(id != null && id != string.Empty && id != "chat")
            {
                chat.AppendSystemMessage(topicMap[currentSubject] + id); // Train on selected module
            }

            chat.AppendUserInput(body);
            string chatResponse = await chat.GetResponseFromChatbotAsync();

            await context.Response.WriteAsync(chatResponse);
        });

        app.MapPost("/login", async (context) =>
        {
            // Check if exists in hashmap, else add
            var jsonObject = new { user = "", password = "" };
            var body = await new StreamReader(context.Request.Body).ReadToEndAsync();

            var serial = JsonConvert.DeserializeAnonymousType(body, jsonObject);
            if (loginMap.ContainsKey(serial.user)) // If user exists
            {
                if (loginMap[serial.user].password == jsonObject.password)
                    await context.Response.WriteAsync("Successful Login");
                else
                    await context.Response.WriteAsync("Unsuccessful Login");
            }
            else
            {
                await context.Response.WriteAsync("Unsuccessful Login");
            }
        });

        app.MapPost("/register", async (context) =>
        {
            var jsonObject = new { user = "", password = "" };
            var body = await new StreamReader(context.Request.Body).ReadToEndAsync();
            var deSerial = JsonConvert.DeserializeAnonymousType(body, jsonObject);
            if (loginMap.ContainsKey(deSerial.user))
            {
                await context.Response.WriteAsync("Already Exists");
            }
            else
            {
                loginMap.Add(deSerial.user, new user(deSerial.user, deSerial.password, deSerial.user));
                await context.Response.WriteAsync("Successful Register");
            }
        });

        app.MapPost("/getuser", async (context) =>
        {
            var body = await new StreamReader(context.Request.Body).ReadToEndAsync();
            try
            {
                await context.Response.WriteAsync(loginMap[body].serialised);
            }
            catch { }
            await context.Response.WriteAsync("User doesn't exist");
        });

        app.UseStaticFiles();
        app.Run();
    }
}