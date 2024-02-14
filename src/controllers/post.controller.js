import { Post } from '../models/post.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { isValidObjectId } from 'mongoose';

/**
 * Retrieves all posts based on provided query parameters.
 */
const getAllPosts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, author } = req.query;

  // Build the query conditions based on the parameters
  const conditions = {};

  if (query) {
    conditions.title = new RegExp(query, 'i');
  }

  if (author) {
    if (!isValidObjectId(author)) {
      throw new ApiError(400, 'Invalid author format.');
    }
    conditions.author = author;
  }

  // Build the sort options
  const sortOptions = {};
  if (sortBy && sortType) {
    sortOptions[sortBy] = sortType === 'desc' ? -1 : 1;
  }

  // Calculate skip value for pagination
  const skip = (page - 1) * limit;

  // Fetch posts
  const posts = await Post.find(conditions)
    .sort(sortOptions)
    .skip(skip)
    .limit(limit);

  // Get the total count of posts (useful for pagination)
  const postsCount = await Post.countDocuments(conditions);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        posts,
        totalPages: Math.ceil(postsCount / limit),
      },
      'Posts fetched successfully.'
    )
  );
});

/**
 * Creates a new post with provided title and content.
 */
const createPost = asyncHandler(async (req, res) => {
  const { title, content } = req.body;

  // Validate required fields (title and content)
  if (!title || !content) {
    throw new ApiError(400, 'All field are required!');
  }

  // Create a new Post record
  const post = await Post.create({
    title,
    content,
  });

  // Retrieve the published post from the database
  const publishedPost = await Post.findById(post._id);

  if (!publishedPost) {
    throw new ApiError(500, 'Something went wrong while publishing post.');
  }

  // Respond with a success status and the published post details
  return res
    .status(201)
    .json(new ApiResponse(200, publishedPost, 'Post published successfully.'));
});

/**
 * Retrieves a post by its ID.
 */
const getPostById = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  if (!postId?.trim() || !isValidObjectId(postId)) {
    throw new ApiError(400, 'postId missing or invalid postId format.');
  }

  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(500, 'Post not found.');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, post, 'Post fetched by id successfully.'));
});

/**
 * Updates an existing post.
 */
const updatePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  if (!postId?.trim() || !isValidObjectId(postId)) {
    throw new ApiError(400, 'postId missing or invalid postId format.');
  }

  const { title, content } = req.body;
  if (!title || !content) {
    throw new ApiError(400, 'All fields are required.');
  }

  const post = await Post.findByIdAndUpdate(
    postId,
    {
      $set: {
        title,
        content,
      },
    },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, post, 'Post updated successfully.'));
});

/**
 * Deletes a post by its ID.
 */
const deletePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  if (!postId?.trim() || !isValidObjectId(postId)) {
    throw new ApiError(400, 'postId missing or invalid postId format.');
  }

  const post = await Post.findByIdAndDelete(postId);

  if (!post) {
    throw new ApiError(500, 'Post not found.');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Post deleted successfully.'));
});

export { getAllPosts, getPostById, createPost, updatePost, deletePost };
