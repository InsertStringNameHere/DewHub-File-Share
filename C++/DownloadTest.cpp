#define CURL_STATICLIB
#include <iostream>
#include <fstream>
#include <filesystem>

#include <direct.h>
#include "zip.h"
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
	std::string url;
	std::string fileType;
	std::string name;
	std::string fileName;

	std::cout << "Input URL: " << std::endl;
	std::cin >> url;
	std::cout << "Input File Type: " << std::endl;
	std::cin >> fileType;
	std::cout << "Input Item Name: " << std::endl;
	std::cin.ignore();
	std::getline(std::cin, name);
	std::cout << "Input File Name: " << std::endl;
	std::getline(std::cin, fileName);

	std::cout << "TESTING INPUTS:" << std::endl;
	std::cout << url << std::endl;
	std::cout << fileType << std::endl;
	std::cout << name << std::endl;
	std::cout << fileName << std::endl;

	std::string directory;
	std::string savepath;

	CreateDirectoryA("mods\\", NULL);

	if (fileType != "map" && fileType != "variant" && fileType != "prefab" && fileType != "mod")
	{
		std::cout << "Invalid File Type: " + fileType << std::endl;
		return 1;
	}

	if (fileType == "map")
	{
		CreateDirectoryA("mods\\maps\\", NULL);
		directory = "mods\\maps\\" + name + "\\";
		CreateDirectoryA(directory.c_str(), NULL);
		savepath = "mods\\maps\\" + name + "\\" + fileName;
	}

	if (fileType == "variant")
	{
		CreateDirectoryA("mods\\variants\\", NULL);
		directory = "mods\\variants\\" + name + "\\";
		CreateDirectoryA(directory.c_str(), NULL);
		savepath = "mods\\variants\\" + name + "\\" + fileName;
	}

	if (fileType == "prefab")
	{
		CreateDirectoryA("mods\\prefabs\\", NULL);
		savepath = "mods\\prefabs\\" + fileName;
	}

	if (fileType == "mod")
	{
		CreateDirectoryA("mods\\tagmods\\", NULL);
		directory = "mods\\tagmods\\" + name + "\\";
		CreateDirectoryA(directory.c_str(), NULL);
		savepath = "mods\\tagmods\\" + name + "\\" + fileName;
	}

	CURL* curl;
	CURLcode res;
	curl = curl_easy_init();
	if (curl)
	{
		std::ofstream file(savepath, std::ios::binary);
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
			file.close();
		    std::filesystem::remove_all(directory);
			break;
		case CURLE_COULDNT_CONNECT:
			std::cout << "A connection error occured" << std::endl;
			file.close();
			std::filesystem::remove_all(directory);
			break;
		case CURLE_WRITE_ERROR:
			std::cout << "An error occured when trying to save the file" << std::endl;
			file.close();
			std::filesystem::remove_all(directory);
			break;
		default:
			std::cout << "An unknown error occured" << std::endl;
			file.close();
			std::filesystem::remove_all(directory);
			break;
		}

		curl_easy_cleanup(curl);
		file.close();
	}

	size_t isZipFile = fileName.find(".zip");

	if (isZipFile != std::string::npos)
	{
		int error;
		struct zip* za;

		if ((za = zip_open(savepath.c_str(), 0, &error)) == NULL)
		{
			std::cout << "Error opening zip file: " << zip_strerror(za) << std::endl;
		}

		zip_int64_t num_files = zip_get_num_entries(za, 0);

		for (int i = 0; i < num_files; i++)
		{
			struct zip_stat zs;
			zip_stat_init(&zs);
			if (zip_stat_index(za, i, 0, &zs) == 0)
			{
				char* buffer = new char[zs.size];
				struct zip_file* zf = zip_fopen_index(za, i, 0);
				zip_fread(zf, buffer, zs.size);
				zip_fclose(zf);

				std::string filename = zs.name;
				std::string dirname = "";
				size_t pos = filename.find_last_of("/");
				if (pos != std::string::npos)
				{
					dirname = filename.substr(0, pos);
					filename = filename.substr(pos + 1);
				}
				std::string filepath = "mods\\prefabs\\" + filename;
				std::ofstream out(filepath.c_str(), std::ios::binary);
				out.write(buffer, zs.size);
				out.close();

				delete[] buffer;
			}
		}

		zip_close(za);

		std::filesystem::remove_all(savepath);
	}

	return 0;
}