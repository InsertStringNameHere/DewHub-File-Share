#define SDL_MAIN_HANDLED
#define CURL_STATICLIB
#include <iostream>
#include <string>
#include <fstream>
#include <functional>
#include <list>
#include <algorithm>
#include <memory>
#include <thread>

#include <SDL.h>
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
    CURL* curl;
    CURLM* multi_handle;
    int still_running;
    CURLcode res;
    std::string url = "https://api.zgaf.io/api_v1/maps/13/file";

    curl = curl_easy_init();
    if (curl) 
    {
        static std::ofstream file("sandbox.map", std::ios::binary);
        curl_easy_setopt(curl, CURLOPT_URL, url.c_str());
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, write_to_file);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, &file);

        multi_handle = curl_multi_init();
        curl_multi_add_handle(multi_handle, curl);

        if (SDL_Init(SDL_INIT_TIMER) < 0) 
        {
            std::cerr << "SDL initialization failed" << std::endl;
            return 1;
        }

        SDL_Event event;
        bool quit = false;

        while (!quit) 
        {
            while (SDL_PollEvent(&event) != 0) 
            {
                if (event.type == SDL_QUIT) 
                {
                    quit = true;
                    break;
                }
            }
            SDL_Delay(100);

            while (CURLM_CALL_MULTI_PERFORM == curl_multi_perform(multi_handle, &still_running));

            if (still_running) 
            {
                int numfds;
                CURLMcode mc = curl_multi_wait(multi_handle, NULL, 0, 1000, &numfds);
                if (mc != CURLM_OK) 
                {
                    std::cerr << "curl_multi_wait() failed: " << curl_multi_strerror(mc) << std::endl;
                    break;
                }
            }
        }

        res = curl_easy_getinfo(curl, CURLINFO_RESPONSE_CODE, url.c_str());

        if (res != CURLE_OK) 
        {
            std::cerr << "curl_easy_perform() failed: " << curl_easy_strerror(res) << std::endl;
        }

        curl_easy_cleanup(curl);
        curl_multi_cleanup(multi_handle);

        file.close();
    }

    return 0;
}