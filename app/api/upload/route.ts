import { NextRequest, NextResponse } from 'next/server';
import PDFParser from 'pdf2json';

// 强制使用 Node.js 环境
export const runtime = 'nodejs';

// 这是一个 helper 函数，用于将回调式的 pdf2json 封装成 Promise
function parsePDF(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    // 初始化解析器
    const pdfParser = new (PDFParser as any)(null, 1);

    // 错误处理
    pdfParser.on("pdfParser_dataError", (errData: any) => {
      reject(new Error(`PDF2JSON Parsing Error: ${errData.parserError}`));
    });

    // 数据就绪，返回文本
    pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
      resolve(pdfParser.getRawTextContent());
    });
    
    // 开始解析 Buffer
    pdfParser.parseBuffer(buffer);
  });
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) return NextResponse.json({ error: 'No file' });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 调用新的解析器
    const fullText = await parsePDF(buffer);

    console.log("✅ PDF2JSON 最终解析成功! 字数:", fullText.length);
    
    // 返回成功文本
    return NextResponse.json({ text: fullText });

  } catch (error: any) {
    console.error("❌ PDF2JSON 最终解析失败:", error.message);
    
    return NextResponse.json({ 
      text: `【系统提示】\nPDF 解析失败，请检查文件格式是否为标准文字版。\n具体错误：${error.message}\n\n但这不影响聊天功能。` 
    });
  }
}