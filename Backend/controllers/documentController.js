// @desc    Upload PDF document
// @route   POST /api/documents/upload
// @access  Private

import Document from "../models/Document.js";
import Flashcard from "../models/Flashcard.js";
import Quiz from "../models/Quiz.js";
import { extractTextFromPDF } from "../utils/pdfParser.js";
import { chunkText } from "../utils/textChunker.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadPath = process.env.UPLOAD_PATH || path.join(__dirname, "../uploads");

export const uploadDocument = async (req, res, next) => {
  console.log("Upload request received");
  console.log("req.file:", req.file);
  console.log("req.body:", req.body);
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "Please upload a PDF file",
        statusCode: 400
      });
    }

    const { title } = req.body;

    if (!title) {
      await fs.unlink(req.file.path);
      return res.status(400).json({
        success: false,
        error: "Please provide a document title",
        statusCode: 400
      });
    }

    // Upload to Cloudinary
    console.log("Uploading to Cloudinary...");
    const cloudinaryResponse = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "raw", // Needed for PDFs
      folder: "ignitia/documents",
    });
    console.log("Cloudinary Upload Success:", cloudinaryResponse.secure_url);

    const fileUrl = cloudinaryResponse.secure_url;

    const document = await Document.create({
      userId: req.user._id,
      title,
      fileName: req.file.originalname,
      filePath: fileUrl,
      fileSize: req.file.size,
      status: "processing"
    });

    processPDF(document._id, req.file.path).catch(err => {
      console.error("PDF processing error:", err);
    });

    res.status(201).json({
      success: true,
      data: document,
      message: "Document uploaded successfully, Processing in progress..."
    });
  } catch (error) {
    if (req.file) {
      await fs.unlink(req.file.path).catch(() => { });
    }
    next(error);
  }
};

// Helper function to process PDF
const processPDF = async (documentId, filePath) => {
  try {
    const { text } = await extractTextFromPDF(filePath);
    const chunks = chunkText(text, 500, 50);

    await Document.findByIdAndUpdate(documentId, {
      extractedText: text,
      chunks: chunks,
      status: "ready"
    });

    console.log(`Document ${documentId} processed successfully`);
  } catch (error) {
    console.error(`Error processing document ${documentId}:`, error);

    await Document.findByIdAndUpdate(documentId, {
      status: "failed"
    });
  } finally {
    // Delete local temporary file
    await fs.unlink(filePath).catch((err) => {
      console.warn(`[Cleanup] Failed to delete local temp file: ${filePath}`, err.message);
     });
  }
};

// @desc    Get all user documents
// @route   GET /api/documents
// @access  Private
export const getDocuments = async (req, res, next) => {
  try {
    const documents = await Document.aggregate([
      {
        $match: { userId: new mongoose.Types.ObjectId(req.user._id) }
      },
      {
        $lookup: {
          from: "flashcards",
          localField: "_id",
          foreignField: "documentId",
          as: "flashcardSets"
        }
      },
      {
        $lookup: {
          from: "quizzes",
          localField: "_id",
          foreignField: "documentId",
          as: "quizzes"
        }
      },
      {
        $addFields: {
          flashcardCount: { $size: "$flashcardSets" },
          quizCount: { $size: "$quizzes" }
        }
      },
      {
        $project: {
          extractedText: 0,
          chunks: 0,
          flashcardSets: 0,
          quizzes: 0
        }
      },
      {
        $sort: { uploadDate: -1 }
      }
    ]);

    res.status(200).json({
      success: true,
      count: documents.length,
      data: documents
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single document with chunks
// @route   GET /api/documents/:id
// @access  Private
export const getDocument = async (req, res, next) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        error: "Document not found",
        statusCode: 404
      });
    }

    const flashcardCount = await Flashcard.countDocuments({
      documentId: document._id,
      userId: req.user._id
    });
    const quizCount = await Quiz.countDocuments({
      documentId: document._id,
      userId: req.user._id
    });

    document.lastAccessed = Date.now();
    await document.save();

    const documentData = document.toObject();
    documentData.flashcardCount = flashcardCount;
    documentData.quizCount = quizCount;

    res.status(200).json({
      success: true,
      data: documentData
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete document
// @route   DELETE /api/documents/:id
// @access  Private
export const deleteDocument = async (req, res, next) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        error: "Document not found",
        statusCode: 404
      });
    }

    if (document.filePath) {
      // document.filePath is expected to be "/uploads/documents/filename.pdf"
      // We need to resolve this to the actual filesystem path.
      // Since express handles "/uploads", we remove that prefix and join with uploadPath.
      const relativePath = document.filePath.replace(/^\/uploads/, '');
      const fullPath = path.join(uploadPath, relativePath);
      await fs.unlink(fullPath).catch((err) => { 
        console.warn(`[Cleanup] Failed to delete file: ${fullPath}`, err.message);
      });
    }
    
    await document.deleteOne();

    res.status(200).json({
      success: true,
      message: "Document deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};