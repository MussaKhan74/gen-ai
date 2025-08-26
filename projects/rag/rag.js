/**
 * implementation of plan
 * Stage 1: Indexing
 * 1. Load the document - pdf, text - Complete
 * 2. Chunk the document - Complete
 * 3. Generate vector embeddings
 * 4. Store the embeddings in a vector database
 *
 * Stage 2: Using the chatbot
 * 1. Setup LLM
 * 2. Add Retrieval Step
 * 3. Pass input + Relevant information to LLM
 * 4. Get the response
 */

import { indexTheDocument } from "./prepare";

const filePath = "./cg-internal-docs.pdf";
indexTheDocument(filePath);
