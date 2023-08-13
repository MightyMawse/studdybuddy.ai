using System.Collections;
using System;
using System.IO;
using Newtonsoft.Json;
using System.Text;


public class user
{
    public string email { get; set; }
    public string password { get; set; }
    public string username { get; set; }

    public string serialised
    {
        get
        {
            return JsonConvert.SerializeObject(this, Formatting.Indented);
        }
        set { }
    }

    public Dictionary<globals.SUBJECT, float> subjectProgress = new Dictionary<globals.SUBJECT, float>();

    public user(string _email, string _password, string _username)
    {
        email = _email;
        password = _password;
        username = _username;
    }

}
