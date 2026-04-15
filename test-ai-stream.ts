import { createUIMessageStream, createUIMessageStreamResponse } from "ai";

const stream = createUIMessageStream({
  execute: async ({ writer }) => {
    writer.write({
      type: "data-questionId",
      id: "question-id",
      data: { questionId: "123" },
    } as any);
    writer.merge(
      (async function* () {
        yield "Hello";
        yield " world!";
      })() as any
    );
  },
});

const res = createUIMessageStreamResponse({ stream });
res.text().then(text => console.log(text));
