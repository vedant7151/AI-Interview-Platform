import { readDataStream } from "ai"; // or consumeStream

async function parse() {
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue('data: {"type":"data-questionId","id":"123","data":{"questionId":"123"}}\n\n');
      controller.enqueue('data: {"type":"text-delta","delta":"Hello"}\n\n');
      controller.enqueue('data: [DONE]\n\n');
      controller.close();
    }
  });

  const response = new Response(stream, { headers: { 'content-type': 'text/event-stream' } });
  
  const chunks = [];
  try {
    for await (const chunk of readDataStream(response.body)) {
      chunks.push(chunk);
    }
    console.log("CHUNKS: ", JSON.stringify(chunks));
  } catch (e) {
    console.error("ERROR:", e.message);
  }
}

parse();
