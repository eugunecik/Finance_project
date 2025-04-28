import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class GeminiService {
  private readonly genAI: GoogleGenerativeAI;
  private readonly model: any;

  constructor(
    private readonly configService: ConfigService,
    private readonly categoriesService: CategoriesService,
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined in configuration');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: { responseMimeType: 'application/json' },
    });
  }

  async parseReceiptFromImage(imageUrl: string, userId?: number) {
    try {
      
      const categories = await this.categoriesService.getAllCategories();
      const categoryNames = categories.map((cat) => cat.name).join(', ');

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
      if (fileExtension === '.png') mimeType = 'image/png';
      else if (fileExtension === '.gif') mimeType = 'image/gif';
      else if (fileExtension === '.webp') mimeType = 'image/webp';

      const prompt = `Parse details from the receipt image and return as JSON in the following format:
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
      - Be careful with prices, it could be 5.55, not only 5000.
      - purchased_at should be in ISO 8601 format.
      - For the "category" field, choose an appropriate category from the following list: [${categoryNames}].
      - If none of the existing categories are suitable, create a new category that logically matches the item. Examples:
        - Cleaning products (e.g., "Tide", "detergent") → "Household"
        - Clothing or footwear (e.g., "sandals") → "Clothing"
        - Kitchenware (e.g., "bowl", "serving bowl") → "Kitchen"
        - Snacks or sweets (e.g., "candy", "Nutella") → "Food"
        - Beverages (e.g., "soda", "Paloma") → "Beverage"
        - General grocery items (e.g., "sugar", "vegetables") → "Groceries"
      - Do NOT use "unknown" as a category. Always assign a meaningful category or create a new one.
      - If you can't parse the receipt, set error to a descriptive message.`;

      const imagePart = {
        inlineData: {
          data: base64Image,
          mimeType,
        },
      };

      const response = await this.model.generateContent([prompt, imagePart]);

      const content = response.response.text();
      if (!content) {
        throw new Error('Gemini returned null content');
      }

      const parsedContent = JSON.parse(content);

      if (!parsedContent.receipt || !parsedContent.receipt.merchant) {
        return {
          receipt: null,
          error: 'Failed to parse receipt details from image',
        };
      }

      
      for (const expense of parsedContent.receipt.expenses_attributes) {
        const categoryExists = categories.some((cat) => cat.name === expense.category);
        if (!categoryExists) {
          await this.categoriesService.createCategory({ name: expense.category });
        }
      }

      return parsedContent;
    } catch (error) {
      console.error('Error parsing receipt from image:', error);
      return {
        receipt: null,
        error: error.message || 'Failed to parse receipt image',
      };
    }
  }
}