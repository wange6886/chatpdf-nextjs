'use client';

import { useChat } from 'ai/react';
import { useState } from 'react';

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit, setMessages } = useChat();
  
  // 用来存 PDF 的文字内容
  const [pdfText, setPdfText] = useState("");
  // 用来存 PDF 的预览地址
  const [pdfUrl, setPdfUrl] = useState("");
  // 上传状态
  const [isLoading, setIsLoading] = useState(false);

  // 当用户选择文件时触发
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);

    // 1. 本地预览：创建一个临时的 URL 给 iframe 用
    const url = URL.createObjectURL(file);
    setPdfUrl(url);

    // 2. 偷偷上传给后台，让它提取文字
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      
      if (data.text) {
        setPdfText(data.text);
        // 给 AI 发一个系统提示，告诉它这是刚才上传的文档
        setMessages([
          {
            id: 'system-1',
            role: 'system',
            content: `你是一个文档助手。用户刚刚上传了一个文档，内容如下：\n\n${data.text}\n\n请根据以上内容回答用户的问题。`
          },
          {
            id: 'ai-welcome',
            role: 'assistant',
            content: '文档已上传并读取成功！现在你可以问我关于它的问题了。'
          }
        ]);
      }
    } catch (error) {
      alert("读取 PDF 失败，请重试");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* 左侧：PDF 区域 */}
      <div style={{ width: '50%', backgroundColor: '#f3f4f6', borderRight: '1px solid #ccc', display: 'flex', flexDirection: 'column' }}>
        
        {/* 上传按钮条 */}
        <div style={{ padding: '15px', backgroundColor: 'white', borderBottom: '1px solid #ddd', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input 
            type="file" 
            accept=".pdf"
            onChange={handleFileChange}
            style={{ fontSize: '14px' }}
          />
          {isLoading && <span style={{ color: 'blue', fontSize: '14px' }}>正在读取文字...</span>}
        </div>

        {/* PDF 预览区 */}
        <div style={{ flex: 1, backgroundColor: '#525659' }}>
          {pdfUrl ? (
            <iframe 
              src={pdfUrl} 
              style={{ width: '100%', height: '100%', border: 'none' }} 
            />
          ) : (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>
              请在上方上传 PDF 文件
            </div>
          )}
        </div>
      </div>

      {/* 右侧：AI 聊天区域 */}
      <div style={{ width: '50%', display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {messages.length === 0 && !pdfText && (
            <div style={{ color: '#888', textAlign: 'center', marginTop: '20%' }}>
              👈 请先在左侧上传一个 PDF
            </div>
          )}
          
          {messages.map(m => (
            m.role !== 'system' && ( // 不显示系统提示语
              <div key={m.id} style={{ marginBottom: '15px', textAlign: m.role === 'user' ? 'right' : 'left' }}>
                <span style={{ 
                  display: 'inline-block', 
                  padding: '10px 15px', 
                  borderRadius: '10px', 
                  backgroundColor: m.role === 'user' ? '#007bff' : '#e9ecef',
                  color: m.role === 'user' ? 'white' : 'black',
                  maxWidth: '80%',
                  lineHeight: '1.6'
                }}>
                  {m.content}
                </span>
              </div>
            )
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '20px', borderTop: '1px solid #eee', display: 'flex' }}>
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="问问关于文档的事..."
            style={{ flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ccc', marginRight: '10px', color: 'black' }}
            disabled={!pdfText} // 没传文件时不让发消息
          />
          <button 
            type="submit" 
            disabled={!pdfText}
            style={{ 
              padding: '10px 20px', 
              backgroundColor: pdfText ? '#007bff' : '#ccc', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: pdfText ? 'pointer' : 'not-allowed' 
            }}>
            发送
          </button>
        </form>
      </div>
    </div>
  );
}