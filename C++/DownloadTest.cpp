#define CURL_STATICLIB
#include <iostream>
#include <string>
#include <fstream>
#include <functional>
#include <list>
#include <algorithm>
#include <memory>
#include <thread>

#include "curl/curl.h"

//Synchronous Downloading

/*
size_t write_to_file(void* contents, size_t size, size_t nmemb, void* userp)
{
    size_t realsize = size * nmemb;
    auto file = reinterpret_cast<std::ofstream*>(userp);
    file->write(reinterpret_cast<const char*>(contents), realsize);
    return realsize;
}

int main(void)
{
    CURL* curl;
    CURLcode res;
    char url[] = "https://api.zgaf.io/api_v1/maps/13/file";
    curl = curl_easy_init();
    if (curl)
    {
        static std::ofstream file("sandbox.map", std::ios::binary);
        curl_easy_setopt(curl, CURLOPT_URL, url);
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, write_to_file);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, &file);
        res = curl_easy_perform(curl);
        curl_easy_cleanup(curl);
    }
    return 0;
}
*/

//Asynchronous Downloading

using EasyHandle = std::unique_ptr<CURL, std::function<void(CURL*)>>;
EasyHandle CreateEasyHandle()
{
    auto curl = EasyHandle(curl_easy_init(), curl_easy_cleanup);
    if (!curl)
    {
        throw std::runtime_error("Failed creating CURL easy object");
    }
    return curl;
}

using MultiHandle = std::unique_ptr<CURLM, std::function<void(CURLM*)>>;
MultiHandle CreateMultiHandle()
{
    auto curl = MultiHandle(curl_multi_init(), curl_multi_cleanup);
    if (!curl)
    {
        throw std::runtime_error("Failed creating CURL multi object");
    }
    return curl;
}

size_t write_to_file(void* contents, size_t size, size_t nmemb, void* userp)
{
    size_t realsize = size * nmemb;
    auto file = reinterpret_cast<std::ofstream*>(userp);
    file->write(reinterpret_cast<const char*>(contents), realsize);
    return realsize;
}

timeval get_timeout(CURLM* multi_handle)
{
    long curl_timeo = -1;
    struct timeval timeout;
    timeout.tv_sec = 1;
    timeout.tv_usec = 0;

    curl_multi_timeout(multi_handle, &curl_timeo);
    if (curl_timeo >= 0) {
        timeout.tv_sec = curl_timeo / 1000;
        if (timeout.tv_sec > 1)
            timeout.tv_sec = 1;
        else
            timeout.tv_usec = (curl_timeo % 1000) * 1000;
    }
    return timeout;
}

int wait_if_needed(CURLM* multi_handle, timeval& timeout)
{
    fd_set fdread;
    fd_set fdwrite;
    fd_set fdexcep;
    FD_ZERO(&fdread);
    FD_ZERO(&fdwrite);
    FD_ZERO(&fdexcep);
    int maxfd = -1;

    auto mc = curl_multi_fdset(multi_handle, &fdread, &fdwrite, &fdexcep, &maxfd);

    if (mc != CURLM_OK) {
        std::cerr << "curl_multi_fdset() failed, code " << mc << "." << std::endl;
    }

    if (maxfd == -1) {
        std::this_thread::sleep_for(std::chrono::milliseconds(100));
    }

    int rc = maxfd != -1 ? select(maxfd + 1, &fdread, &fdwrite, &fdexcep, &timeout) : 0;
    return rc;
}

void multi_loop(CURLM* multi_handle)
{
    int still_running = 0;

    curl_multi_perform(multi_handle, &still_running);

    while (still_running) {
        struct timeval timeout = get_timeout(multi_handle);

        auto rc = wait_if_needed(multi_handle, timeout);

        if (rc >= 0)
        {
            curl_multi_perform(multi_handle, &still_running);
        }
    }
}

int main(void)
{
    std::list<EasyHandle> handles(1);
    MultiHandle multi_handle;

    multi_handle = CreateMultiHandle();
    std::for_each(handles.begin(), handles.end(), [](auto& handle) {handle = CreateEasyHandle(); });

    std::for_each(handles.begin(), handles.end(), [](auto& handle) 
    {
        static std::ofstream file("sandbox.map", std::ios::binary);
        curl_easy_setopt(handle.get(), CURLOPT_URL, "https://api.zgaf.io/api_v1/maps/13/file");
        curl_easy_setopt(handle.get(), CURLOPT_WRITEFUNCTION, write_to_file);
        curl_easy_setopt(handle.get(), CURLOPT_WRITEDATA, &file);
    });

    std::for_each(handles.begin(), handles.end(), [&multi_handle](auto& handle) {curl_multi_add_handle(multi_handle.get(), handle.get()); });
    
    multi_loop(multi_handle.get());
    
    std::for_each(handles.begin(), handles.end(), [&multi_handle](auto& handle) {curl_multi_remove_handle(multi_handle.get(), handle.get()); });

    return 0;
}