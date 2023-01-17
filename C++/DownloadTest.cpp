#define CURL_STATICLIB
#include <iostream>
#include <fstream>

#include "curl/curl.h"

size_t write_to_file(void* contents, size_t size, size_t nmemb, void* userp)
{
    size_t realsize = size * nmemb;
    auto file = reinterpret_cast<std::ofstream*>(userp);
    file->write(reinterpret_cast<const char*>(contents), realsize);
    return realsize;
}

int main()
{
	std::string savepath = "Forerunner Prefab Pack.zip";
	std::string url = "https://api.zgaf.io/api_v1/prefabs/9/file";

	CURL* curl;
	CURLcode res;
	curl = curl_easy_init();
	if (curl)
	{
		static std::ofstream file(savepath, std::ios::binary);
		curl_easy_setopt(curl, CURLOPT_URL, url.c_str());
		curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, write_to_file);
		curl_easy_setopt(curl, CURLOPT_WRITEDATA, &file);
		res = curl_easy_perform(curl);

		switch (res)
		{
		    case CURLE_OK:
		    	std::cout << "Done!" << std::endl;
		    	break;
		    case CURLE_COULDNT_RESOLVE_HOST:
		    	std::cout << "Failed to resolve host" << std::endl;
		    	break;
		    case CURLE_COULDNT_CONNECT:
		    	std::cout << "A connection error occured" << std::endl;
		    	break;
		    case CURLE_WRITE_ERROR:
		    	std::cout << "An error occured when trying to save the file" << std::endl;
		    	break;
		    default:
		    	std::cout << "An unknown error occured" << std::endl;
		    	break;
		}

		curl_easy_cleanup(curl);
		file.close();
	}

	size_t isZipFile = savepath.find(".zip");

	if (isZipFile != std::string::npos)
	{
		std::cout << "File Needs to Be Unzipped Manually" << std::endl;
	}

    return 0;
}