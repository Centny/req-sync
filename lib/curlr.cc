/**
 @author:Centny
 **/
#include <nan.h>
#include <curl/curl.h>
#include <string>
#include <string.h>
#include <vector>
#include <stdint.h>
#include <iostream>

using namespace node;
using namespace v8;

#define CL_THROW(e) NanThrowTypeError(e)

static size_t cl_write_data(void *ptr, size_t size, size_t nmemb, void *userdata) {
    std::string* str = dynamic_cast<std::string*>((std::string *)userdata);
    if(NULL == str){
        return -1;
    }
    str->append((char*)ptr, size * nmemb);
    return nmemb;
}

static size_t cl_write_headers(void *ptr, size_t size, size_t nmemb, void *userdata) {
    std::vector<std::string>* headers=dynamic_cast<std::vector<std::string>*>((std::vector<std::string>*)userdata);;
    headers->push_back(std::string(static_cast<char*>(ptr), size * nmemb));
    return size * nmemb;
}
static NAN_METHOD(R) {
    NanScope();
    Local<String> K_method = NanNew<String>("method");
    Local<String> K_url = NanNew<String>("url");
    Local<String> K_headers = NanNew<String>("headers");
    Local<String> K_margs = NanNew<String>("margs");
    Local<String> K_mfs = NanNew<String>("mfs");
    Local<String> K_timeout = NanNew<String>("timeout");
    Local<String> K_timeout_c = NanNew<String>("timeout_c");
    Local<String> K_body = NanNew<String>("body");
    Local<String> K_err = NanNew<String>("err");
    Local<String> K_length = NanNew<String>("length");
    Local<String> K_data = NanNew<String>("data");
    Local<String> K_cookie = NanNew<String>("cookie");
    //
    if (args.Length() < 1) {
        return CL_THROW("CurlR arguments is empty");
    }
    Local<Object> opt = Local<Object>::Cast(args[0]);
    if (!opt->Has(K_method) || !opt->Has(K_url) || !opt->Has(K_margs) || !opt->Has(K_headers) || !opt->Has(K_mfs)) {
        return CL_THROW("method or url or margs or headers or mfs is not setted");
    }
    if (!opt->Get(K_margs)->IsObject() || !opt->Get(K_headers)->IsObject()){
        return CL_THROW("args or headers is not object");
    }
    if (!opt->Get(K_method)->IsString() || !opt->Get(K_url)->IsString()) {
        return CL_THROW("method or url is not string");
    }
    Local<String> method = Local<String>::Cast(opt->Get(K_method));
    Local<String> url = Local<String>::Cast(opt->Get(K_url));
    Local<Array> reqh = Local<Array>::Cast(opt->Get(K_headers));
    Local<Object> reqa = Local<Object>::Cast(opt->Get(K_margs));
    Local<Array> reqa_k = reqa->GetOwnPropertyNames();
    Local<Object> reqf = Local<Object>::Cast(opt->Get(K_mfs));
    Local<Array> reqf_k = reqf->GetOwnPropertyNames();
    Local<String> body = NanNew<String>((const char*) "", 0);
    Local<String> cookie = NanNew<String>((const char*) "", 0);
    long timeout_c = 1 * 60 * 60 * 1000; /* 1 hr in msec */
    long timeout = 1 * 60 * 60 * 1000; /* 1 hr in msec */
    
    if (opt->Has(K_body) && opt->Get(K_body)->IsString()) {
        body = opt->Get(K_body)->ToString();
    }
    if (opt->Has(K_timeout_c) && opt->Get(K_timeout_c)->IsNumber()) {
        timeout_c = opt->Get(K_timeout_c)->IntegerValue();
    }
    if (opt->Has(K_timeout) && opt->Get(K_timeout)->IsNumber()) {
        timeout = opt->Get(K_timeout)->IntegerValue();
    }
    if (opt->Has(K_cookie) && opt->Get(K_cookie)->IsString()) {
        cookie = opt->Get(K_cookie)->ToString();
    }
    NanUtf8String body_(body);
    NanUtf8String method_(method);
    NanUtf8String url_(url);
    NanUtf8String cookie_(cookie);
    CURL *curl;
    std::string ret_b;
    std::vector<std::string> ret_h;
    CURLcode res = CURLE_FAILED_INIT;
    curl = curl_easy_init();
    if (curl) {
        // curl_easy_setopt(curl, CURLOPT_VERBOSE, 1L);
        // curl_easy_setopt(curl, CURLOPT_ERRORBUFFER, error_buffer);
        curl_easy_setopt(curl, CURLOPT_CUSTOMREQUEST, *method_);
        curl_easy_setopt(curl, CURLOPT_FOLLOWLOCATION, 1);
        curl_easy_setopt(curl, CURLOPT_MAXREDIRS, 5);
        curl_easy_setopt(curl, CURLOPT_URL, *url_);
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, cl_write_data);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, &ret_b);
        curl_easy_setopt(curl, CURLOPT_HEADERFUNCTION, cl_write_headers);
        curl_easy_setopt(curl, CURLOPT_HEADERDATA, &ret_h);
        curl_easy_setopt(curl, CURLOPT_CONNECTTIMEOUT_MS,timeout_c);
        curl_easy_setopt(curl, CURLOPT_TIMEOUT_MS, timeout);
        curl_easy_setopt(curl, CURLOPT_SSL_VERIFYPEER, 0L);
        curl_easy_setopt(curl, CURLOPT_SSL_VERIFYHOST, 0L);
        struct curl_slist *reqh_l = NULL;
        for (uint32_t i = 0; i < reqh->Length(); ++i) {
            reqh_l = curl_slist_append(reqh_l, *NanUtf8String(reqh->Get(i)));
        }
        curl_easy_setopt(curl, CURLOPT_HTTPHEADER, reqh_l);
        struct curl_httppost *form_l = 0;
        struct curl_httppost *form_l_e  = 0;
        if (body_.length() > 0) {
            curl_easy_setopt(curl, CURLOPT_POSTFIELDS, *body_);
            curl_easy_setopt(curl, CURLOPT_POSTFIELDSIZE, (curl_off_t)body_.length());
        }else if(reqa_k->Length()>0 || reqf_k->Length()>0){
            for (uint32_t i = 0; i < reqa_k->Length(); ++i) {
                curl_formadd(&form_l, &form_l_e, CURLFORM_COPYNAME, *NanUtf8String(reqa_k->Get(i)), CURLFORM_COPYCONTENTS, *NanUtf8String(reqa->Get(reqa_k->Get(i))) , CURLFORM_END);
            }
            for (uint32_t i = 0; i < reqf_k->Length(); ++i) {
                curl_formadd(&form_l, &form_l_e, CURLFORM_COPYNAME, *NanUtf8String(reqf_k->Get(i)), CURLFORM_FILE, *NanUtf8String(reqf->Get(reqf_k->Get(i))) , CURLFORM_END);
            }
            curl_easy_setopt(curl, CURLOPT_HTTPPOST, form_l);
        }
        if(cookie_.length()>0){
            curl_easy_setopt(curl, CURLOPT_COOKIEJAR, *cookie_);
            curl_easy_setopt(curl, CURLOPT_COOKIEFILE, *cookie_);
        }
        res = curl_easy_perform(curl);
        curl_slist_free_all(reqh_l);
        curl_formfree(form_l_e);
        curl_easy_cleanup(curl);
    }
    Local<Object> result = NanNew<Object>();
    if (res==CURLE_OK) {
        result->Set(NanNew(K_length),NanNew<Integer>((int32_t) ret_b.size()));
        Local<Array> res_h = NanNew<Array>();
        for (uint32_t i = 0; i < ret_h.size(); ++i) {
            res_h->Set(i, NanNew<String>(ret_h[i].c_str()));
        }
        result->Set(K_headers, res_h);
        result->Set(K_data, NanNew<String>(ret_b.c_str()));
    } else if (res == CURLE_OPERATION_TIMEDOUT) {
        result->Set(K_timeout, NanNew<Integer>(1));
    } else {
        result->Set(NanNew(K_err), NanNew<String>(curl_easy_strerror(res)));
    }
    NanReturnValue(result);
}

static void init(Handle<Object> target) {
    Local<String> CL_NAME = NanNew<String>("CurlR");
    target->Set(CL_NAME,  NanNew<FunctionTemplate>(R)->GetFunction());
}
extern "C" {
    NODE_MODULE(curlr, init);
}

