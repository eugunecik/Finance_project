import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';
import type { ChatCompletionContentPart } from 'openai/resources/chat/completions';
import * as fs from 'fs';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OpenAIService {
  private openaiClient: OpenAI;

  constructor(private readonly configService: ConfigService) {
    this.openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async parseReceiptFromImage(imageUrl: string) {
    try {
     
      const urlParts = imageUrl.split('/');
      const filename = urlParts[urlParts.length - 1];
      
    
      const uploadsPath = path.join(process.cwd(), 'uploads', 'photos');
      const filePath = path.join(uploadsPath, filename);
      
     
      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      }
     
      const imageBuffer = fs.readFileSync(filePath);
      const base64Image = imageBuffer.toString('base64');
      
      
      const fileExtension = path.extname(filename).toLowerCase();
      let mimeType = 'image/jpeg'; 
      
      if (fileExtension === '.png') {
        mimeType = 'image/png';
      } else if (fileExtension === '.gif') {
        mimeType = 'image/gif';
      } else if (fileExtension === '.webp') {
        mimeType = 'image/webp';
      }
      
      
      const messages: ChatCompletionContentPart[] = [
        { 
          type: "text", 
          text: `Parse details from the receipt image and return as JSON in the following format:
          {
            "receipt": {
              "expenses_attributes": [
                {
                  "name": "item name",
                  "amount": 1.3,
                  "category": "category name"
                }
              ],
              "merchant": "store name",
              "purchased_at": "2025-03-20T00:00:00Z"
            },
            "error": null
          }
          
          Notes:
          -be careful with prices it coud be 5.55 not only 5000
          - purchased_at should be in ISO 8601 format
          - If you can't parse the receipt, set error to a descriptive message`
        },
        { 
          type: "image_url", 
          image_url: { 
            url: `data:${mimeType};base64,${base64Image}`
          } 
        }
      ];

      const response = await this.openaiClient.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: messages }],
        response_format: {
          type: "json_object"
        }
      });

      const content = response.choices[0].message.content;
      if (content === null) {
        throw new Error("OpenAI returned null content");
      }
      
      const parsedContent = JSON.parse(content);
      
     
      if (!parsedContent.receipt || !parsedContent.receipt.merchant) {
        return {
          receipt: null,
          error: "Failed to parse receipt details from image"
        };
      }
      
      return parsedContent;
    } catch (error) {
      console.error('Error parsing receipt from image:', error);
      return {
        receipt: null,
        error: error.message || 'Failed to parse receipt image'
      };
    }
  }
}