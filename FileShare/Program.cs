using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Net;
using System.IO;
using System.Dynamic;

namespace FileShare
{
    public class Program
    {
        static void Main(string[] args)
        {
            string url = "https://api.zgaf.io/api_v1/maps/Transit%20Wars/file"; ;
            string file = @"sandbox.map";

            Console.WriteLine("Test Download:");
            Console.ReadLine();

            using (WebClient client = new WebClient())
            {
                client.DownloadFile(url, file);
            }
        }
    }
}
