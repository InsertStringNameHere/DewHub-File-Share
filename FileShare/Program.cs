using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Net;
using System.IO;
using System.Dynamic;
using Newtonsoft.Json.Linq;

namespace FileShare
{
    public class Program
    {
        static void Main(string[] args)
        {
            string fileType;
            string id;

            Console.WriteLine("Input File Type: ");
            fileType = Console.ReadLine();

            switch (fileType) 
            {
                case "map":
                    fileType = "maps";
                break;
                case "variant":
                    fileType = "variants";
                break;
                case "prefab":
                    fileType = "prefabs";
                break;
                case "mod":
                    fileType = "mods";
                break;
            }

            Console.WriteLine("Input File ID: ");
            id = Console.ReadLine();

            WebClient client = new WebClient();

            string url = "https://api.zgaf.io/api_v1/"+fileType+"/" + id;
            string response = client.DownloadString(url);

            var data = JObject.Parse(response);

            string fileUrl = "";
            string fileDirectory = "";
            string fileName = "";

            switch (fileType) 
            {
                case "maps":
                    fileUrl = "https://api.zgaf.io/api_v1/maps/"+data["mapName"]+"/file";
                    fileDirectory = "maps/" + data["mapName"] + "/";
                    fileName = "sandbox.map";
                break;
                case "variants":
                    fileUrl = "https://api.zgaf.io/api_v1/variants/"+data["id"]+"/file";
                    fileDirectory = "variants/" + data["variantName"] + "/";
                    fileName = "" + data["variantFileName"] + "";
                break;
                case "prefabs":
                    fileUrl = "https://api.zgaf.io/api_v1/prefabs/"+data["prefabName"]+"/file";
                    fileDirectory = "prefabs/" + data["prefabName"] + "/";
                    fileName = "" + data["prefabFileName"] + "";
                break;
                case "mods":
                    fileUrl = "https://api.zgaf.io/api_v1/mods/"+data["modName"]+"/file";
                    fileDirectory = "mods/" + data["modName"] + "/";
                    fileName = "" + data["modFileName"] + "";
               break;
            }

            using (client = new WebClient()) 
            {
                Directory.CreateDirectory(fileDirectory);
                client.DownloadFile(fileUrl, fileDirectory + fileName);
                Console.WriteLine("Download Complete");
            }

            Console.ReadLine();
        }
    }
}
