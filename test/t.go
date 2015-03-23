package main

import (
	"fmt"
	"github.com/Centny/gwf/routing"
	"net/http"
)

func U(hs *routing.HTTPSession) routing.HResult {
	hs.R.ParseMultipartForm(102400)
	_, _, err := hs.R.FormFile("file")
	if err != nil {
		hs.MsgResErr2(1, "arg-err", err)
	}
	fmt.Println(hs.R.Header)
	return hs.MsgRes("OK")
}
func T(hs *routing.HTTPSession) routing.HResult {
	hs.R.ParseForm()
	mv := map[string]interface{}{}
	for k, v := range hs.R.PostForm {
		mv[k] = v
	}
	for k, v := range hs.R.Form {
		mv[k] = v
	}
	return hs.MsgRes(mv)
}
func Set(hs *routing.HTTPSession) routing.HResult {
	hs.SetVal("kvs", hs.CheckVal("val"))
	fmt.Println(hs.R.Header)
	return hs.MsgRes("OK")
}
func Get(hs *routing.HTTPSession) routing.HResult {
	return hs.MsgRes(hs.StrVal("kvs"))
}
func main() {
	sb := routing.NewSrvSessionBuilder("", "/", "xx", 30*60*1000, 10000)
	mux := routing.NewSessionMux("", sb)
	mux.HFunc("^/t.*$", T)
	mux.HFunc("^/u.*$", U)
	mux.HFunc("^/set.*$", Set)
	mux.HFunc("^/get.*$", Get)
	s := http.Server{Addr: ":8334", Handler: mux}
	fmt.Println(s.ListenAndServe())
}
