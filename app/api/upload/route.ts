import { NextRequest, NextResponse } from 'next/server';

// 强制使用 Node.js 环境
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: '没有文件' }, { status: 400 });
    }

    // 1. 转换文件格式
    const arrayBuffer = await file.arrayBuffer();

    // 2. 动态加载官方 PDF 引擎 (pdfjs-dist)
    // 这里使用 standard 引用方式，配合 next.js 配置
    const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');

    // 3. 读取 PDF
    const loadingTask = pdfjs.getDocument(arrayBuffer);
    const pdfDocument = await loadingTask.promise;

    // 4. 逐页提取文字
    let fullText = '';
    for (let i = 1; i <= pdfDocument.numPages; i++) {
      const page = await pdfDocument.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      fullText += pageText + '\n';
    }

    console.log("✅ 官方引擎解析成功! 页数:", pdfDocument.numPages);
    return NextResponse.json({ text: fullText });

  } catch (error: any) {
    console.error("❌ 解析失败:", error);
    // 只要不崩，能聊天就行
    return NextResponse.json({ 
      text: `【系统提示】\nPDF 解析遇到了一点小问题 (${error.message})。\n但这不影响聊天，你可以直接问我通用问题，或者把文字复制给我。` 
    });
  }
}