"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import {useSocket} from "../lib/SocketContext";
import { Suspense } from "react";

interface t{
src:string,
msg:string,
username:string|null
}
function ChatBox({ allMsg }: { allMsg: t[]}) {
  return (
    <>
      {allMsg.map((msg, i) => {
        const isSender = msg?.src === "sender";
        const alignment = isSender ? "justify-start" : "justify-end";
        const bgColor = isSender ? "bg-blue-500 text-white" : "bg-gray-200 text-black";

        return (
          <div key={`${isSender ? "s" : "r"}-${i}`} className={`flex ${alignment} my-1`}>
            <div className={`${bgColor} rounded-2xl px-4 py-2 max-w-[50%] break-words`}>
              <div className="font-semibold">{msg?.username}</div>
              <div>{msg?.msg}</div>
            </div>
          </div>
        );
      })}
    </>
  );
}

 function ChatRoom() {
  const [input, setInput] = useState("");
  const [allMsg, setallMsg] = useState<t[]>([]);
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const searchParams=useSearchParams();
  const user=searchParams.get("user");
  const code:number=parseInt(searchParams.get("code")||'0');
  const ws=useSocket();


useEffect(() => {
  if (!ws) return;
  ws.onmessage = (e) => {
    try {
      const data = JSON.parse(e.data);
      if (data.msg) {
        setallMsg((prev) => [...prev, { src: "rec", msg: data.msg,username:data.username}]);
      }
    } catch (err) {
      console.error("Invalid message", err);
    }
  };
}, [ws]);
  const sendMessage = () => { 
  if(!ws) return;
      if(input==='') return;
     setallMsg((prev) => [...prev, { src: "sender", msg: input,username:user}]);
     ws.send(JSON.stringify({
        type:"message",
        code:code,
        msg:input,
        username:user
     }))
     setInput("");
  }

  useEffect(() => {
    const chatBox = chatBoxRef.current;
    if (chatBox) {
      chatBox.scrollTo({
        top: chatBox.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [allMsg]);

  return (
    <div className="min-h-screen  flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-xl w-full max-w-lg text-white flex flex-col gap-4 
      hover:shadow-indigo-700 transition duration-200
      ">
        {/* Chat Messages Area */}
        <div
          ref={chatBoxRef}
          className="h-110 overflow-y-auto bg-white/5 rounded-xl p-3 space-y-2 scrollbar-thin scrollbar-thumb-white/50 scrollbar-track-white/10 "
        >
          {allMsg.length === 0 && (
            <p className="text-gray-300">Say Hii.. </p>
          )}
          {<ChatBox allMsg={allMsg} />}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 p-2 rounded-xl bg-white/20 text-white placeholder-white/60 focus:outline-none"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 hover:bg-blue-600 transition px-4 py-2 rounded-xl"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PageWrapper() {
  return (
    <Suspense fallback={<div>Loading chat...</div>}>
      <ChatRoom />
    </Suspense>
  );
}
