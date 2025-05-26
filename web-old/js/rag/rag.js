
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { v4 as uuidv4 } from 'uuid';
import { sql } from './db.js';
import dotenv from 'dotenv';


// https://github.com/TheFisola/rag-poc/blob/master/index.js


export function getContextBasedOnQuestion(question) {

}

export function addContext() {
    // Convert context text to chunks, chunks converted to emebeddings and this is saved to the DB

    // import { sql } from "./connect.js"

    // let scenarioValue = 1
    // if (process.argv.length == 3) {
    //     scenarioValue = process.argv[2]
    // }
    
    
    // async function upload() {
    //     try {
    //         await sql.file(`../scenario/scenario_${scenarioValue}.sql`);
    //         console.log("Uploaded Scenario");
    //         process.exit(0);
    //     } catch (error) {
    //         console.error("Error uploading scenario:", error);
    //         process.exit(1);
    //     }
    // }
    
    // upload()
}


// Extract content from a website
async function fetchWebsiteContent(url) {
    try {
      console.log(`Fetching content from ${url}...`);
      const loader = new CheerioWebBaseLoader(url);
      const docs = await loader.load();
      
      console.log(`Successfully fetched ${docs.length} document(s).`);
      return docs;
    } catch (error) {
      console.error(`Error fetching content from ${url}:`, error);
      throw error;
    }
  }

  // Split content into chunks
async function splitContentIntoChunks(docs) {
    try {
      console.log("Splitting content into chunks...");
      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: CHUNK_SIZE,
        chunkOverlap: CHUNK_OVERLAP,
      });
      
      const chunks = await splitter.splitDocuments(docs);
      console.log(`Created ${chunks.length} chunks.`);
      return chunks;
    } catch (error) {
      console.error("Error splitting content:", error);
      throw error;
    }
  }

  // Generate embeddings for chunks
async function generateEmbeddings(chunks) {
    try {
      console.log("Generating embeddings...");
      const embeddings = new OpenAIEmbeddings({
        openAIApiKey: OPENAI_API_KEY,
        modelName: "text-embedding-ada-002", // Change this if you use a different model
      });
      
      const results = [];
      
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        const embedding = await embeddings.embedQuery(chunk.pageContent);
        
        results.push({
          id: uuidv4(),
          content: chunk.pageContent,
          metadata: JSON.stringify(chunk.metadata),
          embedding: embedding
        });
        
        console.log(`Generated embedding for chunk ${i + 1}/${chunks.length}`);
      }
      
      return results;
    } catch (error) {
      console.error("Error generating embeddings:", error);
      throw error;
    }
  }

  // Save embeddings to database
async function saveEmbeddingsToDatabase(embeddedChunks) {
    try {
      console.log("Saving embeddings to database...");
      
      for (const chunk of embeddedChunks) {
        await sql`
          INSERT INTO ${sql(TABLE_NAME)} (id, content, metadata, embedding)
          VALUES (
            ${chunk.id},
            ${chunk.content},
            ${chunk.metadata}::jsonb,
            ${chunk.embedding}
          )
        `;
      }
      
      console.log(`Successfully saved ${embeddedChunks.length} embeddings to database.`);
    } catch (error) {
      console.error("Error saving embeddings to database:", error);
      throw error;
    }
  }

  // Main function
async function processWebsiteToDatabase(url) {
    try {
      // Make sure the table exists
      await ensureTableExists();
      
      // Fetch content from website
      const docs = await fetchWebsiteContent(url);
      
      // Split content into chunks
      const chunks = await splitContentIntoChunks(docs);
      
      // Generate embeddings for chunks
      const embeddedChunks = await generateEmbeddings(chunks);
      
      // Save embeddings to database
      await saveEmbeddingsToDatabase(embeddedChunks);
      
      console.log("Website content processed and stored successfully!");
    } catch (error) {
      console.error("Error processing website:", error);
    } finally {
      // Close the database connection
      await sql.end();
    }
  }
  
  // Execute the script with the provided URL
  const websiteUrl = process.argv[2];
  
  if (!websiteUrl) {
    console.error("Please provide a website URL. Usage: node script.js https://example.com");
    process.exit(1);
  }
  
  // Process the website
  processWebsiteToDatabase(websiteUrl).catch(console.error);