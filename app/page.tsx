"use client";
import { useRouter } from "next/navigation";
import { useSocket } from "./lib/SocketContext";
import { useEffect, useState } from "react";

function Timer({ user, code }: { user: string; code: number | undefined }) {
  const router = useRouter();
  const [count, setCount] = useState<number>(5);

  useEffect(() => {
    if (count === 0) {
      // console.log(user);
      //console.log(code);
      router.push(`/ChatRoom?user=${user}&code=${code}`);
      return;
    }

    const timer = setTimeout(() => {
      setCount((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [count, router, user, code]);

  return <div className="mt-4">You are joined in {count} second</div>;
}
function CreateRoom() {
  const [flag, setflag] = useState<boolean>(false);
  const [user, setuser] = useState<string>("");
  const [code, setcode] = useState<number>();
  const wss = useSocket();
  function createCode() {
    if (!wss) return;
    if (wss.readyState === WebSocket.OPEN) {
      wss.send(
        JSON.stringify({
          username: user,
          type: "create",
        })
      );
    } else {
      wss.onopen = () => {
        wss.send(
          JSON.stringify({
            username: user,
            type: "create",
          })
        );
      };
    }
    
        wss.onmessage = (e) => {
      setflag(true);
      try {
        setcode(parseInt(e.data)); // assuming server sends { code: 1234 }
      } catch {
        setcode(parseInt(e.data)); // fallback if it's just raw code
      }
    }

}
  return (
    <div className="flex justify-center mt-10">
      <div className="w-80 p-6 bg-white/10 backdrop-blur-md rounded-xl shadow-lg text-white">
        <label className="block text-sm font-medium text-white/80 mb-1">
          Username:
        </label>
        <input
          type="text"
          placeholder="Enter your username"
          value={user}
          onChange={(e) => setuser(e.target.value)}
          className="w-full px-3 py-1 rounded-md bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        />
        {!flag && (
          <button
            className="bg-blue-600 p-2 rounded-xl mt-3 ml-25 hover:bg-blue-800 hover:scale-105 transition duration-200
        cursor-pointer"
            onClick={createCode}
          >
            Create
          </button>
        )}
        {flag && <Timer user={user} code={code} />}
        {flag && <span>code: {code}</span>}
      </div>
    </div>
  );
}

function JoinRoom() {
  const [user, setuser] = useState<string>("");
  const [code, setcode] = useState<string>("");
  const [flag, setflag] = useState(false);
  const [err, sererr] = useState(false);
  const ws = useSocket();

  function join() {
    if (!ws) return;
    if(ws.readyState===WebSocket.OPEN){
       ws.send(
        JSON.stringify({
          type: "join",
          code: parseInt(code),
          username: user,
        })
      );
    }
    else{
    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join",
          code: parseInt(code),
          username: user,
        })
      );
    };
  }
    ws.onmessage = (e) => {
      sererr(true);
    };
    setflag(true);
  }
  return (
    <div className="flex justify-center mt-10">
      <div className="w-80 p-6 bg-white/10 backdrop-blur-md rounded-xl shadow-lg text-white">
        <label className="block text-sm font-medium text-white/80 mb-1">
          Username:
        </label>
        <input
          type="text"
          placeholder="Enter your username"
          value={user}
          onChange={(e) => setuser(e.target.value)}
          className="w-full px-3 py-1 rounded-md bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        />
        <label className="block text-sm font-medium text-white/80 mb-1 mt-4">
          Code:
        </label>
        <input
          type="text"
          placeholder="Enter code"
          value={code}
          onChange={(e) => {
            setcode(e.target.value);
          }}
          className="w-full px-3 py-1 rounded-md bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        />
        {!flag && (
          <button
            onClick={join}
            className="bg-blue-600 p-2 px-4 rounded-xl mt-3 ml-25 hover:bg-blue-800 hover:scale-105 transition duration-200
        cursor-pointer
        "
          >
            Join
          </button>
        )}
        {flag && !err ? (
          <Timer user={user} code={parseInt(code)} />
        ) : (
          err && <div>invalid code....</div>
        )}
      </div>
    </div>
  );
}

function Page() {
  const [create, setcreate] = useState(false);
  const [join, setjoin] = useState(false);

  return (
    <>
      <div className=" mt-20 flex justify-center items-center">
        <div className="flex flex-col sm:flex-row gap-6">
          <div
            className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-6 text-white text-center cursor-pointer hover:bg-indigo-500/20 transition-all duration-300 w-64"
            onClick={() => {
              setcreate(true);
              setjoin(false);
            }}
          >
            <h2 className="text-xl font-semibold mb-2">Create Chat Room</h2>
            <p className="text-sm text-gray-300">
              Start your own private chat space.
            </p>
          </div>

          <div
            className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-6 text-white text-center cursor-pointer hover:bg-purple-500/20 transition-all duration-300 w-64"
            onClick={() => {
              setcreate(false);
              setjoin(true);
            }}
          >
            <h2 className="text-xl font-semibold mb-2">Join Chat Room</h2>
            <p className="text-sm text-gray-300">
              Enter an existing room with a code.
            </p>
          </div>
        </div>
      </div>
      {create && <CreateRoom />}
      {join && <JoinRoom />}
    </>
  );
}

export default Page;
