import Editor from "@monaco-editor/react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import API from "../services/api";

function CodeEditor() {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("cpp");

  // 🔥 Language Config
  const languages = {
    cpp: {
      id: 54,
      defaultCode: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello from C++";
    return 0;
}`
    },
    c: {
      id: 50,
      defaultCode: `#include <stdio.h>

int main() {
    printf("Hello from C");
    return 0;
}`
    },
    java: {
      id: 62,
      defaultCode: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello from Java");
    }
}`
    },
    python: {
      id: 71,
      defaultCode: `print("Hello from Python")`
    }
  };

  // Load default code on language change
  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setCode(languages[lang].defaultCode);
  };

  // 🔥 RUN CODE (MAIN FUNCTION)
  const runCode = async () => {
    try {
      const res = await API.post("/submissions/run", {
        code: code,
        language_id: languages[language].id
      });

      setOutput(res.data.output || res.data.error || "No Output");

    } catch (err) {
      console.log(err.response?.data);
      setOutput("Error running code ❌");
    }
  };

  // Dummy Question (can connect DB later)
  const question = `
# Two Sum

Given an array, find two numbers that add up to target.

### Example:
Input: [2,7,11,15], target=9  
Output: [0,1]
`;

  return (
    <div className="h-screen flex bg-black text-white">

      {/* LEFT SIDE - QUESTION */}
      <div className="w-1/2 border-r border-gray-800 p-6 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-blue-400">
          📘 Problem
        </h2>

        <div className="bg-gray-900 p-4 rounded-xl">
          <ReactMarkdown>{question}</ReactMarkdown>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-1/2 flex flex-col">

        {/* Top Bar */}
        <div className="flex justify-between items-center p-3 bg-gray-900 border-b border-gray-800">
          <h2 className="text-lg font-semibold">💻 Code Editor</h2>

          <select
            className="bg-gray-800 p-2 rounded"
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
          >
            <option value="cpp">C++</option>
            <option value="c">C</option>
            <option value="java">Java</option>
            <option value="python">Python</option>
          </select>
        </div>

        {/* Monaco Editor */}
        <Editor
          height="60%"
          theme="vs-dark"
          language={language === "cpp" ? "cpp" : language}
          value={code}
          onChange={(value) => setCode(value)}
        />

        {/* Run Button */}
        <div className="p-3">
          <button
            onClick={runCode}
            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
          >
            ▶ Run Code
          </button>
        </div>

        {/* Output Panel */}
        <div className="flex-1 bg-gray-900 p-4 border-t border-gray-800 overflow-auto">
          <h3 className="text-blue-400 mb-2">Output:</h3>
          <pre>{output}</pre>
        </div>

      </div>
    </div>
  );
}

export default CodeEditor;