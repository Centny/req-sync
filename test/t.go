package main

import (
	"fmt"
	"github.com/Centny/gwf/routing"
	"net/http"
)

func Set(hs *routing.HTTPSession) routing.HResult {
	hs.SetVal("kvs", hs.CheckVal("val"))
	return hs.MsgRes("OK")
}
func Get(hs *routing.HTTPSession) routing.HResult {
	return hs.MsgRes(hs.StrVal("kvs"))
}
func main() {
	sb := routing.NewSrvSessionBuilder("", "/", "xx", 30*60*1000, 10000)
	mux := routing.NewSessionMux("", sb)
	mux.HFunc("^/set.*$", Set)
	mux.HFunc("^/get.*$", Get)
	s := http.Server{Addr: ":8334", Handler: mux}
	fmt.Println(s.ListenAndServe())
}
