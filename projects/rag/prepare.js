import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export async function indexTheDocument(filepath) {
    const loader = new PDFLoader(filepath, { splitPages: false });
    const doc = await loader.load();

    // console.log(doc[0].pageContent);

    // better to keep chunksize 500 and overlap 100

    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 500,
        chunkOverlap: 100,
    });

    const texts = await textSplitter.splitText(doc[0].pageContent);
    console.log("text", texts);
}
