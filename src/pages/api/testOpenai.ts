import { Configuration, OpenAIApi } from "openai";
import { env } from "~/env.mjs";

export default async function handler() {
  const configuration = new Configuration({
    organization: "org-v62k2CvNV5MHgdDqgZLbNlHt",
    apiKey: env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(configuration);

  const completion = await openai
    .createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          content: "Hello, I am a chatbot. How are you?",
          role: "user",
        },
      ],
    })
    .catch((err) => {
      console.log(err);
    });

  return {
    statusCode: 200,
    body: JSON.stringify(completion),
  };
}
